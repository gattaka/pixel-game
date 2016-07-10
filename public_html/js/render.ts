
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

    class SectorUpdateRequest {
        constructor(public sector: Sector, public cooldown: number) { }
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

        onDigObjectListeners = new Array<(objType: Diggable, x: number, y: number) => any>();
        onDigSurfaceListeners = new Array<(objType: Diggable, x: number, y: number) => any>();

        screenOffsetX = 0;
        screenOffsetY = 0;

        // souřadnice aktuálního sektorového "okna"
        currentStartSecX = null;
        currentStartSecY = null;
        sectorsToUpdate = new Array<SectorUpdateRequest>();
        // Kontejner na sektory
        sectorsCont: createjs.Container;
        // Mapa sektorů
        sectorsMap = new Array2D<Sector>();
        // Mapa dílků
        tilesMap: TilesMap;
        // Globální mapa dílků
        sceneTilesMap = new Array2D<createjs.Bitmap>();
        sceneBgrTilesMap = new Array2D<createjs.Bitmap>();
        // Globální mapa objektů
        sceneObjectsMap = new Array2D<createjs.Bitmap>();

        minimap;
        playerIcon;

        mapUpdateRegion = new MapUpdateRegion();

        constructor(public game: Game, public map: Map, public world: World) {
            var self = this;
            self.tilesMap = map.tilesMap;

            self.mapUpdateRegion.reset();

            // vytvoř kontejner pro sektory
            self.sectorsCont = new createjs.Container();
            world.addChild(self.sectorsCont);
            self.sectorsCont.x = 0;
            self.sectorsCont.y = 0;
            self.sectorsCont.width = game.canvas.width;
            self.sectorsCont.height = game.canvas.height;

            // vytvoř sektory dle aktuálního záběru obrazovky
            self.updateSectors();

            // Mapa
            self.createMinimap();
        }

        // zkoumá, zda je potřeba přealokovat sektory 
        updateSectors() {
            var self = this;
            var maxSecCountX = Math.ceil(self.tilesMap.width / Render.SECTOR_SIZE);
            var maxSecCountY = Math.ceil(self.tilesMap.height / Render.SECTOR_SIZE);

            var startSecX = 0;
            if (self.screenOffsetX < 0) {
                startSecX = Math.floor(-1 * self.screenOffsetX / (Render.SECTOR_SIZE * Resources.TILE_SIZE));
                startSecX = startSecX >= Render.BUFFER_SECTORS_X ? startSecX - Render.BUFFER_SECTORS_X : startSecX;
            }
            var countSectX = Math.floor(self.sectorsCont.width / (Render.SECTOR_SIZE * Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_X + 1;

            var startSecY = 0;
            if (self.screenOffsetY < 0) {
                startSecY = Math.floor(-1 * self.screenOffsetY / (Render.SECTOR_SIZE * Resources.TILE_SIZE));
                startSecY = startSecY >= Render.BUFFER_SECTORS_Y ? startSecY - Render.BUFFER_SECTORS_Y : startSecY;
            }
            var countSectY = Math.floor(self.sectorsCont.height / (Render.SECTOR_SIZE * Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_Y + 1;

            // změnilo se něco? Pokud není potřeba pře-alokovávat sektory, ukonči fci
            if (self.currentStartSecX === startSecX && self.currentStartSecY === startSecY)
                return;

            // změnit stavy
            self.currentStartSecX = startSecX;
            self.currentStartSecY = startSecY;

            // projdi sektory, nepoužité dealokuj, nové naplň
            for (var x = 0; x < maxSecCountX; x++) {
                for (var y = 0; y < maxSecCountY; y++) {

                    if (x >= startSecX && x <= startSecX + countSectX && y >= startSecY && y <= startSecY + countSectY) {
                        // jde o platný sektor 
                        // pokud ještě není alokován tak alokuj
                        if (self.sectorsMap.getValue(x, y) == null) {

                            var sector = new Sector(
                                y * maxSecCountX + x,
                                x,
                                y,
                                Render.SECTOR_SIZE * Resources.TILE_SIZE,
                                Render.SECTOR_SIZE * Resources.TILE_SIZE
                            );
                            sector.x = x * Render.SECTOR_SIZE * Resources.TILE_SIZE + self.screenOffsetX;
                            sector.y = y * Render.SECTOR_SIZE * Resources.TILE_SIZE + self.screenOffsetY;
                            self.sectorsCont.addChild(sector);
                            self.sectorsMap.setValue(x, y, sector);

                            // vytvoř jednotlivé dílky
                            for (var mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (var my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {

                                    // vytvoř na dané souřadnici dílky pozadí povrchu
                                    var bgrElement = self.tilesMap.mapBgrRecord.getValue(mx, my);
                                    if (bgrElement > 0) {
                                        // vytvoř dílek
                                        var tile = self.createBgrTile(bgrElement);

                                        // přidej dílek do sektoru
                                        sector.addCachableChild(tile);
                                        tile.x = (mx % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                        tile.y = (my % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                                        // přidej dílek do globální mapy
                                        self.sceneBgrTilesMap.setValue(mx, my, tile);
                                    }

                                    // vytvoř na dané souřadnici dílky povrchu
                                    var tileElement = self.tilesMap.mapRecord.getValue(mx, my);
                                    if (tileElement > 0) {
                                        // vytvoř dílek
                                        var tile = self.createTile(tileElement);

                                        // přidej dílek do sektoru
                                        sector.addCachableChild(tile);
                                        tile.x = (mx % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                        tile.y = (my % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                                        // přidej dílek do globální mapy
                                        self.sceneTilesMap.setValue(mx, my, tile);
                                    }

                                    // vytvoř na dané souřadnici dílky objektů
                                    var objectElement = self.tilesMap.mapObjectsTiles.getValue(mx, my);
                                    if (objectElement !== null) {
                                        // Sheet index dílku objektu
                                        var object = self.createObject(objectElement);

                                        // přidej dílek do sektoru
                                        if (object instanceof createjs.Sprite) {
                                            sector.addAnimatedChild(object);
                                        } else {
                                            sector.addCachableChild(object);
                                        }
                                        object.x = (mx % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                        object.y = (my % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                                        // Přidej objekt do globální mapy objektů
                                        self.sceneObjectsMap.setValue(mx, my, object);
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
                        if (self.sectorsMap.getValue(x, y) != null) {

                            // vymaž jednotlivé dílky
                            for (var mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (var my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {
                                    // stavěním mohl přibýt dílek někam, kde předtím nebyl, proto
                                    // je potřeba i při mazání kontrolovat existenci sloupce
                                    self.sceneObjectsMap.setValue(mx, my, null);
                                }
                            }

                            // TODO vymaž objekty

                            // vymaž sektor
                            var ss = self.sectorsMap.getValue(x, y);
                            ss.removeAllChildren();
                            self.sectorsCont.removeChild(ss);
                            self.sectorsMap.setValue(x, y, null);

                            if (Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Dealokován sektor: " + x + ":" + y);
                            }

                        }
                    }

                }
            }

        }

        prepareMapUpdate(x, y) {
            var self = this;
            self.mapUpdateRegion.prepared = true;

            if (x < self.mapUpdateRegion.fromX || self.mapUpdateRegion.fromX === -1)
                self.mapUpdateRegion.fromX = x;
            if (x > self.mapUpdateRegion.toX || self.mapUpdateRegion.toX === -1)
                self.mapUpdateRegion.toX = x;
            if (y < self.mapUpdateRegion.fromY || self.mapUpdateRegion.fromY === -1)
                self.mapUpdateRegion.fromY = y;
            if (y > self.mapUpdateRegion.toY || self.mapUpdateRegion.toY === -1)
                self.mapUpdateRegion.toY = y;

        }

        setSurfaceBgrSourceRect(tile: createjs.Bitmap, positionIndex: number) {
            var v = Resources.INSTANCE.surfaceBgrIndex.getPosition(positionIndex);
            this.setSourceRect(tile, v);
        }

        setSurfaceSourceRect(tile: createjs.Bitmap, positionIndex: number) {
            var v = Resources.INSTANCE.surfaceIndex.getPosition(positionIndex);
            this.setSourceRect(tile, v);
        }

        setSourceRect(tile: createjs.Bitmap, v: number) {
            var tileCols = tile.image.width / Resources.TILE_SIZE;
            // Otestováno: tohle je rychlejší než extract ze Spritesheet
            tile.sourceRect = new createjs.Rectangle(
                ((v - 1) % tileCols) * Resources.TILE_SIZE,
                Math.floor((v - 1) / tileCols) * Resources.TILE_SIZE,
                Resources.TILE_SIZE,
                Resources.TILE_SIZE
            );
        }

        createBgrTile(positionIndex: number) {
            var self = this;
            var typ = Resources.INSTANCE.surfaceBgrIndex.getType(positionIndex);
            var tile = Resources.INSTANCE.getBitmap(typ);
            this.setSurfaceBgrSourceRect(tile, positionIndex);
            return tile;
        }

        createTile(positionIndex: number) {
            var self = this;
            var surfaceType = Resources.INSTANCE.surfaceIndex.getType(positionIndex);
            var tile = Resources.INSTANCE.getBitmap(surfaceType);
            this.setSurfaceSourceRect(tile, positionIndex);
            return tile;
        }

        createObject(objectTile: MapObjectTile) {
            var self = this;
            var objDef: MapObjDefinition = Resources.INSTANCE.mapObjectDefs[objectTile.mapKey];
            var object: any;
            if (objDef.frames > 1) {
                object = Resources.INSTANCE.getSpritePart(objDef.mapKey, objectTile.objTileX, objectTile.objTileY, objDef.frames, objDef.mapSpriteWidth, objDef.mapSpriteHeight);
                return object;
            } else {
                object = Resources.INSTANCE.getBitmap(objectTile.mapKey);
                // Otestováno: tohle je rychlejší než extract ze Spritesheet
                object.sourceRect = new createjs.Rectangle(
                    objectTile.objTileX * Resources.TILE_SIZE,
                    objectTile.objTileY * Resources.TILE_SIZE,
                    Resources.TILE_SIZE,
                    Resources.TILE_SIZE
                );
                return object;
            }
        }

        /**
         * Vrací, zda je možné scénu dále posouvat, nebo již jsem na jejím okraji
         */
        canShiftX(dst: number): boolean {
            var self = this;
            return self.screenOffsetX + dst <= 0 && self.screenOffsetX + dst >= -self.map.tilesMap.width * Resources.TILE_SIZE + self.game.canvas.width;
        }

        shiftSectorsX(dst: number) {
            var self = this;
            self.screenOffsetX += dst;
            self.sectorsCont.children.forEach(function(sector) {
                sector.x += dst;
            });
            self.updateSectors();
        }

        /**
         * Vrací, zda je možné scénu dále posouvat, nebo již jsem na jejím okraji
         */
        canShiftY(dst: number): boolean {
            var self = this;
            return self.screenOffsetY + dst <= 0 && self.screenOffsetY + dst >= -self.map.tilesMap.height * Resources.TILE_SIZE + self.game.canvas.height;
        }

        shiftSectorsY(dst: number) {
            var self = this;
            self.screenOffsetY += dst;
            self.sectorsCont.children.forEach(function(sector) {
                sector.y += dst;
            });
            self.updateSectors();
        }

        updateMinimapPosition() {
            var self = this;
            var x = Math.floor(-1 * self.screenOffsetX / Resources.TILE_SIZE);
            var y = Math.floor(-1 * self.screenOffsetY / Resources.TILE_SIZE);

            self.minimap.bitmap.sourceRect = {
                x: x,
                y: y,
                height: Render.MAP_SIDE,
                width: Render.MAP_SIDE
            };
        }

        drawMinimapTile(imgData, x: number, y: number) {
            var self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            var item = self.tilesMap.mapRecord.getValue(x, y);
            if (item === SurfaceIndex.VOID) {
                imgData.data[imgData.counter++] = 209; // R
                imgData.data[imgData.counter++] = 251; // G
                imgData.data[imgData.counter++] = 255; // B
                imgData.data[imgData.counter++] = 200; // A
            } else {
                if (Resources.INSTANCE.surfaceIndex.isMiddlePosition(item)) {
                    imgData.data[imgData.counter++] = 156; // R
                    imgData.data[imgData.counter++] = 108; // G
                    imgData.data[imgData.counter++] = 36; // B
                    imgData.data[imgData.counter++] = 200; // A
                } else {
                    imgData.data[imgData.counter++] = 102; // R
                    imgData.data[imgData.counter++] = 174; // G 
                    imgData.data[imgData.counter++] = 0; // B
                    imgData.data[imgData.counter++] = 200; // A
                }
            }
        };

        updateMinimap(mapUpdateRegion) {
            var self = this;
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

            var ctx = self.minimap.canvas.getContext("2d");
            var imgData = ctx.createImageData(w, h); // width x height

            (function() {
                for (var y = y0; y <= mapUpdateRegion.toY; y++) {
                    for (var x = x0; x <= mapUpdateRegion.toX; x++) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, x0, y0);
            })();

            //minimap.cont.removeChild(minimap.bitmap);
            var dataURL = self.minimap.canvas.toDataURL();
            self.minimap.bitmap.image = new createjs.Bitmap(dataURL).image;
            //minimap.cont.addChild(minimap.bitmap);

            mapUpdateRegion.reset();

            self.updateMinimapPosition();
        }

        initMinimap() {
            var self = this;
            var ctx = self.minimap.canvas.getContext("2d");
            var imgData = ctx.createImageData(self.tilesMap.width, self.tilesMap.height); // width x height

            (function() {
                for (var y = 0; y < self.tilesMap.height; y++) {
                    for (var x = 0; x < self.tilesMap.width; x++) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            })();

            var dataURL = self.minimap.canvas.toDataURL();
            self.minimap.bitmap = new createjs.Bitmap(dataURL);
            self.minimap.cont.addChild(self.minimap.bitmap);

            self.updateMinimapPosition();
        }

        createMinimap() {
            var self = this;
            self.minimap = {};

            var canvas = <HTMLCanvasElement>document.getElementById("mapCanvas");
            self.minimap.canvas = canvas;
            canvas.width = self.tilesMap.width;
            canvas.height = self.tilesMap.height;
            canvas.style.backgroundColor = "#eee";

            var minimapCont = new createjs.Container();
            self.minimap.cont = minimapCont;
            minimapCont.width = Render.MAP_SIDE + 2;
            minimapCont.height = Render.MAP_SIDE + 2;
            minimapCont.x = self.sectorsCont.width - Render.MAP_SIDE - 20;
            minimapCont.y = 20;
            self.world.addChild(minimapCont);

            var border = new createjs.Shape();
            border.graphics.setStrokeStyle(1);
            border.graphics.beginStroke("rgba(0,0,0,255)");
            border.graphics.beginFill("rgba(209,251,255,255)");
            border.graphics.drawRect(-1, -1, Render.MAP_SIDE + 2, Render.MAP_SIDE + 2);
            minimapCont.addChild(border);

            self.initMinimap();

            self.playerIcon = Resources.INSTANCE.getBitmap(Resources.PLAYER_ICON_KEY);
            self.playerIcon.alpha = 0.7;
            self.minimap.cont.addChild(self.playerIcon);

        }

        markSector(sector: Sector) {
            var self = this;
            if (typeof self.sectorsToUpdate[sector.secId] === "undefined") {
                self.sectorsToUpdate[sector.secId] = new SectorUpdateRequest(sector, Render.SECTOR_CACHE_COOLDOWN);
            }
        };

        digSurfaceBgr(rx, ry) {
            var self = this;

            var dugIndex = self.tilesMap.mapBgrRecord.getValue(rx, ry);
            if (dugIndex != null && dugIndex > -1) {
                var surfaceType = Resources.INSTANCE.surfaceBgrIndex.getType(dugIndex);
                var objType: Diggable = Resources.INSTANCE.mapSurfacesBgrDefs[surfaceType];

                self.onDigSurfaceListeners.forEach(function(fce) {
                    fce(objType, rx, ry);
                });

                (function() {
                    for (var x = rx; x <= rx + 1; x++) {
                        for (var y = ry; y <= ry + 1; y++) {
                            var val = self.tilesMap.mapBgrRecord.getValue(x, y);
                            self.prepareMapUpdate(x, y);
                            if (val != null) {
                                var sector = self.getSectorByTiles(x, y);
                                var srfcType = Resources.INSTANCE.surfaceBgrIndex.getType(val);
                                var indx = Resources.INSTANCE.surfaceBgrIndex;

                                self.tilesMap.mapBgrRecord.setValue(x, y, null);
                                var targetSector = self.getSectorByTiles(x, y);
                                if (typeof targetSector !== "undefined" && targetSector !== null) {
                                    var child = self.sceneBgrTilesMap.getValue(x, y);
                                    targetSector.removeBackgroundChild(child);
                                }

                                // zjisti sektor dílku, aby byl přidán do fronty 
                                // ke cache update (postačí to udělat dle tilesToReset,
                                // protože to jsou okrajové dílky z oblasti změn)
                                if (typeof sector !== "undefined" && sector !== null) {
                                    self.markSector(sector);
                                }
                            }
                        }
                    }
                })();
            }
        }

        digSurface(rx, ry) {
            var self = this;
            var tilesToReset = [];

            var dugIndex = self.tilesMap.mapRecord.getValue(rx, ry);
            if (dugIndex != null && dugIndex > -1) {
                var surfaceType = Resources.INSTANCE.surfaceIndex.getType(dugIndex);
                var objType: Diggable = Resources.INSTANCE.mapSurfaceDefs[surfaceType];

                self.onDigSurfaceListeners.forEach(function(fce) {
                    fce(objType, rx, ry);
                });

                (function() {
                    for (var x = rx - 1; x <= rx + 2; x++) {
                        for (var y = ry - 1; y <= ry + 2; y++) {
                            var val = self.tilesMap.mapRecord.getValue(x, y);
                            self.prepareMapUpdate(x, y);
                            if (val != null) {
                                var sector = self.getSectorByTiles(x, y);
                                var srfcType = Resources.INSTANCE.surfaceIndex.getType(val);
                                var indx = Resources.INSTANCE.surfaceIndex;

                                // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                                if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {

                                    // okraje vyresetuj
                                    if (val !== SurfaceIndex.VOID) {
                                        self.tilesMap.mapRecord.setValue(x, y, Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.M1));
                                        tilesToReset.push([x, y]);

                                        // zjisti sektor dílku, aby byl přidán do fronty 
                                        // ke cache update (postačí to udělat dle tilesToReset,
                                        // protože to jsou okrajové dílky z oblasti změn)
                                        if (typeof sector !== "undefined" && sector !== null) {
                                            self.markSector(sector);
                                        }
                                    }

                                }
                                // pokud jsem vnitřní část výběru, zkontroluj, 
                                // že jsem neustřelil povrch pod usazeným objektem
                                // a vytvoř díru po kopání
                                else {

                                    // pokud jsem horní díl, pak zkus odkopnout i objekty, které na dílu stojí
                                    if (y === ry &&
                                        (indx.isPosition(self.tilesMap.mapRecord.getValue(x, y), SurfaceIndex.T) ||
                                            indx.isPosition(self.tilesMap.mapRecord.getValue(x, y), SurfaceIndex.TL) ||
                                            indx.isPosition(self.tilesMap.mapRecord.getValue(x, y), SurfaceIndex.TR))) {
                                        self.digObject(x, y - 1);
                                    }

                                    self.tilesMap.mapRecord.setValue(x, y, SurfaceIndex.VOID);
                                    var targetSector = self.getSectorByTiles(x, y);
                                    if (typeof targetSector !== "undefined" && targetSector !== null) {
                                        var child = self.sceneTilesMap.getValue(x, y);
                                        if (child instanceof createjs.Sprite) {
                                            targetSector.removeAnimatedChild(child);
                                        } else {
                                            targetSector.removeCachableChild(child);
                                        }
                                    }

                                    // zjisti sektor dílku, aby byl přidán do fronty 
                                    // ke cache update (postačí to udělat dle tilesToReset,
                                    // protože to jsou okrajové dílky z oblasti změn)
                                    if (typeof sector !== "undefined" && sector !== null) {
                                        self.markSector(sector);
                                    }
                                }
                            }
                        }
                    }
                })();

                this.mapReshape(tilesToReset);
            }

        }

        mapReshape(tilesToReset: Array<[number, number]>) {
            var self = this;

            // Přegeneruj hrany
            (function() {
                tilesToReset.forEach(function(item) {
                    var x = item[0];
                    var y = item[1];
                    MapTools.generateEdge(self.tilesMap, x, y);
                });
            })();

            // Přegeneruj rohy
            (function() {
                tilesToReset.forEach(function(item) {
                    var x = item[0];
                    var y = item[1];
                    MapTools.generateCorner(self.tilesMap, x, y);
                });
            })();

            // Překresli dílky
            (function() {
                tilesToReset.forEach(function(item) {
                    var x = item[0];
                    var y = item[1];
                    // pokud už je alokován dílek na obrazovce, rovnou ho uprav
                    var tile = self.sceneTilesMap.getValue(x, y);
                    if (tile !== null) {
                        var v = self.tilesMap.mapRecord.getValue(x, y);
                        self.setSurfaceSourceRect(tile, v);
                    }
                });
            })();
        }

        digObject(rx, ry) {
            var self = this;
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(rx, ry);
            if (objectElement !== null) {
                var objType: MapObjDefinition = Resources.INSTANCE.mapObjectDefs[objectElement.mapKey];
                var objWidth = objType.mapSpriteWidth;
                var objHeight = objType.mapSpriteHeight;
                // relativní pozice dílku v sheetu (od počátku sprite)
                var posx = objectElement.objTileX;
                var posy = objectElement.objTileY;

                self.onDigObjectListeners.forEach(function(fce) {
                    fce(objType, rx, ry);
                });

                // projdi všechny okolní dílky, které patří danému objektu
                for (var x = 0; x < objWidth; x++) {
                    for (var y = 0; y < objHeight; y++) {

                        // globální souřadnice dílku v mapě
                        var globalX = rx - posx + x;
                        var globalY = ry - posy + y;

                        // odstraň dílek objektu ze sektoru
                        var object = self.sceneObjectsMap.getValue(globalX, globalY);
                        if (object != null) {
                            if ((object.parent.parent instanceof Sector) == false) {
                                console.log("Assert error: Sector instance expected; instead " + (typeof object.parent.parent) + " found!");
                            }
                            var sectorParent = <Sector>object.parent.parent;
                            self.markSector(sectorParent);
                            object.parent.removeChild(object);

                            // odstraň dílke objektu z map
                            self.tilesMap.mapObjectsTiles.setValue(globalX, globalY, null);
                            self.sceneObjectsMap.setValue(globalX, globalY, null);
                        }
                    }
                }
            }
        }

        dig(x: number, y: number, asBackground: boolean) {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Utils.even(coord.x);
            var ry = Utils.even(coord.y);

            // kopl jsem do nějakého povrchu?
            if (asBackground) {
                if (self.tilesMap.mapBgrRecord.getValue(rx, ry) != null) {
                    self.digSurfaceBgr(rx, ry);
                    return true;
                }
            } else {
                if (self.tilesMap.mapRecord.getValue(rx, ry) !== SurfaceIndex.VOID) {
                    self.digSurface(rx, ry);
                    return true;
                } else {
                    // kopl jsem do objektu?
                    self.digObject(rx, ry);
                    return true;
                }
            }
        }

        placeSurfaceBgr(rx, ry, surfaceType: string) {
            var self = this;

            (function() {
                for (var x = rx; x <= rx + 1; x++) {
                    for (var y = ry; y <= ry + 1; y++) {
                        var sector = self.getSectorByTiles(x, y);

                        // TODO tohle patří k surface, nikoliv bgr, ale zatím je to stejné
                        var pos = MapTools.getPositionByCoordPattern(x, y);

                        // vytvoř nové dílky
                        var posIndex = Resources.INSTANCE.surfaceBgrIndex.getPositionIndex(surfaceType, pos);
                        self.tilesMap.mapBgrRecord.setValue(x, y, posIndex);
                        var targetSector = self.getSectorByTiles(x, y);

                        // vytvoř dílek
                        var tile = self.createBgrTile(posIndex);

                        // přidej dílek do sektoru
                        sector.addBackgroundChild(tile);
                        tile.x = (x % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                        tile.y = (y % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                        // přidej dílek do globální mapy
                        self.sceneBgrTilesMap.setValue(x, y, tile);

                        // zjisti sektor dílku, aby byl přidán do fronty 
                        // ke cache update (postačí to udělat dle tilesToReset,
                        // protože to jsou okrajové dílky z oblasti změn)
                        if (typeof sector !== "undefined" && sector !== null) {
                            self.markSector(sector);
                        }
                    }
                }
            })();
        }

        placeSurface(rx, ry, surfaceType: string) {
            var self = this;
            var tilesToReset = [];

            (function() {
                for (var x = rx - 1; x <= rx + 2; x++) {
                    for (var y = ry - 1; y <= ry + 2; y++) {
                        var val = self.tilesMap.mapRecord.getValue(x, y);
                        self.prepareMapUpdate(x, y);
                        if (val != null) {
                            var sector = self.getSectorByTiles(x, y);

                            // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                            if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {

                                var indx = Resources.INSTANCE.surfaceIndex;
                                var srfcType = Resources.INSTANCE.surfaceIndex.getType(val);

                                // okraje vyresetuj (pokud nejsou středy
                                if (val !== SurfaceIndex.VOID) {
                                    self.tilesMap.mapRecord.setValue(x, y, Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, MapTools.getPositionByCoordPattern(x, y)));
                                    tilesToReset.push([x, y]);

                                    // zjisti sektor dílku, aby byl přidán do fronty 
                                    // ke cache update (postačí to udělat dle tilesToReset,
                                    // protože to jsou okrajové dílky z oblasti změn)
                                    if (typeof sector !== "undefined" && sector !== null) {
                                        self.markSector(sector);
                                    }
                                }

                            }
                            // pokud jsem vnitřní část výběru, vytvoř nové dílky
                            else {
                                var pos = MapTools.getPositionByCoordPattern(x, y);
                                var posIndex = Resources.INSTANCE.surfaceIndex.getPositionIndex(surfaceType, pos);
                                self.tilesMap.mapRecord.setValue(x, y, posIndex);
                                var targetSector = self.getSectorByTiles(x, y);
                                tilesToReset.push([x, y]);

                                // vytvoř dílek
                                var tile = self.createTile(posIndex);

                                // přidej dílek do sektoru
                                sector.addCachableChild(tile);
                                tile.x = (x % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                tile.y = (y % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                                // přidej dílek do globální mapy
                                self.sceneTilesMap.setValue(x, y, tile);

                                // zjisti sektor dílku, aby byl přidán do fronty 
                                // ke cache update (postačí to udělat dle tilesToReset,
                                // protože to jsou okrajové dílky z oblasti změn)
                                if (typeof sector !== "undefined" && sector !== null) {
                                    self.markSector(sector);
                                }
                            }
                        }
                    }
                }
            })();

            this.mapReshape(tilesToReset);

        }

        placeObject(rx, ry, mapObj: MapObjDefinition) {
            var self = this;
            var sector = self.getSectorByTiles(rx, ry);
            // musí se posunout dolů o object.mapObj.mapSpriteHeight,
            // protože objekty se počítají počátkem levého SPODNÍHO rohu 
            MapTools.writeObjectRecord(self.tilesMap, rx, ry + mapObj.mapSpriteHeight, mapObj);
            // Sheet index dílku objektu (pokládané objekty jsou vždy 2x2 TILE)
            // TODO změnit -- tohle je blbost -- může být i větší objekt a pak se musí klasicky 
            // počítat záběr a volný prostor
            for (var tx = 0; tx < 2; tx++) {
                for (var ty = 0; ty < 2; ty++) {
                    var objectTile = new MapObjectTile(mapObj.mapKey, tx, ty);
                    var tile = self.createObject(objectTile);

                    // přidej dílek do sektoru
                    if (tile instanceof createjs.Sprite) {
                        sector.addAnimatedChild(tile);
                    } else {
                        sector.addCachableChild(tile);
                    }
                    tile.x = ((rx + tx) % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                    tile.y = ((ry + ty) % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                    // Přidej objekt do globální mapy objektů
                    self.sceneObjectsMap.setValue(rx + tx, ry + ty, tile);
                }
            }

            self.markSector(sector);
        }

        /**
         * Pokusí se umístit objekt na pixel souřadnice a vrátí true, 
         * pokud se to podařilo 
         */
        place(x: number, y: number, object: InvObjDefinition, asBackground: boolean): boolean {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Utils.even(coord.x);
            var ry = Utils.even(coord.y);

            // pokud je co vkládat
            if (typeof object !== "undefined") {
                // pokud je místo prázdné a bez objektu, lze vkládat objekty a povrchy
                if (self.tilesMap.mapRecord.getValue(rx, ry) === SurfaceIndex.VOID && self.tilesMap.mapObjectsTiles.getValue(rx, ry) === null) {
                    // jde o objekt
                    if (object.mapObj != null) {
                        this.placeObject(rx, ry, object.mapObj);
                        return true;
                    }
                    // jde o povrch 
                    if (object.mapSurface != null && asBackground == false) {
                        this.placeSurface(rx, ry, object.mapSurface.mapKey);
                        return true;
                    }
                }
                // pokud je místo bez pozadí, lze vkládat pozadí povrchu
                if (self.tilesMap.mapBgrRecord.getValue(rx, ry) == null) {
                    // jde o pozadí povrchu 
                    if (object.mapSurfaceBgr != null && asBackground) {
                        this.placeSurfaceBgr(rx, ry, object.mapSurfaceBgr.mapKey);
                        return true;
                    }
                }
            }
            return false;
        }

        shiftX(dst) {
            var self = this;
            self.shiftSectorsX(dst);
            self.updateMinimapPosition();
        }

        shiftY(dst) {
            var self = this;
            self.shiftSectorsY(dst);
            self.updateMinimapPosition();
        }

        handleTick() {
            var self = this;
            for (var i = 0; i < self.sectorsToUpdate.length; i++) {
                var item = self.sectorsToUpdate.pop();
                if (typeof item !== "undefined") {
                    item.sector.updateCache();
                }
            }

            self.updateMinimap(self.mapUpdateRegion);
        }

        addOnDigObjectListener(f: (objType: Diggable, x: number, y: number) => any) {
            var self = this;
            self.onDigObjectListeners.push(f);
        }

        addOnDigSurfaceListener(f: (objType: Diggable, x: number, y: number) => any) {
            var self = this;
            self.onDigSurfaceListeners.push(f);
        }

        updatePlayerIcon(x: number, y: number) {
            var self = this;
            if (typeof self.playerIcon !== "undefined") {
                self.playerIcon.x = Math.floor(x / Resources.TILE_SIZE) - (self.playerIcon.image.width / 2);
                self.playerIcon.y = Math.floor(y / Resources.TILE_SIZE) - (self.playerIcon.image.height / 2);
            }
        }

        pixelsToTiles(x: number, y: number) {
            var self = this;
            var tileX = Math.ceil((x - self.screenOffsetX) / Resources.TILE_SIZE) - 1;
            var tileY = Math.ceil((y - self.screenOffsetY) / Resources.TILE_SIZE) - 1;
            return {
                x: tileX,
                y: tileY
            };
        }

        pixelsToEvenTiles(x: number, y: number) {
            var self = this;
            var tileX = Utils.even(Math.ceil((x - self.screenOffsetX) / Resources.TILE_SIZE) - 1);
            var tileY = Utils.even(Math.ceil((y - self.screenOffsetY) / Resources.TILE_SIZE) - 1);
            return {
                x: tileX,
                y: tileY
            };
        }

        tilesToPixel(x: number, y: number) {
            var self = this;
            var screenX = x * Resources.TILE_SIZE + self.screenOffsetX;
            var screenY = y * Resources.TILE_SIZE + self.screenOffsetY;
            return {
                x: screenX,
                y: screenY
            };
        }

        // dle souřadnic tiles spočítá souřadnici sektoru
        getSectorByTiles(x: number, y: number) {
            var self = this;
            var sx = Math.floor(x / Render.SECTOR_SIZE);
            var sy = Math.floor(y / Render.SECTOR_SIZE);
            return self.sectorsMap.getValue(sx, sy);
        }
    }
}