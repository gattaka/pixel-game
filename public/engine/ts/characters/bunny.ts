namespace Lich {
    export namespace Enemy {
        export class Bunny extends AbstractEnemy {

            static OWNER_ID = "BUNNY";

            static IDLEL = "IDLEL";
            static IDLER = "IDLER";
            static EATL = "EATL";
            static EATR = "EATR";
            static WALKR = "WALKR";
            static WALKL = "WALKL";
            static JUMPR = "JUMPR";
            static JUMPL = "JUMPL";
            static DIE = "DIE";

            static MODE_COOLDOWN = 3000;
            modeCooldown = 0;
            currentMode = 0;

            lastOrientationLeft = true;

            constructor() {
                super(
                    Bunny.OWNER_ID,
                    0, // DAMAGE
                    0, // ATTACK_COOLDOWN
                    32, // WIDTH
                    32, // HEIGHT 
                    8, // COLLXOFFSET
                    2, // COLLYOFFSET
                    AnimationKey.BUNNY_ANIMATION_KEY,
                    Bunny.IDLEL,
                    13, // frames
                    100, // HORIZONTAL_SPEED
                    320, // VERTICAL_SPEED
                    new Animations()
                        .add(Bunny.EATL, 6, 7, Bunny.EATL, 0.1)
                        .add(Bunny.IDLEL, 11, 11, Bunny.IDLEL, 0.001)
                        .add(Bunny.JUMPL, 8, 11, Bunny.JUMPL, 0.2)
                        .add(Bunny.WALKL, 8, 11, Bunny.WALKL, 0.2)
                        .add(Bunny.WALKR, 0, 3, Bunny.WALKR, 0.2)
                        .add(Bunny.JUMPR, 0, 3, Bunny.JUMPR, 0.2)
                        .add(Bunny.IDLER, 0, 0, Bunny.IDLER, 0.001)
                        .add(Bunny.EATR, 4, 5, Bunny.EATR, 0.1)
                        .add(Bunny.DIE, 12, 12, Bunny.DIE, 0.1),
                    true, // unspawns
                    0, // min depth 
                    20 // max depth
                );
                this.setNewMaxHealth(50);
            }

            runAI(world: World, delta: number) {
                if (this.currentHealth > 0) {
                    this.modeCooldown -= delta;
                    if (this.modeCooldown <= 0) {
                        this.modeCooldown = Bunny.MODE_COOLDOWN;
                        this.currentMode = Math.floor(Math.random() * 3);
                        if (this.currentMode == 0) {
                            this.movementTypeX = MovementTypeX.NONE;
                        } else if (this.currentMode == 1) {
                            let direction = Math.random() * 2;
                            if (direction > 1) {
                                this.movementTypeX = MovementTypeX.WALK_LEFT;
                                this.lastOrientationLeft = true;
                            } else {
                                this.movementTypeX = MovementTypeX.WALK_RIGHT;
                                this.lastOrientationLeft = false;
                            }
                        } else {
                            this.movementTypeX = MovementTypeX.NONE;
                        }
                    }

                    // udržuje aktuální stav, ale může skákat
                    if (this.movementTypeX != MovementTypeX.NONE) {
                        let nextX = 0;
                        if (this.lastOrientationLeft) {
                            nextX = this.x + this.collXOffset - Resources.TILE_SIZE;
                        } else {
                            nextX = this.x + this.width - this.collXOffset + Resources.TILE_SIZE;
                        }

                        if (world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE - this.collYOffset).hit) {
                            // pokud je přede mnou překážka
                            if (world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE * 3 - this.collYOffset).hit == false) {
                                // kterou mám šanci přeskočit, zkus vyskočit
                                this.movementTypeY = MovementTypeY.JUMP_OR_CLIMB;
                            } else {
                                // pokud se přeskočit nedá, zastav se
                                this.movementTypeX = MovementTypeX.NONE;
                                this.movementTypeY = MovementTypeY.NONE;
                            }
                        } else {
                            this.movementTypeY = MovementTypeY.NONE;
                        }
                    } else {
                        this.movementTypeY = MovementTypeY.NONE;
                        if (this.currentMode == 0) {
                            if (this.lastOrientationLeft) {
                                this.performState(Bunny.IDLEL);
                            } else {
                                this.performState(Bunny.IDLER);
                            }
                        } else {
                            if (this.lastOrientationLeft) {
                                this.performState(Bunny.EATL);
                            } else {
                                this.performState(Bunny.EATR);
                            }
                        }
                    }
                }
            }

            walkL() { this.performState(Bunny.WALKL) };
            walkR() { this.performState(Bunny.WALKR) };
            idle() { /* nic */ };
            climb() { /* nic */ };
            jump() { this.performState(Bunny.JUMPL) };
            jumpR() { this.performState(Bunny.JUMPR) };
            jumpL() { this.performState(Bunny.JUMPL) };
            midair() { this.performState(Bunny.JUMPL) };
            fall() { this.performState(Bunny.JUMPL) };
            death() { this.performState(Bunny.DIE) };

            die(world: World) {
                super.die(world);
                Mixer.playSound(SoundKey.SND_SQUASHED_KEY);
                this.dropLoot(world, InventoryKey.INV_CHICKEN_MEAT_KEY);
                world.fadeEnemy(this);
            }

            hit(damage: number, world: World): number {
                if (this.getCurrentHealth() > 0) {
                    Mixer.playSound(SoundKey.SND_PUNCH_1_KEY);
                    super.hit(damage, world);
                    return damage;
                }
            }
        }
    }
}