var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var InventoryUI = (function (_super) {
        __extends(InventoryUI, _super);
        function InventoryUI(recipeListener) {
            _super.call(this, InventoryUI.N, InventoryUI.M);
            this.recipeListener = recipeListener;
            this.toggleFlag = true;
            this.choosenItem = null;
            this.lineOffset = 0;
            // --- Virtuální inventář ---
            // pole obsazení položkami
            this.itemsTypeArray = new Array();
            // mapa pořadí typů položek
            this.itemsTypeIndexMap = new Lich.HashMap();
            // mapa počtů dle typu položky
            this.itemsQuantityMap = new Lich.HashMap();
            // --- UI ----
            // mapa existujících UI prvků dle typu položky
            this.itemsUIMap = new Lich.HashMap();
            this.itemHighlightVisibleBeforeCollapse = true;
            this.itemsCont = new createjs.Container();
            this.collapsed = false;
            this.collapsedCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlight = new Lich.Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = Lich.PartsUI.BORDER;
            self.itemsCont.y = Lich.PartsUI.BORDER;
            self.addChild(self.itemsCont);
            // kontejner a zvýraznění zabaleného inventáře  
            self.addChild(self.collapsedCont);
            self.collapsedCont.visible = false;
            self.collapsedHighlight = new Lich.Highlight();
            self.collapsedHighlight.x = Lich.PartsUI.SELECT_BORDER;
            self.collapsedHighlight.y = Lich.PartsUI.SELECT_BORDER;
            self.collapsedCont.addChild(self.collapsedHighlight);
            // tlačítka
            var upBtn = new Lich.Button(Lich.UIGFXKey.UI_UP_KEY);
            var downBtn = new Lich.Button(Lich.UIGFXKey.UI_DOWN_KEY);
            self.upBtn = upBtn;
            self.downBtn = downBtn;
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = Lich.PartsUI.pixelsByX(InventoryUI.N) + Lich.PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = Lich.PartsUI.pixelsByX(InventoryUI.M) - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            upBtn.on("mousedown", function (evt) {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            downBtn.on("mousedown", function (evt) {
                var occupLines = Math.ceil(self.itemsTypeArray.length / InventoryUI.N);
                if (self.lineOffset < occupLines - InventoryUI.M) {
                    self.lineOffset++;
                    self.render();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
        }
        InventoryUI.prototype.render = function () {
            this.itemsCont.removeAllChildren();
            this.itemHighlight.visible = false;
            var itemsOffset = this.lineOffset * InventoryUI.N;
            for (var i = itemsOffset; i < InventoryUI.N * InventoryUI.M + itemsOffset && i < this.itemsTypeArray.length; i++) {
                if (this.itemsTypeArray[i] != null) {
                    this.createUIItem(this.itemsTypeArray[i], i - itemsOffset);
                }
            }
        };
        InventoryUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        InventoryUI.prototype.toggleInv = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                // jsem zabalen?
                if (self.collapsed) {
                    var newHeight = Lich.PartsUI.pixelsByX(InventoryUI.M);
                    self.y = self.y - (newHeight - self.height);
                    self.width = Lich.PartsUI.pixelsByX(InventoryUI.N);
                    self.height = newHeight;
                    self.drawBackground();
                    self.itemHighlight.visible = self.itemHighlightVisibleBeforeCollapse;
                    self.upBtn.visible = true;
                    self.downBtn.visible = true;
                }
                else {
                    var newHeight = Lich.PartsUI.pixelsByX(1);
                    self.y = self.y + (self.height - newHeight);
                    self.width = Lich.PartsUI.pixelsByX(1);
                    self.height = newHeight;
                    self.drawBackground();
                    self.itemHighlightVisibleBeforeCollapse = self.itemHighlight.visible;
                    self.itemHighlight.visible = false;
                    self.upBtn.visible = false;
                    self.downBtn.visible = false;
                }
                self.itemsCont.visible = self.collapsed;
                if (self.collapsedItem != null) {
                    self.collapsedCont.visible = !self.collapsed;
                }
                self.collapsed = !self.collapsed;
                self.toggleFlag = false;
            }
        };
        InventoryUI.prototype.prepareForToggleInv = function () {
            this.toggleFlag = true;
        };
        InventoryUI.prototype.invRemove = function (item, quantChange) {
            var self = this;
            var itemUI = self.itemsUIMap[item];
            if (itemUI) {
                var quant = self.itemsQuantityMap[item];
                quant -= quantChange;
                self.itemsQuantityMap[item] = quant;
                self.recipeListener.updateQuant(item, quant);
                itemUI.count.setText(quant);
                if (self.collapsedItem != null) {
                    self.collapsedItem.count.setText(quant);
                }
                if (quant == 0) {
                    if (self.collapsedItem != null) {
                        self.collapsedCont.removeChild(self.collapsedItem);
                        self.collapsedItem = null;
                        self.collapsedHighlight.visible = false;
                    }
                    self.itemsCont.removeChild(itemUI);
                    self.choosenItem = null;
                    self.itemHighlight.visible = false;
                    self.itemsQuantityMap[item] = null;
                    self.itemsUIMap[item] = null;
                    self.itemsTypeArray[self.itemsTypeIndexMap[item]] = null;
                    self.itemsTypeIndexMap[item] = null;
                }
            }
        };
        InventoryUI.prototype.invInsert = function (item, quantChange) {
            var self = this;
            var quant = quantChange;
            if (self.itemsTypeIndexMap[item] || self.itemsTypeIndexMap[item] == 0) {
                // pokud už existuje zvyš počet
                quant = self.itemsQuantityMap[item];
                quant += quantChange;
                self.itemsQuantityMap[item] = quant;
                self.recipeListener.updateQuant(item, quant);
                // pokud je ve viditelné části INV, rovnou aktualizuj popisek množství
                var itemUI = self.itemsUIMap[item];
                if (itemUI) {
                    itemUI.count.setText(quant);
                    if (self.choosenItem === item) {
                        self.collapsedItem.count.setText(quant);
                    }
                }
            }
            else {
                // pokud neexistuje založ novou
                var i = 0;
                for (i = 0; i < self.itemsTypeArray.length; i++) {
                    // buď najdi volné místo...
                    if (!self.itemsTypeArray[i]) {
                        break;
                    }
                }
                // ...nebo vlož položku na konec pole
                self.itemsTypeArray[i] = item;
                self.itemsTypeIndexMap[item] = i;
                self.itemsQuantityMap[item] = quant;
                self.recipeListener.updateQuant(item, quant);
                var itemsOffset = self.lineOffset * InventoryUI.N;
                if (i >= itemsOffset
                    && i < InventoryUI.N * InventoryUI.M + itemsOffset) {
                    self.createUIItem(item, i - itemsOffset);
                }
                return true; // usazeno
            }
        };
        InventoryUI.prototype.createUIItem = function (item, i) {
            var self = this;
            var quant = self.itemsQuantityMap[item];
            var itemUI = new Lich.ItemUI(item, quant);
            self.itemsUIMap[item] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            itemUI.y = Math.floor(i / InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            itemUI.hitArea = hitArea;
            if (self.choosenItem == item) {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
            }
            (function () {
                var currentItem = self.itemsUIMap[item];
                itemUI.on("mousedown", function (evt) {
                    self.itemHighlight.visible = true;
                    self.itemHighlight.x = itemUI.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                    self.itemHighlight.y = itemUI.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                    self.choosenItem = item;
                    self.collapsedCont.removeChild(self.collapsedItem);
                    self.collapsedHighlight.visible = true;
                    self.collapsedItem = new Lich.ItemUI(item, quant);
                    self.collapsedCont.addChild(self.collapsedItem);
                    self.collapsedItem.x = Lich.PartsUI.BORDER;
                    self.collapsedItem.y = Lich.PartsUI.BORDER;
                    self.collapsedCont.visible = false;
                }, null, false);
            })();
        };
        InventoryUI.N = 3;
        InventoryUI.M = 2;
        InventoryUI.INV_SIZE = InventoryUI.N * InventoryUI.M;
        return InventoryUI;
    }(Lich.PartsUI));
    Lich.InventoryUI = InventoryUI;
})(Lich || (Lich = {}));
