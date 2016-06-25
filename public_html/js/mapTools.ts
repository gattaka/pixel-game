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
            var val = tilesMap.mapRecord[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);

            var srfcType = Resources.surfaceIndex.getSurfaceType(val);

            if (valT === SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Resources.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.T);
            }

            if (valR === SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Resources.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.R);
            }

            if (valB === SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Resources.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.B);
            }

            if (valL === SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Resources.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.L);
            }

            return tilesMap.mapRecord[i];
        }

        static generateCorner(tilesMap: TilesMap, x: number, y: number) {
            var i = tilesMap.indexAt(x, y);
            var val = tilesMap.mapRecord[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);

            var srfcType = Resources.surfaceIndex.getSurfaceType(val);
            var isMiddle = Resources.surfaceIndex.isMiddlePosition(val);
            var indx = Resources.surfaceIndex;

            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (indx.isPosition(valB, SurfaceIndex.R) && indx.isPosition(valR, SurfaceIndex.B)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.I_TL);
                }
                // jsem levý horní roh díry
                if (indx.isPosition(valL, SurfaceIndex.B) && indx.isPosition(valB, SurfaceIndex.L)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.I_TR);
                }
                // levý spodní roh díry
                if (indx.isPosition(valT, SurfaceIndex.R) && indx.isPosition(valR, SurfaceIndex.T)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.I_BL);
                }
                // pravý spodní roh díry
                if (indx.isPosition(valT, SurfaceIndex.L) && indx.isPosition(valL, SurfaceIndex.T)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.I_BR);
                }

            }

            // jsem levý horní roh
            if (indx.isPosition(val, SurfaceIndex.L) && (indx.isPosition(val, SurfaceIndex.T) || valT === SurfaceIndex.VOID)) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.TL);
            }
            // jsem levý dolní roh
            if (indx.isPosition(val, SurfaceIndex.L) && (indx.isPosition(valR, SurfaceIndex.B) || indx.isPosition(valR, SurfaceIndex.BR))) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.BL);
            }
            // jsem pravý dolní roh
            if (indx.isPosition(val, SurfaceIndex.B) && (indx.isPosition(valT, SurfaceIndex.R) || indx.isPosition(valT, SurfaceIndex.TR))) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.BR);
            }
            // jsem pravý horní roh
            if (indx.isPosition(val, SurfaceIndex.R) && (indx.isPosition(valL, SurfaceIndex.T) || valT === SurfaceIndex.VOID)) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, SurfaceIndex.TR);
            }

            return tilesMap.mapRecord[i];
        }

        static modify(tilesMap: TilesMap, x: number, y: number) {
            var rx = Utils.even(x);
            var ry = Utils.even(y);
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry)] = SurfaceIndex.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry)] = SurfaceIndex.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry + 1)] = SurfaceIndex.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry + 1)] = SurfaceIndex.VOID;
        }

        static writeObjectRecord(tilesMap: TilesMap, cx: number, cy: number, object: MapObjDefinition) {
            var self = this;
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    var col = tilesMap.mapObjectsTiles[x + cx];
                    if (typeof col === "undefined") {
                        col = [];
                        tilesMap.mapObjectsTiles[x + cx] = col;
                    }
                    var partsSheetIndex = MapTools.createPartsSheetIndex(object, x, y);
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    col[y + cy - object.mapSpriteHeight] = new MapObjectTile(object.mapKey, partsSheetIndex, x, y);
                }
            }
        }

        static createPartsSheetIndex(object: MapObjDefinition, x: number, y: number): number {
            return x + y * Resources.PARTS_SHEET_WIDTH;
        }

    }

};