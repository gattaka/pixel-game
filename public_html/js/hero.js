var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game) {
            _super.call(this, Hero.WIDTH, Hero.HEIGHT, new createjs.SpriteSheet({
                framerate: 10,
                "images": [game.resources.getImage(Lich.Resources.LICH_ANIMATION_KEY)],
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
            this.game = game;
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.width = Hero.WIDTH;
            this.height = Hero.HEIGHT;
            this.speedx = 0;
            this.speedy = 0;
            // Collision offset
            this.collXOffset = 10;
            this.collYOffset = 2;
            this.state = Hero.IDLE_STATE;
            this.initialized = false;
        }
        Hero.prototype.shift = function (shift) {
            if (this.initialized) {
            }
        };
        Hero.prototype.performState = function (desiredState) {
            if (this.state !== desiredState) {
                this.gotoAndPlay(Hero.stateAnimation[desiredState]);
                this.state = desiredState;
            }
        };
        Hero.prototype.walkL = function () {
            this.performState(Hero.WALKL_STATE);
        };
        Hero.prototype.walkR = function () {
            this.performState(Hero.WALKR_STATE);
        };
        Hero.prototype.idle = function () {
            this.performState(Hero.IDLE_STATE);
        };
        Hero.prototype.jump = function () {
            this.performState(Hero.JUMP_STATE);
        };
        Hero.prototype.jumpR = function () {
            this.performState(Hero.JUMPR_STATE);
        };
        Hero.prototype.jumpL = function () {
            this.performState(Hero.JUMPL_STATE);
        };
        Hero.prototype.midair = function () {
            this.performState(Hero.MIDAIR_STATE);
        };
        Hero.prototype.fall = function () {
            this.performState(Hero.FALL_STATE);
        };
        Hero.prototype.updateAnimations = function () {
            if (this.speedx === 0 && this.speedy === 0) {
                this.idle();
            }
            else if (this.speedy !== 0) {
                if (this.speedx === 0) {
                    this.jump();
                }
                else if (this.speedx > 0) {
                    this.jumpL();
                }
                else {
                    this.jumpR();
                }
            }
            else {
                if (this.speedx > 0) {
                    this.walkL();
                }
                if (this.speedx < 0) {
                    this.walkR();
                }
            }
        };
        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        Hero.WALKR_STATE = "WALKR_STATE";
        Hero.WALKL_STATE = "WALKL_STATE";
        Hero.IDLE_STATE = "IDLE_STATE";
        Hero.JUMP_STATE = "JUMP_STATE";
        Hero.JUMPR_STATE = "JUMPR_STATE";
        Hero.JUMPL_STATE = "JUMPL_STATE";
        Hero.MIDAIR_STATE = "MIDAIR_STATE";
        Hero.FALL_STATE = "FALL_STATE";
        Hero.WIDTH = 46;
        Hero.HEIGHT = 64;
        Hero.stateAnimation = {
            WALKR_STATE: "walkR",
            WALKL_STATE: "walkL",
            IDLE_STATE: "idle",
            JUMP_STATE: "jump",
            JUMPR_STATE: "jumpR",
            JUMPL_STATE: "jumpL",
            MIDAIR_STATE: "midair",
            FALL_STATE: "fall"
        };
        return Hero;
    }(Lich.Character));
    Lich.Hero = Hero;
})(Lich || (Lich = {}));
