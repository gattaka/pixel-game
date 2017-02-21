var Lich;
(function (Lich) {
    var Background = (function () {
        function Background(content, canvas) {
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.bgrSprites = [];
            this.bgrConts = [];
            this.dirtBackCont = new Lich.SheetContainer();
            this.dirtBackStartCont = new Lich.SheetContainer();
            this.clouds = [];
            // celkový posun
            this.offsetX = 0;
            this.offsetY = 0;
            var self = this;
            self.content = content;
            self.canvas = canvas;
            var skySprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_SKY_KEY);
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
            Background.BGR_ORDER.forEach(function (b, i) {
                var sampleSprite = Lich.Resources.getInstance().getBackgroundSprite(b);
                self.bgrSprites.push(sampleSprite);
                var cont = new Lich.SheetContainer();
                self.bgrConts.push(cont);
                var repeat = Math.floor(self.canvas.width / (sampleSprite.width - 1)) + 3;
                cont.x = 0;
                cont.y = Background.BGR_STARTS[i];
                cont.width = repeat * (sampleSprite.width - 1);
                self.content.addChild(cont);
                for (var j = 0; j < repeat; j++) {
                    var sprite = sampleSprite.clone();
                    // tohle clone prostě nezkopíruje
                    sprite.width = sampleSprite.width;
                    sprite.height = sampleSprite.height;
                    sprite.x = j * (sprite.width - 1);
                    sprite.y = 0;
                    cont.addChild(sprite);
                }
            });
            Background.CLOUDS_KEYS.forEach(function (c) {
                var sprite = Lich.Resources.getInstance().getBackgroundSprite(c);
                sprite["yCloudOffset"] = Math.random() * Background.CLOUDS_SPACE;
                sprite["xCloudOffset"] = Math.random() * self.canvas.width;
                self.clouds.push(sprite);
                self.content.addChild(sprite);
            });
            self.dirtBackStartSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_DIRT_BACK_START_KEY);
            self.dirtBackSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_DIRT_BACK_KEY);
            var dirtSpriteRepeatX = Math.floor(self.canvas.width / self.dirtBackSprite.width) + 3;
            var dirtSpriteRepeatY = Math.floor(self.canvas.height / self.dirtBackSprite.height) + 3;
            self.dirtBackCont.x = 0;
            self.dirtBackCont.y = Background.DIRT_START;
            self.dirtBackCont.width = dirtSpriteRepeatX * self.dirtBackSprite.width;
            self.dirtBackCont.height = dirtSpriteRepeatY * self.dirtBackSprite.height;
            self.content.addChild(self.dirtBackCont);
            self.dirtBackStartCont.x = 0;
            self.dirtBackStartCont.y = self.dirtBackCont.y - self.dirtBackCont.height;
            self.dirtBackStartCont.width = self.dirtBackCont.width;
            self.dirtBackStartCont.height = self.dirtBackStartSprite.height;
            self.content.addChild(self.dirtBackStartCont);
            for (var i = 0; i < dirtSpriteRepeatX; i++) {
                var startSprite = self.dirtBackStartSprite.clone();
                // tohle clone prostě nezkopíruje
                startSprite.width = self.dirtBackStartSprite.width;
                startSprite.height = self.dirtBackStartSprite.height;
                startSprite.x = i * startSprite.width;
                startSprite.y = 0;
                self.dirtBackStartCont.addChild(startSprite);
                for (var j = 0; j < dirtSpriteRepeatY; j++) {
                    var sprite = self.dirtBackSprite.clone();
                    // tohle clone prostě nezkopíruje
                    sprite.width = self.dirtBackSprite.width;
                    sprite.height = self.dirtBackSprite.height;
                    sprite.x = startSprite.x;
                    sprite.y = j * sprite.height;
                    self.dirtBackCont.addChild(sprite);
                }
            }
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_X, function (payload) {
                self.shift(payload.payload, 0);
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_Y, function (payload) {
                self.shift(0, payload.payload);
                return false;
            });
            console.log("background ready");
        }
        Background.prototype.shift = function (distanceX, distanceY) {
            var self = this;
            var canvas = self.canvas;
            self.offsetX += distanceX;
            self.offsetY += distanceY;
            self.bgrConts.forEach(function (part, i) {
                part.x = Math.floor(((self.offsetX * Background.BGR_MULT[i]) % self.bgrSprites[i].width) - self.bgrSprites[i].width);
                part.y = Math.floor(self.offsetY * Background.BGR_MULT[i] + Background.BGR_STARTS[i] * Background.BGR_MULT[i]);
            });
            // Dirt back
            self.dirtBackCont.x = Math.floor(((self.offsetX * Background.DIRT_MULT) % self.dirtBackSprite.width) - self.dirtBackSprite.width);
            var tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_MULT;
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
        ;
        Background.prototype.update = function (rawShift) {
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
        ;
        return Background;
    }());
    /*-----------*/
    /* CONSTANTS */
    /*-----------*/
    Background.CLOUDS_SPACE = 150;
    Background.CLOUDS_KEYS = [
        Lich.BackgroundKey.BGR_CLOUD1_KEY,
        Lich.BackgroundKey.BGR_CLOUD2_KEY,
        Lich.BackgroundKey.BGR_CLOUD3_KEY,
        Lich.BackgroundKey.BGR_CLOUD4_KEY,
        Lich.BackgroundKey.BGR_CLOUD5_KEY
    ];
    Background.BGR_ORDER = [
        Lich.BackgroundKey.BGR_FAR_MOUNTAIN_KEY,
        Lich.BackgroundKey.BGR_MOUNTAIN_KEY,
        Lich.BackgroundKey.BGR_WOODLAND1_KEY,
        Lich.BackgroundKey.BGR_WOODLAND2_KEY,
        Lich.BackgroundKey.BGR_WOODLAND3_KEY,
        Lich.BackgroundKey.BGR_WOODLAND4_KEY,
    ];
    Background.BGR_STARTS = [180, 600, 1200, 1200, 1220, 1240];
    Background.BGR_MULT = [.3, .4, .5, .55, .6, .7];
    Background.DIRT_MULT = .9;
    Background.DIRT_START = 1900;
    Lich.Background = Background;
})(Lich || (Lich = {}));
