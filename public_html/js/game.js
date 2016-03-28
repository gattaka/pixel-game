/*global createjs*/
/*global background*/
/*global world*/
/*global ui*/
/*global resources*/
var lich = lich || {};
game = (function () {

    /*-----------*/
    /* CONSTANTS */
    /*-----------*/

    var CANVAS_ID = "theCanvas";

    var pub = {};

    var fpsLabel;
    var mouseLabel;
    var world;
    var ui;
    var initialized = false;

    var mouse = {
        down: false,
        click: false,
        x: 0,
        y: 0
    };

    pub.init = function () {

        /*------------*/
        /* Stage init */
        /*------------*/

        console.log("running");

        var canvas = document.getElementById(CANVAS_ID);
        canvas.style.backgroundColor = "#b1ecff";
        pub.canvas = canvas;

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

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

        /*--------------*/
        /* Mouse events */
        /*--------------*/

        (function () {
            // Všechno musí být s prefixem 'stage' jinak se bude snažit chytat 
            // eventy s ohledem na konkrétní objekty a to se drasticky projevuje 
            // na FPS -- takhle se zjišťuje event obecně a je to bez ztrát 
            game.stage.addEventListener("stagemousedown", function (event) {
                mouse.x = event.stageX;
                mouse.y = event.stageY;
                mouse.down = true;
            });
            game.stage.addEventListener("stagemousemove", function (event) {
                mouse.x = event.stageX;
                mouse.y = event.stageY;
            });
            game.stage.addEventListener("stagemouseup", function (event) {
                mouse.down = false;
            });
        })();

        /*----------------*/
        /* Resources init */
        /*----------------*/
        resources.init(function () {

            ui = new lich.UI();
            pub.ui = ui;
            world = new lich.World(ui);
            stage.addChild(world);
            stage.addChild(ui);

            /*---------------------*/
            /* Measurements, debug */
            /*---------------------*/
            console.log("Measurements init");

            fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#00f");
            stage.addChild(fpsLabel);
            fpsLabel.x = 10;
            fpsLabel.y = 10;

            stage.addEventListener("stagemousemove", handleMouseMove);
            mouseLabel = new createjs.Text("PIXELS x: - y: -", "bold 18px Arial", "#00f");
            stage.addChild(mouseLabel);
            mouseLabel.x = 10;
            mouseLabel.y = 30;

            function handleMouseMove(event) {
                if (typeof mouseLabel !== "undefined") {
                    mouseLabel.text = "x: " + event.stageX + " y: " + event.stageY;
                }
            }

            initialized = true;
        });

        /*-----------*/
        /* Time init */
        /*-----------*/
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", handleTick);
        createjs.Ticker.setFPS(60);

        function handleTick(event) {
            var delta = event.delta;

            if (initialized) {

                // Measurements
                if (typeof fpsLabel !== "undefined") {
                    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
                }

                // Idle
                world.handleTick(delta);

                // UI má při akcích myši přednost
                if (ui.isMouseInUI(mouse.x, mouse.y)) {
                    ui.handleMouse(mouse, delta);
                } else {
                    world.handleMouse(mouse, delta);
                }

                // Při delším prodlení (nízké FPS) bude akcelerace působit 
                // fakticky delší dobu, ale hra nemá možnost zjistit, že hráč
                // už nedrží např. šipku -- holt "LAG" :)

                // Controls
                var directions = {
                    up: false,
                    down: false,
                    left: false,
                    right: false
                };
                if (keys[37] || keys[65])
                    directions.left = true;
                if (keys[38] || keys[87])
                    directions.up = true;
                if (keys[39] || keys[68])
                    directions.right = true;
                if (keys[40] || keys[83])
                    directions.down = true;
                if (keys[73]) {
                    ui.inventoryUI.toggleInv();
                } else {
                    ui.inventoryUI.prepareForToggleInv();
                }

                world.update(delta, directions);
            }

            stage.update();
        }
    };

    return pub;
})();