 /*global createjs*/
 /*global game*/

 var background = (function() {

   var pub = {};

   /*-----------*/
   /* CONSTANTS */
   /*-----------*/

   var SKY_IMAGE = "images/background/sky.png";
   var FAR_MOUNTAIN_IMAGE = "images/background/far_mountain.png";
   var MOUNTAIN_IMAGE = "images/background/mountain.png";
   var FAR_HILL_IMAGE = "images/background/far_woodland.png";
   var HILL_IMAGE = "images/background/woodland.png";
   var CLOUD_IMAGES = [
     "images/background/cloud1.png",
     "images/background/cloud2.png",
     "images/background/cloud3.png",
     "images/background/cloud4.png",
     "images/background/cloud5.png"
   ];
   var CLOUDS_SPACE = 150;

   /*-----------*/
   /* VARIABLES */
   /*-----------*/

   var itemsLoadedCount = 0;
   var images = [];
   var imageNames = [SKY_IMAGE, FAR_MOUNTAIN_IMAGE, MOUNTAIN_IMAGE, FAR_HILL_IMAGE, HILL_IMAGE].concat(CLOUD_IMAGES);

   var sky, far_mountain, far_mountain_sec, mountain, mountain_sec, hill, hill_sec, far_hill, far_hill_sec;
   var clouds = [];

   var initialized = false;

   pub.init = function(callback) {

     var preload = new createjs.LoadQueue();
     preload.addEventListener("fileload", function(event) {
       console.log(event.item.id + " loaded");
       images[event.item.id] = event.result;
       checkAndRun(function() {
         if (typeof callback !== "undefined") {
           callback();
         }
       });
     });
     imageNames.forEach(function(item) {
       console.log(item + " loading");
       preload.loadFile(item);
     });
   };

   function checkAndRun(callback) {
     itemsLoadedCount++;
     if (itemsLoadedCount == imageNames.length) {
       run();
       callback();
     }
   }

   function run() {

     far_mountain = new createjs.Bitmap(images[FAR_MOUNTAIN_IMAGE]);
     far_mountain_sec = new createjs.Bitmap(images[FAR_MOUNTAIN_IMAGE]);
     mountain = new createjs.Bitmap(images[MOUNTAIN_IMAGE]);
     mountain_sec = new createjs.Bitmap(images[MOUNTAIN_IMAGE]);
     hill = new createjs.Bitmap(images[HILL_IMAGE]);
     hill_sec = new createjs.Bitmap(images[HILL_IMAGE]);
     far_hill = new createjs.Bitmap(images[FAR_HILL_IMAGE]);
     far_hill_sec = new createjs.Bitmap(images[FAR_HILL_IMAGE]);
     CLOUD_IMAGES.forEach(function(item) {
       clouds.push(new createjs.Bitmap(images[item]));
     });

     sky = new createjs.Shape();
     game.stage.addChild(sky);
     sky.x = 0;
     sky.y = 0;
     sky.graphics.beginBitmapFill(images[SKY_IMAGE], 'repeat').drawRect(0, 0, game.canvas.width, 250);

     var parallaxItems = [far_mountain, far_mountain_sec].concat(clouds).concat([mountain, mountain_sec, far_hill, far_hill_sec, hill, hill_sec]);

     parallaxItems.forEach(function(entry) {
       game.stage.addChild(entry);
       entry.y = game.canvas.height - entry.image.height;
     });

     clouds.forEach(function(item) {
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

     hill.y = 570;
     hill_sec.y = hill.y;
     hill_sec.x = -hill_sec.image.width;

     console.log("background ready");
     initialized = true;
   }

   pub.shift = function(distanceX, distanceY) {
     if (initialized) {

       var canvas = game.canvas;

       var align = function(part, sec_part, dividerX, dividerY) {
         var width = part.image.width;
         part.x += distanceX / dividerX;
         sec_part.x += distanceX / dividerX;
         if (part.x >= canvas.width) part.x = sec_part.x - width;
         if (sec_part.x >= canvas.width) sec_part.x = part.x - width;
         if (part.x + width <= 0) part.x = sec_part.x + width;
         if (sec_part.x + width <= 0) sec_part.x = part.x + width;

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

       // Clouds
       for (var i = 0; i < clouds.length; i++) {
         var item = clouds[i];
         item.x += distanceX / (8 + (1 / (i + 1)));
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

   pub.handleTick = function(rawShift) {
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

   return pub;

 })();