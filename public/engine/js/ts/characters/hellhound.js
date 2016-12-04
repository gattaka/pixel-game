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
                Lich.AnimationKey.HELLHOUND_ANIMATION_KEY, Hellhound.IDLE, 25, // frames
                600, // HERO_HORIZONTAL_SPEED
                500, // HERO_VERTICAL_SPEED
                new Lich.Animations()
                    .add(Hellhound.IDLE, 22, 24, Hellhound.IDLE, 0.1)
                    .add(Hellhound.WALKR, 5, 9, Hellhound.WALKR, 0.2)
                    .add(Hellhound.WALKL, 0, 4, Hellhound.WALKL, 0.2)
                    .add(Hellhound.JUMPR, 16, 21, Hellhound.WALKR, 0.2)
                    .add(Hellhound.JUMPL, 10, 15, Hellhound.WALKL, 0.2), true, // unspawns
                0, // min depth 
                50 // max depth
                );
            }
            Hellhound.prototype.walkL = function () { this.performState(Hellhound.WALKL); };
            ;
            Hellhound.prototype.walkR = function () { this.performState(Hellhound.WALKR); };
            ;
            Hellhound.prototype.idle = function () { this.performState(Hellhound.IDLE); };
            ;
            Hellhound.prototype.climb = function () { };
            ;
            Hellhound.prototype.jump = function () { };
            ;
            Hellhound.prototype.jumpR = function () { this.performState(Hellhound.JUMPR); };
            ;
            Hellhound.prototype.jumpL = function () { this.performState(Hellhound.JUMPL); };
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
                world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_BONES_KEY, 5), this.x, this.y, false);
                world.fadeEnemy(this);
            };
            Hellhound.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            Hellhound.IDLE = "IDLE";
            Hellhound.WALKR = "WALKR";
            Hellhound.WALKL = "WALKL";
            Hellhound.JUMPR = "JUMPR";
            Hellhound.JUMPL = "JUMPL";
            return Hellhound;
        }(Lich.AbstractEnemy));
        Enemy.Hellhound = Hellhound;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
