 /*global createjs*/

 var hero = (function() {

   var pub = {};

   /*-----------*/
   /* CONSTANTS */
   /*-----------*/

   var LICH_KEY = "LICH_KEY";

   var WALKR_STATE = "WALKR_STATE";
   var WALKL_STATE = "WALKL_STATE";
   var IDLE_STATE = "IDLE_STATE";
   var JUMP_STATE = "JUMP_STATE";
   var JUMPR_STATE = "JUMPR_STATE";
   var JUMPL_STATE = "JUMPL_STATE";
   var MIDAIR_STATE = "MIDAIR_STATE";
   var FALL_STATE = "FALL_STATE";

   var WIDTH = 46;
   var HEIGHT = 64;

   /*-----------*/
   /* VARIABLES */
   /*-----------*/

   pub.sprite;
   pub.width = WIDTH;
   pub.height = HEIGHT;
   pub.speedx = 0;
   pub.speedy = 0;

   // Collision offset
   pub.collXOffset = 10;
   pub.collYOffset = 2;

   var stateAnimation = {
     WALKR_STATE: "walkR",
     WALKL_STATE: "walkL",
     IDLE_STATE: "idle",
     JUMP_STATE: "jump",
     JUMPR_STATE: "jumpR",
     JUMPL_STATE: "jumpL",
     MIDAIR_STATE: "midair",
     FALL_STATE: "fall"
   };

   var state = IDLE_STATE;

   var loader;
   var initialized = false;

   var manifest = [{
     src: "lich_animation.png",
     id: LICH_KEY
   }];

   /*---------*/
   /* METHODS */
   /*---------*/

   pub.init = function(callback) {
     loader = new createjs.LoadQueue(false);
     loader.addEventListener("complete", function() {
       var spriteSheet = new createjs.SpriteSheet({
         framerate: 10,
         "images": [loader.getResult(LICH_KEY)],
         "frames": {
           "regX": 0,
           "height": HEIGHT,
           "count": 28,
           "regY": 0,
           "width": WIDTH
         },
         "animations": {
           "idle": [0, 0, "breath", 0.005],
           "breath": [1, 1, "idle", 0.04],
           "walkR": [2, 9, "walkR", 0.2],
           "walkL": [10, 17, "walkL", 0.2],
           "jump": [18, 19, "midair", 0.2],
           "midair": [19, 19, "midair", 0.2],
           "fall": [19, 23, "idle", 0.2],
           "jumpR": [25, 25, "jumpR", 0.2],
           "jumpL": [27, 27, "jumpL", 0.2],
         }
       });
       pub.sprite = new createjs.Sprite(spriteSheet, "idle");

       if (typeof callback !== "undefined") {
         callback();
       }
     });
     loader.loadManifest(manifest, true, "images/characters/");
   };

   pub.shift = function(shift) {
     if (initialized) {}
   };

   pub.handleTick = function(delta) {};

   var performState = function(desiredState) {
     if (state != desiredState) {
       pub.sprite.gotoAndPlay(stateAnimation[desiredState]);
       state = desiredState;
     }
   };

   pub.walkL = function() {
     performState(WALKL_STATE);
   };

   pub.walkR = function() {
     performState(WALKR_STATE);
   };

   pub.idle = function() {
     performState(IDLE_STATE);
   };

   pub.jump = function() {
     performState(JUMP_STATE);
   };

   pub.jumpR = function() {
     performState(JUMPR_STATE);
   };

   pub.jumpL = function() {
     performState(JUMPL_STATE);
   };

   pub.midair = function() {
     performState(MIDAIR_STATE);
   };

   pub.fall = function() {
     performState(FALL_STATE);
   };

   pub.updateAnimations = function() {
     if (pub.speedx == 0 && pub.speedy == 0) {
       pub.idle();
     }
     else if (pub.speedy != 0) {
       if (pub.speedx == 0) {
         pub.jump();
       }
       else if (pub.speedx > 0) {
         pub.jumpL();
       }
       else {
         pub.jumpR();
       }
     }
     else {
       if (pub.speedx > 0) {
         pub.walkL();
       }
       if (pub.speedx < 0) {
         pub.walkR();
       }
     }
   };

   return pub;

 })();