namespace Lich {
    export namespace Enemy {
        export class Bunny extends AbstractEnemy {

            static OWNER_ID = "BUNNY";

            static MODE_COOLDOWN = 3000;
            modeCooldown = 0;
            currentMode = 0;

            lastOrientationLeft = true;

            constructor() {
                super(
                    Bunny.OWNER_ID,
                    AnimationSetKey.BUNNY_ANIMATION_KEY,
                    AnimationKey.ANM_BUNNY_IDLEL_KEY,
                    0, // DAMAGE
                    0, // ATTACK_COOLDOWN
                    8, // COLLXOFFSET
                    2, // COLLYOFFSET
                    100, // HORIZONTAL_SPEED
                    320, // VERTICAL_SPEED
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
                                this.performAnimation(AnimationKey.ANM_BUNNY_IDLEL_KEY);
                            } else {
                                this.performAnimation(AnimationKey.ANM_BUNNY_IDLER_KEY);
                            }
                        } else {
                            if (this.lastOrientationLeft) {
                                this.performAnimation(AnimationKey.ANM_BUNNY_EATL_KEY);
                            } else {
                                this.performAnimation(AnimationKey.ANM_BUNNY_EATR_KEY);
                            }
                        }
                    }
                }
            }

            walkL() { this.performAnimation(AnimationKey.ANM_BUNNY_WALKL_KEY) };
            walkR() { this.performAnimation(AnimationKey.ANM_BUNNY_WALKR_KEY) };
            idle() { /* nic */ };
            climb() { /* nic */ };
            jump() { this.performAnimation(AnimationKey.ANM_BUNNY_JUMPL_KEY) };
            jumpR() { this.performAnimation(AnimationKey.ANM_BUNNY_JUMPR_KEY) };
            jumpL() { this.performAnimation(AnimationKey.ANM_BUNNY_JUMPL_KEY) };
            midair() { this.performAnimation(AnimationKey.ANM_BUNNY_JUMPL_KEY) };
            fall() { this.performAnimation(AnimationKey.ANM_BUNNY_JUMPL_KEY) };
            death() { this.performAnimation(AnimationKey.ANM_BUNNY_DIE_KEY) };

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