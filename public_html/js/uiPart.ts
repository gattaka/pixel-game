namespace Lich {

    export class UIPart extends createjs.Container {

        outerShape: createjs.Shape;

        constructor(public width: number, public height: number) {
            super();

            this.outerShape = new createjs.Shape();
            this.drawBackground();
            this.addChild(this.outerShape);
        }

        protected drawBackground() {
            this.outerShape.graphics.clear();
            this.outerShape.graphics.setStrokeStyle(2);
            this.outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            this.outerShape.graphics.drawRoundRect(0, 0, this.width, this.height, 3);
        }
    }

    export class DebugLogUI extends UIPart {

        static PADDING = 5;

        constructor(x: number, y: number) {
            super(x, y);
        }

        public addNextChild(child: createjs.DisplayObject) {
            if (this.height == 0) {
                this.height = DebugLogUI.PADDING * 2;
            }

            child.x = DebugLogUI.PADDING;
            child.y = this.height - DebugLogUI.PADDING;
            this.height += child.height + DebugLogUI.PADDING;

            if (child.width + 2 * DebugLogUI.PADDING > this.width) {
                this.width = child.width + 2 * DebugLogUI.PADDING;
            }

            super.addChild(child);

            this.drawBackground();
        }
    }

    class InvItem {
        constructor(public item: string,
            public quant: number,
            public element: createjs.Sprite,
            public count: Label) { }
    }

    export class InventoryUI extends UIPart {


        static INV_BORDER = 10;
        static INV_SELECT_BORDER = 5;
        static INV_SPACING = 12;
        static INV_LINE = 10;
        static INV_SIZE = 20;
        static TEXT_SIZE = 15;

        toggleFlag = true;

        choosenItem: string = null;
        draggedItem: string = null;

        invContent = new Array<InvItem>();
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

        decrease(item: string, quant: number) {
            var self = this;
            // TODO v případě 0 odebrat
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant -= quant;
                    invItem.count.setText(invItem.quant);
                    if (invItem.quant == 0) {
                        self.itemsCont.removeChild(invItem.element);
                        self.itemsCont.removeChild(invItem.count);
                        self.choosenItem = null;
                        self.draggedItem = null;
                        self.itemHighlightShape.visible = false;
                        self.invContent[i] = null;
                    }
                    return; // hotovo
                }
            }
        }

        invInsert(item: string, quant: number) {
            var self = this;
            // zkus zvýšit počet
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant += quant;
                    invItem.count.setText(invItem.quant);
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (self.invContent[i] == null) {
                    var sprite = self.game.resources.getSprite(item);
                    self.itemsCont.addChild(sprite);
                    sprite.x = (i % InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    sprite.y = Math.floor(i / InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    var text = new Label("" + quant, InventoryUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
                    self.itemsCont.addChild(text);
                    text.x = sprite.x;
                    text.y = sprite.y + Resources.PARTS_SIZE - InventoryUI.TEXT_SIZE;
                    self.invContent[i] = new InvItem(item, quant, sprite, text);

                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
                    sprite.hitArea = hitArea;

                    sprite.on("mousedown", function(evt) {
                        if (self.choosenItem === item) {
                            self.choosenItem = null;
                            self.draggedItem = null;
                            self.itemHighlightShape.visible = false;
                        } else {
                            self.itemHighlightShape.visible = true;
                            self.itemHighlightShape.x = sprite.x - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            self.itemHighlightShape.y = sprite.y - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
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

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;

            bitmap.on("mousedown", function() {
                self.selectSpell(spell);
            }, null, false);
        }

    }
}