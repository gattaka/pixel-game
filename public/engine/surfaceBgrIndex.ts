namespace Lich {

    export enum SurfaceBgrPositionKey {
        VOID = 0,
        M1 = 1,
        M2 = 2,
        M3 = 3,
        M4 = 4,
        M5 = 5,
        M6 = 6,
        M7 = 7,
        M8 = 8,
        M9 = 9
    }

    export class SurfaceBgrIndex {

        static SPRITE_SIDE = 3;

        // počet pozic a typů
        protected typesCount = 0;
        protected positionsCount = 0;

        constructor() {
            // spočítej pozice
            for (let pos in SurfaceBgrPositionKey) {
                let key = SurfaceBgrPositionKey[pos];
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


        /**
         * Získá výchozí prostřední dílek dle vzoru, 
         * který se opakuje, aby mapa byla pestřejší
         */
        getSurfaceBgrPositionByCoordPattern(x: number, y: number): SurfaceBgrPositionKey {
            let col = x % 3 + 1; // +1 za VOID
            let row = y % 3;
            let key = col + row * SurfaceBgrIndex.SPRITE_SIDE;
            return SurfaceBgrPositionKey[SurfaceBgrPositionKey[key]];
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
        getPositionIndex(key: SurfaceBgrKey, positionKey: SurfaceBgrPositionKey): number {
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
        isPosition(index: number, positionKey: SurfaceBgrPositionKey) {
            return this.getPosition(index) == positionKey;
        }

        getPosition(index: number): number {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.positionsCount + 1;
        }
    }

}