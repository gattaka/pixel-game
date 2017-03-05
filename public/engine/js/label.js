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
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(text, font, size, color, outlineColor, outlineWidth) {
            if (font === void 0) { font = Lich.Resources.FONT; }
            if (size === void 0) { size = Lich.PartsUI.TEXT_SIZE; }
            if (color === void 0) { color = Lich.Resources.TEXT_COLOR; }
            if (outlineColor === void 0) { outlineColor = Lich.Resources.OUTLINE_COLOR; }
            if (outlineWidth === void 0) { outlineWidth = 3; }
            return _super.call(this, text, { fontFamily: font, fontSize: size + "px ", fill: color, stroke: outlineColor, strokeThickness: outlineWidth }) || this;
        }
        Label.prototype.setLineWidth = function (value) {
            // this.label.lineWidth = value
        };
        Label.prototype.setLineHeight = function (value) {
            // this.label.lineHeight = value
        };
        Label.prototype.setText = function (value) {
            this.text = value;
        };
        Label.prototype.setColor = function (value) {
            this.style.fill = value;
        };
        return Label;
    }(PIXI.Text));
    Lich.Label = Label;
})(Lich || (Lich = {}));
