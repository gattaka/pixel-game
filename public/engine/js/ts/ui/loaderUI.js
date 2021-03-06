var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var LoaderUI = (function (_super) {
        __extends(LoaderUI, _super);
        function LoaderUI(game) {
            _super.call(this);
            var self = this;
            self.width = game.getCanvas().width;
            self.height = game.getCanvas().height;
            self.loadScreen = new createjs.Shape();
            self.loadScreen.graphics.beginFill("black");
            self.loadScreen.graphics.drawRect(0, 0, self.width, self.height);
            self.addChild(self.loadScreen);
            self.progressLabel = new Lich.Label("Loading...", "30px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR);
            self.progressLabel.x = self.width / 2 - 50;
            self.progressLabel.y = self.height / 2 - 50;
            self.addChild(self.progressLabel);
            self.currentItemLabel = new Lich.Label("-", "15px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR);
            self.currentItemLabel.x = self.width / 2 - 50;
            self.currentItemLabel.y = self.progressLabel.y + 40;
            self.addChild(self.currentItemLabel);
            self.reset();
        }
        LoaderUI.prototype.reset = function () {
            var self = this;
            this.currentItemLabel.setText(" ");
            this.progressLabel.setText("Loading...");
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_PROGRESS, function (n) {
                self.progressLabel.setText(Math.floor(n.payload * 100) + "% Loading... ");
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_ITEM, function (e) {
                self.currentItemLabel.setText(e.payload);
                return true;
            });
        };
        return LoaderUI;
    }(createjs.Container));
    Lich.LoaderUI = LoaderUI;
})(Lich || (Lich = {}));
