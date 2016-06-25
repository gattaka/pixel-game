var Lich;
(function (Lich) {
    /**
     * Záznam v mapě o celém objektu
     */
    var MapObjectRecord = (function () {
        function MapObjectRecord(
            // souřadnice, na kterých začíná objektu jako celek
            x, y, 
            // typ objektu 
            obj) {
            this.x = x;
            this.y = y;
            this.obj = obj;
        }
        return MapObjectRecord;
    }());
    Lich.MapObjectRecord = MapObjectRecord;
    /**
     * Dílek z objektu (strom se skládá z více dílků, které jsou rozmístěny v souřadnicích mapy)
     */
    var MapObjectTile = (function () {
        function MapObjectTile(
            // typ objektu
            mapKey, 
            // Sheet index dílku objektu
            sheetIndex, 
            // relativní souřadnice dílku objektu v sheetmapě
            objTileX, objTileY) {
            this.mapKey = mapKey;
            this.sheetIndex = sheetIndex;
            this.objTileX = objTileX;
            this.objTileY = objTileY;
        }
        return MapObjectTile;
    }());
    Lich.MapObjectTile = MapObjectTile;
    /**
     * Objekt mapy, který uchovává údaje o umístění všech dílů (tiles) -- tedy
     * dílů povrchu a dílů objektů (stromy, kameny apod.)
     */
    var TilesMap = (function () {
        function TilesMap(
            // linearizovaný předpis rozmístění povrchu světa
            mapRecord, 
            // 2D pole dílků objektů na mapě
            mapObjectsTiles, 
            // Šířka a výška mapy
            width, height) {
            this.mapRecord = mapRecord;
            this.mapObjectsTiles = mapObjectsTiles;
            this.width = width;
            this.height = height;
        }
        TilesMap.prototype.indexAt = function (x, y) {
            var self = this;
            if (x >= self.width || x < 0 || y >= self.height || y < 0) {
                return -1;
            }
            else {
                return y * self.width + x;
            }
        };
        TilesMap.prototype.coordAt = function (index) {
            var self = this;
            if (index < 0 || index > self.mapRecord.length - 1) {
                return 0;
            }
            else {
                return {
                    x: index % self.width,
                    y: Math.floor(index / self.width)
                };
            }
        };
        TilesMap.prototype.valueAt = function (x, y) {
            var self = this;
            var index = self.indexAt(x, y);
            if (index >= 0) {
                return self.mapRecord[index];
            }
            if (index == -1) {
                return -1;
            }
            return Lich.SurfaceIndex.VOID;
        };
        return TilesMap;
    }());
    Lich.TilesMap = TilesMap;
})(Lich || (Lich = {}));
;
