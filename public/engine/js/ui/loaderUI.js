var Lich;
(function (Lich) {
    var LoaderUI = (function () {
        function LoaderUI(canvasId) {
            this.loaderName = "Loading...";
            this.inLoadState = true;
            this.tweenedOpacity = 100;
            var self = this;
            var canvas = document.getElementById(canvasId);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            self.canvas = canvas;
            self.stage = new createjs.Stage(canvas);
            self.loadScreen = new createjs.Shape();
            self.loadScreen.graphics.beginFill("black");
            self.loadScreen.graphics.drawRect(0, 0, canvas.width, canvas.height);
            self.stage.addChild(self.loadScreen);
            self.progressLabel = new createjs.Text("Loading...", "30px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR);
            self.progressLabel.x = canvas.width / 2 - 50;
            self.progressLabel.y = canvas.height / 2 - 50;
            self.stage.addChild(self.progressLabel);
            self.currentItemLabel = new createjs.Text("-", "15px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR);
            self.currentItemLabel.x = canvas.width / 2 - 50;
            self.currentItemLabel.y = self.progressLabel.y + 40;
            self.stage.addChild(self.currentItemLabel);
            self.reset();
        }
        LoaderUI.prototype.update = function () {
            // TODO sledovat, zda se něco nahrává a dočasně vypnout
            if (this.inLoadState)
                this.stage.update();
        };
        LoaderUI.prototype.reset = function () {
            var _this = this;
            var self = this;
            this.currentItemLabel.text = " ";
            this.progressLabel.text = this.loaderName;
            this.currentItemLabel.color = Lich.Resources.TEXT_COLOR;
            this.progressLabel.color = Lich.Resources.TEXT_COLOR;
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_START, function (e) {
                createjs.Tween.removeTweens(self);
                self.canvas.style.opacity = "1";
                self.tweenedOpacity = 100;
                self.canvas.style.display = "block";
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOADER_NAME_CHANGE, function (n) {
                self.loaderName = n.payload;
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOADER_COLOR_CHANGE, function (n) {
                _this.currentItemLabel.color = n.payload;
                _this.progressLabel.color = n.payload;
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_PROGRESS, function (n) {
                self.progressLabel.text = Math.floor(n.payload * 100) + "% " + self.loaderName;
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_ITEM, function (e) {
                self.currentItemLabel.text = e.payload;
                return true;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_FINISHED, function (e) {
                createjs.Tween.get(self)
                    .to({
                    tweenedOpacity: 0
                }, 1500).addEventListener("change", function () {
                    self.canvas.style.opacity = "" + (self.tweenedOpacity / 100);
                }).call(function () {
                    self.canvas.style.display = "none";
                });
                return true;
            });
        };
        return LoaderUI;
    }());
    Lich.LoaderUI = LoaderUI;
})(Lich || (Lich = {}));
