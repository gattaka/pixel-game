/**
 * render.js
 *
 * Stará se o vykreslování, cachování a preload oblastí scény
 *
 */
var Lich;
(function (Lich) {
    var MapUpdateRegion = (function () {
        function MapUpdateRegion() {
            this.cooldown = 0;
            this.prepared = false;
            this.fromX = -1;
            this.toX = -1;
            this.fromY = -1;
            this.toY = -1;
            this.reset();
        }
        MapUpdateRegion.prototype.reset = function () {
            this.cooldown = 0;
            this.prepared = false;
            this.fromX = -1;
            this.toX = -1;
            this.fromY = -1;
            this.toY = -1;
        };
        return MapUpdateRegion;
    }());
    var SectorUpdateRequest = (function () {
        function SectorUpdateRequest(sector, cooldown) {
            this.sector = sector;
            this.cooldown = cooldown;
        }
        return SectorUpdateRequest;
    }());
    var Render = (function () {
        function Render(game, map, world) {
            this.game = game;
            this.map = map;
            this.world = world;
            /**
             * VAR
             */
            this.onDigObjectListeners = new Array();
            this.onDigSurfaceListeners = new Array();
            this.screenOffsetX = 0;
            this.screenOffsetY = 0;
            // souřadnice aktuálního sektorového "okna"
            this.currentStartSecX = null;
            this.currentStartSecY = null;
            this.sectorsToUpdate = new Array();
            // Mapa sektorů
            this.sectorsMap = new Array();
            // Globální mapa dílků
            this.sceneTilesMap = new Array();
            // Globální mapa objektů
            this.sceneObjectsMap = new Array();
            this.mapUpdateRegion = new MapUpdateRegion();
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
        Render.prototype.updateSectors = function () {
            var self = this;
            var maxSecCountX = Math.ceil(self.tilesMap.width / Render.SECTOR_SIZE);
            var maxSecCountY = Math.ceil(self.tilesMap.height / Render.SECTOR_SIZE);
            var startSecX = 0;
            if (self.screenOffsetX < 0) {
                startSecX = Math.floor(-1 * self.screenOffsetX / (Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE));
                startSecX = startSecX >= Render.BUFFER_SECTORS_X ? startSecX - Render.BUFFER_SECTORS_X : startSecX;
            }
            var countSectX = Math.floor(self.sectorsCont.width / (Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_X + 1;
            var startSecY = 0;
            if (self.screenOffsetY < 0) {
                startSecY = Math.floor(-1 * self.screenOffsetY / (Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE));
                startSecY = startSecY >= Render.BUFFER_SECTORS_Y ? startSecY - Render.BUFFER_SECTORS_Y : startSecY;
            }
            var countSectY = Math.floor(self.sectorsCont.height / (Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_Y + 1;
            // změnilo se něco? Pokud není potřeba pře-alokovávat sektory, ukonči fci
            if (self.currentStartSecX === startSecX && self.currentStartSecY === startSecY)
                return;
            // změnit stavy
            self.currentStartSecX = startSecX;
            self.currentStartSecY = startSecY;
            // projdi sektory, nepoužité dealokuj, nové naplň
            for (var x = 0; x < maxSecCountX; x++) {
                for (var y = 0; y < maxSecCountY; y++) {
                    var secCol = self.sectorsMap[x];
                    if (typeof secCol === "undefined") {
                        secCol = [];
                        self.sectorsMap[x] = secCol;
                    }
                    var mapCol;
                    if (x >= startSecX && x <= startSecX + countSectX && y >= startSecY && y <= startSecY + countSectY) {
                        // jde o platný sektor 
                        // pokud ještě není alokován tak alokuj
                        if (typeof secCol[y] === "undefined" || secCol[y] === null) {
                            var sector = new Lich.Sector(y * maxSecCountX + x, x, y, Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE, Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE);
                            sector.x = x * Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE + self.screenOffsetX;
                            sector.y = y * Render.SECTOR_SIZE * Lich.Resources.TILE_SIZE + self.screenOffsetY;
                            self.sectorsCont.addChild(sector);
                            secCol[y] = sector;
                            // vytvoř jednotlivé dílky
                            for (var mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (var my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {
                                    // vytvoř na dané souřadnici dílky povrchu
                                    var tileElement = self.tilesMap.valueAt(mx, my);
                                    if (tileElement > 0) {
                                        // vytvoř dílek
                                        var tile = self.createTile(tileElement);
                                        // přidej dílek do sektoru
                                        sector.addCachableChild(tile);
                                        tile.x = (mx % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        tile.y = (my % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        // přidej dílek do globální mapy
                                        Lich.Utils.set2D(self.sceneTilesMap, mx, my, tile);
                                    }
                                    // vytvoř na dané souřadnici dílky objektů
                                    var objectElement = Lich.Utils.get2D(self.tilesMap.mapObjectsTiles, mx, my);
                                    if (objectElement !== null) {
                                        // Sheet index dílku objektu
                                        var object = self.createObject(objectElement);
                                        // přidej dílek do sektoru
                                        if (object instanceof createjs.Sprite) {
                                            sector.addAnimatedChild(object);
                                        }
                                        else {
                                            sector.addCachableChild(object);
                                        }
                                        object.x = (mx % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        object.y = (my % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        // Přidej objekt do globální mapy objektů
                                        Lich.Utils.set2D(self.sceneObjectsMap, mx, my, object);
                                    }
                                }
                            }
                            // debug
                            if (Lich.Resources.SHOW_SECTORS) {
                                var testShape = new createjs.Shape();
                                testShape.graphics.setStrokeStyle(1);
                                testShape.graphics.beginStroke("#f00");
                                testShape.graphics.drawRect(0, 0, sector.width, sector.height);
                                sector.addChild(testShape);
                            }
                            // proveď cache na sektoru
                            sector.cache(0, 0, sector.width, sector.height);
                            if (Lich.Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Alokován sektor: " + x + ":" + y);
                            }
                        }
                    }
                    else {
                        // neplatný sektor
                        // pokud je obsazeno dealokuj
                        if (typeof secCol[y] !== "undefined" && secCol[y] !== null) {
                            // vymaž jednotlivé dílky
                            for (var mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (var my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {
                                    // stavěním mohl přibýt dílek někam, kde předtím nebyl, proto
                                    // je potřeba i při mazání kontrolovat existenci sloupce
                                    mapCol = self.sceneObjectsMap[mx];
                                    if (typeof mapCol === "undefined") {
                                        mapCol = [];
                                        self.sceneObjectsMap[mx] = mapCol;
                                    }
                                    mapCol[my] = null;
                                }
                            }
                            // TODO vymaž objekty
                            // vymaž sektor
                            secCol[y].removeAllChildren();
                            self.sectorsCont.removeChild(secCol[y]);
                            secCol[y] = null;
                            if (Lich.Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Dealokován sektor: " + x + ":" + y);
                            }
                        }
                    }
                }
            }
        };
        Render.prototype.prepareMapUpdate = function (x, y) {
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
        };
        Render.prototype.setSourceRect = function (tile, positionIndex) {
            var v = Lich.Resources.INSTANCE.surfaceIndex.getPosition(positionIndex);
            var tileCols = tile.image.width / Lich.Resources.TILE_SIZE;
            // Otestováno: tohle je rychlejší než extract ze Spritesheet
            tile.sourceRect = new createjs.Rectangle(((v - 1) % tileCols) * Lich.Resources.TILE_SIZE, Math.floor((v - 1) / tileCols) * Lich.Resources.TILE_SIZE, Lich.Resources.TILE_SIZE, Lich.Resources.TILE_SIZE);
        };
        Render.prototype.createTile = function (positionIndex) {
            var self = this;
            var surfaceType = Lich.Resources.INSTANCE.surfaceIndex.getSurfaceType(positionIndex);
            var tile = Lich.Resources.INSTANCE.getBitmap(surfaceType);
            this.setSourceRect(tile, positionIndex);
            return tile;
        };
        Render.prototype.createObject = function (objectTile) {
            var self = this;
            var objDef = Lich.Resources.INSTANCE.mapObjectsDefs[objectTile.mapKey];
            var object;
            if (objDef.frames > 1) {
                object = Lich.Resources.INSTANCE.getSpritePart(objDef.mapKey, objectTile.objTileX, objectTile.objTileY, objDef.frames, objDef.mapSpriteWidth, objDef.mapSpriteHeight);
                return object;
            }
            else {
                object = Lich.Resources.INSTANCE.getBitmap(objectTile.mapKey);
                // Otestováno: tohle je rychlejší než extract ze Spritesheet
                object.sourceRect = new createjs.Rectangle(objectTile.objTileX * Lich.Resources.TILE_SIZE, objectTile.objTileY * Lich.Resources.TILE_SIZE, Lich.Resources.TILE_SIZE, Lich.Resources.TILE_SIZE);
                return object;
            }
        };
        /**
         * Vrací, zda je možné scénu dále posouvat, nebo již jsem na jejím okraji
         */
        Render.prototype.canShiftX = function (dst) {
            var self = this;
            return self.screenOffsetX + dst <= 0 && self.screenOffsetX + dst >= -self.map.tilesMap.width * Lich.Resources.TILE_SIZE + self.game.canvas.width;
        };
        Render.prototype.shiftSectorsX = function (dst) {
            var self = this;
            self.screenOffsetX += dst;
            self.sectorsCont.children.forEach(function (sector) {
                sector.x += dst;
            });
            self.updateSectors();
        };
        /**
         * Vrací, zda je možné scénu dále posouvat, nebo již jsem na jejím okraji
         */
        Render.prototype.canShiftY = function (dst) {
            var self = this;
            return self.screenOffsetY + dst <= 0 && self.screenOffsetY + dst >= -self.map.tilesMap.height * Lich.Resources.TILE_SIZE + self.game.canvas.height;
        };
        Render.prototype.shiftSectorsY = function (dst) {
            var self = this;
            self.screenOffsetY += dst;
            self.sectorsCont.children.forEach(function (sector) {
                sector.y += dst;
            });
            self.updateSectors();
        };
        Render.prototype.updateMinimapPosition = function () {
            var self = this;
            var x = Math.floor(-1 * self.screenOffsetX / Lich.Resources.TILE_SIZE);
            var y = Math.floor(-1 * self.screenOffsetY / Lich.Resources.TILE_SIZE);
            self.minimap.bitmap.sourceRect = {
                x: x,
                y: y,
                height: Render.MAP_SIDE,
                width: Render.MAP_SIDE
            };
        };
        Render.prototype.drawMinimapTile = function (imgData, x, y) {
            var self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            var item = self.tilesMap.valueAt(x, y);
            if (item === Lich.SurfaceIndex.VOID) {
                imgData.data[imgData.counter++] = 209; // R
                imgData.data[imgData.counter++] = 251; // G
                imgData.data[imgData.counter++] = 255; // B
                imgData.data[imgData.counter++] = 200; // A
            }
            else {
                if (Lich.Resources.INSTANCE.surfaceIndex.isMiddlePosition(item)) {
                    imgData.data[imgData.counter++] = 156; // R
                    imgData.data[imgData.counter++] = 108; // G
                    imgData.data[imgData.counter++] = 36; // B
                    imgData.data[imgData.counter++] = 200; // A
                }
                else {
                    imgData.data[imgData.counter++] = 102; // R
                    imgData.data[imgData.counter++] = 174; // G 
                    imgData.data[imgData.counter++] = 0; // B
                    imgData.data[imgData.counter++] = 200; // A
                }
            }
        };
        ;
        Render.prototype.updateMinimap = function (mapUpdateRegion) {
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
            (function () {
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
        };
        Render.prototype.initMinimap = function () {
            var self = this;
            var ctx = self.minimap.canvas.getContext("2d");
            var imgData = ctx.createImageData(self.tilesMap.width, self.tilesMap.height); // width x height
            (function () {
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
        };
        Render.prototype.createMinimap = function () {
            var self = this;
            self.minimap = {};
            var canvas = document.getElementById("mapCanvas");
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
            self.playerIcon = Lich.Resources.INSTANCE.getBitmap(Lich.Resources.PLAYER_ICON_KEY);
            self.playerIcon.alpha = 0.7;
            self.minimap.cont.addChild(self.playerIcon);
        };
        Render.prototype.markSector = function (sector) {
            var self = this;
            if (typeof self.sectorsToUpdate[sector.secId] === "undefined") {
                self.sectorsToUpdate[sector.secId] = new SectorUpdateRequest(sector, Render.SECTOR_CACHE_COOLDOWN);
            }
        };
        ;
        Render.prototype.digGround = function (rx, ry) {
            var self = this;
            var tilesToReset = [];
            var dugIndex = self.tilesMap.valueAt(rx, ry);
            if (dugIndex > -1) {
                var surfaceType = Lich.Resources.INSTANCE.surfaceIndex.getSurfaceType(dugIndex);
                var objType = Lich.Resources.INSTANCE.mapSurfacesDefs[surfaceType];
                self.onDigSurfaceListeners.forEach(function (fce) {
                    fce(objType, rx, ry);
                });
                (function () {
                    for (var x = rx - 1; x <= rx + 2; x++) {
                        for (var y = ry - 1; y <= ry + 2; y++) {
                            var index = self.tilesMap.indexAt(x, y);
                            var val = self.tilesMap.valueAt(x, y);
                            var srfcType = Lich.Resources.INSTANCE.surfaceIndex.getSurfaceType(val);
                            var indx = Lich.Resources.INSTANCE.surfaceIndex;
                            self.prepareMapUpdate(x, y);
                            if (index >= 0) {
                                var sector = self.getSectorByTiles(x, y);
                                // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                                if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {
                                    // okraje vyresetuj
                                    if (self.tilesMap.mapRecord[index] !== Lich.SurfaceIndex.VOID) {
                                        self.tilesMap.mapRecord[index] = Lich.Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, Lich.SurfaceIndex.M1);
                                        tilesToReset.push([x, y]);
                                        // zjisti sektor dílku, aby byl přidán do fronty 
                                        // ke cache update (postačí to udělat dle tilesToReset,
                                        // protože to jsou okrajové dílky z oblasti změn)
                                        if (typeof sector !== "undefined" && sector !== null) {
                                            self.markSector(sector);
                                        }
                                    }
                                }
                                else {
                                    // pokud jsem horní díl, pak zkus odkopnout i objekty, které na dílu stojí
                                    if (y === ry &&
                                        (indx.isPosition(self.tilesMap.mapRecord[index], Lich.SurfaceIndex.T) ||
                                            indx.isPosition(self.tilesMap.mapRecord[index], Lich.SurfaceIndex.TL) ||
                                            indx.isPosition(self.tilesMap.mapRecord[index], Lich.SurfaceIndex.TR))) {
                                        self.tryDigObject(x, y - 1);
                                    }
                                    self.tilesMap.mapRecord[index] = Lich.SurfaceIndex.VOID;
                                    var targetSector = self.getSectorByTiles(x, y);
                                    if (typeof targetSector !== "undefined" && targetSector !== null) {
                                        var child = Lich.Utils.get2D(self.sceneTilesMap, x, y);
                                        if (child instanceof createjs.Sprite) {
                                            targetSector.removeAnimatedChild(child);
                                        }
                                        else {
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
        };
        Render.prototype.mapReshape = function (tilesToReset) {
            var self = this;
            // Přegeneruj hrany
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    Lich.MapTools.generateEdge(self.tilesMap, x, y);
                });
            })();
            // Přegeneruj rohy
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    Lich.MapTools.generateCorner(self.tilesMap, x, y);
                });
            })();
            // Překresli dílky
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    // pokud už je alokován dílek na obrazovce, rovnou ho uprav
                    var tile = Lich.Utils.get2D(self.sceneTilesMap, x, y);
                    if (tile !== null) {
                        var v = self.tilesMap.valueAt(x, y);
                        self.setSourceRect(tile, v);
                    }
                });
            })();
        };
        Render.prototype.tryDigObject = function (rx, ry) {
            var self = this;
            var objectElement = Lich.Utils.get2D(self.tilesMap.mapObjectsTiles, rx, ry);
            if (objectElement !== null) {
                var objType = Lich.Resources.INSTANCE.mapObjectsDefs[objectElement.mapKey];
                var objWidth = objType.mapSpriteWidth;
                var objHeight = objType.mapSpriteHeight;
                // relativní pozice dílku v sheetu (od počátku sprite)
                var posx = objectElement.objTileX;
                var posy = objectElement.objTileY;
                self.onDigObjectListeners.forEach(function (fce) {
                    fce(objType, rx, ry);
                });
                // projdi všechny okolní dílky, které patří danému objektu
                for (var x = 0; x < objWidth; x++) {
                    for (var y = 0; y < objHeight; y++) {
                        // globální souřadnice dílku v mapě
                        var globalX = rx - posx + x;
                        var globalY = ry - posy + y;
                        // odstraň dílek objektu ze sektoru
                        var object = Lich.Utils.get2D(self.sceneObjectsMap, globalX, globalY);
                        if (object != null) {
                            if ((object.parent.parent instanceof Lich.Sector) == false) {
                                console.log("Assert error: Sector instance expected; instead " + (typeof object.parent.parent) + " found!");
                            }
                            var sectorParent = object.parent.parent;
                            self.markSector(sectorParent);
                            object.parent.removeChild(object);
                            // odstraň dílke objektu z map
                            Lich.Utils.set2D(self.tilesMap.mapObjectsTiles, globalX, globalY, null);
                            Lich.Utils.set2D(self.sceneObjectsMap, globalX, globalY, null);
                        }
                    }
                }
            }
        };
        Render.prototype.placeGround = function (rx, ry, surfaceType) {
            var self = this;
            var tilesToReset = [];
            (function () {
                for (var x = rx - 1; x <= rx + 2; x++) {
                    for (var y = ry - 1; y <= ry + 2; y++) {
                        var index = self.tilesMap.indexAt(x, y);
                        self.prepareMapUpdate(x, y);
                        if (index >= 0) {
                            var sector = self.getSectorByTiles(x, y);
                            // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                            if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {
                                var val = self.tilesMap.valueAt(x, y);
                                var indx = Lich.Resources.INSTANCE.surfaceIndex;
                                var srfcType = Lich.Resources.INSTANCE.surfaceIndex.getSurfaceType(val);
                                // okraje vyresetuj (pokud nejsou středy
                                if (self.tilesMap.mapRecord[index] !== Lich.SurfaceIndex.VOID) {
                                    self.tilesMap.mapRecord[index] = Lich.Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, Lich.MapTools.getPositionByCoordPattern(x, y));
                                    tilesToReset.push([x, y]);
                                    // zjisti sektor dílku, aby byl přidán do fronty 
                                    // ke cache update (postačí to udělat dle tilesToReset,
                                    // protože to jsou okrajové dílky z oblasti změn)
                                    if (typeof sector !== "undefined" && sector !== null) {
                                        self.markSector(sector);
                                    }
                                }
                            }
                            else {
                                var pos = Lich.MapTools.getPositionByCoordPattern(x, y);
                                var posIndex = Lich.Resources.INSTANCE.surfaceIndex.getPositionIndex(surfaceType, pos);
                                self.tilesMap.mapRecord[index] = posIndex;
                                var targetSector = self.getSectorByTiles(x, y);
                                tilesToReset.push([x, y]);
                                // vytvoř dílek
                                var tile = self.createTile(posIndex);
                                // přidej dílek do sektoru
                                sector.addCachableChild(tile);
                                tile.x = (x % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                tile.y = (y % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                // přidej dílek do globální mapy
                                Lich.Utils.set2D(self.sceneTilesMap, x, y, tile);
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
        };
        /**
         * Pokusí se umístit objekt na pixel souřadnice a vrátí true,
         * pokud se to podařilo
         */
        Render.prototype.place = function (x, y, item) {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Lich.Utils.even(coord.x);
            var ry = Lich.Utils.even(coord.y);
            // pokud je místo prázdné a bez objektu (a je co vkládat
            if (item !== null && self.tilesMap.valueAt(rx, ry) === Lich.SurfaceIndex.VOID && Lich.Utils.get2D(self.tilesMap.mapObjectsTiles, rx, ry) === null) {
                var object = Lich.Resources.INSTANCE.invObjectsDefs[item];
                var sector = self.getSectorByTiles(rx, ry);
                if (typeof object !== "undefined") {
                    if (object.mapObj != null) {
                        // jde o objekt
                        // musí se posunout dolů o object.mapObj.mapSpriteHeight,
                        // protože objekty se počítají počátkem levého SPODNÍHO rohu 
                        Lich.MapTools.writeObjectRecord(self.tilesMap, rx, ry + object.mapObj.mapSpriteHeight, object.mapObj);
                        // Sheet index dílku objektu (pokládané objekty jsou vždy 2x2 TILE)
                        // TODO změnit -- tohle je blbost -- může být i větší objekt a pak se musí klasicky 
                        // počítat záběr a volný prostor
                        for (var tx = 0; tx < 2; tx++) {
                            for (var ty = 0; ty < 2; ty++) {
                                var objectTile = new Lich.MapObjectTile(object.mapObj.mapKey, tx, ty);
                                var tile = self.createObject(objectTile);
                                // přidej dílek do sektoru
                                if (tile instanceof createjs.Sprite) {
                                    sector.addAnimatedChild(tile);
                                }
                                else {
                                    sector.addCachableChild(tile);
                                }
                                tile.x = ((rx + tx) % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                tile.y = ((ry + ty) % Render.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                // Přidej objekt do globální mapy objektů
                                Lich.Utils.set2D(self.sceneObjectsMap, rx + tx, ry + ty, tile);
                            }
                        }
                        self.markSector(sector);
                        return true;
                    }
                    else if (object.mapSurface != null) {
                        // jde o povrch 
                        var surtIndx = Lich.Resources.INSTANCE.surfaceIndex;
                        this.placeGround(rx, ry, object.mapSurface.mapKey);
                        return true;
                    }
                }
            }
            return false;
        };
        Render.prototype.dig = function (x, y) {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Lich.Utils.even(coord.x);
            var ry = Lich.Utils.even(coord.y);
            // kopl jsem do nějakého povrchu?
            if (self.tilesMap.valueAt(rx, ry) !== Lich.SurfaceIndex.VOID) {
                self.digGround(rx, ry);
                return true;
            }
            else {
                // kopl jsem do objektu?
                self.tryDigObject(rx, ry);
                return false;
            }
        };
        Render.prototype.shiftX = function (dst) {
            var self = this;
            self.shiftSectorsX(dst);
            self.updateMinimapPosition();
        };
        Render.prototype.shiftY = function (dst) {
            var self = this;
            self.shiftSectorsY(dst);
            self.updateMinimapPosition();
        };
        Render.prototype.handleTick = function () {
            var self = this;
            for (var i = 0; i < self.sectorsToUpdate.length; i++) {
                var item = self.sectorsToUpdate.pop();
                if (typeof item !== "undefined") {
                    item.sector.updateCache();
                }
            }
            self.updateMinimap(self.mapUpdateRegion);
        };
        Render.prototype.addOnDigObjectListener = function (f) {
            var self = this;
            self.onDigObjectListeners.push(f);
        };
        Render.prototype.addOnDigSurfaceListener = function (f) {
            var self = this;
            self.onDigSurfaceListeners.push(f);
        };
        Render.prototype.updatePlayerIcon = function (x, y) {
            var self = this;
            if (typeof self.playerIcon !== "undefined") {
                self.playerIcon.x = Math.floor(x / Lich.Resources.TILE_SIZE) - (self.playerIcon.image.width / 2);
                self.playerIcon.y = Math.floor(y / Lich.Resources.TILE_SIZE) - (self.playerIcon.image.height / 2);
            }
        };
        Render.prototype.pixelsToTiles = function (x, y) {
            var self = this;
            var tileX = Math.ceil((x - self.screenOffsetX) / Lich.Resources.TILE_SIZE) - 1;
            var tileY = Math.ceil((y - self.screenOffsetY) / Lich.Resources.TILE_SIZE) - 1;
            return {
                x: tileX,
                y: tileY
            };
        };
        Render.prototype.pixelsToEvenTiles = function (x, y) {
            var self = this;
            var tileX = Lich.Utils.even(Math.ceil((x - self.screenOffsetX) / Lich.Resources.TILE_SIZE) - 1);
            var tileY = Lich.Utils.even(Math.ceil((y - self.screenOffsetY) / Lich.Resources.TILE_SIZE) - 1);
            return {
                x: tileX,
                y: tileY
            };
        };
        Render.prototype.tilesToPixel = function (x, y) {
            var self = this;
            var screenX = x * Lich.Resources.TILE_SIZE + self.screenOffsetX;
            var screenY = y * Lich.Resources.TILE_SIZE + self.screenOffsetY;
            return {
                x: screenX,
                y: screenY
            };
        };
        // dle souřadnic tiles spočítá souřadnici sektoru
        Render.prototype.getSectorByTiles = function (x, y) {
            var self = this;
            var sx = Math.floor(x / Render.SECTOR_SIZE);
            var sy = Math.floor(y / Render.SECTOR_SIZE);
            return Lich.Utils.get2D(self.sectorsMap, sx, sy);
        };
        /**
         * STATIC
         */
        // Velikost sektoru v dílcích
        Render.SECTOR_SIZE = 10;
        // kolik překreslení se po změně nebude cachovat, protože 
        // je dost pravděpodobné, že se bude ještě měnit?
        Render.SECTOR_CACHE_COOLDOWN = 5;
        // Počet okrajových sektorů, které nejsou zobrazeny,
        // ale jsou alokovány (pro plynulé posuny)
        Render.BUFFER_SECTORS_X = 1;
        Render.BUFFER_SECTORS_Y = 1;
        Render.MAP_SIDE = 200;
        Render.MINIMAP_COOLDOWN = 30;
        return Render;
    }());
    Lich.Render = Render;
})(Lich || (Lich = {}));
