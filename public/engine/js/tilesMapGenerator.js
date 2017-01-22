/**
 * map.js
 *
 * Generuje dílkovou mapu světa (povrchy, pozadí a objekty)
 *
 */
var Lich;
(function (Lich) {
    var AsyncLoad = (function () {
        function AsyncLoad() {
            this.queue = [];
        }
        AsyncLoad.prototype.load = function (callback) {
            this.queue.push(callback);
            return this;
        };
        AsyncLoad.prototype.innerRun = function (taskId) {
            var self = this;
            if (taskId < self.queue.length)
                setTimeout(function () {
                    self.queue[taskId++]();
                    self.innerRun(taskId);
                }, 1);
        };
        AsyncLoad.prototype.run = function () {
            this.innerRun(0);
        };
        return AsyncLoad;
    }());
    Lich.AsyncLoad = AsyncLoad;
    var TilesMapGenerator = (function () {
        function TilesMapGenerator() {
        }
        TilesMapGenerator.serialize = function (tilesMap) {
            var data = {
                version: TilesMapGenerator.WORLD_FORMAT_VERSION,
                spwx: tilesMap.spawnPoint ? tilesMap.spawnPoint.x : undefined,
                spwy: tilesMap.spawnPoint ? tilesMap.spawnPoint.y : undefined,
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
                        data.srf.push(count);
                        data.srf.push(last);
                        last = val;
                        count = 1; // 1 protože už je načten
                    }
                    else {
                        count++;
                    }
                }
            }
            data.srf.push(count);
            data.srf.push(last);
            last = tilesMap.mapBgrRecord.getValue(0, 0);
            count = 0; // 0 protože ještě jsem nic nenačetl
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    var val = tilesMap.mapBgrRecord.getValue(x, y);
                    if (last !== val) {
                        data.bgr.push(count);
                        data.bgr.push(last);
                        last = val;
                        count = 1; // 1 protože už je načten
                    }
                    else {
                        count++;
                    }
                }
            }
            data.bgr.push(count);
            data.bgr.push(last);
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    var val = tilesMap.mapObjRecord.getValue(x, y);
                    if (val == 0 || val) {
                        data.obj.push(x);
                        data.obj.push(y);
                        data.obj.push(val);
                    }
                }
            }
            return data;
        };
        TilesMapGenerator.deserialize = function (data, callback) {
            console.log("Loading world version: " + (data.version ? data.version : "<1.3"));
            var async = new AsyncLoad();
            var tilesMap = new Lich.TilesMap(data.w, data.h);
            // let total = (data.srf.length + data.bgr.length) / 2 + data.obj.length;
            var total = 4;
            var progress = 0;
            if (data.spwx && data.spwy)
                tilesMap.spawnPoint = new Lich.Coord2D(data.spwx, data.spwy);
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, 0));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Loading surface"));
            });
            async.load(function () {
                var count = 0;
                for (var v = 0; v < data.srf.length; v += 2) {
                    var amount = data.srf[v];
                    var key = data.srf[v + 1];
                    for (var i = 0; i < amount; i++) {
                        tilesMap.mapRecord.setValue(count % data.w, Math.floor(count / data.w), key);
                        count++;
                    }
                }
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Loading background"));
            });
            async.load(function () {
                if (!data.version || data.version < 1.3) {
                    tilesMap.mapBgrRecord = new Lich.Array2D(tilesMap.mapRecord.width, tilesMap.mapRecord.height);
                }
                else {
                    var count = 0;
                    for (var v = 0; v < data.bgr.length; v += 2) {
                        var amount = data.bgr[v];
                        var key = data.bgr[v + 1];
                        for (var i = 0; i < amount; i++) {
                            tilesMap.mapBgrRecord.setValue(count % data.w, Math.floor(count / data.w), key);
                            count++;
                        }
                    }
                }
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Checking/Updating map version"));
            });
            async.load(function () {
                if (!data.version || data.version < 1.4) {
                    TilesMapGenerator.seedSurface(tilesMap, Lich.Resources.getInstance().getSurfaceDef(Lich.SurfaceKey.SRFC_GOLD_KEY));
                    TilesMapGenerator.polishMap(tilesMap);
                }
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Loading objects"));
            });
            async.load(function () {
                for (var v = 0; v < data.obj.length; v += 3) {
                    var x = data.obj[v];
                    var y = data.obj[v + 1];
                    var key = data.obj[v + 2];
                    tilesMap.mapObjRecord.setValue(x, y, key);
                    Lich.TilesMapTools.writeObjectRecord(tilesMap, x, y, Lich.Resources.getInstance().mapObjectDefs[key]);
                }
                ;
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_FINISHED));
                callback(tilesMap);
            });
            async.run();
        };
        TilesMapGenerator.seedSurface = function (tilesMap, definition) {
            var depositP = tilesMap.width * tilesMap.height * 0.005;
            var cooldown = definition.seedCooldown;
            for (var i = 0; i < depositP; i++) {
                if (cooldown-- <= 0) {
                    var depositX = Math.floor(Math.random() * tilesMap.width);
                    var depositY = Math.floor(Math.random() * tilesMap.height);
                    if ((depositY / tilesMap.height) > (definition.minDepth / 100)
                        && (depositY / tilesMap.height) < (definition.maxDepth / 100)) {
                        var dia = Math.floor(Math.random() * definition.maxSize) + 2;
                        TilesMapGenerator.createDeposit(tilesMap, depositX, depositY, dia, definition.mapObjKey);
                        cooldown = definition.seedCooldown;
                    }
                }
            }
        };
        TilesMapGenerator.createDeposit = function (tilesMap, x0, y0, d0, oreKey) {
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
                        var posIndex = tilesMap.mapRecord.getValue(_x, _y);
                        if (posIndex != Lich.SurfacePositionKey.VOID) {
                            // protože skáču po dvou, musím udělat vždy v každé
                            // ose dva zápisy, jinak by vznikla mřížka
                            for (var __x = _x; __x <= _x + 1; __x++) {
                                for (var __y = _y; __y <= _y + 1; __y++) {
                                    // nahradí aktuální dílek dílkem daného minerálu
                                    // přičemž zachová pozici dílku
                                    tilesMap.mapRecord.setValue(__x, __y, Lich.Resources.getInstance().surfaceIndex.getMiddlePositionIndexByCoordPattern(__x, __y, oreKey));
                                }
                            }
                            for (var __x = _x - 1; __x <= _x + 2; __x++) {
                                for (var __y = _y - 1; __y <= _y + 2; __y++) {
                                    var val = tilesMap.mapRecord.getValue(__x, __y);
                                    if (val != null) {
                                        if (val !== Lich.SurfacePositionKey.VOID) {
                                            var srfcType = Lich.Resources.getInstance().surfaceIndex.getType(val);
                                            // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
                                            if (__x === _x - 1 || __x === _x + 2 || __y === _y - 1 || __y === _y + 2) {
                                                // okraje vyresetuj
                                                tilesMap.mapRecord.setValue(__x, __y, Lich.Resources.getInstance().surfaceIndex.getMiddlePositionIndexByCoordPattern(__x, __y, srfcType));
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
                            var auxX = _x;
                            var auxY = _y;
                            if (_x === x + d)
                                auxX -= 2;
                            if (_y === y + d)
                                auxY -= 2;
                            TilesMapGenerator.createDeposit(tilesMap, auxX, auxY, d - 2, oreKey);
                        }
                    }
                }
            }
        };
        TilesMapGenerator.polishMap = function (tilesMap) {
            // hrany
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    Lich.TilesMapTools.generateEdge(tilesMap.mapRecord, x, y, false);
                }
            }
            // rohy
            for (var y = 0; y < tilesMap.height; y++) {
                for (var x = 0; x < tilesMap.width; x++) {
                    Lich.TilesMapTools.generateCorner(tilesMap.mapRecord, x, y, false);
                }
            }
        };
        TilesMapGenerator.createNew = function (callback, width, height, groundLevel) {
            if (width === void 0) { width = TilesMapGenerator.DEFAULT_MAP_WIDTH; }
            if (height === void 0) { height = TilesMapGenerator.DEFAULT_MAP_HEIGHT; }
            if (groundLevel === void 0) { groundLevel = TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL; }
            var async = new AsyncLoad();
            var total = 6;
            var progress = 0;
            var tilesMap = new Lich.TilesMap(TilesMapGenerator.DEFAULT_MAP_WIDTH, TilesMapGenerator.DEFAULT_MAP_HEIGHT);
            var mass = tilesMap.height * tilesMap.width;
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, 0));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Preparing hills shape"));
            });
            var hills;
            async.load(function () {
                // hills profile
                hills = new Array();
                // main
                var mainSpeed = 180 / tilesMap.width;
                var mainAmp = 20;
                var mainShift = Math.random() * 180;
                // osc1
                var osc1Speed = 0.5;
                var osc1Amp = 1;
                var osc1Shift = 0;
                // osc2
                var osc2Speed = 5;
                var osc2Amp = 2;
                var osc2Shift = 0;
                // osc3
                var osc3Speed = 10;
                var osc3Amp = 0.5;
                var osc3Shift = 0;
                for (var x = 0; x < tilesMap.width; x++) {
                    var xx = x * mainSpeed + mainShift;
                    var y1 = Math.sin(osc1Speed * Math.PI / 180 * (xx + osc1Shift)) * osc1Amp;
                    var y2 = Math.sin(osc2Speed * Math.PI / 180 * (xx + osc2Shift)) * osc2Amp;
                    var y3 = Math.sin(osc3Speed * Math.PI / 180 * (xx + osc3Shift)) * osc3Amp;
                    hills[x] = Math.abs(y1 + y2 + y3) * mainAmp;
                }
            });
            var fillTile = function (x, y, callback) {
                for (var _x = x; _x <= x + 1; _x++) {
                    for (var _y = y; _y <= y + 1; _y++) {
                        callback(_x, _y);
                    }
                }
            };
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Creating hills"));
            });
            async.load(function () {
                // base generation
                for (var y = 0; y < tilesMap.height; y += 2) {
                    for (var x = 0; x < tilesMap.width; x += 2) {
                        // aplikuj profil kopce pokud je vytvořen "vzduch" mapy
                        fillTile(x, y, function (nx, ny) {
                            // získá výchozí prostřední dílek dle vzoru, 
                            // který se opakuje, aby mapa byla pestřejší
                            tilesMap.mapRecord.setValue(nx, ny, y > TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL + hills[x] ? Lich.Resources.getInstance().surfaceIndex.getMiddlePositionIndexByCoordPattern(nx, ny, Lich.SurfaceKey.SRFC_DIRT_KEY)
                                : Lich.SurfacePositionKey.VOID);
                        });
                    }
                }
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Punching map holes"));
            });
            async.load(function () {
                // Holes
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
                var holesP = mass * 0.001;
                for (var i = 0; i < holesP; i++) {
                    var dia = Math.floor(Math.random() * 4) + 2;
                    var holeX = Math.floor(Math.random() * tilesMap.width);
                    var holeY = Math.floor(Math.random() * tilesMap.height);
                    createHole(holeX, holeY, dia);
                }
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Creating ore deposits"));
            });
            async.load(function () {
                // Minerály 
                // random deposit
                var depositP = mass * 0.005;
                var _loop_1 = function(i) {
                    var depositX = Math.floor(Math.random() * tilesMap.width);
                    var depositY = Math.floor(Math.random() * tilesMap.height);
                    // z čeho bude ložisko?
                    Lich.Resources.getInstance().mapSurfacesFreqPool.yield(function (definition) {
                        if ((depositY / tilesMap.height) > (definition.minDepth / 100)
                            && (depositY / tilesMap.height) < (definition.maxDepth / 100)) {
                            var dia = Math.floor(Math.random() * definition.maxSize) + 2;
                            TilesMapGenerator.createDeposit(tilesMap, depositX, depositY, dia, definition.mapObjKey);
                            return true;
                        }
                        return false;
                    });
                };
                for (var i = 0; i < depositP; i++) {
                    _loop_1(i);
                }
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Polishing terrain"));
            });
            async.load(function () {
                TilesMapGenerator.polishMap(tilesMap);
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, "Placing map objects"));
            });
            async.load(function () {
                // objekty 
                var isFree = function (x0, y0, width, height) {
                    for (var y = y0 - height; y <= y0; y++) {
                        for (var x = x0; x <= x0 + width - 1; x++) {
                            // spodní buňky musí být všechny tvořený plochou DIRT.T
                            // objekt nemůže "překlenovat" díru nebo viset z okraje
                            // nelze kolidovat s jiným objektem
                            if ((y === y0 && (Lich.Resources.getInstance().surfaceIndex.isTopPosition(tilesMap.mapRecord.getValue(x, y)) == false
                                || Lich.Resources.getInstance().surfaceIndex.getType(tilesMap.mapRecord.getValue(x, y)) != Lich.SurfaceKey.SRFC_DIRT_KEY))
                                || (y !== y0 && tilesMap.mapRecord.getValue(x, y) !== Lich.SurfacePositionKey.VOID)
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
                        if (Lich.Resources.getInstance().surfaceIndex.isTopPosition(val)) {
                            Lich.Resources.getInstance().mapObjectDefsFreqPool.yield(function (definition) {
                                var lvl = TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL - 1;
                                if (((y - lvl) / (tilesMap.height - lvl)) > (definition.minDepth / 100)
                                    && ((y - lvl) / (tilesMap.height - lvl)) < (definition.maxDepth / 100)
                                    && isFree(x, y, definition.mapSpriteWidth, definition.mapSpriteHeight)) {
                                    Lich.TilesMapTools.writeObjectRecord(tilesMap, x, y, definition);
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                }
            });
            async.load(function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, ++progress / total));
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_FINISHED));
                callback(tilesMap);
            });
            async.run();
        };
        TilesMapGenerator.WORLD_FORMAT_VERSION = 1.4;
        // musí být sudé
        TilesMapGenerator.DEFAULT_MAP_WIDTH = 2000;
        TilesMapGenerator.DEFAULT_MAP_HEIGHT = 1000;
        TilesMapGenerator.DEFAULT_MAP_GROUND_LEVEL = 50;
        return TilesMapGenerator;
    }());
    Lich.TilesMapGenerator = TilesMapGenerator;
})(Lich || (Lich = {}));
;
