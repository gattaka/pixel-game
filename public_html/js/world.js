/*global createjs*/
/*global game*/
/*global hero*/
/*global utils*/
/*global ui*/
/*global background*/
/*global generator*/
/*global resources*/
/*global render*/
/*global mixer*/

/**
 * world.js
 * 
 * Stará se o interakce ve světě
 * 
 */
var world = (function () {

    var pub = {};

    /*-----------*/
    /* CONSTANTS */
    /*-----------*/

    var OBJECT_NOTIFY_TIME = 500;
    var OBJECT_NOTIFY_BOUNCE_SPEED = 120;
    var OBJECT_PICKUP_DISTANCE = 10;
    var OBJECT_PICKUP_FORCE_DISTANCE = 100;
    var OBJECT_PICKUP_FORCE_TIME = 150;

    // Pixel/s
    var HERO_HORIZONTAL_SPEED = 300;
    var HERO_VERTICAL_SPEED = 500;

    // Pixel/s2
    var WORLD_GRAVITY = -1200;

    /*-----------*/
    /* VARIABLES */
    /*-----------*/

    var worldCont;

    var freeObjects = [];
    var bulletObjects = [];

    var initialized = false;

    var tilesLabel;
    var sectorLabel;

    // kolikrát ms se čeká, než se bude počítat další klik při mouse down?
    var MOUSE_COOLDOWN = 100;
    var spellTime = MOUSE_COOLDOWN;

    var tilesMap;

    /*---------*/
    /* METHODS */
    /*---------*/

    pub.init = function (callback) {

        // Generování nové mapy
        tilesMap = generator.generate();

        worldCont = new createjs.Container();
        game.stage.addChild(worldCont);
        game.worldCont = worldCont;

        // Předání mapy renderu
        render.init(function () {
            construct();
            if (typeof callback !== "undefined") {
                callback();
            }
        }, tilesMap);

    };

    var construct = function () {

        mixer.play(resources.DIRT_THEME_KEY, true);

        /*------------*/
        /* Characters */
        /*------------*/
        hero.init(function () {
            worldCont.addChild(hero.sprite);
            hero.sprite.x = game.canvas.width / 2;
            hero.sprite.y = game.canvas.height / 2;
            render.updatePlayerIcon(hero.sprite.x, hero.sprite.y);

            /*---------------------*/
            /* Measurements, debug */
            /*---------------------*/
            tilesLabel = new createjs.Text("TILES x: - y: -", "bold 18px Arial", "#00f");
            worldCont.addChild(tilesLabel);
            tilesLabel.x = 10;
            tilesLabel.y = 50;

            sectorLabel = new createjs.Text("SECTOR: -", "bold 18px Arial", "#00f");
            worldCont.addChild(sectorLabel);
            sectorLabel.x = 10;
            sectorLabel.y = 70;

            /*------------*/
            /* Dig events */
            /*------------*/
            render.addOnDigObjectListener(function (objType, x, y) {
                if (typeof objType.item !== "undefined") {
                    for (var i = 0; i < objType.item.quant; i++) {
                        var objectSprite = resources.getItemBitmap(objType.item.index);
                        var coord = render.tilesToPixel(x, y);
                        objectSprite.x = coord.x + 10 - Math.random() * 20;
                        objectSprite.y = coord.y;
                        worldCont.addChild(objectSprite);
                        var object = {};
                        object.item = objType.item;
                        object.sprite = objectSprite;
                        object.width = objectSprite.sourceRect.width;
                        object.height = objectSprite.sourceRect.height;
                        object.speedx = 0;
                        object.speedy = (Math.random() * 2 + 1) * OBJECT_NOTIFY_BOUNCE_SPEED;
                        object.collXOffset = 2;
                        object.collYOffset = 0;
                        object.notificationTimer = OBJECT_NOTIFY_TIME;
                        freeObjects.push(object);
                    }
                }
            });

            console.log("earth ready");
            initialized = true;
        });

    };

    var updateBullet = function (sDelta, object, makeShiftX, makeShiftY, onCollision) {

        if (object === null || object.done)
            return;

        var clsnTest;

        if (object.speedy !== 0) {

            var distanceY = object.speedy * sDelta;

            // Nenarazím na překážku?
            clsnTest = isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, distanceY);
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
            clsnTest = isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, distanceX, 0);
            if (clsnTest.hit === false) {
                makeShiftX(distanceX);
            } else {
                onCollision(clsnTest);
                return;
            }
        }
    };

    var updateObject = function (sDelta, object, makeShiftX, makeShiftY) {

        var clsnTest;
        var clsnPosition;

        if (object.speedy !== 0) {

            // dráha, kterou objekt urazil za daný časový úsek, 
            // kdy je známa jeho poslední rychlost a zrychlení, 
            // které na něj za daný časový úsek působilo:
            // s_t = vt + 1/2.at^2
            var distanceY = utils.floor(object.speedy * sDelta + WORLD_GRAVITY * Math.pow(sDelta, 2) / 2);
            // uprav rychlost objektu, která se dá spočítat jako: 
            // v = v_0 + at
            object.speedy = object.speedy + WORLD_GRAVITY * sDelta;

            // Nenarazím na překážku?
            clsnTest = isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, distanceY);
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
                    clsnPosition = render.tilesToPixel(clsnTest.result.x, clsnTest.result.y);
                    makeShiftY(-1 * (clsnPosition.y - (object.sprite.y + object.height - object.collYOffset)));

                    object.speedy = 0;
                }
            }

        }

        if (object.speedx !== 0) {
            var distanceX = utils.floor(sDelta * object.speedx);

            // Nenarazím na překážku?
            clsnTest = isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, distanceX, 0);
            if (clsnTest.hit === false) {
                makeShiftX(distanceX);
            }
            // zkus zmenšit posun, aby nebyla kolize
            else {
                // získej pozici kolizního bloku
                clsnPosition = render.tilesToPixel(clsnTest.result.x, clsnTest.result.y);
                if (distanceX > 0) {
                    // narazil jsem do něj zprava
                    makeShiftX(object.sprite.x + object.collXOffset - (clsnPosition.x + resources.TILE_SIZE) - 1);
                } else {
                    // narazil jsem do něj zleva
                    makeShiftX(-1 * (clsnPosition.x - (object.sprite.x + object.width - object.collXOffset) - 1));
                }
            }
        }

        // pokud nejsem zrovna uprostřed skoku...
        if (object.speedy === 0) {
            // ...a mám kam padat
            clsnTest = isBoundsInCollision(object.sprite.x + object.collXOffset, object.sprite.y + object.collYOffset, object.width - object.collXOffset * 2, object.height - object.collYOffset * 2, 0, -1);
            if (clsnTest.hit === false) {
                object.speedy = -1;
            }
        }

        if (typeof object.updateAnimations !== "undefined") {
            object.updateAnimations();
        }

    };

    pub.update = function (delta, directions) {
        if (initialized) {

            var sDelta = delta / 1000; // ms -> s

            // Dle kláves nastav rychlosti
            // Nelze akcelerovat nahoru, když už 
            // rychlost mám (nemůžu skákat ve vzduchu)
            if (directions.up && hero.speedy === 0) {
                hero.speedy = HERO_VERTICAL_SPEED;
            } else if (directions.down) {
                // TODO
            }

            // Horizontální akcelerace
            if (directions.left) {
                hero.speedx = HERO_HORIZONTAL_SPEED;
            } else if (directions.right) {
                hero.speedx = -HERO_HORIZONTAL_SPEED;
            } else {
                hero.speedx = 0;
            }

            var makeShiftX = function (dst) {
                var rndDst = utils.floor(dst);
                render.shiftX(rndDst);
                // Horizontální pohyb se projevuje na pozadí
                //movePointer(pointer.x + startX + screenOffsetX - rndDst, pointer.y + startY + screenOffsetY);
                background.shift(rndDst, 0);
                freeObjects.forEach(function (item) {
                    item.sprite.x += rndDst;
                });
                bulletObjects.forEach(function (item) {
                    item.sprite.x += rndDst;
                });
            };

            var makeShiftY = function (dst) {
                var rndDst = utils.floor(dst);
                render.shiftY(rndDst);
                // Horizontální pohyb se projevuje na pozadí
                //movePointer(pointer.x + startX + screenOffsetX, pointer.y + startY + screenOffsetY - rndDst);
                background.shift(0, rndDst);
                freeObjects.forEach(function (item) {
                    item.sprite.y += rndDst;
                });
                bulletObjects.forEach(function (item) {
                    item.sprite.y += rndDst;
                });
            };

            // update hráče
            updateObject(sDelta, hero, makeShiftX, makeShiftY);

            // update projektilů
            (function () {

                var deleteBullet = function (object) {
                    bulletObjects.splice(i, 1);
                    worldCont.removeChild(object.sprite);
                };

                for (var i = 0; i < bulletObjects.length; i++) {
                    var object = bulletObjects[i];
                    updateBullet(sDelta, object, function (x) {
                        object.sprite.x -= x;
                        if (object.sprite.x > game.canvas.width * 2 || object.sprite.x < -game.canvas.width)
                            deleteBullet(object);
                    }, function (y) {
                        object.sprite.y -= y;
                        if (object.sprite.y > game.canvas.height * 2 || object.sprite.y < -game.canvas.height)
                            deleteBullet(object);
                    }, function (clsn) {
                        if (object.done === false) {
                            mixer.play(resources.BURN_KEY);
                            object.done = true;
                            object.sprite.gotoAndPlay("hit");
                            var centX = object.sprite.x + object.width / 2;
                            var centY = object.sprite.y + object.height / 2;
                            var rad = resources.TILE_SIZE * 4;
                            for (var rx = centX - rad; rx <= centX + rad; rx += resources.TILE_SIZE) {
                                for (var ry = centY - rad; ry <= centY + rad; ry += resources.TILE_SIZE) {
                                    var r2 = Math.pow(centX - rx, 2) + Math.pow(centY - ry, 2);
                                    var d2 = Math.pow(rad, 2);
                                    if (r2 <= d2) {
                                        render.dig(rx, ry);
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
            (function () {
                for (var i = 0; i < freeObjects.length; i++) {
                    var object = freeObjects[i];
                    // pohni objekty
                    updateObject(sDelta, object, function (x) {
                        object.sprite.x -= x;
                    }, function (y) {
                        object.sprite.y -= y;
                    });
                    var heroCenterX = hero.sprite.x + hero.width / 2;
                    var heroCenterY = hero.sprite.y + hero.height / 2;
                    var itemCenterX = object.sprite.x + object.width / 2;
                    var itemCenterY = object.sprite.y + object.height / 2;

                    // zjisti, zda hráč objekt nesebral
                    if (Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < OBJECT_PICKUP_DISTANCE) {
                        ui.inventoryUI.invInsert(object.item.index, 1);
                        freeObjects.splice(i, 1);
                        worldCont.removeChild(object.sprite);
                        mixer.play(resources.PICK_KEY);
                        object = null;
                    }
                    if (object !== null && Math.sqrt(Math.pow(itemCenterX - heroCenterX, 2) + Math.pow(itemCenterY - heroCenterY, 2)) < OBJECT_PICKUP_FORCE_DISTANCE) {
                        createjs.Tween.get(object.sprite)
                                .to({
                                    x: heroCenterX - object.width / 2,
                                    y: heroCenterY - object.height / 2
                                }, OBJECT_PICKUP_FORCE_TIME);
                    }
                }
            })();

        }
    };

    var isCollision = function (x, y) {
        var result = render.pixelsToTiles(x, y);
        return isCollisionByTiles(result.x, result.y);
    };

    var isCollisionByTiles = function (x, y) {
        return {
            hit: tilesMap.valueAt(x, y) > 0,
            "result": {
                x: x,
                y: y
            }
        };
    };

    var isBoundsInCollision = function (x, y, fullWidth, fullHeight, fullXShift, fullYShift) {
        var tx;
        var ty;

        // kolize se musí dělat iterativně pro každý bod v TILE_SIZE podél hran objektu
        var xShift = 0;
        var yShift = 0;
        var width = 0;
        var height = 0;
        var xSign = utils.sign(fullXShift);
        var ySign = utils.sign(fullYShift);

        // pokud bude zadán fullXShift i fullYShift, udělá to diagonální posuv
        while (xShift !== fullXShift || yShift !== fullYShift) {
            if (xSign * (xShift + xSign * resources.TILE_SIZE) > xSign * fullXShift) {
                xShift = fullXShift;
            } else {
                xShift += xSign * resources.TILE_SIZE;
            }

            if (ySign * (yShift + ySign * resources.TILE_SIZE) > ySign * fullYShift) {
                yShift = fullYShift;
            } else {
                yShift += ySign * resources.TILE_SIZE;
            }

            width = 0;
            while (width !== fullWidth) {
                if (width + resources.TILE_SIZE > fullWidth) {
                    width = fullWidth;
                } else {
                    width += resources.TILE_SIZE;
                }

                height = 0;
                while (height !== fullHeight) {
                    if (height + resources.TILE_SIZE > fullHeight) {
                        height = fullHeight;
                    } else {
                        height += resources.TILE_SIZE;
                    }

                    if (xShift > 0 || yShift > 0) {
                        tx = x - xShift;
                        ty = y - yShift;
                        var LT = isCollision(tx, ty);
                        if (LT.hit)
                            return LT;
                    }

                    if (xShift < 0 || yShift > 0) {
                        tx = x + width - xShift;
                        ty = y - yShift;
                        var RT = isCollision(tx, ty);
                        if (RT.hit)
                            return RT;
                    }

                    if (xShift > 0 || yShift < 0) {
                        tx = x - xShift;
                        ty = y + height - yShift;
                        var LB = isCollision(tx, ty);
                        if (LB.hit)
                            return LB;
                    }

                    if (xShift < 0 || yShift < 0) {
                        tx = x + width - xShift;
                        ty = y + height - yShift;
                        var RB = isCollision(tx, ty);
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

    var spell = function (targetX, targetY) {
        var BLAST_SPEED = 1500;
        var heroCenterX = hero.sprite.x + hero.width / 2;
        var heroCenterY = hero.sprite.y + hero.height / 2;
        var b = targetX - heroCenterX;
        var a = targetY - heroCenterY;
        var c = Math.sqrt(a * a + b * b);

        var blastSheet = new createjs.SpriteSheet({
            framerate: 10,
            "images": [resources.getImage(resources.BLAST_ANIMATION_KEY)],
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
        worldCont.addChild(blastSprite);

        var object = {};
        object.sprite = blastSprite;
        object.width = 60;
        object.height = 60;

        blastSprite.x = heroCenterX - object.width / 2;
        blastSprite.y = heroCenterY - object.height / 2;

        // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
        // přepony dle rychlosti projektilu
        object.speedx = -BLAST_SPEED * b / c;
        object.speedy = -BLAST_SPEED * a / c;
        object.collXOffset = 20;
        object.collYOffset = 20;
        object.done = false;
        bulletObjects.push(object);
        mixer.play(resources.FIREBALL_KEY);
    };

    pub.handleMouse = function (mouse, delta) {
        spellTime -= delta;
        if (spellTime <= 0 && (mouse.down || mouse.click)) {
            mouse.click = false;

            //render.dig(mouse.x, mouse.y);
            spell(mouse.x, mouse.y);

            spellTime = MOUSE_COOLDOWN;
        }

        var coord = render.pixelsToTiles(mouse.x, mouse.y);
        var clsn = isCollisionByTiles(coord.x, coord.y);
        var index = tilesMap.indexAt(coord.x, coord.y);
        var type = tilesMap.map[index];
        if (typeof tilesLabel !== "undefined") {
            tilesLabel.text = "TILES x: " + clsn.result.x + " y: " + clsn.result.y + " clsn: " + clsn.hit + " index: " + index + " type: " + type;
        }

        var sector = render.getSectorByTiles(coord.x, coord.y);
        if (typeof sectorLabel !== "undefined") {
            if (typeof sector !== "undefined" && sector !== null) {
                sectorLabel.text = "SECTOR: x: " + sector.map_x + " y: " + sector.map_y;
            } else {
                sectorLabel.text = "SECTOR: -";
            }
        }

    };

    pub.handleTick = function (delta) {
        render.handleTick();
    };

    return pub;

})();