var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var UIPart = (function (_super) {
        __extends(UIPart, _super);
        function UIPart(width, height) {
            _super.call(this);
            this.width = width;
            this.height = height;
            this.outerShape = new createjs.Shape();
            this.drawBackground();
            this.addChild(this.outerShape);
        }
        UIPart.prototype.drawBackground = function () {
            this.outerShape.graphics.clear();
            this.outerShape.graphics.setStrokeStyle(2);
            this.outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            this.outerShape.graphics.drawRoundRect(0, 0, this.width, this.height, 3);
        };
        UIPart.BORDER = 10;
        UIPart.SELECT_BORDER = 5;
        UIPart.SPACING = 12;
        UIPart.TEXT_SIZE = 15;
        return UIPart;
    }(createjs.Container));
    Lich.UIPart = UIPart;
})(Lich || (Lich = {}));
