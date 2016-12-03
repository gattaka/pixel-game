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
    var Game = (function () {
        function Game(canvasId) {
            this.initialized = false;
            this.keys = {};
            this.playerReadyToAutosave = true;
            this.timerReadyToAutosave = false;
            this.mouse = new Lich.Mouse();
            var self = this;
            Game.CURRENT_GAME = self;
            /*------------*/
            /* Stage init */
            /*------------*/
            console.log("running");
            self.canvas = document.getElementById(canvasId);
            self.canvas.style.backgroundColor = "#839e61";
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
            self.canvas.onmousedown = function (event) {
                if (event.button == 0) {
                    self.mouse.down = true;
                }
                else {
                    self.mouse.rightDown = true;
                }
                self.mouse.clickChanged = true;
                self.mouse.consumedByUI = false;
            };
            self.canvas.onmousemove = function (event) {
                self.mouse.x = event.clientX;
                self.mouse.y = event.clientY;
                Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.MOUSE_MOVE, self.mouse.x, self.mouse.y));
            };
            self.canvas.onmouseup = function (event) {
                if (event.button == 0) {
                    self.mouse.down = false;
                }
                else {
                    self.mouse.rightDown = false;
                }
                self.mouse.clickChanged = true;
                self.mouse.consumedByUI = false;
            };
            var init = function () {
                var loadWorld = function () {
                    var idb = Lich.IndexedDB.getInstance();
                    idb.loadData(function (data) {
                        // podařilo se něco nahrát?
                        if (data) {
                            var obj = JSON.parse(data);
                            self.loadUI.reset();
                            self.stage.addChild(self.loadUI);
                            self.loadUI.alpha = 1;
                            if (obj.map) {
                                var tilesMap_1 = Lich.TilesMapGenerator.deserialize(obj.map);
                                populateContent(tilesMap_1);
                                if (obj.inv) {
                                    self.ui.inventoryUI.deserialize(obj.inv);
                                    return;
                                }
                            }
                        }
                        // pokud neexistuje save, vytvoř ho
                        var tilesMap = Lich.TilesMapGenerator.createNew();
                        populateContent(tilesMap);
                        Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                    });
                };
                var populateContent = function (tilesMap) {
                    // clean 
                    self.content.removeAllChildren();
                    delete self.world;
                    delete self.background;
                    Lich.EventBus.getInstance().clear();
                    Lich.Mixer.stopAllSounds();
                    // (re)-init
                    self.ui = new Lich.UI(self.canvas, tilesMap);
                    self.background = new Lich.Background(self);
                    self.world = new Lich.World(self, tilesMap);
                    self.content.addChild(self.world);
                    self.content.addChild(self.ui);
                    Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SAVE_WORLD, function () {
                        setTimeout(function () {
                            var idb = Lich.IndexedDB.getInstance();
                            var data = {
                                map: Lich.TilesMapGenerator.serialize(self.getWorld().tilesMap),
                                inv: self.ui.inventoryUI.serialize()
                            };
                            idb.saveData(JSON.stringify(data));
                            self.world.fadeText("Game saved", self.canvas.width / 2, self.canvas.height / 2, 30, "#00E", "#003");
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
                            var tilesMap = Lich.TilesMapGenerator.createNew();
                            populateContent(tilesMap);
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
            self.content = new createjs.Container();
            self.stage.addChild(self.content);
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
                self.stage.addChild(self.loadUI = new Lich.LoaderUI(self));
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
                    Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.FPS_CHANGE, createjs.Ticker.getMeasuredFPS()));
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
                    var controls = new Controls();
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
                        else if (self.ui.minimapUI.parent) {
                            self.ui.minimapUI.hide();
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
                    for (var i = 0; i < self.ui.spellsUI.spellIndex.length; i++) {
                        if (self.keys[49 + i]) {
                            self.ui.spellsUI.selectSpell(i);
                        }
                    }
                    self.getWorld().update(delta, controls);
                }
                self.stage.update();
            }
        }
        Game.prototype.getCanvas = function () { return this.canvas; };
        Game.prototype.getContent = function () { return this.content; };
        Game.prototype.getBackground = function () { return this.background; };
        Game.prototype.getWorld = function () { return this.world; };
        Game.prototype.getUI = function () { return this.ui; };
        ;
        return Game;
    }());
    Lich.Game = Game;
})(Lich || (Lich = {}));
