namespace Lich {

    export class MinimapUI extends AbstractUI {

        static MAP_SIDE = 200;
        static MINIMAP_COOLDOWN = 30;

        playerIcon: createjs.Bitmap;
        canvas: HTMLCanvasElement;
        bitmap: createjs.Bitmap;

        shiftX: number = 0;
        shiftY: number = 0;
        playerX: number = 0;
        playerY: number = 0;

        private tilesMap: TilesMap;

        constructor(mainCanvasWidth: number, mainCanvasHeight: number, tilesMap: TilesMap) {
            super(mainCanvasWidth - UI.SCREEN_SPACING * 2, mainCanvasHeight - UI.SCREEN_SPACING * 2);
            let self = this;

            let border = new createjs.Shape();
            border.graphics.setStrokeStyle(1);
            border.graphics.beginStroke("rgba(0,0,0,255)");
            border.graphics.beginFill("rgba(209,251,255,255)");
            border.graphics.drawRect(-1, -1, this.width + 2, this.height + 2);
            this.addChild(border);

            self.canvas = <HTMLCanvasElement>document.getElementById("mapCanvas");
            let ctx = self.canvas.getContext("2d");

            self.bitmap = new createjs.Bitmap(self.canvas);
            self.addChild(self.bitmap);

            self.playerIcon = Resources.getInstance().getBitmap(UIGFXKey[UIGFXKey.PLAYER_ICON_KEY]);
            self.playerIcon.width = self.playerIcon.getBounds().width;
            self.playerIcon.height = self.playerIcon.getBounds().height;
            this.addChild(self.playerIcon);

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

            self.bitmap.scaleX = (mainCanvasWidth - UI.SCREEN_SPACING * 2) / self.canvas.width;
            self.bitmap.scaleY = (mainCanvasHeight - UI.SCREEN_SPACING * 2) / self.canvas.height;
            // self.bitmap.sourceRect = new createjs.Rectangle(0, 0, MinimapUI.MAP_SIDE, MinimapUI.MAP_SIDE);

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

            EventBus.getInstance().registerConsumer(EventType.SURFACE_CHANGE, (payload: TupleEventPayload) => {
                let imgData = ctx.createImageData(1, 1);
                for (let i = 0; i < imgData.data.length; i += 4) {
                    self.processFillBySurface(payload.x, payload.y, (r: number, g: number, b: number) => {
                        imgData.data[i + 0] = r;
                        imgData.data[i + 1] = g;
                        imgData.data[i + 2] = b;
                        imgData.data[i + 3] = 250;
                    });
                };
                ctx.putImageData(imgData, payload.x / 2, payload.y / 2);
                return false;
            });
        }

        private processFillBySurface(x: number, y: number, fill: (r: number, g: number, b: number) => any) {
            let item: number = this.tilesMap.mapRecord.getValue(x, y);
            if (item != SurfacePositionKey.VOID) {
                let key: SurfaceKey = Resources.getInstance().surfaceIndex.getType(item);
                switch (key) {
                    case SurfaceKey.SRFC_DIRT_KEY: fill(156, 108, 36); break;
                    case SurfaceKey.SRFC_BRICK_KEY: fill(79, 39, 0); break;
                    case SurfaceKey.SRFC_COAL_KEY: fill(37, 27, 27); break;
                    case SurfaceKey.SRFC_WOODWALL_KEY: fill(181, 129, 28); break;
                    case SurfaceKey.SRFC_ROOF_KEY: fill(156, 60, 28); break;
                    case SurfaceKey.SRFC_ROCK_KEY: fill(82, 82, 82); break;
                    case SurfaceKey.SRFC_STRAW_KEY: fill(219, 187, 39); break;
                    case SurfaceKey.SRFC_KRYSTAL_KEY: fill(0, 201, 201); break;
                    case SurfaceKey.SRFC_FLORITE_KEY: fill(159, 68, 181); break;
                    case SurfaceKey.SRFC_IRON_KEY: fill(177, 88, 33); break;
                    default: fill(209, 251, 255);
                }
            } else {
                fill(209, 251, 255);
            }
        }

        private drawMinimapTile(imgData, x: number, y: number) {
            let self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            let fill = (r: number, g: number, b: number) => {
                imgData.data[imgData.counter++] = r; // R
                imgData.data[imgData.counter++] = g; // G
                imgData.data[imgData.counter++] = b; // B
                imgData.data[imgData.counter++] = 250; // A
            };
            self.processFillBySurface(x, y, fill);
        };

        updateMinimap(mapUpdateRegion) {
            let self = this;
            if (mapUpdateRegion.prepared === false) {
                return;
            }
            if (mapUpdateRegion.cooldown < MinimapUI.MINIMAP_COOLDOWN) {
                mapUpdateRegion.cooldown++;
                return;
            }

            mapUpdateRegion.cooldown = 0;

            let x0 = mapUpdateRegion.fromX;
            let y0 = mapUpdateRegion.fromY;
            let w = mapUpdateRegion.toX - mapUpdateRegion.fromX + 1;
            let h = mapUpdateRegion.toY - mapUpdateRegion.fromY + 1;

            let ctx = self.canvas.getContext("2d");
            let imgData = ctx.createImageData(w, h); // width x height

            (function () {
                for (let y = y0; y <= mapUpdateRegion.toY; y++) {
                    for (let x = x0; x <= mapUpdateRegion.toX; x++) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, x0, y0);
            })();

            //minimap.cont.removeChild(minimap.bitmap);
            let dataURL = self.canvas.toDataURL();
            self.bitmap.image = new createjs.Bitmap(dataURL).image;
            //minimap.cont.addChild(minimap.bitmap);

            mapUpdateRegion.reset();
        }

    }

}