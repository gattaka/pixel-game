var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractWorldObject = (function (_super) {
        __extends(AbstractWorldObject, _super);
        function AbstractWorldObject(width, height, spriteSheet, initState, collXOffset, collYOffset, hovers) {
            if (hovers === void 0) { hovers = false; }
            _super.call(this);
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.initState = initState;
            this.collXOffset = collXOffset;
            this.collYOffset = collYOffset;
            this.hovers = hovers;
            this.speedx = 0;
            this.speedy = 0;
            this.sprite = new createjs.Sprite(spriteSheet, initState);
            this.addChild(this.sprite);
        }
        AbstractWorldObject.prototype.play = function () { this.sprite.play(); };
        AbstractWorldObject.prototype.stop = function () { this.sprite.stop(); };
        AbstractWorldObject.prototype.gotoAndPlay = function (desiredState) { this.sprite.gotoAndPlay(desiredState); };
        AbstractWorldObject.prototype.getCurrentAnimation = function () { return this.sprite.currentAnimation; };
        AbstractWorldObject.prototype.performState = function (desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.sprite.gotoAndPlay(desiredState);
                self.state = desiredState;
            }
        };
        AbstractWorldObject.prototype.updateAnimations = function () { };
        ;
        return AbstractWorldObject;
    }(createjs.Container));
    Lich.AbstractWorldObject = AbstractWorldObject;
    var BulletObject = (function (_super) {
        __extends(BulletObject, _super);
        function BulletObject(
            // čí je to střela
            owner, 
            // velikost střely
            width, height, 
            // spritesheet animace střely
            spriteSheet, 
            // počáteční stav animace
            initState, 
            // koncový stav animace
            endState, 
            // kolizní tolerance
            collXOffset, collYOffset, 
            // zvuk dopadu
            hitSound, 
            // ničí střela i mapu (povrch/objekty)
            mapDestroy, 
            // škodí střela více cílům najednou
            piercing, 
            // kolik střela ubírá
            damage) {
            _super.call(this, width, height, spriteSheet, initState, collXOffset, collYOffset);
            this.owner = owner;
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.initState = initState;
            this.endState = endState;
            this.collXOffset = collXOffset;
            this.collYOffset = collYOffset;
            this.hitSound = hitSound;
            this.mapDestroy = mapDestroy;
            this.piercing = piercing;
            this.damage = damage;
            // pouští se koncová animace?
            this.ending = false;
            // je vše ukončeno (doběhla i koncová animace)?
            this.done = false;
        }
        ;
        return BulletObject;
    }(AbstractWorldObject));
    Lich.BulletObject = BulletObject;
    var BasicBullet = (function (_super) {
        __extends(BasicBullet, _super);
        function BasicBullet(owner, width, height, spriteSheet, initState, endState, collXOffset, collYOffset, hitSoundKey, mapDestroy, piercing, damage, radius) {
            _super.call(this, owner, width, height, spriteSheet, initState, endState, collXOffset, collYOffset, hitSoundKey, mapDestroy, piercing, damage);
            this.radius = radius;
        }
        ;
        BasicBullet.prototype.update = function (sDelta, game) {
            var self = this;
            if (self.ending) {
                if (self.sprite.currentAnimation === self.endState) {
                    self.done = true;
                }
                return;
            }
            // Zjistí zda na daných pixel-souřadnicích dochází k zásahu nepřítele 
            var hitEnemyOrCollide = function (x, y) {
                var enemyRet = null;
                for (var e = 0; e < game.getWorld().enemies.length; e++) {
                    var enemy = game.getWorld().enemies[e];
                    if (enemy) {
                        if (enemy.getCurrentHealth() > 0
                            && x > enemy.x && x < enemy.x + enemy.width
                            && y > enemy.y && y < enemy.y + enemy.height) {
                            enemyRet = new Lich.CollisionTestResult(true, x, y);
                            var effectiveDamage = enemy.hit(self.damage, game.getWorld());
                            game.getWorld().fadeText("-" + effectiveDamage, enemy.x + enemy.width * Math.random(), enemy.y, 25, "#E3E", "#303");
                            if (self.piercing == false) {
                                break;
                            }
                        }
                    }
                }
                if (enemyRet == null || self.piercing) {
                    return game.getWorld().isCollision(x, y);
                }
                else {
                    return enemyRet;
                }
            };
            var onCollision = function (clsn) {
                if (self.ending === false) {
                    Lich.Mixer.playSound(self.hitSound, 0.1);
                    self.ending = true;
                    self.sprite.gotoAndPlay("hit");
                    if (self.mapDestroy) {
                        var centX = self.x + self.width / 2;
                        var centY = self.y + self.height / 2;
                        var rad = Lich.Resources.TILE_SIZE * self.radius;
                        for (var rx = centX - rad; rx <= centX + rad; rx += Lich.Resources.TILE_SIZE) {
                            for (var ry = centY - rad; ry <= centY + rad; ry += Lich.Resources.TILE_SIZE) {
                                var r2 = Math.pow(centX - rx, 2) + Math.pow(centY - ry, 2);
                                var d2 = Math.pow(rad, 2);
                                if (r2 <= d2) {
                                    game.getWorld().render.dig(rx, ry, false);
                                }
                            }
                        }
                    }
                }
                ;
            };
            var clsnTest;
            if (self.speedy !== 0) {
                var distanceY = self.speedy * sDelta;
                // Nenarazím na překážku?
                clsnTest = game.getWorld().isBoundsInCollision(self.x + self.collXOffset, self.y + self.collYOffset, self.width - self.collXOffset * 2, self.height - self.collYOffset * 2, 0, distanceY, function (x, y) { return hitEnemyOrCollide(x, y); }, true);
                if (clsnTest.hit === false) {
                    self.y -= distanceY;
                    if (self.y > game.getCanvas().height * 2 || self.y < -game.getCanvas().height) {
                        self.done = true;
                        return;
                    }
                }
                else {
                    onCollision(clsnTest);
                    return;
                }
            }
            if (self.speedx !== 0) {
                var distanceX = sDelta * self.speedx;
                // Nenarazím na překážku?
                clsnTest = game.getWorld().isBoundsInCollision(self.x + self.collXOffset, self.y + self.collYOffset, self.width - self.collXOffset * 2, self.height - self.collYOffset * 2, distanceX, 0, function (x, y) { return hitEnemyOrCollide(x, y); }, true);
                if (clsnTest.hit === false) {
                    self.x -= distanceX;
                    if (self.x > game.getCanvas().width * 2 || self.x < -game.getCanvas().width)
                        self.done = true;
                    return;
                }
                else {
                    onCollision(clsnTest);
                    return;
                }
            }
        };
        BasicBullet.prototype.isDone = function () {
            return this.done;
        };
        return BasicBullet;
    }(BulletObject));
    Lich.BasicBullet = BasicBullet;
})(Lich || (Lich = {}));
