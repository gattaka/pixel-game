/**
 * map.js
 *
 * Generuje mapu světa a objekty na ní
 *
 */
var Lich;
(function (Lich) {
    var MapTools = (function () {
        function MapTools() {
        }
        MapTools.generateEdge = function (tilesMap, x, y) {
            var i = tilesMap.indexAt(x, y);
            var val = tilesMap.mapRecord[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);
            var srfcType = Lich.Resources.surfaceIndex.getSurfaceType(val);
            if (valT === Lich.SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.surfaceIndex.getPositionIndex(srfcType, Lich.SurfaceIndex.T);
            }
            if (valR === Lich.SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.surfaceIndex.getPositionIndex(srfcType, Lich.SurfaceIndex.R);
            }
            if (valB === Lich.SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.surfaceIndex.getPositionIndex(srfcType, Lich.SurfaceIndex.B);
            }
            if (valL === Lich.SurfaceIndex.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.surfaceIndex.getPositionIndex(srfcType, Lich.SurfaceIndex.L);
            }
            return tilesMap.mapRecord[i];
        };
        MapTools.generateCorner = function (tilesMap, x, y) {
            var i = tilesMap.indexAt(x, y);
            var val = tilesMap.mapRecord[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);
            var srfcType = Lich.Resources.surfaceIndex.getSurfaceType(val);
            var isMiddle = Lich.Resources.surfaceIndex.isMiddlePosition(val);
            var indx = Lich.Resources.surfaceIndex;
            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (indx.isPosition(valB, Lich.SurfaceIndex.R) && indx.isPosition(valR, Lich.SurfaceIndex.B)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.I_TL);
                }
                // jsem levý horní roh díry
                if (indx.isPosition(valL, Lich.SurfaceIndex.B) && indx.isPosition(valB, Lich.SurfaceIndex.L)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.I_TR);
                }
                // levý spodní roh díry
                if (indx.isPosition(valT, Lich.SurfaceIndex.R) && indx.isPosition(valR, Lich.SurfaceIndex.T)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.I_BL);
                }
                // pravý spodní roh díry
                if (indx.isPosition(valT, Lich.SurfaceIndex.L) && indx.isPosition(valL, Lich.SurfaceIndex.T)) {
                    tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.I_BR);
                }
            }
            // jsem levý horní roh
            if (indx.isPosition(val, Lich.SurfaceIndex.L) && (indx.isPosition(val, Lich.SurfaceIndex.T) || valT === Lich.SurfaceIndex.VOID)) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.TL);
            }
            // jsem levý dolní roh
            if (indx.isPosition(val, Lich.SurfaceIndex.L) && (indx.isPosition(valR, Lich.SurfaceIndex.B) || indx.isPosition(valR, Lich.SurfaceIndex.BR))) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.BL);
            }
            // jsem pravý dolní roh
            if (indx.isPosition(val, Lich.SurfaceIndex.B) && (indx.isPosition(valT, Lich.SurfaceIndex.R) || indx.isPosition(valT, Lich.SurfaceIndex.TR))) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.BR);
            }
            // jsem pravý horní roh
            if (indx.isPosition(val, Lich.SurfaceIndex.R) && (indx.isPosition(valL, Lich.SurfaceIndex.T) || valT === Lich.SurfaceIndex.VOID)) {
                tilesMap.mapRecord[i] = indx.getPositionIndex(srfcType, Lich.SurfaceIndex.TR);
            }
            return tilesMap.mapRecord[i];
        };
        MapTools.modify = function (tilesMap, x, y) {
            var rx = Lich.Utils.even(x);
            var ry = Lich.Utils.even(y);
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry)] = Lich.SurfaceIndex.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry)] = Lich.SurfaceIndex.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry + 1)] = Lich.SurfaceIndex.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry + 1)] = Lich.SurfaceIndex.VOID;
        };
        MapTools.writeObjectRecord = function (tilesMap, cx, cy, object) {
            var self = this;
            // zapiš obsazení jednotlivými dílky objektu
            for (var x = 0; x < object.mapSpriteWidth; x++) {
                for (var y = 0; y < object.mapSpriteHeight; y++) {
                    var col = tilesMap.mapObjectsTiles[x + cx];
                    if (typeof col === "undefined") {
                        col = [];
                        tilesMap.mapObjectsTiles[x + cx] = col;
                    }
                    var partsSheetIndex = MapTools.createPartsSheetIndex(object, x, y);
                    // musí se posunout o object.mapSpriteHeight, protože 
                    // objekty se počítají počátkem levého SPODNÍHO rohu 
                    col[y + cy - object.mapSpriteHeight] = new Lich.MapObjectTile(object.mapKey, partsSheetIndex, x, y);
                }
            }
        };
        MapTools.createPartsSheetIndex = function (object, x, y) {
            return x + y * Lich.Resources.PARTS_SHEET_WIDTH;
        };
        return MapTools;
    }());
    Lich.MapTools = MapTools;
})(Lich || (Lich = {}));
;
