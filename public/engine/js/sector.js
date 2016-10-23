var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Sector = (function (_super) {
        __extends(Sector, _super);
        function Sector(secId, map_x, map_y, width, height) {
            _super.call(this);
            this.secId = secId;
            this.map_x = map_x;
            this.map_y = map_y;
            this.width = width;
            this.height = height;
            this.backgroundCont = new createjs.Container();
            this.cacheableCont = new createjs.Container();
            this.animatedCont = new createjs.Container();
            this.backgroundCont.width = this.width;
            this.backgroundCont.height = this.height;
            this.cacheableCont.width = this.width;
            this.cacheableCont.height = this.height;
            this.animatedCont.width = this.width;
            this.animatedCont.height = this.height;
            this.addChild(this.backgroundCont);
            this.addChild(this.cacheableCont);
            this.addChild(this.animatedCont);
        }
        // override
        Sector.prototype.cache = function (x, y, width, height, scale) {
            this.backgroundCont.cache(x, y, width, height);
            this.cacheableCont.cache(x, y, width, height);
        };
        // override
        Sector.prototype.updateCache = function (compositeOperation) {
            this.backgroundCont.updateCache();
            this.cacheableCont.updateCache();
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
    }(createjs.Container));
    Lich.Sector = Sector;
})(Lich || (Lich = {}));
