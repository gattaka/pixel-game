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
            var processSeam = function (otherVal, borderSeamFce, transitionSeamFce) {
                if (!otherVal || otherVal === Lich.SurfacePositionKey.VOID) {
                    // Hrana mezi povrchem a prázdnem
                    record.setValue(x, y, borderSeamFce(x, y, srfcType));
                }
                else {
                    var type = index.getType(otherVal);
                    if (type != srfcType) {
                        // Přechod mezi povrchem a jiným povrchem
                        var seamless = index.isSeamless(type, srfcType);
                        if (seamless == false) {
                            // Povrchy nanavazují, vykresli je jako hrany
                            // nebo pokud na ně existuje přechod, zjisti jaký
                            var transition = transitionSeamFce(x, y, srfcType);
                            if (transition) {
                                // přechod
                                record.setValue(x, y, transition);
                                return true;
                            }
                            else {
                                // hrana
                                record.setValue(x, y, borderSeamFce(x, y, srfcType));
                            }
                        }
                    }
                }
                return false;
            };
            // pokud se vrátila obyčejná hrana, pak kontroluj dál
            // pokud se vytvořil přechod mezi dvěma různými povrchy, pak už to dál nezkoušej, 
            // přechod by se mohl akorát přemazat obyčejnou hranou
            if (processSeam(valT, index.getTopPositionIndexByCoordPattern.bind(index), index.getTopPositionIndexByCoordPatternOnTransition.bind(index)))
                return;
            if (processSeam(valR, index.getRightPositionIndexByCoordPattern.bind(index), index.getRightPositionIndexByCoordPatternOnTransition.bind(index)))
                return;
            if (processSeam(valB, index.getBottomPositionIndexByCoordPattern.bind(index), index.getBottomPositionIndexByCoordPatternOnTransition.bind(index)))
                return;
            if (processSeam(valL, index.getLeftPositionIndexByCoordPattern.bind(index), index.getLeftPositionIndexByCoordPatternOnTransition.bind(index)))
                return;
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
                // jsem levý horní roh díry
                if (index.isRightPosition(valB) && index.isBottomPosition(valR)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TL));
                }
                // jsem pravý horní roh díry
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
                return;
            }
            // jsem levý horní roh
            if (index.isLeftPosition(val) && index.isSeamless(index.getType(valT), srfcType) == false
                || index.isTopPosition(val) && index.isSeamless(index.getType(valL), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valT || valT == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.M0));
                        return;
                    }
                    if (!valL || valL == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.M1));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.TL));
            }
            // jsem pravý horní roh
            if (index.isRightPosition(val) && index.isSeamless(index.getType(valT), srfcType) == false
                || index.isTopPosition(val) && index.isSeamless(index.getType(valR), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valR || valR == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.M2));
                        return;
                    }
                    if (!valT || valT == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.M3));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.TR));
            }
            // jsem levý dolní roh
            if (index.isLeftPosition(val) && index.isSeamless(index.getType(valB), srfcType) == false
                || index.isBottomPosition(val) && index.isSeamless(index.getType(valL), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valB || valB == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.MC));
                        return;
                    }
                    if (!valL || valL == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.MD));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (index.isRightPosition(val) && index.isSeamless(index.getType(valB), srfcType) == false
                || index.isBottomPosition(val) && index.isSeamless(index.getType(valR), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valR || valR == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.ME));
                        return;
                    }
                    if (!valB || valB == Lich.SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.MF));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, Lich.SurfacePositionKey.BR));
            }
        };
        TilesMapTools.writeObjectRecord = function (tilesMap, cx, cy, object) {
            var self = this;
            if (!object) {
                console.log("eeee");
            }
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
