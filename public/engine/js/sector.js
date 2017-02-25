var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractSector = (function (_super) {
        __extends(AbstractSector, _super);
        function AbstractSector(secId, map_x, map_y, fixedWidth, fixedHeight) {
            var _this = _super.call(this) || this;
            _this.secId = secId;
            _this.map_x = map_x;
            _this.map_y = map_y;
            _this.fixedWidth = fixedWidth;
            _this.fixedHeight = fixedHeight;
            _this.backgroundCont = new PIXI.Container();
            _this.cacheableCont = new PIXI.Container();
            _this.animatedCont = new PIXI.Container();
            return _this;
        }
        return AbstractSector;
    }(PIXI.Container));
    Lich.AbstractSector = AbstractSector;
    var FogSector = (function (_super) {
        __extends(FogSector, _super);
        function FogSector() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FogSector;
    }(AbstractSector));
    Lich.FogSector = FogSector;
    var Sector = (function (_super) {
        __extends(Sector, _super);
        function Sector(secId, map_x, map_y, fixedWidth, fixedHeight) {
            var _this = _super.call(this, secId, map_x, map_y, fixedWidth, fixedHeight) || this;
            _this.secId = secId;
            _this.map_x = map_x;
            _this.map_y = map_y;
            _this.fixedWidth = fixedWidth;
            _this.fixedHeight = fixedHeight;
            _this.backgroundCont = new PIXI.Container();
            _this.cacheableCont = new PIXI.Container();
            _this.animatedCont = new PIXI.Container();
            _this.backgroundCont.fixedWidth = _this.fixedWidth;
            _this.backgroundCont.fixedHeight = _this.fixedHeight;
            _this.cacheableCont.fixedWidth = _this.fixedWidth;
            _this.cacheableCont.fixedHeight = _this.fixedHeight;
            _this.animatedCont.fixedWidth = _this.fixedWidth;
            _this.animatedCont.fixedHeight = _this.fixedHeight;
            _this.addChild(_this.backgroundCont);
            _this.addChild(_this.cacheableCont);
            _this.addChild(_this.animatedCont);
            return _this;
        }
        // override
        Sector.prototype.cache = function (x, y, width, height, scale) {
            // this.backgroundCont.cache(x, y, width, height);
            // this.cacheableCont.cache(x, y, width, height);
        };
        // override
        Sector.prototype.updateCache = function (compositeOperation) {
            // this.backgroundCont.updateCache();
            // this.cacheableCont.updateCache();
        };
        Sector.prototype.addBackgroundChild = function (child) {
            this.backgroundCont.addChild(child);
        };
        Sector.prototype.addCacheableChild = function (child) {
            this.cacheableCont.addChild(child);
        };
        Sector.prototype.addAnimatedChild = function (child) {
            this.animatedCont.addChild(child);
        };
        Sector.prototype.removeBackgroundChild = function (child) {
            return this.backgroundCont.removeChild(child);
        };
        Sector.prototype.removeCacheableChild = function (child) {
            return this.cacheableCont.removeChild(child);
        };
        Sector.prototype.removeAnimatedChild = function (child) {
            return this.animatedCont.removeChild(child);
        };
        return Sector;
    }(AbstractSector));
    Lich.Sector = Sector;
})(Lich || (Lich = {}));
