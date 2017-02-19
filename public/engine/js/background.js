var Lich;
(function (Lich) {
    var Background = (function () {
        function Background(game) {
            this.game = game;
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.bgrImages = [];
            this.dirtBack = [];
            this.clouds = [];
            // celkový posun
            this.offsetX = 0;
            this.offsetY = 0;
            var self = this;
            self.content = game.getContent();
            self.canvas = game.getCanvas();
            Background.BGR_ORDER.forEach(function (b) {
                var sprite = Lich.Resources.getInstance().getBackgroundSprite(b);
                self.bgrImages.push(sprite);
            });
            // Background.CLOUDS_KEYS.forEach((c) => {
            //     self.clouds.push(Resources.getInstance().getBitmap(BackgroundKey[c]));
            // });
            var skySprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.SKY_KEY);
            var skySpriteRepeat = self.canvas.width / skySprite.width + 1;
            for (var i = 0; i < skySpriteRepeat; i++) {
                var sprite = skySprite.clone();
                // tohle clone prostě nezkopíruje
                sprite.width = skySprite.width;
                sprite.height = skySprite.height;
                sprite.y = 0;
                sprite.x = i * sprite.width;
                self.content.addChild(sprite);
            }
            self.bgrImages.forEach(function (entry, i) {
                entry.y = Background.BGR_STARTS[i];
                entry.x = entry.width;
                self.content.addChild(entry);
            });
            // self.clouds.forEach(function (item) {
            //     item.y = Math.random() * Background.CLOUDS_SPACE;
            //     item.x = Math.random() * self.canvas.width;
            // });
            var dirtStartSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.DIRT_BACK_START_KEY);
            var dirtSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.DIRT_BACK_KEY);
            var dirtSpriteRepeatX = self.canvas.width / (dirtStartSprite.width - 1) + 2;
            var dirtSpriteRepeatY = self.canvas.height / (dirtStartSprite.height - 1) + 2;
            for (var i = 0; i < dirtSpriteRepeatX; i++) {
                var startSprite = dirtStartSprite.clone();
                // tohle clone prostě nezkopíruje
                startSprite.width = dirtStartSprite.width;
                startSprite.height = dirtStartSprite.height;
                startSprite.x = i * (startSprite.width - 1);
                startSprite.y = Background.DIRT_START;
                var arr = [];
                arr.push(startSprite);
                self.dirtBack.push(arr);
                self.content.addChild(startSprite);
                for (var j = 0; j < dirtSpriteRepeatY; j++) {
                    var sprite = dirtSprite.clone();
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
        Background.prototype.shift = function (distanceX, distanceY) {
            var self = this;
            var canvas = self.canvas;
            self.offsetX += distanceX;
            self.offsetY += distanceY;
            self.bgrImages.forEach(function (part, i) {
                var dividerX = Background.BGR_DIVIDERS_X[i];
                var dividerY = Background.BGR_DIVIDERS_Y[i];
                part.x += distanceX / dividerX;
                if (part.x > 0 || part.x < -part.width * 2)
                    part.x = -part.width;
                part.y += distanceY / dividerY;
            });
            var dirtBackStartSprite = self.dirtBack[0][0];
            dirtBackStartSprite.x = ((self.offsetX / Background.DIRT_DIVIDER_X) % (dirtBackStartSprite.width - 1)) - (dirtBackStartSprite.width - 1);
            var tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_DIVIDER_Y;
            dirtBackStartSprite.y = self.offsetY / Background.DIRT_DIVIDER_Y;
            dirtBackStartSprite.y += Background.DIRT_START * Background.DIRT_DIVIDER_Y;
            if (tillRepeatPointY < 0) {
                dirtBackStartSprite.y = dirtBackStartSprite.y % (dirtBackStartSprite.height - 1);
            }
            dirtBackStartSprite.y -= (dirtBackStartSprite.height - 1);
            // někde tady dát k y +4 ??
            for (var i_1 = 0; i_1 < self.dirtBack.length; i_1++) {
                var col = self.dirtBack[i_1];
                for (var j = 0; j < col.length; j++) {
                    var sprite = self.dirtBack[i_1][j];
                    sprite.x = dirtBackStartSprite.x + i_1 * (dirtBackStartSprite.width - 1);
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
