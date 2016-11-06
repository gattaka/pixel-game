var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var EnemyHellhound = (function (_super) {
        __extends(EnemyHellhound, _super);
        function EnemyHellhound() {
            _super.call(this, EnemyHellhound.WIDTH, EnemyHellhound.HEIGHT, new createjs.SpriteSheet({
                framerate: 10,
                "images": [Lich.Resources.getInstance().getImage(Lich.AnimationKey[Lich.AnimationKey.HELLHOUND_ANIMATION_KEY])],
                "frames": {
                    "regX": 0,
                    "height": EnemyHellhound.HEIGHT,
                    "count": 25,
                    "regY": 0,
                    "width": EnemyHellhound.WIDTH
                },
                "animations": {
                    "walkL": [0, 4, "walkL", 0.2],
                    "walkR": [5, 9, "walkR", 0.2],
                    "jumpL": [10, 15, "walkL", 0.2],
                    "jumpR": [16, 21, "walkR", 0.2],
                    "idle": [22, 24, "idle", 0.1]
                }
            }), EnemyHellhound.stateAnimation[EnemyHellhound.IDLE_STATE], EnemyHellhound.stateAnimation, EnemyHellhound.COLLXOFFSET, EnemyHellhound.COLLYOFFSET);
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.width = EnemyHellhound.WIDTH;
            this.height = EnemyHellhound.HEIGHT;
            this.speedx = 0;
            this.speedy = 0;
            this.attackCooldown = 0;
            this.state = EnemyHellhound.IDLE_STATE;
            this.initialized = false;
        }
        EnemyHellhound.prototype.runAI = function (world, delta) {
            if (this.getCurrentHealth() > 0) {
                if (this.attackCooldown < EnemyHellhound.ATTACK_COOLDOWN)
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
                        if (this.attackCooldown > EnemyHellhound.ATTACK_COOLDOWN) {
                            this.attackCooldown = 0;
                            world.hero.hit(EnemyHellhound.DAMAGE, world);
                        }
                    }
                }
                else {
                    if (world.hero.x > this.x) {
                        // hráč je vpravo od nepřítele - jdi doprava           
                        this.speedx = -EnemyHellhound.HORIZONTAL_SPEED / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            var nextX = this.x + this.width - this.collXOffset + Lich.Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                this.speedy = EnemyHellhound.VERTICAL_SPEED;
                            }
                        }
                    }
                    else {
                        // hráč je vlevo od nepřítele - jdi doleva
                        this.speedx = EnemyHellhound.HORIZONTAL_SPEED / 1.5;
                        // pokud už není ve skoku 
                        if (this.speedy == 0) {
                            var nextX = this.x + this.collXOffset - Lich.Resources.TILE_SIZE;
                            // pokud bych spadl nebo je přede mnou překážka, zkus vyskočit
                            // pokud je hráč níž než já, klidně spadni (vzdálenost je obrácená)
                            if (world.isCollision(nextX, this.y + this.height + Lich.Resources.TILE_SIZE).hit == false
                                && world.hero.y + world.hero.height <= this.y + this.height
                                || world.isCollision(nextX, this.y + this.height - Lich.Resources.TILE_SIZE).hit) {
                                this.speedy = EnemyHellhound.VERTICAL_SPEED;
                            }
                        }
                    }
                }
            }
        };
        EnemyHellhound.prototype.shift = function (shift) {
            var self = this;
            if (self.initialized) {
            }
        };
        EnemyHellhound.prototype.getStateAnimation = function (desiredState) {
            if (this.currentHealth == 0 && desiredState != EnemyHellhound.DIE_STATE) {
                return EnemyHellhound.stateAnimation[EnemyHellhound.DEAD_STATE];
            }
            else {
                return EnemyHellhound.stateAnimation[desiredState];
            }
        };
        EnemyHellhound.prototype.walkL = function () {
            this.performState(EnemyHellhound.WALKL_STATE);
        };
        EnemyHellhound.prototype.walkR = function () {
            this.performState(EnemyHellhound.WALKR_STATE);
        };
        EnemyHellhound.prototype.idle = function () {
            this.performState(EnemyHellhound.IDLE_STATE);
        };
        EnemyHellhound.prototype.jump = function () {
            this.performState(EnemyHellhound.JUMPL_STATE);
        };
        EnemyHellhound.prototype.jumpR = function () {
            this.performState(EnemyHellhound.JUMPR_STATE);
        };
        EnemyHellhound.prototype.jumpL = function () {
            this.performState(EnemyHellhound.JUMPL_STATE);
        };
        EnemyHellhound.prototype.midair = function () {
            this.performState(EnemyHellhound.JUMPL_STATE);
        };
        EnemyHellhound.prototype.fall = function () {
            this.performState(EnemyHellhound.JUMPL_STATE);
        };
        EnemyHellhound.prototype.die = function (world) {
            this.performState(EnemyHellhound.DIE_STATE);
            Lich.Mixer.playSound(Lich.SoundKey.SND_SKELETON_DIE_KEY);
            // TODO loot
        };
        EnemyHellhound.prototype.hit = function (damage, world) {
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
        EnemyHellhound.prototype.onHealthChange = function (difference) {
        };
        ;
        EnemyHellhound.prototype.onWillChange = function (difference) {
        };
        ;
        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        EnemyHellhound.WALKR_STATE = "WALKR_STATE";
        EnemyHellhound.WALKL_STATE = "WALKL_STATE";
        EnemyHellhound.JUMPR_STATE = "JUMPR_STATE";
        EnemyHellhound.JUMPL_STATE = "JUMPL_STATE";
        EnemyHellhound.IDLE_STATE = "IDLE_STATE";
        EnemyHellhound.DIE_STATE = "DIE_STATE";
        EnemyHellhound.DEAD_STATE = "DEAD_STATE";
        EnemyHellhound.WIDTH = 128;
        EnemyHellhound.HEIGHT = 86;
        // Collision offset
        EnemyHellhound.COLLXOFFSET = 16;
        EnemyHellhound.COLLYOFFSET = 12;
        // Pixel/s
        EnemyHellhound.HORIZONTAL_SPEED = 600;
        EnemyHellhound.VERTICAL_SPEED = 500;
        EnemyHellhound.DAMAGE = 10;
        EnemyHellhound.ATTACK_COOLDOWN = 1000;
        EnemyHellhound.stateAnimation = {
            WALKR_STATE: "walkR",
            WALKL_STATE: "walkL",
            JUMPR_STATE: "jumpR",
            JUMPL_STATE: "jumpL",
            IDLE_STATE: "idle",
            DIE_STATE: "die",
            DEAD_STATE: "dead"
        };
        return EnemyHellhound;
    }(Lich.Character));
    Lich.EnemyHellhound = EnemyHellhound;
})(Lich || (Lich = {}));
