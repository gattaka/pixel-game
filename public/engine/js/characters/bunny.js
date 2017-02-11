var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Bunny = (function (_super) {
            __extends(Bunny, _super);
            function Bunny() {
                var _this = _super.call(this, Bunny.OWNER_ID, 0, // DAMAGE
                0, // ATTACK_COOLDOWN
                32, // WIDTH
                32, // HEIGHT 
                8, // COLLXOFFSET
                2, // COLLYOFFSET
                Lich.AnimationKey.BUNNY_ANIMATION_KEY, Bunny.IDLEL, 13, // frames
                100, // HORIZONTAL_SPEED
                320, // VERTICAL_SPEED
                new Lich.Animations()
                    .add(Bunny.EATL, 6, 7, Bunny.EATL, 0.1)
                    .add(Bunny.IDLEL, 11, 11, Bunny.IDLEL, 0.001)
                    .add(Bunny.JUMPL, 8, 11, Bunny.JUMPL, 0.2)
                    .add(Bunny.WALKL, 8, 11, Bunny.WALKL, 0.2)
                    .add(Bunny.WALKR, 0, 3, Bunny.WALKR, 0.2)
                    .add(Bunny.JUMPR, 0, 3, Bunny.JUMPR, 0.2)
                    .add(Bunny.IDLER, 0, 0, Bunny.IDLER, 0.001)
                    .add(Bunny.EATR, 4, 5, Bunny.EATR, 0.1)
                    .add(Bunny.DIE, 12, 12, Bunny.DIE, 0.1), true, // unspawns
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
                                this.performState(Bunny.IDLEL);
                            }
                            else {
                                this.performState(Bunny.IDLER);
                            }
                        }
                        else {
                            if (this.lastOrientationLeft) {
                                this.performState(Bunny.EATL);
                            }
                            else {
                                this.performState(Bunny.EATR);
                            }
                        }
                    }
                }
            };
            Bunny.prototype.walkL = function () { this.performState(Bunny.WALKL); };
            ;
            Bunny.prototype.walkR = function () { this.performState(Bunny.WALKR); };
            ;
            Bunny.prototype.idle = function () { };
            ;
            Bunny.prototype.climb = function () { };
            ;
            Bunny.prototype.jump = function () { this.performState(Bunny.JUMPL); };
            ;
            Bunny.prototype.jumpR = function () { this.performState(Bunny.JUMPR); };
            ;
            Bunny.prototype.jumpL = function () { this.performState(Bunny.JUMPL); };
            ;
            Bunny.prototype.midair = function () { this.performState(Bunny.JUMPL); };
            ;
            Bunny.prototype.fall = function () { this.performState(Bunny.JUMPL); };
            ;
            Bunny.prototype.death = function () { this.performState(Bunny.DIE); };
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
        Bunny.IDLEL = "IDLEL";
        Bunny.IDLER = "IDLER";
        Bunny.EATL = "EATL";
        Bunny.EATR = "EATR";
        Bunny.WALKR = "WALKR";
        Bunny.WALKL = "WALKL";
        Bunny.JUMPR = "JUMPR";
        Bunny.JUMPL = "JUMPL";
        Bunny.DIE = "DIE";
        Bunny.MODE_COOLDOWN = 3000;
        Enemy.Bunny = Bunny;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
