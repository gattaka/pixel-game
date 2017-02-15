namespace Lich {

    export class UI extends SheetContainer {

        static SCREEN_SPACING = 20;

        charCont: SheetContainer;

        debugUI: DebugLogUI;
        inventoryUI: InventoryUI;
        spellsUI: SpellsUI;
        musicUI: MusicUI;
        conditionUI: ConditionUI;
        craftingUI: CraftingUI;
        mapUI: MapUI;
        minimapUI: MinimapUI;

        splashScreenUI: SplashScreenUI;

        // mobile
        public controls = new Controls();

        private createHelpButton() {
            let helpBtn = new Button(UIGFXKey.UI_HELP_KEY);
            helpBtn.on("mousedown", function (evt) {
                window.open("help.html", "_blank");
            }, null, false);
            return helpBtn;
        }

        constructor(public canvas: HTMLCanvasElement, tilesMap: TilesMap, mobile: boolean) {
            super();

            let self = this;

            // Minimap render
            let minimapRender = new MinimapRender(canvas.width, canvas.height, tilesMap)

            // Minimapa
            let minimapUI = new MinimapUI(canvas.width, canvas.height, minimapRender);
            minimapUI.x = canvas.width - UI.SCREEN_SPACING - minimapUI.width;
            minimapUI.y = UI.SCREEN_SPACING;
            self.addChild(minimapUI);
            self.minimapUI = minimapUI;

            // mapa
            let mapUI = new MapUI(canvas.width, canvas.height, minimapRender);
            mapUI.x = UI.SCREEN_SPACING;
            mapUI.y = UI.SCREEN_SPACING;
            self.addChild(mapUI);
            self.mapUI = mapUI;
            mapUI.hide();

            // Help btn
            if (!mobile) {
                let helpBtn = this.createHelpButton();
                self.addChild(helpBtn);
                helpBtn.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING - minimapUI.width - PartsUI.SPACING;
                helpBtn.y = UI.SCREEN_SPACING;
            } else {
                let menuCont = new SheetContainer();
                menuCont.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
                menuCont.y = UI.SCREEN_SPACING + Button.sideSize + PartsUI.SPACING;
                menuCont.visible = false;
                self.addChild(menuCont);

                let saveBtn = new Button(UIGFXKey.UI_SAVE_KEY);
                menuCont.addChild(saveBtn);
                saveBtn.on("click", function (evt) {
                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    menuCont.visible = false;
                }, null, false);

                let loadBtn = new Button(UIGFXKey.UI_LOAD_KEY);
                loadBtn.y = Button.sideSize + PartsUI.SPACING;
                menuCont.addChild(loadBtn);
                loadBtn.on("click", function (evt) {
                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_WORLD));
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }, null, false);

                let newbtn = new Button(UIGFXKey.UI_NEW_WORLD_KEY);
                newbtn.y = 2 * (Button.sideSize + PartsUI.SPACING);
                menuCont.addChild(newbtn);
                menuCont.on("click", function (evt) {
                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.NEW_WORLD));
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }, null, false);

                let helpBtn = this.createHelpButton();
                menuCont.addChild(helpBtn);
                helpBtn.y = 3 * (Button.sideSize + PartsUI.SPACING);

                let menuBtn = new Button(UIGFXKey.UI_MENU_KEY);
                self.addChild(menuBtn);
                menuBtn.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
                menuBtn.y = UI.SCREEN_SPACING;
                menuBtn.on("click", function (evt) {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    menuCont.visible = !menuCont.visible;
                }, null, false);
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
            self.splashScreenUI.x = canvas.width / 2 - self.splashScreenUI.width / 2;
            self.splashScreenUI.y = canvas.height / 2 - self.splashScreenUI.height / 2;
            if (!mobile) {
                self.addChild(self.splashScreenUI);
            }

            // Crafting
            let craftingUI = new CraftingUI();
            self.addChild(craftingUI);
            self.craftingUI = craftingUI;

            // Crafting recipes 
            let recipeListener = new RecipeManager(craftingUI.createRecipeAvailChangeListener());

            // Inventář
            let inventoryUI;
            if (mobile) {
                let n = Math.floor(canvas.width / (Resources.PARTS_SIZE + PartsUI.SPACING)) - 4 - 1 - 3;
                let m = Math.floor(canvas.height / (Resources.PARTS_SIZE + PartsUI.SPACING)) - 4;
                inventoryUI = new InventoryUI(recipeListener, n, m);
                inventoryUI.x = inventoryUI.expandedX = 4 * Button.sideSize + 2 * UI.SCREEN_SPACING;
                inventoryUI.y = inventoryUI.expandedY = canvas.height / 2 - inventoryUI.height / 2;
            } else {
                inventoryUI = new InventoryUI(recipeListener);
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
            craftingUI.x = canvas.width / 2 - craftingUI.width / 2;
            craftingUI.y = canvas.height / 2 - craftingUI.height / 2 - Resources.PARTS_SIZE - PartsUI.SELECT_BORDER * 2;
            craftingUI.hide();

            // Schopnosti
            let spellsUI = new SpellsUI();
            spellsUI.x = canvas.width / 2 - spellsUI.width / 2;
            spellsUI.y = UI.SCREEN_SPACING;
            self.addChild(spellsUI);
            self.spellsUI = spellsUI;

            // Stav (mana, zdraví)
            let conditionUI = new ConditionUI();
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

            // Achievements info
            EventBus.getInstance().registerConsumer(EventType.ACHIEVEMENT_DONE, (payload: StringEventPayload): boolean => {
                let achvCont = new SheetContainer();

                let achvImgSide = 80;
                let w = 300;
                let h = achvImgSide + 2 * AbstractUI.BORDER
                let bgr = new UIBackground();
                bgr.drawBackground(w, h);
                achvCont.addChild(bgr);

                let achvDef = Resources.getInstance().achievementsDefs[payload.payload];
                let bmp = Resources.getInstance().getBitmap(payload.payload);
                achvCont.addChild(bmp);
                bmp.x = AbstractUI.BORDER;
                bmp.y = AbstractUI.BORDER;

                let nameLabelSize = 20;
                let nameLabel = new Label(achvDef.name, nameLabelSize + "px " + Resources.FONT, "#0E0");
                achvCont.addChild(nameLabel);
                nameLabel.x = achvImgSide + AbstractUI.BORDER + PartsUI.SPACING;
                nameLabel.y = AbstractUI.BORDER;

                let mottoLabelSize = 17;
                let mottoLabel = new Label("\"" + achvDef.motto + "\"", "italic " + mottoLabelSize + "px " + Resources.FONT, "#EEE");
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
                let invBtn = new Button(UIGFXKey.UI_BACKPACK_KEY);
                invBtn.x = UI.SCREEN_SPACING;
                invBtn.y = UI.SCREEN_SPACING;
                self.addChild(invBtn);
                invBtn.on("click", function (evt) {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    self.inventoryUI.prepareForToggle();
                    self.inventoryUI.toggle();
                }, null, false);

                let craftBtn = new Button(UIGFXKey.UI_CRAFT_KEY);
                craftBtn.x = UI.SCREEN_SPACING + Button.sideSize + PartsUI.SPACING;
                craftBtn.y = UI.SCREEN_SPACING;
                self.addChild(craftBtn);
                craftBtn.on("click", function (evt) {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    self.craftingUI.prepareForToggle();
                    self.craftingUI.toggle();
                }, null, false);

                let minimapBtn = new Button(UIGFXKey.UI_MINIMAP_KEY);
                minimapBtn.x = UI.SCREEN_SPACING + 2 * (Button.sideSize + PartsUI.SPACING);
                minimapBtn.y = UI.SCREEN_SPACING;
                self.addChild(minimapBtn);
                minimapBtn.on("click", function (evt) {
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                    self.mapUI.show();
                }, null, false);
            }

            if (mobile) {
                let movementCont = new SheetContainer();
                movementCont.x = UI.SCREEN_SPACING;
                movementCont.y = canvas.height / 2 - Button.sideSize * 1.5 - PartsUI.SPACING;
                self.addChild(movementCont);

                let shape = new createjs.Shape();
                shape.graphics.beginStroke("rgba(0,0,0,0.7)");
                shape.graphics.setStrokeStyle(2);
                let radius = 2 * Button.sideSize;
                shape.graphics.beginFill("rgba(10,50,10,0.5)").drawCircle(0, 0, radius);
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
                        case 0: key = UIGFXKey.UI_RIGHT_KEY; break;
                        case 1: key = UIGFXKey.UI_RIGHT_UP_KEY; break;
                        case 2: key = UIGFXKey.UI_UP_KEY; break;
                        case 3: key = UIGFXKey.UI_LEFT_UP_KEY; break;
                        case 4: key = UIGFXKey.UI_LEFT_KEY; break;
                        case 5: key = UIGFXKey.UI_LEFT_DOWN_KEY; break;
                        case 6: key = UIGFXKey.UI_DOWN_KEY; break;
                        case 7: key = UIGFXKey.UI_RIGHT_DOWN_KEY; break;
                    }
                    let bitmap = Resources.getInstance().getBitmap(UIGFXKey[key]);
                    bitmap.alpha = 0.7;
                    bitmap.x = x - Resources.TILE_SIZE;
                    bitmap.y = y - Resources.TILE_SIZE;
                    movementCont.addChild(bitmap);
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
                        case 0: self.controls.right = true; break;
                        case 1: self.controls.right = true; self.controls.up = true; break;
                        case 2: self.controls.up = true; break;
                        case 3: self.controls.up = true; self.controls.left = true; break;
                        case 4: self.controls.left = true; break;
                        case 5: self.controls.left = true; self.controls.down = true; break;
                        case 6: self.controls.down = true; break;
                        case 7: self.controls.down = true; self.controls.right = true; break;
                    }
                };

                movementCont.on("mousedown", function (evt: createjs.MouseEvent) {
                    self.controls = new Controls();
                    directionByTouch(evt.stageX - movementCont.x, evt.stageY - movementCont.y);
                }, null, false);
                movementCont.on("pressup", function (evt) {
                    self.controls = new Controls();
                }, null, false);
                movementCont.on("pressmove", function (evt: createjs.MouseEvent) {
                    self.controls = new Controls();
                    directionByTouch(evt.stageX - movementCont.x, evt.stageY - movementCont.y);
                }, null, false);


            }

        }

        isMouseInUI(x: number, y: number): boolean {
            let self = this;
            let uiHit = false;
            self.children.forEach(function (item) {
                if (item.hitTest(x - item.x, y - item.y) === true) {
                    uiHit = true;
                    return;
                }
            });
            return uiHit;
        }

    }

    export class UIBackground extends createjs.Shape {
        public width: number;
        public height: number;
        public drawBackground(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.graphics.clear();
            this.graphics.setStrokeStyle(2);
            this.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.graphics.beginFill("rgba(10,50,10,0.5)");
            this.graphics.drawRoundRect(0, 0, width, height, 3);
        }
    }

    export class AbstractUI extends SheetContainer {

        static BORDER = 10;
        static TEXT_SIZE = 15;

        protected toggleFlag = true;
        protected parentRef: SheetContainer= null;

        outerShape: UIBackground = new UIBackground();

        constructor(public width: number, public height: number) {
            super();

            this.drawBackground();
            this.addChild(this.outerShape);
        }

        protected drawBackground() {
            this.outerShape.drawBackground(this.width, this.height);
        }

        hide() {
            if (this.parent) {
                this.parentRef = <SheetContainer>this.parent;
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

    export class UIShape extends createjs.Shape {
        constructor(red: number, green: number, blue: number,
            red2 = red, green2 = green, blue2 = blue, op = 0.2, op2 = 0.5) {
            super();

            this.graphics.beginFill("rgba(" + red + "," + green + "," + blue + "," + op + ")");
            this.graphics.beginStroke("rgba(" + red2 + "," + green2 + "," + blue2 + "," + op2 + ")");
            this.graphics.setStrokeStyle(2);
            let side = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            this.graphics.drawRoundRect(0, 0, side, side, 3);
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

    export class Button extends SheetContainer {
        public static sideSize = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
        constructor(bitmap: UIGFXKey) {
            super();

            let bgr = new UIShape(10, 50, 10, 0, 0, 0, 0.5, 0.7);
            this.addChild(bgr);
            bgr.x = 0;
            bgr.y = 0;

            if (bitmap) {
                let btmp = Resources.getInstance().getBitmap(UIGFXKey[bitmap]);
                this.addChild(btmp);
                btmp.x = PartsUI.SELECT_BORDER;
                btmp.y = PartsUI.SELECT_BORDER;
            }

            let hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Button.sideSize, Button.sideSize);
            this.hitArea = hitArea;

        }
    }

}