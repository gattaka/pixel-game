var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero() {
            var _this = _super.call(this, Hero.OWNER_ID, Lich.AnimationSetKey.LICH_ANIMATION_KEY, Lich.AnimationKey.ANM_HERO_IDLE_KEY, 20, // COLLXOFFSET
            12, // COLLYOFFSET
            300, // HERO_HORIZONTAL_SPEED
            520) || this;
            _this.willRegen = 10;
            _this.healthRegen = 1;
            _this.hitTextColor = "#E30";
            _this.hitTextBorderColor = "#300";
            _this.onHealthChange(_this.currentHealth);
            _this.onWillChange(_this.currentWill);
            return _this;
        }
        Hero.prototype.onHealthChange = function (difference) {
            Lich.EventBus.getInstance().fireEvent(new Lich.HealthChangeEventPayload(this.maxHealth, this.currentHealth));
        };
        ;
        Hero.prototype.onWillChange = function (difference) {
            Lich.EventBus.getInstance().fireEvent(new Lich.WillChangeEventPayload(this.maxWill, this.currentWill));
        };
        ;
        Hero.prototype.hitSound = function () {
            switch (Math.floor(Math.random() * 4)) {
                case 0:
                    Lich.Mixer.playSound(Lich.SoundKey.SND_PUNCH_1_KEY);
                    break;
                case 1:
                    Lich.Mixer.playSound(Lich.SoundKey.SND_PUNCH_2_KEY);
                    break;
                case 2:
                    Lich.Mixer.playSound(Lich.SoundKey.SND_PUNCH_3_KEY);
                    break;
                case 3:
                    Lich.Mixer.playSound(Lich.SoundKey.SND_PUNCH_4_KEY);
                    break;
            }
        };
        Hero.prototype.performAnimation = function (desiredAnimation) {
            var self = this;
            var stringKey = Lich.AnimationKey[desiredAnimation];
            if (self.getCurrentAnimation() !== stringKey && (this.currentHealth > 0 || stringKey == Lich.AnimationKey[Lich.AnimationKey.ANM_HERO_DIE_KEY])
                && self.getCurrentSubAnimation() != Lich.AnimationKey[Lich.AnimationKey.ANM_HERO_TELEPORT_KEY]) {
                self.gotoAndPlay(stringKey);
            }
        };
        Hero.prototype.die = function (world) {
            _super.prototype.die.call(this, world);
            Lich.Mixer.playSound(Lich.SoundKey.SND_SQUASHED_KEY);
            world.showDeadInfo();
        };
        Hero.prototype.walkL = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_WALKL_KEY); };
        ;
        Hero.prototype.walkR = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_WALKR_KEY); };
        ;
        Hero.prototype.idle = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_IDLE_KEY); };
        ;
        Hero.prototype.climb = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_CLIMB_KEY); };
        ;
        Hero.prototype.jump = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_JUMP_KEY); };
        ;
        Hero.prototype.jumpR = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_JUMPR_KEY); };
        ;
        Hero.prototype.jumpL = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_JUMPL_KEY); };
        ;
        Hero.prototype.midair = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_MIDAIR_KEY); };
        ;
        Hero.prototype.fall = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_FALL_KEY); };
        ;
        Hero.prototype.death = function () { this.performAnimation(Lich.AnimationKey.ANM_HERO_DIE_KEY); };
        ;
        return Hero;
    }(Lich.Character));
    /*-----------*/
    /* CONSTANTS */
    /*-----------*/
    Hero.OWNER_ID = "HERO";
    Lich.Hero = Hero;
})(Lich || (Lich = {}));
