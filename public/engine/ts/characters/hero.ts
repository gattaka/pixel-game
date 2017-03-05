namespace Lich {
    export class Hero extends Character {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/

        static OWNER_ID = "HERO";

        constructor() {
            super(
                Hero.OWNER_ID,
                AnimationSetKey.LICH_ANIMATION_KEY,
                AnimationKey.ANM_HERO_IDLE_KEY,
                20, // COLLXOFFSET
                12, // COLLYOFFSET
                300, // HERO_HORIZONTAL_SPEED
                520, // HERO_VERTICAL_SPEED
            );

            this.willRegen = 10;
            this.healthRegen = 1;
            this.hitTextColor = "#E30";
            this.hitTextBorderColor = "#300";

            this.onHealthChange(this.currentHealth);
            this.onWillChange(this.currentWill);
        }

        onHealthChange(difference: number) {
            EventBus.getInstance().fireEvent(new HealthChangeEventPayload(this.maxHealth, this.currentHealth));
        };

        onWillChange(difference: number) {
            EventBus.getInstance().fireEvent(new WillChangeEventPayload(this.maxWill, this.currentWill));
        };

        hitSound() {
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

        performAnimation(desiredAnimation: AnimationKey) {
            var self = this;
            let stringKey = AnimationKey[desiredAnimation];
            if (self.getCurrentAnimation() !== stringKey && (this.currentHealth > 0 || stringKey == AnimationKey[AnimationKey.ANM_HERO_DIE_KEY])
                && self.getCurrentSubAnimation() != AnimationKey[AnimationKey.ANM_HERO_TELEPORT_KEY]) {
                self.gotoAndPlay(stringKey);
            }
        }

        die(world: World) {
            super.die(world);
            Mixer.playSound(SoundKey.SND_SQUASHED_KEY);
            world.showDeadInfo();
        }

        walkL() { this.performAnimation(AnimationKey.ANM_HERO_WALKL_KEY) };
        walkR() { this.performAnimation(AnimationKey.ANM_HERO_WALKR_KEY) };
        idle() { this.performAnimation(AnimationKey.ANM_HERO_IDLE_KEY) };
        climb() { this.performAnimation(AnimationKey.ANM_HERO_CLIMB_KEY) };
        jump() { this.performAnimation(AnimationKey.ANM_HERO_JUMP_KEY) };
        jumpR() { this.performAnimation(AnimationKey.ANM_HERO_JUMPR_KEY) };
        jumpL() { this.performAnimation(AnimationKey.ANM_HERO_JUMPL_KEY) };
        midair() { this.performAnimation(AnimationKey.ANM_HERO_MIDAIR_KEY) };
        fall() { this.performAnimation(AnimationKey.ANM_HERO_FALL_KEY) };
        death() { this.performAnimation(AnimationKey.ANM_HERO_DIE_KEY) };

    }
}