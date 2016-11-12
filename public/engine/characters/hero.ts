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
                16, // COLLYOFFSET
                AnimationKey.LICH_ANIMATION_KEY,
                CharacterState.IDLE,
                30, // frames
                MovementType.WALK,
                300, // HERO_HORIZONTAL_SPEED
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
                    .add(CharacterState.DEAD, 29, 29, CharacterState.DEAD, 0.2),
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

    }
}