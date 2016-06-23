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
    var MapObjDefinition = (function () {
        function MapObjDefinition(
            // údaje o objektu na mapě (skládá se z vícero částí -- třeba stom)
            mapKey, mapSpriteWidth, mapSpriteHeight, mapSpriteX, mapSpriteY, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěření (kusů dřeva z jednoho stromu)
            quant, 
            // jak často takový objekt v mapě je 
            freq, 
            // jde o kolizní objekt?
            collide) {
            this.mapKey = mapKey;
            this.mapSpriteWidth = mapSpriteWidth;
            this.mapSpriteHeight = mapSpriteHeight;
            this.mapSpriteX = mapSpriteX;
            this.mapSpriteY = mapSpriteY;
            this.invObj = invObj;
            this.quant = quant;
            this.freq = freq;
            this.collide = collide;
            this.item = new MapObjItem(invObj, quant);
        }
        return MapObjDefinition;
    }());
    Lich.MapObjDefinition = MapObjDefinition;
    /**
     * 2. Objekty, které vzniknou při vytěžení mapy nebo při vyhození z inventáře
     */
    var InvObjDefinition = (function () {
        function InvObjDefinition(invKey, 
            // je možné tento INV objekt znovu umístit (dřevo -> dřevěná zeď) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            mapObj) {
            if (mapObj === void 0) { mapObj = null; }
            this.invKey = invKey;
            this.mapObj = mapObj;
        }
        ;
        return InvObjDefinition;
    }());
    Lich.InvObjDefinition = InvObjDefinition;
})(Lich || (Lich = {}));
