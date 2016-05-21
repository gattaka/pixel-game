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
            // inventář
            var inventoryUI = new Lich.InventoryUI(game);
            inventoryUI.x = UI.SCREEN_SPACING;
            inventoryUI.y = game.canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            this.addChild(inventoryUI);
            this.inventoryUI = inventoryUI;
            // Schopnosti
            var spellsUI = new Lich.SpellsUI(game);
            spellsUI.x = game.canvas.width / 2 - spellsUI.width / 2;
            spellsUI.y = game.canvas.height - spellsUI.height - UI.SCREEN_SPACING;
            this.addChild(spellsUI);
            this.spellsUI = spellsUI;
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
                this.stateCont = new createjs.Container();
                this.stateCont.width = 350;
                this.stateCont.height = 160;
                this.stateCont.x = game.canvas.width - this.stateCont.width - 20;
                this.stateCont.y = game.canvas.height - this.stateCont.height - 20;
                var outerShape = new createjs.Shape();
                outerShape.graphics.setStrokeStyle(2);
                outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
                outerShape.graphics.beginFill("rgba(255,0,0,0.7)");
                outerShape.graphics.drawRect(0, 80, 250, 25);
                outerShape.graphics.beginFill("rgba(70,30,255,0.7)");
                outerShape.graphics.drawRect(0, 110, 250, 25);
                this.stateCont.addChild(outerShape);
                var skull = this.game.resources.getBitmap(Lich.Resources.SKULL_KEY);
                skull.x = this.stateCont.width - skull.image.width;
                skull.y = this.stateCont.height - skull.image.height;
                this.stateCont.addChild(skull);
                this.addChild(this.stateCont);
            })();
        }
        UI.prototype.isMouseInUI = function (x, y) {
            var uiHit = false;
            this.children.forEach(function (item) {
                if (item.hitTest(x - item.x, y - item.y) === true) {
                    uiHit = true;
                    return;
                }
            });
            return uiHit;
        };
        UI.prototype.handleMouse = function (mouse, delta) {
            this.children.forEach(function (item) {
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
})(Lich || (Lich = {}));
