namespace Lich {

    class Particle extends createjs.Shape {
        public speed = 0;
        public acc = 100;
    }

    enum WeatherMode {
        NONE,
        SNOW_START,
        SNOW,
        SNOW_STOP
    }

    export class Weather extends createjs.Container {

        private static SNOW_AMOUNT = 500;
        private static SPAWN_BATCH_MAX_AMOUNT = 50;
        private static SPAWN_BATCH_DELAY = 1000;
        private static MODE_DURATION = 60000;
        private static MAX_WIND = 10;

        private modeDurationTimer = 0;
        private spawnBatchDelayTimer = 0;
        private particles = new Array<Particle>();
        private windSpeed = 0;

        private mode = WeatherMode.NONE;

        constructor(public game: Game) {
            super();
            this.width = game.getCanvas().width;
            this.height = game.getCanvas().height;

            this.switchMode(WeatherMode.SNOW_START);
        }

        switchMode(mode: WeatherMode) {
            this.mode = mode;
            console.log("New mode: " + WeatherMode[mode]);
            if (mode == WeatherMode.NONE)
                this.particles = new Array<Particle>();
        }

        private initParticle(p: Particle) {
            let z = Math.random() * 3 + 1;
            if (ThemeWatch.getCurrentTheme() == Theme.WINTER) {
                p.graphics.clear().beginFill("#eee").drawCircle(0, 0, z);
                p.acc = z * 10;
            } else {
                p.graphics.clear().beginFill("#aaf").drawRect(0, 0, 1, z * 5);
                p.acc = z * 100 + 100;
            }
            p.x = Math.random() * this.width;
            p.y = -Math.random() * 200 - 200;
            p.speed = 0;
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
                    let toSpawn = Math.ceil(Math.random() * Weather.SPAWN_BATCH_MAX_AMOUNT);
                    if (this.particles.length + toSpawn >= Weather.SNOW_AMOUNT) {
                        toSpawn = Weather.SNOW_AMOUNT - this.particles.length;
                        this.switchMode(WeatherMode.SNOW);
                    }
                    for (let i = 0; i < toSpawn; i++) {
                        let p = new Particle();
                        this.initParticle(p);
                        this.particles.push(p);
                        this.addChild(p);
                    }
                }
            }

            if (this.mode != WeatherMode.NONE) {
                for (let i in this.particles) {
                    let p = this.particles[i];
                    if (p) {
                        p.y += Utils.floor(p.speed * sDelta + p.acc * Math.pow(sDelta, 2) / 2);
                        p.x += Utils.floor(this.windSpeed * sDelta);
                        p.speed += p.acc * sDelta;
                        if (p.y > this.height + 20) {
                            if (this.mode == WeatherMode.SNOW_STOP &&
                                // některé particles se ještě jednou prolétnou i když se už končí
                                Math.random() > 0.2) {
                                this.removeChild(p);
                                this.particles[i] = null;
                                if (this.children.length == 0)
                                    this.switchMode(WeatherMode.NONE);
                            } else {
                                this.initParticle(p);
                            }
                        }
                    }
                }
            }
        }
    }
}