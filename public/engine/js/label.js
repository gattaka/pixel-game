var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(text, font, color, outline, outlineColor, outlineWidth) {
            if (font === void 0) { font = Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT; }
            if (color === void 0) { color = Lich.Resources.TEXT_COLOR; }
            if (outline === void 0) { outline = true; }
            if (outlineColor === void 0) { outlineColor = Lich.Resources.OUTLINE_COLOR; }
            if (outlineWidth === void 0) { outlineWidth = 1; }
            var _this = _super.call(this) || this;
            _this.label = new PIXI.Text(text, { fontFamily: font, fill: color, stroke: outlineColor, strokeThickness: outlineWidth });
            _this.addChild(_this.label);
            _this.height = _this.label.getBounds().height;
            _this.width = _this.label.getBounds().width;
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
