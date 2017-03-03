///<reference path='lib/createjs/createjs.d.ts'/>
var Lich;
(function (Lich) {
    var Controls = (function () {
        function Controls() {
            this.up = false;
            this.down = false;
            this.left = false;
            this.right = false;
            this.levitate = false;
        }
        return Controls;
    }());
    Lich.Controls = Controls;
    ;
    ;
    var Game = (function () {
        function Game(minimapCanvasId, loaderCanvasId) {
            this.initialized = false;
            this.playerReadyToAutosave = true;
            this.timerReadyToAutosave = false;
            this.mouse = new Lich.Mouse();
            var self = this;
            Game.CURRENT_GAME = self;
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
            self.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
                antialias: false,
                roundPixels: false,
                autoResize: false
            });
            self.renderer.view.style.position = "absolute";
            self.renderer.view.style.display = "block";
            self.renderer.backgroundColor = 0xfafaea;
            switch (Lich.ThemeWatch.getCurrentTheme()) {
                case Lich.Theme.WINTER:
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
            /*--------------*/
            /* Mouse events */
            /*--------------*/
            if (mobile) {
                self.stage.on("pointerdown", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    self.mouse.down = true;
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
                    self.mouse.x = mouseData.x;
                    self.mouse.y = mouseData.y;
                });
                self.stage.on("pressmove", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    self.mouse.x = mouseData.x;
                    self.mouse.y = mouseData.y;
                    Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.MOUSE_MOVE, self.mouse.x, self.mouse.y));
                });
                self.stage.on("pressup", function () {
                    self.mouse.down = false;
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
                });
            }
            else {
                self.stage.on("mousedown", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse;
                    if (mouseData.button == 0) {
                        self.mouse.down = true;
                    }
                    else {
                        self.mouse.rightDown = true;
                    }
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
                });
                self.stage.on("mousemove", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse.global;
                    self.mouse.x = mouseData.x;
                    self.mouse.y = mouseData.y;
                    Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.MOUSE_MOVE, self.mouse.x, self.mouse.y));
                });
                self.stage.on("mouseup", function () {
                    var mouseData = self.renderer.plugins.interaction.mouse;
                    if (mouseData.button == 0) {
                        self.mouse.down = false;
                    }
                    else {
                        self.mouse.rightDown = false;
                    }
                    self.mouse.clickChanged = true;
                    self.mouse.consumedByUI = false;
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
                            if (obj_1.map) {
                                Lich.TilesMapGenerator.deserialize(obj_1.map, function (tilesMap) {
                                    populateContent(tilesMap);
                                    if (obj_1.inv) {
                                        // TODO
                                        // self.ui.inventoryUI.deserialize(obj.inv);
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
                    delete self.background;
                    Lich.EventBus.getInstance().clear();
                    Lich.Mixer.stopAllSounds();
                    // (re)-init
                    self.ui = new Lich.UI(self.renderer.view, tilesMap, mobile);
                    self.background = new Lich.Background();
                    self.world = new Lich.World(self, tilesMap);
                    self.stage.addChild(self.background);
                    self.stage.addChild(self.world);
                    self.stage.addChild(self.ui);
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SAVE_WORLD, function () {
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
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_WORLD, function () {
                        loadWorld();
                        return true;
                    });
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.NEW_WORLD, function () {
                        self.loadUI.reset();
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
            // TODO mobile
            // controls = self.ui.controls;
            var controls = new Controls();
            Lich.Keyboard.on(32, function () { controls.levitate = true; }, function () { controls.levitate = false; });
            Lich.Keyboard.on(37, function () { controls.left = true; }, function () { controls.left = false; });
            Lich.Keyboard.on(65, function () { controls.left = true; }, function () { controls.left = false; });
            Lich.Keyboard.on(38, function () { controls.up = true; }, function () { controls.up = false; });
            Lich.Keyboard.on(87, function () { controls.up = true; }, function () { controls.up = false; });
            Lich.Keyboard.on(39, function () { controls.right = true; }, function () { controls.right = false; });
            Lich.Keyboard.on(68, function () { controls.right = true; }, function () { controls.right = false; });
            Lich.Keyboard.on(40, function () { controls.down = true; }, function () { controls.down = false; });
            Lich.Keyboard.on(83, function () { controls.down = true; }, function () { controls.down = false; });
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
            Lich.Keyboard.on(16, function () { self.ui.spellsUI.toggle(); }, function () { self.ui.spellsUI.prepareForToggle(); });
            for (var i = 0; i < Lich.Spellbook.getInstance().spellIndex.length; i++) {
                Lich.Keyboard.on(49 + i, function () { self.ui.spellsUI.selectSpell(i); });
            }
            var ticker = PIXI.ticker.shared;
            ticker.add(function () {
                // ticker.deltaTime je přepočtený dle speed, to není rozdíl snímků v ms, jako bylo v createjs
                var delta = ticker.elapsedMS;
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.FPS_CHANGE, ticker.FPS));
                if (self.initialized) {
                    // UI má při akcích myši přednost
                    // isMouseInUI je časově náročné, proto je volání filtrováno
                    // UI bere pouze mousedown akce a to pouze jednou (ignoruje dlouhé stisknutí)
                    if (self.mouse.down && self.mouse.clickChanged) {
                        if (self.ui.isMouseInUI(self.mouse.x, self.mouse.y)) {
                            // blokuj akci světa
                            self.mouse.consumedByUI = true;
                            self.mouse.clickChanged = false;
                        }
                    }
                    if (!self.mouse.down && self.mouse.clickChanged) {
                        self.ui.controls = new Controls();
                    }
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
                    // Idle
                    self.getWorld().handleTick(delta);
                    self.getWorld().update(delta, controls);
                }
                self.renderer.render(self.stage);
            });
        }
        Game.prototype.getWorld = function () { return this.world; };
        Game.prototype.getSceneWidth = function () {
            return window.innerWidth; //this.renderer.view.width; 
        };
        Game.prototype.getSceneHeight = function () {
            return window.innerHeight; //this.renderer.view.height; 
        };
        ;
        return Game;
    }());
    Lich.Game = Game;
})(Lich || (Lich = {}));
