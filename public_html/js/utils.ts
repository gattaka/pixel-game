namespace Lich {

    export class CollisionTestResult {
        constructor(public hit: boolean, public x?: number, public y?: number) { }
    }

    export class Table<T> {

        private array = new Array<T>();
        private table = {};

        public forEach(f: (t: T) => any) {
            this.array.forEach(f);
        }

        public insert(key: string, element: T): number {
            this.array.push(element);
            this.table[key] = element;
            return this.array.length - 1;
        }

        public byKey(key: string): T {
            return this.table[key];
        }

        public byIndex(index: number): T {
            return this.array[index];
        }

    }

    export class Utils {

        static distance(x1: number, y1: number, x2: number, y2: number): number {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

        static sign(value: number): number {
            return value < 0 ? -1 : 1;
        }

        static floor(value: number): number {
            return value < 0 ? Math.ceil(value) : Math.floor(value);
        }

        static ceil(value: number): number {
            return value < 0 ? Math.floor(value) : Math.ceil(value);
        }

        static isEven(value: number): boolean {
            return value % 2 == 0;
        }

        static even(value: number): number {
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