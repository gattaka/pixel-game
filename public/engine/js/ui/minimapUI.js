var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var MinimapUI = (function (_super) {
        __extends(MinimapUI, _super);
        function MinimapUI(tilesMap, mainCanvasWidth, mainCanvasHeight) {
            _super.call(this, mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2, mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2);
            this.tilesMap = tilesMap;
            this.shiftX = 0;
            this.shiftY = 0;
            this.playerX = 0;
            this.playerY = 0;
            var self = this;
            self.canvas = document.getElementById("mapCanvas");
            self.canvas.width = self.tilesMap.width / 2;
            self.canvas.height = self.tilesMap.height / 2;
            self.canvas.style.backgroundColor = "#eee";
            // var border = new createjs.Shape();
            // border.graphics.setStrokeStyle(1);
            // border.graphics.beginStroke("rgba(0,0,0,255)");
            // border.graphics.beginFill("rgba(209,251,255,255)");
            // border.graphics.drawRect(-1, -1, MinimapUI.MAP_SIDE + 2, MinimapUI.MAP_SIDE + 2);
            // this.addChild(border);
            var ctx = self.canvas.getContext("2d");
            var imgData = ctx.createImageData(self.tilesMap.width / 2, self.tilesMap.height / 2); // width x height
            (function () {
                for (var y = 0; y < self.tilesMap.height; y += 2) {
                    for (var x = 0; x < self.tilesMap.width; x += 2) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            })();
            var dataURL = self.canvas.toDataURL();
            self.bitmap = new createjs.Bitmap(dataURL);
            self.bitmap.scaleX = (mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2) / self.canvas.width;
            self.bitmap.scaleY = (mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2) / self.canvas.height;
            // self.bitmap.sourceRect = new createjs.Rectangle(0, 0, MinimapUI.MAP_SIDE, MinimapUI.MAP_SIDE);
            self.addChild(self.bitmap);
            self.playerIcon = Lich.Resources.getInstance().getBitmap(Lich.UIGFXKey[Lich.UIGFXKey.PLAYER_ICON_KEY]);
            self.playerIcon.alpha = 0.7;
            self.playerIcon.width = self.playerIcon.getBounds().width;
            self.playerIcon.height = self.playerIcon.getBounds().height;
            this.addChild(self.playerIcon);
            var adjustMap = function () {
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
                adjustMap();
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_Y, function (payload) {
                self.shiftY = payload.payload;
                adjustMap();
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.PLAYER_POSITION_CHANGE, function (payload) {
                self.playerX = payload.x;
                self.playerY = payload.y;
                adjustMap();
                return false;
            });
        }
        MinimapUI.prototype.drawMinimapTile = function (imgData, x, y) {
            var self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            var item = self.tilesMap.mapRecord.getValue(x, y);
            var fill = function (r, g, b) {
                imgData.data[imgData.counter++] = r; // R
                imgData.data[imgData.counter++] = g; // G
                imgData.data[imgData.counter++] = b; // B
                imgData.data[imgData.counter++] = 250; // A
            };
            if (item != Lich.SurfacePositionKey.VOID) {
                var key = Lich.Resources.getInstance().surfaceIndex.getType(item);
                switch (key) {
                    case Lich.SurfaceKey.SRFC_DIRT_KEY:
                        fill(156, 108, 36);
                        break;
                    case Lich.SurfaceKey.SRFC_BRICK_KEY:
                        fill(79, 39, 0);
                        break;
                    case Lich.SurfaceKey.SRFC_COAL_KEY:
                        fill(37, 27, 27);
                        break;
                    case Lich.SurfaceKey.SRFC_WOODWALL_KEY:
                        fill(181, 129, 28);
                        break;
                    case Lich.SurfaceKey.SRFC_ROOF_KEY:
                        fill(156, 60, 28);
                        break;
                    case Lich.SurfaceKey.SRFC_ROCK_KEY:
                        fill(82, 82, 82);
                        break;
                    case Lich.SurfaceKey.SRFC_STRAW_KEY:
                        fill(219, 187, 39);
                        break;
                    case Lich.SurfaceKey.SRFC_KRYSTAL_KEY:
                        fill(0, 201, 201);
                        break;
                    case Lich.SurfaceKey.SRFC_FLORITE_KEY:
                        fill(159, 68, 181);
                        break;
                    case Lich.SurfaceKey.SRFC_IRON_KEY:
                        fill(177, 88, 33);
                        break;
                    default: fill(209, 251, 255);
                }
            }
            else {
                fill(209, 251, 255);
            }
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
        MinimapUI.prototype.updatePlayerIcon = function (x, y) {
            var self = this;
            if (typeof self.playerIcon !== "undefined") {
                self.playerIcon.x = Math.floor(x / Lich.Resources.TILE_SIZE) - (self.playerIcon.image.width / 2);
                self.playerIcon.y = Math.floor(y / Lich.Resources.TILE_SIZE) - (self.playerIcon.image.height / 2);
            }
        };
        MinimapUI.MAP_SIDE = 200;
        MinimapUI.MINIMAP_COOLDOWN = 30;
        return MinimapUI;
    }(Lich.AbstractUI));
    Lich.MinimapUI = MinimapUI;
})(Lich || (Lich = {}));
