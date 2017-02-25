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
            AI_MODE[AI_MODE["RAIN"] = 1] = "RAIN";
            AI_MODE[AI_MODE["SPAWN"] = 2] = "SPAWN";
        })(AI_MODE || (AI_MODE = {}));
        var CupidBoss = (function (_super) {
            __extends(CupidBoss, _super);
            function CupidBoss() {
                var _this = _super.call(this, CupidBoss.OWNER_ID, Lich.AnimationSetKey.CUPID_ANIMATION_KEY, Lich.AnimationKey.ANM_CUPID_IDLE_KEY, 30, // DAMAGE
                500, // ATTACK_COOLDOWN
                40, // COLLXOFFSET
                100, // COLLYOFFSET
                400, // HORIZONTAL_SPEED
                400, // VERTICAL_SPEED
                false, // unspawns
                0, // min depth 
                100, // max depth
                true // hovers
                ) || this;
                _this.currentModeChangeCooldown = 0;
                _this.currentSpawnCooldown = 0;
                _this.spawnedEnemies = new Array();
                _this.maxHealth = _this.currentHealth = 5000;
                _this.healthBar.fixedHeight = 10;
                _this.healthBar.y = -_this.healthBar.fixedHeight;
                // stále jsem v hover pohybu
                _this.movementTypeX = Lich.MovementTypeX.HOVER;
                _this.movementTypeY = Lich.MovementTypeY.HOVER;
                Lich.Mixer.stopAllMusic();
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_CUPID_BOSS_THEME_KEY);
                _this.currentMode = AI_MODE.IDLE;
                CupidBoss.spawned = true;
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.ACHIEVEMENT_DONE, Lich.AchievementKey[Lich.AchievementKey.ACHV_LOVE_HURTS_KEY]));
                return _this;
            }
            CupidBoss.prototype.runAI = function (world, delta) {
                var _this = this;
                if (this.currentHealth > 0) {
                    var targetX_1 = 0;
                    var targetY_1 = 0;
                    var processSpeed = function () {
                        // snaž se dosáhnout místo středem
                        targetX_1 -= _this.fixedWidth / 2;
                        targetY_1 -= _this.fixedHeight / 2;
                        // nastav rychlost dle vzdálenosti
                        var b = targetX_1 - _this.x;
                        var a = targetY_1 - _this.y;
                        if (Math.abs(b) < 10 && Math.abs(a) < 10) {
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
                    targetX_1 = world.hero.x + world.hero.fixedWidth / 2;
                    targetY_1 = world.hero.y - CupidBoss.HOVER_ALT;
                    switch (this.currentMode) {
                        case AI_MODE.IDLE:
                            break;
                        case AI_MODE.RAIN:
                            if (this.currentAttackCooldown >= this.attackCooldown) {
                                var spell = Lich.Resources.getInstance().getSpellDef(Lich.SpellKey.SPELL_LOVEARROW);
                                var castX = this.x + Math.random() * this.fixedWidth;
                                var castY = this.y + this.fixedHeight;
                                var context = new Lich.SpellContext(CupidBoss.OWNER_ID, castX, castY, castX, castY + 1, world.game);
                                spell.cast(context);
                                this.performAnimation(Lich.AnimationKey.ANM_CUPID_ATTACK_KEY);
                                this.currentAttackCooldown = 0;
                            }
                            break;
                        case AI_MODE.SPAWN:
                            if (this.currentSpawnCooldown < CupidBoss.SPAWN_COOLDOWN) {
                                this.currentSpawnCooldown += delta;
                            }
                            else {
                                var spawnMinion = function () {
                                    _this.performAnimation(Lich.AnimationKey.ANM_CUPID_ATTACK_KEY);
                                    _this.currentSpawnCooldown = 0;
                                    var angle = Math.random() * Math.PI * 2;
                                    var radius = Math.max(_this.fixedWidth / 2, _this.fixedHeight / 2);
                                    var enemy = Lich.SpawnPool.getInstance().spawnAt(Enemy.Valentimon, world, _this.x + _this.fixedWidth / 2 + Math.cos(angle) * radius, _this.y + _this.fixedHeight / 2 + Math.sin(angle) * radius);
                                    return enemy;
                                };
                                // pokud je to první spawnování, spawnuje, dokud není můžeš
                                if (this.spawnedEnemies.length < CupidBoss.SPAWN_ENEMIES_COUNT) {
                                    this.spawnedEnemies.push(spawnMinion());
                                }
                                else {
                                    // zkus najít padlého nepřítele a nahraď ho novým
                                    for (var e in this.spawnedEnemies) {
                                        var enemy = this.spawnedEnemies[e];
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
            CupidBoss.prototype.death = function () { this.performAnimation(Lich.AnimationKey.ANM_CUPID_DIE_KEY); };
            ;
            CupidBoss.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                this.speedx = 0;
                this.speedy = 0;
                // Mixer.playSound(SoundKey.SND_CHICKEN_BOSS_DEAD_KEY, 0.8);
                this.dropLoot(world, Lich.InventoryKey.INV_RED_FLASK_KEY, 2);
                this.dropLoot(world, Lich.InventoryKey.INV_GOLD_KEY, 3);
                world.fadeEnemy(this);
                Lich.Mixer.stopAllMusic();
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_DIRT_THEME_KEY, 0.3);
                CupidBoss.spawned = false;
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.ACHIEVEMENT_DONE, Lich.AchievementKey[Lich.AchievementKey.ACHV_HEARTBREAKING_KEY]));
            };
            CupidBoss.prototype.hit = function (damage, world) {
                if (this.getCurrentHealth() > 0) {
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            return CupidBoss;
        }(Lich.AbstractEnemy));
        CupidBoss.OWNER_ID = "CUPID_BOSS";
        CupidBoss.HOVER_ALT = 300;
        CupidBoss.PULL_HOVER_ALT = 400;
        CupidBoss.MODE_COOLDOWN = 5000;
        CupidBoss.SPAWN_COOLDOWN = 500;
        CupidBoss.SPAWN_ENEMIES_COUNT = 5;
        CupidBoss.spawned = false;
        Enemy.CupidBoss = CupidBoss;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
