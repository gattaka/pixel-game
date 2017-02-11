namespace Lich {

    export enum FogTile {
        TL, TT, TR, I_TL, I_TT, I_TR,
        LL, MM, RR, I_LL, I_MM, I_RR,
        BL, BB, BR, I_BL, I_BB, I_BR,
    }

    export class FogTree {

        private static TREES_COUNT = 0;

        public fractioned = false;
        // hloubka podprostoru ve stromu
        private level = 0;
        // souřadnice podprostoru v podprostoru
        public x = 0;
        public y = 0;

        public subTree1: FogTree; // TL
        public subTree2: FogTree; // TR
        public subTree3: FogTree; // BL
        public subTree4: FogTree; // BR

        constructor(
            // šířka tohoto (pod)prostoru
            public width?: number,
            public height?: number,
            // celková hodnota stromu
            public value: FogTile = FogTile.MM) {
        }

        /**
         * Zkus sloučit fragmenty, pokud jsou všechy stejné hodnoty
         */
        private tryMerge() {
            if (this.fractioned) {
                let canMerge = true;
                if (this.subTree1.fractioned ||
                    this.subTree2.fractioned ||
                    this.subTree3.fractioned ||
                    this.subTree4.fractioned ||
                    this.subTree1.value != this.subTree2.value ||
                    this.subTree2.value != this.subTree3.value ||
                    this.subTree3.value != this.subTree4.value) {
                    canMerge = false;
                }
                if (canMerge) {
                    this.fractioned = false;
                    this.value = this.subTree1.value;
                    FogTree.TREES_COUNT -= 4;
                    // console.log("Tree MERGE on level %d, TREES_COUNT= %d", this.level, FogTree.TREES_COUNT);
                }
            }
        }

        private getSubTree(x: number, y: number): FogTree {
            // musí se zaokrouhlit, protože při mapě šířky 5
            // a kostce 2 (čísluje se od 0) patří kostaka do 
            // druhého podstromu (5 je děleno na 2 + 3) 
            // protože 5/2 je 2,5 spadla by 2 ještě do prvního
            // podstromu, což je špatně. 
            // Takhle je 2 < floor(2,5) = false
            let halfW = Math.floor(this.width / 2);
            let halfH = Math.floor(this.height / 2);
            if (y < halfH) {
                return (x < halfW) ? this.subTree1 : this.subTree2;
            } else {
                return (x < halfW) ? this.subTree3 : this.subTree4;
            }
        }

        public getValue(xt: number, yt: number): FogTile {
            if (this.fractioned) {
                let x = xt - this.x;
                let y = yt - this.y;
                return this.getSubTree(x, y).getValue(xt, yt);
            } else {
                return this.value;
            }
        }

        public setValue(xt: number, yt: number, value: FogTile) {
            if (!this.fractioned && this.value == value)
                return;
            // strom s rozměr 1:2 nebo 2:1 je předposlední
            // až koncové stromy mají rozměry 1:0 nebo 0:1
            if (this.width <= 1 && this.height <= 1) {
                this.value = value;
            } else {
                // init
                if (!this.fractioned) {
                    this.fractioned = true;
                    FogTree.TREES_COUNT += 4;
                    // console.log("Tree SPLIT on level %d, TREES_COUNT= %d", this.level, FogTree.TREES_COUNT);

                    // Musí se zajistit, aby dělení bylo celočíselné
                    // a aby "půlky" vždy daly dohromady původní celek
                    // například mapa o šířce 5 musí být rozdělna na 2 a 3
                    // nikoliv na 2,5 a 2,5 
                    let halfW = Math.floor(this.width / 2);
                    let halfH = Math.floor(this.height / 2);
                    this.subTree1 = new FogTree(halfW, halfH, this.value);
                    this.subTree2 = new FogTree(this.width - halfW, halfH, this.value);
                    this.subTree3 = new FogTree(halfW, this.height - halfH, this.value);
                    this.subTree4 = new FogTree(this.width - halfW, this.height - halfH, this.value);
                    this.subTree1.level = this.level + 1;
                    this.subTree2.level = this.level + 1;
                    this.subTree3.level = this.level + 1;
                    this.subTree4.level = this.level + 1;
                    // TL
                    this.subTree1.x = this.x;
                    this.subTree1.y = this.y;
                    // TR
                    this.subTree2.x = this.x + halfW;
                    this.subTree2.y = this.y;
                    // BL
                    this.subTree3.x = this.x;
                    this.subTree3.y = this.y + halfH;
                    // BR
                    this.subTree4.x = this.x + halfW;
                    this.subTree4.y = this.y + halfH;
                }

                // insert
                let x = xt - this.x;
                let y = yt - this.y;
                this.getSubTree(x, y).setValue(xt, yt, value);
                this.tryMerge();
            }
        }
    }
}