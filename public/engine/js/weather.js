var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var ParticleLayer = (function (_super) {
        __extends(ParticleLayer, _super);
        function ParticleLayer(speed) {
            _super.call(this);
            this.speed = speed;
        }
        return ParticleLayer;
    }(createjs.Container));
    var WeatherMode;
    (function (WeatherMode) {
        WeatherMode[WeatherMode["NONE"] = 0] = "NONE";
        WeatherMode[WeatherMode["SNOW_START"] = 1] = "SNOW_START";
        WeatherMode[WeatherMode["SNOW"] = 2] = "SNOW";
        WeatherMode[WeatherMode["SNOW_STOP"] = 3] = "SNOW_STOP";
    })(WeatherMode || (WeatherMode = {}));
    var Weather = (function (_super) {
        __extends(Weather, _super);
        function Weather(game) {
            _super.call(this);
            this.game = game;
            this.snowflakeTryTimer = 0;
            this.modeStartProgress = 0;
            this.modeDurationTimer = 0;
            this.spawnBatchDelayTimer = 0;
            this.particleLayers = new Array();
            this.windSpeed = 0;
            this.mode = WeatherMode.NONE;
            this.width = game.getCanvas().width;
            this.height = game.getCanvas().height;
        }
        Weather.prototype.switchMode = function (mode) {
            this.mode = mode;
            this.modeStartProgress = 0;
            console.log("New mode: " + WeatherMode[mode]);
            if (mode == WeatherMode.NONE)
                this.particleLayers = new Array();
        };
        Weather.prototype.initSnow = function () {
            this.particleLayers = new Array();
            for (var l = 0; l < Weather.PARTICLE_LAYERS * 2; l++) {
                var speed = void 0, acc = void 0;
                if (Lich.ThemeWatch.getCurrentTheme() == Lich.Theme.WINTER) {
                    acc = ((l % Weather.PARTICLE_LAYERS) + 1) * 150;
                }
                else {
                    acc = ((l % Weather.PARTICLE_LAYERS) + 1) * 300;
                }
                var layer = new ParticleLayer(acc);
                layer.width = this.width;
                layer.height = this.height;
                this.particleLayers.push(layer);
            }
            for (var i = 0; i < Weather.SNOW_AMOUNT * 2; i++) {
                var p = new createjs.Shape();
                var z = Math.floor(Math.random() * Weather.PARTICLE_LAYERS);
                if (Lich.ThemeWatch.getCurrentTheme() == Lich.Theme.WINTER) {
                    p.graphics.beginFill("rgba(250,250,250,0.5)").drawCircle(0, 0, z + 2);
                }
                else {
                    p.graphics.beginFill("#aaf").drawRect(0, 0, 1, z * 5 + 1);
                }
                p.x = Math.random() * this.width;
                p.y = Math.random() * this.height;
                var x = z;
                if (i >= Weather.SNOW_AMOUNT) {
                    x += Weather.PARTICLE_LAYERS;
                }
                this.particleLayers[x].addChild(p);
            }
            for (var i = 0; i < this.particleLayers.length; i++) {
                var l = this.particleLayers[i];
                if (l) {
                    l.cache(0, 0, l.width, l.height);
                    l.y = -this.height;
                    if (i >= Weather.PARTICLE_LAYERS) {
                        l.y *= 2;
                    }
                }
            }
        };
        Weather.prototype.update = function (delta) {
            var sDelta = delta / 1000;
            this.windSpeed += Math.random() * 2 - 1;
            if (this.windSpeed > Weather.MAX_WIND)
                this.windSpeed = Weather.MAX_WIND;
            if (this.windSpeed < -Weather.MAX_WIND)
                this.windSpeed = -Weather.MAX_WIND;
            if (this.mode == WeatherMode.SNOW && Lich.ThemeWatch.getCurrentTheme() == Lich.Theme.WINTER) {
                this.snowflakeTryTimer += delta;
                var world = this.game.getWorld();
                for (var i = 0; i < this.snowflakeTryTimer / Weather.SNOWFLAKE_SPAWN_INTERVAL; i++) {
                    this.snowflakeTryTimer = 0;
                    if (Math.random() * Weather.SNOWFLAKE_SPAWN_PROP < 1)
                        world.spawnObject(new Lich.DugObjDefinition(Lich.InventoryKey.INV_SNOWFLAKE, 1), Math.floor(Math.random() * world.tilesMap.width), 0);
                    if (Math.random() * Weather.GIFT_SPAWN_PROP < 1) {
                        var gift = void 0;
                        switch (Math.floor(Math.random() * 3)) {
                            case 0:
                                gift = Lich.InventoryKey.INV_GIFT1_KEY;
                                break;
                            case 1:
                                gift = Lich.InventoryKey.INV_GIFT2_KEY;
                                break;
                            case 2:
                                gift = Lich.InventoryKey.INV_GIFT3_KEY;
                                break;
                        }
                        world.spawnObject(new Lich.DugObjDefinition(gift, 1), Math.floor(Math.random() * world.tilesMap.width), 0);
                    }
                }
            }
            if (this.mode == WeatherMode.SNOW || this.mode == WeatherMode.NONE) {
                this.modeDurationTimer += delta;
                if (this.modeDurationTimer > Weather.MODE_DURATION) {
                    this.modeDurationTimer = 0;
                    switch (this.mode) {
                        case WeatherMode.NONE:
                            switch (Math.floor(Math.random() * 2)) {
                                case 0:
                                    this.switchMode(WeatherMode.NONE);
                                    break;
                                case 1:
                                    this.switchMode(WeatherMode.SNOW_START);
                                    break;
                            }
                            break;
                        case WeatherMode.SNOW:
                            this.switchMode(WeatherMode.SNOW_STOP);
                            break;
                    }
                }
            }
            if (this.mode == WeatherMode.SNOW_START) {
                this.spawnBatchDelayTimer += delta;
                if (this.spawnBatchDelayTimer > Weather.SPAWN_BATCH_DELAY) {
                    this.spawnBatchDelayTimer = 0;
                    if (this.modeStartProgress == 0) {
                        this.initSnow();
                    }
                    if (this.modeStartProgress < Weather.PARTICLE_LAYERS) {
                        this.addChild(this.particleLayers[this.modeStartProgress]);
                        this.addChild(this.particleLayers[this.modeStartProgress + Weather.PARTICLE_LAYERS]);
                    }
                    else {
                        this.switchMode(WeatherMode.SNOW);
                    }
                    this.modeStartProgress++;
                }
            }
            if (this.mode != WeatherMode.NONE) {
                for (var i = 0; i < this.particleLayers.length; i++) {
                    var p = this.particleLayers[i];
                    if (p) {
                        if (!p.parent)
                            continue;
                        p.y += Lich.Utils.floor(p.speed * sDelta);
                        p.x += Lich.Utils.floor(this.windSpeed * sDelta);
                        if (p.y > this.height) {
                            var partnerLayer = void 0;
                            if (i < Weather.PARTICLE_LAYERS) {
                                partnerLayer = this.particleLayers[i + Weather.PARTICLE_LAYERS];
                            }
                            else {
                                partnerLayer = this.particleLayers[i - Weather.PARTICLE_LAYERS];
                            }
                            if (this.mode == WeatherMode.SNOW_STOP) {
                                this.removeChild(p);
                                this.particleLayers[i] = null;
                                if (this.children.length == 0)
                                    this.switchMode(WeatherMode.NONE);
                            }
                            else {
                                p.y = partnerLayer.y - partnerLayer.height;
                                p.x = 0;
                            }
                        }
                    }
                }
            }
        };
        Weather.SNOW_AMOUNT = 500;
        Weather.SPAWN_BATCH_DELAY = 10000;
        Weather.PARTICLE_LAYERS = 3;
        Weather.MODE_DURATION = 60000;
        Weather.MAX_WIND = 10;
        Weather.SNOWFLAKE_SPAWN_PROP = 200;
        Weather.GIFT_SPAWN_PROP = 500;
        Weather.SNOWFLAKE_SPAWN_INTERVAL = 5000;
        return Weather;
    }(createjs.Container));
    Lich.Weather = Weather;
})(Lich || (Lich = {}));
