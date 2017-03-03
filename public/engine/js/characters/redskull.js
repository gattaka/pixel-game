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
    var Enemy;
    (function (Enemy) {
        var Redskull = (function (_super) {
            __extends(Redskull, _super);
            function Redskull() {
                return _super.call(this, Redskull.OWNER_ID, Lich.AnimationSetKey.CORPSE_ANIMATION_KEY, Lich.AnimationKey.ANM_REDSKULL_IDLE_KEY, 5, // DAMAGE
                1000, // ATTACK_COOLDOWN
                14, // COLLXOFFSET
                12, // COLLYOFFSET
                200, // Redskull_HORIZONTAL_SPEED
                500, // Redskull_VERTICAL_SPEED
                true, // unspawns
                0, // min depth 
                50 // max depth
                ) || this;
            }
            Redskull.prototype.walkL = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_WALKL_KEY); };
            ;
            Redskull.prototype.walkR = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_WALKR_KEY); };
            ;
            Redskull.prototype.idle = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_IDLE_KEY); };
            ;
            Redskull.prototype.climb = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_CLIMB_KEY); };
            ;
            Redskull.prototype.jump = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_JUMP_KEY); };
            ;
            Redskull.prototype.jumpR = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_JUMPR_KEY); };
            ;
            Redskull.prototype.jumpL = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_JUMPL_KEY); };
            ;
            Redskull.prototype.midair = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_MIDAIR_KEY); };
            ;
            Redskull.prototype.fall = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_FALL_KEY); };
            ;
            Redskull.prototype.death = function () { this.performAnimation(Lich.AnimationKey.ANM_REDSKULL_DIE_KEY); };
            ;
            Redskull.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                this.dropLoot(world, Lich.InventoryKey.INV_BONES_KEY);
                world.fadeEnemy(this);
            };
            Redskull.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            return Redskull;
        }(Lich.AbstractEnemy));
        Redskull.OWNER_ID = "REDSKULL";
        Enemy.Redskull = Redskull;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
