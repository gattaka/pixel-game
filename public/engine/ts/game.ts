///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {

    declare class Stats {
        dom;
        constructor();
        showPanel(n: number);
        begin();
        end();
    };

    export class Game {

        static CURRENT_GAME: Game;

        public renderer: PIXI.WebGLRenderer;
        private stage: PIXI.Container;
        private background: Background;
        private world: World;
        private ui: UI;
        private hitLayer: PIXI.Container;

        private loadUI: LoaderUI;

        private initialized = false;

        private playerReadyToAutosave = true;
        private timerReadyToAutosave = false;

        public getWorld(): World { return this.world; }
        public getSceneWidth(): number {
            return window.innerWidth; //this.renderer.view.width; 
        }
        public getSceneHeight(): number {
            return window.innerHeight; //this.renderer.view.height; 
        }

        constructor(minimapCanvasId: string, loaderCanvasId: string) {

            var self = this;

            Game.CURRENT_GAME = self;

            // stats
            var statsFPS = new Stats();
            statsFPS.showPanel(0);
            document.body.appendChild(statsFPS.dom);

            // mobile?
            let md = new MobileDetect(window.navigator.userAgent);
            let mobile;
            if (md.mobile() || md.phone() || md.tablet()) {
                mobile = true;
            } else {
                mobile = false;
            }

            console.log("running");

            // Create the renderer
            self.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
                antialias: false,
                roundPixels: false,
                autoResize: false
            });
            self.renderer.view.style.position = "absolute";
            self.renderer.view.style.display = "block";
            self.renderer.backgroundColor = 0xfafaea;
            switch (ThemeWatch.getCurrentTheme()) {
                case Theme.WINTER:
                    self.renderer.backgroundColor = 0xcce1e8;
                default:
                    self.renderer.backgroundColor = 0x839e61;
            }

            // function resizeCanvas() {
            //     self.renderer.resize(window.innerWidth, window.innerHeight);
            // }
            // resizeCanvas();
            // // resize the canvas to fill browser window dynamically
            // window.addEventListener('resize', resizeCanvas, false);

            // Add the canvas to the HTML document
            document.body.appendChild(self.renderer.view);

            // Create a container object called the `stage`
            self.stage = new PIXI.Container();
            self.stage.fixedWidth = window.innerWidth;
            self.stage.fixedHeight = window.innerHeight;

            self.hitLayer = new PIXI.Container();
            self.hitLayer.fixedWidth = window.innerWidth;
            self.hitLayer.fixedHeight = window.innerHeight;
            self.hitLayer.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
            self.hitLayer.interactive = true;

            /*--------------*/
            /* Mouse events */
            /*--------------*/

            if (mobile) {
                self.hitLayer.on("pointerdown", () => {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    Mouse.down = true;
                    Mouse.clickChanged = true;
                    Mouse.x = mouseData.x;
                    Mouse.y = mouseData.y;
                });

                self.hitLayer.on("pointermove", () => {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    Mouse.x = mouseData.x;
                    Mouse.y = mouseData.y;
                    EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.MOUSE_MOVE, Mouse.x, Mouse.y));
                });

                self.hitLayer.on("pointerup", () => {
                    Mouse.down = false;
                    Mouse.clickChanged = true;
                });
            } else {
                self.hitLayer.on("pointerdown", () => {
                    Mouse.down = true;
                    Mouse.rightDown = false;
                    Mouse.clickChanged = true;
                });

                self.hitLayer.on("rightdown", () => {
                    Mouse.down = false;
                    Mouse.rightDown = true;
                    Mouse.clickChanged = true;
                });

                self.hitLayer.on("pointermove", () => {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    Mouse.x = mouseData.x;
                    Mouse.y = mouseData.y;
                    EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.MOUSE_MOVE, Mouse.x, Mouse.y));
                });

                self.hitLayer.on("pointerup", () => {
                    var mouseData = self.renderer.plugins.interaction.mouse;
                    Mouse.down = false;
                    Mouse.rightDown = false;
                    Mouse.clickChanged = true;
                });
            }

            let init = function () {

                Mixer.playMusic(MusicKey.MSC_DIRT_THEME_KEY, 0.3);

                let loadWorld = () => {
                    let idb = IndexedDB.getInstance();
                    idb.loadData((data) => {
                        // podařilo se něco nahrát?
                        if (data) {
                            EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_START));
                            let obj = JSON.parse(data);
                            self.loadUI.reset();
                            self.stage.addChild(self.loadUI);
                            self.loadUI.alpha = 1;
                            if (obj.map) {
                                TilesMapGenerator.deserialize(obj.map, (tilesMap) => {
                                    populateContent(tilesMap);
                                    if (obj.inv) {
                                        // TODO
                                        // self.ui.inventoryUI.deserialize(obj.inv);
                                    }
                                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));
                                });
                            }
                        } else {
                            // pokud neexistuje save, vytvoř ho
                            EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_START));
                            TilesMapGenerator.createNew((tilesMap) => {
                                populateContent(tilesMap);
                                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));
                                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                            });
                        }
                    });
                };

                let populateContent = (tilesMap: TilesMap) => {
                    // clean 
                    self.stage.removeChildren();
                    delete self.world;
                    delete self.background;
                    EventBus.getInstance().clear();
                    Mixer.stopAllSounds();

                    // (re)-init
                    self.ui = new UI(self.renderer.view, tilesMap, mobile);
                    self.background = new Background();
                    self.world = new World(self, tilesMap);
                    self.stage.addChild(self.background);
                    self.stage.addChild(self.world);
                    self.stage.addChild(self.hitLayer);
                    self.stage.addChild(self.ui);

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

                    createjs.Tween.get(self.loadUI)
                        .to({
                            alpha: 0
                        }, 1500).call(function () {
                            self.stage.removeChild(self.loadUI);
                        });

                    self.initialized = true;
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

            if (Resources.getInstance().isLoaderDone()) {
                init();
            } else {
                let listener;
                EventBus.getInstance().registerConsumer(EventType.LOAD_FINISHED, listener = (): boolean => {
                    init();
                    EventBus.getInstance().unregisterConsumer(EventType.LOAD_FINISHED, listener);
                    return false;
                });
                self.loadUI = new LoaderUI(self);
                self.stage.addChild(self.loadUI);
            }

            window.onbeforeunload = function (evn) {
                let e = evn || window.event;
                // IE & Firefox
                if (e) {
                    e.returnValue = 'Are you sure?';
                }
                // For Safari
                return 'Are you sure?';
            };

            // Controls
            Keyboard.on(32, () => { PlayerMovement.levitate = true; }, () => { PlayerMovement.levitate = false; });
            Keyboard.on(37, () => { PlayerMovement.left = true; }, () => { PlayerMovement.left = false; });
            Keyboard.on(65, () => { PlayerMovement.left = true; }, () => { PlayerMovement.left = false; });
            Keyboard.on(38, () => { PlayerMovement.up = true; }, () => { PlayerMovement.up = false; });
            Keyboard.on(87, () => { PlayerMovement.up = true; }, () => { PlayerMovement.up = false; });
            Keyboard.on(39, () => { PlayerMovement.right = true; }, () => { PlayerMovement.right = false; });
            Keyboard.on(68, () => { PlayerMovement.right = true; }, () => { PlayerMovement.right = false; });
            Keyboard.on(40, () => { PlayerMovement.down = true; }, () => { PlayerMovement.down = false; });
            Keyboard.on(83, () => { PlayerMovement.down = true; }, () => { PlayerMovement.down = false; });
            Keyboard.on(67, () => { self.ui.craftingUI.toggle(); }, () => { self.ui.craftingUI.prepareForToggle(); });
            Keyboard.on(27, () => {
                if (self.ui.craftingUI.parent) {
                    self.ui.craftingUI.hide();
                    self.ui.splashScreenUI.suppressToggle();
                } else if (self.ui.mapUI.parent) {
                    self.ui.mapUI.hide();
                    self.ui.splashScreenUI.suppressToggle();
                } else {
                    self.ui.splashScreenUI.toggle();
                }
            }, () => { self.ui.splashScreenUI.prepareForToggle(); });
            Keyboard.on(73, () => { self.ui.inventoryUI.toggle(); }, () => { self.ui.inventoryUI.prepareForToggle(); });
            Keyboard.on(77, () => { self.ui.mapUI.toggle(); }, () => { self.ui.mapUI.prepareForToggle(); });
            Keyboard.on(78, () => { self.ui.minimapUI.toggle(); }, () => { self.ui.minimapUI.prepareForToggle(); });
            Keyboard.on(16, () => { self.ui.spellsUI.toggleAlternative(); }, () => { self.ui.spellsUI.prepareForToggleAlternative(); });

            let ticker = PIXI.ticker.shared;
            ticker.add(() => {
                statsFPS.begin();
                // ticker.deltaTime je přepočtený dle speed, to není rozdíl 
                // snímků v ms, jako bylo v createjs
                let delta = ticker.elapsedMS;

                if (self.initialized) {
                    self.getWorld().update(delta);
                }

                self.renderer.render(self.stage);
                statsFPS.end();
            });
        };
    }
}
