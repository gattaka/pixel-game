/**
 * Povrchy a objekty.
 * 
 * Povrch jsou kolizní a navazují na sebe (jsou "spojité")
 * Objekty jsou nekolizní a jsou samostatné 
 */
namespace Lich {

    /**
     * Objekty, které vzniknou při vytěžení mapy nebo při vyhození z inventáře
     */
    export class InvObjDefinition {
        constructor(
            public invKey: string,
            // je možné tento INV objekt znovu umístit (váza) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            public mapObj: MapObjDefinition = null,
            // je možné tento INV objekt znovu umístit (kameny -> zeď) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            public mapSurface: MapSurfaceDefinition = null) { };
    }

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
    export class MapObjItem {
        constructor(public invObj: string, public quant: number) { };
    }

    /**
     * 1. Objekty, které jsou na mapě
     */
    export class MapObjDefinition {
        item: MapObjItem;
        constructor(
            // údaje o objektu na mapě
            public mapKey: string,
            public mapSpriteWidth: number,
            public mapSpriteHeight: number,
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            public invObj: string,
            // kolik INV objektů vznikne po vytěření (kusů dřeva z jednoho stromu)
            public quant: number,
            // jak často takový objekt v mapě je 
            public freq: number) {
            this.item = new MapObjItem(invObj, quant);
        }
    }

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
    export class MapSurfaceItem {
        constructor(public invObj: string, public quant: number) { };
    }

    /**
     * 1. Povrchy, které jsou na mapě
     */
    export class MapSurfaceDefinition {
        item: MapSurfaceItem;
        constructor(
            // údaje o povrchu na mapě
            public mapKey: string,
            // id objektu, který má vypadnout do světa po vytěžení
            public invObj: string,
            // kolik INV objektů vznikne po vytěření
            public quant: number) {
            this.item = new MapSurfaceItem(invObj, quant);
        }
    }

}