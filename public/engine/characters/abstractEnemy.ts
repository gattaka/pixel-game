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
            initState: CharacterState,
            frames: number,
            type: MovementType,
            accelerationX: number,
            accelerationY: number,
            animations: Animations) {
            super(width, height, collXOffset, collYOffset, animationKey, initState, frames, type, accelerationX, accelerationY, animations);
        }

        runAI(world: World, delta: number) {
            if (this.getCurrentHealth() > 0) {
                if (this.currentAttackCooldown < this.attackCooldown)
                    this.currentAttackCooldown += delta;
                if (this.x > world.hero.x && this.x < world.hero.x + world.hero.width - world.hero.collXOffset) {
                    this.speedx = 0;
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
                        }
                    }
                } else {
                    if (world.hero.x > this.x) {
                        // hráč je vpravo od nepřítele - jdi doprava           
                        this.speedx = -this.accelerationX / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            let nextX = this.x + this.width - this.collXOffset + Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE).hit) {
                                this.speedy = this.accelerationY;
                            }
                        }
                    } else {
                        // hráč je vlevo od nepřítele - jdi doleva
                        this.speedx = this.accelerationX / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            let nextX = this.x + this.collXOffset - Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE).hit) {
                                this.speedy = this.accelerationY;
                            }
                        }
                    }
                }
            }
        }
    }
}