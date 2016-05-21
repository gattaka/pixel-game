var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(width, height, spriteSheet, initState, stateAnimation) {
            _super.call(this, spriteSheet, initState);
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.stateAnimation = stateAnimation;
            // aktuální horizontální rychlost
            this.speedx = 0;
            // aktuální vertikální rychlost
            this.speedy = 0;
        }
        Character.prototype.handleTick = function () { };
        ;
        Character.prototype.performState = function (desiredState) {
            if (this.state !== desiredState) {
                this.gotoAndPlay(this.stateAnimation[desiredState]);
                this.state = desiredState;
            }
        };
        return Character;
    }(createjs.Sprite));
    Lich.Character = Character;
})(Lich || (Lich = {}));
