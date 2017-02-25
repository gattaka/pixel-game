namespace Lich {

    export class InventoryUI extends PartsUI {

        static DEFAULT_N = 4;
        static DEFAULT_M = 8;

        lineOffset = 0;

        // mapa existujících UI prvků dle typu položky
        itemsUIMap = new HashMap<ItemUI>();
        itemHighlight: PIXI.Graphics;
        itemHighlightVisibleBeforeCollapse = true;
        itemsCont = new PIXI.Container();

        collapsed = false;
        collapsedCont = new PIXI.Container();
        collapsedItem: ItemUI;
        collapsedHighlight: PIXI.Graphics;

        upBtn: Button;
        downBtn: Button;

        expandedX: number;
        expandedY: number;

        collapsedX: number;
        collapsedY: number;

        constructor(n = InventoryUI.DEFAULT_N, m = InventoryUI.DEFAULT_M) {
            super(n, m);

            var self = this;

            // zvýraznění vybrané položky
            self.itemHighlight = new Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);

            // kontejner položek
            self.itemsCont.x = PartsUI.BORDER;
            self.itemsCont.y = PartsUI.BORDER;
            self.addChild(self.itemsCont);

            // kontejner a zvýraznění zabaleného inventáře  
            self.addChild(self.collapsedCont);
            self.collapsedCont.visible = false;
            self.collapsedHighlight = new Highlight();
            self.collapsedHighlight.x = PartsUI.SELECT_BORDER;
            self.collapsedHighlight.y = PartsUI.SELECT_BORDER;
            self.collapsedCont.addChild(self.collapsedHighlight);

            // tlačítka
            let upBtn = new Button(UISpriteKey.UI_UP_KEY);
            let downBtn = new Button(UISpriteKey.UI_DOWN_KEY);
            self.upBtn = upBtn;
            self.downBtn = downBtn;
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = PartsUI.pixelsByX(self.n) + PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = PartsUI.pixelsByX(self.m) - Resources.PARTS_SIZE - PartsUI.BORDER;

            upBtn.on("mousedown", () => {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            });

            downBtn.on("mousedown", () => {
                let occupLines = Math.ceil(Inventory.getInstance().getLength() / self.n);
                if (self.lineOffset < occupLines - self.m) {
                    self.lineOffset++;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            });

            // let offset = 5;
            // self.cache(-offset, -offset,
            //     self.width + Button.sideSize + PartsUI.SELECT_BORDER + offset * 2,
            //     self.height + offset * 2);

            EventBus.getInstance().registerConsumer(EventType.INV_CHANGE, (payload: InvChangeEventPayload) => {
                if (payload.amount > 0) {
                    self.invInsert(payload.key, payload.amount);
                } else if (payload.amount < 0) {
                    self.invRemove(payload.key, -payload.amount);
                }
                return false;
            });

        }

        render() {
            let self = this;
            let inventory = Inventory.getInstance();
            this.itemsCont.removeChildren();
            this.itemHighlight.visible = false;
            let itemsOffset = this.lineOffset * self.n;
            for (let i = itemsOffset;
                i < self.n * self.m + itemsOffset && i < inventory.getLength();
                i++) {
                if (inventory.getItem(i) != null) {
                    this.createUIItem(inventory.getItem(i), i - itemsOffset);
                }
            }
            // this.updateCache();
        }

        toggle() {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                // jsem zabalen?
                if (self.collapsed) {
                    var newHeight = PartsUI.pixelsByX(self.m);
                    self.y = self.y - (newHeight - self.height);
                    self.width = PartsUI.pixelsByX(self.n);
                    self.height = newHeight;
                    self.drawBackground();
                    self.itemHighlight.visible = self.itemHighlightVisibleBeforeCollapse;
                    self.upBtn.visible = true;
                    self.downBtn.visible = true;
                    if (self.collapsedX && self.collapsedY) {
                        self.x = self.expandedX;
                        self.y = self.expandedY;
                    }
                } else {
                    var newHeight = PartsUI.pixelsByX(1);
                    self.y = self.y + (self.height - newHeight);
                    self.width = PartsUI.pixelsByX(1);
                    self.height = newHeight;
                    self.drawBackground();
                    self.itemHighlightVisibleBeforeCollapse = self.itemHighlight.visible;
                    self.itemHighlight.visible = false;
                    self.upBtn.visible = false;
                    self.downBtn.visible = false;
                    if (self.collapsedX && self.collapsedY) {
                        self.x = self.collapsedX;
                        self.y = self.collapsedY;
                    }
                }
                self.itemsCont.visible = self.collapsed;
                if (self.collapsedItem != null) {
                    self.collapsedCont.visible = !self.collapsed;
                }
                self.collapsed = !self.collapsed;
                self.toggleFlag = false;
                // self.updateCache();
            }
        }

        prepareForToggle() {
            this.toggleFlag = true;
        }

        invRemove(item: InventoryKey, newQuant: number) {
            var self = this;
            var itemUI = self.itemsUIMap[item];
            if (itemUI) {
                itemUI.count.setText(newQuant);
                if (self.collapsedItem != null) {
                    self.collapsedItem.count.setText(newQuant);
                }
                if (newQuant == 0) {
                    if (self.collapsedItem != null) {
                        self.collapsedCont.removeChild(self.collapsedItem);
                        self.collapsedItem = null;
                        self.collapsedHighlight.visible = false;
                    }
                    self.itemsCont.removeChild(itemUI);
                    self.itemHighlight.visible = false;
                    self.itemsUIMap[item] = null
                    self.render();
                } else {
                    // self.updateCache();
                }
            }
        }

        invInsert(item: InventoryKey, newQuant: number) {
            let self = this;
            let inventory = Inventory.getInstance();
            var itemUI = self.itemsUIMap[item];
            if (itemUI) {
                // pokud už existuje zvyš počet
                let itemUI = self.itemsUIMap[item];
                if (itemUI) {
                    itemUI.count.setText(newQuant);
                    if (inventory.getChoosenItem() == item) {
                        self.collapsedItem.count.setText(newQuant);
                    }
                }
            } else {
                // pokud ještě neexistuje a je na ní vidět, vytvoř 
                let i = inventory.getItemIndex(item);
                let itemsOffset = self.lineOffset * self.n;
                if (i >= itemsOffset
                    && i < self.n * self.m + itemsOffset) {
                    self.createUIItem(item, i - itemsOffset);
                }
            }
            // self.updateCache();
        }

        createUIItem(item: InventoryKey, i: number) {
            let self = this;
            let inventory = Inventory.getInstance();
            let quant = inventory.getItemQuant(item);
            let itemUI = new ItemUI(item, quant);
            self.itemsUIMap[item] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % self.n) * (Resources.PARTS_SIZE + PartsUI.SPACING);
            itemUI.y = Math.floor(i / self.n) * (Resources.PARTS_SIZE + PartsUI.SPACING);

            // TOOD
            // let hitArea = new createjs.Shape();
            // hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            // itemUI.hitArea = hitArea;

            if (inventory.getChoosenItem() == item) {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
            }

            (function () {
                var currentItem = self.itemsUIMap[item];
                itemUI.on("mousedown", () => {
                    self.itemHighlight.visible = true;
                    self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    inventory.setChoosenItem(item);

                    self.collapsedCont.removeChild(self.collapsedItem);
                    self.collapsedHighlight.visible = true;
                    self.collapsedItem = new ItemUI(item, quant);
                    self.collapsedCont.addChild(self.collapsedItem);
                    self.collapsedItem.x = PartsUI.BORDER;
                    self.collapsedItem.y = PartsUI.BORDER;
                    self.collapsedCont.visible = false;
                    // self.updateCache();
                });
            })();
        }
    }

}