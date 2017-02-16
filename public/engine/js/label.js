var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(text) {
            var _this = _super.call(this) || this;
            _this.label = Lich.Resources.getInstance().getText(text);
            _this.addChild(_this.label);
            _this.height = _this.label.getBounds().height;
            _this.width = _this.label.getBounds().width;
            return _this;
        }
        Label.prototype.setText = function (text) {
            this.label.text = text;
        };
        return Label;
    }(Lich.SheetContainer));
    Lich.Label = Label;
})(Lich || (Lich = {}));
