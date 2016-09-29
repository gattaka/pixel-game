var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var SpellsUI = (function (_super) {
        __extends(SpellsUI, _super);
        function SpellsUI() {
            _super.call(this, SpellsUI.N, SpellsUI.M);
            this.toggleFlag = false;
            this.spellContent = new Array();
            this.spellIndex = new Array();
            this.alternativeSpellIndex = new Array();
            this.itemsCont = new createjs.Container();
            this.itemHighlightShape = new createjs.Shape();
            var self = this;
            // skill bude nastavitelné, takže zatím je možné ho přednastavit
            self.spellInsert(Lich.SpellKey.SPELL_DIG_KEY, Lich.SpellKey.SPELL_DIG_BGR_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_PLACE_KEY, Lich.SpellKey.SPELL_PLACE_BGR_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_FIREBALL_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_BOLT_KEY);
            self.spellInsert(Lich.SpellKey.SPELL_ENEMY_KEY);
            // zvýraznění vybrané položky
            self.itemHighlightShape = new Lich.Highlight();
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);
            self.selectSpell(0);
        }
        SpellsUI.prototype.toggleShift = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag == false) {
                for (var i = 0; i < this.spellIndex.length; i++) {
                    var alt = this.alternativeSpellIndex[i];
                    if (typeof alt !== "undefined") {
                        this.spellContent[i].image = Lich.Resources.INSTANCE.getImage(Lich.SpellKey[alt]);
                    }
                }
                self.toggleFlag = true;
            }
        };
        SpellsUI.prototype.prepareForToggleShift = function () {
            for (var i = 0; i < this.spellIndex.length; i++) {
                this.spellContent[i].image = Lich.Resources.INSTANCE.getImage(Lich.SpellKey[this.spellIndex[i]]);
            }
            this.toggleFlag = false;
        };
        SpellsUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        SpellsUI.prototype.selectSpell = function (spellNumber) {
            var self = this;
            var bitmap = self.spellContent[spellNumber];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.choosenItemNumber = spellNumber;
        };
        SpellsUI.prototype.getChoosenSpell = function () {
            var alt = this.alternativeSpellIndex[this.choosenItemNumber];
            if (this.toggleFlag && typeof alt !== "undefined") {
                return alt;
            }
            else {
                return this.spellIndex[this.choosenItemNumber];
            }
        };
        SpellsUI.prototype.spellInsert = function (spell, altSpell) {
            var self = this;
            var bitmap = Lich.Resources.INSTANCE.getBitmap(Lich.SpellKey[spell]);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.spellContent.length * (Lich.Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            var index = self.spellIndex.length;
            self.spellIndex[index] = spell;
            self.alternativeSpellIndex[index] = altSpell;
            self.spellContent.push(bitmap);
            var text = new Lich.Label("" + self.spellContent.length, Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            self.itemsCont.addChild(text);
            text.x = bitmap.x;
            text.y = bitmap.y + Lich.Resources.PARTS_SIZE - Lich.PartsUI.TEXT_SIZE;
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;
            bitmap.on("mousedown", function () {
                self.selectSpell(index);
            }, null, false);
        };
        SpellsUI.N = 5;
        SpellsUI.M = 1;
        return SpellsUI;
    }(Lich.PartsUI));
    Lich.SpellsUI = SpellsUI;
})(Lich || (Lich = {}));
