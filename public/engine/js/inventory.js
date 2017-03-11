var Lich;
(function (Lich) {
    var Inventory = (function () {
        function Inventory() {
            // pole inv položek
            this.itemsTypeArray = new Array();
            // mapa indexů pole položek dle inv klíče
            this.itemsTypeIndexMap = {};
            // mapa množství položek dle inv klíče
            this.itemsQuantityMap = {};
            this.choosenItem = null;
        }
        Inventory.getInstance = function () {
            if (!Inventory.INSTANCE) {
                Inventory.INSTANCE = new Inventory();
                // RecipeManager init
                Lich.RecipeManager.getInstance();
            }
            return Inventory.INSTANCE;
        };
        Inventory.prototype.serialize = function () {
            var _this = this;
            var array = [];
            this.itemsTypeArray.forEach(function (i) {
                if (i == 0 || i) {
                    array.push(_this.itemsQuantityMap[i]);
                    array.push(i);
                }
            });
            return array;
        };
        Inventory.prototype.deserialize = function (array) {
            for (var i = 0; i < array.length; i += 2) {
                var amount = array[i];
                var item = array[i + 1];
                this.invInsert(item, amount);
            }
        };
        Inventory.prototype.getLength = function () { return this.itemsTypeArray.length; };
        Inventory.prototype.getItem = function (i) { return this.itemsTypeArray[i]; };
        Inventory.prototype.getItemIndex = function (item) { return this.itemsTypeIndexMap[item]; };
        ;
        Inventory.prototype.getItemQuant = function (item) { return this.itemsQuantityMap[item]; };
        ;
        Inventory.prototype.getChoosenItem = function () { return this.choosenItem; };
        Inventory.prototype.setChoosenItem = function (item) { this.choosenItem = item; };
        Inventory.prototype.invRemove = function (item, quantChange) {
            var self = this;
            var quant = self.itemsQuantityMap[item];
            quant -= quantChange;
            self.itemsQuantityMap[item] = quant;
            if (quant == 0) {
                // položku odeber z listu a sesuň následující položky za ní tak, 
                // aby v inventáři nebyly díry
                self.choosenItem = null;
                self.itemsQuantityMap[item] = null;
                var index = self.itemsTypeIndexMap[item];
                self.itemsTypeArray.splice(index, 1);
                self.itemsTypeIndexMap[item] = null;
                for (var i = index; i < self.itemsTypeArray.length; i++) {
                    self.itemsTypeIndexMap[self.itemsTypeArray[i]]--;
                }
            }
            Lich.EventBus.getInstance().fireEvent(new Lich.InvChangeEventPayload(item, -quant));
        };
        Inventory.prototype.invInsert = function (item, quantChange) {
            var self = this;
            var quant = quantChange;
            if (self.itemsTypeIndexMap[item] || self.itemsTypeIndexMap[item] == 0) {
                // pokud už existuje zvyš počet
                quant = self.itemsQuantityMap[item];
                quant += quantChange;
                self.itemsQuantityMap[item] = quant;
            }
            else {
                var i = self.itemsTypeArray.length;
                self.itemsTypeArray[i] = item;
                self.itemsTypeIndexMap[item] = i;
                self.itemsQuantityMap[item] = quant;
            }
            Lich.EventBus.getInstance().fireEvent(new Lich.InvChangeEventPayload(item, quant));
        };
        return Inventory;
    }());
    Lich.Inventory = Inventory;
})(Lich || (Lich = {}));
