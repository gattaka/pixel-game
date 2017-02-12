namespace Lich {

    export class InventoryUI extends PartsUI {

        static DEFAULT_N = 4;
        static DEFAULT_M = 8;

        choosenItem: InventoryKey = null;

        lineOffset = 0;

        // --- Virtuální inventář ---
        // pole obsazení položkami
        itemsTypeArray = new Array<InventoryKey>();
        // mapa pořadí typů položek
        itemsTypeIndexMap = new HashMap<number>();
        // mapa počtů dle typu položky
        itemsQuantityMap = new HashMap<number>();

        // --- UI ----
        // mapa existujících UI prvků dle typu položky
        itemsUIMap = new HashMap<ItemUI>();
        itemHighlight: createjs.Shape;
        itemHighlightVisibleBeforeCollapse = true;
        itemsCont = new createjs.SpriteContainer();

        collapsed = false;
        collapsedCont = new createjs.SpriteContainer();
        collapsedItem: ItemUI;
        collapsedHighlight: createjs.Shape;

        upBtn: Button;
        downBtn: Button;

        expandedX: number;
        expandedY: number;

        collapsedX: number;
        collapsedY: number;

        public serialize() {
            let array = [];
            this.itemsTypeArray.forEach((i) => {
                if (i == 0 || i) {
                    array.push(this.itemsQuantityMap[i]);
                    array.push(i);
                }
            });
            return array;
        }

        public deserialize(array) {
            for (let i = 0; i < array.length; i += 2) {
                let amount = array[i];
                let item = array[i + 1];
                this.invInsert(item, amount);
            }
        }

        constructor(private recipeManager: RecipeManager, n = InventoryUI.DEFAULT_N, m = InventoryUI.DEFAULT_M) {
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
            let upBtn = new Button(UIGFXKey.UI_UP_KEY);
            let downBtn = new Button(UIGFXKey.UI_DOWN_KEY);
            self.upBtn = upBtn;
            self.downBtn = downBtn;
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = PartsUI.pixelsByX(self.n) + PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = PartsUI.pixelsByX(self.m) - Resources.PARTS_SIZE - PartsUI.BORDER;

            upBtn.on("mousedown", function (evt) {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            }, null, false);

            downBtn.on("mousedown", function (evt) {
                let occupLines = Math.ceil(self.itemsTypeArray.length / self.n);
                if (self.lineOffset < occupLines - self.m) {
                    self.lineOffset++;
                    self.render();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            }, null, false);

            let offset = 5;
            self.cache(-offset, -offset,
                self.width + Button.sideSize + PartsUI.SELECT_BORDER + offset * 2,
                self.height + offset * 2);

        }

        render() {
            let self = this;
            this.itemsCont.removeAllChildren();
            this.itemHighlight.visible = false;
            let itemsOffset = this.lineOffset * self.n;
            for (let i = itemsOffset;
                i < self.n * self.m + itemsOffset && i < this.itemsTypeArray.length;
                i++) {
                if (this.itemsTypeArray[i] != null) {
                    this.createUIItem(this.itemsTypeArray[i], i - itemsOffset);
                }
            }
            this.updateCache();
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
                self.updateCache();
            }
        }

        prepareForToggle() {
            this.toggleFlag = true;
        }

        invRemove(item: InventoryKey, quantChange: number) {
            var self = this;
            var itemUI = self.itemsUIMap[item];
            if (itemUI) {
                var quant = self.itemsQuantityMap[item];
                quant -= quantChange;
                self.itemsQuantityMap[item] = quant;
                self.recipeManager.updateQuant(item, quant);
                itemUI.count.setText(quant);
                if (self.collapsedItem != null) {
                    self.collapsedItem.count.setText(quant);
                }
                if (quant == 0) {
                    if (self.collapsedItem != null) {
                        self.collapsedCont.removeChild(self.collapsedItem);
                        self.collapsedItem = null;
                        self.collapsedHighlight.visible = false;
                    }
                    self.itemsCont.removeChild(itemUI);
                    self.choosenItem = null;
                    self.itemHighlight.visible = false;
                    self.itemsQuantityMap[item] = null;
                    self.itemsUIMap[item] = null
                    let index = self.itemsTypeIndexMap[item];
                    self.itemsTypeArray.splice(index, 1);
                    self.itemsTypeIndexMap[item] = null;
                    for (let i = index; i < self.itemsTypeArray.length; i++) {
                        self.itemsTypeIndexMap[self.itemsTypeArray[i]]--;
                    }

                    self.render();
                } else {
                    self.updateCache();
                }
            }
        }

        invInsert(item: InventoryKey, quantChange: number) {
            let self = this;
            let quant = quantChange;
            if (self.itemsTypeIndexMap[item] || self.itemsTypeIndexMap[item] == 0) {
                // pokud už existuje zvyš počet
                quant = self.itemsQuantityMap[item];
                quant += quantChange;
                self.itemsQuantityMap[item] = quant;
                self.recipeManager.updateQuant(item, quant);
                // pokud je ve viditelné části INV, rovnou aktualizuj popisek množství
                let itemUI = self.itemsUIMap[item];
                if (itemUI) {
                    itemUI.count.setText(quant);
                    if (self.choosenItem === item) {
                        self.collapsedItem.count.setText(quant);
                    }
                }
            } else {
                let i = self.itemsTypeArray.length;
                self.itemsTypeArray[i] = item;
                self.itemsTypeIndexMap[item] = i;
                self.itemsQuantityMap[item] = quant;
                self.recipeManager.updateQuant(item, quant);

                let itemsOffset = self.lineOffset * self.n;
                if (i >= itemsOffset
                    && i < self.n * self.m + itemsOffset) {
                    self.createUIItem(item, i - itemsOffset);
                }
            }
            self.updateCache();
        }

        createUIItem(item: InventoryKey, i: number) {
            let self = this;
            let quant = self.itemsQuantityMap[item];
            let itemUI = new ItemUI(item, quant);
            self.itemsUIMap[item] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % self.n) * (Resources.PARTS_SIZE + PartsUI.SPACING);
            itemUI.y = Math.floor(i / self.n) * (Resources.PARTS_SIZE + PartsUI.SPACING);

            let hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            itemUI.hitArea = hitArea;

            if (self.choosenItem == item) {
                self.itemHighlight.visible = true;
                self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
            }

            (function () {
                var currentItem = self.itemsUIMap[item];
                itemUI.on("mousedown", function (evt) {
                    self.itemHighlight.visible = true;
                    self.itemHighlight.x = itemUI.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    self.itemHighlight.y = itemUI.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
                    self.choosenItem = item;

                    self.collapsedCont.removeChild(self.collapsedItem);
                    self.collapsedHighlight.visible = true;
                    self.collapsedItem = new ItemUI(item, quant);
                    self.collapsedCont.addChild(self.collapsedItem);
                    self.collapsedItem.x = PartsUI.BORDER;
                    self.collapsedItem.y = PartsUI.BORDER;
                    self.collapsedCont.visible = false;
                    self.updateCache();
                }, null, false);
            })();
        }
    }

}