namespace Lich {

    export class LoaderUI extends createjs.Container {

        private loader;

        private loadScreen: createjs.Shape;
        private progressLabel: Label;
        private currentItemLabel: Label;
        private loaderName = "Loading...";

        constructor(private game: Game) {
            super();
            let self = this;
            self.width = game.getCanvas().width;
            self.height = game.getCanvas().height;

            self.loadScreen = new createjs.Shape();
            self.loadScreen.graphics.beginFill("black");
            self.loadScreen.graphics.drawRect(0, 0, self.width, self.height);
            self.addChild(self.loadScreen);

            self.progressLabel = new Label("Loading...", "30px " + Resources.FONT, Resources.TEXT_COLOR);
            self.progressLabel.x = self.width / 2 - 50;
            self.progressLabel.y = self.height / 2 - 50;
            self.addChild(self.progressLabel);

            self.currentItemLabel = new Label("-", "15px " + Resources.FONT, Resources.TEXT_COLOR);
            self.currentItemLabel.x = self.width / 2 - 50;
            self.currentItemLabel.y = self.progressLabel.y + 40;
            self.addChild(self.currentItemLabel);

            self.reset();
        }

        public reset() {
            let self = this;
            this.currentItemLabel.setText(" ");
            this.progressLabel.setText(this.loaderName);
            this.currentItemLabel.setColor(Resources.TEXT_COLOR);
            this.progressLabel.setColor(Resources.TEXT_COLOR);

            EventBus.getInstance().registerConsumer(EventType.LOADER_NAME_CHANGE, (n: StringEventPayload): boolean => {
                self.loaderName = n.payload;
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOADER_COLOR_CHANGE, (n: StringEventPayload): boolean => {
                this.currentItemLabel.setColor(n.payload);
                this.progressLabel.setColor(n.payload);
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOAD_PROGRESS, (n: NumberEventPayload): boolean => {
                self.progressLabel.setText(Math.floor(n.payload * 100) + "% " + self.loaderName);
                return true;
            });

            EventBus.getInstance().registerConsumer(EventType.LOAD_ITEM, (e: StringEventPayload): boolean => {
                self.currentItemLabel.setText(e.payload);
                return true;
            });
        }

    }
}