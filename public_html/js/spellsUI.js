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
            this.spellContent = [];
            this.spellIndex = [];
            this.spellReversedIndex = {};
            this.itemsCont = new createjs.Container();
            this.itemHighlightShape = new createjs.Shape();
            var self = this;
            // zatím rovnou:
            self.spellInsert(Lich.Resources.SPELL_DIG_KEY);
            self.spellInsert(Lich.Resources.SPELL_PLACE_KEY);
            self.spellInsert(Lich.Resources.SPELL_FIREBALL_KEY);
            self.spellInsert(Lich.Resources.SPELL_BOLT_KEY);
            self.spellInsert(Lich.Resources.SPELL_ENEMY_KEY);
            // zvýraznění vybrané položky
            self.itemHighlightShape = self.createHighlightShape();
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);
            self.selectSpell(0);
        }
        SpellsUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        SpellsUI.prototype.selectSpell = function (spellNumber) {
            var self = this;
            var spell = self.spellIndex[spellNumber];
            var bitmap = self.spellContent[spellNumber];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.choosenItem = spell;
        };
        SpellsUI.prototype.spellInsert = function (spell) {
            var self = this;
            var bitmap = Lich.Resources.INSTANCE.getBitmap(spell);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.spellContent.length * (Lich.Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            var index = self.spellIndex.length;
            self.spellIndex[index] = spell;
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
