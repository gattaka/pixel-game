var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
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
        BulletSpellDef.prototype.adjustObjectSpeed = function (xCast, yCast, xAim, yAim, object) {
            var b = xAim - xCast;
            var a = yAim - yCast;
            var c = Math.sqrt(a * a + b * b);
            // dle poměru přepony k odvěsnám vypočti nové odvěsny při délce
            // přepony dle rychlosti projektilu
            object.speedx = -this.speed * b / c;
            object.speedy = -this.speed * a / c;
        };
        BulletSpellDef.prototype.cast = function (owner, xCast, yCast, xAim, yAim, game) {
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
            var object = new Lich.BasicBullet(owner, self.getFrameWidth(), self.getFrameHeight(), sheet, "fly", "done", {
                "fly": "fly",
                "hit": "hit",
                "done": "done"
            }, BulletSpellDef.COLLXOFFSET, BulletSpellDef.COLLYOFFSET, self.hitSoundKey, self.destroyMap, self.piercing, self.damage, self.radius);
            self.adjustObjectSpeed(xCast, yCast, xAim, yAim, object);
            // Tohle by bylo fajn, aby si udělala strana volajícího, ale v rámci 
            // obecnosti cast metody to zatím nechávám celé v režii cast metody
            game.getWorld().bulletObjects.push(object);
            game.getWorld().addChild(object);
            object.x = xCast - object.width / 2;
            object.y = yCast - object.height / 2;
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
        MeteorSpellDef.prototype.cast = function (owner, xCast, yCast, xAim, yAim, game) {
            var a = yAim;
            var b = Math.tan(Math.PI / 6) * a;
            return _super.prototype.cast.call(this, owner, xAim + b - (Math.floor(Math.random() * 2) * b * 2), 0, xAim, yAim, game);
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
        HeroReachSpellDef.prototype.cast = function (owner, xCast, yCast, xAim, yAim, game) {
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
            if (Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTL.x, heroCoordTL.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordTR.x, heroCoordTR.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBR.x, heroCoordBR.y) < Lich.Resources.REACH_TILES_RADIUS
                || Lich.Utils.distance(mouseCoord.x, mouseCoord.y, heroCoordBL.x, heroCoordBL.y) < Lich.Resources.REACH_TILES_RADIUS) {
                // ok, proveď cast
                return this.castOnReach(xAim, yAim, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game);
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
        MapObjectsInteractionSpellDef.prototype.castOnReach = function (xAim, yAim, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game) {
            return game.getWorld().render.interact(xAim, yAim);
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
        AbstractDigSpellDef.prototype.castOnReach = function (xAim, yAim, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game) {
            if (game.getWorld().render.dig(xAim, yAim, this.asBackground)) {
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
        AbstractPlaceSpellDef.prototype.castOnReach = function (xAim, yAim, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game) {
            var uiItem = game.getUI().inventoryUI.choosenItem;
            var object = Lich.Resources.getInstance().invObjectDefs[uiItem];
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
                    Lich.Mixer.playSound(Lich.SoundKey.SND_PLACE_KEY);
                    game.getUI().inventoryUI.invRemove(uiItem, 1);
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
        EnemySpellDef.prototype.cast = function (owner, xCast, yCast, xAim, yAim, game) {
            Lich.Mixer.playSound(Lich.SoundKey.SND_SPAWN_KEY);
            // maximálně 4 najednou
            var batch = Math.random() * 10;
            for (var e = 0; e < batch; e++) {
                var enemy = new Lich.Enemy();
                game.getWorld().enemies.push(enemy);
                game.getWorld().addChild(enemy);
                if (Math.random() > 0.5 && game.getWorld().render.canShiftX(-enemy.width * 2) || game.getWorld().render.canShiftX(enemy.width * 2) == false) {
                    enemy.x = game.getCanvas().width + enemy.width * (Math.random() + 1);
                }
                else {
                    enemy.x = -enemy.width * (Math.random() + 1);
                }
                enemy.y = game.getCanvas().height / 2;
            }
            return true;
        };
        return EnemySpellDef;
    }(SpellDefinition));
    Lich.EnemySpellDef = EnemySpellDef;
})(Lich || (Lich = {}));