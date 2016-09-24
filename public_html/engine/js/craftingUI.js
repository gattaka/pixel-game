var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var RecipeUI = (function (_super) {
        __extends(RecipeUI, _super);
        function RecipeUI() {
            _super.apply(this, arguments);
        }
        RecipeUI.prototype.addItem = function (item) {
            if (this.children.length == 0) {
                var btn = new Lich.Button();
                this.addChild(btn);
                btn.y = 0;
                btn.x = 0;
                item.y = Lich.PartsUI.SELECT_BORDER;
                item.x = Lich.PartsUI.SELECT_BORDER;
            }
            if (this.children.length == 2) {
                var arrow = Lich.Resources.INSTANCE.getBitmap(Lich.Resources.UI_LEFT_KEY);
                this.addChild(arrow);
                arrow.y = Lich.PartsUI.SELECT_BORDER;
                arrow.x = Lich.Resources.PARTS_SIZE + 12;
                item.y = Lich.PartsUI.SELECT_BORDER;
                item.x = Lich.Resources.PARTS_SIZE * 2 + 18;
            }
            if (this.children.length > 3) {
                item.y = Lich.PartsUI.SELECT_BORDER;
                item.x = this.children[this.children.length - 1].x + (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            }
            this.addChild(item);
            return this;
        };
        return RecipeUI;
    }(createjs.Container));
    var CraftingUI = (function (_super) {
        __extends(CraftingUI, _super);
        function CraftingUI() {
            _super.call(this, CraftingUI.N, CraftingUI.M);
            this.toggleFlag = true;
            this.parentRef = null;
            this.choosenItem = null;
            this.invContent = new Array();
            this.itemsCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlight = new Lich.Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = Lich.PartsUI.BORDER;
            self.itemsCont.y = Lich.PartsUI.BORDER;
            self.addChild(self.itemsCont);
            // recepty
            var recipes = [
                new RecipeUI()
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_DOOR_KEY, 1))
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_WOOD_KEY, 2)),
                new RecipeUI()
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_CAMPFIRE_KEY, 1))
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_WOOD_KEY, 2))
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_STRAW_KEY, 2)),
                new RecipeUI()
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_WOODWALL_KEY, 1))
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_WOOD_KEY, 1)),
                new RecipeUI()
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_BRICKWALL_KEY, 1))
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_DIRT_KEY, 1))
            ];
            recipes.forEach(function (v, i) {
                self.addChild(v);
                v.x = Lich.PartsUI.SELECT_BORDER;
                v.y = Lich.PartsUI.SELECT_BORDER + i * (Lich.Resources.PARTS_SIZE + 16);
            });
        }
        CraftingUI.prototype.toggle = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                if (self.parent == null) {
                    self.parentRef.addChild(self);
                }
                else {
                    self.parentRef = self.parent;
                    self.parent.removeChild(self);
                }
                self.toggleFlag = false;
            }
        };
        CraftingUI.prototype.prepareForToggle = function () {
            this.toggleFlag = true;
        };
        CraftingUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        CraftingUI.N = 10;
        CraftingUI.M = 12;
        CraftingUI.CRAFT_SIZE = CraftingUI.N * CraftingUI.M;
        return CraftingUI;
    }(Lich.PartsUI));
    Lich.CraftingUI = CraftingUI;
})(Lich || (Lich = {}));
