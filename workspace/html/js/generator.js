 /*global utils*/

 var generator = (function() {

   var pub = {};

   // musí být sudé
   var MAP_WIDTH = 400;
   var MAP_HEIGHT = 100;

   var VOID = 0;
   pub.VOID = VOID;
   var DIRT = {
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
   pub.DIRT = DIRT;

   pub.PLANT_KEY = "PLANT_KEY";
   pub.TREE_KEY = "TREE_KEY";
   pub.TREE2_KEY = "TREE2_KEY";
   pub.MOUND_KEY = "MOUND_KEY";
   pub.GRASS_KEY = "GRASS_KEY";
   pub.GRASS2_KEY = "GRASS2_KEY";
   pub.GRASS3_KEY = "GRASS3_KEY";
   pub.GRASS4_KEY = "GRASS4_KEY";

   pub.dirtObjects = [{
     key: pub.TREE_KEY,
     width: 4,
     height: 9,
     freq: 4,
   },
   {
     key: pub.TREE2_KEY,
     width: 9,
     height: 15,
     freq: 3,
   }, {
     key: pub.PLANT_KEY,
     width: 2,
     height: 2,
     freq: 1,
   }, {
     key: pub.GRASS_KEY,
     width: 2,
     height: 2,
     freq: 5,
   }, {
     key: pub.GRASS2_KEY,
     width: 2,
     height: 2,
     freq: 5,
   }, {
     key: pub.GRASS3_KEY,
     width: 2,
     height: 2,
     freq: 5,
   }, {
     key: pub.GRASS4_KEY,
     width: 2,
     height: 2,
     freq: 5,
   }];

   pub.generate = function() {

     var tilesMap = {
       map: [],
       objects: [],
       objectsMapCache: [],
       width: MAP_WIDTH,
       height: MAP_HEIGHT,
       indexAt: function(x, y) {
         if (x >= this.width || x < 0 || y >= this.height || y < 0) {
           return -1;
         }
         else {
           return y * this.width + x;
         }
       },
       coordAt: function(index) {
         if (index < 0 || index > this.map.length - 1) {
           return 0;
         }
         else {
           return {
             x: index % this.width,
             y: Math.floor(index / this.width)
           };
         }
       },
       valueAt: function(x, y) {
         var index = this.indexAt(x, y);
         if (index >= 0) {
           return this.map[index];
         }
         return VOID;
       }
     };

     var mass = tilesMap.height * tilesMap.width;

     // base generation
     for (var y = 0; y < tilesMap.height; y++) {
       for (var x = 0; x < tilesMap.width; x++) {
         var m = x % 3 + 1 + ((y % 3) * 3);
         tilesMap.map.push(DIRT["M" + m]);
       }
     }

     // Holes
     (function() {
       var createHole = function(x0, y0, d0) {
         var d = utils.even(d0);
         var x = utils.even(x0);
         var y = utils.even(y0);
         // musí skákat po dvou, aby se zabránilo zubatosti
         for (var _x = x - d; _x <= x + d; _x += 2) {
           for (var _y = y - d; _y <= y + d; _y += 2) {
             // děruju v kruzích
             var r2 = Math.pow(x - _x, 2) + Math.pow(y - _y, 2);
             var d2 = Math.pow(d, 2);
             if (r2 <= d2) {
               // protože skáču po dvou, musím udělat vždy v každé
               // ose dva zápisy, jinak by vznikla mřížka
               for (var __x = _x; __x <= _x + 1; __x++) {
                 for (var __y = _y; __y <= _y + 1; __y++) {
                   var index = tilesMap.indexAt(__x, __y);
                   if (index >= 0) {
                     tilesMap.map[index] = VOID;
                   }
                 }
               }
             }
             // občas udělej na okraji díry... díru
             if (_x == x + d || _x == x - d || _y == y + d || _y == y - d) {
               if (Math.random() > 0.5) {
                 var auxX = _x;
                 var auxY = _y;
                 if (_x == x + d) auxX -= 2;
                 if (_y == y + d) auxY -= 2;
                 createHole(auxX, auxY, d - 2);
               }
             }
           }
         }
       };

       // random holes
       var holesP = mass * 0.005;
       for (var i = 0; i < holesP; i++) {
         var dia = Math.floor(Math.random() * 4) + 2;
         var holeIndex = Math.floor(Math.random() * mass);
         var holeCoord = tilesMap.coordAt(holeIndex);
         createHole(holeCoord.x, holeCoord.y, dia);
       }
     })();

     // tráva boky
     (function() {
       for (var i = 0; i < mass; i++) {
         if (tilesMap.map[i] == VOID) continue;
         var coord = tilesMap.coordAt(i);
         pub.generateEdge(tilesMap, coord.x, coord.y);
       }
     })();

     // tráva rohy
     (function() {
       for (var i = 0; i < mass; i++) {
         var val = tilesMap.map[i];
         if (val == VOID) continue;
         var coord = tilesMap.coordAt(i);
         pub.generateCorner(tilesMap, coord.x, coord.y);
       }
     })();

     // frekvenční "pool" objektů
     var pool = [];
     for (var it = 0; it < pub.dirtObjects.length; it++) {
       var item = pub.dirtObjects[it];
       // vlož index objektu tolikrát, kolik je jeho frekvenc
       for (var i = 0; i < item.freq; i++) {
         pool.push(it);
       }
     }

     // objekty 
     (function() {

       var isFree = function(x0, y0, width, height) {
         for (var x = x0; x <= x0 + width - 1; x++) {
           for (var y = y0 - height; y <= y0; y++) {
             // spodní buňky musí být všechny tvořený plochou DIRT.T
             // objekt nemůže "překlenovat" díru nebo viset z okraje
             // nelze kolidovat s jiným objektem
             var col = tilesMap.objectsMapCache[x];
             if ((y == y0 && tilesMap.valueAt(x, y) != DIRT.T) ||
               (y != y0 && tilesMap.valueAt(x, y) != VOID) ||
               (typeof col !== "undefined" && col[y] == 0))
               return false;
           }
         }
         return true;
       };

       for (var i = 0; i < mass; i += 2) {
         var val = tilesMap.map[i];
         // pokud jsem povrchová kostka je zde šance, že bude umístěn objekt
         if (val == DIRT.T) {
           // bude tam nějaký objekt? (100% ano)
           if (Math.random() > 0) {
             var tries = 0;
             var index = pool[Math.floor((pool.length - 1) * Math.random())];
             while (tries < pub.dirtObjects.length) {
               var object = pub.dirtObjects[index];
               var coord = tilesMap.coordAt(i);
               if (isFree(coord.x, coord.y, object.width, object.height)) {
                 // je tam volno, umísti ho
                 tilesMap.objects.push({
                   x: coord.x,
                   y: coord.y,
                   obj: index
                 });
                 // zapiš obsazení
                 for (var x = coord.x; x <= coord.x + object.width - 1; x++) {
                   for (var y = coord.y - object.height; y <= coord.y; y++) {
                     var col = tilesMap.objectsMapCache[x];
                     if (typeof col === "undefined") {
                       col = [];
                       tilesMap.objectsMapCache[x] = col;
                     }
                     col[y] = 0; // obsazeno
                   }
                 }
                 break;
               }
               else {
                 // další pokus na dalším objektu
                 tries++;
                 index = (index + 1) % pub.dirtObjects.length;
               }
             }
           }
         }
       }
     })();


     return tilesMap;

   };

   pub.generateEdge = function(tilesMap, x, y) {
     var i = tilesMap.indexAt(x, y);
     var valT = tilesMap.valueAt(x, y - 1);
     var valR = tilesMap.valueAt(x + 1, y);
     var valB = tilesMap.valueAt(x, y + 1);
     var valL = tilesMap.valueAt(x - 1, y);

     if (valT == VOID) {
       tilesMap.map[i] = DIRT.T;
     }

     if (valR == VOID) {
       tilesMap.map[i] = DIRT.R;
     }

     if (valB == VOID) {
       tilesMap.map[i] = DIRT.B;
     }

     if (valL == VOID) {
       tilesMap.map[i] = DIRT.L;
     }

     return tilesMap.map[i];
   };


   pub.generateCorner = function(tilesMap, x, y) {
     var i = tilesMap.indexAt(x, y);
     var val = tilesMap.map[i];
     var valT = tilesMap.valueAt(x, y - 1);
     var valR = tilesMap.valueAt(x + 1, y);
     var valB = tilesMap.valueAt(x, y + 1);
     var valL = tilesMap.valueAt(x - 1, y);

     var isMiddle = false;
     for (var m = 1; m <= 9; m++) {
       if (val == DIRT["M" + m]) {
         isMiddle = true;
         break;
       }
     }

     // změny prostředních kusů
     if (isMiddle) {
       // jsem pravý horní roh díry
       if (valB == DIRT.R && valR == DIRT.B) {
         tilesMap.map[i] = DIRT.I_TL;
       }
       // jsem levý horní roh díry
       if (valL == DIRT.B && valB == DIRT.L) {
         tilesMap.map[i] = DIRT.I_TR;
       }
       // levý spodní roh díry
       if (valT == DIRT.R && valR == DIRT.T) {
         tilesMap.map[i] = DIRT.I_BL;
       }
       // pravý spodní roh díry
       if (valT == DIRT.L && valL == DIRT.T) {
         tilesMap.map[i] = DIRT.I_BR;
       }

     }

     // jsem levý horní roh
     if (val == DIRT.L && (valR == DIRT.T || valT == VOID)) {
       tilesMap.map[i] = DIRT.TL;
     }
     // jsem levý dolní roh
     if (val == DIRT.L && (valR == DIRT.B || valR == DIRT.BR)) {
       tilesMap.map[i] = DIRT.BL;
     }
     // jsem pravý dolní roh
     if (val == DIRT.B && (valT == DIRT.R || valT == DIRT.TR)) {
       tilesMap.map[i] = DIRT.BR;
     }
     // jsem pravý horní roh
     if (val == DIRT.R && (valL == DIRT.T || valT == VOID)) {
       tilesMap.map[i] = DIRT.TR;
     }

     return tilesMap.map[i];
   };


   pub.modify = function(tilesMap, x, y) {
     var rx = utils.even(x);
     var ry = utils.even(y);
     tilesMap.map[tilesMap.indexAt(rx, ry)] = VOID;
     tilesMap.map[tilesMap.indexAt(rx + 1, ry)] = VOID;
     tilesMap.map[tilesMap.indexAt(rx, ry + 1)] = VOID;
     tilesMap.map[tilesMap.indexAt(rx + 1, ry + 1)] = VOID;
   };

   return pub;

 })();