namespace Lich {
    export namespace Enemy {
        export class Chicken extends AbstractEnemy {

            static WANDER_COOLDOWN = 3000;
            wanderCooldown = 0;

            constructor() {
                super(
                    0, // DAMAGE
                    0,// ATTACK_COOLDOWN
                    26, // WIDTH
                    26, // HEIGHT 
                    2, // COLLXOFFSET
                    2, // COLLYOFFSET
                    AnimationKey.CHICKEN_ANIMATION_KEY,
                    CharacterState.IDLE,
                    14, // frames
                    100, // HORIZONTAL_SPEED
                    20, // VERTICAL_SPEED
                    new Animations()
                        .add(CharacterState.IDLE, 2, 2, CharacterState.IDLE, 0.001)
                        .add(CharacterState.BREATH, 0, 1, CharacterState.BREATH, 0.1)
                        .add(CharacterState.WALKR, 7, 10, CharacterState.WALKR, 0.2)
                        .add(CharacterState.WALKL, 3, 6, CharacterState.WALKL, 0.2)
                        .add(CharacterState.JUMPR, 10, 10, CharacterState.WALKR, 0.2)
                        .add(CharacterState.JUMPL, 3, 3, CharacterState.WALKL, 0.2)
                );
                this.setNewMaxHealth(50);
            }

            runAI(world: World, delta: number) {
                this.wanderCooldown -= delta;
                if (this.wanderCooldown <= 0) {
                    this.wanderCooldown = Chicken.WANDER_COOLDOWN;

                    let rnd = Math.floor(Math.random() * 3);
                    if (rnd == 0) {
                        this.performState(CharacterState.IDLE);
                        this.movementTypeX = MovementTypeX.NONE;
                        console.log("Chicken stopped");
                    } else if (rnd == 1) {
                        // let w = world.game.getCanvas().width;
                        let direction = Math.random() * 2;
                        if (direction > 1) {
                            this.movementTypeX = MovementTypeX.WALK_LEFT;
                            console.log("Chicken walk left");
                        } else {
                            this.movementTypeX = MovementTypeX.WALK_RIGHT;
                            console.log("Chicken walk right");
                        }
                    } else {
                        this.performState(CharacterState.BREATH);
                        this.movementTypeX = MovementTypeX.NONE;
                        console.log("Chicken is digging");
                    }
                }
                // TODO jump
            }

            idle() {
                // nic
            }

            jump() {
                this.performState(CharacterState.JUMPL);
            }

            midair() {
                this.performState(CharacterState.JUMPL);
            }

            fall() {
                this.performState(CharacterState.JUMPL);
            }

            die(world: World) {
                super.die(world);
                // Mixer.playSound(SoundKey.SND_SKELETON_DIE_KEY);
                world.spawnObject(new DugObjDefinition(InventoryKey.INV_BONES_KEY, 5), this.x, this.y, false);
                world.fadeEnemy(this);
            }

            hit(damage: number, world: World): number {
                if (this.currentHealth > 0) {
                    Mixer.playSound(SoundKey.SND_BONE_CRACK_KEY);
                }
                super.hit(damage, world);
                return damage;
            }

        }
    }
}