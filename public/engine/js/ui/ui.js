var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var UI = (function (_super) {
        __extends(UI, _super);
        function UI(canvas, tilesMap, mobile) {
            _super.call(this);
            this.canvas = canvas;
            // mobile
            this.controls = new Lich.Controls();
            var self = this;
            // Help btn
            if (!mobile) {
                var helpBtn = this.createHelpButton();
                self.addChild(helpBtn);
                helpBtn.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
                helpBtn.y = UI.SCREEN_SPACING;
            }
            else {
                var menuCont_1 = new createjs.Container;
                menuCont_1.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
                menuCont_1.y = UI.SCREEN_SPACING + Button.sideSize + PartsUI.SPACING;
                menuCont_1.visible = false;
                self.addChild(menuCont_1);
                var saveBtn = new Button(Lich.UIGFXKey.UI_SAVE_KEY);
                menuCont_1.addChild(saveBtn);
                saveBtn.on("click", function (evt) {
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    menuCont_1.visible = false;
                }, null, false);
                var loadBtn = new Button(Lich.UIGFXKey.UI_LOAD_KEY);
                loadBtn.y = Button.sideSize + PartsUI.SPACING;
                menuCont_1.addChild(loadBtn);
                loadBtn.on("click", function (evt) {
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_WORLD));
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }, null, false);
                var newbtn = new Button(Lich.UIGFXKey.UI_NEW_WORLD_KEY);
                newbtn.y = 2 * (Button.sideSize + PartsUI.SPACING);
                menuCont_1.addChild(newbtn);
                menuCont_1.on("click", function (evt) {
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.NEW_WORLD));
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }, null, false);
                var helpBtn = this.createHelpButton();
                menuCont_1.addChild(helpBtn);
                helpBtn.y = 3 * (Button.sideSize + PartsUI.SPACING);
                var menuBtn = new Button(Lich.UIGFXKey.UI_MENU_KEY);
                self.addChild(menuBtn);
                menuBtn.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
                menuBtn.y = UI.SCREEN_SPACING;
                menuBtn.on("click", function (evt) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    menuCont_1.visible = !menuCont_1.visible;
                }, null, false);
            }
            // Debug and loging
            if (!mobile) {
                self.debugUI = new Lich.DebugLogUI(400, 0);
                self.debugUI.x = UI.SCREEN_SPACING;
                self.debugUI.y = UI.SCREEN_SPACING;
                self.addChild(self.debugUI);
            }
            // SplashScreen
            self.splashScreenUI = new Lich.SplashScreenUI();
            self.splashScreenUI.x = canvas.width / 2 - self.splashScreenUI.width / 2;
            self.splashScreenUI.y = canvas.height / 2 - self.splashScreenUI.height / 2;
            if (!mobile) {
                self.addChild(self.splashScreenUI);
            }
            // Crafting
            var craftingUI = new Lich.CraftingUI();
            self.addChild(craftingUI);
            self.craftingUI = craftingUI;
            // Crafting recipes 
            var recipeListener = new Lich.RecipeManager(craftingUI.createRecipeAvailChangeListener());
            // Inventář
            var inventoryUI = new Lich.InventoryUI(recipeListener, mobile);
            inventoryUI.x = UI.SCREEN_SPACING;
            inventoryUI.y = canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            self.inventoryUI = inventoryUI;
            self.addChild(inventoryUI);
            if (mobile) {
                self.inventoryUI.toggle();
            }
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
            // let musicUI = new MusicUI();
            // musicUI.x = canvas.width - musicUI.width - UI.SCREEN_SPACING;
            // musicUI.y = canvas.height - UI.SCREEN_SPACING - conditionUI.height - UI.SCREEN_SPACING - musicUI.height;
            // self.addChild(musicUI);
            // self.musicUI = musicUI;
            // Minimapa
            var minimapUI = new Lich.MinimapUI(canvas.width, canvas.height, tilesMap);
            // minimapUI.x = canvas.width / 2 - minimapUI.width / 2;
            // minimapUI.y = canvas.height / 2 - minimapUI.height / 2;
            minimapUI.x = UI.SCREEN_SPACING;
            minimapUI.y = UI.SCREEN_SPACING;
            self.addChild(minimapUI);
            self.minimapUI = minimapUI;
            minimapUI.hide();
            if (mobile) {
                var invBtn = new Button(Lich.UIGFXKey.UI_BACKPACK_KEY);
                invBtn.x = UI.SCREEN_SPACING;
                invBtn.y = UI.SCREEN_SPACING;
                self.addChild(invBtn);
                invBtn.on("click", function (evt) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    self.inventoryUI.prepareForToggle();
                    self.inventoryUI.toggle();
                }, null, false);
                var craftBtn = new Button(Lich.UIGFXKey.UI_CRAFT_KEY);
                craftBtn.x = UI.SCREEN_SPACING + Button.sideSize + PartsUI.SPACING;
                craftBtn.y = UI.SCREEN_SPACING;
                self.addChild(craftBtn);
                craftBtn.on("click", function (evt) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    self.craftingUI.prepareForToggle();
                    self.craftingUI.toggle();
                }, null, false);
                var minimapBtn = new Button(Lich.UIGFXKey.UI_MINIMAP_KEY);
                minimapBtn.x = UI.SCREEN_SPACING + 2 * (Button.sideSize + PartsUI.SPACING);
                minimapBtn.y = UI.SCREEN_SPACING;
                self.addChild(minimapBtn);
                minimapBtn.on("click", function (evt) {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    self.minimapUI.toggle();
                }, null, false);
            }
            if (mobile) {
                var movementCont_1 = new createjs.Container;
                movementCont_1.x = UI.SCREEN_SPACING;
                movementCont_1.y = canvas.height / 2 - Button.sideSize * 1.5 - PartsUI.SPACING;
                self.addChild(movementCont_1);
                var shape = new createjs.Shape();
                shape.graphics.beginStroke("rgba(0,0,0,0.7)");
                shape.graphics.setStrokeStyle(2);
                var radius_1 = 2 * Button.sideSize;
                shape.graphics.beginFill("rgba(10,50,10,0.5)").drawCircle(0, 0, radius_1);
                shape.x = radius_1;
                shape.y = radius_1;
                movementCont_1.addChild(shape);
                var iconRadius = radius_1 - 25;
                for (var i = 0; i < 8; i++) {
                    var angle = -Math.PI * (i * 45) / 180;
                    var x = radius_1 + iconRadius * Math.cos(angle);
                    var y = radius_1 + iconRadius * Math.sin(angle);
                    var key = void 0;
                    switch (i) {
                        case 0:
                            key = Lich.UIGFXKey.UI_RIGHT_KEY;
                            break;
                        case 1:
                            key = Lich.UIGFXKey.UI_RIGHT_UP_KEY;
                            break;
                        case 2:
                            key = Lich.UIGFXKey.UI_UP_KEY;
                            break;
                        case 3:
                            key = Lich.UIGFXKey.UI_LEFT_UP_KEY;
                            break;
                        case 4:
                            key = Lich.UIGFXKey.UI_LEFT_KEY;
                            break;
                        case 5:
                            key = Lich.UIGFXKey.UI_LEFT_DOWN_KEY;
                            break;
                        case 6:
                            key = Lich.UIGFXKey.UI_DOWN_KEY;
                            break;
                        case 7:
                            key = Lich.UIGFXKey.UI_RIGHT_DOWN_KEY;
                            break;
                    }
                    var bitmap = Lich.Resources.getInstance().getBitmap(Lich.UIGFXKey[key]);
                    bitmap.alpha = 0.7;
                    bitmap.x = x - Lich.Resources.TILE_SIZE;
                    bitmap.y = y - Lich.Resources.TILE_SIZE;
                    movementCont_1.addChild(bitmap);
                }
                var directionByTouch_1 = function (x, y) {
                    var angle;
                    var dx = x - radius_1;
                    var dy = radius_1 - y;
                    if (dx == 0) {
                        angle = dy > 0 ? 90 : 270;
                    }
                    else {
                        angle = 180 * Math.atan(dy / dx) / Math.PI;
                        if (angle < 0)
                            angle += 180;
                    }
                    // posuv, aby šipky nebyly na hranici ale uvnitř výseče
                    angle += 45 / 2;
                    switch (Math.floor(angle / 45)) {
                        case 0:
                            self.controls.right = true;
                            break;
                        case 1:
                            self.controls.right = true;
                            self.controls.up = true;
                            break;
                        case 2:
                            self.controls.up = true;
                            break;
                        case 3:
                            self.controls.up = true;
                            self.controls.left = true;
                            break;
                        case 4:
                            self.controls.left = true;
                            break;
                        case 5:
                            self.controls.left = true;
                            self.controls.down = true;
                            break;
                        case 6:
                            self.controls.down = true;
                            break;
                        case 7:
                            self.controls.down = true;
                            self.controls.right = true;
                            break;
                    }
                };
                movementCont_1.on("mousedown", function (evt) {
                    self.controls = new Lich.Controls();
                    directionByTouch_1(evt.stageX - movementCont_1.x, evt.stageY - movementCont_1.y);
                }, null, false);
                movementCont_1.on("pressup", function (evt) {
                    self.controls = new Lich.Controls();
                }, null, false);
                movementCont_1.on("pressmove", function (evt) {
                    self.controls = new Lich.Controls();
                    directionByTouch_1(evt.stageX - movementCont_1.x, evt.stageY - movementCont_1.y);
                }, null, false);
            }
        }
        UI.prototype.createHelpButton = function () {
            var helpBtn = new Button(Lich.UIGFXKey.UI_HELP_KEY);
            helpBtn.on("mousedown", function (evt) {
                window.open("help.html", "_blank");
            }, null, false);
            return helpBtn;
        };
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
