/**
 * map.js
 * 
 * Generuje mapu světa a objekty na ní
 * 
 */
namespace Lich {

    export class TilesMap {
        constructor(public map, public objects, public objectsMap, public width, public height) { };

        indexAt(x, y) {
            var self = this;
            if (x >= self.width || x < 0 || y >= self.height || y < 0) {
                return -1;
            } else {
                return y * self.width + x;
            }
        }

        coordAt(index): any {
            var self = this;
            if (index < 0 || index > self.map.length - 1) {
                return 0;
            } else {
                return {
                    x: index % self.width,
                    y: Math.floor(index / self.width)
                };
            }
        }

        valueAt(x, y) {
            var self = this;
            var index = self.indexAt(x, y);
            if (index >= 0) {
                return self.map[index];
            }
            return Resources.VOID;
        }
    }

    export class Map {

        // musí být sudé
        static MAP_WIDTH = 800;
        static MAP_HEIGHT = 500;
        static MAP_GROUND_LEVEL = 60;

        tilesMap;
        resources;

        constructor(game: Lich.Game) {
            var self = this;
            self.resources = game.resources;

            var tilesMap = new TilesMap(
                [],
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
                        tilesMap.map.push(Resources.VOID);
                    } else {
                        var m = x % 3 + 1 + ((y % 3) * 3);
                        tilesMap.map.push(Resources.DIRT["M" + m]);
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
                                            tilesMap.map[index] = Resources.VOID;
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
                    if (tilesMap.map[i] === Resources.VOID)
                        continue;
                    var coord = tilesMap.coordAt(i);
                    self.generateEdge(tilesMap, coord.x, coord.y);
                }
            })();

            // tráva rohy
            (function() {
                for (var i = 0; i < mass; i++) {
                    var val = tilesMap.map[i];
                    if (val === Resources.VOID)
                        continue;
                    var coord = tilesMap.coordAt(i);
                    self.generateCorner(tilesMap, coord.x, coord.y);
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
                            var col = tilesMap.objectsMap[x];
                            if ((y === y0 && tilesMap.valueAt(x, y) !== Resources.DIRT.T) ||
                                (y !== y0 && tilesMap.valueAt(x, y) !== Resources.VOID) ||
                                (typeof col !== "undefined" && typeof col[y] !== "undefined"))
                                return false;
                        }
                    }
                    return true;
                };

                for (var i = 0; i < mass; i += 2) {
                    var val = tilesMap.map[i];
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
                                    self.placeObject(coord.x, coord.y, object);
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

        placeObject(cx, cy, object) {
            var self = this;
            // je tam volno, umísti ho
            self.tilesMap.objects.push({
                x: cx,
                y: cy,
                obj: object.mapKey
            });
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    var col = self.tilesMap.objectsMap[x + cx];
                    if (typeof col === "undefined") {
                        col = [];
                        self.tilesMap.objectsMap[x + cx] = col;
                    }
                    var partsSheetIndex = object.mapSpriteX + x + (object.mapSpriteY + y) * Resources.PARTS_SHEET_WIDTH;
                    col[y + cy - object.mapSpriteHeight] = {
                        // typ objektu
                        mapKey: object.mapKey,
                        // Sheet index dílku objektu
                        sheetIndex: partsSheetIndex,
                        // relativní souřadnice dílku objektu v sheetmapě
                        objTileX: x,
                        objTileY: y
                    };
                }
            }

        };

        generateEdge(tilesMap, x, y) {
            var i = tilesMap.indexAt(x, y);
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);

            if (valT === Resources.VOID) {
                tilesMap.map[i] = Resources.DIRT.T;
            }

            if (valR === Resources.VOID) {
                tilesMap.map[i] = Resources.DIRT.R;
            }

            if (valB === Resources.VOID) {
                tilesMap.map[i] = Resources.DIRT.B;
            }

            if (valL === Resources.VOID) {
                tilesMap.map[i] = Resources.DIRT.L;
            }

            return tilesMap.map[i];
        };

        generateCorner(tilesMap, x, y) {
            var i = tilesMap.indexAt(x, y);
            var val = tilesMap.map[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);

            var isMiddle = false;
            for (var m = 1; m <= 9; m++) {
                if (val === Resources.DIRT["M" + m]) {
                    isMiddle = true;
                    break;
                }
            }

            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (valB === Resources.DIRT.R && valR === Resources.DIRT.B) {
                    tilesMap.map[i] = Resources.DIRT.I_TL;
                }
                // jsem levý horní roh díry
                if (valL === Resources.DIRT.B && valB === Resources.DIRT.L) {
                    tilesMap.map[i] = Resources.DIRT.I_TR;
                }
                // levý spodní roh díry
                if (valT === Resources.DIRT.R && valR === Resources.DIRT.T) {
                    tilesMap.map[i] = Resources.DIRT.I_BL;
                }
                // pravý spodní roh díry
                if (valT === Resources.DIRT.L && valL === Resources.DIRT.T) {
                    tilesMap.map[i] = Resources.DIRT.I_BR;
                }

            }

            // jsem levý horní roh
            if (val === Resources.DIRT.L && (valR === Resources.DIRT.T || valT === Resources.VOID)) {
                tilesMap.map[i] = Resources.DIRT.TL;
            }
            // jsem levý dolní roh
            if (val === Resources.DIRT.L && (valR === Resources.DIRT.B || valR === Resources.DIRT.BR)) {
                tilesMap.map[i] = Resources.DIRT.BL;
            }
            // jsem pravý dolní roh
            if (val === Resources.DIRT.B && (valT === Resources.DIRT.R || valT === Resources.DIRT.TR)) {
                tilesMap.map[i] = Resources.DIRT.BR;
            }
            // jsem pravý horní roh
            if (val === Resources.DIRT.R && (valL === Resources.DIRT.T || valT === Resources.VOID)) {
                tilesMap.map[i] = Resources.DIRT.TR;
            }

            return tilesMap.map[i];
        };

        modify(tilesMap, x, y) {
            var rx = Utils.even(x);
            var ry = Utils.even(y);
            tilesMap.map[tilesMap.indexAt(rx, ry)] = Resources.VOID;
            tilesMap.map[tilesMap.indexAt(rx + 1, ry)] = Resources.VOID;
            tilesMap.map[tilesMap.indexAt(rx, ry + 1)] = Resources.VOID;
            tilesMap.map[tilesMap.indexAt(rx + 1, ry + 1)] = Resources.VOID;
        };

    }

};