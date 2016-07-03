namespace Lich {

    export class SpellsUI extends PartsUI {

        static N = 4;
        static M = 1;

        choosenItem: string;
        spellContent = [];
        spellIndex = {};

        itemsCont = new createjs.Container();
        itemHighlightShape = new createjs.Shape();

        constructor() {
            super(SpellsUI.N, SpellsUI.M);

            var self = this;

            // zatím rovnou:
            self.spellInsert(Resources.SPELL_DIG_KEY);
            self.spellInsert(Resources.SPELL_PLACE_KEY);
            self.spellInsert(Resources.SPELL_FIREBALL_KEY);
            self.spellInsert(Resources.SPELL_BOLT_KEY);

            // zvýraznění vybrané položky
            self.itemHighlightShape = self.createHighlightShape();
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);

            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);

            self.selectSpell(Resources.SPELL_BOLT_KEY);
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }

        selectSpell(spell: string) {
            var self = this;
            var bitmap = self.spellContent[self.spellIndex[spell]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.choosenItem = spell;
        }

        spellInsert(spell) {
            var self = this;
            var bitmap = Resources.INSTANCE.getBitmap(spell);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.spellContent.length * (Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            self.spellIndex[spell] = self.spellContent.length;
            self.spellContent.push(bitmap);

            var text = new Label("" + self.spellContent.length, PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            self.itemsCont.addChild(text);
            text.x = bitmap.x;
            text.y = bitmap.y + Resources.PARTS_SIZE - PartsUI.TEXT_SIZE;

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;

            bitmap.on("mousedown", function() {
                self.selectSpell(spell);
            }, null, false);
        }

    }

}