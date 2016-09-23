namespace Lich {

    class RecipeUI extends createjs.Container {
        public addItem(item: ItemUI): RecipeUI {
            if (this.children.length == 1) {
                let arrow = Resources.INSTANCE.getBitmap(Resources.RECIPE_ARROW_KEY);
                this.addChild(arrow);
                arrow.y = 0;
                arrow.x = Resources.PARTS_SIZE + PartsUI.SPACING;
            }
            item.y = 0;
            item.x = this.children.length == 0 ? 0 : (this.children.length * (Resources.PARTS_SIZE + PartsUI.SPACING));
            this.addChild(item);
            return this;
        }
    }

    export class CraftingUI extends PartsUI {

        static N = 10;
        static M = 12;
        static CRAFT_SIZE = CraftingUI.N * CraftingUI.M;

        choosenItem: string = null;

        invContent = new Array<ItemUI>();
        itemHighlight: createjs.Shape;
        itemsCont = new createjs.Container();

        constructor() {
            super(CraftingUI.N, CraftingUI.M);

            var self = this;

            // zvýraznění vybrané položky
            self.itemHighlight = self.createHighlightShape();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);

            // kontejner položek
            self.itemsCont.x = PartsUI.BORDER;
            self.itemsCont.y = PartsUI.BORDER;
            self.addChild(self.itemsCont);

            // recepty
            let recipes = [
                new RecipeUI()
                    .addItem(new ItemUI(Resources.INV_DOOR_KEY, 1))
                    .addItem(new ItemUI(Resources.INV_WOOD_KEY, 2)),
                new RecipeUI()
                    .addItem(new ItemUI(Resources.INV_CAMPFIRE_KEY, 1))
                    .addItem(new ItemUI(Resources.INV_WOOD_KEY, 2))
                    .addItem(new ItemUI(Resources.INV_STRAW_KEY, 2))
            ];

            recipes.forEach((v: RecipeUI, i: number) => {
                self.addChild(v);
                v.x = PartsUI.SPACING;
                v.y = PartsUI.SPACING + i * (Resources.PARTS_SIZE + PartsUI.SPACING);
            });

        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }
    }

}