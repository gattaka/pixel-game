namespace Lich {

    class InvItem {
        constructor(public item: string,
            public quant: number,
            public element: createjs.Sprite,
            public count: Label) { }
    }

    export class InventoryUI extends PartsUI {

        static N = 10;
        static M = 3;
        static INV_SIZE = InventoryUI.N * InventoryUI.M;

        toggleFlag = true;

        choosenItem: string = null;
        draggedItem: string = null;

        invContent = new Array<InvItem>();
        itemHighlight: createjs.Shape;
        itemsCont = new createjs.Container();

        collapsed = false;
        collapsedCont = new createjs.Container();
        collapsedSprite: createjs.Sprite;
        collapsedCount: Label;
        collapsedHighlight: createjs.Shape;

        constructor(public game: Game) {
            super(InventoryUI.N, InventoryUI.M);

            var self = this;

            // zvýraznění vybrané položky
            self.itemHighlight = self.createHighlightShape();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);

            // kontejner položek
            self.itemsCont.x = PartsUI.BORDER;
            self.itemsCont.y = PartsUI.BORDER;
            self.addChild(self.itemsCont);

            // kontejner a zvýraznění zabaleného inventáře  
            self.addChild(self.collapsedCont);
            self.collapsedCont.visible = false;
            self.collapsedHighlight = self.createHighlightShape();
            self.collapsedHighlight.x = PartsUI.SELECT_BORDER;
            self.collapsedHighlight.y = PartsUI.SELECT_BORDER;
            self.collapsedCont.addChild(self.collapsedHighlight);
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }

        toggleInv() {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                // jsem zabalen?
                if (self.collapsed) {
                    var newHeight = PartsUI.pixelsByX(InventoryUI.M);
                    self.y = self.y - (newHeight - self.height);
                    self.width = PartsUI.pixelsByX(InventoryUI.N);
                    self.height = newHeight;
                    self.drawBackground();
                } else {
                    var newHeight = PartsUI.pixelsByX(1);
                    self.y = self.y + (self.height - newHeight);
                    self.width = PartsUI.pixelsByX(1);
                    self.height = newHeight;
                    self.drawBackground();
                }
                self.itemsCont.visible = self.collapsed;
                self.itemHighlight.visible = self.collapsed && self.choosenItem != null;
                if (self.collapsedSprite != null) {
                    self.collapsedCont.visible = !self.collapsed;
                }
                self.collapsed = !self.collapsed;
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
                    if (self.collapsedSprite != null) {
                        self.collapsedCount.setText(invItem.quant);
                    }
                    if (invItem.quant == 0) {
                        if (self.collapsedSprite != null) {
                            self.collapsedCont.removeChild(self.collapsedSprite);
                            self.collapsedCont.removeChild(self.collapsedCount);
                            self.collapsedSprite = null;
                            self.collapsedCount = null;
                            self.collapsedHighlight.visible = false;
                        }
                        self.itemsCont.removeChild(invItem.element);
                        self.itemsCont.removeChild(invItem.count);
                        self.choosenItem = null;
                        self.draggedItem = null;
                        self.itemHighlight.visible = false;
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
                    if (self.choosenItem === item) {
                        self.collapsedCount.setText(invItem.quant);
                    }
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (self.invContent[i] == null) {
                    var invDef: InvObjDefinition = Resources.invObjectsDefs[item];
                    var frames = 1;
                    if (typeof invDef === "undefined" || invDef == null) {
                        frames = 1;
                    } else {
                        frames = invDef.frames;
                    }
                    var sprite = self.game.resources.getSprite(item, frames);
                    self.itemsCont.addChild(sprite);
                    sprite.x = (i % InventoryUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);
                    sprite.y = Math.floor(i / InventoryUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);
                    var text = new Label("" + quant, PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
                    self.itemsCont.addChild(text);
                    text.x = sprite.x;
                    text.y = sprite.y + Resources.PARTS_SIZE - PartsUI.TEXT_SIZE;
                    self.invContent[i] = new InvItem(item, quant, sprite, text);

                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
                    sprite.hitArea = hitArea;

                    (function() {
                        var currentItem = self.invContent[i];
                        sprite.on("mousedown", function(evt) {
                            self.itemHighlight.visible = true;
                            self.itemHighlight.x = sprite.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                            self.itemHighlight.y = sprite.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;

                            self.collapsedCont.removeChild(self.collapsedSprite);
                            self.collapsedCont.removeChild(self.collapsedCount);
                            self.collapsedHighlight.visible = true;
                            self.collapsedSprite = self.game.resources.getSprite(item, frames);
                            self.collapsedCount = new Label("" + currentItem.quant, PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
                            self.collapsedCont.addChild(self.collapsedSprite);
                            self.collapsedCont.addChild(self.collapsedCount);
                            self.collapsedSprite.x = PartsUI.BORDER
                            self.collapsedSprite.y = PartsUI.BORDER
                            self.collapsedCount.x = PartsUI.BORDER;
                            self.collapsedCount.y = PartsUI.BORDER + Resources.PARTS_SIZE - PartsUI.TEXT_SIZE;
                            self.collapsedCont.visible = false;
                        }, null, false);
                    })();

                    return true; // usazeno
                }
            }
            return false; // nevešel se
        }
    }

}