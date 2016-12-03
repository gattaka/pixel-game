var Lich;
(function (Lich) {
    var HashMap = (function () {
        function HashMap() {
        }
        return HashMap;
    }());
    Lich.HashMap = HashMap;
    var CollisionTestResult = (function () {
        function CollisionTestResult(hit, x, y, collisionType, partOffsetX, partOffsetY, srfcDef) {
            if (collisionType === void 0) { collisionType = Lich.CollisionType.SOLID; }
            this.hit = hit;
            this.x = x;
            this.y = y;
            this.collisionType = collisionType;
            this.partOffsetX = partOffsetX;
            this.partOffsetY = partOffsetY;
            this.srfcDef = srfcDef;
        }
        return CollisionTestResult;
    }());
    Lich.CollisionTestResult = CollisionTestResult;
    var Coord2D = (function () {
        function Coord2D(x, y, partOffsetX, partOffsetY) {
            this.x = x;
            this.y = y;
            this.partOffsetX = partOffsetX;
            this.partOffsetY = partOffsetY;
        }
        return Coord2D;
    }());
    Lich.Coord2D = Coord2D;
    var Array2D = (function () {
        function Array2D(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.width = width;
            this.height = height;
            this.array = new Array();
        }
        Array2D.prototype.getPlainArray = function () {
            return this.array;
        };
        Array2D.prototype.getValue = function (x, y) {
            var row = this.array[y];
            if (typeof row === "undefined" || row[x] == null) {
                return null;
            }
            else {
                return row[x];
            }
        };
        Array2D.prototype.setValue = function (x, y, val) {
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
        };
        return Array2D;
    }());
    Lich.Array2D = Array2D;
    var Table = (function () {
        function Table() {
            this.array = new Array();
            this.table = {};
        }
        Table.prototype.forEach = function (f) {
            this.array.forEach(f);
        };
        Table.prototype.insert = function (key, element) {
            this.array.push(element);
            this.table[key] = element;
            return this.array.length - 1;
        };
        Table.prototype.byKey = function (key) {
            return this.table[key];
        };
        Table.prototype.byIndex = function (index) {
            return this.array[index];
        };
        return Table;
    }());
    Lich.Table = Table;
    var Utils = (function () {
        function Utils() {
        }
        Utils.distance = function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        };
        Utils.toRad = function (angle) {
            return Math.PI * angle / 180;
        };
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
