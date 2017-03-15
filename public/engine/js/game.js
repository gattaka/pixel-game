///<reference path='lib/preloadjs/preloadjs.d.ts'/>
///<reference path='lib/soundjs/soundjs.d.ts'/>
///<reference path='lib/tweenjs/tweenjs.d.ts'/>
var Lich;
(function (Lich) {
    ;
    var Game = (function () {
        function Game() {
            this.initialized = false;
            this.playerReadyToAutosave = true;
            this.timerReadyToAutosave = false;
            var self = this;
            // stats
            var statsFPS = new Stats();
            statsFPS.showPanel(0);
            document.body.appendChild(statsFPS.dom);
            // mobile?
            var md = new MobileDetect(window.navigator.userAgent);
            var mobile;
            if (md.mobile() || md.phone() || md.tablet()) {
                mobile = true;
            }
            else {
                mobile = false;
            }
            console.log("running");
            // Create the renderer
            // This Render works by automatically managing webGLBatchs. 
            // So no need for Sprite Batches or Sprite Clouds.
            self.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
                antialias: false,
                roundPixels: false,
                autoResize: false
            });
            self.renderer.view.style.position = "absolute";
            self.renderer.view.style.display = "block";
            switch (Lich.ThemeWatch.getCurrentTheme()) {
                case Lich.Theme.WINTER:
                    self.renderer.backgroundColor = 0xcce1e8;
                default:
                    self.renderer.backgroundColor = 0xf6fbfe;
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
                self.hitLayer.on("pointerdown", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    Lich.Mouse.down = true;
                    Lich.Mouse.clickChanged = true;
                    Lich.Mouse.x = mouseData.x;
                    Lich.Mouse.y = mouseData.y;
                });
                self.hitLayer.on("pointermove", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    Lich.Mouse.x = mouseData.x;
                    Lich.Mouse.y = mouseData.y;
                    Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.MOUSE_MOVE, Lich.Mouse.x, Lich.Mouse.y));
                });
                self.hitLayer.on("pointerup", function () {
                    Lich.Mouse.down = false;
                    Lich.Mouse.clickChanged = true;
                });
            }
            else {
                self.hitLayer.on("pointerdown", function () {
                    Lich.Mouse.down = true;
                    Lich.Mouse.rightDown = false;
                    Lich.Mouse.clickChanged = true;
                });
                self.hitLayer.on("rightdown", function () {
                    Lich.Mouse.down = false;
                    Lich.Mouse.rightDown = true;
                    Lich.Mouse.clickChanged = true;
                });
                self.hitLayer.on("pointermove", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    Lich.Mouse.x = mouseData.x;
                    Lich.Mouse.y = mouseData.y;
                    Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.MOUSE_MOVE, Lich.Mouse.x, Lich.Mouse.y));
                });
                self.hitLayer.on("pointerup", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse;
                    Lich.Mouse.down = false;
                    Lich.Mouse.rightDown = false;
                    Lich.Mouse.clickChanged = true;
                });
            }
            var init = function () {
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_DIRT_THEME_KEY, 0.3);
                var loadWorld = function () {
                    var idb = Lich.IndexedDB.getInstance();
                    idb.loadData(function (data) {
                        // podařilo se něco nahrát?
                        if (data) {
                            Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_START));
                            var obj_1 = JSON.parse(data);
                            self.loadUI.reset();
                            self.stage.addChild(self.loadUI);
                            self.loadUI.alpha = 1;
                            if (obj_1.map) {
                                Lich.TilesMapGenerator.deserialize(obj_1.map, function (tilesMap) {
                                    populateContent(tilesMap);
                                    if (obj_1.inv) {
                                        Lich.Inventory.getInstance().deserialize(obj_1.inv);
                                    }
                                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_FINISHED));
                                });
                            }
                        }
                        else {
                            // pokud neexistuje save, vytvoř ho
                            Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_START));
                            Lich.TilesMapGenerator.createNew(function (tilesMap) {
                                populateContent(tilesMap);
                                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_FINISHED));
                                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                            });
                        }
                    });
                };
                var populateContent = function (tilesMap) {
                    // clean 
                    self.stage.removeChildren();
                    delete self.world;
                    delete self.parallax;
                    Lich.EventBus.getInstance().clear();
                    Lich.Mixer.stopAllSounds();
                    // (re)-init
                    if (Lich.Resources.OPTMZ_PARALLAX_SHOW_ON) {
                        self.parallax = new Lich.Parallax();
                        self.stage.addChild(self.parallax);
                    }
                    if (Lich.Resources.OPTMZ_UI_SHOW_ON)
                        self.ui = new Lich.UI(self.renderer.view, tilesMap, mobile);
                    self.world = new Lich.World(self, tilesMap);
                    self.stage.addChild(self.world);
                    self.stage.addChild(self.hitLayer);
                    if (Lich.Resources.OPTMZ_UI_SHOW_ON)
                        self.stage.addChild(self.ui);
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SAVE_WORLD, function () {
                        setTimeout(function () {
                            var idb = Lich.IndexedDB.getInstance();
                            var data = {
                                map: Lich.TilesMapGenerator.serialize(self.getWorld().tilesMap),
                                inv: Lich.Inventory.getInstance().serialize()
                            };
                            idb.saveData(JSON.stringify(data));
                            self.world.fadeText("Game saved", self.stage.fixedWidth / 2, self.stage.fixedHeight / 2, 30, "#00E", "#003");
                        }, 1);
                        return true;
                    });
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_WORLD, function () {
                        loadWorld();
                        return true;
                    });
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.NEW_WORLD, function () {
                        self.loadUI.reset();
                        self.stage.addChild(self.loadUI);
                        self.loadUI.alpha = 1;
                        setTimeout(function () {
                            Lich.TilesMapGenerator.createNew(function (tilesMap) {
                                populateContent(tilesMap);
                                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                            });
                        }, 1);
                        return true;
                    });
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.PLAYER_SPEED_CHANGE, function (data) {
                        self.playerReadyToAutosave = data.x == 0 && data.y == 0;
                        if (self.timerReadyToAutosave && self.playerReadyToAutosave) {
                            Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
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
                setInterval(function () {
                    if (self.playerReadyToAutosave) {
                        Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                        self.timerReadyToAutosave = false;
                    }
                    else {
                        self.timerReadyToAutosave = true;
                    }
                }, 60 * 1000);
                loadWorld();
            };
            if (Lich.Resources.getInstance().isLoaderDone()) {
                init();
            }
            else {
                var listener_1;
                Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_FINISHED, listener_1 = function () {
                    init();
                    Lich.EventBus.getInstance().unregisterConsumer(Lich.EventType.LOAD_FINISHED, listener_1);
                    return false;
                });
                self.loadUI = new Lich.LoaderUI(self);
                self.stage.addChild(self.loadUI);
            }
            window.onbeforeunload = function (evn) {
                var e = evn || window.event;
                // IE & Firefox
                if (e) {
                    e.returnValue = 'Are you sure?';
                }
                // For Safari
                return 'Are you sure?';
            };
            // Controls
            Lich.Keyboard.on(32, function () { Lich.PlayerMovement.levitate = true; }, function () { Lich.PlayerMovement.levitate = false; });
            Lich.Keyboard.on(37, function () { Lich.PlayerMovement.left = true; }, function () { Lich.PlayerMovement.left = false; });
            Lich.Keyboard.on(65, function () { Lich.PlayerMovement.left = true; }, function () { Lich.PlayerMovement.left = false; });
            Lich.Keyboard.on(38, function () { Lich.PlayerMovement.up = true; }, function () { Lich.PlayerMovement.up = false; });
            Lich.Keyboard.on(87, function () { Lich.PlayerMovement.up = true; }, function () { Lich.PlayerMovement.up = false; });
            Lich.Keyboard.on(39, function () { Lich.PlayerMovement.right = true; }, function () { Lich.PlayerMovement.right = false; });
            Lich.Keyboard.on(68, function () { Lich.PlayerMovement.right = true; }, function () { Lich.PlayerMovement.right = false; });
            Lich.Keyboard.on(40, function () { Lich.PlayerMovement.down = true; }, function () { Lich.PlayerMovement.down = false; });
            Lich.Keyboard.on(83, function () { Lich.PlayerMovement.down = true; }, function () { Lich.PlayerMovement.down = false; });
            Lich.Keyboard.on(67, function () { self.ui.craftingUI.toggle(); }, function () { self.ui.craftingUI.prepareForToggle(); });
            Lich.Keyboard.on(27, function () {
                if (self.ui.craftingUI.parent) {
                    self.ui.craftingUI.hide();
                    self.ui.splashScreenUI.suppressToggle();
                }
                else if (self.ui.mapUI.parent) {
                    self.ui.mapUI.hide();
                    self.ui.splashScreenUI.suppressToggle();
                }
                else {
                    self.ui.splashScreenUI.toggle();
                }
            }, function () { self.ui.splashScreenUI.prepareForToggle(); });
            Lich.Keyboard.on(73, function () { self.ui.inventoryUI.toggle(); }, function () { self.ui.inventoryUI.prepareForToggle(); });
            Lich.Keyboard.on(77, function () { self.ui.mapUI.toggle(); }, function () { self.ui.mapUI.prepareForToggle(); });
            Lich.Keyboard.on(78, function () { self.ui.minimapUI.toggle(); }, function () { self.ui.minimapUI.prepareForToggle(); });
            Lich.Keyboard.on(16, function () { self.ui.spellsUI.toggleAlternative(); }, function () { self.ui.spellsUI.prepareForToggleAlternative(); });
            var ticker = PIXI.ticker.shared;
            ticker.add(function () {
                statsFPS.begin();
                // ticker.deltaTime je přepočtený dle speed, to není rozdíl 
                // snímků v ms, jako bylo v createjs
                var delta = ticker.elapsedMS;
                createjs.Tween.tick(delta, false);
                if (self.initialized) {
                    self.world.update(delta);
                    if (self.ui)
                        self.ui.update(delta);
                }
                self.renderer.render(self.stage);
                statsFPS.end();
            });
        }
        Game.prototype.getWorld = function () { return this.world; };
        Game.prototype.getSceneWidth = function () {
            return window.innerWidth; //this.renderer.view.width; 
        };
        Game.prototype.getSceneHeight = function () {
            return window.innerHeight; //this.renderer.view.height; 
        };
        Game.getInstance = function () {
            if (!Game.INSTANCE) {
                Game.INSTANCE = new Game();
            }
            return Game.INSTANCE;
        };
        ;
        return Game;
    }());
    Lich.Game = Game;
})(Lich || (Lich = {}));
