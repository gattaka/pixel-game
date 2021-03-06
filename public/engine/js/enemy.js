var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy() {
            _super.call(this, Enemy.WIDTH, Enemy.HEIGHT, new createjs.SpriteSheet({
                framerate: 10,
                "images": [Lich.Resources.getInstance().getImage(Lich.AnimationKey[Lich.AnimationKey.CORPSE_ANIMATION_KEY])],
                "frames": {
                    "regX": 0,
                    "height": Enemy.HEIGHT,
                    "count": 30,
                    "regY": 0,
                    "width": Enemy.WIDTH
                },
                "animations": {
                    "idle": [0, 0, "breath", 0.005],
                    "breath": [1, 1, "idle", 0.04],
                    "walkR": [2, 9, "walkR", 0.2],
                    "walkL": [10, 17, "walkL", 0.2],
                    "jump": [18, 19, "midair", 0.2],
                    "midair": [19, 19, "midair", 0.2],
                    "fall": [19, 23, "idle", 0.2],
                    "jumpR": [25, 25, "jumpR", 0.2],
                    "jumpL": [27, 27, "jumpL", 0.2],
                    "die": [28, 28, "dead", 0.2],
                    "dead": [29, 29, "dead", 0.2]
                }
            }), Enemy.stateAnimation[Enemy.IDLE_STATE], Enemy.stateAnimation, Enemy.COLLXOFFSET, Enemy.COLLYOFFSET);
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.width = Enemy.WIDTH;
            this.height = Enemy.HEIGHT;
            this.speedx = 0;
            this.speedy = 0;
            this.attackCooldown = 0;
            this.state = Enemy.IDLE_STATE;
            this.initialized = false;
        }
        Enemy.prototype.runAI = function (world, delta) {
            if (this.getCurrentHealth() > 0) {
                if (this.attackCooldown < Enemy.ATTACK_COOLDOWN)
                    this.attackCooldown += delta;
                if (this.x > world.hero.x && this.x < world.hero.x + world.hero.width - world.hero.collXOffset) {
                    this.speedx = 0;
                    // zásah hráče?
                    var heroHead = world.hero.y + world.hero.collYOffset;
                    var heroFeet = world.hero.y + world.hero.height - world.hero.collYOffset;
                    var enemyHead = this.y;
                    var enemyFeet = this.y + this.height;
                    if (enemyHead >= heroHead && enemyHead < heroFeet || enemyFeet >= heroHead && enemyFeet < heroFeet
                        || heroHead >= enemyHead && heroHead < enemyFeet || heroFeet >= enemyHead && heroFeet < enemyFeet) {
                        if (this.attackCooldown > Enemy.ATTACK_COOLDOWN) {
                            this.attackCooldown = 0;
                            world.hero.hit(Enemy.DAMAGE, world);
                        }
                    }
                }
                else {
                    if (world.hero.x > this.x) {
                        // hráč je vpravo od nepřítele - jdi doprava           
                        this.speedx = -Lich.World.HERO_HORIZONTAL_SPEED / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            var nextX = this.x + this.width - this.collXOffset + Lich.Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                this.speedy = Lich.World.HERO_VERTICAL_SPEED;
                            }
                        }
                    }
                    else {
                        // hráč je vlevo od nepřítele - jdi doleva
                        this.speedx = Lich.World.HERO_HORIZONTAL_SPEED / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            var nextX = this.x + this.collXOffset - Lich.Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                this.speedy = Lich.World.HERO_VERTICAL_SPEED;
                            }
                        }
                    }
                }
            }
        };
        Enemy.prototype.shift = function (shift) {
            var self = this;
            if (self.initialized) {
            }
        };
        Enemy.prototype.getStateAnimation = function (desiredState) {
            if (this.currentHealth == 0 && desiredState != Enemy.DIE_STATE) {
                return Enemy.stateAnimation[Enemy.DEAD_STATE];
            }
            else {
                return Enemy.stateAnimation[desiredState];
            }
        };
        Enemy.prototype.walkL = function () {
            this.performState(Enemy.WALKL_STATE);
        };
        Enemy.prototype.walkR = function () {
            this.performState(Enemy.WALKR_STATE);
        };
        Enemy.prototype.idle = function () {
            this.performState(Enemy.IDLE_STATE);
        };
        Enemy.prototype.jump = function () {
            this.performState(Enemy.JUMP_STATE);
        };
        Enemy.prototype.jumpR = function () {
            this.performState(Enemy.JUMPR_STATE);
        };
        Enemy.prototype.jumpL = function () {
            this.performState(Enemy.JUMPL_STATE);
        };
        Enemy.prototype.midair = function () {
            this.performState(Enemy.MIDAIR_STATE);
        };
        Enemy.prototype.fall = function () {
            this.performState(Enemy.FALL_STATE);
        };
        Enemy.prototype.die = function (world) {
            this.performState(Enemy.DIE_STATE);
            Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
            // TODO loot
        };
        Enemy.prototype.hit = function (damage, world) {
            if (this.currentHealth > 0) {
                Lich.Mixer.playSound(Lich.SoundKey.SND_BONECRACK_KEY);
                this.currentHealth -= damage;
                if (this.currentHealth <= 0) {
                    this.currentHealth = 0;
                    this.speedx = 0;
                    this.die(world);
                }
            }
        };
        Enemy.prototype.onHealthChange = function (difference) {
        };
        ;
        Enemy.prototype.onWillChange = function (difference) {
        };
        ;
        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        Enemy.WALKR_STATE = "WALKR_STATE";
        Enemy.WALKL_STATE = "WALKL_STATE";
        Enemy.IDLE_STATE = "IDLE_STATE";
        Enemy.JUMP_STATE = "JUMP_STATE";
        Enemy.JUMPR_STATE = "JUMPR_STATE";
        Enemy.JUMPL_STATE = "JUMPL_STATE";
        Enemy.MIDAIR_STATE = "MIDAIR_STATE";
        Enemy.FALL_STATE = "FALL_STATE";
        Enemy.DIE_STATE = "DIE_STATE";
        Enemy.DEAD_STATE = "DEAD_STATE";
        Enemy.WIDTH = 56;
        Enemy.HEIGHT = 80;
        // Collision offset
        Enemy.COLLXOFFSET = 14;
        Enemy.COLLYOFFSET = 10;
        // Pixel/s
        Enemy.HERO_HORIZONTAL_SPEED = 200;
        Enemy.HERO_VERTICAL_SPEED = 500;
        Enemy.DAMAGE = 5;
        Enemy.ATTACK_COOLDOWN = 1000;
        Enemy.stateAnimation = {
            WALKR_STATE: "walkR",
            WALKL_STATE: "walkL",
            IDLE_STATE: "idle",
            JUMP_STATE: "jump",
            JUMPR_STATE: "jumpR",
            JUMPL_STATE: "jumpL",
            MIDAIR_STATE: "midair",
            FALL_STATE: "fall",
            DIE_STATE: "die",
            DEAD_STATE: "dead"
        };
        return Enemy;
    }(Lich.Character));
    Lich.Enemy = Enemy;
})(Lich || (Lich = {}));
