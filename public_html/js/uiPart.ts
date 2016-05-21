namespace Lich {
    export class UIPart extends createjs.Container {

        constructor(public width, public height) {
            super();

            var outerShape = new createjs.Shape();
            outerShape.graphics.setStrokeStyle(2);
            outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            outerShape.graphics.drawRoundRect(0, 0, width, height, 3);
            this.addChild(outerShape);
        }
    }

    export class InventoryUI extends UIPart {

        static INV_BORDER = 10;
        static INV_SELECT_BORDER = 5;
        static INV_SPACING = 12;
        static INV_LINE = 10;
        static INV_SIZE = 20;
        static TEXT_SIZE = 10;

        toggleFlag = true;

        choosenItem = null;
        draggedItem = null;

        invContent = [];
        itemHighlightShape = new createjs.Shape();
        itemsCont = new createjs.Container();

        constructor(public game: Game) {
            super(450, 150);

            // zvýraznění vybrané položky

            this.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            this.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            this.itemHighlightShape.graphics.setStrokeStyle(2);
            this.itemHighlightShape.graphics.drawRoundRect(0, 0, Resources.PARTS_SIZE + InventoryUI.INV_SELECT_BORDER * 2, Resources.PARTS_SIZE
                + InventoryUI.INV_SELECT_BORDER * 2, 3);
            this.itemHighlightShape.visible = false;
            this.addChild(this.itemHighlightShape);

            // kontejner položek

            this.itemsCont.x = InventoryUI.INV_BORDER;
            this.itemsCont.y = InventoryUI.INV_BORDER;
            this.addChild(this.itemsCont);
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }

        showInv() {
            this.visible = true;
        }

        hideInv() {
            this.visible = false;
        }

        toggleInv() {
            if (this.toggleFlag) {
                this.visible = !(this.visible);
                this.toggleFlag = false;
            }
        }

        prepareForToggleInv() {
            this.toggleFlag = true;
        }

        invInsert(item, quant) {
            // zkus zvýšit počet
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof this.invContent[i] !== "undefined" && this.invContent[i].item === item) {
                    this.invContent[i].quant += quant;
                    this.invContent[i].count.text = this.invContent[i].quant;
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof this.invContent[i] === "undefined") {
                    var bitmap = this.game.resources.getItemBitmap(item);
                    this.itemsCont.addChild(bitmap);
                    bitmap.x = (i % InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    bitmap.y = Math.floor(i / InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    var text = new createjs.Text(quant, "bold " + InventoryUI.TEXT_SIZE + "px Arial", "#ff0");
                    this.itemsCont.addChild(text);
                    text.x = bitmap.x;
                    text.y = bitmap.y + Resources.PARTS_SIZE - InventoryUI.TEXT_SIZE;
                    this.invContent[i] = {
                        item: item,
                        quant: quant,
                        element: bitmap,
                        count: text
                    };

                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
                    bitmap.hitArea = hitArea;

                    bitmap.on("mousedown", function(evt) {
                        if (this.choosenItem === item) {
                            this.choosenItem = null;
                            this.draggedItem = null;
                            this.itemHighlightShape.visible = false;
                        } else {
                            this.itemHighlightShape.visible = true;
                            this.itemHighlightShape.x = bitmap.x - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            this.itemHighlightShape.y = bitmap.y - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            this.choosenItem = item;
                            this.draggedItem = item;
                        }
                    }, null, false);

                    return true; // usazeno
                }
            }
            return false; // nevešel se
        }
    }

    export class SpellsUI extends UIPart {

        static BORDER = 10;
        static SELECT_BORDER = 5;
        static SPACING = 12;

        static n = 3;

        choosenItem = {};
        spellContent = [];
        spellIndex = {};

        itemsCont = new createjs.Container();
        itemHighlightShape = new createjs.Shape();

        constructor(public game: Game) {
            super(SpellsUI.n * Resources.PARTS_SIZE + (SpellsUI.n - 1) * (SpellsUI.SPACING) + 2 * SpellsUI.BORDER, Resources.PARTS_SIZE + 2 * SpellsUI.BORDER);

            // zatím rovnou:
            this.spellInsert(Resources.DIG_SPELL_KEY);
            this.spellInsert(Resources.PLACE_SPELL_KEY);
            this.spellInsert(Resources.FIREBALL_SPELL_KEY);

            this.selectSpell(Resources.FIREBALL_SPELL_KEY);

            // zvýraznění vybrané položky
            this.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            this.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            this.itemHighlightShape.graphics.setStrokeStyle(2);
            this.itemHighlightShape.graphics.drawRoundRect(0, 0, Resources.PARTS_SIZE + SpellsUI.SELECT_BORDER * 2, Resources.PARTS_SIZE
                + SpellsUI.SELECT_BORDER * 2, 3);
            this.itemHighlightShape.visible = false;
            this.addChild(this.itemHighlightShape);

            // kontejner položek
            this.itemsCont.x = SpellsUI.BORDER;
            this.itemsCont.y = SpellsUI.BORDER;
            this.addChild(this.itemsCont);
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }

        selectSpell(spell) {
            var bitmap = this.spellContent[this.spellIndex[spell]];
            this.itemHighlightShape.visible = true;
            this.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            this.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            this.choosenItem = spell;
        }

        spellInsert(spell) {
            var bitmap = this.game.resources.getBitmap(spell);
            this.itemsCont.addChild(bitmap);
            bitmap.x = this.spellContent.length * (Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            this.spellIndex[spell] = this.spellContent.length;
            this.spellContent.push(bitmap);

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;

            bitmap.on("mousedown", function() {
                this.selectSpell(spell);
            }, null, false);
        }

    }
}