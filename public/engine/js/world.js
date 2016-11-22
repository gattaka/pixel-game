var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * world.js
 *
 * Stará se o interakce objektů ve světě, kolize, fyziku apod.
 *
 */
var Lich;
(function (Lich) {
    var WorldObject = (function (_super) {
        __extends(WorldObject, _super);
        function WorldObject(item, width, height, spriteSheet, initState, states, collXOffset, collYOffset, notificationTimer) {
            _super.call(this, width, height, spriteSheet, initState, collXOffset, collYOffset);
            this.item = item;
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.initState = initState;
            this.states = states;
            this.collXOffset = collXOffset;
            this.collYOffset = collYOffset;
            this.notificationTimer = notificationTimer;
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
            _super.call(this);
            this.game = game;
            this.tilesMap = tilesMap;
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.freeObjects = Array();
            this.bulletObjects = Array();
            this.labelObjects = new Array();
            this.enemiesCount = 0;
            this.enemies = new Array();
            var self = this;
            self.render = new Lich.Render(game, self);
            self.hero = new Lich.Hero();
            /*------------*/
            /* Characters */
            /*------------*/
            self.addChild(self.hero);
            self.placePlayerOnSpawnPoint();
            /*------------*/
            /* Dig events */
            /*------------*/
            var listener = function (objType, x, y) {
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
        World.prototype.fadeEnemy = function (enemy) {
            var self = this;
            createjs.Tween.get(enemy)
                .to({
                alpha: 0
            }, 5000).call(function () {
                self.enemies[enemy.id] = undefined;
                self.removeChild(enemy);
                self.enemiesCount--;
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.ENEMY_COUNT_CHANGE, self.enemiesCount));
            });
        };
        World.prototype.resetPlayer = function () {
            this.hero.fillHealth(this.hero.getMaxHealth());
            this.hero.fillWill(this.hero.getMaxWill());
            this.hero.idle();
            this.placePlayerOnSpawnPoint();
        };
        World.prototype.showDeadInfo = function () {
            var self = this;
            var deadInfo = new createjs.Container();
            this.addChild(deadInfo);
            var shape = new createjs.Shape();
            shape.width = this.game.getCanvas().width;
            shape.height = this.game.getCanvas().height;
            shape.graphics.beginFill("rgba(10,10,10,0.9)");
            shape.graphics.drawRect(0, 0, shape.width, shape.height);
            shape.x = 0;
            shape.y = 0;
            deadInfo.addChild(shape);
            var bitmap = Lich.Resources.getInstance().getBitmap(Lich.UIGFXKey[Lich.UIGFXKey.GAME_OVER_KEY]);
            var bounds = bitmap.getBounds();
            bitmap.x = shape.width / 2 - bounds.width / 2;
            bitmap.y = shape.height / 2 - bounds.height / 2;
            deadInfo.addChild(bitmap);
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
                self.removeChild(deadInfo);
            });
        };
        World.prototype.fadeText = function (text, px, py, size, color, outlineColor) {
            if (size === void 0) { size = Lich.PartsUI.TEXT_SIZE; }
            if (color === void 0) { color = Lich.Resources.TEXT_COLOR; }
            if (outlineColor === void 0) { outlineColor = Lich.Resources.OUTLINE_COLOR; }
            var self = this;
            var label = new Lich.Label(text, size + "px " + Lich.Resources.FONT, color, true, outlineColor, 1);
            self.addChild(label);
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
            }, 1000).call(function () {
                self.labelObjects[id] = undefined;
                self.removeChild(label);
            });
        };
        World.prototype.spawnObject = function (invItem, x, y, inTiles) {
            if (inTiles === void 0) { inTiles = true; }
            var self = this;
            var invDef = Lich.Resources.getInstance().invObjectDefs[invItem.invObj];
            var frames = 1;
            if (typeof invDef === "undefined" || invDef == null) {
                frames = 1;
            }
            else {
                frames = invDef.frames;
            }
            var image = Lich.Resources.getInstance().getImage(Lich.InventoryKey[invItem.invObj]);
            var object = new WorldObject(invItem, image.width / frames, // aby se nepoužila délka všech snímků vedle sebe
            image.height, Lich.Resources.getInstance().getSpriteSheet(Lich.InventoryKey[invItem.invObj], frames), "idle", { "idle": "idle" }, 2, 0, World.OBJECT_NOTIFY_TIME);
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
            self.addChild(object);
        };
        ;
        World.prototype.setSpawnPoint = function (tx, ty) {
            var self = this;
            var hero = self.hero;
            var heroWidth = self.render.pixelsDistanceToTiles(hero.width);
            var heroHeight = self.render.pixelsDistanceToTiles(hero.height);
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
        World.prototype.placePlayerOnSpawnPoint = function () {
            var self = this;
            var game = self.game;
            var tilesMap = self.tilesMap;
            self.hero.x = game.getCanvas().width / 2;
            self.hero.y = game.getCanvas().height / 2;
            var hero = self.hero;
            // Tohle je potřeba udělat, jinak se při více teleportech hráči
            // nastřádá rychlost a například směrem dolů se při opakovaném
            // teleportování 1px nad zemí pak dokáže i zabít :)  
            hero.speedx = 0;
            hero.speedy = 0;
            var heroWidth = self.render.pixelsDistanceToTiles(hero.width);
            var heroHeight = self.render.pixelsDistanceToTiles(hero.height);
            var pCoord;
            if (tilesMap.spawnPoint) {
                pCoord = self.render.tilesToPixel(tilesMap.spawnPoint.x, tilesMap.spawnPoint.y);
            }
            else {
                var xt_1 = tilesMap.width / 2;
                var _loop_1 = function(yt) {
                    // je hráče kam umístit?
                    var fits = true;
                    (function () {
                        for (var hyt = 0; hyt < heroHeight; hyt++) {
                            for (var hxt = 0; hxt < heroWidth; hxt++) {
                                var result = self.isCollisionByTiles(xt_1 + hxt, yt + hyt);
                                if (result.hit) {
                                    fits = false;
                                    return;
                                }
                            }
                        }
                    })();
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
                            pCoord = self.render.tilesToPixel(xt_1, yt);
                            return "break";
                        }
                    }
                };
                for (var yt = 0; yt < tilesMap.height; yt++) {
                    var state_1 = _loop_1(yt);
                    if (state_1 === "break") break;
                }
            }
            self.shiftWorldBy(-(pCoord.x - hero.x), -(pCoord.y - hero.y));
        };
        /**
         * Udává, o kolik se má ve scéně posunout svět, záporné shiftX tedy posouvá
         * fyzicky svět doleva, takže je to jako kdyby hráč šel doprava
         */
        World.prototype.shiftWorldBy = function (shiftX, shiftY) {
            var self = this;
            var rndDstX = Lich.Utils.floor(shiftX);
            var rndDstY = Lich.Utils.floor(shiftY);
            var canvasCenterX = self.game.getCanvas().width / 2;
            var canvasCenterY = self.game.getCanvas().height / 2;
            var willShiftX = self.render.canShiftX(rndDstX) && self.hero.x == canvasCenterX;
            var willShiftY = self.render.canShiftY(rndDstY) && self.hero.y == canvasCenterY;
            self.render.shiftSectorsBy(willShiftX ? rndDstX : 0, willShiftY ? rndDstY : 0);
            self.game.getBackground().shift(willShiftX ? rndDstX : 0, willShiftY ? rndDstY : 0);
            var toShift = [self.freeObjects, self.bulletObjects, self.enemies];
            self.labelObjects.forEach(function (item) {
                if (item) {
                    if (willShiftX)
                        item.x += rndDstX;
                    if (willShiftY)
                        item["virtualY"] += rndDstY;
                }
            });
            toShift.forEach(function (items) {
                items.forEach(function (item) {
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
                }
                else {
                    self.hero.x -= rndDstX;
                }
            }
            if (!willShiftY) {
                if (self.hero.y > canvasCenterY && self.hero.y - rndDstY < canvasCenterY
                    || self.hero.y < canvasCenterY && self.hero.y - rndDstY > canvasCenterY) {
                    self.hero.y = canvasCenterY;
                }
                else {
                    self.hero.y -= rndDstY;
                }
            }
        };
        ;
        World.prototype.shiftWorldTo = function (x, y) {
            var shiftX = x - this.render.getScreenOffsetX();
            var shiftY = y - this.render.getScreenOffsetY();
            this.shiftWorldBy(shiftX, shiftY);
        };
        World.prototype.updateObject = function (sDelta, object, makeShift, forceFall, forceJump, collisionSteps) {
            if (forceFall === void 0) { forceFall = false; }
            if (forceJump === void 0) { forceJump = false; }
            if (collisionSteps === void 0) { collisionSteps = false; }
            var self = this;
            var clsnTest;
            var clsnPosition;
            var isClimbing = false;
            if (object.speedy !== 0) {
                // dráha, kterou objekt urazil za daný časový úsek, 
                // kdy je známa jeho poslední rychlost a zrychlení, 
                // které na něj za daný časový úsek působilo:
                // s_t = vt + 1/2.at^2
                var distanceY = Lich.Utils.floor(object.speedy * sDelta + World.WORLD_GRAVITY * Math.pow(sDelta, 2) / 2);
                // uprav rychlost objektu, která se dá spočítat jako: 
                // v = v_0 + at
                object.speedy = object.speedy + World.WORLD_GRAVITY * sDelta;
                if (object.speedy < World.MAX_FREEFALL_SPEED)
                    object.speedy = World.MAX_FREEFALL_SPEED;
                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, distanceY, self.isCollision.bind(self), forceFall);
                if (clsnTest.hit === false) {
                    // pokud není kolize a stoupám
                    // pokud klesám, pak klesám po jiném povrchu, než je žebřík
                    // pokud klesám po žebříku, pak to musí být vynucené
                    if (distanceY > 0 || clsnTest.collisionType != Lich.CollisionType.LADDER || forceFall) {
                        makeShift(0, distanceY);
                        // pokud padám na žebříku, udržuj rychlost na CLIMBING_SPEED
                        if (clsnTest.collisionType == Lich.CollisionType.LADDER) {
                            isClimbing = true;
                            if (forceFall) {
                                object.speedy = -World.CLIMBING_SPEED;
                            }
                            else if (forceJump) {
                                object.speedy = World.CLIMBING_SPEED;
                            }
                        }
                    }
                    else {
                        object.speedy = 0;
                    }
                }
                else {
                    if (distanceY > 0) {
                    }
                    else {
                        // zastavil jsem se při pádu? Konec skoku a "doskoč" až na zem
                        // Získej pozici kolizního bloku (kvůli zkoseným povrchům, 
                        // které mají kolizní masky na PART se musí brát počátek od PART 
                        // nikoliv TILE, takže pouze sudé) a přičti k němu zbývající 
                        // vzdálenost (od počátku PART) do kolize
                        var evenTileX = Lich.Utils.even(clsnTest.x);
                        var evenTileY = Lich.Utils.even(clsnTest.y);
                        var clsnPosition_1 = self.render.tilesToPixel(evenTileX, evenTileY);
                        makeShift(0, -1 * (clsnPosition_1.y + clsnTest.partOffsetY - (object.y + object.height - object.collYOffset)));
                    }
                    object.speedy = 0;
                }
            }
            // pokud nejsem zrovna uprostřed skoku 
            if (object.speedy === 0) {
                // ...a mám kam padat
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, -1, self.isCollision.bind(this), 
                // pád z klidu se vždy musí zaseknout o oneWay kolize 
                // výjimkou je, když hráč chce propadnou níž
                forceFall);
                if (clsnTest.hit === false) {
                    if (clsnTest.collisionType != Lich.CollisionType.LADDER) {
                        // pokud klesám, pak klesám po jiném povrchu, než je žebřík
                        object.speedy = -1;
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
                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, distanceX, 0, self.isCollision.bind(self), 
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
                        makeShift(object.x + object.collXOffset - (clsnPosition_2.x + clsnTest.partOffsetX), 0);
                    }
                    else {
                        // narazil jsem do něj zleva
                        makeShift(-1 * (clsnPosition_2.x + clsnTest.partOffsetX - (object.x + object.width - object.collXOffset)), 0);
                    }
                    if (collisionSteps) {
                        // zabrání "vyskakování" na rampu, která je o víc než PART výš než mám nohy
                        var baseDist = object.y + object.height - object.collYOffset - clsnPosition_2.y;
                        // automatické stoupání při chůzí po zkosené rampě
                        if (distanceX > 0 &&
                            ((clsnTest.collisionType == Lich.CollisionType.SOLID_TR && baseDist <= Lich.Resources.PARTS_SIZE)
                                || baseDist <= Lich.Resources.TILE_SIZE)) {
                            makeShift(4, 6);
                        }
                        else if (distanceX < 0 &&
                            ((clsnTest.collisionType == Lich.CollisionType.SOLID_TL && baseDist <= Lich.Resources.PARTS_SIZE)
                                || baseDist <= Lich.Resources.TILE_SIZE)) {
                            makeShift(-4, 6);
                        }
                    }
                }
            }
            if (typeof object.updateAnimations !== "undefined") {
                object.updateAnimations();
            }
            return isClimbing;
        };
        ;
        World.prototype.update = function (delta, controls) {
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
                        case Lich.MovementTypeY.NONE: break;
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
                        case Lich.MovementTypeY.HOVER_UP: break;
                        case Lich.MovementTypeY.HOVER_DOWN: break;
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
                        case Lich.MovementTypeX.HOVER_LEFT: break;
                        case Lich.MovementTypeX.HOVER_RIGHT: break;
                    }
                }
                // update postavy
                character.isClimbing = self.updateObject(sDelta, character, makeShift, forceDown, forceUp, true);
            };
            // Dle kláves nastav směry pohybu
            if (controls.up && self.hero.speedy === 0) {
                self.hero.movementTypeY = Lich.MovementTypeY.JUMP_OR_CLIMB;
            }
            else if (controls.levitate) {
                self.hero.movementTypeY = Lich.MovementTypeY.ASCENT;
            }
            else if (controls.down) {
                self.hero.movementTypeY = Lich.MovementTypeY.DESCENT;
            }
            else {
                self.hero.movementTypeY = Lich.MovementTypeY.NONE;
            }
            // Horizontální akcelerace
            if (controls.left) {
                self.hero.movementTypeX = Lich.MovementTypeX.WALK_LEFT;
            }
            else if (controls.right) {
                self.hero.movementTypeX = Lich.MovementTypeX.WALK_RIGHT;
            }
            else {
                self.hero.movementTypeX = Lich.MovementTypeX.NONE;
            }
            // ulož starou vertikální rychlost 
            var oldSpeedY = self.hero.speedy;
            // update pohybu hráče
            updateCharacter(self.hero, self.shiftWorldBy.bind(self));
            // kontrola zranění z pádu
            if (self.hero.speedy == 0 && oldSpeedY < 0) {
                var threshold = World.MAX_FREEFALL_SPEED / 1.5;
                oldSpeedY -= threshold;
                if (oldSpeedY < 0) {
                    self.hero.hit(Math.floor(self.hero.getMaxHealth() * oldSpeedY / (World.MAX_FREEFALL_SPEED - threshold)), this);
                }
            }
            Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.PLAYER_POSITION_CHANGE, self.hero.x, self.hero.y));
            Lich.EventBus.getInstance().fireEvent(new Lich.TupleEventPayload(Lich.EventType.PLAYER_SPEED_CHANGE, self.hero.speedx, self.hero.speedy));
            // update nepřátel
            self.enemies.forEach(function (enemy) {
                if (enemy) {
                    updateCharacter(enemy, function (x, y) {
                        var rndX = Lich.Utils.floor(x);
                        var rndY = Lich.Utils.floor(y);
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
                        var rndX = Lich.Utils.floor(x);
                        var rndY = Lich.Utils.floor(y);
                        object.x -= rndX;
                        object.y -= rndY;
                    }, false, false, false);
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
                            Lich.Mixer.playSound(Lich.SoundKey.SND_PICK_KEY, false, 0.2);
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
            // kolize s povrchem/hranicí mapy
            var val = self.tilesMap.mapRecord.getValue(tx, ty);
            if (val != null && val != 0) {
                var res = Lich.Resources.getInstance();
                var collisionType = res.mapSurfaceDefs[res.surfaceIndex.getType(val)].collisionType;
                // souřadnice uvnitř PART
                var lx = void 0, ly = void 0;
                // délka PART
                var n_1 = Lich.Resources.PARTS_SIZE - 1;
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
                            if (d > n_1 - 1)
                                return n_1 - 1;
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
                var hit = false;
                // kolik mám přičíst k POČÁTKU PART, abych našel PRVNÍ kolizi
                // v daném SMĚRU, ve kterém provádím pohyb? 
                var fixOffsetX = 0;
                var fixOffsetY = 0;
                var xSign = void 0, ySign = void 0;
                if (clsCtx) {
                    xSign = clsCtx.xSign;
                    ySign = clsCtx.ySign;
                }
                switch (collisionType) {
                    case Lich.CollisionType.SOLID_TL:
                        // kontrola tvaru nebo směru
                        if (lx + ly >= n_1) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = n_1 - ly; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = n_1 + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = n_1 - lx; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = n_1 + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID_TR:
                        // kontrola tvaru nebo směru (zleva a zespoda se musí vždy narazit)
                        if (n_1 - lx + ly >= n_1) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = 0; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = ly + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = lx; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = n_1 + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID_BL:
                        // kontrola tvaru nebo směru (zprava a shora se musí vždy narazit)
                        if (n_1 - lx + ly <= n_1) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = ly; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = n_1 + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = 0; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = lx + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID_BR:
                        // kontrola tvaru nebo směru (zleva a shora se musí vždy narazit)
                        if (lx + ly <= n_1) {
                            hit = true;
                            if (xSign < 0)
                                fixOffsetX = 0; // jdu zleva
                            if (xSign > 0)
                                fixOffsetX = n_1 + ly + 1; // jdu zprava
                            if (ySign < 0)
                                fixOffsetY = 0; // jdu shora
                            if (ySign > 0)
                                fixOffsetY = n_1 + lx + 1; // jdu zdola
                        }
                        break;
                    case Lich.CollisionType.SOLID:
                    case Lich.CollisionType.PLATFORM:
                    case Lich.CollisionType.LADDER:
                    default:
                        hit = true;
                        if (xSign < 0)
                            fixOffsetX = 0; // jdu zleva
                        if (xSign > 0)
                            fixOffsetX = n_1 + 1; // jdu zprava
                        if (ySign < 0)
                            fixOffsetY = 0; // jdu shora
                        if (ySign > 0)
                            fixOffsetY = n_1 + 1; // jdu zdola
                        break;
                }
                if (hit) {
                    return new Lich.CollisionTestResult(true, tx, ty, collisionType, fixOffsetX, fixOffsetY);
                }
            }
            // kolize "mimo mapu"
            if (val == null) {
                return new Lich.CollisionTestResult(true, tx, ty);
            }
            // kolize s kolizními objekty
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(tx, ty);
            if (objectElement !== null) {
                var objType = Lich.Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                if (objType.collision)
                    return new Lich.CollisionTestResult(true, tx, ty);
            }
            // bez kolize
            return new Lich.CollisionTestResult(false, tx, ty);
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
            // Iteruj v kontrolách posuvu po STEP přírůstcích, dokud nebude
            // docíleno celého posunu (zabraňuje "teleportaci")
            for (var yStep = 0; yStep < reqFreeHeight;) {
                var yShift = yStep * ySign;
                var yp = yStart + yShift;
                for (var xStep = 0; xStep < reqFreeWidth;) {
                    var xShift = xStep * xSign;
                    var xp = xStart + xShift;
                    var result = collisionTester(xp, yp, new CollisionTestContext(xFullShift, yFullShift, xStep, reqFreeWidth - xStep, yStep, reqFreeHeight - yStep));
                    if (result.hit) {
                        if (result.collisionType == Lich.CollisionType.PLATFORM) {
                            if (ignoreOneWay || xFullShift != 0 || yFullShift >= 0 || Lich.Utils.isEven(result.y) == false) {
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
                    if (xStep == reqFreeWidth - 1) {
                        break;
                    }
                    else {
                        xStep = xStep + STEP >= reqFreeWidth ? reqFreeWidth - 1 : xStep + STEP;
                    }
                }
                if (yStep == reqFreeHeight - 1) {
                    break;
                }
                else {
                    yStep = yStep + STEP >= reqFreeHeight ? reqFreeHeight - 1 : yStep + STEP;
                }
            }
            return lastResult;
        };
        ;
        World.prototype.handleMouse = function (mouse, delta) {
            var self = this;
            if (self.hero.getCurrentHealth() > 0) {
                // je prováděna interakce s objektem?
                if (mouse.rightDown) {
                    var rmbSpellDef = Lich.Resources.getInstance().interactSpellDef;
                    // Může se provést (cooldown je pryč)?
                    var rmbCooldown = self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY];
                    if (!rmbCooldown || rmbCooldown <= 0) {
                        var heroCenterX = self.hero.x + self.hero.width / 2;
                        var heroCenterY = self.hero.y + self.hero.height / 4;
                        // zkus cast
                        if (rmbSpellDef.cast(new Lich.SpellContext(Lich.Hero.OWNER_HERO_TAG, heroCenterX, heroCenterY, mouse.x, mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown 
                            self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY] = rmbSpellDef.cooldown;
                        }
                    }
                }
                // je vybrán spell?
                // TODO tohle se musí opravit -- aktuálně to snižuje cooldown pouze u spellu, který je vybraný (mělo by všem)
                var choosenSpell = self.game.getUI().spellsUI.getChoosenSpell();
                if (typeof choosenSpell !== "undefined" && choosenSpell != null) {
                    var spellDef = Lich.Resources.getInstance().spellDefs.byKey(Lich.SpellKey[choosenSpell]);
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
                        var heroCenterX_1 = self.hero.x + self.hero.width / 2;
                        var heroCenterY_1 = self.hero.y + self.hero.height / 4;
                        // zkus cast
                        if (spellDef.cast(new Lich.SpellContext(Lich.Hero.OWNER_HERO_TAG, heroCenterX_1, heroCenterY_1, mouse.x, mouse.y, self.game))) {
                            // ok, cast se provedl, nastav nový cooldown a odeber will
                            self.hero.spellCooldowns[choosenSpell] = spellDef.cooldown;
                            self.hero.decreseWill(spellDef.cost);
                        }
                    }
                }
            }
            var coord = self.render.pixelsToTiles(mouse.x, mouse.y);
            var clsn = self.isCollisionByTiles(coord.x, coord.y, coord.partOffsetX, coord.partOffsetY);
            var typ = self.tilesMap.mapRecord.getValue(coord.x, coord.y);
            var sector = self.render.getSectorByTiles(coord.x, coord.y);
            Lich.EventBus.getInstance().fireEvent(new Lich.PointedAreaEventPayload(clsn.x, clsn.y, clsn.hit, clsn.partOffsetX, clsn.partOffsetY, typ, sector ? sector.map_x : null, sector ? sector.map_y : null));
        };
        ;
        World.prototype.checkReach = function (character, x, y, inTiles) {
            if (inTiles === void 0) { inTiles = false; }
            // dosahem omezená akce -- musí se počítat v tiles, aby nedošlo ke kontrole 
            // na pixel vzdálenost, která je ok, ale při změně cílové tile se celková 
            // změna projeví i na pixel místech, kde už je například kolize
            var characterCoordTL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.collYOffset);
            var characterCoordTR = this.render.pixelsToEvenTiles(character.x + character.width - character.collXOffset, character.y + character.collYOffset);
            var characterCoordBR = this.render.pixelsToEvenTiles(character.x + character.width - character.collXOffset, character.y + character.height - character.collYOffset);
            var characterCoordBL = this.render.pixelsToEvenTiles(character.x + character.collXOffset, character.y + character.height - character.collYOffset);
            var coord = inTiles ? new Lich.Coord2D(Lich.Utils.even(x), Lich.Utils.even(y)) : this.render.pixelsToEvenTiles(x, y);
            // kontroluj rádius od každého rohu
            var inReach = Lich.Utils.distance(coord.x, coord.y, characterCoordTL.x, characterCoordTL.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(coord.x, coord.y, characterCoordTR.x, characterCoordTR.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(coord.x, coord.y, characterCoordBR.x, characterCoordBR.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(coord.x, coord.y, characterCoordBL.x, characterCoordBL.y) < Lich.Resources.REACH_TILES_RADIUS;
            return new ReachInfo(coord, characterCoordTL, characterCoordTR, characterCoordBR, characterCoordBL, inReach);
        };
        World.prototype.handleTick = function (delta) {
            var self = this;
            self.render.handleTick();
            self.game.getBackground().handleTick(delta);
            self.hero.handleTick(delta);
            self.enemies.forEach(function (enemy) {
                if (enemy)
                    enemy.handleTick(delta);
            });
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
            // Spawn TODO
            //SpawnPool.getInstance().update(delta, self);
        };
        ;
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
        return World;
    }(createjs.Container));
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
