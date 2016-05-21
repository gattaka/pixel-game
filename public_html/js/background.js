///<reference path='lib/createjs/createjs.d.ts'/>
var Lich;
(function (Lich) {
    var Background = (function () {
        function Background(game) {
            this.game = game;
            /*-----------*/
            /* CONSTANTS */
            /*-----------*/
            this.CLOUDS_SPACE = 150;
            this.clouds = [];
            this.initialized = false;
            var self = this;
            var resources = game.resources;
            self.far_mountain = resources.getBitmap(Lich.Resources.FAR_MOUNTAIN_KEY);
            self.far_mountain_sec = resources.getBitmap(Lich.Resources.FAR_MOUNTAIN_KEY);
            self.mountain = resources.getBitmap(Lich.Resources.MOUNTAIN_KEY);
            self.mountain_sec = resources.getBitmap(Lich.Resources.MOUNTAIN_KEY);
            self.hill = resources.getBitmap(Lich.Resources.HILL_KEY);
            self.hill_sec = resources.getBitmap(Lich.Resources.HILL_KEY);
            self.far_hill = resources.getBitmap(Lich.Resources.FAR_HILL_KEY);
            self.far_hill_sec = resources.getBitmap(Lich.Resources.FAR_HILL_KEY);
            for (var i = 1; i <= Lich.Resources.CLOUDS_NUMBER; i++) {
                self.clouds.push(resources.getBitmap(Lich.Resources.CLOUD_KEY + i));
            }
            self.sky = new createjs.Shape();
            game.stage.addChild(self.sky);
            self.sky.x = 0;
            self.sky.y = 0;
            self.sky.graphics.beginBitmapFill(resources.getImage(Lich.Resources.SKY_KEY), 'repeat').drawRect(0, 0, game.canvas.width, 250);
            var parallaxItems = [self.far_mountain, self.far_mountain_sec].concat(self.clouds).concat([self.mountain, self.mountain_sec, self.far_hill, self.far_hill_sec, self.hill, self.hill_sec]);
            parallaxItems.forEach(function (entry) {
                game.stage.addChild(entry);
                entry.y = game.canvas.height - entry.image.height;
            });
            self.clouds.forEach(function (item) {
                item.y = Math.random() * self.CLOUDS_SPACE;
                item.x = Math.random() * game.canvas.width;
            });
            self.far_mountain.y = 50;
            self.far_mountain_sec.y = self.far_mountain.y;
            self.far_mountain_sec.x = -self.far_mountain_sec.image.width;
            self.mountain.y = 250;
            self.mountain_sec.y = self.mountain.y;
            self.mountain_sec.x = -self.mountain_sec.image.width;
            self.far_hill.y = 500;
            self.far_hill_sec.y = self.far_hill.y;
            self.far_hill_sec.x = -self.far_hill_sec.image.width;
            self.hill.y = 650;
            self.hill_sec.y = self.hill.y;
            self.hill_sec.x = -self.hill_sec.image.width;
            self.dirt_backImg = resources.getImage(Lich.Resources.DIRTBACK_KEY);
            self.dirt_back = new createjs.Shape();
            self.dirt_back.graphics.beginBitmapFill(self.dirt_backImg, "repeat").drawRect(0, 0, game.canvas.width + self.dirt_backImg.width * 2, game.canvas.height + self.dirt_backImg.height);
            self.dirt_back.x = 0;
            self.dirt_back.y = 900;
            game.stage.addChild(self.dirt_back);
            console.log("background ready");
            self.initialized = true;
        }
        Background.prototype.shift = function (distanceX, distanceY) {
            var self = this;
            if (self.initialized) {
                var canvas = self.game.canvas;
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
                self.dirt_back.x = ((self.dirt_back.x + distanceX / 2) % self.dirt_backImg.width) - self.dirt_backImg.width;
                self.dirt_back.y = (self.dirt_back.y + distanceY / 3);
                if (self.dirt_back.y < 0)
                    self.dirt_back.y = self.dirt_back.y % self.dirt_backImg.height;
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
                        item.y = Math.random() * self.CLOUDS_SPACE;
                    }
                }
            }
        };
        ;
        Background.prototype.handleTick = function (rawShift) {
            var self = this;
            if (self.initialized) {
                var canvas = self.game.canvas;
                var shift = rawShift / 10;
                // Clouds
                for (var i = 0; i < self.clouds.length; i++) {
                    var item = self.clouds[i];
                    item.x += shift / (8 + (1 / (i + 1)));
                    if (item.x >= canvas.width) {
                        item.x = -item.image.width;
                        item.y = Math.random() * self.CLOUDS_SPACE;
                    }
                }
            }
        };
        ;
        return Background;
    }());
    Lich.Background = Background;
})(Lich || (Lich = {}));
