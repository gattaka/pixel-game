var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Chicken = (function (_super) {
            __extends(Chicken, _super);
            function Chicken() {
                _super.call(this, 0, // DAMAGE
                0, // ATTACK_COOLDOWN
                26, // WIDTH
                26, // HEIGHT 
                2, // COLLXOFFSET
                2, // COLLYOFFSET
                Lich.AnimationKey.CHICKEN_ANIMATION_KEY, Lich.CharacterState.IDLE, 14, // frames
                100, // HORIZONTAL_SPEED
                20, // VERTICAL_SPEED
                new Lich.Animations()
                    .add(Lich.CharacterState.IDLE, 2, 2, Lich.CharacterState.IDLE, 0.001)
                    .add(Lich.CharacterState.BREATH, 0, 1, Lich.CharacterState.BREATH, 0.1)
                    .add(Lich.CharacterState.WALKR, 7, 10, Lich.CharacterState.WALKR, 0.2)
                    .add(Lich.CharacterState.WALKL, 3, 6, Lich.CharacterState.WALKL, 0.2)
                    .add(Lich.CharacterState.JUMPR, 10, 10, Lich.CharacterState.WALKR, 0.2)
                    .add(Lich.CharacterState.JUMPL, 3, 3, Lich.CharacterState.WALKL, 0.2));
                this.wanderCooldown = 0;
                this.setNewMaxHealth(50);
            }
            Chicken.prototype.runAI = function (world, delta) {
                this.wanderCooldown -= delta;
                if (this.wanderCooldown <= 0) {
                    this.wanderCooldown = Chicken.WANDER_COOLDOWN;
                    var rnd = Math.floor(Math.random() * 3);
                    if (rnd == 0) {
                        this.performState(Lich.CharacterState.IDLE);
                        this.movementTypeX = Lich.MovementTypeX.NONE;
                        console.log("Chicken stopped");
                    }
                    else if (rnd == 1) {
                        // let w = world.game.getCanvas().width;
                        var direction = Math.random() * 2;
                        if (direction > 1) {
                            this.movementTypeX = Lich.MovementTypeX.WALK_LEFT;
                            console.log("Chicken walk left");
                        }
                        else {
                            this.movementTypeX = Lich.MovementTypeX.WALK_RIGHT;
                            console.log("Chicken walk right");
                        }
                    }
                    else {
                        this.performState(Lich.CharacterState.BREATH);
                        this.movementTypeX = Lich.MovementTypeX.NONE;
                        console.log("Chicken is digging");
                    }
                }
                // TODO jump
            };
            Chicken.prototype.idle = function () {
                // nic
            };
            Chicken.prototype.jump = function () {
                this.performState(Lich.CharacterState.JUMPL);
            };
            Chicken.prototype.midair = function () {
                this.performState(Lich.CharacterState.JUMPL);
            };
            Chicken.prototype.fall = function () {
                this.performState(Lich.CharacterState.JUMPL);
            };
            Chicken.prototype.die = function (world) {
                _super.prototype.die.call(this, world);
                // Mixer.playSound(SoundKey.SND_SKELETON_DIE_KEY);
                world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_BONES_KEY, 5), this.x, this.y, false);
                world.fadeEnemy(this);
            };
            Chicken.prototype.hit = function (damage, world) {
                if (this.currentHealth > 0) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_BONE_CRACK_KEY);
                }
                _super.prototype.hit.call(this, damage, world);
                return damage;
            };
            Chicken.WANDER_COOLDOWN = 3000;
            return Chicken;
        }(Lich.AbstractEnemy));
        Enemy.Chicken = Chicken;
    })(Enemy = Lich.Enemy || (Lich.Enemy = {}));
})(Lich || (Lich = {}));
