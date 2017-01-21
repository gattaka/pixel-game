namespace Lich {

    export abstract class AbstractEnemy extends Character {

        protected currentAttackCooldown = 0;

        public id: number;

        constructor(
            ownerId: string,
            protected damage: number,
            protected attackCooldown: number,
            width: number, height: number,
            collXOffset: number, collYOffset: number,
            animationKey: AnimationKey,
            initState: string,
            frames: number,
            accelerationX: number,
            accelerationY: number,
            animations: Animations,
            // může se nepřítel sám unspawnout (když je moc daleko od hráče)
            public unspawns: boolean,
            public minDepth: number,
            public maxDepth: number,
            hovers = false) {
            super(ownerId, width, height, collXOffset, collYOffset, animationKey, initState, frames, accelerationX, accelerationY, animations, hovers);
        }

        protected isPlayerInReach(world: World) {
            // enemy
            let ex1 = this.x + this.collXOffset;
            let ex2 = this.x + this.width - this.collXOffset;
            let ey1 = this.y + this.collYOffset;
            let ey2 = this.y + this.height - this.collYOffset;
            // player
            let hero = world.hero;
            let px1 = hero.x + hero.collXOffset;
            let px2 = hero.x + hero.width - hero.collXOffset;
            let py1 = hero.y + hero.collYOffset;
            let py2 = hero.y + hero.height - hero.collYOffset;
            // hráč a nepřítel jsou zaklesnuti v x a y 
            if ((ex1 >= px1 && ex1 <= px2 || ex2 >= px1 && ex2 <= px2 || px1 >= ex1 && px1 <= ex2 || px2 >= ex1 && px2 <= ex2)
                && (ey1 >= py1 && ey1 <= py2 || ey2 >= py1 && ey2 <= py2 || py1 >= ey1 && py1 <= ey2 || py2 >= ey1 && py2 <= ey2)) {
                // zásah hráče?
                let heroHead = world.hero.y + world.hero.collYOffset;
                let heroFeet = world.hero.y + world.hero.height - world.hero.collYOffset;
                let enemyHead = this.y;
                let enemyFeet = this.y + this.height;
                if (enemyHead >= heroHead && enemyHead < heroFeet || enemyFeet >= heroHead && enemyFeet < heroFeet
                    || heroHead >= enemyHead && heroHead < enemyFeet || heroFeet >= enemyHead && heroFeet < enemyFeet) {
                    return true;
                }
            }
            return false;
        }

        runAI(world: World, delta: number) {
            if (this.getCurrentHealth() > 0) {
                if (this.currentAttackCooldown < this.attackCooldown)
                    this.currentAttackCooldown += delta;
                if (this.isPlayerInReach(world)) {
                    this.movementTypeX = MovementTypeX.NONE;
                    if (this.currentAttackCooldown >= this.attackCooldown) {
                        this.currentAttackCooldown = 0;
                        world.hero.hit(this.damage, world);
                    }
                } else {
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