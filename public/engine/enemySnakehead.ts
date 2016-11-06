namespace Lich {
    export class EnemyHellhound extends Character {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/

        static WALKR_STATE = "WALKR_STATE";
        static WALKL_STATE = "WALKL_STATE";
        static JUMPR_STATE = "JUMPR_STATE";
        static JUMPL_STATE = "JUMPL_STATE";
        static IDLE_STATE = "IDLE_STATE";
        static DIE_STATE = "DIE_STATE";
        static DEAD_STATE = "DEAD_STATE";

        static WIDTH = 128;
        static HEIGHT = 86;

        // Collision offset
        static COLLXOFFSET = 16;
        static COLLYOFFSET = 12;

        // Pixel/s
        static HORIZONTAL_SPEED = 600;
        static VERTICAL_SPEED = 500;

        static DAMAGE = 10;
        static ATTACK_COOLDOWN = 1000;

        static stateAnimation = {
            WALKR_STATE: "walkR",
            WALKL_STATE: "walkL",
            JUMPR_STATE: "jumpR",
            JUMPL_STATE: "jumpL",
            IDLE_STATE: "idle",
            DIE_STATE: "die",
            DEAD_STATE: "dead"
        };

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        width = EnemyHellhound.WIDTH;
        height = EnemyHellhound.HEIGHT;
        speedx = 0;
        speedy = 0;
        attackCooldown = 0;

        state = EnemyHellhound.IDLE_STATE;

        initialized = false;

        constructor() {
            super(EnemyHellhound.WIDTH, EnemyHellhound.HEIGHT, new createjs.SpriteSheet({
                framerate: 10,
                "images": [Resources.getInstance().getImage(AnimationKey[AnimationKey.HELLHOUND_ANIMATION_KEY])],
                "frames": {
                    "regX": 0,
                    "height": EnemyHellhound.HEIGHT,
                    "count": 25,
                    "regY": 0,
                    "width": EnemyHellhound.WIDTH,
                },
                "animations": {
                    "walkL": [0, 4, "walkL", 0.2],
                    "walkR": [5, 9, "walkR", 0.2],
                    "jumpL": [10, 15, "walkL", 0.2],
                    "jumpR": [16, 21, "walkR", 0.2],
                    "idle": [22, 24, "idle", 0.1]
                }
            }), EnemyHellhound.stateAnimation[EnemyHellhound.IDLE_STATE], EnemyHellhound.stateAnimation, EnemyHellhound.COLLXOFFSET, EnemyHellhound.COLLYOFFSET);
        }

        runAI(world: World, delta: number) {
            if (this.getCurrentHealth() > 0) {
                if (this.attackCooldown < EnemyHellhound.ATTACK_COOLDOWN)
                    this.attackCooldown += delta;
                if (this.x > world.hero.x && this.x < world.hero.x + world.hero.width - world.hero.collXOffset) {
                    this.speedx = 0;
                    // zásah hráče?
                    let heroHead = world.hero.y + world.hero.collYOffset;
                    let heroFeet = world.hero.y + world.hero.height - world.hero.collYOffset;
                    let enemyHead = this.y;
                    let enemyFeet = this.y + this.height;
                    if (enemyHead >= heroHead && enemyHead < heroFeet || enemyFeet >= heroHead && enemyFeet < heroFeet
                        || heroHead >= enemyHead && heroHead < enemyFeet || heroFeet >= enemyHead && heroFeet < enemyFeet) {
                        if (this.attackCooldown > EnemyHellhound.ATTACK_COOLDOWN) {
                            this.attackCooldown = 0;
                            world.hero.hit(EnemyHellhound.DAMAGE, world);
                        }
                    }
                } else {
                    if (world.hero.x > this.x) {
                        // hráč je vpravo od nepřítele - jdi doprava           
                        this.speedx = -EnemyHellhound.HORIZONTAL_SPEED / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            let nextX = this.x + this.width - this.collXOffset + Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE).hit) {
                                this.speedy = EnemyHellhound.VERTICAL_SPEED;
                            }
                        }
                    } else {
                        // hráč je vlevo od nepřítele - jdi doleva
                        this.speedx = EnemyHellhound.HORIZONTAL_SPEED / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            let nextX = this.x + this.collXOffset - Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Resources.TILE_SIZE).hit) {
                                this.speedy = EnemyHellhound.VERTICAL_SPEED;
                            }
                        }
                    }
                }
            }
        }

        shift(shift) {
            var self = this;
            if (self.initialized) {
                // TODO
            }
        }

        getStateAnimation(desiredState: string) {
            if (this.currentHealth == 0 && desiredState != EnemyHellhound.DIE_STATE) {
                return EnemyHellhound.stateAnimation[EnemyHellhound.DEAD_STATE];
            } else {
                return EnemyHellhound.stateAnimation[desiredState];
            }
        }

        walkL() {
            this.performState(EnemyHellhound.WALKL_STATE);
        }

        walkR() {
            this.performState(EnemyHellhound.WALKR_STATE);
        }

        idle() {
            this.performState(EnemyHellhound.IDLE_STATE);
        }

        jump() {
            this.performState(EnemyHellhound.JUMPL_STATE);
        }

        jumpR() {
            this.performState(EnemyHellhound.JUMPR_STATE);
        }

        jumpL() {
            this.performState(EnemyHellhound.JUMPL_STATE);
        }

        midair() {
            this.performState(EnemyHellhound.JUMPL_STATE);
        }

        fall() {
            this.performState(EnemyHellhound.JUMPL_STATE);
        }

        die(world: World) {
            this.performState(EnemyHellhound.DIE_STATE);
            Mixer.playSound(SoundKey.SND_SKELETON_DIE_KEY);
            // TODO loot
        }

        hit(damage: number, world: World) {
            if (this.currentHealth > 0) {
                Mixer.playSound(SoundKey.SND_BONECRACK_KEY);
                this.currentHealth -= damage;
                if (this.currentHealth <= 0) {
                    this.currentHealth = 0;
                    this.speedx = 0;
                    this.die(world);
                }
            }
        }

        onHealthChange(difference: number) {
        };

        onWillChange(difference: number) {
        };

    }
}