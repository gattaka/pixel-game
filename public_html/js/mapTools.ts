/**
 * map.js
 * 
 * Generuje mapu světa a objekty na ní
 * 
 */
namespace Lich {
    export class MapTools {

        static generateEdge(tilesMap: TilesMap, x: number, y: number) {
            var val = tilesMap.mapRecord.getValue(x, y);
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);

            var srfcType = Resources.INSTANCE.surfaceIndex.getSurfaceType(val);

            if (valT === SurfaceIndex.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.T));
            }

            if (valR === SurfaceIndex.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.R));
            }

            if (valB === SurfaceIndex.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.B));
            }

            if (valL === SurfaceIndex.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.INSTANCE.surfaceIndex.getPositionIndex(srfcType, SurfaceIndex.L));
            }

            return tilesMap.mapRecord.getValue(x, y);
        }

        static generateCorner(tilesMap: TilesMap, x: number, y: number) {
            var val = tilesMap.mapRecord.getValue(x, y);
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);

            var srfcType = Resources.INSTANCE.surfaceIndex.getSurfaceType(val);
            var isMiddle = Resources.INSTANCE.surfaceIndex.isMiddlePosition(val);
            var indx = Resources.INSTANCE.surfaceIndex;

            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (indx.isPosition(valB, SurfaceIndex.R) && indx.isPosition(valR, SurfaceIndex.B)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.I_TL));
                }
                // jsem levý horní roh díry
                if (indx.isPosition(valL, SurfaceIndex.B) && indx.isPosition(valB, SurfaceIndex.L)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.I_TR));
                }
                // levý spodní roh díry
                if (indx.isPosition(valT, SurfaceIndex.R) && indx.isPosition(valR, SurfaceIndex.T)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.I_BL));
                }
                // pravý spodní roh díry
                if (indx.isPosition(valT, SurfaceIndex.L) && indx.isPosition(valL, SurfaceIndex.T)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.I_BR));
                }

            }

            // jsem levý horní roh
            if (indx.isPosition(val, SurfaceIndex.L) && (indx.isPosition(val, SurfaceIndex.T) || valT === SurfaceIndex.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.TL));
            }
            // jsem levý dolní roh
            if (indx.isPosition(val, SurfaceIndex.L) && (indx.isPosition(valR, SurfaceIndex.B) || indx.isPosition(valR, SurfaceIndex.BR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.BL));
            }
            // jsem pravý dolní roh
            if (indx.isPosition(val, SurfaceIndex.B) && (indx.isPosition(valT, SurfaceIndex.R) || indx.isPosition(valT, SurfaceIndex.TR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.BR));
            }
            // jsem pravý horní roh
            if (indx.isPosition(val, SurfaceIndex.R) && (indx.isPosition(valL, SurfaceIndex.T) || valT === SurfaceIndex.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfaceIndex.TR));
            }

            return tilesMap.mapRecord.getValue(x, y);
        }

        static modify(tilesMap: TilesMap, x: number, y: number) {
            var rx = Utils.even(x);
            var ry = Utils.even(y);
            tilesMap.mapRecord.setValue(rx, ry, SurfaceIndex.VOID);
            tilesMap.mapRecord.setValue(rx + 1, ry, SurfaceIndex.VOID);
            tilesMap.mapRecord.setValue(rx, ry + 1, SurfaceIndex.VOID);
            tilesMap.mapRecord.setValue(rx + 1, ry + 1, SurfaceIndex.VOID);
        }

        /**
         * Získá výchozí prostřední dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        static getPositionByCoordPattern(x: number, y: number) {
            var m = x % 3 + 1 + ((y % 3) * 3);
            var pos: string;
            switch (m) {
                // je to schválně switchem, aby byla zachována
                // compile-time kontrola
                case 1: pos = SurfaceIndex.M1; break;
                case 2: pos = SurfaceIndex.M2; break;
                case 3: pos = SurfaceIndex.M3; break;
                case 4: pos = SurfaceIndex.M4; break;
                case 5: pos = SurfaceIndex.M5; break;
                case 6: pos = SurfaceIndex.M6; break;
                case 7: pos = SurfaceIndex.M7; break;
                case 8: pos = SurfaceIndex.M8; break;
                case 9: pos = SurfaceIndex.M9; break;
            }
            return pos;
        }

        static writeObjectRecord(tilesMap: TilesMap, cx: number, cy: number, object: MapObjDefinition) {
            var self = this;
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    tilesMap.mapObjectsTiles.setValue(
                        x + cx,
                        y + cy - object.mapSpriteHeight,
                        new MapObjectTile(object.mapKey, x, y)
                    );
                }
            }
        }

    }

};