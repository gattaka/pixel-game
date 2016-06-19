var Lich;
(function (Lich) {
    var Game = (function () {
        function Game(canvasId) {
            this.initialized = false;
            this.keys = {};
            this.mouse = new Lich.Mouse();
            var self = this;
            /*------------*/
            /* Stage init */
            /*------------*/
            console.log("running");
            self.canvas = document.getElementById(canvasId);
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
            (function () {
                // Všechno musí být s prefixem 'stage' jinak se bude snažit chytat 
                // eventy s ohledem na konkrétní objekty a to se drasticky projevuje 
                // na FPS -- takhle se zjišťuje event obecně a je to bez ztrát 
                self.stage.addEventListener("stagemousedown", function (event) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                    self.mouse.down = true;
                });
                self.stage.addEventListener("stagemousemove", function (event) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                });
                self.stage.addEventListener("stagemouseup", function (event) {
                    self.mouse.down = false;
                });
            })();
            /*----------------*/
            /* Resources init */
            /*----------------*/
            self.resources = new Lich.Resources(self, function () {
                /*-------------------------*/
                /* UI - HUD, Inventory etc.*/
                /*-------------------------*/
                self.ui = new Lich.UI(self);
                self.debugUI = new Lich.DebugLogUI(400, 0);
                self.debugUI.x = 10;
                self.debugUI.y = 10;
                self.ui.addChild(self.debugUI);
                /*---------------------*/
                /* Measurements, debug */
                /*---------------------*/
                console.log("Measurements init");
                var versionLabel = new Lich.Label("Version: " + Game.VERSION, "15px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR);
                self.debugUI.addNextChild(versionLabel);
                self.fpsLabel = new Lich.Label("-- fps", "15px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR);
                self.debugUI.addNextChild(self.fpsLabel);
                self.stage.addEventListener("stagemousemove", handleMouseMove);
                self.mouseLabel = new Lich.Label("PIXELS x: - y: -", "15px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR);
                self.debugUI.addNextChild(self.mouseLabel);
                self.world = new Lich.World(self);
                self.stage.addChild(self.world);
                self.stage.addChild(self.ui);
                function handleMouseMove(event) {
                    if (typeof self.mouseLabel !== "undefined") {
                        self.mouseLabel.setText("x: " + event.stageX + " y: " + event.stageY);
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
                        self.fpsLabel.setText(Math.round(createjs.Ticker.getMeasuredFPS()) + " fps");
                    }
                    // Idle
                    self.world.handleTick(delta);
                    // UI má při akcích myši přednost
                    if (self.ui.isMouseInUI(self.mouse.x, self.mouse.y)) {
                        self.ui.handleMouse(self.mouse, delta);
                    }
                    else {
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
                        right: false,
                        up2: false,
                        down2: false,
                        left2: false,
                        right2: false
                    };
                    if (self.keys[37])
                        directions.left2 = true;
                    if (self.keys[38])
                        directions.up2 = true;
                    if (self.keys[39])
                        directions.right2 = true;
                    if (self.keys[40])
                        directions.down2 = true;
                    if (self.keys[65])
                        directions.left = true;
                    if (self.keys[87])
                        directions.up = true;
                    if (self.keys[68])
                        directions.right = true;
                    if (self.keys[83])
                        directions.down = true;
                    if (self.keys[73]) {
                        self.ui.inventoryUI.toggleInv();
                    }
                    else {
                        self.ui.inventoryUI.prepareForToggleInv();
                    }
                    self.world.update(delta, directions);
                }
                self.stage.update();
            }
        }
        ;
        Game.VERSION = "0.001";
        return Game;
    }());
    Lich.Game = Game;
})(Lich || (Lich = {}));
