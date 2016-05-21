/**
 * world.js
 * 
 * Stará se o interakce ve světě
 * 
 */
namespace Lich {

    abstract class AbstractWorldObject {
        constructor(
            public sprite,
            public width,
            public height,
            public speedx,
            public speedy,
            public collXOffset,
            public collYOffset) { };
    }

    class BulletObject extends AbstractWorldObject {
        constructor(
            public sprite,
            public width,
            public height,
            public speedx,
            public speedy,
            public collXOffset,
            public collYOffset,
            public done) {
            super(sprite, width, height, speedx, speedy, collXOffset, collYOffset);
        };
    }

    class WorldObject extends AbstractWorldObject {
        constructor(
            public item,
            public sprite,
            public width,
            public height,
            public speedx,
            public speedy,
            public collXOffset,
            public collYOffset,
            public notificationTimer) {
            super(sprite, width, height, speedx, speedy, collXOffset, collYOffset);
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

        static MOUSE_COOLDOWN = 100;

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        freeObjects = [];
        bulletObjects = [];

        tilesLabel;
        sectorLabel;

        // kolikrát ms se čeká, než se bude počítat další klik při mouse down?
        spellTime = World.MOUSE_COOLDOWN;

        map: Map;
        tilesMap;
        render;
        background;
        hero: Hero;

        constructor(public game: Game) {
            super();

            this.map = new Map(game);
            this.tilesMap = this.map.tilesMap;
            this.render = new Render(game, this.map, this);
            this.background = new Background(game);
            this.hero = new Hero(game);

            // hudba
            Mixer.play(Resources.DIRT_THEME_KEY, true);

            /*------------*/
            /* Characters */
            /*------------*/
            this.addChild(this.hero);
            this.hero.x = game.canvas.width / 2;
            this.hero.y = game.canvas.height / 2;
            this.render.updatePlayerIcon(this.hero.x, this.hero.y);

            /*---------------------*/
            /* Measurements, debug */
            /*---------------------*/
            this.tilesLabel = new createjs.Text("TILES x: - y: -", "bold 18px Arial", "#00f");
            this.addChild(this.tilesLabel);
            this.tilesLabel.x = 10;
            this.tilesLabel.y = 50;

            this.sectorLabel = new createjs.Text("SECTOR: -", "bold 18px Arial", "#00f");
            this.addChild(this.sectorLabel);
            this.sectorLabel.x = 10;
            this.sectorLabel.y = 70;

            /*------------*/
            /* Dig events */
            /*------------*/
            this.render.addOnDigObjectListener(function(objType, x, y) {
                if (typeof objType.item !== "undefined") {
                    for (var i = 0; i < objType.item.quant; i++) {
                        var objectSprite = this.game.resources.getItemBitmap(objType.item.index);
                        var coord = this.render.tilesToPixel(x, y);
                        objectSprite.x = coord.x + 10 - Math.random() * 20;
                        objectSprite.y = coord.y;
                        this.addChild(objectSprite);
                        var object = new WorldObject(
                            objType.item,
                            objectSprite,
                            objectSprite.sourceRect.width,
                            objectSprite.sourceRect.height,
                            0,
                            (Math.random() * 2 + 1) * World.OBJECT_NOTIFY_BOUNCE_SPEED,
                            2,
                            0,
                            World.OBJECT_NOTIFY_TIME);
                        this.freeObjects.push(object);
                    }
                }
            });

            console.log("earth ready");
        }

        updateBullet(sDelta, object, makeShiftX, makeShiftY, onCollision) {

            if (object === null || object.done)
                return;

            var clsnTest;

            if (object.speedy !== 0) {

                var distanceY = object.speedy * sDelta;

                // Nenarazím na překážku?
                clsnTest = this.isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, distanceY);
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
                clsnTest = this.isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, distanceX, 0);
                if (clsnTest.hit === false) {
                    makeShiftX(distanceX);
                } else {
                    onCollision(clsnTest);
                    return;
                }
            }
        };

        updateObject(sDelta, object, makeShiftX, makeShiftY) {

            var clsnTest;
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
                clsnTest = this.isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, distanceY);
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
                        clsnPosition = this.render.tilesToPixel(clsnTest.result.x, clsnTest.result.y);
                        makeShiftY(-1 * (clsnPosition.y - (object.sprite.y + object.height - object.collYOffset)));

                        object.speedy = 0;
                    }
                }

            }

            if (object.speedx !== 0) {
                var distanceX = Utils.floor(sDelta * object.speedx);

                // Nenarazím na překážku?
                clsnTest = this.isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, distanceX, 0);
                if (clsnTest.hit === false) {
                    makeShiftX(distanceX);
                }
                // zkus zmenšit posun, aby nebyla kolize
                else {
                    // získej pozici kolizního bloku
                    clsnPosition = this.render.tilesToPixel(clsnTest.result.x, clsnTest.result.y);
                    if (distanceX > 0) {
                        // narazil jsem do něj zprava
                        makeShiftX(object.sprite.x + object.collXOffset - (clsnPosition.x + Resources.TILE_SIZE) - 1);
                    } else {
                        // narazil jsem do něj zleva
                        makeShiftX(-1 * (clsnPosition.x - (object.sprite.x + object.width - object.collXOffset) - 1));
                    }
                }
            }

            // pokud nejsem zrovna uprostřed skoku...
            if (object.speedy === 0) {
                // ...a mám kam padat
                clsnTest = this.isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, -1);
                if (clsnTest.hit === false) {
                    object.speedy = -1;
                }
            }

            if (typeof object.updateAnimations !== "undefined") {
                object.updateAnimations();
            }

        };

        update(delta, directions) {
            var sDelta = delta / 1000; // ms -> s

            // Dle kláves nastav rychlosti
            // Nelze akcelerovat nahoru, když už 
            // rychlost mám (nemůžu skákat ve vzduchu)
            if (directions.up && this.hero.speedy === 0) {
                this.hero.speedy = World.HERO_VERTICAL_SPEED;
            } else if (directions.down) {
                // TODO
            }

            // Horizontální akcelerace
            if (directions.left) {
                this.hero.speedx = World.HERO_HORIZONTAL_SPEED;
            } else if (directions.right) {
                this.hero.speedx = -World.HERO_HORIZONTAL_SPEED;
            } else {
                this.hero.speedx = 0;
            }

            var makeShiftX = function(dst) {
                var rndDst = Utils.floor(dst);
                this.render.shiftX(rndDst);
                // Horizontální pohyb se projevuje na pozadí
                //movePointer(pointer.x + startX + screenOffsetX - rndDst, pointer.y + startY + screenOffsetY);
                this.background.shift(rndDst, 0);
                this.freeObjects.forEach(function(item) {
                    item.sprite.x += rndDst;
                });
                this.bulletObjects.forEach(function(item) {
                    item.sprite.x += rndDst;
                });
            };

            var makeShiftY = function(dst) {
                var rndDst = Utils.floor(dst);
                this.render.shiftY(rndDst);
                // Horizontální pohyb se projevuje na pozadí
                //movePointer(pointer.x + startX + screenOffsetX, pointer.y + startY + screenOffsetY - rndDst);
                this.background.shift(0, rndDst);
                this.freeObjects.forEach(function(item) {
                    item.sprite.y += rndDst;
                });
                this.bulletObjects.forEach(function(item) {
                    item.sprite.y += rndDst;
                });
            };

            // update hráče
            this.updateObject(sDelta, this.hero, makeShiftX, makeShiftY);

            // update projektilů
            (function() {

                var deleteBullet = function(object) {
                    this.bulletObjects.splice(i, 1);
                    this.removeChild(object.sprite);
                };

                for (var i = 0; i < this.bulletObjects.length; i++) {
                    var object = this.bulletObjects[i];
                    this.updateBullet(sDelta, object, function(x) {
                        object.sprite.x -= x;
                        if (object.sprite.x > this.game.canvas.width * 2 || object.sprite.x < -this.game.canvas.width)
                            deleteBullet(object);
                    }, function(y) {
                        object.sprite.y -= y;
                        if (object.sprite.y > this.game.canvas.height * 2 || object.sprite.y < -this.game.canvas.height)
                            deleteBullet(object);
                    }, function(clsn) {
                        if (object.done === false) {
                            Mixer.play(Resources.BURN_KEY);
                            object.done = true;
                            object.sprite.gotoAndPlay("hit");
                            var centX = object.sprite.x + object.width / 2;
                            var centY = object.sprite.y + object.height / 2;
                            var rad = Resources.TILE_SIZE * 4;
                            for (var rx = centX - rad; rx <= centX + rad; rx += Resources.TILE_SIZE) {
                                for (var ry = centY - rad; ry <= centY + rad; ry += Resources.TILE_SIZE) {
                                    var r2 = Math.pow(centX - rx, 2) + Math.pow(centY - ry, 2);
                                    var d2 = Math.pow(rad, 2);
                                    if (r2 <= d2) {
                                        this.render.dig(rx, ry);
                                    }
                                }
                            }
                        }
                    });
                    if (object.sprite.currentAnimation === "done") {
                        deleteBullet(object);
                    }
                }
            })();

            // update sebratelných objektů
            (function() {
                for (var i = 0; i < this.freeObjects.length; i++) {
                    var object = this.freeObjects[i];
                    // pohni objekty
                    this.updateObject(sDelta, object, function(x) {
                        object.sprite.x -= x;
                    }, function(y) {
                        object.sprite.y -= y;
                    });
                    var heroCenterX = this.hero.sprite.x + this.hero.width / 2;
                    var heroCenterY = this.hero.sprite.y + this.hero.height / 2;
                    var itemCenterX = object.sprite.x + object.width / 2;
                    var itemCenterY = object.sprite.y + object.height / 2;

                    // zjisti, zda hráč objekt nesebral
                    if (Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < World.OBJECT_PICKUP_DISTANCE) {
                        this.ui.inventoryUI.invInsert(object.item.index, 1);
                        this.freeObjects.splice(i, 1);
                        this.removeChild(object.sprite);
                        Mixer.play(Resources.PICK_KEY);
                        object = null;
                    }
                    if (object !== null && Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < World.OBJECT_PICKUP_FORCE_DISTANCE) {
                        createjs.Tween.get(object.sprite)
                            .to({
                                x: heroCenterX - object.width / 2,
                                y: heroCenterY - object.height / 2
                            }, World.OBJECT_PICKUP_FORCE_TIME);
                    }
                }
            })();

        };

        isCollision(x, y) {
            var result = this.render.pixelsToTiles(x, y);
            return this.isCollisionByTiles(result.x, result.y);
        };

        isCollisionByTiles(x, y) {
            return {
                hit: this.tilesMap.valueAt(x, y) > 0,
                "result": {
                    x: x,
                    y: y
                }
            };
        };

        isBoundsInCollision(x, y, fullWidth, fullHeight, fullXShift, fullYShift) {
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
                            var LT = this.isCollision(tx, ty);
                            if (LT.hit)
                                return LT;
                        }

                        if (xShift < 0 || yShift > 0) {
                            tx = x + width - xShift;
                            ty = y - yShift;
                            var RT = this.isCollision(tx, ty);
                            if (RT.hit)
                                return RT;
                        }

                        if (xShift > 0 || yShift < 0) {
                            tx = x - xShift;
                            ty = y + height - yShift;
                            var LB = this.isCollision(tx, ty);
                            if (LB.hit)
                                return LB;
                        }

                        if (xShift < 0 || yShift < 0) {
                            tx = x + width - xShift;
                            ty = y + height - yShift;
                            var RB = this.isCollision(tx, ty);
                            if (RB.hit)
                                return RB;
                        }

                        if (xShift === fullXShift && yShift === fullYShift && width === fullWidth && height === fullHeight) {
                            return {
                                hit: false
                            };
                        }

                    }
                }
            }

            return {
                hit: false
            };

        };

        spell(targetX, targetY) {
            var BLAST_SPEED = 1500;
            var heroCenterX = this.hero.x + this.hero.width / 2;
            var heroCenterY = this.hero.y + this.hero.height / 2;
            var b = targetX - heroCenterX;
            var a = targetY - heroCenterY;
            var c = Math.sqrt(a * a + b * b);

            var blastSheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [this.game.resources.getImage(Resources.BLAST_ANIMATION_KEY)],
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
            var blastSprite = new createjs.Sprite(blastSheet, "fly");
            this.addChild(blastSprite);

            blastSprite.x = heroCenterX - object.width / 2;
            blastSprite.y = heroCenterY - object.height / 2;

            var object = new BulletObject(
                blastSprite,
                60,
                60,
                -BLAST_SPEED * b / c,
                -BLAST_SPEED * a / c,
                20,
                20,
                false
            );

            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            this.bulletObjects.push(object);
            Mixer.play(Resources.FIREBALL_KEY);
        };

        handleMouse(mouse, delta) {
            this.spellTime -= delta;
            if (this.spellTime <= 0 && (mouse.down || mouse.click)) {
                mouse.click = false;

                if (this.game.ui.spellsUI.choosenItem === Resources.DIG_SPELL_KEY) {
                    if (this.render.dig(mouse.x, mouse.y)) {
                        Mixer.play(Resources["PICK_AXE_SOUND_" + (Math.floor(Math.random() * 3) + 1) + "_KEY"]);
                    }
                } else if (this.game.ui.spellsUI.choosenItem === Resources.PLACE_SPELL_KEY) {
                    if (this.render.place(mouse.x, mouse.y, this.game.ui.inventoryUI.choosenItem)) {
                        Mixer.play(Resources["PLACE_SOUND_KEY"]);
                    }
                } else if (this.game.ui.spellsUI.choosenItem === Resources.FIREBALL_SPELL_KEY) {
                    this.spell(mouse.x, mouse.y);
                }

                this.spellTime = World.MOUSE_COOLDOWN;
            }

            var coord = this.render.pixelsToTiles(mouse.x, mouse.y);
            var clsn = this.isCollisionByTiles(coord.x, coord.y);
            var index = this.tilesMap.indexAt(coord.x, coord.y);
            var type = this.tilesMap.map[index];
            if (typeof this.tilesLabel !== "undefined") {
                this.tilesLabel.text = "TILES x: " + clsn.result.x + " y: " + clsn.result.y + " clsn: " + clsn.hit + " index: " + index + " type: " + type;
            }

            var sector = this.render.getSectorByTiles(coord.x, coord.y);
            if (typeof this.sectorLabel !== "undefined") {
                if (typeof sector !== "undefined" && sector !== null) {
                    this.sectorLabel.text = "SECTOR: x: " + sector.map_x + " y: " + sector.map_y;
                } else {
                    this.sectorLabel.text = "SECTOR: -";
                }
            }

        };

        handleTick(delta) {
            this.render.handleTick();
            this.background.handleTick(delta);
        };
    }
}