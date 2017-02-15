var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var ItemUI = (function (_super) {
        __extends(ItemUI, _super);
        function ItemUI(item, quant) {
            var _this = _super.call(this) || this;
            _this.item = item;
            _this.width = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING;
            _this.height = _this.width;
            var invDef = Lich.Resources.getInstance().invObjectDefs[item];
            _this.invDef = invDef;
            var frames = 1;
            if (typeof invDef === "undefined" || invDef == null) {
                frames = 1;
            }
            else {
                frames = invDef.frames;
            }
            _this.frames = frames;
            var sprite = Lich.Resources.getInstance().getSprite(Lich.InventoryKey[item], frames);
            _this.sprite = sprite;
            _this.addChild(sprite);
            sprite.x = _this.width / 2 - sprite.width / 2;
            sprite.y = _this.height / 2 - sprite.height / 2;
            var text = new Lich.Label("" + quant, Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            _this.count = text;
            _this.addChild(text);
            text.x = 0;
            text.y = _this.height - Lich.PartsUI.TEXT_SIZE - Lich.PartsUI.SPACING;
            return _this;
        }
        return ItemUI;
    }(Lich.SheetContainer));
    Lich.ItemUI = ItemUI;
})(Lich || (Lich = {}));
