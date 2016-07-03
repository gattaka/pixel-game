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
        function SpellDefinition(key) {
            this.key = key;
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
        function BulletSpellDef(key, castSoundKey, hitSoundKey, speed, spriteKey) {
            _super.call(this, key);
            this.castSoundKey = castSoundKey;
            this.hitSoundKey = hitSoundKey;
            this.speed = speed;
            this.spriteKey = spriteKey;
        }
        BulletSpellDef.prototype.cast = function (owner, xCast, yCast, xAim, yAim, game) {
            var self = this;
            var b = xAim - xCast;
            var a = yAim - yCast;
            var c = Math.sqrt(a * a + b * b);
            var sheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [Lich.Resources.INSTANCE.getImage(self.spriteKey)],
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
            var object = new Lich.BasicBullet(owner, BulletSpellDef.FRAME_HEIGHT, BulletSpellDef.FRAME_WIDTH, sheet, "fly", "done", {
                "fly": "fly",
                "hit": "hit",
                "done": "done"
            }, BulletSpellDef.COLLXOFFSET, BulletSpellDef.COLLYOFFSET);
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
            Lich.Mixer.play(self.castSoundKey, false, 0.2);
            return true;
        };
        BulletSpellDef.FRAME_WIDTH = 60;
        BulletSpellDef.FRAME_HEIGHT = 60;
        BulletSpellDef.COLLXOFFSET = 20;
        BulletSpellDef.COLLYOFFSET = 20;
        return BulletSpellDef;
    }(SpellDefinition));
    Lich.BulletSpellDef = BulletSpellDef;
    var FireballSpellDef = (function (_super) {
        __extends(FireballSpellDef, _super);
        function FireballSpellDef() {
            _super.call(this, Lich.Resources.SPELL_FIREBALL_KEY, Lich.Resources.SND_BURN_KEY, Lich.Resources.SND_FIREBALL_KEY, FireballSpellDef.SPEED, Lich.Resources.FIREBALL_ANIMATION_KEY);
        }
        FireballSpellDef.SPEED = 1500;
        return FireballSpellDef;
    }(BulletSpellDef));
    Lich.FireballSpellDef = FireballSpellDef;
    /**
     * Předek všech spell definic, které jsou závislé na dosahovém rádiusu od hráče
     */
    var HeroReachSpellDef = (function (_super) {
        __extends(HeroReachSpellDef, _super);
        function HeroReachSpellDef(key) {
            _super.call(this, key);
        }
        HeroReachSpellDef.prototype.cast = function (owner, xCast, yCast, xAim, yAim, game) {
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
    var DigSpellDef = (function (_super) {
        __extends(DigSpellDef, _super);
        function DigSpellDef() {
            _super.call(this, Lich.Resources.SPELL_DIG_KEY);
        }
        DigSpellDef.prototype.castOnReach = function (xAim, yAim, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game) {
            if (game.world.render.dig(xAim, yAim)) {
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        Lich.Mixer.play(Lich.Resources.SND_PICK_AXE_1_KEY);
                        break;
                    case 1:
                        Lich.Mixer.play(Lich.Resources.SND_PICK_AXE_2_KEY);
                        break;
                    case 2:
                        Lich.Mixer.play(Lich.Resources.SND_PICK_AXE_3_KEY);
                        break;
                }
                return true;
            }
            return false;
        };
        return DigSpellDef;
    }(HeroReachSpellDef));
    Lich.DigSpellDef = DigSpellDef;
    var PlaceSpellDef = (function (_super) {
        __extends(PlaceSpellDef, _super);
        function PlaceSpellDef() {
            _super.call(this, Lich.Resources.SPELL_PLACE_KEY);
        }
        PlaceSpellDef.prototype.castOnReach = function (xAim, yAim, mouseCoord, heroCoordTL, heroCoordTR, heroCoordBR, heroCoordBL, game) {
            var uiItem = game.ui.inventoryUI.choosenItem;
            if ((mouseCoord.x > heroCoordBR.x || mouseCoord.x < heroCoordTL.x ||
                mouseCoord.y > heroCoordBR.y || mouseCoord.y < heroCoordTL.y) &&
                game.world.render.place(xAim, yAim, uiItem)) {
                Lich.Mixer.play(Lich.Resources.SND_PLACE_KEY);
                game.ui.inventoryUI.decrease(uiItem, 1);
                return true;
            }
            return false;
        };
        return PlaceSpellDef;
    }(HeroReachSpellDef));
    Lich.PlaceSpellDef = PlaceSpellDef;
})(Lich || (Lich = {}));
