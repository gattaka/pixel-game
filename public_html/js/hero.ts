namespace Lich {
    export class Hero extends AbstractWorldObject {

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

        // Collision offset
        static COLLXOFFSET = 10;
        static COLLYOFFSET = 2;

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

        state = Hero.IDLE_STATE;

        initialized = false;

        constructor(public game: Game) {
            super(Hero.WIDTH, Hero.HEIGHT, 0, 0, new createjs.SpriteSheet({
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
            }), Hero.stateAnimation[Hero.IDLE_STATE], Hero.stateAnimation, Hero.COLLXOFFSET, Hero.COLLYOFFSET);
        }

        shift(shift) {
            var self = this;
            if (self.initialized) {
                // TODO
            }
        }

        performState(desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(Hero.stateAnimation[desiredState]);
                self.state = desiredState;
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
            var self = this;
            if (self.speedx === 0 && self.speedy === 0) {
                self.idle();
            } else if (self.speedy !== 0) {
                if (self.speedx === 0) {
                    self.jump();
                } else if (self.speedx > 0) {
                    self.jumpL();
                } else {
                    self.jumpR();
                }
            } else {
                if (self.speedx > 0) {
                    self.walkL();
                }
                if (self.speedx < 0) {
                    self.walkR();
                }
            }
        }

    }
}