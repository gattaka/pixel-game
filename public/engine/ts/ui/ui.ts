namespace Lich {

    export class UI extends PIXI.Container {

        static SCREEN_SPACING = 20;

        charCont: PIXI.Container;

        debugUI: DebugLogUI;
        inventoryUI: InventoryUI;
        spellsUI: SpellsUI;
        musicUI: MusicUI;
        conditionUI: ConditionUI;
        craftingUI: CraftingUI;
        mapUI: MapUI;
        minimapUI: MinimapUI;

        splashScreenUI: SplashScreenUI;

        private createHelpButton() {
            let helpBtn = new Button(UISpriteKey.UI_HELP_KEY, () => {
                window.open("help.html", "_blank");
            });
            return helpBtn;
        }

        constructor(public canvas: HTMLCanvasElement, tilesMap: TilesMap, mobile: boolean) {
            super();

            let self = this;

            // Minimap render
            let minimapRender = new MinimapRender(canvas.width, canvas.height, tilesMap)

            // Minimapa
            let minimapUI = new MinimapUI(canvas.width, canvas.height, minimapRender);
            minimapUI.x = canvas.width - UI.SCREEN_SPACING - minimapUI.fixedWidth;
            minimapUI.y = UI.SCREEN_SPACING;
            self.minimapUI = minimapUI;
            // self.addChild(minimapUI);

            // mapa
            let mapUI = new MapUI(canvas.width, canvas.height, minimapRender);
            mapUI.x = UI.SCREEN_SPACING;
            mapUI.y = UI.SCREEN_SPACING;
            self.mapUI = mapUI;
            mapUI.hide();
            // self.addChild(mapUI);

            // Help btn
            if (!mobile) {
                let helpBtn = this.createHelpButton();
                self.addChild(helpBtn);
                helpBtn.x = canvas.width - Button.SIDE_SIZE - UI.SCREEN_SPACING - minimapUI.fixedWidth - PartsUI.SPACING;
                helpBtn.y = UI.SCREEN_SPACING;
            } else {
                let menuCont = new PIXI.Container();
                menuCont.x = canvas.width - Button.SIDE_SIZE - UI.SCREEN_SPACING;
                menuCont.y = UI.SCREEN_SPACING + Button.SIDE_SIZE + PartsUI.SPACING;
                menuCont.visible = false;
                self.addChild(menuCont);

                let saveBtn = new Button(UISpriteKey.UI_SAVE_KEY, () => {
                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    menuCont.visible = false;
                });
                menuCont.addChild(saveBtn);

                let loadBtn = new Button(UISpriteKey.UI_LOAD_KEY, () => {
                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_WORLD));
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                });
                loadBtn.y = Button.SIDE_SIZE + PartsUI.SPACING;
                menuCont.addChild(loadBtn);

                let newbtn = new Button(UISpriteKey.UI_NEW_WORLD_KEY, () => {
                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.NEW_WORLD));
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                });
                newbtn.y = 2 * (Button.SIDE_SIZE + PartsUI.SPACING);
                menuCont.addChild(newbtn);

                let helpBtn = this.createHelpButton();
                menuCont.addChild(helpBtn);
                helpBtn.y = 3 * (Button.SIDE_SIZE + PartsUI.SPACING);

                let menuBtn = new Button(UISpriteKey.UI_MENU_KEY, () => {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    menuCont.visible = !menuCont.visible;
                });
                self.addChild(menuBtn);
                menuBtn.x = canvas.width - Button.SIDE_SIZE - UI.SCREEN_SPACING;
                menuBtn.y = UI.SCREEN_SPACING;
            }

            // Debug and loging
            if (!mobile) {
                self.debugUI = new DebugLogUI(600, 0);
                self.debugUI.x = UI.SCREEN_SPACING;
                self.debugUI.y = UI.SCREEN_SPACING;
                self.addChild(self.debugUI);
            }

            // SplashScreen
            self.splashScreenUI = new SplashScreenUI();
            self.splashScreenUI.x = canvas.width / 2 - self.splashScreenUI.fixedWidth / 2;
            self.splashScreenUI.y = canvas.height / 2 - self.splashScreenUI.fixedHeight / 2;
            if (!mobile) {
                self.addChild(self.splashScreenUI);
            }

            // Crafting
            let craftingUI = new CraftingUI();
            self.addChild(craftingUI);
            self.craftingUI = craftingUI;

            // Inventář
            let inventoryUI;
            if (mobile) {
                let n = Math.floor(canvas.width / (Resources.PARTS_SIZE + PartsUI.SPACING)) - 4 - 1 - 3;
                let m = Math.floor(canvas.height / (Resources.PARTS_SIZE + PartsUI.SPACING)) - 4;
                inventoryUI = new InventoryUI(n, m);
                inventoryUI.x = inventoryUI.expandedX = 4 * Button.SIDE_SIZE + 2 * UI.SCREEN_SPACING;
                inventoryUI.y = inventoryUI.expandedY = canvas.height / 2 - inventoryUI.height / 2;
            } else {
                inventoryUI = new InventoryUI();
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

            craftingUI.x = UI.SCREEN_SPACING;
            // musí se posunout víc, protože má externí řádek pro ingredience
            craftingUI.x = canvas.width / 2 - craftingUI.fixedWidth / 2;
            craftingUI.y = canvas.height / 2 - craftingUI.fixedHeight / 2 - Resources.PARTS_SIZE - PartsUI.SELECT_BORDER * 2;
            craftingUI.hide();

            // Schopnosti
            let spellsUI = new SpellsUI();
            spellsUI.x = canvas.width / 2 - spellsUI.fixedWidth / 2;
            spellsUI.y = UI.SCREEN_SPACING;
            self.spellsUI = spellsUI;
            self.addChild(spellsUI);

            // Stav (mana, zdraví)
            let conditionUI = new ConditionUI();
            conditionUI.x = canvas.width - conditionUI.fixedWidth - UI.SCREEN_SPACING;
            conditionUI.y = canvas.height - conditionUI.fixedHeight - UI.SCREEN_SPACING;
            self.conditionUI = conditionUI;
            self.addChild(conditionUI);

            // Hudba
            // let musicUI = new MusicUI();
            // musicUI.x = canvas.width - musicUI.width - UI.SCREEN_SPACING;
            // musicUI.y = canvas.height - UI.SCREEN_SPACING - conditionUI.height - UI.SCREEN_SPACING - musicUI.height;
            // self.addChild(musicUI);
            // self.musicUI = musicUI;

            // Achievements info
            EventBus.getInstance().registerConsumer(EventType.ACHIEVEMENT_DONE, (payload: StringEventPayload): boolean => {
                let achvCont = new PIXI.Container();

                let achvImgSide = 80;
                let w = 300;
                let h = achvImgSide + 2 * AbstractUI.BORDER
                let bgr = new UIBackground();
                bgr.drawBackground(w, h);
                achvCont.addChild(bgr);

                let achvDef = Resources.getInstance().achievementsDefs[payload.payload];
                let sprite = Resources.getInstance().getAchvUISprite(achvDef.key);
                achvCont.addChild(sprite);
                sprite.x = AbstractUI.BORDER;
                sprite.y = AbstractUI.BORDER;

                let nameLabelSize = 20;
                let nameLabel = new Label(achvDef.name);
                achvCont.addChild(nameLabel);
                nameLabel.x = achvImgSide + AbstractUI.BORDER + PartsUI.SPACING;
                nameLabel.y = AbstractUI.BORDER;

                let mottoLabelSize = 17;
                let mottoLabel = new Label("\"" + achvDef.motto + "\"");
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
                        setTimeout(() => {
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
                let invBtn = new Button(UISpriteKey.UI_BACKPACK_KEY, () => {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    self.inventoryUI.prepareForToggle();
                    self.inventoryUI.toggle();
                });
                invBtn.x = UI.SCREEN_SPACING;
                invBtn.y = UI.SCREEN_SPACING;
                self.addChild(invBtn);

                let craftBtn = new Button(UISpriteKey.UI_CRAFT_KEY, () => {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    self.craftingUI.prepareForToggle();
                    self.craftingUI.toggle();
                });
                craftBtn.x = UI.SCREEN_SPACING + Button.SIDE_SIZE + PartsUI.SPACING;
                craftBtn.y = UI.SCREEN_SPACING;
                self.addChild(craftBtn);

                let minimapBtn = new Button(UISpriteKey.UI_MINIMAP_KEY, () => {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    self.mapUI.show();
                });
                minimapBtn.x = UI.SCREEN_SPACING + 2 * (Button.SIDE_SIZE + PartsUI.SPACING);
                minimapBtn.y = UI.SCREEN_SPACING;
                self.addChild(minimapBtn);
            }

            if (mobile) {
                let movementCont = new PIXI.Container();
                movementCont.x = UI.SCREEN_SPACING;
                movementCont.y = canvas.height / 2 - Button.SIDE_SIZE * 1.5 - PartsUI.SPACING;
                self.addChild(movementCont);

                let shape = new PIXI.Graphics();
                shape.lineStyle(2, 0x000000, 0.7);
                let radius = 2 * Button.SIDE_SIZE;
                shape.beginFill(0x0a320a, 0.5).drawCircle(0, 0, radius);
                shape.x = radius;
                shape.y = radius;
                movementCont.addChild(shape);

                let iconRadius = radius - 25;
                for (let i = 0; i < 8; i++) {
                    let angle = -Math.PI * (i * 45) / 180;
                    let x = radius + iconRadius * Math.cos(angle);
                    let y = radius + iconRadius * Math.sin(angle);
                    let key;
                    switch (i) {
                        case 0: key = UISpriteKey.UI_RIGHT_KEY; break;
                        case 1: key = UISpriteKey.UI_RIGHT_UP_KEY; break;
                        case 2: key = UISpriteKey.UI_UP_KEY; break;
                        case 3: key = UISpriteKey.UI_LEFT_UP_KEY; break;
                        case 4: key = UISpriteKey.UI_LEFT_KEY; break;
                        case 5: key = UISpriteKey.UI_LEFT_DOWN_KEY; break;
                        case 6: key = UISpriteKey.UI_DOWN_KEY; break;
                        case 7: key = UISpriteKey.UI_RIGHT_DOWN_KEY; break;
                    }
                    let sprite = Resources.getInstance().getUISprite(key);
                    sprite.alpha = 0.7;
                    sprite.x = x - Resources.TILE_SIZE;
                    sprite.y = y - Resources.TILE_SIZE;
                    movementCont.addChild(sprite);
                }

                let directionByTouch = (x: number, y: number) => {
                    let angle;
                    let dx = x - radius;
                    let dy = radius - y;
                    let c = Math.sqrt(dx * dx + dy * dy);
                    angle = 180 * Math.asin(dy / c) / Math.PI;
                    if (dx > 0 && dy > 0) { /*ok*/ }
                    if (dx < 0 && dy > 0) { angle = 180 - angle; }
                    if (dx < 0 && dy < 0) { angle = 180 - angle; }
                    if (dx > 0 && dy < 0) { angle = 360 + angle; }
                    // posuv, aby šipky nebyly na hranici ale uvnitř výseče
                    angle += 45 / 2;
                    switch (Math.floor(angle / 45)) {
                        case 0: PlayerMovement.right = true; break;
                        case 1: PlayerMovement.right = true; PlayerMovement.up = true; break;
                        case 2: PlayerMovement.up = true; break;
                        case 3: PlayerMovement.up = true; PlayerMovement.left = true; break;
                        case 4: PlayerMovement.left = true; break;
                        case 5: PlayerMovement.left = true; PlayerMovement.down = true; break;
                        case 6: PlayerMovement.down = true; break;
                        case 7: PlayerMovement.down = true; PlayerMovement.right = true; break;
                    }
                };

                // TODO touch
                // movementCont.on("mousedown",  (evt: createjs.MouseEvent) {
                //     var mouseData = game.ge.renderer.plugins.interaction.mouse.;
                //     self.controls = new Controls();
                //     directionByTouch(evt.stageX - movementCont.x, evt.stageY - movementCont.y);
                // }, null, false);
                // movementCont.on("pressup", function (evt) {
                //     self.controls = new Controls();
                // }, null, false);
                // movementCont.on("pressmove", function (evt: createjs.MouseEvent) {
                //     self.controls = new Controls();
                //     directionByTouch(evt.stageX - movementCont.x, evt.stageY - movementCont.y);
                // }, null, false);

            }

        }

    }

    export class UIBackground extends PIXI.Graphics {
        public fixedWidth: number;
        public fixedHeight: number;
        public drawBackground(width: number, height: number) {
            this.fixedWidth = width;
            this.fixedHeight = height;
            this.clear();
            this.lineStyle(2, 0x000000, 0.7);
            this.beginFill(0x0a320a, 0.5);
            this.drawRoundedRect(0, 0, width, height, 3);
        }
    }

    export class AbstractUI extends PIXI.Container {

        static BORDER = 10;
        static TEXT_SIZE = 15;

        protected toggleFlag = true;
        protected parentRef: PIXI.Container = null;

        outerShape: UIBackground = new UIBackground();

        constructor(public fixedWidth: number, public fixedHeight: number) {
            super();

            this.drawBackground();
            this.addChild(this.outerShape);
        }

        protected drawBackground() {
            this.outerShape.drawBackground(this.fixedWidth, this.fixedHeight);
        }

        hide() {
            if (this.parent) {
                this.parentRef = this.parent;
                this.parent.removeChild(this);
            }
        }

        show() {
            this.parentRef.addChild(this);
        }

        public toggle() {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                if (self.parent == null) {
                    self.show();
                } else {
                    self.hide();
                }
                self.toggleFlag = false;
            }
        }

        public suppressToggle() {
            this.toggleFlag = false;
        }

        public prepareForToggle() {
            this.toggleFlag = true;
        }

    }

    export class UIShape extends PIXI.Graphics {
        constructor(red: number, green: number, blue: number,
            red2 = red, green2 = green, blue2 = blue, op = 0.2, op2 = 0.5) {
            super();

            this.beginFill((red << 16) + (green << 8) + blue, op);
            this.lineStyle(2, (red2 << 16) + (green2 << 8) + blue2, op2);
            let side = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            this.drawRoundedRect(0, 0, side, side, 3);
        }
    }

    export class Highlight extends UIShape {
        constructor() {
            super(250, 250, 10);
        }
    }

    export class PartsUI extends AbstractUI {

        static SELECT_BORDER = 5;
        static SPACING = 12;

        constructor(protected n: number, protected m: number) {
            super(PartsUI.pixelsByX(n), PartsUI.pixelsByX(m));
        }

        static pixelsByX(x: number): number {
            return x * Resources.PARTS_SIZE + (x - 1) * (PartsUI.SPACING) + 2 * AbstractUI.BORDER;
        }

    }

    export class Button extends PIXI.Container {
        public static SIDE_SIZE = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;

        // výchozí interval efektu tlačítka (ms)
        private static DEFAULT_INTERVAL = 200;
        // hodnota (ms) o kterou se interval sníží při delším držení
        private static INTERVAL_DECREASE_TIME = 10;
        // počet opakování akce, než je hodnota snížena
        private static INTERVAL_DECREASE_STEPS = 2;
        private intervalId;
        private interval = Button.DEFAULT_INTERVAL;
        private decreaseSteps = 0;
        private sprite: PIXI.Sprite;

        public changeSprite(uiKey: UISpriteKey) {
            Resources.getInstance().getUISprite(uiKey, this.sprite);
        }

        constructor(uiKey: UISpriteKey, onPress: Function, onRelease?: Function, onlyIcon = false) {
            super();

            if (!onlyIcon) {
                let bgr = new UIShape(10, 50, 10, 0, 0, 0, 0.5, 0.7);
                this.addChild(bgr);
                bgr.x = 0;
                bgr.y = 0;
            }

            this.sprite = Resources.getInstance().getUISprite(uiKey);
            this.addChild(this.sprite);
            this.sprite.x = PartsUI.SELECT_BORDER;
            this.sprite.y = PartsUI.SELECT_BORDER;
            this.sprite.interactive = true;
            this.sprite.buttonMode = true;
            let self = this;

            let repeatPress = () => {
                self.intervalId = setInterval(() => {
                    onPress();
                    self.decreaseSteps++;
                    if (self.decreaseSteps >= Button.INTERVAL_DECREASE_STEPS) {
                        self.decreaseSteps = 0;
                        self.interval -= Button.INTERVAL_DECREASE_TIME;
                        clearInterval(self.intervalId);
                        repeatPress();
                    }
                }, self.interval);
            }

            this.sprite.on("pointerdown", () => {
                onPress();
                self.decreaseSteps = 0;
                self.interval = Button.DEFAULT_INTERVAL;
                repeatPress();
            });
            let out = () => {
                clearInterval(self.intervalId);
                if (onRelease) {
                    onRelease();
                }
            };
            this.sprite.on("pointerup", out);
            this.sprite.on("pointerout", out);
        }
    }

}