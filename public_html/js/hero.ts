namespace Lich {
    export class Hero extends Character {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/

        static WALKR_STATE = "WALKR_STATE";
        static WALKL_STATE = "WALKL_STATE";
        static IDLE_STATE = "IDLE_STATE";
        static JUMP_STATE = "JUMP_STATE";
        static JUMPR_STATE = "JUMPR_STATE";
        static JUMPL_STATE = "JUMPL_STATE";
        static MIDAIR_STATE = "MIDAIR_STATE";
        static FALL_STATE = "FALL_STATE";

        static WIDTH = 46;
        static HEIGHT = 64;

        static stateAnimation = {
            WALKR_STATE: "walkR",
            WALKL_STATE: "walkL",
            IDLE_STATE: "idle",
            JUMP_STATE: "jump",
            JUMPR_STATE: "jumpR",
            JUMPL_STATE: "jumpL",
            MIDAIR_STATE: "midair",
            FALL_STATE: "fall"
        };

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        width = Hero.WIDTH;
        height = Hero.HEIGHT;
        speedx = 0;
        speedy = 0;

        // Collision offset
        collXOffset = 10;
        collYOffset = 2;

        state = Hero.IDLE_STATE;

        initialized = false;

        constructor(public game: Game) {
            super(Hero.WIDTH, Hero.HEIGHT, new createjs.SpriteSheet({
                framerate: 10,
                "images": [game.resources.getImage(Resources.LICH_ANIMATION_KEY)],
                "frames": {
                    "regX": 0,
                    "height": Hero.HEIGHT,
                    "count": 28,
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
                    "jumpL": [27, 27, "jumpL", 0.2]
                }
            }), Hero.stateAnimation[Hero.IDLE_STATE], Hero.stateAnimation);
        }

        shift(shift) {
            if (this.initialized) {
                // TODO
            }
        }

        performState(desiredState) {
            if (this.state !== desiredState) {
                this.gotoAndPlay(Hero.stateAnimation[desiredState]);
                this.state = desiredState;
            }
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

        updateAnimations() {
            if (this.speedx === 0 && this.speedy === 0) {
                this.idle();
            } else if (this.speedy !== 0) {
                if (this.speedx === 0) {
                    this.jump();
                } else if (this.speedx > 0) {
                    this.jumpL();
                } else {
                    this.jumpR();
                }
            } else {
                if (this.speedx > 0) {
                    this.walkL();
                }
                if (this.speedx < 0) {
                    this.walkR();
                }
            }
        }

    }
}