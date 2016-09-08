namespace Lich {

    /**
     * Předek všech Spell definic
     */
    export abstract class SpellDefinition {
        constructor(
            // id spellu
            public key: string,
            // náročnost na will
            public cost: number,
            // prodleva před dalším použitím
            public cooldown: number
        ) { }

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
            cost: number,
            cooldown: number,
            public castSoundKey: string,
            public hitSoundKey: string,
            public speed: number,
            public spriteKey: string,
            public destroyMap: boolean,
            public piercing: boolean,
            public damage: number
        ) {
            super(key, cost, cooldown);
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
                "done",
                {
                    "fly": "fly",
                    "hit": "hit",
                    "done": "done"
                },
                BulletSpellDef.COLLXOFFSET,
                BulletSpellDef.COLLYOFFSET,
                self.hitSoundKey,
                self.destroyMap,
                self.piercing,
                self.damage
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

    /**
     * Spell ohnivé koule, která ničí i povrch
     */
    export class FireballSpellDef extends BulletSpellDef {
        static SPEED = 1500;
        static MAP_DESTROY = true;
        static PIERCING = true;
        static DAMAGE = 50;
        static COOLDOWN = 200;
        static COST = 10;

        constructor() {
            super(
                Resources.SPELL_FIREBALL_KEY,
                FireballSpellDef.COST,
                FireballSpellDef.COOLDOWN,
                Resources.SND_BURN_KEY,
                Resources.SND_FIREBALL_KEY,
                FireballSpellDef.SPEED,
                Resources.FIREBALL_ANIMATION_KEY,
                FireballSpellDef.MAP_DESTROY,
                FireballSpellDef.PIERCING,
                FireballSpellDef.DAMAGE
            );
        }

    }

    /**
     * Spell mana-boltu, který neničí povrch
     */
    export class BoltSpellDef extends BulletSpellDef {
        static SPEED = 1500;
        static MAP_DESTROY = false;
        static PIERCING = false;
        static DAMAGE = 30;
        static COOLDOWN = 100;
        static COST = 2;

        constructor() {
            super(
                Resources.SPELL_BOLT_KEY,
                BoltSpellDef.COST,
                BoltSpellDef.COOLDOWN,
                Resources.SND_BOLT_CAST,
                Resources.SND_FIREBALL_KEY,
                BoltSpellDef.SPEED,
                Resources.BOLT_ANIMATION_KEY,
                BoltSpellDef.MAP_DESTROY,
                BoltSpellDef.PIERCING,
                BoltSpellDef.DAMAGE
            );
        }

    }

    /**
     * Předek všech spell definic, které jsou závislé na dosahovém rádiusu od hráče
     */
    export abstract class HeroReachSpellDef extends SpellDefinition {

        constructor(key: string, cost: number, cooldown: number) {
            super(key, cost, cooldown);
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

    /**
     * Spell pro interakci objektů a povrchů z mapy
     */
    export class MapObjectsInteractionSpellDef extends HeroReachSpellDef {

        static COOLDOWN = 200;

        constructor() {
            super(Resources.SPELL_INTERACT_KEY, 0, MapObjectsInteractionSpellDef.COOLDOWN);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            return game.world.render.interact(xAim, yAim);
        }
    }

    /**
     * Spell pro vykopávání objektů a povrchů z mapy
     */
    export abstract class AbstractDigSpellDef extends HeroReachSpellDef {

        static COOLDOWN = 100;

        constructor(key: string,
            // kope se povrch jako podklad?
            private asBackground) {
            super(key, 0, AbstractDigSpellDef.COOLDOWN);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            if (game.world.render.dig(xAim, yAim, this.asBackground)) {
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

    export class DigSpellDef extends AbstractDigSpellDef {
        constructor() {
            super(Resources.SPELL_DIG_KEY, false);
        }
    }

    export class DigBgrSpellDef extends AbstractDigSpellDef {
        constructor() {
            super(Resources.SPELL_DIG_BGR_KEY, true);
        }
    }

    /**
     * Spell pro pokládání objektů a povrchů z inventáře
     */
    export abstract class AbstractPlaceSpellDef extends HeroReachSpellDef {

        static COOLDOWN = 100;

        constructor(
            key: string,
            // pokládá se povrch jako podklad?
            private asBackground
        ) {
            super(key, 0, AbstractPlaceSpellDef.COOLDOWN);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            var uiItem = game.ui.inventoryUI.choosenItem;
            var object: InvObjDefinition = Resources.INSTANCE.invObjectDefs[uiItem];
            // je co pokládat?
            if (typeof object !== "undefined" && object != null) {
                // pokud vkládám povrch, kontroluj, zda nekoliduju s hráčem
                if (this.asBackground == false && object.mapSurface != null) {
                    if (mouseCoord.x <= heroCoordBR.x && mouseCoord.x >= heroCoordTL.x &&
                        mouseCoord.y <= heroCoordBR.y && mouseCoord.y >= heroCoordTL.y) {
                        // koliduju s hráčem
                        return false;
                    }
                }
                // pokud vkládám objekt nebo pozadí povrchu, je to jedno, zda koliduju s hráčem
                if (game.world.render.place(xAim, yAim, object, this.asBackground)) {
                    Mixer.play(Resources.SND_PLACE_KEY);
                    game.ui.inventoryUI.decrease(uiItem, 1);
                    return true;
                }
                return false;
            }
        }
    }

    export class PlaceSpellDef extends AbstractPlaceSpellDef {
        constructor() {
            super(Resources.SPELL_PLACE_KEY, false);
        }
    }

    export class PlaceBgrSpellDef extends AbstractPlaceSpellDef {
        constructor() {
            super(Resources.SPELL_PLACE_BGR_KEY, true);
        }
    }

    /**
     * Spawn nepřátel (development spell)
     */

    export class EnemySpellDef extends SpellDefinition {

        constructor() {
            super(Resources.SPELL_ENEMY_KEY, 0, 200);
        }

        public cast(owner: string, xCast: number, yCast: number, xAim: number, yAim: number, game: Game): boolean {

            Mixer.play(Resources.SND_SPAWN_KEY);

            // maximálně 4 najednou
            var batch = Math.random() * 10;
            for (var e = 0; e < batch; e++) {
                var enemy = new Enemy();
                game.world.enemies.push(enemy);
                game.world.addChild(enemy);
                if (Math.random() > 0.5 && game.world.render.canShiftX(-enemy.width * 2) || game.world.render.canShiftX(enemy.width * 2) == false) {
                    enemy.x = game.canvas.width + enemy.width * (Math.random() + 1);
                } else {
                    enemy.x = -enemy.width * (Math.random() + 1);
                }
                enemy.y = game.canvas.height / 2;
            }

            return true;
        }
    }
}