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
            var srfcType = Lich.Resources.getInstance().surfaceIndex.getType(val);
            if (valT === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Lich.Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, Lich.SurfacePositionKey.T));
            }
            if (valR === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Lich.Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, Lich.SurfacePositionKey.R));
            }
            if (valB === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Lich.Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, Lich.SurfacePositionKey.B));
            }
            if (valL === Lich.SurfacePositionKey.VOID) {
                tilesMap.mapRecord.setValue(x, y, Lich.Resources.getInstance().surfaceIndex.getPositionIndex(srfcType, Lich.SurfacePositionKey.L));
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
                if (indx.isPosition(valB, Lich.SurfacePositionKey.R) && indx.isPosition(valR, Lich.SurfacePositionKey.B)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TL));
                }
                // jsem levý horní roh díry
                if (indx.isPosition(valL, Lich.SurfacePositionKey.B) && indx.isPosition(valB, Lich.SurfacePositionKey.L)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_TR));
                }
                // levý spodní roh díry
                if (indx.isPosition(valT, Lich.SurfacePositionKey.R) && indx.isPosition(valR, Lich.SurfacePositionKey.T)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BL));
                }
                // pravý spodní roh díry
                if (indx.isPosition(valT, Lich.SurfacePositionKey.L) && indx.isPosition(valL, Lich.SurfacePositionKey.T)) {
                    tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.I_BR));
                }
            }
            // jsem levý horní roh
            if (indx.isPosition(val, Lich.SurfacePositionKey.L) && (indx.isPosition(val, Lich.SurfacePositionKey.T) || valT === Lich.SurfacePositionKey.VOID)) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.TL));
            }
            // jsem levý dolní roh
            if (indx.isPosition(val, Lich.SurfacePositionKey.L) && (indx.isPosition(valR, Lich.SurfacePositionKey.B) || indx.isPosition(valR, Lich.SurfacePositionKey.BR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.BL));
            }
            // jsem pravý dolní roh
            if (indx.isPosition(val, Lich.SurfacePositionKey.B) && (indx.isPosition(valT, Lich.SurfacePositionKey.R) || indx.isPosition(valT, Lich.SurfacePositionKey.TR))) {
                tilesMap.mapRecord.setValue(x, y, indx.getPositionIndex(srfcType, Lich.SurfacePositionKey.BR));
            }
            // jsem pravý horní roh
            if (indx.isPosition(val, Lich.SurfacePositionKey.R) && (indx.isPosition(valL, Lich.SurfacePositionKey.T) || valT === Lich.SurfacePositionKey.VOID)) {
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
        /**
         * Získá výchozí prostřední dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        TilesMapTools.getSurfacePositionByCoordPattern = function (x, y) {
            var col = x % 3 + 1; // +1 za VOID
            var row = y % 3;
            var key = col + row * 8; // řada má 8 položek
            return Lich.SurfacePositionKey[Lich.SurfacePositionKey[key]];
        };
        /**
         * Získá výchozí prostřední dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        TilesMapTools.getSurfaceBgrPositionByCoordPattern = function (x, y) {
            var col = x % 3 + 1; // +1 za VOID
            var row = y % 3;
            var key = col + row * 3; // řada má 3 položky
            return Lich.SurfaceBgrPositionKey[Lich.SurfaceBgrPositionKey[key]];
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
