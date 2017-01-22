var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var AI_MODE;
        (function (AI_MODE) {
            AI_MODE[AI_MODE["IDLE"] = 0] = "IDLE";
            AI_MODE[AI_MODE["CHARGE"] = 1] = "CHARGE";
            AI_MODE[AI_MODE["RAIN"] = 2] = "RAIN";
            AI_MODE[AI_MODE["SPAWN"] = 3] = "SPAWN";
        })(AI_MODE || (AI_MODE = {}));
        var CupidBoss = (function (_super) {
            __extends(CupidBoss, _super);
            function CupidBoss() {
                _super.call(this, CupidBoss.OWNER_ID, 30, // DAMAGE
                1000, // ATTACK_COOLDOWN
                256, // WIDTH
                320, // HEIGHT 
                40, // COLLXOFFSET
                100, // COLLYOFFSET
                Lich.AnimationKey.CUPID_ANIMATION_KEY, CupidBoss.IDLE, 8, // frames
                400, // HORIZONTAL_SPEED
                400, // VERTICAL_SPEED
                new Lich.Animations()
                    .add(CupidBoss.IDLE, 0, 1, CupidBoss.IDLE, 0.1)
                    .add(CupidBoss.ATTACK, 2, 3, CupidBoss.ATTACK, 0.1)
                    .add(CupidBoss.HIT, 4, 4, CupidBoss.IDLE, 0.2)
                    .add(CupidBoss.DIE, 5, 5, CupidBoss.DEAD, 0.3)
                    .add(CupidBoss.DEAD, 5, 5, CupidBoss.DEAD, 0.1), false, // unspawns
                0, // min depth 
                100, // max depth
                true // hovers
                );
                this.currentModeChangeCooldown = 0;
                this.currentSpawnCooldown = 0;
                this.maxHealth = this.currentHealth = 5000;
                this.healthBar.height = 10;
                this.healthBar.y = -this.healthBar.height;
                // stále jsem v hover pohybu
                this.movementTypeX = Lich.MovementTypeX.HOVER;
                this.movementTypeY = Lich.MovementTypeY.HOVER;
                Lich.Mixer.stopAllMusic();
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_CHICKEN_BOSS_THEME_KEY);
                this.currentMode = AI_MODE.IDLE;
                CupidBoss.spawned = true;
            }
            CupidBoss.prototype.runAI = function (world, delta) {
                var _this = this;
                if (this.currentHealth > 0) {
                    var targetX_1 = 0;
                    var targetY_1 = 0;
                    var processSpeed = function () {
                        // snaž se dosáhnout místo středem
                        targetX_1 -= _this.width / 2;
                        targetY_1 -= _this.height / 2;
                        // nastav rychlost dle vzdálenosti
                        var b = targetX_1 - _this.x;
                        var a = targetY_1 - _this.y;
                        if (Math.abs(b) < 2 && Math.abs(a) < 2) {
                            _this.speedx = 0;
                            _this.speedy = 0;
                        }
                        else {
                            var c = Math.sqrt(a * a + b * b);
                            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
                            // přepony dle rychlosti projektilu
                            if (c == 0)
                                c = 1;
                            _this.speedx = -Math.floor(_this.accelerationX * b / c);
                            _this.speedy = -Math.floor(_this.accelerationY * a / c);
                        }
                    };
                    if (this.currentAttackCooldown < this.attackCooldown)
                        this.currentAttackCooldown += delta;
                    if (this.currentModeChangeCooldown < CupidBoss.MODE_COOLDOWN)
                        this.currentModeChangeCooldown += delta;
                    if (this.currentModeChangeCooldown >= CupidBoss.MODE_COOLDOWN) {
                        this.currentModeChangeCooldown = 0;
                        switch (this.currentMode) {
                            case AI_MODE.IDLE:
                                this.currentMode = AI_MODE.RAIN;
                                break;
                            case AI_MODE.RAIN:
                                this.currentMode = AI_MODE.SPAWN;
                                break;
                            case AI_MODE.SPAWN:
                                this.currentMode = AI_MODE.IDLE;
                                break;
                        }
                        this.currentSpawnCooldown = 0;
                    }
                    switch (this.currentMode) {
                        case AI_MODE.IDLE:
                            targetX_1 = world.hero.x + world.hero.width / 2;
                            targetY_1 = world.hero.y - CupidBoss.HOVER_ALT;
                            break;
                        case AI_MODE.SPAWN:
                            if (this.currentSpawnCooldown < CupidBoss.SPAWN_COOLDOWN) {
                                this.currentSpawnCooldown += delta;
                            }
                            else {
                                this.currentSpawnCooldown = 0;
                                Lich.SpawnPool.getInstance().spawn(Enemy.Valentimon, world);
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
            };
            CupidBoss.prototype.walkL = function () { };
            ;
            CupidBoss.prototype.walkR = function () { };
            ;
            CupidBoss.prototype.idle = function () { };
            ;
            CupidBoss.prototype.climb = function () { };
            ;
            CupidBoss.prototype.jump = function () { };
            ;
            CupidBoss.prototype.jumpR = function () { };
            ;
            CupidBoss.prototype.jumpL = function () { };
            ;
            CupidBoss.prototype.midair = function () { };
            ;
            CupidBoss.prototype.fall = function () { };
            ;
            CupidBoss.prototype.death = function () { this.performState(CupidBoss.DIE); };
            ;
            CupidBoss.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                this.speedx = 0;
                this.speedy = 0;
                // Mixer.playSound(SoundKey.SND_CHICKEN_BOSS_DEAD_KEY, 0.8);
                for (var i = 0; i < 15; i++) {
                    var xjitter = 10 - Math.random() * 20;
                    var yjitter = 10 - Math.random() * 20;
                    world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_CHICKEN_MEAT_KEY, 1), this.x + xjitter, this.y + yjitter, false);
                }
                world.fadeEnemy(this);
                Lich.Mixer.stopAllMusic();
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_DIRT_THEME_KEY, 0.3);
                CupidBoss.spawned = false;
            };
            CupidBoss.prototype.hit = function (damage, world) {
                if (this.getCurrentHealth() > 0) {
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            CupidBoss.OWNER_ID = "CUPID_BOSS";
            CupidBoss.IDLE = "IDLE";
            CupidBoss.ATTACK = "ATTACK";
            CupidBoss.HIT = "HIT";
            CupidBoss.DIE = "DIE";
            CupidBoss.EXPLODE = "EXPLODE";
            CupidBoss.DEAD = "DEAD";
            CupidBoss.HOVER_ALT = 400;
            CupidBoss.PULL_HOVER_ALT = 500;
            CupidBoss.MODE_COOLDOWN = 10000;
            CupidBoss.SPAWN_COOLDOWN = 2000;
            CupidBoss.spawned = false;
            return CupidBoss;
        }(Lich.AbstractEnemy));
        Enemy.CupidBoss = CupidBoss;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
