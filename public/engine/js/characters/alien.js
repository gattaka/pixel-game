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
        var Alien = (function (_super) {
            __extends(Alien, _super);
            function Alien() {
                return _super.call(this, Alien.OWNER_ID, Lich.AnimationSetKey.ALIEN_ANIMATION_KEY, Lich.AnimationKey.ANM_ALIEN_ATTACKL_KEY, 10, // DAMAGE
                1000, // ATTACK_COOLDOWN
                30, // COLLXOFFSET
                4, // COLLYOFFSET
                400, // HERO_HORIZONTAL_SPEED
                700, // HERO_VERTICAL_SPEED
                true, // unspawns
                0, // min depth 
                100 // max depth
                ) || this;
            }
            Alien.prototype.walkL = function () { this.performAnimation(Lich.AnimationKey.ANM_ALIEN_WALKL_KEY); };
            ;
            Alien.prototype.walkR = function () { this.performAnimation(Lich.AnimationKey.ANM_ALIEN_WALKR_KEY); };
            ;
            Alien.prototype.idle = function () { this.performAnimation(Lich.AnimationKey.ANM_ALIEN_ATTACKL_KEY); };
            ;
            Alien.prototype.climb = function () { };
            ;
            Alien.prototype.jump = function () { };
            ;
            Alien.prototype.jumpR = function () { this.performAnimation(Lich.AnimationKey.ANM_ALIEN_WALKR_KEY); };
            ;
            Alien.prototype.jumpL = function () { this.performAnimation(Lich.AnimationKey.ANM_ALIEN_WALKL_KEY); };
            ;
            Alien.prototype.midair = function () { };
            ;
            Alien.prototype.fall = function () { };
            ;
            Alien.prototype.death = function () { this.performAnimation(Lich.AnimationKey.ANM_ALIEN_DIE_KEY); };
            ;
            Alien.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                this.dropLoot(world, Lich.InventoryKey.INV_BONES_KEY);
                world.fadeEnemy(this);
            };
            Alien.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            return Alien;
        }(Lich.AbstractEnemy));
        Alien.OWNER_ID = "ALIEN";
        Enemy.Alien = Alien;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
