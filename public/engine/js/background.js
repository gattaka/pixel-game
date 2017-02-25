var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Background = (function (_super) {
        __extends(Background, _super);
        function Background(canvas) {
            var _this = _super.call(this) || this;
            _this.canvas = canvas;
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            _this.bgrSprites = [];
            _this.bgrConts = [];
            _this.clouds = [];
            // celkový posun
            _this.offsetX = 0;
            _this.offsetY = 0;
            var self = _this;
            self.canvas = canvas;
            var skySprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_SKY_KEY);
            skySprite.width = self.canvas.width;
            Background.BGR_ORDER.forEach(function (b, i) {
                var sprite = Lich.Resources.getInstance().getBackgroundSprite(b);
                sprite.width = self.canvas.width;
                self.bgrSprites.push(sprite);
            });
            // Background.CLOUDS_KEYS.forEach((c) => {
            //     let sprite = Resources.getInstance().getBackgroundSprite(c);
            //     sprite["yCloudOffset"] = Math.random() * Background.CLOUDS_SPACE;
            //     sprite["xCloudOffset"] = Math.random() * self.canvas.width;
            //     self.clouds.push(sprite);
            //     self.content.addChild(sprite);
            // });
            self.dirtBackStartSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_DIRT_BACK_START_KEY);
            self.dirtBackSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_DIRT_BACK_KEY);
            self.dirtBackStartSprite.width = self.canvas.width;
            self.dirtBackSprite.width = self.canvas.width;
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_X, function (payload) {
                self.offsetX = payload.payload;
                self.shift();
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.MAP_SHIFT_Y, function (payload) {
                self.offsetY = payload.payload;
                self.shift();
                return false;
            });
            console.log("background ready");
            return _this;
        }
        Background.prototype.shift = function () {
            var self = this;
            var canvas = self.canvas;
            self.bgrConts.forEach(function (part, i) {
                part.tilePosition.x = Math.floor(((self.offsetX * Background.BGR_MULT[i]) % self.bgrSprites[i].width) - self.bgrSprites[i].width);
                part.y = Math.floor(self.offsetY * Background.BGR_MULT[i] + Background.BGR_STARTS[i] * Background.BGR_MULT[i]);
            });
            // Dirt back
            self.dirtBackSprite.tilePosition.x = Math.floor(((self.offsetX * Background.DIRT_MULT) % self.dirtBackSprite.width) - self.dirtBackSprite.width);
            var tillRepeatPointY = self.offsetY + Background.DIRT_START * Background.DIRT_MULT;
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
    }(PIXI.Container));
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
