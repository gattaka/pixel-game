 /*global createjs*/
 /*global game*/

 /**
  * resources.js 
  * 
  * Přehled konstant a všeobecně užitečných zdrojů
  * 
  */
 var resources = (function() {

   var pub = {};

   /*
    * Přepínače
    */
   pub.SHOW_SECTORS = false;
   pub.PRINT_SECTOR_ALLOC = false;

   /*
    * Velikosti
    */
   pub.TILE_SIZE = 16;
   pub.PARTS_SIZE = 2 * pub.TILE_SIZE;
   pub.PARTS_SHEET_WIDTH = 20;

   pub.CLOUDS_NUMBER = 5;

   /*
    * Sprite indexy
    */
   pub.VOID = 0;
   pub.DIRT = {
     M1: 1,
     M2: 2,
     M3: 3,
     M4: 10,
     M5: 11,
     M6: 12,
     M7: 19,
     M8: 20,
     M9: 21,
     TL: 4,
     TR: 5,
     T: 6,
     I_TR: 7,
     I_TL: 8,
     BL: 13,
     BR: 14,
     R: 15,
     I_BR: 16,
     I_BL: 17,
     B: 22,
     L: 23
   };

   pub.WOOD_INDEX = 0;
   pub.STRAW_INDEX = 6;
   pub.PLANT_INDEX = 36;
   pub.SHROOM1_INDEX = 16;
   pub.SHROOM2_INDEX = 17;
   pub.SHROOM3_INDEX = 18;
   pub.PLANT2_INDEX = 19;
   pub.PLANT3_INDEX = 27;
   pub.PLANT4_INDEX = 28;
   pub.PLANT5_INDEX = 29;

   /*
    * Resource klíče
    */

   // background
   pub.DIRT_BACK_KEY = "DIRT_BACK_KEY";
   pub.SKY_KEY = "SKY_KEY";
   pub.FAR_MOUNTAIN_KEY = "FAR_MOUNTAIN_KEY";
   pub.MOUNTAIN_KEY = "MOUNTAIN_KEY";
   pub.FAR_HILL_KEY = "FAR_HILL_KEY";
   pub.HILL_KEY = "HILL_KEY";
   pub.DIRTBACK_KEY = "DIRTBACK_KEY";
   pub.CLOUD_KEY = "CLOUD_KEY";

   // animations
   pub.BLAST_ANIMATION_KEY = "BLAST_ANIMATION_KEY";

   // tiles
   pub.TILES_KEY = "TILES_KEY";

   // inv items
   pub.INV_PARTS_KEY = "INV_PARTS_KEY";

   // characters
   pub.PLAYER_ICON_KEY = "PLAYER_ICON_KEY";

   // map objects
   pub.PARTS_KEY = "PARTS_KEY";
   pub.PLANT_KEY = "PLANT_KEY";
   pub.TREE_KEY = "TREE_KEY";
   pub.TREE2_KEY = "TREE2_KEY";
   pub.MOUND_KEY = "MOUND_KEY";
   pub.GRASS_KEY = "GRASS_KEY";
   pub.GRASS2_KEY = "GRASS2_KEY";
   pub.GRASS3_KEY = "GRASS3_KEY";
   pub.GRASS4_KEY = "GRASS4_KEY";
   pub.SHROOM1_KEY = "SHROOM1_KEY";
   pub.SHROOM2_KEY = "SHROOM2_KEY";
   pub.SHROOM3_KEY = "SHROOM3_KEY";
   pub.PLANT2_KEY = "PLANT2_KEY";
   pub.PLANT3_KEY = "PLANT3_KEY";
   pub.PLANT4_KEY = "PLANT4_KEY";
   pub.PLANT5_KEY = "PLANT5_KEY";
   pub.BUSH_KEY = "BUSH_KEY";

   // ui
   pub.INV_KEY = "INV_KEY";
   pub.SKULL_KEY = "SKULL_KEY";
   pub.HELMET_KEY = "HELMET_KEY";
   pub.TORSO_KEY = "TORSO_KEY";
   pub.GAUNTLET_KEY = "GAUNTLET_KEY";

   // sound

   pub.FIREBALL_KEY = "FIREBALL_KEY";
   pub.BURN_KEY = "BURN_KEY";
   pub.PICK_KEY = "PICK_KEY";
   pub.DIRT_THEME_KEY = "DIRT_THEME_KEY";

   /*
    * Definice mapových objektů
    */
   pub.dirtObjects = [
     new game.MapObj(pub.TREE_KEY, 4, 9, 4, 8, 0, pub.WOOD_INDEX, 5),
     new game.MapObj(pub.TREE2_KEY, 8, 15, 3, 0, 0, pub.WOOD_INDEX, 10),
     new game.MapObj(pub.PLANT_KEY, 2, 2, 1, 12, 6, pub.PLANT_INDEX, 1),
     new game.MapObj(pub.GRASS_KEY, 2, 2, 5, 12, 0, pub.STRAW_INDEX, 2),
     new game.MapObj(pub.GRASS2_KEY, 2, 2, 5, 14, 0, pub.STRAW_INDEX, 2),
     new game.MapObj(pub.GRASS3_KEY, 2, 2, 5, 16, 0, pub.STRAW_INDEX, 2),
     new game.MapObj(pub.GRASS4_KEY, 2, 2, 5, 12, 4, pub.STRAW_INDEX, 2),
     new game.MapObj(pub.SHROOM1_KEY, 2, 2, 1, 12, 2, pub.SHROOM1_INDEX, 1),
     new game.MapObj(pub.SHROOM2_KEY, 2, 2, 1, 14, 2, pub.SHROOM2_INDEX, 1),
     new game.MapObj(pub.SHROOM3_KEY, 2, 2, 1, 16, 2, pub.SHROOM3_INDEX, 1),
     new game.MapObj(pub.PLANT2_KEY, 2, 2, 1, 18, 2, pub.PLANT2_INDEX, 1),
     new game.MapObj(pub.PLANT3_KEY, 2, 2, 1, 14, 4, pub.PLANT3_INDEX, 1),
     new game.MapObj(pub.PLANT4_KEY, 2, 2, 1, 16, 4, pub.PLANT4_INDEX, 1),
     new game.MapObj(pub.PLANT5_KEY, 2, 2, 1, 18, 4, pub.PLANT5_INDEX, 1),
     new game.MapObj(pub.BUSH_KEY, 2, 2, 1, 18, 0),
   ];

   /*
    * Resource definice a loader
    */
   var loader;
   var imgManifest = [{
     src: "images/ui/inv_parts.png",
     id: pub.INV_PARTS_KEY
   }, {
     src: "images/effects/blast_animation.png",
     id: pub.BLAST_ANIMATION_KEY
   }, {
     src: "images/tiles/tiles.png",
     id: pub.TILES_KEY
   }, {
     src: "images/parts/parts.png",
     id: pub.PARTS_KEY
   }, {
     src: "images/characters/player_icon.png",
     id: pub.PLAYER_ICON_KEY
   }, {
     src: "images/ui/inventory.png",
     id: pub.INV_KEY
   }, {
     src: "images/ui/skull.png",
     id: pub.SKULL_KEY
   }, {
     src: "images/armour/helmet.png",
     id: pub.HELMET_KEY
   }, {
     src: "images/armour/torso.png",
     id: pub.TORSO_KEY
   }, {
     src: "images/armour/gauntlet.png",
     id: pub.GAUNTLET_KEY
   }, {
     src: "images/background/sky.png",
     id: pub.SKY_KEY
   }, {
     src: "images/background/far_mountain.png",
     id: pub.FAR_MOUNTAIN_KEY
   }, {
     src: "images/background/mountain.png",
     id: pub.MOUNTAIN_KEY
   }, {
     src: "images/background/far_woodland.png",
     id: pub.FAR_HILL_KEY
   }, {
     src: "images/background/woodland.png",
     id: pub.HILL_KEY
   }, {
     src: "images/background/dirt_back.png",
     id: pub.DIRTBACK_KEY
   }, {
     src: "sound/334234__liamg-sfx__fireball-cast-1.ogg",
     id: pub.FIREBALL_KEY
   }, {
     src: "sound/113111__satrebor__pick.ogg",
     id: pub.PICK_KEY
   }, {
     src: "sound/248116__robinhood76__05224-fireball-whoosh.ogg",
     id: pub.BURN_KEY
   }, {
     src: "sound/Dirt 2.ogg",
     id: pub.DIRT_THEME_KEY
   }];
   
   (function() {
     for (var i = 1; i <= pub.CLOUDS_NUMBER; i++) {
       imgManifest.push({
         src: "images/background/cloud" + i + ".png",
         id: pub.CLOUD_KEY + i
       });
     }
   })();

   pub.init = function(callback, onprogress) {

     var loadScreenCont = new createjs.Container();
     loadScreenCont.width = game.canvas.width;
     loadScreenCont.height = game.canvas.height;
     loadScreenCont.x = 0;
     loadScreenCont.y = 0;
     game.stage.addChild(loadScreenCont);

     var loadScreen = new createjs.Shape();
     loadScreen.graphics.beginFill("black");
     loadScreen.graphics.drawRect(0, 0, game.canvas.width, game.canvas.height);
     loadScreenCont.addChild(loadScreen);

     var loadLabel = new createjs.Text("Loading...", "bold 28px Arial", "#ff0");
     loadLabel.x = 50;
     loadLabel.y = 50;
     loadScreenCont.addChild(loadLabel);

     loader = new createjs.LoadQueue(false);
     createjs.Sound.alternateExtensions = ["mp3"];
     loader.installPlugin(createjs.Sound);
     loader.addEventListener("progress", function(event) {
       loadLabel.text = Math.floor(event.loaded * 100) + "% Loading... ";
     });
     loader.addEventListener("complete", function() {
       createjs.Tween.get(loadScreenCont)
         .to({
           alpha: 0
         }, 2000).call(function() {
           game.stage.removeChild(loadScreenCont);
         });
       if (typeof callback !== "undefined") {
         callback();
       }
     });
     loader.loadManifest(imgManifest, true);

   };

   pub.getImage = function(key) {
     return loader.getResult(key);
   };

   pub.getBitmap = function(key) {
     return new createjs.Bitmap(loader.getResult(key));
   };

   pub.getItemBitmap = function(v) {
     var item = pub.getBitmap(pub.INV_PARTS_KEY);
     var itemCols = item.image.width / pub.PARTS_SIZE;
     // Otestováno: tohle je rychlejší než extract ze Spritesheet
     item.sourceRect = {
       x: (v % itemCols) * pub.PARTS_SIZE,
       y: Math.floor(v / itemCols) * pub.PARTS_SIZE,
       height: pub.PARTS_SIZE,
       width: pub.PARTS_SIZE
     };
     return item;
   };

   return pub;

 })();