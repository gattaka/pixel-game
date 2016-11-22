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

    // Okolnosti kolizního testu -- jsou potřeba pro správné
    // řešení kolizí u zkosených a jiných PARTs, které mají
    // kolizi pouze na nějaké části své plochy
    class CollisionTestContext {
        constructor(
            // aktuální směr v ose X
            public xSign: number,
            // aktuální směr v ose Y
            public ySign: number,
            // délka části vodorovné hrany před kontrolovaným bodem kolize 
            public preEdgeWidth: number,
            // délka části vodorovné hrany za kontrolovaným bodem kolize
            public postEdgeWidth: number,
            // délka části svislé hrany před kontrolovaným bodem kolize 
            public preEdgeHeight: number,
            // délka části svislé hrany za kontrolovaným bodem kolize
            public postEdgeHeight: number
        ) { }
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
        static CLIMBING_SPEED = 300;
        static DESCENT_SPEED = -10;
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

        updateObject(sDelta: number, object: AbstractWorldObject, makeShift: (x: number, y: number) => any, forceFall = false, forceJump = false): boolean {
            var self = this;
            var clsnTest: CollisionTestResult;
            var clsnPosition;

            let isClimbing = false;

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
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    distanceY,
                    self.isCollision.bind(self),
                    forceFall
                );

                if (clsnTest.hit === false) {
                    // pokud není kolize a stoupám
                    // pokud klesám, pak klesám po jiném povrchu, než je žebřík
                    // pokud klesám po žebříku, pak to musí být vynucené
                    if (distanceY > 0 || clsnTest.collisionType != CollisionType.LADDER || forceFall) {
                        makeShift(0, distanceY);
                        // pokud padám na žebříku, udržuj rychlost na CLIMBING_SPEED
                        if (clsnTest.collisionType == CollisionType.LADDER) {
                            isClimbing = true;
                            if (forceFall) {
                                object.speedy = -World.CLIMBING_SPEED;
                            } else if (forceJump) {
                                object.speedy = World.CLIMBING_SPEED;
                            }
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
                        // zastavil jsem se při pádu? Konec skoku a "doskoč" až na zem
                        // Získej pozici kolizního bloku (kvůli zkoseným povrchům, 
                        // které mají kolizní masky na PART se musí brát počátek od PART 
                        // nikoliv TILE, takže pouze sudé) a přičti k němu zbývající 
                        // vzdálenost (od počátku PART) do kolize
                        let evenTileX = Utils.even(clsnTest.x);
                        let evenTileY = Utils.even(clsnTest.y);
                        let clsnPosition = self.render.tilesToPixel(evenTileX, evenTileY);
                        makeShift(0, -1 * (clsnPosition.y + clsnTest.partOffsetY - (object.y + object.height - object.collYOffset)));
                    }
                    object.speedy = 0;
                }

            }

            // pokud nejsem zrovna uprostřed skoku 
            if (object.speedy === 0) {

                let fallSpeed;
                if (forceFall) {
                    // padám vynuceně
                    fallSpeed = World.DESCENT_SPEED;
                } else {
                    // normálně padám
                    fallSpeed = -1;
                }

                // ...a mám kam padat
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    fallSpeed,
                    self.isCollision.bind(this),
                    // pád z klidu se vždy musí zaseknout o oneWay kolize 
                    // výjimkou je, když hráč chce propadnou níž
                    forceFall
                );
                if (clsnTest.hit === false) {
                    if (clsnTest.collisionType != CollisionType.LADDER) {
                        // pokud klesám, pak klesám po jiném povrchu, než je žebřík
                        object.speedy = -1;
                    } else {
                        isClimbing = true;
                        if (forceFall) {
                            // pokud klesám po žebříku, pak to musí být vynucené
                            // a pak klesám konstantní rychlostí
                            object.speedy = -World.CLIMBING_SPEED;
                        }
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
                else {
                    // kolize, konec posunu, dojdi až ke koliznímu místu
                    // Získej pozici kolizního bloku (kvůli zkoseným povrchům, 
                    // které mají kolizní masky na PART se musí brát počátek od PART 
                    // nikoliv TILE, takže pouze sudé) a přičti k němu zbývající 
                    // vzdálenost (od počátku PART) do kolize
                    let evenTileX = Utils.even(clsnTest.x);
                    let evenTileY = Utils.even(clsnTest.y);
                    let clsnPosition = self.render.tilesToPixel(evenTileX, evenTileY);
                    if (distanceX > 0) {
                        // narazil jsem do něj zprava
                        makeShift(object.x + object.collXOffset - (clsnPosition.x + clsnTest.partOffsetX), 0);
                    } else {
                        // narazil jsem do něj zleva
                        makeShift(-1 * (clsnPosition.x + clsnTest.partOffsetX - (object.x + object.width - object.collXOffset)), 0);
                    }

                    if (clsnTest.collisionType == CollisionType.SOLID_TR || clsnTest.collisionType == CollisionType.SOLID_TL) {
                        // Nenarazím na překážku?
                        let pushClsnTest = self.isBoundsInCollision(
                            object.x + object.collXOffset,
                            object.y + object.collYOffset,
                            object.width - object.collXOffset * 2,
                            object.height - object.collYOffset * 2,
                            0,
                            2,
                            self.isCollision.bind(self),
                            true
                        );
                        if (pushClsnTest.hit == false) {
                            if (distanceX > 0) {
                                makeShift(4, 4);
                            } else {
                                makeShift(-4, 4);
                            }
                        }
                    }
                }
            }

            if (typeof object.updateAnimations !== "undefined") {
                object.updateAnimations();
            }

            return isClimbing;

        };

        update(delta, controls: Controls) {
            var self = this;
            var sDelta = delta / 1000; // ms -> s

            // AI Enemies
            self.enemies.forEach(function (enemy) {
                if (enemy)
                    enemy.runAI(self, delta);
            });

            let updateCharacter = (character: Character, makeShift: (x: number, y: number) => any) => {
                let forceDown = false;
                let forceUp = false;

                // Je-li postava naživu, vnímej její ovládání
                if (character.getCurrentHealth() > 0) {

                    switch (character.movementTypeY) {
                        case MovementTypeY.NONE: break;
                        case MovementTypeY.JUMP_OR_CLIMB:
                            forceUp = true;
                            if (character.speedy == 0) {
                                character.speedy = character.accelerationY;
                            } break;
                        case MovementTypeY.DESCENT:
                            forceDown = true; break;
                        case MovementTypeY.ASCENT:
                            forceUp = true;
                            character.speedy = character.accelerationY; break;
                        case MovementTypeY.HOVER_UP: break;
                        case MovementTypeY.HOVER_DOWN: break;
                    }

                    switch (character.movementTypeX) {
                        case MovementTypeX.NONE:
                            character.speedx = 0; break;
                        case MovementTypeX.WALK_LEFT:
                            character.speedx = character.accelerationX; break;
                        case MovementTypeX.WALK_RIGHT:
                            character.speedx = -character.accelerationX; break;
                        case MovementTypeX.HOVER_LEFT: break;
                        case MovementTypeX.HOVER_RIGHT: break;

                    }
                }

                // update postavy
                character.isClimbing = self.updateObject(sDelta, character, makeShift, forceDown, forceUp);
            };

            // Dle kláves nastav směry pohybu
            if (controls.up && self.hero.speedy === 0) {
                self.hero.movementTypeY = MovementTypeY.JUMP_OR_CLIMB;
            } else if (controls.levitate) {
                self.hero.movementTypeY = MovementTypeY.ASCENT;
            } else if (controls.down) {
                self.hero.movementTypeY = MovementTypeY.DESCENT
            } else {
                self.hero.movementTypeY = MovementTypeY.NONE;
            }

            // Horizontální akcelerace
            if (controls.left) {
                self.hero.movementTypeX = MovementTypeX.WALK_LEFT;
            } else if (controls.right) {
                self.hero.movementTypeX = MovementTypeX.WALK_RIGHT;
            } else {
                self.hero.movementTypeX = MovementTypeX.NONE;
            }

            // ulož starou vertikální rychlost 
            let oldSpeedY = self.hero.speedy;

            // update pohybu hráče
            updateCharacter(self.hero, self.shiftWorldBy.bind(self));

            // kontrola zranění z pádu
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
                    updateCharacter(enemy, function (x, y) {
                        var rndX = Utils.floor(x);
                        var rndY = Utils.floor(y);
                        enemy.x -= rndX;
                        enemy.y -= rndY;
                    });
                }
            });

            // Update virtuálního posuvu float-textů
            self.labelObjects.forEach(function (item) {
                if (item) {
                    item.y = item["virtualY"] + item["tweenY"];
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
        isCollision(px: number, py: number, clsCtx?: CollisionTestContext): CollisionTestResult {
            var self = this;
            var result = self.render.pixelsToTiles(px, py);
            return self.isCollisionByTiles(result.x, result.y, result.partOffsetX, result.partOffsetY, clsCtx);
        };

        /**
         * Zjistí zda na daných tile-souřadnicích dochází ke kolizi 
         * 
         * Zároveň umí dle kontextu kontroly kolize zjistit, zda nedojde ke kolizi
         * na dřívějším místě ve směru pohybu a na délce hrany na které leží právě
         * kontrolovaný bod. 
         * 
         * Celý systém kontroly kolizí tak vlastně sestává ze dvou fází:
         * 
         * 1. Hrubá kontrola
         * Při té se krokuje po TILEs a zjišťuje se jenom do jaké TILE jsem se 
         * trefil.
         * 
         * 2. Detailní kontrola (uvnitř-PART kontrola)
         * Pokud je hrubou kontrolou zasáhnutá TILE součástí polo-kolizního povrchu,
         * jakým jsou například zkosené povrchy, které mají část povrchu jako kolizi
         * a část ne, řeší se předpisem křivky, zda je souřadnice relaivně vůči 
         * počátku takového povrchu v kolizi nebo ne.
         * 
         * Protože se u detailní kontroly nekrokuje (mám jeden zásah z hrubé kontroly
         * a relativní souřadnice vůči počátku PART) je potřeba z hrany a směru posuvu
         * zjistit, kde by už předtím, než dojdu k tomuto bodu, mělo dojít ke kolizi.
         * 
         * Tím se zamezí "napíchnutí" pohybovaného objektu na "hrot" polo-kolizního 
         * povrchu v důsledku přeskočeného první kolize ve směru pohybu. 
         * 
         * Kdyby se u hrubé kontroly krokovalo po 1px, bylo by možné detailní kontrolu
         * vynechat, ale kontrola kolizí by tak byla neskutečně pomalá.
         */
        isCollisionByTiles(tx: number, ty: number, partOffsetX?: number, partOffsetY?: number, clsCtx?: CollisionTestContext): CollisionTestResult {
            var self = this;
            // kolize s povrchem/hranicí mapy
            var val = self.tilesMap.mapRecord.getValue(tx, ty);
            if (val != null && val != 0) {
                let res = Resources.getInstance();
                let collisionType = res.mapSurfaceDefs[res.surfaceIndex.getType(val)].collisionType;
                // souřadnice uvnitř PART
                let lx, ly;
                // délka PART
                let n = Resources.PARTS_SIZE - 1;
                if (partOffsetX == undefined || partOffsetY == undefined) {
                    // kolize se zjišťuje přímo z tilesMap, nemám k dispozici 
                    // pixel souřadnice, PART můžu rozložit akorát na 2 tiles  
                    lx = (tx % 2) * Resources.TILE_SIZE;
                    ly = (ty % 2) * Resources.TILE_SIZE;
                } else {
                    // kolize se zjišťuje z pixel souřadnic, které byly převedeny
                    // na part souřadnice, znám tedy vnitřní offset
                    lx = Math.abs(partOffsetX);
                    ly = Math.abs(partOffsetY);
                    // pokud je kontrola kolizního bodu součástí kontroly kolize 
                    // objektu uprav dle směru a délky hran souřadnice tak, aby se 
                    // braly první kolize ve směru kontroly, nikoliv v daném bodě
                    if (clsCtx) {
                        let partTrim = (d: number) => {
                            if (d < 0) return 0;
                            if (d > n - 1) return n - 1;
                            return d;
                        }
                        // Tohle se musí udělat, protože kontroly jsou krokované po TILE
                        // zatímco zkosené povrchy mají rozlišení v 2px, může se tak 
                        // stát, že se TILE krokem přeskočí bližší kolizní bod a objekt
                        // se tak na tuto >TILE kolizní plochu "napíchne" dokud nenarazí
                        // po stranách tohoto hrotu na svoje TILE krokované body
                        switch (collisionType) {
                            case CollisionType.SOLID_TL:
                                lx = partTrim(lx + clsCtx.postEdgeWidth);
                                ly = partTrim(ly + clsCtx.postEdgeHeight);
                                break;
                            case CollisionType.SOLID_TR:
                                lx = partTrim(lx - clsCtx.preEdgeWidth);
                                ly = partTrim(ly + clsCtx.postEdgeHeight);
                                break;
                            case CollisionType.SOLID_BL:
                                lx = partTrim(lx + clsCtx.postEdgeWidth);
                                ly = partTrim(ly - clsCtx.preEdgeHeight);
                                break;
                            case CollisionType.SOLID_BR:
                                lx = partTrim(lx - clsCtx.preEdgeWidth);
                                ly = partTrim(ly - clsCtx.preEdgeHeight);
                                break;
                            case CollisionType.SOLID:
                            case CollisionType.PLATFORM:
                            case CollisionType.LADDER:
                            default:
                                // nech původní hodnoty, u těchto povrchů
                                // nehrozí přeskočení a "napíchnutí"
                                break;
                        }
                    }
                }
                let hit = false;
                // kolik mám přičíst k POČÁTKU PART, abych našel PRVNÍ kolizi
                // v daném SMĚRU, ve kterém provádím pohyb? 
                let fixOffsetX = 0;
                let fixOffsetY = 0;
                let xSign, ySign;
                if (clsCtx) {
                    xSign = clsCtx.xSign;
                    ySign = clsCtx.ySign;
                }
                switch (collisionType) {
                    case CollisionType.SOLID_TL:
                        // kontrola tvaru nebo směru
                        if (lx + ly >= n) {
                            hit = true;
                            if (xSign < 0) fixOffsetX = n - ly; // jdu zleva
                            if (xSign > 0) fixOffsetX = n + 1; // jdu zprava
                            if (ySign < 0) fixOffsetY = n - lx; // jdu shora
                            if (ySign > 0) fixOffsetY = n + 1; // jdu zdola
                        }
                        break;
                    case CollisionType.SOLID_TR:
                        // kontrola tvaru nebo směru (zleva a zespoda se musí vždy narazit)
                        if (n - lx + ly >= n) {
                            hit = true;
                            if (xSign < 0) fixOffsetX = 0; // jdu zleva
                            if (xSign > 0) fixOffsetX = ly + 1; // jdu zprava
                            if (ySign < 0) fixOffsetY = lx; // jdu shora
                            if (ySign > 0) fixOffsetY = n + 1; // jdu zdola
                        }
                        break;
                    case CollisionType.SOLID_BL:
                        // kontrola tvaru nebo směru (zprava a shora se musí vždy narazit)
                        if (n - lx + ly <= n) {
                            hit = true;
                            if (xSign < 0) fixOffsetX = ly; // jdu zleva
                            if (xSign > 0) fixOffsetX = n + 1; // jdu zprava
                            if (ySign < 0) fixOffsetY = 0; // jdu shora
                            if (ySign > 0) fixOffsetY = lx + 1; // jdu zdola
                        }
                        break;
                    case CollisionType.SOLID_BR:
                        // kontrola tvaru nebo směru (zleva a shora se musí vždy narazit)
                        if (lx + ly <= n) {
                            hit = true;
                            if (xSign < 0) fixOffsetX = 0; // jdu zleva
                            if (xSign > 0) fixOffsetX = n + ly + 1; // jdu zprava
                            if (ySign < 0) fixOffsetY = 0; // jdu shora
                            if (ySign > 0) fixOffsetY = n + lx + 1; // jdu zdola
                        }
                        break;
                    case CollisionType.SOLID:
                    case CollisionType.PLATFORM:
                    case CollisionType.LADDER:
                    default:
                        hit = true;
                        if (xSign < 0) fixOffsetX = 0; // jdu zleva
                        if (xSign > 0) fixOffsetX = n + 1; // jdu zprava
                        if (ySign < 0) fixOffsetY = 0; // jdu shora
                        if (ySign > 0) fixOffsetY = n + 1; // jdu zdola
                        break;
                }
                if (hit) {
                    return new CollisionTestResult(true, tx, ty, collisionType, fixOffsetX, fixOffsetY);
                }
            }
            // kolize "mimo mapu"
            if (val == null) {
                return new CollisionTestResult(true, tx, ty);
            }

            // kolize s kolizními objekty
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(tx, ty);
            if (objectElement !== null) {
                var objType: MapObjDefinition = Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                if (objType.collision)
                    return new CollisionTestResult(true, tx, ty);
            }

            // bez kolize
            return new CollisionTestResult(false, tx, ty);
        };

        /**
         * Zjistí zda dojde ke kolizi, když se z aktuálních pixel-souřadnic posunu o nějakou 
         * vzdálenost. Započítává velikost celého objektu tak, aby nebyla v kolizi ani jedna 
         * jeho hrana. Bere v potaz, že se při posunu o danou vzdálenost objekt neteleportuje, 
         * ale postupně posouvá, takže kontroluje celý interval mezi aktuální polohou a cílem. 
         */
        isBoundsInCollision(xObj: number, yObj: number, objectWidth: number, objectHeight: number, xFullShift: number, yFullShift: number,
            collisionTester: (x: number, y: number, clsCtx: CollisionTestContext) => CollisionTestResult, ignoreOneWay: boolean): CollisionTestResult {
            var self = this;
            var tx;
            var ty;

            let lastResult = new CollisionTestResult(false);

            // Inkrement při procházení šířky/délky 
            let STEP = Resources.TILE_SIZE;

            // celková plocha, která nesmí být kolizní pro tento posun (+)
            let reqFreeWidth = xFullShift != 0 ? Math.abs(xFullShift) : objectWidth;
            let reqFreeHeight = yFullShift != 0 ? Math.abs(yFullShift) : objectHeight;
            // startovací pozice (+)
            let xStart, yStart;
            if (xFullShift < 0) { xStart = xObj + objectWidth; yStart = yObj; } // doprava
            if (xFullShift > 0) { xStart = xObj - 1; yStart = yObj; } // doleva
            if (yFullShift < 0) { yStart = yObj + objectHeight; xStart = xObj; } // dolů
            if (yFullShift > 0) { yStart = yObj - 1; xStart = xObj; } // nahoru

            // výjimka: statická kontrola 
            // Jsem teď v kolizi? Normálně se do tohoto stavu nedostanu,
            // ale žebříky a platformy umožňují projít kolizí a ocitnout se 
            // v ní až cestou zpět, aniž bych se vlastně pohnul
            if (xFullShift == 0 && yFullShift == 0) {
                // v takovém případě projdi moje aktuální pokrytí, 
                // jako kdybych padal ze svého počátku na svůj konec
                // a měl jednotkovou výšku
                reqFreeWidth = objectWidth;
                reqFreeHeight = objectHeight;
                xStart = xObj;
                yStart = yObj;
            }

            let xSign = xFullShift > 0 ? -1 : 1;
            let ySign = yFullShift > 0 ? -1 : 1;

            // Iteruj v kontrolách posuvu po STEP přírůstcích, dokud nebude
            // docíleno celého posunu (zabraňuje "teleportaci")
            for (let yStep = 0; yStep < reqFreeHeight;) {
                let yShift = yStep * ySign;
                let yp = yStart + yShift;

                for (let xStep = 0; xStep < reqFreeWidth;) {
                    let xShift = xStep * xSign;
                    let xp = xStart + xShift;

                    let result = collisionTester(xp, yp,
                        new CollisionTestContext(xFullShift, yFullShift, xStep, reqFreeWidth - xStep, yStep, reqFreeHeight - yStep));
                    if (result.hit) {
                        if (result.collisionType == CollisionType.PLATFORM) {
                            if (ignoreOneWay || xFullShift != 0 || yFullShift >= 0 || Utils.isEven(result.y) == false) {
                                // ignoruj kolizi
                                // - je vynuceno procházení 
                                // - nebo se jedná o horizontální pohyb
                                // - nebo stoupám
                                // - nebo jde o kolizi s druhou půlkou platformy
                            } else {
                                return result;
                            }
                        } else if (result.collisionType == CollisionType.LADDER) {
                            // žebříková kolize se vrací pouze jako info
                            lastResult = result;
                            lastResult.hit = false;
                        } else if (result.collisionType == CollisionType.SOLID) {
                            return result;
                        } else {
                            // Získání nejbližší kolize
                            if (lastResult.partOffsetX == undefined || lastResult.partOffsetY == undefined
                                // zleva beru nejnižší offset
                                || xFullShift < 0 && result.x * Resources.PARTS_SIZE + result.partOffsetX < lastResult.x * Resources.PARTS_SIZE + lastResult.partOffsetX
                                // zprava beru největší offset 
                                || xFullShift > 0 && result.x * Resources.PARTS_SIZE + result.partOffsetX > lastResult.x * Resources.PARTS_SIZE + lastResult.partOffsetX
                                // shora beru nejnižší offset
                                || yFullShift < 0 && result.y * Resources.PARTS_SIZE + result.partOffsetY < lastResult.y * Resources.PARTS_SIZE + lastResult.partOffsetY
                                // zdola beru největší offset 
                                || yFullShift > 0 && result.y * Resources.PARTS_SIZE + result.partOffsetY > lastResult.y * Resources.PARTS_SIZE + lastResult.partOffsetY)
                                lastResult = result;
                        }
                    }

                    if (xStep == reqFreeWidth - 1) {
                        break;
                    } else {
                        xStep = xStep + STEP >= reqFreeWidth ? reqFreeWidth - 1 : xStep + STEP;
                    }
                }

                if (yStep == reqFreeHeight - 1) {
                    break;
                } else {
                    yStep = yStep + STEP >= reqFreeHeight ? reqFreeHeight - 1 : yStep + STEP;
                }
            }

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
            let clsn = self.isCollisionByTiles(coord.x, coord.y, coord.partOffsetX, coord.partOffsetY);
            let typ = self.tilesMap.mapRecord.getValue(coord.x, coord.y);
            let sector = self.render.getSectorByTiles(coord.x, coord.y);
            EventBus.getInstance().fireEvent(new PointedAreaEventPayload(
                clsn.x, clsn.y, clsn.hit, clsn.partOffsetX, clsn.partOffsetY, typ, sector ? sector.map_x : null, sector ? sector.map_y : null));

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