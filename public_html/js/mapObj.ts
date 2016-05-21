namespace Lich {
    export class MapObjItem {
        constructor(public invObj: number, public quant: number) { };
    }

    export class MapObj {
        item: MapObjItem;
        constructor(public mapKey, public mapSpriteWidth: number, public mapSpriteHeight: number, public mapSpriteX: number, public mapSpriteY: number, public invObj : number, public quant, public freq: number) {
            this.item = new MapObjItem(invObj, quant);
        }
    }

    export class InvObj {
        constructor(public invKey, public invSpriteWidth: number, public invSpriteHeight: number, public invSpriteX: number, public invSpriteY: number, public placeable: boolean, public mapObj) { };
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