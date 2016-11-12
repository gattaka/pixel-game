var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractEnemy = (function (_super) {
        __extends(AbstractEnemy, _super);
        function AbstractEnemy(damage, attackCooldown, width, height, collXOffset, collYOffset, animationKey, initState, frames, type, accelerationX, accelerationY, animations) {
            _super.call(this, width, height, collXOffset, collYOffset, animationKey, initState, frames, type, accelerationX, accelerationY, animations);
            this.damage = damage;
            this.attackCooldown = attackCooldown;
            this.currentAttackCooldown = 0;
        }
        AbstractEnemy.prototype.runAI = function (world, delta) {
            if (this.getCurrentHealth() > 0) {
                if (this.currentAttackCooldown < this.attackCooldown)
                    this.currentAttackCooldown += delta;
                if (this.x > world.hero.x && this.x < world.hero.x + world.hero.width - world.hero.collXOffset) {
                    this.speedx = 0;
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
                        }
                    }
                }
                else {
                    if (world.hero.x > this.x) {
                        // hráč je vpravo od nepřítele - jdi doprava           
                        this.speedx = -this.accelerationX / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            var nextX = this.x + this.width - this.collXOffset + Lich.Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                this.speedy = this.accelerationY;
                            }
                        }
                    }
                    else {
                        // hráč je vlevo od nepřítele - jdi doleva
                        this.speedx = this.accelerationX / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            var nextX = this.x + this.collXOffset - Lich.Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                this.speedy = this.accelerationY;
                            }
                        }
                    }
                }
            }
        };
        return AbstractEnemy;
    }(Lich.Character));
    Lich.AbstractEnemy = AbstractEnemy;
})(Lich || (Lich = {}));
