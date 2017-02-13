namespace Lich {

    export abstract class AbstractWorldObject extends createjs.SpriteContainer {

        public speedx: number = 0;
        public speedy: number = 0;
        protected sprite: createjs.Sprite;

        protected abstract initSprite();

        constructor(
            public collXOffset: number,
            public collYOffset: number,
            public hovers = false) {
            super();
        }

        play() { this.sprite.play(); }
        stop() { this.sprite.stop(); }
        gotoAndPlay(desiredState: string) { this.sprite.gotoAndPlay(desiredState); }
        getCurrentAnimation() { return this.sprite.currentAnimation; }

        performAnimation(desiredAnimation: AnimationKey) {
            var self = this;
            let stringKey = AnimationKey[desiredAnimation];
            if (self.sprite.currentAnimation !== stringKey) {
                self.gotoAndPlay(stringKey);
            }
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

        initSprite() {
            let animationDef = Resources.getInstance().animationsDefs[this.animationSetKey];
            this.width = animationDef.width;
            this.height = animationDef.height;
            this.sprite = Resources.getInstance().getSprite(SpritesheetKey.SPST_OBJECTS_KEY, animationDef.subSpritesheetName);
            this.addChild(this.sprite);
        }

        constructor(
            // čí je to střela
            public owner: string,
            // sada animací, ze které sřela je
            private animationSetKey: AnimationSetKey,
            // počáteční stav animace
            public initAnimation: AnimationKey,
            // koncový stav animace
            public endAnimation: AnimationKey,
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
        };

        public abstract update(sDelta: number, game: Game);

        public abstract isDone(): boolean;
    }

    export class BasicBullet extends BulletObject {
        constructor(
            owner: string,
            animationSetKey: AnimationSetKey,
            initAnimation: AnimationKey,
            endAnimation: AnimationKey,
            collXOffset: number,
            collYOffset: number,
            hitSoundKey: SoundKey,
            mapDestroy: boolean,
            piercing: boolean,
            damage: number,
            private radius?: number,
        ) {
            super(owner, animationSetKey, initAnimation, endAnimation, collXOffset, collYOffset, hitSoundKey, mapDestroy, piercing, damage);
        };

        public update(sDelta: number, game: Game) {
            var self: BasicBullet = this;
            if (self.ending) {
                if (self.sprite.currentAnimation === AnimationKey[self.endAnimation]) {
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
                            && x > target.x && x < target.x + target.width
                            && y > target.y && y < target.y + target.height
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
                    self.sprite.gotoAndPlay("hit");

                    if (self.mapDestroy) {
                        var centX = self.x + self.width / 2;
                        var centY = self.y + self.height / 2;
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
                    self.width - self.collXOffset * 2,
                    self.height - self.collYOffset * 2,
                    0,
                    distanceY,
                    function (x: number, y: number) { return hitTargetOrCollide(x, y); },
                    true
                );
                if (clsnTest.hit === false) {
                    self.y -= distanceY;
                    if (self.y > game.getCanvas().height * 2 || self.y < -game.getCanvas().height) {
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
                    self.width - self.collXOffset * 2,
                    self.height - self.collYOffset * 2,
                    distanceX,
                    0,
                    function (x: number, y: number) { return hitTargetOrCollide(x, y); },
                    true
                );
                if (clsnTest.hit === false) {
                    self.x -= distanceX;
                    if (self.x > game.getCanvas().width * 2 || self.x < -game.getCanvas().width)
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