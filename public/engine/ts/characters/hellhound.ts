namespace Lich {
    export namespace Enemy {
        export class Hellhound extends AbstractEnemy {

            static OWNER_ID = "HELLHOUND";

            static IDLE = "IDLE";
            static WALKR = "WALKR";
            static WALKL = "WALKL";
            static JUMPR = "JUMPR";
            static JUMPL = "JUMPL";

            constructor() {
                super(
                    Hellhound.OWNER_ID,
                    10, // DAMAGE
                    1000,// ATTACK_COOLDOWN
                    128, // WIDTH
                    86, // HEIGHT 
                    16, // COLLXOFFSET
                    12, // COLLYOFFSET
                    AnimationKey.HELLHOUND_ANIMATION_KEY,
                    Hellhound.IDLE,
                    25, // frames
                    600, // HERO_HORIZONTAL_SPEED
                    500, // HERO_VERTICAL_SPEED
                    new Animations()
                        .add(Hellhound.IDLE, 22, 24, Hellhound.IDLE, 0.1)
                        .add(Hellhound.WALKR, 5, 9, Hellhound.WALKR, 0.2)
                        .add(Hellhound.WALKL, 0, 4, Hellhound.WALKL, 0.2)
                        .add(Hellhound.JUMPR, 16, 21, Hellhound.WALKR, 0.2)
                        .add(Hellhound.JUMPL, 10, 15, Hellhound.WALKL, 0.2),
                    true, // unspawns
                    0, // min depth 
                    50 // max depth
                );
            }

            walkL() { this.performState(Hellhound.WALKL) };
            walkR() { this.performState(Hellhound.WALKR) };
            idle() { this.performState(Hellhound.IDLE) };
            climb() { /* TODO */ };
            jump() { /* TODO */ };
            jumpR() { this.performState(Hellhound.JUMPR) };
            jumpL() { this.performState(Hellhound.JUMPL) };
            midair() { /* TODO */ };
            fall() { /* TODO */ };
            death() { /* TODO */ };

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