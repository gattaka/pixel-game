namespace Lich {
    export class Hero extends Character {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/

        static OWNER_HERO_TAG = "OWNER_HERO_TAG";

        constructor() {
            super(
                56, // WIDTH
                80, // HEIGHT 
                16, // COLLXOFFSET
                12, // COLLYOFFSET
                AnimationKey.LICH_ANIMATION_KEY,
                CharacterState.IDLE,
                40, // frames
                MovementType.WALK,
                300, // HERO_HORIZONTAL_SPEED
                520, // HERO_VERTICAL_SPEED
                new Animations()
                    .add(CharacterState.IDLE, 0, 0, CharacterState.BREATH, 0.005)
                    .add(CharacterState.BREATH, 1, 1, CharacterState.IDLE, 0.04)
                    .add(CharacterState.WALKR, 2, 9, CharacterState.WALKR, 0.3)
                    .add(CharacterState.WALKL, 10, 17, CharacterState.WALKL, 0.3)
                    .add(CharacterState.JUMP, 18, 19, CharacterState.MIDAIR, 0.2)
                    .add(CharacterState.MIDAIR, 19, 19, CharacterState.MIDAIR, 0.2)
                    .add(CharacterState.FALL, 19, 23, CharacterState.IDLE, 0.2)
                    .add(CharacterState.JUMPR, 25, 25, CharacterState.JUMPR, 0.2)
                    .add(CharacterState.JUMPL, 27, 27, CharacterState.JUMPL, 0.2)
                    .add(CharacterState.DIE, 28, 28, CharacterState.DEAD, 0.2)
                    .add(CharacterState.DEAD, 29, 29, CharacterState.DEAD, 0.2)
                    .add(CharacterState.TELEPORT, 30, 36, CharacterState.IDLE, 1.0)
                    .add(CharacterState.CLIMB, 37, 39, CharacterState.CLIMB, 0.3),
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

        die(world: World) {
            super.die(world);
            Mixer.playSound(SoundKey.SND_BONE_CRUSH_KEY);
            world.showDeadInfo();
        }

    }
}