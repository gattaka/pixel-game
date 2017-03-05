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
    var DebugLogUI = (function (_super) {
        __extends(DebugLogUI, _super);
        function DebugLogUI(width, height) {
            var _this = _super.call(this, width, height) || this;
            var self = _this;
            _this.mouseLabel = new Lich.Label("PIXELS x: - y: -");
            _this.addNextChild(_this.mouseLabel);
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MOUSE_MOVE, function (data) {
                self.mouseLabel.setText("PIXELS x: " + data.x + " y: " + data.y);
                return false;
            });
            _this.tilesLabel = new Lich.Label("TILES x: - y: -");
            _this.addNextChild(_this.tilesLabel);
            _this.sectorLabel = new Lich.Label("SECTOR: -");
            _this.addNextChild(_this.sectorLabel);
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.POINTED_AREA_CHANGE, function (data) {
                self.tilesLabel.setText("TILES x: " + data.clsnx + " y: " + data.clsny
                    + " clsn: " + data.clsnHit
                    + " type: " + (data.tileType == undefined ? "-" : data.tileType) + " : " + (data.tileVariant == undefined ? "-" : data.tileVariant));
                if (data.secx) {
                    self.sectorLabel.setText("SECTOR: x: " + data.secx + " y: " + data.secy);
                }
                else {
                    self.sectorLabel.setText("SECTOR: -");
                }
                return false;
            });
            _this.playerLabel = new Lich.Label("SPEED x: - y: -");
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.PLAYER_SPEED_CHANGE, function (data) {
                self.playerLabel.setText("SPEED x: " + Math.floor(data.x) + " y: " + Math.floor(data.y));
                return false;
            });
            _this.addNextChild(_this.playerLabel);
            _this.enemiesLabel = new Lich.Label("ENEMIES LEFT: -");
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.ENEMY_COUNT_CHANGE, function (data) {
                self.enemiesLabel.setText("ENEMIES LEFT: " + data.payload);
                return false;
            });
            _this.addNextChild(_this.enemiesLabel);
            return _this;
        }
        DebugLogUI.prototype.addNextChild = function (child) {
            if (this.fixedHeight == 0) {
                this.fixedHeight = DebugLogUI.PADDING * 2;
            }
            child.x = DebugLogUI.PADDING;
            child.y = this.fixedHeight - DebugLogUI.PADDING;
            this.fixedHeight += child.fixedHeight + DebugLogUI.PADDING;
            if (child.fixedWidth + 2 * DebugLogUI.PADDING > this.fixedWidth) {
                this.fixedWidth = child.fixedWidth + 2 * DebugLogUI.PADDING;
            }
            _super.prototype.addChild.call(this, child);
            this.drawBackground();
        };
        return DebugLogUI;
    }(Lich.AbstractUI));
    DebugLogUI.PADDING = 5;
    Lich.DebugLogUI = DebugLogUI;
})(Lich || (Lich = {}));
