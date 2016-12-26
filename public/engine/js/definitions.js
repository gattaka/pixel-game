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
     * Volný vytěžený objekt ve světě
     */
    var DugObjDefinition = (function () {
        function DugObjDefinition(invObj, quant) {
            this.invObj = invObj;
            this.quant = quant;
        }
        ;
        return DugObjDefinition;
    }());
    Lich.DugObjDefinition = DugObjDefinition;
    /**
     * Společný předek pro "dolovatelné" věci
     */
    var Diggable = (function () {
        function Diggable(
            // klíč
            mapObjKey, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěžení (kusů dřeva z jednoho stromu)
            quant) {
            this.mapObjKey = mapObjKey;
            this.invObj = invObj;
            this.quant = quant;
            this.item = new DugObjDefinition(invObj, quant);
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
        InvObjDefinition.prototype.setConsumeAction = function (consumeAction) {
            this.consumeAction = consumeAction;
            return this;
        };
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
     * Typ kolize objektů/povrchů
     */
    (function (CollisionType) {
        // Nelze procházet žádným směrem
        CollisionType[CollisionType["SOLID"] = 0] = "SOLID";
        // Má kolizní plochu jenom na nějaké části
        // dle toho, o které zkosení se jedná
        CollisionType[CollisionType["SOLID_TL"] = 1] = "SOLID_TL";
        CollisionType[CollisionType["SOLID_TR"] = 2] = "SOLID_TR";
        CollisionType[CollisionType["SOLID_BL"] = 3] = "SOLID_BL";
        CollisionType[CollisionType["SOLID_BR"] = 4] = "SOLID_BR";
        // Lze procházet cestou nahoru a lze skrz 
        // něj propadnout vynucením směru dolů 
        CollisionType[CollisionType["PLATFORM"] = 5] = "PLATFORM";
        // Nekoliduje vůbec, umožňuje volný pohyb
        // u které zabraňuje pádu
        CollisionType[CollisionType["LADDER"] = 6] = "LADDER";
    })(Lich.CollisionType || (Lich.CollisionType = {}));
    var CollisionType = Lich.CollisionType;
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
            mapObjKey, mapSpriteWidth, mapSpriteHeight, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěžení (kusů dřeva z jednoho stromu)
            quant, 
            // jak často takový objekt v mapě je 
            seedCooldown, 
            // akce na RMB kliknutí
            rmbAction) {
            _super.call(this, mapObjKey, invObj, quant);
            this.mapObjKey = mapObjKey;
            this.mapSpriteWidth = mapSpriteWidth;
            this.mapSpriteHeight = mapSpriteHeight;
            this.invObj = invObj;
            this.quant = quant;
            this.seedCooldown = seedCooldown;
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
            mapObjKey, 
            // id objektu, který má vypadnout do světa po vytěžení
            invObj, 
            // kolik INV objektů vznikne po vytěření
            quant, 
            // jak často takový povrch v mapě je 
            seedCooldown, 
            // barva na minimapě
            minimapColor, 
            // jaký typ kolizí povrch má?
            collisionType) {
            if (collisionType === void 0) { collisionType = CollisionType.SOLID; }
            _super.call(this, srfcKey, invObj, quant);
            this.mapObjKey = mapObjKey;
            this.invObj = invObj;
            this.quant = quant;
            this.seedCooldown = seedCooldown;
            this.minimapColor = minimapColor;
            this.collisionType = collisionType;
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
    var MapSurfaceTransitionDefinition = (function () {
        function MapSurfaceTransitionDefinition(
            // jaký typ povrchu se prolíná dovnitř
            invadingSrfc, 
            // jaký typ povrchu je prolínán a který se při výkopu měl vracet
            coveredSrfc, 
            // klíč přechodového povrchu
            transitionKey) {
            this.invadingSrfc = invadingSrfc;
            this.coveredSrfc = coveredSrfc;
            this.transitionKey = transitionKey;
        }
        return MapSurfaceTransitionDefinition;
    }());
    Lich.MapSurfaceTransitionDefinition = MapSurfaceTransitionDefinition;
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
            mapObjKey, 
            // id objektu, který má vypadnout do světa po vytěžení
            invObj, 
            // kolik INV objektů vznikne po vytěření
            quant, 
            // barva na minimapě
            minimapColor) {
            _super.call(this, srfcKey, invObj, quant);
            this.mapObjKey = mapObjKey;
            this.invObj = invObj;
            this.quant = quant;
            this.minimapColor = minimapColor;
        }
        return MapSurfaceBgrDefinition;
    }(Diggable));
    Lich.MapSurfaceBgrDefinition = MapSurfaceBgrDefinition;
    var Color = (function () {
        function Color(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        return Color;
    }());
    Lich.Color = Color;
})(Lich || (Lich = {}));
