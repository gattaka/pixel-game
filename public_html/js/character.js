var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character() {
            _super.apply(this, arguments);
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.life = 100;
            this.spellCooldowns = new Array();
            this.initialized = false;
        }
        Character.prototype.shift = function (shift) {
            var self = this;
            if (self.initialized) {
            }
        };
        Character.prototype.performState = function (desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(self.getStateAnimation(desiredState));
                self.state = desiredState;
            }
        };
        Character.prototype.updateAnimations = function () {
            var self = this;
            if (self.speedx === 0 && self.speedy === 0) {
                self.idle();
            }
            else if (self.speedy !== 0) {
                if (self.speedx === 0) {
                    self.jump();
                }
                else if (self.speedx > 0) {
                    self.jumpL();
                }
                else {
                    self.jumpR();
                }
            }
            else {
                if (self.speedx > 0) {
                    self.walkL();
                }
                if (self.speedx < 0) {
                    self.walkR();
                }
            }
        };
        return Character;
    }(Lich.AbstractWorldObject));
    Lich.Character = Character;
})(Lich || (Lich = {}));
