var Lich;
(function (Lich) {
    // Nepoužívá se
    var FogTree = (function () {
        function FogTree(
            // šířka tohoto (pod)prostoru
            width, height, 
            // celková hodnota stromu
            value) {
            if (value === void 0) { value = false; }
            this.width = width;
            this.height = height;
            this.value = value;
            this.fractioned = false;
            // hloubka podprostoru ve stromu
            this.level = 0;
            // souřadnice podprostoru v podprostoru
            this.x = 0;
            this.y = 0;
        }
        /**
         * Zkus sloučit fragmenty, pokud jsou všechy stejné hodnoty
         */
        FogTree.prototype.tryMerge = function () {
            if (this.fractioned) {
                var canMerge = true;
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
        };
        FogTree.prototype.getSubTree = function (x, y) {
            // musí se zaokrouhlit, protože při mapě šířky 5
            // a kostce 2 (čísluje se od 0) patří kostaka do 
            // druhého podstromu (5 je děleno na 2 + 3) 
            // protože 5/2 je 2,5 spadla by 2 ještě do prvního
            // podstromu, což je špatně. 
            // Takhle je 2 < floor(2,5) = false
            var halfW = Math.floor(this.width / 2);
            var halfH = Math.floor(this.height / 2);
            if (y < halfH) {
                return (x < halfW) ? this.subTree1 : this.subTree2;
            }
            else {
                return (x < halfW) ? this.subTree3 : this.subTree4;
            }
        };
        FogTree.prototype.getValue = function (xt, yt) {
            if (this.fractioned) {
                var x = xt - this.x;
                var y = yt - this.y;
                return this.getSubTree(x, y).getValue(xt, yt);
            }
            else {
                return this.value;
            }
        };
        FogTree.prototype.setValue = function (xt, yt, value) {
            if (!this.fractioned && this.value == value)
                return;
            // strom s rozměr 1:2 nebo 2:1 je předposlední
            // až koncové stromy mají rozměry 1:0 nebo 0:1
            if (this.width <= 1 && this.height <= 1) {
                this.value = value;
            }
            else {
                // init
                if (!this.fractioned) {
                    this.fractioned = true;
                    FogTree.TREES_COUNT += 4;
                    // console.log("Tree SPLIT on level %d, TREES_COUNT= %d", this.level, FogTree.TREES_COUNT);
                    // Musí se zajistit, aby dělení bylo celočíselné
                    // a aby "půlky" vždy daly dohromady původní celek
                    // například mapa o šířce 5 musí být rozdělna na 2 a 3
                    // nikoliv na 2,5 a 2,5 
                    var halfW = Math.floor(this.width / 2);
                    var halfH = Math.floor(this.height / 2);
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
                var x = xt - this.x;
                var y = yt - this.y;
                this.getSubTree(x, y).setValue(xt, yt, value);
                this.tryMerge();
            }
        };
        return FogTree;
    }());
    FogTree.TREES_COUNT = 0;
    Lich.FogTree = FogTree;
})(Lich || (Lich = {}));
