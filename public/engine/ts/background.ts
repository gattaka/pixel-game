namespace Lich {
    export class Background extends PIXI.Container {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        static CLOUDS_SPACE = 150;

        static CLOUDS_KEYS = [
            BackgroundKey.BGR_CLOUD1_KEY,
            BackgroundKey.BGR_CLOUD2_KEY,
            BackgroundKey.BGR_CLOUD3_KEY,
            BackgroundKey.BGR_CLOUD4_KEY,
            BackgroundKey.BGR_CLOUD5_KEY
        ];
        static BGR_ORDER = [
            BackgroundKey.BGR_FAR_MOUNTAIN_KEY,
            BackgroundKey.BGR_MOUNTAIN_KEY,
            BackgroundKey.BGR_WOODLAND1_KEY,
            BackgroundKey.BGR_WOODLAND2_KEY,
            BackgroundKey.BGR_WOODLAND3_KEY,
            BackgroundKey.BGR_WOODLAND4_KEY,
        ];
        static BGR_STARTS = [180, 600, 1200, 1200, 1220, 1240];
        static BGR_MULT = [.3, .4, .5, .55, .6, .7];

        static DIRT_MULT = .9;
        static DIRT_START = 1900;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        bgrSprites = [];
        bgrConts = [];
        dirtBackSprite;
        dirtBackStartSprite;
        clouds = [];

        // celkový posun
        offsetX = 0;
        offsetY = 0;

        constructor(private canvas: HTMLCanvasElement) {
            super();
            var self = this;

            self.canvas = canvas;

            let skySprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_SKY_KEY);
            skySprite.fixedWidth = self.canvas.width;

            Background.BGR_ORDER.forEach((b: BackgroundKey, i) => {
                let sprite = Resources.getInstance().getBackgroundSprite(b);
                sprite.fixedWidth = self.canvas.width;
                self.bgrSprites.push(sprite);
            });

            // Background.CLOUDS_KEYS.forEach((c) => {
            //     let sprite = Resources.getInstance().getBackgroundSprite(c);
            //     sprite["yCloudOffset"] = Math.random() * Background.CLOUDS_SPACE;
            //     sprite["xCloudOffset"] = Math.random() * self.canvas.width;
            //     self.clouds.push(sprite);
            //     self.content.addChild(sprite);
            // });

            self.dirtBackStartSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_DIRT_BACK_START_KEY);
            self.dirtBackSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_DIRT_BACK_KEY);
            self.dirtBackStartSprite.width = self.canvas.width;
            self.dirtBackSprite.width = self.canvas.width;

            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_X, (payload: NumberEventPayload) => {
                self.offsetX = payload.payload;
                self.shift();
                return false;
            });
            EventBus.getInstance().registerConsumer(EventType.MAP_SHIFT_Y, (payload: NumberEventPayload) => {
                self.offsetY = payload.payload;
                self.shift();
                return false;
            });

            console.log("background ready");
        }


        private shift() {
            var self = this;
            var canvas = self.canvas;

            self.bgrConts.forEach((part: PIXI.extras.TilingSprite, i) => {
                part.tilePosition.x = Math.floor(((self.offsetX * Background.BGR_MULT[i]) % self.bgrSprites[i].width) - self.bgrSprites[i].width);
                part.y = Math.floor(self.offsetY * Background.BGR_MULT[i] + Background.BGR_STARTS[i] * Background.BGR_MULT[i]);
            });

            // Dirt back
            self.dirtBackSprite.tilePosition.x = Math.floor(((self.offsetX * Background.DIRT_MULT) % self.dirtBackSprite.width) - self.dirtBackSprite.width);
            let tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_MULT;
            self.dirtBackSprite.y = self.offsetY * Background.DIRT_MULT + Background.DIRT_START * Background.DIRT_MULT;
            if (tillRepeatPointY < 0) {
                self.dirtBackSprite.y = self.dirtBackSprite.y % self.dirtBackSprite.height;
            }
            self.dirtBackSprite.y = Math.floor(self.dirtBackSprite.y - self.dirtBackSprite.height);

            // Start pozadí hlíny kopíruje hlavní část pozadí
            // navíc je přilepen před počátek hlavní části
            self.dirtBackStartSprite.tilePosition.x = self.dirtBackSprite.tilePosition.x;
            self.dirtBackStartSprite.y = self.dirtBackSprite.y - self.dirtBackStartSprite.height;

            // Clouds
            // for (var i = 0; i < self.clouds.length; i++) {
            //     var item = self.clouds[i];
            //     let changeX = Math.floor(distanceX / (8 + (1 / (i + 1))));
            //     item.x += changeX != 0 ? changeX : Utils.sign(distanceX); 
            //     let changeY = Math.floor( distanceY / 7)
            //     item.y += changeY != 0 ? changeY : Utils.sign(distanceY); ;
            //     if (item.x + item.width <= 0) {
            //         // Musí být -1, aby ho hnedka "nesežrala"
            //         // kontrola druhého směru a nepřesunula mrak
            //         // zpátky doleva
            //         item.x = canvas.width - 1; // FIXME
            //         item.y = Math.floor(Math.random() * Background.CLOUDS_SPACE);
            //     }
            // }
        };

        update(rawShift) {
            var self = this;
            var canvas = self.canvas;
            var shift = rawShift / 10;

            // Clouds
            // for (var i = 0; i < self.clouds.length; i++) {
            //     var item = self.clouds[i];
            //     let changeX = Math.floor(shift / (8 + (1 / (i + 1))));
            //     item.x += changeX != 0 ? changeX : Utils.sign(shift); 
            //     if (item.x >= canvas.width) {
            //         item.x = -item.width;
            //         item.y = Math.floor(Math.random() * Background.CLOUDS_SPACE);
            //     }
            // }
        };

    }
}