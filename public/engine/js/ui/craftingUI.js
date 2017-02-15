var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var IngredientsCont = (function (_super) {
        __extends(IngredientsCont, _super);
        function IngredientsCont() {
            var _this = _super.call(this, CraftingUI.N * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING) - Lich.PartsUI.SPACING + 2 * Lich.AbstractUI.BORDER, Lich.Resources.PARTS_SIZE + 2 * Lich.PartsUI.SELECT_BORDER) || this;
            _this.itemsCont = new Lich.SheetContainer();
            _this.itemsCont.x = Lich.PartsUI.BORDER;
            _this.itemsCont.y = Lich.PartsUI.SELECT_BORDER;
            _this.addChild(_this.itemsCont);
            return _this;
        }
        return IngredientsCont;
    }(Lich.AbstractUI));
    var CraftingUI = (function (_super) {
        __extends(CraftingUI, _super);
        function CraftingUI() {
            var _this = _super.call(this, CraftingUI.N, CraftingUI.M) || this;
            _this.lineOffset = 0;
            _this.choosenItem = null;
            // --- Virtuální seznam ---
            // pole obsazení položkami
            _this.itemsTypeArray = new Array();
            // mapa pořadí typů položek
            _this.itemsTypeIndexMap = new Lich.HashMap();
            // --- UI ----
            // mapa existujících UI prvků dle typu položky
            _this.itemsUIMap = new Lich.HashMap();
            _this.itemsCont = new Lich.SheetContainer();
            var self = _this;
            _this.workstationIcon = Lich.Resources.getInstance().getBitmap(Lich.SpellKey[Lich.SpellKey.SPELL_PLACE_KEY]);
            var bounds = _this.workstationIcon.getBounds();
            _this.workstationIconBgr = new Lich.UIBackground();
            _this.workstationIconBgr.drawBackground(bounds.width + 2 * Lich.PartsUI.SELECT_BORDER, bounds.height + 2 * Lich.PartsUI.SELECT_BORDER);
            _this.workstationIconBgr.x = -(bounds.width + 3 * Lich.PartsUI.SELECT_BORDER);
            _this.workstationIcon.x = _this.workstationIconBgr.x + Lich.PartsUI.SELECT_BORDER;
            _this.workstationIcon.y = Lich.PartsUI.SELECT_BORDER;
            _this.addChild(_this.workstationIconBgr);
            _this.addChild(_this.workstationIcon);
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.WORKSTATION_UNREACHABLE, function (payload) {
                if (self.workstation && self.parent) {
                    self.hide();
                }
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.WORKSTATION_CHANGE, function (payload) {
                // pokud to volá uživatel klávesnicí, pak neřeš (payload.payload = undefined)
                // zobrazování je přes toggle, což řídí keyboard handle od game
                // pokud je volán jako akce workstation objektu (payload.payload != undefined)
                // pak se zobraz, pokud už nejsi zobrazen
                if (payload.payload && !self.parent) {
                    self.show();
                }
                self.workstationIcon.image = Lich.Resources.getInstance().getImage(payload.payload ? Lich.InventoryKey[Lich.WORKSTATIONS_ICONS[payload.payload]] : Lich.SpellKey[Lich.SpellKey.SPELL_PLACE_KEY]);
                var bounds = self.workstationIcon.getBounds();
                self.workstationIconBgr.drawBackground(bounds.width + 2 * Lich.PartsUI.SELECT_BORDER, bounds.height + 2 * Lich.PartsUI.SELECT_BORDER);
                self.workstationIconBgr.x = -(bounds.width + 3 * Lich.PartsUI.SELECT_BORDER);
                self.workstationIcon.x = self.workstationIconBgr.x + Lich.PartsUI.SELECT_BORDER;
                _this.workstation = payload.payload;
                self.measureCacheArea();
                return false;
            });
            // zvýraznění vybrané položky
            self.itemHighlight = new Lich.Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = Lich.PartsUI.BORDER;
            self.itemsCont.y = Lich.PartsUI.BORDER;
            self.addChild(self.itemsCont);
            // tlačítka
            var upBtn = new Lich.Button(Lich.UIGFXKey.UI_UP_KEY);
            var downBtn = new Lich.Button(Lich.UIGFXKey.UI_DOWN_KEY);
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = Lich.PartsUI.pixelsByX(CraftingUI.N) + Lich.PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = Lich.PartsUI.pixelsByX(CraftingUI.M) - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            upBtn.on("mousedown", function (evt) {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            downBtn.on("mousedown", function (evt) {
                var occupLines = Math.ceil(self.itemsTypeArray.length / CraftingUI.N);
                if (self.lineOffset < occupLines - CraftingUI.M) {
                    self.lineOffset++;
                    self.render();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            // Přehled ingrediencí
            self.ingredientsCont = new IngredientsCont();
            self.addChild(self.ingredientsCont);
            self.ingredientsCont.x = 0;
            self.ingredientsCont.y = Lich.PartsUI.pixelsByX(CraftingUI.M) + Lich.PartsUI.SELECT_BORDER;
            // craft tlačítko
            var craftBtn = new Lich.Button(Lich.UIGFXKey.UI_CRAFT_KEY);
            self.addChild(craftBtn);
            craftBtn.x = Lich.PartsUI.pixelsByX(CraftingUI.N) + Lich.PartsUI.SELECT_BORDER;
            craftBtn.y = Lich.PartsUI.pixelsByX(CraftingUI.M) + Lich.PartsUI.SELECT_BORDER;
            craftBtn.on("mousedown", function (evt) {
                if (self.choosenItem) {
                    var oldItem = self.choosenItem;
                    var index = self.itemsTypeIndexMap[oldItem];
                    var recipe = self.itemsTypeArray[index];
                    for (var _i = 0, _a = recipe.ingredients; _i < _a.length; _i++) {
                        var ingred = _a[_i];
                        self.inventoryUI.invRemove(ingred.key, ingred.quant);
                    }
                    self.inventoryUI.invInsert(recipe.outcome.key, recipe.outcome.quant);
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CRAFT_KEY);
                }
            }, null, false);
            self.measureCacheArea();
            return _this;
        }
        CraftingUI.prototype.setInventoryUI = function (inventoryUI) {
            this.inventoryUI = inventoryUI;
        };
        CraftingUI.prototype.hide = function () {
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.WORKSTATION_CHANGE, undefined));
            this.workstation = undefined;
            _super.prototype.hide.call(this);
        };
        CraftingUI.prototype.toggle = function () {
            // pokud jsem zrovna otevřený pro nějakou workstation (ne ruční)
            // pak zavření neudělá zavřít, ale přepnout do ručního módu
            if (this.toggleFlag) {
                if (this.workstation && this.parent) {
                    Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.WORKSTATION_CHANGE, undefined));
                }
                else {
                    // jinak se chovej jako normální přepínač viditelnosti
                    _super.prototype.toggle.call(this);
                }
                this.toggleFlag = false;
            }
        };
        CraftingUI.prototype.measureCacheArea = function () {
            var offset = this.workstationIconBgr.width + Lich.PartsUI.SELECT_BORDER + 5;
            this.cache(-offset, -offset, this.width + Lich.Button.sideSize + Lich.PartsUI.SELECT_BORDER + offset + 5, this.height + Lich.Button.sideSize + Lich.PartsUI.SELECT_BORDER + offset + 5);
        };
        CraftingUI.prototype.render = function () {
            this.itemsCont.removeAllChildren();
            this.itemHighlight.visible = false;
            var itemsOffset = this.lineOffset * CraftingUI.N;
            for (var i = itemsOffset; i < CraftingUI.N * CraftingUI.M + itemsOffset && i < this.itemsTypeArray.length; i++) {
                var item = this.itemsTypeArray[i];
                if (item) {
                    this.createUIItem(item, i - itemsOffset);
                }
            }
            this.updateCache();
        };
        CraftingUI.prototype.createUIItem = function (item, i) {
            var self = this;
            var key = JSON.stringify(item, self.replacer);
            var itemUI = new Lich.ItemUI(item.outcome.key, item.outcome.quant);
            self.itemsUIMap[key] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % CraftingUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            itemUI.y = Math.floor(i / CraftingUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            itemUI.hitArea = hitArea;
            if (self.choosenItem == key) {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
            }
            (function () {
                var currentItem = self.itemsUIMap[key];
                itemUI.on("mousedown", function (evt) {
                    self.itemHighlight.visible = true;
                    self.itemHighlight.x = itemUI.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                    self.itemHighlight.y = itemUI.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                    self.choosenItem = key;
                    // vypiš ingredience
                    self.ingredientsCont.itemsCont.removeAllChildren();
                    var index = self.itemsTypeIndexMap[self.choosenItem];
                    var recipe = self.itemsTypeArray[index];
                    for (var _i = 0, _a = recipe.ingredients; _i < _a.length; _i++) {
                        var ingred = _a[_i];
                        var ingredUI = new Lich.ItemUI(ingred.key, ingred.quant);
                        ingredUI.x = self.ingredientsCont.itemsCont.children.length * (Lich.PartsUI.SPACING + Lich.Resources.PARTS_SIZE);
                        ingredUI.y = 0;
                        self.ingredientsCont.itemsCont.addChild(ingredUI);
                    }
                    self.updateCache();
                }, null, false);
            })();
        };
        CraftingUI.prototype.replacer = function (key, value) {
            if (key == "recipe")
                return undefined;
            if (key == "available")
                return undefined;
            else
                return value;
        };
        CraftingUI.prototype.createRecipeAvailChangeListener = function () {
            var self = this;
            return function (recipes) {
                self.itemsTypeArray = new Array();
                // Klíč se vytváří takhle, recepty nemůžou mít unikátní klíč, 
                // protože tentýž výrobek lze někdy vyrobit rozdílnými ingrediencemi
                recipes.forEach(function (recipe) {
                    var key = JSON.stringify(recipe, self.replacer);
                    if (recipe.available) {
                        var i = 0;
                        for (i = 0; i < self.itemsTypeArray.length; i++) {
                            // buď najdi volné místo...
                            if (!self.itemsTypeArray[i]) {
                                break;
                            }
                        }
                        // ...nebo vlož položku na konec pole
                        self.itemsTypeArray[i] = recipe;
                        self.itemsTypeIndexMap[key] = i;
                    }
                    else {
                        // Pokud tento recept zmizel a byl přitom vybrán,
                        // zajisti, aby se odebral z výběru a zmizel pak
                        // i přehled jeho ingrediencí
                        self.itemsTypeIndexMap[key] = undefined;
                        if (self.choosenItem == key) {
                            self.ingredientsCont.itemsCont.removeAllChildren();
                            self.choosenItem = undefined;
                        }
                    }
                });
                self.render();
            };
        };
        CraftingUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        return CraftingUI;
    }(Lich.PartsUI));
    CraftingUI.N = 12;
    CraftingUI.M = 6;
    CraftingUI.CRAFT_SIZE = CraftingUI.N * CraftingUI.M;
    Lich.CraftingUI = CraftingUI;
})(Lich || (Lich = {}));
