var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var DebugLogUI = (function (_super) {
        __extends(DebugLogUI, _super);
        function DebugLogUI(x, y) {
            _super.call(this, x, y);
        }
        DebugLogUI.prototype.addNextChild = function (child) {
            if (this.height == 0) {
                this.height = DebugLogUI.PADDING * 2;
            }
            child.x = DebugLogUI.PADDING;
            child.y = this.height - DebugLogUI.PADDING;
            this.height += child.height + DebugLogUI.PADDING;
            if (child.width + 2 * DebugLogUI.PADDING > this.width) {
                this.width = child.width + 2 * DebugLogUI.PADDING;
            }
            _super.prototype.addChild.call(this, child);
            this.drawBackground();
        };
        DebugLogUI.PADDING = 5;
        return DebugLogUI;
    }(Lich.UIPart));
    Lich.DebugLogUI = DebugLogUI;
})(Lich || (Lich = {}));
