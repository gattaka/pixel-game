namespace Lich {

    export class SurfaceBgrIndex {

        // počet pozic a typů
        private positionsCount = 0;
        private typesCount = 0;

        constructor() {
            // spočítej pozice
            for (let pos in SurfacePositionKey) {
                let key = SurfacePositionKey[pos];
                if (typeof key == "number") {
                    this.positionsCount++;
                }
            }
            // spočítej povrchy
            for (let pos in SurfaceBgrKey) {
                let key = SurfaceBgrKey[pos];
                if (typeof key == "number") {
                    this.typesCount++;
                }
            }
        };

        isTransitionSrfc(index: number): boolean {
            let key: SurfaceBgrKey = this.getType(index);
            if (Resources.getInstance().mapTransitionSrfcBgrsDefs[SurfaceBgrKey[key]])
                return true;
            return false;
        }

        /**
         * Získá výchozí prostřední dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        getMiddlePositionIndexByCoordPattern(x: number, y: number, type: SurfaceBgrKey): SurfacePositionKey {
            let col = (x + 1) % SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite 
            let row = (y + 1) % SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite 
            let key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        }

        /**
         * Získá výchozí horní dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        getTopPositionIndexByCoordPattern(x: number, y: number, type: SurfaceBgrKey): SurfacePositionKey {
            let key = (x + 1) % SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        }

        getTopPositionIndexByCoordPatternOnTransition(x: number, y: number, type: SurfaceBgrKey) {
            let transitionType = Resources.getInstance().getTransitionSurfaceBgr(type);
            return this.getTopPositionIndexByCoordPattern(x, y, transitionType);
        }

        /**
         * Získá výchozí levý dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        getLeftPositionIndexByCoordPattern(x: number, y: number, type: SurfaceBgrKey): SurfacePositionKey {
            let col = 1; // +1 za VOID
            let row = (y + 1) % SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite
            let key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        }

        getLeftPositionIndexByCoordPatternOnTransition(x: number, y: number, type: SurfaceBgrKey) {
            let transitionType = Resources.getInstance().getTransitionSurfaceBgr(type);
            return this.getLeftPositionIndexByCoordPattern(x, y, transitionType);
        }

        /**
         * Získá výchozí pravý dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        getRightPositionIndexByCoordPattern(x: number, y: number, type: SurfaceBgrKey): SurfacePositionKey {
            let col = 1 + SurfaceIndex.PATTER_LENGTH + 1; // +1 za VOID, PATTER_LENGTH + 1 za předcházející dílky ve sprite
            let row = (y + 1) % SurfaceIndex.PATTER_LENGTH + 1; // +1 za předcházející dílky ve sprite
            let key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        }

        getRightPositionIndexByCoordPatternOnTransition(x: number, y: number, type: SurfaceBgrKey) {
            let transitionType = Resources.getInstance().getTransitionSurfaceBgr(type);
            return this.getRightPositionIndexByCoordPattern(x, y, transitionType);
        }

        /**
         * Získá výchozí spodní dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        getBottomPositionIndexByCoordPattern(x: number, y: number, type: SurfaceBgrKey): SurfacePositionKey {
            let col = (x + 1) % SurfaceIndex.PATTER_LENGTH + 2; // +1 za VOID a +1 za předcházející dílky ve sprite
            let row = SurfaceIndex.PATTER_LENGTH + 1; // PATTER_LENGTH + 1 za předcházející dílky ve sprite
            let key = col + row * SurfaceIndex.SPRITE_SIDE;
            return this.getPositionIndex(type, SurfacePositionKey[SurfacePositionKey[key]]);
        }

        getBottomPositionIndexByCoordPatternOnTransition(x: number, y: number, type: SurfaceBgrKey) {
            let transitionType = Resources.getInstance().getTransitionSurfaceBgr(type);
            return this.getBottomPositionIndexByCoordPattern(x, y, transitionType);
        }

        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        getType(sampleIndex: number): SurfaceBgrKey {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.positionsCount);
            return typ;
        }

        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        getPositionIndex(key: SurfaceBgrKey, positionKey: SurfacePositionKey): number {
            return key * this.positionsCount + positionKey;
        }

        /**
         * Změní na povrch, ale zachová pozici 
         */
        changeType(index: number, key: SurfaceBgrKey): number {
            var pos = this.getPosition(index);
            return key * this.positionsCount + pos;
        }

        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu 
         */
        private isPosition(index: number, positionKey: SurfacePositionKey) {
            return this.getPosition(index) == positionKey;
        }

        getPosition(index: number): number {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.positionsCount + 1;
        }

        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu 
         */
        isMiddlePosition(index: number) {
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
        }

        /**
         * Zjistí, zda index je horní instancí nějakého typu povrchu 
         */
        isTopPosition(index: number) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.T1
                || reducedIndex == SurfacePositionKey.T2
                || reducedIndex == SurfacePositionKey.T3
                || reducedIndex == SurfacePositionKey.T4;
        }

        /**
         * Zjistí, zda index je levou instancí nějakého typu povrchu 
         */
        isLeftPosition(index: number) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.L1
                || reducedIndex == SurfacePositionKey.L2
                || reducedIndex == SurfacePositionKey.L3
                || reducedIndex == SurfacePositionKey.L4;
        }

        /**
         * Zjistí, zda index je pravou instancí nějakého typu povrchu 
         */
        isRightPosition(index: number) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.R1
                || reducedIndex == SurfacePositionKey.R2
                || reducedIndex == SurfacePositionKey.R3
                || reducedIndex == SurfacePositionKey.R4;
        }

        /**
         * Zjistí, zda index je spodní instancí nějakého typu povrchu 
         */
        isBottomPosition(index: number) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfacePositionKey.B1
                || reducedIndex == SurfacePositionKey.B2
                || reducedIndex == SurfacePositionKey.B3
                || reducedIndex == SurfacePositionKey.B4;
        }

        getTypeName(index: number): string {
            return SurfaceBgrKey[this.getType(index)];
        }

        getPositionName(index: number): string {
            var reducedIndex = this.getPosition(index);
            return SurfacePositionKey[reducedIndex];
        }

        /**
         * Zjistí, zda index je horní levou instancí nějakého typu povrchu 
         */
        isTopLeftPosition(index: number) {
            return this.getPosition(index) == SurfacePositionKey.TL;
        }

        /**
         * Zjistí, zda index je horní pravou instancí nějakého typu povrchu 
         */
        isTopRightPosition(index: number) {
            return this.getPosition(index) == SurfacePositionKey.TR;
        }

        /**
         * Zjistí, zda index je spodní levou instancí nějakého typu povrchu 
         */
        isBottomLeftPosition(index: number) {
            return this.getPosition(index) == SurfacePositionKey.BL;
        }

        /**
         * Zjistí, zda index je spodní pravou instancí nějakého typu povrchu 
         */
        isBottomRightPosition(index: number) {
            return this.getPosition(index) == SurfacePositionKey.BR;
        }

        /**
         * Zjistí, zda typ povrchu z indexu a aktuální typ povrchu mají mezi sebou přechod bez hran
         */
        isSeamless(type2: SurfaceBgrKey, type: SurfaceBgrKey) {
            if (type == type2) return true;
            let seamCheck = (type: SurfaceBgrKey, type2: SurfaceBgrKey, ok1: SurfaceBgrKey, ok2: SurfaceBgrKey) => {
                return type2 == ok1 && type == ok2 || type == ok1 && type2 == ok2
            };
            // TODO exportovat do definic
            if (seamCheck(type, type2, SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY, SurfaceBgrKey.SRFC_BGR_WOODWALL_WINDOW_KEY)) return true;
            return false;
        }

    }
}