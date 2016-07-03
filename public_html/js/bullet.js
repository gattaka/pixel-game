var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        function BulletObject(owner, width, height, spriteSheet, initState, endState, stateAnimation, collXOffset, collYOffset) {
            _super.call(this, width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
            this.owner = owner;
            this.width = width;
            this.height = height;
            this.spriteSheet = spriteSheet;
            this.initState = initState;
            this.endState = endState;
            this.stateAnimation = stateAnimation;
            this.collXOffset = collXOffset;
            this.collYOffset = collYOffset;
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
        function BasicBullet(owner, width, height, spriteSheet, initState, endState, stateAnimation, collXOffset, collYOffset) {
            _super.call(this, owner, width, height, spriteSheet, initState, endState, stateAnimation, collXOffset, collYOffset);
        }
        ;
        BasicBullet.prototype.update = function (sDelta, game) {
            var self = this;
            if (self.ending) {
                if (self.currentAnimation === self.endState) {
                    self.done = true;
                }
                return;
            }
            var onCollision = function (clsn) {
                if (self.ending === false) {
                    Lich.Mixer.play(Lich.Resources.SND_BURN_KEY, false, 0.1);
                    self.ending = true;
                    self.gotoAndPlay("hit");
                    var centX = self.x + self.width / 2;
                    var centY = self.y + self.height / 2;
                    var rad = Lich.Resources.TILE_SIZE * 4;
                    for (var rx = centX - rad; rx <= centX + rad; rx += Lich.Resources.TILE_SIZE) {
                        for (var ry = centY - rad; ry <= centY + rad; ry += Lich.Resources.TILE_SIZE) {
                            var r2 = Math.pow(centX - rx, 2) + Math.pow(centY - ry, 2);
                            var d2 = Math.pow(rad, 2);
                            if (r2 <= d2) {
                                game.world.render.dig(rx, ry);
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
                clsnTest = game.world.isBoundsInCollision(self.x + self.collXOffset, self.y + self.collYOffset, self.width - self.collXOffset * 2, self.height - self.collYOffset * 2, 0, distanceY, function (x, y) { return game.world.isEnemyHitOrCollision(x, y); });
                if (clsnTest.hit === false) {
                    self.y -= distanceY;
                    if (self.y > game.canvas.height * 2 || self.y < -game.canvas.height) {
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
                clsnTest = game.world.isBoundsInCollision(self.x + self.collXOffset, self.y + self.collYOffset, self.width - self.collXOffset * 2, self.height - self.collYOffset * 2, distanceX, 0, function (x, y) { return game.world.isEnemyHitOrCollision(x, y); });
                if (clsnTest.hit === false) {
                    self.x -= distanceX;
                    if (self.x > game.canvas.width * 2 || self.x < -game.canvas.width)
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
