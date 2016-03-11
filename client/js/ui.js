 /*global createjs*/
 /*global utils*/
 /*global resources*/
 /*global game*/

 var ui = (function() {

   var pub = {};

   var INV_BORDER = 10;
   var INV_SPACING = 12;
   var INV_LINE = 10;
   var INV_SIZE = 20;
   var TEXT_SIZE = 10;

   var invContent = [];

   var uiConts = [];
   var invCont;
   var stateCont;
   var charCont;

   var itemsCont;

   var toggleFlag = true;

   pub.init = function(callback) {

     // inventář
     (function() {

       // vnější kontejner
       invCont = new createjs.Container();
       invCont.x = 20;
       invCont.y = game.canvas.height - 150 - 20;
       uiConts.push(invCont);
       game.stage.addChild(invCont);

       var outerShape = new createjs.Shape();
       outerShape.graphics.setStrokeStyle(2);
       outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
       outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
       outerShape.graphics.drawRect(0, 0, 450, 150);
       invCont.addChild(outerShape);

       // zvýraznění vybrané položky
       var itemHighlightShape = new createjs.Shape();
       itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
       itemHighlightShape.graphics.drawRoundRect(0, 0, resources.PARTS_SIZE + INV_SPACING, resources.PARTS_SIZE + INV_SPACING, 5);
       itemHighlightShape.x = INV_SPACING / 2;
       itemHighlightShape.y = INV_SPACING / 2;
       invCont.addChild(itemHighlightShape);

       // kontejner položek
       itemsCont = new createjs.Container();
       itemsCont.x = INV_BORDER;
       itemsCont.y = INV_BORDER;
       invCont.addChild(itemsCont);

       invCont.handleMouse = function(mouse) {
         if (mouse.down) {
           var step = INV_SPACING + resources.PARTS_SIZE;
           var x = Math.floor((mouse.x - invCont.x - INV_SPACING / 2) / step);
           var y = Math.floor((mouse.y - invCont.y - INV_SPACING / 2) / step);
           itemHighlightShape.x = x * step + INV_SPACING / 2;
           itemHighlightShape.y = y * step + INV_SPACING / 2;
         }
       };

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
       uiConts.push(charCont);
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
       uiConts.push(stateCont);
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

         bitmap.on("click", function(evt) {
           alert("clicked 3 times!");
         }, null, false);

         return true; // usazeno
       }
     }
     return false; // nevešel se
   };

   pub.isMouseInUI = function(x, y) {
     var uiHit = false;
     uiConts.forEach(function(item) {
       if (item.hitTest(x - item.x, y - item.y) == true) {
         uiHit = true;
         return;
       }
     });
     return uiHit;
   };

   pub.handleMouse = function(mouse, delta) {
     uiConts.forEach(function(item) {
       if (item.hitTest(mouse.x - item.x, mouse.y - item.y) == true) {
         if (typeof item.handleMouse !== "undefined") {
           item.handleMouse(mouse);
           return;
         }
       }
     });
   };

   return pub;

 })();