namespace Lich {
    export class MapObjItem {
        constructor(public invObj, public quant) { };
    }

    export class MapObj {
        item: MapObjItem;
        constructor(public mapKey, public mapSpriteWidth, public mapSpriteHeight, public mapSpriteX, public mapSpriteY, public invObj, public quant, public freq) {
            this.item = new MapObjItem(invObj, quant);
        }
    }

    export class InvObj {
        constructor(public invKey, public invSpriteWidth, public invSpriteHeight, public invSpriteX, public invSpriteY, public placeable, public mapObj) { };
    }

    export class MapObjRegister {
        byIndex = [];
        byKey = {};

        constructor() { };

        register(key, item) {
            var index = this.byIndex.length;
            this.byKey[key] = index;
            this.byIndex.push(item);
            return index;
        };

        getByIndex(index) {
            return this.byIndex[index];
        };

        getByKey(key) {
            return this.byIndex[this.byKey[key]];
        };
    };

}