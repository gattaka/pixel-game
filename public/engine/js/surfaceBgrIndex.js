var Lich;
(function (Lich) {
    var SurfaceBgrIndex = (function () {
        function SurfaceBgrIndex() {
            // počet pozic a typů
            this.positionsCount = 0;
            this.typesCount = 0;
            // spočítej pozice
            for (var pos in Lich.SurfacePositionKey) {
                var key = Lich.SurfacePositionKey[pos];
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
         * Získá výchozí prostřední dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceBgrIndex.prototype.getMiddlePositionIndexByCoordPattern = function (x, y, type) {
            var col = (x + 1) % Lich.SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite 
            var row = (y + 1) % Lich.SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite 
            var key = col + row * Lich.SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, Lich.SurfacePositionKey[Lich.SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí horní dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceBgrIndex.prototype.getTopPositionIndexByCoordPattern = function (x, y, type) {
            var key = (x + 1) % Lich.SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            return this.getPositionIndex(type, Lich.SurfacePositionKey[Lich.SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí levý dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceBgrIndex.prototype.getLeftPositionIndexByCoordPattern = function (x, y, type) {
            var col = 1; // +1 za VOID
            var row = (y + 1) % Lich.SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite
            var key = col + row * Lich.SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, Lich.SurfacePositionKey[Lich.SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí pravý dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceBgrIndex.prototype.getRightPositionIndexByCoordPattern = function (x, y, type) {
            var col = 1 + Lich.SurfaceIndex.PATTER_LENGTH + 1; // +1 za VOID, PATTER_LENGTH + 1 za předcházející dílky ve sprite
            var row = (y + 1) % Lich.SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite
            var key = col + row * Lich.SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, Lich.SurfacePositionKey[Lich.SurfacePositionKey[key]]);
        };
        /**
         * Získá výchozí spodní dílek dle vzoru,
         * který se opakuje, aby mapa byla pestřejší
         */
        SurfaceBgrIndex.prototype.getBottomPositionIndexByCoordPattern = function (x, y, type) {
            var col = (x + 1) % Lich.SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            var row = Lich.SurfaceIndex.PATTER_LENGTH + 1; // PATTER_LENGTH + 1 za předcházející dílky ve sprite
            var key = col + row * Lich.SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, Lich.SurfacePositionKey[Lich.SurfacePositionKey[key]]);
        };
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
        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isMiddlePosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == Lich.SurfacePositionKey.M0
                || reducedIndex == Lich.SurfacePositionKey.M1
                || reducedIndex == Lich.SurfacePositionKey.M2
                || reducedIndex == Lich.SurfacePositionKey.M3
                || reducedIndex == Lich.SurfacePositionKey.M4
                || reducedIndex == Lich.SurfacePositionKey.M5
                || reducedIndex == Lich.SurfacePositionKey.M6
                || reducedIndex == Lich.SurfacePositionKey.M7
                || reducedIndex == Lich.SurfacePositionKey.M8
                || reducedIndex == Lich.SurfacePositionKey.M9
                || reducedIndex == Lich.SurfacePositionKey.MA
                || reducedIndex == Lich.SurfacePositionKey.MB
                || reducedIndex == Lich.SurfacePositionKey.MC
                || reducedIndex == Lich.SurfacePositionKey.MD
                || reducedIndex == Lich.SurfacePositionKey.ME
                || reducedIndex == Lich.SurfacePositionKey.MF;
        };
        /**
         * Zjistí, zda index je horní instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isTopPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == Lich.SurfacePositionKey.T1
                || reducedIndex == Lich.SurfacePositionKey.T2
                || reducedIndex == Lich.SurfacePositionKey.T3
                || reducedIndex == Lich.SurfacePositionKey.T4;
        };
        /**
         * Zjistí, zda index je levou instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isLeftPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == Lich.SurfacePositionKey.L1
                || reducedIndex == Lich.SurfacePositionKey.L2
                || reducedIndex == Lich.SurfacePositionKey.L3
                || reducedIndex == Lich.SurfacePositionKey.L4;
        };
        /**
         * Zjistí, zda index je pravou instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isRightPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == Lich.SurfacePositionKey.R1
                || reducedIndex == Lich.SurfacePositionKey.R2
                || reducedIndex == Lich.SurfacePositionKey.R3
                || reducedIndex == Lich.SurfacePositionKey.R4;
        };
        /**
         * Zjistí, zda index je spodní instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isBottomPosition = function (index) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == Lich.SurfacePositionKey.B1
                || reducedIndex == Lich.SurfacePositionKey.B2
                || reducedIndex == Lich.SurfacePositionKey.B3
                || reducedIndex == Lich.SurfacePositionKey.B4;
        };
        /**
         * Zjistí, zda index je horní levou instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isTopLeftPosition = function (index) {
            return this.getPosition(index) == Lich.SurfacePositionKey.TL;
        };
        /**
         * Zjistí, zda index je horní pravou instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isTopRightPosition = function (index) {
            return this.getPosition(index) == Lich.SurfacePositionKey.TR;
        };
        /**
         * Zjistí, zda index je spodní levou instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isBottomLeftPosition = function (index) {
            return this.getPosition(index) == Lich.SurfacePositionKey.BL;
        };
        /**
         * Zjistí, zda index je spodní pravou instancí nějakého typu povrchu
         */
        SurfaceBgrIndex.prototype.isBottomRightPosition = function (index) {
            return this.getPosition(index) == Lich.SurfacePositionKey.BR;
        };
        /**
         * Zjistí, zda typ povrchu z indexu a aktuální typ povrchu mají mezi sebou přechod bez hran
         */
        SurfaceBgrIndex.prototype.isSeamless = function (type2, type) {
            if (type == type2)
                return true;
            var seamCheck = function (type, type2, ok1, ok2) {
                return type2 == ok1 && type == ok2 || type == ok1 && type2 == ok2;
            };
            // TODO exportovat do definic
            if (seamCheck(type, type2, Lich.SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY, Lich.SurfaceBgrKey.SRFC_BGR_WOODWALL_WINDOW_KEY))
                return true;
            return false;
        };
        return SurfaceBgrIndex;
    }());
    Lich.SurfaceBgrIndex = SurfaceBgrIndex;
})(Lich || (Lich = {}));
