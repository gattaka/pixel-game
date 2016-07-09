var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var AbstractIndex = (function () {
        function AbstractIndex() {
            // počet evidovaných typů
            this.size = 0;
            // index 
            this.types = {};
            this.reversedTypes = new Array();
            // počet pozic
            this.optionsCount = 0;
            // Klíčovaná mapa s čísli pozic v každém surface sprite
            this.positions = {};
        }
        // automaticky je spočítá
        AbstractIndex.prototype.putIntoPositions = function (positionKey, position) {
            this.positions[positionKey] = position;
            this.optionsCount++;
        };
        ;
        AbstractIndex.prototype.insert = function (key) {
            this.types[key] = this.size;
            this.size = this.reversedTypes.push(key);
        };
        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        AbstractIndex.prototype.getType = function (sampleIndex) {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.optionsCount);
            return this.reversedTypes[typ];
        };
        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        AbstractIndex.prototype.getPositionIndex = function (key, positionKey) {
            return this.types[key] * this.optionsCount + this.positions[positionKey];
        };
        /**
         * Změní na povrch, ale zachová pozici
         */
        AbstractIndex.prototype.changeType = function (index, key) {
            var pos = this.getPosition(index);
            return this.types[key] * this.optionsCount + pos;
        };
        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu
         */
        AbstractIndex.prototype.isPosition = function (index, positionKey) {
            return this.getPosition(index) == this.positions[positionKey];
        };
        AbstractIndex.prototype.getPosition = function (index) {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.optionsCount + 1;
        };
        // void
        AbstractIndex.VOID = 0;
        return AbstractIndex;
    }());
    Lich.AbstractIndex = AbstractIndex;
    var SurfaceBgrIndex = (function (_super) {
        __extends(SurfaceBgrIndex, _super);
        function SurfaceBgrIndex() {
            _super.call(this);
            // přidej pozice
            this.putIntoPositions(SurfaceBgrIndex.M1, 1);
            this.putIntoPositions(SurfaceBgrIndex.M2, 2);
            this.putIntoPositions(SurfaceBgrIndex.M3, 3);
            this.putIntoPositions(SurfaceBgrIndex.M4, 4);
            this.putIntoPositions(SurfaceBgrIndex.M5, 5);
            this.putIntoPositions(SurfaceBgrIndex.M6, 6);
            this.putIntoPositions(SurfaceBgrIndex.M7, 7);
            this.putIntoPositions(SurfaceBgrIndex.M8, 8);
            this.putIntoPositions(SurfaceBgrIndex.M9, 9);
        }
        ;
        // poziční klíče
        SurfaceBgrIndex.M1 = "M1";
        SurfaceBgrIndex.M2 = "M2";
        SurfaceBgrIndex.M3 = "M3";
        SurfaceBgrIndex.M4 = "M4";
        SurfaceBgrIndex.M5 = "M5";
        SurfaceBgrIndex.M6 = "M6";
        SurfaceBgrIndex.M7 = "M7";
        SurfaceBgrIndex.M8 = "M8";
        SurfaceBgrIndex.M9 = "M9";
        return SurfaceBgrIndex;
    }(AbstractIndex));
    Lich.SurfaceBgrIndex = SurfaceBgrIndex;
    var SurfaceIndex = (function (_super) {
        __extends(SurfaceIndex, _super);
        function SurfaceIndex() {
            _super.call(this);
            // přidej pozice
            this.putIntoPositions(SurfaceIndex.M1, 1);
            this.putIntoPositions(SurfaceIndex.M2, 2);
            this.putIntoPositions(SurfaceIndex.M3, 3);
            this.putIntoPositions(SurfaceIndex.TL, 4);
            this.putIntoPositions(SurfaceIndex.TR, 5);
            this.putIntoPositions(SurfaceIndex.T, 6);
            this.putIntoPositions(SurfaceIndex.I_TR, 7);
            this.putIntoPositions(SurfaceIndex.I_TL, 8);
            this.putIntoPositions(SurfaceIndex.M4, 9);
            this.putIntoPositions(SurfaceIndex.M5, 10);
            this.putIntoPositions(SurfaceIndex.M6, 11);
            this.putIntoPositions(SurfaceIndex.BL, 12);
            this.putIntoPositions(SurfaceIndex.BR, 13);
            this.putIntoPositions(SurfaceIndex.R, 14);
            this.putIntoPositions(SurfaceIndex.I_BR, 15);
            this.putIntoPositions(SurfaceIndex.I_BL, 16);
            this.putIntoPositions(SurfaceIndex.M7, 17);
            this.putIntoPositions(SurfaceIndex.M8, 18);
            this.putIntoPositions(SurfaceIndex.M9, 19);
            this.putIntoPositions(SurfaceIndex.B, 20);
            this.putIntoPositions(SurfaceIndex.L, 21);
        }
        ;
        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isMiddlePosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == this.positions[SurfaceIndex.M1]
                || reducedIndex == this.positions[SurfaceIndex.M2]
                || reducedIndex == this.positions[SurfaceIndex.M3]
                || reducedIndex == this.positions[SurfaceIndex.M4]
                || reducedIndex == this.positions[SurfaceIndex.M5]
                || reducedIndex == this.positions[SurfaceIndex.M6]
                || reducedIndex == this.positions[SurfaceIndex.M7]
                || reducedIndex == this.positions[SurfaceIndex.M8]
                || reducedIndex == this.positions[SurfaceIndex.M9];
        };
        // poziční klíče
        SurfaceIndex.M1 = "M1";
        SurfaceIndex.M2 = "M2";
        SurfaceIndex.M3 = "M3";
        SurfaceIndex.M4 = "M4";
        SurfaceIndex.M5 = "M5";
        SurfaceIndex.M6 = "M6";
        SurfaceIndex.M7 = "M7";
        SurfaceIndex.M8 = "M8";
        SurfaceIndex.M9 = "M9";
        SurfaceIndex.TL = "TL";
        SurfaceIndex.TR = "TR";
        SurfaceIndex.T = "T";
        SurfaceIndex.I_TR = "I_TR";
        SurfaceIndex.I_TL = "I_TL";
        SurfaceIndex.BL = "BL";
        SurfaceIndex.BR = "BR";
        SurfaceIndex.R = "R";
        SurfaceIndex.I_BR = "I_BR";
        SurfaceIndex.I_BL = "I_BL";
        SurfaceIndex.B = "B";
        SurfaceIndex.L = "L";
        return SurfaceIndex;
    }(AbstractIndex));
    Lich.SurfaceIndex = SurfaceIndex;
})(Lich || (Lich = {}));
