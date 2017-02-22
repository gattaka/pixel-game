namespace Lich {

    export class Inventory {

        private static INSTANCE: Inventory;

        // pole inv položek
        private itemsTypeArray = new Array<InventoryKey>();
        // mapa indexů pole položek dle inv klíče
        private itemsTypeIndexMap: { [k: number]: number } = {};
        // mapa množství položek dle inv klíče
        private itemsQuantityMap: { [k: number]: number } = {};

        private choosenItem: InventoryKey = null;

        public static getInstance() {
            if (!Inventory.INSTANCE) {
                Inventory.INSTANCE = new Inventory();
            }
            return Inventory.INSTANCE;
        }

        private constructor() { }

        public serialize() {
            let array = [];
            this.itemsTypeArray.forEach((i: InventoryKey) => {
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

        getLength(): number { return this.itemsTypeArray.length; }

        getItem(i: number): InventoryKey { return this.itemsTypeArray[i]; }

        getItemIndex(item: InventoryKey): number { return this.itemsTypeIndexMap[item] };

        getItemQuant(item: InventoryKey): number { return this.getItemQuant[item] };

        getChoosenItem(): InventoryKey { return this.choosenItem; }

        setChoosenItem(item: InventoryKey) { this.choosenItem = item; }

        invRemove(item: InventoryKey, quantChange: number) {
            let self = this;
            let quant = self.itemsQuantityMap[item];
            quant -= quantChange;
            self.itemsQuantityMap[item] = quant;
            if (quant == 0) {
                // položku odeber z listu a sesuň následující položky za ní tak, 
                // aby v inventáři nebyly díry
                self.choosenItem = null;
                self.itemsQuantityMap[item] = null;
                let index = self.itemsTypeIndexMap[item];
                self.itemsTypeArray.splice(index, 1);
                self.itemsTypeIndexMap[item] = null;
                for (let i = index; i < self.itemsTypeArray.length; i++) {
                    self.itemsTypeIndexMap[self.itemsTypeArray[i]]--;
                }
            }
            EventBus.getInstance().fireEvent(new InvChangeEventPayload(item, -quant));
        }

        invInsert(item: InventoryKey, quantChange: number) {
            let self = this;
            let quant = quantChange;
            if (self.itemsTypeIndexMap[item] || self.itemsTypeIndexMap[item] == 0) {
                // pokud už existuje zvyš počet
                quant = self.itemsQuantityMap[item];
                quant += quantChange;
                self.itemsQuantityMap[item] = quant;
            } else {
                let i = self.itemsTypeArray.length;
                self.itemsTypeArray[i] = item;
                self.itemsTypeIndexMap[item] = i;
                self.itemsQuantityMap[item] = quant;
            }
            EventBus.getInstance().fireEvent(new InvChangeEventPayload(item, quant));
        }
    }
}