var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character() {
            _super.apply(this, arguments);
            this.HEALTH_REGEN_TIME = 1000;
            this.maxHealth = 100;
            this.currentHealth = this.maxHealth;
            this.healthRegen = 0;
            this.WILL_REGEN_TIME = 1000;
            this.maxWill = 50;
            this.currentWill = this.maxWill;
            this.willRegen = 0;
            this.spellCooldowns = new Lich.Table();
        }
        /**
         * Health metody
         */
        Character.prototype.hit = function (damage, game) {
            var oldValue = this.currentHealth;
            if (this.currentHealth > 0) {
                this.currentHealth -= damage;
                if (this.currentHealth <= 0) {
                    this.currentHealth = 0;
                    this.die(game);
                }
            }
            this.onHealthChange(this.currentHealth - oldValue);
        };
        Character.prototype.fillHealth = function (amount) {
            this.currentHealth += amount;
            if (this.currentHealth > this.maxHealth)
                this.currentHealth = this.maxHealth;
            this.onHealthChange(0);
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
            this.currentWill += amount;
            if (this.currentWill > this.maxWill)
                this.currentWill = this.maxWill;
            this.onWillChange(0);
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
            if (self.speedx === 0 && self.speedy === 0) {
                self.idle();
            }
            else if (self.speedy !== 0) {
                if (self.speedx === 0) {
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
        };
        Character.prototype.performState = function (desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(self.getStateAnimation(desiredState));
                self.state = desiredState;
            }
        };
        Character.prototype.handleTick = function (delta) {
            this.fillHealth((delta / this.HEALTH_REGEN_TIME) * this.healthRegen);
            this.fillWill((delta / this.WILL_REGEN_TIME) * this.willRegen);
        };
        return Character;
    }(Lich.AbstractWorldObject));
    Lich.Character = Character;
})(Lich || (Lich = {}));
