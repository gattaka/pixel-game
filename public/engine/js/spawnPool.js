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
            var borderHeightInTiles = world.render.pixelsDistanceToTiles(canvas.height) + SpawnPool.SPAWN_ZONE_SIZE;
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
                    var enemy_1 = new self.spawnFactory[i]();
                    var enWidth_1 = world.render.pixelsDistanceToTiles(enemy_1.width);
                    var enHeight_1 = world.render.pixelsDistanceToTiles(enemy_1.height);
                    // je možné nepřítele někam usadit?
                    // projdi vnější okraj obrazovky (tam kde hráč nevidí) a pokud nadješ prostor, 
                    // kam se nepřítel vejde, proveď spawn. Procházej obrazovku zespoda, aby se 
                    // nepřátelé nespawnovaly ve vzduchu a nepadaly na hráče z rohů obrazovky.
                    // Zároveň ale nespawnuj pod obrazovkou, aby mohli nepřátelé volně dojít k hráči
                    // a nemuseli šplhat
                    var tryToSpawn = function (x) {
                        var _loop_1 = function(y) {
                            // Pokud nejde o záporné souřadnice nebo mimo rámec
                            if (x < 0 || y < 0 || x >= map.width || y >= map.height)
                                return { value: false };
                            // Pokud nejde o viditelnou část obrazovky
                            if (x > startTiles.x + SpawnPool.SPAWN_ZONE_SIZE
                                && x < startTiles.x + borderWidthInTiles - SpawnPool.SPAWN_ZONE_SIZE
                                && y > startTiles.y + SpawnPool.SPAWN_ZONE_SIZE
                                && y < startTiles.y + borderHeightInTiles - SpawnPool.SPAWN_ZONE_SIZE)
                                return { value: false };
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
                                world.enemies[ei] = enemy_1;
                                enemy_1.id = ei;
                                world.enemiesCount++;
                                world.addChild(enemy_1);
                                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.ENEMY_COUNT_CHANGE, world.enemiesCount));
                                enemy_1.x = x;
                                enemy_1.y = y + enHeight_1;
                                console.log("SPAWN: " + enemy_1.x + ":" + enemy_1.y);
                                // podařilo se vytvořit a usadit nepřítele, nastav jeho spawn-cooldown
                                self.spawnCooldownState[i] = self.spawnCooldown[i];
                                return { value: true };
                            }
                        };
                        for (var y = startTiles.y + borderHeightInTiles; y > startTiles.y; y--) {
                            var state_1 = _loop_1(y);
                            if (typeof state_1 === "object") return state_1.value;
                        }
                    };
                    // Jednou to zkus zleva, jednou zprava
                    if (Math.random() > 0.5) {
                        for (var x = startTiles.x; x < startTiles.x + borderWidthInTiles; x++)
                            if (tryToSpawn(x))
                                return;
                    }
                    else {
                        for (var x = startTiles.x + borderWidthInTiles; x > startTiles.x; x--)
                            if (tryToSpawn(x))
                                return;
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
