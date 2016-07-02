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
            _super.call(this, 450, 150);
            this.game = game;
            this.toggleFlag = true;
            this.choosenItem = null;
            this.draggedItem = null;
            this.invContent = new Array();
            this.itemHighlightShape = new createjs.Shape();
            this.itemsCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + Lich.UIPart.SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + Lich.UIPart.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = Lich.UIPart.BORDER;
            self.itemsCont.y = Lich.UIPart.BORDER;
            self.addChild(self.itemsCont);
        }
        InventoryUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        InventoryUI.prototype.showInv = function () {
            this.visible = true;
        };
        InventoryUI.prototype.hideInv = function () {
            this.visible = false;
        };
        InventoryUI.prototype.toggleInv = function () {
            var self = this;
            if (self.toggleFlag) {
                self.visible = !(self.visible);
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
                    if (invItem.quant == 0) {
                        self.itemsCont.removeChild(invItem.element);
                        self.itemsCont.removeChild(invItem.count);
                        self.choosenItem = null;
                        self.draggedItem = null;
                        self.itemHighlightShape.visible = false;
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
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (self.invContent[i] == null) {
                    var sprite = self.game.resources.getSprite(item);
                    self.itemsCont.addChild(sprite);
                    sprite.x = (i % InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + Lich.UIPart.SPACING);
                    sprite.y = Math.floor(i / InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + Lich.UIPart.SPACING);
                    var text = new Lich.Label("" + quant, Lich.UIPart.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
                    self.itemsCont.addChild(text);
                    text.x = sprite.x;
                    text.y = sprite.y + Lich.Resources.PARTS_SIZE - Lich.UIPart.TEXT_SIZE;
                    self.invContent[i] = new InvItem(item, quant, sprite, text);
                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
                    sprite.hitArea = hitArea;
                    sprite.on("mousedown", function (evt) {
                        if (self.choosenItem === item) {
                            self.choosenItem = null;
                            self.draggedItem = null;
                            self.itemHighlightShape.visible = false;
                        }
                        else {
                            self.itemHighlightShape.visible = true;
                            self.itemHighlightShape.x = sprite.x - Lich.UIPart.SELECT_BORDER + Lich.UIPart.BORDER;
                            self.itemHighlightShape.y = sprite.y - Lich.UIPart.SELECT_BORDER + Lich.UIPart.BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;
                        }
                    }, null, false);
                    return true; // usazeno
                }
            }
            return false; // nevešel se
        };
        InventoryUI.INV_LINE = 10;
        InventoryUI.INV_SIZE = 20;
        return InventoryUI;
    }(Lich.UIPart));
    Lich.InventoryUI = InventoryUI;
})(Lich || (Lich = {}));
