namespace Lich {
    export class SpawnPool {
        static SPAWN_ZONE_SIZE = 20; // v tiles
        static MAX_ENEMIES = 4;

        spawnCooldown = [10000];
        spawnCooldownState = [0];
        spawnFactory = [Enemy.Redskull];
        constructor() {
        }

        update(delta: number, world: World) {
            if (world.enemiesCount >= SpawnPool.MAX_ENEMIES)
                return;
            let self = this;
            let canvas = world.game.getCanvas();
            // délky
            let borderWidthInTiles = world.render.pixelsDistanceToTiles(canvas.width) + 2 * SpawnPool.SPAWN_ZONE_SIZE;
            let borderHeightInTiles = world.render.pixelsDistanceToTiles(canvas.height) + SpawnPool.SPAWN_ZONE_SIZE;
            // počátek 
            let startTiles: Coord2D = world.render.pixelsToTiles(0, 0);
            startTiles.x -= SpawnPool.SPAWN_ZONE_SIZE;
            startTiles.y -= SpawnPool.SPAWN_ZONE_SIZE;
            // mapa
            let map = world.tilesMap;

            this.spawnCooldown.forEach((v, i) => {
                self.spawnCooldownState[i] -= delta;
                if (self.spawnCooldownState[i] < 0) {
                    // TODO tohle by se mělo dělat až když je jisté, že je nepřítele kam usadit. 
                    // K tomu ale potřebuju jeho šířku a výšku a to je property kterou obecně nemůžu 
                    // staticky adresovat (nemám abstract static property). Bude potřeba vytvořit
                    // nějaký statický enemy-dimensions rejstřík
                    let enemy = new self.spawnFactory[i]();
                    let enWidth = world.render.pixelsDistanceToTiles(enemy.width);
                    let enHeight = world.render.pixelsDistanceToTiles(enemy.height);

                    // je možné nepřítele někam usadit?
                    // projdi vnější okraj obrazovky (tam kde hráč nevidí) a pokud nadješ prostor, 
                    // kam se nepřítel vejde, proveď spawn. Procházej obrazovku zespoda, aby se 
                    // nepřátelé nespawnovaly ve vzduchu a nepadaly na hráče z rohů obrazovky.
                    // Zároveň ale nespawnuj pod obrazovkou, aby mohli nepřátelé volně dojít k hráči
                    // a nemuseli šplhat

                    let tryToSpawn = (x): boolean => {
                        for (let y = startTiles.y + borderHeightInTiles; y > startTiles.y; y--) {
                            // Pokud nejde o záporné souřadnice nebo mimo rámec
                            if (x < 0 || y < 0 || x >= map.width || y >= map.height)
                                return false;
                            // Pokud nejde o viditelnou část obrazovky
                            if (x > startTiles.x + SpawnPool.SPAWN_ZONE_SIZE
                                && x < startTiles.x + borderWidthInTiles - SpawnPool.SPAWN_ZONE_SIZE
                                && y > startTiles.y + SpawnPool.SPAWN_ZONE_SIZE
                                && y < startTiles.y + borderHeightInTiles - SpawnPool.SPAWN_ZONE_SIZE)
                                return false;

                            // Pak zkus najít prostor pro nepřítele
                            let fits = true;
                            (() => {
                                for (let ey = 0; ey < enHeight; ey++) {
                                    for (let ex = 0; ex < enWidth; ex++) {
                                        let result = world.isCollisionByTiles(x + ex, y + ey);
                                        if (result.hit) {
                                            fits = false;
                                            return;
                                        }
                                    }
                                }
                            })();

                            // Ok, vejde se
                            if (fits) {
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
                                world.enemiesCount++;

                                world.addChild(enemy);
                                EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.ENEMY_COUNT_CHANGE, world.enemiesCount));
                                enemy.x = x;
                                enemy.y = y + enHeight;
                                console.log("SPAWN: " + enemy.x + ":" + enemy.y);
                                // podařilo se vytvořit a usadit nepřítele, nastav jeho spawn-cooldown
                                self.spawnCooldownState[i] = self.spawnCooldown[i];
                                return true;
                            }
                        }
                    }

                    // Jednou to zkus zleva, jednou zprava
                    if (Math.random() > 0.5) {
                        for (let x = startTiles.x; x < startTiles.x + borderWidthInTiles; x++)
                            if (tryToSpawn(x)) return;
                    } else {
                        for (let x = startTiles.x + borderWidthInTiles; x > startTiles.x; x--)
                            if (tryToSpawn(x)) return;
                    }
                }
            });
        }
    }
}