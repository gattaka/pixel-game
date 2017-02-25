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
            this.keys = {};
            this.playerReadyToAutosave = true;
            this.timerReadyToAutosave = false;
            this.mouse = new Lich.Mouse();
            var self = this;
            Game.CURRENT_GAME = self;
            // stats
            var stats = new Stats();
            stats.showPanel(0);
            document.body.appendChild(stats.dom);
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
            self.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
            self.renderer.view.style.position = "absolute";
            self.renderer.view.style.display = "block";
            self.renderer.backgroundColor = 0xfafaea;
            switch (Lich.ThemeWatch.getCurrentTheme()) {
                case Lich.Theme.WINTER:
                    self.renderer.backgroundColor = 0xcce1e8;
                default:
                    self.renderer.backgroundColor = 0x839e61;
            }
            self.renderer.autoResize = false;
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
                    self.background = new Lich.Background(self.renderer.view);
                    self.world = new Lich.World(self, tilesMap);
                    self.stage.addChild(self.background);
                    self.stage.addChild(self.world);
                    // self.content.addChild(self.ui);
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
            // Je potřeba omezit FPS pro výpočty, jinak se budou provádět 
            // při každém drobném snímku a to není potřeba
            var fps = 60;
            var interval = 1000 / fps;
            var delta = 0;
            var ticker = PIXI.ticker.shared;
            ticker.add(function () {
                stats.begin();
                var renderDelta = ticker.deltaTime;
                delta = renderDelta * 10;
                if (self.initialized) {
                    // Idle
                    self.getWorld().handleTick(delta);
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
                    // Controls
                    var controls = void 0;
                    if (mobile) {
                        controls = self.ui.controls;
                    }
                    else {
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
                        if (self.keys[67]) {
                            self.ui.craftingUI.toggle();
                        }
                        else {
                            self.ui.craftingUI.prepareForToggle();
                        }
                        if (self.keys[27]) {
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
                        }
                        else {
                            self.ui.splashScreenUI.prepareForToggle();
                        }
                        if (self.keys[73]) {
                            self.ui.inventoryUI.toggle();
                        }
                        else {
                            self.ui.inventoryUI.prepareForToggle();
                        }
                        if (self.keys[77]) {
                            self.ui.mapUI.toggle();
                        }
                        else {
                            self.ui.mapUI.prepareForToggle();
                        }
                        if (self.keys[78]) {
                            self.ui.minimapUI.toggle();
                        }
                        else {
                            self.ui.minimapUI.prepareForToggle();
                        }
                        if (self.keys[16]) {
                            self.ui.spellsUI.toggleShift();
                        }
                        else {
                            self.ui.spellsUI.prepareForToggleShift();
                        }
                        // TODO
                        for (var i = 0; i < Lich.Spellbook.getInstance().spellIndex.length; i++) {
                            if (self.keys[49 + i]) {
                                self.ui.spellsUI.selectSpell(i);
                            }
                        }
                    }
                    self.getWorld().update(delta, controls);
                    delta = 0;
                }
                self.renderer.render(self.stage);
                stats.end();
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
