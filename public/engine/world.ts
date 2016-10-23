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
            public stateAnimation: Object,
            public collXOffset: number,
            public collYOffset: number,
            public notificationTimer: number) {
            super(width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
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

        // Pixel/s
        static HERO_HORIZONTAL_SPEED = 300;
        static HERO_VERTICAL_SPEED = 500;

        // Pixel/s2
        static WORLD_GRAVITY = -1200;
        static MAX_FREEFALL_SPEED = -1200;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        freeObjects = Array<WorldObject>();
        bulletObjects = Array<BulletObject>();

        render: Render;
        hero: Hero;

        enemies = new Array<Enemy>();

        constructor(public game: Game, public tilesMap: TilesMap) {
            super();

            var self = this;

            self.render = new Render(game, self);
            self.hero = new Hero();

            /*------------*/
            /* Characters */
            /*------------*/
            self.addChild(self.hero);
            self.hero.x = game.getCanvas().width / 2;
            self.hero.y = game.getCanvas().height / 2;

            /*------------*/
            /* Dig events */
            /*------------*/
            var digListener = function (objType: Diggable, x: number, y: number) {
                if (typeof objType.item !== "undefined") {
                    for (var i = 0; i < objType.item.quant; i++) {
                        var invDef: InvObjDefinition = Resources.getInstance().invObjectDefs[objType.invObj];
                        var frames = 1;
                        if (typeof invDef === "undefined" || invDef == null) {
                            frames = 1;
                        } else {
                            frames = invDef.frames;
                        }
                        var image = Resources.getInstance().getImage(InventoryKey[objType.item.invObj]);
                        var object = new WorldObject(
                            objType.item,
                            image.width / frames, // aby se nepoužila délka všech snímků vedle sebe
                            image.height,
                            Resources.getInstance().getSpriteSheet(InventoryKey[objType.invObj], frames),
                            "idle",
                            { "idle": "idle" },
                            2,
                            0,
                            World.OBJECT_NOTIFY_TIME);
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


        updateObject(sDelta: number, object: AbstractWorldObject, makeShiftX: (number) => any, makeShiftY: (number) => any) {
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
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    distanceY,
                    function (x: number, y: number) { return self.isCollision(x, y); }
                );
                if (clsnTest.hit === false) {
                    makeShiftY(distanceY);
                } else {
                    // zastavil jsem se při stoupání? Začni hned padat
                    if (distanceY > 0) {
                        object.speedy = 0;
                    }
                    // zastavil jsem se při pádu? Konec skoku
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
                var distanceX = Utils.floor(sDelta * object.speedx);

                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    distanceX,
                    0,
                    function (x: number, y: number) { return self.isCollision(x, y); }
                );
                if (clsnTest.hit === false) {
                    makeShiftX(distanceX);
                }
                // zkus zmenšit posun, aby nebyla kolize
                else {
                    // získej pozici kolizního bloku
                    clsnPosition = self.render.tilesToPixel(clsnTest.x, clsnTest.y);
                    if (distanceX > 0) {
                        // narazil jsem do něj zprava
                        makeShiftX(object.x + object.collXOffset - (clsnPosition.x + Resources.TILE_SIZE) - 1);
                    } else {
                        // narazil jsem do něj zleva
                        makeShiftX(-1 * (clsnPosition.x - (object.x + object.width - object.collXOffset) - 1));
                    }
                }
            }

            // pokud nejsem zrovna uprostřed skoku...
            if (object.speedy === 0) {
                // ...a mám kam padat
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    -1,
                    function (x: number, y: number) { return self.isCollision(x, y); }
                );
                if (clsnTest.hit === false) {
                    object.speedy = -1;
                }
            }

            if (typeof object.updateAnimations !== "undefined") {
                object.updateAnimations();
            }

        };

        update(delta, directions) {
            var self = this;
            var sDelta = delta / 1000; // ms -> s

            // AI Enemies
            self.enemies.forEach(function (enemy) {
                enemy.runAI(self, delta);
            });

            // Dle kláves nastav rychlosti
            // Nelze akcelerovat nahoru, když už 
            // rychlost mám (nemůžu skákat ve vzduchu)
            if (directions.up && self.hero.speedy === 0) {
                self.hero.speedy = World.HERO_VERTICAL_SPEED;
            } else if (directions.down) {
                self.hero.speedy = World.HERO_VERTICAL_SPEED;
            }

            // Horizontální akcelerace
            if (directions.left) {
                self.hero.speedx = World.HERO_HORIZONTAL_SPEED;
            } else if (directions.right) {
                self.hero.speedx = -World.HERO_HORIZONTAL_SPEED;
            } else {
                self.hero.speedx = 0;
            }

            var makeShiftX = function (dst) {
                var rndDst = Utils.floor(dst);
                var canvasCenterX = self.game.getCanvas().width / 2;
                if (self.render.canShiftX(rndDst) && self.hero.x == canvasCenterX) {
                    // pokud je možné scénu posunout a hráč je uprostřed obrazovky, 
                    // posuň všechno co na ní je až na hráče (ten zůstává uprostřed)               
                    self.render.shiftX(rndDst);
                    self.game.getBackground().shift(rndDst, 0);
                    self.freeObjects.forEach(function (item) {
                        item.x += rndDst;
                    });
                    self.bulletObjects.forEach(function (item) {
                        item.x += rndDst;
                    });
                    self.enemies.forEach(function (enemy) {
                        enemy.x += rndDst;
                    });
                } else {
                    // Scéna se nehýbe (je v krajních pozicích) posuň tedy jenom hráče
                    // Zabraňuje přeskakování středu, na který jsou vztažené kontroly
                    if (self.hero.x > canvasCenterX && self.hero.x - rndDst < canvasCenterX
                        || self.hero.x < canvasCenterX && self.hero.x - rndDst > canvasCenterX) {
                        self.hero.x = canvasCenterX;
                    } else {
                        self.hero.x -= rndDst;
                    }
                }
            };

            var makeShiftY = function (dst) {
                var rndDst = Utils.floor(dst);
                var canvasCenterY = self.game.getCanvas().height / 2;
                if (self.render.canShiftY(rndDst) && self.hero.y == canvasCenterY) {
                    // pokud je možné scénu posunout a hráč je uprostřed obrazovky, 
                    // posuň všechno co na ní je až na hráče (ten zůstává uprostřed)               
                    self.render.shiftY(rndDst);
                    self.game.getBackground().shift(0, rndDst);
                    self.freeObjects.forEach(function (item) {
                        item.y += rndDst;
                    });
                    self.bulletObjects.forEach(function (item) {
                        item.y += rndDst;
                    });
                    self.enemies.forEach(function (enemy) {
                        enemy.y += rndDst;
                    });
                } else {
                    // Scéna se nehýbe (je v krajních pozicích) posuň tedy jenom hráče
                    // Zabraňuje přeskakování středu, na který jsou vztažené kontroly
                    if (self.hero.y > canvasCenterY && self.hero.y - rndDst < canvasCenterY
                        || self.hero.y < canvasCenterY && self.hero.y - rndDst > canvasCenterY) {
                        self.hero.y = canvasCenterY;
                    } else {
                        self.hero.y -= rndDst;
                    }
                }
            };

            // update hráče
            self.updateObject(sDelta, self.hero, makeShiftX, makeShiftY);

            EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.PLAYER_POSITION_CHANGE, self.hero.x, self.hero.y));
            EventBus.getInstance().fireEvent(new TupleEventPayload(EventType.PLAYER_SPEED_CHANGE, self.hero.speedx, self.hero.speedy));

            self.enemies.forEach(function (enemy) {
                // update nepřátel
                self.updateObject(sDelta, enemy,
                    function (dst) {
                        var rndDst = Utils.floor(dst);
                        enemy.x -= rndDst;
                    },
                    function (dst) {
                        var rndDst = Utils.floor(dst);
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
            if (val == null || val != 0) {
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
        isBoundsInCollision(x: number, y: number, fullWidth: number, fullHeight: number, fullXShift: number, fullYShift: number,
            collisionTester: (x: number, y: number) => CollisionTestResult): CollisionTestResult {
            var self = this;
            var tx;
            var ty;

            // kolize se musí dělat iterativně pro každý bod v TILE_SIZE podél hran objektu
            var xShift = 0;
            var yShift = 0;
            var width = 0;
            var height = 0;
            var xSign = Utils.sign(fullXShift);
            var ySign = Utils.sign(fullYShift);

            // pokud bude zadán fullXShift i fullYShift, udělá to diagonální posuv
            while (xShift !== fullXShift || yShift !== fullYShift) {
                if (xSign * (xShift + xSign * Resources.TILE_SIZE) > xSign * fullXShift) {
                    xShift = fullXShift;
                } else {
                    xShift += xSign * Resources.TILE_SIZE;
                }

                if (ySign * (yShift + ySign * Resources.TILE_SIZE) > ySign * fullYShift) {
                    yShift = fullYShift;
                } else {
                    yShift += ySign * Resources.TILE_SIZE;
                }

                width = 0;
                while (width !== fullWidth) {
                    if (width + Resources.TILE_SIZE > fullWidth) {
                        width = fullWidth;
                    } else {
                        width += Resources.TILE_SIZE;
                    }

                    height = 0;
                    while (height !== fullHeight) {
                        if (height + Resources.TILE_SIZE > fullHeight) {
                            height = fullHeight;
                        } else {
                            height += Resources.TILE_SIZE;
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

        handleMouse(mouse: Mouse, delta: number) {
            var self = this;

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