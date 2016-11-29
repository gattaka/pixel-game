namespace Lich {
    export namespace Enemy {
        export class Chicken extends AbstractEnemy {

            static IDLEL = "IDLEL";
            static IDLER = "IDLER";
            static EATL = "EATL";
            static EATR = "EATR";
            static WALKR = "WALKR";
            static WALKL = "WALKL";
            static JUMPR = "JUMPR";
            static JUMPL = "JUMPL";
            static DIE = "DIE";

            static WANDER_COOLDOWN = 3000;
            wanderCooldown = 0;

            lastOrientationLeft = true;

            constructor() {
                super(
                    0, // DAMAGE
                    0, // ATTACK_COOLDOWN
                    26, // WIDTH
                    26, // HEIGHT 
                    8, // COLLXOFFSET
                    2, // COLLYOFFSET
                    AnimationKey.CHICKEN_ANIMATION_KEY,
                    Chicken.IDLEL,
                    15, // frames
                    100, // HORIZONTAL_SPEED
                    320, // VERTICAL_SPEED
                    new Animations()
                        .add(Chicken.EATL, 0, 1, Chicken.EATL, 0.1)
                        .add(Chicken.IDLEL, 2, 2, Chicken.IDLEL, 0.001)
                        .add(Chicken.JUMPL, 3, 3, Chicken.WALKL, 0.2)
                        .add(Chicken.WALKL, 3, 6, Chicken.WALKL, 0.2)
                        .add(Chicken.WALKR, 7, 10, Chicken.WALKR, 0.2)
                        .add(Chicken.JUMPR, 10, 10, Chicken.WALKR, 0.2)
                        .add(Chicken.IDLER, 11, 11, Chicken.IDLER, 0.001)
                        .add(Chicken.EATR, 12, 13, Chicken.EATR, 0.1)
                        .add(Chicken.DIE, 14, 14, Chicken.DIE, 0.1)
                );
                this.setNewMaxHealth(50);
            }

            runAI(world: World, delta: number) {
                if (this.currentHealth > 0) {
                    this.wanderCooldown -= delta;
                    if (this.wanderCooldown <= 0) {
                        this.wanderCooldown = Chicken.WANDER_COOLDOWN;

                        let rnd = Math.floor(Math.random() * 3);
                        if (rnd == 0) {
                            if (this.lastOrientationLeft) {
                                this.performState(Chicken.IDLEL);
                            } else {
                                this.performState(Chicken.IDLER);
                            }
                            this.movementTypeX = MovementTypeX.NONE;
                            Mixer.playSound(SoundKey.SND_CHICKEN_IDLE);
                        } else if (rnd == 1) {
                            let direction = Math.random() * 2;
                            if (direction > 1) {
                                this.movementTypeX = MovementTypeX.WALK_LEFT;
                                this.lastOrientationLeft = true;
                            } else {
                                this.movementTypeX = MovementTypeX.WALK_RIGHT;
                                this.lastOrientationLeft = false;
                            }
                        } else {
                            if (this.lastOrientationLeft) {
                                this.performState(Chicken.EATL);
                            } else {
                                this.performState(Chicken.EATR);
                            }
                            this.movementTypeX = MovementTypeX.NONE;
                        }
                    } else {
                        // udržuje aktuální stav, ale může skákat
                        this.movementTypeY = MovementTypeY.NONE;
                        if (this.speedx != 0) {
                            let nextX = 0;
                            if (this.lastOrientationLeft) {
                                nextX = this.x + this.collXOffset - Resources.TILE_SIZE;
                            } else {
                                nextX = this.x + this.width - this.collXOffset + Resources.TILE_SIZE;
                            }

                            if (world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE - this.collYOffset).hit
                                && world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE * 3 - this.collYOffset).hit == false) {
                                // pokud je přede mnou překážka, kterou mám šanci přeskočit, zkus vyskočit
                                this.movementTypeY = MovementTypeY.JUMP_OR_CLIMB;
                            }
                        }
                    }
                }
            }

            walkL() { this.performState(Chicken.WALKL) };
            walkR() { this.performState(Chicken.WALKR) };
            idle() { /* nic */ };
            climb() { /* nic */ };
            jump() { this.performState(Chicken.JUMPL) };
            jumpR() { this.performState(Chicken.JUMPR) };
            jumpL() { this.performState(Chicken.JUMPL) };
            midair() { this.performState(Chicken.JUMPL) };
            fall() { this.performState(Chicken.JUMPL) };
            death() { this.performState(Chicken.DIE) };

            die(world: World) {
                super.die(world);
                switch (Math.floor(Math.random() * 3)) {
                    case 0: Mixer.playSound(SoundKey.SND_CHICKEN_DEAD_1); break;
                    case 1: Mixer.playSound(SoundKey.SND_CHICKEN_DEAD_2); break;
                    case 2: Mixer.playSound(SoundKey.SND_CHICKEN_DEAD_3); break;
                }
                world.spawnObject(new DugObjDefinition(InventoryKey.INV_CHICKEN_MEAT_KEY, 2), this.x, this.y, false);
                world.fadeEnemy(this);
            }

            hit(damage: number, world: World): number {
                if (this.getCurrentHealth() > 0) {
                    switch (Math.floor(Math.random() * 3)) {
                        case 0: Mixer.playSound(SoundKey.SND_CHICKEN_HIT_1); break;
                        case 1: Mixer.playSound(SoundKey.SND_CHICKEN_HIT_2); break;
                        case 2: Mixer.playSound(SoundKey.SND_CHICKEN_HIT_3); break;
                    }
                }
                super.hit(damage, world);
                return damage;
            }

        }
    }
}