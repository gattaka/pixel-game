///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {
    export class Game {

        private canvas: HTMLCanvasElement;
        private stage: createjs.Stage;
        private content: createjs.Container;
        private background: Background;
        private world: World;
        private ui: UI;

        private loadUI: GameLoadUI;

        private initialized = false;
        private keys = {};

        mouse = new Mouse();

        public getCanvas(): HTMLCanvasElement { return this.canvas; }
        public getContent(): createjs.Container { return this.content; }
        public getBackground(): Background { return this.background; }
        public getWorld(): World { return this.world; }
        public getUI(): UI { return this.ui; }

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

            let init = function () {

                self.ui = new UI(self);

                let populateContent = (tilesMap: TilesMap) => {
                    self.content.removeAllChildren();
                    delete self.world;
                    delete self.background;

                    self.world = new World(self, tilesMap);
                    self.background = new Background(self);
                    self.content.addChild(self.world);
                    self.content.addChild(self.ui);

                    createjs.Tween.get(self.loadUI)
                        .to({
                            alpha: 0
                        }, 1500).call(function () {
                            self.stage.removeChild(self.loadUI);
                        });

                    self.initialized = true;
                };

                EventBus.getInstance().registerConsumer(EventType.SAVE_WORLD, (): boolean => {
                    setTimeout(() => {
                        let idb = IndexedDB.getInstance();
                        let data = {
                            map: TilesMapGenerator.serialize(self.getWorld().tilesMap),
                            inv: {}
                        };
                        idb.saveData(JSON.stringify(data));
                    }, 1);
                    return true;
                });
                setInterval(() => { EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD)) }, 60 * 1000);

                EventBus.getInstance().registerConsumer(EventType.LOAD_WORLD, (): boolean => {
                    let idb = IndexedDB.getInstance();
                    idb.loadData((data) => {
                        // podařilo se něco nahrát?
                        if (data) {
                            let obj = JSON.parse(data);
                            self.loadUI.reset();
                            self.stage.addChild(self.loadUI);
                            self.loadUI.alpha = 1;
                            if (obj.map) {
                                let tilesMap = TilesMapGenerator.deserialize(obj.map);
                                populateContent(tilesMap);
                                return;
                            }
                        }

                        // pokud neexistuje save, vytvoř ho
                        let tilesMap = TilesMapGenerator.createNew();
                        populateContent(tilesMap);
                        EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                    });
                    return true;
                });

                EventBus.getInstance().registerConsumer(EventType.NEW_WORLD, (): boolean => {
                    let tilesMap = TilesMapGenerator.createNew();
                    populateContent(tilesMap);
                    return true;
                });

                self.stage.addEventListener("stagemousemove", (event: any) => {
                    EventBus.getInstance().fireEvent(new MouseMoveEventPayload(event.stageX, event.stageY));
                });

                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_WORLD));
            }

            self.content = new createjs.Container();
            self.stage.addChild(self.content);

            if (Resources.getInstance().isLoaderDone()) {
                init();
            } else {
                let listener;
                EventBus.getInstance().registerConsumer(EventType.LOAD_FINISHED, listener = (): boolean => {
                    init();
                    EventBus.getInstance().unregisterConsumer(EventType.LOAD_FINISHED, listener);
                    return false;
                });
                self.stage.addChild(self.loadUI = new GameLoadUI(self));
            }

            /*-----------*/
            /* Time init */
            /*-----------*/
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", handleTick);
            createjs.Ticker.setFPS(60);

            function handleTick(event) {
                var delta = event.delta;

                window.onbeforeunload = function (e) {
                    var e = e || window.event;
                    //IE & Firefox
                    if (e) {
                        e.returnValue = 'Are you sure?';
                    }
                    // For Safari
                    return 'Are you sure?';
                };

                if (self.initialized) {

                    // Measurements
                    EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.FPS_CHANGE, createjs.Ticker.getMeasuredFPS()));

                    // Idle
                    self.getWorld().handleTick(delta);

                    // UI má při akcích myši přednost
                    if (self.ui.isMouseInUI(self.mouse.x, self.mouse.y)) {
                        self.ui.handleMouse(self.mouse, delta);
                    } else {
                        self.getWorld().handleMouse(self.mouse, delta);
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

                    self.getWorld().update(delta, directions);
                }

                self.stage.update();
            }
        };
    }
}