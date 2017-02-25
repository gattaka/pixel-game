var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Chicken = (function (_super) {
            __extends(Chicken, _super);
            function Chicken() {
                var _this = _super.call(this, Chicken.OWNER_ID, Lich.AnimationSetKey.CHICKEN_ANIMATION_KEY, Lich.AnimationKey.ANM_CHICKEN_IDLEL_KEY, 0, // DAMAGE
                0, // ATTACK_COOLDOWN
                8, // COLLXOFFSET
                2, // COLLYOFFSET
                100, // HORIZONTAL_SPEED
                320, // VERTICAL_SPEED
                true, // unspawns
                0, // min depth 
                25 // max depth
                ) || this;
                _this.modeCooldown = 0;
                _this.currentMode = 0;
                _this.lastOrientationLeft = true;
                _this.setNewMaxHealth(50);
                return _this;
            }
            Chicken.prototype.runAI = function (world, delta) {
                if (this.currentHealth > 0) {
                    this.modeCooldown -= delta;
                    if (this.modeCooldown <= 0) {
                        this.modeCooldown = Chicken.MODE_COOLDOWN;
                        this.currentMode = Math.floor(Math.random() * 3);
                        if (this.currentMode == 0) {
                            this.movementTypeX = Lich.MovementTypeX.NONE;
                        }
                        else if (this.currentMode == 1) {
                            var direction = Math.random() * 2;
                            if (direction > 1) {
                                this.movementTypeX = Lich.MovementTypeX.WALK_LEFT;
                                this.lastOrientationLeft = true;
                            }
                            else {
                                this.movementTypeX = Lich.MovementTypeX.WALK_RIGHT;
                                this.lastOrientationLeft = false;
                            }
                        }
                        else {
                            this.movementTypeX = Lich.MovementTypeX.NONE;
                        }
                    }
                    // udržuje aktuální stav, ale může skákat
                    if (this.movementTypeX != Lich.MovementTypeX.NONE) {
                        var nextX = 0;
                        if (this.lastOrientationLeft) {
                            nextX = this.x + this.collXOffset - Lich.Resources.TILE_SIZE;
                        }
                        else {
                            nextX = this.x + this.width - this.collXOffset + Lich.Resources.TILE_SIZE;
                        }
                        if (world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE - this.collYOffset).hit) {
                            // pokud je přede mnou překážka
                            if (world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE * 3 - this.collYOffset).hit == false) {
                                // kterou mám šanci přeskočit, zkus vyskočit
                                this.movementTypeY = Lich.MovementTypeY.JUMP_OR_CLIMB;
                            }
                            else {
                                // pokud se přeskočit nedá, zastav se
                                this.movementTypeX = Lich.MovementTypeX.NONE;
                                this.movementTypeY = Lich.MovementTypeY.NONE;
                            }
                        }
                        else {
                            this.movementTypeY = Lich.MovementTypeY.NONE;
                        }
                    }
                    else {
                        this.movementTypeY = Lich.MovementTypeY.NONE;
                        if (this.currentMode == 0) {
                            if (this.lastOrientationLeft) {
                                this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_IDLEL_KEY);
                            }
                            else {
                                this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_IDLER_KEY);
                            }
                        }
                        else {
                            if (this.lastOrientationLeft) {
                                this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_EATL_KEY);
                            }
                            else {
                                this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_EATR_KEY);
                            }
                        }
                    }
                }
            };
            Chicken.prototype.walkL = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_WALKL_KEY); };
            ;
            Chicken.prototype.walkR = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_WALKR_KEY); };
            ;
            Chicken.prototype.idle = function () { };
            ;
            Chicken.prototype.climb = function () { };
            ;
            Chicken.prototype.jump = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_JUMPL_KEY); };
            ;
            Chicken.prototype.jumpR = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_JUMPR_KEY); };
            ;
            Chicken.prototype.jumpL = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_JUMPL_KEY); };
            ;
            Chicken.prototype.midair = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_JUMPL_KEY); };
            ;
            Chicken.prototype.fall = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_JUMPL_KEY); };
            ;
            Chicken.prototype.death = function () { this.performAnimation(Lich.AnimationKey.ANM_CHICKEN_DIE_KEY); };
            ;
            Chicken.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_DEAD_1_KEY);
                        break;
                    case 1:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_DEAD_2_KEY);
                        break;
                    case 2:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_DEAD_3_KEY);
                        break;
                }
                if (Math.random() > 0.5) {
                    this.dropLoot(world, Lich.InventoryKey.INV_CHICKEN_MEAT_KEY);
                }
                else {
                    this.dropLoot(world, Lich.InventoryKey.INV_CHICKEN_TALON_KEY);
                }
                world.fadeEnemy(this);
                Enemy.ChickenBoss.chickenKills++;
                if (Enemy.ChickenBoss.chickenKills >= Enemy.ChickenBoss.ANGER_THRESHOLD && Enemy.ChickenBoss.spawned == false) {
                    world.fadeText("Murhun spawned...", world.game.getRender().width / 2, world.game.getRender().height / 2, 2000);
                    Lich.SpawnPool.getInstance().spawn(Enemy.ChickenBoss, world);
                    Enemy.ChickenBoss.chickenKills = 0;
                    Enemy.ChickenBoss.currentAngerCooldown = 0;
                }
                else if (Enemy.ChickenBoss.chickenKills == Math.floor(Enemy.ChickenBoss.ANGER_THRESHOLD / 2)) {
                    world.fadeText("Not wise...", world.game.getRender().width / 2, world.game.getRender().height / 2, 2000);
                }
                else if (Enemy.ChickenBoss.chickenKills == Enemy.ChickenBoss.ANGER_THRESHOLD - 2) {
                    world.fadeText("Poor chicken...", world.game.getRender().width / 2, world.game.getRender().height / 2, 2000);
                }
                else if (Enemy.ChickenBoss.chickenKills == Enemy.ChickenBoss.ANGER_THRESHOLD - 1) {
                    world.fadeText("Poor you...", world.game.getRender().width / 2, world.game.getRender().height / 2, 2000);
                }
            };
            Chicken.prototype.hit = function (damage, world) {
                if (this.getCurrentHealth() > 0) {
                    switch (Math.floor(Math.random() * 3)) {
                        case 0:
                            Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_HIT_1_KEY);
                            break;
                        case 1:
                            Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_HIT_2_KEY);
                            break;
                        case 2:
                            Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_HIT_3_KEY);
                            break;
                    }
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            return Chicken;
        }(Lich.AbstractEnemy));
        Chicken.OWNER_ID = "CHICKEN";
        Chicken.MODE_COOLDOWN = 3000;
        Enemy.Chicken = Chicken;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
