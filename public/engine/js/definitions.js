var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        function InvObjDefinition(
            // klíč
            invKey, 
            // sprite název
            spriteName, 
            // cíl při položení
            target) {
            this.invKey = invKey;
            this.spriteName = spriteName;
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
    var CollisionType;
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
    })(CollisionType = Lich.CollisionType || (Lich.CollisionType = {}));
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
            mapObjKey, 
            // sprite název
            spriteName, mapSpriteWidth, mapSpriteHeight, 
            // id objektu, který má vypadnout do světa po vytěžení (třeba dřevo) 
            invObj, 
            // kolik INV objektů vznikne po vytěžení (kusů dřeva z jednoho stromu)
            quant, 
            // jak často takový objekt v mapě je 
            seedCooldown, 
            // akce na RMB kliknutí
            rmbAction) {
            var _this = _super.call(this, mapObjKey, invObj, quant) || this;
            _this.mapObjKey = mapObjKey;
            _this.spriteName = spriteName;
            _this.mapSpriteWidth = mapSpriteWidth;
            _this.mapSpriteHeight = mapSpriteHeight;
            _this.invObj = invObj;
            _this.quant = quant;
            _this.seedCooldown = seedCooldown;
            _this.rmbAction = rmbAction;
            _this.frames = 1;
            _this.collision = false;
            _this.minDepth = 10;
            _this.maxDepth = 100;
            return _this;
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
            // sprite název
            spriteName, 
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
            var _this = _super.call(this, mapObjKey, invObj, quant) || this;
            _this.mapObjKey = mapObjKey;
            _this.spriteName = spriteName;
            _this.invObj = invObj;
            _this.quant = quant;
            _this.seedCooldown = seedCooldown;
            _this.minimapColor = minimapColor;
            _this.collisionType = collisionType;
            _this.minSize = 1;
            _this.maxSize = 3;
            _this.minDepth = 10;
            _this.maxDepth = 100;
            return _this;
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
            // jaký typ povrchu je prolínán a který se při výkopu měl vracet
            diggableSrfc, 
            // klíč přechodového povrchu
            transitionKey, 
            // sprite název
            spriteName) {
            this.diggableSrfc = diggableSrfc;
            this.transitionKey = transitionKey;
            this.spriteName = spriteName;
        }
        return MapSurfaceTransitionDefinition;
    }());
    Lich.MapSurfaceTransitionDefinition = MapSurfaceTransitionDefinition;
    var MapSurfaceBgrTransitionDefinition = (function () {
        function MapSurfaceBgrTransitionDefinition(
            // jaký typ povrchu je prolínán a který se při výkopu měl vracet
            diggableSrfc, 
            // klíč přechodového povrchu
            transitionKey, 
            // sprite název
            spriteName) {
            this.diggableSrfc = diggableSrfc;
            this.transitionKey = transitionKey;
            this.spriteName = spriteName;
        }
        return MapSurfaceBgrTransitionDefinition;
    }());
    Lich.MapSurfaceBgrTransitionDefinition = MapSurfaceBgrTransitionDefinition;
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
            // sprite název
            spriteName, 
            // id objektu, který má vypadnout do světa po vytěžení
            invObj, 
            // kolik INV objektů vznikne po vytěření
            quant, 
            // barva na minimapě
            minimapColor) {
            var _this = _super.call(this, mapObjKey, invObj, quant) || this;
            _this.mapObjKey = mapObjKey;
            _this.spriteName = spriteName;
            _this.invObj = invObj;
            _this.quant = quant;
            _this.minimapColor = minimapColor;
            return _this;
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
