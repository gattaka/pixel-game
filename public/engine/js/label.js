var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(text, font, charSpacing) {
            if (font === void 0) { font = Lich.FontKey.FNT_SMALL_YELLOW_KEY; }
            if (charSpacing === void 0) { charSpacing = 1; }
            var _this = _super.call(this) || this;
            _this.text = text;
            _this.font = font;
            _this.charSpacing = charSpacing;
            _this.setText(text);
            return _this;
        }
        Label.prototype.setText = function (text) {
            var sText = (text + "").toLowerCase();
            var charSprite;
            for (var i = 0; i < sText.length; i++) {
                var char = sText.charAt(i);
                if (char != ' ') {
                    charSprite = Lich.Resources.getInstance().getFontSprite(this.font, char);
                    charSprite.x = i * (charSprite.width + this.charSpacing);
                    this.addChild(charSprite);
                }
            }
            if (charSprite) {
                this.height = charSprite.height;
                this.width = sText.length * (charSprite.width + this.charSpacing);
            }
        };
        Label.prototype.setLineHeight = function (value) {
            // TODO
        };
        Label.prototype.setLineWidth = function (value) {
            // TODO
        };
        return Label;
    }(Lich.SheetContainer));
    Lich.Label = Label;
})(Lich || (Lich = {}));
