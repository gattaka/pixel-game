/**
 * Objekty jsou ve 4 formách:
 *
 * 1. Umístěn na mapě (strom)
 * 2. Umístěn ve světě (pokácený strom -> kusy dřeva), zde se eviduje množství do INV
 * 3. V inventáři
 * 4. Znovu umístěn na mapu (strom -> dřevo -> umístit dřevo, nikoliv strom)
 */
var Lich;
(function (Lich) {
    /**
     * Tuple pro INV objekt a množství z map objektu
     */
    var MapObjItem = (function () {
        function MapObjItem(invObj, quant) {
            this.invObj = invObj;
            this.quant = quant;
        }
        ;
        return MapObjItem;
    }());
    Lich.MapObjItem = MapObjItem;
    /**
     * 1. Objekty, které jsou na mapě
     */
    var MapObj = (function () {
        function MapObj(
            // údaje o objektu na mapě (skládá se z vícero částí -- třeba stom)
            mapKey, mapSpriteWidth, mapSpriteHeight, mapSpriteX, mapSpriteY, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěření (kusů dřeva z jednoho stromu)
            quant, 
            // jak často takový objekt v mapě je 
            freq) {
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
    /**
     * 2. Objekty, které vzniknou při vytěžení mapy nebo při vyhození z inventáře
     */
    var InvObj = (function () {
        function InvObj(invKey, invSpriteWidth, invSpriteHeight, invSpriteX, invSpriteY, 
            // je možné tento INV objekt znovu umístit (dřevo -> dřevěná zeď) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            mapObj) {
            if (mapObj === void 0) { mapObj = null; }
            this.invKey = invKey;
            this.invSpriteWidth = invSpriteWidth;
            this.invSpriteHeight = invSpriteHeight;
            this.invSpriteX = invSpriteX;
            this.invSpriteY = invSpriteY;
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
