var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * world.js
 *
 * Stará se o interakce ve světě
 *
 */
var Lich;
(function (Lich) {
    var AbstractWorldObject = (function (_super) {
        __extends(AbstractWorldObject, _super);
        function AbstractWorldObject(width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset) {
            _super.call(this, spriteSheet, initState);
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.initState = initState;
            this.stateAnimation = stateAnimation;
            this.collXOffset = collXOffset;
            this.collYOffset = collYOffset;
            this.speedx = 0;
            this.speedy = 0;
        }
        AbstractWorldObject.prototype.performState = function (desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(self.stateAnimation[desiredState]);
                self.state = desiredState;
            }
        };
        AbstractWorldObject.prototype.updateAnimations = function () { };
        ;
        return AbstractWorldObject;
    }(createjs.Sprite));
    Lich.AbstractWorldObject = AbstractWorldObject;
    var BulletObject = (function (_super) {
        __extends(BulletObject, _super);
        function BulletObject(width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset, done) {
            _super.call(this, width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.initState = initState;
            this.stateAnimation = stateAnimation;
            this.collXOffset = collXOffset;
            this.collYOffset = collYOffset;
            this.done = done;
        }
        ;
        return BulletObject;
    }(AbstractWorldObject));
    var WorldObject = (function (_super) {
        __extends(WorldObject, _super);
        function WorldObject(item, width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset, notificationTimer) {
            _super.call(this, width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
            this.item = item;
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.initState = initState;
            this.stateAnimation = stateAnimation;
            this.collXOffset = collXOffset;
            this.collYOffset = collYOffset;
            this.notificationTimer = notificationTimer;
        }
        ;
        return WorldObject;
    }(AbstractWorldObject));
    var CollisionTestResult = (function () {
        function CollisionTestResult(hit, x, y) {
            this.hit = hit;
            this.x = x;
            this.y = y;
        }
        return CollisionTestResult;
    }());
    var World = (function (_super) {
        __extends(World, _super);
        function World(game) {
            _super.call(this);
            this.game = game;
            /*-----------*/
            /* VARIABLES */
            /*-----------*/
            this.freeObjects = Array();
            this.bulletObjects = Array();
            // kolikrát ms se čeká, než se bude počítat další klik při mouse down?
            this.spellTime = World.MOUSE_COOLDOWN;
            var self = this;
            self.map = new Lich.Map(game.resources);
            self.tilesMap = self.map.tilesMap;
            self.render = new Lich.Render(game, self.map, self);
            self.background = new Lich.Background(game);
            self.hero = new Lich.Hero(game);
            /*------------*/
            /* Characters */
            /*------------*/
            self.addChild(self.hero);
            self.hero.x = game.canvas.width / 2;
            self.hero.y = game.canvas.height / 2;
            self.render.updatePlayerIcon(self.hero.x, self.hero.y);
            /*---------*/
            /* Enemies */
            /*---------*/
            self.enemies = new Array();
            var numberOfEnemies = 1;
            for (var i = 0; i < numberOfEnemies; i++) {
                var enemy = new Lich.Enemy(game);
                self.enemies.push(enemy);
                self.addChild(enemy);
                enemy.x = game.canvas.width * Math.random();
                enemy.y = game.canvas.height / 2 * Math.random();
            }
            /*---------------------*/
            /* Measurements, debug */
            /*---------------------*/
            self.tilesLabel = new Lich.Label("TILES x: - y: -", "15px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            game.debugUI.addNextChild(self.tilesLabel);
            self.sectorLabel = new Lich.Label("SECTOR: -", "15px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            game.debugUI.addNextChild(self.sectorLabel);
            self.playerLabel = new Lich.Label("PLAYER x: - y: -", "15px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            game.debugUI.addNextChild(self.playerLabel);
            // light test
            /*
            var bitmap = self.game.resources.getBitmap(Resources.DARKNESS_KEY);
            bitmap.x = game.canvas.width / 2 - bitmap.image.width / 2;
            bitmap.y = game.canvas.height / 2 - bitmap.image.height / 2;
            self.addChild(bitmap);
            */
            /*------------*/
            /* Dig events */
            /*------------*/
            var digListener = function (objType, x, y) {
                if (typeof objType.item !== "undefined") {
                    for (var i = 0; i < objType.item.quant; i++) {
                        var image = game.resources.getImage(objType.item.invObj);
                        var spriteSheet = new createjs.SpriteSheet({
                            framerate: 10,
                            "images": [image],
                            "frames": {
                                "regX": 0,
                                "height": image.height,
                                "count": 1,
                                "regY": 0,
                                "width": image.width
                            },
                            "animations": {
                                "idle": [0, 0, "idle", 0.005]
                            }
                        });
                        var object = new WorldObject(objType.item, image.width, image.height, spriteSheet, "idle", { "idle": "idle" }, 2, 0, World.OBJECT_NOTIFY_TIME);
                        object.speedx = 0;
                        object.speedy = (Math.random() * 2 + 1) * World.OBJECT_NOTIFY_BOUNCE_SPEED;
                        var coord = self.render.tilesToPixel(x, y);
                        object.x = coord.x + 10 - Math.random() * 20;
                        object.y = coord.y;
                        self.freeObjects.push(object);
                        self.addChild(object);
                    }
                }
            };
            self.render.addOnDigSurfaceListener(digListener);
            self.render.addOnDigObjectListener(digListener);
            console.log("earth ready");
        }
        World.prototype.updateBullet = function (sDelta, object, makeShiftX, makeShiftY, onCollision) {
            var self = this;
            if (object === null || object.done)
                return;
            var clsnTest;
            if (object.speedy !== 0) {
                var distanceY = object.speedy * sDelta;
                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, distanceY, function (x, y) { return self.isEnemyHitOrCollision(x, y); });
                if (clsnTest.hit === false) {
                    makeShiftY(distanceY);
                }
                else {
                    onCollision(clsnTest);
                    return;
                }
            }
            if (object.speedx !== 0) {
                var distanceX = sDelta * object.speedx;
                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, distanceX, 0, function (x, y) { return self.isEnemyHitOrCollision(x, y); });
                if (clsnTest.hit === false) {
                    makeShiftX(distanceX);
                }
                else {
                    onCollision(clsnTest);
                    return;
                }
            }
        };
        ;
        World.prototype.updateObject = function (sDelta, object, makeShiftX, makeShiftY) {
            var self = this;
            var clsnTest;
            var clsnPosition;
            if (object.speedy !== 0) {
                // dráha, kterou objekt urazil za daný časový úsek, 
                // kdy je známa jeho poslední rychlost a zrychlení, 
                // které na něj za daný časový úsek působilo:
                // s_t = vt + 1/2.at^2
                var distanceY = Lich.Utils.floor(object.speedy * sDelta + World.WORLD_GRAVITY * Math.pow(sDelta, 2) / 2);
                // uprav rychlost objektu, která se dá spočítat jako: 
                // v = v_0 + at
                object.speedy = object.speedy + World.WORLD_GRAVITY * sDelta;
                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, distanceY, function (x, y) { return self.isCollision(x, y); });
                if (clsnTest.hit === false) {
                    makeShiftY(distanceY);
                }
                else {
                    // zastavil jsem se při stoupání? Začni hned padat
                    if (distanceY > 0) {
                        object.speedy = 0;
                    }
                    else {
                        // "doskoč" až na zem
                        // získej pozici kolizního bloku
                        clsnPosition = self.render.tilesToPixel(clsnTest.x, clsnTest.y);
                        makeShiftY(-1 * (clsnPosition.y - (object.y + object.height - object.collYOffset)));
                        object.speedy = 0;
                    }
                }
            }
            if (object.speedx !== 0) {
                var distanceX = Lich.Utils.floor(sDelta * object.speedx);
                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, distanceX, 0, function (x, y) { return self.isCollision(x, y); });
                if (clsnTest.hit === false) {
                    makeShiftX(distanceX);
                }
                else {
                    // získej pozici kolizního bloku
                    clsnPosition = self.render.tilesToPixel(clsnTest.x, clsnTest.y);
                    if (distanceX > 0) {
                        // narazil jsem do něj zprava
                        makeShiftX(object.x + object.collXOffset - (clsnPosition.x + Lich.Resources.TILE_SIZE) - 1);
                    }
                    else {
                        // narazil jsem do něj zleva
                        makeShiftX(-1 * (clsnPosition.x - (object.x + object.width - object.collXOffset) - 1));
                    }
                }
            }
            // pokud nejsem zrovna uprostřed skoku...
            if (object.speedy === 0) {
                // ...a mám kam padat
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset, object.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, -1, function (x, y) { return self.isCollision(x, y); });
                if (clsnTest.hit === false) {
                    object.speedy = -1;
                }
            }
            if (typeof object.updateAnimations !== "undefined") {
                object.updateAnimations();
            }
        };
        ;
        World.prototype.update = function (delta, directions) {
            var self = this;
            var sDelta = delta / 1000; // ms -> s
            // AI Enemies
            self.enemies.forEach(function (enemy) {
                if (enemy.life > 0) {
                    if (enemy.x > self.hero.x && enemy.x < self.hero.x + self.hero.width - self.hero.collXOffset) {
                        enemy.speedx = 0;
                    }
                    else {
                        if (self.hero.x > enemy.x) {
                            enemy.speedx = -World.HERO_HORIZONTAL_SPEED / 1.5;
                            if (self.isCollision(enemy.x + enemy.width - enemy.collXOffset, enemy.y).hit == false && enemy.speedy == 0) {
                                enemy.speedy = World.HERO_VERTICAL_SPEED;
                            }
                        }
                        else {
                            enemy.speedx = World.HERO_HORIZONTAL_SPEED / 1.5;
                            if (self.isCollision(enemy.x, enemy.y).hit == false && enemy.speedy == 0) {
                                enemy.speedy = World.HERO_VERTICAL_SPEED;
                            }
                        }
                    }
                    if (directions.up2) {
                        enemy.hit(5, self.game);
                    }
                }
            });
            // Dle kláves nastav rychlosti
            // Nelze akcelerovat nahoru, když už 
            // rychlost mám (nemůžu skákat ve vzduchu)
            if (directions.up && self.hero.speedy === 0) {
                self.hero.speedy = World.HERO_VERTICAL_SPEED;
            }
            else if (directions.down) {
                self.hero.speedy = World.HERO_VERTICAL_SPEED;
            }
            // Horizontální akcelerace
            if (directions.left) {
                self.hero.speedx = World.HERO_HORIZONTAL_SPEED;
            }
            else if (directions.right) {
                self.hero.speedx = -World.HERO_HORIZONTAL_SPEED;
            }
            else {
                self.hero.speedx = 0;
            }
            var makeShiftX = function (dst) {
                var rndDst = Lich.Utils.floor(dst);
                var canvasCenterX = self.game.canvas.width / 2;
                if (self.render.canShiftX(rndDst) && self.hero.x == canvasCenterX) {
                    // pokud je možné scénu posunout a hráč je uprostřed obrazovky, 
                    // posuň všechno co na ní je až na hráče (ten zůstává uprostřed)               
                    self.render.shiftX(rndDst);
                    self.background.shift(rndDst, 0);
                    self.freeObjects.forEach(function (item) {
                        item.x += rndDst;
                    });
                    self.bulletObjects.forEach(function (item) {
                        item.x += rndDst;
                    });
                    self.enemies.forEach(function (enemy) {
                        enemy.x += rndDst;
                    });
                }
                else {
                    // Scéna se nehýbe (je v krajních pozicích) posuň tedy jenom hráče
                    // Zabraňuje přeskakování středu, na který jsou vztažené kontroly
                    if (self.hero.x > canvasCenterX && self.hero.x - rndDst < canvasCenterX
                        || self.hero.x < canvasCenterX && self.hero.x - rndDst > canvasCenterX) {
                        self.hero.x = canvasCenterX;
                    }
                    else {
                        self.hero.x -= rndDst;
                    }
                }
            };
            var makeShiftY = function (dst) {
                var rndDst = Lich.Utils.floor(dst);
                var canvasCenterY = self.game.canvas.height / 2;
                if (self.render.canShiftY(rndDst) && self.hero.y == canvasCenterY) {
                    // pokud je možné scénu posunout a hráč je uprostřed obrazovky, 
                    // posuň všechno co na ní je až na hráče (ten zůstává uprostřed)               
                    self.render.shiftY(rndDst);
                    self.background.shift(0, rndDst);
                    self.freeObjects.forEach(function (item) {
                        item.y += rndDst;
                    });
                    self.bulletObjects.forEach(function (item) {
                        item.y += rndDst;
                    });
                    self.enemies.forEach(function (enemy) {
                        enemy.y += rndDst;
                    });
                }
                else {
                    // Scéna se nehýbe (je v krajních pozicích) posuň tedy jenom hráče
                    // Zabraňuje přeskakování středu, na který jsou vztažené kontroly
                    if (self.hero.y > canvasCenterY && self.hero.y - rndDst < canvasCenterY
                        || self.hero.y < canvasCenterY && self.hero.y - rndDst > canvasCenterY) {
                        self.hero.y = canvasCenterY;
                    }
                    else {
                        self.hero.y -= rndDst;
                    }
                }
            };
            // update hráče
            self.updateObject(sDelta, self.hero, makeShiftX, makeShiftY);
            self.enemies.forEach(function (enemy) {
                // update nepřátel
                self.updateObject(sDelta, enemy, function (dst) {
                    var rndDst = Lich.Utils.floor(dst);
                    enemy.x -= rndDst;
                }, function (dst) {
                    var rndDst = Lich.Utils.floor(dst);
                    enemy.y -= rndDst;
                });
            });
            // update projektilů
            (function () {
                var deleteBullet = function (object) {
                    self.bulletObjects.splice(i, 1);
                    self.removeChild(object);
                };
                for (var i = 0; i < self.bulletObjects.length; i++) {
                    var object = self.bulletObjects[i];
                    self.updateBullet(sDelta, object, function (x) {
                        object.x -= x;
                        if (object.x > self.game.canvas.width * 2 || object.x < -self.game.canvas.width)
                            deleteBullet(object);
                    }, function (y) {
                        object.y -= y;
                        if (object.y > self.game.canvas.height * 2 || object.y < -self.game.canvas.height)
                            deleteBullet(object);
                    }, function (clsn) {
                        if (object.done === false) {
                            Lich.Mixer.play(Lich.Resources.SND_BURN_KEY, false, 0.1);
                            object.done = true;
                            object.gotoAndPlay("hit");
                            var centX = object.x + object.width / 2;
                            var centY = object.y + object.height / 2;
                            var rad = Lich.Resources.TILE_SIZE * 4;
                            for (var rx = centX - rad; rx <= centX + rad; rx += Lich.Resources.TILE_SIZE) {
                                for (var ry = centY - rad; ry <= centY + rad; ry += Lich.Resources.TILE_SIZE) {
                                    var r2 = Math.pow(centX - rx, 2) + Math.pow(centY - ry, 2);
                                    var d2 = Math.pow(rad, 2);
                                    if (r2 <= d2) {
                                        self.render.dig(rx, ry);
                                    }
                                }
                            }
                        }
                    });
                    if (object.currentAnimation === "done") {
                        deleteBullet(object);
                    }
                }
            })();
            // update sebratelných objektů
            (function () {
                for (var i = 0; i < self.freeObjects.length; i++) {
                    var object = self.freeObjects[i];
                    // pohni objekty
                    self.updateObject(sDelta, object, function (x) {
                        object.x -= x;
                    }, function (y) {
                        object.y -= y;
                    });
                    var heroCenterX = self.hero.x + self.hero.width / 2;
                    var heroCenterY = self.hero.y + self.hero.height / 2;
                    var itemCenterX = object.x + object.width / 2;
                    var itemCenterY = object.y + object.height / 2;
                    // zjisti, zda hráč objekt nesebral
                    if (Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < World.OBJECT_PICKUP_DISTANCE) {
                        self.game.ui.inventoryUI.invInsert(object.item.invObj, 1);
                        self.freeObjects.splice(i, 1);
                        self.removeChild(object);
                        Lich.Mixer.play(Lich.Resources.SND_PICK_KEY, false, 0.2);
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
            })();
        };
        ;
        /**
         * Zjistí zda na daných pixel-souřadnicích dochází k zásahu nepřítele
         */
        World.prototype.isEnemyHitOrCollision = function (x, y) {
            var self = this;
            var enemyRet = null;
            self.enemies.forEach(function (enemy) {
                if (enemy.life > 0
                    && x > enemy.x && x < enemy.x + enemy.width
                    && y > enemy.y && y < enemy.y + enemy.height) {
                    enemyRet = new CollisionTestResult(true, x, y);
                    // TODO damage dle bullet
                    enemy.hit(20, self.game);
                }
            });
            if (enemyRet == null) {
                return self.isCollision(x, y);
            }
            else {
                return enemyRet;
            }
        };
        ;
        /**
         * Zjistí zda na daných pixel-souřadnicích dochází ke kolizi
         */
        World.prototype.isCollision = function (x, y) {
            var self = this;
            var result = self.render.pixelsToTiles(x, y);
            return self.isCollisionByTiles(result.x, result.y);
        };
        ;
        /**
         * Zjistí zda na daných tile-souřadnicích dochází ke kolizi
         */
        World.prototype.isCollisionByTiles = function (x, y) {
            var self = this;
            // kolize s povrchem/hranicí mapy
            if (self.tilesMap.valueAt(x, y) != 0) {
                return new CollisionTestResult(true, x, y);
            }
            // bez kolize
            return new CollisionTestResult(false, x, y);
        };
        ;
        /**
         * Zjistí zda dojde ke kolizi, když se z aktuálních pixel-souřadnic posunu o nějakou
         * vzdálenost. Započítává velikost celého objektu tak, aby nebyla v kolizi ani jedna
         * jeho hrana. Bere v potaz, že se při posunu o danou vzdálenost objekt neteleportuje,
         * ale postupně posouvá, takže kontroluje celý interval mezi aktuální polohou a cílem.
         */
        World.prototype.isBoundsInCollision = function (x, y, fullWidth, fullHeight, fullXShift, fullYShift, collisionTester) {
            var self = this;
            var tx;
            var ty;
            // kolize se musí dělat iterativně pro každý bod v TILE_SIZE podél hran objektu
            var xShift = 0;
            var yShift = 0;
            var width = 0;
            var height = 0;
            var xSign = Lich.Utils.sign(fullXShift);
            var ySign = Lich.Utils.sign(fullYShift);
            // pokud bude zadán fullXShift i fullYShift, udělá to diagonální posuv
            while (xShift !== fullXShift || yShift !== fullYShift) {
                if (xSign * (xShift + xSign * Lich.Resources.TILE_SIZE) > xSign * fullXShift) {
                    xShift = fullXShift;
                }
                else {
                    xShift += xSign * Lich.Resources.TILE_SIZE;
                }
                if (ySign * (yShift + ySign * Lich.Resources.TILE_SIZE) > ySign * fullYShift) {
                    yShift = fullYShift;
                }
                else {
                    yShift += ySign * Lich.Resources.TILE_SIZE;
                }
                width = 0;
                while (width !== fullWidth) {
                    if (width + Lich.Resources.TILE_SIZE > fullWidth) {
                        width = fullWidth;
                    }
                    else {
                        width += Lich.Resources.TILE_SIZE;
                    }
                    height = 0;
                    while (height !== fullHeight) {
                        if (height + Lich.Resources.TILE_SIZE > fullHeight) {
                            height = fullHeight;
                        }
                        else {
                            height += Lich.Resources.TILE_SIZE;
                        }
                        if (xShift > 0 || yShift > 0) {
                            tx = x - xShift;
                            ty = y - yShift;
                            var LT = collisionTester(tx, ty);
                            if (LT.hit)
                                return LT;
                        }
                        if (xShift < 0 || yShift > 0) {
                            tx = x + width - xShift;
                            ty = y - yShift;
                            var RT = collisionTester(tx, ty);
                            if (RT.hit)
                                return RT;
                        }
                        if (xShift > 0 || yShift < 0) {
                            tx = x - xShift;
                            ty = y + height - yShift;
                            var LB = collisionTester(tx, ty);
                            if (LB.hit)
                                return LB;
                        }
                        if (xShift < 0 || yShift < 0) {
                            tx = x + width - xShift;
                            ty = y + height - yShift;
                            var RB = collisionTester(tx, ty);
                            if (RB.hit)
                                return RB;
                        }
                        if (xShift === fullXShift && yShift === fullYShift && width === fullWidth && height === fullHeight) {
                            return new CollisionTestResult(false);
                        }
                    }
                }
            }
            return new CollisionTestResult(false);
        };
        ;
        World.prototype.spell = function (targetX, targetY) {
            var self = this;
            var BLAST_SPEED = 1500;
            var heroCenterX = self.hero.x + self.hero.width / 2;
            var heroCenterY = self.hero.y + self.hero.height / 2;
            var b = targetX - heroCenterX;
            var a = targetY - heroCenterY;
            var c = Math.sqrt(a * a + b * b);
            var blastSheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [self.game.resources.getImage(Lich.Resources.BLAST_ANIMATION_KEY)],
                "frames": {
                    "regX": 0,
                    "height": 60,
                    "count": 5,
                    "regY": 0,
                    "width": 60
                },
                "animations": {
                    "fly": [0, 0, "fly", 1],
                    "hit": [1, 4, "done", 0.3],
                    "done": [4, 4, "done", 1]
                }
            });
            var object = new BulletObject(60, 60, blastSheet, "fly", {
                "fly": "fly",
                "hit": "hit",
                "done": "done"
            }, 20, 20, false);
            object.speedx = -BLAST_SPEED * b / c;
            object.speedy = -BLAST_SPEED * a / c;
            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            self.bulletObjects.push(object);
            self.addChild(object);
            object.x = heroCenterX - object.width / 2;
            object.y = heroCenterY - object.height / 2;
            Lich.Mixer.play(Lich.Resources.SND_FIREBALL_KEY, false, 0.2);
        };
        ;
        World.prototype.handleMouse = function (mouse, delta) {
            var self = this;
            self.spellTime -= delta;
            if (self.spellTime <= 0 && (mouse.down || mouse.click)) {
                mouse.click = false;
                // dosahem omezené akce -- musí se počítat v tiles, aby nedošlo ke kontrole 
                // na pixel vzdálenost, která je ok, ale při změně cílové tile se celková 
                // změna projeví i na pixel místech, kde už je například kolize
                var hero = self.hero;
                var heroCoordTL = self.render.pixelsToEvenTiles(hero.x + hero.collXOffset, hero.y + hero.collYOffset);
                var heroCoordTR = self.render.pixelsToEvenTiles(hero.x + hero.width - hero.collXOffset, hero.y + hero.collYOffset);
                var heroCoordBR = self.render.pixelsToEvenTiles(hero.x + hero.width - hero.collXOffset, hero.y + hero.height - hero.collYOffset);
                var heroCoordBL = self.render.pixelsToEvenTiles(hero.x + hero.collXOffset, hero.y + hero.height - hero.collYOffset);
                var mouseCoord = self.render.pixelsToEvenTiles(mouse.x, mouse.y);
                // kontroluj rádius od každého rohu
                if (Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTL.x, heroCoordTL.y) < Lich.Resources.REACH_TILES_RADIUS
                    || Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTR.x, heroCoordTR.y) < Lich.Resources.REACH_TILES_RADIUS
                    || Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBR.x, heroCoordBR.y) < Lich.Resources.REACH_TILES_RADIUS
                    || Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBL.x, heroCoordBL.y) < Lich.Resources.REACH_TILES_RADIUS) {
                    if (self.game.ui.spellsUI.choosenItem === Lich.Resources.SPELL_DIG_KEY) {
                        if (self.render.dig(mouse.x, mouse.y)) {
                            Lich.Mixer.play(Lich.Resources["SND_PICK_AXE_" + (Math.floor(Math.random() * 3) + 1) + "_KEY"]);
                        }
                    }
                    else if (self.game.ui.spellsUI.choosenItem === Lich.Resources.SPELL_PLACE_KEY) {
                        // nemůžu pokládat do prostoru, kde stojím
                        var uiItem = self.game.ui.inventoryUI.choosenItem;
                        if ((mouseCoord.x > heroCoordBR.x || mouseCoord.x < heroCoordTL.x ||
                            mouseCoord.y > heroCoordBR.y || mouseCoord.y < heroCoordTL.y) &&
                            self.render.place(mouse.x, mouse.y, uiItem)) {
                            Lich.Mixer.play(Lich.Resources.SND_PLACE_KEY);
                            self.game.ui.inventoryUI.decrease(uiItem, 1);
                        }
                    }
                }
                // dosahem neomezené akce
                if (self.game.ui.spellsUI.choosenItem === Lich.Resources.SPELL_FIREBALL_KEY) {
                    self.spell(mouse.x, mouse.y);
                }
                self.spellTime = World.MOUSE_COOLDOWN;
            }
            var coord = self.render.pixelsToTiles(mouse.x, mouse.y);
            var clsn = self.isCollisionByTiles(coord.x, coord.y);
            var index = self.tilesMap.indexAt(coord.x, coord.y);
            var typ = self.tilesMap.mapRecord[index];
            if (typeof self.tilesLabel !== "undefined") {
                self.tilesLabel.setText("TILES x: " + clsn.x + " y: " + clsn.y + " clsn: " + clsn.hit + " index: " + index + " type: " + typ);
            }
            var sector = self.render.getSectorByTiles(coord.x, coord.y);
            if (typeof self.sectorLabel !== "undefined") {
                if (typeof sector !== "undefined" && sector !== null) {
                    self.sectorLabel.setText("SECTOR: x: " + sector.map_x + " y: " + sector.map_y);
                }
                else {
                    self.sectorLabel.setText("SECTOR: -");
                }
            }
        };
        ;
        World.prototype.handleTick = function (delta) {
            var self = this;
            self.render.handleTick();
            self.background.handleTick(delta);
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
        // Pixel/s
        World.HERO_HORIZONTAL_SPEED = 300;
        World.HERO_VERTICAL_SPEED = 500;
        // Pixel/s2
        World.WORLD_GRAVITY = -1200;
        World.MOUSE_COOLDOWN = 100;
        return World;
    }(createjs.Container));
    Lich.World = World;
})(Lich || (Lich = {}));
