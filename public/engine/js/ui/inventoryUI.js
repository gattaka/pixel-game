var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var InventoryUI = (function (_super) {
        __extends(InventoryUI, _super);
        function InventoryUI(n, m) {
            if (n === void 0) { n = InventoryUI.DEFAULT_N; }
            if (m === void 0) { m = InventoryUI.DEFAULT_M; }
            var _this = _super.call(this, n, m) || this;
            _this.lineOffset = 0;
            // mapa existujících UI prvků dle typu položky
            _this.itemsUIMap = new Lich.HashMap();
            _this.itemHighlightVisibleBeforeCollapse = true;
            _this.itemsCont = new PIXI.Container();
            _this.collapsed = false;
            _this.collapsedCont = new PIXI.Container();
            var self = _this;
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
            var upBtn = new Lich.Button(Lich.UISpriteKey.UI_UP_KEY, function () {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            });
            var downBtn = new Lich.Button(Lich.UISpriteKey.UI_DOWN_KEY, function () {
                var occupLines = Math.ceil(Lich.Inventory.getInstance().getLength() / self.n);
                if (self.lineOffset < occupLines - self.m) {
                    self.lineOffset++;
                    self.render();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            });
            self.upBtn = upBtn;
            self.downBtn = downBtn;
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = Lich.PartsUI.pixelsByX(self.n) + Lich.PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = Lich.PartsUI.pixelsByX(self.m) - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.INV_CHANGE, function (payload) {
                if (payload.amount > 0) {
                    self.invInsert(payload.key, payload.amount);
                }
                else {
                    self.invRemove(payload.key, -payload.amount);
                }
                return false;
            });
            return _this;
        }
        InventoryUI.prototype.render = function () {
            var self = this;
            var inventory = Lich.Inventory.getInstance();
            this.itemsCont.removeChildren();
            this.itemHighlight.visible = false;
            var itemsOffset = this.lineOffset * self.n;
            for (var i = itemsOffset; i < self.n * self.m + itemsOffset && i < inventory.getLength(); i++) {
                if (inventory.getItem(i) != null) {
                    this.createUIItem(inventory.getItem(i), i - itemsOffset);
                }
            }
        };
        InventoryUI.prototype.toggle = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                // jsem zabalen?
                if (self.collapsed) {
                    var newHeight = Lich.PartsUI.pixelsByX(self.m);
                    self.y = self.y - (newHeight - self.fixedHeight);
                    self.fixedWidth = Lich.PartsUI.pixelsByX(self.n);
                    self.fixedHeight = newHeight;
                    self.drawBackground();
                    self.itemHighlight.visible = self.itemHighlightVisibleBeforeCollapse;
                    self.upBtn.visible = true;
                    self.downBtn.visible = true;
                    if (self.collapsedX && self.collapsedY) {
                        self.x = self.expandedX;
                        self.y = self.expandedY;
                    }
                }
                else {
                    var newHeight = Lich.PartsUI.pixelsByX(1);
                    self.y = self.y + (self.fixedHeight - newHeight);
                    self.fixedWidth = Lich.PartsUI.pixelsByX(1);
                    self.fixedHeight = newHeight;
                    self.drawBackground();
                    self.itemHighlightVisibleBeforeCollapse = self.itemHighlight.visible;
                    self.itemHighlight.visible = false;
                    self.upBtn.visible = false;
                    self.downBtn.visible = false;
                    if (self.collapsedX && self.collapsedY) {
                        self.x = self.collapsedX;
                        self.y = self.collapsedY;
                    }
                }
                self.itemsCont.visible = self.collapsed;
                if (self.collapsedItem != null) {
                    self.collapsedCont.visible = !self.collapsed;
                }
                self.collapsed = !self.collapsed;
                self.toggleFlag = false;
            }
        };
        InventoryUI.prototype.prepareForToggle = function () {
            this.toggleFlag = true;
        };
        InventoryUI.prototype.invRemove = function (item, newQuant) {
            var self = this;
            var itemUI = self.itemsUIMap[item];
            if (itemUI) {
                itemUI.count.setText(newQuant);
                if (self.collapsedItem != null) {
                    self.collapsedItem.count.setText(newQuant);
                }
                if (newQuant == 0) {
                    if (self.collapsedItem != null) {
                        self.collapsedCont.removeChild(self.collapsedItem);
                        self.collapsedItem = null;
                        self.collapsedHighlight.visible = false;
                    }
                    self.itemsCont.removeChild(itemUI);
                    self.itemHighlight.visible = false;
                    self.itemsUIMap[item] = null;
                    self.render();
                }
                else {
                }
            }
        };
        InventoryUI.prototype.invInsert = function (item, newQuant) {
            var self = this;
            var inventory = Lich.Inventory.getInstance();
            var itemUI = self.itemsUIMap[item];
            if (itemUI) {
                // pokud už existuje zvyš počet
                var itemUI_1 = self.itemsUIMap[item];
                if (itemUI_1) {
                    itemUI_1.count.setText(newQuant);
                    if (inventory.getChoosenItem() == item) {
                        self.collapsedItem.count.setText(newQuant);
                    }
                }
            }
            else {
                // pokud ještě neexistuje a je na ní vidět, vytvoř 
                var i = inventory.getItemIndex(item);
                var itemsOffset = self.lineOffset * self.n;
                if (i >= itemsOffset
                    && i < self.n * self.m + itemsOffset) {
                    self.createUIItem(item, i - itemsOffset);
                }
            }
        };
        InventoryUI.prototype.createUIItem = function (item, i) {
            var self = this;
            var inventory = Lich.Inventory.getInstance();
            var quant = inventory.getItemQuant(item);
            var itemUI = new Lich.ItemUI(item, quant, function () {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                inventory.setChoosenItem(item);
                self.collapsedCont.removeChild(self.collapsedItem);
                self.collapsedHighlight.visible = true;
                self.collapsedItem = new Lich.ItemUI(item, quant);
                self.collapsedCont.addChild(self.collapsedItem);
                self.collapsedItem.x = Lich.PartsUI.BORDER;
                self.collapsedItem.y = Lich.PartsUI.BORDER;
                self.collapsedCont.visible = false;
            });
            self.itemsUIMap[item] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % self.n) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            itemUI.y = Math.floor(i / self.n) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            if (inventory.getChoosenItem() == item) {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
            }
        };
        return InventoryUI;
    }(Lich.PartsUI));
    InventoryUI.DEFAULT_N = 4;
    InventoryUI.DEFAULT_M = 8;
    Lich.InventoryUI = InventoryUI;
})(Lich || (Lich = {}));
