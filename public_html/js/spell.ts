namespace Lich {

    /**
     * Předek všech Spell definic
     */
    export abstract class SpellDefinition {
        constructor(public key: string) { }

        public abstract cast(
            // iniciátor spell akce
            owner: string,
            // souřadnice odkud je akce iniciována
            xCast: number,
            yCast: number,
            // kam je akce namířena
            xAim: number,
            yAim: number,
            // game kontext
            game: Game
        )
            // zdařil se cast?
            : boolean;
    }

    /**
     * Předek všech základních BulletSpell definic, které vystřelují jeden
     * projektil, který letí, dopadne a zmizí
     */
    export abstract class BulletSpellDef extends SpellDefinition {

        static FRAME_WIDTH = 60;
        static FRAME_HEIGHT = 60;
        static COLLXOFFSET = 20;
        static COLLYOFFSET = 20;

        constructor(
            key: string,
            private castSoundKey: string,
            public hitSoundKey: string,
            public speed: number,
            public spriteKey: string
        ) {
            super(key);
        }

        public cast(owner: string, xCast: number, yCast: number, xAim: number, yAim: number, game: Game): boolean {
            var self = this;
            var b = xAim - xCast;
            var a = yAim - yCast;
            var c = Math.sqrt(a * a + b * b);

            var sheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [Resources.INSTANCE.getImage(self.spriteKey)],
                "frames": {
                    "regX": 0,
                    "height": BulletSpellDef.FRAME_HEIGHT,
                    "count": 5,
                    "regY": 0,
                    "width": BulletSpellDef.FRAME_WIDTH
                },
                "animations": {
                    "fly": [0, 0, "fly", 1],
                    "hit": [1, 4, "done", 0.3],
                    "done": [4, 4, "done", 1]
                }
            });

            var object = new BasicBullet(
                owner,
                BulletSpellDef.FRAME_HEIGHT,
                BulletSpellDef.FRAME_WIDTH,
                sheet,
                "fly",
                {
                    "fly": "fly",
                    "hit": "hit",
                    "done": "done"
                },
                BulletSpellDef.COLLXOFFSET,
                BulletSpellDef.COLLYOFFSET
            );

            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            object.speedx = -self.speed * b / c;
            object.speedy = -self.speed * a / c;

            // Tohle by bylo fajn, aby si udělala strana volajícího, ale v rámci 
            // obecnosti cast metody to zatím nechávám celé v režii cast metody
            game.world.bulletObjects.push(object);
            game.world.addChild(object);
            object.x = xCast - object.width / 2;
            object.y = yCast - object.height / 2;

            Mixer.play(self.castSoundKey, false, 0.2);
            return true;
        }
    }

    export class FireballSpellDef extends BulletSpellDef {
        static SPEED = 1500;

        constructor() {
            super(
                Resources.SPELL_FIREBALL_KEY,
                Resources.SND_BURN_KEY,
                Resources.SND_FIREBALL_KEY,
                FireballSpellDef.SPEED,
                Resources.FIREBALL_ANIMATION_KEY
            );
        }

    }

    /**
     * Předek všech spell definic, které jsou závislé na dosahovém rádiusu od hráče
     */
    export abstract class HeroReachSpellDef extends SpellDefinition {

        constructor(key: string) {
            super(key);
        }

        public abstract castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean;

        public cast(owner: string, xCast: number, yCast: number, xAim: number, yAim: number, game: Game): boolean {

            // tady trochu zahazuju parametry, protože reach spells jsou speciálně pro hráče

            // dosahem omezená akce -- musí se počítat v tiles, aby nedošlo ke kontrole 
            // na pixel vzdálenost, která je ok, ale při změně cílové tile se celková 
            // změna projeví i na pixel místech, kde už je například kolize
            var world = game.world;
            var hero = world.hero;
            var heroCoordTL = world.render.pixelsToEvenTiles(hero.x + hero.collXOffset, hero.y + hero.collYOffset);
            var heroCoordTR = world.render.pixelsToEvenTiles(hero.x + hero.width - hero.collXOffset, hero.y + hero.collYOffset);
            var heroCoordBR = world.render.pixelsToEvenTiles(hero.x + hero.width - hero.collXOffset, hero.y + hero.height - hero.collYOffset);
            var heroCoordBL = world.render.pixelsToEvenTiles(hero.x + hero.collXOffset, hero.y + hero.height - hero.collYOffset);
            var mouseCoord = world.render.pixelsToEvenTiles(xAim, yAim);
            // kontroluj rádius od každého rohu
            if (Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTL.x, heroCoordTL.y) < Resources.REACH_TILES_RADIUS
                || Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTR.x, heroCoordTR.y) < Resources.REACH_TILES_RADIUS
                || Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBR.x, heroCoordBR.y) < Resources.REACH_TILES_RADIUS
                || Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBL.x, heroCoordBL.y) < Resources.REACH_TILES_RADIUS) {

                // ok, proveď cast
                return this.castOnReach(xAim, yAim, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game);
            }

            return false;
        }
    }

    export class DigSpellDef extends HeroReachSpellDef {

        constructor() {
            super(Resources.SPELL_DIG_KEY);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            if (game.world.render.dig(xAim, yAim)) {
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        Mixer.play(Resources.SND_PICK_AXE_1_KEY);
                        break;
                    case 1:
                        Mixer.play(Resources.SND_PICK_AXE_2_KEY);
                        break;
                    case 2:
                        Mixer.play(Resources.SND_PICK_AXE_3_KEY);
                        break;
                }
                return true;
            }
            return false;
        }
    }

    export class PlaceSpellDef extends HeroReachSpellDef {

        constructor() {
            super(Resources.SPELL_PLACE_KEY);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            var uiItem = game.ui.inventoryUI.choosenItem;
            if ((mouseCoord.x > heroCoordBR.x || mouseCoord.x < heroCoordTL.x ||
                mouseCoord.y > heroCoordBR.y || mouseCoord.y < heroCoordTL.y) &&
                game.world.render.place(xAim, yAim, uiItem)) {
                Mixer.play(Resources.SND_PLACE_KEY);
                game.ui.inventoryUI.decrease(uiItem, 1);
                return true;
            }
            return false;
        }
    }
}