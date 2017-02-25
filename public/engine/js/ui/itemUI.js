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
            _this.fixedWidth = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING;
            _this.fixedHeight = _this.fixedWidth;
            var invDef = Lich.Resources.getInstance().invObjectDefs[item];
            _this.invDef = invDef;
            var sprite = Lich.Resources.getInstance().getInvObjectSprite(item);
            _this.sprite = sprite;
            _this.addChild(sprite);
            sprite.x = _this.fixedWidth / 2 - sprite.fixedWidth / 2;
            sprite.y = _this.fixedHeight / 2 - sprite.fixedHeight / 2;
            var text = new Lich.Label("" + quant);
            _this.count = text;
            _this.addChild(text);
            text.x = 0;
            text.y = _this.fixedHeight - Lich.PartsUI.TEXT_SIZE - Lich.PartsUI.SPACING;
            return _this;
        }
        return ItemUI;
    }(PIXI.Container));
    Lich.ItemUI = ItemUI;
})(Lich || (Lich = {}));
