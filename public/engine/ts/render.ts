
/**
 * render.js 
 * 
 * Stará se o vykreslování, cachování a preload oblastí scény 
 * 
 */
namespace Lich {

    class SectorUpdateRequest {
        constructor(public sector: Sector, public cooldown: number) { }
    }

    class FogSectorUpdateRequest {
        constructor(public fogSector: FogSector, public cooldown: number) { }
    }

    export class Render {

        // Velikost sektoru v dílcích
        static FOG_SECTOR_SIZE = 8; // Musí být sudé
        static SECTOR_SIZE = Render.FOG_SECTOR_SIZE * 2;
        // kolik překreslení se po změně nebude cachovat, protože 
        // je dost pravděpodobné, že se bude ještě měnit?
        static SECTOR_CACHE_COOLDOWN = 5;
        // Počet okrajových sektorů, které nejsou zobrazeny,
        // ale jsou alokovány (pro plynulé posuny)
        static BUFFER_SECTORS_X = 1;
        static BUFFER_SECTORS_Y = 1;

        onDigObjectListeners = new Array<(objType: Diggable, x: number, y: number) => any>();
        onDigSurfaceListeners = new Array<(objType: Diggable, x: number, y: number) => any>();

        // aktuální posuv mapy v px
        screenOffsetX = 0;
        screenOffsetY = 0;

        // souřadnice aktuálního sektorového "okna" v půlsektorech
        currentStartHalfSecX = null;
        currentStartHalfSecY = null;
        sectorsToUpdate = new Array<SectorUpdateRequest>();
        fogSectorsToUpdate = new Array<FogSectorUpdateRequest>();
        // Kontejnery na sektory
        sectorsCont: SheetContainer;
        fogSectorsCont: SheetContainer;
        // Mapy sektorů
        sectorsMap = new Array2D<Sector>();
        fogSectorsMap = new Array2D<FogSector>();
        // Mapa dílků
        tilesMap: TilesMap;
        // Vykreslené dílky povrchu a pozadí
        sceneTilesMap = new Array2D<createjs.Sprite>();
        sceneBgrTilesMap = new Array2D<createjs.Sprite>();
        sceneFogTilesMap = new Array2D<createjs.Sprite>();
        // Vykreslené dílky objektů
        sceneObjectsMap = new Array2D<createjs.Sprite>();

        constructor(public game: Game, public world: World) {
            var self = this;
            self.tilesMap = world.tilesMap;
            self.sectorsCont = world.tilesSectorsCont;
            self.fogSectorsCont = world.fogSectorsCont;

            // vytvoř sektory dle aktuálního záběru obrazovky
            self.updateSectors();
        }

        getScreenOffsetX() {
            return this.screenOffsetX;
        }

        getScreenOffsetY() {
            return this.screenOffsetY;
        }

        // zkoumá, zda je potřeba přealokovat sektory 
        updateSectors() {
            let self = this;

            let maxSecCountX = Math.ceil(self.tilesMap.width / Render.SECTOR_SIZE);
            let maxSecCountY = Math.ceil(self.tilesMap.height / Render.SECTOR_SIZE);

            // Pokud jsem úplně vlevo, vykresluj od X sektoru 0
            let startSecX = 0;
            let halfStartSecX = 0;
            let applyXdither = false;
            let oddXdither = false;
            if (self.screenOffsetX < 0) {
                // Pokud došlo k nějakému posunu doprava, zjisti kolik sektorů by se do tohoto posuvu vešlo
                // půlsektory pro dither
                halfStartSecX = Math.floor(-1 * self.screenOffsetX / (Render.SECTOR_SIZE / 2 * Resources.TILE_SIZE));
                oddXdither = halfStartSecX % 2 == 0;
                startSecX = Math.floor(halfStartSecX / 2);
                // Vždy ponech BUFFER_SECTORS_X sektorů za sebou neodalokovaných, aby nedocházelo k výpadkům
                // a aby mapa vždy měla předpřipravené sektory ve směru pohybu
                startSecX = startSecX >= Render.BUFFER_SECTORS_X ? startSecX - Render.BUFFER_SECTORS_X : startSecX;
                applyXdither = startSecX != 0;
            }
            let countSectX = Math.floor(self.sectorsCont.width / (Render.SECTOR_SIZE * Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_X + 2;
            applyXdither = applyXdither && startSecX + countSectX != maxSecCountX;

            // Pokud jsem úplně nahoře, vykresluj od Y sektoru 0
            let startSecY = 0;
            let halfStartSecY = 0;
            let applyYdither = false;
            let oddYdither = false;
            if (self.screenOffsetY < 0) {
                // Pokud došlo k nějakému posunu dolů, zjisti kolik sektorů by se do tohoto posuvu vešlo
                // půlsektory pro dither
                halfStartSecY = Math.floor(-1 * self.screenOffsetY / (Render.SECTOR_SIZE / 2 * Resources.TILE_SIZE));
                oddYdither = halfStartSecY % 2 == 0;
                startSecY = Math.floor(halfStartSecY / 2);
                // Vždy ponech BUFFER_SECTORS_Y sektorů za sebou neodalokovaných, aby nedocházelo k výpadkům
                // a aby mapa vždy měla předpřipravené sektory ve směru pohybu
                startSecY = startSecY >= Render.BUFFER_SECTORS_Y ? startSecY - Render.BUFFER_SECTORS_Y : startSecY;
                applyYdither = startSecY != 0;
            }
            let countSectY = Math.floor(self.sectorsCont.height / (Render.SECTOR_SIZE * Resources.TILE_SIZE)) + Render.BUFFER_SECTORS_Y + 2;
            applyYdither = applyYdither && startSecY + countSectY != maxSecCountY;

            // změnilo se něco? Pokud není potřeba pře-alokovávat sektory, ukonči fci
            if (self.currentStartHalfSecX === halfStartSecX && self.currentStartHalfSecY === halfStartSecY)
                return;

            // změnit stavy
            self.currentStartHalfSecX = halfStartSecX;
            self.currentStartHalfSecY = halfStartSecY;

            // projdi sektory, nepoužité dealokuj, nové naplň
            for (let x = 0; x < maxSecCountX; x++) {
                for (let y = 0; y < maxSecCountY; y++) {

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

                            let sector = new Sector(
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

                            let fogSector = new FogSector(y * maxSecCountX + x,
                                x,
                                y,
                                Render.FOG_SECTOR_SIZE * Resources.PARTS_SIZE,
                                Render.FOG_SECTOR_SIZE * Resources.PARTS_SIZE);
                            fogSector.x = sector.x;
                            fogSector.y = sector.y;
                            self.fogSectorsCont.addChild(fogSector);
                            self.fogSectorsMap.setValue(x, y, fogSector);

                            // vytvoř jednotlivé dílky
                            for (let mx = x * Render.FOG_SECTOR_SIZE; mx < (x + 1) * Render.FOG_SECTOR_SIZE; mx++) {
                                for (let my = y * Render.FOG_SECTOR_SIZE; my < (y + 1) * Render.FOG_SECTOR_SIZE; my++) {

                                    // vytvoř na dané souřadnici dílky mlhy
                                    let fogElement = self.tilesMap.fogTree.getValue(mx, my);
                                    if (!fogElement || fogElement != FogTile.I_MM) {
                                        // vytvoř dílek
                                        let fogTile = self.createFogTile(fogElement);

                                        // přidej dílek do sektoru
                                        fogSector.addChild(fogTile);
                                        fogTile.x = (mx % Render.FOG_SECTOR_SIZE) * Resources.PARTS_SIZE;
                                        fogTile.y = (my % Render.FOG_SECTOR_SIZE) * Resources.PARTS_SIZE;

                                        // přidej dílek do globální mapy
                                        self.sceneFogTilesMap.setValue(mx, my, fogTile);
                                    }
                                }
                            }

                            // vytvoř jednotlivé dílky
                            for (let mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (let my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {

                                    // vytvoř na dané souřadnici dílky pozadí povrchu
                                    let bgrElement = self.tilesMap.mapBgrRecord.getValue(mx, my);
                                    if (bgrElement > 0) {
                                        // vytvoř dílek
                                        let tile = self.createTile(bgrElement, true);

                                        // přidej dílek do sektoru
                                        sector.addBackgroundChild(tile);
                                        tile.x = (mx % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                        tile.y = (my % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                                        // přidej dílek do globální mapy
                                        self.sceneBgrTilesMap.setValue(mx, my, tile);
                                    }

                                    // vytvoř na dané souřadnici dílky povrchu
                                    let tileElement = self.tilesMap.mapRecord.getValue(mx, my);
                                    if (tileElement > 0) {
                                        // vytvoř dílek
                                        let tile = self.createTile(tileElement, false);

                                        // přidej dílek do sektoru
                                        sector.addCacheableChild(tile);
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
                                            sector.addCacheableChild(object);
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
                                // var testShape = new createjs.Shape();
                                // testShape.graphics.setStrokeStyle(1);
                                // testShape.graphics.beginStroke("#f00");
                                // testShape.graphics.drawRect(0, 0, sector.width, sector.height);
                                // sector.addChild(testShape);

                                // testShape = new createjs.Shape();
                                // testShape.graphics.setStrokeStyle(1);
                                // testShape.graphics.beginStroke("#f00");
                                // testShape.graphics.drawRect(0, 0, fogSector.width, fogSector.height);
                                // fogSector.addChild(testShape);
                            }

                            // proveď cache na sektoru
                            // sector.cache(0, 0, sector.width, sector.height);
                            // fogSector.cache(0, 0, fogSector.width, fogSector.height);

                            if (Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Alokován sektor: " + x + ":" + y);
                            }
                        }
                    } else {
                        // neplatný sektor
                        // pokud je obsazeno dealokuj
                        if (self.sectorsMap.getValue(x, y) != null) {

                            // vymaž objekty
                            for (let mx = x * Render.SECTOR_SIZE; mx < (x + 1) * Render.SECTOR_SIZE; mx++) {
                                for (let my = y * Render.SECTOR_SIZE; my < (y + 1) * Render.SECTOR_SIZE; my++) {
                                    self.sceneObjectsMap.setValue(mx, my, null);
                                }
                            }

                            // vymaž sektor
                            let ss = self.sectorsMap.getValue(x, y);
                            ss.removeAllChildren();
                            self.sectorsCont.removeChild(ss);
                            self.sectorsMap.setValue(x, y, null);

                            // vymaž mlhu
                            let fs = self.fogSectorsMap.getValue(x, y);
                            fs.removeAllChildren();
                            self.fogSectorsCont.removeChild(fs);
                            self.fogSectorsMap.setValue(x, y, null);

                            if (Resources.PRINT_SECTOR_ALLOC) {
                                console.log("Dealokován sektor: " + x + ":" + y);
                            }

                        }
                    }

                }
            }

        }

        createFogTile(positionIndex: number) {
            var self = this;
            let rsc = Resources.getInstance();
            let tile = rsc.getFogSprite(positionIndex);
            return tile;
        }

        createTile(positionIndex: number, bgr: boolean) {
            var self = this;
            let rsc = Resources.getInstance();
            let typ, tile;
            if (bgr) {
                typ = rsc.surfaceBgrIndex.getType(positionIndex);
                let v = Resources.getInstance().surfaceBgrIndex.getPosition(positionIndex);
                tile = rsc.getSurfaceBgrTileSprite(typ, v - 1);
            } else {
                typ = rsc.surfaceIndex.getType(positionIndex);
                let v = Resources.getInstance().surfaceIndex.getPosition(positionIndex);
                tile = rsc.getSurfaceTileSprite(typ, v - 1);
            }
            return tile;
        }

        createObject(objectTile: MapObjectTile) {
            var self = this;
            var objDef: MapObjDefinition = Resources.getInstance().mapObjectDefs[objectTile.mapKey];
            return Resources.getInstance().getMapObjectTileSprite(objDef.mapObjKey, objectTile.objTileX + objectTile.objTileY * objDef.mapSpriteWidth);
        }

        /**
         * Vrací, o kolik je možné scénu dále posouvat, aniž bych překonal její okraj
         */
        limitShiftX(dst: number): number {
            var self = this;
            // terén by přejel levý počátek směrem doprava (dst > 0)
            if (self.screenOffsetX + dst > 0)
                return -self.screenOffsetX;
            // terén by se odlepil od pravého konce směrem doleva (dst < 0)
            if (self.screenOffsetX + dst < self.game.getCanvas().width - self.tilesMap.width * Resources.TILE_SIZE)
                return self.game.getCanvas().width - self.tilesMap.width * Resources.TILE_SIZE - self.screenOffsetX;
            return dst;
        }

        /**
         * Vrací, o kolik je možné scénu dále posouvat, aniž bych překonal její okraj
         */
        limitShiftY(dst: number): number {
            var self = this;
            // terén by přejel horní počátek směrem dolů (dst > 0)
            if (self.screenOffsetY + dst > 0)
                return -self.screenOffsetY;
            // terén by se odlepil od spodního konce směrem nahoru (dst < 0)
            if (self.screenOffsetY + dst < self.game.getCanvas().height - self.tilesMap.height * Resources.TILE_SIZE)
                return self.game.getCanvas().height - self.tilesMap.height * Resources.TILE_SIZE - self.screenOffsetY;
            return dst;
        }

        shiftSectorsBy(shiftX: number, shiftY: number) {
            var self = this;
            self.screenOffsetX += shiftX;
            self.screenOffsetY += shiftY;
            self.sectorsCont.children.forEach(function (sector) {
                sector.x += shiftX;
                sector.y += shiftY;
            });
            self.fogSectorsCont.children.forEach(function (fogSector) {
                fogSector.x += shiftX;
                fogSector.y += shiftY;
            });
            self.updateSectors();
            EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.MAP_SHIFT_X, self.screenOffsetX));
            EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.MAP_SHIFT_Y, self.screenOffsetY));
        }

        markFogSector(fogSector: FogSector) {
            var self = this;
            if (typeof self.fogSectorsToUpdate[fogSector.secId] === "undefined") {
                self.fogSectorsToUpdate[fogSector.secId] = new FogSectorUpdateRequest(fogSector, Render.SECTOR_CACHE_COOLDOWN);
            }
        };

        markSector(sector: Sector) {
            var self = this;
            if (typeof self.sectorsToUpdate[sector.secId] === "undefined") {
                self.sectorsToUpdate[sector.secId] = new SectorUpdateRequest(sector, Render.SECTOR_CACHE_COOLDOWN);
            }
        };

        revealFog(x, y): boolean {
            let self = this;
            var coord = self.pixelsToTiles(x, y);
            // tiles to sudé Parts
            var rx = 2 * Math.floor(coord.x / 4);
            var ry = 2 * Math.floor(coord.y / 4);
            let fogTilesToReset = [];

            let rsc = Resources.getInstance();
            let record = self.tilesMap.fogTree;

            let fogIndex = record.getValue(rx, ry);
            if (fogIndex != FogTile.I_MM) {

                let sceneMap = self.sceneFogTilesMap;

                (function () {
                    for (let x = rx - 1; x <= rx + 2; x++) {
                        for (let y = ry - 1; y <= ry + 2; y++) {
                            let val = record.getValue(x, y);
                            if (val != FogTile.I_MM) {
                                let fogSector = self.getFogSectorByParts(x, y);

                                // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                                if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {

                                    // okraje vyresetuj
                                    record.setValue(x, y, FogTile.MM);
                                    fogTilesToReset.push([x, y]);

                                    // zjisti sektor dílku, aby byl přidán do fronty 
                                    // ke cache update (postačí to udělat dle tilesToReset,
                                    // protože to jsou okrajové dílky z oblasti změn)
                                    if (typeof fogSector !== "undefined" && fogSector !== null) {
                                        self.markFogSector(fogSector);
                                    }

                                } else {
                                    record.setValue(x, y, FogTile.I_MM);
                                    if (typeof fogSector !== "undefined" && fogSector !== null) {
                                        var child = sceneMap.getValue(x, y);
                                        fogSector.removeChild(child);
                                        self.markFogSector(fogSector);
                                    }
                                }
                            }
                        }
                    }
                })();

                // Přegeneruj hrany
                fogTilesToReset.forEach(function (item) {
                    let x = item[0];
                    let y = item[1];
                    let val = record.getValue(x, y);
                    if (val == FogTile.I_MM)
                        return;
                    let valT = record.getValue(x, y - 1);
                    let valR = record.getValue(x + 1, y);
                    let valB = record.getValue(x, y + 1);
                    let valL = record.getValue(x - 1, y);

                    let targetVal: FogTile;
                    if (valT == FogTile.I_MM) targetVal = FogTile.TT;
                    if (valR == FogTile.I_MM) targetVal = FogTile.RR;
                    if (valB == FogTile.I_MM) targetVal = FogTile.BB;
                    if (valL == FogTile.I_MM) targetVal = FogTile.LL;
                    if (targetVal)
                        record.setValue(x, y, targetVal);
                });

                // Přegeneruj rohy
                fogTilesToReset.forEach(function (item) {
                    let x = item[0];
                    let y = item[1];
                    let val = record.getValue(x, y);
                    if (val == FogTile.I_MM)
                        return;
                    let valT = record.getValue(x, y - 1);
                    let valR = record.getValue(x + 1, y);
                    let valB = record.getValue(x, y + 1);
                    let valL = record.getValue(x - 1, y);

                    if (!val || val == FogTile.MM) {
                        // jsem levý horní roh díry
                        if (valB == FogTile.RR && valR == FogTile.BB) record.setValue(x, y, FogTile.I_TL);
                        // jsem pravý horní roh díry
                        if (valL == FogTile.BB && valB == FogTile.LL) record.setValue(x, y, FogTile.I_TR);
                        // levý spodní roh díry
                        if (valT == FogTile.RR && valR == FogTile.TT) record.setValue(x, y, FogTile.I_BL);
                        // pravý spodní roh díry
                        if (valT == FogTile.LL && valL == FogTile.TT) record.setValue(x, y, FogTile.I_BR);
                        return;
                    }

                    if (val == FogTile.LL && (valT == FogTile.I_MM || valR == FogTile.TT)
                        || val == FogTile.TT && (valL == FogTile.I_MM || valB == FogTile.LL)) record.setValue(x, y, FogTile.TL);
                    if (val == FogTile.TT && (valR == FogTile.I_MM || valB == FogTile.RR)
                        || val == FogTile.RR && (valT == FogTile.I_MM || valL == FogTile.TT)) record.setValue(x, y, FogTile.TR);
                    if (val == FogTile.RR && (valB == FogTile.I_MM || valL == FogTile.BB)
                        || val == FogTile.BB && (valR == FogTile.I_MM || valT == FogTile.RR)) record.setValue(x, y, FogTile.BR);
                    if (val == FogTile.BB && (valL == FogTile.I_MM || valT == FogTile.LL)
                        || val == FogTile.LL && (valB == FogTile.I_MM || valR == FogTile.BB)) record.setValue(x, y, FogTile.BL);
                });

                // Překresli dílky
                fogTilesToReset.forEach(function (item) {
                    let x = item[0];
                    let y = item[1];
                    // pokud už je alokován dílek na obrazovce, rovnou ho uprav
                    let tile = sceneMap.getValue(x, y);
                    if (tile !== null) {
                        let v = record.getValue(x, y);
                        Resources.getInstance().getFogSprite(v, tile);
                    }
                });

                EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.SURFACE_REVEAL, rx * 2, ry * 2));

                return true;
            }
            return false;
        }

        digSurface(rx, ry, bgr: boolean): boolean {
            var self = this;
            var tilesToReset = [];

            let rsc = Resources.getInstance();
            let index, record, defs: (any), sceneMap;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
                record = self.tilesMap.mapBgrRecord;
                defs = rsc.getSurfaceBgrDef.bind(rsc);
                sceneMap = self.sceneBgrTilesMap;
            } else {
                index = rsc.surfaceIndex;
                record = self.tilesMap.mapRecord;
                defs = rsc.getSurfaceDef.bind(rsc);
                sceneMap = self.sceneTilesMap;
            }

            var dugIndex = record.getValue(rx, ry);
            if (dugIndex != null && dugIndex > -1) {
                var surfaceType = index.getType(dugIndex);
                var objType: Diggable = defs(surfaceType);

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
                                    if (val !== SurfacePositionKey.VOID) {
                                        let realType = srfcType;
                                        // pokud jde o přechodový povrch, musí se vyresetovat na původní hlavní povrch
                                        if (Resources.getInstance().surfaceIndex.isTransitionSrfc(val)) {
                                            let transVal = Resources.getInstance().surfaceIndex.getType(val);
                                            realType = Resources.getInstance().mapTransitionSrfcDefs[SurfaceKey[transVal]].diggableSrfc;
                                        }
                                        record.setValue(x, y, index.getPositionIndex(realType, SurfacePositionKey.M1));
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
                                    if (!bgr) {
                                        if (y === ry &&
                                            (index.isTopPosition(record.getValue(x, y)) ||
                                                index.isTopLeftPosition(record.getValue(x, y)) ||
                                                index.isTopRightPosition(record.getValue(x, y)))) {
                                            self.digObject(x, y - 1);
                                        }
                                    }

                                    record.setValue(x, y, SurfacePositionKey.VOID);
                                    var targetSector = self.getSectorByTiles(x, y);
                                    if (typeof targetSector !== "undefined" && targetSector !== null) {
                                        var child = sceneMap.getValue(x, y);
                                        if (!bgr) {
                                            if (child instanceof createjs.Sprite) {
                                                targetSector.removeAnimatedChild(child);
                                            } else {
                                                targetSector.removeCacheableChild(child);
                                            }
                                        } else {
                                            targetSector.removeBackgroundChild(child);
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

                this.mapReshape(tilesToReset, bgr);
                EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.SURFACE_CHANGE, rx, ry));

                return true;
            }
            return false;

        }

        mapReshape(tilesToReset: Array<[number, number]>, bgr: boolean) {
            var self = this;

            let rsc = Resources.getInstance();
            let record, sceneMap, index;
            if (bgr) {
                record = self.tilesMap.mapBgrRecord;
                sceneMap = self.sceneBgrTilesMap;
                index = rsc.surfaceBgrIndex;
            } else {
                record = self.tilesMap.mapRecord;
                sceneMap = self.sceneTilesMap;
                index = rsc.surfaceIndex;
            }

            // Přegeneruj hrany
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    TilesMapTools.generateEdge(record, x, y, bgr);
                });
            })();

            // Přegeneruj rohy
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    TilesMapTools.generateCorner(record, x, y, bgr);
                });
            })();

            // Překresli dílky
            (function () {
                tilesToReset.forEach(function (item) {
                    var x = item[0];
                    var y = item[1];
                    // pokud už je alokován dílek na obrazovce, rovnou ho uprav
                    var tile = sceneMap.getValue(x, y);
                    if (tile !== null) {
                        var v = record.getValue(x, y);
                        let type = index.getType(v);
                        if (bgr) {
                            Resources.getInstance().getSurfaceBgrTileSprite(type, v, tile);
                        } else {
                            Resources.getInstance().getSurfaceTileSprite(type, v, tile);
                        }
                    }
                });
            })();
        }

        digObject(rx, ry, fireListeners = true): boolean {
            var self = this;
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(rx, ry);
            if (objectElement !== null) {
                var objType: MapObjDefinition = Resources.getInstance().mapObjectDefs[objectElement.mapKey];
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
                            if ((object.parent.parent instanceof Sector) == false) {
                                console.log("Assert error: Sector instance expected; instead " + (typeof object.parent.parent) + " found!");
                            }
                            var sectorParent = <Sector>object.parent.parent;
                            self.markSector(sectorParent);
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
        }

        interact(px: number, py: number): boolean {
            var self = this;
            var coord = self.pixelsToTiles(px, py);
            var tx = Utils.even(coord.x);
            var ty = Utils.even(coord.y);

            var objectElement = self.tilesMap.mapObjectsTiles.getValue(tx, ty);
            if (objectElement !== null) {
                var objType: MapObjDefinition = Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                if (objType.rmbAction) {
                    objType.rmbAction(self.game,
                        tx - objectElement.objTileX,
                        // aby se to bralo/usazovalo za spodní řadu
                        ty - objectElement.objTileY + objType.mapSpriteHeight - 2,
                        objectElement, objType);
                    return true;
                }
            }
            return false;
        }

        dig(x: number, y: number, bgr: boolean): boolean {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Utils.even(coord.x);
            var ry = Utils.even(coord.y);

            // kopl jsem do nějakého povrchu?
            if (bgr) {
                if (self.tilesMap.mapBgrRecord.getValue(rx, ry)) {
                    return self.digSurface(rx, ry, bgr);
                }
            } else {
                if (self.tilesMap.mapRecord.getValue(rx, ry) !== SurfacePositionKey.VOID) {
                    return self.digSurface(rx, ry, bgr);
                } else {
                    // kopl jsem do objektu?
                    return self.digObject(rx, ry);
                }
            }
            return false;
        }

        placeSurface(rx, ry, surfaceType: SurfaceKey | SurfaceBgrKey, bgr: boolean) {
            var self = this;
            var tilesToReset = [];

            let rsc = Resources.getInstance();
            let index, record, defs: (any), sceneMap;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
                record = self.tilesMap.mapBgrRecord;
                defs = rsc.getSurfaceBgrDef.bind(rsc);
                sceneMap = self.sceneBgrTilesMap;
            } else {
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
                            (bgr && x > 0 && x < TilesMapGenerator.DEFAULT_MAP_WIDTH
                                && y > 0 && y < TilesMapGenerator.DEFAULT_MAP_HEIGHT)) {
                            var sector = self.getSectorByTiles(x, y);

                            // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                            if (x === rx - 1 || x === rx + 2 || y === ry - 1 || y === ry + 2) {

                                var srfcType = index.getType(val);

                                // okraje vyresetuj (pokud nejsou středy)
                                if (val !== SurfacePositionKey.VOID && val != null) {
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
                            // pokud jsem vnitřní část výběru, vytvoř nové dílky
                            else {
                                var posIndex = index.getMiddlePositionIndexByCoordPattern(x, y, surfaceType);
                                record.setValue(x, y, posIndex);
                                tilesToReset.push([x, y]);

                                var targetSector = self.getSectorByTiles(x, y);

                                // vytvoř dílek
                                var tile = self.createTile(posIndex, bgr);

                                // přidej dílek do sektoru
                                if (bgr) {
                                    sector.addBackgroundChild(tile);
                                } else {
                                    sector.addCacheableChild(tile);
                                }
                                tile.x = (x % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                                tile.y = (y % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

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

            EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.SURFACE_CHANGE, rx, ry));
        }

        placeObject(tx0, ty0, mapObj: MapObjDefinition) {
            var self = this;
            // musí se posunout dolů o object.mapObj.mapSpriteHeight,
            // protože objekty se počítají počátkem levého SPODNÍHO rohu 
            TilesMapTools.writeObjectRecord(self.tilesMap, tx0, ty0 + 2, mapObj);
            // objekty se "pokládají", takže se počítá posuv o výšku
            // stále ale musí být na poklik dostupné poslední spodní 
            // řádkou dílků (vše je po dvou kostkách), takže +2
            ty0 = ty0 - mapObj.mapSpriteHeight + 2;
            // Sheet index dílku objektu
            for (var tx = 0; tx < mapObj.mapSpriteWidth; tx++) {
                for (var ty = 0; ty < mapObj.mapSpriteHeight; ty++) {
                    var objectTile = new MapObjectTile(mapObj.mapObjKey, tx, ty);
                    var tile = self.createObject(objectTile);

                    var sector = self.getSectorByTiles(tx0 + tx, ty0 + ty);

                    // přidej dílek do sektoru
                    if (tile instanceof createjs.Sprite) {
                        sector.addAnimatedChild(tile);
                    } else {
                        sector.addCacheableChild(tile);
                    }
                    tile.x = ((tx0 + tx) % Render.SECTOR_SIZE) * Resources.TILE_SIZE;
                    tile.y = ((ty0 + ty) % Render.SECTOR_SIZE) * Resources.TILE_SIZE;

                    // Přidej objekt do globální mapy objektů
                    self.sceneObjectsMap.setValue(tx0 + tx, ty0 + ty, tile);
                    self.markSector(sector);
                }
            }
        }

        private isForegroundFree(rx: number, ry: number, mapObj?: MapObjDefinition): boolean {
            if (mapObj) {
                for (let x = 0; x < mapObj.mapSpriteWidth; x += 2) {
                    for (let y = 0; y < mapObj.mapSpriteHeight; y += 2) {
                        // je vkládáno odspoda
                        if (this.isForegroundFree(rx + x, ry - y) == false) return false;
                    }
                }
                return true;
            } else {
                return this.tilesMap.mapRecord.getValue(rx, ry) == SurfacePositionKey.VOID && this.tilesMap.mapObjectsTiles.getValue(rx, ry) === null;
            }
        }

        /**
         * Pokusí se umístit objekt nebo povrch na pixel souřadnice a vrátí true, 
         * pokud se to podařilo 
         */
        place(x: number, y: number, object: InvObjDefinition, alternative: boolean): boolean {
            var self = this;
            var coord = self.pixelsToTiles(x, y);
            var rx = Utils.even(coord.x);
            var ry = Utils.even(coord.y);

            // pokud je co vkládat
            if (typeof object !== "undefined") {
                // jde o objekt
                if (object.mapObj != null) {
                    // zohledni, zda je o alternativu nebo původní variantu objektu
                    let mapObj;
                    if (alternative && object.mapObjAlternative) {
                        mapObj = object.mapObjAlternative;
                    } else {
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
        }

        handleTick() {
            // TODO?
            // let self = this;
            // for (let i = 0; i < self.sectorsToUpdate.length; i++) {
            //     let item = self.sectorsToUpdate.pop();
            //     if (typeof item !== "undefined") {
            //         item.sector.updateCache();
            //     }
            // }
            // for (let i = 0; i < self.fogSectorsToUpdate.length; i++) {
            //     let item = self.fogSectorsToUpdate.pop();
            //     if (typeof item !== "undefined") {
            //         item.fogSector.updateCache();
            //     }
            // }
        }

        addOnDigObjectListener(f: (objType: Diggable, x: number, y: number) => any) {
            let self = this;
            self.onDigObjectListeners.push(f);
        }

        addOnDigSurfaceListener(f: (objType: Diggable, x: number, y: number) => any) {
            let self = this;
            self.onDigSurfaceListeners.push(f);
        }

        // Math.ceil(x)-1 není to samé jako Math.floor(x)
        pixelsDistanceToTiles(x: number): number {
            return Math.floor(x / Resources.TILE_SIZE);
        }

        pixelsDistanceToEvenTiles(x: number): number {
            return Utils.even(this.pixelsDistanceToTiles(x));
        }

        pixelsToTiles(x: number, y: number): Coord2D {
            // tiles souřadnice z pixel souřadnic
            let tileX = Math.floor((x + -this.screenOffsetX) / Resources.TILE_SIZE);
            let tileY = Math.floor((y + -this.screenOffsetY) / Resources.TILE_SIZE);
            // offset v rámci part
            let partOffsetX = Math.floor((x + -this.screenOffsetX) % Resources.PARTS_SIZE);
            let partOffsetY = Math.floor((y + -this.screenOffsetY) % Resources.PARTS_SIZE);
            return new Coord2D(tileX, tileY, partOffsetX, partOffsetY);
        }

        pixelsToEvenTiles(x: number, y: number): Coord2D {
            let coord = this.pixelsToTiles(x, y);
            coord.x = Utils.even(coord.x);
            coord.y = Utils.even(coord.y);
            return coord;
        }

        tilesToPixel(x: number, y: number): Coord2D {
            var self = this;
            var screenX = x * Resources.TILE_SIZE + self.screenOffsetX;
            var screenY = y * Resources.TILE_SIZE + self.screenOffsetY;
            return new Coord2D(screenX, screenY);
        }

        // dle souřadnic tiles spočítá souřadnici sektoru
        getSectorByTiles(x: number, y: number): Sector {
            var self = this;
            var sx = Math.floor(x / Render.SECTOR_SIZE);
            var sy = Math.floor(y / Render.SECTOR_SIZE);
            return self.sectorsMap.getValue(sx, sy);
        }

        // dle souřadnic parts spočítá souřadnici fogSektoru
        getFogSectorByParts(x: number, y: number): FogSector {
            var self = this;
            var sx = Math.floor(x / Render.FOG_SECTOR_SIZE);
            var sy = Math.floor(y / Render.FOG_SECTOR_SIZE);
            return self.fogSectorsMap.getValue(sx, sy);
        }
    }
}