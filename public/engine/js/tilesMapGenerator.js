/**
 * map.js
 *
 * Generuje dílkovou mapu světa (povrchy, pozadí a objekty)
 *
 */
var Lich;
(function (Lich) {
    var TilesMapGenerator = (function () {
        function TilesMapGenerator() {
        }
        TilesMapGenerator.createUserKey = function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        TilesMapGenerator.getUserKey = function () {
            var key = Cookies.get(Lich.Resources.COOKIE_KEY);
            if (key) {
                return key;
            }
            else {
                key = TilesMapGenerator.createUserKey();
                Cookies.set(Lich.Resources.COOKIE_KEY, key, { expires: 10 * 365 });
                return key;
            }
        };
        TilesMapGenerator.serialize = function (tilesMap) {
            var data = {
                w: tilesMap.width,
                h: tilesMap.height,
                srf: [],
                bgr: [],
                obj: []
            };
            var last = tilesMap.mapRecord.getValue(0, 0);
            var count = 0; // 0 protože ještě jsem nic nenačetl
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    var val = tilesMap.mapRecord.getValue(x, y);
                    if (last !== val) {
                        data.srf.push({ c: count, x: last });
                        last = val;
                        count = 1; // 1 protože už je načten
                    }
                    else {
                        count++;
                    }
                }
            }
            data.srf.push({ c: count, x: last });
            last = tilesMap.mapBgrRecord.getValue(0, 0);
            count = 0; // 0 protože ještě jsem nic nenačetl
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    var val = tilesMap.mapBgrRecord.getValue(x, y);
                    if (last !== val) {
                        data.bgr.push({ c: count, x: last });
                        last = val;
                        count = 1; // 1 protože už je načten
                    }
                    else {
                        count++;
                    }
                }
            }
            data.bgr.push({ c: count, x: last });
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    var val = tilesMap.mapObjectsTiles.getValue(x, y);
                    if (val) {
                        data.obj.push({ x: x, y: y, v: val });
                    }
                }
            }
            return JSON.stringify(data);
        };
        TilesMapGenerator.deserialize = function (data) {
            var tilesMap = new Lich.TilesMap(data.w, data.h);
            var count = 0;
            data.srf.forEach(function (v) {
                for (var i = 0; i < v.c; i++) {
                    tilesMap.mapRecord.setValue(count % data.w, Math.floor(count / data.w), v.x);
                    count++;
                }
            });
            count = 0;
            data.bgr.forEach(function (v) {
                for (var i = 0; i < v.c; i++) {
                    tilesMap.mapBgrRecord.setValue(count % data.w, Math.floor(count / data.w), v.x);
                    count++;
                }
            });
            data.obj.forEach(function (v) {
                tilesMap.mapObjectsTiles.setValue(v.x, v.y, v.v);
            });
            return tilesMap;
        };
        TilesMapGenerator.save = function (tilesMap) {
            var userKey = TilesMapGenerator.getUserKey();
            if (userKey) {
                var data_1 = TilesMapGenerator.serialize(tilesMap);
                jQuery.ajax({
                    url: './posts/1',
                    type: 'PUT',
                    contentType: 'application/json',
                    processData: false,
                    data: data_1,
                    success: function (result) {
                        console.log("Game saved");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        jQuery.ajax({
                            url: './posts',
                            type: 'POST',
                            contentType: 'application/json',
                            processData: false,
                            data: data_1,
                            success: function (result) {
                                console.log("Game saved");
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log("Unable to save game");
                            }
                        });
                    }
                });
            }
            else {
                console.error("Failed to obtain a user key");
            }
        };
        TilesMapGenerator.load = function () {
            var userKey = TilesMapGenerator.getUserKey();
            if (userKey) {
                var response = jQuery.ajax({
                    url: './posts/1',
                    type: 'GET',
                    success: function (result) {
                        console.log("Game loaded");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error("Error: " + textStatus + " errorThrown:" + errorThrown);
                    },
                    async: false
                });
                if (response.status != 404 && response.responseJSON) {
                    return TilesMapGenerator.deserialize(response.responseJSON);
                }
            }
            return null;
        };
        TilesMapGenerator.createNew = function (width, height, groundLevel) {
            if (width === void 0) { width = TilesMapGenerator.DEFAULT_MAP_WIDTH; }
            if (height === void 0) { height = TilesMapGenerator.DEFAULT_MAP_HEIGHT; }
            if (groundLevel === void 0) { groundLevel = TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL; }
            var tilesMap = new Lich.TilesMap(TilesMapGenerator.DEFAULT_MAP_WIDTH, TilesMapGenerator.DEFAULT_MAP_HEIGHT);
            var mass = tilesMap.height * tilesMap.width;
            // base generation
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    if (y < TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL) {
                        tilesMap.mapRecord.setValue(x, y, Lich.SurfacePositionKey.VOID);
                    }
                    else {
                        // získá výchozí prostřední dílek dle vzoru, 
                        // který se opakuje, aby mapa byla pestřejší
                        var pos = Lich.TilesMapTools.getSurfacePositionByCoordPattern(x, y);
                        tilesMap.mapRecord.setValue(x, y, Lich.Resources.getInstance().surfaceIndex.getPositionIndex(Lich.SurfaceKey.SRFC_DIRT_KEY, pos));
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
                                        tilesMap.mapRecord.setValue(__x, __y, Lich.SurfacePositionKey.VOID);
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
                        if (tilesMap.mapRecord.getValue(x, y) === Lich.SurfacePositionKey.VOID)
                            continue;
                        Lich.TilesMapTools.generateEdge(tilesMap, x, y);
                    }
                }
            })();
            // tráva rohy
            (function () {
                for (var y = 0; y < tilesMap.height; y++) {
                    for (var x = 0; x < tilesMap.width; x++) {
                        if (tilesMap.mapRecord.getValue(x, y) === Lich.SurfacePositionKey.VOID)
                            continue;
                        Lich.TilesMapTools.generateCorner(tilesMap, x, y);
                    }
                }
            })();
            // Minerály 
            (function () {
                var createDeposit = function (x0, y0, d0, oreKey) {
                    var d = Lich.Utils.even(d0);
                    var x = Lich.Utils.even(x0);
                    var y = Lich.Utils.even(y0);
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
                                        if (posIndex != Lich.SurfacePositionKey.VOID) {
                                            // nahradí aktuální dílek dílkem daného minerálu
                                            // přičemž zachová pozici dílku
                                            tilesMap.mapRecord.setValue(__x, __y, Lich.Resources.getInstance().surfaceIndex.changeType(posIndex, oreKey));
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
                    var index = Math.floor(Lich.Resources.getInstance().mapSurfacesFreqPool.length * Math.random());
                    createDeposit(holeX, holeY, dia, Lich.Resources.getInstance().mapSurfacesFreqPool[index]);
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
                            if ((y === y0 && Lich.Resources.getInstance().surfaceIndex.isPosition(tilesMap.mapRecord.getValue(x, y), Lich.SurfacePositionKey.T) == false) ||
                                (y !== y0 && tilesMap.mapRecord.getValue(x, y) !== Lich.SurfacePositionKey.VOID) ||
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
                        if (Lich.Resources.getInstance().surfaceIndex.isPosition(val, Lich.SurfacePositionKey.T)) {
                            // bude tam nějaký objekt? (100% ano)
                            if (Math.random() > 0) {
                                var tries = 0;
                                var index = Math.floor(Lich.Resources.getInstance().mapObjectDefsFreqPool.length * Math.random());
                                while (tries < Lich.Resources.getInstance().mapObjectDefsFreqPool.length) {
                                    var key = Lich.Resources.getInstance().mapObjectDefsFreqPool[index];
                                    var object = Lich.Resources.getInstance().mapObjectDefs[key];
                                    if (object.freq > 0 && isFree(x, y, object.mapSpriteWidth, object.mapSpriteHeight)) {
                                        Lich.TilesMapTools.writeObjectRecord(tilesMap, x, y, object);
                                        break;
                                    }
                                    else {
                                        // další pokus na dalším objektu
                                        tries++;
                                        index = (index + 1) % Lich.Resources.getInstance().mapObjectDefsFreqPool.length;
                                    }
                                }
                            }
                        }
                    }
                }
            })();
            return tilesMap;
        };
        // musí být sudé
        TilesMapGenerator.DEFAULT_MAP_WIDTH = 800;
        TilesMapGenerator.DEFAULT_MAP_HEIGHT = 500;
        TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL = 60;
        return TilesMapGenerator;
    }());
    Lich.TilesMapGenerator = TilesMapGenerator;
})(Lich || (Lich = {}));
;
