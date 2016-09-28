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
            for (var pos in SurfaceBgrPositionKey) {
                var key = SurfaceBgrPositionKey[pos];
                if (typeof key == "number") {
                    var num = key;
                    this.putIntoPositions(SurfaceBgrPositionKey[SurfaceBgrPositionKey[pos]], num);
                }
            }
        }
        ;
        // automaticky je spočítá
        SurfaceBgrIndex.prototype.putIntoPositions = function (positionKey, position) {
            this.positions[positionKey] = position;
            this.optionsCount++;
        };
        ;
        SurfaceBgrIndex.prototype.insert = function (key) {
            this.types[key] = this.size;
            this.size = this.reversedTypes.push(key);
        };
        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        SurfaceBgrIndex.prototype.getType = function (sampleIndex) {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.optionsCount);
            return this.reversedTypes[typ];
        };
        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        SurfaceBgrIndex.prototype.getPositionIndex = function (key, positionKey) {
            return this.types[key] * this.optionsCount + this.positions[positionKey];
        };
        /**
         * Změní na povrch, ale zachová pozici
         */
        SurfaceBgrIndex.prototype.changeType = function (index, key) {
            var pos = this.getPosition(index);
            return this.types[key] * this.optionsCount + pos;
        };
        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isPosition = function (index, positionKey) {
            return this.getPosition(index) == this.positions[positionKey];
        };
        SurfaceBgrIndex.prototype.getPosition = function (index) {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.optionsCount + 1;
        };
        return SurfaceBgrIndex;
    }());
    Lich.SurfaceBgrIndex = SurfaceBgrIndex;
})(Lich || (Lich = {}));
