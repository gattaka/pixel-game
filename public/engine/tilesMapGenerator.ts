/**
 * map.js
 * 
 * Generuje dílkovou mapu světa (povrchy, pozadí a objekty)
 * 
 */
namespace Lich {

    export interface SaveStructure {
        version: number,
        spwx: number,
        spwy: number,
        w: number,
        h: number,
        srf: Array<any>,
        bgr: Array<any>,
        obj: Array<any>
    }

    export class TilesMapGenerator {

        public static WORLD_FORMAT_VERSION: number = 1.4;

        // musí být sudé
        static DEFAULT_MAP_WIDTH = 2000;
        static DEFAULT_MAP_HEIGHT = 1000;
        static DEFAULT_MAP_GROUND_LEVEL = 50;

        private constructor() { }

        public static serialize(tilesMap: TilesMap): SaveStructure {
            let data: SaveStructure = {
                version: TilesMapGenerator.WORLD_FORMAT_VERSION,
                spwx: tilesMap.spawnPoint ? tilesMap.spawnPoint.x : undefined,
                spwy: tilesMap.spawnPoint ? tilesMap.spawnPoint.y : undefined,
                w: tilesMap.width,
                h: tilesMap.height,
                srf: [],
                bgr: [],
                obj: []
            }

            let last: any = tilesMap.mapRecord.getValue(0, 0);
            let count = 0; // 0 protože ještě jsem nic nenačetl
            for (let y = 0; y < tilesMap.height; y++) {
                for (let x = 0; x < tilesMap.width; x++) {
                    let val = tilesMap.mapRecord.getValue(x, y);
                    if (last !== val) {
                        data.srf.push(count);
                        data.srf.push(last);
                        last = val;
                        count = 1; // 1 protože už je načten
                    } else {
                        count++;
                    }
                }
            }
            data.srf.push(count);
            data.srf.push(last);

            last = tilesMap.mapBgrRecord.getValue(0, 0);
            count = 0; // 0 protože ještě jsem nic nenačetl
            for (let y = 0; y < tilesMap.height; y++) {
                for (let x = 0; x < tilesMap.width; x++) {
                    let val = tilesMap.mapBgrRecord.getValue(x, y);
                    if (last !== val) {
                        data.bgr.push(count);
                        data.bgr.push(last);
                        last = val;
                        count = 1; // 1 protože už je načten
                    } else {
                        count++;
                    }
                }
            }
            data.bgr.push(count);
            data.bgr.push(last);

            for (let y = 0; y < tilesMap.height; y++) {
                for (let x = 0; x < tilesMap.width; x++) {
                    let val = tilesMap.mapObjRecord.getValue(x, y);
                    if (val == 0 || val) {
                        data.obj.push(x);
                        data.obj.push(y);
                        data.obj.push(val);
                    }
                }
            }

            return data;
        }

        public static deserialize(data: SaveStructure): TilesMap {

            console.log("Loading world version: " + (data.version ? data.version : "<1.3"));

            let total = (data.srf.length + data.bgr.length) / 2 + data.obj.length;
            let progress = 0;

            let tilesMap = new TilesMap(data.w, data.h);
            if (data.spwx && data.spwy)
                tilesMap.spawnPoint = new Coord2D(data.spwx, data.spwy);

            EventBus.getInstance().fireEvent(new StringEventPayload(EventType.LOAD_ITEM, "Surface"));

            let count = 0;
            for (let v = 0; v < data.srf.length; v += 2) {
                let amount = data.srf[v];
                let key = data.srf[v + 1];
                for (let i = 0; i < amount; i++) {
                    tilesMap.mapRecord.setValue(count % data.w, Math.floor(count / data.w), key);
                    count++;
                }
                EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.LOAD_PROGRESS, ++progress / total));
            }

            EventBus.getInstance().fireEvent(new StringEventPayload(EventType.LOAD_ITEM, "Background"));

            if (!data.version || data.version < 1.3) {
                tilesMap.mapBgrRecord = new Array2D<number>(tilesMap.mapRecord.width, tilesMap.mapRecord.height);
            } else {
                count = 0;
                for (let v = 0; v < data.bgr.length; v += 2) {
                    let amount = data.bgr[v];
                    let key = data.bgr[v + 1];
                    for (let i = 0; i < amount; i++) {
                        tilesMap.mapBgrRecord.setValue(count % data.w, Math.floor(count / data.w), key);
                        count++;
                    }
                    EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.LOAD_PROGRESS, ++progress / total));
                }
            }

            if (!data.version || data.version < 1.4) {
                TilesMapGenerator.seedSurface(tilesMap, Resources.getInstance().mapSurfaceDefs[SurfaceKey.SRFC_GOLD_ORE_KEY]);
                TilesMapGenerator.sealMap(tilesMap);
            }

            EventBus.getInstance().fireEvent(new StringEventPayload(EventType.LOAD_ITEM, "Objects"));

            for (let v = 0; v < data.obj.length; v += 3) {
                let x = data.obj[v];
                let y = data.obj[v + 1];
                let key = data.obj[v + 2];
                tilesMap.mapObjRecord.setValue(x, y, key);
                TilesMapTools.writeObjectRecord(tilesMap, x, y, Resources.getInstance().mapObjectDefs[key]);
                EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.LOAD_PROGRESS, ++progress / total));
            };

            EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));

            return tilesMap;
        }

        private static seedSurface(tilesMap: TilesMap, definition: MapSurfaceDefinition) {
            let depositP = tilesMap.width * tilesMap.height * 0.005;
            let cooldown = definition.seedCooldown;
            for (let i = 0; i < depositP; i++) {
                if (cooldown-- <= 0) {
                    let depositX = Math.floor(Math.random() * tilesMap.width);
                    let depositY = Math.floor(Math.random() * tilesMap.height);
                    if ((depositY / tilesMap.height) > (definition.minDepth / 100)
                        && (depositY / tilesMap.height) < (definition.maxDepth / 100)) {
                        let dia = Math.floor(Math.random() * definition.maxSize) + 2;
                        TilesMapGenerator.createDeposit(tilesMap, depositX, depositY, dia, definition.srfcKey);
                        cooldown = definition.seedCooldown;
                    }
                }
            }
        }

        private static createDeposit(tilesMap: TilesMap, x0: number, y0: number, d0: number, oreKey: SurfaceKey) {
            let d = Utils.even(d0);
            let x = Utils.even(x0);
            let y = Utils.even(y0);
            // musí skákat po dvou, aby se zabránilo zubatosti
            for (let _y = y - d; _y <= y + d; _y += 2) {
                for (let _x = x - d; _x <= x + d; _x += 2) {

                    // osazuj v kruzích
                    let r2 = Math.pow(x - _x, 2) + Math.pow(y - _y, 2);
                    let d2 = Math.pow(d, 2);
                    if (r2 <= d2) {
                        let posIndex = tilesMap.mapRecord.getValue(_x, _y);
                        if (posIndex != SurfacePositionKey.VOID) {
                            // protože skáču po dvou, musím udělat vždy v každé
                            // ose dva zápisy, jinak by vznikla mřížka
                            for (let __x = _x; __x <= _x + 1; __x++) {
                                for (let __y = _y; __y <= _y + 1; __y++) {
                                    // nahradí aktuální dílek dílkem daného minerálu
                                    // přičemž zachová pozici dílku
                                    tilesMap.mapRecord.setValue(__x, __y, Resources.getInstance().surfaceIndex.getMiddlePositionIndexByCoordPattern(__x, __y, oreKey));
                                }
                            }

                            for (let __x = _x - 1; __x <= _x + 2; __x++) {
                                for (let __y = _y - 1; __y <= _y + 2; __y++) {
                                    let val = tilesMap.mapRecord.getValue(__x, __y);
                                    if (val != null) {
                                        if (val !== SurfacePositionKey.VOID) {
                                            let srfcType = Resources.getInstance().surfaceIndex.getType(val);
                                            // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                                            if (__x === _x - 1 || __x === _x + 2 || __y === _y - 1 || __y === _y + 2) {
                                                // okraje vyresetuj
                                                tilesMap.mapRecord.setValue(__x, __y,
                                                    Resources.getInstance().surfaceIndex.getMiddlePositionIndexByCoordPattern(__x, __y, srfcType));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // občas udělej na okraji ložiska... ložisko
                    if (_x === x + d || _x === x - d || _y === y + d || _y === y - d) {
                        if (Math.random() > 0.5) {
                            let auxX = _x;
                            let auxY = _y;
                            if (_x === x + d)
                                auxX -= 2;
                            if (_y === y + d)
                                auxY -= 2;
                            TilesMapGenerator.createDeposit(tilesMap, auxX, auxY, d - 2, oreKey);
                        }
                    }
                }
            }
        }

        private static sealMap(tilesMap: TilesMap) {
            // hrany
            for (let y = 0; y < tilesMap.height; y++) {
                for (let x = 0; x < tilesMap.width; x++) {
                    TilesMapTools.generateEdge(tilesMap.mapRecord, x, y, false);
                }
            }

            // rohy
            for (let y = 0; y < tilesMap.height; y++) {
                for (let x = 0; x < tilesMap.width; x++) {
                    TilesMapTools.generateCorner(tilesMap.mapRecord, x, y, false);
                }
            }
        }

        public static createNew(
            width = TilesMapGenerator.DEFAULT_MAP_WIDTH,
            height = TilesMapGenerator.DEFAULT_MAP_HEIGHT,
            groundLevel = TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL): TilesMap {

            var tilesMap = new TilesMap(TilesMapGenerator.DEFAULT_MAP_WIDTH, TilesMapGenerator.DEFAULT_MAP_HEIGHT);
            let mass = tilesMap.height * tilesMap.width;

            // hills profile
            let hills = new Array<number>();
            // main
            let mainSpeed = 180 / tilesMap.width;
            let mainAmp = 20;
            let mainShift = Math.random() * 180;
            // osc1
            let osc1Speed = 0.5;
            let osc1Amp = 1;
            let osc1Shift = 0;
            // osc2
            let osc2Speed = 5;
            let osc2Amp = 2;
            let osc2Shift = 0;
            // osc3
            let osc3Speed = 10;
            let osc3Amp = 0.5;
            let osc3Shift = 0;
            for (var x = 0; x < tilesMap.width; x++) {
                let xx = x * mainSpeed + mainShift;
                let y1 = Math.sin(osc1Speed * Math.PI / 180 * (xx + osc1Shift)) * osc1Amp;
                let y2 = Math.sin(osc2Speed * Math.PI / 180 * (xx + osc2Shift)) * osc2Amp;
                let y3 = Math.sin(osc3Speed * Math.PI / 180 * (xx + osc3Shift)) * osc3Amp;
                hills[x] = Math.abs(y1 + y2 + y3) * mainAmp;
            }

            let fillTile = (x: number, y: number, callback: (nx, ny) => any) => {
                for (var _x = x; _x <= x + 1; _x++) {
                    for (var _y = y; _y <= y + 1; _y++) {
                        callback(_x, _y);
                    }
                }
            }

            // base generation
            for (var y = 0; y < tilesMap.height; y += 2) {
                for (var x = 0; x < tilesMap.width; x += 2) {
                    // aplikuj profil kopce pokud je vytvořen "vzduch" mapy
                    fillTile(x, y, (nx, ny) => {
                        // získá výchozí prostřední dílek dle vzoru, 
                        // který se opakuje, aby mapa byla pestřejší
                        tilesMap.mapRecord.setValue(nx, ny,
                            y > TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL + hills[x] ? Resources.getInstance().surfaceIndex.getMiddlePositionIndexByCoordPattern(nx, ny, SurfaceKey.SRFC_DIRT_KEY)
                                : SurfacePositionKey.VOID
                        );
                    });
                }
            }

            // Holes
            (function () {
                var createHole = function (x0, y0, d0) {
                    var d = Utils.even(d0);
                    var x = Utils.even(x0);
                    var y = Utils.even(y0);
                    // musí skákat po dvou, aby se zabránilo zubatosti
                    for (var _y = y - d; _y <= y + d; _y += 2) {
                        for (var _x = x - d; _x <= x + d; _x += 2) {
                            // děruju v kruzích
                            var r2 = Math.pow(x - _x, 2) + Math.pow(y - _y, 2);
                            var d2 = Math.pow(d, 2);
                            if (r2 <= d2) {
                                // protože skáču po dvou, musím udělat vždy v každé
                                // ose dva zápisy, jinak by vznikla mřížka
                                for (var __x = _x; __x <= _x + 1; __x++) {
                                    for (var __y = _y; __y <= _y + 1; __y++) {
                                        tilesMap.mapRecord.setValue(__x, __y, SurfacePositionKey.VOID);
                                    }
                                }
                            }
                            // občas udělej na okraji díry... díru
                            if (_x === x + d || _x === x - d || _y === y + d || _y === y - d) {
                                if (Math.random() > 0.5) {
                                    var auxX = _x;
                                    var auxY = _y;
                                    if (_x === x + d)
                                        auxX -= 2;
                                    if (_y === y + d)
                                        auxY -= 2;
                                    createHole(auxX, auxY, d - 2);
                                }
                            }
                        }
                    }
                };

                // random holes
                let holesP = mass * 0.001;
                for (let i = 0; i < holesP; i++) {
                    let dia = Math.floor(Math.random() * 4) + 2;
                    let holeX = Math.floor(Math.random() * tilesMap.width);
                    let holeY = Math.floor(Math.random() * tilesMap.height);
                    createHole(holeX, holeY, dia);
                }
            })();


            // Minerály 
            (function () {
                // random deposit
                let depositP = mass * 0.005;
                for (let i = 0; i < depositP; i++) {
                    let depositX = Math.floor(Math.random() * tilesMap.width);
                    let depositY = Math.floor(Math.random() * tilesMap.height);
                    // z čeho bude ložisko?
                    Resources.getInstance().mapSurfacesFreqPool.yield((definition: MapSurfaceDefinition): boolean => {
                        if ((depositY / tilesMap.height) > (definition.minDepth / 100)
                            && (depositY / tilesMap.height) < (definition.maxDepth / 100)) {
                            let dia = Math.floor(Math.random() * definition.maxSize) + 2;
                            TilesMapGenerator.createDeposit(tilesMap, depositX, depositY, dia, definition.srfcKey);
                            return true;
                        }
                        return false;
                    });
                }
            })();

            TilesMapGenerator.sealMap(tilesMap);

            // objekty 
            (function () {

                var isFree = function (x0, y0, width, height) {
                    for (var y = y0 - height; y <= y0; y++) {
                        for (var x = x0; x <= x0 + width - 1; x++) {
                            // spodní buňky musí být všechny tvořený plochou DIRT.T
                            // objekt nemůže "překlenovat" díru nebo viset z okraje
                            // nelze kolidovat s jiným objektem
                            if ((y === y0 && (Resources.getInstance().surfaceIndex.isTopPosition(tilesMap.mapRecord.getValue(x, y)) == false
                                || Resources.getInstance().surfaceIndex.getType(tilesMap.mapRecord.getValue(x, y)) != SurfaceKey.SRFC_DIRT_KEY))
                                || (y !== y0 && tilesMap.mapRecord.getValue(x, y) !== SurfacePositionKey.VOID)
                                || (tilesMap.mapObjectsTiles.getValue(x, y) != null))
                                return false;
                        }
                    }
                    return true;
                };

                for (var y = 0; y < tilesMap.height; y += 2) {
                    for (var x = 0; x < tilesMap.width; x += 2) {
                        var val = tilesMap.mapRecord.getValue(x, y);
                        // pokud jsem povrchová kostka je zde šance, že bude umístěn objekt
                        if (Resources.getInstance().surfaceIndex.isTopPosition(val)) {
                            Resources.getInstance().mapObjectDefsFreqPool.yield((definition: MapObjDefinition): boolean => {
                                let lvl = TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL - 1;
                                if (((y - lvl) / (tilesMap.height - lvl)) > (definition.minDepth / 100)
                                    && ((y - lvl) / (tilesMap.height - lvl)) < (definition.maxDepth / 100)
                                    && isFree(x, y, definition.mapSpriteWidth, definition.mapSpriteHeight)) {
                                    TilesMapTools.writeObjectRecord(tilesMap, x, y, definition);
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                }
            })();

            return tilesMap;

        }

    }

};