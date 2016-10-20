namespace Lich {

    class IngredientsCont extends AbstractUI {

        public itemsCont = new createjs.Container();

        constructor() {
            super(CraftingUI.N * (Resources.PARTS_SIZE + PartsUI.SPACING) - PartsUI.SPACING + 2 * AbstractUI.BORDER,
                Resources.PARTS_SIZE + 2 * PartsUI.SELECT_BORDER);

            this.itemsCont.x = PartsUI.BORDER;
            this.itemsCont.y = PartsUI.SELECT_BORDER;
            this.addChild(this.itemsCont);
        }
    }

    export class CraftingUI extends PartsUI {

        static N = 12;
        static M = 6;
        static CRAFT_SIZE = CraftingUI.N * CraftingUI.M;

        lineOffset = 0;

        itemHighlight: createjs.Shape;
        choosenItem: string = null;

        // --- Virtuální seznam ---
        // pole obsazení položkami
        itemsTypeArray = new Array<Recipe>();
        // mapa pořadí typů položek
        itemsTypeIndexMap = new HashMap<number>();

        // --- UI ----
        // mapa existujících UI prvků dle typu položky
        itemsUIMap = new HashMap<ItemUI>();

        itemsCont = new createjs.Container();

        craftBtn: Button;
        ingredientsCont: IngredientsCont;
        inventoryUI: InventoryUI;

        public setInventoryUI(inventoryUI: InventoryUI) {
            this.inventoryUI = inventoryUI;
        }

        constructor() {
            super(CraftingUI.N, CraftingUI.M);

            var self = this;

            // zvýraznění vybrané položky
            self.itemHighlight = new Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);

            // kontejner položek
            self.itemsCont.x = PartsUI.BORDER;
            self.itemsCont.y = PartsUI.BORDER;
            self.addChild(self.itemsCont);

            // tlačítka
            let upBtn = new Button(UIGFXKey.UI_UP_KEY);
            let downBtn = new Button(UIGFXKey.UI_DOWN_KEY);
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = PartsUI.pixelsByX(CraftingUI.N) + PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = PartsUI.pixelsByX(CraftingUI.M) - Resources.PARTS_SIZE - PartsUI.BORDER;

            upBtn.on("mousedown", function (evt) {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            }, null, false);

            downBtn.on("mousedown", function (evt) {
                let occupLines = Math.ceil(self.itemsTypeArray.length / CraftingUI.N);
                if (self.lineOffset < occupLines - CraftingUI.M) {
                    self.lineOffset++;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            }, null, false);

            // Přehled ingrediencí
            self.ingredientsCont = new IngredientsCont();
            self.addChild(self.ingredientsCont);
            self.ingredientsCont.x = 0;
            self.ingredientsCont.y = PartsUI.pixelsByX(CraftingUI.M) + PartsUI.SELECT_BORDER;

            // craft tlačítko
            let craftBtn = new Button(UIGFXKey.UI_CRAFT_KEY);
            self.addChild(craftBtn);
            craftBtn.x = PartsUI.pixelsByX(CraftingUI.N) + PartsUI.SELECT_BORDER;
            craftBtn.y = PartsUI.pixelsByX(CraftingUI.M) + PartsUI.SELECT_BORDER;
            craftBtn.on("mousedown", function (evt) {
                if (self.choosenItem) {
                    let index = self.itemsTypeIndexMap[self.choosenItem];
                    let recipe = self.itemsTypeArray[index];
                    for (let ingred of recipe.ingredients) {
                        self.inventoryUI.invRemove(ingred.key, ingred.quant);
                    }
                    self.inventoryUI.invInsert(recipe.outcome.key, recipe.outcome.quant);
                    Mixer.playSound(SoundKey.SND_CRAFT_KEY);
                }
            }, null, false);

            let offset = 5;
            self.cache(-offset, -offset,
                self.width + Button.sideSize + PartsUI.SELECT_BORDER + offset * 2,
                self.height + Button.sideSize + PartsUI.SELECT_BORDER + offset * 2);
        }

        render() {
            this.itemsCont.removeAllChildren();
            this.itemHighlight.visible = false;
            let itemsOffset = this.lineOffset * CraftingUI.N;
            for (let i = itemsOffset;
                i < CraftingUI.N * CraftingUI.M + itemsOffset && i < this.itemsTypeArray.length;
                i++) {
                let item = this.itemsTypeArray[i];
                if (item) {
                    this.createUIItem(item, i - itemsOffset);
                }
            }
            this.updateCache();
        }

        createUIItem(item: Recipe, i: number) {
            let self = this;
            let key = JSON.stringify(item, self.replacer);
            let itemUI = new ItemUI(item.outcome.key, item.outcome.quant);
            self.itemsUIMap[key] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % CraftingUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);
            itemUI.y = Math.floor(i / CraftingUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);

            let hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            itemUI.hitArea = hitArea;

            if (self.choosenItem == key) {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
            }

            (function () {
                var currentItem = self.itemsUIMap[key];
                itemUI.on("mousedown", function (evt) {
                    self.itemHighlight.visible = true;
                    self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    self.choosenItem = key;

                    // vypiš ingredience
                    self.ingredientsCont.itemsCont.removeAllChildren();
                    let index = self.itemsTypeIndexMap[self.choosenItem];
                    let recipe = self.itemsTypeArray[index];
                    for (let ingred of recipe.ingredients) {
                        let ingredUI = new ItemUI(ingred.key, ingred.quant);
                        ingredUI.x = self.ingredientsCont.itemsCont.children.length * (PartsUI.SPACING + Resources.PARTS_SIZE);
                        ingredUI.y = 0;
                        self.ingredientsCont.itemsCont.addChild(ingredUI);
                    }
                    self.updateCache();
                }, null, false);
            })();
        }

        private replacer(key, value) {
            if (key == "recipe") return undefined;
            if (key == "available") return undefined;
            else return value;
        }

        public createRecipeAvailChangeListener(): (Recipe) => void {
            let self = this;
            return function (recipe: Recipe) {
                let key = JSON.stringify(recipe, self.replacer);
                if (recipe.available) {
                    let i = 0;
                    for (i = 0; i < self.itemsTypeArray.length; i++) {
                        // buď najdi volné místo...
                        if (!self.itemsTypeArray[i]) {
                            break;
                        }
                    }
                    // ...nebo vlož položku na konec pole
                    self.itemsTypeArray[i] = recipe;
                    self.itemsTypeIndexMap[key] = i;
                } else {
                    if (self.choosenItem == key) {
                        self.choosenItem = null;
                        self.ingredientsCont.itemsCont.removeAllChildren();
                    }
                    let i = self.itemsTypeIndexMap[key];
                    delete self.itemsTypeIndexMap[key];
                    delete self.itemsTypeArray[i];
                }
                self.render();
            };
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }
    }

}