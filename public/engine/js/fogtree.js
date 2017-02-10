var Lich;
(function (Lich) {
    (function (FogTile) {
        FogTile[FogTile["TL"] = 0] = "TL";
        FogTile[FogTile["TT"] = 1] = "TT";
        FogTile[FogTile["TR"] = 2] = "TR";
        FogTile[FogTile["I_TL"] = 3] = "I_TL";
        FogTile[FogTile["I_TT"] = 4] = "I_TT";
        FogTile[FogTile["I_TR"] = 5] = "I_TR";
        FogTile[FogTile["LL"] = 6] = "LL";
        FogTile[FogTile["MM"] = 7] = "MM";
        FogTile[FogTile["RR"] = 8] = "RR";
        FogTile[FogTile["I_LL"] = 9] = "I_LL";
        FogTile[FogTile["I_MM"] = 10] = "I_MM";
        FogTile[FogTile["I_RR"] = 11] = "I_RR";
        FogTile[FogTile["BL"] = 12] = "BL";
        FogTile[FogTile["BB"] = 13] = "BB";
        FogTile[FogTile["BR"] = 14] = "BR";
        FogTile[FogTile["I_BL"] = 15] = "I_BL";
        FogTile[FogTile["I_BB"] = 16] = "I_BB";
        FogTile[FogTile["I_BR"] = 17] = "I_BR";
    })(Lich.FogTile || (Lich.FogTile = {}));
    var FogTile = Lich.FogTile;
    var FogTree = (function () {
        function FogTree(
            // šířka tohoto (pod)prostoru
            width, height, 
            // celková hodnota stromu
            value) {
            if (value === void 0) { value = FogTile.I_MM; }
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
        };
        FogTree.prototype.getValue = function (xt, yt) {
            if (this.fractioned) {
                var x = xt - this.x;
                var y = yt - this.y;
                if (this.width == 1 || this.height == 1) {
                    return this.smallValues[y * this.width + x];
                }
                else {
                    var target_1;
                    if (y < this.height / 2) {
                        target_1 = (x < this.width / 2) ? this.subTree1 : this.subTree2;
                    }
                    else {
                        target_1 = (x < this.width / 2) ? this.subTree3 : this.subTree4;
                    }
                    return target_1.getValue(xt, yt);
                }
            }
            else {
                return this.value;
            }
        };
        FogTree.prototype.setValue = function (xt, yt, value) {
            var x = xt - this.x;
            var y = yt - this.y;
            // init
            if (!this.fractioned) {
                this.fractioned = true;
                if (this.width == 1 || this.height == 1) {
                    this.smallValues = [];
                }
                else {
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
            }
            else {
                var target_2;
                if (y < this.height / 2) {
                    target_2 = (x < this.width / 2) ? this.subTree1 : this.subTree2;
                }
                else {
                    target_2 = (x < this.width / 2) ? this.subTree3 : this.subTree4;
                }
                target_2.setValue(xt, yt, value);
            }
        };
        return FogTree;
    }());
    Lich.FogTree = FogTree;
})(Lich || (Lich = {}));
