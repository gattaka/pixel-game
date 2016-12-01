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
                _super.call(this, 0, // DAMAGE
                0, // ATTACK_COOLDOWN
                26, // WIDTH
                26, // HEIGHT 
                8, // COLLXOFFSET
                2, // COLLYOFFSET
                Lich.AnimationKey.CHICKEN_ANIMATION_KEY, Chicken.IDLEL, 15, // frames
                100, // HORIZONTAL_SPEED
                320, // VERTICAL_SPEED
                new Lich.Animations()
                    .add(Chicken.EATL, 0, 1, Chicken.EATL, 0.1)
                    .add(Chicken.IDLEL, 2, 2, Chicken.IDLEL, 0.001)
                    .add(Chicken.JUMPL, 3, 3, Chicken.WALKL, 0.2)
                    .add(Chicken.WALKL, 3, 6, Chicken.WALKL, 0.2)
                    .add(Chicken.WALKR, 7, 10, Chicken.WALKR, 0.2)
                    .add(Chicken.JUMPR, 10, 10, Chicken.WALKR, 0.2)
                    .add(Chicken.IDLER, 11, 11, Chicken.IDLER, 0.001)
                    .add(Chicken.EATR, 12, 13, Chicken.EATR, 0.1)
                    .add(Chicken.DIE, 14, 14, Chicken.DIE, 0.1));
                this.modeCooldown = 0;
                this.currentMode = 0;
                this.lastOrientationLeft = true;
                this.setNewMaxHealth(50);
            }
            Chicken.prototype.runAI = function (world, delta) {
                if (this.currentHealth > 0) {
                    this.modeCooldown -= delta;
                    if (this.modeCooldown <= 0) {
                        this.modeCooldown = Chicken.MODE_COOLDOWN;
                        this.currentMode = Math.floor(Math.random() * 3);
                        if (this.currentMode == 0) {
                            this.movementTypeX = Lich.MovementTypeX.NONE;
                            Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_IDLE);
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
                                this.performState(Chicken.IDLEL);
                            }
                            else {
                                this.performState(Chicken.IDLER);
                            }
                        }
                        else {
                            if (this.lastOrientationLeft) {
                                this.performState(Chicken.EATL);
                            }
                            else {
                                this.performState(Chicken.EATR);
                            }
                        }
                    }
                }
            };
            Chicken.prototype.walkL = function () { this.performState(Chicken.WALKL); };
            ;
            Chicken.prototype.walkR = function () { this.performState(Chicken.WALKR); };
            ;
            Chicken.prototype.idle = function () { };
            ;
            Chicken.prototype.climb = function () { };
            ;
            Chicken.prototype.jump = function () { this.performState(Chicken.JUMPL); };
            ;
            Chicken.prototype.jumpR = function () { this.performState(Chicken.JUMPR); };
            ;
            Chicken.prototype.jumpL = function () { this.performState(Chicken.JUMPL); };
            ;
            Chicken.prototype.midair = function () { this.performState(Chicken.JUMPL); };
            ;
            Chicken.prototype.fall = function () { this.performState(Chicken.JUMPL); };
            ;
            Chicken.prototype.death = function () { this.performState(Chicken.DIE); };
            ;
            Chicken.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_DEAD_1);
                        break;
                    case 1:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_DEAD_2);
                        break;
                    case 2:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_DEAD_3);
                        break;
                }
                world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_CHICKEN_MEAT_KEY, 2), this.x, this.y, false);
                world.fadeEnemy(this);
            };
            Chicken.prototype.hit = function (damage, world) {
                if (this.getCurrentHealth() > 0) {
                    switch (Math.floor(Math.random() * 3)) {
                        case 0:
                            Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_HIT_1);
                            break;
                        case 1:
                            Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_HIT_2);
                            break;
                        case 2:
                            Lich.Mixer.playSound(Lich.SoundKey.SND_CHICKEN_HIT_3);
                            break;
                    }
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            Chicken.IDLEL = "IDLEL";
            Chicken.IDLER = "IDLER";
            Chicken.EATL = "EATL";
            Chicken.EATR = "EATR";
            Chicken.WALKR = "WALKR";
            Chicken.WALKL = "WALKL";
            Chicken.JUMPR = "JUMPR";
            Chicken.JUMPL = "JUMPL";
            Chicken.DIE = "DIE";
            Chicken.MODE_COOLDOWN = 3000;
            return Chicken;
        }(Lich.AbstractEnemy));
        Enemy.Chicken = Chicken;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
