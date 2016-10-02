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
    var CraftingUI = (function (_super) {
        __extends(CraftingUI, _super);
        function CraftingUI() {
            _super.call(this, CraftingUI.N, CraftingUI.M);
            this.choosenItem = null;
            this.invContent = new Array();
            this.itemsCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlight = self.createHighlightShape();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = Lich.PartsUI.BORDER;
            self.itemsCont.y = Lich.PartsUI.BORDER;
            self.addChild(self.itemsCont);
        }
        CraftingUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        CraftingUI.prototype.invInsert = function (item, quant) {
            var self = this;
            // zkus založit novou
            for (var i = 0; i < Lich.InventoryUI.INV_SIZE; i++) {
                if (self.invContent[i] == null) {
                    var invDef = Lich.Resources.INSTANCE.invObjectDefs[item];
                    var frames = 1;
                    if (typeof invDef === "undefined" || invDef == null) {
                        frames = 1;
                    }
                    else {
                        frames = invDef.frames;
                    }
                    var sprite = Lich.Resources.INSTANCE.getSprite(item, frames);
                    self.itemsCont.addChild(sprite);
                    sprite.x = (i % Lich.InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
                    sprite.y = Math.floor(i / Lich.InventoryUI.N) * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
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
                        }, null, false);
                    })();
                    return true; // usazeno
                }
            }
            return false; // nevešel se
        };
        CraftingUI.N = 10;
        CraftingUI.M = 15;
        CraftingUI.CRAFT_SIZE = CraftingUI.N * CraftingUI.M;
        return CraftingUI;
    }(Lich.PartsUI));
    Lich.CraftingUI = CraftingUI;
})(Lich || (Lich = {}));
