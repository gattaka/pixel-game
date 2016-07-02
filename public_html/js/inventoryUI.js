var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var InvItem = (function () {
        function InvItem(item, quant, element, count) {
            this.item = item;
            this.quant = quant;
            this.element = element;
            this.count = count;
        }
        return InvItem;
    }());
    var InventoryUI = (function (_super) {
        __extends(InventoryUI, _super);
        function InventoryUI(game) {
            _super.call(this, InventoryUI.N, InventoryUI.M);
            this.game = game;
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
                if (self.collapsedSprite != null) {
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
            // TODO v případě 0 odebrat
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant -= quant;
                    invItem.count.setText(invItem.quant);
                    if (self.collapsedSprite != null) {
                        self.collapsedCount.setText(invItem.quant);
                    }
                    if (invItem.quant == 0) {
                        if (self.collapsedSprite != null) {
                            self.collapsedCont.removeChild(self.collapsedSprite);
                            self.collapsedCont.removeChild(self.collapsedCount);
                            self.collapsedSprite = null;
                            self.collapsedCount = null;
                            self.collapsedHighlight.visible = false;
                        }
                        self.itemsCont.removeChild(invItem.element);
                        self.itemsCont.removeChild(invItem.count);
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
                        self.collapsedCount.setText(invItem.quant);
                    }
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (self.invContent[i] == null) {
                    var sprite = self.game.resources.getSprite(item);
                    self.itemsCont.addChild(sprite);
                    sprite.x = (i % InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
                    sprite.y = Math.floor(i / InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
                    var text = new Lich.Label("" + quant, Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
                    self.itemsCont.addChild(text);
                    text.x = sprite.x;
                    text.y = sprite.y + Lich.Resources.PARTS_SIZE - Lich.PartsUI.TEXT_SIZE;
                    self.invContent[i] = new InvItem(item, quant, sprite, text);
                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
                    sprite.hitArea = hitArea;
                    (function () {
                        var currentItem = self.invContent[i];
                        sprite.on("mousedown", function (evt) {
                            self.itemHighlight.visible = true;
                            self.itemHighlight.x = sprite.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                            self.itemHighlight.y = sprite.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;
                            self.collapsedCont.removeChild(self.collapsedSprite);
                            self.collapsedCont.removeChild(self.collapsedCount);
                            self.collapsedHighlight.visible = true;
                            self.collapsedSprite = self.game.resources.getSprite(item);
                            self.collapsedCount = new Lich.Label("" + currentItem.quant, Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
                            self.collapsedCont.addChild(self.collapsedSprite);
                            self.collapsedCont.addChild(self.collapsedCount);
                            self.collapsedSprite.x = Lich.PartsUI.BORDER;
                            self.collapsedSprite.y = Lich.PartsUI.BORDER;
                            self.collapsedCount.x = Lich.PartsUI.BORDER;
                            self.collapsedCount.y = Lich.PartsUI.BORDER + Lich.Resources.PARTS_SIZE - Lich.PartsUI.TEXT_SIZE;
                            self.collapsedCont.visible = false;
                        }, null, false);
                    })();
                    return true; // usazeno
                }
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
