namespace Lich {
    export class Background {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        static CLOUDS_SPACE = 150;

        static CLOUDS_KEYS = [
            BackgroundKey.CLOUD1_KEY,
            BackgroundKey.CLOUD2_KEY,
            BackgroundKey.CLOUD3_KEY,
            BackgroundKey.CLOUD4_KEY,
            BackgroundKey.CLOUD5_KEY
        ];
        static BGR_ORDER = [
            BackgroundKey.FAR_MOUNTAIN_KEY,
            BackgroundKey.MOUNTAIN_KEY,
            BackgroundKey.WOODLAND1_KEY,
            BackgroundKey.WOODLAND2_KEY,
            BackgroundKey.WOODLAND3_KEY,
            BackgroundKey.WOODLAND4_KEY,
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
        dirtBackCont = new SheetContainer();
        dirtBackStartCont = new SheetContainer();
        dirtBackSprite;
        dirtBackStartSprite;
        clouds = [];

        // celkový posun
        offsetX = 0;
        offsetY = 0;

        private canvas: HTMLCanvasElement;
        private content: SheetContainer;

        constructor(public game: Game) {

            var self = this;

            self.content = game.getContent();
            self.canvas = game.getCanvas();

            let skySprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.SKY_KEY);
            let skySpriteRepeat = self.canvas.width / skySprite.width + 1;
            for (let i = 0; i < skySpriteRepeat; i++) {
                let sprite = skySprite.clone();
                // tohle clone prostě nezkopíruje
                sprite.width = skySprite.width;
                sprite.height = skySprite.height;
                sprite.y = 0;
                sprite.x = i * sprite.width;
                self.content.addChild(sprite);
            }

            Background.BGR_ORDER.forEach((b: BackgroundKey, i) => {
                let sampleSprite = Resources.getInstance().getBackgroundSprite(b);
                self.bgrSprites.push(sampleSprite);
                let cont = new SheetContainer();
                self.bgrConts.push(cont);

                let repeat = Math.floor(self.canvas.width / (sampleSprite.width - 1)) + 3;
                cont.x = 0;
                cont.y = Background.BGR_STARTS[i];
                cont.width = repeat * (sampleSprite.width - 1);
                self.content.addChild(cont);

                for (let j = 0; j < repeat; j++) {
                    let sprite = sampleSprite.clone();
                    // tohle clone prostě nezkopíruje
                    sprite.width = sampleSprite.width;
                    sprite.height = sampleSprite.height;
                    sprite.x = j * (sprite.width - 1);
                    sprite.y = 0;
                    cont.addChild(sprite);
                }
            });

            Background.CLOUDS_KEYS.forEach((c) => {
                let sprite = Resources.getInstance().getBackgroundSprite(c);
                sprite["yCloudOffset"] = Math.random() * Background.CLOUDS_SPACE;
                sprite["xCloudOffset"] = Math.random() * self.canvas.width;
                self.clouds.push(sprite);
                self.content.addChild(sprite);
            });

            self.dirtBackStartSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.DIRT_BACK_START_KEY);
            self.dirtBackSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.DIRT_BACK_KEY);
            let dirtSpriteRepeatX = Math.floor(self.canvas.width / self.dirtBackSprite.width) + 3;
            let dirtSpriteRepeatY = Math.floor(self.canvas.height / self.dirtBackSprite.height) + 3;
            self.dirtBackCont.x = 0;
            self.dirtBackCont.y = Background.DIRT_START;
            self.dirtBackCont.width = dirtSpriteRepeatX * self.dirtBackSprite.width;
            self.dirtBackCont.height = dirtSpriteRepeatY * self.dirtBackSprite.height;
            self.content.addChild(self.dirtBackCont);
            self.dirtBackStartCont.x = 0;
            self.dirtBackStartCont.y = self.dirtBackCont.y - self.dirtBackCont.height;
            self.dirtBackStartCont.width = self.dirtBackCont.width
            self.dirtBackStartCont.height = self.dirtBackStartSprite.height;
            self.content.addChild(self.dirtBackStartCont);
            for (let i = 0; i < dirtSpriteRepeatX; i++) {
                let startSprite = self.dirtBackStartSprite.clone();
                // tohle clone prostě nezkopíruje
                startSprite.width = self.dirtBackStartSprite.width;
                startSprite.height = self.dirtBackStartSprite.height;
                startSprite.x = i * startSprite.width;
                startSprite.y = 0;
                self.dirtBackStartCont.addChild(startSprite);

                for (let j = 0; j < dirtSpriteRepeatY; j++) {
                    let sprite = self.dirtBackSprite.clone();
                    // tohle clone prostě nezkopíruje
                    sprite.width = self.dirtBackSprite.width;
                    sprite.height = self.dirtBackSprite.height;
                    sprite.x = startSprite.x;
                    sprite.y = j * sprite.height;
                    self.dirtBackCont.addChild(sprite);
                }
            }

            console.log("background ready");
        }


        shift(distanceX, distanceY) {
            var self = this;
            var canvas = self.canvas;

            self.offsetX += distanceX;
            self.offsetY += distanceY;

            self.bgrConts.forEach((part, i) => {
                part.x = Math.floor(((self.offsetX * Background.BGR_MULT[i]) % self.bgrSprites[i].width) - self.bgrSprites[i].width);
                part.y = Math.floor(self.offsetY * Background.BGR_MULT[i] + Background.BGR_STARTS[i] * Background.BGR_MULT[i]);
            });

            // Dirt back
            self.dirtBackCont.x = Math.floor(((self.offsetX * Background.DIRT_MULT) % self.dirtBackSprite.width) - self.dirtBackSprite.width);
            let tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_MULT;
            self.dirtBackCont.y = self.offsetY * Background.DIRT_MULT + Background.DIRT_START * Background.DIRT_MULT;
            if (tillRepeatPointY < 0) {
                self.dirtBackCont.y = self.dirtBackCont.y % self.dirtBackSprite.height;
            }
            self.dirtBackCont.y = Math.floor(self.dirtBackCont.y - self.dirtBackSprite.height);

            // Start pozadí hlíny kopíruje hlavní část pozadí
            // navíc je přilepen před počátek hlavní části
            self.dirtBackStartCont.x = self.dirtBackCont.x;
            self.dirtBackStartCont.y = self.dirtBackCont.y - self.dirtBackStartCont.height;

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

        handleTick(rawShift) {
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