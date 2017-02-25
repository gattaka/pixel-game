var Lich;
(function (Lich) {
    var SpawnContext = (function () {
        function SpawnContext() {
        }
        return SpawnContext;
    }());
    var SpawnPool = (function () {
        function SpawnPool() {
            this.spawnCooldown = [2000, 2000];
            this.spawnCooldownState = [0, 0];
            this.spawnFactory = [Lich.Enemy.Bunny, Lich.Enemy.Chicken];
        }
        SpawnPool.getInstance = function () {
            if (!SpawnPool.INSTANCE) {
                SpawnPool.INSTANCE = new SpawnPool();
            }
            return SpawnPool.INSTANCE;
        };
        SpawnPool.prototype.createContext = function (world) {
            var ctx = new SpawnContext();
            ctx.sceneWidth = world.game.getSceneWidth();
            ctx.sceneHeight = world.game.getSceneHeight();
            // délky
            ctx.borderWidthInTiles = world.render.pixelsDistanceToTiles(ctx.sceneWidth) + 2 * SpawnPool.SPAWN_ZONE_SIZE;
            ctx.borderHeightInTiles = world.render.pixelsDistanceToTiles(ctx.sceneHeight) + SpawnPool.SPAWN_ZONE_SIZE;
            // počátek 
            ctx.startTiles = world.render.pixelsToTiles(0, 0);
            ctx.startTiles.x -= SpawnPool.SPAWN_ZONE_SIZE;
            // mapa
            ctx.map = world.tilesMap;
            return ctx;
        };
        SpawnPool.prototype.innerSpawnAt = function (enemy, world, xp, yp) {
            var ei = 0;
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
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.ENEMY_COUNT_CHANGE, world.enemiesCount));
            // console.log("SPAWN: " + enemy.x + ":" + enemy.y + " (px) " + xt + ":" + (yt) + " (tls)");
            return enemy;
        };
        SpawnPool.prototype.spawnAt = function (enemyClass, world, xp, yp) {
            return this.innerSpawnAt(new enemyClass(), world, xp, yp);
        };
        SpawnPool.prototype.spawn = function (enemyClass, world) {
            var self = this;
            var ctx = self.createContext(world);
            // TODO tohle by se mělo dělat až když je jisté, že je nepřítele kam usadit. 
            // K tomu ale potřebuju jeho šířku a výšku a to je property kterou obecně nemůžu 
            // staticky adresovat (nemám abstract static property). Bude potřeba vytvořit
            // nějaký statický enemy-dimensions rejstřík
            var enemy = new enemyClass();
            var enWidth = world.render.pixelsDistanceToTiles(enemy.fixedWidth);
            var enHeight = world.render.pixelsDistanceToTiles(enemy.fixedHeight);
            // je možné nepřítele někam usadit?
            // projdi vnější okraj obrazovky (tam kde hráč nevidí) a pokud nadješ prostor, 
            // kam se nepřítel vejde, proveď spawn.
            var xstart, xlimit, xstep;
            var ystart, ylimit, ystep;
            if (Math.random() > 0.5) {
                xstart = ctx.startTiles.x;
                xlimit = ctx.startTiles.x + ctx.borderWidthInTiles;
                xstep = 1;
            }
            else {
                xstart = ctx.startTiles.x + ctx.borderWidthInTiles - 1;
                xlimit = ctx.startTiles.x;
                xstep = -1;
            }
            if (Math.random() > 0.5) {
                ystart = ctx.startTiles.y;
                ylimit = ctx.startTiles.y + ctx.borderHeightInTiles;
                ystep = 1;
            }
            else {
                ystart = ctx.startTiles.y + ctx.borderHeightInTiles - 1;
                ylimit = ctx.startTiles.y;
                ystep = -1;
            }
            var _loop_1 = function (yt) {
                // Pokud nejde o záporné souřadnice nebo mimo rámec
                if (yt < 0 || yt >= ctx.map.height)
                    return "continue";
                // pokud nejde o nepovolenou výšku mapy
                var percentY = (yt / ctx.map.height) * 100;
                if (percentY > enemy.maxDepth || percentY < enemy.minDepth)
                    return "continue";
                var _loop_2 = function (xt) {
                    // Pokud nejde o záporné souřadnice nebo mimo rámec
                    if (xt < 0 || xt >= ctx.map.width)
                        return "continue";
                    // Pokud nejde o viditelnou část obrazovky
                    if (xt + enWidth > ctx.startTiles.x + SpawnPool.SPAWN_ZONE_SIZE
                        && xt < ctx.startTiles.x + ctx.borderWidthInTiles - SpawnPool.SPAWN_ZONE_SIZE
                        && yt + enHeight > ctx.startTiles.y
                        && yt < ctx.startTiles.y + ctx.borderHeightInTiles - SpawnPool.SPAWN_ZONE_SIZE)
                        return "continue";
                    // Pak zkus najít prostor pro nepřítele
                    var fits = true;
                    if (!enemy.hovers) {
                        (function () {
                            for (var eyt = 0; eyt <= enHeight; eyt++) {
                                for (var ext = 0; ext <= enWidth; ext++) {
                                    var result = world.isCollisionByTiles(xt + ext, yt + eyt);
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
                        var ePxCoord = world.render.tilesToPixel(xt, yt);
                        return { value: self.innerSpawnAt(enemy, world, ePxCoord.x, ePxCoord.y) };
                    }
                };
                for (var xt = xstart; xt != xlimit; xt += xstep) {
                    var state_1 = _loop_2(xt);
                    if (typeof state_1 === "object")
                        return state_1;
                }
            };
            for (var yt = ystart; yt != ylimit; yt += ystep) {
                var state_2 = _loop_1(yt);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
            return;
        };
        SpawnPool.prototype.update = function (delta, world) {
            if (world.enemiesCount >= SpawnPool.MAX_ENEMIES)
                return;
            var self = this;
            this.spawnCooldown.forEach(function (v, i) {
                self.spawnCooldownState[i] -= delta;
                if (self.spawnCooldownState[i] < 0) {
                    if (self.spawn(self.spawnFactory[i], world)) {
                        // podařilo se vytvořit a usadit nepřítele, nastav jeho spawn-cooldown
                        self.spawnCooldownState[i] = self.spawnCooldown[i];
                    }
                }
            });
            Lich.Enemy.ChickenBoss.currentAngerCooldown += delta;
            if (Lich.Enemy.ChickenBoss.currentAngerCooldown > Lich.Enemy.ChickenBoss.ANGER_COOLDOWN) {
                Lich.Enemy.ChickenBoss.currentAngerCooldown = 0;
                if (Lich.Enemy.ChickenBoss.chickenKills > 0)
                    Lich.Enemy.ChickenBoss.chickenKills--;
            }
        };
        return SpawnPool;
    }());
    SpawnPool.SPAWN_ZONE_SIZE = 20; // v tiles
    SpawnPool.MAX_ENEMIES = 20;
    Lich.SpawnPool = SpawnPool;
})(Lich || (Lich = {}));
