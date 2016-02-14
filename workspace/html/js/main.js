 /*global createjs*/
 /*global background*/
 /*global world*/
 /*global ui*/
 /*global resources*/

 var game = (function() {

 	/*-----------*/
 	/* CONSTANTS */
 	/*-----------*/

 	var CANVAS_ID = "theCanvas";

 	var pub = {};

 	pub.init = function() {

 		/*------------*/
 		/* Stage init */
 		/*------------*/

 		console.log("running");

 		var canvas = document.getElementById(CANVAS_ID);
 		pub.canvas = canvas;
 		canvas.width = document.body.clientWidth;
 		canvas.height = window.innerHeight - 50;
 		canvas.style.backgroundColor = "#b1ecff";

 		var fpsLabel;
 		var mouseLabel;

 		var stage = new createjs.Stage(CANVAS_ID);
 		pub.stage = stage;

 		/*----------*/
 		/* Controls */
 		/*----------*/

 		var keys = {};
 		pub.keys = keys;

 		function keydown(event) {
 			keys[event.keyCode] = true;
 		}

 		function keyup(event) {
 			delete keys[event.keyCode];
 		}

 		document.onkeydown = keydown;
 		document.onkeyup = keyup;


 		/*-----------------*/
 		/* Background init */
 		/*-----------------*/
 		background.init(function() {

 			/*----------------*/
 			/* Resources init */
 			/*----------------*/
 			resources.init(function() {

 				/*---------*/
 				/* UI init */
 				/*---------*/
 				world.init(function() {

 					/*----------*/
 					/* Map init */
 					/*----------*/
 					ui.init(function() {

 						/*---------------------*/
 						/* Measurements, debug */
 						/*---------------------*/
 						console.log("Measurements init");

 						fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#00f");
 						stage.addChild(fpsLabel);
 						fpsLabel.x = 10;
 						fpsLabel.y = 10;

 						stage.addEventListener("stagemousemove", handleMouseMove);
 						mouseLabel = new createjs.Text("x: - y: -", "bold 18px Arial", "#00f");
 						stage.addChild(mouseLabel);
 						mouseLabel.x = 10;
 						mouseLabel.y = 30;

 						function handleMouseMove(event) {
 							if (typeof mouseLabel !== "undefined") {
 								mouseLabel.text = "x: " + event.stageX + " y: " + event.stageY;
 							}
 						}

 					});
 				});


 			});

 		});

 		/*-----------*/
 		/* Time init */
 		/*-----------*/
 		createjs.Ticker.timingMode = createjs.Ticker.RAF;
 		createjs.Ticker.addEventListener("tick", handleTick);
 		createjs.Ticker.setFPS(60);

 		function handleTick(event) {
 			var delta = event.delta;

 			// Measurements
 			if (typeof fpsLabel !== "undefined") {
 				fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
 			}

 			// Idle
 			background.handleTick(delta);
 			world.handleTick(delta);

 			// Controls
 			var directions = {
 				up: false,
 				down: false,
 				left: false,
 				right: false
 			};
 			if (keys[37] || keys[65]) directions.left = true;
 			if (keys[38] || keys[87]) directions.up = true;
 			if (keys[39] || keys[68]) directions.right = true;
 			if (keys[40] || keys[83]) directions.down = true;
 			if (keys[73]) {
 				ui.toggleInv();
 			}
 			else {
 				ui.prepareForToggleInv();
 			}

 			world.shift(delta, directions);

 			stage.update();
 		}
 	};

 	return pub;
 })();