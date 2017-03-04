namespace Lich {

    class IngredientsCont extends AbstractUI {

        public itemsCont = new PIXI.Container();

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

        itemHighlight: PIXI.Graphics;
        choosenItem: string = null;

        // --- Virtuální seznam ---
        // pole obsazení položkami
        itemsTypeArray = new Array<Recipe>();
        // mapa pořadí typů položek
        itemsTypeIndexMap = new HashMap<number>();

        // --- UI ----
        // mapa existujících UI prvků dle typu položky
        itemsUIMap = new HashMap<ItemUI>();

        itemsCont = new PIXI.Container();

        craftBtn: Button;
        ingredientsCont: IngredientsCont;
        inventoryUI: InventoryUI;

        workstationIcon: PIXI.Sprite;
        workstationIconBgr: UIBackground;
        workstation: MapObjectKey;

        public setInventoryUI(inventoryUI: InventoryUI) {
            this.inventoryUI = inventoryUI;
        }

        hide() {
            EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.WORKSTATION_CHANGE, undefined));
            this.workstation = undefined;
            super.hide();
        }

        toggle() {
            // pokud jsem zrovna otevřený pro nějakou workstation (ne ruční)
            // pak zavření neudělá zavřít, ale přepnout do ručního módu
            if (this.toggleFlag) {
                if (this.workstation && this.parent) {
                    EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.WORKSTATION_CHANGE, undefined));
                } else {
                    // jinak se chovej jako normální přepínač viditelnosti
                    super.toggle();
                }
                this.toggleFlag = false;
            }
        }

        constructor() {
            super(CraftingUI.N, CraftingUI.M);

            var self = this;

            this.workstationIcon = Resources.getInstance().getUISprite(UISpriteKey.UI_SPL_PLACE_KEY);
            let bounds = this.workstationIcon.getBounds();
            this.workstationIconBgr = new UIBackground();
            this.workstationIconBgr.drawBackground(bounds.width + 2 * PartsUI.SELECT_BORDER, bounds.height + 2 * PartsUI.SELECT_BORDER);
            this.workstationIconBgr.x = - (bounds.width + 3 * PartsUI.SELECT_BORDER);
            this.workstationIcon.x = this.workstationIconBgr.x + PartsUI.SELECT_BORDER;
            this.workstationIcon.y = PartsUI.SELECT_BORDER;

            this.addChild(this.workstationIconBgr);
            this.addChild(this.workstationIcon);

            EventBus.getInstance().registerConsumer(EventType.WORKSTATION_UNREACHABLE, (payload: SimpleEventPayload) => {
                if (self.workstation && self.parent) {
                    self.hide();
                }
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.WORKSTATION_CHANGE, (payload: NumberEventPayload) => {
                // pokud to volá uživatel klávesnicí, pak neřeš (payload.payload = undefined)
                // zobrazování je přes toggle, což řídí keyboard handle od game
                // pokud je volán jako akce workstation objektu (payload.payload != undefined)
                // pak se zobraz, pokud už nejsi zobrazen
                if (payload.payload && !self.parent) {
                    self.show();
                }

                if (payload.payload) {
                    Resources.getInstance().getInvObjectSprite(WORKSTATIONS_ICONS[payload.payload], self.workstationIcon);
                } else {
                    Resources.getInstance().getUISprite(UISpriteKey.UI_SPL_PLACE_KEY, self.workstationIcon);
                }
                let bounds = self.workstationIcon.getBounds();
                self.workstationIconBgr.drawBackground(bounds.width + 2 * PartsUI.SELECT_BORDER, bounds.height + 2 * PartsUI.SELECT_BORDER);
                self.workstationIconBgr.x = - (bounds.width + 3 * PartsUI.SELECT_BORDER);
                self.workstationIcon.x = self.workstationIconBgr.x + PartsUI.SELECT_BORDER;

                this.workstation = payload.payload;

                // self.measureCacheArea();
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.RECIPES_CHANGE, (payload: SimpleEventPayload) => {
                self.itemsTypeArray = new Array();
                // Klíč se vytváří takhle, recepty nemůžou mít unikátní klíč, 
                // protože tentýž výrobek lze někdy vyrobit rozdílnými ingrediencemi
                RecipeManager.getInstance().getRecipes().forEach((recipe: Recipe) => {
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
                        // Pokud tento recept zmizel a byl přitom vybrán,
                        // zajisti, aby se odebral z výběru a zmizel pak
                        // i přehled jeho ingrediencí
                        self.itemsTypeIndexMap[key] = undefined;
                        if (self.choosenItem == key) {
                            self.ingredientsCont.itemsCont.removeChildren();
                            self.choosenItem = undefined;
                        }
                    }
                });
                self.render();
                return false;
            });

            // zvýraznění vybrané položky
            self.itemHighlight = new Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);

            // kontejner položek
            self.itemsCont.x = PartsUI.BORDER;
            self.itemsCont.y = PartsUI.BORDER;
            self.addChild(self.itemsCont);

            // tlačítka
            let upBtn = new Button(UISpriteKey.UI_UP_KEY, () => {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            });
            let downBtn = new Button(UISpriteKey.UI_DOWN_KEY, () => {
                let occupLines = Math.ceil(self.itemsTypeArray.length / CraftingUI.N);
                if (self.lineOffset < occupLines - CraftingUI.M) {
                    self.lineOffset++;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            });
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = PartsUI.pixelsByX(CraftingUI.N) + PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = PartsUI.pixelsByX(CraftingUI.M) - Resources.PARTS_SIZE - PartsUI.BORDER;


            // Přehled ingrediencí
            self.ingredientsCont = new IngredientsCont();
            self.addChild(self.ingredientsCont);
            self.ingredientsCont.x = 0;
            self.ingredientsCont.y = PartsUI.pixelsByX(CraftingUI.M) + PartsUI.SELECT_BORDER;

            // craft tlačítko
            let craftBtn = new Button(UISpriteKey.UI_CRAFT_KEY, () => {
                if (self.choosenItem) {
                    let oldItem = self.choosenItem;
                    let index = self.itemsTypeIndexMap[oldItem];
                    let recipe = self.itemsTypeArray[index];
                    for (let ingred of recipe.ingredients) {
                        self.inventoryUI.invRemove(ingred.key, ingred.quant);
                    }
                    self.inventoryUI.invInsert(recipe.outcome.key, recipe.outcome.quant);
                    Mixer.playSound(SoundKey.SND_CRAFT_KEY);
                }
            });
            self.addChild(craftBtn);
            craftBtn.x = PartsUI.pixelsByX(CraftingUI.N) + PartsUI.SELECT_BORDER;
            craftBtn.y = PartsUI.pixelsByX(CraftingUI.M) + PartsUI.SELECT_BORDER;

            // self.measureCacheArea();
        }

        private measureCacheArea() {
            // let offset = this.workstationIconBgr.width + PartsUI.SELECT_BORDER + 5;
            // this.cache(-offset, -offset,
            //     this.width + Button.sideSize + PartsUI.SELECT_BORDER + offset + 5,
            //     this.height + Button.sideSize + PartsUI.SELECT_BORDER + offset + 5);
        }

        render() {
            this.itemsCont.removeChildren();
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
            // this.updateCache();
        }

        createUIItem(item: Recipe, i: number) {
            let self = this;
            let key = JSON.stringify(item, self.replacer);
            let itemUI = new ItemUI(item.outcome.key, item.outcome.quant);
            self.itemsUIMap[key] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % CraftingUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);
            itemUI.y = Math.floor(i / CraftingUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);

            let hitArea = new PIXI.Graphics();
            itemUI.hitArea = new PIXI.Rectangle(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);

            if (self.choosenItem == key) {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
            }

            (function () {
                var currentItem = self.itemsUIMap[key];
                itemUI.on("pointerdown", () => {
                    self.itemHighlight.visible = true;
                    self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    self.choosenItem = key;

                    // vypiš ingredience
                    self.ingredientsCont.itemsCont.removeChildren();
                    let index = self.itemsTypeIndexMap[self.choosenItem];
                    let recipe = self.itemsTypeArray[index];
                    for (let ingred of recipe.ingredients) {
                        let ingredUI = new ItemUI(ingred.key, ingred.quant);
                        ingredUI.x = self.ingredientsCont.itemsCont.children.length * (PartsUI.SPACING + Resources.PARTS_SIZE);
                        ingredUI.y = 0;
                        self.ingredientsCont.itemsCont.addChild(ingredUI);
                    }
                    // self.updateCache();
                });
            })();
        }

        private replacer(key, value) {
            if (key == "recipe") return undefined;
            if (key == "available") return undefined;
            else return value;
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }
    }

}