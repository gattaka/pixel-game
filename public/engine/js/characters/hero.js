var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero() {
            _super.call(this, 56, // WIDTH
            80, // HEIGHT 
            18, // COLLXOFFSET
            12, // COLLYOFFSET
            // 0,
            // 0,
            Lich.AnimationKey.LICH_ANIMATION_KEY, Hero.IDLE, 40, // frames
            300, // HERO_HORIZONTAL_SPEED
            520, // HERO_VERTICAL_SPEED
            new Lich.Animations()
                .add(Hero.IDLE, 0, 0, Hero.BREATH, 0.005)
                .add(Hero.BREATH, 1, 1, Hero.IDLE, 0.04)
                .add(Hero.WALKR, 2, 9, Hero.WALKR, 0.3)
                .add(Hero.WALKL, 10, 17, Hero.WALKL, 0.3)
                .add(Hero.JUMP, 18, 19, Hero.MIDAIR, 0.2)
                .add(Hero.MIDAIR, 19, 19, Hero.MIDAIR, 0.2)
                .add(Hero.FALL, 19, 23, Hero.IDLE, 0.2)
                .add(Hero.JUMPR, 25, 25, Hero.JUMPR, 0.2)
                .add(Hero.JUMPL, 27, 27, Hero.JUMPL, 0.2)
                .add(Hero.DIE, 28, 28, Hero.DEAD, 0.2)
                .add(Hero.DEAD, 29, 29, Hero.DEAD, 0.2)
                .add(Hero.TELEPORT, 30, 36, Hero.IDLE, 1.0)
                .add(Hero.CLIMB, 37, 39, Hero.CLIMB, 0.3));
            this.willRegen = 10;
            this.healthRegen = 1;
            this.onHealthChange(this.currentHealth);
            this.onWillChange(this.currentWill);
        }
        Hero.prototype.onHealthChange = function (difference) {
            Lich.EventBus.getInstance().fireEvent(new Lich.HealthChangeEventPayload(this.maxHealth, this.currentHealth));
        };
        ;
        Hero.prototype.onWillChange = function (difference) {
            Lich.EventBus.getInstance().fireEvent(new Lich.WillChangeEventPayload(this.maxWill, this.currentWill));
        };
        ;
        Hero.prototype.hit = function (damage, world) {
            if (this.currentHealth > 0 && damage > 0) {
                world.fadeText("-" + damage, this.x + this.width * Math.random(), this.y, 25, "#E30", "#300");
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
            }
            _super.prototype.hit.call(this, damage, world);
            return damage;
        };
        Hero.prototype.performState = function (desiredState) {
            var self = this;
            if (self.state !== desiredState && (this.currentHealth > 0 || desiredState == Hero.DIE)
                && self.currentAnimation != Hero.TELEPORT) {
                self.gotoAndPlay(desiredState);
                self.state = desiredState;
            }
        };
        Hero.prototype.die = function (world) {
            _super.prototype.die.call(this, world);
            Lich.Mixer.playSound(Lich.SoundKey.SND_SQUASHED_KEY);
            world.showDeadInfo();
        };
        Hero.prototype.walkL = function () { this.performState(Hero.WALKL); };
        ;
        Hero.prototype.walkR = function () { this.performState(Hero.WALKR); };
        ;
        Hero.prototype.idle = function () { this.performState(Hero.IDLE); };
        ;
        Hero.prototype.climb = function () { this.performState(Hero.CLIMB); };
        ;
        Hero.prototype.jump = function () { this.performState(Hero.JUMP); };
        ;
        Hero.prototype.jumpR = function () { this.performState(Hero.JUMPR); };
        ;
        Hero.prototype.jumpL = function () { this.performState(Hero.JUMPL); };
        ;
        Hero.prototype.midair = function () { this.performState(Hero.MIDAIR); };
        ;
        Hero.prototype.fall = function () { this.performState(Hero.FALL); };
        ;
        Hero.prototype.death = function () { this.performState(Hero.DIE); };
        ;
        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        Hero.OWNER_HERO_TAG = "OWNER_HERO_TAG";
        Hero.IDLE = "IDLE";
        Hero.BREATH = "BREATH";
        Hero.WALKR = "WALKR";
        Hero.WALKL = "WALKL";
        Hero.JUMP = "JUMP";
        Hero.MIDAIR = "MIDAIR";
        Hero.FALL = "FALL";
        Hero.JUMPR = "JUMPR";
        Hero.JUMPL = "JUMPL";
        Hero.DIE = "DIE";
        Hero.DEAD = "DEAD";
        Hero.TELEPORT = "TELEPORT";
        Hero.CLIMB = "CLIMB";
        return Hero;
    }(Lich.Character));
    Lich.Hero = Hero;
})(Lich || (Lich = {}));
