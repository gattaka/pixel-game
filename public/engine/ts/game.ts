///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {

    export class Controls {
        public up = false;
        public down = false;
        public left = false;
        public right = false;
        public levitate = false;
    };

    declare class Stats {
        dom;
        constructor();
        showPanel(n: number);
        begin();
        end();
    };

    export class Game {

        static CURRENT_GAME: Game;

        private canvas: HTMLCanvasElement;
        private stage: createjs.SpriteStage;
        private content: SheetContainer;
        private background: Background;
        private world: World;
        private ui: UI;

        private loadUI: LoaderUI;

        private initialized = false;
        private keys = {};

        private playerReadyToAutosave = true;
        private timerReadyToAutosave = false;

        mouse = new Mouse();

        public getCanvas(): HTMLCanvasElement { return this.canvas; }
        public getContent(): SheetContainer { return this.content; }
        public getBackground(): Background { return this.background; }
        public getWorld(): World { return this.world; }
        public getUI(): UI { return this.ui; }

        constructor(canvasId: string) {

            var self = this;

            Game.CURRENT_GAME = self;

            // stats
            var stats = new Stats();
            stats.showPanel(0);
            document.body.appendChild(stats.dom);

            // mobile?
            let md = new MobileDetect(window.navigator.userAgent);
            let mobile;
            if (md.mobile() || md.phone() || md.tablet()) {
                mobile = true;
            } else {
                mobile = false;
            }

            /*------------*/
            /* Stage init */
            /*------------*/

            console.log("running");

            self.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            switch (ThemeWatch.getCurrentTheme()) {
                case Theme.WINTER:
                    self.canvas.style.backgroundColor = "#cce1e8"; break;
                default:
                    self.canvas.style.backgroundColor = "#839e61";
            }

            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeCanvas, false);

            function resizeCanvas() {
                self.canvas.width = window.innerWidth;
                self.canvas.height = window.innerHeight;
            }
            resizeCanvas();

            self.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            self.canvas.style.backgroundColor = "#cce1e8";
            // preserveDrawingBuffer = true (2. argument) značeně zhorší FPS
            // antialising = true (3. argument) také značně zhorší FPS
            self.stage = new createjs.SpriteStage(self.canvas, false, false);
            let webGL = self.stage.isWebGL;

            if (mobile) {
                createjs.Touch.enable(self.stage);
                self.stage.enableMouseOver(10);
            }

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

            if (mobile) {
                self.stage.on("mousedown", function (evt: createjs.MouseEvent) {
                    self.mouse.down = true;
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
                    self.mouse.x = evt.stageX;
                    self.mouse.y = evt.stageY;
                }, null, false);

                self.stage.on("pressmove", function (evt: createjs.MouseEvent) {
                    self.mouse.x = evt.stageX;
                    self.mouse.y = evt.stageY;
                    EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.MOUSE_MOVE, self.mouse.x, self.mouse.y));
                }, null, false);

                self.stage.on("pressup", function (evt: createjs.MouseEvent) {
                    self.mouse.down = false;
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
                }, null, false);
            } else {
                self.canvas.onmousedown = (event: MouseEvent) => {
                    if (event.button == 0) {
                        self.mouse.down = true;
                    } else {
                        self.mouse.rightDown = true;
                    }
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
                };

                self.canvas.onmousemove = (event: MouseEvent) => {
                    self.mouse.x = event.clientX;
                    self.mouse.y = event.clientY;
                    EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.MOUSE_MOVE, self.mouse.x, self.mouse.y));
                };

                self.canvas.onmouseup = (event: MouseEvent) => {
                    if (event.button == 0) {
                        self.mouse.down = false;
                    } else {
                        self.mouse.rightDown = false;
                    }
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
                }
            }

            let init = function () {

                Mixer.playMusic(MusicKey.MSC_DIRT_THEME_KEY, 0.3);

                let loadWorld = () => {
                    let idb = IndexedDB.getInstance();
                    idb.loadData((data) => {
                        // podařilo se něco nahrát?
                        if (data) {
                            let obj = JSON.parse(data);
                            // TODO
                            // self.loadUI.reset();
                            // self.stage.addChild(self.loadUI);
                            // self.loadUI.alpha = 1;
                            if (obj.map) {
                                TilesMapGenerator.deserialize(obj.map, (tilesMap) => {
                                    populateContent(tilesMap);
                                    if (obj.inv) {
                                        // TODO
                                        // self.ui.inventoryUI.deserialize(obj.inv);
                                    }
                                });
                            }
                        } else {
                            // pokud neexistuje save, vytvoř ho
                            TilesMapGenerator.createNew((tilesMap) => {
                                populateContent(tilesMap);
                                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                            });
                        }
                    });
                };

                let populateContent = (tilesMap: TilesMap) => {
                    // clean 
                    self.content.removeAllChildren();
                    delete self.world;
                    delete self.background;
                    EventBus.getInstance().clear();
                    Mixer.stopAllSounds();

                    // (re)-init
                    // TODO
                    // self.ui = new UI(self.canvas, tilesMap, mobile);
                    // self.background = new Background(self);
                    self.world = new World(self, tilesMap);
                    self.content.addChild(self.world);
                    self.content.addChild(self.ui);

                    EventBus.getInstance().registerConsumer(EventType.SAVE_WORLD, (): boolean => {
                        // TODO
                        // setTimeout(() => {
                        //     let idb = IndexedDB.getInstance();
                        //     let data = {
                        //         map: TilesMapGenerator.serialize(self.getWorld().tilesMap),
                        //         inv: self.ui.inventoryUI.serialize()
                        //     };
                        //     idb.saveData(JSON.stringify(data));
                        //     self.world.fadeText("Game saved", self.canvas.width / 2, self.canvas.height / 2, 30, "#00E", "#003");
                        // }, 1);
                        return true;
                    });

                    EventBus.getInstance().registerConsumer(EventType.LOAD_WORLD, (): boolean => {
                        loadWorld();
                        return true;
                    });

                    EventBus.getInstance().registerConsumer(EventType.NEW_WORLD, (): boolean => {
                        self.loadUI.reset();
                        self.stage.addChild(self.loadUI);
                        self.loadUI.alpha = 1;
                        setTimeout(() => {
                            TilesMapGenerator.createNew((tilesMap) => {
                                populateContent(tilesMap);
                                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                            });
                        }, 1);
                        return true;
                    });

                    EventBus.getInstance().registerConsumer(EventType.PLAYER_SPEED_CHANGE, (data: TupleEventPayload) => {
                        self.playerReadyToAutosave = data.x == 0 && data.y == 0;
                        if (self.timerReadyToAutosave && self.playerReadyToAutosave) {
                            EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD))
                            self.timerReadyToAutosave = false;
                        }
                        return false;
                    });

                    // TODO
                    // createjs.Tween.get(self.loadUI)
                    //     .to({
                    //         alpha: 0
                    //     }, 1500).call(function () {
                    //         self.stage.removeChild(self.loadUI);
                    //     });

                    self.initialized = true;
                    self.stage.addChild(self.content);
                };

                setInterval(() => {
                    if (self.playerReadyToAutosave) {
                        EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                        self.timerReadyToAutosave = false;
                    } else {
                        self.timerReadyToAutosave = true;
                    }
                }, 60 * 1000);

                loadWorld();
            }

            self.content = new SheetContainer();

            if (Resources.getInstance().isLoaderDone()) {
                init();
            } else {
                let listener;
                EventBus.getInstance().registerConsumer(EventType.LOAD_FINISHED, listener = (): boolean => {
                    init();
                    EventBus.getInstance().unregisterConsumer(EventType.LOAD_FINISHED, listener);
                    return false;
                });
                // TODO
                // self.stage.addChild(self.loadUI = new LoaderUI(self));
            }

            /*-----------*/
            /* Time init */
            /*-----------*/
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", handleTick);
            createjs.Ticker.setFPS(60);

            function handleTick(event) {
                stats.begin();
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
                    // isMouseInUI je časově náročné, proto je volání filtrováno
                    // UI bere pouze mousedown akce a to pouze jednou (ignoruje dlouhé stisknutí)
                    // TODO
                    // if (self.mouse.down && self.mouse.clickChanged) {
                    //     if (self.ui.isMouseInUI(self.mouse.x, self.mouse.y)) {
                    //         // blokuj akci světa
                    //         self.mouse.consumedByUI = true;
                    //         self.mouse.clickChanged = false;
                    //     }
                    // }

                    // TODO
                    // if (!self.mouse.down && self.mouse.clickChanged) {
                    //     self.ui.controls = new Controls();
                    // }

                    // Akce světa mají nižší prioritu, akce myši se projeví pouze 
                    // pokud je již nezpracovalo UI 
                    // Svět bere nejen mousedown akce, ale u mousedown musí dát přednost UI
                    // bere dlouhé stisknutí protože spell efekty se opakují dokud platí mousedown
                    if (!self.mouse.down || self.mouse.down && self.mouse.consumedByUI == false) {
                        self.getWorld().handleMouse(self.mouse, delta);
                        self.mouse.clickChanged = false;
                    }

                    // Při delším prodlení (nízké FPS) bude akcelerace působit 
                    // fakticky delší dobu, ale hra nemá možnost zjistit, že hráč
                    // už nedrží např. šipku -- holt "LAG" :)

                    // Controls
                    let controls;
                    if (mobile) {
                        controls = self.ui.controls;
                    } else {
                        controls = new Controls();
                        if (self.keys[32])
                            controls.levitate = true;
                        if (self.keys[37])
                            controls.left = true;
                        if (self.keys[38])
                            controls.up = true;
                        if (self.keys[39])
                            controls.right = true;
                        if (self.keys[40])
                            controls.down = true;
                        if (self.keys[65])
                            controls.left = true;
                        if (self.keys[87])
                            controls.up = true;
                        if (self.keys[68])
                            controls.right = true;
                        if (self.keys[83])
                            controls.down = true;
                        // TODO
                        // if (self.keys[67]) {
                        //     self.ui.craftingUI.toggle();
                        // } else {
                        //     self.ui.craftingUI.prepareForToggle();
                        // }
                        // if (self.keys[27]) {
                        //     if (self.ui.craftingUI.parent) {
                        //         self.ui.craftingUI.hide();
                        //         self.ui.splashScreenUI.suppressToggle();
                        //     } else if (self.ui.mapUI.parent) {
                        //         self.ui.mapUI.hide();
                        //         self.ui.splashScreenUI.suppressToggle();
                        //     } else {
                        //         self.ui.splashScreenUI.toggle();
                        //     }
                        // } else {
                        //     self.ui.splashScreenUI.prepareForToggle();
                        // }
                        // if (self.keys[73]) {
                        //     self.ui.inventoryUI.toggle();
                        // } else {
                        //     self.ui.inventoryUI.prepareForToggle();
                        // }
                        // if (self.keys[77]) {
                        //     self.ui.mapUI.toggle();
                        // } else {
                        //     self.ui.mapUI.prepareForToggle();
                        // }
                        // if (self.keys[78]) {
                        //     self.ui.minimapUI.toggle();
                        // } else {
                        //     self.ui.minimapUI.prepareForToggle();
                        // }
                        // if (self.keys[16]) {
                        //     self.ui.spellsUI.toggleShift();
                        // } else {
                        //     self.ui.spellsUI.prepareForToggleShift();
                        // }
                        // for (var i = 0; i < self.ui.spellsUI.spellIndex.length; i++) {
                        //     if (self.keys[49 + i]) {
                        //         self.ui.spellsUI.selectSpell(i);
                        //     }
                        // }
                    }

                    self.getWorld().update(delta, controls);
                }

                self.stage.update();
                stats.end();
            }
        };
    }
}
