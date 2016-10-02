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
    }(Lich.AbstractWorldObject));
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
            this.enemies = new Array();
            var self = this;
            self.map = new Lich.GameMap();
            self.tilesMap = self.map.tilesMap;
            self.render = new Lich.Render(game, self.map, self);
            self.background = new Lich.Background(game);
            self.hero = new Lich.Hero(game);
            /*------------*/
            /* Characters */
            /*------------*/
            self.addChild(self.hero);
            self.hero.x = game.getCanvas().width / 2;
            self.hero.y = game.getCanvas().height / 2;
            self.render.updatePlayerIcon(self.hero.x, self.hero.y);
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
                        var invDef = Lich.Resources.getInstance().invObjectDefs[objType.invObj];
                        var frames = 1;
                        if (typeof invDef === "undefined" || invDef == null) {
                            frames = 1;
                        }
                        else {
                            frames = invDef.frames;
                        }
                        var image = Lich.Resources.getInstance().getImage(Lich.InventoryKey[objType.item.invObj]);
                        var object = new WorldObject(objType.item, image.width / frames, // aby se nepoužila délka všech snímků vedle sebe
                        image.height, Lich.Resources.getInstance().getSpriteSheet(Lich.InventoryKey[objType.invObj], frames), "idle", { "idle": "idle" }, 2, 0, World.OBJECT_NOTIFY_TIME);
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
                if (enemy.getCurrentHealth() > 0) {
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
                var canvasCenterX = self.game.getCanvas().width / 2;
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
                var canvasCenterY = self.game.getCanvas().height / 2;
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
            })();
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
            var val = self.tilesMap.mapRecord.getValue(x, y);
            if (val == null || val != 0) {
                return new Lich.CollisionTestResult(true, x, y);
            }
            // kolize s kolizními objekty
            var objectElement = self.tilesMap.mapObjectsTiles.getValue(x, y);
            if (objectElement !== null) {
                var objType = Lich.Resources.getInstance().mapObjectDefs[objectElement.mapKey];
                if (objType.collision)
                    return new Lich.CollisionTestResult(true, x, y);
            }
            // bez kolize
            return new Lich.CollisionTestResult(false, x, y);
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
                            return new Lich.CollisionTestResult(false);
                        }
                    }
                }
            }
            return new Lich.CollisionTestResult(false);
        };
        ;
        World.prototype.handleMouse = function (mouse, delta) {
            var self = this;
            // je prováděna interakce s objektem?
            if (mouse.rightDown) {
                var rmbSpellDef = Lich.Resources.getInstance().interactSpellDef;
                // Může se provést (cooldown je pryč)?
                var rmbCooldown = self.hero.spellCooldowns[Lich.SpellKey.SPELL_INTERACT_KEY];
                if (!rmbCooldown || rmbCooldown <= 0) {
                    var heroCenterX = self.hero.x + self.hero.width / 2;
                    var heroCenterY = self.hero.y + self.hero.height / 4;
                    // zkus cast
                    if (rmbSpellDef.cast(Lich.Hero.OWNER_HERO_TAG, heroCenterX, heroCenterY, mouse.x, mouse.y, self.game)) {
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
                    if (spellDef.cast(Lich.Hero.OWNER_HERO_TAG, heroCenterX_1, heroCenterY_1, mouse.x, mouse.y, self.game)) {
                        // ok, cast se provedl, nastav nový cooldown a odeber will
                        self.hero.spellCooldowns[choosenSpell] = spellDef.cooldown;
                        self.hero.decreseWill(spellDef.cost);
                    }
                }
            }
            var coord = self.render.pixelsToTiles(mouse.x, mouse.y);
            var clsn = self.isCollisionByTiles(coord.x, coord.y);
            var typ = self.tilesMap.mapRecord.getValue(coord.x, coord.y);
            var sector = self.render.getSectorByTiles(coord.x, coord.y);
            Lich.EventBus.getInstance().fireEvent(new Lich.PointedAreaEventPayload(clsn.x, clsn.y, clsn.hit, typ, sector ? sector.map_x : null, sector ? sector.map_y : null));
        };
        ;
        World.prototype.handleTick = function (delta) {
            var self = this;
            self.render.handleTick();
            self.background.handleTick(delta);
            self.hero.handleTick(delta);
            self.enemies.forEach(function (enemy) {
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
        return World;
    }(createjs.Container));
    Lich.World = World;
})(Lich || (Lich = {}));
