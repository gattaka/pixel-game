var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var MovementTypeX;
    (function (MovementTypeX) {
        // Nic nedělá
        MovementTypeX[MovementTypeX["NONE"] = 0] = "NONE";
        // Jde doleva (respektuje kolize)
        MovementTypeX[MovementTypeX["WALK_LEFT"] = 1] = "WALK_LEFT";
        // Jde doprava (respektuje kolize)
        MovementTypeX[MovementTypeX["WALK_RIGHT"] = 2] = "WALK_RIGHT";
        // Vznáší se (nerespektuje gravitaci ani kolize)
        MovementTypeX[MovementTypeX["HOVER"] = 3] = "HOVER";
    })(MovementTypeX = Lich.MovementTypeX || (Lich.MovementTypeX = {}));
    var MovementTypeY;
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
    })(MovementTypeY = Lich.MovementTypeY || (Lich.MovementTypeY = {}));
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(ownerId, animationSetKey, initAnimation, collXOffset, collYOffset, accelerationX, accelerationY, hovers) {
            if (hovers === void 0) { hovers = false; }
            var _this = _super.call(this, collXOffset, collYOffset, hovers) || this;
            _this.ownerId = ownerId;
            _this.animationSetKey = animationSetKey;
            _this.accelerationX = accelerationX;
            _this.accelerationY = accelerationY;
            _this.uuid = Lich.Utils.guid();
            _this.HEALTH_REGEN_TIME = 1000;
            _this.maxHealth = 100;
            _this.currentHealth = _this.maxHealth;
            _this.healthRegen = 0;
            _this.WILL_REGEN_TIME = 1000;
            _this.maxWill = 50;
            _this.currentWill = _this.maxWill;
            _this.willRegen = 0;
            _this.hitTextColor = "#E3E";
            _this.hitTextBorderColor = "#303";
            // Typy pohybu, u hráče odpovídá stisku klávesy, 
            // u nepřítele jeho AI nasměrování
            _this.movementTypeX = MovementTypeX.NONE;
            _this.movementTypeY = MovementTypeY.NONE;
            _this.isClimbing = false;
            _this.spellCooldowns = new Lich.Table();
            _this.healthBar = new createjs.Shape();
            _this.healthBar.width = _this.width;
            _this.healthBar.height = 4;
            _this.healthBar.x = 0;
            _this.healthBar.y = -_this.healthBar.height;
            _this.healthBar.visible = false;
            _this.addChild(_this.healthBar);
            return _this;
        }
        Character.prototype.initSprite = function () {
            var animationDef = Lich.Resources.getInstance().animationsDefs[this.animationSetKey];
            this.width = animationDef.width;
            this.height = animationDef.height;
            this.sprite = Lich.Resources.getInstance().getSprite(Lich.SpritesheetKey.SPST_OBJECTS_KEY, animationDef.subSpritesheetName);
            this.addChild(this.sprite);
        };
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
        Character.prototype.performAnimation = function (desiredAnimation) {
            var self = this;
            var stringKey = Lich.AnimationKey[desiredAnimation];
            if (self.sprite.currentAnimation !== stringKey) {
                self.gotoAndPlay(stringKey);
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
