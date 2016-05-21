
/**
 * render.js 
 * 
 * Stará se o vykreslování, cachování a preload oblastí scény 
 * 
 */
namespace Lich {

    class MapUpdateRegion {

        cooldown = 0;
        prepared = false;
        fromX = -1;
        toX = -1;
        fromY = -1;
        toY = -1;

        constructor() {
            this.reset();
        }

        reset() {
            this.cooldown = 0;
            this.prepared = false;
            this.fromX = -1;
            this.toX = -1;
            this.fromY = -1;
            this.toY = -1;
        }
    }

    export class Render {

        /**
         * STATIC
         */

        // Velikost sektoru v dílcích
        static SECTOR_SIZE = 10;
        // kolik překreslení se po změně nebude cachovat, protože 
        // je dost pravděpodobné, že se bude ještě měnit?
        static SECTOR_CACHE_COOLDOWN = 5;
        // Počet okrajových sektorů, které nejsou zobrazeny,
        // ale jsou alokovány (pro plynulé posuny)
        static BUFFER_SECTORS_X = 1;
        static BUFFER_SECTORS_Y = 1;

        static MAP_SIDE = 200;

        static MINIMAP_COOLDOWN = 30;

        /**
         * VAR
         */

        onDigObjectListeners = [];

        screenOffsetX = 0;
        screenOffsetY = 0;

        // souřadnice aktuálního sektorového "okna"
        currentStartSecX = null;
        currentStartSecY = null;
        sectorsToUpdate = [];
        // Kontejner na sektory
        sectorsCont;
        // Mapa sektorů
        sectorsMap = [];
        // Mapa dílků
        tilesMap;
        // Globální mapa dílků
        sceneTilesMap = [];
        // Globální mapa objektů
        sceneObjectsMap = [];

        minimap;
        playerIcon;

        mapUpdateRegion = new MapUpdateRegion();

        constructor(public game, public map, public world) {

            this.tilesMap = map.tilesMap;

            this.mapUpdateRegion.reset();

            // vytvoř kontejner pro sektory
            this.sectorsCont = new createjs.Container();
            world.addChild(this.sectorsCont);
            this.sectorsCont.x = 0;
            this.sectorsCont.y = 0;
            this.sectorsCont.width = game.canvas.width;
            this.sectorsCont.height = game.canvas.height;

            // vytvoř sektory dle aktuálního záběru obrazovky
            this.updateSectors();

            // Mapa
            this.createMinimap();
        }

        // zkoumá, zda je potřeba přealokovat sektory 
        updateSectors() {

            var maxSecCountX = Math.ceil(this.tilesMap.width / Render.SECTOR_SIZE);
            var maxSecCountY = Math.ceil(this.tilesMap.height / Render.SECTOR_SIZE);

            var startSecX = 0;
            if (this.screenOffsetX < 0) {
                startSecX = Math.floor(-1 * this.screenOffsetX / (Render.SECTOR_SIZE * Resources.TILE_SIZE));
                startSecX = startSecX >= Render.BUFFER_SECTORS_X ? startSecX - Render.BUFFER_SECTORS_X : startSecX;
            }
            var countSectX = Math.floor(this.sectorsCont.width / (Render.SECTOR_SIZE * Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_X + 1;

            var startSecY = 0;
            if (this.screenOffsetY < 0) {
                startSecY = Math.floor(-1 * this.screenOffsetY / (Render.SECTOR_SIZE * Resources.TILE_SIZE));
                startSecY = startSecY >= Render.BUFFER_SECTORS_Y ? startSecY - Render.BUFFER_SECTORS_Y : startSecY;
            }
            var countSectY = Math.floor(this.sectorsCont.height / (Render.SECTOR_SIZE * Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_Y + 1;

            // změnilo se něco? Pokud není potřeba pře-alokovávat sektory, ukonči fci
            if (this.currentStartSecX === startSecX && this.currentStartSecY === startSecY)
                return;

            // změnit stavy
            this.currentStartSecX = startSecX;
            this.currentStartSecY = startSecY;

            // projdi sektory, nepoužité dealokuj, nové naplň
            for (var x = 0; x < maxSecCountX; x++) {
                for (var y = 0; y < maxSecCountY; y++) {

                    var secCol = this.sectorsMap[x];
                    if (typeof secCol === "undefined") {
                        secCol = [];
                        this.sectorsMap[x] = secCol;
                    }

                    var mapCol;

                    if (x >= startSecX && x <= startSecX + countSectX && y >= startSecY && y <= startSecY + countSectY) {
                        // jde o platný sektor 
                        // pokud ještě není alokován tak alokuj
                        if (typeof secCol[y] === "undefined" || secCol[y] === null) {

                            var sector = new Sector();
                            sector.secId = y * maxSecCountX + x;
                            this.sectorsCont.addChild(sector);
                            sector.map_x = x;
                            sector.map_y = y;
                            sector.x = x * Render.SECTOR_SIZE * Resources.TILE_SIZE + this.screenOffsetX;
                            sector.y = y * Render.SECTOR_SIZE * Resources.TILE_SIZE + this.screenOffsetY;
                            sector.width = Render.SECTOR_SIZE * Resources.TILE_SIZE;
                            sector.height = Render.SECTOR_SIZE * Resources.TILE_SIZE;
                            secCol[y] = sector;

                            // vytvoř jednotlivé dílky
                            for (var mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (var my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {

                                    // vytvoř na dané souřadnici dílky povrchu
                                    var tileElement = this.tilesMap.valueAt(mx, my);
                                    if (tileElement > 0) {
                                        // vytvoř dílek
                                        var tile = this.createTile(tileElement);

                                        // přidej dílek do sektoru
                                        sector.addChild(tile);
                                        tile.x = (mx % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                        tile.y = (my % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                                        // přidej dílek do globální mapy
                                        Utils.set2D(this.sceneTilesMap, mx, my, tile);
                                    }

                                    // vytvoř na dané souřadnici dílky objektů
                                    var objectElement = Utils.get2D(this.tilesMap.objectsMap, mx, my);
                                    if (objectElement !== null) {
                                        // Sheet index dílku objektu
                                        var object = this.createObject(objectElement.sheetIndex);

                                        // přidej dílek do sektoru
                                        sector.addChild(object);
                                        object.x = (mx % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                        object.y = (my % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                                        // Přidej objekt do globální mapy objektů
                                        Utils.set2D(this.sceneObjectsMap, mx, my, object);
                                    }
                                }
                            }

                            // debug
                            if (Resources.SHOW_SECTORS) {
                                var testShape = new createjs.Shape();
                                testShape.graphics.setStrokeStyle(1);
                                testShape.graphics.beginStroke("#f00");
                                testShape.graphics.drawRect(0, 0, sector.width, sector.height);
                                sector.addChild(testShape);
                            }

                            // proveď cache na sektoru
                            sector.cache(0, 0, sector.width, sector.height);

                            if (Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Alokován sektor: " + x + ":" + y);
                            }
                        }

                    } else {
                        // neplatný sektor
                        // pokud je obsazeno dealokuj
                        if (typeof secCol[y] !== "undefined" && secCol[y] !== null) {

                            // vymaž jednotlivé dílky
                            for (var mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (var my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {
                                    // stavěním mohl přibýt dílek někam, kde předtím nebyl, proto
                                    // je potřeba i při mazání kontrolovat existenci sloupce
                                    mapCol = this.sceneObjectsMap[mx];
                                    if (typeof mapCol === "undefined") {
                                        mapCol = [];
                                        this.sceneObjectsMap[mx] = mapCol;
                                    }
                                    mapCol[my] = null;
                                }
                            }

                            // TODO vymaž objekty

                            // vymaž sektor
                            secCol[y].removeAllChildren();
                            this.sectorsCont.removeChild(secCol[y]);
                            secCol[y] = null;

                            if (Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Dealokován sektor: " + x + ":" + y);
                            }

                        }
                    }

                }
            }

        }

        prepareMapUpdate(x, y) {
            this.mapUpdateRegion.prepared = true;

            if (x < this.mapUpdateRegion.fromX || this.mapUpdateRegion.fromX === -1)
                this.mapUpdateRegion.fromX = x;
            if (x > this.mapUpdateRegion.toX || this.mapUpdateRegion.toX === -1)
                this.mapUpdateRegion.toX = x;
            if (y < this.mapUpdateRegion.fromY || this.mapUpdateRegion.fromY === -1)
                this.mapUpdateRegion.fromY = y;
            if (y > this.mapUpdateRegion.toY || this.mapUpdateRegion.toY === -1)
                this.mapUpdateRegion.toY = y;

        }

        createTile(v) {
            var tile = this.game.resources.getBitmap(Resources.TILES_KEY);
            var tileCols = tile.image.width / Resources.TILE_SIZE;
            // Otestováno: tohle je rychlejší než extract ze Spritesheet
            tile.sourceRect = {
                x: ((v - 1) % tileCols) * Resources.TILE_SIZE,
                y: Math.floor((v - 1) / tileCols) * Resources.TILE_SIZE,
                height: Resources.TILE_SIZE,
                width: Resources.TILE_SIZE
            };
            return tile;
        }

        createObject(v) {
            var object = this.game.resources.getBitmap(Resources.PARTS_KEY);
            // Otestováno: tohle je rychlejší než extract ze Spritesheet
            object.sourceRect = {
                x: (v % Resources.PARTS_SHEET_WIDTH) * Resources.TILE_SIZE,
                y: Math.floor(v / Resources.PARTS_SHEET_WIDTH) * Resources.TILE_SIZE,
                height: Resources.TILE_SIZE,
                width: Resources.TILE_SIZE
            };
            return object;
        }

        shiftSectors(dstX, dstY) {
            this.screenOffsetX += dstX;
            this.screenOffsetY += dstY;
            this.sectorsCont.children.forEach(function(sector) {
                sector.x += dstX;
                sector.y += dstY;
            });
            this.updateSectors();
        }

        updateMinimapPosition() {
            var x = Math.floor(-1 * this.screenOffsetX / Resources.TILE_SIZE);
            var y = Math.floor(-1 * this.screenOffsetY / Resources.TILE_SIZE);

            this.minimap.bitmap.sourceRect = {
                x: x,
                y: y,
                height: Render.MAP_SIDE,
                width: Render.MAP_SIDE
            };
        }

        drawMinimapTile(imgData, x, y) {
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;

            var item = this.tilesMap.valueAt(x, y);
            if (item === Resources.VOID) {
                imgData.data[imgData.counter++] = 209; // R
                imgData.data[imgData.counter++] = 251; // G
                imgData.data[imgData.counter++] = 255; // B
                imgData.data[imgData.counter++] = 200; // A
            }
            for (var i = 1; i <= 9; i++) {
                if (item === Resources.DIRT["M" + i]) {
                    imgData.data[imgData.counter++] = 156; // R
                    imgData.data[imgData.counter++] = 108; // G
                    imgData.data[imgData.counter++] = 36; // B
                    imgData.data[imgData.counter++] = 200; // A
                }
            }
            if (item === Resources.DIRT.B ||
                item === Resources.DIRT.L ||
                item === Resources.DIRT.R ||
                item === Resources.DIRT.T ||
                item === Resources.DIRT.BL ||
                item === Resources.DIRT.BR ||
                item === Resources.DIRT.TL ||
                item === Resources.DIRT.TR ||
                item === Resources.DIRT.I_BL ||
                item === Resources.DIRT.I_BR ||
                item === Resources.DIRT.I_TL ||
                item === Resources.DIRT.I_TR
            ) {
                imgData.data[imgData.counter++] = 102; // R
                imgData.data[imgData.counter++] = 174; // G 
                imgData.data[imgData.counter++] = 0; // B
                imgData.data[imgData.counter++] = 200; // A
            }
        };

        updateMinimap(mapUpdateRegion) {

            if (mapUpdateRegion.prepared === false) {
                return;
            }
            if (mapUpdateRegion.cooldown < Render.MINIMAP_COOLDOWN) {
                mapUpdateRegion.cooldown++;
                return;
            }

            mapUpdateRegion.cooldown = 0;

            var x0 = mapUpdateRegion.fromX;
            var y0 = mapUpdateRegion.fromY;
            var w = mapUpdateRegion.toX - mapUpdateRegion.fromX + 1;
            var h = mapUpdateRegion.toY - mapUpdateRegion.fromY + 1;

            var ctx = this.minimap.canvas.getContext("2d");
            var imgData = ctx.createImageData(w, h); // width x height

            (function() {
                for (var y = y0; y <= mapUpdateRegion.toY; y++) {
                    for (var x = x0; x <= mapUpdateRegion.toX; x++) {
                        this.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, x0, y0);
            })();

            //minimap.cont.removeChild(minimap.bitmap);
            var dataURL = this.minimap.canvas.toDataURL();
            this.minimap.bitmap.image = new createjs.Bitmap(dataURL).image;
            //minimap.cont.addChild(minimap.bitmap);

            mapUpdateRegion.reset();

            this.updateMinimapPosition();
        }

        initMinimap() {
            var ctx = this.minimap.canvas.getContext("2d");
            var imgData = ctx.createImageData(this.tilesMap.width, this.tilesMap.height); // width x height

            (function() {
                for (var y = 0; y < this.tilesMap.height; y++) {
                    for (var x = 0; x < this.tilesMap.width; x++) {
                        this.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            })();

            var dataURL = this.minimap.canvas.toDataURL();
            this.minimap.bitmap = new createjs.Bitmap(dataURL);
            this.minimap.cont.addChild(this.minimap.bitmap);

            this.updateMinimapPosition();
        }

        createMinimap() {

            this.minimap = {};

            var canvas = <HTMLCanvasElement>document.getElementById("mapCanvas");
            this.minimap.canvas = canvas;
            canvas.width = this.tilesMap.width;
            canvas.height = this.tilesMap.height;
            canvas.style.backgroundColor = "#eee";

            var minimapCont = new createjs.Container();
            this.minimap.cont = minimapCont;
            minimapCont.width = Render.MAP_SIDE + 2;
            minimapCont.height = Render.MAP_SIDE + 2;
            minimapCont.x = this.sectorsCont.width - Render.MAP_SIDE - 20;
            minimapCont.y = 20;
            this.world.addChild(minimapCont);

            var border = new createjs.Shape();
            border.graphics.setStrokeStyle(1);
            border.graphics.beginStroke("rgba(0,0,0,255)");
            border.graphics.beginFill("rgba(209,251,255,255)");
            border.graphics.drawRect(-1, -1, Render.MAP_SIDE + 2, Render.MAP_SIDE + 2);
            minimapCont.addChild(border);

            this.initMinimap();

            this.playerIcon = this.game.resources.getBitmap(Resources.PLAYER_ICON_KEY);
            this.playerIcon.alpha = 0.7;
            this.minimap.cont.addChild(this.playerIcon);

        }

        markSector(sector) {
            if (typeof this.sectorsToUpdate[sector.secId] === "undefined") {
                this.sectorsToUpdate[sector.secId] = {
                    sector: sector,
                    cooldown: Render.SECTOR_CACHE_COOLDOWN
                };
            }
        };

        digGround(rx, ry) {
            var tilesToReset = [];

            (function() {
                for (var x = rx - 1; x <= rx + 2; x++) {
                    for (var y = ry - 1; y <= ry + 2; y++) {
                        var index = this.tilesMap.indexAt(x, y);
                        this.prepareMapUpdate(x, y);
                        if (index >= 0) {
                            var sector = this.getSectorByTiles(x, y);

                            // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                            if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {

                                // okraje vyresetuj
                                if (this.tilesMap.map[index] !== Resources.VOID) {
                                    this.tilesMap.map[index] = Resources.DIRT.M1;
                                    tilesToReset.push([x, y]);

                                    // zjisti sektor dílku, aby byl přidán do fronty 
                                    // ke cache update (postačí to udělat dle tilesToReset,
                                    // protože to jsou okrajové dílky z oblasti změn)
                                    if (typeof sector !== "undefined" && sector !== null) {
                                        this.markSector(sector);
                                    }
                                }

                            }
                            // pokud jsem vnitřní část výběru, zkontroluj, 
                            // že jsem neustřelil povrch pod usazeným objektem
                            // a vytvoř díru po kopání
                            else {

                                // pokud jsem horní díl, pak zkus odkopnout i objekty, které na dílu stojí
                                if (y === ry &&
                                    (this.tilesMap.map[index] === Resources.DIRT.T ||
                                        this.tilesMap.map[index] === Resources.DIRT.TL ||
                                        this.tilesMap.map[index] === Resources.DIRT.TR)) {
                                    this.tryDigObject(x, y - 1);
                                }

                                this.tilesMap.map[index] = Resources.VOID;
                                var targetSector = this.getSectorByTiles(x, y);
                                if (typeof targetSector !== "undefined" && targetSector !== null) {
                                    targetSector.removeChild(Utils.get2D(this.sceneTilesMap, x, y));
                                }

                                // zjisti sektor dílku, aby byl přidán do fronty 
                                // ke cache update (postačí to udělat dle tilesToReset,
                                // protože to jsou okrajové dílky z oblasti změn)
                                if (typeof sector !== "undefined" && sector !== null) {
                                    this.markSector(sector);
                                }
                            }
                        }
                    }
                }
            })();


            // Přegeneruj hrany
            (function() {
                tilesToReset.forEach(function(item) {
                    var x = item[0];
                    var y = item[1];
                    this.map.generateEdge(this.tilesMap, x, y);
                });
            })();

            // Přegeneruj rohy
            (function() {
                tilesToReset.forEach(function(item) {
                    var x = item[0];
                    var y = item[1];
                    this.map.generateCorner(this.tilesMap, x, y);
                });
            })();

            // Překresli dílky
            (function() {
                tilesToReset.forEach(function(item) {
                    var x = item[0];
                    var y = item[1];
                    // pokud už je alokován dílek na obrazovce, rovnou ho uprav
                    var tile = Utils.get2D(this.sceneTilesMap, x, y);
                    if (tile !== null) {
                        var v = this.tilesMap.valueAt(x, y);
                        var tileCols = tile.image.width / Resources.TILE_SIZE;
                        tile.sourceRect = {
                            x: ((v - 1) % tileCols) * Resources.TILE_SIZE,
                            y: Math.floor((v - 1) / tileCols) * Resources.TILE_SIZE,
                            height: Resources.TILE_SIZE,
                            width: Resources.TILE_SIZE
                        };
                    }
                });
            })();

        }

        tryDigObject(rx, ry) {
            var objectElement = Utils.get2D(this.tilesMap.objectsMap, rx, ry);
            if (objectElement !== null) {
                var objType = Resources.dirtObjects[objectElement.mapKey];
                var objWidth = objType.mapSpriteWidth;
                var objHeight = objType.mapSpriteHeight;
                // relativní pozice dílku v sheetu (od počátku sprite)
                var posx = objectElement.objTileX;
                var posy = objectElement.objTileY;

                this.onDigObjectListeners.forEach(function(fce) {
                    fce(objType, rx, ry);
                });

                // projdi všechny okolní dílky, které patří danému objektu
                for (var x = 0; x < objWidth; x++) {
                    for (var y = 0; y < objHeight; y++) {

                        // globální souřadnice dílku v mapě
                        var globalX = rx - posx + x;
                        var globalY = ry - posy + y;

                        // odstraň dílek objektu ze sektoru
                        var object = Utils.get2D(this.sceneObjectsMap, globalX, globalY);
                        this.markSector(object.parent);
                        object.parent.removeChild(object);

                        // odstraň dílke objektu z map
                        Utils.set2D(this.tilesMap.objectsMap, globalX, globalY, null);
                        Utils.set2D(this.sceneObjectsMap, globalX, globalY, null);

                    }
                }
            }
        }

        place(x, y, item) {

            var coord = this.pixelsToTiles(x, y);
            var rx = Utils.even(coord.x);
            var ry = Utils.even(coord.y);

            // pokud je místo prázdné a bez objektu (a je co vkládat
            if (item !== null && this.tilesMap.valueAt(rx, ry) === Resources.VOID && Utils.get2D(this.tilesMap.objectsMap, rx, ry) === null) {
                // TODO je potřeba vyřešit jak provázat objekty z mapy na objekty v inventáři a zpět
                // ukázkový problém je strom, který se stává dřevem, které se zpátky nedá umístit jako 
                // strom, ale jako dřevěná stěna
                var object = Resources.dirtObjects[2];
                if (typeof object !== "undefined") {
                    this.map.placeObject(rx, ry, object);
                    // TODO ... tohle nestačí
                    this.createObject(object.objIndex);
                    return true;
                }
            }
            return false;
        }

        dig(x, y) {

            var coord = this.pixelsToTiles(x, y);
            var rx = Utils.even(coord.x);
            var ry = Utils.even(coord.y);

            // kopl jsem do nějakého povrchu?
            if (this.tilesMap.valueAt(rx, ry) !== Resources.VOID) {
                this.digGround(rx, ry);
                return true;
            } else {
                // kopl jsem do objektu?
                this.tryDigObject(rx, ry);
                return false;
            }
        }

        shiftX(dst) {
            this.shiftSectors(dst, 0);
            this.updateMinimapPosition();
        }

        shiftY(dst) {
            this.shiftSectors(0, dst);
            this.updateMinimapPosition();
        }

        handleTick() {
            for (var i = 0; i < this.sectorsToUpdate.length; i++) {
                var item = this.sectorsToUpdate.pop();
                if (typeof item !== "undefined") {
                    item.sector.updateCache();
                }
            }

            this.updateMinimap(this.mapUpdateRegion);
        }

        addOnDigObjectListener(f) {
            this.onDigObjectListeners.push(f);
        }

        updatePlayerIcon(x, y) {
            if (typeof this.playerIcon !== "undefined") {
                this.playerIcon.x = Math.floor(x / Resources.TILE_SIZE) - (this.playerIcon.image.width / 2);
                this.playerIcon.y = Math.floor(y / Resources.TILE_SIZE) - (this.playerIcon.image.height / 2);
            }
        }

        pixelsToTiles(x, y) {
            var tileX = Math.ceil((x - this.screenOffsetX) / Resources.TILE_SIZE) - 1;
            var tileY = Math.ceil((y - this.screenOffsetY) / Resources.TILE_SIZE) - 1;
            return {
                x: tileX,
                y: tileY
            };
        }

        tilesToPixel(x, y) {
            var screenX = x * Resources.TILE_SIZE + this.screenOffsetX;
            var screenY = y * Resources.TILE_SIZE + this.screenOffsetY;
            return {
                x: screenX,
                y: screenY
            };
        }

        // dle souřadnic tiles spočítá souřadnici sektoru
        getSectorByTiles(x, y) {
            var sx = Math.floor(x / Render.SECTOR_SIZE);
            var sy = Math.floor(y / Render.SECTOR_SIZE);
            return Utils.get2D(this.sectorsMap, sx, sy);
        }
    }
}