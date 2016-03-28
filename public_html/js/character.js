/*global createjs*/
/*global resources*/

var lich = lich || {};

lich.Character = function (width, height, spriteSheet, initState, stateAnimation) {
    createjs.Sprite.call(this, spriteSheet, initState);

    var self = this;

    this.width = width;
    this.height = height;
    this.spriteSheet = spriteSheet;
    this.stateAnimation = stateAnimation;
    
    // aktuální horizontální rychlost
    this.speedx = 0;
    // aktuální vertikální rychlost
    this.speedy = 0;

    this.handleTick = {};

    this.performState = function (desiredState) {
        if (state !== desiredState) {
            self.gotoAndPlay(stateAnimation[desiredState]);
            state = desiredState;
        }
    };

};