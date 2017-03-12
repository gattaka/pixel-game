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

        bgrSprites = new Array<BackgroundSprite>();
        dirtBackSprite: BackgroundSprite;
        dirtBackStartSprite: BackgroundSprite;
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

            let skySprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_SKY_KEY, cw);
            self.addChild(skySprite);

            Background.BGR_ORDER.forEach((b: BackgroundKey, i) => {
                let sprite = Resources.getInstance().getBackgroundSprite(b, cw);
                self.bgrSprites.push(sprite);
                self.addChild(sprite);
            });

            // Background.CLOUDS_KEYS.forEach((c) => {
            //     let sprite = Resources.getInstance().getBackgroundSprite(c);
            //     sprite["yCloudOffset"] = Math.random() * Background.CLOUDS_SPACE;
            //     sprite["xCloudOffset"] = Math.random() * self.canvas.width;
            //     self.clouds.push(sprite);
            //     self.content.addChild(sprite);
            // });

            self.dirtBackSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_DIRT_BACK_KEY, cw, ch);
            self.addChild(self.dirtBackSprite);

            self.dirtBackStartSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_DIRT_BACK_START_KEY, cw);
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

            console.log("background ready");
        }


        private shift() {
            var self = this;

            self.bgrSprites.forEach((part: BackgroundSprite, i) => {
                part.tilePosition.x = Utils.floor((self.offsetX * Background.BGR_MULT[i]) % self.bgrSprites[i].originalWidth);
                part.y = Utils.floor(self.offsetY * Background.BGR_MULT[i] + Background.BGR_STARTS[i] * Background.BGR_MULT[i]);
            });

            // Dirt back
            self.dirtBackSprite.tilePosition.x = Utils.floor(((self.offsetX * Background.DIRT_MULT) % self.dirtBackSprite.originalWidth) - self.dirtBackSprite.originalWidth);
            let tillRepeatPointY = Utils.floor(self.offsetY + Background.DIRT_START * Background.DIRT_MULT);
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