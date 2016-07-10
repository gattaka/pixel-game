var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var UI = (function (_super) {
        __extends(UI, _super);
        function UI(game) {
            _super.call(this);
            this.game = game;
            var self = this;
            // SplashScreen
            self.splashScreenUI = new Lich.SplashScreenUI();
            self.splashScreenUI.x = game.canvas.width / 2 - self.splashScreenUI.width / 2;
            self.splashScreenUI.y = game.canvas.height / 2 - self.splashScreenUI.height / 2;
            self.addChild(self.splashScreenUI);
            // Inventář
            var inventoryUI = new Lich.InventoryUI();
            inventoryUI.x = UI.SCREEN_SPACING;
            inventoryUI.y = game.canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            self.addChild(inventoryUI);
            self.inventoryUI = inventoryUI;
            // Schopnosti
            var spellsUI = new Lich.SpellsUI();
            spellsUI.x = game.canvas.width / 2 - spellsUI.width / 2;
            spellsUI.y = game.canvas.height - spellsUI.height - UI.SCREEN_SPACING;
            self.addChild(spellsUI);
            self.spellsUI = spellsUI;
            // Hudba
            var musicUI = new Lich.MusicUI();
            musicUI.x = game.canvas.width / 2 - musicUI.width / 2;
            musicUI.y = UI.SCREEN_SPACING;
            self.addChild(musicUI);
            self.musicUI = musicUI;
            // Stav (mana, zdraví)
            var conditionUI = new ConditionUI();
            conditionUI.x = game.canvas.width - conditionUI.width - UI.SCREEN_SPACING;
            conditionUI.y = game.canvas.height - conditionUI.height - UI.SCREEN_SPACING;
            self.addChild(conditionUI);
            self.conditionUI = conditionUI;
            /*
             // přehled postavy
             (function () {
             
             var CHAR_WIDTH = 300;
             var CHAR_HEIGHT = 500;
             
             var HELMET_WIDTH = 100;
             var HELMET_HEIGHT = 100;
             
             var TORSO_WIDTH = 200;
             var TORSO_HEIGHT = 150;
             
             var GAUNTLET_WIDTH = 100;
             var GAUNTLET_HEIGHT = 100;
             
             // vnější kontejner
             charCont = new createjs.Container();
             charCont.x = game.canvas.width - CHAR_WIDTH - 20;
             charCont.y = 40 + 200;
             self.addChild(charCont);
             
             var outerShape = new createjs.Shape();
             outerShape.graphics.setStrokeStyle(2);
             outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
             outerShape.graphics.beginFill("rgba(70,50,10,0.5)");
             outerShape.graphics.drawRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
             charCont.addChild(outerShape);
             
             // helmet
             var helmetCont = new createjs.Container();
             helmetCont.x = CHAR_WIDTH / 2 - HELMET_WIDTH / 2;
             helmetCont.y = 20;
             charCont.addChild(helmetCont);
             
             var helmetBgrShape = new createjs.Shape();
             helmetBgrShape.graphics.setStrokeStyle(2);
             helmetBgrShape.graphics.beginStroke("rgba(0,0,0,0.7)");
             helmetBgrShape.graphics.beginFill("rgba(70,50,10,0.5)");
             helmetBgrShape.graphics.drawRect(0, 0, HELMET_WIDTH, HELMET_HEIGHT);
             helmetCont.addChild(helmetBgrShape);
             
             var helmet = resources.getBitmap(resources.HELMET_KEY);
             helmet.x = 0;
             helmet.y = 0;
             helmetCont.addChild(helmet);
             
             // torso
             var torsoCont = new createjs.Container();
             torsoCont.x = CHAR_WIDTH / 2 - TORSO_WIDTH / 2;
             torsoCont.y = 20 + HELMET_HEIGHT + 20;
             charCont.addChild(torsoCont);
             
             var torsoBgrShape = new createjs.Shape();
             torsoBgrShape.graphics.setStrokeStyle(2);
             torsoBgrShape.graphics.beginStroke("rgba(0,0,0,0.7)");
             torsoBgrShape.graphics.beginFill("rgba(70,50,10,0.5)");
             torsoBgrShape.graphics.drawRect(0, 0, TORSO_WIDTH, TORSO_HEIGHT);
             torsoCont.addChild(torsoBgrShape);
             
             var torso = resources.getBitmap(resources.TORSO_KEY);
             torso.x = 0;
             torso.y = 0;
             torsoCont.addChild(torso);
             
             // gauntlet
             var gauntletCont = new createjs.Container();
             gauntletCont.x = 20;
             gauntletCont.y = 20 + HELMET_HEIGHT + 20 + TORSO_HEIGHT + 20;
             charContChild(gauntletCont);
             
             var gauntletBgrShape = new createjs.Shape();
             gauntletBgrShape.graphics.setStrokeStyle(2);
             gauntletBgrShape.graphics.beginStroke("rgba(0,0,0,0.7)");
             gauntletBgrShape.graphics.beginFill("rgba(70,50,10,0.5)");
             gauntletBgrShape.graphics.drawRect(0, 0, GAUNTLET_WIDTH, GAUNTLET_HEIGHT);
             gauntletCont.addChild(gauntletBgrShape);
             
             var gauntlet = resources.getBitmap(resources.GAUNTLET_KEY);
             gauntlet.x = 0;
             gauntlet.y = 0;
             gauntletCont.addChild(gauntlet);
             
             })();
             */
            // zdraví a mana
            (function () {
                //                var skull = Resources.INSTANCE.getBitmap(Resources.SKULL_KEY);
                //                skull.x = self.stateCont.width - skull.image.width;
                //                skull.y = self.stateCont.height - skull.image.height;
                //                self.stateCont.addChild(skull);
                //                self.addChild(self.stateCont);
            })();
        }
        UI.prototype.isMouseInUI = function (x, y) {
            var self = this;
            var uiHit = false;
            self.children.forEach(function (item) {
                if (item.hitTest(x - item.x, y - item.y) === true) {
                    uiHit = true;
                    return;
                }
            });
            return uiHit;
        };
        UI.prototype.handleMouse = function (mouse, delta) {
            var self = this;
            self.children.forEach(function (item) {
                if (item.hitTest(mouse.x - item.x, mouse.y - item.y) === true) {
                    if (typeof item["handleMouse"] !== "undefined") {
                        item["handleMouse"](mouse);
                        return;
                    }
                }
            });
        };
        UI.SCREEN_SPACING = 20;
        return UI;
    }(createjs.Container));
    Lich.UI = UI;
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
                this.currentHealth = currentHealth;
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
                this.currentWill = currentWill;
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
