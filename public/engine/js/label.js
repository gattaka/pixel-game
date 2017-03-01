var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(text, font, size, color, outlineColor, outlineWidth) {
            if (font === void 0) { font = Lich.Resources.FONT; }
            if (size === void 0) { size = Lich.PartsUI.TEXT_SIZE; }
            if (color === void 0) { color = Lich.Resources.TEXT_COLOR; }
            if (outlineColor === void 0) { outlineColor = Lich.Resources.OUTLINE_COLOR; }
            if (outlineWidth === void 0) { outlineWidth = 3; }
            var _this = _super.call(this) || this;
            _this.label = new PIXI.Text(text, { fontFamily: font, fontSize: size + "px ", fill: color, stroke: outlineColor, strokeThickness: outlineWidth });
            _this.addChild(_this.label);
            _this.fixedHeight = _this.label.getBounds().height;
            _this.fixedWidth = _this.label.getBounds().width;
            return _this;
        }
        Label.prototype.setLineWidth = function (value) {
            // this.label.lineWidth = value
        };
        Label.prototype.setLineHeight = function (value) {
            // this.label.lineHeight = value
        };
        Label.prototype.setText = function (value) {
            this.label.text = value;
        };
        Label.prototype.setColor = function (value) {
            this.label.style.fill = value;
        };
        return Label;
    }(PIXI.Container));
    Lich.Label = Label;
})(Lich || (Lich = {}));
