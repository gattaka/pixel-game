var Lich;
(function (Lich) {
    (function (SurfaceBgrPositionKey) {
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["VOID"] = 0] = "VOID";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M1"] = 1] = "M1";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M2"] = 2] = "M2";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M3"] = 3] = "M3";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M4"] = 4] = "M4";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M5"] = 5] = "M5";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M6"] = 6] = "M6";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M7"] = 7] = "M7";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M8"] = 8] = "M8";
        SurfaceBgrPositionKey[SurfaceBgrPositionKey["M9"] = 9] = "M9";
    })(Lich.SurfaceBgrPositionKey || (Lich.SurfaceBgrPositionKey = {}));
    var SurfaceBgrPositionKey = Lich.SurfaceBgrPositionKey;
    var SurfaceBgrIndex = (function () {
        function SurfaceBgrIndex() {
            // počet pozic a typů
            this.typesCount = 0;
            this.positionsCount = 0;
            // spočítej pozice
            for (var pos in SurfaceBgrPositionKey) {
                var key = SurfaceBgrPositionKey[pos];
                if (typeof key == "number") {
                    this.positionsCount++;
                }
            }
            // spočítej povrchy
            for (var pos in Lich.SurfaceBgrKey) {
                var key = Lich.SurfaceBgrKey[pos];
                if (typeof key == "number") {
                    this.typesCount++;
                }
            }
        }
        ;
        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        SurfaceBgrIndex.prototype.getType = function (sampleIndex) {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.positionsCount);
            return typ;
        };
        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        SurfaceBgrIndex.prototype.getPositionIndex = function (key, positionKey) {
            return key * this.positionsCount + positionKey;
        };
        /**
         * Změní na povrch, ale zachová pozici
         */
        SurfaceBgrIndex.prototype.changeType = function (index, key) {
            var pos = this.getPosition(index);
            return key * this.positionsCount + pos;
        };
        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isPosition = function (index, positionKey) {
            return this.getPosition(index) == positionKey;
        };
        SurfaceBgrIndex.prototype.getPosition = function (index) {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.positionsCount + 1;
        };
        return SurfaceBgrIndex;
    }());
    Lich.SurfaceBgrIndex = SurfaceBgrIndex;
})(Lich || (Lich = {}));
