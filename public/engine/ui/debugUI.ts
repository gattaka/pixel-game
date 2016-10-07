namespace Lich {

    export class DebugLogUI extends AbstractUI {

        static PADDING = 5;

        fpsLabel: Label;
        mouseLabel: Label;
        tilesLabel: Label;
        sectorLabel: Label;
        playerLabel: Label;

        constructor(x: number, y: number) {
            super(x, y);
            let self = this;

            this.fpsLabel = new Label("-- fps", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.addNextChild(this.fpsLabel);
            EventBus.getInstance().registerConsumer(EventType.FPS_CHANGE, (data: NumberEventPayload) => {
                self.fpsLabel.setText(Math.round(data.payload) + " fps");
                return false;
            });

            this.mouseLabel = new Label("PIXELS x: - y: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.addNextChild(this.mouseLabel);
            EventBus.getInstance().registerConsumer(EventType.MOUSE_MOVE, (data: MouseMoveEventPayload) => {
                self.mouseLabel.setText("x: " + data.x + " y: " + data.y);
                return false;
            });

            this.tilesLabel = new Label("TILES x: - y: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.addNextChild(this.tilesLabel);
            this.sectorLabel = new Label("SECTOR: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.addNextChild(this.sectorLabel);
            EventBus.getInstance().registerConsumer(EventType.POINTED_AREA_CHANGE, (data: PointedAreaEventPayload) => {
                self.tilesLabel.setText("TILES x: " + data.clsnx + " y: " + data.clsny + " clsn: " + data.clsnHit + " type: " + data.tileType);
                if (data.secx) {
                    self.sectorLabel.setText("SECTOR: x: " + data.secx + " y: " + data.secy);
                } else {
                    self.sectorLabel.setText("SECTOR: -");
                }
                return false;
            });

            this.playerLabel = new Label("PLAYER x: - y: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.addNextChild(this.playerLabel);

        }
        public addNextChild(child: createjs.DisplayObject) {
            if (this.height == 0) {
                this.height = DebugLogUI.PADDING * 2;
            }

            child.x = DebugLogUI.PADDING;
            child.y = this.height - DebugLogUI.PADDING;
            this.height += child.height + DebugLogUI.PADDING;

            if (child.width + 2 * DebugLogUI.PADDING > this.width) {
                this.width = child.width + 2 * DebugLogUI.PADDING;
            }

            super.addChild(child);

            this.drawBackground();
        }
    }

}