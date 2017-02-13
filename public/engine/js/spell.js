var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    /**
     * Informace, které se hodí při provádění spell
     */
    var SpellContext = (function () {
        function SpellContext(
            // kdo spell vyvolal
            owner, 
            // souřadnice, odkud je spell vyvolán
            xCast, yCast, 
            // souřadnice, kam je spell namířen
            xAim, yAim, 
            // game 
            game) {
            this.owner = owner;
            this.xCast = xCast;
            this.yCast = yCast;
            this.xAim = xAim;
            this.yAim = yAim;
            this.game = game;
        }
        return SpellContext;
    }());
    Lich.SpellContext = SpellContext;
    /**
     * Předek všech Spell definic
     */
    var SpellDefinition = (function () {
        function SpellDefinition(
            // id spellu
            key, 
            // náročnost na will
            cost, 
            // prodleva před dalším použitím
            cooldown) {
            this.key = key;
            this.cost = cost;
            this.cooldown = cooldown;
        }
        return SpellDefinition;
    }());
    Lich.SpellDefinition = SpellDefinition;
    /**
     * Předek všech základních BulletSpell definic, které vystřelují jeden
     * projektil, který letí, dopadne a zmizí
     */
    var BulletSpellDef = (function (_super) {
        __extends(BulletSpellDef, _super);
        function BulletSpellDef(key, cost, cooldown, animationSetKey, initAnimation, endAnimation, castSoundKey, hitSoundKey, speed, destroyMap, piercing, damage, radius, colloffsetX, colloffsetY) {
            if (colloffsetX === void 0) { colloffsetX = 20; }
            if (colloffsetY === void 0) { colloffsetY = 20; }
            var _this = _super.call(this, key, cost, cooldown) || this;
            _this.animationSetKey = animationSetKey;
            _this.initAnimation = initAnimation;
            _this.endAnimation = endAnimation;
            _this.castSoundKey = castSoundKey;
            _this.hitSoundKey = hitSoundKey;
            _this.speed = speed;
            _this.destroyMap = destroyMap;
            _this.piercing = piercing;
            _this.damage = damage;
            _this.radius = radius;
            _this.colloffsetX = colloffsetX;
            _this.colloffsetY = colloffsetY;
            return _this;
        }
        BulletSpellDef.prototype.adjustObjectSpeed = function (context, object) {
            var b = context.xAim - context.xCast;
            var a = context.yAim - context.yCast;
            var c = Math.sqrt(a * a + b * b);
            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            object.speedx = -this.speed * b / c;
            object.speedy = -this.speed * a / c;
        };
        BulletSpellDef.prototype.cast = function (context) {
            var self = this;
            var object = new Lich.BasicBullet(context.owner, self.animationSetKey, self.initAnimation, self.endAnimation, self.colloffsetX, self.colloffsetY, self.hitSoundKey, self.destroyMap, self.piercing, self.damage, self.radius);
            // nastaví X a Y složku rychlosti dle směru
            self.adjustObjectSpeed(context, object);
            // Tohle by bylo fajn, aby si udělala strana volajícího, ale v rámci 
            // obecnosti cast metody to zatím nechávám celé v režii cast metody
            context.game.getWorld().bulletObjects.push(object);
            context.game.getWorld().entitiesCont.addChild(object);
            object.x = context.xCast - object.width / 2;
            object.y = context.yCast - object.height / 2;
            Lich.Mixer.playSound(self.castSoundKey, 0.2);
            return true;
        };
        return BulletSpellDef;
    }(SpellDefinition));
    Lich.BulletSpellDef = BulletSpellDef;
    /**
     * Spell ohnivé koule, která ničí i povrch
     */
    var FireballSpellDef = (function (_super) {
        __extends(FireballSpellDef, _super);
        function FireballSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_FIREBALL_KEY, FireballSpellDef.COST, FireballSpellDef.COOLDOWN, Lich.AnimationSetKey.FIREBALL_ANIMATION_KEY, Lich.AnimationKey.ANM_FIREBALL_FLY_KEY, Lich.AnimationKey.ANM_FIREBALL_DONE_KEY, Lich.SoundKey.SND_FIREBALL_KEY, Lich.SoundKey.SND_BURN_KEY, FireballSpellDef.SPEED, FireballSpellDef.MAP_DESTROY, FireballSpellDef.PIERCING, FireballSpellDef.DAMAGE, FireballSpellDef.RADIUS) || this;
        }
        return FireballSpellDef;
    }(BulletSpellDef));
    FireballSpellDef.SPEED = 1500;
    FireballSpellDef.MAP_DESTROY = false;
    FireballSpellDef.PIERCING = true;
    FireballSpellDef.DAMAGE = 50;
    FireballSpellDef.COOLDOWN = 200;
    FireballSpellDef.COST = 5;
    FireballSpellDef.RADIUS = 4;
    Lich.FireballSpellDef = FireballSpellDef;
    /**
     * Spell meteoritu, který ničí i povrch
     */
    var MeteorSpellDef = (function (_super) {
        __extends(MeteorSpellDef, _super);
        function MeteorSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_METEOR_KEY, 10, // COST,
            200, // COOLDOWN,
            Lich.AnimationSetKey.METEOR_ANIMATION_KEY, Lich.AnimationKey.ANM_METEOR_FLY_KEY, Lich.AnimationKey.ANM_METEOR_DONE_KEY, Lich.SoundKey.SND_METEOR_FALL_KEY, Lich.SoundKey.SND_METEOR_HIT_KEY, 1500, // SPEED,
            true, // MAP_DESTROY,
            true, // PIERCING,
            50, // DAMAGE
            10 // RADIUS,
            ) || this;
        }
        MeteorSpellDef.prototype.cast = function (context) {
            var a = context.yAim;
            var b = Math.tan(Math.PI / 6) * a;
            context.xCast = context.xAim + b - (Math.floor(Math.random() * 2) * b * 2);
            context.yCast = 0;
            return _super.prototype.cast.call(this, context);
        };
        return MeteorSpellDef;
    }(BulletSpellDef));
    Lich.MeteorSpellDef = MeteorSpellDef;
    /**
     * AbstractLoveSpellDef
     */
    var AbstractLoveSpellDef = (function (_super) {
        __extends(AbstractLoveSpellDef, _super);
        function AbstractLoveSpellDef(spellKey, animationSetKey, initAnimation, endAnimation, damage) {
            return _super.call(this, spellKey, // SpellKey
            10, // COST
            200, // COOLDOWN
            animationSetKey, initAnimation, endAnimation, Lich.SoundKey.SND_BOLT_CAST_KEY, // castSoundKey
            Lich.SoundKey.SND_BURN_KEY, // hitSoundKey
            1000, // speed
            false, // destroyMap
            false, // piercing
            damage, // damage
            1, // radius
            10, // colloffsetX 
            10) || this;
        }
        return AbstractLoveSpellDef;
    }(BulletSpellDef));
    Lich.AbstractLoveSpellDef = AbstractLoveSpellDef;
    /**
     * LoveletterSpellDef
     */
    var LoveletterSpellDef = (function (_super) {
        __extends(LoveletterSpellDef, _super);
        function LoveletterSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_LOVELETTER, // SpellKey
            Lich.AnimationSetKey.LOVELETTER_ANIMATION_KEY, // spriteKey
            Lich.AnimationKey.ANM_LOVELETTER_FLY_KEY, Lich.AnimationKey.ANM_LOVELETTER_DONE_KEY, 2) || this;
        }
        return LoveletterSpellDef;
    }(AbstractLoveSpellDef));
    Lich.LoveletterSpellDef = LoveletterSpellDef;
    /**
     * LovearrowSpellDef
     */
    var LovearrowSpellDef = (function (_super) {
        __extends(LovearrowSpellDef, _super);
        function LovearrowSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_LOVEARROW, // SpellKey
            Lich.AnimationSetKey.LOVEARROW_ANIMATION_KEY, // spriteKey
            Lich.AnimationKey.ANM_LOVEARROW_FLY_KEY, Lich.AnimationKey.ANM_LOVEARROW_DONE_KEY, 5) || this;
        }
        return LovearrowSpellDef;
    }(AbstractLoveSpellDef));
    Lich.LovearrowSpellDef = LovearrowSpellDef;
    /**
     * Spell mana-boltu, který neničí povrch
     */
    var BoltSpellDef = (function (_super) {
        __extends(BoltSpellDef, _super);
        function BoltSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_ICEBOLT_KEY, 2, // COST,
            100, // COOLDOWN,
            Lich.AnimationSetKey.ICEBOLT_ANIMATION_KEY, Lich.AnimationKey.ANM_ICEBOLT_FLY_KEY, Lich.AnimationKey.ANM_ICEBOLT_DONE_KEY, Lich.SoundKey.SND_BOLT_CAST_KEY, Lich.SoundKey.SND_FIREBALL_KEY, 1500, // SPEED
            false, // MAP_DESTROY,
            false, // PIERCING,
            30 // DAMAGE
            ) || this;
        }
        return BoltSpellDef;
    }(BulletSpellDef));
    Lich.BoltSpellDef = BoltSpellDef;
    /**
     * Předek všech spell definic, které jsou závislé na dosahovém rádiusu od hráče
     */
    var HeroReachSpellDef = (function (_super) {
        __extends(HeroReachSpellDef, _super);
        function HeroReachSpellDef(key, cost, cooldown) {
            return _super.call(this, key, cost, cooldown) || this;
        }
        HeroReachSpellDef.prototype.cast = function (context) {
            // kontroluj rádius od každého rohu
            var world = context.game.getWorld();
            var info = world.checkReach(world.hero, context.xAim, context.yAim);
            if (info.inReach) {
                // ok, proveď cast
                return this.castOnReach(context, info);
            }
            return false;
        };
        return HeroReachSpellDef;
    }(SpellDefinition));
    Lich.HeroReachSpellDef = HeroReachSpellDef;
    /**
     * Spell konzumace
     */
    var UseItemSpellDef = (function (_super) {
        __extends(UseItemSpellDef, _super);
        function UseItemSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_USE_ITEM_KEY, UseItemSpellDef.COST, UseItemSpellDef.COOLDOWN) || this;
        }
        UseItemSpellDef.prototype.cast = function (context) {
            var world = context.game.getWorld();
            var uiItem = context.game.getUI().inventoryUI.choosenItem;
            if (uiItem) {
                var object = Lich.Resources.getInstance().invObjectDefs[uiItem];
                if (object.consumeAction) {
                    if (object.consumeAction(world)) {
                        context.game.getUI().inventoryUI.invRemove(uiItem, 1);
                        return true;
                    }
                }
            }
            return false;
        };
        return UseItemSpellDef;
    }(SpellDefinition));
    UseItemSpellDef.COOLDOWN = 200;
    UseItemSpellDef.COST = 0;
    Lich.UseItemSpellDef = UseItemSpellDef;
    /**
     * Reveal Fog spell
     */
    var RevealFogSpellDef = (function (_super) {
        __extends(RevealFogSpellDef, _super);
        function RevealFogSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_REVEAL_FOG_KEY, RevealFogSpellDef.COST, RevealFogSpellDef.COOLDOWN) || this;
        }
        RevealFogSpellDef.prototype.cast = function (context) {
            return context.game.getWorld().render.revealFog(context.xAim, context.yAim);
        };
        return RevealFogSpellDef;
    }(SpellDefinition));
    RevealFogSpellDef.COOLDOWN = 0;
    RevealFogSpellDef.COST = 0;
    Lich.RevealFogSpellDef = RevealFogSpellDef;
    /**
     * Teleportační spell
     */
    var TeleportSpellDef = (function (_super) {
        __extends(TeleportSpellDef, _super);
        function TeleportSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_TELEPORT_KEY, TeleportSpellDef.COST, TeleportSpellDef.COOLDOWN) || this;
        }
        TeleportSpellDef.prototype.cast = function (context) {
            var world = context.game.getWorld();
            Lich.Mixer.playSound(Lich.SoundKey.SND_TELEPORT_KEY);
            world.hero.performAnimation(Lich.AnimationKey.ANM_HERO_TELEPORT_KEY);
            setTimeout(function () {
                world.placePlayerOnScreen(context.xAim, context.yAim);
            }, 100);
            return true;
        };
        return TeleportSpellDef;
    }(SpellDefinition));
    TeleportSpellDef.COOLDOWN = 200;
    TeleportSpellDef.COST = 2; // DEV cost :)
    Lich.TeleportSpellDef = TeleportSpellDef;
    /**
     * Domů spell
     */
    var HomeSpellDef = (function (_super) {
        __extends(HomeSpellDef, _super);
        function HomeSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_HOME_KEY, HomeSpellDef.COST, HomeSpellDef.COOLDOWN) || this;
        }
        HomeSpellDef.prototype.cast = function (context) {
            var world = context.game.getWorld();
            Lich.Mixer.playSound(Lich.SoundKey.SND_TELEPORT_KEY);
            world.hero.performAnimation(Lich.AnimationKey.ANM_HERO_TELEPORT_KEY);
            setTimeout(function () {
                world.placePlayerOnSpawnPoint();
            }, 100);
            return true;
        };
        return HomeSpellDef;
    }(SpellDefinition));
    HomeSpellDef.COOLDOWN = 200;
    HomeSpellDef.COST = 20;
    Lich.HomeSpellDef = HomeSpellDef;
    /**
     * Spell pro interakci objektů a povrchů z mapy
     */
    var MapObjectsInteractionSpellDef = (function (_super) {
        __extends(MapObjectsInteractionSpellDef, _super);
        function MapObjectsInteractionSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_INTERACT_KEY, 0, MapObjectsInteractionSpellDef.COOLDOWN) || this;
        }
        MapObjectsInteractionSpellDef.prototype.castOnReach = function (context, reachInfo) {
            return context.game.getWorld().render.interact(context.xAim, context.yAim);
        };
        return MapObjectsInteractionSpellDef;
    }(HeroReachSpellDef));
    MapObjectsInteractionSpellDef.COOLDOWN = 200;
    Lich.MapObjectsInteractionSpellDef = MapObjectsInteractionSpellDef;
    /**
     * Spell pro vykopávání objektů a povrchů z mapy
     */
    var AbstractDigSpellDef = (function (_super) {
        __extends(AbstractDigSpellDef, _super);
        function AbstractDigSpellDef(key, 
            // kope se povrch jako podklad?
            asBackground) {
            var _this = _super.call(this, key, 0, AbstractDigSpellDef.COOLDOWN) || this;
            _this.asBackground = asBackground;
            return _this;
        }
        AbstractDigSpellDef.prototype.castOnReach = function (context, reachInfo) {
            if (context.game.getWorld().render.dig(context.xAim, context.yAim, this.asBackground)) {
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_PICK_AXE_1_KEY);
                        break;
                    case 1:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_PICK_AXE_2_KEY);
                        break;
                    case 2:
                        Lich.Mixer.playSound(Lich.SoundKey.SND_PICK_AXE_3_KEY);
                        break;
                }
                return true;
            }
            return false;
        };
        return AbstractDigSpellDef;
    }(HeroReachSpellDef));
    AbstractDigSpellDef.COOLDOWN = 100;
    Lich.AbstractDigSpellDef = AbstractDigSpellDef;
    var DigSpellDef = (function (_super) {
        __extends(DigSpellDef, _super);
        function DigSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_DIG_KEY, false) || this;
        }
        return DigSpellDef;
    }(AbstractDigSpellDef));
    Lich.DigSpellDef = DigSpellDef;
    var DigBgrSpellDef = (function (_super) {
        __extends(DigBgrSpellDef, _super);
        function DigBgrSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_DIG_BGR_KEY, true) || this;
        }
        return DigBgrSpellDef;
    }(AbstractDigSpellDef));
    Lich.DigBgrSpellDef = DigBgrSpellDef;
    /**
     * Spell pro pokládání objektů a povrchů z inventáře
     */
    var AbstractPlaceSpellDef = (function (_super) {
        __extends(AbstractPlaceSpellDef, _super);
        function AbstractPlaceSpellDef(key, 
            // pokládá se povrch/objekt jako podklad/alterantiva?
            alternative) {
            var _this = _super.call(this, key, 0, AbstractPlaceSpellDef.COOLDOWN) || this;
            _this.alternative = alternative;
            return _this;
        }
        AbstractPlaceSpellDef.prototype.castOnReach = function (context, reachInfo) {
            var uiItem = context.game.getUI().inventoryUI.choosenItem;
            var object = Lich.Resources.getInstance().invObjectDefs[uiItem];
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
                    Lich.Mixer.playSound(Lich.SoundKey.SND_PLACE_KEY);
                    context.game.getUI().inventoryUI.invRemove(uiItem, 1);
                    return true;
                }
                return false;
            }
        };
        return AbstractPlaceSpellDef;
    }(HeroReachSpellDef));
    AbstractPlaceSpellDef.COOLDOWN = 100;
    Lich.AbstractPlaceSpellDef = AbstractPlaceSpellDef;
    var PlaceSpellDef = (function (_super) {
        __extends(PlaceSpellDef, _super);
        function PlaceSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_PLACE_KEY, false) || this;
        }
        return PlaceSpellDef;
    }(AbstractPlaceSpellDef));
    Lich.PlaceSpellDef = PlaceSpellDef;
    var PlaceBgrSpellDef = (function (_super) {
        __extends(PlaceBgrSpellDef, _super);
        function PlaceBgrSpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_PLACE_BGR_KEY, true) || this;
        }
        return PlaceBgrSpellDef;
    }(AbstractPlaceSpellDef));
    Lich.PlaceBgrSpellDef = PlaceBgrSpellDef;
    /**
     * Spawn nepřátel (development spell)
     */
    var EnemySpellDef = (function (_super) {
        __extends(EnemySpellDef, _super);
        function EnemySpellDef() {
            return _super.call(this, Lich.SpellKey.SPELL_ENEMY_KEY, 0, 200) || this;
        }
        EnemySpellDef.prototype.cast = function (context) {
            Lich.Mixer.playSound(Lich.SoundKey.SND_GHOUL_SPAWN_KEY);
            Lich.SpawnPool.getInstance().spawn(Lich.Enemy.CupidBoss, context.game.getWorld());
            return true;
        };
        return EnemySpellDef;
    }(SpellDefinition));
    Lich.EnemySpellDef = EnemySpellDef;
})(Lich || (Lich = {}));
