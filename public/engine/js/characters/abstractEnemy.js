var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractEnemy = (function (_super) {
        __extends(AbstractEnemy, _super);
        function AbstractEnemy(damage, attackCooldown, width, height, collXOffset, collYOffset, animationKey, initState, frames, accelerationX, accelerationY, animations) {
            _super.call(this, width, height, collXOffset, collYOffset, animationKey, initState, frames, accelerationX, accelerationY, animations);
            this.damage = damage;
            this.attackCooldown = attackCooldown;
            this.currentAttackCooldown = 0;
        }
        AbstractEnemy.prototype.runAI = function (world, delta) {
            var _this = this;
            if (this.getCurrentHealth() > 0) {
                if (this.currentAttackCooldown < this.attackCooldown)
                    this.currentAttackCooldown += delta;
                var reach = false;
                if (this.x > world.hero.x && this.x < world.hero.x + world.hero.width - world.hero.collXOffset) {
                    this.movementTypeX = Lich.MovementTypeX.NONE;
                    // zásah hráče?
                    var heroHead = world.hero.y + world.hero.collYOffset;
                    var heroFeet = world.hero.y + world.hero.height - world.hero.collYOffset;
                    var enemyHead = this.y;
                    var enemyFeet = this.y + this.height;
                    if (enemyHead >= heroHead && enemyHead < heroFeet || enemyFeet >= heroHead && enemyFeet < heroFeet
                        || heroHead >= enemyHead && heroHead < enemyFeet || heroFeet >= enemyHead && heroFeet < enemyFeet) {
                        if (this.currentAttackCooldown > this.attackCooldown) {
                            this.currentAttackCooldown = 0;
                            world.hero.hit(this.damage, world);
                            reach = true;
                        }
                    }
                }
                if (!reach) {
                    var verticalStrategy = function (nextX) {
                        if ((world.hero.y + world.hero.height) > (_this.y + _this.height)) {
                            // pokud je hráč níž než já (vzdálenost je obrácená)
                            if (nextX != 0 && world.isCollision(nextX, _this.y + _this.height - Lich.Resources.TILE_SIZE).hit) {
                                // pokud je přede mnou překážka a hráč už není přímo podemnou, přeskoč     
                                _this.movementTypeY = Lich.MovementTypeY.JUMP_OR_CLIMB;
                            }
                            else {
                                // jinak padej
                                _this.movementTypeY = Lich.MovementTypeY.DESCENT;
                            }
                        }
                        else {
                            // hráč je výš nebo stejně jako já
                            if (nextX != 0 && (world.isCollision(nextX, _this.y + _this.height + Lich.Resources.TILE_SIZE).hit == false
                                || world.isCollision(nextX, _this.y + _this.height - Lich.Resources.TILE_SIZE).hit)) {
                                // pokud bych spadl nebo je přede mnou překážka a hráč už 
                                // není přímo podemnou, přeskoč, zkus vyskočit
                                _this.movementTypeY = Lich.MovementTypeY.JUMP_OR_CLIMB;
                            }
                            else {
                                // nepadám, nemám překážky
                                if ((world.hero.y + world.hero.height) == (_this.y + _this.height)) {
                                    // hráč je stejně jako já, nic nedělej
                                    _this.movementTypeY = Lich.MovementTypeY.NONE;
                                }
                                else {
                                    // hráč je výš než já, skákej
                                    _this.movementTypeY = Lich.MovementTypeY.JUMP_OR_CLIMB;
                                }
                            }
                        }
                    };
                    var nextX = 0;
                    var xJitter = Math.random() * Lich.Resources.TILE_SIZE * 2;
                    if (world.hero.x > this.x + this.width / 2 - xJitter) {
                        // hráč je vpravo od nepřítele - jdi doprava           
                        this.movementTypeX = Lich.MovementTypeX.WALK_RIGHT;
                        nextX = this.x + this.width - this.collXOffset + Lich.Resources.TILE_SIZE;
                    }
                    else if (world.hero.x + world.hero.width < this.x + this.width / 2 + xJitter) {
                        // hráč je vlevo od nepřítele - jdi doleva
                        this.movementTypeX = Lich.MovementTypeX.WALK_LEFT;
                        nextX = this.x + this.collXOffset - Lich.Resources.TILE_SIZE;
                    }
                    else {
                    }
                    verticalStrategy(nextX);
                }
            }
        };
        return AbstractEnemy;
    }(Lich.Character));
    Lich.AbstractEnemy = AbstractEnemy;
})(Lich || (Lich = {}));
