namespace Lich {
    export class UI extends createjs.Container {

        static SCREEN_SPACING = 20;

        stateCont: createjs.Container;
        charCont: createjs.Container;
        inventoryUI: InventoryUI;
        spellsUI: SpellsUI;
        musicUI: MusicUI;

        constructor(public game) {
            super();

            var self = this;

            // inventář
            var inventoryUI = new InventoryUI(game);
            inventoryUI.x = UI.SCREEN_SPACING;
            inventoryUI.y = game.canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            self.addChild(inventoryUI);
            self.inventoryUI = inventoryUI;

            // Schopnosti
            var spellsUI = new SpellsUI(game);
            spellsUI.x = game.canvas.width / 2 - spellsUI.width / 2;
            spellsUI.y = game.canvas.height - spellsUI.height - UI.SCREEN_SPACING;
            self.addChild(spellsUI);
            self.spellsUI = spellsUI;

            // Hudba
            var musicUI = new MusicUI(game);
            musicUI.x = game.canvas.width / 2 - musicUI.width / 2;
            musicUI.y = UI.SCREEN_SPACING
            self.addChild(musicUI);
            self.musicUI = musicUI;

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
            (function() {
                self.stateCont = new createjs.Container();
                self.stateCont.width = 350;
                self.stateCont.height = 160;
                self.stateCont.x = game.canvas.width - self.stateCont.width - 20;
                self.stateCont.y = game.canvas.height - self.stateCont.height - 20;

                var outerShape = new createjs.Shape();
                outerShape.graphics.setStrokeStyle(2);
                outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
                outerShape.graphics.beginFill("rgba(255,0,0,0.7)");
                outerShape.graphics.drawRect(0, 80, 250, 25);
                outerShape.graphics.beginFill("rgba(70,30,255,0.7)");
                outerShape.graphics.drawRect(0, 110, 250, 25);
                self.stateCont.addChild(outerShape);

                var skull = self.game.resources.getBitmap(Resources.SKULL_KEY);
                skull.x = self.stateCont.width - skull.image.width;
                skull.y = self.stateCont.height - skull.image.height;
                self.stateCont.addChild(skull);
                self.addChild(self.stateCont);
            })();
        }

        isMouseInUI(x: number, y: number): boolean {
            var self = this;
            var uiHit = false;
            self.children.forEach(function(item) {
                if (item.hitTest(x - item.x, y - item.y) === true) {
                    uiHit = true;
                    return;
                }
            });
            return uiHit;
        }

        handleMouse(mouse: Mouse, delta: number) {
            var self = this;
            self.children.forEach(function(item) {
                if (item.hitTest(mouse.x - item.x, mouse.y - item.y) === true) {
                    if (typeof item["handleMouse"] !== "undefined") {
                        item["handleMouse"](mouse);
                        return;
                    }
                }
            });
        }
    }

}