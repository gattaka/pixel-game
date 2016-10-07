///<reference path='lib/createjs/createjs.d.ts'/>
var Lich;
(function (Lich) {
    var Game = (function () {
        function Game(canvasId) {
            this.initialized = false;
            this.keys = {};
            this.mouse = new Lich.Mouse();
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
            (function () {
                // Všechno musí být s prefixem 'stage' jinak se bude snažit chytat 
                // eventy s ohledem na konkrétní objekty a to se drasticky projevuje 
                // na FPS -- takhle se zjišťuje event obecně a je to bez ztrát 
                self.stage.addEventListener("stagemousedown", function (event) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                    if (event.nativeEvent.button == 0) {
                        self.mouse.down = true;
                    }
                    else {
                        self.mouse.rightDown = true;
                    }
                });
                self.stage.addEventListener("stagemousemove", function (event) {
                    self.mouse.x = event["stageX"];
                    self.mouse.y = event["stageY"];
                });
                self.stage.addEventListener("stagemouseup", function (event) {
                    if (event.nativeEvent.button == 0) {
                        self.mouse.down = false;
                    }
                    else {
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
            var init = function () {
                self.ui = new Lich.UI(self);
                var populateContent = function (tilesMap) {
                    self.content.removeAllChildren();
                    delete self.world;
                    delete self.background;
                    self.world = new Lich.World(self, tilesMap);
                    self.background = new Lich.Background(self);
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
                Lich.EventBus.getInstance().registerConsumer(Lich.EventType.SAVE_WORLD, function () {
                    setTimeout(function () {
                        var idb = Lich.IndexedDB.getInstance();
                        var data = {
                            map: Lich.TilesMapGenerator.serialize(self.getWorld().tilesMap),
                            inv: {}
                        };
                        idb.saveData(JSON.stringify(data));
                    }, 1);
                    return true;
                });
                setInterval(function () { Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD)); }, 60 * 1000);
                Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_WORLD, function () {
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
                                return;
                            }
                        }
                        // pokud neexistuje save, vytvoř ho
                        var tilesMap = Lich.TilesMapGenerator.createNew();
                        populateContent(tilesMap);
                        Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                    });
                    return true;
                });
                Lich.EventBus.getInstance().registerConsumer(Lich.EventType.NEW_WORLD, function () {
                    var tilesMap = Lich.TilesMapGenerator.createNew();
                    populateContent(tilesMap);
                    return true;
                });
                self.stage.addEventListener("stagemousemove", function (event) {
                    Lich.EventBus.getInstance().fireEvent(new Lich.MouseMoveEventPayload(event.stageX, event.stageY));
                });
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_WORLD));
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
                self.stage.addChild(self.loadUI = new Lich.GameLoadUI(self));
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
                    if (self.ui.isMouseInUI(self.mouse.x, self.mouse.y)) {
                        self.ui.handleMouse(self.mouse, delta);
                    }
                    else {
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