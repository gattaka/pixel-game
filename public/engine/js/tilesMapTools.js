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
        TilesMapTools.generateEdge = function (record, x, y, bgr) {
            var val = record.getValue(x, y);
            if (!val || val == Lich.SurfacePositionKey.VOID)
                return;
            var rsc = Lich.Resources.getInstance();
            var index;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
            }
            else {
                index = rsc.surfaceIndex;
            }
            var valT = record.getValue(x, y - 1);
            var valR = record.getValue(x + 1, y);
            var valB = record.getValue(x, y + 1);
            var valL = record.getValue(x - 1, y);
            var srfcType = index.getType(val);
            if (!valT || valT === Lich.SurfacePositionKey.VOID || index.isSeamless(valT, srfcType) == false) {
                record.setValue(x, y, index.getTopPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (!valR || valR === Lich.SurfacePositionKey.VOID || index.isSeamless(valR, srfcType) == false) {
                record.setValue(x, y, index.getRightPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (!valB || valB === Lich.SurfacePositionKey.VOID || index.isSeamless(valB, srfcType) == false) {
                record.setValue(x, y, index.getBottomPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (!valL || valL === Lich.SurfacePositionKey.VOID || index.isSeamless(valL, srfcType) == false) {
                record.setValue(x, y, index.getLeftPositionIndexByCoordPattern(x, y, srfcType));
            }
        };
        TilesMapTools.generateCorner = function (record, x, y, bgr) {
            var rsc = Lich.Resources.getInstance();
            var index;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
            }
            else {
                index = rsc.surfaceIndex;
            }
            var val = record.getValue(x, y);
            if (!val || val == Lich.SurfacePositionKey.VOID)
                return;
            var valT = record.getValue(x, y - 1);
            var valR = record.getValue(x + 1, y);
            var valB = record.getValue(x, y + 1);
            var valL = record.getValue(x - 1, y);
            var srfcType = index.getType(val);
            var isMiddle = index.isMiddlePosition(val);
            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (index.isRightPosition(valB) && index.isBottomPosition(valR)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
                if (index.isBottomPosition(valL) && index.isLeftPosition(valB)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (index.isRightPosition(valT) && index.isTopPosition(valR)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (index.isLeftPosition(valT) && index.isTopPosition(valL)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BR));
                }
            }
            // jsem levý horní roh
            if (index.isLeftPosition(val) && (index.isTopPosition(val) || valT === Lich.SurfacePositionKey.VOID || index.isSeamless(valT, srfcType) == false)) {
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (index.isLeftPosition(val) && (index.isBottomPosition(valR) || index.isBottomRightPosition(valR))) {
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (index.isBottomPosition(val) && (index.isRightPosition(valT) || index.isTopRightPosition(valT))) {
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (index.isRightPosition(val) && (index.isTopPosition(valL) || valT === Lich.SurfacePositionKey.VOID || index.isSeamless(valT, srfcType) == false)) {
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.TR));
            }
        };
        TilesMapTools.writeObjectRecord = function (tilesMap, cx, cy, object) {
            var self = this;
            // zapiš objekt 
            tilesMap.mapObjRecord.setValue(cx, cy, object.srfcKey);
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    tilesMap.mapObjectsTiles.setValue(x + cx, y + cy - object.mapSpriteHeight, new Lich.MapObjectTile(object.srfcKey, x, y));
                }
            }
        };
        return TilesMapTools;
    }());
    Lich.TilesMapTools = TilesMapTools;
})(Lich || (Lich = {}));
;
