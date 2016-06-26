namespace Lich {
    export class SurfaceIndex {

        // void
        static VOID = 0;

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

        // počet pozic
        static OPTIONS_COUNT = 0;

        // Klíčovaná mapa s čísli pozic v každém surface sprite
        static positions = {};

        private static _constructor = (() => {

            // automaticky je spočítá
            var putIntoPositions = function(positionKey: string, position: number) {
                SurfaceIndex.positions[positionKey] = position;
                SurfaceIndex.OPTIONS_COUNT++;
            };

            // přidej pozice
            putIntoPositions(SurfaceIndex.M1, 1);
            putIntoPositions(SurfaceIndex.M2, 2);
            putIntoPositions(SurfaceIndex.M3, 3);
            putIntoPositions(SurfaceIndex.TL, 4);
            putIntoPositions(SurfaceIndex.TR, 5);
            putIntoPositions(SurfaceIndex.T, 6);
            putIntoPositions(SurfaceIndex.I_TR, 7);
            putIntoPositions(SurfaceIndex.I_TL, 8);
            putIntoPositions(SurfaceIndex.M4, 9);
            putIntoPositions(SurfaceIndex.M5, 10);
            putIntoPositions(SurfaceIndex.M6, 11);
            putIntoPositions(SurfaceIndex.BL, 12);
            putIntoPositions(SurfaceIndex.BR, 13);
            putIntoPositions(SurfaceIndex.R, 14);
            putIntoPositions(SurfaceIndex.I_BR, 15);
            putIntoPositions(SurfaceIndex.I_BL, 16);
            putIntoPositions(SurfaceIndex.M7, 17);
            putIntoPositions(SurfaceIndex.M8, 18);
            putIntoPositions(SurfaceIndex.M9, 19);
            putIntoPositions(SurfaceIndex.B, 20);
            putIntoPositions(SurfaceIndex.L, 21);

        })();

        // počet evidovaných typů povrchů
        private size = 0;
        // index 
        private surfaceTypes = {};
        private reversedSurfaceTypes = new Array<string>();

        insert(key: string) {
            this.surfaceTypes[key] = this.size;
            this.size = this.reversedSurfaceTypes.push(key);
        }

        /**
         * Ze vzorku zjistí z jakého typu povrchu index je
         */
        getSurfaceType(sampleIndex: number): string {
            // -1 za VOID, který je na 0. pozici
            var surfaceType = Math.floor((sampleIndex - 1) / SurfaceIndex.OPTIONS_COUNT);
            return this.reversedSurfaceTypes[surfaceType];
        }

        /**
         * Spočítá index pro daný typ povrchu a danou pozici
         */
        getPositionIndex(key: string, positionKey: string): number {
            return this.surfaceTypes[key] * SurfaceIndex.OPTIONS_COUNT + SurfaceIndex.positions[positionKey];
        }

        /**
         * Změní na povrch, ale zachová pozici 
         */
        changeSurface(index: number, key: string): number {
            var pos = this.getPosition(index);
            return this.surfaceTypes[key] * SurfaceIndex.OPTIONS_COUNT + pos;
        }

        /**
         * Zjistí, zda index je instancí dané pozice nějakého typu povrchu 
         */
        isPosition(index: number, positionKey: string) {
            return this.getPosition(index) == SurfaceIndex.positions[positionKey];
        }

        getPosition(index: number): number {
            // Kvůli tomu, že VOID zabírá 0. pozici, je potřeba tady pro modulo dočasně posunout škálu
            // 1  ->  0 % 23 ->  0 + 1 ->  1
            // 23 -> 22 % 23 -> 22 + 1 -> 23
            // 24 -> 23 % 23 ->  0 + 1 ->  1
            return (index - 1) % SurfaceIndex.OPTIONS_COUNT + 1;
        }

        /**
         * Zjistí, zda index je nekrajovou instancí nějakého typu povrchu 
         */
        isMiddlePosition(index: number) {
            var reducedIndex = this.getPosition(index);
            return reducedIndex == SurfaceIndex.positions[SurfaceIndex.M1]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M2]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M3]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M4]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M5]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M6]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M7]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M8]
                || reducedIndex == SurfaceIndex.positions[SurfaceIndex.M9];
        }
    }
}