namespace Lich {

    class LinkedHashMap<V> {
        [key: string]: V;
    }

    export class InventoryUI extends PartsUI {

        static N = 3;
        static M = 2;
        static INV_SIZE = InventoryUI.N * InventoryUI.M;

        toggleFlag = true;

        choosenItem: string = null;
        draggedItem: string = null;

        lineOffset = 0;

        // --- Virtuální inventář ---
        // pole obsazení položkami
        itemsTypeArray = new Array<string>();
        // mapa pořadí typů položek
        itemsTypeIndexMap = new LinkedHashMap<number>();
        // mapa počtů dle typu položky
        itemsQuantityMap = new LinkedHashMap<number>();

        // --- UI ----
        // mapa existujících UI prvků dle typu položky
        itemsUIMap = new LinkedHashMap<ItemUI>();
        itemHighlight: createjs.Shape;
        itemHighlightVisibleBeforeCollapse = true;
        itemsCont = new createjs.Container();

        collapsed = false;
        collapsedCont = new createjs.Container();
        collapsedItem: ItemUI;
        collapsedHighlight: createjs.Shape;

        upBtn: Button;
        downBtn: Button;

        constructor(private recipeListener: RecipeListener) {
            super(InventoryUI.N, InventoryUI.M);

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
            let upBtn = new Button(Resources.UI_UP_KEY);
            let downBtn = new Button(Resources.UI_DOWN_KEY);
            self.upBtn = upBtn;
            self.downBtn = downBtn;
            self.addChild(upBtn);
            self.addChild(downBtn);
            upBtn.x = PartsUI.pixelsByX(InventoryUI.N) + PartsUI.SELECT_BORDER;
            upBtn.y = 0;
            downBtn.x = upBtn.x;
            downBtn.y = PartsUI.pixelsByX(InventoryUI.M) - Resources.PARTS_SIZE - PartsUI.BORDER;

            let btnHitAreaSide = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;

            let upBtnHitArea = new createjs.Shape();
            upBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            upBtn.hitArea = upBtnHitArea;
            upBtn.on("mousedown", function (evt) {
                if (self.lineOffset > 0) {
                    self.lineOffset--;
                    self.render();
                }
            }, null, false);

            let downBtnHitArea = new createjs.Shape();
            downBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            downBtn.hitArea = downBtnHitArea;
            downBtn.on("mousedown", function (evt) {
                let occupLines = Math.ceil(self.itemsTypeArray.length / InventoryUI.N);
                if (self.lineOffset < occupLines - InventoryUI.M) {
                    self.lineOffset++;
                    self.render();
                }
            }, null, false);

        }

        render() {
            this.itemsCont.removeAllChildren();
            this.itemHighlight.visible = false;
            let itemsOffset = this.lineOffset * InventoryUI.N;
            for (let i = itemsOffset;
                i < InventoryUI.N * InventoryUI.M + itemsOffset && i < this.itemsTypeArray.length;
                i++) {
                this.createUIItem(this.itemsTypeArray[i], i - itemsOffset);
            }
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
                    self.itemHighlight.visible = self.itemHighlightVisibleBeforeCollapse;
                    self.upBtn.visible = true;
                    self.downBtn.visible = true;
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
                }
                self.itemsCont.visible = self.collapsed;
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

        decrease(item: string, quantChange: number) {
            var self = this;
            var itemUI = self.itemsUIMap[item];
            if (itemUI) {
                var quant = self.itemsQuantityMap[item];
                quant -= quantChange;
                self.itemsQuantityMap[item] = quant;
                self.recipeListener.updateQuant(item, quant);
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
                    self.draggedItem = null;
                    self.itemHighlight.visible = false;
                    self.itemsQuantityMap[item] = null;
                    self.itemsUIMap[item] = null
                    self.itemsTypeArray[self.itemsTypeIndexMap[item]] = null;
                    self.itemsTypeIndexMap[item] = null;
                }
            }
        }

        invInsert(item: string, quantChange: number) {
            let self = this;
            let quant = quantChange;
            if (self.itemsTypeIndexMap[item] || self.itemsTypeIndexMap[item] == 0) {
                // pokud už existuje zvyš počet
                quant = self.itemsQuantityMap[item];
                quant += quantChange;
                self.itemsQuantityMap[item] = quant;
                self.recipeListener.updateQuant(item, quant);
                // pokud je ve viditelné části INV, rovnou aktualizuj popisek množství
                let itemUI = self.itemsUIMap[item];
                if (itemUI) {
                    itemUI.count.setText(quant);
                    if (self.choosenItem === item) {
                        self.collapsedItem.count.setText(quant);
                    }
                }
            } else {
                // pokud neexistuje založ novou
                let i = 0;
                for (i = 0; i < self.itemsTypeArray.length; i++) {
                    // buď najdi volné místo...
                    if (!self.itemsTypeArray[i]) {
                        break;
                    }
                }
                // ...nebo vlož položku na konec pole
                self.itemsTypeArray[i] = item;
                self.itemsTypeIndexMap[item] = i;
                self.itemsQuantityMap[item] = quant;

                let itemsOffset = self.lineOffset * InventoryUI.N;
                if (i >= itemsOffset
                    && i < InventoryUI.N * InventoryUI.M + itemsOffset) {
                    self.createUIItem(item, i);
                }

                return true; // usazeno
            }
        }

        createUIItem(item: string, i: number) {
            let self = this;
            let quant = self.itemsQuantityMap[item];
            let itemUI = new ItemUI(item, quant);
            self.itemsUIMap[item] = itemUI;
            self.itemsCont.addChild(itemUI);
            itemUI.x = (i % InventoryUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);
            itemUI.y = Math.floor(i / InventoryUI.N) * (Resources.PARTS_SIZE + PartsUI.SPACING);

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
                    self.draggedItem = item;

                    self.collapsedCont.removeChild(self.collapsedItem);
                    self.collapsedHighlight.visible = true;
                    self.collapsedItem = new ItemUI(item, quant);
                    self.collapsedCont.addChild(self.collapsedItem);
                    self.collapsedItem.x = PartsUI.BORDER;
                    self.collapsedItem.y = PartsUI.BORDER;
                    self.collapsedCont.visible = false;
                }, null, false);
            })();
        }
    }

}