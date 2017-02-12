var Lich;
(function (Lich) {
    var Background = (function () {
        function Background(game) {
            this.game = game;
            this.bgrImages = [];
            this.bgrShapes = [];
            this.clouds = [];
            // celkový posun
            this.offsetX = 0;
            this.offsetY = 0;
            var self = this;
            self.content = game.getContent();
            self.canvas = game.getCanvas();
            Background.BGR_ORDER.forEach(function (b) {
                var img = Lich.Resources.getInstance().getImage(Lich.BackgroundKey[b]);
                var shape = new createjs.Shape();
                shape.graphics.beginBitmapFill(img, "repeat-x").drawRect(0, 0, self.canvas.width + img.width * 2, img.height);
                self.bgrShapes.push(shape);
                self.bgrImages.push(img);
            });
            Background.CLOUDS_KEYS.forEach(function (c) {
                self.clouds.push(Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[c]));
            });
            self.sky = new createjs.Shape();
            // TODO
            // self.content.addChild(self.sky);
            self.sky.x = 0;
            self.sky.y = 0;
            self.sky.graphics.beginBitmapFill(Lich.Resources.getInstance().getImage(Lich.BackgroundKey[Lich.BackgroundKey.SKY_KEY]), 'repeat').drawRect(0, 0, self.canvas.width, 250);
            self.bgrShapes.forEach(function (entry, i) {
                self.content.addChild(entry);
                entry.y = Background.BGR_STARTS[i];
                entry.x = -self.bgrImages[i].width;
            });
            self.clouds.forEach(function (item) {
                item.y = Math.random() * Background.CLOUDS_SPACE;
                item.x = Math.random() * self.canvas.width;
            });
            self.dirt_back_startImg = Lich.Resources.getInstance().getImage(Lich.BackgroundKey[Lich.BackgroundKey.DIRT_BACK_START_KEY]);
            self.dirt_back_start = new createjs.Shape();
            self.dirt_back_start.graphics.beginBitmapFill(self.dirt_back_startImg, "repeat-x").drawRect(0, 0, self.canvas.width + self.dirt_back_startImg.width * 2, self.dirt_back_startImg.height);
            self.dirt_back_start.x = 0;
            self.dirt_back_start.y = Background.DIRT_START;
            // TODO
            // self.content.addChild(self.dirt_back_start);
            self.dirt_backImg = Lich.Resources.getInstance().getImage(Lich.BackgroundKey[Lich.BackgroundKey.DIRTBACK_KEY]);
            self.dirt_back = new createjs.Shape();
            self.dirt_back.graphics.beginBitmapFill(self.dirt_backImg, "repeat").drawRect(0, 0, self.canvas.width + self.dirt_backImg.width * 2, self.canvas.height + self.dirt_backImg.height * 2);
            self.dirt_back.x = 0;
            self.dirt_back.y = self.dirt_back_start.y + self.dirt_back_startImg.height - 4;
            // TODO
            // self.content.addChild(self.dirt_back);
            console.log("background ready");
        }
        Background.prototype.shift = function (distanceX, distanceY) {
            var self = this;
            var canvas = self.canvas;
            self.offsetX += distanceX;
            self.offsetY += distanceY;
            self.bgrShapes.forEach(function (part, i) {
                var dividerX = Background.BGR_DIVIDERS_X[i];
                var dividerY = Background.BGR_DIVIDERS_Y[i];
                var image = self.bgrImages[i];
                part.x += distanceX / dividerX;
                if (part.x > 0 || part.x < -image.width * 2)
                    part.x = -image.width;
                part.y += distanceY / dividerY;
            });
            // Dirt back
            self.dirt_back.x = ((self.offsetX / Background.DIRT_DIVIDER_X) % self.dirt_backImg.width) - self.dirt_backImg.width;
            var tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_DIVIDER_Y;
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
        ;
        Background.prototype.handleTick = function (rawShift) {
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
        ;
        return Background;
    }());
    /*-----------*/
    /* CONSTANTS */
    /*-----------*/
    Background.CLOUDS_SPACE = 150;
    Background.CLOUDS_KEYS = [
        Lich.BackgroundKey.CLOUD1_KEY,
        Lich.BackgroundKey.CLOUD2_KEY,
        Lich.BackgroundKey.CLOUD3_KEY,
        Lich.BackgroundKey.CLOUD4_KEY,
        Lich.BackgroundKey.CLOUD5_KEY
    ];
    Background.BGR_ORDER = [
        Lich.BackgroundKey.FAR_MOUNTAIN_KEY,
        Lich.BackgroundKey.MOUNTAIN_KEY,
        Lich.BackgroundKey.WOODLAND1_KEY,
        Lich.BackgroundKey.WOODLAND2_KEY,
        Lich.BackgroundKey.WOODLAND3_KEY,
        Lich.BackgroundKey.WOODLAND4_KEY,
    ];
    Background.BGR_STARTS = [50, 200, 400, 450, 560, 620];
    Background.BGR_DIVIDERS_X = [5, 4, 3.8, 3.6, 3.4, 3];
    Background.BGR_DIVIDERS_Y = [10, 8, 6, 5.5, 5, 4];
    Background.DIRT_DIVIDER_X = 1.1;
    Background.DIRT_DIVIDER_Y = 1.1;
    Background.DIRT_START = 1800;
    Lich.Background = Background;
})(Lich || (Lich = {}));
