namespace Lich {
    export namespace Enemy {
        export class Hellhound extends AbstractEnemy {

            static OWNER_ID = "HELLHOUND";

            constructor() {
                super(
                    Hellhound.OWNER_ID,
                    AnimationSetKey.HELLHOUND_ANIMATION_KEY,
                    AnimationKey.ANM_HELLHOUND_IDLE_KEY,
                    10, // DAMAGE
                    1000,// ATTACK_COOLDOWN
                    16, // COLLXOFFSET
                    12, // COLLYOFFSET
                    600, // HERO_HORIZONTAL_SPEED
                    500, // HERO_VERTICAL_SPEED
                    true, // unspawns
                    0, // min depth 
                    50 // max depth
                );
            }

            walkL() { this.performAnimation(AnimationKey.ANM_HELLHOUND_WALKL_KEY) };
            walkR() { this.performAnimation(AnimationKey.ANM_HELLHOUND_WALKR_KEY) };
            idle() { this.performAnimation(AnimationKey.ANM_HELLHOUND_IDLE_KEY) };
            climb() { /* TODO */ };
            jump() { /* TODO */ };
            jumpR() { this.performAnimation(AnimationKey.ANM_HELLHOUND_JUMPR_KEY) };
            jumpL() { this.performAnimation(AnimationKey.ANM_HELLHOUND_JUMPL_KEY) };
            midair() { /* TODO */ };
            fall() { /* TODO */ };
            death() { /* TODO */ };

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