namespace Lich {

    export class DebugLogUI extends AbstractUI {

        static PADDING = 5;

        mouseLabel: Label;
        tilesLabel: Label;
        sectorLabel: Label;
        playerLabel: Label;
        enemiesLabel: Label;

        constructor(width: number, height: number) {
            super(width, height);
            let self = this;

            this.mouseLabel = new Label("PIXELS x: - y: -");
            this.addNextChild(this.mouseLabel);
            EventBus.getInstance().registerConsumer(EventType.MOUSE_MOVE, (data: TupleEventPayload) => {
                self.mouseLabel.setText("PIXELS x: " + data.x + " y: " + data.y);
                return false;
            });

            this.tilesLabel = new Label("TILES x: - y: -");
            this.addNextChild(this.tilesLabel);
            this.sectorLabel = new Label("SECTOR: -");
            this.addNextChild(this.sectorLabel);
            EventBus.getInstance().registerConsumer(EventType.POINTED_AREA_CHANGE, (data: PointedAreaEventPayload) => {
                self.tilesLabel.setText("TILES x: " + data.clsnx + " y: " + data.clsny
                    // + " pOfx: " + (data.partsOffsetX == undefined ? "-" : data.partsOffsetX)
                    // + " pOfy: " + (data.partsOffsetY == undefined ? "-" : data.partsOffsetY)
                    + " clsn: " + data.clsnHit
                    + " type: " + (data.tileType == undefined ? "-" : data.tileType) + " : " + (data.tileVariant == undefined ? "-" : data.tileVariant)
                );
                if (data.secx) {
                    self.sectorLabel.setText("SECTOR: x: " + data.secx + " y: " + data.secy);
                } else {
                    self.sectorLabel.setText("SECTOR: -");
                }
                return false;
            });

            this.playerLabel = new Label("SPEED x: - y: -");
            EventBus.getInstance().registerConsumer(EventType.PLAYER_SPEED_CHANGE, (data: TupleEventPayload) => {
                self.playerLabel.setText("SPEED x: " + Math.floor(data.x) + " y: " + Math.floor(data.y));
                return false;
            });
            this.addNextChild(this.playerLabel);

            this.enemiesLabel = new Label("ENEMIES LEFT: -");
            EventBus.getInstance().registerConsumer(EventType.ENEMY_COUNT_CHANGE, (data: NumberEventPayload) => {
                self.enemiesLabel.setText("ENEMIES LEFT: " + data.payload);
                return false;
            });
            this.addNextChild(this.enemiesLabel);

        }
        public addNextChild(child: Label) {
            if (this.fixedHeight == 0) {
                this.fixedHeight = DebugLogUI.PADDING * 2;
            }

            child.x = DebugLogUI.PADDING;
            child.y = this.fixedHeight - DebugLogUI.PADDING;
            this.fixedHeight += child.fixedHeight + DebugLogUI.PADDING;

            if (child.fixedWidth + 2 * DebugLogUI.PADDING > this.fixedWidth) {
                this.fixedWidth = child.fixedWidth + 2 * DebugLogUI.PADDING;
            }

            super.addChild(child);

            this.drawBackground();
        }
    }

}