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

    export abstract class BulletObject extends AbstractWorldObject {

        // pouští se koncová animace?
        protected ending: boolean = false;
        // je vše ukončeno (doběhla i koncová animace)?
        public done: boolean = false;

        constructor(
            public owner: string,
            public width: number,
            public height: number,
            public spriteSheet: createjs.SpriteSheet,
            public initState: string,
            public endState: string,
            public stateAnimation: Object,
            public collXOffset: number,
            public collYOffset: number
        ) {
            super(width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
        };

        public abstract update(sDelta: number, game: Game);

        public abstract isDone(): boolean;
    }

    export class BasicBullet extends BulletObject {
        constructor(
            owner: string,
            width: number,
            height: number,
            spriteSheet: createjs.SpriteSheet,
            initState: string,
            endState: string,
            stateAnimation: Object,
            collXOffset: number,
            collYOffset: number
        ) {
            super(owner, width, height, spriteSheet, initState, endState, stateAnimation, collXOffset, collYOffset);
        };

        public update(sDelta: number, game: Game) {
            var self = this;
            if (self.ending) {
                if (self.currentAnimation === self.endState) {
                    self.done = true;
                }
                return;
            }

            var onCollision = function(clsn) {
                if (self.ending === false) {
                    Mixer.play(Resources.SND_BURN_KEY, false, 0.1);
                    self.ending = true;
                    self.gotoAndPlay("hit");
                    var centX = self.x + self.width / 2;
                    var centY = self.y + self.height / 2;
                    var rad = Resources.TILE_SIZE * 4;
                    for (var rx = centX - rad; rx <= centX + rad; rx += Resources.TILE_SIZE) {
                        for (var ry = centY - rad; ry <= centY + rad; ry += Resources.TILE_SIZE) {
                            var r2 = Math.pow(centX - rx, 2) + Math.pow(centY - ry, 2);
                            var d2 = Math.pow(rad, 2);
                            if (r2 <= d2) {
                                game.world.render.dig(rx, ry);
                            }
                        }
                    }
                };
            };

            var clsnTest;

            if (self.speedy !== 0) {

                var distanceY = self.speedy * sDelta;

                // Nenarazím na překážku?
                clsnTest = game.world.isBoundsInCollision(
                    self.x + self.collXOffset,
                    self.y + self.collYOffset,
                    self.width - self.collXOffset * 2,
                    self.height - self.collYOffset * 2,
                    0,
                    distanceY,
                    function(x: number, y: number) { return game.world.isEnemyHitOrCollision(x, y); }
                );
                if (clsnTest.hit === false) {
                    self.y -= distanceY;
                    if (self.y > game.canvas.height * 2 || self.y < -game.canvas.height) {
                        self.done = true;
                        return;
                    }
                } else {
                    onCollision(clsnTest);
                    return;
                }
            }

            if (self.speedx !== 0) {
                var distanceX = sDelta * self.speedx;

                // Nenarazím na překážku?
                clsnTest = game.world.isBoundsInCollision(
                    self.x + self.collXOffset,
                    self.y + self.collYOffset,
                    self.width - self.collXOffset * 2,
                    self.height - self.collYOffset * 2,
                    distanceX,
                    0,
                    function(x: number, y: number) { return game.world.isEnemyHitOrCollision(x, y); }
                );
                if (clsnTest.hit === false) {
                    self.x -= distanceX;
                    if (self.x > game.canvas.width * 2 || self.x < -game.canvas.width)
                        self.done = true;
                    return;
                } else {
                    onCollision(clsnTest);
                    return;
                }
            }
        }

        public isDone(): boolean {
            return this.done;
        }
    }

}