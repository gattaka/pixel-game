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

        // počet evidovaných typů
        protected size = 0;
        // index 
        protected types: { [key: string]: number } = {};
        protected reversedTypes = new Array<SurfaceBgrKey>();

        // počet pozic
        protected optionsCount = 0;
        // Klíčovaná mapa s čísli pozic v každém surface sprite
        protected positions: { [key: string]: number } = {};

        constructor() {
            // přidej pozice
            for (let pos in SurfaceBgrPositionKey) {
                let key = SurfaceBgrPositionKey[pos];
                if (typeof key == "number") {
                    let num: number = key;
                    this.putIntoPositions(SurfaceBgrPositionKey[SurfaceBgrPositionKey[pos]], num);
                }
            }
        };

        // automaticky je spočítá
        protected putIntoPositions(positionKey: SurfaceBgrPositionKey, position: number) {
            this.positions[positionKey] = position;
            this.optionsCount++;
        };

        insert(key: SurfaceBgrKey) {
            this.types[key] = this.size;
            this.size = this.reversedTypes.push(key);
        }

        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        getType(sampleIndex: number): SurfaceBgrKey {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.optionsCount);
            return this.reversedTypes[typ];
        }

        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        getPositionIndex(key: SurfaceBgrKey, positionKey: SurfaceBgrPositionKey): number {
            return this.types[key] * this.optionsCount + this.positions[positionKey];
        }

        /**
         * Změní na povrch, ale zachová pozici 
         */
        changeType(index: number, key: SurfaceBgrKey): number {
            var pos = this.getPosition(index);
            return this.types[key] * this.optionsCount + pos;
        }

        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu 
         */
        isPosition(index: number, positionKey: SurfaceBgrPositionKey) {
            return this.getPosition(index) == this.positions[positionKey];
        }

        getPosition(index: number): number {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % this.optionsCount + 1;
        }
    }

}