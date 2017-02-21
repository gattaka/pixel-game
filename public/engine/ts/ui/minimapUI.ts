namespace Lich {

    export class MinimapRender {

        static MINIMAP_COOLDOWN = 30;

        public canvas: HTMLCanvasElement;
        public tilesMap: TilesMap;

        constructor(mainCanvasWidth: number, mainCanvasHeight: number, tilesMap: TilesMap) {
            let self = this;

            self.canvas = <HTMLCanvasElement>document.getElementById("mapCanvas");
            let ctx = self.canvas.getContext("2d");

            self.tilesMap = tilesMap;

            self.canvas.width = self.tilesMap.width / 2;
            self.canvas.height = self.tilesMap.height / 2;
            self.canvas.style.backgroundColor = "#eee";

            let imgData = ctx.createImageData(self.tilesMap.width / 2, self.tilesMap.height / 2); // width x height

            (function () {
                for (let y = 0; y < self.tilesMap.height; y += 2) {
                    for (let x = 0; x < self.tilesMap.width; x += 2) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            })();

            let listener = (payload: TupleEventPayload) => {
                let imgData = ctx.createImageData(1, 1);
                for (let i = 0; i < imgData.data.length; i += 4) {
                    self.processFillBySurface(payload.x, payload.y, (color: Color) => {
                        imgData.data[i + 0] = color.r;
                        imgData.data[i + 1] = color.g;
                        imgData.data[i + 2] = color.b;
                        imgData.data[i + 3] = 250;
                    });
                };
                ctx.putImageData(imgData, payload.x / 2, payload.y / 2);
                return false;
            };

            EventBus.getInstance().registerConsumer(EventType.SURFACE_CHANGE, listener);
            EventBus.getInstance().registerConsumer(EventType.SURFACE_REVEAL, (payload: TupleEventPayload) => {
                for (let y = 0; y < 4; y += 2) {
                    for (let x = 0; x < 4; x += 2) {
                        listener(new TupleEventPayload(EventType.SURFACE_REVEAL, payload.x + x, payload.y + y));
                    }
                }
                return false;
            });

        }

        private processFillBySurface(x: number, y: number, fill: (color: Color) => any) {
            // tiles to sudé Parts
            var rx = Math.floor(x / 2);
            var ry = Math.floor(y / 2);
            let fog: number = this.tilesMap.fogTree.getValue(rx, ry);
            if (fog != FogTile.I_MM) {
                fill(new Color(0, 0, 0));
            } else {
                let item: number = this.tilesMap.mapRecord.getValue(x, y);
                if (item && item != SurfacePositionKey.VOID) {
                    let key: SurfaceKey = Resources.getInstance().surfaceIndex.getType(item);
                    fill(Resources.getInstance().getSurfaceDef(key).minimapColor);
                } else {
                    let bgrItem: number = this.tilesMap.mapBgrRecord.getValue(x, y);
                    if (bgrItem && bgrItem != SurfacePositionKey.VOID) {
                        let key: SurfaceBgrKey = Resources.getInstance().surfaceBgrIndex.getType(bgrItem);
                        fill(Resources.getInstance().getSurfaceBgrDef(key).minimapColor);
                    } else {
                        fill(new Color(209, 251, 255));
                    }
                }
            }
        }

        private drawMinimapTile(imgData, x: number, y: number) {
            let self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            let fill = (color: Color) => {
                imgData.data[imgData.counter++] = color.r; // R
                imgData.data[imgData.counter++] = color.g; // G
                imgData.data[imgData.counter++] = color.b; // B
                imgData.data[imgData.counter++] = color.a != undefined ? color.a : 250; // A
            };
            self.processFillBySurface(x, y, fill);
        };

    }

    export class MinimapUI extends AbstractUI {

        static MAP_SIDE = 200;

        playerIcon: createjs.Sprite;
        bitmap: createjs.Bitmap;

        shiftX: number = 0;
        shiftY: number = 0;
        playerX: number = 0;
        playerY: number = 0;

        constructor(mainCanvasWidth: number, mainCanvasHeight: number, private mapRender: MinimapRender) {
            super(MinimapUI.MAP_SIDE, MinimapUI.MAP_SIDE);

            let self = this;

            let border = new createjs.Shape();
            border.graphics.setStrokeStyle(1);
            border.graphics.beginStroke("rgba(0,0,0,255)");
            border.graphics.beginFill("rgba(209,251,255,255)");
            border.graphics.drawRect(-1, -1, this.width + 2, this.height + 2);
            self.addChild(border);

            self.bitmap = new createjs.Bitmap(mapRender.canvas);
            self.addChild(self.bitmap);

            self.playerIcon = Resources.getInstance().getUISprite(UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.width = self.playerIcon.getBounds().width;
            self.playerIcon.height = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);

            let adjustMinimapView = () => {
                // (1px mapy = 2 tiles reálu)
                let xScale = 2 * Resources.TILE_SIZE;
                let yScale = 2 * Resources.TILE_SIZE;

                let miniXShift = self.shiftX / xScale;
                let miniYShift = self.shiftY / yScale;

                let miniXPlayer = self.playerX / xScale;
                let miniYPlayer = self.playerY / yScale;

                let miniCanvasW = mainCanvasWidth / xScale;
                let miniCanvasH = mainCanvasHeight / yScale;

                let iconX, viewX;
                // mapRender.tilesMap.width je v tiles, já tady počítám v parts (/2)
                if (miniXPlayer - miniXShift >= self.width / 2 && miniXPlayer - miniXShift <= mapRender.tilesMap.width / 2 - self.width / 2) {
                    iconX = self.width / 2;
                    viewX = miniXPlayer - miniXShift - self.width / 2;
                } else {
                    if (miniXPlayer - miniXShift > self.width / 2) {
                        iconX = self.width / 2 + miniXPlayer - miniXShift - (mapRender.tilesMap.width / 2 - self.width / 2);
                        viewX = mapRender.tilesMap.width / 2 - self.width;
                    } else {
                        iconX = miniXPlayer - miniXShift;
                        viewX = 0;
                    }
                }

                let iconY, viewY;
                // mapRender.tilesMap.height je v tiles, já tady počítám v parts (/2)
                if (miniYPlayer - miniYShift >= self.height / 2 && miniYPlayer - miniYShift <= mapRender.tilesMap.height / 2 - self.height / 2) {
                    iconY = self.height / 2;
                    viewY = miniYPlayer - miniYShift - self.height / 2;
                } else {
                    if (miniYPlayer - miniYShift > self.height / 2) {
                        iconY = self.height / 2 + miniYPlayer - miniYShift - (mapRender.tilesMap.height / 2 - self.height / 2);
                        viewY = mapRender.tilesMap.height / 2 - self.height;
                    } else {
                        iconY = miniYPlayer - miniYShift;
                        viewY = 0;
                    }
                }

                // pozice ikony
                self.playerIcon.x = iconX - self.playerIcon.width / 2;
                self.playerIcon.y = iconY - self.playerIcon.height / 2;

                // pozice minimapy
                self.bitmap.sourceRect = new createjs.Rectangle(viewX, viewY, MinimapUI.MAP_SIDE, MinimapUI.MAP_SIDE);
            };

            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_X, (payload: NumberEventPayload) => {
                self.shiftX = payload.payload;
                adjustMinimapView();
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_Y, (payload: NumberEventPayload) => {
                self.shiftY = payload.payload;
                adjustMinimapView();
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.PLAYER_POSITION_CHANGE, (payload: TupleEventPayload) => {
                self.playerX = payload.x;
                self.playerY = payload.y;
                adjustMinimapView();
                return false;
            });
        }

    }

    export class MapUI extends AbstractUI {

        playerIcon: createjs.Sprite;
        bitmap: createjs.Bitmap;

        shiftX: number = 0;
        shiftY: number = 0;
        playerX: number = 0;
        playerY: number = 0;

        constructor(mainCanvasWidth: number, mainCanvasHeight: number, private mapRender: MinimapRender) {
            super(mainCanvasWidth - UI.SCREEN_SPACING * 2, mainCanvasHeight - UI.SCREEN_SPACING * 2);
            let self = this;

            self.on("click", function (evt) {
                Mixer.playSound(SoundKey.SND_CLICK_KEY);
                self.hide();
            }, null, false);

            let border = new createjs.Shape();
            border.graphics.setStrokeStyle(1);
            border.graphics.beginStroke("rgba(0,0,0,255)");
            border.graphics.beginFill("rgba(209,251,255,255)");
            border.graphics.drawRect(-1, -1, this.width + 2, this.height + 2);
            self.addChild(border);

            self.bitmap = new createjs.Bitmap(mapRender.canvas);
            self.addChild(self.bitmap);

            self.playerIcon = Resources.getInstance().getUISprite(UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.width = self.playerIcon.getBounds().width;
            self.playerIcon.height = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);

            self.bitmap.scaleX = (mainCanvasWidth - UI.SCREEN_SPACING * 2) / mapRender.canvas.width;
            self.bitmap.scaleY = (mainCanvasHeight - UI.SCREEN_SPACING * 2) / mapRender.canvas.height;

            let adjustPlayerIcon = () => {
                // musí se sečíst screen poloha hráče s map-offset a vydělit poměrem 1px mapy na reál (1px mapy = 2 tiles reálu)
                // to celé se pak musí ještě vynásobit škálou, kterou je mapa zmenšena/zvětšna pro celoobrazovkové zobrazení
                self.playerIcon.x = ((self.playerX - self.shiftX) / (2 * Resources.TILE_SIZE)) * self.bitmap.scaleX;
                self.playerIcon.y = ((self.playerY - self.shiftY) / (2 * Resources.TILE_SIZE)) * self.bitmap.scaleY;
                // a pak se ještě vycentruje ikona
                self.playerIcon.x -= self.playerIcon.width / 2;
                self.playerIcon.y -= self.playerIcon.height / 2
            };

            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_X, (payload: NumberEventPayload) => {
                self.shiftX = payload.payload;
                adjustPlayerIcon();
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_Y, (payload: NumberEventPayload) => {
                self.shiftY = payload.payload;
                adjustPlayerIcon();
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.PLAYER_POSITION_CHANGE, (payload: TupleEventPayload) => {
                self.playerX = payload.x;
                self.playerY = payload.y;
                adjustPlayerIcon();
                return false;
            });

        }

    }

}