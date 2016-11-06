var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Redskull = (function (_super) {
            __extends(Redskull, _super);
            function Redskull() {
                _super.call(this, Redskull.WIDTH, Redskull.HEIGHT, new createjs.SpriteSheet({
                    framerate: 10,
                    "images": [Lich.Resources.getInstance().getImage(Lich.AnimationKey[Lich.AnimationKey.CORPSE_ANIMATION_KEY])],
                    "frames": {
                        "regX": 0,
                        "height": Redskull.HEIGHT,
                        "count": 30,
                        "regY": 0,
                        "width": Redskull.WIDTH
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
                }), Redskull.stateAnimation[Redskull.IDLE_STATE], Redskull.stateAnimation, Redskull.COLLXOFFSET, Redskull.COLLYOFFSET);
                /*-----------*/
                /* VARIABLES */
                /*-----------*/
                this.width = Redskull.WIDTH;
                this.height = Redskull.HEIGHT;
                this.speedx = 0;
                this.speedy = 0;
                this.attackCooldown = 0;
                this.state = Redskull.IDLE_STATE;
                this.initialized = false;
            }
            Redskull.prototype.runAI = function (world, delta) {
                if (this.getCurrentHealth() > 0) {
                    if (this.attackCooldown < Redskull.ATTACK_COOLDOWN)
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
                            if (this.attackCooldown > Redskull.ATTACK_COOLDOWN) {
                                this.attackCooldown = 0;
                                world.hero.hit(Redskull.DAMAGE, world);
                            }
                        }
                    }
                    else {
                        if (world.hero.x > this.x) {
                            // hráč je vpravo od nepřítele - jdi doprava           
                            this.speedx = -Redskull.HORIZONTAL_SPEED / 1.5;
                            // pokud už není ve skoku 
                            if (this.speedy == 0) {
                                var nextX = this.x + this.width - this.collXOffset + Lich.Resources.TILE_SIZE;
                                // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                                // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                                if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                    && world.hero.y + world.hero.height <= this.y + this.height
                                    || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                    this.speedy = Redskull.VERTICAL_SPEED;
                                }
                            }
                        }
                        else {
                            // hráč je vlevo od nepřítele - jdi doleva
                            this.speedx = Redskull.HORIZONTAL_SPEED / 1.5;
                            // pokud už není ve skoku 
                            if (this.speedy == 0) {
                                var nextX = this.x + this.collXOffset - Lich.Resources.TILE_SIZE;
                                // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                                // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                                if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                    && world.hero.y + world.hero.height <= this.y + this.height
                                    || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                    this.speedy = Redskull.VERTICAL_SPEED;
                                }
                            }
                        }
                    }
                }
            };
            Redskull.prototype.shift = function (shift) {
                var self = this;
                if (self.initialized) {
                }
            };
            Redskull.prototype.getStateAnimation = function (desiredState) {
                if (this.currentHealth == 0 && desiredState != Redskull.DIE_STATE) {
                    return Redskull.stateAnimation[Redskull.DEAD_STATE];
                }
                else {
                    return Redskull.stateAnimation[desiredState];
                }
            };
            Redskull.prototype.walkL = function () {
                this.performState(Redskull.WALKL_STATE);
            };
            Redskull.prototype.walkR = function () {
                this.performState(Redskull.WALKR_STATE);
            };
            Redskull.prototype.idle = function () {
                this.performState(Redskull.IDLE_STATE);
            };
            Redskull.prototype.jump = function () {
                this.performState(Redskull.JUMP_STATE);
            };
            Redskull.prototype.jumpR = function () {
                this.performState(Redskull.JUMPR_STATE);
            };
            Redskull.prototype.jumpL = function () {
                this.performState(Redskull.JUMPL_STATE);
            };
            Redskull.prototype.midair = function () {
                this.performState(Redskull.MIDAIR_STATE);
            };
            Redskull.prototype.fall = function () {
                this.performState(Redskull.FALL_STATE);
            };
            Redskull.prototype.die = function (world) {
                this.performState(Redskull.DIE_STATE);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                // TODO loot
            };
            Redskull.prototype.hit = function (damage, world) {
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
            Redskull.prototype.onHealthChange = function (difference) {
            };
            ;
            Redskull.prototype.onWillChange = function (difference) {
            };
            ;
            /*-----------*/
            /* CONSTANTS */
            /*-----------*/
            Redskull.WALKR_STATE = "WALKR_STATE";
            Redskull.WALKL_STATE = "WALKL_STATE";
            Redskull.IDLE_STATE = "IDLE_STATE";
            Redskull.JUMP_STATE = "JUMP_STATE";
            Redskull.JUMPR_STATE = "JUMPR_STATE";
            Redskull.JUMPL_STATE = "JUMPL_STATE";
            Redskull.MIDAIR_STATE = "MIDAIR_STATE";
            Redskull.FALL_STATE = "FALL_STATE";
            Redskull.DIE_STATE = "DIE_STATE";
            Redskull.DEAD_STATE = "DEAD_STATE";
            Redskull.WIDTH = 56;
            Redskull.HEIGHT = 80;
            // Collision offset
            Redskull.COLLXOFFSET = 14;
            Redskull.COLLYOFFSET = 10;
            // Pixel/s
            Redskull.HORIZONTAL_SPEED = 200;
            Redskull.VERTICAL_SPEED = 500;
            Redskull.DAMAGE = 5;
            Redskull.ATTACK_COOLDOWN = 1000;
            Redskull.stateAnimation = {
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
            return Redskull;
        }(Lich.Character));
        Enemy.Redskull = Redskull;
    })(Enemy || (Enemy = {}));
})(Lich || (Lich = {}));
