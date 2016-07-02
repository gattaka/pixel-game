var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var SpellsUI = (function (_super) {
        __extends(SpellsUI, _super);
        function SpellsUI(game) {
            _super.call(this, SpellsUI.N, SpellsUI.M);
            this.game = game;
            this.choosenItem = {};
            this.spellContent = [];
            this.spellIndex = {};
            this.itemsCont = new createjs.Container();
            this.itemHighlightShape = new createjs.Shape();
            var self = this;
            // zatím rovnou:
            self.spellInsert(Lich.Resources.SPELL_DIG_KEY);
            self.spellInsert(Lich.Resources.SPELL_PLACE_KEY);
            self.spellInsert(Lich.Resources.SPELL_FIREBALL_KEY);
            // zvýraznění vybrané položky
            self.itemHighlightShape = self.createHighlightShape();
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);
            self.selectSpell(Lich.Resources.SPELL_FIREBALL_KEY);
        }
        SpellsUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        SpellsUI.prototype.selectSpell = function (spell) {
            var self = this;
            var bitmap = self.spellContent[self.spellIndex[spell]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.choosenItem = spell;
        };
        SpellsUI.prototype.spellInsert = function (spell) {
            var self = this;
            var bitmap = self.game.resources.getBitmap(spell);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.spellContent.length * (Lich.Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            self.spellIndex[spell] = self.spellContent.length;
            self.spellContent.push(bitmap);
            var text = new Lich.Label("" + self.spellContent.length, Lich.PartsUI.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            self.itemsCont.addChild(text);
            text.x = bitmap.x;
            text.y = bitmap.y + Lich.Resources.PARTS_SIZE - Lich.PartsUI.TEXT_SIZE;
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;
            bitmap.on("mousedown", function () {
                self.selectSpell(spell);
            }, null, false);
        };
        SpellsUI.N = 3;
        SpellsUI.M = 1;
        return SpellsUI;
    }(Lich.PartsUI));
    Lich.SpellsUI = SpellsUI;
})(Lich || (Lich = {}));
