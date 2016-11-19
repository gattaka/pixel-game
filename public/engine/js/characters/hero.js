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
            16, // COLLXOFFSET
            12, // COLLYOFFSET
            Lich.AnimationKey.LICH_ANIMATION_KEY, Lich.CharacterState.IDLE, 40, // frames
            300, // HERO_HORIZONTAL_SPEED
            520, // HERO_VERTICAL_SPEED
            new Lich.Animations()
                .add(Lich.CharacterState.IDLE, 0, 0, Lich.CharacterState.BREATH, 0.005)
                .add(Lich.CharacterState.BREATH, 1, 1, Lich.CharacterState.IDLE, 0.04)
                .add(Lich.CharacterState.WALKR, 2, 9, Lich.CharacterState.WALKR, 0.3)
                .add(Lich.CharacterState.WALKL, 10, 17, Lich.CharacterState.WALKL, 0.3)
                .add(Lich.CharacterState.JUMP, 18, 19, Lich.CharacterState.MIDAIR, 0.2)
                .add(Lich.CharacterState.MIDAIR, 19, 19, Lich.CharacterState.MIDAIR, 0.2)
                .add(Lich.CharacterState.FALL, 19, 23, Lich.CharacterState.IDLE, 0.2)
                .add(Lich.CharacterState.JUMPR, 25, 25, Lich.CharacterState.JUMPR, 0.2)
                .add(Lich.CharacterState.JUMPL, 27, 27, Lich.CharacterState.JUMPL, 0.2)
                .add(Lich.CharacterState.DIE, 28, 28, Lich.CharacterState.DEAD, 0.2)
                .add(Lich.CharacterState.DEAD, 29, 29, Lich.CharacterState.DEAD, 0.2)
                .add(Lich.CharacterState.TELEPORT, 30, 36, Lich.CharacterState.IDLE, 1.0)
                .add(Lich.CharacterState.CLIMB, 37, 39, Lich.CharacterState.CLIMB, 0.3));
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
        Hero.prototype.die = function (world) {
            _super.prototype.die.call(this, world);
            Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRUSH_KEY);
            world.showDeadInfo();
        };
        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        Hero.OWNER_HERO_TAG = "OWNER_HERO_TAG";
        return Hero;
    }(Lich.Character));
    Lich.Hero = Hero;
})(Lich || (Lich = {}));
