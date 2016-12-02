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
            ctx.borderHeightInTiles = world.render.pixelsDistanceToTiles(ctx.canvas.height) + 2 * SpawnPool.SPAWN_ZONE_SIZE;
            // počátek 
            ctx.startTiles = world.render.pixelsToTiles(0, 0);
            ctx.startTiles.x -= SpawnPool.SPAWN_ZONE_SIZE;
            ctx.startTiles.y -= SpawnPool.SPAWN_ZONE_SIZE;
            // mapa
            ctx.map = world.tilesMap;
            return ctx;
        };
        SpawnPool.prototype.makeSpawn = function (enemyClass, world) {
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
            var tryToSpawn = function (xt) {
                var _loop_1 = function(yt) {
                    // Pokud nejde o záporné souřadnice nebo mimo rámec
                    if (xt < 0 || yt < 0 || xt >= ctx.map.width || yt >= ctx.map.height)
                        return { value: false };
                    // Pokud nejde o viditelnou část obrazovky
                    if (xt + enWidth > ctx.startTiles.x + SpawnPool.SPAWN_ZONE_SIZE
                        && xt < ctx.startTiles.x + ctx.borderWidthInTiles - SpawnPool.SPAWN_ZONE_SIZE
                        && yt + enHeight > ctx.startTiles.y + SpawnPool.SPAWN_ZONE_SIZE
                        && yt < ctx.startTiles.y + ctx.borderHeightInTiles - SpawnPool.SPAWN_ZONE_SIZE)
                        return { value: false };
                    // Pak zkus najít prostor pro nepřítele
                    var fits = true;
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
                for (var yt = ctx.startTiles.y + ctx.borderHeightInTiles; yt > ctx.startTiles.y; yt--) {
                    var state_1 = _loop_1(yt);
                    if (typeof state_1 === "object") return state_1.value;
                }
            };
            // Jednou to zkus zleva, jednou zprava
            if (Math.random() > 0.5) {
                for (var x = ctx.startTiles.x; x < ctx.startTiles.x + ctx.borderWidthInTiles; x++)
                    if (tryToSpawn(x))
                        return true;
            }
            else {
                for (var x = ctx.startTiles.x + ctx.borderWidthInTiles; x > ctx.startTiles.x; x--)
                    if (tryToSpawn(x))
                        return true;
            }
            return false;
        };
        SpawnPool.prototype.spawn = function (enemyClass, world) {
            return this.makeSpawn(enemyClass, world);
        };
        SpawnPool.prototype.update = function (delta, world) {
            if (world.enemiesCount >= SpawnPool.MAX_ENEMIES)
                return;
            var self = this;
            this.spawnCooldown.forEach(function (v, i) {
                self.spawnCooldownState[i] -= delta;
                if (self.spawnCooldownState[i] < 0) {
                    if (self.makeSpawn(self.spawnFactory[i], world)) {
                        // podařilo se vytvořit a usadit nepřítele, nastav jeho spawn-cooldown
                        self.spawnCooldownState[i] = self.spawnCooldown[i];
                    }
                }
            });
        };
        SpawnPool.SPAWN_ZONE_SIZE = 20; // v tiles
        SpawnPool.MAX_ENEMIES = 20;
        return SpawnPool;
    }());
    Lich.SpawnPool = SpawnPool;
})(Lich || (Lich = {}));
