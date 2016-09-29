namespace Lich {

    export enum SurfacePositionKey {
        VOID = 0,
        M1 = 1,
        M2 = 2,
        M3 = 3,
        TL = 4,
        TR = 5,
        T = 6,
        I_TR = 7,
        I_TL = 8,
        M4 = 9,
        M5 = 10,
        M6 = 11,
        BL = 12,
        BR = 13,
        R = 14,
        I_BR = 15,
        I_BL = 16,
        M7 = 17,
        M8 = 18,
        M9 = 19,
        B = 20,
        L = 21
    }

    export class SurfaceIndex {

        // počet evidovaných typů
        protected size = 0;
        // index 
        protected types: { [key: number]: number } = {};
        protected reversedTypes = new Array<SurfaceKey>();

        // počet pozic
        protected optionsCount = 0;
        // Klíčovaná mapa s čísli pozic v každém surface sprite
        protected positions: { [key: number]: number } = {};

        constructor() {
            // přidej pozice
            for (let pos in SurfacePositionKey) {
                let key = SurfacePositionKey[pos];
                if (typeof key == "number") {
                    let num: number = key;
                    this.putIntoPositions(SurfacePositionKey[SurfacePositionKey[num]],num);
                }
            }
        };

        // automaticky je spočítá
        protected putIntoPositions(positionKey: SurfacePositionKey, position: number) {
            this.positions[positionKey] = position;
            this.optionsCount++;
        };

        insert(key: SurfaceKey) {
            this.types[key] = this.size;
            this.size = this.reversedTypes.push(key);
        }

        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        getType(sampleIndex: number): SurfaceKey {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.optionsCount);
            return this.reversedTypes[typ];
        }

        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        getPositionIndex(key: SurfaceKey, positionKey: SurfacePositionKey): number {
            return this.types[key] * this.optionsCount + this.positions[positionKey];
        }

        /**
         * Změní na povrch, ale zachová pozici 
         */
        changeType(index: number, key: SurfaceKey): number {
            var pos = this.getPosition(index);
            return this.types[key] * this.optionsCount + pos;
        }

        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu 
         */
        isPosition(index: number, positionKey: SurfacePositionKey) {
            return this.getPosition(index) == this.positions[positionKey];
        }

        getPosition(index: number): number {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.optionsCount + 1;
        }

        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu 
         */
        isMiddlePosition(index: number) {
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
        }
    }
}