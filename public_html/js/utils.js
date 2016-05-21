var Lich;
(function (Lich) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.sign = function (value) {
            return value < 0 ? -1 : 1;
        };
        Utils.floor = function (value) {
            return value < 0 ? Math.ceil(value) : Math.floor(value);
        };
        Utils.ceil = function (value) {
            return value < 0 ? Math.floor(value) : Math.ceil(value);
        };
        Utils.isEven = function (value) {
            return value % 2 == 0;
        };
        Utils.even = function (value) {
            return Utils.isEven(value) ? value : value - 1;
        };
        Utils.get2D = function (a, x, y) {
            // přidej dílek do globální mapy
            var col = a[x];
            if (typeof col === "undefined" || col[y] == null) {
                return null;
            }
            else {
                return col[y];
            }
        };
        Utils.set2D = function (a, x, y, val) {
            var col = a[x];
            if (typeof col === "undefined") {
                col = [];
                a[x] = col;
            }
            col[y] = val;
        };
        Utils.contains = function (a, obj) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        };
        return Utils;
    }());
    Lich.Utils = Utils;
})(Lich || (Lich = {}));
