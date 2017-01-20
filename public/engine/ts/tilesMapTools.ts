/**
 * map.js
 * 
 * Nástroj pro úpravy dílkové mapy
 * 
 */
namespace Lich {
    export class TilesMapTools {

        private constructor() { }

        static generateEdge(record: Array2D<number>, x: number, y: number, bgr: boolean) {
            let val = record.getValue(x, y);
            if (!val || val == SurfacePositionKey.VOID)
                return;

            let rsc = Resources.getInstance();
            let index;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
            } else {
                index = rsc.surfaceIndex;
            }

            let valT = record.getValue(x, y - 1);
            let valR = record.getValue(x + 1, y);
            let valB = record.getValue(x, y + 1);
            let valL = record.getValue(x - 1, y);

            let srfcType = index.getType(val);

            let processSeam = (otherVal: number, seamFc, seamLessFc): boolean => {
                if (!otherVal || otherVal === SurfacePositionKey.VOID) {
                    // Hrana mezi povrchem a prázdnem
                    record.setValue(x, y, seamFc(x, y, srfcType));
                } else {
                    let type = index.getType(otherVal);
                    if (type != srfcType) {
                        // Přechod mezi povrchem a jiným povrchem
                        let seamless = index.isSeamless(type, srfcType);
                        if (seamless) {
                            // Povrchy mají mezi sebou přechod, zjisti jaký
                            let transition = seamLessFc(x, y, srfcType, type);
                            if (transition) {
                                record.setValue(x, y, transition);
                                return true;
                            }
                        } else {
                            // Povrchy nemají mezi sebou přechod, vykresli je jako hrany
                            record.setValue(x, y, seamFc(x, y, srfcType));
                        }
                    }
                }
                return false;
            }

            // pokud se vrátila obyčejná hrana, pak kontroluj dál
            // pokud se vytvořil přechod mezi dvěma různými povrchy, pak už to dál nezkoušej, 
            // přechod by se mohl akorát přemazat obyčejnou hranou
            if (processSeam(valT, index.getTopPositionIndexByCoordPattern.bind(index), index.getTopPositionIndexByCoordPatternOnTransition.bind(index))) return;
            if (processSeam(valR, index.getRightPositionIndexByCoordPattern.bind(index), index.getRightPositionIndexByCoordPatternOnTransition.bind(index))) return;
            if (processSeam(valB, index.getBottomPositionIndexByCoordPattern.bind(index), index.getBottomPositionIndexByCoordPatternOnTransition.bind(index))) return;
            if (processSeam(valL, index.getLeftPositionIndexByCoordPattern.bind(index), index.getLeftPositionIndexByCoordPatternOnTransition.bind(index))) return;
        }

        static generateCorner(record: Array2D<number>, x: number, y: number, bgr: boolean) {

            let rsc = Resources.getInstance();
            let index;
            if (bgr) {
                index = rsc.surfaceBgrIndex;
            } else {
                index = rsc.surfaceIndex;
            }

            var val = record.getValue(x, y);
            if (!val || val == SurfacePositionKey.VOID)
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
                    record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.I_TL));
                }
                // jsem pravý horní roh díry
                if (index.isBottomPosition(valL) && index.isLeftPosition(valB)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (index.isRightPosition(valT) && index.isTopPosition(valR)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (index.isLeftPosition(valT) && index.isTopPosition(valL)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.I_BR));
                }

                return;
            }

            // jsem levý horní roh
            if (index.isLeftPosition(val) && index.isSeamless(index.getType(valT), srfcType) == false
                || index.isTopPosition(val) && index.isSeamless(index.getType(valL), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valT || valT == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.M0));
                        return;
                    }
                    if (!valL || valL == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.M1));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.TL));
            }
            // jsem pravý horní roh
            if (index.isRightPosition(val) && index.isSeamless(index.getType(valT), srfcType) == false
                || index.isTopPosition(val) && index.isSeamless(index.getType(valR), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valR || valR == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.M2));
                        return;
                    }
                    if (!valT || valT == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.M3));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.TR));
            }
            // jsem levý dolní roh
            if (index.isLeftPosition(val) && index.isSeamless(index.getType(valB), srfcType) == false
                || index.isBottomPosition(val) && index.isSeamless(index.getType(valL), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valB || valB == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.MC));
                        return;
                    }
                    if (!valL || valL == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.MD));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (index.isRightPosition(val) && index.isSeamless(index.getType(valB), srfcType) == false
                || index.isBottomPosition(val) && index.isSeamless(index.getType(valR), srfcType) == false) {
                if (index.isTransitionSrfc(val)) {
                    if (!valR || valR == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.ME));
                        return;
                    }
                    if (!valB || valB == SurfacePositionKey.VOID) {
                        record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.MF));
                        return;
                    }
                }
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.BR));
            }
        }

        static writeObjectRecord(tilesMap: TilesMap, cx: number, cy: number, object: MapObjDefinition) {
            var self = this;
            // zapiš objekt 
            tilesMap.mapObjRecord.setValue(cx, cy, object.mapObjKey);
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    tilesMap.mapObjectsTiles.setValue(
                        x + cx,
                        y + cy - object.mapSpriteHeight,
                        new MapObjectTile(object.mapObjKey, x, y)
                    );
                }
            }
        }

    }

};