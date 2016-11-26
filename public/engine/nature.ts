/**
 * nature.ts 
 * 
 * Stará se přírodní děje ve světě, jako je růst stromů,
 * trávy a hub apod.
 */
namespace Lich {

    export class Nature {

        private static INSTANCE: Nature;
        private static COOLDOWN = 1000;
        private static PARTS_PER_STEP = 50;

        private cooldownState = 1000;

        private xt = 0;
        private yt = 0;
        private aboveSurface = true;
        private aboveTopSurface = true;

        public static getInstance() {
            if (!Nature.INSTANCE) {
                Nature.INSTANCE = new Nature();
            }
            return Nature.INSTANCE;
        }

        private constructor() {
        }

        public handleTick(delta: number, world: World) {
            var self = this;

            self.cooldownState -= delta;
            if (self.cooldownState <= 0) {
                self.cooldownState = Nature.COOLDOWN;

                let res = Resources.getInstance();
                let tilesMap = world.tilesMap;
                // TODO vyjmy z aplikace okno, na které hráč vidí

                for (let i = 0; i < Nature.PARTS_PER_STEP; i++) {

                    let surfaceVal = tilesMap.mapRecord.getValue(this.xt, this.yt);
                    if (surfaceVal) {
                        // narazil jsem na povrch, pokud jsem doposud měl prázdno, 
                        // pokus se spustit nějaké přírodní pochody
                        if (this.aboveSurface && this.yt > 2) {
                            let srfcDef = res.mapSurfaceDefs[res.surfaceIndex.getType(surfaceVal)];
                            // hlína?
                            if (srfcDef.srfcKey == SurfaceKey.SRFC_DIRT_KEY) {
                                let obj = tilesMap.mapObjectsTiles.getValue(this.xt, this.yt - 2);
                                if (obj) {
                                    // TODO Stromy
                                } else {
                                    // nic tam není, dej tam trávu
                                    let key;
                                    switch (Math.floor(Math.random() * 11)) {
                                        case 0: key = MapObjectKey.MAP_GRASS1_KEY; break;
                                        case 1: key = MapObjectKey.MAP_GRASS2_KEY; break;
                                        case 2: key = MapObjectKey.MAP_GRASS3_KEY; break;
                                        case 3: key = MapObjectKey.MAP_BUSH_KEY; break;
                                        case 4: key = MapObjectKey.MAP_BUSH2_KEY; break;
                                        case 5: key = MapObjectKey.MAP_PLANT_KEY; break;
                                        case 6: key = MapObjectKey.MAP_PLANT2_KEY; break;
                                        case 7: key = MapObjectKey.MAP_PLANT3_KEY; break;
                                        case 8: key = MapObjectKey.MAP_PLANT4_KEY; break;
                                        case 9: key = MapObjectKey.MAP_TREE3_KEY; break;
                                        case 10: key = MapObjectKey.MAP_TREE4_KEY; break;
                                    }
                                    // self.render.placeObject(xt, yt - 1, Resources.getInstance().mapObjectDefs[grassKey]);
                                    // pokládání se dává na souřadnici povrchu, nikoliv objektu (takže to není -2)
                                    TilesMapTools.writeObjectRecord(tilesMap, this.xt, this.yt, Resources.getInstance().mapObjectDefs[key]);
                                    // console.log("Grass created on %d:%d", this.xt, this.yt);
                                }
                            }
                        }
                        // TODO zatím se nebude procházet prostor pod povrchem
                        this.xt += 2;
                        this.yt = 0;
                        continue;

                        // už jsem pod nějakým povrchem
                        // this.aboveSurface = false;
                        // this.aboveTopSurface = false;
                    } else {
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


        }
    }
}
