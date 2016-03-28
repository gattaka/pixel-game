/*global utils*/
/*global resources*/

/**
 * map.js
 * 
 * Generuje mapu světa a objekty na ní
 * 
 */
var lich = lich || {};
lich.Map = function () {

    var self = this;

    // musí být sudé
    var MAP_WIDTH = 800;
    var MAP_HEIGHT = 500;
    var MAP_GROUND_LEVEL = 60;

    this.generateEdge = function (tilesMap, x, y) {
        var i = tilesMap.indexAt(x, y);
        var valT = tilesMap.valueAt(x, y - 1);
        var valR = tilesMap.valueAt(x + 1, y);
        var valB = tilesMap.valueAt(x, y + 1);
        var valL = tilesMap.valueAt(x - 1, y);

        if (valT === resources.VOID) {
            tilesMap.map[i] = resources.DIRT.T;
        }

        if (valR === resources.VOID) {
            tilesMap.map[i] = resources.DIRT.R;
        }

        if (valB === resources.VOID) {
            tilesMap.map[i] = resources.DIRT.B;
        }

        if (valL === resources.VOID) {
            tilesMap.map[i] = resources.DIRT.L;
        }

        return tilesMap.map[i];
    };


    this.generateCorner = function (tilesMap, x, y) {
        var i = tilesMap.indexAt(x, y);
        var val = tilesMap.map[i];
        var valT = tilesMap.valueAt(x, y - 1);
        var valR = tilesMap.valueAt(x + 1, y);
        var valB = tilesMap.valueAt(x, y + 1);
        var valL = tilesMap.valueAt(x - 1, y);

        var isMiddle = false;
        for (var m = 1; m <= 9; m++) {
            if (val === resources.DIRT["M" + m]) {
                isMiddle = true;
                break;
            }
        }

        // změny prostředních kusů
        if (isMiddle) {
            // jsem pravý horní roh díry
            if (valB === resources.DIRT.R && valR === resources.DIRT.B) {
                tilesMap.map[i] = resources.DIRT.I_TL;
            }
            // jsem levý horní roh díry
            if (valL === resources.DIRT.B && valB === resources.DIRT.L) {
                tilesMap.map[i] = resources.DIRT.I_TR;
            }
            // levý spodní roh díry
            if (valT === resources.DIRT.R && valR === resources.DIRT.T) {
                tilesMap.map[i] = resources.DIRT.I_BL;
            }
            // pravý spodní roh díry
            if (valT === resources.DIRT.L && valL === resources.DIRT.T) {
                tilesMap.map[i] = resources.DIRT.I_BR;
            }

        }

        // jsem levý horní roh
        if (val === resources.DIRT.L && (valR === resources.DIRT.T || valT === resources.VOID)) {
            tilesMap.map[i] = resources.DIRT.TL;
        }
        // jsem levý dolní roh
        if (val === resources.DIRT.L && (valR === resources.DIRT.B || valR === resources.DIRT.BR)) {
            tilesMap.map[i] = resources.DIRT.BL;
        }
        // jsem pravý dolní roh
        if (val === resources.DIRT.B && (valT === resources.DIRT.R || valT === resources.DIRT.TR)) {
            tilesMap.map[i] = resources.DIRT.BR;
        }
        // jsem pravý horní roh
        if (val === resources.DIRT.R && (valL === resources.DIRT.T || valT === resources.VOID)) {
            tilesMap.map[i] = resources.DIRT.TR;
        }

        return tilesMap.map[i];
    };

    this.modify = function (tilesMap, x, y) {
        var rx = utils.even(x);
        var ry = utils.even(y);
        tilesMap.map[tilesMap.indexAt(rx, ry)] = resources.VOID;
        tilesMap.map[tilesMap.indexAt(rx + 1, ry)] = resources.VOID;
        tilesMap.map[tilesMap.indexAt(rx, ry + 1)] = resources.VOID;
        tilesMap.map[tilesMap.indexAt(rx + 1, ry + 1)] = resources.VOID;
    };

    var tilesMap = {
        map: [],
        objects: [],
        objectsMap: [],
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        indexAt: function (x, y) {
            if (x >= this.width || x < 0 || y >= this.height || y < 0) {
                return -1;
            } else {
                return y * this.width + x;
            }
        },
        coordAt: function (index) {
            if (index < 0 || index > this.map.length - 1) {
                return 0;
            } else {
                return {
                    x: index % this.width,
                    y: Math.floor(index / this.width)
                };
            }
        },
        valueAt: function (x, y) {
            var index = this.indexAt(x, y);
            if (index >= 0) {
                return this.map[index];
            }
            return resources.VOID;
        }
    };

    var mass = tilesMap.height * tilesMap.width;

    // base generation
    for (var y = 0; y < tilesMap.height; y++) {
        for (var x = 0; x < tilesMap.width; x++) {
            if (y < MAP_GROUND_LEVEL) {
                tilesMap.map.push(resources.VOID);
            } else {
                var m = x % 3 + 1 + ((y % 3) * 3);
                tilesMap.map.push(resources.DIRT["M" + m]);
            }
        }
    }

    // Holes
    (function () {
        var createHole = function (x0, y0, d0) {
            var d = utils.even(d0);
            var x = utils.even(x0);
            var y = utils.even(y0);
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
                                    tilesMap.map[index] = resources.VOID;
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
    (function () {
        for (var i = 0; i < mass; i++) {
            if (tilesMap.map[i] === resources.VOID)
                continue;
            var coord = tilesMap.coordAt(i);
            self.generateEdge(tilesMap, coord.x, coord.y);
        }
    })();

    // tráva rohy
    (function () {
        for (var i = 0; i < mass; i++) {
            var val = tilesMap.map[i];
            if (val === resources.VOID)
                continue;
            var coord = tilesMap.coordAt(i);
            self.generateCorner(tilesMap, coord.x, coord.y);
        }
    })();

    // frekvenční "pool" objektů
    var pool = [];
    for (var it = 0; it < resources.dirtObjects.length; it++) {
        var item = resources.dirtObjects[it];
        // vlož index objektu tolikrát, kolik je jeho frekvenc
        for (var i = 0; i < item.freq; i++) {
            pool.push(it);
        }
    }

    // objekty 
    (function () {

        var isFree = function (x0, y0, width, height) {
            for (var x = x0; x <= x0 + width - 1; x++) {
                for (var y = y0 - height; y <= y0; y++) {
                    // spodní buňky musí být všechny tvořený plochou DIRT.T
                    // objekt nemůže "překlenovat" díru nebo viset z okraje
                    // nelze kolidovat s jiným objektem
                    var col = tilesMap.objectsMap[x];
                    if ((y === y0 && tilesMap.valueAt(x, y) !== resources.DIRT.T) ||
                            (y !== y0 && tilesMap.valueAt(x, y) !== resources.VOID) ||
                            (typeof col !== "undefined" && typeof col[y] !== "undefined"))
                        return false;
                }
            }
            return true;
        };

        for (var i = 0; i < mass; i += 2) {
            var val = tilesMap.map[i];
            // pokud jsem povrchová kostka je zde šance, že bude umístěn objekt
            if (val === resources.DIRT.T) {
                // bude tam nějaký objekt? (100% ano)
                if (Math.random() > 0) {
                    var tries = 0;
                    var index = pool[Math.floor(pool.length * Math.random())];
                    while (tries < resources.dirtObjects.length) {
                        var object = resources.dirtObjects[index];
                        var coord = tilesMap.coordAt(i);
                        if (isFree(coord.x, coord.y, object.width, object.height)) {
                            // je tam volno, umísti ho
                            tilesMap.objects.push({
                                x: coord.x,
                                y: coord.y,
                                obj: index
                            });
                            // zapiš obsazení jednotlivými dílky objektu
                            for (var x = 0; x < object.width; x++) {
                                for (var y = 0; y < object.height; y++) {
                                    var col = tilesMap.objectsMap[x + coord.x];
                                    if (typeof col === "undefined") {
                                        col = [];
                                        tilesMap.objectsMap[x + coord.x] = col;
                                    }
                                    var partsSheetIndex = object.posx + x + (object.posy + y) * resources.PARTS_SHEET_WIDTH;
                                    col[y + coord.y - object.height] = {
                                        // typ objektu
                                        objIndex: index,
                                        // Sheet index dílku objektu
                                        sheetIndex: partsSheetIndex,
                                        // relativní souřadnice dílku objektu v sheetmapě
                                        objTileX: x,
                                        objTileY: y
                                    };
                                }
                            }
                            break;
                        } else {
                            // další pokus na dalším objektu
                            tries++;
                            index = (index + 1) % resources.dirtObjects.length;
                        }
                    }
                }
            }
        }
    })();


    this.tilesMap = tilesMap;

};