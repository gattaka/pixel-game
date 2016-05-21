///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {
    export class Background {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/
        CLOUDS_SPACE = 150;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        sky;
        far_mountain;
        far_mountain_sec;
        mountain;
        mountain_sec;
        hill;
        hill_sec;
        far_hill;
        far_hill_sec;
        dirt_back;
        clouds = [];

        dirt_backImg;

        initialized = false;

        constructor(public game: Game) {

            var resources = game.resources;

            this.far_mountain = resources.getBitmap(Resources.FAR_MOUNTAIN_KEY);
            this.far_mountain_sec = resources.getBitmap(Resources.FAR_MOUNTAIN_KEY);
            this.mountain = resources.getBitmap(Resources.MOUNTAIN_KEY);
            this.mountain_sec = resources.getBitmap(Resources.MOUNTAIN_KEY);
            this.hill = resources.getBitmap(Resources.HILL_KEY);
            this.hill_sec = resources.getBitmap(Resources.HILL_KEY);
            this.far_hill = resources.getBitmap(Resources.FAR_HILL_KEY);
            this.far_hill_sec = resources.getBitmap(Resources.FAR_HILL_KEY);
            for (var i = 1; i <= Resources.CLOUDS_NUMBER; i++) {
                this.clouds.push(resources.getBitmap(Resources.CLOUD_KEY + i));
            }

            this.sky = new createjs.Shape();
            game.stage.addChild(this.sky);
            this.sky.x = 0;
            this.sky.y = 0;
            this.sky.graphics.beginBitmapFill(resources.getImage(Resources.SKY_KEY), 'repeat').drawRect(0, 0, game.canvas.width, 250);

            var parallaxItems = [this.far_mountain, this.far_mountain_sec].concat(this.clouds).concat([this.mountain, this.mountain_sec, this.far_hill, this.far_hill_sec, this.hill, this.hill_sec]);

            parallaxItems.forEach(function(entry) {
                game.stage.addChild(entry);
                entry.y = game.canvas.height - entry.image.height;
            });

            this.clouds.forEach(function(item) {
                item.y = Math.random() * this.CLOUDS_SPACE;
                item.x = Math.random() * game.canvas.width;
            });

            this.far_mountain.y = 50;
            this.far_mountain_sec.y = this.far_mountain.y;
            this.far_mountain_sec.x = -this.far_mountain_sec.image.width;

            this.mountain.y = 250;
            this.mountain_sec.y = this.mountain.y;
            this.mountain_sec.x = -this.mountain_sec.image.width;

            this.far_hill.y = 500;
            this.far_hill_sec.y = this.far_hill.y;
            this.far_hill_sec.x = -this.far_hill_sec.image.width;

            this.hill.y = 650;
            this.hill_sec.y = this.hill.y;
            this.hill_sec.x = -this.hill_sec.image.width;

            this.dirt_backImg = resources.getImage(Resources.DIRTBACK_KEY);
            this.dirt_back = new createjs.Shape();
            this.dirt_back.graphics.beginBitmapFill(this.dirt_backImg, "repeat").drawRect(0, 0, game.canvas.width + this.dirt_backImg.width * 2, game.canvas.height + this.dirt_backImg.height);
            this.dirt_back.x = 0;
            this.dirt_back.y = 900;
            game.stage.addChild(this.dirt_back);

            console.log("background ready");
            this.initialized = true;
        }


        shift(distanceX, distanceY) {
            if (this.initialized) {

                var canvas = this.game.canvas;

                var align = function(part, sec_part, dividerX, dividerY) {
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
                align(this.far_mountain, this.far_mountain_sec, 5, 10);

                // Mountains
                align(this.mountain, this.mountain_sec, 4, 8);

                // Far Hills 
                align(this.far_hill, this.far_hill_sec, 3, 5);

                // Hills 
                align(this.hill, this.hill_sec, 2, 3);

                // Dirt back
                this.dirt_back.x = ((this.dirt_back.x + distanceX / 2) % this.dirt_backImg.width) - this.dirt_backImg.width;
                this.dirt_back.y = (this.dirt_back.y + distanceY / 3);
                if (this.dirt_back.y < 0)
                    this.dirt_back.y = this.dirt_back.y % this.dirt_backImg.height;

                // Clouds
                for (var i = 0; i < this.clouds.length; i++) {
                    var item = this.clouds[i];
                    item.x += distanceX / (8 + (1 / (i + 1)));
                    item.y += distanceY / 7;
                    if (item.x + item.image.width <= 0) {
                        // Musí být -1, aby ho hnedka "nesežrala"
                        // kontrola druhého směru a nepřesunula mrak
                        // zpátky doleva
                        item.x = canvas.width - 1; // FIXME
                        item.y = Math.random() * this.CLOUDS_SPACE;
                    }
                }

            }
        };

        handleTick(rawShift) {
            if (this.initialized) {
                var canvas = this.game.canvas;
                var shift = rawShift / 10;

                // Clouds
                for (var i = 0; i < this.clouds.length; i++) {
                    var item = this.clouds[i];
                    item.x += shift / (8 + (1 / (i + 1)));
                    if (item.x >= canvas.width) {
                        item.x = -item.image.width;
                        item.y = Math.random() * this.CLOUDS_SPACE;
                    }
                }
            }
        };

    }
}