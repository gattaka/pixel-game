///<reference path='lib/createjs/createjs.d.ts'/>
var Lich;
(function (Lich) {
    var Game = (function () {
        function Game(canvasId) {
            this.initialized = false;
            this.keys = {};
            this.mouse = new Mouse();
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
            self.canvas.onmousedown = function (event) {
                if (event.button == 0) {
                    self.mouse.down = true;
                }
                else {
                    self.mouse.rightDown = true;
                }
                self.mouse.clickChanged = true;
                self.mouse.clickChangedX = event.clientX;
                self.mouse.clickChangedY = event.clientY;
            };
            self.canvas.onmousemove = function (event) {
                self.mouse.x = event.clientX;
                self.mouse.y = event.clientY;
            };
            self.canvas.onmouseup = function (event) {
                if (event.button == 0) {
                    self.mouse.down = false;
                }
                else {
                    self.mouse.rightDown = false;
                }
                self.mouse.clickChanged = true;
                self.mouse.clickChangedX = event.clientX;
                self.mouse.clickChangedY = event.clientY;
            };
            var init = function () {
                var loadWorld = function () {
                    var idb = IndexedDB.getInstance();
                    idb.loadData(function (data) {
                        // podařilo se něco nahrát?
                        if (data) {
                            var obj = JSON.parse(data);
                            self.loadUI.reset();
                            self.stage.addChild(self.loadUI);
                            self.loadUI.alpha = 1;
                            if (obj.map) {
                                var tilesMap_1 = TilesMapGenerator.deserialize(obj.map);
                                populateContent(tilesMap_1);
                                if (obj.inv) {
                                    self.ui.inventoryUI.deserialize(obj.inv);
                                    return;
                                }
                            }
                        }
                        // pokud neexistuje save, vytvoř ho
                        var tilesMap = TilesMapGenerator.createNew();
                        populateContent(tilesMap);
                        EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                    });
                };
                var populateContent = function (tilesMap) {
                    // clean 
                    self.content.removeAllChildren();
                    delete self.world;
                    delete self.background;
                    EventBus.getInstance().clear();
                    Mixer.stopAll();
                    // re-init
                    self.ui = new UI(self);
                    self.world = new World(self, tilesMap);
                    self.background = new Background(self);
                    self.content.addChild(self.world);
                    self.content.addChild(self.ui);
                    EventBus.getInstance().registerConsumer(EventType.SAVE_WORLD, function () {
                        setTimeout(function () {
                            var idb = IndexedDB.getInstance();
                            var data = {
                                map: TilesMapGenerator.serialize(self.getWorld().tilesMap),
                                inv: self.ui.inventoryUI.serialize()
                            };
                            idb.saveData(JSON.stringify(data));
                        }, 1);
                        return true;
                    });
                    EventBus.getInstance().registerConsumer(EventType.LOAD_WORLD, function () {
                        loadWorld();
                        return true;
                    });
                    EventBus.getInstance().registerConsumer(EventType.NEW_WORLD, function () {
                        var tilesMap = TilesMapGenerator.createNew();
                        populateContent(tilesMap);
                        return true;
                    });
                    createjs.Tween.get(self.loadUI)
                        .to({
                        alpha: 0
                    }, 1500).call(function () {
                        self.stage.removeChild(self.loadUI);
                    });
                    self.initialized = true;
                };
                setInterval(function () { EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD)); }, 60 * 1000);
                self.stage.addEventListener("stagemousemove", function (event) {
                    EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.MOUSE_MOVE, event.stageX, event.stageY));
                });
                loadWorld();
            };
            self.content = new createjs.Container();
            self.stage.addChild(self.content);
            if (Resources.getInstance().isLoaderDone()) {
                init();
            }
            else {
                var listener_1;
                EventBus.getInstance().registerConsumer(EventType.LOAD_FINISHED, listener_1 = function () {
                    init();
                    EventBus.getInstance().unregisterConsumer(EventType.LOAD_FINISHED, listener_1);
                    return false;
                });
                self.stage.addChild(self.loadUI = new LoaderUI(self));
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
                    // isMouseInUI je časově náročné, proto je volání filtrováno přes clickChanged příznak
                    // a porovnání souřadnic
                    if (self.mouse.clickChanged) {
                        if (self.ui.isMouseInUI(self.mouse.x, self.mouse.y)) {
                            self.ui.handleMouse(self.mouse, delta);
                            self.mouse.consumedByUI = true;
                        }
                        self.mouse.clickChanged = false;
                    }
                    // změna clickChanged se zapíše jenom jednou, pak začnu padat do této větve podmínky,
                    // kontroluj proto ještě souřadnice, na kterých se to stalo (ale jenom v případě, že 
                    // tomu předcházelo kliknutí do UI -- jinak by se muselo po mousedown ještě pohnout
                    // kurzorem aby se ve world něco stalo)
                    if (self.mouse.consumedByUI == false || (self.mouse.x != self.mouse.clickChangedX && self.mouse.y != self.mouse.clickChangedY)) {
                        self.getWorld().handleMouse(self.mouse, delta);
                        self.mouse.consumedByUI = false;
                    }
                    // Při delším prodlení (nízké FPS) bude akcelerace působit 
                    // fakticky delší dobu, ale hra nemá možnost zjistit, že hráč
                    // už nedrží např. šipku -- holt "LAG" :)
                    // Controls
                    var directions = {
                        up: false,
                        down: false,
                        left: false,
                        right: false
                    };
                    if (self.keys[37])
                        directions.left = true;
                    if (self.keys[38])
                        directions.up = true;
                    if (self.keys[39])
                        directions.right = true;
                    if (self.keys[40])
                        directions.down = true;
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
                    }
                    else {
                        self.ui.craftingUI.prepareForToggle();
                    }
                    if (self.keys[27]) {
                        self.ui.splashScreenUI.toggle();
                    }
                    else {
                        self.ui.splashScreenUI.prepareForToggle();
                    }
                    if (self.keys[73]) {
                        self.ui.inventoryUI.toggleInv();
                    }
                    else {
                        self.ui.inventoryUI.prepareForToggleInv();
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
                    self.getWorld().update(delta, directions);
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
