namespace Lich {
    export class Game {

        canvas: HTMLCanvasElement;
        stage: createjs.Stage;
        fpsLabel: createjs.Text;
        mouseLabel: createjs.Text;
        world: World;
        ui: UI;
        initialized = false;
        keys = {};

        mouse = new Mouse();
        resources: Resources;

        constructor(canvasId: string) {

            var self = this;

            /*------------*/
            /* Stage init */
            /*------------*/

            console.log("running");

            self.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            self.canvas.style.backgroundColor = "#b1ecff";

            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeCanvas, false);

            function resizeCanvas() {
                self.canvas.width = window.innerWidth;
                self.canvas.height = window.innerHeight;
            }
            resizeCanvas();

            self.stage = new createjs.Stage(self.canvas);

            /*----------*/
            /* Controls */
            /*----------*/

            self.keys = {};

            function keydown(event) {
                self.keys[event.keyCode] = true;
            }

            function keyup(event) {
                delete self.keys[event.keyCode];
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
                self.stage.addEventListener("stagemousedown", function(event) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                    self.mouse.down = true;
                });
                self.stage.addEventListener("stagemousemove", function(event) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                });
                self.stage.addEventListener("stagemouseup", function(event) {
                    self.mouse.down = false;
                });
            })();

            /*----------------*/
            /* Resources init */
            /*----------------*/
            self.resources = new Resources(self, function() {

                self.ui = new UI(self);
                self.world = new World(self);
                self.stage.addChild(self.world);
                self.stage.addChild(self.ui);

                /*---------------------*/
                /* Measurements, debug */
                /*---------------------*/
                console.log("Measurements init");

                self.fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#00f");
                self.stage.addChild(self.fpsLabel);
                self.fpsLabel.x = 10;
                self.fpsLabel.y = 10;

                self.stage.addEventListener("stagemousemove", handleMouseMove);
                self.mouseLabel = new createjs.Text("PIXELS x: - y: -", "bold 18px Arial", "#00f");
                self.stage.addChild(self.mouseLabel);
                self.mouseLabel.x = 10;
                self.mouseLabel.y = 30;

                function handleMouseMove(event) {
                    if (typeof self.mouseLabel !== "undefined") {
                        self.mouseLabel.text = "x: " + event.stageX + " y: " + event.stageY;
                    }
                }

                self.initialized = true;
            });

            /*-----------*/
            /* Time init */
            /*-----------*/
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", handleTick);
            createjs.Ticker.setFPS(60);

            function handleTick(event) {
                var delta = event.delta;

                if (self.initialized) {

                    // Measurements
                    if (typeof self.fpsLabel !== "undefined") {
                        self.fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
                    }

                    // Idle
                    self.world.handleTick(delta);

                    // UI má při akcích myši přednost
                    if (self.ui.isMouseInUI(self.mouse.x, self.mouse.y)) {
                        self.ui.handleMouse(self.mouse, delta);
                    } else {
                        self.world.handleMouse(self.mouse, delta);
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
                    if (self.keys[37] || self.keys[65])
                        directions.left = true;
                    if (self.keys[38] || self.keys[87])
                        directions.up = true;
                    if (self.keys[39] || self.keys[68])
                        directions.right = true;
                    if (self.keys[40] || self.keys[83])
                        directions.down = true;
                    if (self.keys[73]) {
                        self.ui.inventoryUI.toggleInv();
                    } else {
                        self.ui.inventoryUI.prepareForToggleInv();
                    }

                    self.world.update(delta, directions);
                }

                self.stage.update();
            }
        };
    }
}
