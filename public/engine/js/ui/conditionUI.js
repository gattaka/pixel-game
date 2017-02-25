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
            var _this = _super.call(this, 350, 2 * Lich.AbstractUI.BORDER + Lich.Resources.PARTS_SIZE) || this;
            _this.healthBar = new PIXI.Graphics();
            _this.willBar = new PIXI.Graphics();
            _this.maxHealth = 0;
            _this.maxWill = 0;
            _this.currentHealth = 0;
            _this.currentWill = 0;
            var self = _this;
            _this.barWidth = _this.fixedWidth - ConditionUI.INNER_BORDER * 2;
            _this.barHeight = _this.fixedHeight / 2 - ConditionUI.INNER_BORDER - ConditionUI.SPACING / 2;
            // podklady 
            var healthBgrBar = new PIXI.Graphics();
            healthBgrBar.lineStyle(2, 0x000000, 0.7);
            healthBgrBar.drawRoundedRect(ConditionUI.INNER_BORDER, ConditionUI.INNER_BORDER, _this.barWidth, _this.barHeight, 3);
            _this.addChild(healthBgrBar);
            var willBgrBar = new PIXI.Graphics();
            willBgrBar.lineStyle(2, 0x000000, 0.7);
            willBgrBar.drawRoundedRect(ConditionUI.INNER_BORDER, _this.fixedHeight / 2 + ConditionUI.SPACING / 2, _this.barWidth, _this.barHeight, 3);
            _this.addChild(willBgrBar);
            // zdraví
            _this.addChild(_this.healthBar);
            _this.healthText = new Lich.Label(" ");
            _this.healthText.y = ConditionUI.INNER_BORDER;
            _this.addChild(_this.healthText);
            // vůle
            _this.addChild(_this.willBar);
            _this.willText = new Lich.Label(" ");
            _this.willText.y = _this.fixedHeight / 2 + ConditionUI.SPACING / 2;
            _this.addChild(_this.willText);
            _this.updateHealthBar();
            _this.updateWillBar();
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
            return _this;
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
            this.healthBar.clear();
            this.healthBar.lineStyle(2, 0x000000, 0.7);
            this.healthBar.beginFill(0xFF0000, 0.7);
            var width = this.barWidth * (this.currentHealth / this.maxHealth);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.healthBar.drawRoundedRect(x, ConditionUI.INNER_BORDER, width, this.barHeight, 3);
            this.healthText.setText(this.currentHealth + "/" + this.maxHealth);
            this.healthText.x = this.fixedWidth / 2 - this.healthText.fixedWidth / 2;
        };
        ConditionUI.prototype.updateWillBar = function () {
            this.willBar.clear();
            this.willBar.lineStyle(2, 0x000000, 0.7);
            this.willBar.beginFill(0x461EFF, 0.7);
            var width = this.barWidth * (this.currentWill / this.maxWill);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.willBar.drawRoundedRect(x, this.fixedHeight / 2 + ConditionUI.SPACING / 2, width, this.barHeight, 3);
            this.willText.setText(this.currentWill + "/" + this.maxWill);
            this.willText.x = this.fixedWidth / 2 - this.willText.fixedWidth / 2;
        };
        return ConditionUI;
    }(Lich.AbstractUI));
    ConditionUI.INNER_BORDER = 5;
    ConditionUI.SPACING = 4;
    Lich.ConditionUI = ConditionUI;
})(Lich || (Lich = {}));
