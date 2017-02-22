namespace Lich {

    export class LoaderUI {

        private loader;

        private loadScreen: createjs.Shape;
        private progressLabel: createjs.Text;
        private currentItemLabel: createjs.Text;
        private loaderName = "Loading...";
        private inLoadState = true;
        private stage: createjs.Stage;
        public canvas: HTMLCanvasElement;
        public tweenedOpacity: number = 100;

        update() {
            if (this.inLoadState)
                this.stage.update();
        }

        constructor(canvasId: string) {
            let self = this;
            let canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            self.canvas = canvas;
            self.stage = new createjs.Stage(canvas);

            self.loadScreen = new createjs.Shape();
            self.loadScreen.graphics.beginFill("black");
            self.loadScreen.graphics.drawRect(0, 0, canvas.width, canvas.height);
            self.stage.addChild(self.loadScreen);

            self.progressLabel = new createjs.Text("Loading...", "30px " + Resources.FONT, Resources.TEXT_COLOR);
            self.progressLabel.x = canvas.width / 2 - 50;
            self.progressLabel.y = canvas.height / 2 - 50;
            self.stage.addChild(self.progressLabel);

            self.currentItemLabel = new createjs.Text("-", "15px " + Resources.FONT, Resources.TEXT_COLOR);
            self.currentItemLabel.x = canvas.width / 2 - 50;
            self.currentItemLabel.y = self.progressLabel.y + 40;
            self.stage.addChild(self.currentItemLabel);

            self.reset();
        }

        public reset() {
            let self = this;

            this.currentItemLabel.text = " ";
            this.progressLabel.text = this.loaderName;
            this.currentItemLabel.color = Resources.TEXT_COLOR;
            this.progressLabel.color = Resources.TEXT_COLOR;

            EventBus.getInstance().registerConsumer(EventType.LOAD_START, (e: SimpleEventPayload): boolean => {
                createjs.Tween.removeTweens(self);
                self.canvas.style.opacity = "1";
                self.tweenedOpacity = 100;
                self.canvas.style.display = "block";
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOADER_NAME_CHANGE, (n: StringEventPayload): boolean => {
                self.loaderName = n.payload;
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOADER_COLOR_CHANGE, (n: StringEventPayload): boolean => {
                this.currentItemLabel.color = n.payload;
                this.progressLabel.color = n.payload;
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOAD_PROGRESS, (n: NumberEventPayload): boolean => {
                self.progressLabel.text = Math.floor(n.payload * 100) + "% " + self.loaderName;
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOAD_ITEM, (e: StringEventPayload): boolean => {
                self.currentItemLabel.text = e.payload;
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOAD_FINISHED, (e: SimpleEventPayload): boolean => {
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
        }

    }
}