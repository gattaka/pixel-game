namespace Lich {

    export class MinimapUI extends createjs.Container {

        static MAP_SIDE = 200;
        static MINIMAP_COOLDOWN = 30;

        minimap;
        playerIcon;

        constructor(private tilesMap: TilesMap) {
            super();
        }

        updateMinimapPosition(screenOffsetX: number, screenOffsetY: number) {
            var self = this;
            var x = Math.floor(-1 * screenOffsetX / Resources.TILE_SIZE);
            var y = Math.floor(-1 * screenOffsetY / Resources.TILE_SIZE);

            self.minimap.bitmap.sourceRect = {
                x: x,
                y: y,
                height: MinimapUI.MAP_SIDE,
                width: MinimapUI.MAP_SIDE
            };
        }

        drawMinimapTile(imgData, x: number, y: number) {
            var self = this;
            if (typeof imgData.counter === "undefined" || imgData.counter === null)
                imgData.counter = 0;
            var item = self.tilesMap.mapRecord.getValue(x, y);
            if (item === SurfacePositionKey.VOID) {
                imgData.data[imgData.counter++] = 209; // R
                imgData.data[imgData.counter++] = 251; // G
                imgData.data[imgData.counter++] = 255; // B
                imgData.data[imgData.counter++] = 200; // A
            } else {
                if (Resources.getInstance().surfaceIndex.isMiddlePosition(item)) {
                    imgData.data[imgData.counter++] = 156; // R
                    imgData.data[imgData.counter++] = 108; // G
                    imgData.data[imgData.counter++] = 36; // B
                    imgData.data[imgData.counter++] = 200; // A
                } else {
                    imgData.data[imgData.counter++] = 102; // R
                    imgData.data[imgData.counter++] = 174; // G 
                    imgData.data[imgData.counter++] = 0; // B
                    imgData.data[imgData.counter++] = 200; // A
                }
            }
        };

        updateMinimap(mapUpdateRegion) {
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
        }

        initMinimap() {
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

            self.updateMinimapPosition(0,0);
        }

        createMinimap() {
            var self = this;
            self.minimap = {};

            var canvas = <HTMLCanvasElement>document.getElementById("mapCanvas");
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

            self.playerIcon = Resources.getInstance().getBitmap(UIGFXKey[UIGFXKey.PLAYER_ICON_KEY]);
            self.playerIcon.alpha = 0.7;
            self.minimap.cont.addChild(self.playerIcon);

        }

        updatePlayerIcon(x: number, y: number) {
            var self = this;
            if (typeof self.playerIcon !== "undefined") {
                self.playerIcon.x = Math.floor(x / Resources.TILE_SIZE) - (self.playerIcon.image.width / 2);
                self.playerIcon.y = Math.floor(y / Resources.TILE_SIZE) - (self.playerIcon.image.height / 2);
            }
        }

    }

}