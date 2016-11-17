/**
 * Povrchy a objekty.
 * 
 * Povrch jsou kolizní a navazují na sebe (jsou "spojité")
 * Objekty jsou nekolizní a jsou samostatné 
 */
namespace Lich {

    /**
     * Volný vytěžený objekt ve světě
     */
    export class DugObjDefinition {
        constructor(public invObj: InventoryKey, public quant: number) { };
    }

    /**
     * Společný předek pro "dolovatelné" věci
     */
    export abstract class Diggable {
        public item: DugObjDefinition;
        constructor(
            // klíč
            public mapKey: SurfaceKey | SurfaceBgrKey | MapObjectKey,
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            public invObj: InventoryKey,
            // kolik INV objektů vznikne po vytěžení (kusů dřeva z jednoho stromu)
            public quant: number) {
            this.item = new DugObjDefinition(invObj, quant);
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

        constructor(public invKey: InventoryKey, target: MapObjDefinition | MapSurfaceDefinition) {
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
        public minDepth = 10;
        public maxDepth = 100;

        constructor(
            // údaje o objektu na mapě
            public mapKey: MapObjectKey,
            public mapSpriteWidth: number,
            public mapSpriteHeight: number,
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            public invObj: InventoryKey,
            // kolik INV objektů vznikne po vytěžení (kusů dřeva z jednoho stromu)
            public quant: number,
            // jak často takový objekt v mapě je 
            public cooldown: number,
            // akce na RMB kliknutí
            public rmbAction?: (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) => any) {
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

        public setDepth(minDepth: number, maxDepth: number): MapObjDefinition {
            this.minDepth = minDepth;
            this.maxDepth = maxDepth;
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
        public minSize = 1;
        public maxSize = 3;
        public minDepth = 10;
        public maxDepth = 100;
        constructor(
            // údaje o povrchu na mapě
            public mapKey: SurfaceKey,
            // id objektu, který má vypadnout do světa po vytěžení
            public invObj: InventoryKey,
            // kolik INV objektů vznikne po vytěření
            public quant: number,
            // jak často takový povrch v mapě je 
            public cooldown: number,
            // jde o jednostranně průchozí povrch?
            public oneWay = false) {
            super(mapKey, invObj, quant);
        }

        public setSize(minSize: number, maxSize: number): MapSurfaceDefinition {
            this.minSize = minSize;
            this.maxSize = maxSize;
            return this;
        }

        public setDepth(minDepth: number, maxDepth: number): MapSurfaceDefinition {
            this.minDepth = minDepth;
            this.maxDepth = maxDepth;
            return this;
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
            public mapKey: SurfaceBgrKey,
            // id objektu, který má vypadnout do světa po vytěžení
            public invObj: InventoryKey,
            // kolik INV objektů vznikne po vytěření
            public quant: number) {
            super(mapKey, invObj, quant);
        }
    }

}