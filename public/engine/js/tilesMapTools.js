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
            var processSeam = function (otherVal, seamFc, seamLessFc) {
                if (!otherVal || otherVal === Lich.SurfacePositionKey.VOID) {
                    record.setValue(x, y, seamFc(x, y, srfcType));
                }
                else {
                    var type = index.getType(otherVal);
                    if (type != srfcType) {
                        var seamless = index.isSeamless(type, srfcType);
                        if (seamless) {
                            var transition = seamLessFc(x, y, srfcType, type);
                            if (transition)
                                record.setValue(x, y, transition);
                        }
                        else {
                            record.setValue(x, y, seamFc(x, y, srfcType));
                        }
                    }
                }
            };
            processSeam(valT, index.getTopPositionIndexByCoordPattern.bind(index), index.getTopPositionIndexByCoordPatternOnTransition.bind(index));
            processSeam(valR, index.getRightPositionIndexByCoordPattern.bind(index), index.getRightPositionIndexByCoordPatternOnTransition.bind(index));
            processSeam(valB, index.getBottomPositionIndexByCoordPattern.bind(index), index.getBottomPositionIndexByCoordPatternOnTransition.bind(index));
            processSeam(valL, index.getLeftPositionIndexByCoordPattern.bind(index), index.getLeftPositionIndexByCoordPatternOnTransition.bind(index));
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
            if (index.isLeftPosition(val) && (index.isTopPosition(val) || valT === Lich.SurfacePositionKey.VOID || index.isSeamless(index.getType(valT), srfcType) == false)) {
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
            if (index.isRightPosition(val) && (index.isTopPosition(valL) || valT === Lich.SurfacePositionKey.VOID || index.isSeamless(index.getType(valT), srfcType) == false)) {
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.TR));
            }
        };
        TilesMapTools.writeObjectRecord = function (tilesMap, cx, cy, object) {
            var self = this;
            // zapiš objekt 
            tilesMap.mapObjRecord.setValue(cx, cy, object.mapObjKey);
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    tilesMap.mapObjectsTiles.setValue(x + cx, y + cy - object.mapSpriteHeight, new Lich.MapObjectTile(object.mapObjKey, x, y));
                }
            }
        };
        return TilesMapTools;
    }());
    Lich.TilesMapTools = TilesMapTools;
})(Lich || (Lich = {}));
;
