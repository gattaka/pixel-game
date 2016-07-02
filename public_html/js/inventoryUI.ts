namespace Lich {

    class InvItem {
        constructor(public item: string,
            public quant: number,
            public element: createjs.Sprite,
            public count: Label) { }
    }

    export class InventoryUI extends UIPart {

        static INV_LINE = 10;
        static INV_SIZE = 20;

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
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Resources.PARTS_SIZE + UIPart.SELECT_BORDER * 2, Resources.PARTS_SIZE
                + UIPart.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);

            // kontejner položek

            self.itemsCont.x = UIPart.BORDER;
            self.itemsCont.y = UIPart.BORDER;
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
                    sprite.x = (i % InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + UIPart.SPACING);
                    sprite.y = Math.floor(i / InventoryUI.INV_LINE) * (Resources.PARTS_SIZE + UIPart.SPACING);
                    var text = new Label("" + quant, UIPart.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
                    self.itemsCont.addChild(text);
                    text.x = sprite.x;
                    text.y = sprite.y + Resources.PARTS_SIZE - UIPart.TEXT_SIZE;
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
                            self.itemHighlightShape.x = sprite.x - UIPart.SELECT_BORDER + UIPart.BORDER;
                            self.itemHighlightShape.y = sprite.y - UIPart.SELECT_BORDER + UIPart.BORDER;
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

}