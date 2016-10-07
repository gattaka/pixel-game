var Lich;
(function (Lich) {
    var Background = (function () {
        function Background(game) {
            this.game = game;
            this.clouds = [];
            // celkový posun
            this.offsetX = 0;
            this.offsetY = 0;
            var self = this;
            self.content = game.getContent();
            self.canvas = game.getCanvas();
            self.far_mountain = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.FAR_MOUNTAIN_KEY]);
            self.far_mountain_sec = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.FAR_MOUNTAIN_KEY]);
            self.mountain = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.MOUNTAIN_KEY]);
            self.mountain_sec = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.MOUNTAIN_KEY]);
            self.hill = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.HILL_KEY]);
            self.hill_sec = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.HILL_KEY]);
            self.far_hill = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.FAR_HILL_KEY]);
            self.far_hill_sec = Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.FAR_HILL_KEY]);
            for (var i = 1; i <= Lich.Resources.CLOUDS_NUMBER; i++) {
                self.clouds.push(Lich.Resources.getInstance().getBitmap(Lich.BackgroundKey[Lich.BackgroundKey.CLOUD_KEY] + i));
            }
            self.sky = new createjs.Shape();
            self.content.addChild(self.sky);
            self.sky.x = 0;
            self.sky.y = 0;
            self.sky.graphics.beginBitmapFill(Lich.Resources.getInstance().getImage(Lich.BackgroundKey[Lich.BackgroundKey.SKY_KEY]), 'repeat').drawRect(0, 0, self.canvas.width, 250);
            var parallaxItems = [self.far_mountain, self.far_mountain_sec].concat(self.clouds).concat([self.mountain, self.mountain_sec, self.far_hill, self.far_hill_sec, self.hill, self.hill_sec]);
            parallaxItems.forEach(function (entry) {
                self.content.addChild(entry);
                entry.y = self.canvas.height - entry.image.height;
            });
            self.clouds.forEach(function (item) {
                item.y = Math.random() * Background.CLOUDS_SPACE;
                item.x = Math.random() * self.canvas.width;
            });
            self.far_mountain.y = Background.FAR_MOUNTAINS_START;
            self.far_mountain_sec.y = self.far_mountain.y;
            self.far_mountain_sec.x = -self.far_mountain_sec.image.width;
            self.mountain.y = Background.MOUNTAINS_START;
            self.mountain_sec.y = self.mountain.y;
            self.mountain_sec.x = -self.mountain_sec.image.width;
            self.far_hill.y = Background.FAR_HILLS_START;
            self.far_hill_sec.y = self.far_hill.y;
            self.far_hill_sec.x = -self.far_hill_sec.image.width;
            self.hill.y = Background.HILLS_START;
            self.hill_sec.y = self.hill.y;
            self.hill_sec.x = -self.hill_sec.image.width;
            self.dirt_back_startImg = Lich.Resources.getInstance().getImage(Lich.BackgroundKey[Lich.BackgroundKey.DIRT_BACK_START_KEY]);
            self.dirt_back_start = new createjs.Shape();
            self.dirt_back_start.graphics.beginBitmapFill(self.dirt_back_startImg, "repeat-x").drawRect(0, 0, self.canvas.width + self.dirt_back_startImg.width * 2, self.dirt_back_startImg.height);
            self.dirt_back_start.x = 0;
            self.dirt_back_start.y = Background.DIRT_START;
            self.content.addChild(self.dirt_back_start);
            self.dirt_backImg = Lich.Resources.getInstance().getImage(Lich.BackgroundKey[Lich.BackgroundKey.DIRTBACK_KEY]);
            self.dirt_back = new createjs.Shape();
            self.dirt_back.graphics.beginBitmapFill(self.dirt_backImg, "repeat").drawRect(0, 0, self.canvas.width + self.dirt_backImg.width * 2, self.canvas.height + self.dirt_backImg.height * 2);
            self.dirt_back.x = 0;
            self.dirt_back.y = self.dirt_back_start.y + self.dirt_back_startImg.height - 4;
            self.content.addChild(self.dirt_back);
            console.log("background ready");
        }
        Background.prototype.shift = function (distanceX, distanceY) {
            var self = this;
            var canvas = self.canvas;
            self.offsetX += distanceX;
            self.offsetY += distanceY;
            var align = function (part, sec_part, dividerX, dividerY) {
                var width = part.image.width;
                part.x += distanceX / dividerX;
                sec_part.x += distanceX / dividerX;
                if (part.x >= canvas.width)
                    part.x = sec_part.x - width;
                if (sec_part.x >= canvas.width)
                    sec_part.x = part.x - width;
                if (part.x + width <= 0)
                    part.x = sec_part.x + width;
                if (sec_part.x + width <= 0)
                    sec_part.x = part.x + width;
                part.y += distanceY / dividerY;
                sec_part.y += distanceY / dividerY;
            };
            // Far Mountains
            align(self.far_mountain, self.far_mountain_sec, 5, 10);
            // Mountains
            align(self.mountain, self.mountain_sec, 4, 8);
            // Far Hills 
            align(self.far_hill, self.far_hill_sec, 3, 5);
            // Hills 
            align(self.hill, self.hill_sec, 2, 3);
            // Dirt back
            self.dirt_back.x = ((self.dirt_back.x + distanceX / 1.1) % self.dirt_backImg.width) - self.dirt_backImg.width;
            self.dirt_back.y = self.dirt_back.y + distanceY / 1.1;
            // při překonání hraničního posunu začni vertikálně opakovat podklad
            if (self.offsetY < Background.REPEAT_POINT) {
                if (self.dirt_back.y < -self.dirt_backImg.height && distanceY < 0) {
                    self.dirt_back.y += self.dirt_backImg.height;
                }
                if (self.dirt_back.y > -self.dirt_backImg.height && distanceY > 0) {
                    self.dirt_back.y -= self.dirt_backImg.height;
                }
            }
            else {
                // Při návratu se musí zrušit opakování a nastavit koncovým podkladem
                // proto se musí odebrat výška 2x
                if (self.dirt_back.y < -self.dirt_backImg.height) {
                    self.dirt_back.y += self.dirt_backImg.height * 2;
                }
            }
            self.dirt_back_start.x = self.dirt_back.x;
            self.dirt_back_start.y = self.dirt_back.y - self.dirt_back_startImg.height + 4;
            //self.dirt_back_start.y = self.dirt_back_start.y + distanceY / 1.1;
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
        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        Background.CLOUDS_SPACE = 150;
        Background.REPEAT_POINT = -1200;
        Background.FAR_MOUNTAINS_START = 50;
        Background.MOUNTAINS_START = 250;
        Background.FAR_HILLS_START = 500;
        Background.HILLS_START = 650;
        Background.DIRT_START = 900;
        return Background;
    }());
    Lich.Background = Background;
})(Lich || (Lich = {}));