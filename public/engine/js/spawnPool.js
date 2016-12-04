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
            ctx.canvas = world.game.getCanvas();
            // délky
            ctx.borderWidthInTiles = world.render.pixelsDistanceToTiles(ctx.canvas.width) + 2 * SpawnPool.SPAWN_ZONE_SIZE;
            ctx.borderHeightInTiles = world.render.pixelsDistanceToTiles(ctx.canvas.height) + SpawnPool.SPAWN_ZONE_SIZE;
            // počátek 
            ctx.startTiles = world.render.pixelsToTiles(0, 0);
            ctx.startTiles.x -= SpawnPool.SPAWN_ZONE_SIZE;
            // mapa
            ctx.map = world.tilesMap;
            return ctx;
        };
        SpawnPool.prototype.spawn = function (enemyClass, world) {
            var self = this;
            var ctx = self.createContext(world);
            // TODO tohle by se mělo dělat až když je jisté, že je nepřítele kam usadit. 
            // K tomu ale potřebuju jeho šířku a výšku a to je property kterou obecně nemůžu 
            // staticky adresovat (nemám abstract static property). Bude potřeba vytvořit
            // nějaký statický enemy-dimensions rejstřík
            var enemy = new enemyClass();
            var enWidth = world.render.pixelsDistanceToTiles(enemy.width);
            var enHeight = world.render.pixelsDistanceToTiles(enemy.height);
            // je možné nepřítele někam usadit?
            // projdi vnější okraj obrazovky (tam kde hráč nevidí) a pokud nadješ prostor, 
            // kam se nepřítel vejde, proveď spawn. Procházej obrazovku zespoda, aby se 
            // nepřátelé nespawnovaly ve vzduchu a nepadaly na hráče z rohů obrazovky.
            // Zároveň ale nespawnuj pod obrazovkou, aby mohli nepřátelé volně dojít k hráči
            // a nemuseli šplhat
            var tryToSpawn = function (yt) {
                var _loop_1 = function(xt) {
                    // Pokud nejde o záporné souřadnice nebo mimo rámec
                    if (yt < 0 || yt >= ctx.map.height)
                        return { value: false };
                    if (xt < 0 || xt >= ctx.map.width)
                        return "continue";
                    // pokud nejde o nepovolenou výšku mapy
                    var percentY = (yt / ctx.map.height) * 100;
                    if (percentY > enemy.maxDepth || percentY < enemy.minDepth)
                        return { value: false };
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
                        world.enemiesCount++;
                        world.addChild(enemy);
                        Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.ENEMY_COUNT_CHANGE, world.enemiesCount));
                        var ePxCoord = world.render.tilesToPixel(xt, yt);
                        enemy.x = ePxCoord.x;
                        enemy.y = ePxCoord.y;
                        console.log("SPAWN: " + enemy.x + ":" + enemy.y + " (px) " + xt + ":" + (yt) + " (tls)");
                        return { value: true };
                    }
                };
                for (var xt = ctx.startTiles.x; xt < ctx.startTiles.x + ctx.borderWidthInTiles; xt++) {
                    var state_1 = _loop_1(xt);
                    if (typeof state_1 === "object") return state_1.value;
                }
            };
            // Jednou to zkus zdola, jednou shora
            if (Math.random() > 0.5) {
                for (var yt = ctx.startTiles.y + ctx.borderHeightInTiles - 1; yt >= ctx.startTiles.y; yt--)
                    if (tryToSpawn(yt))
                        return true;
            }
            else {
                for (var yt = ctx.startTiles.y; yt < ctx.startTiles.y + ctx.borderHeightInTiles; yt++)
                    if (tryToSpawn(yt))
                        return true;
            }
            return false;
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
                console.log("Enemy.ChickenBoss.chickenKills: %d", Lich.Enemy.ChickenBoss.chickenKills);
            }
        };
        SpawnPool.SPAWN_ZONE_SIZE = 20; // v tiles
        SpawnPool.MAX_ENEMIES = 20;
        return SpawnPool;
    }());
    Lich.SpawnPool = SpawnPool;
})(Lich || (Lich = {}));
