namespace Lich {
    export namespace Enemy {

        enum AI_MODE {
            IDLE,
            RAIN,
            SPAWN
        }

        export class CupidBoss extends AbstractEnemy {

            static OWNER_ID = "CUPID_BOSS";

            static IDLE = "IDLE";
            static ATTACK = "ATTACK";
            static HIT = "HIT";
            static DIE = "DIE";
            static EXPLODE = "EXPLODE";
            static DEAD = "DEAD";

            static HOVER_ALT = 300;
            static PULL_HOVER_ALT = 400;
            static MODE_COOLDOWN = 5000;
            static SPAWN_COOLDOWN = 500;
            static SPAWN_ENEMIES_COUNT = 5;

            static spawned = false;

            private currentModeChangeCooldown = 0;
            private currentSpawnCooldown = 0;
            private spawnedEnemies = new Array<AbstractEnemy>();

            private currentMode: AI_MODE;

            constructor() {
                super(
                    CupidBoss.OWNER_ID,
                    30, // DAMAGE
                    500, // ATTACK_COOLDOWN
                    256, // WIDTH
                    320, // HEIGHT 
                    40, // COLLXOFFSET
                    100, // COLLYOFFSET
                    AnimationKey.CUPID_ANIMATION_KEY,
                    CupidBoss.IDLE,
                    8, // frames
                    400, // HORIZONTAL_SPEED
                    400, // VERTICAL_SPEED
                    new Animations()
                        .add(CupidBoss.IDLE, 0, 1, CupidBoss.IDLE, 0.1)
                        .add(CupidBoss.ATTACK, 2, 3, CupidBoss.IDLE, 1)
                        .add(CupidBoss.HIT, 4, 4, CupidBoss.IDLE, 0.2)
                        .add(CupidBoss.DIE, 5, 5, CupidBoss.DEAD, 0.3)
                        .add(CupidBoss.DEAD, 5, 5, CupidBoss.DEAD, 0.1),
                    false, // unspawns
                    0, // min depth 
                    100, // max depth
                    true // hovers
                );
                this.maxHealth = this.currentHealth = 5000;
                this.healthBar.height = 10;
                this.healthBar.y = -this.healthBar.height;

                // stále jsem v hover pohybu
                this.movementTypeX = MovementTypeX.HOVER;
                this.movementTypeY = MovementTypeY.HOVER;

                Mixer.stopAllMusic();
                Mixer.playMusic(MusicKey.MSC_CHICKEN_BOSS_THEME_KEY);

                this.currentMode = AI_MODE.IDLE;

                CupidBoss.spawned = true;
            }

            runAI(world: World, delta: number) {
                if (this.currentHealth > 0) {

                    let targetX = 0;
                    let targetY = 0;

                    let processSpeed = () => {
                        // snaž se dosáhnout místo středem
                        targetX -= this.width / 2;
                        targetY -= this.height / 2;

                        // nastav rychlost dle vzdálenosti
                        var b = targetX - this.x;
                        var a = targetY - this.y;

                        if (Math.abs(b) < 10 && Math.abs(a) < 10) {
                            this.speedx = 0;
                            this.speedy = 0;
                        } else {
                            var c = Math.sqrt(a * a + b * b);

                            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
                            // přepony dle rychlosti projektilu
                            if (c == 0) c = 1;
                            this.speedx = -Math.floor(this.accelerationX * b / c);
                            this.speedy = -Math.floor(this.accelerationY * a / c);
                        }
                    };

                    if (this.currentAttackCooldown < this.attackCooldown)
                        this.currentAttackCooldown += delta;
                    if (this.currentModeChangeCooldown < CupidBoss.MODE_COOLDOWN)
                        this.currentModeChangeCooldown += delta;

                    if (this.currentModeChangeCooldown >= CupidBoss.MODE_COOLDOWN) {
                        this.currentModeChangeCooldown = 0;
                        switch (this.currentMode) {
                            case AI_MODE.IDLE: this.currentMode = AI_MODE.RAIN; break;
                            case AI_MODE.RAIN: this.currentMode = AI_MODE.SPAWN; break;
                            case AI_MODE.SPAWN: this.currentMode = AI_MODE.IDLE; break;
                        }

                        this.currentSpawnCooldown = 0;
                    }

                    targetX = world.hero.x + world.hero.width / 2;
                    targetY = world.hero.y - CupidBoss.HOVER_ALT;

                    switch (this.currentMode) {
                        case AI_MODE.IDLE:
                            break;
                        case AI_MODE.RAIN:
                            if (this.currentAttackCooldown >= this.attackCooldown) {
                                let spell = Resources.getInstance().spellDefs.byKey(SpellKey[SpellKey.SPELL_LOVEARROW]);
                                let castX = this.x + Math.random() * this.width;
                                let castY = this.y + this.height;
                                let context = new SpellContext(CupidBoss.OWNER_ID, castX, castY, castX, castY + 1, world.game);
                                spell.cast(context);
                                this.performState(Valentimon.ATTACK);
                                this.currentAttackCooldown = 0;
                            }
                            break;
                        case AI_MODE.SPAWN:
                            if (this.currentSpawnCooldown < CupidBoss.SPAWN_COOLDOWN) {
                                this.currentSpawnCooldown += delta;
                            } else {
                                let spawnMinion = (): AbstractEnemy => {
                                    this.performState(CupidBoss.ATTACK);
                                    this.currentSpawnCooldown = 0;
                                    let angle = Math.random() * Math.PI * 2;
                                    let radius = Math.max(this.width / 2, this.height / 2);
                                    let enemy = SpawnPool.getInstance().spawnAt(
                                        Enemy.Valentimon,
                                        world,
                                        this.x + this.width / 2 + Math.cos(angle) * radius,
                                        this.y + this.height / 2 + Math.sin(angle) * radius
                                    );
                                    return enemy;
                                }

                                // pokud je to první spawnování, spawnuje, dokud není můžeš
                                if (this.spawnedEnemies.length < CupidBoss.SPAWN_ENEMIES_COUNT) {
                                    this.spawnedEnemies.push(spawnMinion());
                                } else {
                                    // zkus najít padlého nepřítele a nahraď ho novým
                                    for (let e in this.spawnedEnemies) {
                                        let enemy = this.spawnedEnemies[e];
                                        // padlého = umřel a byl odebrán nebo mu hráč
                                        // utekl a on byl automaticky dealokován 
                                        if (!enemy.parent) {
                                            this.spawnedEnemies[e] = spawnMinion();
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                    }

                    // uběhl čas k započítání dalšího zásahu?
                    if (this.currentAttackCooldown >= this.attackCooldown && world.hero.getCurrentHealth() > 0) {
                        if (this.isPlayerInReach(world)) {
                            // jsem u hráče, zasáhni
                            this.currentAttackCooldown = 0;
                            world.hero.hit(this.damage, world);
                        }
                    }

                    processSpeed();
                }
            }

            walkL() { /* nic */ };
            walkR() { /* nic */ };
            idle() { /* nic */ };
            climb() { /* nic */ };
            jump() { /* nic */ };
            jumpR() { /* nic */ };
            jumpL() { /* nic */ };
            midair() { /* nic */ };
            fall() { /* nic */ };
            death() { this.performState(CupidBoss.DIE); };

            die(world: World) {
                super.die(world);
                this.speedx = 0;
                this.speedy = 0;
                // Mixer.playSound(SoundKey.SND_CHICKEN_BOSS_DEAD_KEY, 0.8);
                for (let i = 0; i < 15; i++) {
                    let xjitter = 10 - Math.random() * 20;
                    let yjitter = 10 - Math.random() * 20;
                    world.spawnObject(new DugObjDefinition(InventoryKey.INV_CHICKEN_MEAT_KEY, 1), this.x + xjitter, this.y + yjitter, false);
                }
                world.fadeEnemy(this);
                Mixer.stopAllMusic();
                Mixer.playMusic(MusicKey.MSC_DIRT_THEME_KEY, 0.3);
                CupidBoss.spawned = false;
            }

            hit(damage: number, world: World): number {
                if (this.getCurrentHealth() > 0) {
                    // Mixer.playSound(SoundKey.SND_CHICKEN_BOSS_HIT_KEY, 0.2);
                }
                super.hit(damage, world);
                return damage;
            }

        }
    }
}