/**
 * map.js
 * 
 * Generuje mapu světa a objekty na ní
 * 
 */
namespace Lich {
    export class Map {

        // musí být sudé
        static MAP_WIDTH = 800;
        static MAP_HEIGHT = 500;
        static MAP_GROUND_LEVEL = 60;

        tilesMap: TilesMap;

        constructor() {
            var self = this;

            var tilesMap = new TilesMap(Map.MAP_WIDTH, Map.MAP_HEIGHT);
            self.tilesMap = tilesMap;

            var mass = tilesMap.height * tilesMap.width;

            // base generation
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    if (y < Map.MAP_GROUND_LEVEL) {
                        tilesMap.mapRecord.setValue(x, y, SurfaceIndex.VOID);
                    } else {
                        // získá výchozí prostřední dílek dle vzoru, 
                        // který se opakuje, aby mapa byla pestřejší
                        var pos = MapTools.getPositionByCoordPattern(x, y);
                        tilesMap.mapRecord.setValue(x, y, Resources.INSTANCE.surfaceIndex.getPositionIndex(Resources.SRFC_DIRT_KEY, pos));
                    }
                }
            }

            // Holes
            (function() {
                var createHole = function(x0, y0, d0) {
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
                                        tilesMap.mapRecord.setValue(__x, __y, SurfaceIndex.VOID);
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
            (function() {
                for (var y = 0; y < tilesMap.height; y++) {
                    for (var x = 0; x < tilesMap.width; x++) {
                        if (tilesMap.mapRecord.getValue(x, y) === SurfaceIndex.VOID)
                            continue;
                        MapTools.generateEdge(tilesMap, x, y);
                    }
                }
            })();

            // tráva rohy
            (function() {
                for (var y = 0; y < tilesMap.height; y++) {
                    for (var x = 0; x < tilesMap.width; x++) {
                        if (tilesMap.mapRecord.getValue(x, y) === SurfaceIndex.VOID)
                            continue;
                        MapTools.generateCorner(tilesMap, x, y);
                    }
                }
            })();

            // Minerály 
            (function() {
                var createDeposit = function(x0: number, y0: number, d0: number, oreKey: string) {
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
                                        if (posIndex != SurfaceIndex.VOID) {
                                            // nahradí aktuální dílek dílkem daného minerálu
                                            // přičemž zachová pozici dílku
                                            tilesMap.mapRecord.setValue(__x, __y, Resources.INSTANCE.surfaceIndex.changeSurface(posIndex, oreKey));
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
                    var index = Math.floor(Resources.INSTANCE.mapSurfacesFreqPool.length * Math.random());
                    createDeposit(holeX, holeY, dia, Resources.INSTANCE.mapSurfacesFreqPool[index]);
                }
            })();

            // objekty 
            (function() {

                var isFree = function(x0, y0, width, height) {
                    for (var y = y0 - height; y <= y0; y++) {
                        for (var x = x0; x <= x0 + width - 1; x++) {
                            // spodní buňky musí být všechny tvořený plochou DIRT.T
                            // objekt nemůže "překlenovat" díru nebo viset z okraje
                            // nelze kolidovat s jiným objektem
                            if ((y === y0 && Resources.INSTANCE.surfaceIndex.isPosition(tilesMap.mapRecord.getValue(x, y), SurfaceIndex.T) == false) ||
                                (y !== y0 && tilesMap.mapRecord.getValue(x, y) !== SurfaceIndex.VOID) ||
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
                        if (Resources.INSTANCE.surfaceIndex.isPosition(val, SurfaceIndex.T)) {
                            // bude tam nějaký objekt? (100% ano)
                            if (Math.random() > 0) {
                                var tries = 0;
                                var index = Math.floor(Resources.INSTANCE.mapObjectsFreqPool.length * Math.random());
                                while (tries < Resources.INSTANCE.mapObjectsFreqPool.length) {
                                    var key = Resources.INSTANCE.mapObjectsFreqPool[index];
                                    var object = Resources.INSTANCE.mapObjectsDefs[key];
                                    if (object.freq > 0 && isFree(x, y, object.mapSpriteWidth, object.mapSpriteHeight)) {
                                        MapTools.writeObjectRecord(tilesMap, x, y, object);
                                        break;
                                    } else {
                                        // další pokus na dalším objektu
                                        tries++;
                                        index = (index + 1) % Resources.INSTANCE.mapObjectsFreqPool.length;
                                    }
                                }
                            }
                        }
                    }
                }
            })();

        }

    }

};