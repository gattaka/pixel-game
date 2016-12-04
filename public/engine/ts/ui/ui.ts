namespace Lich {

    export class UI extends createjs.Container {

        static SCREEN_SPACING = 20;

        charCont: createjs.Container;

        debugUI: DebugLogUI;
        inventoryUI: InventoryUI;
        spellsUI: SpellsUI;
        musicUI: MusicUI;
        conditionUI: ConditionUI;
        craftingUI: CraftingUI;
        minimapUI: MinimapUI;

        splashScreenUI: SplashScreenUI;

        helpBtn: Button;

        constructor(public canvas: HTMLCanvasElement, tilesMap: TilesMap) {
            super();

            let self = this;

            // Help btn
            let helpBtn = new Button(UIGFXKey.UI_HELP_KEY);
            self.addChild(helpBtn);
            helpBtn.x = canvas.width - Button.sideSize - UI.SCREEN_SPACING;
            helpBtn.y = UI.SCREEN_SPACING;
            helpBtn.on("mousedown", function (evt) {
                window.open("help.html", "_blank");
            }, null, false);
            self.helpBtn = helpBtn;

            // Debug and loging
            self.debugUI = new DebugLogUI(400, 0);
            self.debugUI.x = UI.SCREEN_SPACING;
            self.debugUI.y = UI.SCREEN_SPACING;
            self.addChild(self.debugUI);

            // SplashScreen
            self.splashScreenUI = new SplashScreenUI();
            self.splashScreenUI.x = canvas.width / 2 - self.splashScreenUI.width / 2;
            self.splashScreenUI.y = canvas.height / 2 - self.splashScreenUI.height / 2;
            self.addChild(self.splashScreenUI);

            // Crafting
            let craftingUI = new CraftingUI();
            self.addChild(craftingUI);
            self.craftingUI = craftingUI;

            // Crafting recipes 
            let recipeListener = new RecipeManager(craftingUI.createRecipeAvailChangeListener());

            // Inventář
            let inventoryUI = new InventoryUI(recipeListener);
            inventoryUI.x = UI.SCREEN_SPACING;
            inventoryUI.y = canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            self.addChild(inventoryUI);
            self.inventoryUI = inventoryUI;

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
            let musicUI = new MusicUI();
            musicUI.x = canvas.width - musicUI.width - UI.SCREEN_SPACING;
            musicUI.y = canvas.height - UI.SCREEN_SPACING - conditionUI.height - UI.SCREEN_SPACING - musicUI.height;
            self.addChild(musicUI);
            self.musicUI = musicUI;

            // Minimapa
            let minimapUI = new MinimapUI(canvas.width, canvas.height, tilesMap);
            // minimapUI.x = canvas.width / 2 - minimapUI.width / 2;
            // minimapUI.y = canvas.height / 2 - minimapUI.height / 2;
            minimapUI.x = UI.SCREEN_SPACING;
            minimapUI.y = UI.SCREEN_SPACING;
            self.addChild(minimapUI);
            self.minimapUI = minimapUI;
            minimapUI.hide();

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

    export class AbstractUI extends createjs.Container {

        static BORDER = 10;
        static TEXT_SIZE = 15;

        protected toggleFlag = true;
        protected parentRef: createjs.Container = null;

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

        constructor(public n: number, public m: number) {
            super(PartsUI.pixelsByX(n), PartsUI.pixelsByX(m));
        }

        static pixelsByX(x: number): number {
            return x * Resources.PARTS_SIZE + (x - 1) * (PartsUI.SPACING) + 2 * AbstractUI.BORDER;
        }

    }

    export class Button extends createjs.Container {
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