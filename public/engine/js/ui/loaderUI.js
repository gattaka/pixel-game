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
    var LoaderUI = (function (_super) {
        __extends(LoaderUI, _super);
        function LoaderUI(game) {
            var _this = _super.call(this) || this;
            _this.game = game;
            _this.loaderName = "Loading...";
            var self = _this;
            self.fixedWidth = game.getSceneWidth();
            self.fixedHeight = game.getSceneHeight();
            self.loadScreen = new PIXI.Graphics();
            self.loadScreen.beginFill(0x000000);
            self.loadScreen.drawRect(0, 0, self.fixedWidth, self.fixedHeight);
            self.addChild(self.loadScreen);
            self.progressLabel = new Lich.Label("Loading...", Lich.Resources.FONT, 30, Lich.Resources.TEXT_COLOR);
            self.progressLabel.x = self.fixedWidth / 2 - 50;
            self.progressLabel.y = self.fixedHeight / 2 - 50;
            self.addChild(self.progressLabel);
            self.currentItemLabel = new Lich.Label("-", Lich.Resources.FONT, 15, Lich.Resources.TEXT_COLOR);
            self.currentItemLabel.x = self.fixedWidth / 2 - 50;
            self.currentItemLabel.y = self.progressLabel.y + 40;
            self.addChild(self.currentItemLabel);
            self.reset();
            return _this;
        }
        LoaderUI.prototype.reset = function () {
            var _this = this;
            var self = this;
            this.currentItemLabel.setText(" ");
            this.progressLabel.setText(this.loaderName);
            this.currentItemLabel.setColor(Lich.Resources.TEXT_COLOR);
            this.progressLabel.setColor(Lich.Resources.TEXT_COLOR);
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOADER_NAME_CHANGE, function (n) {
                self.loaderName = n.payload;
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOADER_COLOR_CHANGE, function (n) {
                _this.currentItemLabel.setColor(n.payload);
                _this.progressLabel.setColor(n.payload);
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_PROGRESS, function (n) {
                self.progressLabel.setText(Math.floor(n.payload * 100) + "% " + self.loaderName);
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_ITEM, function (e) {
                self.currentItemLabel.setText(e.payload);
                return true;
            });
        };
        return LoaderUI;
    }(PIXI.Container));
    Lich.LoaderUI = LoaderUI;
})(Lich || (Lich = {}));
