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
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);
            if (valT === Lich.Resources.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.T;
            }
            if (valR === Lich.Resources.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.R;
            }
            if (valB === Lich.Resources.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.B;
            }
            if (valL === Lich.Resources.VOID) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.L;
            }
            return tilesMap.mapRecord[i];
        };
        ;
        MapTools.generateCorner = function (tilesMap, x, y) {
            var i = tilesMap.indexAt(x, y);
            var val = tilesMap.mapRecord[i];
            var valT = tilesMap.valueAt(x, y - 1);
            var valR = tilesMap.valueAt(x + 1, y);
            var valB = tilesMap.valueAt(x, y + 1);
            var valL = tilesMap.valueAt(x - 1, y);
            var isMiddle = false;
            for (var m = 1; m <= 9; m++) {
                if (val === Lich.Resources.DIRT["M" + m]) {
                    isMiddle = true;
                    break;
                }
            }
            // změny prostředních kusů
            if (isMiddle) {
                // jsem pravý horní roh díry
                if (valB === Lich.Resources.DIRT.R && valR === Lich.Resources.DIRT.B) {
                    tilesMap.mapRecord[i] = Lich.Resources.DIRT.I_TL;
                }
                // jsem levý horní roh díry
                if (valL === Lich.Resources.DIRT.B && valB === Lich.Resources.DIRT.L) {
                    tilesMap.mapRecord[i] = Lich.Resources.DIRT.I_TR;
                }
                // levý spodní roh díry
                if (valT === Lich.Resources.DIRT.R && valR === Lich.Resources.DIRT.T) {
                    tilesMap.mapRecord[i] = Lich.Resources.DIRT.I_BL;
                }
                // pravý spodní roh díry
                if (valT === Lich.Resources.DIRT.L && valL === Lich.Resources.DIRT.T) {
                    tilesMap.mapRecord[i] = Lich.Resources.DIRT.I_BR;
                }
            }
            // jsem levý horní roh
            if (val === Lich.Resources.DIRT.L && (valR === Lich.Resources.DIRT.T || valT === Lich.Resources.VOID)) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.TL;
            }
            // jsem levý dolní roh
            if (val === Lich.Resources.DIRT.L && (valR === Lich.Resources.DIRT.B || valR === Lich.Resources.DIRT.BR)) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.BL;
            }
            // jsem pravý dolní roh
            if (val === Lich.Resources.DIRT.B && (valT === Lich.Resources.DIRT.R || valT === Lich.Resources.DIRT.TR)) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.BR;
            }
            // jsem pravý horní roh
            if (val === Lich.Resources.DIRT.R && (valL === Lich.Resources.DIRT.T || valT === Lich.Resources.VOID)) {
                tilesMap.mapRecord[i] = Lich.Resources.DIRT.TR;
            }
            return tilesMap.mapRecord[i];
        };
        ;
        MapTools.modify = function (tilesMap, x, y) {
            var rx = Lich.Utils.even(x);
            var ry = Lich.Utils.even(y);
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry)] = Lich.Resources.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry)] = Lich.Resources.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx, ry + 1)] = Lich.Resources.VOID;
            tilesMap.mapRecord[tilesMap.indexAt(rx + 1, ry + 1)] = Lich.Resources.VOID;
        };
        ;
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
                    col[y + cy - object.mapSpriteHeight] = new Lich.MapObjectTile(object.mapKey, partsSheetIndex, x, y);
                }
            }
        };
        ;
        MapTools.createPartsSheetIndex = function (object, x, y) {
            return object.mapSpriteX + x + (object.mapSpriteY + y) * Lich.Resources.PARTS_SHEET_WIDTH;
        };
        return MapTools;
    }());
    Lich.MapTools = MapTools;
})(Lich || (Lich = {}));
;
