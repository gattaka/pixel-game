namespace Lich {

    class ParticleLayer extends PIXI.Container {
        constructor(public speed: number) {
            super();
        }
    }

    enum WeatherMode {
        NONE,
        SNOW_RAIN_START,
        SNOW_RAIN,
        SNOW_RAIN_STOP
    }

    export class Weather extends PIXI.Container {

        private static MAX_WIND = 10;
        private static SNOW_RAIN_AMOUNT = 500;
        private static SPAWN_BATCH_DELAY = 10000;
        private static PARTICLE_LAYERS = 3;
        private static MODE_DURATION = 60000;

        private static GIFT_SPAWN_PROP = 1000; // 1/1000
        private static SNOWFLAKE_SPAWN_PROP = 1000; // 1/1000
        private static SNOWFLAKE_SPAWN_INTERVAL = 5000;

        private static LOVELETTER_SPAWN_PROP = 10000; // 1/10000
        private static LOVELETTER_SPAWN_INTERVAL = 10000;

        private snowflakeTryTimer = 0;
        private loveletterTryTimer = 0;

        private modeStartProgress = 0;
        private modeDurationTimer = 0;
        private spawnBatchDelayTimer = 0;
        private particleLayers = new Array<ParticleLayer>();
        private windSpeed = 0;

        private lightScreen = new PIXI.Graphics();

        private mode = WeatherMode.NONE;

        constructor(public game: Game) {
            super();
            this.fixedWidth = game.getSceneWidth();
            this.fixedHeight = game.getSceneHeight();
            // TODO
            // this.addChild(this.lightScreen);
        }

        updateLight(r: number, g: number, b: number, a: number) {
            this.lightScreen.clear().beginFill((r << 16) + (g << 8) + b, a).drawRect(0, 0, this.fixedWidth, this.fixedHeight);
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
                    acc = ((l % Weather.PARTICLE_LAYERS) + 1) * 300;
                }
                let layer = new ParticleLayer(acc);
                layer.fixedWidth = this.fixedWidth;
                layer.fixedHeight = this.fixedHeight;
                this.particleLayers.push(layer);
            }
            for (let i = 0; i < Weather.SNOW_RAIN_AMOUNT * 2; i++) {
                let p = new PIXI.Graphics();
                let z = Math.floor(Math.random() * Weather.PARTICLE_LAYERS);
                if (ThemeWatch.getCurrentTheme() == Theme.WINTER) {
                    p.beginFill(0xfafafa, 0.5).drawCircle(0, 0, z + 2);
                } else {
                    p.beginFill(0xa0a0f0).drawRect(0, 0, 1, z * 5 + 1);
                }
                p.x = Math.random() * this.fixedWidth;
                p.y = Math.random() * this.fixedHeight;
                let x = z;
                if (i >= Weather.SNOW_RAIN_AMOUNT) {
                    x += Weather.PARTICLE_LAYERS;
                }
                this.particleLayers[x].addChild(p);
            }
            for (let i = 0; i < this.particleLayers.length; i++) {
                let l = this.particleLayers[i];
                if (l) {
                    // l.cache(0, 0, l.width, l.height);
                    l.y = -this.fixedHeight;
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

            if (this.mode == WeatherMode.SNOW_RAIN && ThemeWatch.getCurrentTheme() == Theme.WINTER) {
                this.snowflakeTryTimer += delta;
                let world = this.game.getWorld();
                for (let i = 0; i < this.snowflakeTryTimer / Weather.SNOWFLAKE_SPAWN_INTERVAL; i++) {
                    this.snowflakeTryTimer = 0;
                    if (Utils.prop(Weather.SNOWFLAKE_SPAWN_PROP))
                        world.spawnObject(new DugObjDefinition(InventoryKey.INV_SNOWFLAKE_KEY, 1), Math.floor(Math.random() * world.tilesMap.width), 0);
                    if (Utils.prop(Weather.GIFT_SPAWN_PROP)) {
                        let gift;
                        switch (Math.floor(Math.random() * 3)) {
                            case 0: gift = InventoryKey.INV_GIFT1_KEY; break;
                            case 1: gift = InventoryKey.INV_GIFT2_KEY; break;
                            case 2: gift = InventoryKey.INV_GIFT3_KEY; break;
                        }
                        world.spawnObject(new DugObjDefinition(gift, 1), Math.floor(Math.random() * world.tilesMap.width), 0);
                    }
                }
            }

            if (ThemeWatch.getCurrentTheme() == Theme.VALENTINE) {
                this.loveletterTryTimer += delta;
                let world = this.game.getWorld();
                for (let i = 0; i < this.loveletterTryTimer / Weather.LOVELETTER_SPAWN_INTERVAL; i++) {
                    this.loveletterTryTimer = 0;
                    if (Utils.prop(Weather.LOVELETTER_SPAWN_PROP))
                        world.spawnObject(new DugObjDefinition(InventoryKey.INV_LOVELETTER_KEY, 1), Math.floor(Math.random() * world.tilesMap.width), 0);
                }
            }

            if (this.mode == WeatherMode.SNOW_RAIN || this.mode == WeatherMode.NONE) {
                this.modeDurationTimer += delta;
                if (this.modeDurationTimer > Weather.MODE_DURATION) {
                    this.modeDurationTimer = 0;
                    switch (this.mode) {
                        case WeatherMode.NONE:
                            switch (Math.floor(Math.random() * 2)) {
                                case 0: this.switchMode(WeatherMode.NONE); break;
                                case 1: this.switchMode(WeatherMode.SNOW_RAIN_START); break;
                            }
                            break;
                        case WeatherMode.SNOW_RAIN:
                            this.switchMode(WeatherMode.SNOW_RAIN_STOP); break;
                    }
                }
            }

            if (this.mode == WeatherMode.SNOW_RAIN_START) {
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
                        this.switchMode(WeatherMode.SNOW_RAIN);
                    }
                    this.modeStartProgress++;
                }
            }

            if (this.mode != WeatherMode.NONE) {
                for (let i = 0; i < this.particleLayers.length; i++) {
                    let p = this.particleLayers[i];
                    if (p) {
                        if (!p.parent)
                            continue;
                        p.y += Utils.floor(p.speed * sDelta);
                        p.x += Utils.floor(this.windSpeed * sDelta);
                        if (p.y > this.fixedHeight) {
                            let partnerLayer;
                            if (i < Weather.PARTICLE_LAYERS) {
                                partnerLayer = this.particleLayers[i + Weather.PARTICLE_LAYERS];
                            } else {
                                partnerLayer = this.particleLayers[i - Weather.PARTICLE_LAYERS];
                            }
                            if (this.mode == WeatherMode.SNOW_RAIN_STOP) {
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