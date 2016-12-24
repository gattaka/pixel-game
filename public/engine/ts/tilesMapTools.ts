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

            let processSeam = (otherVal: number, seamFc, seamLessFc) => {
                if (!otherVal || otherVal === SurfacePositionKey.VOID) {
                    record.setValue(x, y, seamFc(x, y, srfcType));
                } else {
                    let type = index.getType(otherVal);
                    if (type != srfcType) {
                        let seamless = index.isSeamless(type, srfcType);
                        if (seamless) {
                            let transition = seamLessFc(x, y, srfcType, type);
                            if (transition)
                                record.setValue(x, y, transition);
                        } else {
                            record.setValue(x, y, seamFc(x, y, srfcType));
                        }
                    }
                }
            }

            processSeam(valT, index.getTopPositionIndexByCoordPattern.bind(index), index.getTopPositionIndexByCoordPatternOnTransition.bind(index));
            processSeam(valR, index.getRightPositionIndexByCoordPattern.bind(index), index.getRightPositionIndexByCoordPatternOnTransition.bind(index));
            processSeam(valB, index.getBottomPositionIndexByCoordPattern.bind(index), index.getBottomPositionIndexByCoordPatternOnTransition.bind(index));
            processSeam(valL, index.getLeftPositionIndexByCoordPattern.bind(index), index.getLeftPositionIndexByCoordPatternOnTransition.bind(index));
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
                // jsem pravý horní roh díry
                if (index.isRightPosition(valB) && index.isBottomPosition(valR)) {
                    record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
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
            }

            // jsem levý horní roh
            if (index.isLeftPosition(val) && (index.isTopPosition(val) || valT === SurfacePositionKey.VOID || index.isSeamless(index.getType(valT), srfcType) == false)) {
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (index.isLeftPosition(val) && (index.isBottomPosition(valR) || index.isBottomRightPosition(valR))) {
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (index.isBottomPosition(val) && (index.isRightPosition(valT) || index.isTopRightPosition(valT))) {
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (index.isRightPosition(val) && (index.isTopPosition(valL) || valT === SurfacePositionKey.VOID || index.isSeamless(index.getType(valT), srfcType) == false)) {
                record.setValue(x, y, index.getPositionIndex(srfcType, SurfacePositionKey.TR));
            }
        }

        static writeObjectRecord(tilesMap: TilesMap, cx: number, cy: number, object: MapObjDefinition) {
            var self = this;
            // zapiš objekt 
            tilesMap.mapObjRecord.setValue(cx, cy, object.srfcKey);
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    tilesMap.mapObjectsTiles.setValue(
                        x + cx,
                        y + cy - object.mapSpriteHeight,
                        new MapObjectTile(object.srfcKey, x, y)
                    );
                }
            }
        }

    }

};