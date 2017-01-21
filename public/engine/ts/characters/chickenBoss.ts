namespace Lich {
    export namespace Enemy {
        export class ChickenBoss extends AbstractEnemy {

            /**
             * aka Murhun
             */
            static OWNER_ID = "CHICKEN_BOSS";

            static IDLE = "IDLE";
            static ATTACK = "ATTACK";
            /**
             * Protože při nízké rychlosti otáčení se daří AI přejíždět 
             * cíl a tak vzniká neustálé "cukání", když se chce vrátit
             * k nepattrně přejetému cíli, je potřeba rychlost zvýšit, 
             * aby stále cíl "doháněl"
             * 
             * Dohánění má ale za důsledek vizuální zmenšení rádiusu,
             * protože se AI motá uprostřed a cíl mu stále utíká
             * 
             * Proto je potřeba vést rádiusy dva. Jeden, který "tahá"
             * AI dokola a druhý který říká jak detekovat vzdálenost
             * hráče u které se má k němu sprintovat a kdy se dá kolem 
             * něj jenom obíhat 
             */
            static ANGLE_STEP_PER_SEC = 90;
            static PULL_RADIUS = 500;
            static RADIUS = 400;
            static CHARGE_COOLDOWN = 6000;
            static CHARGE_DURATION = 2000;

            // každých ANGER_COOLDOWN se sníží chickenKills
            static ANGER_COOLDOWN = 30000;
            static ANGER_THRESHOLD = 10;
            static currentAngerCooldown = 0;
            static chickenKills = 0;
            static spawned = false;

            private frenzy: boolean;

            private angle = 0;
            private currentChargeCooldown = 0;
            private charging = false;
            private sprinting = true;

            private lockedSpeedX = 0;
            private lockedSpeedY = 0;
            private lockedTime = 0;

            constructor() {
                super(
                    ChickenBoss.OWNER_ID,
                    20, // DAMAGE
                    1000, // ATTACK_COOLDOWN
                    184, // WIDTH
                    304, // HEIGHT 
                    40, // COLLXOFFSET
                    100, // COLLYOFFSET
                    AnimationKey.CHICKEN_BOSS_ANIMATION_KEY,
                    ChickenBoss.IDLE,
                    2, // frames
                    600, // HORIZONTAL_SPEED
                    600, // VERTICAL_SPEED
                    new Animations()
                        .add(ChickenBoss.IDLE, 1, 1, ChickenBoss.IDLE, 0.1)
                        .add(ChickenBoss.ATTACK, 0, 0, ChickenBoss.ATTACK, 0.1),
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

                ChickenBoss.spawned = true;
            }

            runAI(world: World, delta: number) {
                if (this.currentHealth > 0) {

                    let targetX = 0;
                    let targetY = 0;

                    let setXYByAngle = () => {
                        targetX = world.hero.x + world.hero.width / 2 + Math.cos(Utils.toRad(this.angle)) * ChickenBoss.PULL_RADIUS;
                        targetY = world.hero.y + world.hero.height / 2 + Math.sin(Utils.toRad(this.angle)) * ChickenBoss.PULL_RADIUS;
                    };

                    let stopCharging = () => {
                        this.currentChargeCooldown = 0;
                        this.charging = false;
                        this.lockedTime = 0;
                        this.performState(ChickenBoss.IDLE);
                        // a skonči na protější straně
                        this.sprinting = false;
                        this.angle = (this.angle + 180) % 360;
                        setXYByAngle();
                    };

                    let processSpeed = () => {
                        // snaž se dosáhnout místo středem
                        targetX -= this.width / 2;
                        targetY -= this.height / 2;

                        // nastav rychlost dle vzdálenosti
                        var b = targetX - this.x;
                        var a = targetY - this.y;
                        var c = Math.sqrt(a * a + b * b);

                        // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
                        // přepony dle rychlosti projektilu
                        if (c == 0) c = 1;
                        this.speedx = -this.accelerationX * b / c;
                        this.speedy = -this.accelerationY * a / c;
                    };

                    if (this.currentAttackCooldown < this.attackCooldown)
                        this.currentAttackCooldown += delta;
                    if (this.currentChargeCooldown < ChickenBoss.CHARGE_COOLDOWN)
                        this.currentChargeCooldown += delta;

                    // časovač, aby nepřejel přes půl mapy
                    if (this.charging)
                        this.lockedTime += delta;
                    if (this.lockedTime > ChickenBoss.CHARGE_DURATION) {
                        stopCharging();
                    }

                    // uběhl čas k započítání dalšího zásahu?
                    if (this.currentAttackCooldown > this.attackCooldown && world.hero.getCurrentHealth() > 0) {
                        if (this.isPlayerInReach(world)) {
                            // jsem u hráče, zasáhni
                            this.currentAttackCooldown = 0;
                            world.hero.hit(this.damage, world);
                            stopCharging();
                        } else {
                            // jsem připraven útočit, útoč
                            if ((this.currentChargeCooldown > ChickenBoss.CHARGE_COOLDOWN
                                || this.frenzy && this.currentChargeCooldown > ChickenBoss.CHARGE_COOLDOWN / 2)
                                && !this.charging) {
                                this.performState(ChickenBoss.ATTACK);
                                Mixer.playSound(SoundKey.SND_CHICKEN_BOSS_ATTACK_KEY);
                                this.lockedTime = 0;
                                targetX = world.hero.x + world.hero.width / 2;
                                targetY = world.hero.y + world.hero.height / 2;
                                this.charging = true;
                                processSpeed();
                            }
                        }
                    }

                    if (!this.charging) {
                        let hero = world.hero;
                        let dist = Math.sqrt(Math.pow(this.x + this.width / 2 - hero.x + hero.width / 2, 2) +
                            Math.pow(this.y + this.height / 2 - hero.y + hero.height / 2, 2));
                        // hystereze 
                        let threshold = this.sprinting ? ChickenBoss.RADIUS : ChickenBoss.PULL_RADIUS;
                        if (dist > threshold) {
                            // hráč je moc daleko, neobíhej, ale dosprintuj k němu
                            targetX = world.hero.x + world.hero.width / 2;
                            targetY = world.hero.y + world.hero.height / 2;
                            this.sprinting = true;
                        } else {
                            // jsem v obíhací vzdálenosti, obíhej hráče a připravuj se k útoku
                            this.angle = (this.angle + ChickenBoss.ANGLE_STEP_PER_SEC * delta / 1000) % 360;
                            setXYByAngle();
                            this.sprinting = false;
                        }
                        processSpeed();
                    }
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
            death() { /* nic */ };

            die(world: World) {
                super.die(world);
                Mixer.playSound(SoundKey.SND_CHICKEN_BOSS_DEAD_KEY, 0.8);
                for (let i = 0; i < 15; i++) {
                    let xjitter = 10 - Math.random() * 20;
                    let yjitter = 10 - Math.random() * 20;
                    world.spawnObject(new DugObjDefinition(InventoryKey.INV_CHICKEN_MEAT_KEY, 1), this.x + xjitter, this.y + yjitter, false);
                }
                world.fadeEnemy(this);
                Mixer.stopAllMusic();
                Mixer.playMusic(MusicKey.MSC_DIRT_THEME_KEY, 0.3);
                ChickenBoss.spawned = false;
            }

            hit(damage: number, world: World): number {
                if (this.getCurrentHealth() > 0) {
                    Mixer.playSound(SoundKey.SND_CHICKEN_BOSS_HIT_KEY, 0.2);
                }
                super.hit(damage, world);
                if (!this.frenzy && this.getCurrentHealth() < this.getMaxHealth() / 2) {
                    this.accelerationX *= 1.5;
                    this.accelerationY *= 1.5;
                    this.frenzy = true;
                }
                return damage;
            }

        }
    }
}