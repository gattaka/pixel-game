var lich = lich || {};

(function () {

    var MapObjItem = function (invObj, quant) {
        this.invObj = invObj;
        this.quant = quant;
    };

    lich.MapObj = function (mapKey, mapSpriteWidth, mapSpriteHeight, mapSpriteX, mapSpriteY, invObj, quant, freq) {
        this.mapKey = mapKey;
        this.mapSpriteWidth = mapSpriteWidth;
        this.mapSpriteHeight = mapSpriteHeight;
        this.mapSpriteX = mapSpriteX;
        this.mapSpriteY = mapSpriteY;
        this.item = new MapObjItem(invObj, quant);
        this.freq = freq;
    };

    lich.InvObj = function (invKey, invSpriteWidth, invSpriteHeight, invSpriteX, invSpriteY, placeable, mapObj) {
        this.invKey = invKey;
        this.invSpriteWidth = invSpriteWidth;
        this.invSpriteHeight = invSpriteHeight;
        this.invSpriteX = invSpriteX;
        this.invSpriteY = invSpriteY;
        this.mapObj = mapObj;
        this.placeable = placeable;
    };

    lich.MapObjRegister = function () {
        var byIndex = [];
        var byKey = {};

        this.register = function (key, item) {
            var index = byIndex.length;
            byKey[key] = index;
            byIndex.push(item);
            return index;
        };

        this.getByIndex = function (index) {
            return byIndex[index];
        };

        this.getByKey = function (key) {
            return byIndex[byKey[key]];
        };
    };

})();