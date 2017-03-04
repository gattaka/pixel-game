var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var Spellbook = (function () {
        function Spellbook() {
            this.spellIndex = new Array();
            this.altSpellIndex = new Array();
        }
        Spellbook.prototype.getChoosenSpellIndex = function () { return this.spellIndex[this.choosenSpellIndex]; };
        Spellbook.prototype.setChooseSpellIndex = function (choosenItemNumber) { return this.choosenSpellIndex = choosenItemNumber; };
        Spellbook.prototype.getSize = function () { return this.spellIndex.length; };
        Spellbook.prototype.insertSpell = function (i, spell, altSpell) {
            this.spellIndex[i] = spell;
            this.altSpellIndex[i] = altSpell;
        };
        Spellbook.prototype.getChoosenSpell = function (alt) {
            if (alt === void 0) { alt = false; }
            if (alt) {
                var spell = this.altSpellIndex[this.choosenSpellIndex];
                if (spell)
                    return spell;
            }
            return this.spellIndex[this.choosenSpellIndex];
        };
        Spellbook.prototype.getSpellByIndex = function (i, alt) {
            if (alt === void 0) { alt = false; }
            return alt ? this.altSpellIndex[i] : this.spellIndex[i];
        };
        Spellbook.getInstance = function () {
            if (!Spellbook.INSTANCE) {
                Spellbook.INSTANCE = new Spellbook();
            }
            return Spellbook.INSTANCE;
        };
        return Spellbook;
    }());
    Lich.Spellbook = Spellbook;
    var SpellsUI = (function (_super) {
        __extends(SpellsUI, _super);
        function SpellsUI() {
            var _this = _super.call(this, SpellsUI.N, SpellsUI.M) || this;
            _this.toggleFlag = false;
            _this.spellContent = new Array();
            var self = _this;
            // skill bude nastavitelné, takže zatím je možné ho přednastavit
            self.spellInsert(Lich.SpellKey.SPELL_DIG_KEY, Lich.SpellKey.SPELL_DIG_BGR_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_PLACE_KEY, Lich.SpellKey.SPELL_PLACE_BGR_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_USE_ITEM_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_ENEMY_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_ICEBOLT_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_FIREBALL_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_TELEPORT_KEY, Lich.SpellKey.SPELL_HOME_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_METEOR_KEY);
            for (var i = 0; i < Spellbook.getInstance().getSize(); i++) {
                (function () {
                    var ii = i;
                    Lich.Keyboard.on(49 + ii, function () { self.selectSpell(ii); });
                })();
            }
            // zvýraznění vybrané položky
            self.itemHighlight = new Lich.Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // let offset = 5;
            // self.cache(-offset, -offset, self.width + offset * 2, self.height + offset * 2);
            self.selectSpell(0);
            return _this;
        }
        SpellsUI.prototype.toggleAlternative = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag == false) {
                for (var i = 0; i < Spellbook.getInstance().getSize(); i++) {
                    var alt = Spellbook.getInstance().getSpellByIndex(i, true);
                    if (alt) {
                        var def = Lich.Resources.getInstance().getSpellDef(alt);
                        this.spellContent[i].changeSprite(def.icon);
                    }
                }
                // self.updateCache();
                self.toggleFlag = true;
            }
        };
        SpellsUI.prototype.prepareForToggleAlternative = function () {
            if (this.toggleFlag) {
                for (var i = 0; i < Spellbook.getInstance().getSize(); i++) {
                    var def = Lich.Resources.getInstance().getSpellDef(Spellbook.getInstance().getSpellByIndex(i));
                    this.spellContent[i].changeSprite(def.icon);
                }
                // this.updateCache();
                this.toggleFlag = false;
            }
        };
        SpellsUI.prototype.selectSpell = function (spellNumber) {
            var self = this;
            var button = self.spellContent[spellNumber];
            self.itemHighlight.visible = true;
            self.itemHighlight.x = button.x;
            self.itemHighlight.y = button.y;
            Spellbook.getInstance().setChooseSpellIndex(spellNumber);
            // self.updateCache();
        };
        SpellsUI.prototype.spellInsert = function (spell, altSpell) {
            var self = this;
            var spellDef = Lich.Resources.getInstance().getSpellDef(spell);
            var spellIcon = new Lich.Button(spellDef.icon, function () {
                self.selectSpell(index);
            }, undefined, true);
            self.addChild(spellIcon);
            spellIcon.x = Lich.PartsUI.SELECT_BORDER + self.spellContent.length * (Lich.Resources.PARTS_SIZE + SpellsUI.SPACING);
            spellIcon.y = Lich.PartsUI.SELECT_BORDER;
            var index = self.spellContent.push(spellIcon) - 1;
            Spellbook.getInstance().insertSpell(index, spell, altSpell);
            var text = new Lich.Label("" + self.spellContent.length);
            self.addChild(text);
            text.x = spellIcon.x + Lich.PartsUI.SELECT_BORDER;
            text.y = spellIcon.y + Lich.Resources.PARTS_SIZE + Lich.PartsUI.SELECT_BORDER - Lich.PartsUI.TEXT_SIZE;
            spellIcon.hitArea = new PIXI.Rectangle(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
        };
        return SpellsUI;
    }(Lich.PartsUI));
    SpellsUI.N = 8;
    SpellsUI.M = 1;
    Lich.SpellsUI = SpellsUI;
})(Lich || (Lich = {}));
