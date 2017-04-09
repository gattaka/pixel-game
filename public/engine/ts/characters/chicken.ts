namespace Lich {
    export namespace Enemy {
        export class Chicken extends AbstractEnemy {

            static OWNER_ID = "CHICKEN";

            static MODE_COOLDOWN = 3000;

            modeCooldown = 0;
            currentMode = 0;

            lastOrientationLeft = true;

            constructor() {
                super(
                    Chicken.OWNER_ID,
                    AnimationSetKey.CHICKEN_ANIMATION_KEY,
                    AnimationKey.ANM_CHICKEN_IDLEL_KEY,
                    0, // DAMAGE
                    0, // ATTACK_COOLDOWN
                    8, // COLLXOFFSET
                    2, // COLLYOFFSET
                    100, // HORIZONTAL_SPEED
                    320, // VERTICAL_SPEED
                    true, // unspawns
                    0, // min depth 
                    25 // max depth
                );
                this.setNewMaxHealth(50);
            }

            runAI(world: World, delta: number) {
                if (this.currentHealth > 0) {
                    this.modeCooldown -= delta;
                    if (this.modeCooldown <= 0) {
                        this.modeCooldown = Chicken.MODE_COOLDOWN;
                        this.currentMode = Math.floor(Math.random() * 3);
                        if (this.currentMode == 0) {
                            this.movementTypeX = MovementTypeX.NONE;
                            // Mixer.playSound(SoundKey.SND_CHICKEN_IDLE);
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
                            nextX = this.x + this.fixedWidth - this.collXOffset + Resources.TILE_SIZE;
                        }

                        if (world.isCollision(nextX, this.y + this.fixedHeight - Resources.TILE_SIZE - this.collYOffset).hit) {
                            // pokud je přede mnou překážka
                            if (world.isCollision(nextX, this.y + this.fixedHeight - Resources.TILE_SIZE * 3 - this.collYOffset).hit == false) {
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
                                this.performAnimation(AnimationKey.ANM_CHICKEN_IDLEL_KEY);
                            } else {
                                this.performAnimation(AnimationKey.ANM_CHICKEN_IDLER_KEY);
                            }
                        } else {
                            if (this.lastOrientationLeft) {
                                this.performAnimation(AnimationKey.ANM_CHICKEN_EATL_KEY);
                            } else {
                                this.performAnimation(AnimationKey.ANM_CHICKEN_EATR_KEY);
                            }
                        }
                    }
                }
            }

            walkL() { this.performAnimation(AnimationKey.ANM_CHICKEN_WALKL_KEY) };
            walkR() { this.performAnimation(AnimationKey.ANM_CHICKEN_WALKR_KEY) };
            idle() { /* nic */ };
            climb() { /* nic */ };
            jump() { this.performAnimation(AnimationKey.ANM_CHICKEN_JUMPL_KEY) };
            jumpR() { this.performAnimation(AnimationKey.ANM_CHICKEN_JUMPR_KEY) };
            jumpL() { this.performAnimation(AnimationKey.ANM_CHICKEN_JUMPL_KEY) };
            midair() { this.performAnimation(AnimationKey.ANM_CHICKEN_JUMPL_KEY) };
            fall() { this.performAnimation(AnimationKey.ANM_CHICKEN_JUMPL_KEY) };
            death() { this.performAnimation(AnimationKey.ANM_CHICKEN_DIE_KEY) };

            die(world: World) {
                super.die(world);
                switch (Math.floor(Math.random() * 3)) {
                    case 0: Mixer.playSound(SoundKey.SND_CHICKEN_DEAD_1_KEY); break;
                    case 1: Mixer.playSound(SoundKey.SND_CHICKEN_DEAD_2_KEY); break;
                    case 2: Mixer.playSound(SoundKey.SND_CHICKEN_DEAD_3_KEY); break;
                }
                if (Math.random() > 0.5) {
                    this.dropLoot(world, InventoryKey.INV_CHICKEN_MEAT_KEY);
                } else {
                    this.dropLoot(world, InventoryKey.INV_CHICKEN_TALON_KEY);
                }
                world.fadeEnemy(this);
                ChickenBoss.chickenKills++;
                if (ChickenBoss.chickenKills >= ChickenBoss.ANGER_THRESHOLD && ChickenBoss.spawned == false) {
                    world.fadeText("Murhun spawned...", world.game.getSceneWidth() / 2, world.game.getSceneHeight() / 2, 30, "#E3E");
                    SpawnPool.getInstance().spawn(Enemy.ChickenBoss, world);
                    ChickenBoss.chickenKills = 0;
                    ChickenBoss.currentAngerCooldown = 0;
                } else if (ChickenBoss.chickenKills == Math.floor(ChickenBoss.ANGER_THRESHOLD / 2)) {
                    world.fadeText("Not wise...", world.game.getSceneWidth() / 2, world.game.getSceneHeight() / 2, 30, "#E3E");
                } else if (ChickenBoss.chickenKills == ChickenBoss.ANGER_THRESHOLD - 2) {
                    world.fadeText("Poor chicken...", world.game.getSceneWidth() / 2, world.game.getSceneHeight() / 2, 30, "#E3E");
                } else if (ChickenBoss.chickenKills == ChickenBoss.ANGER_THRESHOLD - 1) {
                    world.fadeText("Poor you...", world.game.getSceneWidth() / 2, world.game.getSceneHeight() / 2, 30, "#E3E");
                }
            }

            hit(damage: number, world: World): number {
                if (this.getCurrentHealth() > 0) {
                    switch (Math.floor(Math.random() * 3)) {
                        case 0: Mixer.playSound(SoundKey.SND_CHICKEN_HIT_1_KEY); break;
                        case 1: Mixer.playSound(SoundKey.SND_CHICKEN_HIT_2_KEY); break;
                        case 2: Mixer.playSound(SoundKey.SND_CHICKEN_HIT_3_KEY); break;
                    }
                }
                super.hit(damage, world);
                return damage;
            }

        }
    }
}