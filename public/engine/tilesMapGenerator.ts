/**
 * map.js
 * 
 * Generuje dílkovou mapu světa (povrchy, pozadí a objekty)
 * 
 */
namespace Lich {

    export interface SaveStructure {
        w: number,
        h: number,
        srf: Array<any>,
        bgr: Array<any>,
        obj: Array<any>
    }

    export class TilesMapGenerator {

        // musí být sudé
        static DEFAULT_MAP_WIDTH = 800;
        static DEFAULT_MAP_HEIGHT = 500;
        static DEFAULT_MAP_GROUND_LEVEL = 60;

        private constructor() { }

        public static serialize(tilesMap: TilesMap): SaveStructure {
            let data: SaveStructure = {
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
                    let val = tilesMap.mapObjectsTiles.getValue(x, y);
                    if (val) {
                        data.obj.push({ x: x, y: y, v: val });
                    }
                }
            }

            return data;
        }

        public static deserialize(data: SaveStructure): TilesMap {

            let total = (data.srf.length + data.bgr.length) / 2 + data.obj.length;
            let progress = 0;

            let tilesMap = new TilesMap(data.w, data.h);

            EventBus.getInstance().fireEvent(new StringEventPayload(EventType.LOAD_ITEM, "Surface"));

            let count = 0;
            for (let v = 0; v < data.srf.length; v += 2) {
                let amount = data.srf[v];
                let key = data.srf[v + 1];
                for (let i = 0; i < amount; i++) {
                    tilesMap.mapRecord.setValue(count % data.w, Math.floor(count / data.w), key);
                    EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.LOAD_PROGRESS, ++progress / total));
                    count++;
                }
            }

            EventBus.getInstance().fireEvent(new StringEventPayload(EventType.LOAD_ITEM, "Background"));

            count = 0;
            for (let v = 0; v < data.bgr.length; v += 2) {
                let amount = data.bgr[v];
                let key = data.bgr[v + 1];
                for (let i = 0; i < amount; i++) {
                    tilesMap.mapBgrRecord.setValue(count % data.w, Math.floor(count / data.w), key);
                    EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.LOAD_PROGRESS, ++progress / total));
                    count++;
                }
            }

            EventBus.getInstance().fireEvent(new StringEventPayload(EventType.LOAD_ITEM, "Objects"));

            data.obj.forEach((v) => {
                tilesMap.mapObjectsTiles.setValue(v.x, v.y, v.v);
                EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.LOAD_PROGRESS, ++progress / total));
            });

            EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));

            return tilesMap;
        }

        public static createNew(
            width = TilesMapGenerator.DEFAULT_MAP_WIDTH,
            height = TilesMapGenerator.DEFAULT_MAP_HEIGHT,
            groundLevel = TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL): TilesMap {

            var tilesMap = new TilesMap(TilesMapGenerator.DEFAULT_MAP_WIDTH, TilesMapGenerator.DEFAULT_MAP_HEIGHT);

            var mass = tilesMap.height * tilesMap.width;

            // base generation
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    if (y < TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL) {
                        tilesMap.mapRecord.setValue(x, y, SurfacePositionKey.VOID);
                    } else {
                        // získá výchozí prostřední dílek dle vzoru, 
                        // který se opakuje, aby mapa byla pestřejší
                        var pos = TilesMapTools.getSurfacePositionByCoordPattern(x, y);
                        tilesMap.mapRecord.setValue(x, y, Resources.getInstance().surfaceIndex.getPositionIndex(SurfaceKey.SRFC_DIRT_KEY, pos));
                    }
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
                var holesP = mass * 0.005;
                for (var i = 0; i < holesP; i++) {
                    var dia = Math.floor(Math.random() * 4) + 2;
                    var holeX = Math.floor(Math.random() * tilesMap.width);
                    var holeY = Math.floor(Math.random() * tilesMap.height);
                    createHole(holeX, holeY, dia);
                }
            })();

            // tráva boky
            (function () {
                for (var y = 0; y < tilesMap.height; y++) {
                    for (var x = 0; x < tilesMap.width; x++) {
                        if (tilesMap.mapRecord.getValue(x, y) === SurfacePositionKey.VOID)
                            continue;
                        TilesMapTools.generateEdge(tilesMap, x, y);
                    }
                }
            })();

            // tráva rohy
            (function () {
                for (var y = 0; y < tilesMap.height; y++) {
                    for (var x = 0; x < tilesMap.width; x++) {
                        if (tilesMap.mapRecord.getValue(x, y) === SurfacePositionKey.VOID)
                            continue;
                        TilesMapTools.generateCorner(tilesMap, x, y);
                    }
                }
            })();

            // Minerály 
            (function () {
                var createDeposit = function (x0: number, y0: number, d0: number, oreKey: SurfaceKey) {
                    var d = Utils.even(d0);
                    var x = Utils.even(x0);
                    var y = Utils.even(y0);
                    // musí skákat po dvou, aby se zabránilo zubatosti
                    for (var _y = y - d; _y <= y + d; _y += 2) {
                        for (var _x = x - d; _x <= x + d; _x += 2) {
                            // osazuj v kruzích
                            var r2 = Math.pow(x - _x, 2) + Math.pow(y - _y, 2);
                            var d2 = Math.pow(d, 2);
                            if (r2 <= d2) {
                                // protože skáču po dvou, musím udělat vždy v každé
                                // ose dva zápisy, jinak by vznikla mřížka
                                for (var __x = _x; __x <= _x + 1; __x++) {
                                    for (var __y = _y; __y <= _y + 1; __y++) {
                                        var posIndex = tilesMap.mapRecord.getValue(__x, __y);
                                        if (posIndex != SurfacePositionKey.VOID) {
                                            // nahradí aktuální dílek dílkem daného minerálu
                                            // přičemž zachová pozici dílku
                                            tilesMap.mapRecord.setValue(__x, __y, Resources.getInstance().surfaceIndex.changeType(posIndex, oreKey));
                                        }
                                    }
                                }
                            }
                            // občas udělej na okraji ložiska... ložisko
                            if (_x === x + d || _x === x - d || _y === y + d || _y === y - d) {
                                if (Math.random() > 0.5) {
                                    var auxX = _x;
                                    var auxY = _y;
                                    if (_x === x + d)
                                        auxX -= 2;
                                    if (_y === y + d)
                                        auxY -= 2;
                                    createDeposit(auxX, auxY, d - 2, oreKey);
                                }
                            }
                        }
                    }
                };

                // random deposit
                var holesP = mass * 0.001;
                for (var i = 0; i < holesP; i++) {
                    var dia = Math.floor(Math.random() * 4) + 2;
                    var holeX = Math.floor(Math.random() * tilesMap.width);
                    var holeY = Math.floor(Math.random() * tilesMap.height);
                    // z čeho bude ložisko?
                    var index = Math.floor(Resources.getInstance().mapSurfacesFreqPool.length * Math.random());
                    createDeposit(holeX, holeY, dia, Resources.getInstance().mapSurfacesFreqPool[index]);
                }
            })();

            // objekty 
            (function () {

                var isFree = function (x0, y0, width, height) {
                    for (var y = y0 - height; y <= y0; y++) {
                        for (var x = x0; x <= x0 + width - 1; x++) {
                            // spodní buňky musí být všechny tvořený plochou DIRT.T
                            // objekt nemůže "překlenovat" díru nebo viset z okraje
                            // nelze kolidovat s jiným objektem
                            if ((y === y0 && Resources.getInstance().surfaceIndex.isPosition(tilesMap.mapRecord.getValue(x, y), SurfacePositionKey.T) == false) ||
                                (y !== y0 && tilesMap.mapRecord.getValue(x, y) !== SurfacePositionKey.VOID) ||
                                (tilesMap.mapObjectsTiles.getValue(x, y) != null))
                                return false;
                        }
                    }
                    return true;
                };

                for (var y = 0; y < tilesMap.height; y += 2) {
                    for (var x = 0; x < tilesMap.width; x += 2) {
                        var val = tilesMap.mapRecord.getValue(x, y);
                        // pokud jsem povrchová kostka je zde šance, že bude umístěn objekt
                        if (Resources.getInstance().surfaceIndex.isPosition(val, SurfacePositionKey.T)) {
                            // bude tam nějaký objekt? (100% ano)
                            if (Math.random() > 0) {
                                var tries = 0;
                                var index = Math.floor(Resources.getInstance().mapObjectDefsFreqPool.length * Math.random());
                                while (tries < Resources.getInstance().mapObjectDefsFreqPool.length) {
                                    var key = Resources.getInstance().mapObjectDefsFreqPool[index];
                                    var object = Resources.getInstance().mapObjectDefs[key];
                                    if (object.freq > 0 && isFree(x, y, object.mapSpriteWidth, object.mapSpriteHeight)) {
                                        TilesMapTools.writeObjectRecord(tilesMap, x, y, object);
                                        break;
                                    } else {
                                        // další pokus na dalším objektu
                                        tries++;
                                        index = (index + 1) % Resources.getInstance().mapObjectDefsFreqPool.length;
                                    }
                                }
                            }
                        }
                    }
                }
            })();

            return tilesMap;

        }

    }

};