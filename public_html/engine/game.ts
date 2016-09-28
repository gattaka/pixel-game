///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {
    export class Game {

        canvas: HTMLCanvasElement;
        stage: createjs.Stage;
        world: World;
        ui: UI;
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

            (function () {
                // Všechno musí být s prefixem 'stage' jinak se bude snažit chytat 
                // eventy s ohledem na konkrétní objekty a to se drasticky projevuje 
                // na FPS -- takhle se zjišťuje event obecně a je to bez ztrát 
                self.stage.addEventListener("stagemousedown", function (event: any) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                    if (event.nativeEvent.button == 0) {
                        self.mouse.down = true;
                    } else {
                        self.mouse.rightDown = true;
                    }
                });
                self.stage.addEventListener("stagemousemove", function (event) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                });
                self.stage.addEventListener("stagemouseup", function (event: any) {
                    if (event.nativeEvent.button == 0) {
                        self.mouse.down = false;
                    } else {
                        self.mouse.rightDown = false;
                    }
                });
                // wheel createjs ještě neumí
                // https://github.com/CreateJS/EaselJS/issues/97
                self.canvas.addEventListener('mousewheel', function (event) {
                    self.mouse.wheelDeltaY = event.wheelDeltaY;
                    return false;
                }, false);

            })();

            /*----------------*/
            /* Resources init */
            /*----------------*/
            Resources.getInstance(self, function () {

                /*-------------------------*/
                /* UI - HUD, Inventory etc.*/
                /*-------------------------*/
                self.ui = new UI(self);

                /*---------------------*/
                /* Measurements, debug */
                /*---------------------*/
                console.log("Measurements init");

                self.world = new World(self);
                self.stage.addChild(self.world);
                self.stage.addChild(self.ui);

                self.stage.addEventListener("stagemousemove", (event: any) => {
                    EventBus.getInstance().fireEvent(new MouseMoveEventPayload(event.stageX, event.stageY));
                });

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
                    EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.FPS_CHANGE, createjs.Ticker.getMeasuredFPS()));

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
                    if (self.keys[67]) {
                        self.ui.craftingUI.toggle();
                    } else {
                        self.ui.craftingUI.prepareForToggle();
                    }
                    if (self.keys[27]) {
                        self.ui.splashScreenUI.toggle();
                    } else {
                        self.ui.splashScreenUI.prepareForToggle();
                    }
                    if (self.keys[73]) {
                        self.ui.inventoryUI.toggleInv();
                    } else {
                        self.ui.inventoryUI.prepareForToggleInv();
                    }
                    if (self.keys[16]) {
                        self.ui.spellsUI.toggleShift();
                    } else {
                        self.ui.spellsUI.prepareForToggleShift();
                    }
                    for (var i = 0; i < self.ui.spellsUI.spellIndex.length; i++) {
                        if (self.keys[49 + i]) {
                            self.ui.spellsUI.selectSpell(i);
                        }
                    }

                    self.world.update(delta, directions);
                }

                self.stage.update();
            }
        };
    }
}
