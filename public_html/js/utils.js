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
    var Utils = (function () {
        function Utils() {
        }
        Utils.sign = function (value) {
            return value < 0 ? -1 : 1;
        };
        Utils.floor = function (value) {
            return value < 0 ? Math.ceil(value) : Math.floor(value);
        };
        Utils.ceil = function (value) {
            return value < 0 ? Math.floor(value) : Math.ceil(value);
        };
        Utils.isEven = function (value) {
            return value % 2 == 0;
        };
        Utils.even = function (value) {
            return Utils.isEven(value) ? value : value - 1;
        };
        Utils.get2D = function (a, x, y) {
            // přidej dílek do globální mapy
            var col = a[x];
            if (typeof col === "undefined" || col[y] == null) {
                return null;
            }
            else {
                return col[y];
            }
        };
        Utils.set2D = function (a, x, y, val) {
            var col = a[x];
            if (typeof col === "undefined") {
                col = [];
                a[x] = col;
            }
            col[y] = val;
        };
        Utils.contains = function (a, obj) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        };
        return Utils;
    }());
    Lich.Utils = Utils;
})(Lich || (Lich = {}));
