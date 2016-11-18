namespace Lich {

    export class HashMap<V> {
        [key: string]: V;
    }

    export class CollisionTestResult {
        constructor(public hit: boolean, public x?: number, public y?: number, public collisionType = CollisionType.SOLID) { }
    }

    export class Coord2D {
        constructor(public x: number, public y: number) { }
    }

    export class Array2D<T> {

        private array = new Array<Array<T>>();

        public getPlainArray() {
            return this.array;
        }

        constructor(public width = 0, public height = 0) {
        }

        getValue(x: number, y: number): T {
            var row = this.array[y];
            if (typeof row === "undefined" || row[x] == null) {
                return null;
            }
            else {
                return row[x];
            }
        }

        setValue(x: number, y: number, val: T): boolean {
            if (x < 0 || (x >= this.width && this.width != 0))
                return false;
            if (y < 0 || (y >= this.height && this.height != 0))
                return false;
            var row = this.array[y];
            if (typeof row === "undefined") {
                row = [];
                this.array[y] = row;
            }
            row[x] = val;
            return true;
        }

        /*
        indexAt(x, y) {
            var self = this;
            if (x >= self.width || x < 0 || y >= self.height || y < 0) {
                return -1;
            } else {
                return y * self.width + x;
            }
        }

        coordAt(index): Coord2D {
            var self = this;
            if (index < 0 || index > self.width * self.height - 1) {
                return null;
            } else {
                return new Coord2D(
                    index % self.width,
                    Math.floor(index / self.width)
                )
            };
        }

        valueAt(x, y): number {
            var self = this;
            var index = self.indexAt(x, y);
            if (index >= 0) {
                return self.mapRecord[index];
            }
            if (index == -1) {
                return -1;
            }
            return SurfaceIndex.VOID;
        }
        */
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