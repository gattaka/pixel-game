/*global createjs*/
/*global game*/
/*global resources*/
var lich = lich || {};
lich.Background = function () {

    /*-----------*/
    /* CONSTANTS */
    /*-----------*/
    var CLOUDS_SPACE = 150;

    /*-----------*/
    /* VARIABLES */
    /*-----------*/

    var sky, far_mountain, far_mountain_sec, mountain, mountain_sec, hill, hill_sec, far_hill, far_hill_sec, dirt_back;
    var clouds = [];

    var dirt_backImg;

    var initialized = false;

    far_mountain = resources.getBitmap(resources.FAR_MOUNTAIN_KEY);
    far_mountain_sec = resources.getBitmap(resources.FAR_MOUNTAIN_KEY);
    mountain = resources.getBitmap(resources.MOUNTAIN_KEY);
    mountain_sec = resources.getBitmap(resources.MOUNTAIN_KEY);
    hill = resources.getBitmap(resources.HILL_KEY);
    hill_sec = resources.getBitmap(resources.HILL_KEY);
    far_hill = resources.getBitmap(resources.FAR_HILL_KEY);
    far_hill_sec = resources.getBitmap(resources.FAR_HILL_KEY);
    for (var i = 1; i <= resources.CLOUDS_NUMBER; i++) {
        clouds.push(resources.getBitmap(resources.CLOUD_KEY + i));
    }

    sky = new createjs.Shape();
    game.stage.addChild(sky);
    sky.x = 0;
    sky.y = 0;
    sky.graphics.beginBitmapFill(resources.getImage(resources.SKY_KEY), 'repeat').drawRect(0, 0, game.canvas.width, 250);

    var parallaxItems = [far_mountain, far_mountain_sec].concat(clouds).concat([mountain, mountain_sec, far_hill, far_hill_sec, hill, hill_sec]);

    parallaxItems.forEach(function (entry) {
        game.stage.addChild(entry);
        entry.y = game.canvas.height - entry.image.height;
    });

    clouds.forEach(function (item) {
        item.y = Math.random() * CLOUDS_SPACE;
        item.x = Math.random() * game.canvas.width;
    });

    far_mountain.y = 50;
    far_mountain_sec.y = far_mountain.y;
    far_mountain_sec.x = -far_mountain_sec.image.width;

    mountain.y = 250;
    mountain_sec.y = mountain.y;
    mountain_sec.x = -mountain_sec.image.width;

    far_hill.y = 500;
    far_hill_sec.y = far_hill.y;
    far_hill_sec.x = -far_hill_sec.image.width;

    hill.y = 650;
    hill_sec.y = hill.y;
    hill_sec.x = -hill_sec.image.width;

    dirt_backImg = resources.getImage(resources.DIRTBACK_KEY);
    dirt_back = new createjs.Shape();
    dirt_back.graphics.beginBitmapFill(dirt_backImg, "repeat").drawRect(0, 0, game.canvas.width + dirt_backImg.width * 2, game.canvas.height + dirt_backImg.height);
    dirt_back.x = 0;
    dirt_back.y = 900;
    game.stage.addChild(dirt_back);

    console.log("background ready");
    initialized = true;

    this.shift = function (distanceX, distanceY) {
        if (initialized) {

            var canvas = game.canvas;

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
            align(far_mountain, far_mountain_sec, 5, 10);

            // Mountains
            align(mountain, mountain_sec, 4, 8);

            // Far Hills 
            align(far_hill, far_hill_sec, 3, 5);

            // Hills 
            align(hill, hill_sec, 2, 3);

            // Dirt back
            dirt_back.x = ((dirt_back.x + distanceX / 2) % dirt_backImg.width) - dirt_backImg.width;
            dirt_back.y = (dirt_back.y + distanceY / 3);
            if (dirt_back.y < 0)
                dirt_back.y = dirt_back.y % dirt_backImg.height;

            // Clouds
            for (var i = 0; i < clouds.length; i++) {
                var item = clouds[i];
                item.x += distanceX / (8 + (1 / (i + 1)));
                item.y += distanceY / 7;
                if (item.x + item.image.width <= 0) {
                    // Musí být -1, aby ho hnedka "nesežrala"
                    // kontrola druhého směru a nepřesunula mrak
                    // zpátky doleva
                    item.x = canvas.width - 1; // FIXME
                    item.y = Math.random() * CLOUDS_SPACE;
                }
            }

        }
    };

    this.handleTick = function (rawShift) {
        if (initialized) {
            var canvas = game.canvas;
            var shift = rawShift / 10;

            // Clouds
            for (var i = 0; i < clouds.length; i++) {
                var item = clouds[i];
                item.x += shift / (8 + (1 / (i + 1)));
                if (item.x >= canvas.width) {
                    item.x = -item.image.width;
                    item.y = Math.random() * CLOUDS_SPACE;
                }
            }
        }
    };

};