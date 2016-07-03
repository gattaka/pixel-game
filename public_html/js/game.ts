///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {
    export class Game {

        public static VERSION = "0.2";

        canvas: HTMLCanvasElement;
        stage: createjs.Stage;
        fpsLabel: Label;
        mouseLabel: Label;
        world: World;
        ui: UI;
        debugUI: DebugLogUI;
        initialized = false;
        keys = {};

        mouse = new Mouse();

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
                // wheel createjs ještě neumí
                // https://github.com/CreateJS/EaselJS/issues/97
                self.canvas.addEventListener('mousewheel', function(event) {
                    self.mouse.wheelDeltaY = event.wheelDeltaY;
                    return false;
                }, false);

            })();

            /*----------------*/
            /* Resources init */
            /*----------------*/
            new Resources(self, function() {

                /*-------------------------*/
                /* UI - HUD, Inventory etc.*/
                /*-------------------------*/
                self.ui = new UI(self);
                self.debugUI = new DebugLogUI(400, 0);
                self.debugUI.x = 10;
                self.debugUI.y = 10;
                self.ui.addChild(self.debugUI);

                /*---------------------*/
                /* Measurements, debug */
                /*---------------------*/
                console.log("Measurements init");

                var versionLabel = new Label("LichEngine version: " + Game.VERSION, "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
                self.debugUI.addNextChild(versionLabel);

                self.fpsLabel = new Label("-- fps", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
                self.debugUI.addNextChild(self.fpsLabel);

                self.stage.addEventListener("stagemousemove", handleMouseMove);
                self.mouseLabel = new Label("PIXELS x: - y: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
                self.debugUI.addNextChild(self.mouseLabel);

                self.world = new World(self);
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
                    } else {
                        self.ui.inventoryUI.prepareForToggleInv();
                    }
                    for (var i = 0; i < 3; i++) {
                        if (self.keys[49 + i]) {
                            switch (i) {
                                case 0:
                                    self.ui.spellsUI.selectSpell(Resources.SPELL_DIG_KEY);
                                    break;
                                case 1:
                                    self.ui.spellsUI.selectSpell(Resources.SPELL_PLACE_KEY);
                                    break;
                                case 2:
                                    self.ui.spellsUI.selectSpell(Resources.SPELL_FIREBALL_KEY);
                                    break;
                            }

                        }
                    }

                    self.world.update(delta, directions);
                }

                self.stage.update();
            }
        };
    }
}
