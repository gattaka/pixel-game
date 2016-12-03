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
                _super.call(this, 5, // DAMAGE
                1000, // ATTACK_COOLDOWN
                56, // WIDTH
                80, // HEIGHT 
                14, // COLLXOFFSET
                12, // COLLYOFFSET
                Lich.AnimationKey.CORPSE_ANIMATION_KEY, Redskull.IDLE, 40, // frames
                200, // Redskull_HORIZONTAL_SPEED
                500, // Redskull_VERTICAL_SPEED
                new Lich.Animations()
                    .add(Redskull.IDLE, 0, 0, Redskull.BREATH, 0.005)
                    .add(Redskull.BREATH, 1, 1, Redskull.IDLE, 0.04)
                    .add(Redskull.WALKR, 2, 9, Redskull.WALKR, 0.3)
                    .add(Redskull.WALKL, 10, 17, Redskull.WALKL, 0.3)
                    .add(Redskull.JUMP, 18, 19, Redskull.MIDAIR, 0.2)
                    .add(Redskull.MIDAIR, 19, 19, Redskull.MIDAIR, 0.2)
                    .add(Redskull.FALL, 19, 23, Redskull.IDLE, 0.2)
                    .add(Redskull.JUMPR, 25, 25, Redskull.JUMPR, 0.2)
                    .add(Redskull.JUMPL, 27, 27, Redskull.JUMPL, 0.2)
                    .add(Redskull.DIE, 28, 28, Redskull.DEAD, 0.2)
                    .add(Redskull.DEAD, 29, 29, Redskull.DEAD, 0.2)
                    .add(Redskull.TELEPORT, 30, 36, Redskull.IDLE, 1.0)
                    .add(Redskull.CLIMB, 37, 39, Redskull.CLIMB, 0.3), true, // unspawns
                0, // min depth 
                50 // max depth
                );
            }
            Redskull.prototype.walkL = function () { this.performState(Redskull.WALKL); };
            ;
            Redskull.prototype.walkR = function () { this.performState(Redskull.WALKR); };
            ;
            Redskull.prototype.idle = function () { this.performState(Redskull.IDLE); };
            ;
            Redskull.prototype.climb = function () { this.performState(Redskull.CLIMB); };
            ;
            Redskull.prototype.jump = function () { this.performState(Redskull.JUMP); };
            ;
            Redskull.prototype.jumpR = function () { this.performState(Redskull.JUMPR); };
            ;
            Redskull.prototype.jumpL = function () { this.performState(Redskull.JUMPL); };
            ;
            Redskull.prototype.midair = function () { this.performState(Redskull.MIDAIR); };
            ;
            Redskull.prototype.fall = function () { this.performState(Redskull.FALL); };
            ;
            Redskull.prototype.death = function () { this.performState(Redskull.DIE); };
            ;
            Redskull.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_BONES_KEY, 5), this.x, this.y, false);
                world.fadeEnemy(this);
            };
            Redskull.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            Redskull.IDLE = "IDLE";
            Redskull.BREATH = "BREATH";
            Redskull.WALKR = "WALKR";
            Redskull.WALKL = "WALKL";
            Redskull.JUMP = "JUMP";
            Redskull.MIDAIR = "MIDAIR";
            Redskull.FALL = "FALL";
            Redskull.JUMPR = "JUMPR";
            Redskull.JUMPL = "JUMPL";
            Redskull.DIE = "DIE";
            Redskull.DEAD = "DEAD";
            Redskull.TELEPORT = "TELEPORT";
            Redskull.CLIMB = "CLIMB";
            return Redskull;
        }(Lich.AbstractEnemy));
        Enemy.Redskull = Redskull;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
