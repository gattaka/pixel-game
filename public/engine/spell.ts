namespace Lich {

    /**
     * Předek všech Spell definic
     */
    export abstract class SpellDefinition {
        constructor(
            // id spellu
            public key: SpellKey,
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
            key: SpellKey,
            cost: number,
            cooldown: number,
            public castSoundKey: SoundKey,
            public hitSoundKey: SoundKey,
            public speed: number,
            public spriteKey: AnimationKey,
            public destroyMap: boolean,
            public piercing: boolean,
            public damage: number,
            private radius?: number
        ) {
            super(key, cost, cooldown);
        }

        protected getFrameWidth(): number {
            return BulletSpellDef.FRAME_WIDTH;
        }

        protected getFrameHeight(): number {
            return BulletSpellDef.FRAME_HEIGHT;
        }

        protected adjustObjectSpeed(xCast: number, yCast: number, xAim: number, yAim: number, object: AbstractWorldObject) {
            var b = xAim - xCast;
            var a = yAim - yCast;
            var c = Math.sqrt(a * a + b * b);

            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            object.speedx = -this.speed * b / c;
            object.speedy = -this.speed * a / c;
        }

        public cast(owner: string, xCast: number, yCast: number, xAim: number, yAim: number, game: Game): boolean {
            var self = this;

            var sheet = new createjs.SpriteSheet({
                framerate: 30,
                "images": [Resources.getInstance().getImage(AnimationKey[self.spriteKey])],
                "frames": {
                    "regX": 0,
                    "height": self.getFrameHeight(),
                    "count": 5,
                    "regY": 0,
                    "width": self.getFrameWidth()
                },
                "animations": {
                    "fly": [0, 0, "fly", 1],
                    "hit": [1, 4, "done", 0.3],
                    "done": [4, 4, "done", 1]
                }
            });

            var object = new BasicBullet(
                owner,
                self.getFrameWidth(),
                self.getFrameHeight(),
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
                self.damage,
                self.radius
            );

            self.adjustObjectSpeed(xCast, yCast, xAim, yAim, object);

            // Tohle by bylo fajn, aby si udělala strana volajícího, ale v rámci 
            // obecnosti cast metody to zatím nechávám celé v režii cast metody
            game.getWorld().bulletObjects.push(object);
            game.getWorld().addChild(object);
            object.x = xCast - object.width / 2;
            object.y = yCast - object.height / 2;

            Mixer.playSound(self.castSoundKey, false, 0.2);
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
        static RADIUS = 4;

        constructor() {
            super(
                SpellKey.SPELL_FIREBALL_KEY,
                FireballSpellDef.COST,
                FireballSpellDef.COOLDOWN,
                SoundKey.SND_FIREBALL_KEY,
                SoundKey.SND_BURN_KEY,
                FireballSpellDef.SPEED,
                AnimationKey.FIREBALL_ANIMATION_KEY,
                FireballSpellDef.MAP_DESTROY,
                FireballSpellDef.PIERCING,
                FireballSpellDef.DAMAGE,
                FireballSpellDef.RADIUS
            );
        }

    }

    /**
     * Spell meteoritu, který ničí i povrch
     */
    export class MeteorSpellDef extends BulletSpellDef {
        static SPEED = 1500;
        static MAP_DESTROY = true;
        static PIERCING = true;
        static DAMAGE = 50;
        static COOLDOWN = 200;
        static COST = 10;
        static RADIUS = 10;

        static FRAME_WIDTH = 120;
        static FRAME_HEIGHT = 120;

        protected getFrameWidth(): number {
            return MeteorSpellDef.FRAME_WIDTH;
        }

        protected getFrameHeight(): number {
            return MeteorSpellDef.FRAME_HEIGHT;
        }

        public cast(owner: string, xCast: number, yCast: number, xAim: number, yAim: number, game: Game): boolean {
            let a = yAim;
            let b = Math.tan(Math.PI / 6) * a;
            return super.cast(owner, xAim + b - (Math.floor(Math.random() * 2) * b * 2), 0, xAim, yAim, game);
        }

        constructor() {
            super(
                SpellKey.SPELL_METEOR_KEY,
                MeteorSpellDef.COST,
                MeteorSpellDef.COOLDOWN,
                SoundKey.SND_METEOR_FALL_KEY,
                SoundKey.SND_METEOR_HIT_KEY,
                MeteorSpellDef.SPEED,
                AnimationKey.METEOR_ANIMATION_KEY,
                MeteorSpellDef.MAP_DESTROY,
                MeteorSpellDef.PIERCING,
                MeteorSpellDef.DAMAGE,
                MeteorSpellDef.RADIUS
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
                SpellKey.SPELL_BOLT_KEY,
                BoltSpellDef.COST,
                BoltSpellDef.COOLDOWN,
                SoundKey.SND_BOLT_CAST,
                SoundKey.SND_FIREBALL_KEY,
                BoltSpellDef.SPEED,
                AnimationKey.BOLT_ANIMATION_KEY,
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

        constructor(key: SpellKey, cost: number, cooldown: number) {
            super(key, cost, cooldown);
        }

        public abstract castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean;

        public cast(owner: string, xCast: number, yCast: number, xAim: number, yAim: number, game: Game): boolean {

            // tady trochu zahazuju parametry, protože reach spells jsou speciálně pro hráče

            // dosahem omezená akce -- musí se počítat v tiles, aby nedošlo ke kontrole 
            // na pixel vzdálenost, která je ok, ale při změně cílové tile se celková 
            // změna projeví i na pixel místech, kde už je například kolize
            var world = game.getWorld();
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
            super(SpellKey.SPELL_INTERACT_KEY, 0, MapObjectsInteractionSpellDef.COOLDOWN);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            return game.getWorld().render.interact(xAim, yAim);
        }
    }

    /**
     * Spell pro vykopávání objektů a povrchů z mapy
     */
    export abstract class AbstractDigSpellDef extends HeroReachSpellDef {

        static COOLDOWN = 100;

        constructor(key: SpellKey,
            // kope se povrch jako podklad?
            private asBackground) {
            super(key, 0, AbstractDigSpellDef.COOLDOWN);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            if (game.getWorld().render.dig(xAim, yAim, this.asBackground)) {
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        Mixer.playSound(SoundKey.SND_PICK_AXE_1_KEY);
                        break;
                    case 1:
                        Mixer.playSound(SoundKey.SND_PICK_AXE_2_KEY);
                        break;
                    case 2:
                        Mixer.playSound(SoundKey.SND_PICK_AXE_3_KEY);
                        break;
                }
                return true;
            }
            return false;
        }
    }

    export class DigSpellDef extends AbstractDigSpellDef {
        constructor() {
            super(SpellKey.SPELL_DIG_KEY, false);
        }
    }

    export class DigBgrSpellDef extends AbstractDigSpellDef {
        constructor() {
            super(SpellKey.SPELL_DIG_BGR_KEY, true);
        }
    }

    /**
     * Spell pro pokládání objektů a povrchů z inventáře
     */
    export abstract class AbstractPlaceSpellDef extends HeroReachSpellDef {

        static COOLDOWN = 100;

        constructor(
            key: SpellKey,
            // pokládá se povrch/objekt jako podklad/alterantiva?
            private alternative
        ) {
            super(key, 0, AbstractPlaceSpellDef.COOLDOWN);
        }

        public castOnReach(xAim: number, yAim: number, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game: Game): boolean {
            var uiItem = game.getUI().inventoryUI.choosenItem;
            var object: InvObjDefinition = Resources.getInstance().invObjectDefs[uiItem];
            // je co pokládat?
            if (typeof object !== "undefined" && object != null) {
                // pokud vkládám povrch, kontroluj, zda nekoliduju s hráčem
                if (this.alternative == false && object.mapSurface != null) {
                    if (mouseCoord.x <= heroCoordBR.x && mouseCoord.x >= heroCoordTL.x &&
                        mouseCoord.y <= heroCoordBR.y && mouseCoord.y >= heroCoordTL.y) {
                        // koliduju s hráčem
                        return false;
                    }
                }
                // pokud vkládám objekt nebo pozadí povrchu, je to jedno, zda koliduju s hráčem
                if (game.getWorld().render.place(xAim, yAim, object, this.alternative)) {
                    Mixer.playSound(SoundKey.SND_PLACE_KEY);
                    game.getUI().inventoryUI.invRemove(uiItem, 1);
                    return true;
                }
                return false;
            }
        }
    }

    export class PlaceSpellDef extends AbstractPlaceSpellDef {
        constructor() {
            super(SpellKey.SPELL_PLACE_KEY, false);
        }
    }

    export class PlaceBgrSpellDef extends AbstractPlaceSpellDef {
        constructor() {
            super(SpellKey.SPELL_PLACE_BGR_KEY, true);
        }
    }

    /**
     * Spawn nepřátel (development spell)
     */

    export class EnemySpellDef extends SpellDefinition {

        constructor() {
            super(SpellKey.SPELL_ENEMY_KEY, 0, 200);
        }

        public cast(owner: string, xCast: number, yCast: number, xAim: number, yAim: number, game: Game): boolean {

            Mixer.playSound(SoundKey.SND_SPAWN_KEY);

            // maximálně 4 najednou
            var batch = Math.random() * 10;
            for (var e = 0; e < batch; e++) {
                var enemy = new Enemy();
                game.getWorld().enemies.push(enemy);
                game.getWorld().addChild(enemy);
                if (Math.random() > 0.5 && game.getWorld().render.canShiftX(-enemy.width * 2) || game.getWorld().render.canShiftX(enemy.width * 2) == false) {
                    enemy.x = game.getCanvas().width + enemy.width * (Math.random() + 1);
                } else {
                    enemy.x = -enemy.width * (Math.random() + 1);
                }
                enemy.y = game.getCanvas().height / 2;
            }

            return true;
        }
    }
}