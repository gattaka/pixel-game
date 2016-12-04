/**
 * nature.ts
 *
 * Stará se přírodní děje ve světě, jako je růst stromů,
 * trávy a hub apod.
 */
var Lich;
(function (Lich) {
    var Nature = (function () {
        function Nature() {
            this.cooldownState = 1000;
            this.xt = 0;
            this.yt = 0;
            this.aboveSurface = true;
            this.aboveTopSurface = true;
        }
        Nature.getInstance = function () {
            if (!Nature.INSTANCE) {
                Nature.INSTANCE = new Nature();
            }
            return Nature.INSTANCE;
        };
        Nature.prototype.handleTick = function (delta, world) {
            var self = this;
            self.cooldownState -= delta;
            if (self.cooldownState <= 0) {
                self.cooldownState = Nature.COOLDOWN;
                var res = Lich.Resources.getInstance();
                var tilesMap = world.tilesMap;
                // TODO vyjmy z aplikace okno, na které hráč vidí
                for (var i = 0; i < Nature.PARTS_PER_STEP; i++) {
                    var surfaceVal = tilesMap.mapRecord.getValue(this.xt, this.yt);
                    if (surfaceVal) {
                        // narazil jsem na povrch, pokud jsem doposud měl prázdno, 
                        // pokus se spustit nějaké přírodní pochody
                        if (this.aboveSurface && this.yt > 2) {
                            var srfcDef = res.mapSurfaceDefs[res.surfaceIndex.getType(surfaceVal)];
                            // hlína?
                            if (srfcDef.srfcKey == Lich.SurfaceKey.SRFC_DIRT_KEY) {
                                var obj = tilesMap.mapObjectsTiles.getValue(this.xt, this.yt - 2);
                                if (obj) {
                                }
                                else {
                                    // nic tam není, dej tam trávu, kytky apod.
                                    var key = void 0;
                                    switch (Math.floor(Math.random() * 8)) {
                                        case 0:
                                            key = Lich.MapObjectKey.MAP_GRASS1_KEY;
                                            break;
                                        case 1:
                                            key = Lich.MapObjectKey.MAP_GRASS2_KEY;
                                            break;
                                        case 2:
                                            key = Lich.MapObjectKey.MAP_GRASS3_KEY;
                                            break;
                                        case 3:
                                            key = Lich.MapObjectKey.MAP_BUSH_KEY;
                                            break;
                                        case 4:
                                            key = Lich.MapObjectKey.MAP_BUSH2_KEY;
                                            break;
                                        case 5:
                                            switch (Math.floor(Math.random() * 5)) {
                                                case 0:
                                                    key = Lich.MapObjectKey.MAP_RED_PLANT_KEY;
                                                    break;
                                                case 1:
                                                    key = Lich.MapObjectKey.MAP_MAGENTA_PLANT_KEY;
                                                    break;
                                                case 2:
                                                    key = Lich.MapObjectKey.MAP_CYAN_PLANT_KEY;
                                                    break;
                                                case 3:
                                                    key = Lich.MapObjectKey.MAP_YELLOW_PLANT_KEY;
                                                    break;
                                            }
                                            break;
                                        case 6:
                                            key = Lich.MapObjectKey.MAP_TREE3_KEY;
                                            break;
                                        case 7:
                                            key = Lich.MapObjectKey.MAP_TREE4_KEY;
                                            break;
                                    }
                                    // self.render.placeObject(xt, yt - 1, Resources.getInstance().mapObjectDefs[grassKey]);
                                    // pokládání se dává na souřadnici povrchu, nikoliv objektu (takže to není -2)
                                    Lich.TilesMapTools.writeObjectRecord(tilesMap, this.xt, this.yt, Lich.Resources.getInstance().mapObjectDefs[key]);
                                }
                            }
                        }
                        // TODO zatím se nebude procházet prostor pod povrchem
                        this.xt += 2;
                        this.yt = 0;
                        continue;
                    }
                    else {
                        // nějaké prázdno
                        this.aboveSurface = true;
                    }
                    // Procházej mapu po sloupcích, aby šlo říct, že nad danou částí nic není
                    this.yt += 2;
                    if (this.yt >= tilesMap.height) {
                        this.yt = 0;
                        this.xt += 2;
                        if (this.xt >= tilesMap.width) {
                            this.xt = 0;
                            this.aboveSurface = true;
                            this.aboveTopSurface = true;
                        }
                    }
                }
            }
        };
        Nature.COOLDOWN = 1000;
        Nature.PARTS_PER_STEP = 50;
        return Nature;
    }());
    Lich.Nature = Nature;
})(Lich || (Lich = {}));
