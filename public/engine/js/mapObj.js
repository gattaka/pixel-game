var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Povrchy a objekty.
 *
 * Povrch jsou kolizní a navazují na sebe (jsou "spojité")
 * Objekty jsou nekolizní a jsou samostatné
 */
var Lich;
(function (Lich) {
    /**
     * Tuple pro INV objekt a množství z map objektu/povrchu/stěny
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
     * Společný předek pro "dolovatelné" věci
     */
    var Diggable = (function () {
        function Diggable(
            // klíč
            mapKey, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěření (kusů dřeva z jednoho stromu)
            quant) {
            this.mapKey = mapKey;
            this.invObj = invObj;
            this.quant = quant;
            this.item = new MapObjItem(invObj, quant);
        }
        return Diggable;
    }());
    Lich.Diggable = Diggable;
    /**
     * Objekty, které vzniknou při vytěžení mapy nebo při vyhození z inventáře
     */
    var InvObjDefinition = (function () {
        function InvObjDefinition(invKey, target) {
            this.invKey = invKey;
            this.frames = 1;
            // je možné tento INV objekt znovu umístit (váza) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            this.mapObj = null;
            // případně jeho alternativa
            this.mapObjAlternative = null;
            // je možné tento INV objekt znovu umístit (kameny -> zeď) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            this.mapSurface = null;
            // případně jako pozadí
            this.mapSurfaceBgr = null;
            if ((target instanceof MapObjDefinition)) {
                this.mapObj = target;
            }
            if ((target instanceof MapSurfaceDefinition)) {
                this.mapSurface = target;
            }
        }
        ;
        InvObjDefinition.prototype.setFrames = function (frames) {
            this.frames = frames;
            return this;
        };
        InvObjDefinition.prototype.setBackground = function (background) {
            this.mapSurfaceBgr = background;
            return this;
        };
        InvObjDefinition.prototype.setMapObjAlternative = function (mapObjAlternative) {
            this.mapObjAlternative = mapObjAlternative;
            return this;
        };
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
     * Objekty, které jsou na mapě
     */
    var MapObjDefinition = (function (_super) {
        __extends(MapObjDefinition, _super);
        function MapObjDefinition(
            // údaje o objektu na mapě
            mapKey, mapSpriteWidth, mapSpriteHeight, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěžení (kusů dřeva z jednoho stromu)
            quant, 
            // jak často takový objekt v mapě je 
            cooldown, 
            // akce na RMB kliknutí
            rmbAction) {
            _super.call(this, mapKey, invObj, quant);
            this.mapKey = mapKey;
            this.mapSpriteWidth = mapSpriteWidth;
            this.mapSpriteHeight = mapSpriteHeight;
            this.invObj = invObj;
            this.quant = quant;
            this.cooldown = cooldown;
            this.rmbAction = rmbAction;
            this.frames = 1;
            this.collision = false;
            this.minDepth = 10;
            this.maxDepth = 100;
        }
        MapObjDefinition.prototype.setFrames = function (frames) {
            this.frames = frames;
            return this;
        };
        MapObjDefinition.prototype.setCollision = function (collision) {
            this.collision = collision;
            return this;
        };
        MapObjDefinition.prototype.setDepth = function (minDepth, maxDepth) {
            this.minDepth = minDepth;
            this.maxDepth = maxDepth;
            return this;
        };
        return MapObjDefinition;
    }(Diggable));
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
     * Povrchy, které jsou na mapě
     */
    var MapSurfaceDefinition = (function (_super) {
        __extends(MapSurfaceDefinition, _super);
        function MapSurfaceDefinition(
            // údaje o povrchu na mapě
            mapKey, 
            // id objektu, který má vypadnout do světa po vytěžení
            invObj, 
            // kolik INV objektů vznikne po vytěření
            quant, 
            // jak často takový povrch v mapě je 
            cooldown) {
            _super.call(this, mapKey, invObj, quant);
            this.mapKey = mapKey;
            this.invObj = invObj;
            this.quant = quant;
            this.cooldown = cooldown;
            this.minSize = 1;
            this.maxSize = 3;
            this.minDepth = 10;
            this.maxDepth = 100;
        }
        MapSurfaceDefinition.prototype.setSize = function (minSize, maxSize) {
            this.minSize = minSize;
            this.maxSize = maxSize;
            return this;
        };
        MapSurfaceDefinition.prototype.setDepth = function (minDepth, maxDepth) {
            this.minDepth = minDepth;
            this.maxDepth = maxDepth;
            return this;
        };
        return MapSurfaceDefinition;
    }(Diggable));
    Lich.MapSurfaceDefinition = MapSurfaceDefinition;
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
    var MapSurfaceBgrDefinition = (function (_super) {
        __extends(MapSurfaceBgrDefinition, _super);
        function MapSurfaceBgrDefinition(
            // údaje o povrchu na mapě
            mapKey, 
            // id objektu, který má vypadnout do světa po vytěžení
            invObj, 
            // kolik INV objektů vznikne po vytěření
            quant) {
            _super.call(this, mapKey, invObj, quant);
            this.mapKey = mapKey;
            this.invObj = invObj;
            this.quant = quant;
        }
        return MapSurfaceBgrDefinition;
    }(Diggable));
    Lich.MapSurfaceBgrDefinition = MapSurfaceBgrDefinition;
})(Lich || (Lich = {}));
