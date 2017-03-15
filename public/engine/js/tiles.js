var Lich;
(function (Lich) {
    /**
     * Dílek z objektu (strom se skládá z více dílků, které jsou rozmístěny v souřadnicích mapy)
     */
    var MapObjectTile = (function () {
        function MapObjectTile(
            // typ objektu
            mapKey, 
            // relativní souřadnice dílku objektu v sheetmapě
            objTileX, objTileY) {
            this.mapKey = mapKey;
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
        function TilesMap(width, height) {
            this.width = width;
            this.height = height;
            this.mapRecord = new Lich.Array2D(width, height);
            this.mapBgrRecord = new Lich.Array2D(width, height);
            this.mapObjRecord = new Lich.Array2D(width, height);
            this.mapObjectsTiles = new Lich.Array2D(width, height);
            // this.fogTree = new FogTree(width/2, height/2);
            this.fogRecord = new Lich.Array2D(width / 2, height / 2);
        }
        return TilesMap;
    }());
    Lich.TilesMap = TilesMap;
})(Lich || (Lich = {}));
