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

        sky;
        bgrImages = [];
        bgrShapes = [];
        dirt_back;
        dirt_back_start;
        clouds = [];

        dirt_backImg;
        dirt_back_startImg;

        // celkový posun
        offsetX = 0;
        offsetY = 0;

        private canvas: HTMLCanvasElement;
        private content: createjs.SpriteContainer;

        constructor(public game: Game) {

            var self = this;

            self.content = game.getContent();
            self.canvas = game.getCanvas();

            // TODO 
            // Background.BGR_ORDER.forEach((b: BackgroundKey) => {
            //     let img = Resources.getInstance().getImage(BackgroundKey[b]);
            //     let shape = new createjs.Shape();
            //     shape.graphics.beginBitmapFill(img, "repeat-x").drawRect(0, 0, self.canvas.width + img.width * 2, img.height);
            //     self.bgrShapes.push(shape);
            //     self.bgrImages.push(img);
            // });

            // Background.CLOUDS_KEYS.forEach((c) => {
            //     self.clouds.push(Resources.getInstance().getBitmap(BackgroundKey[c]));
            // });

            // self.sky = new createjs.Shape();
            // self.content.addChild(self.sky);
            // self.sky.x = 0;
            // self.sky.y = 0;
            // self.sky.graphics.beginBitmapFill(Resources.getInstance().getImage(BackgroundKey[BackgroundKey.SKY_KEY]), 'repeat').drawRect(0, 0, self.canvas.width, 250);

            // self.bgrShapes.forEach((entry, i) => {
            //     self.content.addChild(entry);
            //     entry.y = Background.BGR_STARTS[i];
            //     entry.x = -self.bgrImages[i].width;
            // });

            // self.clouds.forEach(function (item) {
            //     item.y = Math.random() * Background.CLOUDS_SPACE;
            //     item.x = Math.random() * self.canvas.width;
            // });

            // self.dirt_back_startImg = Resources.getInstance().getImage(BackgroundKey[BackgroundKey.DIRT_BACK_START_KEY]);
            // self.dirt_back_start = new createjs.Shape();
            // self.dirt_back_start.graphics.beginBitmapFill(self.dirt_back_startImg, "repeat-x").drawRect(0, 0, self.canvas.width + self.dirt_back_startImg.width * 2, self.dirt_back_startImg.height);
            // self.dirt_back_start.x = 0;
            // self.dirt_back_start.y = Background.DIRT_START;
            // self.content.addChild(self.dirt_back_start);

            // self.dirt_backImg = Resources.getInstance().getImage(BackgroundKey[BackgroundKey.DIRTBACK_KEY]);
            // self.dirt_back = new createjs.Shape();
            // self.dirt_back.graphics.beginBitmapFill(self.dirt_backImg, "repeat").drawRect(0, 0, self.canvas.width + self.dirt_backImg.width * 2, self.canvas.height + self.dirt_backImg.height * 2);
            // self.dirt_back.x = 0;
            // self.dirt_back.y = self.dirt_back_start.y + self.dirt_back_startImg.height - 4;
            // self.content.addChild(self.dirt_back);

            console.log("background ready");
        }


        shift(distanceX, distanceY) {
            var self = this;
            var canvas = self.canvas;

            self.offsetX += distanceX;
            self.offsetY += distanceY;

            self.bgrShapes.forEach((part, i) => {
                let dividerX = Background.BGR_DIVIDERS_X[i];
                let dividerY = Background.BGR_DIVIDERS_Y[i];
                let image = self.bgrImages[i];
                part.x += distanceX / dividerX;

                if (part.x > 0 || part.x < - image.width * 2)
                    part.x = -image.width;

                part.y += distanceY / dividerY;
            });

            // Dirt back
            self.dirt_back.x = ((self.offsetX / Background.DIRT_DIVIDER_X) % self.dirt_backImg.width) - self.dirt_backImg.width;
            let tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_DIVIDER_Y;
            self.dirt_back.y = self.offsetY / Background.DIRT_DIVIDER_Y;
            self.dirt_back.y += Background.DIRT_START * Background.DIRT_DIVIDER_Y;
            if (tillRepeatPointY < 0) {
                self.dirt_back.y = self.dirt_back.y % self.dirt_backImg.height;
            }
            self.dirt_back.y -= self.dirt_backImg.height;

            // Start pozadí hlíny kopíruje hlavní část pozadí
            // navíc je přilepen před počátek hlavní části
            self.dirt_back_start.x = self.dirt_back.x;
            self.dirt_back_start.y = self.dirt_back.y - self.dirt_back_startImg.height + 4;

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