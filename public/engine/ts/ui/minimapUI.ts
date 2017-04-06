namespace Lich {

    abstract class AbstractMapUIRenderer {

        public canvas: HTMLCanvasElement;
        protected ctx;

        constructor(public tilesMap: TilesMap, canvasDOMId: string, public width: number, public height: number) {
            this.canvas = <HTMLCanvasElement>document.getElementById(canvasDOMId);
            this.canvas.width = width;
            this.canvas.height = height;
            this.ctx = this.canvas.getContext("2d");
        }

        /**
         * Připraví kresbu pixelu mapy dle x,y souřadnic mapy
         * 
         * @param x souřadnice v mapě světa (TILEs)
         * @param y souřadnice v mapě světa (TILEs)
         * @param fill callback, který je volán s barvou, která byla zjištěna pro dané souřadnice
         */
        protected processFillBySurface(x: number, y: number, fill: (color: Color) => any) {
            // tiles to sudé Parts
            var rx = Math.floor(x / 2);
            var ry = Math.floor(y / 2);
            let revealed: boolean = this.tilesMap.fogRecord.getValue(rx, ry);
            if (!revealed) {
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

    }

    export class MinimapUIRender {

        static MAP_SIDE = 200;

        width = MinimapUIRender.MAP_SIDE;
        height = MinimapUIRender.MAP_SIDE;
        shiftX: number = 0;
        shiftY: number = 0;
        playerX: number = 0;
        playerY: number = 0;

        public mapOffsetX: number;
        public mapOffsetY: number;
        public iconX: number;
        public iconY: number;

        constructor(private tilesMap: TilesMap) {
            let self = this;

            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_X, (payload: NumberEventPayload) => {
                self.shiftX = payload.payload;
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_Y, (payload: NumberEventPayload) => {
                self.shiftY = payload.payload;
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.PLAYER_POSITION_CHANGE, (payload: TupleEventPayload) => {
                self.playerX = payload.x;
                self.playerY = payload.y;
                return false;
            });

        }

        public update() {
            let self = this;

            // (1px mapy = 2 tiles reálu)
            let xScale = 2 * Resources.TILE_SIZE;
            let yScale = 2 * Resources.TILE_SIZE;

            let miniXShift = self.shiftX / xScale;
            let miniYShift = self.shiftY / yScale;

            let miniXPlayer = self.playerX / xScale;
            let miniYPlayer = self.playerY / yScale;

            let viewX;
            // mapRender.tilesMap.width je v tiles, já tady počítám v parts (/2)
            if (miniXPlayer - miniXShift >= self.width / 2 && miniXPlayer - miniXShift <= self.tilesMap.width / 2 - self.width / 2) {
                self.iconX = self.width / 2;
                viewX = miniXPlayer - miniXShift - self.width / 2;
            } else {
                if (miniXPlayer - miniXShift > self.width) {
                    self.iconX = self.width / 2 + miniXPlayer - miniXShift - (self.tilesMap.width / 2 - self.width / 2);
                    viewX = self.tilesMap.width / 2 - self.width;
                } else {
                    self.iconX = miniXPlayer - miniXShift;
                    viewX = 0;
                }
            }

            let viewY;
            // mapRender.tilesMap.height je v tiles, já tady počítám v parts (/2)
            if (miniYPlayer - miniYShift >= self.height / 2 && miniYPlayer - miniYShift <= self.tilesMap.height / 2 - self.height / 2) {
                self.iconY = self.height / 2;
                viewY = miniYPlayer - miniYShift - self.height / 2;
            } else {
                if (miniYPlayer - miniYShift > self.height) {
                    self.iconY = self.height / 2 + miniYPlayer - miniYShift - (self.tilesMap.height / 2 - self.height / 2);
                    viewY = self.tilesMap.height / 2 - self.height;
                } else {
                    self.iconY = miniYPlayer - miniYShift;
                    viewY = 0;
                }
            }

            self.mapOffsetX = viewX;
            self.mapOffsetY = viewY;
        };
    }

    export class MinimapUI extends AbstractUI {

        playerIcon: PIXI.Sprite;
        bitmap: PIXI.Sprite;

        constructor(private minimapRender: MinimapUIRender, private mapRender: MapUIRender) {
            super(MinimapUIRender.MAP_SIDE, MinimapUIRender.MAP_SIDE);

            let self = this;

            let border = new PIXI.Graphics();
            border.lineStyle(1, 0x000000, 1);
            border.beginFill(0xd1fbff, 1);
            border.drawRect(0, 0, this.fixedWidth, this.fixedHeight);
            self.addChild(border);

            self.bitmap = new PIXI.Sprite(new PIXI.Texture(mapRender.baseTexture, this.createFrame()));
            self.addChild(self.bitmap);

            self.playerIcon = Resources.getInstance().getUISprite(UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.fixedWidth = self.playerIcon.getBounds().width;
            self.playerIcon.fixedHeight = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);

            EventBus.getInstance().registerConsumer(EventType.MAP_UPDATE, (payload: SimpleEventPayload) => {
                this.bitmap.texture.destroy();
                this.bitmap.texture = new PIXI.Texture(this.mapRender.baseTexture, this.createFrame());
                return false;
            });
        }

        createFrame() {
            return new PIXI.Rectangle(
                this.minimapRender.mapOffsetX, this.minimapRender.mapOffsetY,
                this.minimapRender.width, this.minimapRender.height
            );
        }

        update(delta: number) {
            this.minimapRender.update();
            this.bitmap.texture.frame = this.createFrame();

            this.playerIcon.x = this.minimapRender.iconX - this.playerIcon.fixedWidth / 2;
            this.playerIcon.y = this.minimapRender.iconY - this.playerIcon.fixedHeight / 2;
        }

    }

    export class MapUIRender extends AbstractMapUIRenderer {

        public baseTexture: PIXI.BaseTexture;
        private scheduleDraw = false;
        private fromX = -1;
        private fromY = -1;
        private toX = -1;
        private toY = -1;

        constructor(tilesMap: TilesMap) {
            super(tilesMap, "mapCanvas", tilesMap.width / 2, tilesMap.height / 2);
            let self = this;

            self.baseTexture = PIXI.BaseTexture.fromCanvas(self.canvas);

            // init
            let imgData = this.ctx.createImageData(this.width, this.height); // width x height
            (function () {
                for (let y = 0; y < self.tilesMap.height; y += 2) {
                    for (let x = 0; x < self.tilesMap.width; x += 2) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                self.ctx.putImageData(imgData, 0, 0);
            })();

            let listener = (payload: TupleEventPayload) => {
                if (self.fromX < 0 || payload.x < self.fromX) self.fromX = payload.x;
                if (self.fromY < 0 || payload.y < self.fromY) self.fromY = payload.y;
                if (payload.x > self.toX) self.toX = payload.x;
                if (payload.y > self.toY) self.toY = payload.y;
                self.scheduleDraw = true;
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

        public update() {
            let self = this;
            if (self.scheduleDraw) {
                let w = Math.floor((self.toX - self.fromX + 1) / 2);
                let h = Math.floor((self.toY - self.fromY + 1) / 2);
                let fromPartX = Math.floor(self.fromX / 2);
                let fromPartY = Math.floor(self.fromY / 2);
                let imgData = self.ctx.createImageData(w, h);
                let index = 0;
                for (let i = 0; i < imgData.data.length; i += 4) {
                    let x = fromPartX + index % w;
                    let y = fromPartY + Math.floor(index / w);
                    index++;
                    self.processFillBySurface(x * 2, y * 2, (color: Color) => {
                        imgData.data[i + 0] = color.r;
                        imgData.data[i + 1] = color.g;
                        imgData.data[i + 2] = color.b;
                        imgData.data[i + 3] = 250;
                    });
                }
                self.ctx.putImageData(imgData, fromPartX, fromPartY);
                self.scheduleDraw = false;
                self.fromX = -1;
                self.fromY = -1;
                self.toX = -1;
                self.toY = -1;
                self.baseTexture.update();
                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.MAP_UPDATE));
            }
        }

    }

    export class MapUI extends AbstractUI {

        private static MAP_UPDATE_DELAY = 500;

        playerIcon: PIXI.Sprite;
        bitmap: PIXI.Sprite;

        shiftX: number = 0;
        shiftY: number = 0;
        playerX: number = 0;
        playerY: number = 0;

        private prepareUpdateTextureCounter = MapUI.MAP_UPDATE_DELAY;

        constructor(mainCanvasWidth: number, mainCanvasHeight: number, private mapRender: MapUIRender) {
            super(mainCanvasWidth - UI.SCREEN_SPACING * 2, mainCanvasHeight - UI.SCREEN_SPACING * 2);
            let self = this;

            self.on("pointerdown", function () {
                Mixer.playSound(SoundKey.SND_CLICK_KEY);
                self.hide();
            });

            let border = new PIXI.Graphics();
            border.lineStyle(1, 0x000000, 1);
            border.beginFill(0xd1fbff, 1);
            border.drawRect(0, 0, this.fixedWidth, this.fixedHeight);
            self.addChild(border);

            self.bitmap = new PIXI.Sprite(new PIXI.Texture(mapRender.baseTexture));
            self.addChild(self.bitmap);

            self.playerIcon = Resources.getInstance().getUISprite(UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.fixedWidth = self.playerIcon.getBounds().width;
            self.playerIcon.fixedHeight = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);

            self.bitmap.scale.x = (mainCanvasWidth - UI.SCREEN_SPACING * 2) / mapRender.width;
            self.bitmap.scale.y = (mainCanvasHeight - UI.SCREEN_SPACING * 2) / mapRender.height;

            let adjustPlayerIcon = () => {
                // musí se sečíst screen poloha hráče s map-offset a vydělit poměrem 1px mapy na reál (1px mapy = 2 tiles reálu)
                // to celé se pak musí ještě vynásobit škálou, kterou je mapa zmenšena/zvětšna pro celoobrazovkové zobrazení
                self.playerIcon.x = ((self.playerX - self.shiftX) / (2 * Resources.TILE_SIZE)) * self.bitmap.scale.x;
                self.playerIcon.y = ((self.playerY - self.shiftY) / (2 * Resources.TILE_SIZE)) * self.bitmap.scale.y;
                // a pak se ještě vycentruje ikona
                self.playerIcon.x -= self.playerIcon.fixedWidth / 2;
                self.playerIcon.y -= self.playerIcon.fixedHeight / 2
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

        update(delta: number) {
            this.prepareUpdateTextureCounter -= delta;
            if (this.prepareUpdateTextureCounter <= 0) {
                this.prepareUpdateTextureCounter = MapUI.MAP_UPDATE_DELAY;
                this.mapRender.update();
            }
        }

    }

}