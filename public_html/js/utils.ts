namespace Lich {
    export class Utils {

        static sign(value: number) {
            return value < 0 ? -1 : 1;
        }

        static floor(value: number) {
            return value < 0 ? Math.ceil(value) : Math.floor(value);
        }

        static ceil(value: number) {
            return value < 0 ? Math.floor(value) : Math.ceil(value);
        }

        static isEven(value: number) {
            return value % 2 == 0;
        }

        static even(value: number) {
            return Utils.isEven(value) ? value : value - 1;
        }

        static get2D<T>(a: Array<Array<T>>, x: number, y: number): T {
            // přidej dílek do globální mapy
            var col = a[x];
            if (typeof col === "undefined" || col[y] == null) {
                return null;
            }
            else {
                return col[y];
            }
        }

        static set2D<T>(a: Array<Array<T>>, x: number, y: number, val: T) {
            var col = a[x];
            if (typeof col === "undefined") {
                col = [];
                a[x] = col;
            }
            col[y] = val;
        }

        static contains<T>(a: Array<T>, obj: T) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        }

    }
}