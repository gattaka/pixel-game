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

            var self = this;

            // zvýraznění vybrané položky

            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Resources.PARTS_SIZE + InventoryUI.INV_SELECT_BORDER * 2, Resources.PARTS_SIZE
                + InventoryUI.INV_SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);

            // kontejner položek

            self.itemsCont.x = InventoryUI.INV_BORDER;
            self.itemsCont.y = InventoryUI.INV_BORDER;
            self.addChild(self.itemsCont);
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
            var self = this;
            if (self.toggleFlag) {
                self.visible = !(self.visible);
                self.toggleFlag = false;
            }
        }

        prepareForToggleInv() {
            this.toggleFlag = true;
        }

        invInsert(item, quant) {
            var self = this;
            // zkus zvýšit počet
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof self.invContent[i] !== "undefined" && self.invContent[i].item === item) {
                    self.invContent[i].quant += quant;
                    self.invContent[i].count.text = self.invContent[i].quant;
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof self.invContent[i] === "undefined") {
                    var bitmap = self.game.resources.getItemBitmap(item);
                    self.itemsCont.addChild(bitmap);
                    bitmap.x = (i % InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    bitmap.y = Math.floor(i / InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    var text = new createjs.Text(quant, "bold " + InventoryUI.TEXT_SIZE + "px Arial", "#ff0");
                    self.itemsCont.addChild(text);
                    text.x = bitmap.x;
                    text.y = bitmap.y + Resources.PARTS_SIZE - InventoryUI.TEXT_SIZE;
                    self.invContent[i] = {
                        item: item,
                        quant: quant,
                        element: bitmap,
                        count: text
                    };

                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
                    bitmap.hitArea = hitArea;

                    bitmap.on("mousedown", function(evt) {
                        if (self.choosenItem === item) {
                            self.choosenItem = null;
                            self.draggedItem = null;
                            self.itemHighlightShape.visible = false;
                        } else {
                            self.itemHighlightShape.visible = true;
                            self.itemHighlightShape.x = bitmap.x - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            self.itemHighlightShape.y = bitmap.y - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;
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

            var self = this;

            // zatím rovnou:
            self.spellInsert(Resources.DIG_SPELL_KEY);
            self.spellInsert(Resources.PLACE_SPELL_KEY);
            self.spellInsert(Resources.FIREBALL_SPELL_KEY);

            self.selectSpell(Resources.FIREBALL_SPELL_KEY);

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

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;

            bitmap.on("mousedown", function() {
                self.selectSpell(spell);
            }, null, false);
        }

    }
}