var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Bunny = (function (_super) {
            __extends(Bunny, _super);
            function Bunny() {
                var _this = _super.call(this, Bunny.OWNER_ID, Lich.AnimationSetKey.BUNNY_ANIMATION_KEY, Lich.AnimationKey.ANM_BUNNY_IDLEL_KEY, 0, // DAMAGE
                0, // ATTACK_COOLDOWN
                8, // COLLXOFFSET
                2, // COLLYOFFSET
                100, // HORIZONTAL_SPEED
                320, // VERTICAL_SPEED
                true, // unspawns
                0, // min depth 
                20 // max depth
                ) || this;
                _this.modeCooldown = 0;
                _this.currentMode = 0;
                _this.lastOrientationLeft = true;
                _this.setNewMaxHealth(50);
                return _this;
            }
            Bunny.prototype.runAI = function (world, delta) {
                if (this.currentHealth > 0) {
                    this.modeCooldown -= delta;
                    if (this.modeCooldown <= 0) {
                        this.modeCooldown = Bunny.MODE_COOLDOWN;
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
                            nextX = this.x + this.fixedWidth - this.collXOffset + Lich.Resources.TILE_SIZE;
                        }
                        if (world.isCollision(nextX, this.y + this.fixedHeight - Lich.Resources.TILE_SIZE - this.collYOffset).hit) {
                            // pokud je přede mnou překážka
                            if (world.isCollision(nextX, this.y + this.fixedHeight - Lich.Resources.TILE_SIZE * 3 - this.collYOffset).hit == false) {
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
                                this.performAnimation(Lich.AnimationKey.ANM_BUNNY_IDLEL_KEY);
                            }
                            else {
                                this.performAnimation(Lich.AnimationKey.ANM_BUNNY_IDLER_KEY);
                            }
                        }
                        else {
                            if (this.lastOrientationLeft) {
                                this.performAnimation(Lich.AnimationKey.ANM_BUNNY_EATL_KEY);
                            }
                            else {
                                this.performAnimation(Lich.AnimationKey.ANM_BUNNY_EATR_KEY);
                            }
                        }
                    }
                }
            };
            Bunny.prototype.walkL = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_WALKL_KEY); };
            ;
            Bunny.prototype.walkR = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_WALKR_KEY); };
            ;
            Bunny.prototype.idle = function () { };
            ;
            Bunny.prototype.climb = function () { };
            ;
            Bunny.prototype.jump = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY); };
            ;
            Bunny.prototype.jumpR = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_JUMPR_KEY); };
            ;
            Bunny.prototype.jumpL = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY); };
            ;
            Bunny.prototype.midair = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY); };
            ;
            Bunny.prototype.fall = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY); };
            ;
            Bunny.prototype.death = function () { this.performAnimation(Lich.AnimationKey.ANM_BUNNY_DIE_KEY); };
            ;
            Bunny.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SQUASHED_KEY);
                this.dropLoot(world, Lich.InventoryKey.INV_CHICKEN_MEAT_KEY);
                world.fadeEnemy(this);
            };
            Bunny.prototype.hit = function (damage, world) {
                if (this.getCurrentHealth() > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_PUNCH_1_KEY);
                    _super.prototype.hit.call(this, damage, world);
                    return damage;
                }
            };
            return Bunny;
        }(Lich.AbstractEnemy));
        Bunny.OWNER_ID = "BUNNY";
        Bunny.MODE_COOLDOWN = 3000;
        Enemy.Bunny = Bunny;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
