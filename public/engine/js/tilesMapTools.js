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
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);
            var srfi = Lich.Resources.getInstance().surfaceIndex;
            var srfcType = srfi.getType(val);
            if (valT === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, srfi.getTopPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (valR === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, srfi.getRightPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (valB === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, srfi.getBottomPositionIndexByCoordPattern(x, y, srfcType));
            }
            if (valL === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, srfi.getLeftPositionIndexByCoordPattern(x, y, srfcType));
            }
            return tilesMap.mapRecord.getValue(x, y);
        };
        TilesMapTools.generateCorner = function (tilesMap, x, y) {
            var val = tilesMap.mapRecord.getValue(x, y);
            var valT = tilesMap.mapRecord.getValue(x, y - 1);
            var valR = tilesMap.mapRecord.getValue(x + 1, y);
            var valB = tilesMap.mapRecord.getValue(x, y + 1);
            var valL = tilesMap.mapRecord.getValue(x - 1, y);
            var srfcType = Lich.Resources.getInstance().surfaceIndex.getType(val);
            var isMiddle = Lich.Resources.getInstance().surfaceIndex.isMiddlePosition(val);
            var indx = Lich.Resources.getInstance().surfaceIndex;
            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (indx.isRightPosition(valB) && indx.isBottomPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
                if (indx.isBottomPosition(valL) && indx.isLeftPosition(valB)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (indx.isRightPosition(valT) && indx.isTopPosition(valR)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (indx.isLeftPosition(valT) && indx.isTopPosition(valL)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BR));
                }
            }
            // jsem levý horní roh
            if (indx.isLeftPosition(val) && (indx.isTopPosition(val) || valT === Lich.SurfacePositionKey.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (indx.isLeftPosition(val) && (indx.isBottomPosition(valR) || indx.isBottomRightPosition(valR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (indx.isBottomPosition(val) && (indx.isRightPosition(valT) || indx.isTopRightPosition(valT))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (indx.isRightPosition(val) && (indx.isTopPosition(valL) || valT === Lich.SurfacePositionKey.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.TR));
            }
            return tilesMap.mapRecord.getValue(x, y);
        };
        TilesMapTools.modify = function (tilesMap, x, y) {
            var rx = Lich.Utils.even(x);
            var ry = Lich.Utils.even(y);
            tilesMap.mapRecord.setValue(rx, ry, Lich.SurfacePositionKey.VOID);
            tilesMap.mapRecord.setValue(rx + 1, ry, Lich.SurfacePositionKey.VOID);
            tilesMap.mapRecord.setValue(rx, ry + 1, Lich.SurfacePositionKey.VOID);
            tilesMap.mapRecord.setValue(rx + 1, ry + 1, Lich.SurfacePositionKey.VOID);
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
