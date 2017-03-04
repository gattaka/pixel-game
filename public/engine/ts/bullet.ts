namespace Lich {

    export abstract class AbstractWorldObject extends PIXI.Container {

        public speedx: number = 0;
        public speedy: number = 0;
        protected sprite: PIXI.Sprite | AniSprite;

        constructor(
            public collXOffset: number,
            public collYOffset: number,
            public hovers = false) {
            super();
        }

        private callOnAnisprite(f: (s: AniSprite) => any) {
            if (this.sprite instanceof AniSprite)
                f(<AniSprite>this.sprite);
        }

        play() { this.callOnAnisprite((s: AniSprite) => { s.play() }); }
        stop() { this.callOnAnisprite((s: AniSprite) => { s.stop() }); }
        gotoAndPlay(desiredState: string) { this.callOnAnisprite((s: AniSprite) => { s.gotoAndPlay(desiredState) }); }
        getCurrentAnimation(): string {
            let currentAnimation;
            this.callOnAnisprite((s: AniSprite) => {
                currentAnimation = s.currentAnimation;
            });
            return currentAnimation;
        }

        performAnimation(desiredAnimation: AnimationKey) {
            var self = this;
            this.callOnAnisprite((s: AniSprite) => {
                let stringKey = AnimationKey[desiredAnimation];
                if (s.currentAnimation !== stringKey) {
                    s.gotoAndPlay(stringKey);
                }
            });
        }

        updateAnimations() { };

    }

    export abstract class BulletObject extends AbstractWorldObject {

        // pouští se koncová animace?
        protected ending: boolean = false;
        // je vše ukončeno (doběhla i koncová animace)?
        public done: boolean = false;

        // jak dlouho se musí počkat, než se započítá další damage piercing projektilu?
        public static PIERCING_TIMEOUT = 1000;
        // mapa nepřátel a jejich timeoutů do dalšího zásahu tímto projektilem
        // není možné globálně počítat timeout, protože by nastavení timeoutu
        // zásahem jednoho nepřítele mohlo způsobit nezapočítání prvního 
        // zásahu jiného nepřítele, který je těsném závěsu za zasaženým
        public enemyPiercingTimeouts: { [k: string]: number } = {};

        constructor(
            // čí je to střela
            public owner: string,
            // sada animací, ze které sřela je
            private animationSetKey: AnimationSetKey,
            // kolizní tolerance
            public collXOffset: number,
            public collYOffset: number,
            // zvuk dopadu
            public hitSound: SoundKey,
            // ničí střela i mapu (povrch/objekty)
            public mapDestroy: boolean,
            // škodí střela více cílům najednou
            public piercing: boolean,
            // kolik střela ubírá
            public damage: number
        ) {
            super(collXOffset, collYOffset);

            let animationDef = Resources.getInstance().animationSetDefsByKey[this.animationSetKey];
            this.fixedWidth = animationDef.width;
            this.fixedHeight = animationDef.height;
            this.sprite = Resources.getInstance().getAnimatedObjectSprite(animationDef.animationSetKey);
            this.addChild(this.sprite);
        };

        public abstract update(sDelta: number, game: Game);

        public abstract isDone(): boolean;

    }

    export class BasicBullet extends BulletObject {
        constructor(
            owner: string,
            animationSetKey: AnimationSetKey,
            collXOffset: number,
            collYOffset: number,
            hitSoundKey: SoundKey,
            mapDestroy: boolean,
            piercing: boolean,
            damage: number,
            private radius?: number,
        ) {
            super(owner, animationSetKey, collXOffset, collYOffset, hitSoundKey, mapDestroy, piercing, damage);
        };

        public update(sDelta: number, game: Game) {
            var self: BasicBullet = this;
            if (self.ending) {
                if (self.getCurrentAnimation() === AnimationKey[AnimationKey.ANM_BULLET_DONE_KEY]) {
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
            var hitTargetOrCollide = function (x: number, y: number): CollisionTestResult {
                var targetRet = null;
                let targets = new Array<Character>();
                targets = targets.concat(game.getWorld().enemies);
                targets.push(game.getWorld().hero);
                for (var t = 0; t < targets.length; t++) {
                    var target = targets[t];
                    if (target) {
                        if (target.getCurrentHealth() > 0
                            && x > target.x && x < target.x + target.fixedWidth
                            && y > target.y && y < target.y + target.fixedHeight
                            && target.ownerId != self.owner
                            && (target.ownerId == Hero.OWNER_ID || self.owner == Hero.OWNER_ID)) {
                            // => CollisionType.SOLID -- takže hned dojde k ukončení isBoundsInCollision
                            targetRet = new CollisionTestResult(true, x, y);

                            if (self.piercing) {
                                let uuid = target.uuid;
                                let targetTimeout = self.enemyPiercingTimeouts[uuid];
                                if (!targetTimeout || targetTimeout < 0) {
                                    // proveď -- nemá ještě timeout nebo už má odčekáno
                                    self.enemyPiercingTimeouts[uuid] = BulletObject.PIERCING_TIMEOUT;
                                    target.hit(self.damage, game.getWorld());
                                } else {
                                    // čekej
                                    self.enemyPiercingTimeouts[uuid] -= sDelta;
                                    // tenhle čeká, další poteciální cíl
                                    continue;
                                }
                            } else {
                                // není piercing -- jeden zásah je konec projektilu
                                target.hit(self.damage, game.getWorld());
                                break;
                            }
                        }
                    }
                }
                if (targetRet == null || self.piercing) {
                    return game.getWorld().isCollision(x, y);
                } else {
                    return targetRet;
                }
            };

            var onCollision = function (clsn) {
                if (self.ending === false) {
                    Mixer.playSound(self.hitSound, 0.1);
                    self.ending = true;
                    self.gotoAndPlay(AnimationKey[AnimationKey.ANM_BULLET_HIT_KEY]);

                    if (self.mapDestroy) {
                        var centX = self.x + self.fixedWidth / 2;
                        var centY = self.y + self.fixedHeight / 2;
                        var rad = Resources.TILE_SIZE * self.radius;
                        for (var rx = centX - rad; rx <= centX + rad; rx += Resources.TILE_SIZE) {
                            for (var ry = centY - rad; ry <= centY + rad; ry += Resources.TILE_SIZE) {
                                var r2 = Math.pow(centX - rx, 2) + Math.pow(centY - ry, 2);
                                var d2 = Math.pow(rad, 2);
                                if (r2 <= d2) {
                                    game.getWorld().render.dig(rx, ry, false);
                                }
                            }
                        }
                    }
                };
            };

            var clsnTest;

            if (self.speedy !== 0) {

                var distanceY = self.speedy * sDelta;

                // Nenarazím na překážku?
                clsnTest = game.getWorld().isBoundsInCollision(
                    self.x + self.collXOffset,
                    self.y + self.collYOffset,
                    self.fixedWidth - self.collXOffset * 2,
                    self.fixedHeight - self.collYOffset * 2,
                    0,
                    distanceY,
                    function (x: number, y: number) { return hitTargetOrCollide(x, y); },
                    true
                );
                if (clsnTest.hit === false) {
                    self.y -= distanceY;
                    if (self.y > game.getSceneHeight() * 2 || self.y < -game.getSceneHeight()) {
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
                clsnTest = game.getWorld().isBoundsInCollision(
                    self.x + self.collXOffset,
                    self.y + self.collYOffset,
                    self.fixedWidth - self.collXOffset * 2,
                    self.fixedHeight - self.collYOffset * 2,
                    distanceX,
                    0,
                    function (x: number, y: number) { return hitTargetOrCollide(x, y); },
                    true
                );
                if (clsnTest.hit === false) {
                    self.x -= distanceX;
                    if (self.x > game.getSceneWidth() * 2 || self.x < -game.getSceneWidth())
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