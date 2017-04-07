namespace Lich {
    export namespace Enemy {
        export class Alien extends AbstractEnemy {

            static OWNER_ID = "ALIEN";

            constructor() {
                super(
                    Alien.OWNER_ID,
                    AnimationSetKey.ALIEN_ANIMATION_KEY,
                    AnimationKey.ANM_ALIEN_ATTACKL_KEY,
                    10, // DAMAGE
                    1000,// ATTACK_COOLDOWN
                    30, // COLLXOFFSET
                    4, // COLLYOFFSET
                    600, // HERO_HORIZONTAL_SPEED
                    500, // HERO_VERTICAL_SPEED
                    true, // unspawns
                    0, // min depth 
                    100 // max depth
                );
            }

            walkL() { this.performAnimation(AnimationKey.ANM_ALIEN_WALKL_KEY) };
            walkR() { this.performAnimation(AnimationKey.ANM_ALIEN_WALKR_KEY) };
            idle() { this.performAnimation(AnimationKey.ANM_ALIEN_ATTACKL_KEY) };
            climb() { /* TODO */ };
            jump() { /* TODO */ };
            jumpR() { this.performAnimation(AnimationKey.ANM_ALIEN_WALKR_KEY) };
            jumpL() { this.performAnimation(AnimationKey.ANM_ALIEN_WALKL_KEY) };
            midair() { /* TODO */ };
            fall() { /* TODO */ };
            death() {  this.performAnimation(AnimationKey.ANM_ALIEN_DIE_KEY) };

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