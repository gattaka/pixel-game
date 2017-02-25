var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var MinimapRender = (function () {
        function MinimapRender(mainCanvasWidth, mainCanvasHeight, tilesMap) {
            var self = this;
            self.canvas = document.getElementById("mapCanvas");
            var ctx = self.canvas.getContext("2d");
            self.tilesMap = tilesMap;
            self.canvas.width = self.tilesMap.width / 2;
            self.canvas.height = self.tilesMap.height / 2;
            self.canvas.style.backgroundColor = "#eee";
            var imgData = ctx.createImageData(self.tilesMap.width / 2, self.tilesMap.height / 2); // width x height
            (function () {
                for (var y = 0; y < self.tilesMap.height; y += 2) {
                    for (var x = 0; x < self.tilesMap.width; x += 2) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            })();
            var listener = function (payload) {
                var imgData = ctx.createImageData(1, 1);
                var _loop_1 = function (i) {
                    self.processFillBySurface(payload.x, payload.y, function (color) {
                        imgData.data[i + 0] = color.r;
                        imgData.data[i + 1] = color.g;
                        imgData.data[i + 2] = color.b;
                        imgData.data[i + 3] = 250;
                    });
                };
                for (var i = 0; i < imgData.data.length; i += 4) {
                    _loop_1(i);
                }
                ;
                ctx.putImageData(imgData, payload.x / 2, payload.y / 2);
                return false;
            };
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SURFACE_CHANGE, listener);
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SURFACE_REVEAL, function (payload) {
                for (var y = 0; y < 4; y += 2) {
                    for (var x = 0; x < 4; x += 2) {
                        listener(new Lich.TupleEventPayload(Lich.EventType.SURFACE_REVEAL, payload.x + x, payload.y + y));
                    }
                }
                return false;
            });
        }
        MinimapRender.prototype.processFillBySurface = function (x, y, fill) {
            // tiles to sudé Parts
            var rx = Math.floor(x / 2);
            var ry = Math.floor(y / 2);
            var fog = this.tilesMap.fogTree.getValue(rx, ry);
            if (fog != Lich.FogTile.I_MM) {
                fill(new Lich.Color(0, 0, 0));
            }
            else {
                var item = this.tilesMap.mapRecord.getValue(x, y);
                if (item && item != Lich.SurfacePositionKey.VOID) {
                    var key = Lich.Resources.getInstance().surfaceIndex.getType(item);
                    fill(Lich.Resources.getInstance().getSurfaceDef(key).minimapColor);
                }
                else {
                    var bgrItem = this.tilesMap.mapBgrRecord.getValue(x, y);
                    if (bgrItem && bgrItem != Lich.SurfacePositionKey.VOID) {
                        var key = Lich.Resources.getInstance().surfaceBgrIndex.getType(bgrItem);
                        fill(Lich.Resources.getInstance().getSurfaceBgrDef(key).minimapColor);
                    }
                    else {
                        fill(new Lich.Color(209, 251, 255));
                    }
                }
            }
        };
        MinimapRender.prototype.drawMinimapTile = function (imgData, x, y) {
            var self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            var fill = function (color) {
                imgData.data[imgData.counter++] = color.r; // R
                imgData.data[imgData.counter++] = color.g; // G
                imgData.data[imgData.counter++] = color.b; // B
                imgData.data[imgData.counter++] = color.a != undefined ? color.a : 250; // A
            };
            self.processFillBySurface(x, y, fill);
        };
        ;
        return MinimapRender;
    }());
    MinimapRender.MINIMAP_COOLDOWN = 30;
    Lich.MinimapRender = MinimapRender;
    var MinimapUI = (function (_super) {
        __extends(MinimapUI, _super);
        function MinimapUI(mainCanvasWidth, mainCanvasHeight, mapRender) {
            var _this = _super.call(this, MinimapUI.MAP_SIDE, MinimapUI.MAP_SIDE) || this;
            _this.mapRender = mapRender;
            _this.shiftX = 0;
            _this.shiftY = 0;
            _this.playerX = 0;
            _this.playerY = 0;
            var self = _this;
            // let border = new createjs.Shape();
            // border.graphics.setStrokeStyle(1);
            // border.graphics.beginStroke("rgba(0,0,0,255)");
            // border.graphics.beginFill("rgba(209,251,255,255)");
            // border.graphics.drawRect(-1, -1, this.width + 2, this.height + 2);
            // self.addChild(border);
            self.bitmap = new PIXI.Sprite(PIXI.Texture.fromCanvas(mapRender.canvas));
            self.addChild(self.bitmap);
            self.playerIcon = Lich.Resources.getInstance().getUISprite(Lich.UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.width = self.playerIcon.getBounds().width;
            self.playerIcon.height = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);
            var adjustMinimapView = function () {
                // (1px mapy = 2 tiles reálu)
                var xScale = 2 * Lich.Resources.TILE_SIZE;
                var yScale = 2 * Lich.Resources.TILE_SIZE;
                var miniXShift = self.shiftX / xScale;
                var miniYShift = self.shiftY / yScale;
                var miniXPlayer = self.playerX / xScale;
                var miniYPlayer = self.playerY / yScale;
                var miniCanvasW = mainCanvasWidth / xScale;
                var miniCanvasH = mainCanvasHeight / yScale;
                var iconX, viewX;
                // mapRender.tilesMap.width je v tiles, já tady počítám v parts (/2)
                if (miniXPlayer - miniXShift >= self.width / 2 && miniXPlayer - miniXShift <= mapRender.tilesMap.width / 2 - self.width / 2) {
                    iconX = self.width / 2;
                    viewX = miniXPlayer - miniXShift - self.width / 2;
                }
                else {
                    if (miniXPlayer - miniXShift > self.width / 2) {
                        iconX = self.width / 2 + miniXPlayer - miniXShift - (mapRender.tilesMap.width / 2 - self.width / 2);
                        viewX = mapRender.tilesMap.width / 2 - self.width;
                    }
                    else {
                        iconX = miniXPlayer - miniXShift;
                        viewX = 0;
                    }
                }
                var iconY, viewY;
                // mapRender.tilesMap.height je v tiles, já tady počítám v parts (/2)
                if (miniYPlayer - miniYShift >= self.height / 2 && miniYPlayer - miniYShift <= mapRender.tilesMap.height / 2 - self.height / 2) {
                    iconY = self.height / 2;
                    viewY = miniYPlayer - miniYShift - self.height / 2;
                }
                else {
                    if (miniYPlayer - miniYShift > self.height / 2) {
                        iconY = self.height / 2 + miniYPlayer - miniYShift - (mapRender.tilesMap.height / 2 - self.height / 2);
                        viewY = mapRender.tilesMap.height / 2 - self.height;
                    }
                    else {
                        iconY = miniYPlayer - miniYShift;
                        viewY = 0;
                    }
                }
                // pozice ikony
                self.playerIcon.x = iconX - self.playerIcon.width / 2;
                self.playerIcon.y = iconY - self.playerIcon.height / 2;
                // pozice minimapy
                self.bitmap.texture.frame = new PIXI.Rectangle(viewX, viewY, MinimapUI.MAP_SIDE, MinimapUI.MAP_SIDE);
            };
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_X, function (payload) {
                self.shiftX = payload.payload;
                adjustMinimapView();
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_Y, function (payload) {
                self.shiftY = payload.payload;
                adjustMinimapView();
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.PLAYER_POSITION_CHANGE, function (payload) {
                self.playerX = payload.x;
                self.playerY = payload.y;
                adjustMinimapView();
                return false;
            });
            return _this;
        }
        return MinimapUI;
    }(Lich.AbstractUI));
    MinimapUI.MAP_SIDE = 200;
    Lich.MinimapUI = MinimapUI;
    var MapUI = (function (_super) {
        __extends(MapUI, _super);
        function MapUI(mainCanvasWidth, mainCanvasHeight, mapRender) {
            var _this = _super.call(this, mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2, mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2) || this;
            _this.mapRender = mapRender;
            _this.shiftX = 0;
            _this.shiftY = 0;
            _this.playerX = 0;
            _this.playerY = 0;
            var self = _this;
            self.on("click", function () {
                Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                self.hide();
            });
            // let border = new createjs.Shape();
            // border.graphics.setStrokeStyle(1);
            // border.graphics.beginStroke("rgba(0,0,0,255)");
            // border.graphics.beginFill("rgba(209,251,255,255)");
            // border.graphics.drawRect(-1, -1, this.width + 2, this.height + 2);
            // self.addChild(border);
            self.bitmap = new PIXI.Sprite(PIXI.Texture.fromCanvas(mapRender.canvas));
            self.addChild(self.bitmap);
            self.playerIcon = Lich.Resources.getInstance().getUISprite(Lich.UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.width = self.playerIcon.getBounds().width;
            self.playerIcon.height = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);
            self.bitmap.scale.x = (mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2) / mapRender.canvas.width;
            self.bitmap.scale.y = (mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2) / mapRender.canvas.height;
            var adjustPlayerIcon = function () {
                // musí se sečíst screen poloha hráče s map-offset a vydělit poměrem 1px mapy na reál (1px mapy = 2 tiles reálu)
                // to celé se pak musí ještě vynásobit škálou, kterou je mapa zmenšena/zvětšna pro celoobrazovkové zobrazení
                self.playerIcon.x = ((self.playerX - self.shiftX) / (2 * Lich.Resources.TILE_SIZE)) * self.bitmap.scale.x;
                self.playerIcon.y = ((self.playerY - self.shiftY) / (2 * Lich.Resources.TILE_SIZE)) * self.bitmap.scale.y;
                // a pak se ještě vycentruje ikona
                self.playerIcon.x -= self.playerIcon.width / 2;
                self.playerIcon.y -= self.playerIcon.height / 2;
            };
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_X, function (payload) {
                self.shiftX = payload.payload;
                adjustPlayerIcon();
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_Y, function (payload) {
                self.shiftY = payload.payload;
                adjustPlayerIcon();
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.PLAYER_POSITION_CHANGE, function (payload) {
                self.playerX = payload.x;
                self.playerY = payload.y;
                adjustPlayerIcon();
                return false;
            });
            return _this;
        }
        return MapUI;
    }(Lich.AbstractUI));
    Lich.MapUI = MapUI;
})(Lich || (Lich = {}));
