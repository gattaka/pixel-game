namespace Lich {

    export abstract class AbstractIndex {

        // void
        static VOID = 0;

        // počet evidovaných typů
        protected size = 0;
        // index 
        protected types = {};
        protected reversedTypes = new Array<string>();

        // počet pozic
        protected optionsCount = 0;
        // Klíčovaná mapa s čísli pozic v každém surface sprite
        protected positions = {};

        // automaticky je spočítá
        protected putIntoPositions(positionKey: string, position: number) {
            this.positions[positionKey] = position;
            this.optionsCount++;
        };

        insert(key: string) {
            this.types[key] = this.size;
            this.size = this.reversedTypes.push(key);
        }

        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        getType(sampleIndex: number): string {
            // -1 za VOID, který je na 0. pozici
            var typ = Math.floor((sampleIndex - 1) / this.optionsCount);
            return this.reversedTypes[typ];
        }

        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        getPositionIndex(key: string, positionKey: string): number {
            return this.types[key] * this.optionsCount + this.positions[positionKey];
        }

        /**
         * Změní na povrch, ale zachová pozici 
         */
        changeType(index: number, key: string): number {
            var pos = this.getPosition(index);
            return this.types[key] * this.optionsCount + pos;
        }

        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu 
         */
        isPosition(index: number, positionKey: string) {
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

    export class SurfaceBgrIndex extends AbstractIndex {

        // poziční klíče
        static M1 = "M1";
        static M2 = "M2";
        static M3 = "M3";
        static M4 = "M4";
        static M5 = "M5";
        static M6 = "M6";
        static M7 = "M7";
        static M8 = "M8";
        static M9 = "M9";

        constructor() {
            super();

            // přidej pozice
            this.putIntoPositions(SurfaceBgrIndex.M1, 1);
            this.putIntoPositions(SurfaceBgrIndex.M2, 2);
            this.putIntoPositions(SurfaceBgrIndex.M3, 3);
            this.putIntoPositions(SurfaceBgrIndex.M4, 4);
            this.putIntoPositions(SurfaceBgrIndex.M5, 5);
            this.putIntoPositions(SurfaceBgrIndex.M6, 6);
            this.putIntoPositions(SurfaceBgrIndex.M7, 7);
            this.putIntoPositions(SurfaceBgrIndex.M8, 8);
            this.putIntoPositions(SurfaceBgrIndex.M9, 9);

        };

    }

    export class SurfaceIndex extends AbstractIndex {

        // poziční klíče
        static M1 = "M1";
        static M2 = "M2";
        static M3 = "M3";
        static M4 = "M4";
        static M5 = "M5";
        static M6 = "M6";
        static M7 = "M7";
        static M8 = "M8";
        static M9 = "M9";
        static TL = "TL";
        static TR = "TR";
        static T = "T";
        static I_TR = "I_TR";
        static I_TL = "I_TL";
        static BL = "BL";
        static BR = "BR";
        static R = "R";
        static I_BR = "I_BR";
        static I_BL = "I_BL";
        static B = "B";
        static L = "L";

        constructor() {
            super();

            // přidej pozice
            this.putIntoPositions(SurfaceIndex.M1, 1);
            this.putIntoPositions(SurfaceIndex.M2, 2);
            this.putIntoPositions(SurfaceIndex.M3, 3);
            this.putIntoPositions(SurfaceIndex.TL, 4);
            this.putIntoPositions(SurfaceIndex.TR, 5);
            this.putIntoPositions(SurfaceIndex.T, 6);
            this.putIntoPositions(SurfaceIndex.I_TR, 7);
            this.putIntoPositions(SurfaceIndex.I_TL, 8);
            this.putIntoPositions(SurfaceIndex.M4, 9);
            this.putIntoPositions(SurfaceIndex.M5, 10);
            this.putIntoPositions(SurfaceIndex.M6, 11);
            this.putIntoPositions(SurfaceIndex.BL, 12);
            this.putIntoPositions(SurfaceIndex.BR, 13);
            this.putIntoPositions(SurfaceIndex.R, 14);
            this.putIntoPositions(SurfaceIndex.I_BR, 15);
            this.putIntoPositions(SurfaceIndex.I_BL, 16);
            this.putIntoPositions(SurfaceIndex.M7, 17);
            this.putIntoPositions(SurfaceIndex.M8, 18);
            this.putIntoPositions(SurfaceIndex.M9, 19);
            this.putIntoPositions(SurfaceIndex.B, 20);
            this.putIntoPositions(SurfaceIndex.L, 21);

        };

        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu 
         */
        isMiddlePosition(index: number) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == this.positions[SurfaceIndex.M1]
                || reducedIndex == this.positions[SurfaceIndex.M2]
                || reducedIndex == this.positions[SurfaceIndex.M3]
                || reducedIndex == this.positions[SurfaceIndex.M4]
                || reducedIndex == this.positions[SurfaceIndex.M5]
                || reducedIndex == this.positions[SurfaceIndex.M6]
                || reducedIndex == this.positions[SurfaceIndex.M7]
                || reducedIndex == this.positions[SurfaceIndex.M8]
                || reducedIndex == this.positions[SurfaceIndex.M9];
        }
    }
}