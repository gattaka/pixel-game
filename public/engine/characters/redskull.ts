namespace Lich {
    export namespace Enemy {
        export class Redskull extends AbstractEnemy {

            constructor() {
                super(
                    5, // DAMAGE
                    1000,// ATTACK_COOLDOWN
                    56, // WIDTH
                    80, // HEIGHT 
                    14, // COLLXOFFSET
                    12, // COLLYOFFSET
                    AnimationKey.CORPSE_ANIMATION_KEY,
                    CharacterState.IDLE,
                    30, // frames
                    MovementType.WALK,
                    200, // HERO_HORIZONTAL_SPEED
                    500, // HERO_VERTICAL_SPEED
                    new Animations()
                        .add(CharacterState.IDLE, 0, 0, CharacterState.BREATH, 0.005)
                        .add(CharacterState.BREATH, 1, 1, CharacterState.IDLE, 0.04)
                        .add(CharacterState.WALKR, 2, 9, CharacterState.WALKR, 0.2)
                        .add(CharacterState.WALKL, 10, 17, CharacterState.WALKL, 0.2)
                        .add(CharacterState.JUMP, 18, 19, CharacterState.MIDAIR, 0.2)
                        .add(CharacterState.MIDAIR, 19, 19, CharacterState.MIDAIR, 0.2)
                        .add(CharacterState.FALL, 19, 23, CharacterState.IDLE, 0.2)
                        .add(CharacterState.JUMPR, 25, 25, CharacterState.JUMPR, 0.2)
                        .add(CharacterState.JUMPL, 27, 27, CharacterState.JUMPL, 0.2)
                        .add(CharacterState.DIE, 28, 28, CharacterState.DEAD, 0.2)
                        .add(CharacterState.DEAD, 29, 29, CharacterState.DEAD, 0.2)
                );
            }

            die(world: World) {
                super.die(world);
                Mixer.playSound(SoundKey.SND_SKELETON_DIE_KEY);
                world.spawnObject(new DugObjDefinition(InventoryKey.INV_BONES_KEY, 5), this.x, this.y, false);
                world.fadeEnemy(this);
            }

            hit(damage: number, world: World): number {
                if (this.currentHealth > 0) {
                    Mixer.playSound(SoundKey.SND_BONECRACK_KEY);
                }
                super.hit(damage, world);
                return damage;
            }

        }
    }
}