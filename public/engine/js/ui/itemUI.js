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
    var ItemUI = (function (_super) {
        __extends(ItemUI, _super);
        function ItemUI(item, quant, onPress) {
            var _this = _super.call(this) || this;
            _this.item = item;
            _this.fixedWidth = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING;
            _this.fixedHeight = _this.fixedWidth;
            var invDef = Lich.Resources.getInstance().getInvObjectDef(item);
            _this.invDef = invDef;
            var sprite = Lich.Resources.getInstance().getInvUISprite(item);
            _this.sprite = sprite;
            _this.addChild(sprite);
            // sprite.x = this.fixedWidth / 2 - Resources.PARTS_SIZE / 2;
            // sprite.y = this.fixedHeight / 2 - Resources.PARTS_SIZE / 2;
            var text = new Lich.Label("" + quant);
            _this.count = text;
            _this.addChild(text);
            text.x = 0;
            text.y = _this.fixedHeight - Lich.PartsUI.TEXT_SIZE - Lich.PartsUI.SPACING;
            if (onPress) {
                _this.hitLayer = new PIXI.Container();
                _this.hitLayer.interactive = true;
                _this.hitLayer.buttonMode = true;
                _this.hitLayer.fixedWidth = _this.fixedWidth;
                _this.hitLayer.fixedHeight = _this.fixedHeight;
                _this.hitLayer.hitArea = new PIXI.Rectangle(0, 0, _this.fixedWidth, _this.fixedHeight);
                _this.hitLayer.on("pointerdown", onPress);
                _this.addChild(_this.hitLayer);
            }
            return _this;
        }
        return ItemUI;
    }(PIXI.Container));
    Lich.ItemUI = ItemUI;
})(Lich || (Lich = {}));
