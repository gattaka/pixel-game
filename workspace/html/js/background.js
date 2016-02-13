 /*global createjs*/
 /*global game*/

 var background = (function() {

   var pub = {};

   /*-----------*/
   /* CONSTANTS */
   /*-----------*/
   var SKY_KEY = "SKY_KEY";
   var FAR_MOUNTAIN_KEY = "FAR_MOUNTAIN_KEY";
   var MOUNTAIN_KEY = "MOUNTAIN_KEY";
   var FAR_HILL_KEY = "FAR_HILL_KEY";
   var HILL_KEY = "HILL_IMAGE";
   var CLOUD_KEY = "CLOUD_KEY";
   var CLOUDS_NUMBER = 5;

   var CLOUDS_SPACE = 150;

   /*-----------*/
   /* VARIABLES */
   /*-----------*/

   var loader;
   var manifest = [{
     src: "background/sky.png",
     id: SKY_KEY
   }, {
     src: "background/far_mountain.png",
     id: FAR_MOUNTAIN_KEY
   }, {
     src: "background/mountain.png",
     id: MOUNTAIN_KEY
   }, {
     src: "background/far_woodland.png",
     id: FAR_HILL_KEY
   }, {
     src: "background/woodland.png",
     id: HILL_KEY
   }];

   (function() {
     for (var i = 1; i <= CLOUDS_NUMBER; i++) {
       manifest.push({
         src: "background/cloud5.png",
         id: CLOUD_KEY + i
       });
     }
   })();

   var sky, far_mountain, far_mountain_sec, mountain, mountain_sec, hill, hill_sec, far_hill, far_hill_sec;
   var clouds = [];

   var initialized = false;

   pub.init = function(callback) {

     loader = new createjs.LoadQueue(false);
     loader.addEventListener("fileload", function(event) {
       console.log(event.item.id + " loaded");
     });
     loader.addEventListener("complete", function() {
       construct();
       if (typeof callback !== "undefined") {
         callback();
       }
     });
     loader.loadManifest(manifest, true, "images/");

   };

   function construct() {

     far_mountain = new createjs.Bitmap(loader.getResult(FAR_MOUNTAIN_KEY));
     far_mountain_sec = new createjs.Bitmap(loader.getResult(FAR_MOUNTAIN_KEY));
     mountain = new createjs.Bitmap(loader.getResult(MOUNTAIN_KEY));
     mountain_sec = new createjs.Bitmap(loader.getResult(MOUNTAIN_KEY));
     hill = new createjs.Bitmap(loader.getResult(HILL_KEY));
     hill_sec = new createjs.Bitmap(loader.getResult(HILL_KEY));
     far_hill = new createjs.Bitmap(loader.getResult(FAR_HILL_KEY));
     far_hill_sec = new createjs.Bitmap(loader.getResult(FAR_HILL_KEY));
     for (var i = 1; i <= CLOUDS_NUMBER; i++) {
       clouds.push(new createjs.Bitmap(loader.getResult(CLOUD_KEY + i)));
     }

     sky = new createjs.Shape();
     game.stage.addChild(sky);
     sky.x = 0;
     sky.y = 0;
     sky.graphics.beginBitmapFill(loader.getResult(SKY_KEY), 'repeat').drawRect(0, 0, game.canvas.width, 250);

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

     hill.y = 650;
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