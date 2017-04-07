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
        var Hellhound = (function (_super) {
            __extends(Hellhound, _super);
            function Hellhound() {
                return _super.call(this, Hellhound.OWNER_ID, Lich.AnimationSetKey.HELLHOUND_ANIMATION_KEY, Lich.AnimationKey.ANM_HELLHOUND_IDLE_KEY, 10, // DAMAGE
                1000, // ATTACK_COOLDOWN
                16, // COLLXOFFSET
                12, // COLLYOFFSET
                600, // HERO_HORIZONTAL_SPEED
                500, // HERO_VERTICAL_SPEED
                true, // unspawns
                0, // min depth 
                50 // max depth
                ) || this;
            }
            Hellhound.prototype.walkL = function () { this.performAnimation(Lich.AnimationKey.ANM_HELLHOUND_WALKL_KEY); };
            ;
            Hellhound.prototype.walkR = function () { this.performAnimation(Lich.AnimationKey.ANM_HELLHOUND_WALKR_KEY); };
            ;
            Hellhound.prototype.idle = function () { this.performAnimation(Lich.AnimationKey.ANM_HELLHOUND_IDLE_KEY); };
            ;
            Hellhound.prototype.climb = function () { };
            ;
            Hellhound.prototype.jump = function () { };
            ;
            Hellhound.prototype.jumpR = function () { this.performAnimation(Lich.AnimationKey.ANM_HELLHOUND_JUMPR_KEY); };
            ;
            Hellhound.prototype.jumpL = function () { this.performAnimation(Lich.AnimationKey.ANM_HELLHOUND_JUMPL_KEY); };
            ;
            Hellhound.prototype.midair = function () { };
            ;
            Hellhound.prototype.fall = function () { };
            ;
            Hellhound.prototype.death = function () { };
            ;
            Hellhound.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                this.dropLoot(world, Lich.InventoryKey.INV_BONES_KEY);
                world.fadeEnemy(this);
            };
            Hellhound.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            return Hellhound;
        }(Lich.AbstractEnemy));
        Hellhound.OWNER_ID = "HELLHOUND";
        Enemy.Hellhound = Hellhound;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
