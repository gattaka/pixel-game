namespace Lich {
    export class Game {

        canvas: HTMLCanvasElement;
        stage: createjs.Stage;
        fpsLabel: createjs.Text;
        mouseLabel: createjs.Text;
        world;
        ui;
        initialized = false;
        keys = {};

        mouse = new Mouse();
        resources; 

        constructor(canvasId: string) {

            /*------------*/
            /* Stage init */
            /*------------*/

            console.log("running");

            this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            this.canvas.style.backgroundColor = "#b1ecff";

            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeCanvas, false);

            function resizeCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            resizeCanvas();

            this.stage = new createjs.Stage(this.canvas);

            /*----------*/
            /* Controls */
            /*----------*/

            this.keys = {};

            function keydown(event) {
                this.keys[event.keyCode] = true;
            }

            function keyup(event) {
                delete this.keys[event.keyCode];
            }

            document.onkeydown = keydown;
            document.onkeyup = keyup;

            /*--------------*/
            /* Mouse events */
            /*--------------*/

            (function() {
                // Všechno musí být s prefixem 'stage' jinak se bude snažit chytat 
                // eventy s ohledem na konkrétní objekty a to se drasticky projevuje 
                // na FPS -- takhle se zjišťuje event obecně a je to bez ztrát 
                this.stage.addEventListener("stagemousedown", function(event) {
                    this.mouse.x = event["stageX"];
                    this.mouse.y = event["stageY"];
                    this.mouse.down = true;
                });
                this.stage.addEventListener("stagemousemove", function(event) {
                    this.mouse.x = event["stageX"];
                    this.mouse.y = event["stageY"];
                });
                this.stage.addEventListener("stagemouseup", function(event) {
                    this.mouse.down = false;
                });
            })();

            /*----------------*/
            /* Resources init */
            /*----------------*/
            this.resources = new Resources(this, function() {

                this.ui = new UI(this);
                this.world = new World(this);
                this.stage.addChild(this.world);
                this.stage.addChild(this.ui);

                /*---------------------*/
                /* Measurements, debug */
                /*---------------------*/
                console.log("Measurements init");

                this.fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#00f");
                this.stage.addChild(this.fpsLabel);
                this.fpsLabel.x = 10;
                this.fpsLabel.y = 10;

                this.stage.addEventListener("stagemousemove", handleMouseMove);
                this.mouseLabel = new createjs.Text("PIXELS x: - y: -", "bold 18px Arial", "#00f");
                this.stage.addChild(this.mouseLabel);
                this.mouseLabel.x = 10;
                this.mouseLabel.y = 30;

                function handleMouseMove(event) {
                    if (typeof this.mouseLabel !== "undefined") {
                        this.mouseLabel.text = "x: " + event.stageX + " y: " + event.stageY;
                    }
                }

                this.initialized = true;
            });

            /*-----------*/
            /* Time init */
            /*-----------*/
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", handleTick);
            createjs.Ticker.setFPS(60);

            function handleTick(event) {
                var delta = event.delta;

                if (this.initialized) {

                    // Measurements
                    if (typeof this.fpsLabel !== "undefined") {
                        this.fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
                    }

                    // Idle
                    this.world.handleTick(delta);

                    // UI má při akcích myši přednost
                    if (this.ui.isMouseInUI(this.mouse.x, this.mouse.y)) {
                        this.ui.handleMouse(this.mouse, delta);
                    } else {
                        this.world.handleMouse(this.mouse, delta);
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
                    if (this.keys[37] || this.keys[65])
                        directions.left = true;
                    if (this.keys[38] || this.keys[87])
                        directions.up = true;
                    if (this.keys[39] || this.keys[68])
                        directions.right = true;
                    if (this.keys[40] || this.keys[83])
                        directions.down = true;
                    if (this.keys[73]) {
                        this.ui.inventoryUI.toggleInv();
                    } else {
                        this.ui.inventoryUI.prepareForToggleInv();
                    }

                    this.world.update(delta, directions);
                }

                this.stage.update();
            }
        };
    }
}
