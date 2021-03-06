var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var ConditionUI = (function (_super) {
        __extends(ConditionUI, _super);
        function ConditionUI() {
            _super.call(this, 350, 2 * Lich.AbstractUI.BORDER + Lich.Resources.PARTS_SIZE);
            this.healthBar = new createjs.Shape();
            this.willBar = new createjs.Shape();
            this.maxHealth = 0;
            this.maxWill = 0;
            this.currentHealth = 0;
            this.currentWill = 0;
            var self = this;
            this.barWidth = this.width - ConditionUI.INNER_BORDER * 2;
            this.barHeight = this.height / 2 - ConditionUI.INNER_BORDER - ConditionUI.SPACING / 2;
            // podklady 
            var healthBgrBar = new createjs.Shape();
            healthBgrBar.graphics.setStrokeStyle(2);
            healthBgrBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            healthBgrBar.graphics.drawRoundRect(ConditionUI.INNER_BORDER, ConditionUI.INNER_BORDER, this.barWidth, this.barHeight, 3);
            this.addChild(healthBgrBar);
            var willBgrBar = new createjs.Shape();
            willBgrBar.graphics.setStrokeStyle(2);
            willBgrBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            willBgrBar.graphics.drawRoundRect(ConditionUI.INNER_BORDER, this.height / 2 + ConditionUI.SPACING / 2, this.barWidth, this.barHeight, 3);
            this.addChild(willBgrBar);
            // zdraví
            this.addChild(this.healthBar);
            this.healthText = new Lich.Label(" ", Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            this.healthText.y = ConditionUI.INNER_BORDER;
            this.addChild(this.healthText);
            // vůle
            this.addChild(this.willBar);
            this.willText = new Lich.Label(" ", Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            this.willText.y = this.height / 2 + ConditionUI.SPACING / 2;
            this.addChild(this.willText);
            this.updateHealthBar();
            this.updateWillBar();
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.HEALTH_CHANGE, function (data) {
                self.setMaxHealth(data.maxHealth);
                self.setHealth(data.currentHealth);
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.WILL_CHANGE, function (data) {
                self.setMaxWill(data.maxWill);
                self.setWill(data.currentWill);
                return false;
            });
        }
        ConditionUI.prototype.setMaxHealth = function (maxHealth) {
            this.maxHealth = maxHealth;
            this.setHealth(this.currentHealth);
        };
        ConditionUI.prototype.setMaxWill = function (maxWill) {
            this.maxWill = maxWill;
            this.setWill(this.currentWill);
        };
        ConditionUI.prototype.setHealth = function (currentHealth) {
            if (currentHealth > this.maxHealth) {
                this.currentHealth = this.maxHealth;
            }
            else if (currentHealth < 0) {
                this.currentHealth = 0;
            }
            else {
                this.currentHealth = Math.ceil(currentHealth);
            }
            this.updateHealthBar();
        };
        ConditionUI.prototype.setWill = function (currentWill) {
            if (currentWill > this.maxWill) {
                this.currentWill = this.maxWill;
            }
            else if (currentWill < 0) {
                this.currentWill = 0;
            }
            else {
                this.currentWill = Math.ceil(currentWill);
            }
            this.updateWillBar();
        };
        ConditionUI.prototype.updateHealthBar = function () {
            this.healthBar.graphics.clear();
            this.healthBar.graphics.setStrokeStyle(2);
            this.healthBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.healthBar.graphics.beginFill("rgba(255,0,0,0.7)");
            var width = this.barWidth * (this.currentHealth / this.maxHealth);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.healthBar.graphics.drawRoundRect(x, ConditionUI.INNER_BORDER, width, this.barHeight, 3);
            this.healthText.setText(this.currentHealth + "/" + this.maxHealth);
            this.healthText.x = this.width / 2 - this.healthText.getBounds().width / 2;
        };
        ConditionUI.prototype.updateWillBar = function () {
            this.willBar.graphics.clear();
            this.willBar.graphics.setStrokeStyle(2);
            this.willBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.willBar.graphics.beginFill("rgba(70,30,255,0.7)");
            var width = this.barWidth * (this.currentWill / this.maxWill);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.willBar.graphics.drawRoundRect(x, this.height / 2 + ConditionUI.SPACING / 2, width, this.barHeight, 3);
            this.willText.setText(this.currentWill + "/" + this.maxWill);
            this.willText.x = this.width / 2 - this.willText.getBounds().width / 2;
        };
        ConditionUI.INNER_BORDER = 5;
        ConditionUI.SPACING = 4;
        return ConditionUI;
    }(Lich.AbstractUI));
    Lich.ConditionUI = ConditionUI;
})(Lich || (Lich = {}));
