var Lich;
(function (Lich) {
    (function (SurfacePositionKey) {
        SurfacePositionKey[SurfacePositionKey["VOID"] = 0] = "VOID";
        SurfacePositionKey[SurfacePositionKey["M1"] = 1] = "M1";
        SurfacePositionKey[SurfacePositionKey["M2"] = 2] = "M2";
        SurfacePositionKey[SurfacePositionKey["M3"] = 3] = "M3";
        SurfacePositionKey[SurfacePositionKey["TL"] = 4] = "TL";
        SurfacePositionKey[SurfacePositionKey["TR"] = 5] = "TR";
        SurfacePositionKey[SurfacePositionKey["T"] = 6] = "T";
        SurfacePositionKey[SurfacePositionKey["I_TR"] = 7] = "I_TR";
        SurfacePositionKey[SurfacePositionKey["I_TL"] = 8] = "I_TL";
        SurfacePositionKey[SurfacePositionKey["M4"] = 9] = "M4";
        SurfacePositionKey[SurfacePositionKey["M5"] = 10] = "M5";
        SurfacePositionKey[SurfacePositionKey["M6"] = 11] = "M6";
        SurfacePositionKey[SurfacePositionKey["BL"] = 12] = "BL";
        SurfacePositionKey[SurfacePositionKey["BR"] = 13] = "BR";
        SurfacePositionKey[SurfacePositionKey["R"] = 14] = "R";
        SurfacePositionKey[SurfacePositionKey["I_BR"] = 15] = "I_BR";
        SurfacePositionKey[SurfacePositionKey["I_BL"] = 16] = "I_BL";
        SurfacePositionKey[SurfacePositionKey["M7"] = 17] = "M7";
        SurfacePositionKey[SurfacePositionKey["M8"] = 18] = "M8";
        SurfacePositionKey[SurfacePositionKey["M9"] = 19] = "M9";
        SurfacePositionKey[SurfacePositionKey["B"] = 20] = "B";
        SurfacePositionKey[SurfacePositionKey["L"] = 21] = "L";
    })(Lich.SurfacePositionKey || (Lich.SurfacePositionKey = {}));
    var SurfacePositionKey = Lich.SurfacePositionKey;
    var SurfaceIndex = (function () {
        function SurfaceIndex() {
            // počet evidovaných typů
            this.size = 0;
            // index 
            this.types = {};
            this.reversedTypes = new Array();
            // počet pozic
            this.optionsCount = 0;
            // Klíčovaná mapa s čísli pozic v každém surface sprite
            this.positions = {};
            // přidej pozice
            for (var pos in SurfacePositionKey) {
                var key = SurfacePositionKey[pos];
                if (typeof key == "number") {
                    var num = key;
                    this.putIntoPositions(SurfacePositionKey[SurfacePositionKey[num]], num);
                }
            }
        }
        ;
        // automaticky je spočítá
        SurfaceIndex.prototype.putIntoPositions = function (positionKey, position) {
            this.positions[positionKey] = position;
            this.optionsCount++;
        };
        ;
        SurfaceIndex.prototype.insert = function (key) {
            this.types[key] = this.size;
            this.size = this.reversedTypes.push(key);
        };
        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        SurfaceIndex.prototype.getType = function (sampleIndex) {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.optionsCount);
            return this.reversedTypes[typ];
        };
        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        SurfaceIndex.prototype.getPositionIndex = function (key, positionKey) {
            return this.types[key] * this.optionsCount + this.positions[positionKey];
        };
        /**
         * Změní na povrch, ale zachová pozici
         */
        SurfaceIndex.prototype.changeType = function (index, key) {
            var pos = this.getPosition(index);
            return this.types[key] * this.optionsCount + pos;
        };
        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu
         */
        SurfaceIndex.prototype.isPosition = function (index, positionKey) {
            return this.getPosition(index) == this.positions[positionKey];
        };
        SurfaceIndex.prototype.getPosition = function (index) {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.optionsCount + 1;
        };
        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isMiddlePosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == this.positions[SurfacePositionKey.M1]
                || reducedIndex == this.positions[SurfacePositionKey.M2]
                || reducedIndex == this.positions[SurfacePositionKey.M3]
                || reducedIndex == this.positions[SurfacePositionKey.M4]
                || reducedIndex == this.positions[SurfacePositionKey.M5]
                || reducedIndex == this.positions[SurfacePositionKey.M6]
                || reducedIndex == this.positions[SurfacePositionKey.M7]
                || reducedIndex == this.positions[SurfacePositionKey.M8]
                || reducedIndex == this.positions[SurfacePositionKey.M9];
        };
        return SurfaceIndex;
    }());
    Lich.SurfaceIndex = SurfaceIndex;
})(Lich || (Lich = {}));
