/**
 * Povrchy a objekty.
 *
 * Povrch jsou kolizní a navazují na sebe (jsou "spojité")
 * Objekty jsou nekolizní a jsou samostatné
 */
var Lich;
(function (Lich) {
    /**
     * Objekty, které vzniknou při vytěžení mapy nebo při vyhození z inventáře
     */
    var InvObjDefinition = (function () {
        function InvObjDefinition(invKey, 
            // je možné tento INV objekt znovu umístit (váza) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            mapObj, 
            // je možné tento INV objekt znovu umístit (kameny -> zeď) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            mapSurface) {
            if (mapObj === void 0) { mapObj = null; }
            if (mapSurface === void 0) { mapSurface = null; }
            this.invKey = invKey;
            this.mapObj = mapObj;
            this.mapSurface = mapSurface;
        }
        ;
        return InvObjDefinition;
    }());
    Lich.InvObjDefinition = InvObjDefinition;
    /**
     * Objekty jsou ve 4 formách:
     *
     * 1. Umístěn na mapě (eviduje se počet v případě vykopnutí)
     * 2. Vhozen do světa (čeká na sebrání)
     * 3. V inventáři
     * 4a. Znovu umístěn na mapu
     * 4b. Znovu vhozen do světa
     */
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
            // údaje o objektu na mapě
            mapKey, mapSpriteWidth, mapSpriteHeight, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěření (kusů dřeva z jednoho stromu)
            quant, 
            // jak často takový objekt v mapě je 
            freq) {
            this.mapKey = mapKey;
            this.mapSpriteWidth = mapSpriteWidth;
            this.mapSpriteHeight = mapSpriteHeight;
            this.invObj = invObj;
            this.quant = quant;
            this.freq = freq;
            this.item = new MapObjItem(invObj, quant);
        }
        return MapObjDefinition;
    }());
    Lich.MapObjDefinition = MapObjDefinition;
    /**
     * Povrchy jsou ve 4 formách:
     *
     * 1. Umístěn na mapě (eviduje se počet v případě vykopnutí)
     * 2. Vhozen do světa (čeká na sebrání)
     * 3. V inventáři
     * 4a. Znovu umístěn na mapu
     * 4b. Znovu vhozen do světa
     */
    /**
     * Tuple pro INV objekt a množství z map objektu
     */
    var MapSurfaceItem = (function () {
        function MapSurfaceItem(invObj, quant) {
            this.invObj = invObj;
            this.quant = quant;
        }
        ;
        return MapSurfaceItem;
    }());
    Lich.MapSurfaceItem = MapSurfaceItem;
    /**
     * 1. Povrchy, které jsou na mapě
     */
    var MapSurfaceDefinition = (function () {
        function MapSurfaceDefinition(
            // údaje o povrchu na mapě
            mapKey, 
            // id objektu, který má vypadnout do světa po vytěžení
            invObj, 
            // kolik INV objektů vznikne po vytěření
            quant) {
            this.mapKey = mapKey;
            this.invObj = invObj;
            this.quant = quant;
            this.item = new MapSurfaceItem(invObj, quant);
        }
        return MapSurfaceDefinition;
    }());
    Lich.MapSurfaceDefinition = MapSurfaceDefinition;
})(Lich || (Lich = {}));
