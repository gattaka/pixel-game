var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var MinimapUI = (function (_super) {
        __extends(MinimapUI, _super);
        function MinimapUI(tilesMap) {
            _super.call(this);
            this.tilesMap = tilesMap;
        }
        MinimapUI.prototype.updateMinimapPosition = function (screenOffsetX, screenOffsetY) {
            var self = this;
            var x = Math.floor(-1 * screenOffsetX / Lich.Resources.TILE_SIZE);
            var y = Math.floor(-1 * screenOffsetY / Lich.Resources.TILE_SIZE);
            self.minimap.bitmap.sourceRect = {
                x: x,
                y: y,
                height: MinimapUI.MAP_SIDE,
                width: MinimapUI.MAP_SIDE
            };
        };
        MinimapUI.prototype.drawMinimapTile = function (imgData, x, y) {
            var self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            var item = self.tilesMap.mapRecord.getValue(x, y);
            if (item === Lich.SurfacePositionKey.VOID) {
                imgData.data[imgData.counter++] = 209; // R
                imgData.data[imgData.counter++] = 251; // G
                imgData.data[imgData.counter++] = 255; // B
                imgData.data[imgData.counter++] = 200; // A
            }
            else {
                if (Lich.Resources.getInstance().surfaceIndex.isMiddlePosition(item)) {
                    imgData.data[imgData.counter++] = 156; // R
                    imgData.data[imgData.counter++] = 108; // G
                    imgData.data[imgData.counter++] = 36; // B
                    imgData.data[imgData.counter++] = 200; // A
                }
                else {
                    imgData.data[imgData.counter++] = 102; // R
                    imgData.data[imgData.counter++] = 174; // G 
                    imgData.data[imgData.counter++] = 0; // B
                    imgData.data[imgData.counter++] = 200; // A
                }
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
            var ctx = self.minimap.canvas.getContext("2d");
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
            var dataURL = self.minimap.canvas.toDataURL();
            self.minimap.bitmap.image = new createjs.Bitmap(dataURL).image;
            //minimap.cont.addChild(minimap.bitmap);
            mapUpdateRegion.reset();
            // TODO
            self.updateMinimapPosition(0, 0);
        };
        MinimapUI.prototype.initMinimap = function () {
            var self = this;
            var ctx = self.minimap.canvas.getContext("2d");
            var imgData = ctx.createImageData(self.tilesMap.width, self.tilesMap.height); // width x height
            (function () {
                for (var y = 0; y < self.tilesMap.height; y++) {
                    for (var x = 0; x < self.tilesMap.width; x++) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            })();
            var dataURL = self.minimap.canvas.toDataURL();
            self.minimap.bitmap = new createjs.Bitmap(dataURL);
            self.minimap.cont.addChild(self.minimap.bitmap);
            self.updateMinimapPosition(0, 0);
        };
        MinimapUI.prototype.createMinimap = function () {
            var self = this;
            self.minimap = {};
            var canvas = document.getElementById("mapCanvas");
            self.minimap.canvas = canvas;
            canvas.width = self.tilesMap.width;
            canvas.height = self.tilesMap.height;
            canvas.style.backgroundColor = "#eee";
            var minimapCont = new createjs.Container();
            self.minimap.cont = minimapCont;
            minimapCont.width = MinimapUI.MAP_SIDE + 2;
            minimapCont.height = MinimapUI.MAP_SIDE + 2;
            //minimapCont.x = self.sectorsCont.width - MinimapUI.MAP_SIDE - 20;
            minimapCont.y = 20;
            //self.world.addChild(minimapCont);
            var border = new createjs.Shape();
            border.graphics.setStrokeStyle(1);
            border.graphics.beginStroke("rgba(0,0,0,255)");
            border.graphics.beginFill("rgba(209,251,255,255)");
            border.graphics.drawRect(-1, -1, MinimapUI.MAP_SIDE + 2, MinimapUI.MAP_SIDE + 2);
            minimapCont.addChild(border);
            self.initMinimap();
            self.playerIcon = Lich.Resources.getInstance().getBitmap(Lich.UIGFXKey[Lich.UIGFXKey.PLAYER_ICON_KEY]);
            self.playerIcon.alpha = 0.7;
            self.minimap.cont.addChild(self.playerIcon);
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
    }(createjs.Container));
    Lich.MinimapUI = MinimapUI;
})(Lich || (Lich = {}));
