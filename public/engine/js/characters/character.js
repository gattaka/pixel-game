var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    (function (MovementTypeX) {
        // Nic nedělá
        MovementTypeX[MovementTypeX["NONE"] = 0] = "NONE";
        // Jde doleva (respektuje kolize)
        MovementTypeX[MovementTypeX["WALK_LEFT"] = 1] = "WALK_LEFT";
        // Jde doprava (respektuje kolize)
        MovementTypeX[MovementTypeX["WALK_RIGHT"] = 2] = "WALK_RIGHT";
        // Vznáší se (nerespektuje gravitaci ani kolize)
        MovementTypeX[MovementTypeX["HOVER"] = 3] = "HOVER";
    })(Lich.MovementTypeX || (Lich.MovementTypeX = {}));
    var MovementTypeX = Lich.MovementTypeX;
    (function (MovementTypeY) {
        // Nic nedělá
        MovementTypeY[MovementTypeY["NONE"] = 0] = "NONE";
        // Skáče (respektuje gravitaci a kolize)
        MovementTypeY[MovementTypeY["JUMP_OR_CLIMB"] = 1] = "JUMP_OR_CLIMB";
        // Sestupuje (jde vstříc gravitaci a kolize)
        MovementTypeY[MovementTypeY["DESCENT"] = 2] = "DESCENT";
        // Letí (nerespektuje gravitaci, ale kolize ano)
        MovementTypeY[MovementTypeY["ASCENT"] = 3] = "ASCENT";
        // Vznáší se (nerespektuje gravitaci ani kolize)
        MovementTypeY[MovementTypeY["HOVER"] = 4] = "HOVER";
    })(Lich.MovementTypeY || (Lich.MovementTypeY = {}));
    var MovementTypeY = Lich.MovementTypeY;
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(ownerId, width, height, collXOffset, collYOffset, animationKey, initState, frames, accelerationX, accelerationY, animations, hovers) {
            if (hovers === void 0) { hovers = false; }
            _super.call(this, width, height, new createjs.SpriteSheet({
                framerate: 10,
                "images": [Lich.Resources.getInstance().getImage(Lich.AnimationKey[animationKey])],
                "frames": {
                    "regX": 0,
                    "height": height,
                    "count": frames,
                    "regY": 0,
                    "width": width
                },
                "animations": animations.serialize()
            }), initState, collXOffset, collYOffset, hovers);
            this.ownerId = ownerId;
            this.accelerationX = accelerationX;
            this.accelerationY = accelerationY;
            this.uuid = Lich.Utils.guid();
            this.HEALTH_REGEN_TIME = 1000;
            this.maxHealth = 100;
            this.currentHealth = this.maxHealth;
            this.healthRegen = 0;
            this.WILL_REGEN_TIME = 1000;
            this.maxWill = 50;
            this.currentWill = this.maxWill;
            this.willRegen = 0;
            this.hitTextColor = "#E3E";
            this.hitTextBorderColor = "#303";
            // Typy pohybu, u hráče odpovídá stisku klávesy, 
            // u nepřítele jeho AI nasměrování
            this.movementTypeX = MovementTypeX.NONE;
            this.movementTypeY = MovementTypeY.NONE;
            this.isClimbing = false;
            this.spellCooldowns = new Lich.Table();
            this.healthBar = new createjs.Shape();
            this.healthBar.width = this.width;
            this.healthBar.height = 4;
            this.healthBar.x = 0;
            this.healthBar.y = -this.healthBar.height;
            this.healthBar.visible = false;
            this.addChild(this.healthBar);
        }
        Character.prototype.updateHealthBar = function () {
            if (this.currentHealth == this.maxHealth || this.currentHealth == 0) {
                this.healthBar.visible = false;
            }
            else {
                this.healthBar.visible = true;
                this.healthBar.graphics.clear();
                this.healthBar.graphics.beginFill("rgba(0,255,0,0.7)");
                this.healthBar.graphics.drawRect(0, 0, this.width, this.healthBar.height);
                var width = this.width * (1 - this.currentHealth / this.maxHealth);
                this.healthBar.graphics.beginFill("rgba(255,0,0,0.7)");
                this.healthBar.graphics.drawRect(0, 0, width, this.healthBar.height);
            }
        };
        Character.prototype.onHealthChange = function (difference) {
            this.updateHealthBar();
        };
        ;
        Character.prototype.onWillChange = function (difference) { };
        ;
        Character.prototype.die = function (world) {
            this.speedx = 0;
            this.healthBar.visible = false;
            this.death();
        };
        /**
         * Health metody
         */
        Character.prototype.hitSound = function () {
        };
        Character.prototype.hit = function (damage, world) {
            var oldValue = this.currentHealth;
            if (this.currentHealth > 0) {
                var effectiveDamage = damage;
                this.currentHealth -= effectiveDamage;
                // TODO zatím nemá armor, takže se aplikuje vše
                this.onHealthChange(this.currentHealth - oldValue);
                world.fadeText("-" + effectiveDamage, this.x + this.width * Math.random(), this.y, 25, this.hitTextColor, this.hitTextBorderColor);
                this.hitSound();
                if (this.currentHealth <= 0) {
                    this.currentHealth = 0;
                    this.die(world);
                }
            }
            return damage;
        };
        Character.prototype.fillHealth = function (amount) {
            if (this.currentHealth < this.maxHealth) {
                this.currentHealth += amount;
                if (this.currentHealth > this.maxHealth)
                    this.currentHealth = this.maxHealth;
                this.onHealthChange(0);
            }
        };
        Character.prototype.setNewMaxHealth = function (maxHealth) {
            this.maxHealth = maxHealth;
            if (this.currentHealth > this.maxHealth)
                this.currentHealth = this.maxHealth;
            this.onHealthChange(0);
        };
        Character.prototype.getMaxHealth = function () {
            return this.maxHealth;
        };
        Character.prototype.getCurrentHealth = function () {
            return this.currentHealth;
        };
        /**
         * Will metody
         */
        Character.prototype.decreseWill = function (amount) {
            var oldValue = this.currentWill;
            if (this.currentWill > 0) {
                this.currentWill -= amount;
                if (this.currentWill < 0)
                    this.currentWill = 0;
                this.onWillChange(this.currentWill - oldValue);
            }
        };
        Character.prototype.fillWill = function (amount) {
            if (this.currentWill < this.maxWill) {
                this.currentWill += amount;
                if (this.currentWill > this.maxWill)
                    this.currentWill = this.maxWill;
                this.onWillChange(0);
            }
        };
        Character.prototype.setNewMaxWill = function (maxWill) {
            this.maxWill = maxWill;
            if (this.currentWill > this.maxWill)
                this.currentWill = this.maxWill;
            this.onWillChange(0);
        };
        Character.prototype.getMaxWill = function () {
            return this.maxWill;
        };
        Character.prototype.getCurrentWill = function () {
            return this.currentWill;
        };
        Character.prototype.updateAnimations = function () {
            var self = this;
            if (this.getCurrentHealth() > 0) {
                if (self.isClimbing) {
                    self.climb();
                    if (self.speedx == 0 && self.speedy == 0) {
                        self.stop();
                    }
                    else {
                        self.play();
                    }
                }
                else if (self.speedx == 0 && self.speedy == 0) {
                    self.idle();
                }
                else if (self.speedy != 0) {
                    if (self.speedx == 0) {
                        self.jump();
                    }
                    else if (self.speedx > 0) {
                        self.jumpL();
                    }
                    else {
                        self.jumpR();
                    }
                }
                else {
                    if (self.speedx > 0) {
                        self.walkL();
                    }
                    if (self.speedx < 0) {
                        self.walkR();
                    }
                }
            }
        };
        Character.prototype.performState = function (desiredState) {
            var self = this;
            if (self.sprite.currentAnimation !== desiredState) {
                self.gotoAndPlay(desiredState);
            }
        };
        Character.prototype.handleTick = function (delta) {
            if (this.getCurrentHealth() > 0) {
                this.fillHealth((delta / this.HEALTH_REGEN_TIME) * this.healthRegen);
                this.fillWill((delta / this.WILL_REGEN_TIME) * this.willRegen);
            }
        };
        return Character;
    }(Lich.AbstractWorldObject));
    Lich.Character = Character;
})(Lich || (Lich = {}));
