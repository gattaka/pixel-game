namespace Lich {
    export namespace Enemy {
        export class Redskull extends AbstractEnemy {

            static IDLE = "IDLE";
            static BREATH = "BREATH";
            static WALKR = "WALKR";
            static WALKL = "WALKL";
            static JUMP = "JUMP";
            static MIDAIR = "MIDAIR";
            static FALL = "FALL";
            static JUMPR = "JUMPR";
            static JUMPL = "JUMPL";
            static DIE = "DIE";
            static DEAD = "DEAD";
            static TELEPORT = "TELEPORT";
            static CLIMB = "CLIMB";

            constructor() {
                super(
                    5, // DAMAGE
                    1000,// ATTACK_COOLDOWN
                    56, // WIDTH
                    80, // HEIGHT 
                    14, // COLLXOFFSET
                    12, // COLLYOFFSET
                    AnimationKey.CORPSE_ANIMATION_KEY,
                    Redskull.IDLE,
                    40, // frames
                    200, // Redskull_HORIZONTAL_SPEED
                    500, // Redskull_VERTICAL_SPEED
                    new Animations()
                        .add(Redskull.IDLE, 0, 0, Redskull.BREATH, 0.005)
                        .add(Redskull.BREATH, 1, 1, Redskull.IDLE, 0.04)
                        .add(Redskull.WALKR, 2, 9, Redskull.WALKR, 0.3)
                        .add(Redskull.WALKL, 10, 17, Redskull.WALKL, 0.3)
                        .add(Redskull.JUMP, 18, 19, Redskull.MIDAIR, 0.2)
                        .add(Redskull.MIDAIR, 19, 19, Redskull.MIDAIR, 0.2)
                        .add(Redskull.FALL, 19, 23, Redskull.IDLE, 0.2)
                        .add(Redskull.JUMPR, 25, 25, Redskull.JUMPR, 0.2)
                        .add(Redskull.JUMPL, 27, 27, Redskull.JUMPL, 0.2)
                        .add(Redskull.DIE, 28, 28, Redskull.DEAD, 0.2)
                        .add(Redskull.DEAD, 29, 29, Redskull.DEAD, 0.2)
                        .add(Redskull.TELEPORT, 30, 36, Redskull.IDLE, 1.0)
                        .add(Redskull.CLIMB, 37, 39, Redskull.CLIMB, 0.3),
                    true, // unspawns
                    0, // min depth 
                    50 // max depth
                );
            }

            walkL() { this.performState(Redskull.WALKL) };
            walkR() { this.performState(Redskull.WALKR) };
            idle() { this.performState(Redskull.IDLE) };
            climb() { this.performState(Redskull.CLIMB) };
            jump() { this.performState(Redskull.JUMP) };
            jumpR() { this.performState(Redskull.JUMPR) };
            jumpL() { this.performState(Redskull.JUMPL) };
            midair() { this.performState(Redskull.MIDAIR) };
            fall() { this.performState(Redskull.FALL) };
            death() { this.performState(Redskull.DIE) };

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