var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Particle = (function (_super) {
        __extends(Particle, _super);
        function Particle() {
            _super.apply(this, arguments);
            this.speed = 0;
            this.acc = 100;
        }
        return Particle;
    }(createjs.Shape));
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
            this.modeDurationTimer = 0;
            this.spawnBatchDelayTimer = 0;
            this.particles = new Array();
            this.windSpeed = 0;
            this.mode = WeatherMode.NONE;
            this.width = game.getCanvas().width;
            this.height = game.getCanvas().height;
            this.switchMode(WeatherMode.SNOW_START);
        }
        Weather.prototype.switchMode = function (mode) {
            this.mode = mode;
            console.log("New mode: " + WeatherMode[mode]);
            if (mode == WeatherMode.NONE)
                this.particles = new Array();
        };
        Weather.prototype.initParticle = function (p) {
            var z = Math.random() * 3 + 1;
            if (Lich.ThemeWatch.getCurrentTheme() == Lich.Theme.WINTER) {
                p.graphics.clear().beginFill("#eee").drawCircle(0, 0, z);
                p.acc = z * 10;
            }
            else {
                p.graphics.clear().beginFill("#aaf").drawRect(0, 0, 1, z * 5);
                p.acc = z * 100 + 100;
            }
            p.x = Math.random() * this.width;
            p.y = -Math.random() * 200 - 200;
            p.speed = 0;
        };
        Weather.prototype.update = function (delta) {
            var sDelta = delta / 1000;
            this.windSpeed += Math.random() * 2 - 1;
            if (this.windSpeed > Weather.MAX_WIND)
                this.windSpeed = Weather.MAX_WIND;
            if (this.windSpeed < -Weather.MAX_WIND)
                this.windSpeed = -Weather.MAX_WIND;
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
                    var toSpawn = Math.ceil(Math.random() * Weather.SPAWN_BATCH_MAX_AMOUNT);
                    if (this.particles.length + toSpawn >= Weather.SNOW_AMOUNT) {
                        toSpawn = Weather.SNOW_AMOUNT - this.particles.length;
                        this.switchMode(WeatherMode.SNOW);
                    }
                    for (var i = 0; i < toSpawn; i++) {
                        var p = new Particle();
                        this.initParticle(p);
                        this.particles.push(p);
                        this.addChild(p);
                    }
                }
            }
            if (this.mode != WeatherMode.NONE) {
                for (var i in this.particles) {
                    var p = this.particles[i];
                    if (p) {
                        p.y += Lich.Utils.floor(p.speed * sDelta + p.acc * Math.pow(sDelta, 2) / 2);
                        p.x += Lich.Utils.floor(this.windSpeed * sDelta);
                        p.speed += p.acc * sDelta;
                        if (p.y > this.height + 20) {
                            if (this.mode == WeatherMode.SNOW_STOP &&
                                // některé particles se ještě jednou prolétnou i když se už končí
                                Math.random() > 0.2) {
                                this.removeChild(p);
                                this.particles[i] = null;
                                if (this.children.length == 0)
                                    this.switchMode(WeatherMode.NONE);
                            }
                            else {
                                this.initParticle(p);
                            }
                        }
                    }
                }
            }
        };
        Weather.SNOW_AMOUNT = 500;
        Weather.SPAWN_BATCH_MAX_AMOUNT = 50;
        Weather.SPAWN_BATCH_DELAY = 1000;
        Weather.MODE_DURATION = 60000;
        Weather.MAX_WIND = 10;
        return Weather;
    }(createjs.Container));
    Lich.Weather = Weather;
})(Lich || (Lich = {}));
