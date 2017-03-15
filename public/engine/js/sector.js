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
            return _this;
        }
        AbstractSector.prototype.cacheInner = function (cont, oldRendered) {
            if (oldRendered) {
                this.removeChild(oldRendered);
                // Dont forget to destroy dynamic textures you did create
                oldRendered.texture.destroy();
            }
            // this represents your small canvas, it is a texture you can render a scene to then use as if it was a normal texture
            var renderedTexture = PIXI.RenderTexture.create(this.fixedWidth, this.fixedHeight);
            // instead of rendering your containerOfThings to the reeal scene, render it to the texture
            Lich.Game.getInstance().renderer.render(cont, renderedTexture);
            // now you also have a sprite that uses that texture, rendered in the normal scene
            var newRendered = new PIXI.Sprite(renderedTexture);
            this.addChild(newRendered);
            return newRendered;
        };
        return AbstractSector;
    }(PIXI.Container));
    Lich.AbstractSector = AbstractSector;
    var SectorCont = (function (_super) {
        __extends(SectorCont, _super);
        function SectorCont(sector) {
            var _this = _super.call(this) || this;
            _this.sector = sector;
            return _this;
        }
        return SectorCont;
    }(PIXI.Container));
    Lich.SectorCont = SectorCont;
    var Sector = (function (_super) {
        __extends(Sector, _super);
        function Sector(secId, map_x, map_y, fixedWidth, fixedHeight) {
            var _this = _super.call(this, secId, map_x, map_y, fixedWidth, fixedHeight) || this;
            _this.secId = secId;
            _this.map_x = map_x;
            _this.map_y = map_y;
            _this.fixedWidth = fixedWidth;
            _this.fixedHeight = fixedHeight;
            _this.cacheableCont = new SectorCont(_this);
            _this.cacheableCont.fixedWidth = _this.fixedWidth;
            _this.cacheableCont.fixedHeight = _this.fixedHeight;
            _this.animatedCont = new SectorCont(_this);
            _this.animatedCont.fixedWidth = _this.fixedWidth;
            _this.animatedCont.fixedHeight = _this.fixedHeight;
            _this.addChild(_this.animatedCont);
            return _this;
        }
        Sector.prototype.cache = function () {
            this.cacheableRendered = this.cacheInner(this.cacheableCont, this.cacheableRendered);
            this.setChildIndex(this.cacheableRendered, 0);
            this.setChildIndex(this.animatedCont, 1);
        };
        Sector.prototype.addCacheableChild = function (child) {
            this.cacheableCont.addChild(child);
        };
        Sector.prototype.addAnimatedChild = function (child) {
            this.animatedCont.addChild(child);
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
