namespace Lich {

    class ParticleLayer extends createjs.Container {
        constructor(public speed: number) {
            super();
        }
    }

    enum WeatherMode {
        NONE,
        SNOW_START,
        SNOW,
        SNOW_STOP
    }

    export class Weather extends createjs.Container {

        private static SNOW_AMOUNT = 500;
        private static SPAWN_BATCH_DELAY = 1000;
        private static PARTICLE_LAYERS = 3;
        private static MODE_DURATION = 60000;
        private static MAX_WIND = 10;

        private modeStartProgress = 0;
        private modeDurationTimer = 0;
        private spawnBatchDelayTimer = 0;
        private particleLayers = new Array<ParticleLayer>();
        private windSpeed = 0;

        private mode = WeatherMode.NONE;

        constructor(public game: Game) {
            super();
            this.width = game.getCanvas().width;
            this.height = game.getCanvas().height;
        }

        switchMode(mode: WeatherMode) {
            this.mode = mode;
            this.modeStartProgress = 0;
            console.log("New mode: " + WeatherMode[mode]);
            if (mode == WeatherMode.NONE)
                this.particleLayers = new Array<ParticleLayer>();
        }

        private initSnow() {
            this.particleLayers = new Array<ParticleLayer>();
            for (let l = 0; l < Weather.PARTICLE_LAYERS * 2; l++) {
                let speed, acc;
                if (ThemeWatch.getCurrentTheme() == Theme.WINTER) {
                    acc = ((l % Weather.PARTICLE_LAYERS) + 1) * 150;
                } else {
                    acc = ((l % Weather.PARTICLE_LAYERS) + 1) * 100 + 100;
                }
                let layer = new ParticleLayer(acc);
                layer.width = this.width;
                layer.height = this.height;
                this.particleLayers.push(layer);
            }
            for (let i = 0; i < Weather.SNOW_AMOUNT * 2; i++) {
                let p = new createjs.Shape();
                let z = Math.floor(Math.random() * Weather.PARTICLE_LAYERS);
                if (ThemeWatch.getCurrentTheme() == Theme.WINTER) {
                    p.graphics.beginFill("#eee").drawCircle(0, 0, z + 2);
                } else {
                    p.graphics.beginFill("#aaf").drawRect(0, 0, 1, z * 5 + 1);
                }
                p.x = Math.random() * this.width;
                p.y = Math.random() * this.height;
                let x = z;
                if (i >= Weather.SNOW_AMOUNT) {
                    x += Weather.PARTICLE_LAYERS;
                }
                this.particleLayers[x].addChild(p);
            }
            for (let i = 0; i < this.particleLayers.length; i++) {
                let l = this.particleLayers[i];
                if (l) {
                    l.cache(0, 0, l.width, l.height);
                    l.y = -this.height;
                    if (i >= Weather.PARTICLE_LAYERS) {
                        l.y *= 2;
                    }
                }
            }
        }

        update(delta) {
            let sDelta = delta / 1000;

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
                                case 0: this.switchMode(WeatherMode.NONE); break;
                                case 1: this.switchMode(WeatherMode.SNOW_START); break;
                            }
                            break;
                        case WeatherMode.SNOW:
                            this.switchMode(WeatherMode.SNOW_STOP); break;
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
                    } else {
                        this.switchMode(WeatherMode.SNOW);
                    }
                    this.modeStartProgress++;
                }
            }

            if (this.mode != WeatherMode.NONE) {
                for (let i = 0; i < this.particleLayers.length; i++) {
                    let p = this.particleLayers[i];
                    if (p) {
                        p.y += Utils.floor(p.speed * sDelta);
                        p.x += Utils.floor(this.windSpeed * sDelta);
                        if (p.y > this.height) {
                            let partnerLayer;
                            if (i < Weather.PARTICLE_LAYERS) {
                                partnerLayer = this.particleLayers[i + Weather.PARTICLE_LAYERS];
                            } else {
                                partnerLayer = this.particleLayers[i - Weather.PARTICLE_LAYERS];
                            }
                            if (this.mode == WeatherMode.SNOW_STOP) {
                                this.removeChild(p);
                                this.particleLayers[i] = null;
                                if (this.children.length == 0)
                                    this.switchMode(WeatherMode.NONE);
                            } else {
                                p.y = partnerLayer.y - partnerLayer.height;
                                p.x = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}