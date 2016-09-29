var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractUI = (function (_super) {
        __extends(AbstractUI, _super);
        function AbstractUI(width, height) {
            _super.call(this);
            this.width = width;
            this.height = height;
            this.outerShape = new createjs.Shape();
            this.drawBackground();
            this.addChild(this.outerShape);
        }
        AbstractUI.prototype.drawBackground = function () {
            this.outerShape.graphics.clear();
            this.outerShape.graphics.setStrokeStyle(2);
            this.outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            this.outerShape.graphics.drawRoundRect(0, 0, this.width, this.height, 3);
        };
        AbstractUI.BORDER = 10;
        AbstractUI.TEXT_SIZE = 15;
        return AbstractUI;
    }(createjs.Container));
    Lich.AbstractUI = AbstractUI;
    var UIShape = (function (_super) {
        __extends(UIShape, _super);
        function UIShape(red, green, blue, red2, green2, blue2, op, op2) {
            if (red2 === void 0) { red2 = red; }
            if (green2 === void 0) { green2 = green; }
            if (blue2 === void 0) { blue2 = blue; }
            if (op === void 0) { op = 0.2; }
            if (op2 === void 0) { op2 = 0.5; }
            _super.call(this);
            this.graphics.beginFill("rgba(" + red + "," + green + "," + blue + "," + op + ")");
            this.graphics.beginStroke("rgba(" + red2 + "," + green2 + "," + blue2 + "," + op2 + ")");
            this.graphics.setStrokeStyle(2);
            var side = Lich.Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            this.graphics.drawRoundRect(0, 0, side, side, 3);
        }
        return UIShape;
    }(createjs.Shape));
    Lich.UIShape = UIShape;
    var Highlight = (function (_super) {
        __extends(Highlight, _super);
        function Highlight() {
            _super.call(this, 250, 250, 10);
        }
        return Highlight;
    }(UIShape));
    Lich.Highlight = Highlight;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(bitmap) {
            _super.call(this);
            var bgr = new UIShape(10, 50, 10, 0, 0, 0, 0.5, 0.7);
            this.addChild(bgr);
            bgr.x = 0;
            bgr.y = 0;
            if (bitmap) {
                var btmp = Lich.Resources.INSTANCE.getBitmap(Lich.UIGFXKey[bitmap]);
                this.addChild(btmp);
                btmp.x = PartsUI.SELECT_BORDER;
                btmp.y = PartsUI.SELECT_BORDER;
            }
        }
        return Button;
    }(createjs.Container));
    Lich.Button = Button;
    var PartsUI = (function (_super) {
        __extends(PartsUI, _super);
        function PartsUI(n, m) {
            _super.call(this, PartsUI.pixelsByX(n), PartsUI.pixelsByX(m));
            this.n = n;
            this.m = m;
        }
        PartsUI.pixelsByX = function (x) {
            return x * Lich.Resources.PARTS_SIZE + (x - 1) * (PartsUI.SPACING) + 2 * AbstractUI.BORDER;
        };
        PartsUI.SELECT_BORDER = 5;
        PartsUI.SPACING = 12;
        return PartsUI;
    }(AbstractUI));
    Lich.PartsUI = PartsUI;
})(Lich || (Lich = {}));
