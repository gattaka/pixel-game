var Lich;
(function (Lich) {
    var SurfaceIndex = (function () {
        function SurfaceIndex() {
            // počet evidovaných typů povrchů
            this.size = 0;
            // index 
            this.surfaceTypes = {};
            this.reversedSurfaceTypes = new Array();
        }
        SurfaceIndex.prototype.insert = function (key) {
            this.surfaceTypes[key] = this.size;
            this.size = this.reversedSurfaceTypes.push(key);
        };
        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        SurfaceIndex.prototype.getSurfaceType = function (sampleIndex) {
            // -1 za VOID, který je na 0. pozici
            var surfaceType = Math.floor((sampleIndex - 1) / SurfaceIndex.OPTIONS_COUNT);
            return this.reversedSurfaceTypes[surfaceType];
        };
        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        SurfaceIndex.prototype.getPositionIndex = function (key, positionKey) {
            return this.surfaceTypes[key] * SurfaceIndex.OPTIONS_COUNT + SurfaceIndex.positions[positionKey];
        };
        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu
         */
        SurfaceIndex.prototype.isPosition = function (index, positionKey) {
            return this.reduceIndex(index) == SurfaceIndex.positions[positionKey];
        };
        SurfaceIndex.prototype.reduceIndex = function (index) {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % SurfaceIndex.OPTIONS_COUNT + 1;
        };
        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isMiddlePosition = function (index) {
            var reducedIndex = this.reduceIndex(index);
            return reducedIndex == SurfaceIndex.positions[SurfaceIndex.M1]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M2]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M3]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M4]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M5]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M6]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M7]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M8]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M9];
        };
        // void
        SurfaceIndex.VOID = 0;
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
        // počet pozic
        SurfaceIndex.OPTIONS_COUNT = 0;
        // Klíčovaná mapa s čísli pozic v každém surface sprite
        SurfaceIndex.positions = {};
        SurfaceIndex._constructor = (function () {
            // automaticky je spočítá
            var putIntoPositions = function (positionKey, position) {
                SurfaceIndex.positions[positionKey] = position;
                SurfaceIndex.OPTIONS_COUNT++;
            };
            // přidej pozice
            putIntoPositions(SurfaceIndex.M1, 1);
            putIntoPositions(SurfaceIndex.M2, 2);
            putIntoPositions(SurfaceIndex.M3, 3);
            putIntoPositions(SurfaceIndex.TL, 4);
            putIntoPositions(SurfaceIndex.TR, 5);
            putIntoPositions(SurfaceIndex.T, 6);
            putIntoPositions(SurfaceIndex.I_TR, 7);
            putIntoPositions(SurfaceIndex.I_TL, 8);
            putIntoPositions("RESERVED_9", 9);
            putIntoPositions(SurfaceIndex.M4, 10);
            putIntoPositions(SurfaceIndex.M5, 11);
            putIntoPositions(SurfaceIndex.M6, 12);
            putIntoPositions(SurfaceIndex.BL, 13);
            putIntoPositions(SurfaceIndex.BR, 14);
            putIntoPositions(SurfaceIndex.R, 15);
            putIntoPositions(SurfaceIndex.I_BR, 16);
            putIntoPositions(SurfaceIndex.I_BL, 17);
            putIntoPositions("RESERVED_18", 18);
            putIntoPositions(SurfaceIndex.M7, 19);
            putIntoPositions(SurfaceIndex.M8, 20);
            putIntoPositions(SurfaceIndex.M9, 21);
            putIntoPositions(SurfaceIndex.B, 22);
            putIntoPositions(SurfaceIndex.L, 23);
        })();
        return SurfaceIndex;
    }());
    Lich.SurfaceIndex = SurfaceIndex;
})(Lich || (Lich = {}));
