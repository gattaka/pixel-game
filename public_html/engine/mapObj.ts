/**
 * Povrchy a objekty.
 * 
 * Povrch jsou kolizní a navazují na sebe (jsou "spojité")
 * Objekty jsou nekolizní a jsou samostatné 
 */
namespace Lich {

    /**
     * Tuple pro INV objekt a množství z map objektu/povrchu/stěny
     */
    export class MapObjItem {
        constructor(public invObj: string, public quant: number) { };
    }

    /**
     * Společný předek pro "dolovatelné" věci
     */
    export abstract class Diggable {
        public item: MapObjItem;
        constructor(
            // klíč
            public mapKey: string,
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            public invObj: string,
            // kolik INV objektů vznikne po vytěření (kusů dřeva z jednoho stromu)
            public quant: number) {
            this.item = new MapObjItem(invObj, quant);
        }
    }

    /**
     * Objekty, které vzniknou při vytěžení mapy nebo při vyhození z inventáře
     */
    export class InvObjDefinition {

        public frames: number = 1;

        // je možné tento INV objekt znovu umístit (váza) 
        // pokud ano, jaký objekt mapy se má vytvořit  
        public mapObj: MapObjDefinition = null;
        // případně jeho alternativa
        public mapObjAlternative: MapObjDefinition = null;
        // je možné tento INV objekt znovu umístit (kameny -> zeď) 
        // pokud ano, jaký objekt mapy se má vytvořit  
        public mapSurface: MapSurfaceDefinition = null;
        // případně jako pozadí
        public mapSurfaceBgr: MapSurfaceBgrDefinition = null;

        constructor(public invKey: string, target: Diggable) {
            if ((target instanceof MapObjDefinition)) {
                this.mapObj = <MapObjDefinition>target;
            }
            if ((target instanceof MapSurfaceDefinition)) {
                this.mapSurface = <MapSurfaceDefinition>target;
            }
        };

        public setFrames(frames: number): InvObjDefinition {
            this.frames = frames;
            return this;
        }

        public setBackground(background: MapSurfaceBgrDefinition): InvObjDefinition {
            this.mapSurfaceBgr = background;
            return this;
        }

        public setMapObjAlternative(mapObjAlternative: MapObjDefinition): InvObjDefinition {
            this.mapObjAlternative = mapObjAlternative;
            return this;
        }
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
     * Objekty, které jsou na mapě
     */
    export class MapObjDefinition extends Diggable {

        public frames: number = 1;
        public collision = false;

        constructor(
            // údaje o objektu na mapě
            public mapKey: string,
            public mapSpriteWidth: number,
            public mapSpriteHeight: number,
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            public invObj: string,
            // kolik INV objektů vznikne po vytěžení (kusů dřeva z jednoho stromu)
            public quant: number,
            // jak často takový objekt v mapě je 
            public freq: number,
            // akce na RMB kliknutí
            public rmbAction?: (x: number, y: number, obj: MapObjectTile, objType: MapObjDefinition) => any) {
            super(mapKey, invObj, quant);
        }

        public setFrames(frames: number): MapObjDefinition {
            this.frames = frames;
            return this;
        }
        
        public setCollision(collision: boolean): MapObjDefinition {
            this.collision = collision;
            return this;
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
     * Povrchy, které jsou na mapě
     */
    export class MapSurfaceDefinition extends Diggable {
        constructor(
            // údaje o povrchu na mapě
            public mapKey: string,
            // id objektu, který má vypadnout do světa po vytěžení
            public invObj: string,
            // kolik INV objektů vznikne po vytěření
            public quant: number,
            // jak často takový povrch v mapě je 
            public freq: number) {
            super(mapKey, invObj, quant);
        }
    }

    /**
     * Stěny povrchů (pozadí) jsou ve 4 formách:
     * 
     * 1. Umístěn na mapě (eviduje se počet v případě vykopnutí)
     * 2. Vhozen do světa (čeká na sebrání)
     * 3. V inventáři 
     * 4a. Znovu umístěn na mapu
     * 4b. Znovu vhozen do světa
     */

    /**
     * Stěny povrchů, které jsou na mapě
     */
    export class MapSurfaceBgrDefinition extends Diggable {
        constructor(
            // údaje o povrchu na mapě
            public mapKey: string,
            // id objektu, který má vypadnout do světa po vytěžení
            public invObj: string,
            // kolik INV objektů vznikne po vytěření
            public quant: number) {
            super(mapKey, invObj, quant);
        }
    }

}