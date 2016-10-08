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

        splashScreenUI: SplashScreenUI;

        constructor(public game: Game) {
            super();

            let self = this;
            let canvas = game.getCanvas();

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
            var craftingUI = new CraftingUI();
            self.addChild(craftingUI);
            self.craftingUI = craftingUI;

            // Crafting recipes 
            let recipeListener = new RecipeManager(craftingUI.createRecipeAvailChangeListener());

            // Inventář
            var inventoryUI = new InventoryUI(recipeListener);
            inventoryUI.x = UI.SCREEN_SPACING;
            inventoryUI.y = canvas.height - inventoryUI.height - UI.SCREEN_SPACING;
            self.addChild(inventoryUI);
            self.inventoryUI = inventoryUI;

            craftingUI.setInventoryUI(inventoryUI);
            craftingUI.x = UI.SCREEN_SPACING;
            // musí se posunout víc, protože má externí řádek pro ingredience
            craftingUI.y = canvas.height - inventoryUI.height - UI.SCREEN_SPACING * 2
                - craftingUI.height - Resources.PARTS_SIZE - PartsUI.SELECT_BORDER * 3;

            // Schopnosti
            var spellsUI = new SpellsUI();
            spellsUI.x = canvas.width / 2 - spellsUI.width / 2;
            spellsUI.y = UI.SCREEN_SPACING;
            self.addChild(spellsUI);
            self.spellsUI = spellsUI;

            // Stav (mana, zdraví)
            var conditionUI = new ConditionUI();
            conditionUI.x = canvas.width - conditionUI.width - UI.SCREEN_SPACING;
            conditionUI.y = canvas.height - conditionUI.height - UI.SCREEN_SPACING;
            self.addChild(conditionUI);
            self.conditionUI = conditionUI;

            // Hudba
            var musicUI = new MusicUI();
            musicUI.x = canvas.width - musicUI.width - UI.SCREEN_SPACING;
            musicUI.y = canvas.height - UI.SCREEN_SPACING - conditionUI.height - UI.SCREEN_SPACING - musicUI.height;
            self.addChild(musicUI);
            self.musicUI = musicUI;
        }

        isMouseInUI(x: number, y: number): boolean {
            var self = this;
            var uiHit = false;
            self.children.forEach(function (item) {
                if (item.hitTest(x - item.x, y - item.y) === true) {
                    uiHit = true;
                    return;
                }
            });
            return uiHit;
        }

        handleMouse(mouse: Mouse, delta: number) {
            var self = this;
            self.children.forEach(function (item) {
                if (item.hitTest(mouse.x - item.x, mouse.y - item.y) === true) {
                    if (typeof item["handleMouse"] !== "undefined") {
                        item["handleMouse"](mouse);
                        return;
                    }
                }
            });
        }
    }

    export class AbstractUI extends createjs.Container {

        static BORDER = 10;
        static TEXT_SIZE = 15;

        outerShape: createjs.Shape;

        constructor(public width: number, public height: number) {
            super();

            this.outerShape = new createjs.Shape();
            this.drawBackground();
            this.addChild(this.outerShape);
        }

        protected drawBackground() {
            this.outerShape.graphics.clear();
            this.outerShape.graphics.setStrokeStyle(2);
            this.outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            this.outerShape.graphics.drawRoundRect(0, 0, this.width, this.height, 3);
        }

    }

    export class UIShape extends createjs.Shape {
        constructor(red: number, green: number, blue: number,
            red2 = red, green2 = green, blue2 = blue, op = 0.2, op2 = 0.5) {
            super();

            this.graphics.beginFill("rgba(" + red + "," + green + "," + blue + "," + op + ")");
            this.graphics.beginStroke("rgba(" + red2 + "," + green2 + "," + blue2 + "," + op2 + ")");
            this.graphics.setStrokeStyle(2);
            var side = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            this.graphics.drawRoundRect(0, 0, side, side, 3);
        }
    }

    export class Highlight extends UIShape {
        constructor() {
            super(250, 250, 10);
        }
    }

    export class Button extends createjs.Container {
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

            let btnHitAreaSide = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            let hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            this.hitArea = hitArea;

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

}