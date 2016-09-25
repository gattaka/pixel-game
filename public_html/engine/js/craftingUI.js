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
            _super.call(this, CraftingUI.N * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING) - Lich.PartsUI.SPACING + 2 * Lich.AbstractUI.BORDER, Lich.Resources.PARTS_SIZE + 2 * Lich.PartsUI.SELECT_BORDER);
            this.itemsCont = new createjs.Container();
            this.itemsCont.x = Lich.PartsUI.BORDER;
            this.itemsCont.y = Lich.PartsUI.SELECT_BORDER;
            this.addChild(this.itemsCont);
        }
        return IngredientsCont;
    }(Lich.AbstractUI));
    var CraftingUI = (function (_super) {
        __extends(CraftingUI, _super);
        function CraftingUI() {
            _super.call(this, CraftingUI.N, CraftingUI.M);
            this.toggleFlag = true;
            this.parentRef = null;
            this.lineOffset = 0;
            this.choosenItem = null;
            // --- Virtuální seznam ---
            // pole obsazení položkami
            this.itemsTypeArray = new Array();
            // mapa pořadí typů položek
            this.itemsTypeIndexMap = new Lich.HashMap();
            // --- UI ----
            // mapa existujících UI prvků dle typu položky
            this.itemsUIMap = new Lich.HashMap();
            this.itemsCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlight = new Lich.Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = Lich.PartsUI.BORDER;
            self.itemsCont.y = Lich.PartsUI.BORDER;
            self.addChild(self.itemsCont);
            // tlačítka
            var upBtn = new Lich.Button(Lich.Resources.UI_UP_KEY);
            var downBtn = new Lich.Button(Lich.Resources.UI_DOWN_KEY);
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = Lich.PartsUI.pixelsByX(CraftingUI.N) + Lich.PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = Lich.PartsUI.pixelsByX(CraftingUI.M) - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            var btnHitAreaSide = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SELECT_BORDER * 2;
            var upBtnHitArea = new createjs.Shape();
            upBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            upBtn.hitArea = upBtnHitArea;
            upBtn.on("mousedown", function (evt) {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                }
            }, null, false);
            var downBtnHitArea = new createjs.Shape();
            downBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            downBtn.hitArea = downBtnHitArea;
            downBtn.on("mousedown", function (evt) {
                var occupLines = Math.ceil(self.itemsTypeArray.length / CraftingUI.N);
                if (self.lineOffset < occupLines - CraftingUI.M) {
                    self.lineOffset++;
                    self.render();
                }
            }, null, false);
            // Přehled ingrediencí
            self.ingredientsCont = new IngredientsCont();
            self.addChild(self.ingredientsCont);
            self.ingredientsCont.x = 0;
            self.ingredientsCont.y = Lich.PartsUI.pixelsByX(CraftingUI.M) + Lich.PartsUI.SELECT_BORDER;
            // craft tlačítko
            var craftBtn = new Lich.Button(Lich.Resources.UI_CRAFT_KEY);
            self.addChild(craftBtn);
            craftBtn.x = Lich.PartsUI.pixelsByX(CraftingUI.N) + Lich.PartsUI.SELECT_BORDER;
            craftBtn.y = Lich.PartsUI.pixelsByX(CraftingUI.M) + Lich.PartsUI.SELECT_BORDER;
            var craftBtnHitArea = new createjs.Shape();
            craftBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            craftBtn.hitArea = craftBtnHitArea;
            craftBtn.on("mousedown", function (evt) {
                if (self.choosenItem) {
                    var index = self.itemsTypeIndexMap[self.choosenItem];
                    var recipe = self.itemsTypeArray[index];
                    for (var _i = 0, _a = recipe.ingredients; _i < _a.length; _i++) {
                        var ingred = _a[_i];
                        self.inventoryUI.invRemove(ingred.key, ingred.quant);
                    }
                    self.inventoryUI.invInsert(recipe.outcome.key, recipe.outcome.quant);
                    Lich.Mixer.play(Lich.Resources.SND_CRAFT_KEY);
                }
            }, null, false);
        }
        CraftingUI.prototype.setInventoryUI = function (inventoryUI) {
            this.inventoryUI = inventoryUI;
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
            return function (recipe) {
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
                    if (self.choosenItem == key) {
                        self.choosenItem = null;
                        self.ingredientsCont.itemsCont.removeAllChildren();
                    }
                    var i = self.itemsTypeIndexMap[key];
                    delete self.itemsTypeIndexMap[key];
                    delete self.itemsTypeArray[i];
                }
                self.render();
            };
        };
        CraftingUI.prototype.toggle = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                if (self.parent == null) {
                    self.parentRef.addChild(self);
                }
                else {
                    self.parentRef = self.parent;
                    self.parent.removeChild(self);
                }
                self.toggleFlag = false;
            }
        };
        CraftingUI.prototype.prepareForToggle = function () {
            this.toggleFlag = true;
        };
        CraftingUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        CraftingUI.N = 3;
        CraftingUI.M = 2;
        CraftingUI.CRAFT_SIZE = CraftingUI.N * CraftingUI.M;
        return CraftingUI;
    }(Lich.PartsUI));
    Lich.CraftingUI = CraftingUI;
})(Lich || (Lich = {}));
