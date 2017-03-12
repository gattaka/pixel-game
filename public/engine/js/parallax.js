var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var Parallax = (function (_super) {
        __extends(Parallax, _super);
        function Parallax() {
            var _this = _super.call(this) || this;
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            _this.sprites = new Array();
            _this.clouds = [];
            // celkový posun
            _this.offsetX = 0;
            _this.offsetY = 0;
            var self = _this;
            var cw = Lich.Game.getInstance().getSceneWidth();
            var ch = Lich.Game.getInstance().getSceneHeight();
            self.fixedWidth = ch;
            self.fixedHeight = cw;
            var skySprite = Lich.Resources.getInstance().getParallaxSprite(Lich.ParallaxKey.PRLX_SKY_KEY, cw);
            self.addChild(skySprite);
            Parallax.BGR_ORDER.forEach(function (b, i) {
                var sprite = Lich.Resources.getInstance().getParallaxSprite(b, cw);
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
            self.dirtBackSprite = Lich.Resources.getInstance().getParallaxSprite(Lich.ParallaxKey.PRLX_DIRT_BACK_KEY, cw, ch);
            self.addChild(self.dirtBackSprite);
            self.dirtBackStartSprite = Lich.Resources.getInstance().getParallaxSprite(Lich.ParallaxKey.PRLX_BGR_DIRT_BACK_START_KEY, cw);
            self.addChild(self.dirtBackStartSprite);
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
            console.log("parallax ready");
            return _this;
        }
        Parallax.prototype.shift = function () {
            var self = this;
            self.sprites.forEach(function (part, i) {
                part.tilePosition.x = Lich.Utils.floor((self.offsetX * Parallax.MULT[i]) % self.sprites[i].originalWidth);
                part.y = Lich.Utils.floor(self.offsetY * Parallax.MULT[i] + Parallax.STARTS[i] * Parallax.MULT[i]);
            });
            // Dirt back
            self.dirtBackSprite.tilePosition.x = Lich.Utils.floor(((self.offsetX * Parallax.DIRT_MULT) % self.dirtBackSprite.originalWidth) - self.dirtBackSprite.originalWidth);
            var tillRepeatPointY = Lich.Utils.floor((self.offsetY + Parallax.DIRT_START) * Parallax.DIRT_MULT);
            if (tillRepeatPointY < 0) {
                self.dirtBackSprite.y = 0;
                self.dirtBackSprite.tilePosition.y = Lich.Utils.floor(tillRepeatPointY % self.dirtBackSprite.originalHeight);
            }
            else {
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
        ;
        Parallax.prototype.update = function (rawShift) {
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
        ;
        return Parallax;
    }(PIXI.Container));
    /*-----------*/
    /* CONSTANTS */
    /*-----------*/
    Parallax.CLOUDS_SPACE = 150;
    Parallax.CLOUDS_KEYS = [
        Lich.ParallaxKey.PRLX_CLOUD1_KEY,
        Lich.ParallaxKey.PRLX_CLOUD2_KEY,
        Lich.ParallaxKey.PRLX_CLOUD3_KEY,
        Lich.ParallaxKey.PRLX_CLOUD4_KEY,
        Lich.ParallaxKey.PRLX_CLOUD5_KEY
    ];
    Parallax.BGR_ORDER = [
        // ParallaxKey.PRLX_FAR_MOUNTAIN_KEY,
        Lich.ParallaxKey.PRLX_MOUNTAIN_KEY,
        Lich.ParallaxKey.PRLX_WOODLAND1_KEY,
        Lich.ParallaxKey.PRLX_WOODLAND2_KEY,
        Lich.ParallaxKey.PRLX_WOODLAND3_KEY,
    ];
    // static STARTS = [180, 600, 1200, 1200, 1220, 1240];
    // static MULT = [.3, .4, .5, .55, .6, .7];
    Parallax.STARTS = [1200, 1300, 1310, 1320];
    Parallax.MULT = [.3, .4, .5, .6];
    Parallax.DIRT_MULT = .9;
    Parallax.DIRT_START = 1320;
    Lich.Parallax = Parallax;
})(Lich || (Lich = {}));
