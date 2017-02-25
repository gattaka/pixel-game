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
            public collXOffset: number,
            public collYOffset: number,
            public notificationTimer: number) {
            super(collXOffset, collYOffset);

            this.fixedWidth = Resources.PARTS_SIZE;
            this.fixedHeight = Resources.PARTS_SIZE;
            this.sprite = Resources.getInstance().getInvObjectSprite(this.item.invObj);
            this.addChild(this.sprite);
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

    export class World extends PIXI.Container {

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

        // pozice Reveal okna, vůči kterému se kontroluje, 
        // zda se má provést nové odkrývání (posunul jsem se dostatečně?)
        currentRevealViewX: number;
        currentRevealViewY: number;

        render: Render;

        // kontejnery
        tilesSectorsCont = new PIXI.Container();
        entitiesCont = new PIXI.Container();
        weather: Weather;
        fogSectorsCont = new PIXI.Container();
        messagesCont = new PIXI.Container();

        hero: Hero;
        enemiesCount = 0;
        enemies = new Array<AbstractEnemy>();

        private initFullScaleCont(cont: PIXI.Container) {
            var self = this;
            cont.x = 0;
            cont.y = 0;
            cont.fixedWidth = self.game.getSceneWidth();
            cont.fixedHeight = self.game.getSceneHeight();
        }

        constructor(public game: Game, public tilesMap: TilesMap) {
            super();

            var self = this;

            // Tiles cont (objekty, povrch, pozadí)
            self.initFullScaleCont(self.tilesSectorsCont);
            self.addChild(self.tilesSectorsCont);

            // Entities cont (volné objekty, nepřtelé, hráč, projektily)
            self.initFullScaleCont(self.entitiesCont);
            self.addChild(self.entitiesCont);

            // Weather
            self.weather = new Weather(game);
            // TODO
            // self.addChild(self.weather);

            // Fog cont
            self.initFullScaleCont(self.fogSectorsCont);
            self.addChild(self.fogSectorsCont);

            // Messages cont (damage pts texty, hlášení)
            self.initFullScaleCont(self.messagesCont);
            self.addChild(self.messagesCont);

            // Render
            self.render = new Render(game, self);

            // Hráč
            self.hero = new Hero();
            self.hero.x = game.getSceneWidth() / 2;
            self.hero.y = game.getSceneHeight() / 2;
            self.entitiesCont.addChild(self.hero);
            self.placePlayerOnSpawnPoint();

            // Dig events 
            let listener = function (objType: Diggable, x: number, y: number) {
                if (typeof objType.item !== "undefined") {
                    for (var i = 0; i < objType.item.quant; i++) {
                        self.spawnObject(objType.item, x, y);
                    }
                }
            };

            self.render.addOnDigSurfaceListener(listener);
            self.render.addOnDigObjectListener(listener);
        }

        fadeEnemy(enemy: AbstractEnemy) {
            let self = this;
            createjs.Tween.get(enemy)
                .to({
                    alpha: 0
                }, 5000).call(function () {
                    self.removeEnemy(enemy);
                });
        }

        removeEnemy(enemy: AbstractEnemy) {
            let self = this;
            self.enemies[enemy.id] = undefined;
            self.entitiesCont.removeChild(enemy);
            self.enemiesCount--;
            EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.ENEMY_COUNT_CHANGE, self.enemiesCount));
        }

        showDeadInfo() {
            let self = this;

            let deadInfo = new PIXI.Container();
            this.messagesCont.addChild(deadInfo);

            let shape = new PIXI.Graphics();
            shape.fixedWidth = this.game.getSceneWidth();
            shape.fixedHeight = this.game.getSceneHeight();
            shape.beginFill(0x0a0a0a, 0.9);
            shape.drawRect(0, 0, shape.fixedWidth, shape.fixedHeight);
            shape.x = 0;
            shape.y = 0;
            deadInfo.addChild(shape);

            let gameOverSprite = Resources.getInstance().getUISprite(UISpriteKey.UI_GAME_OVER_KEY);
            let bounds = gameOverSprite.getBounds();
            gameOverSprite.x = shape.fixedWidth / 2 - bounds.width / 2;
            gameOverSprite.y = shape.fixedHeight / 2 - bounds.height / 2;
            deadInfo.addChild(gameOverSprite);
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
                    self.messagesCont.removeChild(deadInfo);
                })
        }

        fadeText(text: string, px: number, py: number, time = 1000) {
            let self = this;
            let label = new Label(text);
            self.messagesCont.addChild(label);
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
                }, time).call(function () {
                    self.labelObjects[id] = undefined;
                    self.messagesCont.removeChild(label);
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
            var object = new WorldObject(
                invItem,
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
            self.entitiesCont.addChild(object);
        };

        setSpawnPoint(tx: number, ty: number): boolean {
            var self = this;
            let hero = self.hero;
            let heroWidth = self.render.pixelsDistanceToTiles(hero.fixedWidth);
            let heroHeight = self.render.pixelsDistanceToTiles(hero.fixedHeight);
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

        placePlayerOnScreen(xp: number, yp: number) {
            var self = this;
            let hero = self.hero;
            let heroWidth = self.render.pixelsDistanceToTiles(hero.fixedWidth);
            let heroHeight = self.render.pixelsDistanceToTiles(hero.fixedHeight);
            let tCoord = self.render.pixelsToTiles(xp - hero.fixedWidth / 2, yp - hero.fixedHeight / 2);
            if (self.fits(tCoord.x, tCoord.y, heroWidth, heroHeight)) {
                self.placePlayerOn(tCoord.x, tCoord.y, hero);
                return true;
            } else {
                return false;
            }
        }

        placePlayerOn(xt: number, yt: number, hero: Hero) {
            var self = this;

            // Tohle je potřeba udělat, jinak se při více teleportech hráči
            // nastřádá rychlost a například směrem dolů se při opakovaném
            // teleportování 1px nad zemí pak dokáže i zabít :)  
            hero.speedx = 0;
            hero.speedy = 0;
            this.hero.isClimbing = false;
            this.hero.play();

            let pCoord = self.render.tilesToPixel(xt, yt);
            self.shiftWorldBy(-(pCoord.x - hero.x), -(pCoord.y - hero.y));

            // Refresh pro minimapu
            EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.PLAYER_POSITION_CHANGE, self.hero.x, self.hero.y));
        }

        fits(xt: number, yt: number, w: number, h: number) {
            var self = this;
            for (let hyt = 0; hyt < h; hyt++) {
                for (let hxt = 0; hxt < w; hxt++) {
                    let result = self.isCollisionByTiles(xt + hxt, yt + hyt);
                    if (result.hit) {
                        return false;
                    }
                }
            }
            return true;
        }

        placePlayerOnSpawnPoint() {
            var self = this;
            let game = self.game;
            let tilesMap = self.tilesMap;
            let hero = self.hero;

            let heroWidth = self.render.pixelsDistanceToTiles(hero.fixedWidth);
            let heroHeight = self.render.pixelsDistanceToTiles(hero.fixedHeight);
            let pCoord;
            if (tilesMap.spawnPoint) {
                self.placePlayerOn(tilesMap.spawnPoint.x, tilesMap.spawnPoint.y, hero);
            } else {
                // TODO xt by se mělo střídavě od středu vzdalovat 
                let xt = tilesMap.width / 2;
                for (let yt = 0; yt < tilesMap.height; yt++) {
                    // je hráče kam umístit?
                    let fits = self.fits(xt, yt, heroWidth, heroHeight);
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
                            self.placePlayerOn(xt, yt, hero);
                            break;
                        }
                    }
                }
            }
        }

        resetPlayer() {
            this.hero.fillHealth(this.hero.getMaxHealth());
            this.hero.fillWill(this.hero.getMaxWill());
            this.hero.idle();
            this.placePlayerOnSpawnPoint();
        }

        private checkReveal() {
            let self = this;
            let coord = self.render.pixelsToTiles(self.hero.x, self.hero.y);

            // Reveal 
            // Fog je krokován po 2*PART, jeden PART = 2*TILE, takže 4 TILE 
            if (!this.currentRevealViewX || Math.abs(coord.x - this.currentRevealViewX) > 4
                || !this.currentRevealViewY || Math.abs(coord.y - this.currentRevealViewY) > 4) {
                let radius = Resources.PARTS_SIZE * Resources.REVEAL_SIZE;
                this.currentRevealViewX = coord.x;
                this.currentRevealViewY = coord.y;
                let cx = Math.floor(self.hero.x + self.hero.fixedWidth / 2);
                let cy = Math.floor(self.hero.y + self.hero.fixedHeight / 2);
                let d2 = Math.pow(radius, 2);
                for (let y = cy - radius; y < cy + radius; y += Resources.PARTS_SIZE * 2) {
                    for (let x = cx - radius; x < cx + radius; x += Resources.PARTS_SIZE * 2) {
                        var r2 = Math.pow(cx - x, 2) + Math.pow(cy - y, 2);
                        if (r2 <= d2) {
                            self.render.revealFog(x, y);
                        }
                    }
                }
            }
        }

        /**
         * Udává, o kolik se má ve scéně posunout svět, záporné shiftX tedy posouvá 
         * fyzicky svět doleva, takže je to jako kdyby hráč šel doprava 
         */
        shiftWorldBy(shiftX: number, shiftY: number) {

            if (isNaN(shiftX)) {
                console.log("Ou.. shiftX je Nan");
            }
            if (isNaN(shiftY)) {
                console.log("Ou.. shiftY je Nan");
            }

            let self = this;
            // požadovaný posuv
            let rndShiftX = Utils.floor(shiftX);
            let rndShiftY = Utils.floor(shiftY);
            let canvasCenterX = self.game.getSceneWidth() / 2;
            let canvasCenterY = self.game.getSceneHeight() / 2;

            let playerShiftX, sceneShiftX;
            let playerShiftY, sceneShiftY;

            // kolik zbývá hráčovi z cesty na střed směrem v pohybu
            let playerPreShiftX = self.hero.x != canvasCenterX ? canvasCenterX - self.hero.x : 0;
            let playerPreShiftY = self.hero.y != canvasCenterY ? canvasCenterY - self.hero.y : 0;
            // pokud jsem například vlevo od středu ale pohybuju se opět doleva, nenabízej nic            
            if (playerPreShiftX != 0 && Utils.sign(playerPreShiftX) != Utils.sign(rndShiftX)) {
                if (Math.abs(playerPreShiftX) > Math.abs(rndShiftX)) {
                    // pokud by vzdálenost hráče od středu byla větší, než plánový posuv
                    // sniž vzdálenost, kterou spotřebuje hráč svou cestu do sředu
                    playerPreShiftX = -rndShiftX;
                }
            } else {
                playerPreShiftX = 0;
            }
            if (playerPreShiftY != 0 && Utils.sign(playerPreShiftY) != Utils.sign(rndShiftY)) {
                if (Math.abs(playerPreShiftY) > Math.abs(rndShiftY)) {
                    playerPreShiftY = -rndShiftY;
                }
            } else {
                playerPreShiftY = 0;
            }
            // kolik můžu posunout scénu? Odečti od posunu část, kterou provedu hráčem
            let plannedShiftX = rndShiftX + playerPreShiftX;
            let plannedShiftY = rndShiftY + playerPreShiftY;
            sceneShiftX = self.render.limitShiftX(plannedShiftX);
            sceneShiftY = self.render.limitShiftY(plannedShiftY);
            // kolik posunu budu muset zobrazit hráčem, protože scéna je nadoraz?
            let overSceneX = plannedShiftX - sceneShiftX;
            let overSceneY = plannedShiftY - sceneShiftY;
            // hráč se tedy posune o "dojezd" při startu a "přejezd" při konci
            playerShiftX = overSceneX - playerPreShiftX;
            playerShiftY = overSceneY - playerPreShiftY;
            self.hero.x -= playerShiftX;
            self.hero.y -= playerShiftY;
            // if (self.hero.x < 0) self.hero.x = - self.hero.collXOffset;
            // if (self.hero.x > self.game.getCanvas().width) self.hero.x = self.game.getCanvas().width - self.hero.width + self.hero.collXOffset;
            // if (self.hero.y < 0) self.hero.y = - self.hero.collYOffset;
            // if (self.hero.y > self.game.getCanvas().height) self.hero.y = self.game.getCanvas().height - self.hero.height + self.hero.collYOffset;

            self.render.shiftSectorsBy(sceneShiftX, sceneShiftY);

            let toShift = [self.freeObjects, self.bulletObjects, self.enemies];

            self.checkReveal();

            self.labelObjects.forEach(function (item) {
                if (item) {
                    item.x += sceneShiftX;
                    // virtualY kvůli tween pohybu textu
                    item["virtualY"] += sceneShiftY;
                }
            });

            toShift.forEach((items: Array<WorldObject>) => {
                items.forEach((item) => {
                    if (item) {
                        item.x += sceneShiftX;
                        item.y += sceneShiftY;
                    }
                });
            });

        };

        shiftWorldTo(x: number, y: number) {
            let shiftX = x - this.render.getScreenOffsetX();
            let shiftY = y - this.render.getScreenOffsetY();
            this.shiftWorldBy(shiftX, shiftY);
        }

        updateObject(sDelta: number, object: AbstractWorldObject, makeShift: (x: number, y: number) => any,
            forceFall = false, forceJump = false, collisionSteps = false, isCurrentlyClimbing = false): boolean {

            var self = this;
            var clsnTest: CollisionTestResult;
            var clsnPosition;

            let isClimbing = false;

            if (object.speedy !== 0) {

                let distanceY;
                let boundsX = object.x + object.collXOffset;
                let boundsY = object.y + object.collYOffset;
                let boundsWidth = object.fixedWidth - object.collXOffset * 2;
                let boundsHeight = object.fixedHeight - object.collYOffset * 2;
                if (isCurrentlyClimbing && forceJump || object.hovers) {
                    // ignoruj gravitaci
                    distanceY = object.speedy * sDelta;
                } else {
                    // dráha, kterou objekt urazil za daný časový úsek, 
                    // kdy je známa jeho poslední rychlost a zrychlení, 
                    // které na něj za daný časový úsek působilo:
                    // s_t = vt + 1/2.at^2
                    distanceY = Utils.floor(object.speedy * sDelta + World.WORLD_GRAVITY * Math.pow(sDelta, 2) / 2);
                    // uprav rychlost objektu, která se dá spočítat jako: 
                    // v = v_0 + at
                    object.speedy = object.speedy + World.WORLD_GRAVITY * sDelta;
                    if (object.speedy < World.MAX_FREEFALL_SPEED)
                        object.speedy = World.MAX_FREEFALL_SPEED;;
                }

                if (object.hovers) {
                    makeShift(0, distanceY);
                }

                if (distanceY != 0 && !object.hovers) {

                    // Nenarazím na překážku?
                    clsnTest = self.isBoundsInCollision(
                        boundsX,
                        boundsY,
                        boundsWidth,
                        boundsHeight,
                        0,
                        distanceY,
                        self.isCollision.bind(self),
                        forceFall
                    );

                    if (clsnTest.hit === false) {
                        // pokud není kolize a 
                        // - stoupám
                        // - klesám po jiném povrchu, než je žebřík
                        // - klesám po žebříku, pak to musí být vynucené
                        if (distanceY > 0 || clsnTest.collisionType != CollisionType.LADDER || forceFall) {
                            makeShift(0, distanceY);
                            if (clsnTest.collisionType == CollisionType.LADDER) {
                                // pokud padám na žebříku, udržuj rychlost na CLIMBING_SPEED
                                isClimbing = true;
                                if (forceFall) {
                                    object.speedy = -World.CLIMBING_SPEED;
                                } else if (forceJump) {
                                    object.speedy = World.CLIMBING_SPEED;
                                }
                            } else if (distanceY > 0 && isCurrentlyClimbing) {
                                // pokud stoupám do povrchu, který není žebříkem
                                // a jsem v režimu lezení po žebříku, zkontroluj,
                                // zda ještě na něm jsem, pokud ano, ponech režim
                                let clsnTest = self.isBoundsInCollision(
                                    boundsX,
                                    boundsY,
                                    boundsWidth,
                                    boundsHeight,
                                    0,
                                    0,
                                    self.isCollision.bind(self),
                                    forceFall
                                );
                                if (clsnTest.collisionType == CollisionType.LADDER) {
                                    isClimbing = true;
                                }
                            }
                        } else {
                            isClimbing = clsnTest.collisionType == CollisionType.LADDER;
                            object.speedy = 0;
                        }
                    } else {
                        let evenTileX = Utils.even(clsnTest.x);
                        let evenTileY = Utils.even(clsnTest.y);
                        let clsnPosition = self.render.tilesToPixel(evenTileX, evenTileY);
                        let y;
                        // zastavil jsem se při pádu/skoku? Konec a "doskoč" až k překážce
                        // Získej pozici kolizního bloku (kvůli zkoseným povrchům, 
                        // které mají kolizní masky na PART se musí brát počátek od PART 
                        // nikoliv TILE, takže pouze sudé) a přičti k němu zbývající 
                        // vzdálenost (od počátku PART) do kolize
                        if (distanceY > 0) {
                            // zastavil jsem se při stoupání? Začni hned padat
                            //y = clsnPosition.y + clsnTest.partOffsetY - (object.y + object.collYOffset);
                            // makeShift(0, y);
                        } else {
                            // záporné, budu dopadat dolů
                            y = object.y + object.fixedHeight - object.collYOffset - (clsnPosition.y + clsnTest.partOffsetY);
                            makeShift(0, y);
                        }
                        object.speedy = 0;
                    }
                }

            }

            // pokud nejsem zrovna uprostřed skoku 
            if (object.speedy == 0 && !object.hovers) {

                // ...a mám kam padat
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.fixedWidth - object.collXOffset * 2,
                    object.fixedHeight - object.collYOffset * 2,
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
                        isClimbing = false;
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

                if (object.hovers) {
                    makeShift(distanceX, 0);
                }

                if (distanceX != 0 && !object.hovers) {
                    // Nenarazím na překážku?
                    clsnTest = self.isBoundsInCollision(
                        object.x + object.collXOffset,
                        object.y + object.collYOffset,
                        object.fixedWidth - object.collXOffset * 2,
                        object.fixedHeight - object.collYOffset * 2,
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
                            let x = object.x + object.collXOffset - (clsnPosition.x + clsnTest.partOffsetX);
                            makeShift(x, 0);
                        } else {
                            // narazil jsem do něj zleva
                            let x = -1 * (clsnPosition.x + clsnTest.partOffsetX - (object.x + object.fixedWidth - object.collXOffset));
                            makeShift(x, 0);
                        }

                        if (collisionSteps) {
                            // zabrání "vyskakování" na rampu, která je o víc než PART výš než mám nohy
                            let baseDist = object.y + object.fixedHeight - object.collYOffset - clsnPosition.y;

                            // automatické stoupání při chůzí po zkosené rampě
                            if (distanceX > 0 &&
                                ((clsnTest.collisionType == CollisionType.SOLID_TR && baseDist <= Resources.PARTS_SIZE)
                                    || baseDist <= Resources.TILE_SIZE)) {
                                makeShift(4, 4);
                            } else if (distanceX < 0 &&
                                ((clsnTest.collisionType == CollisionType.SOLID_TL && baseDist <= Resources.PARTS_SIZE)
                                    || baseDist <= Resources.TILE_SIZE)) {
                                makeShift(-4, 4);
                            }
                        }
                    }
                }
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
                        case MovementTypeY.NONE:
                        case MovementTypeY.HOVER:
                            break;
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
                    }

                    switch (character.movementTypeX) {
                        case MovementTypeX.NONE:
                            character.speedx = 0; break;
                        case MovementTypeX.WALK_LEFT:
                            character.speedx = character.accelerationX; break;
                        case MovementTypeX.WALK_RIGHT:
                            character.speedx = -character.accelerationX; break;
                        case MovementTypeX.HOVER:
                            break;
                    }
                }

                // update postavy
                character.isClimbing = self.updateObject(sDelta, character, makeShift, forceDown, forceUp, true, character.isClimbing);

                character.updateAnimations();
            };

            // Dle kláves nastav směry pohybu
            if (controls.up) {
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

            // ulož staré rychlosti a pozici
            let oldPosX = self.hero.x;
            let oldPosY = self.hero.y;
            let oldSpeedX = self.hero.speedx;
            let oldSpeedY = self.hero.speedy;

            // update pohybu hráče
            updateCharacter(self.hero, self.shiftWorldBy.bind(self));

            if (self.hero.x != oldPosX || self.hero.y != oldPosY)
                EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.PLAYER_POSITION_CHANGE, self.hero.x, self.hero.y));
            if (self.hero.speedx != oldSpeedX || self.hero.speedy != oldSpeedY)
                EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.PLAYER_SPEED_CHANGE, self.hero.speedx, self.hero.speedy));

            // kontrola zranění z pádu
            if (self.hero.speedy == 0 && oldSpeedY < 0) {
                let threshold = World.MAX_FREEFALL_SPEED / 1.5;
                oldSpeedY -= threshold;
                if (oldSpeedY < 0) {
                    self.hero.hit(Math.floor(self.hero.getMaxHealth() * oldSpeedY / (World.MAX_FREEFALL_SPEED - threshold)), this);
                }
            }

            // update nepřátel
            self.enemies.forEach(function (enemy) {
                if (enemy) {
                    updateCharacter(enemy, function (shiftX, shiftY) {
                        if (isNaN(shiftX)) {
                            console.log("Ou.. enemy shiftX je Nan");
                        }
                        if (isNaN(shiftY)) {
                            console.log("Ou.. enemy shiftY je Nan");
                        }
                        var rndX = Utils.floor(shiftX);
                        var rndY = Utils.floor(shiftY);
                        enemy.x -= rndX;
                        enemy.y -= rndY;

                        if (enemy.unspawns) {
                            if (enemy.x < -self.game.getSceneWidth() * 2
                                || enemy.x > self.game.getSceneWidth() * 2
                                || enemy.y < -self.game.getSceneHeight() * 2
                                || enemy.y > self.game.getSceneHeight() * 2) {
                                // dealokace
                                self.removeEnemy(enemy);
                            }
                        }
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
                    if (object.isDone() || object.getCurrentAnimation() === "done") {
                        self.bulletObjects.splice(i, 1);
                        self.entitiesCont.removeChild(object);
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
                    }, false, false, false);

                    object.updateAnimations();

                    // zjisti, zda hráč objekt nesebral
                    if (self.hero.getCurrentHealth() > 0) {
                        var heroCenterX = self.hero.x + self.hero.fixedWidth / 2;
                        var heroCenterY = self.hero.y + self.hero.fixedHeight / 2;
                        var itemCenterX = object.x + object.fixedWidth / 2;
                        var itemCenterY = object.y + object.fixedHeight / 2;

                        if (Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < World.OBJECT_PICKUP_DISTANCE) {
                            Inventory.getInstance().invInsert(object.item.invObj, 1);
                            self.freeObjects.splice(i, 1);
                            self.entitiesCont.removeChild(object);
                            Mixer.playSound(SoundKey.SND_PICK_KEY, 0.2);
                            object = null;
                        }
                        if (object !== null && Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < World.OBJECT_PICKUP_FORCE_DISTANCE) {
                            createjs.Tween.get(object)
                                .to({
                                    x: heroCenterX - object.fixedWidth / 2,
                                    y: heroCenterY - object.fixedHeight / 2
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

            let hit = false;
            let collisionType = CollisionType.SOLID;
            // kolik mám přičíst k POČÁTKU PART, abych našel PRVNÍ kolizi
            // v daném SMĚRU, ve kterém provádím pohyb? 
            let fixOffsetX: number;
            let fixOffsetY: number;
            let srfcDef: MapSurfaceDefinition;
            // délka PART
            let n = Resources.PARTS_SIZE - 1;
            // Směr posuvu
            let xSign, ySign;
            if (clsCtx) {
                xSign = clsCtx.xSign;
                ySign = clsCtx.ySign;
            }

            // kolize s povrchem/hranicí mapy
            let surfaceVal = self.tilesMap.mapRecord.getValue(tx, ty);
            if (surfaceVal != null && surfaceVal != 0) {
                let res = Resources.getInstance();
                srfcDef = res.getSurfaceDef(res.surfaceIndex.getType(surfaceVal));
                collisionType = srfcDef.collisionType;
                // souřadnice uvnitř PART
                let lx, ly;
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
                            if (xSign > 0) fixOffsetX = n - ly + 1; // jdu zprava
                            if (ySign < 0) fixOffsetY = 0; // jdu shora
                            if (ySign > 0) fixOffsetY = n - lx + 1; // jdu zdola
                        }
                        break;
                    case CollisionType.SOLID:
                    case CollisionType.PLATFORM:
                    case CollisionType.LADDER:
                    default:
                        hit = true;
                        break;
                }
            } else if (surfaceVal == null) {
                // kolize "mimo mapu"
                hit = true;
                collisionType = CollisionType.SOLID;
            } else {
                // kolize s kolizními objekty
                var objectElement = self.tilesMap.mapObjectsTiles.getValue(tx, ty);
                if (objectElement !== null) {
                    var objType: MapObjDefinition = Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                    if (objType.collision) {
                        hit = true;
                        collisionType = CollisionType.SOLID;
                    }
                }
            }

            if (hit) {
                if (fixOffsetX == undefined && fixOffsetY == undefined) {
                    if (xSign < 0) fixOffsetX = 0; // jdu zleva
                    if (xSign > 0) fixOffsetX = n + 1; // jdu zprava
                    if (ySign < 0) fixOffsetY = 0; // jdu shora
                    if (ySign > 0) fixOffsetY = n + 1; // jdu zdola
                }
                return new CollisionTestResult(true, tx, ty, collisionType, fixOffsetX, fixOffsetY, srfcDef);
            } else {
                // bez kolize
                return new CollisionTestResult(false, tx, ty);
            }
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

            let aSize, bSize;
            let aSign, bSign;

            if (xFullShift != 0) {
                // pohybuju se po ose X
                // vnější iterace A=X, vnitřní B=Y
                aSize = reqFreeWidth;
                bSize = reqFreeHeight;
                aSign = xSign;
                bSign = ySign;
            } else {
                // pohybuju se po ose Y, nebo je to stacionární kontrola 
                // vnější iterace A=Y, vnitřní B=X
                aSize = reqFreeHeight;
                bSize = reqFreeWidth;
                aSign = ySign;
                bSign = xSign;
            }

            // Iteruj v kontrolách posuvu po STEP přírůstcích, dokud nebude
            // docíleno celého posunu (zabraňuje "teleportaci")
            // Mám osy A a B protože se jestli se iteruje po X,Y nebo Y,X
            // záleží na ose směru
            for (let aStep = 0; aStep < aSize;) {
                let aShift = aStep * aSign;

                for (let bStep = 0; bStep < bSize;) {
                    let bShift = bStep * bSign;

                    let xStep, yStep;
                    let xp, yp;
                    if (xFullShift != 0) {
                        // pohybuju se po ose X
                        // vnější iterace A=X, vnitřní B=Y
                        xStep = aStep;
                        yStep = bStep;
                        xp = xStart + aShift;
                        yp = yStart + bShift;
                    } else {
                        // pohybuju se po ose Y, nebo je to stacionární kontrola 
                        // vnější iterace A=Y, vnitřní B=X
                        xStep = bStep;
                        yStep = aStep;
                        xp = xStart + bShift;
                        yp = yStart + aShift;
                    }

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

                    if (bStep == bSize - 1) {
                        if (lastResult.hit) {
                            return lastResult;
                        }
                        break;
                    } else {
                        bStep = bStep + STEP >= bSize ? bSize - 1 : bStep + STEP;
                    }
                }

                if (aStep == aSize - 1) {
                    break;
                } else {
                    aStep = aStep + STEP >= aSize ? aSize - 1 : aStep + STEP;
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
                        var heroCenterX = self.hero.x + self.hero.fixedWidth / 2;
                        var heroCenterY = self.hero.y + self.hero.fixedHeight / 4;

                        // zkus cast
                        if (rmbSpellDef.cast(new SpellContext(Hero.OWNER_ID, heroCenterX, heroCenterY, mouse.x, mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown 
                            self.hero.spellCooldowns[SpellKey.SPELL_INTERACT_KEY] = rmbSpellDef.cooldown;
                        }
                    }
                }

                // je vybrán spell?
                // TODO tohle se musí opravit -- aktuálně to snižuje cooldown pouze u spellu, který je vybraný (mělo by všem)
                var choosenSpell = Spellbook.getInstance().getChoosenSpell();
                if (typeof choosenSpell !== "undefined" && choosenSpell != null) {
                    var spellDef: SpellDefinition = Resources.getInstance().getSpellDef(choosenSpell);
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
                        let heroCenterX = self.hero.x + self.hero.fixedWidth / 2;
                        let heroCenterY = self.hero.y + self.hero.fixedHeight / 4;

                        // zkus cast
                        if (spellDef.cast(new SpellContext(Hero.OWNER_ID, heroCenterX, heroCenterY, mouse.x, mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown a odeber will
                            self.hero.spellCooldowns[choosenSpell] = spellDef.cooldown;
                            self.hero.decreseWill(spellDef.cost);
                        }
                    }
                }
            }

            let coord = self.render.pixelsToTiles(mouse.x, mouse.y);
            let clsn = self.isCollisionByTiles(coord.x, coord.y, coord.partOffsetX, coord.partOffsetY);
            let tile = self.tilesMap.mapRecord.getValue(coord.x, coord.y);
            let sector = self.render.getSectorByTiles(coord.x, coord.y);
            let typ = tile ? Resources.getInstance().surfaceIndex.getTypeName(tile) : null;
            let variant = tile ? Resources.getInstance().surfaceIndex.getPositionName(tile) : null;
            EventBus.getInstance().fireEvent(new PointedAreaEventPayload(
                clsn.x, clsn.y, clsn.hit, clsn.partOffsetX, clsn.partOffsetY, typ, variant, sector ? sector.map_x : null, sector ? sector.map_y : null));

        };

        public checkReach(character: Character, x: number, y: number, inTiles: boolean = false): ReachInfo {
            // dosahem omezená akce -- musí se počítat v tiles, aby nedošlo ke kontrole 
            // na pixel vzdálenost, která je ok, ale při změně cílové tile se celková 
            // změna projeví i na pixel místech, kde už je například kolize
            var characterCoordTL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.collYOffset);
            var characterCoordTR = this.render.pixelsToEvenTiles(character.x + character.fixedWidth - character.collXOffset, character.y + character.collYOffset);
            var characterCoordBR = this.render.pixelsToEvenTiles(character.x + character.fixedWidth - character.collXOffset, character.y + character.fixedHeight - character.collYOffset);
            var characterCoordBL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.fixedHeight - character.collYOffset);
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
            self.weather.update(delta);
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

            Nature.getInstance().handleTick(delta, self);
            // SpawnPool.getInstance().update(delta, self);
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