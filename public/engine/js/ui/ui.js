var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var UI = (function (_super) {
        __extends(UI, _super);
        function UI(canvas, tilesMap) {
            _super.call(this);
            this.canvas = canvas;
            var self = this;
            // Debug and loging
            self.debugUI = new Lich.DebugLogUI(400, 0);
            self.debugUI.x = UI.SCREEN_SPACING;
            self.debugUI.y = UI.SCREEN_SPACING;
            self.addChild(self.debugUI);
            // SplashScreen
            self.splashScreenUI = new Lich.SplashScreenUI();
            self.splashScreenUI.x = canvas.width / 2 - self.splashScreenUI.width / 2;
            self.splashScreenUI.y = canvas.height / 2 - self.splashScreenUI.height / 2;
            self.addChild(self.splashScreenUI);
            // Crafting
            var craftingUI = new Lich.CraftingUI();
            self.addChild(craftingUI);
            self.craftingUI = craftingUI;
            // Crafting recipes 
            var recipeListener = new Lich.RecipeManager(craftingUI.createRecipeAvailChangeListener());
            // Inventář
            var inventoryUI = new Lich.InventoryUI(recipeListener);
            inventoryUI.x = UI.SCREEN_SPACING;
            inventoryUI.y = canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            self.addChild(inventoryUI);
            self.inventoryUI = inventoryUI;
            craftingUI.setInventoryUI(inventoryUI);
            craftingUI.x = UI.SCREEN_SPACING;
            // musí se posunout víc, protože má externí řádek pro ingredience
            craftingUI.x = canvas.width / 2 - craftingUI.width / 2;
            craftingUI.y = canvas.height / 2 - craftingUI.height / 2 - Lich.Resources.PARTS_SIZE - PartsUI.SELECT_BORDER * 2;
            craftingUI.hide();
            // Schopnosti
            var spellsUI = new Lich.SpellsUI();
            spellsUI.x = canvas.width / 2 - spellsUI.width / 2;
            spellsUI.y = UI.SCREEN_SPACING;
            self.addChild(spellsUI);
            self.spellsUI = spellsUI;
            // Stav (mana, zdraví)
            var conditionUI = new Lich.ConditionUI();
            conditionUI.x = canvas.width - conditionUI.width - UI.SCREEN_SPACING;
            conditionUI.y = canvas.height - conditionUI.height - UI.SCREEN_SPACING;
            self.addChild(conditionUI);
            self.conditionUI = conditionUI;
            // Hudba
            var musicUI = new Lich.MusicUI();
            musicUI.x = canvas.width - musicUI.width - UI.SCREEN_SPACING;
            musicUI.y = canvas.height - UI.SCREEN_SPACING - conditionUI.height - UI.SCREEN_SPACING - musicUI.height;
            self.addChild(musicUI);
            self.musicUI = musicUI;
            // Minimapa
            var minimapUI = new Lich.MinimapUI(canvas.width, canvas.height, tilesMap);
            // minimapUI.x = canvas.width / 2 - minimapUI.width / 2;
            // minimapUI.y = canvas.height / 2 - minimapUI.height / 2;
            minimapUI.x = UI.SCREEN_SPACING;
            minimapUI.y = UI.SCREEN_SPACING;
            self.addChild(minimapUI);
            self.minimapUI = minimapUI;
            minimapUI.hide();
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
    var UIBackground = (function (_super) {
        __extends(UIBackground, _super);
        function UIBackground() {
            _super.apply(this, arguments);
        }
        UIBackground.prototype.drawBackground = function (width, height) {
            this.width = width;
            this.height = height;
            this.graphics.clear();
            this.graphics.setStrokeStyle(2);
            this.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.graphics.beginFill("rgba(10,50,10,0.5)");
            this.graphics.drawRoundRect(0, 0, width, height, 3);
        };
        return UIBackground;
    }(createjs.Shape));
    Lich.UIBackground = UIBackground;
    var AbstractUI = (function (_super) {
        __extends(AbstractUI, _super);
        function AbstractUI(width, height) {
            _super.call(this);
            this.width = width;
            this.height = height;
            this.toggleFlag = true;
            this.parentRef = null;
            this.outerShape = new UIBackground();
            this.drawBackground();
            this.addChild(this.outerShape);
        }
        AbstractUI.prototype.drawBackground = function () {
            this.outerShape.drawBackground(this.width, this.height);
        };
        AbstractUI.prototype.hide = function () {
            if (this.parent) {
                this.parentRef = this.parent;
                this.parent.removeChild(this);
            }
        };
        AbstractUI.prototype.show = function () {
            this.parentRef.addChild(this);
        };
        AbstractUI.prototype.toggle = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                if (self.parent == null) {
                    self.show();
                }
                else {
                    self.hide();
                }
                self.toggleFlag = false;
            }
        };
        AbstractUI.prototype.suppressToggle = function () {
            this.toggleFlag = false;
        };
        AbstractUI.prototype.prepareForToggle = function () {
            this.toggleFlag = true;
        };
        AbstractUI.BORDER = 10;
        AbstractUI.TEXT_SIZE = 15;
        return AbstractUI;
    }(createjs.Container));
    Lich.AbstractUI = AbstractUI;
    var UIShape = (function (_super) {
        __extends(UIShape, _super);
        function UIShape(red, green, blue, red2, green2, blue2, op, op2) {
            if (red2 === void 0) { red2 = red; }
            if (green2 === void 0) { green2 = green; }
            if (blue2 === void 0) { blue2 = blue; }
            if (op === void 0) { op = 0.2; }
            if (op2 === void 0) { op2 = 0.5; }
            _super.call(this);
            this.graphics.beginFill("rgba(" + red + "," + green + "," + blue + "," + op + ")");
            this.graphics.beginStroke("rgba(" + red2 + "," + green2 + "," + blue2 + "," + op2 + ")");
            this.graphics.setStrokeStyle(2);
            var side = Lich.Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            this.graphics.drawRoundRect(0, 0, side, side, 3);
        }
        return UIShape;
    }(createjs.Shape));
    Lich.UIShape = UIShape;
    var Highlight = (function (_super) {
        __extends(Highlight, _super);
        function Highlight() {
            _super.call(this, 250, 250, 10);
        }
        return Highlight;
    }(UIShape));
    Lich.Highlight = Highlight;
    var PartsUI = (function (_super) {
        __extends(PartsUI, _super);
        function PartsUI(n, m) {
            _super.call(this, PartsUI.pixelsByX(n), PartsUI.pixelsByX(m));
            this.n = n;
            this.m = m;
        }
        PartsUI.pixelsByX = function (x) {
            return x * Lich.Resources.PARTS_SIZE + (x - 1) * (PartsUI.SPACING) + 2 * AbstractUI.BORDER;
        };
        PartsUI.SELECT_BORDER = 5;
        PartsUI.SPACING = 12;
        return PartsUI;
    }(AbstractUI));
    Lich.PartsUI = PartsUI;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(bitmap) {
            _super.call(this);
            var bgr = new UIShape(10, 50, 10, 0, 0, 0, 0.5, 0.7);
            this.addChild(bgr);
            bgr.x = 0;
            bgr.y = 0;
            if (bitmap) {
                var btmp = Lich.Resources.getInstance().getBitmap(Lich.UIGFXKey[bitmap]);
                this.addChild(btmp);
                btmp.x = PartsUI.SELECT_BORDER;
                btmp.y = PartsUI.SELECT_BORDER;
            }
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Button.sideSize, Button.sideSize);
            this.hitArea = hitArea;
        }
        Button.sideSize = Lich.Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
        return Button;
    }(createjs.Container));
    Lich.Button = Button;
})(Lich || (Lich = {}));
