var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractEnemy = (function (_super) {
        __extends(AbstractEnemy, _super);
        function AbstractEnemy(ownerId, damage, attackCooldown, width, height, collXOffset, collYOffset, animationKey, initState, frames, accelerationX, accelerationY, animations, 
            // může se nepřítel sám unspawnout (když je moc daleko od hráče)
            unspawns, minDepth, maxDepth, hovers) {
            if (hovers === void 0) { hovers = false; }
            _super.call(this, ownerId, width, height, collXOffset, collYOffset, animationKey, initState, frames, accelerationX, accelerationY, animations, hovers);
            this.damage = damage;
            this.attackCooldown = attackCooldown;
            this.unspawns = unspawns;
            this.minDepth = minDepth;
            this.maxDepth = maxDepth;
            this.currentAttackCooldown = 0;
        }
        AbstractEnemy.prototype.isPlayerInReach = function (world) {
            // enemy
            var ex1 = this.x + this.collXOffset;
            var ex2 = this.x + this.width - this.collXOffset;
            var ey1 = this.y + this.collYOffset;
            var ey2 = this.y + this.height - this.collYOffset;
            // player
            var hero = world.hero;
            var px1 = hero.x + hero.collXOffset;
            var px2 = hero.x + hero.width - hero.collXOffset;
            var py1 = hero.y + hero.collYOffset;
            var py2 = hero.y + hero.height - hero.collYOffset;
            // hráč a nepřítel jsou zaklesnuti v x a y 
            if ((ex1 >= px1 && ex1 <= px2 || ex2 >= px1 && ex2 <= px2 || px1 >= ex1 && px1 <= ex2 || px2 >= ex1 && px2 <= ex2)
                && (ey1 >= py1 && ey1 <= py2 || ey2 >= py1 && ey2 <= py2 || py1 >= ey1 && py1 <= ey2 || py2 >= ey1 && py2 <= ey2)) {
                // zásah hráče?
                var heroHead = world.hero.y + world.hero.collYOffset;
                var heroFeet = world.hero.y + world.hero.height - world.hero.collYOffset;
                var enemyHead = this.y;
                var enemyFeet = this.y + this.height;
                if (enemyHead >= heroHead && enemyHead < heroFeet || enemyFeet >= heroHead && enemyFeet < heroFeet
                    || heroHead >= enemyHead && heroHead < enemyFeet || heroFeet >= enemyHead && heroFeet < enemyFeet) {
                    return true;
                }
            }
            return false;
        };
        AbstractEnemy.prototype.dropLoot = function (world, invKey, quant, batch) {
            if (quant === void 0) { quant = 1; }
            if (batch === void 0) { batch = 1; }
            for (var i = 0; i < quant; i++) {
                var xjitter = 10 - Math.random() * 20;
                var yjitter = 10 - Math.random() * 20;
                world.spawnObject(new Lich.DugObjDefinition(invKey, batch), this.x + xjitter, this.y + yjitter, false);
            }
        };
        AbstractEnemy.prototype.runAI = function (world, delta) {
            var _this = this;
            if (this.getCurrentHealth() > 0) {
                if (this.currentAttackCooldown < this.attackCooldown)
                    this.currentAttackCooldown += delta;
                if (this.isPlayerInReach(world)) {
                    this.movementTypeX = Lich.MovementTypeX.NONE;
                    if (this.currentAttackCooldown >= this.attackCooldown) {
                        this.currentAttackCooldown = 0;
                        world.hero.hit(this.damage, world);
                    }
                }
                else {
                    var verticalStrategy = function (nextX) {
                        if ((world.hero.y + world.hero.height) > (_this.y + _this.height)) {
                            // pokud je hráč níž než já (vzdálenost je obrácená)
                            var col = world.isCollision(nextX, _this.y + _this.height - Lich.Resources.TILE_SIZE);
                            if (nextX != 0 && col.hit && col.collisionType != Lich.CollisionType.LADDER && col.collisionType != Lich.CollisionType.PLATFORM) {
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
                        if (Math.random() * 10 > 8) {
                            _this.movementTypeY = Lich.MovementTypeY.NONE;
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
