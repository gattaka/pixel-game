namespace Lich {
    export class Parallax extends PIXI.Container {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        static CLOUDS_SPACE = 150;

        static CLOUDS_KEYS = [
            ParallaxKey.PRLX_CLOUD1_KEY,
            ParallaxKey.PRLX_CLOUD2_KEY,
            ParallaxKey.PRLX_CLOUD3_KEY,
            ParallaxKey.PRLX_CLOUD4_KEY,
            ParallaxKey.PRLX_CLOUD5_KEY
        ];
        static BGR_ORDER = [
            ParallaxKey.PRLX_FAR_MOUNTAIN_KEY,
            ParallaxKey.PRLX_MOUNTAIN_KEY,
            ParallaxKey.PRLX_WOODLAND1_KEY,
            ParallaxKey.PRLX_WOODLAND2_KEY,
            ParallaxKey.PRLX_WOODLAND3_KEY,
            ParallaxKey.PRLX_WOODLAND4_KEY,
        ];
        static STARTS = [180, 600, 1200, 1200, 1220, 1240];
        static MULT = [.3, .4, .5, .55, .6, .7];

        static DIRT_MULT = .9;
        static DIRT_START = 1900;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        sprites = new Array<ParallaxSprite>();
        dirtBackSprite: ParallaxSprite;
        dirtBackStartSprite: ParallaxSprite;
        clouds = [];

        // celkový posun
        offsetX = 0;
        offsetY = 0;

        constructor() {
            super();
            var self = this;

            let cw = Game.getInstance().getSceneWidth();
            let ch =  Game.getInstance().getSceneHeight();
            self.fixedWidth = ch;
            self.fixedHeight = cw;

            let skySprite = Resources.getInstance().getParallaxSprite(ParallaxKey.PRLX_SKY_KEY, cw);
            self.addChild(skySprite);

            Parallax.BGR_ORDER.forEach((b: ParallaxKey, i) => {
                let sprite = Resources.getInstance().getParallaxSprite(b, cw);
                self.sprites.push(sprite);
                self.addChild(sprite);
            });

            // Background.CLOUDS_KEYS.forEach((c) => {
            //     let sprite = Resources.getInstance().getBackgroundSprite(c);
            //     sprite["yCloudOffset"] = Math.random() * Background.CLOUDS_SPACE;
            //     sprite["xCloudOffset"] = Math.random() * self.canvas.width;
            //     self.clouds.push(sprite);
            //     self.content.addChild(sprite);
            // });

            self.dirtBackSprite = Resources.getInstance().getParallaxSprite(ParallaxKey.PRLX_DIRT_BACK_KEY, cw, ch);
            self.addChild(self.dirtBackSprite);

            self.dirtBackStartSprite = Resources.getInstance().getParallaxSprite(ParallaxKey.PRLX_BGR_DIRT_BACK_START_KEY, cw);
            self.addChild(self.dirtBackStartSprite);

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

            console.log("parallax ready");
        }


        private shift() {
            var self = this;

            self.sprites.forEach((part: ParallaxSprite, i) => {
                part.tilePosition.x = Utils.floor((self.offsetX * Parallax.MULT[i]) % self.sprites[i].originalWidth);
                part.y = Utils.floor(self.offsetY * Parallax.MULT[i] + Parallax.STARTS[i] * Parallax.MULT[i]);
            });

            // Dirt back
            self.dirtBackSprite.tilePosition.x = Utils.floor(((self.offsetX * Parallax.DIRT_MULT) % self.dirtBackSprite.originalWidth) - self.dirtBackSprite.originalWidth);
            let tillRepeatPointY = Utils.floor((self.offsetY + Parallax.DIRT_START) * Parallax.DIRT_MULT);
            if (tillRepeatPointY < 0) {
                self.dirtBackSprite.y = 0;
                self.dirtBackSprite.tilePosition.y = Utils.floor(tillRepeatPointY % self.dirtBackSprite.originalHeight);
            } else {
                self.dirtBackSprite.y = tillRepeatPointY;
            }

            // Start pozadí hlíny kopíruje hlavní část pozadí
            // navíc je přilepen před počátek hlavní části
            self.dirtBackStartSprite.tilePosition.x = self.dirtBackSprite.tilePosition.x;
            self.dirtBackStartSprite.y = self.dirtBackSprite.y - self.dirtBackStartSprite.originalHeight;

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