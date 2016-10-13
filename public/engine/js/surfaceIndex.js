var Lich;
(function (Lich) {
    (function (SurfacePositionKey) {
        SurfacePositionKey[SurfacePositionKey["VOID"] = 0] = "VOID";
        SurfacePositionKey[SurfacePositionKey["TL"] = 1] = "TL";
        SurfacePositionKey[SurfacePositionKey["T1"] = 2] = "T1";
        SurfacePositionKey[SurfacePositionKey["T2"] = 3] = "T2";
        SurfacePositionKey[SurfacePositionKey["T3"] = 4] = "T3";
        SurfacePositionKey[SurfacePositionKey["TR"] = 5] = "TR";
        SurfacePositionKey[SurfacePositionKey["I_TR"] = 6] = "I_TR";
        SurfacePositionKey[SurfacePositionKey["L1"] = 7] = "L1";
        SurfacePositionKey[SurfacePositionKey["M1"] = 8] = "M1";
        SurfacePositionKey[SurfacePositionKey["M2"] = 9] = "M2";
        SurfacePositionKey[SurfacePositionKey["M3"] = 10] = "M3";
        SurfacePositionKey[SurfacePositionKey["R1"] = 11] = "R1";
        SurfacePositionKey[SurfacePositionKey["I_BR"] = 12] = "I_BR";
        SurfacePositionKey[SurfacePositionKey["L2"] = 13] = "L2";
        SurfacePositionKey[SurfacePositionKey["M4"] = 14] = "M4";
        SurfacePositionKey[SurfacePositionKey["M5"] = 15] = "M5";
        SurfacePositionKey[SurfacePositionKey["M6"] = 16] = "M6";
        SurfacePositionKey[SurfacePositionKey["R2"] = 17] = "R2";
        SurfacePositionKey[SurfacePositionKey["I_TL"] = 18] = "I_TL";
        SurfacePositionKey[SurfacePositionKey["L3"] = 19] = "L3";
        SurfacePositionKey[SurfacePositionKey["M7"] = 20] = "M7";
        SurfacePositionKey[SurfacePositionKey["M8"] = 21] = "M8";
        SurfacePositionKey[SurfacePositionKey["M9"] = 22] = "M9";
        SurfacePositionKey[SurfacePositionKey["R3"] = 23] = "R3";
        SurfacePositionKey[SurfacePositionKey["I_BL"] = 24] = "I_BL";
        SurfacePositionKey[SurfacePositionKey["BL"] = 25] = "BL";
        SurfacePositionKey[SurfacePositionKey["B1"] = 26] = "B1";
        SurfacePositionKey[SurfacePositionKey["B2"] = 27] = "B2";
        SurfacePositionKey[SurfacePositionKey["B3"] = 28] = "B3";
        SurfacePositionKey[SurfacePositionKey["BR"] = 29] = "BR";
    })(Lich.SurfacePositionKey || (Lich.SurfacePositionKey = {}));
    var SurfacePositionKey = Lich.SurfacePositionKey;
    var SurfaceIndex = (function () {
        function SurfaceIndex() {
            // počet pozic a typů
            this.positionsCount = 0;
            this.typesCount = 0;
            // spočítej pozice
            for (var pos in SurfacePositionKey) {
                var key = SurfacePositionKey[pos];
                if (typeof key == "number") {
                    this.positionsCount++;
                }
            }
            // spočítej povrchy
            for (var pos in Lich.SurfaceKey) {
                var key = Lich.SurfaceKey[pos];
                if (typeof key == "number") {
                    this.typesCount++;
                }
            }
        }
        ;
        /**
         * Získá výchozí prostřední dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getMiddlePositionIndexByCoordPattern = function (x, y, type) {
            var col = x % 3 + 2; // +1 za VOID a +1 za předcházející dílky ve sprite 
            var row = y % 3 + 1; // +1 za předcházející dílky ve sprite 
            var key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí horní dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getTopPositionIndexByCoordPattern = function (x, y, type) {
            var key = x % 3 + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí levý dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getLeftPositionIndexByCoordPattern = function (x, y, type) {
            var col = 1; // +1 za VOID
            var row = y % 3 + 1; // +1 za předcházející dílky ve sprite
            var key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí pravý dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getRightPositionIndexByCoordPattern = function (x, y, type) {
            var col = 1 + 4; // +1 za VOID +4 za předcházející dílky ve sprite
            var row = y % 3 + 1; // +1 za předcházející dílky ve sprite
            var key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí spodní dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getBottomPositionIndexByCoordPattern = function (x, y, type) {
            var col = x % 3 + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            var row = 4; // +4 za předcházející dílky ve sprite
            var key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        SurfaceIndex.prototype.getType = function (sampleIndex) {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.positionsCount);
            return typ;
        };
        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        SurfaceIndex.prototype.getPositionIndex = function (key, positionKey) {
            return key * this.positionsCount + positionKey;
        };
        /**
         * Změní na povrch, ale zachová pozici
         */
        SurfaceIndex.prototype.changeType = function (index, key) {
            var pos = this.getPosition(index);
            return key * this.positionsCount + pos;
        };
        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu
         */
        SurfaceIndex.prototype.isPosition = function (index, positionKey) {
            return this.getPosition(index) == positionKey;
        };
        SurfaceIndex.prototype.getPosition = function (index) {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.positionsCount + 1;
        };
        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isMiddlePosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.M1
                || reducedIndex == SurfacePositionKey.M2
                || reducedIndex == SurfacePositionKey.M3
                || reducedIndex == SurfacePositionKey.M4
                || reducedIndex == SurfacePositionKey.M5
                || reducedIndex == SurfacePositionKey.M6
                || reducedIndex == SurfacePositionKey.M7
                || reducedIndex == SurfacePositionKey.M8
                || reducedIndex == SurfacePositionKey.M9;
        };
        /**
         * Zjistí, zda index je horní instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isTopPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.T1
                || reducedIndex == SurfacePositionKey.T2
                || reducedIndex == SurfacePositionKey.T3;
        };
        /**
         * Zjistí, zda index je levou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isLeftPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.L1
                || reducedIndex == SurfacePositionKey.L2
                || reducedIndex == SurfacePositionKey.L3;
        };
        /**
         * Zjistí, zda index je pravou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isRightPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.R1
                || reducedIndex == SurfacePositionKey.R2
                || reducedIndex == SurfacePositionKey.R3;
        };
        /**
         * Zjistí, zda index je spodní instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isBottomPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.B1
                || reducedIndex == SurfacePositionKey.B2
                || reducedIndex == SurfacePositionKey.B3;
        };
        /**
         * Zjistí, zda index je horní levou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isTopLeftPosition = function (index) {
            return this.getPosition(index) == SurfacePositionKey.TL;
        };
        /**
         * Zjistí, zda index je horní pravou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isTopRightPosition = function (index) {
            return this.getPosition(index) == SurfacePositionKey.TR;
        };
        /**
         * Zjistí, zda index je spodní levou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isBottomLeftPosition = function (index) {
            return this.getPosition(index) == SurfacePositionKey.BL;
        };
        /**
         * Zjistí, zda index je spodní pravou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isBottomRightPosition = function (index) {
            return this.getPosition(index) == SurfacePositionKey.BR;
        };
        SurfaceIndex.SPRITE_SIDE = 6;
        return SurfaceIndex;
    }());
    Lich.SurfaceIndex = SurfaceIndex;
})(Lich || (Lich = {}));
