var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Hellhound = (function (_super) {
            __extends(Hellhound, _super);
            function Hellhound() {
                _super.call(this, 10, // DAMAGE
                1000, // ATTACK_COOLDOWN
                128, // WIDTH
                86, // HEIGHT 
                16, // COLLXOFFSET
                12, // COLLYOFFSET
                Lich.AnimationKey.HELLHOUND_ANIMATION_KEY, Lich.CharacterState.IDLE, 25, // frames
                Lich.MovementType.WALK, 600, // HERO_HORIZONTAL_SPEED
                500, // HERO_VERTICAL_SPEED
                new Lich.Animations()
                    .add(Lich.CharacterState.IDLE, 22, 24, Lich.CharacterState.IDLE, 0.1)
                    .add(Lich.CharacterState.WALKR, 5, 9, Lich.CharacterState.WALKR, 0.2)
                    .add(Lich.CharacterState.WALKL, 0, 4, Lich.CharacterState.WALKL, 0.2)
                    .add(Lich.CharacterState.JUMPR, 16, 21, Lich.CharacterState.WALKR, 0.2)
                    .add(Lich.CharacterState.JUMPL, 10, 15, Lich.CharacterState.WALKL, 0.2));
            }
            Hellhound.prototype.jump = function () {
                this.performState(Lich.CharacterState.JUMPL);
            };
            Hellhound.prototype.midair = function () {
                this.performState(Lich.CharacterState.JUMPL);
            };
            Hellhound.prototype.fall = function () {
                this.performState(Lich.CharacterState.JUMPL);
            };
            Hellhound.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_BONES_KEY, 5), this.x, this.y, false);
                world.fadeEnemy(this);
            };
            Hellhound.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONECRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            return Hellhound;
        }(Lich.AbstractEnemy));
        Enemy.Hellhound = Hellhound;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
