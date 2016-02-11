 /*global createjs*/
 /*global game*/
 /*global hero*/
 /*global utils*/
 /*global background*/
 /*global generator*/
 /*global resources*/
 /*global render*/

 /**
  * world.js
  * 
  * Stará se o interakce ve světě
  * 
  */
 var world = (function() {

   var pub = {};

   /*-----------*/
   /* CONSTANTS */
   /*-----------*/

   // Pixel/s
   var HERO_HORIZONTAL_SPEED = 300;
   var HERO_VERTICAL_SPEED = 32;

   // Pixel/s2
   var WORLD_GRAVITY = 60;

   /*-----------*/
   /* VARIABLES */
   /*-----------*/

   var initialized = false;

   var heroSprite;
   var heroSpeed = {
     x: 0,
     y: 0
   };
   var heroJumpTime = 0;

   var pointer;

   var collisionLabel;

   var isMouseDown = false;

   var tilesMap;

   /*---------*/
   /* METHODS */
   /*---------*/

   pub.init = function(callback) {

     // Generování nové mapy
     tilesMap = generator.generate();

     // Předání mapy renderu
     render.init(function() {
       construct();
       if (typeof callback !== "undefined") {
         callback();
       }
     }, tilesMap);

   };

   var movePointer = function(x, y) {
     var coord = render.pixelsToTiles(x, y);
     var clsn = isCollisionByTiles(coord.x, coord.y);
     if (typeof collisionLabel !== "undefined") {
       var index = tilesMap.indexAt(coord.x, coord.y);
       var type = tilesMap.map[index];
       collisionLabel.text = "tile x: " + clsn.result.x + " y: " + clsn.result.y + " clsn: " + clsn.hit + " index: " + index + " type: " + type;
     }
     if (clsn.hit) {
       var pixels = render.tilesToPixel(utils.even(clsn.result.x), utils.even(clsn.result.y));
       pointer.x = pixels.x;
       pointer.y = pixels.y - resources.TILE_SIZE; // počátek je vlevo dole
       pointer.visible = true;
     }
     else {
       //pointer.visible = false;
     }
   };

   var construct = function() {

     /*------------*/
     /* Characters */
     /*------------*/
     hero.init(function() {
       heroSprite = hero.sprite();
       game.stage.addChild(heroSprite);

       heroSprite.x = game.canvas.width / 2;
       heroSprite.y = game.canvas.height / 2 - 200;

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
         g.rect(0, 0, resources.TILE_SIZE * 2, resources.TILE_SIZE * 2);
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
           render.dig(event.stageX, event.stageY);
         });
       })();

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
           render.shiftY(rndDst);
           // Horizontální pohyb se projevuje na pozadí
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
             clsnPosition = render.tilesToPixel(clsnTest.result.x, clsnTest.result.y);
             makeShiftY(-1 * (clsnPosition.y - resources.TILE_SIZE - (heroSprite.y + hero.height - hero.collYOffset)));

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
           render.shiftX(rndDst);
           // Horizontální pohyb se projevuje na pozadí
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
           clsnPosition = render.tilesToPixel(clsnTest.result.x, clsnTest.result.y);
           if (distanceX > 0) {
             // narazil jsem do něj zprava
             makeShiftX(heroSprite.x + hero.collXOffset - (clsnPosition.x + resources.TILE_SIZE) - 1);
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
     var result = render.pixelsToTiles(x, y);
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
       if (xSign * (xShift + xSign * resources.TILE_SIZE) > xSign * fullXShift) {
         xShift = fullXShift;
       }
       else {
         xShift += xSign * resources.TILE_SIZE;
       }

       if (ySign * (yShift + ySign * resources.TILE_SIZE) > ySign * fullYShift) {
         yShift = fullYShift;
       }
       else {
         yShift += ySign * resources.TILE_SIZE;
       }

       width = 0;
       while (width != fullWidth) {
         if (width + resources.TILE_SIZE > fullWidth) {
           width = fullWidth;
         }
         else {
           width += resources.TILE_SIZE;
         }

         height = 0;
         while (height != fullHeight) {
           if (height + resources.TILE_SIZE > fullHeight) {
             height = fullHeight;
           }
           else {
             height += resources.TILE_SIZE;
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