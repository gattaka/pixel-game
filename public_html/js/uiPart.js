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
        PartsUI.prototype.createHighlightShape = function () {
            var shape = new createjs.Shape();
            shape.graphics.beginStroke("rgba(250,250,10,0.5)");
            shape.graphics.beginFill("rgba(250,250,10,0.2)");
            shape.graphics.setStrokeStyle(2);
            shape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + PartsUI.SELECT_BORDER * 2, 3);
            return shape;
        };
        PartsUI.SELECT_BORDER = 5;
        PartsUI.SPACING = 12;
        return PartsUI;
    }(AbstractUI));
    Lich.PartsUI = PartsUI;
})(Lich || (Lich = {}));
