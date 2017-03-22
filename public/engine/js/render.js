/**
 * render.js
 *
 * Stará se o vykreslování, cachování a preload oblastí scény
 *
 */
var Lich;
(function (Lich) {
    var SectorUpdateRequest = (function () {
        function SectorUpdateRequest(sector, cooldown) {
            this.sector = sector;
            this.cooldown = cooldown;
        }
        return SectorUpdateRequest;
    }());
    var FogInfo = (function () {
        function FogInfo(startFogSecX, startFogSecY, countFogSecX, countFogSecY, maxFogSecX, maxFogSecY) {
            this.startFogSecX = startFogSecX;
            this.startFogSecY = startFogSecY;
            this.countFogSecX = countFogSecX;
            this.countFogSecY = countFogSecY;
            this.maxFogSecX = maxFogSecX;
            this.maxFogSecY = maxFogSecY;
        }
        return FogInfo;
    }());
    var Render = (function () {
        function Render(game, world) {
            this.game = game;
            this.world = world;
            this.onDigObjectListeners = new Array();
            this.onDigSurfaceListeners = new Array();
            // aktuální posuv mapy v px
            this.screenOffsetX = 0;
            this.screenOffsetY = 0;
            // souřadnice aktuálního sektorového "okna" v půlsektorech
            this.currentStartHalfSecX = null;
            this.currentStartHalfSecY = null;
            // souřadnice aktuálního fog okna
            this.currentStartFogX = null;
            this.currentStartFogY = null;
            // sector kontejnery
            this.sectorsToUpdate = new Array();
            // Mapy sektorů
            this.sectorsMap = new Lich.Array2D();
            // Vykreslené dílky povrchu a pozadí
            this.sceneTilesMap = new Lich.Array2D();
            this.sceneBgrTilesMap = new Lich.Array2D();
            // Vykreslené dílky objektů
            this.sceneObjectsMap = new Lich.Array2D();
            var self = this;
            self.tilesMap = world.tilesMap;
            self.sectorsCont = world.tilesSectorsCont;
            // vytvoř sektory dle aktuálního záběru obrazovky
            self.updateSectors();
        }
        Render.prototype.getScreenOffsetX = function () {
            return this.screenOffsetX;
        };
        Render.prototype.getScreenOffsetY = function () {
            return this.screenOffsetY;
        };
        Render.getFogContSizeW = function (contW) {
            return Math.floor(contW / Lich.Resources.PARTS_SIZE) + 2;
        };
        Render.getFogContSizeH = function (contH) {
            return Math.floor(contH / Lich.Resources.PARTS_SIZE) + 2;
        };
        Render.prototype.getFogInfo = function () {
            var self = this;
            // Pokud jsem úplně vlevo, vykresluj od X sektoru 0
            var startFogSecX = 0;
            if (self.screenOffsetX < 0) {
                // Pokud došlo k nějakému posunu doprava, zjisti kolik sektorů by se do tohoto posuvu vešlo
                // půlsektory pro dither
                startFogSecX = Math.floor(-1 * self.screenOffsetX / Lich.Resources.PARTS_SIZE);
            }
            var countFogSecX = Render.getFogContSizeW(self.sectorsCont.fixedWidth);
            // Pokud jsem úplně nahoře, vykresluj od Y sektoru 0
            var startFogSecY = 0;
            if (self.screenOffsetY < 0) {
                // Pokud došlo k nějakému posunu dolů, zjisti kolik sektorů by se do tohoto posuvu vešlo
                // půlsektory pro dither
                startFogSecY = Math.floor(-1 * self.screenOffsetY / Lich.Resources.PARTS_SIZE);
            }
            var countFogSecY = Render.getFogContSizeH(self.sectorsCont.fixedHeight);
            // Protože se fogCont posouvá o -PARTS_SIZE, aby plynule navazoval (na obou koncích je 
            // o 1 delší a musí tedy začít v -PARTS_SIZE,-PARTS_SIZE), je potřeba aby i zobrazovaná
            // data byla posunuta. Jinak by se fog zobrazoval posunutý doleva a na pravém/dolním konci
            // by se zobrazovala undefined data (černé čtvrce)
            startFogSecY--;
            startFogSecX--;
            return new FogInfo(startFogSecX, startFogSecY, countFogSecX, countFogSecY, Math.floor(self.tilesMap.width / 2), Math.floor(self.tilesMap.height / 2));
        };
        // zkoumá, zda je potřeba přealokovat sektory 
        Render.prototype.updateSectors = function () {
            var self = this;
            var maxSecCountX = Math.ceil(self.tilesMap.width / Lich.Resources.SECTOR_SIZE);
            var maxSecCountY = Math.ceil(self.tilesMap.height / Lich.Resources.SECTOR_SIZE);
            // Pokud jsem úplně vlevo, vykresluj od X sektoru 0
            var startSecX = 0;
            var halfStartSecX = 0;
            var applyXdither = false;
            var oddXdither = false;
            if (self.screenOffsetX < 0) {
                // Pokud došlo k nějakému posunu doprava, zjisti kolik sektorů by se do tohoto posuvu vešlo
                // půlsektory pro dither
                halfStartSecX = Math.floor(-1 * self.screenOffsetX / (Lich.Resources.SECTOR_SIZE / 2 * Lich.Resources.TILE_SIZE));
                oddXdither = halfStartSecX % 2 == 0;
                startSecX = Math.floor(halfStartSecX / 2);
                // Vždy ponech BUFFER_SECTORS_X sektorů za sebou neodalokovaných, aby nedocházelo k výpadkům
                // a aby mapa vždy měla předpřipravené sektory ve směru pohybu
                startSecX = startSecX >= Lich.Resources.BUFFER_SECTORS_X ? startSecX - Lich.Resources.BUFFER_SECTORS_X : startSecX;
                applyXdither = startSecX != 0;
            }
            var countSectX = Math.floor(self.sectorsCont.fixedWidth / (Lich.Resources.SECTOR_SIZE * Lich.Resources.TILE_SIZE)) + Lich.Resources.BUFFER_SECTORS_X + 2;
            applyXdither = applyXdither && startSecX + countSectX != maxSecCountX;
            // Pokud jsem úplně nahoře, vykresluj od Y sektoru 0
            var startSecY = 0;
            var halfStartSecY = 0;
            var applyYdither = false;
            var oddYdither = false;
            if (self.screenOffsetY < 0) {
                // Pokud došlo k nějakému posunu dolů, zjisti kolik sektorů by se do tohoto posuvu vešlo
                // půlsektory pro dither
                halfStartSecY = Math.floor(-1 * self.screenOffsetY / (Lich.Resources.SECTOR_SIZE / 2 * Lich.Resources.TILE_SIZE));
                oddYdither = halfStartSecY % 2 == 0;
                startSecY = Math.floor(halfStartSecY / 2);
                // Vždy ponech BUFFER_SECTORS_Y sektorů za sebou neodalokovaných, aby nedocházelo k výpadkům
                // a aby mapa vždy měla předpřipravené sektory ve směru pohybu
                startSecY = startSecY >= Lich.Resources.BUFFER_SECTORS_Y ? startSecY - Lich.Resources.BUFFER_SECTORS_Y : startSecY;
                applyYdither = startSecY != 0;
            }
            var countSectY = Math.floor(self.sectorsCont.fixedHeight / (Lich.Resources.SECTOR_SIZE * Lich.Resources.TILE_SIZE)) + Lich.Resources.BUFFER_SECTORS_Y + 2;
            applyYdither = applyYdither && startSecY + countSectY != maxSecCountY;
            // změnilo se něco? Pokud není potřeba pře-alokovávat sektory, ukonči fci
            if (self.currentStartHalfSecX === halfStartSecX && self.currentStartHalfSecY === halfStartSecY)
                return;
            // změnit stavy
            self.currentStartHalfSecX = halfStartSecX;
            self.currentStartHalfSecY = halfStartSecY;
            // projdi sektory, nepoužité dealokuj, nové naplň
            for (var x = 0; x < maxSecCountX; x++) {
                for (var y = 0; y < maxSecCountY; y++) {
                    if (x >= startSecX && x <= startSecX + countSectX && y >= startSecY && y <= startSecY + countSectY) {
                        // pokud je zapnuté prokládání a jde o krajní sektory, nezpracovávej liché resp. sudé sektory
                        // tyto sektory budou zpracovány dalším půl-sektorovém kroku
                        if (applyXdither && (x == startSecX || x == startSecX + countSectX)) {
                            if (oddXdither == (y % 2 == 0))
                                continue;
                        }
                        if (applyYdither && (y == startSecY || y == startSecY + countSectY)) {
                            if (oddYdither == (x % 2 == 0))
                                continue;
                        }
                        // jde o platný sektor 
                        // pokud ještě není alokován tak alokuj
                        if (self.sectorsMap.getValue(x, y) == null) {
                            var sector = new Lich.Sector(y * maxSecCountX + x, x, y, Lich.Resources.SECTOR_SIZE * Lich.Resources.TILE_SIZE, Lich.Resources.SECTOR_SIZE * Lich.Resources.TILE_SIZE);
                            sector.x = x * Lich.Resources.SECTOR_SIZE * Lich.Resources.TILE_SIZE + self.screenOffsetX;
                            sector.y = y * Lich.Resources.SECTOR_SIZE * Lich.Resources.TILE_SIZE + self.screenOffsetY;
                            self.sectorsCont.addChild(sector);
                            self.sectorsMap.setValue(x, y, sector);
                            // vytvoř jednotlivé dílky
                            for (var mx = x * Lich.Resources.SECTOR_SIZE; mx < (x + 1) * Lich.Resources.SECTOR_SIZE; mx++) {
                                for (var my = y * Lich.Resources.SECTOR_SIZE; my < (y + 1) * Lich.Resources.SECTOR_SIZE; my++) {
                                    // vytvoř na dané souřadnici dílky pozadí povrchu
                                    var bgrElement = self.tilesMap.mapBgrRecord.getValue(mx, my);
                                    if (bgrElement > 0) {
                                        // vytvoř dílek
                                        var tile = self.createTile(bgrElement, true);
                                        // přidej dílek do sektoru
                                        sector.addCacheableChild(tile);
                                        tile.x = (mx % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        tile.y = (my % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        // přidej dílek do globální mapy
                                        self.sceneBgrTilesMap.setValue(mx, my, tile);
                                    }
                                    // vytvoř na dané souřadnici dílky povrchu
                                    var tileElement = self.tilesMap.mapRecord.getValue(mx, my);
                                    if (tileElement > 0) {
                                        // vytvoř dílek
                                        var tile = self.createTile(tileElement, false);
                                        // přidej dílek do sektoru
                                        sector.addCacheableChild(tile);
                                        tile.x = (mx % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        tile.y = (my % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        // přidej dílek do globální mapy
                                        self.sceneTilesMap.setValue(mx, my, tile);
                                    }
                                    // vytvoř na dané souřadnici dílky objektů
                                    var objectElement = self.tilesMap.mapObjectsTiles.getValue(mx, my);
                                    if (objectElement !== null) {
                                        // Sheet index dílku objektu
                                        var object = self.createObject(objectElement);
                                        // přidej dílek do sektoru
                                        if (object instanceof PIXI.extras.AnimatedSprite) {
                                            sector.addAnimatedChild(object);
                                        }
                                        else {
                                            sector.addCacheableChild(object);
                                        }
                                        object.x = (mx % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        object.y = (my % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                        // Přidej objekt do globální mapy objektů
                                        self.sceneObjectsMap.setValue(mx, my, object);
                                    }
                                }
                            }
                            // proveď cache na sektoru
                            sector.cache();
                            // debug
                            if (Lich.Resources.SHOW_SECTORS) {
                                var testShape = new PIXI.Graphics();
                                testShape.lineStyle(1, 0xff0000);
                                testShape.drawRect(0, 0, sector.fixedWidth, sector.fixedHeight);
                                sector.addChild(testShape);
                            }
                            if (Lich.Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Alokován sektor: " + x + ":" + y);
                            }
                        }
                    }
                    else {
                        // neplatný sektor
                        // pokud je obsazeno dealokuj
                        if (self.sectorsMap.getValue(x, y) != null) {
                            // vymaž objekty
                            for (var mx = x * Lich.Resources.SECTOR_SIZE; mx < (x + 1) * Lich.Resources.SECTOR_SIZE; mx++) {
                                for (var my = y * Lich.Resources.SECTOR_SIZE; my < (y + 1) * Lich.Resources.SECTOR_SIZE; my++) {
                                    self.sceneObjectsMap.setValue(mx, my, null);
                                }
                            }
                            // vymaž sektor
                            var ss = self.sectorsMap.getValue(x, y);
                            ss.removeChildren();
                            self.sectorsCont.removeChild(ss);
                            self.sectorsMap.setValue(x, y, null);
                            if (Lich.Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Dealokován sektor: " + x + ":" + y);
                            }
                        }
                    }
                }
            }
        };
        Render.prototype.createFogTile = function () {
            var self = this;
            return Lich.Resources.getInstance().getFogSprite();
        };
        Render.prototype.createTile = function (positionIndex, bgr) {
            var self = this;
            var rsc = Lich.Resources.getInstance();
            var typ, tile;
            if (bgr) {
                typ = rsc.surfaceBgrIndex.getType(positionIndex);
                var v = Lich.Resources.getInstance().surfaceBgrIndex.getPosition(positionIndex);
                tile = rsc.getSurfaceBgrTileSprite(typ, v - 1);
            }
            else {
                typ = rsc.surfaceIndex.getType(positionIndex);
                var v = Lich.Resources.getInstance().surfaceIndex.getPosition(positionIndex);
                tile = rsc.getSurfaceTileSprite(typ, v - 1);
            }
            return tile;
        };
        Render.prototype.createObject = function (objectTile) {
            var self = this;
            var objDef = Lich.Resources.getInstance().mapObjectDefs[objectTile.mapKey];
            return Lich.Resources.getInstance().getMapObjectTileSprite(objDef.mapObjKey, objectTile.objTileX + objectTile.objTileY * objDef.mapSpriteWidth);
        };
        /**
         * Vrací, o kolik je možné scénu dále posouvat, aniž bych překonal její okraj
         */
        Render.prototype.limitShiftX = function (dst) {
            var self = this;
            // terén by přejel levý počátek směrem doprava (dst > 0)
            if (self.screenOffsetX + dst > 0)
                return -self.screenOffsetX;
            // terén by se odlepil od pravého konce směrem doleva (dst < 0)
            if (self.screenOffsetX + dst < self.game.getSceneWidth() - self.tilesMap.width * Lich.Resources.TILE_SIZE)
                return self.game.getSceneWidth() - self.tilesMap.width * Lich.Resources.TILE_SIZE - self.screenOffsetX;
            return dst;
        };
        /**
         * Vrací, o kolik je možné scénu dále posouvat, aniž bych překonal její okraj
         */
        Render.prototype.limitShiftY = function (dst) {
            var self = this;
            // terén by přejel horní počátek směrem dolů (dst > 0)
            if (self.screenOffsetY + dst > 0)
                return -self.screenOffsetY;
            // terén by se odlepil od spodního konce směrem nahoru (dst < 0)
            if (self.screenOffsetY + dst < self.game.getSceneHeight() - self.tilesMap.height * Lich.Resources.TILE_SIZE)
                return self.game.getSceneHeight() - self.tilesMap.height * Lich.Resources.TILE_SIZE - self.screenOffsetY;
            return dst;
        };
        Render.prototype.shiftSectorsBy = function (shiftX, shiftY) {
            var self = this;
            self.screenOffsetX += shiftX;
            self.screenOffsetY += shiftY;
            self.sectorsCont.children.forEach(function (sector) {
                sector.x += shiftX;
                sector.y += shiftY;
            });
            self.updateSectors();
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.MAP_SHIFT_X, self.screenOffsetX));
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.MAP_SHIFT_Y, self.screenOffsetY));
        };
        Render.prototype.markSector = function (sector) {
            var self = this;
            if (typeof self.sectorsToUpdate[sector.secId] === "undefined") {
                self.sectorsToUpdate[sector.secId] = new SectorUpdateRequest(sector, Lich.Resources.SECTOR_CACHE_COOLDOWN);
            }
        };
        ;
        Render.prototype.revealFog = function (x, y) {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            // tiles to sudé Parts
            var rx = Math.floor(coord.x / 2);
            var ry = Math.floor(coord.y / 2);
            var rsc = Lich.Resources.getInstance();
            var record = self.tilesMap.fogRecord;
            var fogInfo = self.getFogInfo();
            var revealed = record.getValue(rx, ry);
            if (!revealed) {
                record.setValue(rx, ry, true);
                Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.SURFACE_REVEAL, rx * 2, ry * 2));
            }
            return false;
        };
        Render.prototype.digSurface = function (rx, ry, bgr) {
            var self = this;
            var tilesToReset = [];
            var rsc = Lich.Resources.getInstance();
            var index, record, defs, sceneMap;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
                record = self.tilesMap.mapBgrRecord;
                defs = rsc.getSurfaceBgrDef.bind(rsc);
                sceneMap = self.sceneBgrTilesMap;
            }
            else {
                index = rsc.surfaceIndex;
                record = self.tilesMap.mapRecord;
                defs = rsc.getSurfaceDef.bind(rsc);
                sceneMap = self.sceneTilesMap;
            }
            var dugIndex = record.getValue(rx, ry);
            if (dugIndex != null && dugIndex > -1) {
                var surfaceType = index.getType(dugIndex);
                var objType = defs(surfaceType);
                self.onDigSurfaceListeners.forEach(function (fce) {
                    fce(objType, rx, ry);
                });
                (function () {
                    for (var x = rx - 1; x <= rx + 2; x++) {
                        for (var y = ry - 1; y <= ry + 2; y++) {
                            var val = record.getValue(x, y);
                            if (val != null) {
                                var sector = self.getSectorByTiles(x, y);
                                var srfcType = index.getType(val);
                                // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                                if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {
                                    // okraje vyresetuj
                                    if (val !== Lich.SurfacePositionKey.VOID) {
                                        var realType = srfcType;
                                        // pokud jde o přechodový povrch, musí se vyresetovat na původní hlavní povrch
                                        if (Lich.Resources.getInstance().surfaceIndex.isTransitionSrfc(val)) {
                                            var transVal = Lich.Resources.getInstance().surfaceIndex.getType(val);
                                            realType = Lich.Resources.getInstance().mapTransitionSrfcDefs[Lich.SurfaceKey[transVal]].diggableSrfc;
                                        }
                                        record.setValue(x, y, index.getPositionIndex(realType, Lich.SurfacePositionKey.M1));
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
                                    if (!bgr) {
                                        if (y === ry &&
                                            (index.isTopPosition(record.getValue(x, y)) ||
                                                index.isTopLeftPosition(record.getValue(x, y)) ||
                                                index.isTopRightPosition(record.getValue(x, y)))) {
                                            self.digObject(x, y - 1);
                                        }
                                    }
                                    record.setValue(x, y, Lich.SurfacePositionKey.VOID);
                                    var targetSector = self.getSectorByTiles(x, y);
                                    if (typeof targetSector !== "undefined" && targetSector !== null) {
                                        var child = sceneMap.getValue(x, y);
                                        targetSector.removeCacheableChild(child);
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
                this.mapReshape(tilesToReset, bgr);
                Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.SURFACE_CHANGE, rx, ry));
                return true;
            }
            return false;
        };
        Render.prototype.mapReshape = function (tilesToReset, bgr) {
            var self = this;
            var rsc = Lich.Resources.getInstance();
            var record;
            var sceneMap;
            var index;
            if (bgr) {
                record = self.tilesMap.mapBgrRecord;
                sceneMap = self.sceneBgrTilesMap;
                index = rsc.surfaceBgrIndex;
            }
            else {
                record = self.tilesMap.mapRecord;
                sceneMap = self.sceneTilesMap;
                index = rsc.surfaceIndex;
            }
            // Přegeneruj hrany
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    Lich.TilesMapTools.generateEdge(record, x, y, bgr);
                });
            })();
            // Přegeneruj rohy
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    Lich.TilesMapTools.generateCorner(record, x, y, bgr);
                });
            })();
            // Překresli dílky, které je potřeba změnit
            // odstraňování již bylo provedeno
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    // pokud už je alokován dílek na obrazovce, rovnou ho uprav
                    var tile = sceneMap.getValue(x, y);
                    var v = record.getValue(x, y);
                    if (tile) {
                        var type = index.getType(v);
                        // -1 protože v positions je i VOID, který ale ve sprite mapě není
                        var position = index.getPosition(v) - 1;
                        if (bgr) {
                            Lich.Resources.getInstance().getSurfaceBgrTileSprite(type, position, tile);
                        }
                        else {
                            Lich.Resources.getInstance().getSurfaceTileSprite(type, position, tile);
                        }
                    }
                });
            })();
        };
        Render.prototype.digObject = function (rx, ry, fireListeners) {
            if (fireListeners === void 0) { fireListeners = true; }
            var self = this;
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(rx, ry);
            if (objectElement !== null) {
                var objType = Lich.Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                var objWidth = objType.mapSpriteWidth;
                var objHeight = objType.mapSpriteHeight;
                // relativní pozice dílku v sheetu (od počátku sprite)
                var posx = objectElement.objTileX;
                var posy = objectElement.objTileY;
                if (fireListeners) {
                    self.onDigObjectListeners.forEach(function (fce) {
                        fce(objType, rx, ry);
                    });
                }
                self.tilesMap.mapObjRecord.setValue(rx - posx, ry - posy + objHeight, undefined);
                // projdi všechny okolní dílky, které patří danému objektu
                for (var x = 0; x < objWidth; x++) {
                    for (var y = 0; y < objHeight; y++) {
                        // globální souřadnice dílku v mapě
                        var globalX = rx - posx + x;
                        var globalY = ry - posy + y;
                        // odstraň dílek objektu ze sektoru
                        var object = self.sceneObjectsMap.getValue(globalX, globalY);
                        if (object != null) {
                            if ((object.parent instanceof Lich.SectorCont) == false) {
                                console.error("Assert error: SectorCont instance expected; instead " + (typeof object.parent) + " found!");
                            }
                            var sectorCont = object.parent;
                            self.markSector(sectorCont.sector);
                            object.parent.removeChild(object);
                            // odstraň dílek objektu z map
                            self.tilesMap.mapObjectsTiles.setValue(globalX, globalY, null);
                            self.sceneObjectsMap.setValue(globalX, globalY, null);
                        }
                    }
                }
                return true;
            }
            return false;
        };
        Render.prototype.interact = function (px, py) {
            var self = this;
            var coord = self.pixelsToTiles(px, py);
            var tx = Lich.Utils.even(coord.x);
            var ty = Lich.Utils.even(coord.y);
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(tx, ty);
            if (objectElement !== null) {
                var objType = Lich.Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                if (objType.rmbAction) {
                    objType.rmbAction(self.game, tx - objectElement.objTileX, 
                    // aby se to bralo/usazovalo za spodní řadu
                    ty - objectElement.objTileY + objType.mapSpriteHeight - 2, objectElement, objType);
                    return true;
                }
            }
            return false;
        };
        Render.prototype.dig = function (x, y, bgr) {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Lich.Utils.even(coord.x);
            var ry = Lich.Utils.even(coord.y);
            // kopl jsem do nějakého povrchu?
            if (bgr) {
                if (self.tilesMap.mapBgrRecord.getValue(rx, ry)) {
                    return self.digSurface(rx, ry, bgr);
                }
            }
            else {
                if (self.tilesMap.mapRecord.getValue(rx, ry) !== Lich.SurfacePositionKey.VOID) {
                    return self.digSurface(rx, ry, bgr);
                }
                else {
                    // kopl jsem do objektu?
                    return self.digObject(rx, ry);
                }
            }
            return false;
        };
        Render.prototype.placeSurface = function (rx, ry, surfaceType, bgr) {
            var self = this;
            var tilesToReset = [];
            var rsc = Lich.Resources.getInstance();
            var index, record, defs, sceneMap;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
                record = self.tilesMap.mapBgrRecord;
                defs = rsc.getSurfaceBgrDef.bind(rsc);
                sceneMap = self.sceneBgrTilesMap;
            }
            else {
                index = rsc.surfaceIndex;
                record = self.tilesMap.mapRecord;
                defs = rsc.getSurfaceDef.bind(rsc);
                sceneMap = self.sceneTilesMap;
            }
            // rx a ry jsou vždy sudé (horní levá tile z part)
            // proto stačí překreslit -1 zpět ale +2 dopředu
            (function () {
                for (var x = rx - 1; x <= rx + 2; x++) {
                    for (var y = ry - 1; y <= ry + 2; y++) {
                        var val = record.getValue(x, y);
                        if (val != null ||
                            (bgr && x > 0 && x < Lich.TilesMapGenerator.DEFAULT_MAP_WIDTH
                                && y > 0 && y < Lich.TilesMapGenerator.DEFAULT_MAP_HEIGHT)) {
                            var sector = self.getSectorByTiles(x, y);
                            // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                            if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {
                                var srfcType = index.getType(val);
                                // okraje vyresetuj (pokud nejsou středy)
                                if (val !== Lich.SurfacePositionKey.VOID && val != null) {
                                    record.setValue(x, y, index.getMiddlePositionIndexByCoordPattern(x, y, srfcType));
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
                                var posIndex = index.getMiddlePositionIndexByCoordPattern(x, y, surfaceType);
                                record.setValue(x, y, posIndex);
                                tilesToReset.push([x, y]);
                                var targetSector = self.getSectorByTiles(x, y);
                                // vytvoř dílek
                                var tile = self.createTile(posIndex, bgr);
                                // přidej dílek do sektoru
                                sector.addCacheableChild(tile);
                                tile.x = (x % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                tile.y = (y % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                                // přidej dílek do globální mapy
                                sceneMap.setValue(x, y, tile);
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
            this.mapReshape(tilesToReset, bgr);
            Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.SURFACE_CHANGE, rx, ry));
        };
        Render.prototype.placeObject = function (tx0, ty0, mapObj) {
            var self = this;
            // musí se posunout dolů o object.mapObj.mapSpriteHeight,
            // protože objekty se počítají počátkem levého SPODNÍHO rohu 
            Lich.TilesMapTools.writeObjectRecord(self.tilesMap, tx0, ty0 + 2, mapObj);
            // objekty se "pokládají", takže se počítá posuv o výšku
            // stále ale musí být na poklik dostupné poslední spodní 
            // řádkou dílků (vše je po dvou kostkách), takže +2
            ty0 = ty0 - mapObj.mapSpriteHeight + 2;
            // Sheet index dílku objektu
            for (var tx = 0; tx < mapObj.mapSpriteWidth; tx++) {
                for (var ty = 0; ty < mapObj.mapSpriteHeight; ty++) {
                    var objectTile = new Lich.MapObjectTile(mapObj.mapObjKey, tx, ty);
                    var tile = self.createObject(objectTile);
                    var sector = self.getSectorByTiles(tx0 + tx, ty0 + ty);
                    // přidej dílek do sektoru
                    if (tile instanceof PIXI.extras.AnimatedSprite) {
                        sector.addAnimatedChild(tile);
                    }
                    else {
                        sector.addCacheableChild(tile);
                    }
                    tile.x = ((tx0 + tx) % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                    tile.y = ((ty0 + ty) % Lich.Resources.SECTOR_SIZE) * Lich.Resources.TILE_SIZE;
                    // Přidej objekt do globální mapy objektů
                    self.sceneObjectsMap.setValue(tx0 + tx, ty0 + ty, tile);
                    self.markSector(sector);
                }
            }
        };
        Render.prototype.isForegroundFree = function (rx, ry, mapObj) {
            if (mapObj) {
                for (var x = 0; x < mapObj.mapSpriteWidth; x += 2) {
                    for (var y = 0; y < mapObj.mapSpriteHeight; y += 2) {
                        // je vkládáno odspoda
                        if (this.isForegroundFree(rx + x, ry - y) == false)
                            return false;
                    }
                }
                return true;
            }
            else {
                return this.tilesMap.mapRecord.getValue(rx, ry) == Lich.SurfacePositionKey.VOID && this.tilesMap.mapObjectsTiles.getValue(rx, ry) === null;
            }
        };
        /**
         * Pokusí se umístit objekt nebo povrch na pixel souřadnice a vrátí true,
         * pokud se to podařilo
         */
        Render.prototype.place = function (x, y, object, alternative) {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Lich.Utils.even(coord.x);
            var ry = Lich.Utils.even(coord.y);
            // pokud je co vkládat
            if (typeof object !== "undefined") {
                // jde o objekt
                if (object.mapObj != null) {
                    // zohledni, zda je o alternativu nebo původní variantu objektu
                    var mapObj = void 0;
                    if (alternative && object.mapObjAlternative) {
                        mapObj = object.mapObjAlternative;
                    }
                    else {
                        mapObj = object.mapObj;
                    }
                    // pokud je místo prázdné a bez objektu (v celé velikosti objektu), lze vložit objekt
                    if (self.isForegroundFree(rx, ry, mapObj)) {
                        this.placeObject(rx, ry, mapObj);
                        return true;
                    }
                }
                // jde o povrch 
                if (object.mapSurface != null && alternative == false) {
                    // pokud je místo prázdné a bez objektu, lze vkládat povrchy
                    if (self.isForegroundFree(rx, ry)) {
                        this.placeSurface(rx, ry, object.mapSurface.mapObjKey, false);
                        return true;
                    }
                }
                // jde o pozadí povrchu 
                if (object.mapSurfaceBgr != null && alternative) {
                    // pokud je místo bez pozadí, lze vkládat pozadí povrchu
                    if (!self.tilesMap.mapBgrRecord.getValue(rx, ry)) {
                        this.placeSurface(rx, ry, object.mapSurfaceBgr.mapObjKey, true);
                        return true;
                    }
                }
            }
            return false;
        };
        Render.prototype.handleTick = function () {
            var self = this;
            for (var i = 0; i < self.sectorsToUpdate.length; i++) {
                var item = self.sectorsToUpdate.pop();
                if (typeof item !== "undefined") {
                    item.sector.cache();
                }
            }
        };
        Render.prototype.addOnDigObjectListener = function (f) {
            var self = this;
            self.onDigObjectListeners.push(f);
        };
        Render.prototype.addOnDigSurfaceListener = function (f) {
            var self = this;
            self.onDigSurfaceListeners.push(f);
        };
        // Math.ceil(x)-1 není to samé jako Math.floor(x)
        Render.prototype.pixelsDistanceToTiles = function (x) {
            return Math.floor(x / Lich.Resources.TILE_SIZE);
        };
        Render.prototype.pixelsDistanceToEvenTiles = function (x) {
            return Lich.Utils.even(this.pixelsDistanceToTiles(x));
        };
        Render.prototype.pixelsToTiles = function (x, y) {
            // tiles souřadnice z pixel souřadnic
            var tileX = Math.floor((x + -this.screenOffsetX) / Lich.Resources.TILE_SIZE);
            var tileY = Math.floor((y + -this.screenOffsetY) / Lich.Resources.TILE_SIZE);
            // offset v rámci part
            var partOffsetX = Math.floor((x + -this.screenOffsetX) % Lich.Resources.PARTS_SIZE);
            var partOffsetY = Math.floor((y + -this.screenOffsetY) % Lich.Resources.PARTS_SIZE);
            return new Lich.Coord2D(tileX, tileY, partOffsetX, partOffsetY);
        };
        Render.prototype.pixelsToEvenTiles = function (x, y) {
            var coord = this.pixelsToTiles(x, y);
            coord.x = Lich.Utils.even(coord.x);
            coord.y = Lich.Utils.even(coord.y);
            return coord;
        };
        Render.prototype.tilesToPixel = function (x, y) {
            var self = this;
            var screenX = x * Lich.Resources.TILE_SIZE + self.screenOffsetX;
            var screenY = y * Lich.Resources.TILE_SIZE + self.screenOffsetY;
            return new Lich.Coord2D(screenX, screenY);
        };
        // dle souřadnic tiles spočítá souřadnici sektoru
        Render.prototype.getSectorByTiles = function (x, y) {
            var self = this;
            var sx = Math.floor(x / Lich.Resources.SECTOR_SIZE);
            var sy = Math.floor(y / Lich.Resources.SECTOR_SIZE);
            return self.sectorsMap.getValue(sx, sy);
        };
        return Render;
    }());
    Lich.Render = Render;
})(Lich || (Lich = {}));
