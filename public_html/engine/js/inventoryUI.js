var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var InventoryUI = (function (_super) {
        __extends(InventoryUI, _super);
        function InventoryUI() {
            _super.call(this, InventoryUI.N, InventoryUI.M);
            this.toggleFlag = true;
            this.choosenItem = null;
            this.draggedItem = null;
            this.invContent = new Array();
            this.itemsCont = new createjs.Container();
            this.collapsed = false;
            this.collapsedCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlight = self.createHighlightShape();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = Lich.PartsUI.BORDER;
            self.itemsCont.y = Lich.PartsUI.BORDER;
            self.addChild(self.itemsCont);
            // kontejner a zvýraznění zabaleného inventáře  
            self.addChild(self.collapsedCont);
            self.collapsedCont.visible = false;
            self.collapsedHighlight = self.createHighlightShape();
            self.collapsedHighlight.x = Lich.PartsUI.SELECT_BORDER;
            self.collapsedHighlight.y = Lich.PartsUI.SELECT_BORDER;
            self.collapsedCont.addChild(self.collapsedHighlight);
        }
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
                }
                else {
                    var newHeight = Lich.PartsUI.pixelsByX(1);
                    self.y = self.y + (self.height - newHeight);
                    self.width = Lich.PartsUI.pixelsByX(1);
                    self.height = newHeight;
                    self.drawBackground();
                }
                self.itemsCont.visible = self.collapsed;
                self.itemHighlight.visible = self.collapsed && self.choosenItem != null;
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
        InventoryUI.prototype.decrease = function (item, quant) {
            var self = this;
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant -= quant;
                    invItem.count.setText(invItem.quant);
                    if (self.collapsedItem != null) {
                        self.collapsedItem.count.setText(invItem.quant);
                    }
                    if (invItem.quant == 0) {
                        if (self.collapsedItem != null) {
                            self.collapsedCont.removeChild(self.collapsedItem);
                            self.collapsedItem = null;
                            self.collapsedHighlight.visible = false;
                        }
                        self.itemsCont.removeChild(invItem);
                        self.choosenItem = null;
                        self.draggedItem = null;
                        self.itemHighlight.visible = false;
                        self.invContent[i] = null;
                    }
                    return; // hotovo
                }
            }
        };
        InventoryUI.prototype.invInsert = function (item, quant) {
            var self = this;
            // zkus zvýšit počet
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant += quant;
                    invItem.count.setText(invItem.quant);
                    if (self.choosenItem === item) {
                        self.collapsedItem.count.setText(invItem.quant);
                    }
                    return true; // přidáno
                }
            }
            // zkus založit novou
            var _loop_1 = function() {
                if (self.invContent[i] == null) {
                    var itemUI_1 = new Lich.ItemUI(item, quant);
                    self.invContent[i] = itemUI_1;
                    self.itemsCont.addChild(itemUI_1);
                    itemUI_1.x = (i % InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
                    itemUI_1.y = Math.floor(i / InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
                    hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
                    itemUI_1.hitArea = hitArea;
                    (function () {
                        var currentItem = self.invContent[i];
                        itemUI_1.on("mousedown", function (evt) {
                            self.itemHighlight.visible = true;
                            self.itemHighlight.x = itemUI_1.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                            self.itemHighlight.y = itemUI_1.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;
                            self.collapsedCont.removeChild(self.collapsedItem);
                            self.collapsedHighlight.visible = true;
                            self.collapsedItem = new Lich.ItemUI(item, currentItem.quant);
                            self.collapsedCont.addChild(self.collapsedItem);
                            self.collapsedItem.x = Lich.PartsUI.BORDER;
                            self.collapsedItem.y = Lich.PartsUI.BORDER;
                            self.collapsedCont.visible = false;
                        }, null, false);
                    })();
                    return { value: true }; // usazeno
                }
            };
            var hitArea;
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object") return state_1.value;
            }
            return false; // nevešel se
        };
        InventoryUI.N = 10;
        InventoryUI.M = 3;
        InventoryUI.INV_SIZE = InventoryUI.N * InventoryUI.M;
        return InventoryUI;
    }(Lich.PartsUI));
    Lich.InventoryUI = InventoryUI;
})(Lich || (Lich = {}));
