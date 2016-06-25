/**
 * world.js
 * 
 * Stará se o interakce ve světě
 * 
 */
namespace Lich {

    export abstract class AbstractWorldObject extends createjs.Sprite {

        state: string;
        public speedx: number = 0;
        public speedy: number = 0;

        constructor(
            public width: number,
            public height: number,
            public spriteSheet: createjs.SpriteSheet,
            public initState: string,
            public stateAnimation: Object,
            public collXOffset: number,
            public collYOffset: number) {
            super(spriteSheet, initState);
        }

        performState(desiredState: string) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(self.stateAnimation[desiredState]);
                self.state = desiredState;
            }
        }

        updateAnimations() { };

    }

    class BulletObject extends AbstractWorldObject {
        constructor(
            public width: number,
            public height: number,
            public spriteSheet: createjs.SpriteSheet,
            public initState: string,
            public stateAnimation: Object,
            public collXOffset: number,
            public collYOffset: number,
            public done: boolean) {
            super(width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
        };
    }

    class WorldObject extends AbstractWorldObject {
        constructor(
            public item: MapObjItem,
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

    class CollisionTestResult {
        constructor(public hit: boolean, public x?: number, public y?: number) { }
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

        static MOUSE_COOLDOWN = 100;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        freeObjects = Array<WorldObject>();
        bulletObjects = Array<BulletObject>();

        tilesLabel: Label;
        sectorLabel: Label;
        playerLabel: Label;

        // kolikrát ms se čeká, než se bude počítat další klik při mouse down?
        spellTime = World.MOUSE_COOLDOWN;

        map: Map;
        tilesMap: TilesMap;
        render: Render;
        background: Background;
        hero: Hero;

        enemies: Array<Enemy>;

        constructor(public game: Game) {
            super();

            var self = this;

            self.map = new Map(game.resources);
            self.tilesMap = self.map.tilesMap;
            self.render = new Render(game, self.map, self);
            self.background = new Background(game);
            self.hero = new Hero(game);

            // hudba
            Mixer.play(Resources.MSC_DIRT_THEME_KEY, true);

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
            self.enemies = new Array<Enemy>();
            var numberOfEnemies = 1;
            for (var i = 0; i < numberOfEnemies; i++) {
                var enemy = new Enemy(game);
                self.enemies.push(enemy);
                self.addChild(enemy);
                enemy.x = game.canvas.width * Math.random();
                enemy.y = game.canvas.height / 2 * Math.random();
            }

            /*---------------------*/
            /* Measurements, debug */
            /*---------------------*/
            self.tilesLabel = new Label("TILES x: - y: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR);
            game.debugUI.addNextChild(self.tilesLabel);

            self.sectorLabel = new Label("SECTOR: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR);
            game.debugUI.addNextChild(self.sectorLabel);

            self.playerLabel = new Label("PLAYER x: - y: -", "15px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR);
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
            self.render.addOnDigObjectListener(function(objType: MapObjDefinition, x, y) {
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
                                "idle": [0, 0, "idle", 0.005],
                            }
                        });

                        var object = new WorldObject(
                            objType.item,
                            image.width,
                            image.height,
                            spriteSheet,
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
            });

            console.log("earth ready");
        }

        updateBullet(sDelta: number, object: BulletObject, makeShiftX, makeShiftY, onCollision) {
            var self = this;
            if (object === null || object.done)
                return;

            var clsnTest;

            if (object.speedy !== 0) {

                var distanceY = object.speedy * sDelta;

                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    distanceY,
                    function(x: number, y: number) { return self.isEnemyHitOrCollision(x, y); }
                );
                if (clsnTest.hit === false) {
                    makeShiftY(distanceY);
                } else {
                    onCollision(clsnTest);
                    return;
                }
            }

            if (object.speedx !== 0) {
                var distanceX = sDelta * object.speedx;

                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    distanceX,
                    0,
                    function(x: number, y: number) { return self.isEnemyHitOrCollision(x, y); }
                );
                if (clsnTest.hit === false) {
                    makeShiftX(distanceX);
                } else {
                    onCollision(clsnTest);
                    return;
                }
            }
        };

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

                // Nenarazím na překážku?
                clsnTest = self.isBoundsInCollision(
                    object.x + object.collXOffset,
                    object.y + object.collYOffset,
                    object.width - object.collXOffset * 2,
                    object.height - object.collYOffset * 2,
                    0,
                    distanceY,
                    function(x: number, y: number) { return self.isCollision(x, y); }
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
                    function(x: number, y: number) { return self.isCollision(x, y); }
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
                    function(x: number, y: number) { return self.isCollision(x, y); }
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
            self.enemies.forEach(function(enemy) {
                if (enemy.life > 0) {
                    if (enemy.x > self.hero.x && enemy.x < self.hero.x + self.hero.width - self.hero.collXOffset) {
                        enemy.speedx = 0;
                    } else {
                        if (self.hero.x > enemy.x) {
                            enemy.speedx = -World.HERO_HORIZONTAL_SPEED / 1.5;
                            if (self.isCollision(enemy.x + enemy.width - enemy.collXOffset, enemy.y).hit == false && enemy.speedy == 0) {
                                enemy.speedy = World.HERO_VERTICAL_SPEED;
                            }
                        } else {
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
            } else if (directions.down) {
                // TODO
            }

            // Horizontální akcelerace
            if (directions.left) {
                self.hero.speedx = World.HERO_HORIZONTAL_SPEED;
            } else if (directions.right) {
                self.hero.speedx = -World.HERO_HORIZONTAL_SPEED;
            } else {
                self.hero.speedx = 0;
            }

            var makeShiftX = function(dst) {
                var rndDst = Utils.floor(dst);
                var canvasCenterX = self.game.canvas.width / 2;
                if (self.render.canShiftX(rndDst) && self.hero.x == canvasCenterX) {
                    // pokud je možné scénu posunout a hráč je uprostřed obrazovky, 
                    // posuň všechno co na ní je až na hráče (ten zůstává uprostřed)               
                    self.render.shiftX(rndDst);
                    self.background.shift(rndDst, 0);
                    self.freeObjects.forEach(function(item) {
                        item.x += rndDst;
                    });
                    self.bulletObjects.forEach(function(item) {
                        item.x += rndDst;
                    });
                    self.enemies.forEach(function(enemy) {
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

            var makeShiftY = function(dst) {
                var rndDst = Utils.floor(dst);
                var canvasCenterY = self.game.canvas.height / 2;
                if (self.render.canShiftY(rndDst) && self.hero.y == canvasCenterY) {
                    // pokud je možné scénu posunout a hráč je uprostřed obrazovky, 
                    // posuň všechno co na ní je až na hráče (ten zůstává uprostřed)               
                    self.render.shiftY(rndDst);
                    self.background.shift(0, rndDst);
                    self.freeObjects.forEach(function(item) {
                        item.y += rndDst;
                    });
                    self.bulletObjects.forEach(function(item) {
                        item.y += rndDst;
                    });
                    self.enemies.forEach(function(enemy) {
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

            self.enemies.forEach(function(enemy) {
                // update nepřátel
                self.updateObject(sDelta, enemy,
                    function(dst) {
                        var rndDst = Utils.floor(dst);
                        enemy.x -= rndDst;
                    },
                    function(dst) {
                        var rndDst = Utils.floor(dst);
                        enemy.y -= rndDst;
                    });
            });

            // update projektilů
            (function() {

                var deleteBullet = function(object: BulletObject) {
                    self.bulletObjects.splice(i, 1);
                    self.removeChild(object);
                };

                for (var i = 0; i < self.bulletObjects.length; i++) {
                    var object = self.bulletObjects[i];
                    self.updateBullet(sDelta, object, function(x) {
                        object.x -= x;
                        if (object.x > self.game.canvas.width * 2 || object.x < -self.game.canvas.width)
                            deleteBullet(object);
                    }, function(y) {
                        object.y -= y;
                        if (object.y > self.game.canvas.height * 2 || object.y < -self.game.canvas.height)
                            deleteBullet(object);
                    }, function(clsn) {
                        if (object.done === false) {
                            Mixer.play(Resources.SND_BURN_KEY);
                            object.done = true;
                            object.gotoAndPlay("hit");
                            var centX = object.x + object.width / 2;
                            var centY = object.y + object.height / 2;
                            var rad = Resources.TILE_SIZE * 4;
                            for (var rx = centX - rad; rx <= centX + rad; rx += Resources.TILE_SIZE) {
                                for (var ry = centY - rad; ry <= centY + rad; ry += Resources.TILE_SIZE) {
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
            (function() {
                for (var i = 0; i < self.freeObjects.length; i++) {
                    var object = self.freeObjects[i];
                    // pohni objekty
                    self.updateObject(sDelta, object, function(x) {
                        object.x -= x;
                    }, function(y) {
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
                        Mixer.play(Resources.SND_PICK_KEY);
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
         * Zjistí zda na daných pixel-souřadnicích dochází k zásahu nepřítele 
         */
        isEnemyHitOrCollision(x: number, y: number): CollisionTestResult {
            var self = this;
            var enemyRet = null;
            self.enemies.forEach(function(enemy) {
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
            } else {
                return enemyRet;
            }
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
            if (self.tilesMap.valueAt(x, y) != 0) {
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
        isBoundsInCollision(x: number, y: number, fullWidth: number, fullHeight: number, fullXShift: number, fullYShift: number, collisionTester: (x: number, y: number) => CollisionTestResult): CollisionTestResult {
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

        spell(targetX, targetY) {
            var self = this;
            var BLAST_SPEED = 1500;
            var heroCenterX = self.hero.x + self.hero.width / 2;
            var heroCenterY = self.hero.y + self.hero.height / 2;
            var b = targetX - heroCenterX;
            var a = targetY - heroCenterY;
            var c = Math.sqrt(a * a + b * b);

            var blastSheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [self.game.resources.getImage(Resources.BLAST_ANIMATION_KEY)],
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

            var object = new BulletObject(
                60,
                60,
                blastSheet,
                "fly",
                {
                    "fly": "fly",
                    "hit": "hit",
                    "done": "done"
                },
                20,
                20,
                false
            );
            object.speedx = -BLAST_SPEED * b / c;
            object.speedy = -BLAST_SPEED * a / c;

            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            self.bulletObjects.push(object);
            self.addChild(object);
            object.x = heroCenterX - object.width / 2;
            object.y = heroCenterY - object.height / 2;
            Mixer.play(Resources.SND_FIREBALL_KEY);
        };

        handleMouse(mouse: Mouse, delta: number) {
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
                if (Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTL.x, heroCoordTL.y) < Resources.REACH_TILES_RADIUS
                    || Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTR.x, heroCoordTR.y) < Resources.REACH_TILES_RADIUS
                    || Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBR.x, heroCoordBR.y) < Resources.REACH_TILES_RADIUS
                    || Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBL.x, heroCoordBL.y) < Resources.REACH_TILES_RADIUS) {
                    if (self.game.ui.spellsUI.choosenItem === Resources.SPELL_DIG_KEY) {
                        if (self.render.dig(mouse.x, mouse.y)) {
                            Mixer.play(Resources["SND_PICK_AXE_" + (Math.floor(Math.random() * 3) + 1) + "_KEY"]);
                        }
                    } else if (self.game.ui.spellsUI.choosenItem === Resources.SPELL_PLACE_KEY) {
                        // nemůžu pokládat do prostoru, kde stojím
                        if ((mouseCoord.x > heroCoordBR.x || mouseCoord.x < heroCoordTL.x ||
                            mouseCoord.y > heroCoordBR.y || mouseCoord.y < heroCoordTL.y) &&
                            self.render.place(mouse.x, mouse.y, self.game.ui.inventoryUI.choosenItem)) {
                            Mixer.play(Resources.SND_PLACE_KEY);
                        }
                    }
                }
                // dosahem neomezené akce
                if (self.game.ui.spellsUI.choosenItem === Resources.SPELL_FIREBALL_KEY) {
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
                } else {
                    self.sectorLabel.setText("SECTOR: -");
                }
            }

        };

        handleTick(delta) {
            var self = this;
            self.render.handleTick();
            self.background.handleTick(delta);
        };
    }
}