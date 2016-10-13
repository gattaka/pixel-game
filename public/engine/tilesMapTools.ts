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
            let val = tilesMap.mapRecord.getValue(x, y);
            let valT = tilesMap.mapRecord.getValue(x, y - 1);
            let valR = tilesMap.mapRecord.getValue(x + 1, y);
            let valB = tilesMap.mapRecord.getValue(x, y + 1);
            let valL = tilesMap.mapRecord.getValue(x - 1, y);

            let srfi = Resources.getInstance().surfaceIndex;

            let srfcType = srfi.getType(val);

            if (valT === SurfacePositionKey.VOID || srfi.isSeamless(valT, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getTopPositionIndexByCoordPattern(x, y, srfcType));
            }

            if (valR === SurfacePositionKey.VOID || srfi.isSeamless(valR, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getRightPositionIndexByCoordPattern(x, y, srfcType));
            }

            if (valB === SurfacePositionKey.VOID || srfi.isSeamless(valB, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getBottomPositionIndexByCoordPattern(x, y, srfcType));
            }

            if (valL === SurfacePositionKey.VOID || srfi.isSeamless(valL, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getLeftPositionIndexByCoordPattern(x, y, srfcType));
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
            var srfi = Resources.getInstance().surfaceIndex;

            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (srfi.isRightPosition(valB) && srfi.isBottomPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
                if (srfi.isBottomPosition(valL) && srfi.isLeftPosition(valB)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (srfi.isRightPosition(valT) && srfi.isTopPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (srfi.isLeftPosition(valT) && srfi.isTopPosition(valL)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.I_BR));
                }

            }

            // jsem levý horní roh
            if (srfi.isLeftPosition(val) && (srfi.isTopPosition(val) || valT === SurfacePositionKey.VOID || srfi.isSeamless(valT, srfcType) == false)) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (srfi.isLeftPosition(val) && (srfi.isBottomPosition(valR) || srfi.isBottomRightPosition(valR))) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (srfi.isBottomPosition(val) && (srfi.isRightPosition(valT) || srfi.isTopRightPosition(valT))) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (srfi.isRightPosition(val) && (srfi.isTopPosition(valL) || valT === SurfacePositionKey.VOID || srfi.isSeamless(valT, srfcType) == false)) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, SurfacePositionKey.TR));
            }

            return tilesMap.mapRecord.getValue(x, y);
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