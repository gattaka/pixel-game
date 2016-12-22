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
            // Mobile? (detectmobilebrowsers.com)
            var mobile = (function (a) {
                return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
            })(navigator.userAgent || navigator.vendor || window['opera']);
            /*------------*/
            /* Stage init */
            /*------------*/
            console.log("running");
            self.canvas = document.getElementById(canvasId);
            switch (Lich.ThemeWatch.getCurrentTheme()) {
                case Lich.Theme.WINTER:
                    self.canvas.style.backgroundColor = "#cce1e8";
                    break;
                case Lich.Theme.NORMAL:
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
                Lich.Mixer.playMusic(Lich.MusicKey.MSC_DIRT_THEME_KEY, 0.3);
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
                    self.ui = new Lich.UI(self.canvas, tilesMap, mobile);
                    self.background = new Lich.Background(self);
                    self.world = new Lich.World(self, tilesMap);
                    self.weather = new Lich.Weather(self);
                    self.content.addChild(self.world);
                    self.content.addChild(self.weather);
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
                    }
                    self.getWorld().update(delta, controls);
                    self.weather.update(delta);
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
