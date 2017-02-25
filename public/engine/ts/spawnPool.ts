namespace Lich {
    class SpawnContext {
        public canvas: PIXI.WebGLRenderer;
        public borderWidthInTiles: number;
        public borderHeightInTiles: number;
        public startTiles: Coord2D;
        public map: TilesMap;
    }

    export class SpawnPool {

        private static INSTANCE: SpawnPool;

        private static SPAWN_ZONE_SIZE = 20; // v tiles
        private static MAX_ENEMIES = 20;

        private spawnCooldown = [2000, 2000];
        private spawnCooldownState = [0, 0];
        private spawnFactory = [Enemy.Bunny, Enemy.Chicken];

        public static getInstance() {
            if (!SpawnPool.INSTANCE) {
                SpawnPool.INSTANCE = new SpawnPool();
            }
            return SpawnPool.INSTANCE;
        }

        private constructor() {
        }

        private createContext(world: World): SpawnContext {
            let ctx = new SpawnContext();
            ctx.canvas = world.game.getRender();
            // délky
            ctx.borderWidthInTiles = world.render.pixelsDistanceToTiles(ctx.canvas.width) + 2 * SpawnPool.SPAWN_ZONE_SIZE;
            ctx.borderHeightInTiles = world.render.pixelsDistanceToTiles(ctx.canvas.height) + SpawnPool.SPAWN_ZONE_SIZE;
            // počátek 
            ctx.startTiles = world.render.pixelsToTiles(0, 0);
            ctx.startTiles.x -= SpawnPool.SPAWN_ZONE_SIZE;
            // mapa
            ctx.map = world.tilesMap;
            return ctx;
        }

        private innerSpawnAt(enemy, world: World, xp: number, yp: number): AbstractEnemy {
            let ei = 0;
            for (ei = 0; ei < world.enemies.length; ei++) {
                // buď najdi volné místo...
                if (!world.enemies[ei]) {
                    break;
                }
            }
            // ...nebo vlož položku na konec pole
            world.enemies[ei] = enemy;
            enemy.id = ei;
            enemy.x = xp;
            enemy.y = yp;
            world.enemiesCount++;

            world.entitiesCont.addChild(enemy);
            EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.ENEMY_COUNT_CHANGE, world.enemiesCount));
            // console.log("SPAWN: " + enemy.x + ":" + enemy.y + " (px) " + xt + ":" + (yt) + " (tls)");
            return enemy;
        }

        public spawnAt(enemyClass, world: World, xp: number, yp: number): AbstractEnemy {
            return this.innerSpawnAt(new enemyClass(), world, xp, yp);
        }

        public spawn(enemyClass, world: World): AbstractEnemy {
            let self = this;
            let ctx = self.createContext(world);
            // TODO tohle by se mělo dělat až když je jisté, že je nepřítele kam usadit. 
            // K tomu ale potřebuju jeho šířku a výšku a to je property kterou obecně nemůžu 
            // staticky adresovat (nemám abstract static property). Bude potřeba vytvořit
            // nějaký statický enemy-dimensions rejstřík
            let enemy: AbstractEnemy = new enemyClass();
            let enWidth = world.render.pixelsDistanceToTiles(enemy.width);
            let enHeight = world.render.pixelsDistanceToTiles(enemy.height);

            // je možné nepřítele někam usadit?
            // projdi vnější okraj obrazovky (tam kde hráč nevidí) a pokud nadješ prostor, 
            // kam se nepřítel vejde, proveď spawn.

            let xstart, xlimit, xstep;
            let ystart, ylimit, ystep;
            if (Math.random() > 0.5) {
                xstart = ctx.startTiles.x;
                xlimit = ctx.startTiles.x + ctx.borderWidthInTiles;
                xstep = 1;
            } else {
                xstart = ctx.startTiles.x + ctx.borderWidthInTiles - 1;
                xlimit = ctx.startTiles.x;
                xstep = -1;
            }

            if (Math.random() > 0.5) {
                ystart = ctx.startTiles.y;
                ylimit = ctx.startTiles.y + ctx.borderHeightInTiles;
                ystep = 1;
            } else {
                ystart = ctx.startTiles.y + ctx.borderHeightInTiles - 1;
                ylimit = ctx.startTiles.y;
                ystep = -1;
            }

            for (let yt = ystart; yt != ylimit; yt += ystep) {
                // Pokud nejde o záporné souřadnice nebo mimo rámec
                if (yt < 0 || yt >= ctx.map.height)
                    continue;

                // pokud nejde o nepovolenou výšku mapy
                let percentY = (yt / ctx.map.height) * 100;
                if (percentY > enemy.maxDepth || percentY < enemy.minDepth)
                    continue;

                for (let xt = xstart; xt != xlimit; xt += xstep) {

                    // Pokud nejde o záporné souřadnice nebo mimo rámec
                    if (xt < 0 || xt >= ctx.map.width)
                        continue;

                    // Pokud nejde o viditelnou část obrazovky
                    if (xt + enWidth > ctx.startTiles.x + SpawnPool.SPAWN_ZONE_SIZE
                        && xt < ctx.startTiles.x + ctx.borderWidthInTiles - SpawnPool.SPAWN_ZONE_SIZE
                        && yt + enHeight > ctx.startTiles.y
                        && yt < ctx.startTiles.y + ctx.borderHeightInTiles - SpawnPool.SPAWN_ZONE_SIZE)
                        continue;

                    // Pak zkus najít prostor pro nepřítele
                    let fits = true;
                    if (!enemy.hovers) {
                        (() => {
                            for (let eyt = 0; eyt <= enHeight; eyt++) {
                                for (let ext = 0; ext <= enWidth; ext++) {
                                    let result = world.isCollisionByTiles(xt + ext, yt + eyt);
                                    if (result.hit) {
                                        fits = false;
                                        return;
                                    }
                                }
                            }
                        })();
                    }

                    // Ok, vejde se
                    if (fits) {
                        let ePxCoord = world.render.tilesToPixel(xt, yt);
                        return self.innerSpawnAt(enemy, world, ePxCoord.x, ePxCoord.y);
                    }
                }
            }

            return;
        }

        update(delta: number, world: World) {
            if (world.enemiesCount >= SpawnPool.MAX_ENEMIES)
                return;
            let self = this;
            this.spawnCooldown.forEach((v, i) => {
                self.spawnCooldownState[i] -= delta;
                if (self.spawnCooldownState[i] < 0) {
                    if (self.spawn(self.spawnFactory[i], world)) {
                        // podařilo se vytvořit a usadit nepřítele, nastav jeho spawn-cooldown
                        self.spawnCooldownState[i] = self.spawnCooldown[i];
                    }
                }
            });

            Enemy.ChickenBoss.currentAngerCooldown += delta;
            if (Enemy.ChickenBoss.currentAngerCooldown > Enemy.ChickenBoss.ANGER_COOLDOWN) {
                Enemy.ChickenBoss.currentAngerCooldown = 0;
                if (Enemy.ChickenBoss.chickenKills > 0) Enemy.ChickenBoss.chickenKills--;
                // console.log("Enemy.ChickenBoss.chickenKills: %d", Enemy.ChickenBoss.chickenKills);
            }
        }
    }
}