 /*global createjs*/
 /*global game*/

 var ui = (function() {

   var pub = {};

   var INV_KEY = "INV_KEY";

   var loader;
   var manifest = [{
     src: "ui/inventory.png",
     id: INV_KEY
   }];

   var invCont;
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

     invCont = new createjs.Container();
     invCont.visible = false;
     invCont.x = game.canvas.width / 2 - inv.image.width / 2;
     invCont.y = game.canvas.height / 2 - inv.image.height / 2;
     invCont.addChild(inv);
     game.stage.addChild(invCont);

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

   return pub;

 })();