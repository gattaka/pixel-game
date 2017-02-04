var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Valentimon = (function (_super) {
            __extends(Valentimon, _super);
            function Valentimon() {
                _super.call(this, Valentimon.OWNER_ID, 10, // DAMAGE
                1000, // ATTACK_COOLDOWN
                64, // WIDTH
                64, // HEIGHT 
                6, // COLLXOFFSET
                9, // COLLYOFFSET
                Lich.AnimationKey.VALENTIMON_ANIMATION_KEY, Valentimon.IDLE, 9, // frames
                200, // HORIZONTAL_SPEED
                200, // VERTICAL_SPEED
                new Lich.Animations()
                    .add(Valentimon.IDLE, 0, 3, Valentimon.IDLE, 0.1)
                    .add(Valentimon.ATTACK, 3, 5, Valentimon.IDLE, 0.3)
                    .add(Valentimon.DIE, 4, 8, Valentimon.DEAD, 0.2)
                    .add(Valentimon.DEAD, 8, 8, Valentimon.DEAD, 1), true, // unspawns
                0, // min depth 
                100, // max depth
                true // hovers
                );
                this.maxHealth = this.currentHealth = 200;
                // stále jsem v hover pohybu
                this.movementTypeX = Lich.MovementTypeX.HOVER;
                this.movementTypeY = Lich.MovementTypeY.HOVER;
            }
            Valentimon.prototype.runAI = function (world, delta) {
                var _this = this;
                var hero = world.hero;
                var heroTargetX = world.hero.x + world.hero.width / 2;
                var heroTargetY = world.hero.y + world.hero.height / 2;
                if (this.getCurrentHealth() > 0) {
                    if (this.currentAttackCooldown >= this.attackCooldown) {
                        if (this.isPlayerInReach(world)) {
                            world.hero.hit(this.damage, world);
                            this.performState(Valentimon.ATTACK);
                            this.currentAttackCooldown = 0;
                        }
                        else {
                            var spell = Lich.Resources.getInstance().spellDefs.byKey(Lich.SpellKey[Lich.SpellKey.SPELL_LOVELETTER]);
                            var context = new Lich.SpellContext(Valentimon.OWNER_ID, this.x + this.width / 2, this.y + this.height / 2, heroTargetX, heroTargetY, world.game);
                            spell.cast(context);
                            this.performState(Valentimon.ATTACK);
                            this.currentAttackCooldown = 0;
                        }
                    }
                    else {
                        this.currentAttackCooldown += delta;
                        var processSpeed = function () {
                            // snaž se dosáhnout místo středem
                            var targetX = heroTargetX - _this.width / 2;
                            var targetY = heroTargetY - _this.height / 2;
                            // nastav rychlost dle vzdálenosti
                            var b = targetX - _this.x;
                            var a = targetY - _this.y;
                            var c = Math.sqrt(a * a + b * b);
                            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
                            // přepony dle rychlosti projektilu
                            if (c == 0)
                                c = 1;
                            _this.speedx = -_this.accelerationX * b / c;
                            _this.speedy = -_this.accelerationY * a / c;
                        };
                        processSpeed();
                    }
                }
            };
            Valentimon.prototype.walkL = function () { };
            ;
            Valentimon.prototype.walkR = function () { };
            ;
            Valentimon.prototype.idle = function () { };
            ;
            Valentimon.prototype.climb = function () { };
            ;
            Valentimon.prototype.jump = function () { };
            ;
            Valentimon.prototype.jumpR = function () { };
            ;
            Valentimon.prototype.jumpL = function () { };
            ;
            Valentimon.prototype.midair = function () { };
            ;
            Valentimon.prototype.fall = function () { };
            ;
            Valentimon.prototype.death = function () { this.performState(Valentimon.DIE); };
            ;
            Valentimon.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                this.dropLoot(world, Lich.InventoryKey.INV_LOVEARROW_KEY);
                world.fadeEnemy(this);
            };
            Valentimon.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            /**
             * aka Love Hurts
             */
            Valentimon.OWNER_ID = "VALENTIMON";
            Valentimon.IDLE = "IDLE";
            Valentimon.ATTACK = "ATTACK";
            Valentimon.DIE = "DIE";
            Valentimon.DEAD = "DEAD";
            return Valentimon;
        }(Lich.AbstractEnemy));
        Enemy.Valentimon = Valentimon;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
