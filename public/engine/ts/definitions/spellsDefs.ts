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
            // název sprite ikony 
            public icon: UISpriteKey,
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
            icon: UISpriteKey,
            cost: number,
            cooldown: number,
            private animationSetKey: AnimationSetKey,
            public castSoundKey: SoundKey,
            public hitSoundKey: SoundKey,
            public speed: number,
            public destroyMap: boolean,
            public piercing: boolean,
            public damage: number,
            private radius?: number,
            private colloffsetX = 20,
            private colloffsetY = 20,

        ) {
            super(key, icon, cost, cooldown);
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

            var object = new BasicBullet(
                context.owner,
                self.animationSetKey,
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
            context.game.getWorld().entitiesCont.addChild(object);
            object.x = context.xCast - object.fixedWidth / 2;
            object.y = context.yCast - object.fixedHeight / 2;

            Mixer.playSound(self.castSoundKey, 0.2);
            return true;
        }
    }

    /**
     * Spell ohnivé koule, která ničí i povrch
     */
    export class FireballSpellDef extends BulletSpellDef {
        static SPEED = 1500;
        static MAP_DESTROY = false;
        static PIERCING = true;
        static DAMAGE = 50;
        static COOLDOWN = 200;
        static COST = 5;
        static RADIUS = 4;

        constructor() {
            super(
                SpellKey.SPELL_FIREBALL_KEY,
                UISpriteKey.UI_SPL_FIREBALL_KEY,
                FireballSpellDef.COST,
                FireballSpellDef.COOLDOWN,
                AnimationSetKey.FIREBALL_ANIMATION_KEY,
                SoundKey.SND_FIREBALL_KEY,
                SoundKey.SND_BURN_KEY,
                FireballSpellDef.SPEED,
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
                UISpriteKey.UI_SPL_METEOR_KEY,
                10, // COST,
                200, // COOLDOWN,
                AnimationSetKey.METEOR_ANIMATION_KEY,
                SoundKey.SND_METEOR_FALL_KEY,
                SoundKey.SND_METEOR_HIT_KEY,
                1500, // SPEED,
                true, // MAP_DESTROY,
                true, // PIERCING,
                50, // DAMAGE
                10 // RADIUS,
            );
        }

    }

    /**
     * AbstractLoveSpellDef
     */
    export abstract class AbstractLoveSpellDef extends BulletSpellDef {
        constructor(
            spellKey: SpellKey,
            icon: UISpriteKey,
            animationSetKey: AnimationSetKey,
            damage: number) {
            super(
                spellKey, // SpellKey
                icon,
                10, // COST
                200, // COOLDOWN
                animationSetKey,
                SoundKey.SND_BOLT_CAST_KEY, // castSoundKey
                SoundKey.SND_BURN_KEY, // hitSoundKey
                1000, // speed
                false, // destroyMap
                false, // piercing
                damage, // damage
                1, // radius
                10, // colloffsetX 
                10, // colloffsetY 
            );
        }
    }

    /**
     * LoveletterSpellDef
     */
    export class LoveletterSpellDef extends AbstractLoveSpellDef {
        constructor() {
            super(
                SpellKey.SPELL_LOVELETTER_KEY, // SpellKey
                UISpriteKey.UI_SPL_LOVELETTER_KEY,
                AnimationSetKey.LOVELETTER_ANIMATION_KEY, // spriteKey
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
                SpellKey.SPELL_LOVEARROW_KEY, // SpellKey
                UISpriteKey.UI_SPL_LOVEARROW_KEY,
                AnimationSetKey.LOVEARROW_ANIMATION_KEY, // spriteKey
                5, // damage
            );
        }
    }

    /**
     * Spell mana-boltu, který neničí povrch
     */
    export class BoltSpellDef extends BulletSpellDef {

        constructor() {
            super(
                SpellKey.SPELL_ICEBOLT_KEY,
                UISpriteKey.UI_SPL_ICEBOLT_KEY,
                2, // COST,
                100, // COOLDOWN,
                AnimationSetKey.ICEBOLT_ANIMATION_KEY,
                SoundKey.SND_BOLT_CAST_KEY,
                SoundKey.SND_FIREBALL_KEY,
                1500, // SPEED
                false, // MAP_DESTROY,
                false, // PIERCING,
                30 // DAMAGE
            );
        }

    }

    /**
     * Předek všech spell definic, které jsou závislé na dosahovém rádiusu od hráče
     */
    export abstract class HeroReachSpellDef extends SpellDefinition {

        constructor(key: SpellKey, icon: UISpriteKey, cost: number, cooldown: number) {
            super(key, icon, cost, cooldown);
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
            super(SpellKey.SPELL_USE_ITEM_KEY, UISpriteKey.UI_SPL_USE_ITEM_KEY, UseItemSpellDef.COST, UseItemSpellDef.COOLDOWN);
        }

        public cast(context: SpellContext): boolean {
            let world = context.game.getWorld();
            var uiItem = Inventory.getInstance().getChoosenItem();

            if (uiItem) {
                var object: InvObjDefinition = Resources.getInstance().getInvObjectDef(uiItem);
                if (object.consumeAction) {
                    if (object.consumeAction(world)) {
                        Inventory.getInstance().invRemove(uiItem, 1);
                        return true;
                    }
                }
            }
            return false;
        }
    }

    /**
     * Reveal Fog spell
     */
    export class RevealFogSpellDef extends SpellDefinition {

        static COOLDOWN = 0;
        static COST = 0;

        constructor() {
            super(SpellKey.SPELL_REVEAL_FOG_KEY, UISpriteKey.UI_SPL_REVEAL_FOG_KEY, RevealFogSpellDef.COST, RevealFogSpellDef.COOLDOWN);
        }

        public cast(context: SpellContext): boolean {
            return context.game.getWorld().render.revealFog(context.xAim, context.yAim);
        }
    }

    /**
     * Teleportační spell
     */
    export class TeleportSpellDef extends SpellDefinition {

        static COOLDOWN = 200;
        static COST = 2; // DEV cost :)

        constructor() {
            super(SpellKey.SPELL_TELEPORT_KEY, UISpriteKey.UI_SPL_TELEPORT_KEY, TeleportSpellDef.COST, TeleportSpellDef.COOLDOWN);
        }

        public cast(context: SpellContext): boolean {
            let world = context.game.getWorld();
            Mixer.playSound(SoundKey.SND_TELEPORT_KEY);
            world.hero.performAnimation(AnimationKey.ANM_HERO_TELEPORT_KEY);
            setTimeout(() => {
                world.placePlayerOnScreen(context.xAim, context.yAim);
            }, 100)
            return true;
        }
    }

    /**
     * Domů spell
     */
    export class HomeSpellDef extends SpellDefinition {

        static COOLDOWN = 200;
        static COST = 20;

        constructor() {
            super(SpellKey.SPELL_HOME_KEY, UISpriteKey.UI_SPL_HOME_KEY, HomeSpellDef.COST, HomeSpellDef.COOLDOWN);
        }

        public cast(context: SpellContext): boolean {
            let world = context.game.getWorld();
            Mixer.playSound(SoundKey.SND_TELEPORT_KEY);
            world.hero.performAnimation(AnimationKey.ANM_HERO_TELEPORT_KEY);
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
            super(SpellKey.SPELL_INTERACT_KEY, UISpriteKey.UI_SPL_INTERACT_KEY, 0, MapObjectsInteractionSpellDef.COOLDOWN);
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
            icon: UISpriteKey,
            // kope se povrch jako podklad?
            private asBackground) {
            super(key, icon, 0, AbstractDigSpellDef.COOLDOWN);
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
            super(SpellKey.SPELL_DIG_KEY, UISpriteKey.UI_SPL_DIG_KEY, false);
        }
    }

    export class DigBgrSpellDef extends AbstractDigSpellDef {
        constructor() {
            super(SpellKey.SPELL_DIG_BGR_KEY, UISpriteKey.UI_SPL_DIG_BGR_KEY, true);
        }
    }

    /**
     * Spell pro pokládání objektů a povrchů z inventáře
     */
    export abstract class AbstractPlaceSpellDef extends HeroReachSpellDef {

        static COOLDOWN = 100;

        constructor(
            key: SpellKey,
            icon: UISpriteKey,
            // pokládá se povrch/objekt jako podklad/alterantiva?
            private alternative
        ) {
            super(key, icon, 0, AbstractPlaceSpellDef.COOLDOWN);
        }

        public castOnReach(context: SpellContext, reachInfo: ReachInfo): boolean {
            var uiItem = Inventory.getInstance().getChoosenItem();
            var object: InvObjDefinition = Resources.getInstance().getInvObjectDef(uiItem);
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
                    Inventory.getInstance().invRemove(uiItem, 1);
                    return true;
                }
                return false;
            }
        }
    }

    export class PlaceSpellDef extends AbstractPlaceSpellDef {
        constructor() {
            super(SpellKey.SPELL_PLACE_KEY, UISpriteKey.UI_SPL_PLACE_KEY, false);
        }
    }

    export class PlaceBgrSpellDef extends AbstractPlaceSpellDef {
        constructor() {
            super(SpellKey.SPELL_PLACE_BGR_KEY, UISpriteKey.UI_SPL_PLACE_BGR_KEY, true);
        }
    }

    /**
     * Spawn nepřátel (development spell)
     */

    export class EnemySpellDef extends SpellDefinition {

        constructor() {
            super(SpellKey.SPELL_ENEMY_KEY, UISpriteKey.UI_SPL_ENEMY_KEY, 0, 200);
        }

        public cast(context: SpellContext): boolean {
            Mixer.playSound(SoundKey.SND_GHOUL_SPAWN_KEY);

            SpawnPool.getInstance().spawn(Enemy.CupidBoss, context.game.getWorld());

            return true;
        }
    }
}