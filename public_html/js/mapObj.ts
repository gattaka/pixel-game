/**
 * Objekty jsou ve 4 formách:
 * 
 * 1. Umístěn na mapě (strom)
 * 2. Umístěn ve světě (pokácený strom -> kusy dřeva), zde se eviduje množství do INV
 * 3. V inventáři 
 * 4. Znovu umístěn na mapu (strom -> dřevo -> umístit dřevo, nikoliv strom)   
 */
namespace Lich {

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
            // údaje o objektu na mapě (skládá se z vícero částí -- třeba stom)
            public mapKey: string,
            public mapSpriteWidth: number,
            public mapSpriteHeight: number,
            public mapSpriteX: number,
            public mapSpriteY: number,
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
     * 2. Objekty, které vzniknou při vytěžení mapy nebo při vyhození z inventáře
     */
    export class InvObjDefinition {
        constructor(
            public invKey: string,
            // je možné tento INV objekt znovu umístit (dřevo -> dřevěná zeď) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            public mapObj: MapObjDefinition = null) { };
    }

}