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
            _super.call(this);
            this.label = new createjs.Text(text, font, color);
            this.addChild(this.label);
            if (outline) {
                this.outlineLabel = new createjs.Text(text, font, outlineColor);
                this.addChild(this.outlineLabel);
                if (typeof outlineWidth !== "undefined")
                    outlineWidth = 1;
                this.outlineLabel.outline = outlineWidth;
            }
            this.height = this.label.getBounds().height;
            this.width = this.label.getBounds().width;
        }
        Label.prototype.setText = function (value) {
            this.label.text = value;
            if (typeof this.outlineLabel !== "undefined")
                this.outlineLabel.text = value;
        };
        return Label;
    }(createjs.Container));
    Lich.Label = Label;
})(Lich || (Lich = {}));
