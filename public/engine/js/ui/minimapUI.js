var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var AbstractMapUIRenderer = (function () {
        function AbstractMapUIRenderer(tilesMap, canvasDOMId, width, height) {
            this.tilesMap = tilesMap;
            this.width = width;
            this.height = height;
            this.canvas = document.getElementById(canvasDOMId);
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
        AbstractMapUIRenderer.prototype.processFillBySurface = function (x, y, fill) {
            // tiles to sudé Parts
            var rx = Math.floor(x / 2);
            var ry = Math.floor(y / 2);
            var fog = this.tilesMap.fogRecord.getValue(rx, ry);
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
        return AbstractMapUIRenderer;
    }());
    var MinimapUIRender = (function (_super) {
        __extends(MinimapUIRender, _super);
        function MinimapUIRender(tilesMap) {
            var _this = _super.call(this, tilesMap, "minimapCanvas", MinimapUIRender.MAP_SIDE, MinimapUIRender.MAP_SIDE) || this;
            _this.shiftX = 0;
            _this.shiftY = 0;
            _this.playerX = 0;
            _this.playerY = 0;
            var self = _this;
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SURFACE_CHANGE, function (payload) {
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.MINIMAP_UPDATE));
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SURFACE_REVEAL, function (payload) {
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.MINIMAP_UPDATE));
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_X, function (payload) {
                self.shiftX = payload.payload;
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.MINIMAP_UPDATE));
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_Y, function (payload) {
                self.shiftY = payload.payload;
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.MINIMAP_UPDATE));
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.PLAYER_POSITION_CHANGE, function (payload) {
                self.playerX = payload.x;
                self.playerY = payload.y;
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.MINIMAP_UPDATE));
                return false;
            });
            return _this;
        }
        MinimapUIRender.prototype.update = function () {
            var self = this;
            // (1px mapy = 2 tiles reálu)
            var xScale = 2 * Lich.Resources.TILE_SIZE;
            var yScale = 2 * Lich.Resources.TILE_SIZE;
            var miniXShift = self.shiftX / xScale;
            var miniYShift = self.shiftY / yScale;
            var miniXPlayer = self.playerX / xScale;
            var miniYPlayer = self.playerY / yScale;
            var viewX;
            // mapRender.tilesMap.width je v tiles, já tady počítám v parts (/2)
            if (miniXPlayer - miniXShift >= self.width / 2 && miniXPlayer - miniXShift <= self.tilesMap.width / 2 - self.width / 2) {
                self.iconX = self.width / 2;
                viewX = miniXPlayer - miniXShift - self.width / 2;
            }
            else {
                if (miniXPlayer - miniXShift > self.width) {
                    self.iconX = self.width / 2 + miniXPlayer - miniXShift - (self.tilesMap.width / 2 - self.width / 2);
                    viewX = self.tilesMap.width / 2 - self.width;
                }
                else {
                    self.iconX = miniXPlayer - miniXShift;
                    viewX = 0;
                }
            }
            var viewY;
            // mapRender.tilesMap.height je v tiles, já tady počítám v parts (/2)
            if (miniYPlayer - miniYShift >= self.height / 2 && miniYPlayer - miniYShift <= self.tilesMap.height / 2 - self.height / 2) {
                self.iconY = self.height / 2;
                viewY = miniYPlayer - miniYShift - self.height / 2;
            }
            else {
                if (miniYPlayer - miniYShift > self.height) {
                    self.iconY = self.height / 2 + miniYPlayer - miniYShift - (self.tilesMap.height / 2 - self.height / 2);
                    viewY = self.tilesMap.height / 2 - self.height;
                }
                else {
                    self.iconY = miniYPlayer - miniYShift;
                    viewY = 0;
                }
            }
            // pozice minimapy
            var imgData = this.ctx.createImageData(this.width, this.height); // width x height
            (function () {
                for (var y = 0; y < self.height; y++) {
                    for (var x = 0; x < self.width; x++) {
                        self.drawMinimapTile(imgData, (Math.floor(viewX) + x) * 2, (Math.floor(viewY) + y) * 2);
                    }
                }
                self.ctx.putImageData(imgData, 0, 0);
            })();
        };
        ;
        MinimapUIRender.prototype.drawMinimapTile = function (imgData, x, y) {
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
        return MinimapUIRender;
    }(AbstractMapUIRenderer));
    MinimapUIRender.MAP_SIDE = 200;
    Lich.MinimapUIRender = MinimapUIRender;
    var MinimapUI = (function (_super) {
        __extends(MinimapUI, _super);
        function MinimapUI(mapRender) {
            var _this = _super.call(this, MinimapUIRender.MAP_SIDE, MinimapUIRender.MAP_SIDE) || this;
            _this.mapRender = mapRender;
            _this.prepareUpdateTexture = false;
            _this.prepareUpdateTextureCounter = MinimapUI.MINIMAP_UPDATE_DELAY;
            var self = _this;
            var border = new PIXI.Graphics();
            border.lineStyle(1, 0x000000, 1);
            border.beginFill(0xd1fbff, 1);
            border.drawRect(0, 0, _this.fixedWidth, _this.fixedHeight);
            self.addChild(border);
            self.bitmap = new PIXI.Sprite(PIXI.Texture.fromCanvas(mapRender.canvas));
            self.addChild(self.bitmap);
            self.playerIcon = Lich.Resources.getInstance().getUISprite(Lich.UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.fixedWidth = self.playerIcon.getBounds().width;
            self.playerIcon.fixedHeight = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MINIMAP_UPDATE, function () {
                _this.prepareUpdateTexture = true;
                return false;
            });
            return _this;
        }
        MinimapUI.prototype.update = function (delta) {
            if (this.prepareUpdateTexture) {
                this.prepareUpdateTextureCounter -= delta;
                if (this.prepareUpdateTextureCounter <= 0) {
                    this.prepareUpdateTextureCounter = MinimapUI.MINIMAP_UPDATE_DELAY;
                    this.mapRender.update();
                    var texture = this.bitmap.texture.clone();
                    texture.update();
                    this.bitmap.texture.destroy();
                    this.bitmap.texture = texture;
                    this.prepareUpdateTexture = false;
                    this.playerIcon.x = this.mapRender.iconX - this.playerIcon.fixedWidth / 2;
                    this.playerIcon.y = this.mapRender.iconY - this.playerIcon.fixedHeight / 2;
                }
            }
        };
        return MinimapUI;
    }(Lich.AbstractUI));
    MinimapUI.MINIMAP_UPDATE_DELAY = 50;
    Lich.MinimapUI = MinimapUI;
    var MapUIRender = (function (_super) {
        __extends(MapUIRender, _super);
        function MapUIRender(tilesMap) {
            var _this = _super.call(this, tilesMap, "mapCanvas", tilesMap.width / 2, tilesMap.height / 2) || this;
            var self = _this;
            var imgData = _this.ctx.createImageData(_this.width, _this.height); // width x height
            (function () {
                for (var y = 0; y < self.tilesMap.height; y += 2) {
                    for (var x = 0; x < self.tilesMap.width; x += 2) {
                        self.drawMinimapTile(imgData, x, y);
                    }
                }
                self.ctx.putImageData(imgData, 0, 0);
            })();
            var listener = function (payload) {
                var imgData = _this.ctx.createImageData(1, 1);
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
                self.ctx.putImageData(imgData, payload.x / 2, payload.y / 2);
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.MAP_UPDATE));
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
            return _this;
        }
        MapUIRender.prototype.drawMinimapTile = function (imgData, x, y) {
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
        return MapUIRender;
    }(AbstractMapUIRenderer));
    Lich.MapUIRender = MapUIRender;
    var MapUI = (function (_super) {
        __extends(MapUI, _super);
        function MapUI(mainCanvasWidth, mainCanvasHeight, mapRender) {
            var _this = _super.call(this, mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2, mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2) || this;
            _this.mapRender = mapRender;
            _this.shiftX = 0;
            _this.shiftY = 0;
            _this.playerX = 0;
            _this.playerY = 0;
            _this.prepareUpdateTexture = false;
            _this.prepareUpdateTextureCounter = MapUI.MAP_UPDATE_DELAY;
            var self = _this;
            self.on("pointerdown", function () {
                Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                self.hide();
            });
            var border = new PIXI.Graphics();
            border.lineStyle(1, 0x000000, 1);
            border.beginFill(0xd1fbff, 1);
            border.drawRect(0, 0, _this.fixedWidth, _this.fixedHeight);
            self.addChild(border);
            self.bitmap = new PIXI.Sprite(PIXI.Texture.fromCanvas(mapRender.canvas));
            self.addChild(self.bitmap);
            self.playerIcon = Lich.Resources.getInstance().getUISprite(Lich.UISpriteKey.UI_PLAYER_ICON_KEY);
            self.playerIcon.fixedWidth = self.playerIcon.getBounds().width;
            self.playerIcon.fixedHeight = self.playerIcon.getBounds().height;
            self.addChild(self.playerIcon);
            self.bitmap.scale.x = (mainCanvasWidth - Lich.UI.SCREEN_SPACING * 2) / mapRender.width;
            self.bitmap.scale.y = (mainCanvasHeight - Lich.UI.SCREEN_SPACING * 2) / mapRender.height;
            var adjustPlayerIcon = function () {
                // musí se sečíst screen poloha hráče s map-offset a vydělit poměrem 1px mapy na reál (1px mapy = 2 tiles reálu)
                // to celé se pak musí ještě vynásobit škálou, kterou je mapa zmenšena/zvětšna pro celoobrazovkové zobrazení
                self.playerIcon.x = ((self.playerX - self.shiftX) / (2 * Lich.Resources.TILE_SIZE)) * self.bitmap.scale.x;
                self.playerIcon.y = ((self.playerY - self.shiftY) / (2 * Lich.Resources.TILE_SIZE)) * self.bitmap.scale.y;
                // a pak se ještě vycentruje ikona
                self.playerIcon.x -= self.playerIcon.fixedWidth / 2;
                self.playerIcon.y -= self.playerIcon.fixedHeight / 2;
            };
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_UPDATE, function () {
                _this.prepareUpdateTexture = true;
                return false;
            });
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
        MapUI.prototype.update = function (delta) {
            if (this.prepareUpdateTexture && this.parent) {
                this.prepareUpdateTextureCounter -= delta;
                if (this.prepareUpdateTextureCounter <= 0) {
                    this.prepareUpdateTextureCounter = MapUI.MAP_UPDATE_DELAY;
                    this.bitmap.texture.update();
                    var texture = this.bitmap.texture.clone();
                    texture.update();
                    this.bitmap.texture.destroy();
                    this.bitmap.texture = texture;
                    this.prepareUpdateTexture = false;
                }
            }
        };
        return MapUI;
    }(Lich.AbstractUI));
    MapUI.MAP_UPDATE_DELAY = 500;
    Lich.MapUI = MapUI;
})(Lich || (Lich = {}));
