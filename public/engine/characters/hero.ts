namespace Lich {
    export class Hero extends Character {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/

        static OWNER_HERO_TAG = "OWNER_HERO_TAG";

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
                56, // WIDTH
                80, // HEIGHT 
                20, // COLLXOFFSET
                12, // COLLYOFFSET
                // 0,
                // 0,
                AnimationKey.LICH_ANIMATION_KEY,
                Hero.IDLE,
                40, // frames
                300, // HERO_HORIZONTAL_SPEED
                520, // HERO_VERTICAL_SPEED
                new Animations()
                    .add(Hero.IDLE, 0, 0, Hero.BREATH, 0.005)
                    .add(Hero.BREATH, 1, 1, Hero.IDLE, 0.04)
                    .add(Hero.WALKR, 2, 9, Hero.WALKR, 0.3)
                    .add(Hero.WALKL, 10, 17, Hero.WALKL, 0.3)
                    .add(Hero.JUMP, 18, 19, Hero.MIDAIR, 0.2)
                    .add(Hero.MIDAIR, 19, 19, Hero.MIDAIR, 0.2)
                    .add(Hero.FALL, 19, 23, Hero.IDLE, 0.2)
                    .add(Hero.JUMPR, 25, 25, Hero.JUMPR, 0.2)
                    .add(Hero.JUMPL, 27, 27, Hero.JUMPL, 0.2)
                    .add(Hero.DIE, 28, 28, Hero.DEAD, 0.2)
                    .add(Hero.DEAD, 29, 29, Hero.DEAD, 0.2)
                    .add(Hero.TELEPORT, 30, 36, Hero.IDLE, 1.0)
                    .add(Hero.CLIMB, 37, 39, Hero.CLIMB, 0.3)
            );

            this.willRegen = 10;
            this.healthRegen = 1;

            this.onHealthChange(this.currentHealth);
            this.onWillChange(this.currentWill);
        }

        onHealthChange(difference: number) {
            EventBus.getInstance().fireEvent(new HealthChangeEventPayload(this.maxHealth, this.currentHealth));
        };

        onWillChange(difference: number) {
            EventBus.getInstance().fireEvent(new WillChangeEventPayload(this.maxWill, this.currentWill));
        };

        hit(damage: number, world: World): number {
            if (this.currentHealth > 0 && damage > 0) {
                world.fadeText("-" + damage, this.x + this.width * Math.random(), this.y, 25, "#E30", "#300");
                switch (Math.floor(Math.random() * 4)) {
                    case 0:
                        Mixer.playSound(SoundKey.SND_PUNCH_1_KEY);
                        break;
                    case 1:
                        Mixer.playSound(SoundKey.SND_PUNCH_2_KEY);
                        break;
                    case 2:
                        Mixer.playSound(SoundKey.SND_PUNCH_3_KEY);
                        break;
                    case 3:
                        Mixer.playSound(SoundKey.SND_PUNCH_4_KEY);
                        break;
                }
            }
            super.hit(damage, world);
            return damage;
        }

        performState(desiredState) {
            var self = this;
            if (self.state !== desiredState && (this.currentHealth > 0 || desiredState == Hero.DIE)
                && self.sprite.currentAnimation != Hero.TELEPORT) {
                self.gotoAndPlay(desiredState);
                self.state = desiredState;
            }
        }

        die(world: World) {
            super.die(world);
            Mixer.playSound(SoundKey.SND_SQUASHED_KEY);
            world.showDeadInfo();
        }

        walkL() { this.performState(Hero.WALKL) };
        walkR() { this.performState(Hero.WALKR) };
        idle() { this.performState(Hero.IDLE) };
        climb() { this.performState(Hero.CLIMB) };
        jump() { this.performState(Hero.JUMP) };
        jumpR() { this.performState(Hero.JUMPR) };
        jumpL() { this.performState(Hero.JUMPL) };
        midair() { this.performState(Hero.MIDAIR) };
        fall() { this.performState(Hero.FALL) };
        death() { this.performState(Hero.DIE) };

    }
}