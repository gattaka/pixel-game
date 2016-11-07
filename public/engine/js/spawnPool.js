var Lich;
(function (Lich) {
    var SpawnPool = (function () {
        function SpawnPool() {
            this.spawnCooldown = [10000];
            this.spawnCooldownState = [0];
            this.spawnFactory = [Lich.Enemy.Redskull];
        }
        SpawnPool.prototype.update = function (delta, world) {
            if (world.enemiesCount >= SpawnPool.MAX_ENEMIES)
                return;
            var self = this;
            var canvas = world.game.getCanvas();
            // délky
            var borderWidthInTiles = world.render.pixelsDistanceToTiles(canvas.width) + 2 * SpawnPool.SPAWN_ZONE_SIZE;
            var borderHeightInTiles = world.render.pixelsDistanceToTiles(canvas.height) + 2 * SpawnPool.SPAWN_ZONE_SIZE;
            // počátek 
            var startTiles = world.render.pixelsToTiles(0, 0);
            startTiles.x -= SpawnPool.SPAWN_ZONE_SIZE;
            startTiles.y -= SpawnPool.SPAWN_ZONE_SIZE;
            // mapa
            var map = world.tilesMap;
            this.spawnCooldown.forEach(function (v, i) {
                self.spawnCooldownState[i] -= delta;
                if (self.spawnCooldownState[i] < 0) {
                    // TODO tohle by se mělo dělat až když je jisté, že je nepřítele kam usadit. 
                    // K tomu ale potřebuju jeho šířku a výšku a to je property kterou obecně nemůžu 
                    // staticky adresovat (nemám abstract static property). Bude potřeba vytvořit
                    // nějaký statický enemy-dimensions rejstřík
                    var enemy = new self.spawnFactory[i]();
                    var enWidth_1 = world.render.pixelsDistanceToTiles(enemy.width);
                    var enHeight_1 = world.render.pixelsDistanceToTiles(enemy.height);
                    // je možné nepřítele někam usadit?
                    // projdi vnější okraj obrazovky (tam kde hráč nevidí) a pokud nadješ prostor, 
                    // kam se nepřítel vejde, proveď spawn
                    var _loop_1 = function(y) {
                        var _loop_2 = function(x) {
                            // Pokud nejde o záporné souřadnice nebo mimo rámec
                            if (x < 0 || y < 0 || x >= map.width || y >= map.height)
                                return "continue";
                            // Pokud nejde o viditelnou část obrazovky
                            if (x > startTiles.x + SpawnPool.SPAWN_ZONE_SIZE
                                && x < startTiles.x + borderWidthInTiles - SpawnPool.SPAWN_ZONE_SIZE
                                && y > startTiles.y + SpawnPool.SPAWN_ZONE_SIZE
                                && y < startTiles.y + borderHeightInTiles - SpawnPool.SPAWN_ZONE_SIZE)
                                return "continue";
                            // Pak zkus najít prostor pro nepřítele
                            var fits = true;
                            (function () {
                                for (var ey = 0; ey < enHeight_1; ey++) {
                                    for (var ex = 0; ex < enWidth_1; ex++) {
                                        var result = world.isCollisionByTiles(x + ex, y + ey);
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
                                enemy.x = x;
                                enemy.y = y;
                                // podařilo se vytvořit a usadit nepřítele, nastav jeho spawn-cooldown
                                self.spawnCooldownState[i] = self.spawnCooldown[i];
                                return { value: void 0 };
                            }
                        };
                        for (var x = startTiles.x; x < startTiles.x + borderWidthInTiles; x++) {
                            var state_1 = _loop_2(x);
                            if (typeof state_1 === "object") return state_1;
                        }
                    };
                    for (var y = startTiles.y; y < startTiles.y + borderHeightInTiles; y++) {
                        var state_2 = _loop_1(y);
                        if (typeof state_2 === "object") return state_2.value;
                    }
                }
            });
        };
        SpawnPool.SPAWN_ZONE_SIZE = 20; // v tiles
        SpawnPool.MAX_ENEMIES = 4;
        return SpawnPool;
    }());
    Lich.SpawnPool = SpawnPool;
})(Lich || (Lich = {}));
