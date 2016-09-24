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
            _super.call(this);
            this.item = item;
            this.width = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING;
            this.height = this.width;
            var invDef = Lich.Resources.INSTANCE.invObjectDefs[item];
            this.invDef = invDef;
            var frames = 1;
            if (typeof invDef === "undefined" || invDef == null) {
                frames = 1;
            }
            else {
                frames = invDef.frames;
            }
            this.frames = frames;
            var sprite = Lich.Resources.INSTANCE.getSprite(item, frames);
            this.sprite = sprite;
            this.addChild(sprite);
            sprite.x = this.width / 2 - sprite.width / 2;
            sprite.y = this.height / 2 - sprite.height / 2;
            var text = new Lich.Label("" + quant, Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            this.count = text;
            this.addChild(text);
            text.x = 0;
            text.y = this.height - Lich.PartsUI.TEXT_SIZE - Lich.PartsUI.SPACING;
        }
        return ItemUI;
    }(createjs.Container));
    Lich.ItemUI = ItemUI;
})(Lich || (Lich = {}));
