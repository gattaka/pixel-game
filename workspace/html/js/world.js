 /*global createjs*/
 /*global game*/
 /*global hero*/
 /*global utils*/
 /*global background*/
 /*global generator*/

 var world = (function() {

   var pub = {};

   /*-----------*/
   /* CONSTANTS */
   /*-----------*/

   var TILE_SIZE = 16;

   var TILES_KEY = "TILES_KEY";

   // Pixel/s
   var HERO_HORIZONTAL_SPEED = 300;
   var HERO_VERTICAL_SPEED = 32;

   // Pixel/s2
   var WORLD_GRAVITY = 60;

   /*-----------*/
   /* VARIABLES */
   /*-----------*/

   var loader;
   var initialized = false;

   var manifest = [{
     src: "tiles/tiles.png",
     id: TILES_KEY
   }, {
     src: "parts/tree.png",
     id: generator.TREE_KEY
   }, {
     src: "parts/tree2.png",
     id: generator.TREE2_KEY
   }, {
     src: "parts/mound.png",
     id: generator.MOUND_KEY
   }, {
     src: "parts/plant.png",
     id: generator.PLANT_KEY
   }, {
     src: "parts/grass.png",
     id: generator.GRASS_KEY
   }, {
     src: "parts/grass2.png",
     id: generator.GRASS2_KEY
   }, {
     src: "parts/grass3.png",
     id: generator.GRASS3_KEY
   }, {
     src: "parts/grass4.png",
     id: generator.GRASS4_KEY
   }];

   // Levý spodní roh
   var tilesMap;

   var spawnPoint = {
     row: -2,
     col: 20
   };
   var screenOffsetX = 0;
   var screenOffsetY = 0;

   var sceneObjects;
   var sceneObjectsMap = [];

   var startX = 0;
   var startY = 550;

   var heroSprite;
   var heroSpeed = {
     x: 0,
     y: 0
   };
   var heroJumpTime = 0;

   var pointer;

   var collisionLabel;

   var isMouseDown = false;

   /*---------*/
   /* METHODS */
   /*---------*/

   pub.init = function(callback) {

     // Generování nové mapy
     tilesMap = generator.generate();

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

   var pixelsToTiles = function(x, y) {
     // floor, aby zahrnul rozpůlenou buňku, ale přitom pole mapy začíná indexu 0
     var tileX = Math.ceil((x - screenOffsetX - startX) / TILE_SIZE) - 1;
     // ceil protože počítám pozici od spodního okraje
     var tileY = Math.ceil((y - screenOffsetY - startY) / TILE_SIZE);
     return {
       x: tileX,
       y: tileY
     };
   };

   var tilesToPixel = function(x, y) {
     var screenX = x * TILE_SIZE + screenOffsetX + startX;
     var screenY = y * TILE_SIZE + screenOffsetY + startY;
     return {
       x: screenX,
       y: screenY
     };
   };

   var movePointer = function(x, y) {
     var coord = pixelsToTiles(x, y);
     var clsn = isCollisionByTiles(coord.x, coord.y);
     if (typeof collisionLabel !== "undefined") {
       var index = tilesMap.indexAt(coord.x, coord.y);
       var type = tilesMap.map[index];
       collisionLabel.text = "tile x: " + clsn.result.x + " y: " + clsn.result.y + " clsn: " + clsn.hit + " index: " + index + " type: " + type;
     }
     if (clsn.hit) {
       var pixels = tilesToPixel(utils.even(clsn.result.x), utils.even(clsn.result.y));
       pointer.x = pixels.x;
       pointer.y = pixels.y - TILE_SIZE; // počátek je vlevo dole
       pointer.visible = true;
     }
     else {
       //pointer.visible = false;
     }
   };

   var construct = function() {

     sceneObjects = new createjs.Container();
     game.stage.addChild(sceneObjects);
     sceneObjects.x = 0;
     sceneObjects.y = 0;
     sceneObjects.width = game.canvas.width * 1.5;
     sceneObjects.height = game.canvas.height * 1.5;

     /*-----------*/
     /* Map tiles */
     /*-----------*/
     var placeTile = function(v, row, col) {
       if (v > 0) {
         var tile;
         tile = new createjs.Bitmap(loader.getResult(TILES_KEY));
         var tileCols = tile.image.width / TILE_SIZE;
         // Otestováno: tohle je rychlejší než extract ze Spritesheet
         tile.sourceRect = {
           x: ((v - 1) % tileCols) * TILE_SIZE,
           y: Math.floor((v - 1) / tileCols) * TILE_SIZE,
           height: TILE_SIZE,
           width: TILE_SIZE
         };

         sceneObjects.addChild(tile);
         var mapCol = sceneObjectsMap[col];
         if (typeof mapCol === "undefined") {
           mapCol = [];
           sceneObjectsMap[col] = mapCol;
         }
         mapCol[row] = tile;
         var pos = tilesToPixel(col, row);
         tile.x = pos.x;
         tile.y = pos.y - TILE_SIZE;
       }
     };

     for (var i = 0; i < tilesMap.map.length; i++) {
       var col = i % tilesMap.width;
       var row = Math.floor(i / tilesMap.width);
       placeTile(tilesMap.map[i], row, col);
     }

     /*-------------*/
     /* Map objects */
     /*-------------*/
     tilesMap.objects.forEach(function(item) {
       var objType = generator.dirtObjects[item.obj];
       var object = new createjs.Bitmap(loader.getResult(objType.key));
       var pos = tilesToPixel(item.x, item.y);
       object.x = pos.x;
       object.y = pos.y - objType.height * TILE_SIZE - TILE_SIZE * 0.5;
       sceneObjects.addChild(object);
     });

     /*------------*/
     /* Characters */
     /*------------*/
     hero.init(function() {
       heroSprite = hero.sprite();
       game.stage.addChild(heroSprite);

       var pixelPosition = tilesToPixel(spawnPoint.col, spawnPoint.row);
       var frameBounds = heroSprite.spriteSheet.getFrameBounds(heroSprite.currentFrame);
       heroSprite.x = pixelPosition.x - frameBounds.width / 2 + TILE_SIZE / 2;
       heroSprite.y = pixelPosition.y - frameBounds.height;

       /*---------------------*/
       /* Measurements, debug */
       /*---------------------*/
       collisionLabel = new createjs.Text("x: - y: -", "bold 18px Arial", "#00f");
       game.stage.addChild(collisionLabel);
       collisionLabel.x = 10;
       collisionLabel.y = 50;

       /*---------*/
       /* Pointer */
       /*---------*/
       (function() {
         pointer = new createjs.Shape();
         var g = pointer.graphics;
         g.setStrokeStyle(1);
         g.beginFill("rgba(255,255,0,0.5)");
         g.beginStroke("#000");
         g.rect(0, 0, TILE_SIZE * 2, TILE_SIZE * 2);
         game.stage.addChild(pointer);
         pointer.visible = false;
         game.stage.addEventListener("stagemousemove", function(event) {
           movePointer(event.stageX, event.stageY);
         });
       })();

       /*-------------*/
       /* Click event */
       /*-------------*/

       (function() {
         game.stage.addEventListener("mousedown", function(event) {
           console.log("mousedown " + event.stageX + ":" + event.stageY);
         });
       })();

       (function() {
         game.stage.addEventListener("mouserelease", function(event) {
           console.log("mouseup " + event.stageX + ":" + event.stageY);
         });
       })();

       //isMouseDown

       (function() {
         game.stage.addEventListener("click", function(event) {
           console.log("click " + event.stageX + ":" + event.stageY);
           var coord = pixelsToTiles(event.stageX, event.stageY);
           //generator.modify(tilesMap, coord.x, coord.y);

           var tilesToReset = [];

           var rx = utils.even(coord.x);
           var ry = utils.even(coord.y);
           (function() {
             for (var x = rx - 1; x <= rx + 2; x++) {
               for (var y = ry - 1; y <= ry + 2; y++) {
                 var index = tilesMap.indexAt(x, y);
                 if (index >= 0) {
                   if (x == rx - 1 || x == rx + 2 || y == ry - 1 || y == ry + 2) {

                     // okraje vyresetuj
                     if (tilesMap.map[index] != generator.VOID) {
                       tilesMap.map[index] = generator.DIRT.M1;
                       tilesToReset.push([x, y]);

                       var tile = sceneObjectsMap[x][y];
                       var v = tilesMap.map[index];
                       var tileCols = tile.image.width / TILE_SIZE;
                       tile.sourceRect = {
                         x: ((v - 1) % tileCols) * TILE_SIZE,
                         y: Math.floor((v - 1) / tileCols) * TILE_SIZE,
                         height: TILE_SIZE,
                         width: TILE_SIZE
                       };

                     }

                   }
                   else {
                     tilesMap.map[index] = generator.VOID;
                     sceneObjects.removeChild(sceneObjectsMap[x][y]);
                   }
                 }
               }
             }
           })();


           // Přegeneruj hrany
           (function() {
             tilesToReset.forEach(function(item) {
               var x = item[0];
               var y = item[1];
               var tile = sceneObjectsMap[x][y];
               var v = generator.generateEdge(tilesMap, x, y);
               var tileCols = tile.image.width / TILE_SIZE;
               tile.sourceRect = {
                 x: ((v - 1) % tileCols) * TILE_SIZE,
                 y: Math.floor((v - 1) / tileCols) * TILE_SIZE,
                 height: TILE_SIZE,
                 width: TILE_SIZE
               };
             });
           })();

           // Přegeneruj rohy
           (function() {
             tilesToReset.forEach(function(item) {
               var x = item[0];
               var y = item[1];
               var tile = sceneObjectsMap[x][y];
               var v = generator.generateCorner(tilesMap, x, y);
               var tileCols = tile.image.width / TILE_SIZE;
               tile.sourceRect = {
                 x: ((v - 1) % tileCols) * TILE_SIZE,
                 y: Math.floor((v - 1) / tileCols) * TILE_SIZE,
                 height: TILE_SIZE,
                 width: TILE_SIZE
               };
             });
           })();

           sceneObjects.updateCache();

         });
       })();

       // vygenerováno ... nacachuj
       // cachuje se od y= -TILE_SIZE protože tiles mají počátek vlevo DOLE
       // http://www.createjs.com/docs/easeljs/classes/Container.html#method_cache
       sceneObjects.cache(0, -TILE_SIZE, game.canvas.width, game.canvas.height);

       console.log("earth ready");
       initialized = true;
     });

   };

   pub.shift = function(delta, directions) {
     if (initialized) {

       var clsnTest;
       var clsnPosition;

       // Při delším prodlení (nízké FPS) bude akcelerace působit 
       // fakticky delší dobu, ale hra nemá možnost zjistit, že hráč
       // už nedrží např. šipku -- holt "LAG" :)
       var sDelta = delta / 1000; // ms -> s

       // Dle kláves nastav rychlosti
       // Nelze akcelerovat nahoru, když už 
       // rychlost mám (nemůžu skákat ve vzduchu)
       if (directions.up && heroSpeed.y == 0) {
         heroSpeed.y = HERO_VERTICAL_SPEED;
         heroJumpTime = 0;
       }
       else if (directions.down) {
         // TODO
       }

       // Horizontální akcelerace
       if (directions.left) {
         heroSpeed.x = HERO_HORIZONTAL_SPEED;
       }
       else if (directions.right) {
         heroSpeed.x = -HERO_HORIZONTAL_SPEED;
       }
       else {
         heroSpeed.x = 0;
       }

       // Spočítej projevy rychlosti na animace

       if (heroSpeed.x > 0) {
         hero.walkL();
       }
       if (heroSpeed.x < 0) {
         hero.walkR();
       }
       if (heroSpeed.x == 0 && heroSpeed.y == 0) {
         hero.idle();
       }

       if (heroSpeed.y != 0) {

         if (heroSpeed.x == 0) {
           hero.jump();
         }
         else if (heroSpeed.x > 0) {
           hero.jumpL();
         }
         else {
           hero.jumpR();
         }

         // s_tx = tx * (v0 - g*tx)
         heroJumpTime += sDelta;
         var gravitySpeed = heroJumpTime * WORLD_GRAVITY;
         var distanceY = utils.floor(heroJumpTime * (heroSpeed.y - gravitySpeed));

         console.log("distanceY:" + distanceY + " heroSpeed.y:" + heroSpeed.y + " gravitySpeed:" + gravitySpeed);

         var makeShiftY = function(dst) {
           var rndDst = utils.floor(dst);
           // Horizontální pohyb se projevuje na pozadí
           screenOffsetY += rndDst;
           sceneObjects.y += rndDst;
           //movePointer(pointer.x + startX + screenOffsetX, pointer.y + startY + screenOffsetY - rndDst);
           background.shift(0, rndDst);
         };

         // Nenarazím na překážku?
         // TODO iterativně kontrolovat pro skoky > TILE_SIZE
         clsnTest = isBoundsInCollision(heroSprite.x + hero.collXOffset, heroSprite.y + hero.collYOffset, hero.width - hero.collXOffset * 2, hero.height - hero.collYOffset * 2, 0, distanceY);
         if (clsnTest.hit == false) {
           makeShiftY(distanceY);
         }
         else {
           // zastavil jsem se při stoupání? Začni hned padat
           if (distanceY > 0) {
             // nastav okamžik skoku, jako kdyby se vyrovnaly rychlosti
             heroJumpTime = heroSpeed.y / WORLD_GRAVITY;
             // animace pádu
             if (heroSpeed.x == 0) {
               hero.jump();
             }
             else if (heroSpeed.x > 0) {
               hero.jumpL();
             }
             else {
               hero.jumpR();
             }
           }
           // zastavil jsem se při pádu? Konec skoku
           else {

             // "doskoč" až na zem
             // získej pozici kolizního bloku
             clsnPosition = tilesToPixel(clsnTest.result.x, clsnTest.result.y);
             makeShiftY(-1 * (clsnPosition.y - TILE_SIZE - (heroSprite.y + hero.height - hero.collYOffset)));

             heroJumpTime = 0;
             heroSpeed.y = 0;
             // animace dopadu
             if (heroSpeed.x == 0) {
               hero.fall();
             }
             else if (heroSpeed.x > 0) {
               hero.walkL();
             }
             else {
               hero.walkR();
             }
           }
         }

       }

       if (heroSpeed.x != 0) {
         var distanceX = utils.floor(sDelta * heroSpeed.x);

         var makeShiftX = function(dst) {
           var rndDst = utils.floor(dst);
           // Horizontální pohyb se projevuje na pozadí
           screenOffsetX += rndDst;
           sceneObjects.x += rndDst;
           //movePointer(pointer.x + startX + screenOffsetX - rndDst, pointer.y + startY + screenOffsetY);
           background.shift(rndDst, 0);
         };

         // Nenarazím na překážku?
         // TODO iterativně kontrolovat pro skoky > TILE_SIZE
         clsnTest = isBoundsInCollision(heroSprite.x + hero.collXOffset, heroSprite.y + hero.collYOffset, hero.width - hero.collXOffset * 2, hero.height - hero.collYOffset * 2, distanceX, 0);
         if (clsnTest.hit == false) {
           makeShiftX(distanceX);
         }
         // zkus zmenšit posun, aby nebyla kolize
         else {
           // získej pozici kolizního bloku
           clsnPosition = tilesToPixel(clsnTest.result.x, clsnTest.result.y);
           if (distanceX > 0) {
             // narazil jsem do něj zprava
             makeShiftX(heroSprite.x + hero.collXOffset - (clsnPosition.x + TILE_SIZE) - 1);
           }
           else {
             // narazil jsem do něj zleva
             makeShiftX(-1 * (clsnPosition.x - (heroSprite.x + hero.width - hero.collXOffset) - 1));
           }
         }
       }

       // pokud nejsem zrovna uprostřed skoku...
       if (heroSpeed.y == 0) {
         // ...a mám kam padat
         clsnTest = isBoundsInCollision(heroSprite.x + hero.collXOffset, heroSprite.y + hero.collYOffset, hero.width - hero.collXOffset * 2, hero.height - hero.collYOffset * 2, 0, -1);
         if (clsnTest.hit == false) {
           heroSpeed.y = -WORLD_GRAVITY;
         }
       }

     }
   };

   var isCollision = function(x, y) {
     var result = pixelsToTiles(x, y);
     return isCollisionByTiles(result.x, result.y);
   };

   var isCollisionByTiles = function(x, y) {
     return {
       hit: tilesMap.valueAt(x, y) > 0,
       "result": {
         x: x,
         y: y
       }
     };
   };

   var isBoundsInCollision = function(x, y, fullWidth, fullHeight, fullXShift, fullYShift) {
     var tx;
     var ty;

     // kolize se musí dělat iterativně pro každý bod v TILE_SIZE podél hran objektu
     var xShift = 0;
     var yShift = 0;
     var width = 0;
     var height = 0;
     var xSign = utils.sign(fullXShift);
     var ySign = utils.sign(fullYShift);

     // pokud bude zadán fullXShift i fullYShift, udělá to diagonální posuv
     while (xShift != fullXShift || yShift != fullYShift) {
       if (xSign * (xShift + xSign * TILE_SIZE) > xSign * fullXShift) {
         xShift = fullXShift;
       }
       else {
         xShift += xSign * TILE_SIZE;
       }

       if (ySign * (yShift + ySign * TILE_SIZE) > ySign * fullYShift) {
         yShift = fullYShift;
       }
       else {
         yShift += ySign * TILE_SIZE;
       }

       width = 0;
       while (width != fullWidth) {
         if (width + TILE_SIZE > fullWidth) {
           width = fullWidth;
         }
         else {
           width += TILE_SIZE;
         }

         height = 0;
         while (height != fullHeight) {
           if (height + TILE_SIZE > fullHeight) {
             height = fullHeight;
           }
           else {
             height += TILE_SIZE;
           }

           if (xShift > 0 || yShift > 0) {
             tx = x - xShift;
             ty = y - yShift;
             var LT = isCollision(tx, ty);
             if (LT.hit) return LT;
           }

           if (xShift < 0 || yShift > 0) {
             tx = x + width - xShift;
             ty = y - yShift;
             var RT = isCollision(tx, ty);
             if (RT.hit) return RT;
           }

           if (xShift > 0 || yShift < 0) {
             tx = x - xShift;
             ty = y + height - yShift;
             var LB = isCollision(tx, ty);
             if (LB.hit) return LB;
           }

           if (xShift < 0 || yShift < 0) {
             tx = x + width - xShift;
             ty = y + height - yShift;
             var RB = isCollision(tx, ty);
             if (RB.hit) return RB;
           }

           if (xShift == fullXShift && yShift == fullYShift && width == fullWidth && height == fullHeight) {
             return {
               hit: false
             };
           }

         }
       }
     }

     return {
       hit: false
     };

   };

   pub.handleTick = function(delta) {
     // dle rychlosti kopání

   };

   return pub;

 })();