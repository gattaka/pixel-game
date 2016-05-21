namespace Lich {
    export class Utils {

        static sign(value) {
            return value < 0 ? -1 : 1;
        }

        static floor(value) {
            return value < 0 ? Math.ceil(value) : Math.floor(value);
        }

        static ceil(value) {
            return value < 0 ? Math.floor(value) : Math.ceil(value);
        }

        static isEven(value) {
            return value % 2 == 0;
        }

        static even(value) {
            return Utils.isEven(value) ? value : value - 1;
        }

        static get2D(a, x, y) {
            // přidej dílek do globální mapy
            var col = a[x];
            if (typeof col === "undefined" || col[y] == null) {
                return null;
            }
            else {
                return col[y];
            }
        }

        static set2D(a, x, y, val) {
            var col = a[x];
            if (typeof col === "undefined") {
                col = [];
                a[x] = col;
            }
            col[y] = val;
        }

        static contains(a, obj) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        }

    }
}