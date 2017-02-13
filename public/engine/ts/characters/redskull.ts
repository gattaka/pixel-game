namespace Lich {
    export namespace Enemy {
        export class Redskull extends AbstractEnemy {

            static OWNER_ID = "REDSKULL";

            constructor() {
                super(
                    Redskull.OWNER_ID,
                    AnimationSetKey.CORPSE_ANIMATION_KEY,
                    AnimationKey.ANM_REDSKULL_IDLE_KEY,
                    5, // DAMAGE
                    1000,// ATTACK_COOLDOWN
                    14, // COLLXOFFSET
                    12, // COLLYOFFSET
                    200, // Redskull_HORIZONTAL_SPEED
                    500, // Redskull_VERTICAL_SPEED
                    true, // unspawns
                    0, // min depth 
                    50 // max depth
                );
            }
            
            walkL() { this.performAnimation(AnimationKey.ANM_REDSKULL_WALKL_KEY) };
            walkR() { this.performAnimation(AnimationKey.ANM_REDSKULL_WALKR_KEY) };
            idle() { this.performAnimation(AnimationKey.ANM_REDSKULL_IDLE_KEY) };
            climb() { this.performAnimation(AnimationKey.ANM_REDSKULL_CLIMB_KEY) };
            jump() { this.performAnimation(AnimationKey.ANM_REDSKULL_JUMP_KEY) };
            jumpR() { this.performAnimation(AnimationKey.ANM_REDSKULL_JUMPR_KEY) };
            jumpL() { this.performAnimation(AnimationKey.ANM_REDSKULL_JUMPL_KEY) };
            midair() { this.performAnimation(AnimationKey.ANM_REDSKULL_MIDAIR_KEY) };
            fall() { this.performAnimation(AnimationKey.ANM_REDSKULL_FALL_KEY) };
            death() { this.performAnimation(AnimationKey.ANM_REDSKULL_DIE_KEY) };

            die(world: World) {
                super.die(world);
                Mixer.playSound(SoundKey.SND_SKELETON_DIE_KEY);
                this.dropLoot(world, InventoryKey.INV_BONES_KEY);
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