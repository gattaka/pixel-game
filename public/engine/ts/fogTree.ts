namespace Lich {

    export enum FogTile {
        TL, TT, TR, I_TL, I_TT, I_TR,
        LL, MM, RR, I_LL, I_MM, I_RR,
        BL, BB, BR, I_BL, I_BB, I_BR,
    }

    export class FogTree {

        private fractioned = false;
        // hloubka podprostoru ve stromu
        private level = 0;
        // souřadnice podprostoru v podprostoru
        private x = 0;
        private y = 0;

        // nedělitelné pole (jedna moje strana =1)
        private smallValues: Array<FogTile>;

        /**
         * 1 2
         * 3 4 
         */

        private subTree1;
        private subTree2;
        private subTree3;
        private subTree4;

        constructor(
            // šířka tohoto (pod)prostoru
            private width: number,
            private height: number,
            // celková hodnota stromu
            private value: FogTile = FogTile.I_MM) {
        }

        /**
         * Zkus sloučit fragmenty, pokud jsou všechy stejné hodnoty
         */
        private tryMerge() {
            if (this.fractioned &&
                !this.subTree1.fractioned &&
                !this.subTree2.fractioned &&
                !this.subTree3.fractioned &&
                !this.subTree4.fractioned &&
                this.subTree1 == this.subTree2 &&
                this.subTree2 == this.subTree3 &&
                this.subTree3 == this.subTree4) {
                this.fractioned = false;
                this.value = this.subTree1.value;
            }
        }

        public getValue(xt: number, yt: number): FogTile {
            if (this.fractioned) {
                let x = xt - this.x;
                let y = yt - this.y;
                if (this.width == 1 || this.height == 1) {
                    return this.smallValues[y * this.width + x];
                } else {
                    let target: FogTree;
                    if (y < this.height / 2) {
                        target = (x < this.width / 2) ? this.subTree1 : this.subTree2;
                    } else {
                        target = (x < this.width / 2) ? this.subTree3 : this.subTree4;
                    }
                    return target.getValue(xt, yt);
                }
            } else {
                return this.value;
            }
        }

        public setValue(xt: number, yt: number, value: FogTile) {
            let x = xt - this.x;
            let y = yt - this.y;
            // init
            if (!this.fractioned) {
                this.fractioned = true;
                if (this.width == 1 || this.height == 1) {
                    this.smallValues = [];
                } else {
                    this.subTree1 = new FogTree(this.width / 2, this.height / 2, this.value);
                    this.subTree2 = new FogTree(this.width / 2, this.height / 2, this.value);
                    this.subTree3 = new FogTree(this.width / 2, this.height / 2, this.value);
                    this.subTree4 = new FogTree(this.width / 2, this.height / 2, this.value);
                    this.subTree1.level = this.level + 1;
                    this.subTree2.level = this.level + 1;
                    this.subTree3.level = this.level + 1;
                    this.subTree4.level = this.level + 1;
                    // TL
                    this.subTree1.x = this.x;
                    this.subTree1.y = this.y;
                    // TR
                    this.subTree2.x = this.x + this.width / 2;
                    this.subTree2.y = this.y;
                    // BL
                    this.subTree3.x = this.x;
                    this.subTree3.y = this.y + this.height / 2;
                    // BR
                    this.subTree4.x = this.x + this.width / 2;
                    this.subTree4.y = this.y + this.height / 2;
                }
            }

            // insert
            if (this.width == 1 || this.height == 1) {
                this.smallValues[y * this.width + x] = value;
            } else {
                let target: FogTree;
                if (y < this.height / 2) {
                    target = (x < this.width / 2) ? this.subTree1 : this.subTree2;
                } else {
                    target = (x < this.width / 2) ? this.subTree3 : this.subTree4;
                }
                target.setValue(xt, yt, value);
            }
        }

    }
}