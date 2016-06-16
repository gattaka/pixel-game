namespace Lich {
    export class Enemy extends Character {

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

        width = Enemy.WIDTH;
        height = Enemy.HEIGHT;
        speedx = 0;
        speedy = 0;

        state = Enemy.IDLE_STATE;

        initialized = false;

        constructor(public game: Game) {
            super(Enemy.WIDTH, Enemy.HEIGHT, 0, 0, new createjs.SpriteSheet({
                framerate: 10,
                "images": [game.resources.getImage(Resources.CORPSE_ANIMATION_KEY)],
                "frames": {
                    "regX": 0,
                    "height": Enemy.HEIGHT,
                    "count": 28,
                    "regY": 0,
                    "width": Enemy.WIDTH
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
            }), Enemy.stateAnimation[Enemy.IDLE_STATE], Enemy.stateAnimation, Enemy.COLLXOFFSET, Enemy.COLLYOFFSET);
        }

        shift(shift) {
            var self = this;
            if (self.initialized) {
                // TODO
            }
        }

        getStateAnimation(desiredState: string) {
            return Enemy.stateAnimation[desiredState];
        }

        walkL() {
            this.performState(Enemy.WALKL_STATE);
        }

        walkR() {
            this.performState(Enemy.WALKR_STATE);
        }

        idle() {
            this.performState(Enemy.IDLE_STATE);
        }

        jump() {
            this.performState(Enemy.JUMP_STATE);
        }

        jumpR() {
            this.performState(Enemy.JUMPR_STATE);
        }

        jumpL() {
            this.performState(Enemy.JUMPL_STATE);
        }

        midair() {
            this.performState(Enemy.MIDAIR_STATE);
        }

        fall() {
            this.performState(Enemy.FALL_STATE);
        }


    }
}