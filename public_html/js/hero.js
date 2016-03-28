/*global createjs*/
/*global resources*/
/*global lich*/

var lich = lich || {};
lich.Hero = function () {

    var self = this;

    /*-----------*/
    /* CONSTANTS */
    /*-----------*/

    var WALKR_STATE = "WALKR_STATE";
    var WALKL_STATE = "WALKL_STATE";
    var IDLE_STATE = "IDLE_STATE";
    var JUMP_STATE = "JUMP_STATE";
    var JUMPR_STATE = "JUMPR_STATE";
    var JUMPL_STATE = "JUMPL_STATE";
    var MIDAIR_STATE = "MIDAIR_STATE";
    var FALL_STATE = "FALL_STATE";

    var WIDTH = 46;
    var HEIGHT = 64;

    /*-----------*/
    /* VARIABLES */
    /*-----------*/

    this.sprite;
    this.width = WIDTH;
    this.height = HEIGHT;
    this.speedx = 0;
    this.speedy = 0;

    // Collision offset
    this.collXOffset = 10;
    this.collYOffset = 2;

    var stateAnimation = {
        WALKR_STATE: "walkR",
        WALKL_STATE: "walkL",
        IDLE_STATE: "idle",
        JUMP_STATE: "jump",
        JUMPR_STATE: "jumpR",
        JUMPL_STATE: "jumpL",
        MIDAIR_STATE: "midair",
        FALL_STATE: "fall"
    };

    var state = IDLE_STATE;

    var initialized = false;

    /*---------*/
    /* METHODS */
    /*---------*/

    var spriteSheet = new createjs.SpriteSheet({
        framerate: 10,
        "images": [resources.getImage(resources.LICH_ANIMATION_KEY)],
        "frames": {
            "regX": 0,
            "height": HEIGHT,
            "count": 28,
            "regY": 0,
            "width": WIDTH
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
    });
    this.sprite = new createjs.Sprite(spriteSheet, "idle");

    this.shift = function (shift) {
        if (initialized) {
        }
    };

    this.handleTick = function (delta) {};

    var performState = function (desiredState) {
        if (state !== desiredState) {
            self.sprite.gotoAndPlay(stateAnimation[desiredState]);
            state = desiredState;
        }
    };

    this.walkL = function () {
        performState(WALKL_STATE);
    };

    this.walkR = function () {
        performState(WALKR_STATE);
    };

    this.idle = function () {
        performState(IDLE_STATE);
    };

    this.jump = function () {
        performState(JUMP_STATE);
    };

    this.jumpR = function () {
        performState(JUMPR_STATE);
    };

    this.jumpL = function () {
        performState(JUMPL_STATE);
    };

    this.midair = function () {
        performState(MIDAIR_STATE);
    };

    this.fall = function () {
        performState(FALL_STATE);
    };

    this.updateAnimations = function () {
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
    };

};