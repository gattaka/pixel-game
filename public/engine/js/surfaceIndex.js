var Lich;
(function (Lich) {
    (function (SurfacePositionKey) {
        SurfacePositionKey[SurfacePositionKey["VOID"] = 0] = "VOID";
        SurfacePositionKey[SurfacePositionKey["TL"] = 1] = "TL";
        SurfacePositionKey[SurfacePositionKey["T1"] = 2] = "T1";
        SurfacePositionKey[SurfacePositionKey["T2"] = 3] = "T2";
        SurfacePositionKey[SurfacePositionKey["T3"] = 4] = "T3";
        SurfacePositionKey[SurfacePositionKey["T4"] = 5] = "T4";
        SurfacePositionKey[SurfacePositionKey["TR"] = 6] = "TR";
        SurfacePositionKey[SurfacePositionKey["I_TR"] = 7] = "I_TR";
        SurfacePositionKey[SurfacePositionKey["L1"] = 8] = "L1";
        SurfacePositionKey[SurfacePositionKey["M0"] = 9] = "M0";
        SurfacePositionKey[SurfacePositionKey["M1"] = 10] = "M1";
        SurfacePositionKey[SurfacePositionKey["M2"] = 11] = "M2";
        SurfacePositionKey[SurfacePositionKey["M3"] = 12] = "M3";
        SurfacePositionKey[SurfacePositionKey["R1"] = 13] = "R1";
        SurfacePositionKey[SurfacePositionKey["I_BR"] = 14] = "I_BR";
        SurfacePositionKey[SurfacePositionKey["L2"] = 15] = "L2";
        SurfacePositionKey[SurfacePositionKey["M4"] = 16] = "M4";
        SurfacePositionKey[SurfacePositionKey["M5"] = 17] = "M5";
        SurfacePositionKey[SurfacePositionKey["M6"] = 18] = "M6";
        SurfacePositionKey[SurfacePositionKey["M7"] = 19] = "M7";
        SurfacePositionKey[SurfacePositionKey["R2"] = 20] = "R2";
        SurfacePositionKey[SurfacePositionKey["I_TL"] = 21] = "I_TL";
        SurfacePositionKey[SurfacePositionKey["L3"] = 22] = "L3";
        SurfacePositionKey[SurfacePositionKey["M8"] = 23] = "M8";
        SurfacePositionKey[SurfacePositionKey["M9"] = 24] = "M9";
        SurfacePositionKey[SurfacePositionKey["MA"] = 25] = "MA";
        SurfacePositionKey[SurfacePositionKey["MB"] = 26] = "MB";
        SurfacePositionKey[SurfacePositionKey["R3"] = 27] = "R3";
        SurfacePositionKey[SurfacePositionKey["I_BL"] = 28] = "I_BL";
        SurfacePositionKey[SurfacePositionKey["L4"] = 29] = "L4";
        SurfacePositionKey[SurfacePositionKey["MC"] = 30] = "MC";
        SurfacePositionKey[SurfacePositionKey["MD"] = 31] = "MD";
        SurfacePositionKey[SurfacePositionKey["ME"] = 32] = "ME";
        SurfacePositionKey[SurfacePositionKey["MF"] = 33] = "MF";
        SurfacePositionKey[SurfacePositionKey["R4"] = 34] = "R4";
        SurfacePositionKey[SurfacePositionKey["RESERVED1"] = 35] = "RESERVED1";
        SurfacePositionKey[SurfacePositionKey["BL"] = 36] = "BL";
        SurfacePositionKey[SurfacePositionKey["B1"] = 37] = "B1";
        SurfacePositionKey[SurfacePositionKey["B2"] = 38] = "B2";
        SurfacePositionKey[SurfacePositionKey["B3"] = 39] = "B3";
        SurfacePositionKey[SurfacePositionKey["B4"] = 40] = "B4";
        SurfacePositionKey[SurfacePositionKey["BR"] = 41] = "BR";
        SurfacePositionKey[SurfacePositionKey["RESERVED2"] = 42] = "RESERVED2";
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
            var col = (x + 1) % SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite 
            var row = (y + 1) % SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite 
            var key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí horní dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getTopPositionIndexByCoordPattern = function (x, y, type) {
            var key = (x + 1) % SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí levý dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getLeftPositionIndexByCoordPattern = function (x, y, type) {
            var col = 1; // +1 za VOID
            var row = (y + 1) % SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite
            var key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí pravý dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getRightPositionIndexByCoordPattern = function (x, y, type) {
            var col = 1 + SurfaceIndex.PATTER_LENGTH + 1; // +1 za VOID, PATTER_LENGTH + 1 za předcházející dílky ve sprite
            var row = (y + 1) % SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite
            var key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí spodní dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceIndex.prototype.getBottomPositionIndexByCoordPattern = function (x, y, type) {
            var col = (x + 1) % SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            var row = SurfaceIndex.PATTER_LENGTH + 1; // PATTER_LENGTH + 1 za předcházející dílky ve sprite
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
            return reducedIndex == SurfacePositionKey.M0
                || reducedIndex == SurfacePositionKey.M1
                || reducedIndex == SurfacePositionKey.M2
                || reducedIndex == SurfacePositionKey.M3
                || reducedIndex == SurfacePositionKey.M4
                || reducedIndex == SurfacePositionKey.M5
                || reducedIndex == SurfacePositionKey.M6
                || reducedIndex == SurfacePositionKey.M7
                || reducedIndex == SurfacePositionKey.M8
                || reducedIndex == SurfacePositionKey.M9
                || reducedIndex == SurfacePositionKey.MA
                || reducedIndex == SurfacePositionKey.MB
                || reducedIndex == SurfacePositionKey.MC
                || reducedIndex == SurfacePositionKey.MD
                || reducedIndex == SurfacePositionKey.ME
                || reducedIndex == SurfacePositionKey.MF;
        };
        /**
         * Zjistí, zda index je horní instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isTopPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.T1
                || reducedIndex == SurfacePositionKey.T2
                || reducedIndex == SurfacePositionKey.T3
                || reducedIndex == SurfacePositionKey.T4;
        };
        /**
         * Zjistí, zda index je levou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isLeftPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.L1
                || reducedIndex == SurfacePositionKey.L2
                || reducedIndex == SurfacePositionKey.L3
                || reducedIndex == SurfacePositionKey.L4;
        };
        /**
         * Zjistí, zda index je pravou instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isRightPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.R1
                || reducedIndex == SurfacePositionKey.R2
                || reducedIndex == SurfacePositionKey.R3
                || reducedIndex == SurfacePositionKey.R4;
        };
        /**
         * Zjistí, zda index je spodní instancí nějakého typu povrchu
         */
        SurfaceIndex.prototype.isBottomPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.B1
                || reducedIndex == SurfacePositionKey.B2
                || reducedIndex == SurfacePositionKey.B3
                || reducedIndex == SurfacePositionKey.B4;
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
        /**
         * Zjistí, zda typ povrchu z indexu a aktuální typ povrchu mají mezi sebou přechod bez hran
         */
        SurfaceIndex.prototype.isSeamless = function (index, type) {
            var type2 = this.getType(index);
            var seamCheck = function (type, type2, ok1, ok2) {
                return type2 == ok1 && type == ok2 || type == ok1 && type2 == ok2;
            };
            // TODO exportovat do definic
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_DIRT_KEY, Lich.SurfaceKey.SRFC_BRICK_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_DIRT_KEY, Lich.SurfaceKey.SRFC_WOODWALL_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_DIRT_KEY, Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_ROCK_KEY, Lich.SurfaceKey.SRFC_BRICK_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_ROCK_KEY, Lich.SurfaceKey.SRFC_WOODWALL_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_ROCK_KEY, Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_ROOF_KEY, Lich.SurfaceKey.SRFC_ROOF_TL_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_ROOF_KEY, Lich.SurfaceKey.SRFC_ROOF_TR_KEY))
                return true;
            if (seamCheck(type, type2, Lich.SurfaceKey.SRFC_ROOF_TL_KEY, Lich.SurfaceKey.SRFC_ROOF_TR_KEY))
                return true;
            return type == type2;
        };
        SurfaceIndex.SPRITE_SIDE = 7;
        SurfaceIndex.PATTER_LENGTH = 4;
        return SurfaceIndex;
    }());
    Lich.SurfaceIndex = SurfaceIndex;
})(Lich || (Lich = {}));
