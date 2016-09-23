namespace Lich {

    export class InventoryUI extends PartsUI {

        static N = 10;
        static M = 3;
        static INV_SIZE = InventoryUI.N * InventoryUI.M;

        toggleFlag = true;

        choosenItem: string = null;
        draggedItem: string = null;

        invContent = new Array<ItemUI>();
        itemHighlight: createjs.Shape;
        itemsCont = new createjs.Container();

        collapsed = false;
        collapsedCont = new createjs.Container();
        collapsedItem: ItemUI;
        collapsedHighlight: createjs.Shape;

        constructor() {
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
                if (self.collapsedItem != null) {
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
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant -= quant;
                    invItem.count.setText(invItem.quant);
                    if (self.collapsedItem != null) {
                        self.collapsedItem.count.setText(invItem.quant);
                    }
                    if (invItem.quant == 0) {
                        if (self.collapsedItem != null) {
                            self.collapsedCont.removeChild(self.collapsedItem);
                            self.collapsedItem = null;
                            self.collapsedHighlight.visible = false;
                        }
                        self.itemsCont.removeChild(invItem);
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
                        self.collapsedItem.count.setText(invItem.quant);
                    }
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (self.invContent[i] == null) {
                    let itemUI = new ItemUI(item, quant);
                    self.invContent[i] = itemUI;
                    self.itemsCont.addChild(itemUI);
                    itemUI.x = (i % InventoryUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);
                    itemUI.y = Math.floor(i / InventoryUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);

                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
                    itemUI.hitArea = hitArea;

                    (function() {
                        var currentItem = self.invContent[i];
                        itemUI.on("mousedown", function(evt) {
                            self.itemHighlight.visible = true;
                            self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                            self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;

                            self.collapsedCont.removeChild(self.collapsedItem);
                            self.collapsedHighlight.visible = true;
                            self.collapsedItem = new ItemUI(item, currentItem.quant);
                            self.collapsedCont.addChild(self.collapsedItem);
                            self.collapsedItem.x = PartsUI.BORDER;
                            self.collapsedItem.y = PartsUI.BORDER;
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