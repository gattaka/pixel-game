var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractWorldObject = (function (_super) {
        __extends(AbstractWorldObject, _super);
        function AbstractWorldObject(collXOffset, collYOffset, hovers) {
            if (hovers === void 0) { hovers = false; }
            var _this = _super.call(this) || this;
            _this.collXOffset = collXOffset;
            _this.collYOffset = collYOffset;
            _this.hovers = hovers;
            _this.speedx = 0;
            _this.speedy = 0;
            return _this;
        }
        AbstractWorldObject.prototype.play = function () { this.sprite.play(); };
        AbstractWorldObject.prototype.stop = function () { this.sprite.stop(); };
        AbstractWorldObject.prototype.gotoAndPlay = function (desiredState) { this.sprite.gotoAndPlay(desiredState); };
        AbstractWorldObject.prototype.getCurrentAnimation = function () { return this.sprite.currentAnimation; };
        AbstractWorldObject.prototype.performAnimation = function (desiredAnimation) {
            var self = this;
            var stringKey = Lich.AnimationKey[desiredAnimation];
            if (self.sprite.currentAnimation !== stringKey) {
                self.gotoAndPlay(stringKey);
            }
        };
        AbstractWorldObject.prototype.updateAnimations = function () { };
        ;
        return AbstractWorldObject;
    }(SheetContainer));
    Lich.AbstractWorldObject = AbstractWorldObject;
    var BulletObject = (function (_super) {
        __extends(BulletObject, _super);
        function BulletObject(
            // čí je to střela
            owner, 
            // sada animací, ze které sřela je
            animationSetKey, 
            // počáteční stav animace
            initAnimation, 
            // koncový stav animace
            endAnimation, 
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
            var _this = _super.call(this, collXOffset, collYOffset) || this;
            _this.owner = owner;
            _this.animationSetKey = animationSetKey;
            _this.initAnimation = initAnimation;
            _this.endAnimation = endAnimation;
            _this.collXOffset = collXOffset;
            _this.collYOffset = collYOffset;
            _this.hitSound = hitSound;
            _this.mapDestroy = mapDestroy;
            _this.piercing = piercing;
            _this.damage = damage;
            // pouští se koncová animace?
            _this.ending = false;
            // je vše ukončeno (doběhla i koncová animace)?
            _this.done = false;
            // mapa nepřátel a jejich timeoutů do dalšího zásahu tímto projektilem
            // není možné globálně počítat timeout, protože by nastavení timeoutu
            // zásahem jednoho nepřítele mohlo způsobit nezapočítání prvního 
            // zásahu jiného nepřítele, který je těsném závěsu za zasaženým
            _this.enemyPiercingTimeouts = {};
            var animationDef = Lich.Resources.getInstance().animationSetDefsByKey[_this.animationSetKey];
            _this.width = animationDef.width;
            _this.height = animationDef.height;
            _this.sprite = Lich.Resources.getInstance().getAnimatedObjectSprite(animationDef.animationSetKey);
            _this.addChild(_this.sprite);
            return _this;
        }
        ;
        return BulletObject;
    }(AbstractWorldObject));
    // jak dlouho se musí počkat, než se započítá další damage piercing projektilu?
    BulletObject.PIERCING_TIMEOUT = 1000;
    Lich.BulletObject = BulletObject;
    var BasicBullet = (function (_super) {
        __extends(BasicBullet, _super);
        function BasicBullet(owner, animationSetKey, initAnimation, endAnimation, collXOffset, collYOffset, hitSoundKey, mapDestroy, piercing, damage, radius) {
            var _this = _super.call(this, owner, animationSetKey, initAnimation, endAnimation, collXOffset, collYOffset, hitSoundKey, mapDestroy, piercing, damage) || this;
            _this.radius = radius;
            return _this;
        }
        ;
        BasicBullet.prototype.update = function (sDelta, game) {
            var self = this;
            if (self.ending) {
                if (self.sprite.currentAnimation === Lich.AnimationKey[self.endAnimation]) {
                    self.done = true;
                }
                return;
            }
            // Zjistí zda na daných pixel-souřadnicích dochází k zásahu cíle nebo povrchu
            // protože je tato funkce volána z isBoundsInCollision, je potřeba aby byla 
            // při zásahu cíle (nikoliv povrchu) vracela new CollisionTestResult (tedy SOLID
            // typ kolize -- isBoundsInCollision totiž nekončí po prvním "hit" případu,
            // ale zkouší (kvůli zkoseným povrchům) i další kontrolní testy -- v takovém
            // případě by to byl problém, protože by se enemyPiercingTimeouts započítávali
            // víckrát, než jednou
            var hitTargetOrCollide = function (x, y) {
                var targetRet = null;
                var targets = new Array();
                targets = targets.concat(game.getWorld().enemies);
                targets.push(game.getWorld().hero);
                for (var t = 0; t < targets.length; t++) {
                    var target = targets[t];
                    if (target) {
                        if (target.getCurrentHealth() > 0
                            && x > target.x && x < target.x + target.width
                            && y > target.y && y < target.y + target.height
                            && target.ownerId != self.owner
                            && (target.ownerId == Lich.Hero.OWNER_ID || self.owner == Lich.Hero.OWNER_ID)) {
                            // => CollisionType.SOLID -- takže hned dojde k ukončení isBoundsInCollision
                            targetRet = new Lich.CollisionTestResult(true, x, y);
                            if (self.piercing) {
                                var uuid = target.uuid;
                                var targetTimeout = self.enemyPiercingTimeouts[uuid];
                                if (!targetTimeout || targetTimeout < 0) {
                                    // proveď -- nemá ještě timeout nebo už má odčekáno
                                    self.enemyPiercingTimeouts[uuid] = BulletObject.PIERCING_TIMEOUT;
                                    target.hit(self.damage, game.getWorld());
                                }
                                else {
                                    // čekej
                                    self.enemyPiercingTimeouts[uuid] -= sDelta;
                                    // tenhle čeká, další poteciální cíl
                                    continue;
                                }
                            }
                            else {
                                // není piercing -- jeden zásah je konec projektilu
                                target.hit(self.damage, game.getWorld());
                                break;
                            }
                        }
                    }
                }
                if (targetRet == null || self.piercing) {
                    return game.getWorld().isCollision(x, y);
                }
                else {
                    return targetRet;
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
                clsnTest = game.getWorld().isBoundsInCollision(self.x + self.collXOffset, self.y + self.collYOffset, self.width - self.collXOffset * 2, self.height - self.collYOffset * 2, 0, distanceY, function (x, y) { return hitTargetOrCollide(x, y); }, true);
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
                clsnTest = game.getWorld().isBoundsInCollision(self.x + self.collXOffset, self.y + self.collYOffset, self.width - self.collXOffset * 2, self.height - self.collYOffset * 2, distanceX, 0, function (x, y) { return hitTargetOrCollide(x, y); }, true);
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
