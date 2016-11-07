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
        function BulletSpellDef(key, cost, cooldown, castSoundKey, hitSoundKey, speed, spriteKey, destroyMap, piercing, damage, radius) {
            _super.call(this, key, cost, cooldown);
            this.castSoundKey = castSoundKey;
            this.hitSoundKey = hitSoundKey;
            this.speed = speed;
            this.spriteKey = spriteKey;
            this.destroyMap = destroyMap;
            this.piercing = piercing;
            this.damage = damage;
            this.radius = radius;
        }
        BulletSpellDef.prototype.getFrameWidth = function () {
            return BulletSpellDef.FRAME_WIDTH;
        };
        BulletSpellDef.prototype.getFrameHeight = function () {
            return BulletSpellDef.FRAME_HEIGHT;
        };
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
            var sheet = new createjs.SpriteSheet({
                framerate: 30,
                "images": [Lich.Resources.getInstance().getImage(Lich.AnimationKey[self.spriteKey])],
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
            var object = new Lich.BasicBullet(context.owner, self.getFrameWidth(), self.getFrameHeight(), sheet, "fly", "done", BulletSpellDef.COLLXOFFSET, BulletSpellDef.COLLYOFFSET, self.hitSoundKey, self.destroyMap, self.piercing, self.damage, self.radius);
            self.adjustObjectSpeed(context, object);
            // Tohle by bylo fajn, aby si udělala strana volajícího, ale v rámci 
            // obecnosti cast metody to zatím nechávám celé v režii cast metody
            context.game.getWorld().bulletObjects.push(object);
            context.game.getWorld().addChild(object);
            object.x = context.xCast - object.width / 2;
            object.y = context.yCast - object.height / 2;
            Lich.Mixer.playSound(self.castSoundKey, false, 0.2);
            return true;
        };
        BulletSpellDef.FRAME_WIDTH = 60;
        BulletSpellDef.FRAME_HEIGHT = 60;
        BulletSpellDef.COLLXOFFSET = 20;
        BulletSpellDef.COLLYOFFSET = 20;
        return BulletSpellDef;
    }(SpellDefinition));
    Lich.BulletSpellDef = BulletSpellDef;
    /**
     * Spell ohnivé koule, která ničí i povrch
     */
    var FireballSpellDef = (function (_super) {
        __extends(FireballSpellDef, _super);
        function FireballSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_FIREBALL_KEY, FireballSpellDef.COST, FireballSpellDef.COOLDOWN, Lich.SoundKey.SND_FIREBALL_KEY, Lich.SoundKey.SND_BURN_KEY, FireballSpellDef.SPEED, Lich.AnimationKey.FIREBALL_ANIMATION_KEY, FireballSpellDef.MAP_DESTROY, FireballSpellDef.PIERCING, FireballSpellDef.DAMAGE, FireballSpellDef.RADIUS);
        }
        FireballSpellDef.SPEED = 1500;
        FireballSpellDef.MAP_DESTROY = true;
        FireballSpellDef.PIERCING = true;
        FireballSpellDef.DAMAGE = 50;
        FireballSpellDef.COOLDOWN = 200;
        FireballSpellDef.COST = 10;
        FireballSpellDef.RADIUS = 4;
        return FireballSpellDef;
    }(BulletSpellDef));
    Lich.FireballSpellDef = FireballSpellDef;
    /**
     * Spell meteoritu, který ničí i povrch
     */
    var MeteorSpellDef = (function (_super) {
        __extends(MeteorSpellDef, _super);
        function MeteorSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_METEOR_KEY, MeteorSpellDef.COST, MeteorSpellDef.COOLDOWN, Lich.SoundKey.SND_METEOR_FALL_KEY, Lich.SoundKey.SND_METEOR_HIT_KEY, MeteorSpellDef.SPEED, Lich.AnimationKey.METEOR_ANIMATION_KEY, MeteorSpellDef.MAP_DESTROY, MeteorSpellDef.PIERCING, MeteorSpellDef.DAMAGE, MeteorSpellDef.RADIUS);
        }
        MeteorSpellDef.prototype.getFrameWidth = function () {
            return MeteorSpellDef.FRAME_WIDTH;
        };
        MeteorSpellDef.prototype.getFrameHeight = function () {
            return MeteorSpellDef.FRAME_HEIGHT;
        };
        MeteorSpellDef.prototype.cast = function (context) {
            var a = context.yAim;
            var b = Math.tan(Math.PI / 6) * a;
            context.xCast = context.xAim + b - (Math.floor(Math.random() * 2) * b * 2);
            context.yCast = 0;
            return _super.prototype.cast.call(this, context);
        };
        MeteorSpellDef.SPEED = 1500;
        MeteorSpellDef.MAP_DESTROY = true;
        MeteorSpellDef.PIERCING = true;
        MeteorSpellDef.DAMAGE = 50;
        MeteorSpellDef.COOLDOWN = 200;
        MeteorSpellDef.COST = 10;
        MeteorSpellDef.RADIUS = 10;
        MeteorSpellDef.FRAME_WIDTH = 120;
        MeteorSpellDef.FRAME_HEIGHT = 120;
        return MeteorSpellDef;
    }(BulletSpellDef));
    Lich.MeteorSpellDef = MeteorSpellDef;
    /**
     * Spell mana-boltu, který neničí povrch
     */
    var BoltSpellDef = (function (_super) {
        __extends(BoltSpellDef, _super);
        function BoltSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_BOLT_KEY, BoltSpellDef.COST, BoltSpellDef.COOLDOWN, Lich.SoundKey.SND_BOLT_CAST, Lich.SoundKey.SND_FIREBALL_KEY, BoltSpellDef.SPEED, Lich.AnimationKey.BOLT_ANIMATION_KEY, BoltSpellDef.MAP_DESTROY, BoltSpellDef.PIERCING, BoltSpellDef.DAMAGE);
        }
        BoltSpellDef.SPEED = 1500;
        BoltSpellDef.MAP_DESTROY = false;
        BoltSpellDef.PIERCING = false;
        BoltSpellDef.DAMAGE = 30;
        BoltSpellDef.COOLDOWN = 100;
        BoltSpellDef.COST = 2;
        return BoltSpellDef;
    }(BulletSpellDef));
    Lich.BoltSpellDef = BoltSpellDef;
    /**
     * Předek všech spell definic, které jsou závislé na dosahovém rádiusu od hráče
     */
    var HeroReachSpellDef = (function (_super) {
        __extends(HeroReachSpellDef, _super);
        function HeroReachSpellDef(key, cost, cooldown) {
            _super.call(this, key, cost, cooldown);
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
     * Spell pro interakci objektů a povrchů z mapy
     */
    var MapObjectsInteractionSpellDef = (function (_super) {
        __extends(MapObjectsInteractionSpellDef, _super);
        function MapObjectsInteractionSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_INTERACT_KEY, 0, MapObjectsInteractionSpellDef.COOLDOWN);
        }
        MapObjectsInteractionSpellDef.prototype.castOnReach = function (context, reachInfo) {
            return context.game.getWorld().render.interact(context.xAim, context.yAim);
        };
        MapObjectsInteractionSpellDef.COOLDOWN = 200;
        return MapObjectsInteractionSpellDef;
    }(HeroReachSpellDef));
    Lich.MapObjectsInteractionSpellDef = MapObjectsInteractionSpellDef;
    /**
     * Spell pro vykopávání objektů a povrchů z mapy
     */
    var AbstractDigSpellDef = (function (_super) {
        __extends(AbstractDigSpellDef, _super);
        function AbstractDigSpellDef(key, 
            // kope se povrch jako podklad?
            asBackground) {
            _super.call(this, key, 0, AbstractDigSpellDef.COOLDOWN);
            this.asBackground = asBackground;
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
        AbstractDigSpellDef.COOLDOWN = 100;
        return AbstractDigSpellDef;
    }(HeroReachSpellDef));
    Lich.AbstractDigSpellDef = AbstractDigSpellDef;
    var DigSpellDef = (function (_super) {
        __extends(DigSpellDef, _super);
        function DigSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_DIG_KEY, false);
        }
        return DigSpellDef;
    }(AbstractDigSpellDef));
    Lich.DigSpellDef = DigSpellDef;
    var DigBgrSpellDef = (function (_super) {
        __extends(DigBgrSpellDef, _super);
        function DigBgrSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_DIG_BGR_KEY, true);
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
            _super.call(this, key, 0, AbstractPlaceSpellDef.COOLDOWN);
            this.alternative = alternative;
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
        AbstractPlaceSpellDef.COOLDOWN = 100;
        return AbstractPlaceSpellDef;
    }(HeroReachSpellDef));
    Lich.AbstractPlaceSpellDef = AbstractPlaceSpellDef;
    var PlaceSpellDef = (function (_super) {
        __extends(PlaceSpellDef, _super);
        function PlaceSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_PLACE_KEY, false);
        }
        return PlaceSpellDef;
    }(AbstractPlaceSpellDef));
    Lich.PlaceSpellDef = PlaceSpellDef;
    var PlaceBgrSpellDef = (function (_super) {
        __extends(PlaceBgrSpellDef, _super);
        function PlaceBgrSpellDef() {
            _super.call(this, Lich.SpellKey.SPELL_PLACE_BGR_KEY, true);
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
            _super.call(this, Lich.SpellKey.SPELL_ENEMY_KEY, 0, 200);
        }
        EnemySpellDef.prototype.cast = function (context) {
            Lich.Mixer.playSound(Lich.SoundKey.SND_SPAWN_KEY);
            // SpawnPool !
            return true;
        };
        return EnemySpellDef;
    }(SpellDefinition));
    Lich.EnemySpellDef = EnemySpellDef;
})(Lich || (Lich = {}));
