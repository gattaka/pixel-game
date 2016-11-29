namespace Lich {
    export abstract class AbstractEnemy extends Character {

        protected currentAttackCooldown = 0;

        public id: number;

        constructor(
            protected damage: number,
            protected attackCooldown: number,
            width: number, height: number,
            collXOffset: number, collYOffset: number,
            animationKey: AnimationKey,
            initState: string,
            frames: number,
            accelerationX: number,
            accelerationY: number,
            animations: Animations) {
            super(width, height, collXOffset, collYOffset, animationKey, initState, frames, accelerationX, accelerationY, animations);
        }

        runAI(world: World, delta: number) {
            if (this.getCurrentHealth() > 0) {
                if (this.currentAttackCooldown < this.attackCooldown)
                    this.currentAttackCooldown += delta;
                let reach = false;
                if (this.x > world.hero.x && this.x < world.hero.x + world.hero.width - world.hero.collXOffset) {
                    this.movementTypeX = MovementTypeX.NONE;
                    // zásah hráče?
                    let heroHead = world.hero.y + world.hero.collYOffset;
                    let heroFeet = world.hero.y + world.hero.height - world.hero.collYOffset;
                    let enemyHead = this.y;
                    let enemyFeet = this.y + this.height;
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
                    let verticalStrategy = (nextX: number) => {
                        if ((world.hero.y + world.hero.height) > (this.y + this.height)) {
                            // pokud je hráč níž než já (vzdálenost je obrácená)
                            let col = world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE);
                            if (nextX != 0 && col.hit && col.collisionType != CollisionType.LADDER && col.collisionType != CollisionType.PLATFORM) {
                                // pokud je přede mnou překážka a hráč už není přímo podemnou, přeskoč     
                                this.movementTypeY = MovementTypeY.JUMP_OR_CLIMB;
                            } else {
                                // jinak padej
                                this.movementTypeY = MovementTypeY.DESCENT;
                            }
                        } else {
                            // hráč je výš nebo stejně jako já
                            if (nextX != 0 && (world.isCollision(nextX, this.y + this.height + Resources.TILE_SIZE).hit == false
                                || world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE).hit)) {
                                // pokud bych spadl nebo je přede mnou překážka a hráč už 
                                // není přímo podemnou, přeskoč, zkus vyskočit
                                this.movementTypeY = MovementTypeY.JUMP_OR_CLIMB;
                            } else {
                                // nepadám, nemám překážky
                                if ((world.hero.y + world.hero.height) == (this.y + this.height)) {
                                    // hráč je stejně jako já, nic nedělej
                                    this.movementTypeY = MovementTypeY.NONE;
                                } else {
                                    // hráč je výš než já, skákej
                                    this.movementTypeY = MovementTypeY.JUMP_OR_CLIMB;
                                }
                            }
                        }
                        if (Math.random() * 10 > 8) {
                            this.movementTypeY = MovementTypeY.NONE;
                        }
                    };

                    let nextX = 0;
                    let xJitter = Math.random() * Resources.TILE_SIZE * 2;
                    if (world.hero.x > this.x + this.width / 2 - xJitter) {
                        // hráč je vpravo od nepřítele - jdi doprava           
                        this.movementTypeX = MovementTypeX.WALK_RIGHT;
                        nextX = this.x + this.width - this.collXOffset + Resources.TILE_SIZE;
                    } else if (world.hero.x + world.hero.width < this.x + this.width / 2 + xJitter) {
                        // hráč je vlevo od nepřítele - jdi doleva
                        this.movementTypeX = MovementTypeX.WALK_LEFT;
                        nextX = this.x + this.collXOffset - Resources.TILE_SIZE;
                    } else {
                        // jsem někde uprostřed šířky hráče
                    }
                    verticalStrategy(nextX);
                }
            }
        }
    }
}