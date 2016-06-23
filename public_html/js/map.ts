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

        constructor(resources: Resources) {
            var self = this;

            var tilesMap = new TilesMap(
                [],
                [],
                Map.MAP_WIDTH,
                Map.MAP_HEIGHT
            );
            self.tilesMap = tilesMap;

            var mass = tilesMap.height * tilesMap.width;

            // base generation
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    if (y < Map.MAP_GROUND_LEVEL) {
                        tilesMap.mapRecord.push(Resources.VOID);
                    } else {
                        var m = x % 3 + 1 + ((y % 3) * 3);
                        tilesMap.mapRecord.push(Resources.DIRT["M" + m]);
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
                    for (var _x = x - d; _x <= x + d; _x += 2) {
                        for (var _y = y - d; _y <= y + d; _y += 2) {
                            // děruju v kruzích
                            var r2 = Math.pow(x - _x, 2) + Math.pow(y - _y, 2);
                            var d2 = Math.pow(d, 2);
                            if (r2 <= d2) {
                                // protože skáču po dvou, musím udělat vždy v každé
                                // ose dva zápisy, jinak by vznikla mřížka
                                for (var __x = _x; __x <= _x + 1; __x++) {
                                    for (var __y = _y; __y <= _y + 1; __y++) {
                                        var index = tilesMap.indexAt(__x, __y);
                                        if (index >= 0) {
                                            tilesMap.mapRecord[index] = Resources.VOID;
                                        }
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
                    var holeIndex = Math.floor(Math.random() * mass);
                    var holeCoord = tilesMap.coordAt(holeIndex);
                    createHole(holeCoord.x, holeCoord.y, dia);
                }
            })();

            // tráva boky
            (function() {
                for (var i = 0; i < mass; i++) {
                    if (tilesMap.mapRecord[i] === Resources.VOID)
                        continue;
                    var coord = tilesMap.coordAt(i);
                    MapTools.generateEdge(tilesMap, coord.x, coord.y);
                }
            })();

            // tráva rohy
            (function() {
                for (var i = 0; i < mass; i++) {
                    var val = tilesMap.mapRecord[i];
                    if (val === Resources.VOID)
                        continue;
                    var coord = tilesMap.coordAt(i);
                    MapTools.generateCorner(tilesMap, coord.x, coord.y);
                }
            })();

            // frekvenční "pool" objektů
            var pool = [];
            for (var key in Resources.dirtObjects) {
                var item = Resources.dirtObjects[key];
                // vlož index objektu tolikrát, kolik je jeho frekvenc
                for (var i = 0; i < item.freq; i++) {
                    pool.push(key);
                }
            }

            // objekty 
            (function() {

                var isFree = function(x0, y0, width, height) {
                    for (var x = x0; x <= x0 + width - 1; x++) {
                        for (var y = y0 - height; y <= y0; y++) {
                            // spodní buňky musí být všechny tvořený plochou DIRT.T
                            // objekt nemůže "překlenovat" díru nebo viset z okraje
                            // nelze kolidovat s jiným objektem
                            var col = tilesMap.mapObjectsTiles[x];
                            if ((y === y0 && tilesMap.valueAt(x, y) !== Resources.DIRT.T) ||
                                (y !== y0 && tilesMap.valueAt(x, y) !== Resources.VOID) ||
                                (typeof col !== "undefined" && typeof col[y] !== "undefined"))
                                return false;
                        }
                    }
                    return true;
                };

                for (var i = 0; i < mass; i += 2) {
                    var val = tilesMap.mapRecord[i];
                    // pokud jsem povrchová kostka je zde šance, že bude umístěn objekt
                    if (val === Resources.DIRT.T) {
                        // bude tam nějaký objekt? (100% ano)
                        if (Math.random() > 0) {
                            var tries = 0;
                            var index = Math.floor(pool.length * Math.random());
                            while (tries < pool.length) {
                                var key = pool[index];
                                var object = Resources.dirtObjects[key];
                                var coord = tilesMap.coordAt(i);
                                if (object.freq > 0 && isFree(coord.x, coord.y, object.mapSpriteWidth, object.mapSpriteHeight)) {
                                    MapTools.writeObjectRecord(tilesMap, coord.x, coord.y, object);
                                    break;
                                } else {
                                    // další pokus na dalším objektu
                                    tries++;
                                    index = (index + 1) % pool.length;
                                }
                            }
                        }
                    }
                }
            })();

        }

    }

};