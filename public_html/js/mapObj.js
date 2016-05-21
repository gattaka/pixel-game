var Lich;
(function (Lich) {
    var MapObjItem = (function () {
        function MapObjItem(invObj, quant) {
            this.invObj = invObj;
            this.quant = quant;
        }
        ;
        return MapObjItem;
    }());
    Lich.MapObjItem = MapObjItem;
    var MapObj = (function () {
        function MapObj(mapKey, mapSpriteWidth, mapSpriteHeight, mapSpriteX, mapSpriteY, invObj, quant, freq) {
            this.mapKey = mapKey;
            this.mapSpriteWidth = mapSpriteWidth;
            this.mapSpriteHeight = mapSpriteHeight;
            this.mapSpriteX = mapSpriteX;
            this.mapSpriteY = mapSpriteY;
            this.invObj = invObj;
            this.quant = quant;
            this.freq = freq;
            this.item = new MapObjItem(invObj, quant);
        }
        return MapObj;
    }());
    Lich.MapObj = MapObj;
    var InvObj = (function () {
        function InvObj(invKey, invSpriteWidth, invSpriteHeight, invSpriteX, invSpriteY, placeable, mapObj) {
            this.invKey = invKey;
            this.invSpriteWidth = invSpriteWidth;
            this.invSpriteHeight = invSpriteHeight;
            this.invSpriteX = invSpriteX;
            this.invSpriteY = invSpriteY;
            this.placeable = placeable;
            this.mapObj = mapObj;
        }
        ;
        return InvObj;
    }());
    Lich.InvObj = InvObj;
    var MapObjRegister = (function () {
        function MapObjRegister() {
            this.byIndex = [];
            this.byKey = {};
        }
        ;
        MapObjRegister.prototype.register = function (key, item) {
            var index = this.byIndex.length;
            this.byKey[key] = index;
            this.byIndex.push(item);
            return index;
        };
        ;
        MapObjRegister.prototype.getByIndex = function (index) {
            return this.byIndex[index];
        };
        ;
        MapObjRegister.prototype.getByKey = function (key) {
            return this.byIndex[this.byKey[key]];
        };
        ;
        return MapObjRegister;
    }());
    Lich.MapObjRegister = MapObjRegister;
    ;
})(Lich || (Lich = {}));
