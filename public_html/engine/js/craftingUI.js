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
            if (this.children.length == 1) {
                var arrow = Lich.Resources.INSTANCE.getBitmap(Lich.Resources.RECIPE_ARROW_KEY);
                this.addChild(arrow);
                arrow.y = 0;
                arrow.x = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING;
            }
            item.y = 0;
            item.x = this.children.length == 0 ? 0 : (this.children.length * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING));
            this.addChild(item);
            return this;
        };
        return RecipeUI;
    }(createjs.Container));
    var CraftingUI = (function (_super) {
        __extends(CraftingUI, _super);
        function CraftingUI() {
            _super.call(this, CraftingUI.N, CraftingUI.M);
            this.choosenItem = null;
            this.invContent = new Array();
            this.itemsCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlight = self.createHighlightShape();
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
                    .addItem(new Lich.ItemUI(Lich.Resources.INV_STRAW_KEY, 2))
            ];
            recipes.forEach(function (v, i) {
                self.addChild(v);
                v.x = Lich.PartsUI.SPACING;
                v.y = Lich.PartsUI.SPACING + i * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
            });
        }
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
