var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var MinimapUI = (function (_super) {
        __extends(MinimapUI, _super);
        function MinimapUI(mainCanvasWidth, mainCanvasHeight, tilesMap) {
            _super.call(this, mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2, mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2);
            this.shiftX = 0;
            this.shiftY = 0;
            this.playerX = 0;
            this.playerY = 0;
            var self = this;
            self.on("click", function (evt) {
                Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                self.hide();
            }, null, false);
            var border = new createjs.Shape();
            border.graphics.setStrokeStyle(1);
            border.graphics.beginStroke("rgba(0,0,0,255)");
            border.graphics.beginFill("rgba(209,251,255,255)");
            border.graphics.drawRect(-1, -1, this.width + 2, this.height + 2);
            this.addChild(border);
            self.canvas = document.getElementById("mapCanvas");
            var ctx = self.canvas.getContext("2d");
            self.bitmap = new createjs.Bitmap(self.canvas);
            self.addChild(self.bitmap);
            self.playerIcon = Lich.Resources.getInstance().getBitmap(Lich.UIGFXKey[Lich.UIGFXKey.PLAYER_ICON_KEY]);
            self.playerIcon.width = self.playerIcon.getBounds().width;
            self.playerIcon.height = self.playerIcon.getBounds().height;
            this.addChild(self.playerIcon);
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
            self.bitmap.scaleX = (mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2) / self.canvas.width;
            self.bitmap.scaleY = (mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2) / self.canvas.height;
            // self.bitmap.sourceRect = new createjs.Rectangle(0, 0, MinimapUI.MAP_SIDE, MinimapUI.MAP_SIDE);
            var adjustPlayerIcon = function () {
                // musí se sečíst screen poloha hráče s map-offset a vydělit poměrem 1px mapy na reál (1px mapy = 2 tiles reálu)
                // to celé se pak musí ještě vynásobit škálou, kterou je mapa zmenšena/zvětšna pro celoobrazovkové zobrazení
                self.playerIcon.x = ((self.playerX - self.shiftX) / (2 * Lich.Resources.TILE_SIZE)) * self.bitmap.scaleX;
                self.playerIcon.y = ((self.playerY - self.shiftY) / (2 * Lich.Resources.TILE_SIZE)) * self.bitmap.scaleY;
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
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SURFACE_CHANGE, function (payload) {
                var imgData = ctx.createImageData(1, 1);
                var _loop_1 = function(i) {
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
            });
        }
        MinimapUI.prototype.processFillBySurface = function (x, y, fill) {
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
        };
        MinimapUI.prototype.drawMinimapTile = function (imgData, x, y) {
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
        MinimapUI.prototype.updateMinimap = function (mapUpdateRegion) {
            var self = this;
            if (mapUpdateRegion.prepared === false) {
                return;
            }
            if (mapUpdateRegion.cooldown < MinimapUI.MINIMAP_COOLDOWN) {
                mapUpdateRegion.cooldown++;
                return;
            }
            mapUpdateRegion.cooldown = 0;
            var x0 = mapUpdateRegion.fromX;
            var y0 = mapUpdateRegion.fromY;
            var w = mapUpdateRegion.toX - mapUpdateRegion.fromX + 1;
            var h = mapUpdateRegion.toY - mapUpdateRegion.fromY + 1;
            var ctx = self.canvas.getContext("2d");
            var imgData = ctx.createImageData(w, h); // width x height
            (function () {
                for (var y = y0; y <= mapUpdateRegion.toY; y++) {
                    for (var x = x0; x <= mapUpdateRegion.toX; x++) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, x0, y0);
            })();
            //minimap.cont.removeChild(minimap.bitmap);
            var dataURL = self.canvas.toDataURL();
            self.bitmap.image = new createjs.Bitmap(dataURL).image;
            //minimap.cont.addChild(minimap.bitmap);
            mapUpdateRegion.reset();
        };
        MinimapUI.MAP_SIDE = 200;
        MinimapUI.MINIMAP_COOLDOWN = 30;
        return MinimapUI;
    }(Lich.AbstractUI));
    Lich.MinimapUI = MinimapUI;
})(Lich || (Lich = {}));
