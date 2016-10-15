/**
 * map.js
 *
 * Nástroj pro úpravy dílkové mapy
 *
 */
var Lich;
(function (Lich) {
    var TilesMapTools = (function () {
        function TilesMapTools() {
        }
        TilesMapTools.generateEdge = function (tilesMap, x, y) {
            var val = tilesMap.mapRecord.getValue(x, y);
            if (!val || val == Lich.SurfacePositionKey.VOID)
                return;
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);
            var srfi = Lich.Resources.getInstance().surfaceIndex;
            var srfcType = srfi.getType(val);
            if (!valT || valT === Lich.SurfacePositionKey.VOID || srfi.isSeamless(valT, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getTopPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (!valR || valR === Lich.SurfacePositionKey.VOID || srfi.isSeamless(valR, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getRightPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (!valB || valB === Lich.SurfacePositionKey.VOID || srfi.isSeamless(valB, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getBottomPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (!valL || valL === Lich.SurfacePositionKey.VOID || srfi.isSeamless(valL, srfcType) == false) {
                tilesMap.mapRecord.setValue(x, y, srfi.getLeftPositionIndexByCoordPattern(x, y, srfcType));
            }
        };
        TilesMapTools.generateCorner = function (tilesMap, x, y) {
            var val = tilesMap.mapRecord.getValue(x, y);
            if (!val || val == Lich.SurfacePositionKey.VOID)
                return;
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);
            var srfcType = Lich.Resources.getInstance().surfaceIndex.getType(val);
            var isMiddle = Lich.Resources.getInstance().surfaceIndex.isMiddlePosition(val);
            var srfi = Lich.Resources.getInstance().surfaceIndex;
            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (srfi.isRightPosition(valB) && srfi.isBottomPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
                if (srfi.isBottomPosition(valL) && srfi.isLeftPosition(valB)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (srfi.isRightPosition(valT) && srfi.isTopPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (srfi.isLeftPosition(valT) && srfi.isTopPosition(valL)) {
                    tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BR));
                }
            }
            // jsem levý horní roh
            if (srfi.isLeftPosition(val) && (srfi.isTopPosition(val) || valT === Lich.SurfacePositionKey.VOID || srfi.isSeamless(valT, srfcType) == false)) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (srfi.isLeftPosition(val) && (srfi.isBottomPosition(valR) || srfi.isBottomRightPosition(valR))) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (srfi.isBottomPosition(val) && (srfi.isRightPosition(valT) || srfi.isTopRightPosition(valT))) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (srfi.isRightPosition(val) && (srfi.isTopPosition(valL) || valT === Lich.SurfacePositionKey.VOID || srfi.isSeamless(valT, srfcType) == false)) {
                tilesMap.mapRecord.setValue(x, y, srfi.getPositionIndex(srfcType, Lich.SurfacePositionKey.TR));
            }
        };
        TilesMapTools.writeObjectRecord = function (tilesMap, cx, cy, object) {
            var self = this;
            // zapiš objekt 
            tilesMap.mapObjRecord.setValue(cx, cy, object.mapKey);
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    tilesMap.mapObjectsTiles.setValue(x + cx, y + cy - object.mapSpriteHeight, new Lich.MapObjectTile(object.mapKey, x, y));
                }
            }
        };
        return TilesMapTools;
    }());
    Lich.TilesMapTools = TilesMapTools;
})(Lich || (Lich = {}));
;
