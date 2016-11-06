var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy;
    (function (Enemy) {
        var Hellhound = (function (_super) {
            __extends(Hellhound, _super);
            function Hellhound() {
                _super.call(this, Hellhound.WIDTH, Hellhound.HEIGHT, new createjs.SpriteSheet({
                    framerate: 10,
                    "images": [Lich.Resources.getInstance().getImage(Lich.AnimationKey[Lich.AnimationKey.HELLHOUND_ANIMATION_KEY])],
                    "frames": {
                        "regX": 0,
                        "height": Hellhound.HEIGHT,
                        "count": 25,
                        "regY": 0,
                        "width": Hellhound.WIDTH
                    },
                    "animations": {
                        "walkL": [0, 4, "walkL", 0.2],
                        "walkR": [5, 9, "walkR", 0.2],
                        "jumpL": [10, 15, "walkL", 0.2],
                        "jumpR": [16, 21, "walkR", 0.2],
                        "idle": [22, 24, "idle", 0.1]
                    }
                }), Hellhound.stateAnimation[Hellhound.IDLE_STATE], Hellhound.stateAnimation, Hellhound.COLLXOFFSET, Hellhound.COLLYOFFSET);
                /*-----------*/
                /* VARIABLES */
                /*-----------*/
                this.width = Hellhound.WIDTH;
                this.height = Hellhound.HEIGHT;
                this.speedx = 0;
                this.speedy = 0;
                this.attackCooldown = 0;
                this.state = Hellhound.IDLE_STATE;
                this.initialized = false;
            }
            Hellhound.prototype.runAI = function (world, delta) {
                if (this.getCurrentHealth() > 0) {
                    if (this.attackCooldown < Hellhound.ATTACK_COOLDOWN)
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
                            if (this.attackCooldown > Hellhound.ATTACK_COOLDOWN) {
                                this.attackCooldown = 0;
                                world.hero.hit(Hellhound.DAMAGE, world);
                            }
                        }
                    }
                    else {
                        if (world.hero.x > this.x) {
                            // hráč je vpravo od nepřítele - jdi doprava           
                            this.speedx = -Hellhound.HORIZONTAL_SPEED / 1.5;
                            // pokud už není ve skoku 
                            if (this.speedy == 0) {
                                var nextX = this.x + this.width - this.collXOffset + Lich.Resources.TILE_SIZE;
                                // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                                // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                                if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                    && world.hero.y + world.hero.height <= this.y + this.height
                                    || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                    this.speedy = Hellhound.VERTICAL_SPEED;
                                }
                            }
                        }
                        else {
                            // hráč je vlevo od nepřítele - jdi doleva
                            this.speedx = Hellhound.HORIZONTAL_SPEED / 1.5;
                            // pokud už není ve skoku 
                            if (this.speedy == 0) {
                                var nextX = this.x + this.collXOffset - Lich.Resources.TILE_SIZE;
                                // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                                // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                                if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                    && world.hero.y + world.hero.height <= this.y + this.height
                                    || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                    this.speedy = Hellhound.VERTICAL_SPEED;
                                }
                            }
                        }
                    }
                }
            };
            Hellhound.prototype.shift = function (shift) {
                var self = this;
                if (self.initialized) {
                }
            };
            Hellhound.prototype.getStateAnimation = function (desiredState) {
                if (this.currentHealth == 0 && desiredState != Hellhound.DIE_STATE) {
                    return Hellhound.stateAnimation[Hellhound.DEAD_STATE];
                }
                else {
                    return Hellhound.stateAnimation[desiredState];
                }
            };
            Hellhound.prototype.walkL = function () {
                this.performState(Hellhound.WALKL_STATE);
            };
            Hellhound.prototype.walkR = function () {
                this.performState(Hellhound.WALKR_STATE);
            };
            Hellhound.prototype.idle = function () {
                this.performState(Hellhound.IDLE_STATE);
            };
            Hellhound.prototype.jump = function () {
                this.performState(Hellhound.JUMPL_STATE);
            };
            Hellhound.prototype.jumpR = function () {
                this.performState(Hellhound.JUMPR_STATE);
            };
            Hellhound.prototype.jumpL = function () {
                this.performState(Hellhound.JUMPL_STATE);
            };
            Hellhound.prototype.midair = function () {
                this.performState(Hellhound.JUMPL_STATE);
            };
            Hellhound.prototype.fall = function () {
                this.performState(Hellhound.JUMPL_STATE);
            };
            Hellhound.prototype.die = function (world) {
                this.performState(Hellhound.DIE_STATE);
                Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
                // TODO loot
            };
            Hellhound.prototype.hit = function (damage, world) {
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
            Hellhound.prototype.onHealthChange = function (difference) {
            };
            ;
            Hellhound.prototype.onWillChange = function (difference) {
            };
            ;
            /*-----------*/
            /* CONSTANTS */
            /*-----------*/
            Hellhound.WALKR_STATE = "WALKR_STATE";
            Hellhound.WALKL_STATE = "WALKL_STATE";
            Hellhound.JUMPR_STATE = "JUMPR_STATE";
            Hellhound.JUMPL_STATE = "JUMPL_STATE";
            Hellhound.IDLE_STATE = "IDLE_STATE";
            Hellhound.DIE_STATE = "DIE_STATE";
            Hellhound.DEAD_STATE = "DEAD_STATE";
            Hellhound.WIDTH = 128;
            Hellhound.HEIGHT = 86;
            // Collision offset
            Hellhound.COLLXOFFSET = 16;
            Hellhound.COLLYOFFSET = 12;
            // Pixel/s
            Hellhound.HORIZONTAL_SPEED = 600;
            Hellhound.VERTICAL_SPEED = 500;
            Hellhound.DAMAGE = 10;
            Hellhound.ATTACK_COOLDOWN = 1000;
            Hellhound.stateAnimation = {
                WALKR_STATE: "walkR",
                WALKL_STATE: "walkL",
                JUMPR_STATE: "jumpR",
                JUMPL_STATE: "jumpL",
                IDLE_STATE: "idle",
                DIE_STATE: "die",
                DEAD_STATE: "dead"
            };
            return Hellhound;
        }(Lich.Character));
        Enemy.Hellhound = Hellhound;
    })(Enemy || (Enemy = {}));
})(Lich || (Lich = {}));
