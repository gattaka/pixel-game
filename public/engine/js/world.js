var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * world.js
 *
 * Stará se o interakce objektů ve světě, kolize, fyziku apod.
 *
 */
var Lich;
(function (Lich) {
    var PlayerMovement = (function () {
        function PlayerMovement() {
        }
        ;
        return PlayerMovement;
    }());
    PlayerMovement.up = false;
    PlayerMovement.down = false;
    PlayerMovement.left = false;
    PlayerMovement.right = false;
    PlayerMovement.levitate = false;
    Lich.PlayerMovement = PlayerMovement;
    ;
    var WorldObject = (function (_super) {
        __extends(WorldObject, _super);
        function WorldObject(item, collXOffset, collYOffset, notificationTimer) {
            var _this = _super.call(this, collXOffset, collYOffset) || this;
            _this.item = item;
            _this.collXOffset = collXOffset;
            _this.collYOffset = collYOffset;
            _this.notificationTimer = notificationTimer;
            _this.fixedWidth = Lich.Resources.PARTS_SIZE;
            _this.fixedHeight = Lich.Resources.PARTS_SIZE;
            _this.sprite = Lich.Resources.getInstance().getInvUISprite(_this.item.invObj);
            _this.addChild(_this.sprite);
            return _this;
        }
        ;
        return WorldObject;
    }(Lich.AbstractWorldObject));
    // Okolnosti kolizního testu -- jsou potřeba pro správné
    // řešení kolizí u zkosených a jiných PARTs, které mají
    // kolizi pouze na nějaké části své plochy
    var CollisionTestContext = (function () {
        function CollisionTestContext(
            // aktuální směr v ose X
            xSign, 
            // aktuální směr v ose Y
            ySign, 
            // délka části vodorovné hrany před kontrolovaným bodem kolize 
            preEdgeWidth, 
            // délka části vodorovné hrany za kontrolovaným bodem kolize
            postEdgeWidth, 
            // délka části svislé hrany před kontrolovaným bodem kolize 
            preEdgeHeight, 
            // délka části svislé hrany za kontrolovaným bodem kolize
            postEdgeHeight) {
            this.xSign = xSign;
            this.ySign = ySign;
            this.preEdgeWidth = preEdgeWidth;
            this.postEdgeWidth = postEdgeWidth;
            this.preEdgeHeight = preEdgeHeight;
            this.postEdgeHeight = postEdgeHeight;
        }
        return CollisionTestContext;
    }());
    var World = (function (_super) {
        __extends(World, _super);
        function World(game, tilesMap) {
            var _this = _super.call(this) || this;
            _this.game = game;
            _this.tilesMap = tilesMap;
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            _this.freeObjects = Array();
            _this.bulletObjects = Array();
            _this.labelObjects = new Array();
            // kontejnery
            _this.tilesSectorsCont = new PIXI.Container();
            _this.entitiesCont = new PIXI.Container();
            _this.messagesCont = new PIXI.Container();
            _this.enemiesCount = 0;
            _this.enemies = new Array();
            var self = _this;
            // Tiles cont (objekty, povrch, pozadí)
            self.initFullScaleCont(self.tilesSectorsCont);
            self.addChild(self.tilesSectorsCont);
            // Entities cont (volné objekty, nepřtelé, hráč, projektily)
            self.initFullScaleCont(self.entitiesCont);
            self.addChild(self.entitiesCont);
            // Weather
            self.weather = new Lich.Weather(game);
            if (Lich.Resources.OPTMZ_WEATHER_SHOW_ON)
                self.addChild(self.weather);
            // Fog cont
            self.fogSectorsCont = new PIXI.particles.ParticleContainer(Lich.Render.getFogContSizeW(self.game.getSceneWidth()) * Lich.Render.getFogContSizeH(self.game.getSceneHeight()), {
                rotation: false,
                alpha: false,
                scale: false,
                uvs: true
            });
            self.initFullScaleCont(self.fogSectorsCont);
            self.fogSectorsCont.x = -Lich.Resources.PARTS_SIZE;
            self.fogSectorsCont.y = -Lich.Resources.PARTS_SIZE;
            if (Lich.Resources.OPTMZ_FOG_SHOW_ON)
                self.addChild(self.fogSectorsCont);
            // Messages cont (damage pts texty, hlášení)
            self.initFullScaleCont(self.messagesCont);
            self.addChild(self.messagesCont);
            // Render
            self.render = new Lich.Render(game, self);
            // Hráč
            self.hero = new Lich.Hero();
            self.hero.x = game.getSceneWidth() / 2;
            self.hero.y = game.getSceneHeight() / 2;
            self.entitiesCont.addChild(self.hero);
            self.placePlayerOnSpawnPoint();
            // Dig events 
            var listener = function (objType, x, y) {
                if (typeof objType.item !== "undefined") {
                    for (var i = 0; i < objType.item.quant; i++) {
                        self.spawnObject(objType.item, x, y);
                    }
                }
            };
            self.render.addOnDigSurfaceListener(listener);
            self.render.addOnDigObjectListener(listener);
            return _this;
        }
        World.prototype.initFullScaleCont = function (cont) {
            var self = this;
            cont.x = 0;
            cont.y = 0;
            cont.fixedWidth = self.game.getSceneWidth();
            cont.fixedHeight = self.game.getSceneHeight();
        };
        World.prototype.fadeEnemy = function (enemy) {
            var self = this;
            createjs.Tween.get(enemy)
                .to({
                alpha: 0
            }, 5000).call(function () {
                self.removeEnemy(enemy);
            });
        };
        World.prototype.removeEnemy = function (enemy) {
            var self = this;
            self.enemies[enemy.id] = undefined;
            self.entitiesCont.removeChild(enemy);
            self.enemiesCount--;
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.ENEMY_COUNT_CHANGE, self.enemiesCount));
        };
        World.prototype.showDeadInfo = function () {
            var self = this;
            var deadInfo = new PIXI.Container();
            this.messagesCont.addChild(deadInfo);
            var shape = new PIXI.Graphics();
            shape.fixedWidth = this.game.getSceneWidth();
            shape.fixedHeight = this.game.getSceneHeight();
            shape.beginFill(0x0a0a0a, 0.9);
            shape.drawRect(0, 0, shape.fixedWidth, shape.fixedHeight);
            shape.x = 0;
            shape.y = 0;
            deadInfo.addChild(shape);
            var gameOverSprite = Lich.Resources.getInstance().getUISprite(Lich.UISpriteKey.UI_GAME_OVER_KEY);
            var bounds = gameOverSprite.getBounds();
            gameOverSprite.x = shape.fixedWidth / 2 - bounds.width / 2;
            gameOverSprite.y = shape.fixedHeight / 2 - bounds.height / 2;
            deadInfo.addChild(gameOverSprite);
            deadInfo.alpha = 0;
            createjs.Tween.get(deadInfo)
                .to({
                alpha: 1
            }, 2000).wait(3000).call(function () {
                self.resetPlayer();
                Lich.Mixer.playSound(Lich.SoundKey.SND_TELEPORT_KEY);
            }).to({
                alpha: 0
            }, 200).call(function () {
                self.messagesCont.removeChild(deadInfo);
            });
        };
        World.prototype.fadeText = function (text, px, py, size, color, outlineColor, time) {
            if (time === void 0) { time = 1000; }
            var self = this;
            var label = new Lich.Label(text, undefined, size, color, outlineColor);
            self.messagesCont.addChild(label);
            label.x = px;
            label.y = py;
            label["tweenY"] = 0;
            label["virtualY"] = py;
            var id = 0;
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
        };
        World.prototype.spawnObject = function (invItem, x, y, inTiles) {
            if (inTiles === void 0) { inTiles = true; }
            var self = this;
            var invDef = Lich.Resources.getInstance().getInvObjectDef(invItem.invObj);
            var frames = 1;
            if (typeof invDef === "undefined" || invDef == null) {
                frames = 1;
            }
            else {
                frames = invDef.frames;
            }
            var object = new WorldObject(invItem, 2, 0, World.OBJECT_NOTIFY_TIME);
            object.speedx = 0;
            object.speedy = (Math.random() * 2 + 1) * World.OBJECT_NOTIFY_BOUNCE_SPEED;
            if (inTiles) {
                var coord = self.render.tilesToPixel(x, y);
                object.x = coord.x + 10 - Math.random() * 20;
                object.y = coord.y;
            }
            else {
                object.x = x + 10 - Math.random() * 20;
                object.y = y;
            }
            self.freeObjects.push(object);
            self.entitiesCont.addChild(object);
        };
        ;
        World.prototype.setSpawnPoint = function (tx, ty) {
            var self = this;
            var hero = self.hero;
            var heroWidth = self.render.pixelsDistanceToTiles(hero.fixedWidth);
            var heroHeight = self.render.pixelsDistanceToTiles(hero.fixedHeight);
            // posuv nahoru o výšku hráče, aby u spawn pointu stál nohama
            ty -= heroHeight - 2;
            // je hráče kam umístit?
            var fits = true;
            (function () {
                for (var hyt = 0; hyt < heroHeight; hyt++) {
                    for (var hxt = 0; hxt < heroWidth; hxt++) {
                        var result = self.isCollisionByTiles(tx + hxt, ty + hyt);
                        if (result.hit) {
                            fits = false;
                            return;
                        }
                    }
                }
            })();
            if (fits) {
                this.tilesMap.spawnPoint = new Lich.Coord2D(tx, ty - 1);
            }
            return fits;
        };
        World.prototype.placePlayerOnScreen = function (xp, yp) {
            var self = this;
            var hero = self.hero;
            var heroWidth = self.render.pixelsDistanceToTiles(hero.fixedWidth);
            var heroHeight = self.render.pixelsDistanceToTiles(hero.fixedHeight);
            var tCoord = self.render.pixelsToTiles(xp - hero.fixedWidth / 2, yp - hero.fixedHeight / 2);
            if (self.fits(tCoord.x, tCoord.y, heroWidth, heroHeight)) {
                self.placePlayerOn(tCoord.x, tCoord.y, hero);
                return true;
            }
            else {
                return false;
            }
        };
        World.prototype.placePlayerOn = function (xt, yt, hero) {
            var self = this;
            // Tohle je potřeba udělat, jinak se při více teleportech hráči
            // nastřádá rychlost a například směrem dolů se při opakovaném
            // teleportování 1px nad zemí pak dokáže i zabít :)  
            hero.speedx = 0;
            hero.speedy = 0;
            this.hero.isClimbing = false;
            this.hero.play();
            var pCoord = self.render.tilesToPixel(xt, yt);
            self.shiftWorldBy(-(pCoord.x - hero.x), -(pCoord.y - hero.y));
            // Refresh pro minimapu
            Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.PLAYER_POSITION_CHANGE, self.hero.x, self.hero.y));
        };
        World.prototype.fits = function (xt, yt, w, h) {
            var self = this;
            for (var hyt = 0; hyt < h; hyt++) {
                for (var hxt = 0; hxt < w; hxt++) {
                    var result = self.isCollisionByTiles(xt + hxt, yt + hyt);
                    if (result.hit) {
                        return false;
                    }
                }
            }
            return true;
        };
        World.prototype.placePlayerOnSpawnPoint = function () {
            var self = this;
            var game = self.game;
            var tilesMap = self.tilesMap;
            var hero = self.hero;
            var heroWidth = self.render.pixelsDistanceToTiles(hero.fixedWidth);
            var heroHeight = self.render.pixelsDistanceToTiles(hero.fixedHeight);
            var pCoord;
            if (tilesMap.spawnPoint) {
                self.placePlayerOn(tilesMap.spawnPoint.x, tilesMap.spawnPoint.y, hero);
            }
            else {
                // TODO xt by se mělo střídavě od středu vzdalovat 
                var xt_1 = tilesMap.width / 2;
                var _loop_1 = function (yt) {
                    // je hráče kam umístit?
                    var fits = self.fits(xt_1, yt, heroWidth, heroHeight);
                    if (fits) {
                        // je hráče na co umístit?
                        var sits_1 = false;
                        (function () {
                            for (var hxt = 0; hxt < heroWidth; hxt++) {
                                var result = self.isCollisionByTiles(xt_1 + hxt, yt + heroHeight + 1);
                                if (result.hit) {
                                    sits_1 = true;
                                    return;
                                }
                            }
                        })();
                        if (sits_1) {
                            self.placePlayerOn(xt_1, yt, hero);
                            return "break";
                        }
                    }
                };
                for (var yt = 0; yt < tilesMap.height; yt++) {
                    var state_1 = _loop_1(yt);
                    if (state_1 === "break")
                        break;
                }
            }
        };
        World.prototype.resetPlayer = function () {
            this.hero.fillHealth(this.hero.getMaxHealth());
            this.hero.fillWill(this.hero.getMaxWill());
            this.hero.idle();
            this.placePlayerOnSpawnPoint();
        };
        World.prototype.checkReveal = function () {
            if (!Lich.Resources.OPTMZ_FOG_PROCESS_ON)
                return;
            var self = this;
            var coord = self.render.pixelsToTiles(self.hero.x, self.hero.y);
            // Reveal 
            // Fog je krokován po 2*PART, jeden PART = 2*TILE, takže 4 TILE 
            if (!this.currentRevealViewX || Math.abs(coord.x - this.currentRevealViewX) > 4
                || !this.currentRevealViewY || Math.abs(coord.y - this.currentRevealViewY) > 4) {
                var radius = Lich.Resources.PARTS_SIZE * Lich.Resources.REVEAL_SIZE;
                this.currentRevealViewX = coord.x;
                this.currentRevealViewY = coord.y;
                var cx = Math.floor(self.hero.x + self.hero.fixedWidth / 2);
                var cy = Math.floor(self.hero.y + self.hero.fixedHeight / 2);
                var d2 = Math.pow(radius, 2);
                for (var y = cy - radius; y < cy + radius; y += Lich.Resources.PARTS_SIZE * 2) {
                    for (var x = cx - radius; x < cx + radius; x += Lich.Resources.PARTS_SIZE * 2) {
                        var r2 = Math.pow(cx - x, 2) + Math.pow(cy - y, 2);
                        if (r2 <= d2) {
                            self.render.revealFog(x, y);
                        }
                    }
                }
            }
        };
        /**
         * Udává, o kolik se má ve scéně posunout svět, záporné shiftX tedy posouvá
         * fyzicky svět doleva, takže je to jako kdyby hráč šel doprava
         */
        World.prototype.shiftWorldBy = function (shiftX, shiftY) {
            if (isNaN(shiftX)) {
                console.log("Ou.. shiftX je Nan");
            }
            if (isNaN(shiftY)) {
                console.log("Ou.. shiftY je Nan");
            }
            var self = this;
            // požadovaný posuv
            var rndShiftX = Lich.Utils.floor(shiftX);
            var rndShiftY = Lich.Utils.floor(shiftY);
            var canvasCenterX = self.game.getSceneWidth() / 2;
            var canvasCenterY = self.game.getSceneHeight() / 2;
            var playerShiftX, sceneShiftX;
            var playerShiftY, sceneShiftY;
            // kolik zbývá hráčovi z cesty na střed směrem v pohybu
            var playerPreShiftX = self.hero.x != canvasCenterX ? canvasCenterX - self.hero.x : 0;
            var playerPreShiftY = self.hero.y != canvasCenterY ? canvasCenterY - self.hero.y : 0;
            // pokud jsem například vlevo od středu ale pohybuju se opět doleva, nenabízej nic            
            if (playerPreShiftX != 0 && Lich.Utils.sign(playerPreShiftX) != Lich.Utils.sign(rndShiftX)) {
                if (Math.abs(playerPreShiftX) > Math.abs(rndShiftX)) {
                    // pokud by vzdálenost hráče od středu byla větší, než plánový posuv
                    // sniž vzdálenost, kterou spotřebuje hráč svou cestu do sředu
                    playerPreShiftX = -rndShiftX;
                }
            }
            else {
                playerPreShiftX = 0;
            }
            if (playerPreShiftY != 0 && Lich.Utils.sign(playerPreShiftY) != Lich.Utils.sign(rndShiftY)) {
                if (Math.abs(playerPreShiftY) > Math.abs(rndShiftY)) {
                    playerPreShiftY = -rndShiftY;
                }
            }
            else {
                playerPreShiftY = 0;
            }
            // kolik můžu posunout scénu? Odečti od posunu část, kterou provedu hráčem
            var plannedShiftX = rndShiftX + playerPreShiftX;
            var plannedShiftY = rndShiftY + playerPreShiftY;
            sceneShiftX = self.render.limitShiftX(plannedShiftX);
            sceneShiftY = self.render.limitShiftY(plannedShiftY);
            // kolik posunu budu muset zobrazit hráčem, protože scéna je nadoraz?
            var overSceneX = plannedShiftX - sceneShiftX;
            var overSceneY = plannedShiftY - sceneShiftY;
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
            var toShift = [self.freeObjects, self.bulletObjects, self.enemies];
            self.checkReveal();
            self.labelObjects.forEach(function (item) {
                if (item) {
                    item.x += sceneShiftX;
                    // virtualY kvůli tween pohybu textu
                    item["virtualY"] += sceneShiftY;
                }
            });
            toShift.forEach(function (items) {
                items.forEach(function (item) {
                    if (item) {
                        item.x += sceneShiftX;
                        item.y += sceneShiftY;
                    }
                });
            });
        };
        ;
        World.prototype.shiftWorldTo = function (x, y) {
            var shiftX = x - this.render.getScreenOffsetX();
            var shiftY = y - this.render.getScreenOffsetY();
            this.shiftWorldBy(shiftX, shiftY);
        };
        World.prototype.updateObject = function (sDelta, object, makeShift, forceFall, forceJump, collisionSteps, isCurrentlyClimbing) {
            if (forceFall === void 0) { forceFall = false; }
            if (forceJump === void 0) { forceJump = false; }
            if (collisionSteps === void 0) { collisionSteps = false; }
            if (isCurrentlyClimbing === void 0) { isCurrentlyClimbing = false; }
            var self = this;
            var clsnTest;
            var clsnPosition;
            var isClimbing = false;
            if (object.speedy !== 0) {
                var distanceY = void 0;
                var boundsX = object.x + object.collXOffset;
                var boundsY = object.y + object.collYOffset;
                var boundsWidth = object.fixedWidth - object.collXOffset * 2;
                var boundsHeight = object.fixedHeight - object.collYOffset * 2;
                if (isCurrentlyClimbing && forceJump || object.hovers) {
                    // ignoruj gravitaci
                    distanceY = object.speedy * sDelta;
                }
                else {
                    // dráha, kterou objekt urazil za daný časový úsek, 
                    // kdy je známa jeho poslední rychlost a zrychlení, 
                    // které na něj za daný časový úsek působilo:
                    // s_t = vt + 1/2.at^2
                    distanceY = Lich.Utils.floor(object.speedy * sDelta + World.WORLD_GRAVITY * Math.pow(sDelta, 2) / 2);
                    // uprav rychlost objektu, která se dá spočítat jako: 
                    // v = v_0 + at
                    object.speedy = object.speedy + World.WORLD_GRAVITY * sDelta;
                    if (object.speedy < World.MAX_FREEFALL_SPEED)
                        object.speedy = World.MAX_FREEFALL_SPEED;
                    ;
                }
                if (object.hovers) {
                    makeShift(0, distanceY);
                }
                if (distanceY != 0 && !object.hovers) {
                    // Nenarazím na překážku?
                    clsnTest = self.isBoundsInCollision(boundsX, boundsY, boundsWidth, boundsHeight, 0, distanceY, self.isCollision.bind(self), forceFall);
                    if (clsnTest.hit === false) {
                        // pokud není kolize a 
                        // - stoupám
                        // - klesám po jiném povrchu, než je žebřík
                        // - klesám po žebříku, pak to musí být vynucené
                        if (distanceY > 0 || clsnTest.collisionType != Lich.CollisionType.LADDER || forceFall) {
                            makeShift(0, distanceY);
                            if (clsnTest.collisionType == Lich.CollisionType.LADDER) {
                                // pokud padám na žebříku, udržuj rychlost na CLIMBING_SPEED
                                isClimbing = true;
                                if (forceFall) {
                                    object.speedy = -World.CLIMBING_SPEED;
                                }
                                else if (forceJump) {
                                    object.speedy = World.CLIMBING_SPEED;
                                }
                            }
                            else if (distanceY > 0 && isCurrentlyClimbing) {
                                // pokud stoupám do povrchu, který není žebříkem
                                // a jsem v režimu lezení po žebříku, zkontroluj,
                                // zda ještě na něm jsem, pokud ano, ponech režim
                                var clsnTest_1 = self.isBoundsInCollision(boundsX, boundsY, boundsWidth, boundsHeight, 0, 0, self.isCollision.bind(self), forceFall);
                                if (clsnTest_1.collisionType == Lich.CollisionType.LADDER) {
                                    isClimbing = true;
                                }
                            }
                        }
                        else {
                            isClimbing = clsnTest.collisionType == Lich.CollisionType.LADDER;
                            object.speedy = 0;
                        }
                    }
                    else {
                        var evenTileX = Lich.Utils.even(clsnTest.x);
                        var evenTileY = Lich.Utils.even(clsnTest.y);
                        var clsnPosition_1 = self.render.tilesToPixel(evenTileX, evenTileY);
                        var y = void 0;
                        // zastavil jsem se při pádu/skoku? Konec a "doskoč" až k překážce
                        // Získej pozici kolizního bloku (kvůli zkoseným povrchům, 
                        // které mají kolizní masky na PART se musí brát počátek od PART 
                        // nikoliv TILE, takže pouze sudé) a přičti k němu zbývající 
                        // vzdálenost (od počátku PART) do kolize
                        if (distanceY > 0) {
                            // zastavil jsem se při stoupání? Začni hned padat
                            //y = clsnPosition.y + clsnTest.partOffsetY - (object.y + object.collYOffset);
                            // makeShift(0, y);
                        }
                        else {
                            // záporné, budu dopadat dolů
                            y = object.y + object.fixedHeight - object.collYOffset - (clsnPosition_1.y + clsnTest.partOffsetY);
                            makeShift(0, y);
                        }
                        object.speedy = 0;
                    }
                }
            }
            // pokud nejsem zrovna uprostřed skoku 
            if (object.speedy == 0 && !object.hovers) {
                // ...a mám kam padat
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.fixedWidth - object.collXOffset * 2, object.fixedHeight - object.collYOffset * 2, 0, -1, self.isCollision.bind(this), 
                // pád z klidu se vždy musí zaseknout o oneWay kolize 
                // výjimkou je, když hráč chce propadnou níž
                forceFall);
                if (clsnTest.hit === false) {
                    if (clsnTest.collisionType != Lich.CollisionType.LADDER) {
                        // pokud klesám, pak klesám po jiném povrchu, než je žebřík
                        object.speedy = -1;
                        isClimbing = false;
                    }
                    else {
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
                var distanceX = Lich.Utils.floor(sDelta * object.speedx);
                if (object.hovers) {
                    makeShift(distanceX, 0);
                }
                if (distanceX != 0 && !object.hovers) {
                    // Nenarazím na překážku?
                    clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.fixedWidth - object.collXOffset * 2, object.fixedHeight - object.collYOffset * 2, distanceX, 0, self.isCollision.bind(self), 
                    // horizontální pohyb vždy ignoruje oneWay kolize
                    true);
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
                        var evenTileX = Lich.Utils.even(clsnTest.x);
                        var evenTileY = Lich.Utils.even(clsnTest.y);
                        var clsnPosition_2 = self.render.tilesToPixel(evenTileX, evenTileY);
                        if (distanceX > 0) {
                            // narazil jsem do něj zprava
                            var x = object.x + object.collXOffset - (clsnPosition_2.x + clsnTest.partOffsetX);
                            makeShift(x, 0);
                        }
                        else {
                            // narazil jsem do něj zleva
                            var x = -1 * (clsnPosition_2.x + clsnTest.partOffsetX - (object.x + object.fixedWidth - object.collXOffset));
                            makeShift(x, 0);
                        }
                        if (collisionSteps) {
                            // zabrání "vyskakování" na rampu, která je o víc než PART výš než mám nohy
                            var baseDist = object.y + object.fixedHeight - object.collYOffset - clsnPosition_2.y;
                            // automatické stoupání při chůzí po zkosené rampě
                            if (distanceX > 0 &&
                                ((clsnTest.collisionType == Lich.CollisionType.SOLID_TR && baseDist <= Lich.Resources.PARTS_SIZE)
                                    || baseDist <= Lich.Resources.TILE_SIZE)) {
                                makeShift(4, 4);
                            }
                            else if (distanceX < 0 &&
                                ((clsnTest.collisionType == Lich.CollisionType.SOLID_TL && baseDist <= Lich.Resources.PARTS_SIZE)
                                    || baseDist <= Lich.Resources.TILE_SIZE)) {
                                makeShift(-4, 4);
                            }
                        }
                    }
                }
            }
            return isClimbing;
        };
        ;
        /**
         * Zjistí zda na daných pixel-souřadnicích dochází ke kolizi
         */
        World.prototype.isCollision = function (px, py, clsCtx) {
            var self = this;
            var result = self.render.pixelsToTiles(px, py);
            return self.isCollisionByTiles(result.x, result.y, result.partOffsetX, result.partOffsetY, clsCtx);
        };
        ;
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
        World.prototype.isCollisionByTiles = function (tx, ty, partOffsetX, partOffsetY, clsCtx) {
            var self = this;
            var hit = false;
            var collisionType = Lich.CollisionType.SOLID;
            // kolik mám přičíst k POČÁTKU PART, abych našel PRVNÍ kolizi
            // v daném SMĚRU, ve kterém provádím pohyb? 
            var fixOffsetX;
            var fixOffsetY;
            var srfcDef;
            // délka PART
            var n = Lich.Resources.PARTS_SIZE - 1;
            // Směr posuvu
            var xSign, ySign;
            if (clsCtx) {
                xSign = clsCtx.xSign;
                ySign = clsCtx.ySign;
            }
            // kolize s povrchem/hranicí mapy
            var surfaceVal = self.tilesMap.mapRecord.getValue(tx, ty);
            if (surfaceVal != null && surfaceVal != 0) {
                var res = Lich.Resources.getInstance();
                srfcDef = res.getSurfaceDef(res.surfaceIndex.getType(surfaceVal));
                collisionType = srfcDef.collisionType;
                // souřadnice uvnitř PART
                var lx = void 0, ly = void 0;
                if (partOffsetX == undefined || partOffsetY == undefined) {
                    // kolize se zjišťuje přímo z tilesMap, nemám k dispozici 
                    // pixel souřadnice, PART můžu rozložit akorát na 2 tiles  
                    lx = (tx % 2) * Lich.Resources.TILE_SIZE;
                    ly = (ty % 2) * Lich.Resources.TILE_SIZE;
                }
                else {
                    // kolize se zjišťuje z pixel souřadnic, které byly převedeny
                    // na part souřadnice, znám tedy vnitřní offset
                    lx = Math.abs(partOffsetX);
                    ly = Math.abs(partOffsetY);
                    // pokud je kontrola kolizního bodu součástí kontroly kolize 
                    // objektu uprav dle směru a délky hran souřadnice tak, aby se 
                    // braly první kolize ve směru kontroly, nikoliv v daném bodě
                    if (clsCtx) {
                        var partTrim = function (d) {
                            if (d < 0)
                                return 0;
                            if (d > n - 1)
                                return n - 1;
                            return d;
                        };
                        // Tohle se musí udělat, protože kontroly jsou krokované po TILE
                        // zatímco zkosené povrchy mají rozlišení v 2px, může se tak 
                        // stát, že se TILE krokem přeskočí bližší kolizní bod a objekt
                        // se tak na tuto >TILE kolizní plochu "napíchne" dokud nenarazí
                        // po stranách tohoto hrotu na svoje TILE krokované body
                        switch (collisionType) {
                            case Lich.CollisionType.SOLID_TL:
                                lx = partTrim(lx + clsCtx.postEdgeWidth);
                                ly = partTrim(ly + clsCtx.postEdgeHeight);
                                break;
                            case Lich.CollisionType.SOLID_TR:
                                lx = partTrim(lx - clsCtx.preEdgeWidth);
                                ly = partTrim(ly + clsCtx.postEdgeHeight);
                                break;
                            case Lich.CollisionType.SOLID_BL:
                                lx = partTrim(lx + clsCtx.postEdgeWidth);
                                ly = partTrim(ly - clsCtx.preEdgeHeight);
                                break;
                            case Lich.CollisionType.SOLID_BR:
                                lx = partTrim(lx - clsCtx.preEdgeWidth);
                                ly = partTrim(ly - clsCtx.preEdgeHeight);
                                break;
                            case Lich.CollisionType.SOLID:
                            case Lich.CollisionType.PLATFORM:
                            case Lich.CollisionType.LADDER:
                            default:
                                // nech původní hodnoty, u těchto povrchů
                                // nehrozí přeskočení a "napíchnutí"
                                break;
                        }
                    }
                }
                switch (collisionType) {
                    case Lich.CollisionType.SOLID_TL:
                        // kontrola tvaru nebo směru
                        if (lx + ly >= n) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = n - ly; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = n + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = n - lx; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = n + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID_TR:
                        // kontrola tvaru nebo směru (zleva a zespoda se musí vždy narazit)
                        if (n - lx + ly >= n) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = 0; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = ly + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = lx; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = n + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID_BL:
                        // kontrola tvaru nebo směru (zprava a shora se musí vždy narazit)
                        if (n - lx + ly <= n) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = ly; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = n + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = 0; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = lx + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID_BR:
                        // kontrola tvaru nebo směru (zleva a shora se musí vždy narazit)
                        if (lx + ly <= n) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = 0; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = n - ly + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = 0; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = n - lx + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID:
                    case Lich.CollisionType.PLATFORM:
                    case Lich.CollisionType.LADDER:
                    default:
                        hit = true;
                        break;
                }
            }
            else if (surfaceVal == null) {
                // kolize "mimo mapu"
                hit = true;
                collisionType = Lich.CollisionType.SOLID;
            }
            else {
                // kolize s kolizními objekty
                var objectElement = self.tilesMap.mapObjectsTiles.getValue(tx, ty);
                if (objectElement !== null) {
                    var objType = Lich.Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                    if (objType.collision) {
                        hit = true;
                        collisionType = Lich.CollisionType.SOLID;
                    }
                }
            }
            if (hit) {
                if (fixOffsetX == undefined && fixOffsetY == undefined) {
                    if (xSign < 0)
                        fixOffsetX = 0; // jdu zleva
                    if (xSign > 0)
                        fixOffsetX = n + 1; // jdu zprava
                    if (ySign < 0)
                        fixOffsetY = 0; // jdu shora
                    if (ySign > 0)
                        fixOffsetY = n + 1; // jdu zdola
                }
                return new Lich.CollisionTestResult(true, tx, ty, collisionType, fixOffsetX, fixOffsetY, srfcDef);
            }
            else {
                // bez kolize
                return new Lich.CollisionTestResult(false, tx, ty);
            }
        };
        ;
        /**
         * Zjistí zda dojde ke kolizi, když se z aktuálních pixel-souřadnic posunu o nějakou
         * vzdálenost. Započítává velikost celého objektu tak, aby nebyla v kolizi ani jedna
         * jeho hrana. Bere v potaz, že se při posunu o danou vzdálenost objekt neteleportuje,
         * ale postupně posouvá, takže kontroluje celý interval mezi aktuální polohou a cílem.
         */
        World.prototype.isBoundsInCollision = function (xObj, yObj, objectWidth, objectHeight, xFullShift, yFullShift, collisionTester, ignoreOneWay) {
            var self = this;
            var tx;
            var ty;
            var lastResult = new Lich.CollisionTestResult(false);
            // Inkrement při procházení šířky/délky 
            var STEP = Lich.Resources.TILE_SIZE;
            // celková plocha, která nesmí být kolizní pro tento posun (+)
            var reqFreeWidth = xFullShift != 0 ? Math.abs(xFullShift) : objectWidth;
            var reqFreeHeight = yFullShift != 0 ? Math.abs(yFullShift) : objectHeight;
            // startovací pozice (+)
            var xStart, yStart;
            if (xFullShift < 0) {
                xStart = xObj + objectWidth;
                yStart = yObj;
            } // doprava
            if (xFullShift > 0) {
                xStart = xObj - 1;
                yStart = yObj;
            } // doleva
            if (yFullShift < 0) {
                yStart = yObj + objectHeight;
                xStart = xObj;
            } // dolů
            if (yFullShift > 0) {
                yStart = yObj - 1;
                xStart = xObj;
            } // nahoru
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
            var xSign = xFullShift > 0 ? -1 : 1;
            var ySign = yFullShift > 0 ? -1 : 1;
            var aSize, bSize;
            var aSign, bSign;
            if (xFullShift != 0) {
                // pohybuju se po ose X
                // vnější iterace A=X, vnitřní B=Y
                aSize = reqFreeWidth;
                bSize = reqFreeHeight;
                aSign = xSign;
                bSign = ySign;
            }
            else {
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
            for (var aStep = 0; aStep < aSize;) {
                var aShift = aStep * aSign;
                for (var bStep = 0; bStep < bSize;) {
                    var bShift = bStep * bSign;
                    var xStep = void 0, yStep = void 0;
                    var xp = void 0, yp = void 0;
                    if (xFullShift != 0) {
                        // pohybuju se po ose X
                        // vnější iterace A=X, vnitřní B=Y
                        xStep = aStep;
                        yStep = bStep;
                        xp = xStart + aShift;
                        yp = yStart + bShift;
                    }
                    else {
                        // pohybuju se po ose Y, nebo je to stacionární kontrola 
                        // vnější iterace A=Y, vnitřní B=X
                        xStep = bStep;
                        yStep = aStep;
                        xp = xStart + bShift;
                        yp = yStart + aShift;
                    }
                    var result = collisionTester(xp, yp, new CollisionTestContext(xFullShift, yFullShift, xStep, reqFreeWidth - xStep, yStep, reqFreeHeight - yStep));
                    if (result.hit) {
                        if (result.collisionType == Lich.CollisionType.PLATFORM) {
                            if (ignoreOneWay || xFullShift != 0 || yFullShift >= 0 || Lich.Utils.isEven(result.y) == false) {
                                // ignoruj kolizi
                                // - je vynuceno procházení 
                                // - nebo se jedná o horizontální pohyb
                                // - nebo stoupám
                                // - nebo jde o kolizi s druhou půlkou platformy
                            }
                            else {
                                return result;
                            }
                        }
                        else if (result.collisionType == Lich.CollisionType.LADDER) {
                            // žebříková kolize se vrací pouze jako info
                            lastResult = result;
                            lastResult.hit = false;
                        }
                        else if (result.collisionType == Lich.CollisionType.SOLID) {
                            return result;
                        }
                        else {
                            // Získání nejbližší kolize
                            if (lastResult.partOffsetX == undefined || lastResult.partOffsetY == undefined
                                || xFullShift < 0 && result.x * Lich.Resources.PARTS_SIZE + result.partOffsetX < lastResult.x * Lich.Resources.PARTS_SIZE + lastResult.partOffsetX
                                || xFullShift > 0 && result.x * Lich.Resources.PARTS_SIZE + result.partOffsetX > lastResult.x * Lich.Resources.PARTS_SIZE + lastResult.partOffsetX
                                || yFullShift < 0 && result.y * Lich.Resources.PARTS_SIZE + result.partOffsetY < lastResult.y * Lich.Resources.PARTS_SIZE + lastResult.partOffsetY
                                || yFullShift > 0 && result.y * Lich.Resources.PARTS_SIZE + result.partOffsetY > lastResult.y * Lich.Resources.PARTS_SIZE + lastResult.partOffsetY)
                                lastResult = result;
                        }
                    }
                    if (bStep == bSize - 1) {
                        if (lastResult.hit) {
                            return lastResult;
                        }
                        break;
                    }
                    else {
                        bStep = bStep + STEP >= bSize ? bSize - 1 : bStep + STEP;
                    }
                }
                if (aStep == aSize - 1) {
                    break;
                }
                else {
                    aStep = aStep + STEP >= aSize ? aSize - 1 : aStep + STEP;
                }
            }
            return lastResult;
        };
        ;
        World.prototype.updateMouse = function (delta) {
            var self = this;
            if (self.hero.getCurrentHealth() > 0) {
                // je prováděna interakce s objektem?
                if (Lich.Mouse.rightDown) {
                    var rmbSpellDef = Lich.Resources.getInstance().interactSpellDef;
                    // Může se provést (cooldown je pryč)?
                    var rmbCooldown = self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY];
                    if (!rmbCooldown || rmbCooldown <= 0) {
                        var heroCenterX = self.hero.x + self.hero.fixedWidth / 2;
                        var heroCenterY = self.hero.y + self.hero.fixedHeight / 4;
                        // zkus cast
                        if (rmbSpellDef.cast(new Lich.SpellContext(Lich.Hero.OWNER_ID, heroCenterX, heroCenterY, Lich.Mouse.x, Lich.Mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown 
                            self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY] = rmbSpellDef.cooldown;
                        }
                    }
                }
                // je vybrán spell?
                // TODO tohle se musí opravit -- aktuálně to snižuje cooldown pouze u spellu, který je vybraný (mělo by všem)
                var choosenSpell = Lich.Spellbook.getInstance().getChoosenSpell();
                if (typeof choosenSpell !== "undefined" && choosenSpell != null) {
                    var spellDef = Lich.Resources.getInstance().getSpellDef(choosenSpell);
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
                    if (self.hero.getCurrentWill() >= spellDef.cost && cooldown <= 0 && (Lich.Mouse.down)) {
                        var heroCenterX_1 = self.hero.x + self.hero.fixedWidth / 2;
                        var heroCenterY_1 = self.hero.y + self.hero.fixedHeight / 4;
                        // zkus cast
                        if (spellDef.cast(new Lich.SpellContext(Lich.Hero.OWNER_ID, heroCenterX_1, heroCenterY_1, Lich.Mouse.x, Lich.Mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown a odeber will
                            self.hero.spellCooldowns[choosenSpell] = spellDef.cooldown;
                            self.hero.decreseWill(spellDef.cost);
                        }
                    }
                }
            }
            var coord = self.render.pixelsToTiles(Lich.Mouse.x, Lich.Mouse.y);
            var clsn = self.isCollisionByTiles(coord.x, coord.y, coord.partOffsetX, coord.partOffsetY);
            var tile = self.tilesMap.mapRecord.getValue(coord.x, coord.y);
            var sector = self.render.getSectorByTiles(coord.x, coord.y);
            var typ = tile ? Lich.Resources.getInstance().surfaceIndex.getTypeName(tile) : null;
            var variant = tile ? Lich.Resources.getInstance().surfaceIndex.getPositionName(tile) : null;
            Lich.EventBus.getInstance().fireEvent(new Lich.PointedAreaEventPayload(clsn.x, clsn.y, clsn.hit, clsn.partOffsetX, clsn.partOffsetY, typ, variant, sector ? sector.map_x : null, sector ? sector.map_y : null));
        };
        World.prototype.updateMovement = function (delta) {
            var self = this;
            var sDelta = delta / 1000; // ms -> s
            // AI Enemies
            self.enemies.forEach(function (enemy) {
                if (enemy)
                    enemy.runAI(self, delta);
            });
            var updateCharacter = function (character, makeShift) {
                var forceDown = false;
                var forceUp = false;
                // Je-li postava naživu, vnímej její ovládání
                if (character.getCurrentHealth() > 0) {
                    switch (character.movementTypeY) {
                        case Lich.MovementTypeY.NONE:
                        case Lich.MovementTypeY.HOVER:
                            break;
                        case Lich.MovementTypeY.JUMP_OR_CLIMB:
                            forceUp = true;
                            if (character.speedy == 0) {
                                character.speedy = character.accelerationY;
                            }
                            break;
                        case Lich.MovementTypeY.DESCENT:
                            forceDown = true;
                            break;
                        case Lich.MovementTypeY.ASCENT:
                            forceUp = true;
                            character.speedy = character.accelerationY;
                            break;
                    }
                    switch (character.movementTypeX) {
                        case Lich.MovementTypeX.NONE:
                            character.speedx = 0;
                            break;
                        case Lich.MovementTypeX.WALK_LEFT:
                            character.speedx = character.accelerationX;
                            break;
                        case Lich.MovementTypeX.WALK_RIGHT:
                            character.speedx = -character.accelerationX;
                            break;
                        case Lich.MovementTypeX.HOVER:
                            break;
                    }
                }
                // update postavy
                character.isClimbing = self.updateObject(sDelta, character, makeShift, forceDown, forceUp, true, character.isClimbing);
                character.updateAnimations();
            };
            // Dle kláves nastav směry pohybu
            if (PlayerMovement.up) {
                self.hero.movementTypeY = Lich.MovementTypeY.JUMP_OR_CLIMB;
            }
            else if (PlayerMovement.levitate) {
                self.hero.movementTypeY = Lich.MovementTypeY.ASCENT;
            }
            else if (PlayerMovement.down) {
                self.hero.movementTypeY = Lich.MovementTypeY.DESCENT;
            }
            else {
                self.hero.movementTypeY = Lich.MovementTypeY.NONE;
            }
            // Horizontální akcelerace
            if (PlayerMovement.left) {
                self.hero.movementTypeX = Lich.MovementTypeX.WALK_LEFT;
            }
            else if (PlayerMovement.right) {
                self.hero.movementTypeX = Lich.MovementTypeX.WALK_RIGHT;
            }
            else {
                self.hero.movementTypeX = Lich.MovementTypeX.NONE;
            }
            // ulož staré rychlosti a pozici
            var oldPosX = self.hero.x;
            var oldPosY = self.hero.y;
            var oldSpeedX = self.hero.speedx;
            var oldSpeedY = self.hero.speedy;
            // update pohybu hráče
            updateCharacter(self.hero, self.shiftWorldBy.bind(self));
            if (self.hero.x != oldPosX || self.hero.y != oldPosY)
                Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.PLAYER_POSITION_CHANGE, self.hero.x, self.hero.y));
            if (self.hero.speedx != oldSpeedX || self.hero.speedy != oldSpeedY)
                Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.PLAYER_SPEED_CHANGE, self.hero.speedx, self.hero.speedy));
            // kontrola zranění z pádu
            if (self.hero.speedy == 0 && oldSpeedY < 0) {
                var threshold = World.MAX_FREEFALL_SPEED / 1.5;
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
                        var rndX = Lich.Utils.floor(shiftX);
                        var rndY = Lich.Utils.floor(shiftY);
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
        };
        World.prototype.update = function (delta) {
            var self = this;
            var sDelta = delta / 1000; // ms -> s
            this.updateMovement(delta);
            this.updateMouse(delta);
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
                    if (object.isDone() || object.getCurrentAnimation() === Lich.AnimationKey[Lich.AnimationKey.ANM_BULLET_DONE_KEY]) {
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
                        var rndX = Lich.Utils.floor(x);
                        var rndY = Lich.Utils.floor(y);
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
                            Lich.Inventory.getInstance().invInsert(object.item.invObj, 1);
                            self.freeObjects.splice(i, 1);
                            self.entitiesCont.removeChild(object);
                            Lich.Mixer.playSound(Lich.SoundKey.SND_PICK_KEY, 0.2);
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
            self.hero.handleTick(delta);
            self.enemies.forEach(function (enemy) {
                if (enemy)
                    enemy.handleTick(delta);
            });
            self.weather.update(delta);
            self.render.handleTick();
            // TODO cooldown - delta pro všechny položky spell v hráčovi a všech nepřátel
            var rmbCooldown = self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY];
            if (!rmbCooldown) {
                rmbCooldown = 0;
                self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY] = 0;
            }
            else {
                // Sniž dle delay
                self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY] -= delta;
            }
            Lich.Nature.getInstance().handleTick(delta, self);
            Lich.SpawnPool.getInstance().update(delta, self);
        };
        ;
        World.prototype.checkReach = function (character, x, y, inTiles) {
            if (inTiles === void 0) { inTiles = false; }
            // dosahem omezená akce -- musí se počítat v tiles, aby nedošlo ke kontrole 
            // na pixel vzdálenost, která je ok, ale při změně cílové tile se celková 
            // změna projeví i na pixel místech, kde už je například kolize
            var characterCoordTL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.collYOffset);
            var characterCoordTR = this.render.pixelsToEvenTiles(character.x + character.fixedWidth - character.collXOffset, character.y + character.collYOffset);
            var characterCoordBR = this.render.pixelsToEvenTiles(character.x + character.fixedWidth - character.collXOffset, character.y + character.fixedHeight - character.collYOffset);
            var characterCoordBL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.fixedHeight - character.collYOffset);
            var coord = inTiles ? new Lich.Coord2D(Lich.Utils.even(x), Lich.Utils.even(y)) : this.render.pixelsToEvenTiles(x, y);
            // kontroluj rádius od každého rohu
            var inReach = Lich.Utils.distance(coord.x, coord.y, characterCoordTL.x, characterCoordTL.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(coord.x, coord.y, characterCoordTR.x, characterCoordTR.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(coord.x, coord.y, characterCoordBR.x, characterCoordBR.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(coord.x, coord.y, characterCoordBL.x, characterCoordBL.y) < Lich.Resources.REACH_TILES_RADIUS;
            return new ReachInfo(coord, characterCoordTL, characterCoordTR, characterCoordBR, characterCoordBL, inReach);
        };
        return World;
    }(PIXI.Container));
    /*-----------*/
    /* CONSTANTS */
    /*-----------*/
    World.OBJECT_NOTIFY_TIME = 500;
    World.OBJECT_NOTIFY_BOUNCE_SPEED = 120;
    World.OBJECT_PICKUP_DISTANCE = 10;
    World.OBJECT_PICKUP_FORCE_DISTANCE = 100;
    World.OBJECT_PICKUP_FORCE_TIME = 150;
    // Pixel/s2
    World.WORLD_GRAVITY = -1200;
    World.CLIMBING_SPEED = 300;
    World.DESCENT_SPEED = -10;
    World.MAX_FREEFALL_SPEED = -1200;
    Lich.World = World;
    var ReachInfo = (function () {
        function ReachInfo(source, characterCoordTL, characterCoordTR, characterCoordBR, characterCoordBL, inReach) {
            this.source = source;
            this.characterCoordTL = characterCoordTL;
            this.characterCoordTR = characterCoordTR;
            this.characterCoordBR = characterCoordBR;
            this.characterCoordBL = characterCoordBL;
            this.inReach = inReach;
        }
        return ReachInfo;
    }());
    Lich.ReachInfo = ReachInfo;
})(Lich || (Lich = {}));
