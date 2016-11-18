/**
 * world.js
 * 
 * Stará se o interakce objektů ve světě, kolize, fyziku apod.
 * 
 */
namespace Lich {

    class WorldObject extends AbstractWorldObject {
        constructor(
            public item: DugObjDefinition,
            public width: number,
            public height: number,
            public spriteSheet: createjs.SpriteSheet,
            public initState: string,
            public states: Object,
            public collXOffset: number,
            public collYOffset: number,
            public notificationTimer: number) {
            super(width, height, spriteSheet, initState, collXOffset, collYOffset);
        };
    }

    export class World extends createjs.Container {

        /*-----------*/
        /* CONSTANTS */
        /*-----------*/

        static OBJECT_NOTIFY_TIME = 500;
        static OBJECT_NOTIFY_BOUNCE_SPEED = 120;
        static OBJECT_PICKUP_DISTANCE = 10;
        static OBJECT_PICKUP_FORCE_DISTANCE = 100;
        static OBJECT_PICKUP_FORCE_TIME = 150;

        // Pixel/s2
        static WORLD_GRAVITY = -1200;
        static CLIMBING_SPEED = -200;
        static MAX_FREEFALL_SPEED = -1200;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        freeObjects = Array<WorldObject>();
        bulletObjects = Array<BulletObject>();
        labelObjects = new Array<Label>();

        render: Render;
        hero: Hero;

        enemiesCount = 0;
        enemies = new Array<AbstractEnemy>();

        constructor(public game: Game, public tilesMap: TilesMap) {
            super();

            var self = this;

            self.render = new Render(game, self);
            self.hero = new Hero();

            /*------------*/
            /* Characters */
            /*------------*/
            self.addChild(self.hero);
            self.placePlayerOnSpawnPoint();

            /*------------*/
            /* Dig events */
            /*------------*/

            let listener = function (objType: Diggable, x: number, y: number) {
                if (typeof objType.item !== "undefined") {
                    for (var i = 0; i < objType.item.quant; i++) {
                        self.spawnObject(objType.item, x, y);
                    }
                }
            };

            self.render.addOnDigSurfaceListener(listener);
            self.render.addOnDigObjectListener(listener);

            console.log("earth ready");
        }

        fadeEnemy(enemy: AbstractEnemy) {
            let self = this;
            createjs.Tween.get(enemy)
                .to({
                    alpha: 0
                }, 5000).call(function () {
                    self.enemies[enemy.id] = undefined;
                    self.removeChild(enemy);
                    self.enemiesCount--;
                    EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.ENEMY_COUNT_CHANGE, self.enemiesCount));
                });
        }

        resetPlayer() {
            this.hero.fillHealth(this.hero.getMaxHealth());
            this.hero.fillWill(this.hero.getMaxWill());
            this.hero.idle();
            this.placePlayerOnSpawnPoint();
        }

        showDeadInfo() {
            let self = this;

            let deadInfo = new createjs.Container();
            this.addChild(deadInfo);

            let shape = new createjs.Shape();
            shape.width = this.game.getCanvas().width;
            shape.height = this.game.getCanvas().height;
            shape.graphics.beginFill("rgba(10,10,10,0.9)");
            shape.graphics.drawRect(0, 0, shape.width, shape.height);
            shape.x = 0;
            shape.y = 0;
            deadInfo.addChild(shape);

            let bitmap = Resources.getInstance().getBitmap(UIGFXKey[UIGFXKey.GAME_OVER_KEY]);
            let bounds = bitmap.getBounds();
            bitmap.x = shape.width / 2 - bounds.width / 2;
            bitmap.y = shape.height / 2 - bounds.height / 2;
            deadInfo.addChild(bitmap);
            deadInfo.alpha = 0;

            createjs.Tween.get(deadInfo)
                .to({
                    alpha: 1
                }, 2000).wait(3000).call(() => {
                    self.resetPlayer();
                    Mixer.playSound(SoundKey.SND_TELEPORT_KEY);
                }).to({
                    alpha: 0
                }, 200).call(() => {
                    self.removeChild(deadInfo);
                })
        }

        fadeText(text: string, px: number, py: number, size = PartsUI.TEXT_SIZE, color = Resources.TEXT_COLOR, outlineColor = Resources.OUTLINE_COLOR) {
            let self = this;
            let label = new Label(text, size + "px " + Resources.FONT, color, true, outlineColor, 1);
            self.addChild(label);
            label.x = px;
            label.y = py;
            label["tweenY"] = 0;
            label["virtualY"] = py;
            let id = 0;
            for (id = 0; id < self.labelObjects.length; id++) {
                // buď najdi volné místo...
                if (!self.labelObjects[id]) {
                    break;
                }
            }
            // ...nebo vlož položku na konec pole
            self.labelObjects[id] = label;
            createjs.Tween.get(label)
                .to({
                    alpha: 0,
                    tweenY: -100
                }, 1000).call(function () {
                    self.labelObjects[id] = undefined;
                    self.removeChild(label);
                });
        }

        spawnObject(invItem: DugObjDefinition, x: number, y: number, inTiles = true) {
            let self = this;
            var invDef: InvObjDefinition = Resources.getInstance().invObjectDefs[invItem.invObj];
            var frames = 1;
            if (typeof invDef === "undefined" || invDef == null) {
                frames = 1;
            } else {
                frames = invDef.frames;
            }
            var image = Resources.getInstance().getImage(InventoryKey[invItem.invObj]);
            var object = new WorldObject(
                invItem,
                image.width / frames, // aby se nepoužila délka všech snímků vedle sebe
                image.height,
                Resources.getInstance().getSpriteSheet(InventoryKey[invItem.invObj], frames),
                "idle",
                { "idle": "idle" },
                2,
                0,
                World.OBJECT_NOTIFY_TIME);
            object.speedx = 0;
            object.speedy = (Math.random() * 2 + 1) * World.OBJECT_NOTIFY_BOUNCE_SPEED;
            if (inTiles) {
                var coord = self.render.tilesToPixel(x, y);
                object.x = coord.x + 10 - Math.random() * 20;
                object.y = coord.y;
            } else {
                object.x = x + 10 - Math.random() * 20;
                object.y = y;
            }
            self.freeObjects.push(object);
            self.addChild(object);
        };

        setSpawnPoint(tx: number, ty: number): boolean {
            var self = this;
            let hero = self.hero;
            let heroWidth = self.render.pixelsDistanceToTiles(hero.width);
            let heroHeight = self.render.pixelsDistanceToTiles(hero.height);
            // posuv nahoru o výšku hráče, aby u spawn pointu stál nohama
            ty -= heroHeight - 2;
            // je hráče kam umístit?
            let fits = true;
            (() => {
                for (let hyt = 0; hyt < heroHeight; hyt++) {
                    for (let hxt = 0; hxt < heroWidth; hxt++) {
                        let result = self.isCollisionByTiles(tx + hxt, ty + hyt);
                        if (result.hit) {
                            fits = false;
                            return;
                        }
                    }
                }
            })();
            if (fits) {
                this.tilesMap.spawnPoint = new Coord2D(tx, ty - 1);
            }
            return fits;
        }

        placePlayerOnSpawnPoint() {
            var self = this;
            let game = self.game;
            let tilesMap = self.tilesMap;
            self.hero.x = game.getCanvas().width / 2;
            self.hero.y = game.getCanvas().height / 2;
            let hero = self.hero;
            // Tohle je potřeba udělat, jinak se při více teleportech hráči
            // nastřádá rychlost a například směrem dolů se při opakovaném
            // teleportování 1px nad zemí pak dokáže i zabít :)  
            hero.speedx = 0;
            hero.speedy = 0;
            let heroWidth = self.render.pixelsDistanceToTiles(hero.width);
            let heroHeight = self.render.pixelsDistanceToTiles(hero.height);
            let pCoord;
            if (tilesMap.spawnPoint) {
                pCoord = self.render.tilesToPixel(tilesMap.spawnPoint.x, tilesMap.spawnPoint.y);
            } else {
                let xt = tilesMap.width / 2;
                for (let yt = 0; yt < tilesMap.height; yt++) {
                    // je hráče kam umístit?
                    let fits = true;
                    (() => {
                        for (let hyt = 0; hyt < heroHeight; hyt++) {
                            for (let hxt = 0; hxt < heroWidth; hxt++) {
                                let result = self.isCollisionByTiles(xt + hxt, yt + hyt);
                                if (result.hit) {
                                    fits = false;
                                    return;
                                }
                            }
                        }
                    })();
                    if (fits) {
                        // je hráče na co umístit?
                        let sits = false;
                        (() => {
                            for (let hxt = 0; hxt < heroWidth; hxt++) {
                                let result = self.isCollisionByTiles(xt + hxt, yt + heroHeight + 1);
                                if (result.hit) {
                                    sits = true;
                                    return;
                                }
                            }
                        })();
                        if (sits) {
                            pCoord = self.render.tilesToPixel(xt, yt);
                            break;
                        }
                    }
                }
            }
            self.shiftWorldBy(-(pCoord.x - hero.x), -(pCoord.y - hero.y));
        }

        /**
         * Udává, o kolik se má ve scéně posunout svět, záporné shiftX tedy posouvá 
         * fyzicky svět doleva, takže je to jako kdyby hráč šel doprava 
         */
        shiftWorldBy(shiftX: number, shiftY: number) {
            let self = this;
            let rndDstX = Utils.floor(shiftX);
            let rndDstY = Utils.floor(shiftY);
            let canvasCenterX = self.game.getCanvas().width / 2;
            let canvasCenterY = self.game.getCanvas().height / 2;
            let willShiftX = self.render.canShiftX(rndDstX) && self.hero.x == canvasCenterX;
            let willShiftY = self.render.canShiftY(rndDstY) && self.hero.y == canvasCenterY;

            self.render.shiftSectorsBy(willShiftX ? rndDstX : 0, willShiftY ? rndDstY : 0);
            self.game.getBackground().shift(willShiftX ? rndDstX : 0, willShiftY ? rndDstY : 0);

            let toShift = [self.freeObjects, self.bulletObjects, self.enemies];

            self.labelObjects.forEach(function (item) {
                if (item) {
                    if (willShiftX)
                        item.x += rndDstX;
                    if (willShiftY)
                        item["virtualY"] += rndDstY;
                }
            });

            toShift.forEach((items: Array<WorldObject>) => {
                items.forEach((item) => {
                    if (item) {
                        if (willShiftX)
                            item.x += rndDstX;
                        if (willShiftY)
                            item.y += rndDstY;
                    }
                });
            });

            if (!willShiftX) {
                // Scéna se nehýbe (je v krajních pozicích) posuň tedy jenom hráče
                // Zabraňuje přeskakování středu, na který jsou vztažené kontroly
                if (self.hero.x > canvasCenterX && self.hero.x - rndDstX < canvasCenterX
                    || self.hero.x < canvasCenterX && self.hero.x - rndDstX > canvasCenterX) {
                    self.hero.x = canvasCenterX;
                } else {
                    self.hero.x -= rndDstX;
                }
            }
            if (!willShiftY) {
                if (self.hero.y > canvasCenterY && self.hero.y - rndDstY < canvasCenterY
                    || self.hero.y < canvasCenterY && self.hero.y - rndDstY > canvasCenterY) {
                    self.hero.y = canvasCenterY;
                } else {
                    self.hero.y -= rndDstY;
                }
            }
        };

        shiftWorldTo(x: number, y: number) {
            let shiftX = x - this.render.getScreenOffsetX();
            let shiftY = y - this.render.getScreenOffsetY();
            this.shiftWorldBy(shiftX, shiftY);
        }

        private shouldIgnoreOneWayColls(distanceY: number, object: AbstractWorldObject) {
            let self = this;
            // jsem aktuálně nad oneWay objektem a padám? 
            let ignoreOneWay = true;
            if (distanceY < 0) {
                let preClsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    0,
                    self.isCollision.bind(self),
                    // nepropadávej oneWay kolizemi 
                    false
                );
                // pokud hit, pak právě jsem ve oneWay kolizi, 
                // takže bych měl volně padat. V opačném případě 
                // jsem ve volném prostoru a cokoliv oneWay, co 
                // potkám po cestě dolů musí fungovat jako kolize
                ignoreOneWay = preClsnTest.hit;
            }
            return ignoreOneWay;
        }

        updateObject(sDelta: number, object: AbstractWorldObject, makeShift: (x: number, y: number) => any, forceFall = false) {
            var self = this;
            var clsnTest: CollisionTestResult;
            var clsnPosition;

            if (object.speedy !== 0) {

                // dráha, kterou objekt urazil za daný časový úsek, 
                // kdy je známa jeho poslední rychlost a zrychlení, 
                // které na něj za daný časový úsek působilo:
                // s_t = vt + 1/2.at^2
                var distanceY = Utils.floor(object.speedy * sDelta + World.WORLD_GRAVITY * Math.pow(sDelta, 2) / 2);
                // uprav rychlost objektu, která se dá spočítat jako: 
                // v = v_0 + at
                object.speedy = object.speedy + World.WORLD_GRAVITY * sDelta;
                if (object.speedy < World.MAX_FREEFALL_SPEED)
                    object.speedy = World.MAX_FREEFALL_SPEED;

                // Nenarazím na překážku?
                let ignoreOneWay = forceFall ? true : self.shouldIgnoreOneWayColls(distanceY, object);
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    distanceY,
                    self.isCollision.bind(self),
                    ignoreOneWay
                );

                if (clsnTest.hit === false) {
                    // pokud není kolize a stoupám
                    // pokud klesám, pak klesám po jiném povrchu, než je žebřík
                    // pokud klesám po žebříku, pak to musí být vynucené
                    if (distanceY > 0 || clsnTest.collisionType != CollisionType.LADDER || forceFall) {
                        makeShift(0, distanceY);
                        // pokud padám na žebříku, udržuj rychlost na CLIMBING_SPEED
                        if (clsnTest.collisionType == CollisionType.LADDER && (forceFall || distanceY > 0)) {
                            object.speedy = World.CLIMBING_SPEED;
                        }
                    } else {
                        object.speedy = 0;
                    }
                } else {
                    if (distanceY > 0) {
                        // zastavil jsem se při stoupání? Začni hned padat
                        // TODO doskoč do stropu, jinak se někdy nebude dá "vskočit" do úzkých oken apod.
                    }
                    else {
                        // zastavil jsem se při pádu? Konec skoku
                        // "doskoč" až na zem
                        // získej pozici kolizního bloku
                        clsnPosition = self.render.tilesToPixel(clsnTest.x, clsnTest.y);
                        makeShift(0, -1 * (clsnPosition.y - (object.y + object.height - object.collYOffset)));
                    }
                    object.speedy = 0;
                }

            }

            // pokud nejsem zrovna uprostřed skoku 
            if (object.speedy === 0) {

                // ...a mám kam padat
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    -1,
                    self.isCollision.bind(this),
                    // pád z klidu se vždy musí zaseknout o oneWay kolize 
                    // výjimkou je, když hráč chce propadnou níž
                    forceFall
                );
                if (clsnTest.hit === false) {
                    if (clsnTest.collisionType != CollisionType.LADDER) {
                        // pokud klesám, pak klesám po jiném povrchu, než je žebřík
                        object.speedy = -1;
                    } else if (forceFall) {
                        // pokud klesám po žebříku, pak to musí být vynucené
                        // a pak klesám konstantní rychlostí
                        object.speedy = World.CLIMBING_SPEED;
                    }
                }
            }

            if (object.speedx !== 0) {
                var distanceX = Utils.floor(sDelta * object.speedx);

                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    distanceX,
                    0,
                    self.isCollision.bind(self),
                    // horizontální pohyb vždy ignoruje oneWay kolize
                    true
                );
                // bez kolize, proveď posun
                if (clsnTest.hit === false) {
                    makeShift(distanceX, 0);
                }
                // kolize, zkus zmenšit posun
                else {
                    // získej pozici kolizního bloku
                    clsnPosition = self.render.tilesToPixel(clsnTest.x, clsnTest.y);
                    if (distanceX > 0) {
                        // narazil jsem do něj zprava
                        makeShift(object.x + object.collXOffset - (clsnPosition.x + Resources.TILE_SIZE) - 1, 0);
                    } else {
                        // narazil jsem do něj zleva
                        makeShift(-1 * (clsnPosition.x - (object.x + object.width - object.collXOffset) - 1), 0);
                    }
                }
            }

            if (typeof object.updateAnimations !== "undefined") {
                object.updateAnimations();
            }

        };

        update(delta, controls: Controls) {
            var self = this;
            var sDelta = delta / 1000; // ms -> s

            // AI Enemies
            self.enemies.forEach(function (enemy) {
                if (enemy)
                    enemy.runAI(self, delta);
            });

            // Je-li hráč naživu, vnímej ovládání
            if (self.hero.getCurrentHealth() > 0) {
                // Dle kláves nastav rychlosti
                // Nelze akcelerovat nahoru, když už 
                // rychlost mám (nemůžu skákat ve vzduchu)
                if (controls.up && self.hero.speedy === 0) {
                    self.hero.speedy = self.hero.accelerationY;
                } else if (controls.levitate) {
                    self.hero.speedy = self.hero.accelerationY;
                }

                // Horizontální akcelerace
                if (controls.left) {
                    self.hero.speedx = self.hero.accelerationX;
                } else if (controls.right) {
                    self.hero.speedx = -self.hero.accelerationX;
                } else {
                    self.hero.speedx = 0;
                }
            }

            self.labelObjects.forEach(function (item) {
                if (item) {
                    item.y = item["virtualY"] + item["tweenY"];
                }
            });

            // update hráče
            let oldSpeedY = self.hero.speedy;
            self.updateObject(sDelta, self.hero, self.shiftWorldBy.bind(self), controls.down);
            if (self.hero.speedy == 0 && oldSpeedY < 0) {
                let threshold = World.MAX_FREEFALL_SPEED / 1.5;
                oldSpeedY -= threshold;
                if (oldSpeedY < 0) {
                    self.hero.hit(Math.floor(self.hero.getMaxHealth() * oldSpeedY / (World.MAX_FREEFALL_SPEED - threshold)), this);
                }
            }

            EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.PLAYER_POSITION_CHANGE, self.hero.x, self.hero.y));
            EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.PLAYER_SPEED_CHANGE, self.hero.speedx, self.hero.speedy));

            // update nepřátel
            self.enemies.forEach(function (enemy) {
                if (enemy) {
                    self.updateObject(sDelta, enemy,
                        function (x, y) {
                            var rndX = Utils.floor(x);
                            var rndY = Utils.floor(y);
                            enemy.x -= rndX;
                            enemy.y -= rndY;
                        });
                }
            });

            // update projektilů
            (function () {
                for (var i = 0; i < self.bulletObjects.length; i++) {
                    var object = self.bulletObjects[i];
                    object.update(sDelta, self.game);
                    if (object.isDone() || object.currentAnimation === "done") {
                        self.bulletObjects.splice(i, 1);
                        self.removeChild(object);
                    }
                }
            })();

            // update sebratelných objektů
            (function () {
                for (var i = 0; i < self.freeObjects.length; i++) {
                    var object = self.freeObjects[i];
                    // pohni objekty
                    self.updateObject(sDelta, object, function (x, y) {
                        var rndX = Utils.floor(x);
                        var rndY = Utils.floor(y);
                        object.x -= rndX;
                        object.y -= rndY;
                    });

                    // zjisti, zda hráč objekt nesebral
                    if (self.hero.getCurrentHealth() > 0) {
                        var heroCenterX = self.hero.x + self.hero.width / 2;
                        var heroCenterY = self.hero.y + self.hero.height / 2;
                        var itemCenterX = object.x + object.width / 2;
                        var itemCenterY = object.y + object.height / 2;

                        if (Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < World.OBJECT_PICKUP_DISTANCE) {
                            self.game.getUI().inventoryUI.invInsert(object.item.invObj, 1);
                            self.freeObjects.splice(i, 1);
                            self.removeChild(object);
                            Mixer.playSound(SoundKey.SND_PICK_KEY, false, 0.2);
                            object = null;
                        }
                        if (object !== null && Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < World.OBJECT_PICKUP_FORCE_DISTANCE) {
                            createjs.Tween.get(object)
                                .to({
                                    x: heroCenterX - object.width / 2,
                                    y: heroCenterY - object.height / 2
                                }, World.OBJECT_PICKUP_FORCE_TIME);
                        }
                    }
                }
            })();

        };

        /**
         * Zjistí zda na daných pixel-souřadnicích dochází ke kolizi 
         */
        isCollision(x: number, y: number): CollisionTestResult {
            var self = this;
            var result = self.render.pixelsToTiles(x, y);
            return self.isCollisionByTiles(result.x, result.y);
        };

        /**
         * Zjistí zda na daných tile-souřadnicích dochází ke kolizi 
         */
        isCollisionByTiles(x: number, y: number): CollisionTestResult {
            var self = this;
            // kolize s povrchem/hranicí mapy
            var val = self.tilesMap.mapRecord.getValue(x, y);
            if (val != null && val != 0) {
                let res = Resources.getInstance();
                let collisionType = res.mapSurfaceDefs[res.surfaceIndex.getType(val)].collisionType;
                return new CollisionTestResult(true, x, y, collisionType);
            }
            // kolize "mimo mapu"
            if (val == null) {
                return new CollisionTestResult(true, x, y);
            }

            // kolize s kolizními objekty
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(x, y);
            if (objectElement !== null) {
                var objType: MapObjDefinition = Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                if (objType.collision)
                    return new CollisionTestResult(true, x, y);
            }

            // bez kolize
            return new CollisionTestResult(false, x, y);
        };

        /**
         * Zjistí zda dojde ke kolizi, když se z aktuálních pixel-souřadnic posunu o nějakou 
         * vzdálenost. Započítává velikost celého objektu tak, aby nebyla v kolizi ani jedna 
         * jeho hrana. Bere v potaz, že se při posunu o danou vzdálenost objekt neteleportuje, 
         * ale postupně posouvá, takže kontroluje celý interval mezi aktuální polohou a cílem. 
         */
        isBoundsInCollision(x: number, y: number, objectWidth: number, objectHeight: number, objectXShift: number, objectYShift: number,
            collisionTester: (x: number, y: number) => CollisionTestResult, ignoreOneWay: boolean): CollisionTestResult {
            var self = this;
            var tx;
            var ty;

            let lastResult = new CollisionTestResult(false);

            // korekce překlenutí -- při kontrole rozměrů dochází k přeskoku na další tile, který
            // může vyhodit kolizi, ačkoliv v něm objekt není. Důvod je, že objekt o šířce 1 tile
            // usazená na nějaké tile x má součet x+1 jako další tile. Nejde fixně ignorovat 1 tile
            // rozměru objektu, protože se počítá s collisionOffset, takže výslená šířka není násobek
            // tiles. Řešením tak je odebrat 1px, aby se nepřeklenulo do dalšího tile mapy.
            let TILE_FIX = 1;

            // kolize se musí dělat iterativně pro každý bod v TILE_SIZE podél hran objektu
            var xShift = 0; // iterace posuvu (+/-)
            var yShift = 0; // iterace posuvu (+/-)
            var width = 0; // iterace šířky posouvaného objetku
            var height = 0; // iterace výšky posouvaného objetku
            var xSign = Utils.sign(objectXShift);
            var ySign = Utils.sign(objectYShift);

            // pokud bude zadán fullXShift i fullYShift, udělá to diagonální posuv
            // Iteruj v kontrolách posuvu po Resources.TILE_SIZE přírůstcích, dokud nebude
            // docíleno celého posunu (zabraňuje "teleportaci" )
            do {
                // kontrola velikosti iterace posuvu X (zapsaná v kladných číslech)
                if (xSign * xShift + Resources.TILE_SIZE > xSign * objectXShift) {
                    xShift = objectXShift;
                } else {
                    xShift += xSign * Resources.TILE_SIZE;
                }
                // kontrola velikosti iterace posuvu Y (zapsaná v kladných číslech)
                if (ySign * (yShift + ySign * Resources.TILE_SIZE) > ySign * objectYShift) {
                    yShift = objectYShift;
                } else {
                    yShift += ySign * Resources.TILE_SIZE;
                }

                if (xShift > 0 || yShift > 0) {
                    tx = x - xShift;
                    ty = y - yShift;
                    let LT = collisionTester(tx, ty);
                    if (LT.hit) {
                        if (ignoreOneWay && (LT.collisionType == CollisionType.PLATFORM)) {
                            // kolize je ignorována
                        } else if (LT.collisionType == CollisionType.LADDER) {
                            // žebříková kolize se vrací pouze jako info
                            lastResult = LT;
                            lastResult.hit = false;
                        } else {
                            return LT;
                        }
                    }
                }

                // iterativní kontroly ve výšce a šířce posouvaného objektu 
                // zabraňuje "napíchnutní" posouvaného objektu na kolizní objekt)
                // v případě, že posouvaný objekt je například širší než kolizní plocha 
                // na kterou padá -- jeho krají body tak v kolizi nebudou, ale střed ano
                width = 0;
                // Musím iterovat s "dorazem" (nakonec se přičte zbytek do celku) aby 
                // fungoval collisionOffset -- ten totiž je v pixels nikoliv v tiles
                // bez collisionOffset by nebylo možné dělt sprite přesahy
                while (width !== objectWidth) {
                    // pokud jde o posuv doprava, zkoumej rovnou pravu hranu, tou se narazí jako první 
                    if (xShift < 0 || (width + Resources.TILE_SIZE > objectWidth)) {
                        width = objectWidth;
                    } else {
                        width += Resources.TILE_SIZE;
                    }

                    height = 0;
                    while (height !== objectHeight) {
                        // pokud se nehýbu do stran (xShift == 0, nedojde ke kolize stranou)  
                        // a pokud jde o posuv dolů nebo statický stav (=0), 
                        // zkoumej rovnou spodní hranu, tou se narazí jako první 
                        if ((yShift <= 0 && xShift == 0) || (height + Resources.TILE_SIZE > objectHeight)) {
                            height = objectHeight;
                        } else {
                            height += Resources.TILE_SIZE;
                        }

                        if (xShift < 0 || yShift > 0) {
                            tx = x + width - TILE_FIX - xShift;
                            ty = y - yShift;
                            let RT = collisionTester(tx, ty);
                            if (RT.hit) {
                                if (ignoreOneWay && (RT.collisionType == CollisionType.PLATFORM)) {
                                    // kolize je ignorována
                                } else if (RT.collisionType == CollisionType.LADDER) {
                                    // žebříková kolize se vrací pouze jako info
                                    lastResult = RT;
                                    lastResult.hit = false;
                                } else {
                                    return RT;
                                }
                            }
                        }

                        if (xShift > 0 || yShift <= 0) {
                            tx = x - xShift;
                            ty = y + height - TILE_FIX - yShift;
                            let LB = collisionTester(tx, ty);
                            if (LB.hit) {
                                // OneWay kolize se ignorují pouze pokud se to chce, 
                                // nebo je to jejich spodní tile -- to je proto, aby 
                                // fungovali kolize u těsně nad sebou položených tiles 
                                if ((ignoreOneWay || Utils.isEven(LB.y) == false) && (LB.collisionType == CollisionType.PLATFORM)) {
                                    // kolize je ignorována
                                } else if (LB.collisionType == CollisionType.LADDER) {
                                    // žebříková kolize se vrací pouze jako info
                                    lastResult = LB;
                                    lastResult.hit = false;
                                } else {
                                    return LB;
                                }
                            }
                        }

                        if (xShift < 0 || yShift <= 0) {
                            tx = x + width - TILE_FIX - xShift;
                            ty = y + height - TILE_FIX - yShift;
                            let RB = collisionTester(tx, ty);
                            if (RB.hit) {
                                // OneWay kolize se ignorují pouze pokud se to chce, 
                                // nebo je to jejich spodní tile -- to je proto, aby 
                                // fungovali kolize u těsně nad sebou položených tiles 
                                if ((ignoreOneWay || Utils.isEven(RB.y) == false) && (RB.collisionType == CollisionType.PLATFORM)) {
                                    // kolize je ignorována
                                } else if (RB.collisionType == CollisionType.LADDER) {
                                    // žebříková kolize se vrací pouze jako info
                                    lastResult = RB;
                                    lastResult.hit = false;
                                } else {
                                    return RB;
                                }
                            }
                        }

                        if (xShift === objectXShift && yShift === objectYShift && width === objectWidth && height === objectHeight) {
                            return lastResult;
                        }

                    }
                }
            } while (xShift !== objectXShift || yShift !== objectYShift)

            return lastResult;

        };

        handleMouse(mouse: Mouse, delta: number) {
            var self = this;

            if (self.hero.getCurrentHealth() > 0) {

                // je prováděna interakce s objektem?
                if (mouse.rightDown) {
                    var rmbSpellDef = Resources.getInstance().interactSpellDef;
                    // Může se provést (cooldown je pryč)?
                    var rmbCooldown = self.hero.spellCooldowns[SpellKey.SPELL_INTERACT_KEY];
                    if (!rmbCooldown || rmbCooldown <= 0) {
                        var heroCenterX = self.hero.x + self.hero.width / 2;
                        var heroCenterY = self.hero.y + self.hero.height / 4;

                        // zkus cast
                        if (rmbSpellDef.cast(new SpellContext(Hero.OWNER_HERO_TAG, heroCenterX, heroCenterY, mouse.x, mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown 
                            self.hero.spellCooldowns[SpellKey.SPELL_INTERACT_KEY] = rmbSpellDef.cooldown;
                        }
                    }
                }

                // je vybrán spell?
                // TODO tohle se musí opravit -- aktuálně to snižuje cooldown pouze u spellu, který je vybraný (mělo by všem)
                var choosenSpell = self.game.getUI().spellsUI.getChoosenSpell();
                if (typeof choosenSpell !== "undefined" && choosenSpell != null) {
                    var spellDef: SpellDefinition = Resources.getInstance().spellDefs.byKey(SpellKey[choosenSpell]);
                    // provádím spell za hráče, takže kontroluji jeho cooldown
                    var cooldown = self.hero.spellCooldowns[choosenSpell];
                    // ještě nebyl použit? Takže je v pořádku a může se provést
                    if (typeof cooldown === "undefined") {
                        cooldown = 0;
                        self.hero.spellCooldowns[choosenSpell] = 0;
                    }
                    // Sniž dle delay
                    self.hero.spellCooldowns[choosenSpell] -= delta;
                    // Může se provést (cooldown je pryč, mám will a chci cast) ?
                    if (self.hero.getCurrentWill() >= spellDef.cost && cooldown <= 0 && (mouse.down)) {
                        let heroCenterX = self.hero.x + self.hero.width / 2;
                        let heroCenterY = self.hero.y + self.hero.height / 4;

                        // zkus cast
                        if (spellDef.cast(new SpellContext(Hero.OWNER_HERO_TAG, heroCenterX, heroCenterY, mouse.x, mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown a odeber will
                            self.hero.spellCooldowns[choosenSpell] = spellDef.cooldown;
                            self.hero.decreseWill(spellDef.cost);
                        }
                    }
                }
            }

            let coord = self.render.pixelsToTiles(mouse.x, mouse.y);
            let clsn = self.isCollisionByTiles(coord.x, coord.y);
            let typ = self.tilesMap.mapRecord.getValue(coord.x, coord.y);
            let sector = self.render.getSectorByTiles(coord.x, coord.y);
            EventBus.getInstance().fireEvent(new PointedAreaEventPayload(
                clsn.x, clsn.y, clsn.hit, typ, sector ? sector.map_x : null, sector ? sector.map_y : null));

        };

        public checkReach(character: Character, x: number, y: number, inTiles: boolean = false): ReachInfo {
            // dosahem omezená akce -- musí se počítat v tiles, aby nedošlo ke kontrole 
            // na pixel vzdálenost, která je ok, ale při změně cílové tile se celková 
            // změna projeví i na pixel místech, kde už je například kolize
            var characterCoordTL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.collYOffset);
            var characterCoordTR = this.render.pixelsToEvenTiles(character.x + character.width - character.collXOffset, character.y + character.collYOffset);
            var characterCoordBR = this.render.pixelsToEvenTiles(character.x + character.width - character.collXOffset, character.y + character.height - character.collYOffset);
            var characterCoordBL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.height - character.collYOffset);
            var coord = inTiles ? new Coord2D(Utils.even(x), Utils.even(y)) : this.render.pixelsToEvenTiles(x, y);
            // kontroluj rádius od každého rohu
            let inReach = Utils.distance(coord.x, coord.y, characterCoordTL.x, characterCoordTL.y) < Resources.REACH_TILES_RADIUS
                || Utils.distance(coord.x, coord.y, characterCoordTR.x, characterCoordTR.y) < Resources.REACH_TILES_RADIUS
                || Utils.distance(coord.x, coord.y, characterCoordBR.x, characterCoordBR.y) < Resources.REACH_TILES_RADIUS
                || Utils.distance(coord.x, coord.y, characterCoordBL.x, characterCoordBL.y) < Resources.REACH_TILES_RADIUS;
            return new ReachInfo(coord, characterCoordTL, characterCoordTR, characterCoordBR, characterCoordBL, inReach);
        }

        handleTick(delta) {
            var self = this;
            self.render.handleTick();
            self.game.getBackground().handleTick(delta);
            self.hero.handleTick(delta);
            self.enemies.forEach(function (enemy) {
                if (enemy)
                    enemy.handleTick(delta);
            });

            // TODO cooldown - delta pro všechny položky spell v hráčovi a všech nepřátel

            var rmbCooldown = self.hero.spellCooldowns[SpellKey.SPELL_INTERACT_KEY];
            if (!rmbCooldown) {
                rmbCooldown = 0;
                self.hero.spellCooldowns[SpellKey.SPELL_INTERACT_KEY] = 0;
            } else {
                // Sniž dle delay
                self.hero.spellCooldowns[SpellKey.SPELL_INTERACT_KEY] -= delta;
            }

            // Spawn TODO
            //SpawnPool.getInstance().update(delta, self);
        };
    }

    export class ReachInfo {
        constructor(
            public source: Coord2D,
            public characterCoordTL: Coord2D,
            public characterCoordTR: Coord2D,
            public characterCoordBR: Coord2D,
            public characterCoordBL: Coord2D,
            public inReach: boolean) {
        }
    }
}