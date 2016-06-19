namespace Lich {

    /**
     * Záznam v mapě o celém objektu
     */
    export class MapObjectRecord {
        constructor(
            // souřadnice, na kterých začíná objektu jako celek
            public x: number,
            public y: number,
            // typ objektu 
            public obj: string
        ) { }
    }

    /**
     * Dílek z objektu (strom se skládá z více dílků, které jsou rozmístěny v souřadnicích mapy)
     */
    export class MapObjectTile {
        constructor(
            // typ objektu
            public mapKey: string,
            // Sheet index dílku objektu
            public sheetIndex: number,
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

        constructor(
            // linearizovaný předpis rozmístění povrchu světa
            public mapRecord: Array<number>,
            // linearizovaný předpis rozmístění objektů na mapě
            public mapObjectsRecords: Array<MapObjectRecord>,
            // 2D pole dílků objektů na mapě
            public mapObjectsTiles: Array<Array<MapObjectTile>>,
            // Šířka a výška mapy
            public width,
            public height
        ) { }

        indexAt(x, y) {
            var self = this;
            if (x >= self.width || x < 0 || y >= self.height || y < 0) {
                return -1;
            } else {
                return y * self.width + x;
            }
        }

        coordAt(index): any {
            var self = this;
            if (index < 0 || index > self.mapRecord.length - 1) {
                return 0;
            } else {
                return {
                    x: index % self.width,
                    y: Math.floor(index / self.width)
                };
            }
        }

        valueAt(x, y): number {
            var self = this;
            var index = self.indexAt(x, y);
            if (index >= 0) {
                return self.mapRecord[index];
            }
            return Resources.VOID;
        }
    }
};