var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var ChickenBoss = (function (_super) {
            __extends(ChickenBoss, _super);
            function ChickenBoss() {
                var _this = _super.call(this, ChickenBoss.OWNER_ID, Lich.AnimationSetKey.CHICKEN_BOSS_ANIMATION_KEY, Lich.AnimationKey.ANM_MURHUN_IDLE_KEY, 20, // DAMAGE
                1000, // ATTACK_COOLDOWN
                40, // COLLXOFFSET
                100, // COLLYOFFSET
                600, // HORIZONTAL_SPEED
                600, // VERTICAL_SPEED
                false, // unspawns
                0, // min depth 
                100, // max depth
                true // hovers
                ) || this;
                _this.angle = 0;
                _this.currentChargeCooldown = 0;
                _this.charging = false;
                _this.sprinting = true;
                _this.lockedSpeedX = 0;
                _this.lockedSpeedY = 0;
                _this.lockedTime = 0;
                _this.maxHealth = _this.currentHealth = 5000;
                _this.healthBar.fixedHeight = 10;
                _this.healthBar.y = -_this.healthBar.fixedHeight;
                // stále jsem v hover pohybu
                _this.movementTypeX = Lich.MovementTypeX.HOVER;
                _this.movementTypeY = Lich.MovementTypeY.HOVER;
                Lich.Mixer.stopAllMusic();
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_CHICKEN_BOSS_THEME_KEY);
                ChickenBoss.spawned = true;
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.ACHIEVEMENT_DONE, Lich.AchievementKey[Lich.AchievementKey.ACHV_CHICKEN_MASSACRE_KEY]));
                return _this;
            }
            ChickenBoss.prototype.runAI = function (world, delta) {
                var _this = this;
                if (this.currentHealth > 0) {
                    var targetX_1 = 0;
                    var targetY_1 = 0;
                    var setXYByAngle_1 = function () {
                        targetX_1 = world.hero.x + world.hero.fixedWidth / 2 + Math.cos(Lich.Utils.toRad(_this.angle)) * ChickenBoss.PULL_RADIUS;
                        targetY_1 = world.hero.y + world.hero.fixedHeight / 2 + Math.sin(Lich.Utils.toRad(_this.angle)) * ChickenBoss.PULL_RADIUS;
                    };
                    var stopCharging = function () {
                        _this.currentChargeCooldown = 0;
                        _this.charging = false;
                        _this.lockedTime = 0;
                        _this.performAnimation(Lich.AnimationKey.ANM_MURHUN_IDLE_KEY);
                        // a skonči na protější straně
                        _this.sprinting = false;
                        _this.angle = (_this.angle + 180) % 360;
                        setXYByAngle_1();
                    };
                    var processSpeed = function () {
                        // snaž se dosáhnout místo středem
                        targetX_1 -= _this.fixedWidth / 2;
                        targetY_1 -= _this.fixedHeight / 2;
                        // nastav rychlost dle vzdálenosti
                        var b = targetX_1 - _this.x;
                        var a = targetY_1 - _this.y;
                        var c = Math.sqrt(a * a + b * b);
                        // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
                        // přepony dle rychlosti projektilu
                        if (c == 0)
                            c = 1;
                        _this.speedx = -_this.accelerationX * b / c;
                        _this.speedy = -_this.accelerationY * a / c;
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
                    if (this.currentAttackCooldown >= this.attackCooldown && world.hero.getCurrentHealth() > 0) {
                        if (this.isPlayerInReach(world)) {
                            // jsem u hráče, zasáhni
                            this.currentAttackCooldown = 0;
                            world.hero.hit(this.damage, world);
                            stopCharging();
                        }
                        else {
                            // jsem připraven útočit, útoč
                            if ((this.currentChargeCooldown >= ChickenBoss.CHARGE_COOLDOWN
                                || this.frenzy && this.currentChargeCooldown >= ChickenBoss.CHARGE_COOLDOWN / 2)
                                && !this.charging) {
                                this.performAnimation(Lich.AnimationKey.ANM_MURHUN_ATTACK_KEY);
                                Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_BOSS_ATTACK_KEY);
                                this.lockedTime = 0;
                                targetX_1 = world.hero.x + world.hero.fixedWidth / 2;
                                targetY_1 = world.hero.y + world.hero.fixedHeight / 2;
                                this.charging = true;
                                processSpeed();
                            }
                        }
                    }
                    if (!this.charging) {
                        var hero = world.hero;
                        var dist = Math.sqrt(Math.pow(this.x + this.fixedWidth / 2 - hero.x + hero.fixedWidth / 2, 2) +
                            Math.pow(this.y + this.fixedHeight / 2 - hero.y + hero.fixedHeight / 2, 2));
                        // hystereze 
                        var threshold = this.sprinting ? ChickenBoss.RADIUS : ChickenBoss.PULL_RADIUS;
                        if (dist > threshold) {
                            // hráč je moc daleko, neobíhej, ale dosprintuj k němu
                            targetX_1 = world.hero.x + world.hero.fixedWidth / 2;
                            targetY_1 = world.hero.y + world.hero.fixedHeight / 2;
                            this.sprinting = true;
                        }
                        else {
                            // jsem v obíhací vzdálenosti, obíhej hráče a připravuj se k útoku
                            this.angle = (this.angle + ChickenBoss.ANGLE_STEP_PER_SEC * delta / 1000) % 360;
                            setXYByAngle_1();
                            this.sprinting = false;
                        }
                        processSpeed();
                    }
                }
            };
            ChickenBoss.prototype.walkL = function () { };
            ;
            ChickenBoss.prototype.walkR = function () { };
            ;
            ChickenBoss.prototype.idle = function () { };
            ;
            ChickenBoss.prototype.climb = function () { };
            ;
            ChickenBoss.prototype.jump = function () { };
            ;
            ChickenBoss.prototype.jumpR = function () { };
            ;
            ChickenBoss.prototype.jumpL = function () { };
            ;
            ChickenBoss.prototype.midair = function () { };
            ;
            ChickenBoss.prototype.fall = function () { };
            ;
            ChickenBoss.prototype.death = function () { };
            ;
            ChickenBoss.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_BOSS_DEAD_KEY, 0.8);
                this.dropLoot(world, Lich.InventoryKey.INV_CHICKEN_MEAT_KEY, 3, 5);
                this.dropLoot(world, Lich.InventoryKey.INV_RED_FLASK_KEY, 2);
                world.fadeEnemy(this);
                Lich.Mixer.stopAllMusic();
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_DIRT_THEME_KEY, 0.3);
                ChickenBoss.spawned = false;
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.ACHIEVEMENT_DONE, Lich.AchievementKey[Lich.AchievementKey.ACHV_CHICKEN_PROOFED_KEY]));
            };
            ChickenBoss.prototype.hit = function (damage, world) {
                if (this.getCurrentHealth() > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_BOSS_HIT_KEY, 0.2);
                }
                _super.prototype.hit.call(this, damage, world);
                if (!this.frenzy && this.getCurrentHealth() < this.getMaxHealth() / 2) {
                    this.accelerationX *= 1.5;
                    this.accelerationY *= 1.5;
                    this.frenzy = true;
                }
                return damage;
            };
            return ChickenBoss;
        }(Lich.AbstractEnemy));
        /**
         * aka Murhun
         */
        ChickenBoss.OWNER_ID = "CHICKEN_BOSS";
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
        ChickenBoss.ANGLE_STEP_PER_SEC = 90;
        ChickenBoss.PULL_RADIUS = 500;
        ChickenBoss.RADIUS = 400;
        ChickenBoss.CHARGE_COOLDOWN = 6000;
        ChickenBoss.CHARGE_DURATION = 2000;
        // každých ANGER_COOLDOWN se sníží chickenKills
        ChickenBoss.ANGER_COOLDOWN = 30000;
        ChickenBoss.ANGER_THRESHOLD = 10;
        ChickenBoss.currentAngerCooldown = 0;
        ChickenBoss.chickenKills = 0;
        ChickenBoss.spawned = false;
        Enemy.ChickenBoss = ChickenBoss;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
