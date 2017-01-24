namespace Lich {

    /**
     * Informace, které se hodí při provádění spell 
     */
    export class SpellContext {
        constructor(
            // kdo spell vyvolal
            public owner: string,
            // souřadnice, odkud je spell vyvolán
            public xCast: number,
            public yCast: number,
            // souřadnice, kam je spell namířen
            public xAim: number,
            public yAim: number,
            // game 
            public game: Game) {
        }
    }

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

        // Zkusí provést cast a vrátit, zda se to povedlo
        public abstract cast(context: SpellContext): boolean;

    }

    /**
     * Předek všech základních BulletSpell definic, které vystřelují jeden
     * projektil, který letí, dopadne a zmizí
     */
    export abstract class BulletSpellDef extends SpellDefinition {

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
            private radius?: number,
            private frameWidth = 60,
            private frameHeight = 60,
            private colloffsetX = 20,
            private colloffsetY = 20,
            private framesCount = 5,
            private frameAnimations = {
                "fly": [0, 0, "fly", 1],
                "hit": [1, 4, "done", 0.3],
                "done": [4, 4, "done", 1]
            }
        ) {
            super(key, cost, cooldown);
        }

        protected adjustObjectSpeed(context: SpellContext, object: AbstractWorldObject) {
            var b = context.xAim - context.xCast;
            var a = context.yAim - context.yCast;
            var c = Math.sqrt(a * a + b * b);

            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            object.speedx = -this.speed * b / c;
            object.speedy = -this.speed * a / c;
        }

        public cast(context: SpellContext): boolean {
            var self = this;

            var sheet = new createjs.SpriteSheet({
                framerate: 30,
                "images": [Resources.getInstance().getImage(AnimationKey[self.spriteKey])],
                "frames": {
                    "regX": 0,
                    "height": self.frameHeight,
                    "count": self.framesCount,
                    "regY": 0,
                    "width": self.frameWidth
                },
                "animations": self.frameAnimations
            });

            var object = new BasicBullet(
                context.owner,
                self.frameWidth,
                self.frameHeight,
                sheet,
                "fly",
                "done",
                self.colloffsetX,
                self.colloffsetY,
                self.hitSoundKey,
                self.destroyMap,
                self.piercing,
                self.damage,
                self.radius
            );

            // nastaví X a Y složku rychlosti dle směru
            self.adjustObjectSpeed(context, object);

            // Tohle by bylo fajn, aby si udělala strana volajícího, ale v rámci 
            // obecnosti cast metody to zatím nechávám celé v režii cast metody
            context.game.getWorld().bulletObjects.push(object);
            context.game.getWorld().addChild(object);
            object.x = context.xCast - object.width / 2;
            object.y = context.yCast - object.height / 2;

            Mixer.playSound(self.castSoundKey, 0.2);
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

        public cast(context: SpellContext): boolean {
            let a = context.yAim;
            let b = Math.tan(Math.PI / 6) * a;
            context.xCast = context.xAim + b - (Math.floor(Math.random() * 2) * b * 2);
            context.yCast = 0;
            return super.cast(context);
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
                MeteorSpellDef.RADIUS,
                MeteorSpellDef.FRAME_WIDTH,
                MeteorSpellDef.FRAME_HEIGHT
            );
        }

    }

    /**
     * AbstractLoveSpellDef
     */
    export abstract class AbstractLoveSpellDef extends BulletSpellDef {
        constructor(spellKey: SpellKey, animationKey: AnimationKey, damage: number) {
            super(
                spellKey, // SpellKey
                10, // cost
                200, // COOLDOWN
                SoundKey.SND_BOLT_CAST, // castSoundKey
                SoundKey.SND_BURN_KEY, // hitSoundKey
                1000, // speed
                animationKey, // spriteKey
                false, // destroyMap
                false, // piercing
                damage, // damage
                1, // radius
                32, // frameWidth
                32, // frameHeight 
                10, // colloffsetX 
                10, // colloffsetY 
                6, // framesCount 
                {
                    "fly": [0, 0, "fly", 1],
                    "hit": [1, 5, "done", 0.3],
                    "done": [5, 5, "done", 1]
                } //  frameAnimations 
            );
        }
    }

    /**
     * LoveletterSpellDef
     */
    export class LoveletterSpellDef extends AbstractLoveSpellDef {
        constructor() {
            super(
                SpellKey.SPELL_LOVELETTER, // SpellKey
                AnimationKey.LOVELETTER_ANIMATION_KEY, // spriteKey
                2, // damage
            );
        }
    }

    /**
     * LovearrowSpellDef
     */
    export class LovearrowSpellDef extends AbstractLoveSpellDef {
        constructor() {
            super(
                SpellKey.SPELL_LOVEARROW, // SpellKey
                AnimationKey.LOVEARROW_ANIMATION_KEY, // spriteKey
                5, // damage
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

        public abstract castOnReach(context: SpellContext, reachInfo: ReachInfo): boolean;

        public cast(context: SpellContext): boolean {
            // kontroluj rádius od každého rohu
            let world = context.game.getWorld();
            let info: ReachInfo = world.checkReach(world.hero, context.xAim, context.yAim);
            if (info.inReach) {
                // ok, proveď cast
                return this.castOnReach(context, info);
            }

            return false;
        }
    }

    /**
     * Spell konzumace
     */
    export class UseItemSpellDef extends SpellDefinition {

        static COOLDOWN = 200;
        static COST = 0;

        constructor() {
            super(SpellKey.SPELL_USE_ITEM_KEY, UseItemSpellDef.COST, UseItemSpellDef.COOLDOWN);
        }

        public cast(context: SpellContext): boolean {
            let world = context.game.getWorld();
            var uiItem = context.game.getUI().inventoryUI.choosenItem;
            if (uiItem) {
                var object: InvObjDefinition = Resources.getInstance().invObjectDefs[uiItem];
                if (object.consumeAction) {
                    if (object.consumeAction(world)) {
                        context.game.getUI().inventoryUI.invRemove(uiItem, 1);
                        return true;
                    }
                }
            }
            return false;
        }
    }

    /**
     * Teleportační spell
     */
    export class TeleportSpellDef extends SpellDefinition {

        static COOLDOWN = 200;
        static COST = 20;

        constructor() {
            super(SpellKey.SPELL_TELEPORT_KEY, TeleportSpellDef.COST, TeleportSpellDef.COOLDOWN);
        }

        public cast(context: SpellContext): boolean {
            let world = context.game.getWorld();
            Mixer.playSound(SoundKey.SND_TELEPORT_KEY);
            world.hero.performState(Hero.TELEPORT);
            // world.placePlayerOnSpawnPoint();
            setTimeout(() => {
                world.placePlayerOnSpawnPoint();
            }, 100)
            return true;
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

        public castOnReach(context: SpellContext, reachInfo: ReachInfo): boolean {
            return context.game.getWorld().render.interact(context.xAim, context.yAim);
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

        public castOnReach(context: SpellContext, reachInfo: ReachInfo): boolean {
            if (context.game.getWorld().render.dig(context.xAim, context.yAim, this.asBackground)) {
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

        public castOnReach(context: SpellContext, reachInfo: ReachInfo): boolean {
            var uiItem = context.game.getUI().inventoryUI.choosenItem;
            var object: InvObjDefinition = Resources.getInstance().invObjectDefs[uiItem];
            // je co pokládat?
            if (typeof object !== "undefined" && object != null) {
                // pokud vkládám povrch, kontroluj, zda nekoliduju s hráčem
                if (this.alternative == false && object.mapSurface != null) {
                    if (reachInfo.source.x <= reachInfo.characterCoordBR.x && reachInfo.source.x >= reachInfo.characterCoordTL.x &&
                        reachInfo.source.y <= reachInfo.characterCoordBR.y && reachInfo.source.y >= reachInfo.characterCoordTL.y) {
                        // koliduju s hráčem
                        return false;
                    }
                }
                // pokud vkládám objekt nebo pozadí povrchu, je to jedno, zda koliduju s hráčem
                if (context.game.getWorld().render.place(context.xAim, context.yAim, object, this.alternative)) {
                    Mixer.playSound(SoundKey.SND_PLACE_KEY);
                    context.game.getUI().inventoryUI.invRemove(uiItem, 1);
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

        public cast(context: SpellContext): boolean {
            Mixer.playSound(SoundKey.SND_GHOUL_SPAWN_KEY);

            // SpawnPool.getInstance().spawn(Enemy.CupidBoss, context.game.getWorld());
            EventBus.getInstance().fireEvent(new StringEventPayload(EventType.ACHIEVEMENT_DONE, AchievementKey[AchievementKey.ACHV_LOVE_HURTS]));

            return true;
        }
    }
}