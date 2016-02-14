 /*global createjs*/

 /**
  * resources.js 
  * 
  * Přehled konstant a všeobecně užitečných zdrojů
  * 
  */
 var resources = (function() {

   var pub = {};

   pub.SHOW_SECTORS = false;
   pub.PRINT_SECTOR_ALLOC = false;

   pub.TILE_SIZE = 16;

   pub.DIRT_BACK_KEY = "DIRT_BACK_KEY";

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

   var PARTS_KEY = "PARTS_KEY";

   var loader;
   var manifest = [{
     src: "ui/inv_parts.png",
     id: PARTS_KEY
   }];

   pub.TILES_KEY = "TILES_KEY";
   pub.PARTS_KEY = "PARTS_KEY";

   var PARTS_SIZE = 2 * pub.TILE_SIZE;
   pub.PARTS_SIZE = PARTS_SIZE;

   pub.PLAYER_ICON_KEY = "PLAYER_ICON_KEY";

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

   pub.PARTS_SHEET_WIDTH = 20;
   pub.dirtObjects = [{
     key: pub.TREE_KEY,
     width: 4,
     height: 9,
     freq: 4,
     posx: 8,
     posy: 0,
     item: {
       index: pub.WOOD_INDEX,
       quant: 5
     }
   }, {
     key: pub.TREE2_KEY,
     width: 8,
     height: 15,
     freq: 3,
     posx: 0,
     posy: 0,
     item: {
       index: pub.WOOD_INDEX,
       quant: 10
     }
   }, {
     key: pub.PLANT_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 12,
     posy: 6,
     item: {
       index: pub.PLANT_INDEX,
       quant: 1
     }
   }, {
     key: pub.GRASS_KEY,
     width: 2,
     height: 2,
     freq: 5,
     posx: 12,
     posy: 0,
     item: {
       index: pub.STRAW_INDEX,
       quant: 2
     }
   }, {
     key: pub.GRASS2_KEY,
     width: 2,
     height: 2,
     freq: 5,
     posx: 14,
     posy: 0,
     item: {
       index: pub.STRAW_INDEX,
       quant: 2
     }
   }, {
     key: pub.GRASS3_KEY,
     width: 2,
     height: 2,
     freq: 5,
     posx: 16,
     posy: 0,
     item: {
       index: pub.STRAW_INDEX,
       quant: 2
     }
   }, {
     key: pub.GRASS4_KEY,
     width: 2,
     height: 2,
     freq: 5,
     posx: 12,
     posy: 4,
     item: {
       index: pub.STRAW_INDEX,
       quant: 2
     }
   }, {
     key: pub.SHROOM1_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 12,
     posy: 2,
     item: {
       index: pub.SHROOM1_INDEX,
       quant: 1
     }
   }, {
     key: pub.SHROOM2_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 14,
     posy: 2,
     item: {
       index: pub.SHROOM2_INDEX,
       quant: 1
     }
   }, {
     key: pub.SHROOM3_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 16,
     posy: 2,
     item: {
       index: pub.SHROOM3_INDEX,
       quant: 1
     }
   }, {
     key: pub.PLANT2_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 18,
     posy: 2,
     item: {
       index: pub.PLANT2_INDEX,
       quant: 1
     }
   }, {
     key: pub.PLANT3_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 14,
     posy: 4,
     item: {
       index: pub.PLANT3_INDEX,
       quant: 1
     }
   }, {
     key: pub.PLANT4_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 16,
     posy: 4,
     item: {
       index: pub.PLANT4_INDEX,
       quant: 1
     }
   }, {
     key: pub.PLANT5_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 18,
     posy: 4,
     item: {
       index: pub.PLANT5_INDEX,
       quant: 1
     }
   }, {
     key: pub.BUSH_KEY,
     width: 2,
     height: 2,
     freq: 1,
     posx: 18,
     posy: 0
   }];

   pub.init = function(callback) {

     loader = new createjs.LoadQueue(false);
     loader.addEventListener("fileload", function(event) {
       console.log(event.item.id + " loaded");
     });
     loader.addEventListener("complete", function() {
       if (typeof callback !== "undefined") {
         callback();
       }
     });
     loader.loadManifest(manifest, true, "images/");

   };

   pub.getItemBitmap = function(v) {
     var item = new createjs.Bitmap(loader.getResult(pub.PARTS_KEY));
     var itemCols = item.image.width / PARTS_SIZE;
     // Otestováno: tohle je rychlejší než extract ze Spritesheet
     item.sourceRect = {
       x: (v % itemCols) * PARTS_SIZE,
       y: Math.floor(v / itemCols) * PARTS_SIZE,
       height: PARTS_SIZE,
       width: PARTS_SIZE
     };
     return item;
   };

   return pub;

 })();