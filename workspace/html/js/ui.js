 /*global createjs*/
 /*global utils*/
 /*global resources*/
 /*global game*/

 var ui = (function() {

   var pub = {};

   var INV_KEY = "INV_KEY";
   var INV_BORDER = 30;
   var INV_SPACING = 10;
   var INV_LINE = 10;
   var INV_SIZE = 20;
   var TEXT_SIZE = 10;

   var invContent = [];

   var loader;
   var manifest = [{
     src: "ui/inventory.png",
     id: INV_KEY
   }];

   var invCont;
   var itemsCont;
   var toggleFlag = true;

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

   var construct = function() {

     var inv = new createjs.Bitmap(loader.getResult(INV_KEY));

     // vnější kontejner
     invCont = new createjs.Container();
     invCont.visible = false;
     invCont.x = game.canvas.width / 2 - inv.image.width / 2;
     invCont.y = game.canvas.height / 2 - inv.image.height / 2;
     invCont.addChild(inv);
     game.stage.addChild(invCont);

     // kontejner položek
     itemsCont = new createjs.Container();
     itemsCont.x = INV_BORDER;
     itemsCont.y = INV_BORDER;
     invCont.addChild(itemsCont);

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
         var bitmap = resources.getItemBitmap(item);
         itemsCont.addChild(bitmap);
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
         return true; // usazeno
       }
     }
     return false; // nevešel se
   };

   return pub;

 })();