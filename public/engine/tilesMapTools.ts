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

            if (valT === SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, srfi.getTopPositionIndexByCoordPattern(x, y, srfcType));
            }

            if (valR === SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, srfi.getRightPositionIndexByCoordPattern(x, y, srfcType));
            }

            if (valB === SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, srfi.getBottomPositionIndexByCoordPattern(x, y, srfcType));
            }

            if (valL === SurfacePositionKey.VOID) {
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
            var indx = Resources.getInstance().surfaceIndex;

            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (indx.isRightPosition(valB) && indx.isBottomPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
                if (indx.isBottomPosition(valL) && indx.isLeftPosition(valB)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (indx.isRightPosition(valT) && indx.isTopPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (indx.isLeftPosition(valT) && indx.isTopPosition(valL)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.I_BR));
                }

            }

            // jsem levý horní roh
            if (indx.isLeftPosition(val) && (indx.isTopPosition(val) || valT === SurfacePositionKey.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (indx.isLeftPosition(val) && (indx.isBottomPosition(valR) || indx.isBottomRightPosition(valR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (indx.isBottomPosition(val) && (indx.isRightPosition(valT) || indx.isTopRightPosition(valT))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (indx.isRightPosition(val) && (indx.isTopPosition(valL) || valT === SurfacePositionKey.VOID)) {
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