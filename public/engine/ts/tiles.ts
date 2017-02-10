namespace Lich {

    /**
     * Dílek z objektu (strom se skládá z více dílků, které jsou rozmístěny v souřadnicích mapy)
     */
    export class MapObjectTile {
        constructor(
            // typ objektu
            public mapKey: MapObjectKey,
            // relativní souřadnice dílku objektu v sheetmapě
            public objTileX: number,
            public objTileY: number
        ) { }
    }

    /**
     * Objekt mapy, který uchovává údaje o umístění všech dílů (tiles) -- tedy 
     * dílů povrchu a dílů objektů (stromy, kameny apod.)
     */
    export class TilesMap {

        // předpis rozmístění povrchu světa
        public mapRecord: Array2D<number>;
        // předpis rozmístění stěn (pozadí) povrchu světa
        public mapBgrRecord: Array2D<number>;
        // 2D pole dílků objektů na mapě
        public mapObjectsTiles: Array2D<MapObjectTile>;
        // fog mapa
        // public fogTree: FogTree;
        public fogTree: Array2D<FogTile>;
        // spawnPoint pro hráče
        public spawnPoint: Coord2D;

        // předpis rozmístění objektů (celých, nikoliv dílků)
        // hra se bez tohohle přehledu obejde, ale značně to 
        // urychluje save/load
        public mapObjRecord: Array2D<number>;

        constructor(public width, public height) {
            this.mapRecord = new Array2D<number>(width, height);
            this.mapBgrRecord = new Array2D<number>(width, height);
            this.mapObjRecord = new Array2D<number>(width, height);
            this.mapObjectsTiles = new Array2D<MapObjectTile>(width, height);
            // this.fogTree = new FogTree(width, height);
            this.fogTree = new Array2D<FogTile>(width / 2, height / 2);
        }

    }

}