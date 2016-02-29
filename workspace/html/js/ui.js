 /*global createjs*/
 /*global utils*/
 /*global resources*/
 /*global game*/

 var ui = (function() {

   var pub = {};

   var INV_BORDER = 10;
   var INV_SPACING = 10;
   var INV_LINE = 10;
   var INV_SIZE = 20;
   var TEXT_SIZE = 10;

   var invContent = [];

   var invCont;
   var stateCont;
   var charCont;

   var itemsCont;

   var toggleFlag = true;

   pub.isMouseInUI = function(x, y) {

     var uiConts = [invCont, charCont, stateCont];

     var uiHit = false;
     uiConts.forEach(function(item) {
       if (item.hitTest(x - item.x, y - item.y) == true) {
         uiHit = true;
         return;
       }
     });

     return uiHit;

   };

   pub.init = function(callback) {

     // inventář
     (function() {

       // vnější kontejner
       invCont = new createjs.Container();
       invCont.x = 20;
       invCont.y = game.canvas.height - 150 - 20;
       game.stage.addChild(invCont);

       var outerShape = new createjs.Shape();
       outerShape.graphics.setStrokeStyle(2);
       outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
       outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
       outerShape.graphics.drawRect(0, 0, 450, 150);
       invCont.addChild(outerShape);

       // kontejner položek
       itemsCont = new createjs.Container();
       itemsCont.x = INV_BORDER;
       itemsCont.y = INV_BORDER;
       invCont.addChild(itemsCont);
     })();

     // přehled postavy
     (function() {

       var CHAR_WIDTH = 300;
       var CHAR_HEIGHT = 500;

       var HELMET_WIDTH = 100;
       var HELMET_HEIGHT = 100;

       var TORSO_WIDTH = 200;
       var TORSO_HEIGHT = 150;

       var GAUNTLET_WIDTH = 100;
       var GAUNTLET_HEIGHT = 100;

       // vnější kontejner
       charCont = new createjs.Container();
       charCont.x = game.canvas.width - CHAR_WIDTH - 20;
       charCont.y = 40 + 200;
       game.stage.addChild(charCont);

       var outerShape = new createjs.Shape();
       outerShape.graphics.setStrokeStyle(2);
       outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
       outerShape.graphics.beginFill("rgba(70,50,10,0.5)");
       outerShape.graphics.drawRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
       charCont.addChild(outerShape);

       // helmet
       var helmetCont = new createjs.Container();
       helmetCont.x = CHAR_WIDTH / 2 - HELMET_WIDTH / 2;
       helmetCont.y = 20;
       charCont.addChild(helmetCont);

       var helmetBgrShape = new createjs.Shape();
       helmetBgrShape.graphics.setStrokeStyle(2);
       helmetBgrShape.graphics.beginStroke("rgba(0,0,0,0.7)");
       helmetBgrShape.graphics.beginFill("rgba(70,50,10,0.5)");
       helmetBgrShape.graphics.drawRect(0, 0, HELMET_WIDTH, HELMET_HEIGHT);
       helmetCont.addChild(helmetBgrShape);

       var helmet = resources.getBitmap(resources.HELMET_KEY);
       helmet.x = 0;
       helmet.y = 0;
       helmetCont.addChild(helmet);

       // torso
       var torsoCont = new createjs.Container();
       torsoCont.x = CHAR_WIDTH / 2 - TORSO_WIDTH / 2;
       torsoCont.y = 20 + HELMET_HEIGHT + 20;
       charCont.addChild(torsoCont);

       var torsoBgrShape = new createjs.Shape();
       torsoBgrShape.graphics.setStrokeStyle(2);
       torsoBgrShape.graphics.beginStroke("rgba(0,0,0,0.7)");
       torsoBgrShape.graphics.beginFill("rgba(70,50,10,0.5)");
       torsoBgrShape.graphics.drawRect(0, 0, TORSO_WIDTH, TORSO_HEIGHT);
       torsoCont.addChild(torsoBgrShape);

       var torso = resources.getBitmap(resources.TORSO_KEY);
       torso.x = 0;
       torso.y = 0;
       torsoCont.addChild(torso);

       // gauntlet
       var gauntletCont = new createjs.Container();
       gauntletCont.x = 20;
       gauntletCont.y = 20 + HELMET_HEIGHT + 20 + TORSO_HEIGHT + 20;
       charCont.addChild(gauntletCont);

       var gauntletBgrShape = new createjs.Shape();
       gauntletBgrShape.graphics.setStrokeStyle(2);
       gauntletBgrShape.graphics.beginStroke("rgba(0,0,0,0.7)");
       gauntletBgrShape.graphics.beginFill("rgba(70,50,10,0.5)");
       gauntletBgrShape.graphics.drawRect(0, 0, GAUNTLET_WIDTH, GAUNTLET_HEIGHT);
       gauntletCont.addChild(gauntletBgrShape);

       var gauntlet = resources.getBitmap(resources.GAUNTLET_KEY);
       gauntlet.x = 0;
       gauntlet.y = 0;
       gauntletCont.addChild(gauntlet);

     })();

     // zdraví a mana
     (function() {
       stateCont = new createjs.Container();
       stateCont.width = 350;
       stateCont.height = 160;
       stateCont.x = game.canvas.width - stateCont.width - 20;
       stateCont.y = game.canvas.height - stateCont.height - 20;

       var outerShape = new createjs.Shape();
       outerShape.graphics.setStrokeStyle(2);
       outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
       outerShape.graphics.beginFill("rgba(255,0,0,0.7)");
       outerShape.graphics.drawRect(0, 80, 250, 25);
       outerShape.graphics.beginFill("rgba(70,30,255,0.7)");
       outerShape.graphics.drawRect(0, 110, 250, 25);
       stateCont.addChild(outerShape);

       var skull = resources.getBitmap(resources.SKULL_KEY);
       skull.x = stateCont.width - skull.image.width;
       skull.y = stateCont.height - skull.image.height;
       stateCont.addChild(skull);
       game.stage.addChild(stateCont);
     })();

     if (typeof callback !== "undefined") {
       callback();
     }
   };

   pub.showInv = function() {
     invCont.visible = true;
   };

   pub.hideInv = function() {
     invCont.visible = false;
   };

   pub.toggleInv = function() {
     if (toggleFlag) {
       invCont.visible = !(invCont.visible);
       toggleFlag = false;
     }
   };

   pub.prepareForToggleInv = function() {
     toggleFlag = true;
   };

   pub.invInsert = function(item, quant) {
     // zkus zvýšit počet
     for (var i = 0; i < INV_SIZE; i++) {
       if (typeof invContent[i] !== "undefined" && invContent[i].item == item) {
         invContent[i].quant += quant;
         invContent[i].count.text = invContent[i].quant;
         return true; // přidáno
       }
     }
     // zkus založit novou
     for (var i = 0; i < INV_SIZE; i++) {
       if (typeof invContent[i] === "undefined") {
         var bitmapCont = new createjs.Container();
         var bitmap = resources.getItemBitmap(item);
         bitmapCont.addChild(bitmap);
         itemsCont.addChild(bitmapCont);
         bitmap.x = (i % INV_LINE) * (resources.PARTS_SIZE + INV_SPACING);
         bitmap.y = Math.floor(i / INV_LINE) * (resources.PARTS_SIZE + INV_SPACING);
         var text = new createjs.Text(quant, "bold " + TEXT_SIZE + "px Arial", "#ff0");
         itemsCont.addChild(text);
         text.x = bitmap.x;
         text.y = bitmap.y + resources.PARTS_SIZE - TEXT_SIZE;
         invContent[i] = {
           item: item,
           quant: quant,
           element: bitmap,
           count: text
         };

         bitmap.on("rollover", function(evt) {
           this.scaleX = this.scaleY = 1.2;
         });

         bitmap.on("rollout", function(evt) {
           this.scaleX = this.scaleY = 1;
         });


         return true; // usazeno
       }
     }
     return false; // nevešel se
   };

   return pub;

 })();