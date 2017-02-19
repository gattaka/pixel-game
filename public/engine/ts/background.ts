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
        static BGR_STARTS = [50, 200, 400, 450, 560, 620];
        static BGR_DIVIDERS_X = [5, 4, 3.8, 3.6, 3.4, 3];
        static BGR_DIVIDERS_Y = [10, 8, 6, 5.5, 5, 4];

        static DIRT_DIVIDER_X = 1.1;
        static DIRT_DIVIDER_Y = 1.1;
        static DIRT_START = 1800;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        bgrImages = [];
        dirtBack = [];
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

            Background.BGR_ORDER.forEach((b: BackgroundKey) => {
                let sprite = Resources.getInstance().getBackgroundSprite(b);
                self.bgrImages.push(sprite);
            });

            // Background.CLOUDS_KEYS.forEach((c) => {
            //     self.clouds.push(Resources.getInstance().getBitmap(BackgroundKey[c]));
            // });

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

            self.bgrImages.forEach((entry, i) => {
                entry.y = Background.BGR_STARTS[i];
                entry.x = entry.width;
                self.content.addChild(entry);
            });

            // self.clouds.forEach(function (item) {
            //     item.y = Math.random() * Background.CLOUDS_SPACE;
            //     item.x = Math.random() * self.canvas.width;
            // });

            let dirtStartSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.DIRT_BACK_START_KEY);
            let dirtSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.DIRT_BACK_KEY);
            let dirtSpriteRepeatX = self.canvas.width / (dirtStartSprite.width - 1) + 2;
            let dirtSpriteRepeatY = self.canvas.height / (dirtStartSprite.height - 1) + 2;
            for (let i = 0; i < dirtSpriteRepeatX; i++) {
                let startSprite = dirtStartSprite.clone();
                // tohle clone prostě nezkopíruje
                startSprite.width = dirtStartSprite.width;
                startSprite.height = dirtStartSprite.height;
                startSprite.x = i * (startSprite.width - 1);
                startSprite.y = Background.DIRT_START;
                let arr = [];
                arr.push(startSprite);
                self.dirtBack.push(arr);
                self.content.addChild(startSprite);

                for (let j = 0; j < dirtSpriteRepeatY; j++) {
                    let sprite = dirtSprite.clone();
                    // tohle clone prostě nezkopíruje
                    sprite.width = dirtSprite.width;
                    sprite.height = dirtSprite.height;
                    sprite.x = startSprite.x;
                    sprite.y = startSprite.y + (startSprite.height - 1) + (j - 1) * (sprite.height - 1);
                    arr.push(sprite);
                    self.content.addChild(sprite);
                }
            }

            console.log("background ready");
        }


        shift(distanceX, distanceY) {
            var self = this;
            var canvas = self.canvas;

            self.offsetX += distanceX;
            self.offsetY += distanceY;

            self.bgrImages.forEach((part, i) => {
                let dividerX = Background.BGR_DIVIDERS_X[i];
                let dividerY = Background.BGR_DIVIDERS_Y[i];
                part.x += distanceX / dividerX;

                if (part.x > 0 || part.x < - part.width * 2)
                    part.x = -part.width;

                part.y += distanceY / dividerY;
            });

            let dirtBackStartSprite = self.dirtBack[0][0];
            dirtBackStartSprite.x = ((self.offsetX / Background.DIRT_DIVIDER_X) % (dirtBackStartSprite.width - 1)) - (dirtBackStartSprite.width - 1);
            let tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_DIVIDER_Y;
            dirtBackStartSprite.y = self.offsetY / Background.DIRT_DIVIDER_Y;
            dirtBackStartSprite.y += Background.DIRT_START * Background.DIRT_DIVIDER_Y;
            if (tillRepeatPointY < 0) {
                dirtBackStartSprite.y = dirtBackStartSprite.y % (dirtBackStartSprite.height - 1);
            }
            dirtBackStartSprite.y -= (dirtBackStartSprite.height - 1);

            // někde tady dát k y +4 ??
            for (let i = 0; i < self.dirtBack.length; i++) {
                let col = self.dirtBack[i];
                for (let j = 0; j < col.length; j++) {
                    let sprite = self.dirtBack[i][j];
                    sprite.x = dirtBackStartSprite.x + i * (dirtBackStartSprite.width - 1);
                    if (j > 0)
                        sprite.y = dirtBackStartSprite.y + (j - 1) * (sprite.height - 1) + (dirtBackStartSprite.height - 1);
                    else
                        sprite.y = dirtBackStartSprite.y;
                }
            }

            // Clouds
            for (var i = 0; i < self.clouds.length; i++) {
                var item = self.clouds[i];
                item.x += distanceX / (8 + (1 / (i + 1)));
                item.y += distanceY / 7;
                if (item.x + item.image.width <= 0) {
                    // Musí být -1, aby ho hnedka "nesežrala"
                    // kontrola druhého směru a nepřesunula mrak
                    // zpátky doleva
                    item.x = canvas.width - 1; // FIXME
                    item.y = Math.random() * Background.CLOUDS_SPACE;
                }
            }
        };

        handleTick(rawShift) {
            var self = this;
            var canvas = self.canvas;
            var shift = rawShift / 10;

            // Clouds
            for (var i = 0; i < self.clouds.length; i++) {
                var item = self.clouds[i];
                item.x += shift / (8 + (1 / (i + 1)));
                if (item.x >= canvas.width) {
                    item.x = -item.image.width;
                    item.y = Math.random() * Background.CLOUDS_SPACE;
                }
            }
        };

    }
}