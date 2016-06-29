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
        static DIE_STATE = "DIE_STATE";
        static DEAD_STATE = "DEAD_STATE";

        static WIDTH = 56;
        static HEIGHT = 80;

        // Collision offset
        static COLLXOFFSET = 10;
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

        width = Enemy.WIDTH;
        height = Enemy.HEIGHT;
        speedx = 0;
        speedy = 0;

        state = Enemy.IDLE_STATE;

        initialized = false;

        constructor(public game: Game) {
            super(Enemy.WIDTH, Enemy.HEIGHT, new createjs.SpriteSheet({
                framerate: 10,
                "images": [game.resources.getImage(Resources.CORPSE_ANIMATION_KEY)],
                "frames": {
                    "regX": 0,
                    "height": Enemy.HEIGHT,
                    "count": 30,
                    "regY": 0,
                    "width": Enemy.WIDTH,
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
            }), Enemy.stateAnimation[Enemy.IDLE_STATE], Enemy.stateAnimation, Enemy.COLLXOFFSET, Enemy.COLLYOFFSET);
        }

        shift(shift) {
            var self = this;
            if (self.initialized) {
                // TODO
            }
        }

        getStateAnimation(desiredState: string) {
            if (this.life == 0 && desiredState != Enemy.DIE_STATE) {
                return Enemy.stateAnimation[Enemy.DEAD_STATE];
            } else {
                return Enemy.stateAnimation[desiredState];
            }
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

        die(game: Game) {
            this.performState(Enemy.DIE_STATE);
            Mixer.play(Resources.SND_SKELETON_DIE_KEY);
            // TODO loot
        }

        hit(damage: number, game: Game) {
            if (this.life > 0) {
                Mixer.play(Resources.SND_BONECRACK_KEY);
                this.life -= damage;
                if (this.life <= 0) {
                    this.life = 0;
                    this.speedx = 0;
                    this.die(game);
                }
            }
        }


    }
}