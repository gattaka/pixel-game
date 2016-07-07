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
            // pozadí povrchu je reprezentováno jako objekt
            this.background = null;
            // je možné tento INV objekt znovu umístit (váza) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            this.mapObj = null;
            // je možné tento INV objekt znovu umístit (kameny -> zeď) 
            // pokud ano, jaký objekt mapy se má vytvořit  
            this.mapSurface = null;
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
            this.background = background;
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
    var MapObjDefinition = (function (_super) {
        __extends(MapObjDefinition, _super);
        function MapObjDefinition(
            // údaje o objektu na mapě
            mapKey, mapSpriteWidth, mapSpriteHeight, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěření (kusů dřeva z jednoho stromu)
            quant, 
            // jak často takový objekt v mapě je 
            freq) {
            _super.call(this, mapKey, invObj, quant);
            this.mapKey = mapKey;
            this.mapSpriteWidth = mapSpriteWidth;
            this.mapSpriteHeight = mapSpriteHeight;
            this.invObj = invObj;
            this.quant = quant;
            this.freq = freq;
            this.frames = 1;
        }
        MapObjDefinition.prototype.setFrames = function (frames) {
            this.frames = frames;
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
            freq) {
            _super.call(this, mapKey, invObj, quant);
            this.mapKey = mapKey;
            this.invObj = invObj;
            this.quant = quant;
            this.freq = freq;
        }
        return MapSurfaceDefinition;
    }(Diggable));
    Lich.MapSurfaceDefinition = MapSurfaceDefinition;
})(Lich || (Lich = {}));
