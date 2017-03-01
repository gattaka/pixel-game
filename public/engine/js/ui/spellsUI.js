var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Spellbook = (function () {
        function Spellbook() {
            this.spellIndex = new Array();
            this.alternativeSpellIndex = new Array();
        }
        Spellbook.prototype.getChoosenSpell = function () { return this.choosenItemNumber; };
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
            _this.itemsCont = new PIXI.Container();
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
            // zvýraznění vybrané položky
            self.itemHighlight = new Lich.Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);
            // let offset = 5;
            // self.cache(-offset, -offset, self.width + offset * 2, self.height + offset * 2);
            self.selectSpell(0);
            return _this;
        }
        SpellsUI.prototype.toggleShift = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag == false) {
                for (var i = 0; i < Spellbook.getInstance().spellIndex.length; i++) {
                    var alt = Spellbook.getInstance().alternativeSpellIndex[i];
                    if (alt) {
                        Lich.Resources.getInstance().getSpellUISprite(alt, this.spellContent[i]);
                    }
                }
                // self.updateCache();
                self.toggleFlag = true;
            }
        };
        SpellsUI.prototype.prepareForToggleShift = function () {
            if (this.toggleFlag) {
                for (var i = 0; i < Spellbook.getInstance().spellIndex.length; i++) {
                    Lich.Resources.getInstance().getSpellUISprite(Spellbook.getInstance().spellIndex[i], this.spellContent[i]);
                }
                // this.updateCache();
                this.toggleFlag = false;
            }
        };
        SpellsUI.prototype.selectSpell = function (spellNumber) {
            var self = this;
            var bitmap = self.spellContent[spellNumber];
            self.itemHighlight.visible = true;
            self.itemHighlight.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlight.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            Spellbook.getInstance().choosenItemNumber = spellNumber;
            // self.updateCache();
        };
        SpellsUI.prototype.getChoosenSpell = function () {
            var alt = Spellbook.getInstance().alternativeSpellIndex[Spellbook.getInstance().choosenItemNumber];
            if (this.toggleFlag && typeof alt !== "undefined") {
                return alt;
            }
            else {
                return Spellbook.getInstance().spellIndex[Spellbook.getInstance().choosenItemNumber];
            }
        };
        SpellsUI.prototype.spellInsert = function (spell, altSpell) {
            var self = this;
            var spellIcon = Lich.Resources.getInstance().getSpellUISprite(spell);
            self.itemsCont.addChild(spellIcon);
            spellIcon.x = self.spellContent.length * (Lich.Resources.PARTS_SIZE + SpellsUI.SPACING);
            spellIcon.y = 0;
            var index = Spellbook.getInstance().spellIndex.length;
            Spellbook.getInstance().spellIndex[index] = spell;
            Spellbook.getInstance().alternativeSpellIndex[index] = altSpell;
            self.spellContent.push(spellIcon);
            var text = new Lich.Label("" + self.spellContent.length);
            self.itemsCont.addChild(text);
            text.x = spellIcon.x;
            text.y = spellIcon.y + Lich.Resources.PARTS_SIZE - Lich.PartsUI.TEXT_SIZE;
            spellIcon.hitArea = new PIXI.Rectangle(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            spellIcon.on("pointerdown", function () {
                self.selectSpell(index);
            });
        };
        return SpellsUI;
    }(Lich.PartsUI));
    SpellsUI.N = 8;
    SpellsUI.M = 1;
    Lich.SpellsUI = SpellsUI;
})(Lich || (Lich = {}));
