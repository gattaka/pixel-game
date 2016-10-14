namespace Lich {
    export class Hero extends Character {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/

        static OWNER_HERO_TAG = "OWNER_HERO_TAG";

        static WALKR_STATE = "WALKR_STATE";
        static WALKL_STATE = "WALKL_STATE";
        static IDLE_STATE = "IDLE_STATE";
        static JUMP_STATE = "JUMP_STATE";
        static JUMPR_STATE = "JUMPR_STATE";
        static JUMPL_STATE = "JUMPL_STATE";
        static MIDAIR_STATE = "MIDAIR_STATE";
        static FALL_STATE = "FALL_STATE";
        static DIE_STATE = "DIE_STATE";
        static DEAD_STATE = "DEAD_STATE";

        static WIDTH = 56;
        static HEIGHT = 80;

        // Collision offset
        static COLLXOFFSET = 14;
        static COLLYOFFSET = 10;

        static stateAnimation = {
            WALKR_STATE: "walkR",
            WALKL_STATE: "walkL",
            IDLE_STATE: "idle",
            JUMP_STATE: "jump",
            JUMPR_STATE: "jumpR",
            JUMPL_STATE: "jumpL",
            MIDAIR_STATE: "midair",
            FALL_STATE: "fall",
            DIE_STATE: "die",
            DEAD_STATE: "dead"
        };

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        width = Hero.WIDTH;
        height = Hero.HEIGHT;
        speedx = 0;
        speedy = 0;

        state = Hero.IDLE_STATE;

        initialized = false;

        constructor() {
            super(Hero.WIDTH, Hero.HEIGHT, new createjs.SpriteSheet({
                framerate: 10,
                "images": [Resources.getInstance().getImage(AnimationKey[AnimationKey.LICH_ANIMATION_KEY])],
                "frames": {
                    "regX": 0,
                    "height": Hero.HEIGHT,
                    "count": 30,
                    "regY": 0,
                    "width": Hero.WIDTH
                },
                "animations": {
                    "idle": [0, 0, "breath", 0.005],
                    "breath": [1, 1, "idle", 0.04],
                    "walkR": [2, 9, "walkR", 0.2],
                    "walkL": [10, 17, "walkL", 0.2],
                    "jump": [18, 19, "midair", 0.2],
                    "midair": [19, 19, "midair", 0.2],
                    "fall": [19, 23, "idle", 0.2],
                    "jumpR": [25, 25, "jumpR", 0.2],
                    "jumpL": [27, 27, "jumpL", 0.2],
                    "die": [28, 28, "dead", 0.2],
                    "dead": [29, 29, "dead", 0.2]
                }
            }), Hero.stateAnimation[Hero.IDLE_STATE], Hero.stateAnimation, Hero.COLLXOFFSET, Hero.COLLYOFFSET);

            this.willRegen = 10;

            this.onHealthChange(0);
            this.onWillChange(0);
        }

        shift(shift) {
            var self = this;
            if (self.initialized) {
                // TODO
            }
        }

        getStateAnimation(desiredState: string) {
            return Hero.stateAnimation[desiredState];
        }

        walkL() {
            this.performState(Hero.WALKL_STATE);
        }

        walkR() {
            this.performState(Hero.WALKR_STATE);
        }

        idle() {
            this.performState(Hero.IDLE_STATE);
        }

        jump() {
            this.performState(Hero.JUMP_STATE);
        }

        jumpR() {
            this.performState(Hero.JUMPR_STATE);
        }

        jumpL() {
            this.performState(Hero.JUMPL_STATE);
        }

        midair() {
            this.performState(Hero.MIDAIR_STATE);
        }

        fall() {
            this.performState(Hero.FALL_STATE);
        }

        die(game: Game) {
            this.performState(Hero.DIE_STATE);
        }

        onHealthChange(difference: number) {
            EventBus.getInstance().fireEvent(new HealthChangeEventPayload(this.maxHealth, this.currentHealth));
        };

        onWillChange(difference: number) {
            EventBus.getInstance().fireEvent(new WillChangeEventPayload(this.maxWill, this.currentWill));
        };

    }
}