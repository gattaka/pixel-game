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

    export class ConditionUI extends AbstractUI {

        static INNER_BORDER = 5;
        static SPACING = 4;

        private healthBar = new createjs.Shape();
        private willBar = new createjs.Shape();

        private healthText: Label;
        private willText: Label;

        private barWidth: number;
        private barHeight: number;

        private maxHealth: number = 0;
        private maxWill: number = 0;

        private currentHealth: number = 0;
        private currentWill: number = 0;

        setMaxHealth(maxHealth: number) {
            this.maxHealth = maxHealth;
            this.setHealth(this.currentHealth);
        }

        setMaxWill(maxWill: number) {
            this.maxWill = maxWill;
            this.setWill(this.currentWill);
        }

        setHealth(currentHealth: number) {
            if (currentHealth > this.maxHealth) {
                this.currentHealth = this.maxHealth;
            } else if (currentHealth < 0) {
                this.currentHealth = 0;
            } else {
                this.currentHealth = Math.ceil(currentHealth);
            }
            this.updateHealthBar();
        }

        setWill(currentWill: number) {
            if (currentWill > this.maxWill) {
                this.currentWill = this.maxWill;
            } else if (currentWill < 0) {
                this.currentWill = 0;
            } else {
                this.currentWill = Math.ceil(currentWill);
            }
            this.updateWillBar();
        }

        private updateHealthBar() {
            this.healthBar.graphics.clear();
            this.healthBar.graphics.setStrokeStyle(2);
            this.healthBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.healthBar.graphics.beginFill("rgba(255,0,0,0.7)");
            var width = this.barWidth * (this.currentHealth / this.maxHealth);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.healthBar.graphics.drawRoundRect(x, ConditionUI.INNER_BORDER, width, this.barHeight, 3);

            this.healthText.setText(this.currentHealth + "/" + this.maxHealth);
            this.healthText.x = this.width / 2 - this.healthText.getBounds().width / 2;
        }

        private updateWillBar() {
            this.willBar.graphics.clear();
            this.willBar.graphics.setStrokeStyle(2);
            this.willBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.willBar.graphics.beginFill("rgba(70,30,255,0.7)");
            var width = this.barWidth * (this.currentWill / this.maxWill);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.willBar.graphics.drawRoundRect(x, this.height / 2 + ConditionUI.SPACING / 2, width, this.barHeight, 3);

            this.willText.setText(this.currentWill + "/" + this.maxWill);
            this.willText.x = this.width / 2 - this.willText.getBounds().width / 2;
        }

        constructor() {
            super(350, 2 * AbstractUI.BORDER + Resources.PARTS_SIZE);

            let self = this;

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
            this.healthText = new Label(" ", PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.healthText.y = ConditionUI.INNER_BORDER;
            this.addChild(this.healthText);

            // vůle
            this.addChild(this.willBar);
            this.willText = new Label(" ", PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.willText.y = this.height / 2 + ConditionUI.SPACING / 2;
            this.addChild(this.willText);

            this.updateHealthBar();
            this.updateWillBar();

            EventBus.getInstance().registerConsumer(EventType.HEALTH_CHANGE, (data: HealthChangeEventPayload) => {
                self.setMaxHealth(data.maxHealth);
                self.setHealth(data.currentHealth);
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.WILL_CHANGE, (data: WillChangeEventPayload) => {
                self.setMaxWill(data.maxWill);
                self.setWill(data.currentWill);
                return false;
            });
        }

    }

    export class GameLoadUI extends createjs.Container {

        private loader;

        constructor(game: Game) {
            super();
            let self = this;
            self.width = game.getCanvas().width;
            self.height = game.getCanvas().height;

            var loadScreen = new createjs.Shape();
            loadScreen.graphics.beginFill("black");
            loadScreen.graphics.drawRect(0, 0, self.width, self.height);
            self.addChild(loadScreen);

            var loadLabel = new Label("Loading...", "30px " + Resources.FONT, Resources.TEXT_COLOR);
            loadLabel.x = self.width / 2 - 50;
            loadLabel.y = self.height / 2 - 50;
            self.addChild(loadLabel);

            var loadItemLabel = new Label("-", "15px " + Resources.FONT, Resources.TEXT_COLOR);
            loadItemLabel.x = self.width / 2 - 50;
            loadItemLabel.y = loadLabel.y + 40;
            self.addChild(loadItemLabel);

            EventBus.getInstance().registerConsumer(EventType.LOAD_PROGRESS, (n: NumberEventPayload): boolean => {
                loadLabel.setText(Math.floor(n.payload * 100) + "% Loading... ");
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.LOAD_ITEM, (e: StringEventPayload): boolean => {
                loadItemLabel.setText(e.payload);
                return false;
            });

        }

    }

}