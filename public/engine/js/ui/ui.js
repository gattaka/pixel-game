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
            var _this = _super.call(this) || this;
            _this.canvas = canvas;
            // mobile
            _this.controls = new Lich.Controls();
            var self = _this;
            // Minimap render
            var minimapRender = new Lich.MinimapRender(canvas.width, canvas.height, tilesMap);
            // Minimapa
            var minimapUI = new Lich.MinimapUI(canvas.width, canvas.height, minimapRender);
            minimapUI.x = canvas.width - UI.SCREEN_SPACING - minimapUI.fixedWidth;
            minimapUI.y = UI.SCREEN_SPACING;
            self.minimapUI = minimapUI;
            // self.addChild(minimapUI);
            // mapa
            var mapUI = new Lich.MapUI(canvas.width, canvas.height, minimapRender);
            mapUI.x = UI.SCREEN_SPACING;
            mapUI.y = UI.SCREEN_SPACING;
            self.mapUI = mapUI;
            mapUI.hide();
            // self.addChild(mapUI);
            // Help btn
            if (!mobile) {
                var helpBtn = _this.createHelpButton();
                self.addChild(helpBtn);
                helpBtn.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING - minimapUI.fixedWidth - PartsUI.SPACING;
                helpBtn.y = UI.SCREEN_SPACING;
            }
            else {
                var menuCont_1 = new PIXI.Container();
                menuCont_1.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
                menuCont_1.y = UI.SCREEN_SPACING + Button.sideSize + PartsUI.SPACING;
                menuCont_1.visible = false;
                self.addChild(menuCont_1);
                var saveBtn = new Button(Lich.UISpriteKey.UI_SAVE_KEY);
                menuCont_1.addChild(saveBtn);
                saveBtn.on("click", function () {
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    menuCont_1.visible = false;
                });
                var loadBtn = new Button(Lich.UISpriteKey.UI_LOAD_KEY);
                loadBtn.y = Button.sideSize + PartsUI.SPACING;
                menuCont_1.addChild(loadBtn);
                loadBtn.on("click", function () {
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_WORLD));
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                });
                var newbtn = new Button(Lich.UISpriteKey.UI_NEW_WORLD_KEY);
                newbtn.y = 2 * (Button.sideSize + PartsUI.SPACING);
                menuCont_1.addChild(newbtn);
                menuCont_1.on("click", function () {
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.NEW_WORLD));
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                });
                var helpBtn = _this.createHelpButton();
                menuCont_1.addChild(helpBtn);
                helpBtn.y = 3 * (Button.sideSize + PartsUI.SPACING);
                var menuBtn = new Button(Lich.UISpriteKey.UI_MENU_KEY);
                self.addChild(menuBtn);
                menuBtn.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
                menuBtn.y = UI.SCREEN_SPACING;
                menuBtn.on("click", function () {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    menuCont_1.visible = !menuCont_1.visible;
                });
            }
            // Debug and loging
            if (!mobile) {
                self.debugUI = new Lich.DebugLogUI(600, 0);
                self.debugUI.x = UI.SCREEN_SPACING;
                self.debugUI.y = UI.SCREEN_SPACING;
                self.addChild(self.debugUI);
            }
            // SplashScreen
            self.splashScreenUI = new Lich.SplashScreenUI();
            self.splashScreenUI.x = canvas.width / 2 - self.splashScreenUI.fixedWidth / 2;
            self.splashScreenUI.y = canvas.height / 2 - self.splashScreenUI.fixedHeight / 2;
            if (!mobile) {
                self.addChild(self.splashScreenUI);
            }
            // Crafting
            var craftingUI = new Lich.CraftingUI();
            self.addChild(craftingUI);
            self.craftingUI = craftingUI;
            // Inventář
            var inventoryUI;
            if (mobile) {
                var n = Math.floor(canvas.width / (Lich.Resources.PARTS_SIZE + PartsUI.SPACING)) - 4 - 1 - 3;
                var m = Math.floor(canvas.height / (Lich.Resources.PARTS_SIZE + PartsUI.SPACING)) - 4;
                inventoryUI = new Lich.InventoryUI(n, m);
                inventoryUI.x = inventoryUI.expandedX = 4 * Button.sideSize + 2 * UI.SCREEN_SPACING;
                inventoryUI.y = inventoryUI.expandedY = canvas.height / 2 - inventoryUI.height / 2;
            }
            else {
                inventoryUI = new Lich.InventoryUI();
                inventoryUI.x = inventoryUI.expandedX = UI.SCREEN_SPACING;
                inventoryUI.y = inventoryUI.expandedY = canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            }
            self.inventoryUI = inventoryUI;
            self.addChild(inventoryUI);
            if (mobile) {
                inventoryUI.collapsedX = UI.SCREEN_SPACING;
                inventoryUI.collapsedY = canvas.height - PartsUI.pixelsByX(1) - UI.SCREEN_SPACING;
                inventoryUI.toggle();
            }
            craftingUI.setInventoryUI(inventoryUI);
            craftingUI.x = UI.SCREEN_SPACING;
            // musí se posunout víc, protože má externí řádek pro ingredience
            craftingUI.x = canvas.width / 2 - craftingUI.fixedWidth / 2;
            craftingUI.y = canvas.height / 2 - craftingUI.fixedHeight / 2 - Lich.Resources.PARTS_SIZE - PartsUI.SELECT_BORDER * 2;
            craftingUI.hide();
            // Schopnosti
            var spellsUI = new Lich.SpellsUI();
            spellsUI.x = canvas.width / 2 - spellsUI.fixedWidth / 2;
            spellsUI.y = UI.SCREEN_SPACING;
            self.spellsUI = spellsUI;
            // self.addChild(spellsUI);
            // Stav (mana, zdraví)
            var conditionUI = new Lich.ConditionUI();
            conditionUI.x = canvas.width - conditionUI.fixedWidth - UI.SCREEN_SPACING;
            conditionUI.y = canvas.height - conditionUI.fixedHeight - UI.SCREEN_SPACING;
            self.conditionUI = conditionUI;
            // self.addChild(conditionUI);
            // Hudba
            // let musicUI = new MusicUI();
            // musicUI.x = canvas.width - musicUI.width - UI.SCREEN_SPACING;
            // musicUI.y = canvas.height - UI.SCREEN_SPACING - conditionUI.height - UI.SCREEN_SPACING - musicUI.height;
            // self.addChild(musicUI);
            // self.musicUI = musicUI;
            // Achievements info
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.ACHIEVEMENT_DONE, function (payload) {
                var achvCont = new PIXI.Container();
                var achvImgSide = 80;
                var w = 300;
                var h = achvImgSide + 2 * AbstractUI.BORDER;
                var bgr = new UIBackground();
                bgr.drawBackground(w, h);
                achvCont.addChild(bgr);
                var achvDef = Lich.Resources.getInstance().achievementsDefs[payload.payload];
                var sprite = Lich.Resources.getInstance().getAchvUISprite(achvDef.key);
                achvCont.addChild(sprite);
                sprite.x = AbstractUI.BORDER;
                sprite.y = AbstractUI.BORDER;
                var nameLabelSize = 20;
                var nameLabel = new Lich.Label(achvDef.name);
                achvCont.addChild(nameLabel);
                nameLabel.x = achvImgSide + AbstractUI.BORDER + PartsUI.SPACING;
                nameLabel.y = AbstractUI.BORDER;
                var mottoLabelSize = 17;
                var mottoLabel = new Lich.Label("\"" + achvDef.motto + "\"");
                achvCont.addChild(mottoLabel);
                mottoLabel.x = nameLabel.x;
                mottoLabel.y = nameLabel.y + nameLabelSize + PartsUI.SPACING;
                mottoLabel.setLineHeight(mottoLabelSize + 3);
                mottoLabel.setLineWidth(w - AbstractUI.BORDER * 2 - achvImgSide - PartsUI.SPACING);
                self.addChild(achvCont);
                achvCont.x = canvas.width / 2 - w / 2;
                achvCont.y = canvas.height;
                // vyjeď s panelem achievementu
                createjs.Tween.get(achvCont)
                    .to({
                    y: canvas.height - h
                }, 500).call(function () {
                    // vyčkej 
                    setTimeout(function () {
                        // zajeď s panelem zpět
                        createjs.Tween.get(achvCont)
                            .to({
                            y: canvas.height
                        }, 500).call(function () {
                            self.removeChild(achvCont);
                        });
                    }, 10000);
                });
                return false;
            });
            if (mobile) {
                var invBtn = new Button(Lich.UISpriteKey.UI_BACKPACK_KEY);
                invBtn.x = UI.SCREEN_SPACING;
                invBtn.y = UI.SCREEN_SPACING;
                self.addChild(invBtn);
                invBtn.on("click", function () {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    self.inventoryUI.prepareForToggle();
                    self.inventoryUI.toggle();
                });
                var craftBtn = new Button(Lich.UISpriteKey.UI_CRAFT_KEY);
                craftBtn.x = UI.SCREEN_SPACING + Button.sideSize + PartsUI.SPACING;
                craftBtn.y = UI.SCREEN_SPACING;
                self.addChild(craftBtn);
                craftBtn.on("click", function () {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    self.craftingUI.prepareForToggle();
                    self.craftingUI.toggle();
                });
                var minimapBtn = new Button(Lich.UISpriteKey.UI_MINIMAP_KEY);
                minimapBtn.x = UI.SCREEN_SPACING + 2 * (Button.sideSize + PartsUI.SPACING);
                minimapBtn.y = UI.SCREEN_SPACING;
                self.addChild(minimapBtn);
                minimapBtn.on("click", function () {
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                    self.mapUI.show();
                });
            }
            if (mobile) {
                var movementCont = new PIXI.Container();
                movementCont.x = UI.SCREEN_SPACING;
                movementCont.y = canvas.height / 2 - Button.sideSize * 1.5 - PartsUI.SPACING;
                self.addChild(movementCont);
                var shape = new PIXI.Graphics();
                shape.lineStyle(2, 0x000000, 0.7);
                var radius_1 = 2 * Button.sideSize;
                shape.beginFill(0x0a320a, 0.5).drawCircle(0, 0, radius_1);
                shape.x = radius_1;
                shape.y = radius_1;
                movementCont.addChild(shape);
                var iconRadius = radius_1 - 25;
                for (var i = 0; i < 8; i++) {
                    var angle = -Math.PI * (i * 45) / 180;
                    var x = radius_1 + iconRadius * Math.cos(angle);
                    var y = radius_1 + iconRadius * Math.sin(angle);
                    var key = void 0;
                    switch (i) {
                        case 0:
                            key = Lich.UISpriteKey.UI_RIGHT_KEY;
                            break;
                        case 1:
                            key = Lich.UISpriteKey.UI_RIGHT_UP_KEY;
                            break;
                        case 2:
                            key = Lich.UISpriteKey.UI_UP_KEY;
                            break;
                        case 3:
                            key = Lich.UISpriteKey.UI_LEFT_UP_KEY;
                            break;
                        case 4:
                            key = Lich.UISpriteKey.UI_LEFT_KEY;
                            break;
                        case 5:
                            key = Lich.UISpriteKey.UI_LEFT_DOWN_KEY;
                            break;
                        case 6:
                            key = Lich.UISpriteKey.UI_DOWN_KEY;
                            break;
                        case 7:
                            key = Lich.UISpriteKey.UI_RIGHT_DOWN_KEY;
                            break;
                    }
                    var sprite = Lich.Resources.getInstance().getUISprite(key);
                    sprite.alpha = 0.7;
                    sprite.x = x - Lich.Resources.TILE_SIZE;
                    sprite.y = y - Lich.Resources.TILE_SIZE;
                    movementCont.addChild(sprite);
                }
                var directionByTouch = function (x, y) {
                    var angle;
                    var dx = x - radius_1;
                    var dy = radius_1 - y;
                    var c = Math.sqrt(dx * dx + dy * dy);
                    angle = 180 * Math.asin(dy / c) / Math.PI;
                    if (dx > 0 && dy > 0) { }
                    if (dx < 0 && dy > 0) {
                        angle = 180 - angle;
                    }
                    if (dx < 0 && dy < 0) {
                        angle = 180 - angle;
                    }
                    if (dx > 0 && dy < 0) {
                        angle = 360 + angle;
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
            }
            return _this;
        }
        UI.prototype.createHelpButton = function () {
            var helpBtn = new Button(Lich.UISpriteKey.UI_HELP_KEY);
            helpBtn.on("mousedown", function () {
                window.open("help.html", "_blank");
            });
            return helpBtn;
        };
        UI.prototype.isMouseInUI = function (x, y) {
            var self = this;
            var uiHit = false;
            self.children.forEach(function (item) {
                // TODO?
                // if (item.hit(x - item.x, y - item.y) === true) {
                //     uiHit = true;
                //     return;
                // }
            });
            return uiHit;
        };
        return UI;
    }(PIXI.Container));
    UI.SCREEN_SPACING = 20;
    Lich.UI = UI;
    var UIBackground = (function (_super) {
        __extends(UIBackground, _super);
        function UIBackground() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIBackground.prototype.drawBackground = function (width, height) {
            this.fixedWidth = width;
            this.fixedHeight = height;
            this.clear();
            this.lineStyle(2, 0x000000, 0.7);
            this.beginFill(0x0a320a, 0.5);
            this.drawRoundedRect(0, 0, width, height, 3);
        };
        return UIBackground;
    }(PIXI.Graphics));
    Lich.UIBackground = UIBackground;
    var AbstractUI = (function (_super) {
        __extends(AbstractUI, _super);
        function AbstractUI(fixedWidth, fixedHeight) {
            var _this = _super.call(this) || this;
            _this.fixedWidth = fixedWidth;
            _this.fixedHeight = fixedHeight;
            _this.toggleFlag = true;
            _this.parentRef = null;
            _this.outerShape = new UIBackground();
            _this.drawBackground();
            _this.addChild(_this.outerShape);
            return _this;
        }
        AbstractUI.prototype.drawBackground = function () {
            this.outerShape.drawBackground(this.fixedWidth, this.fixedHeight);
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
        return AbstractUI;
    }(PIXI.Container));
    AbstractUI.BORDER = 10;
    AbstractUI.TEXT_SIZE = 15;
    Lich.AbstractUI = AbstractUI;
    var UIShape = (function (_super) {
        __extends(UIShape, _super);
        function UIShape(red, green, blue, red2, green2, blue2, op, op2) {
            if (red2 === void 0) { red2 = red; }
            if (green2 === void 0) { green2 = green; }
            if (blue2 === void 0) { blue2 = blue; }
            if (op === void 0) { op = 0.2; }
            if (op2 === void 0) { op2 = 0.5; }
            var _this = _super.call(this) || this;
            _this.beginFill(red << 4 + green << 2 + blue, op);
            _this.lineStyle(2, red2 << 4 + green2 << 2 + blue2, op2);
            var side = Lich.Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            _this.drawRoundedRect(0, 0, side, side, 3);
            return _this;
        }
        return UIShape;
    }(PIXI.Graphics));
    Lich.UIShape = UIShape;
    var Highlight = (function (_super) {
        __extends(Highlight, _super);
        function Highlight() {
            return _super.call(this, 250, 250, 10) || this;
        }
        return Highlight;
    }(UIShape));
    Lich.Highlight = Highlight;
    var PartsUI = (function (_super) {
        __extends(PartsUI, _super);
        function PartsUI(n, m) {
            var _this = _super.call(this, PartsUI.pixelsByX(n), PartsUI.pixelsByX(m)) || this;
            _this.n = n;
            _this.m = m;
            return _this;
        }
        PartsUI.pixelsByX = function (x) {
            return x * Lich.Resources.PARTS_SIZE + (x - 1) * (PartsUI.SPACING) + 2 * AbstractUI.BORDER;
        };
        return PartsUI;
    }(AbstractUI));
    PartsUI.SELECT_BORDER = 5;
    PartsUI.SPACING = 12;
    Lich.PartsUI = PartsUI;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(uiKey) {
            var _this = _super.call(this) || this;
            var bgr = Lich.Resources.getInstance().getUISprite(Lich.UISpriteKey.UI_BUTTON_KEY);
            _this.addChild(bgr);
            bgr.x = 0;
            bgr.y = 0;
            if (uiKey) {
                var sprite = Lich.Resources.getInstance().getUISprite(uiKey);
                _this.addChild(sprite);
                sprite.x = PartsUI.SELECT_BORDER;
                sprite.y = PartsUI.SELECT_BORDER;
            }
            _this.hitArea = new PIXI.Rectangle(0, 0, Button.sideSize, Button.sideSize);
            return _this;
        }
        return Button;
    }(PIXI.Container));
    Button.sideSize = Lich.Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
    Lich.Button = Button;
})(Lich || (Lich = {}));
