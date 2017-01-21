namespace Lich {
    export namespace Enemy {
        export class Valentimon extends AbstractEnemy {

            /**
             * aka Love Hurts   
             */

            static OWNER_ID = "VALENTIMON";

            static IDLE = "IDLE";
            static ATTACK = "ATTACK";
            static DIE = "DIE";
            static DEAD = "DEAD";

            constructor() {
                super(
                    Valentimon.OWNER_ID,
                    10, // DAMAGE
                    1000, // ATTACK_COOLDOWN
                    64, // WIDTH
                    64, // HEIGHT 
                    6, // COLLXOFFSET
                    9, // COLLYOFFSET
                    AnimationKey.VALENTIMON_ANIMATION_KEY,
                    Valentimon.IDLE,
                    10, // frames
                    200, // HORIZONTAL_SPEED
                    200, // VERTICAL_SPEED
                    new Animations()
                        .add(Valentimon.IDLE, 0, 3, Valentimon.IDLE, 0.1)
                        .add(Valentimon.ATTACK, 4, 6, Valentimon.IDLE, 0.3)
                        .add(Valentimon.DIE, 5, 9, Valentimon.DEAD, 0.2)
                        .add(Valentimon.DEAD, 9, 9, Valentimon.DEAD, 1),
                    true, // unspawns
                    0, // min depth 
                    100, // max depth
                    true // hovers
                );
                this.maxHealth = this.currentHealth = 200;

                // stále jsem v hover pohybu
                this.movementTypeX = MovementTypeX.HOVER;
                this.movementTypeY = MovementTypeY.HOVER;
            }

            runAI(world: World, delta: number) {
                let hero = world.hero;
                let heroTargetX = world.hero.x + world.hero.width / 2;
                let heroTargetY = world.hero.y + world.hero.height / 2;

                if (this.getCurrentHealth() > 0) {
                    if (this.currentAttackCooldown < this.attackCooldown)
                        this.currentAttackCooldown += delta;
                    if (this.currentAttackCooldown > this.attackCooldown) {
                        if (this.isPlayerInReach(world)) {
                            this.performState(Valentimon.ATTACK);
                            world.hero.hit(this.damage, world);
                            this.currentAttackCooldown = 0;
                        } else {
                            let spell = Resources.getInstance().spellDefs.byKey(SpellKey[SpellKey.SPELL_BOLT_KEY]);
                            let context = new SpellContext(Valentimon.OWNER_ID, this.x + this.width / 2, this.y + this.height / 2, heroTargetX, heroTargetY, world.game);
                            spell.cast(context);
                            this.currentAttackCooldown = 0;
                        }
                    } else {
                        let processSpeed = () => {
                            // snaž se dosáhnout místo středem
                            let targetX = heroTargetX - this.width / 2;
                            let targetY = heroTargetY - this.height / 2;

                            // nastav rychlost dle vzdálenosti
                            var b = targetX - this.x;
                            var a = targetY - this.y;
                            var c = Math.sqrt(a * a + b * b);

                            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
                            // přepony dle rychlosti projektilu
                            if (c == 0) c = 1;
                            this.speedx = -this.accelerationX * b / c;
                            this.speedy = -this.accelerationY * a / c;
                        };

                        processSpeed();
                    }
                }
            }

            walkL() { /* nic */ };
            walkR() { /* nic */ };
            idle() { /* nic */ };
            climb() { /* nic */ };
            jump() { /* nic */ };
            jumpR() { /* nic */ };
            jumpL() { /* nic */ };
            midair() { /* nic */ };
            fall() { /* nic */ };
            death() { this.performState(Valentimon.DIE) };

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