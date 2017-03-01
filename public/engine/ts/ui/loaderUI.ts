namespace Lich {

    export class LoaderUI extends PIXI.Container {

        private loader;

        private loadScreen: PIXI.Graphics;
        private progressLabel: Label;
        private currentItemLabel: Label;
        private loaderName = "Loading...";

        constructor(private game: Game) {
            super();
            let self = this;
            self.fixedWidth = game.getSceneWidth();
            self.fixedHeight = game.getSceneHeight();

            self.loadScreen = new PIXI.Graphics();
            self.loadScreen.beginFill(0x000000);
            self.loadScreen.drawRect(0, 0, self.fixedWidth, self.fixedHeight);
            self.addChild(self.loadScreen);

            self.progressLabel = new Label("Loading...", Resources.FONT, 30, Resources.TEXT_COLOR);
            self.progressLabel.x = self.fixedWidth / 2 - 50;
            self.progressLabel.y = self.fixedHeight / 2 - 50;
            self.addChild(self.progressLabel);

            self.currentItemLabel = new Label("-", Resources.FONT, 15, Resources.TEXT_COLOR);
            self.currentItemLabel.x = self.fixedWidth / 2 - 50;
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