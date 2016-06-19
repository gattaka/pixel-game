/**
 * map.js
 * 
 * Generuje mapu světa a objekty na ní
 * 
 */
namespace Lich {
    export class MapTools {

        static generateEdge(tilesMap: TilesMap, x: number, y: number) {
            var i = tilesMap.indexAt(x, y);
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);

            if (valT === Resources.VOID) {
                tilesMap.mapRecord[i] = Resources.DIRT.T;
            }

            if (valR === Resources.VOID) {
                tilesMap.mapRecord[i] = Resources.DIRT.R;
            }

            if (valB === Resources.VOID) {
                tilesMap.mapRecord[i] = Resources.DIRT.B;
            }

            if (valL === Resources.VOID) {
                tilesMap.mapRecord[i] = Resources.DIRT.L;
            }

            return tilesMap.mapRecord[i];
        };

        static generateCorner(tilesMap: TilesMap, x: number, y: number) {
            var i = tilesMap.indexAt(x, y);
            var val = tilesMap.mapRecord[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);

            var isMiddle = false;
            for (var m = 1; m <= 9; m++) {
                if (val === Resources.DIRT["M" + m]) {
                    isMiddle = true;
                    break;
                }
            }

            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (valB === Resources.DIRT.R && valR === Resources.DIRT.B) {
                    tilesMap.mapRecord[i] = Resources.DIRT.I_TL;
                }
                // jsem levý horní roh díry
                if (valL === Resources.DIRT.B && valB === Resources.DIRT.L) {
                    tilesMap.mapRecord[i] = Resources.DIRT.I_TR;
                }
                // levý spodní roh díry
                if (valT === Resources.DIRT.R && valR === Resources.DIRT.T) {
                    tilesMap.mapRecord[i] = Resources.DIRT.I_BL;
                }
                // pravý spodní roh díry
                if (valT === Resources.DIRT.L && valL === Resources.DIRT.T) {
                    tilesMap.mapRecord[i] = Resources.DIRT.I_BR;
                }

            }

            // jsem levý horní roh
            if (val === Resources.DIRT.L && (valR === Resources.DIRT.T || valT === Resources.VOID)) {
                tilesMap.mapRecord[i] = Resources.DIRT.TL;
            }
            // jsem levý dolní roh
            if (val === Resources.DIRT.L && (valR === Resources.DIRT.B || valR === Resources.DIRT.BR)) {
                tilesMap.mapRecord[i] = Resources.DIRT.BL;
            }
            // jsem pravý dolní roh
            if (val === Resources.DIRT.B && (valT === Resources.DIRT.R || valT === Resources.DIRT.TR)) {
                tilesMap.mapRecord[i] = Resources.DIRT.BR;
            }
            // jsem pravý horní roh
            if (val === Resources.DIRT.R && (valL === Resources.DIRT.T || valT === Resources.VOID)) {
                tilesMap.mapRecord[i] = Resources.DIRT.TR;
            }

            return tilesMap.mapRecord[i];
        };

        static modify(tilesMap: TilesMap, x: number, y: number) {
            var rx = Utils.even(x);
            var ry = Utils.even(y);
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry)] = Resources.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry)] = Resources.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry + 1)] = Resources.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry + 1)] = Resources.VOID;
        };

        static writeObjectRecord(tilesMap: TilesMap, cx: number, cy: number, object: MapObjDefinition) {
            var self = this;
            // je tam volno, umísti ho
            tilesMap.mapObjectsRecords.push(new MapObjectRecord(cx, cy, object.mapKey));
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    var col = tilesMap.mapObjectsTiles[x + cx];
                    if (typeof col === "undefined") {
                        col = [];
                        tilesMap.mapObjectsTiles[x + cx] = col;
                    }
                    var partsSheetIndex = object.mapSpriteX + x + (object.mapSpriteY + y) * Resources.PARTS_SHEET_WIDTH;
                    col[y + cy - object.mapSpriteHeight] = new MapObjectTile(object.mapKey, partsSheetIndex, x, y);
                }
            }
        };

    }

};