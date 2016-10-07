/**
 * map.js
 * 
 * Nástroj pro úpravy dílkové mapy
 * 
 */
namespace Lich {
    export class TilesMapTools {

        private constructor() { }

        static generateEdge(tilesMap: TilesMap, x: number, y: number) {
            var val = tilesMap.mapRecord.getValue(x, y);
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);

            var srfcType = Resources.getInstance().surfaceIndex.getType(val);

            if (valT === SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, SurfacePositionKey.T));
            }

            if (valR === SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, SurfacePositionKey.R));
            }

            if (valB === SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, SurfacePositionKey.B));
            }

            if (valL === SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, SurfacePositionKey.L));
            }

            return tilesMap.mapRecord.getValue(x, y);
        }

        static generateCorner(tilesMap: TilesMap, x: number, y: number) {
            var val = tilesMap.mapRecord.getValue(x, y);
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);

            var srfcType = Resources.getInstance().surfaceIndex.getType(val);
            var isMiddle = Resources.getInstance().surfaceIndex.isMiddlePosition(val);
            var indx = Resources.getInstance().surfaceIndex;

            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (indx.isPosition(valB, SurfacePositionKey.R) && indx.isPosition(valR, SurfacePositionKey.B)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
                if (indx.isPosition(valL, SurfacePositionKey.B) && indx.isPosition(valB, SurfacePositionKey.L)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (indx.isPosition(valT, SurfacePositionKey.R) && indx.isPosition(valR, SurfacePositionKey.T)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (indx.isPosition(valT, SurfacePositionKey.L) && indx.isPosition(valL, SurfacePositionKey.T)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_BR));
                }

            }

            // jsem levý horní roh
            if (indx.isPosition(val, SurfacePositionKey.L) && (indx.isPosition(val, SurfacePositionKey.T) || valT === SurfacePositionKey.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (indx.isPosition(val, SurfacePositionKey.L) && (indx.isPosition(valR, SurfacePositionKey.B) || indx.isPosition(valR, SurfacePositionKey.BR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (indx.isPosition(val, SurfacePositionKey.B) && (indx.isPosition(valT, SurfacePositionKey.R) || indx.isPosition(valT, SurfacePositionKey.TR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (indx.isPosition(val, SurfacePositionKey.R) && (indx.isPosition(valL, SurfacePositionKey.T) || valT === SurfacePositionKey.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.TR));
            }

            return tilesMap.mapRecord.getValue(x, y);
        }

        static modify(tilesMap: TilesMap, x: number, y: number) {
            var rx = Utils.even(x);
            var ry = Utils.even(y);
            tilesMap.mapRecord.setValue(rx, ry, SurfacePositionKey.VOID);
            tilesMap.mapRecord.setValue(rx + 1, ry, SurfacePositionKey.VOID);
            tilesMap.mapRecord.setValue(rx, ry + 1, SurfacePositionKey.VOID);
            tilesMap.mapRecord.setValue(rx + 1, ry + 1, SurfacePositionKey.VOID);
        }

        /**
         * Získá výchozí prostřední dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        static getSurfacePositionByCoordPattern(x: number, y: number): SurfacePositionKey {
            let col = x % 3 + 1; // +1 za VOID
            let row = y % 3;
            let key = col + row * 8; // řada má 8 položek
            return SurfacePositionKey[SurfacePositionKey[key]];
        }

        /**
         * Získá výchozí prostřední dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        static getSurfaceBgrPositionByCoordPattern(x: number, y: number): SurfaceBgrPositionKey {
            let col = x % 3 + 1; // +1 za VOID
            let row = y % 3;
            let key = col + row * 3; // řada má 3 položky
            return SurfaceBgrPositionKey[SurfaceBgrPositionKey[key]];
        }

        static writeObjectRecord(tilesMap: TilesMap, cx: number, cy: number, object: MapObjDefinition) {
            var self = this;
            // zapiš objekt 
            tilesMap.mapObjRecord.setValue(cx, cy, object.mapKey);
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