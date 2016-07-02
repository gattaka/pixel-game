namespace Lich {

    export class SpellsUI extends UIPart {

        static n = 3;

        choosenItem = {};
        spellContent = [];
        spellIndex = {};

        itemsCont = new createjs.Container();
        itemHighlightShape = new createjs.Shape();

        constructor(public game: Game) {
            super(SpellsUI.n * Resources.PARTS_SIZE + (SpellsUI.n - 1) * (SpellsUI.SPACING) + 2 * SpellsUI.BORDER, Resources.PARTS_SIZE + 2 * SpellsUI.BORDER);

            var self = this;

            // zatím rovnou:
            self.spellInsert(Resources.SPELL_DIG_KEY);
            self.spellInsert(Resources.SPELL_PLACE_KEY);
            self.spellInsert(Resources.SPELL_FIREBALL_KEY);

            self.selectSpell(Resources.SPELL_FIREBALL_KEY);

            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Resources.PARTS_SIZE + SpellsUI.SELECT_BORDER * 2, Resources.PARTS_SIZE
                + SpellsUI.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);

            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }

        selectSpell(spell) {
            var self = this;
            var bitmap = self.spellContent[self.spellIndex[spell]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.choosenItem = spell;
        }

        spellInsert(spell) {
            var self = this;
            var bitmap = self.game.resources.getBitmap(spell);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.spellContent.length * (Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            self.spellIndex[spell] = self.spellContent.length;
            self.spellContent.push(bitmap);

            var text = new Label("" + self.spellContent.length, UIPart.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            self.itemsCont.addChild(text);
            text.x = bitmap.x;
            text.y = bitmap.y + Resources.PARTS_SIZE - UIPart.TEXT_SIZE;

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;

            bitmap.on("mousedown", function() {
                self.selectSpell(spell);
            }, null, false);
        }

    }

}