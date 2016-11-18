namespace Lich {
    export namespace Enemy {
        export class Hellhound extends AbstractEnemy {

            constructor() {
                super(
                    10, // DAMAGE
                    1000,// ATTACK_COOLDOWN
                    128, // WIDTH
                    86, // HEIGHT 
                    16, // COLLXOFFSET
                    12, // COLLYOFFSET
                    AnimationKey.HELLHOUND_ANIMATION_KEY,
                    CharacterState.IDLE,
                    25, // frames
                    MovementType.WALK,
                    600, // HERO_HORIZONTAL_SPEED
                    500, // HERO_VERTICAL_SPEED
                    new Animations()
                        .add(CharacterState.IDLE, 22, 24, CharacterState.IDLE, 0.1)
                        .add(CharacterState.WALKR, 5, 9, CharacterState.WALKR, 0.2)
                        .add(CharacterState.WALKL, 0, 4, CharacterState.WALKL, 0.2)
                        .add(CharacterState.JUMPR, 16, 21, CharacterState.WALKR, 0.2)
                        .add(CharacterState.JUMPL, 10, 15, CharacterState.WALKL, 0.2)
                );
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
                Mixer.playSound(SoundKey.SND_SKELETON_DIE_KEY);
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