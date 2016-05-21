/**
 * map.js
 *
 * Generuje mapu světa a objekty na ní
 *
 */
var Lich;
(function (Lich) {
    var TilesMap = (function () {
        function TilesMap(map, objects, objectsMap, width, height) {
            this.map = map;
            this.objects = objects;
            this.objectsMap = objectsMap;
            this.width = width;
            this.height = height;
        }
        ;
        TilesMap.prototype.indexAt = function (x, y) {
            var self = this;
            if (x >= self.width || x < 0 || y >= self.height || y < 0) {
                return -1;
            }
            else {
                return y * self.width + x;
            }
        };
        TilesMap.prototype.coordAt = function (index) {
            var self = this;
            if (index < 0 || index > self.map.length - 1) {
                return 0;
            }
            else {
                return {
                    x: index % self.width,
                    y: Math.floor(index / self.width)
                };
            }
        };
        TilesMap.prototype.valueAt = function (x, y) {
            var self = this;
            var index = self.indexAt(x, y);
            if (index >= 0) {
                return self.map[index];
            }
            return Lich.Resources.VOID;
        };
        return TilesMap;
    }());
    Lich.TilesMap = TilesMap;
    var Map = (function () {
        function Map(game) {
            var self = this;
            self.resources = game.resources;
            var tilesMap = new TilesMap([], [], [], Map.MAP_WIDTH, Map.MAP_HEIGHT);
            self.tilesMap = tilesMap;
            var mass = tilesMap.height * tilesMap.width;
            // base generation
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    if (y < Map.MAP_GROUND_LEVEL) {
                        tilesMap.map.push(Lich.Resources.VOID);
                    }
                    else {
                        var m = x % 3 + 1 + ((y % 3) * 3);
                        tilesMap.map.push(Lich.Resources.DIRT["M" + m]);
                    }
                }
            }
            // Holes
            (function () {
                var createHole = function (x0, y0, d0) {
                    var d = Lich.Utils.even(d0);
                    var x = Lich.Utils.even(x0);
                    var y = Lich.Utils.even(y0);
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
                                            tilesMap.map[index] = Lich.Resources.VOID;
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
                    if (tilesMap.map[i] === Lich.Resources.VOID)
                        continue;
                    var coord = tilesMap.coordAt(i);
                    self.generateEdge(tilesMap, coord.x, coord.y);
                }
            })();
            // tráva rohy
            (function () {
                for (var i = 0; i < mass; i++) {
                    var val = tilesMap.map[i];
                    if (val === Lich.Resources.VOID)
                        continue;
                    var coord = tilesMap.coordAt(i);
                    self.generateCorner(tilesMap, coord.x, coord.y);
                }
            })();
            // frekvenční "pool" objektů
            var pool = [];
            for (var key in Lich.Resources.dirtObjects) {
                var item = Lich.Resources.dirtObjects[key];
                // vlož index objektu tolikrát, kolik je jeho frekvenc
                for (var i = 0; i < item.freq; i++) {
                    pool.push(key);
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
                            if ((y === y0 && tilesMap.valueAt(x, y) !== Lich.Resources.DIRT.T) ||
                                (y !== y0 && tilesMap.valueAt(x, y) !== Lich.Resources.VOID) ||
                                (typeof col !== "undefined" && typeof col[y] !== "undefined"))
                                return false;
                        }
                    }
                    return true;
                };
                for (var i = 0; i < mass; i += 2) {
                    var val = tilesMap.map[i];
                    // pokud jsem povrchová kostka je zde šance, že bude umístěn objekt
                    if (val === Lich.Resources.DIRT.T) {
                        // bude tam nějaký objekt? (100% ano)
                        if (Math.random() > 0) {
                            var tries = 0;
                            var index = Math.floor(pool.length * Math.random());
                            while (tries < pool.length) {
                                var key = pool[index];
                                var object = Lich.Resources.dirtObjects[key];
                                var coord = tilesMap.coordAt(i);
                                if (object.freq > 0 && isFree(coord.x, coord.y, object.mapSpriteWidth, object.mapSpriteHeight)) {
                                    self.placeObject(coord.x, coord.y, object);
                                    break;
                                }
                                else {
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
        Map.prototype.placeObject = function (cx, cy, object) {
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
                    var partsSheetIndex = object.mapSpriteX + x + (object.mapSpriteY + y) * Lich.Resources.PARTS_SHEET_WIDTH;
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
        ;
        Map.prototype.generateEdge = function (tilesMap, x, y) {
            var i = tilesMap.indexAt(x, y);
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);
            if (valT === Lich.Resources.VOID) {
                tilesMap.map[i] = Lich.Resources.DIRT.T;
            }
            if (valR === Lich.Resources.VOID) {
                tilesMap.map[i] = Lich.Resources.DIRT.R;
            }
            if (valB === Lich.Resources.VOID) {
                tilesMap.map[i] = Lich.Resources.DIRT.B;
            }
            if (valL === Lich.Resources.VOID) {
                tilesMap.map[i] = Lich.Resources.DIRT.L;
            }
            return tilesMap.map[i];
        };
        ;
        Map.prototype.generateCorner = function (tilesMap, x, y) {
            var i = tilesMap.indexAt(x, y);
            var val = tilesMap.map[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);
            var isMiddle = false;
            for (var m = 1; m <= 9; m++) {
                if (val === Lich.Resources.DIRT["M" + m]) {
                    isMiddle = true;
                    break;
                }
            }
            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (valB === Lich.Resources.DIRT.R && valR === Lich.Resources.DIRT.B) {
                    tilesMap.map[i] = Lich.Resources.DIRT.I_TL;
                }
                // jsem levý horní roh díry
                if (valL === Lich.Resources.DIRT.B && valB === Lich.Resources.DIRT.L) {
                    tilesMap.map[i] = Lich.Resources.DIRT.I_TR;
                }
                // levý spodní roh díry
                if (valT === Lich.Resources.DIRT.R && valR === Lich.Resources.DIRT.T) {
                    tilesMap.map[i] = Lich.Resources.DIRT.I_BL;
                }
                // pravý spodní roh díry
                if (valT === Lich.Resources.DIRT.L && valL === Lich.Resources.DIRT.T) {
                    tilesMap.map[i] = Lich.Resources.DIRT.I_BR;
                }
            }
            // jsem levý horní roh
            if (val === Lich.Resources.DIRT.L && (valR === Lich.Resources.DIRT.T || valT === Lich.Resources.VOID)) {
                tilesMap.map[i] = Lich.Resources.DIRT.TL;
            }
            // jsem levý dolní roh
            if (val === Lich.Resources.DIRT.L && (valR === Lich.Resources.DIRT.B || valR === Lich.Resources.DIRT.BR)) {
                tilesMap.map[i] = Lich.Resources.DIRT.BL;
            }
            // jsem pravý dolní roh
            if (val === Lich.Resources.DIRT.B && (valT === Lich.Resources.DIRT.R || valT === Lich.Resources.DIRT.TR)) {
                tilesMap.map[i] = Lich.Resources.DIRT.BR;
            }
            // jsem pravý horní roh
            if (val === Lich.Resources.DIRT.R && (valL === Lich.Resources.DIRT.T || valT === Lich.Resources.VOID)) {
                tilesMap.map[i] = Lich.Resources.DIRT.TR;
            }
            return tilesMap.map[i];
        };
        ;
        Map.prototype.modify = function (tilesMap, x, y) {
            var rx = Lich.Utils.even(x);
            var ry = Lich.Utils.even(y);
            tilesMap.map[tilesMap.indexAt(rx, ry)] = Lich.Resources.VOID;
            tilesMap.map[tilesMap.indexAt(rx + 1, ry)] = Lich.Resources.VOID;
            tilesMap.map[tilesMap.indexAt(rx, ry + 1)] = Lich.Resources.VOID;
            tilesMap.map[tilesMap.indexAt(rx + 1, ry + 1)] = Lich.Resources.VOID;
        };
        ;
        // musí být sudé
        Map.MAP_WIDTH = 800;
        Map.MAP_HEIGHT = 500;
        Map.MAP_GROUND_LEVEL = 60;
        return Map;
    }());
    Lich.Map = Map;
})(Lich || (Lich = {}));
;
