var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Redskull = (function (_super) {
            __extends(Redskull, _super);
            function Redskull() {
                _super.call(this, 200, // HORIZONTAL_SPEED
                500, // VERTICAL_SPEED
                5, // DAMAGE
                1000, // ATTACK_COOLDOWN
                56, // WIDTH
                80, // HEIGHT 
                14, // COLLXOFFSET
                10, // COLLYOFFSET
                Lich.AnimationKey.CORPSE_ANIMATION_KEY, Lich.CharacterState.IDLE, 30, // frames
                new Lich.Animations()
                    .add(Lich.CharacterState.IDLE, 0, 0, Lich.CharacterState.BREATH, 0.005)
                    .add(Lich.CharacterState.BREATH, 1, 1, Lich.CharacterState.IDLE, 0.04)
                    .add(Lich.CharacterState.WALKR, 2, 9, Lich.CharacterState.WALKR, 0.2)
                    .add(Lich.CharacterState.WALKL, 10, 17, Lich.CharacterState.WALKL, 0.2)
                    .add(Lich.CharacterState.JUMP, 18, 19, Lich.CharacterState.MIDAIR, 0.2)
                    .add(Lich.CharacterState.MIDAIR, 19, 19, Lich.CharacterState.MIDAIR, 0.2)
                    .add(Lich.CharacterState.FALL, 19, 23, Lich.CharacterState.IDLE, 0.2)
                    .add(Lich.CharacterState.JUMPR, 25, 25, Lich.CharacterState.JUMPR, 0.2)
                    .add(Lich.CharacterState.JUMPL, 27, 27, Lich.CharacterState.JUMPL, 0.2)
                    .add(Lich.CharacterState.DIE, 28, 28, Lich.CharacterState.DEAD, 0.2)
                    .add(Lich.CharacterState.DEAD, 29, 29, Lich.CharacterState.DEAD, 0.2));
            }
            Redskull.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_BONES_KEY, 5), this.x, this.y, false);
            };
            Redskull.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONECRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
            };
            return Redskull;
        }(Lich.AbstractEnemy));
        Enemy.Redskull = Redskull;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
