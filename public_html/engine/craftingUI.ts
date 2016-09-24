namespace Lich {

    class RecipeUI extends createjs.Container {
        public addItem(item: ItemUI): RecipeUI {
            if (this.children.length == 0) {
                let btn = new Button();
                this.addChild(btn);
                btn.y = 0;
                btn.x = 0;
                item.y = PartsUI.SELECT_BORDER;
                item.x = PartsUI.SELECT_BORDER
            }
            if (this.children.length == 2) {
                let arrow = Resources.INSTANCE.getBitmap(Resources.UI_LEFT_KEY);
                this.addChild(arrow);
                arrow.y = PartsUI.SELECT_BORDER;
                arrow.x = Resources.PARTS_SIZE + 12;
                item.y = PartsUI.SELECT_BORDER;
                item.x = Resources.PARTS_SIZE * 2 + 18;
            }
            if (this.children.length > 3) {
                item.y = PartsUI.SELECT_BORDER;
                item.x = this.children[this.children.length - 1].x + (Resources.PARTS_SIZE + PartsUI.SPACING);
            }
            this.addChild(item);
            return this;
        }
    }

    export class CraftingUI extends PartsUI {

        static N = 10;
        static M = 12;
        static CRAFT_SIZE = CraftingUI.N * CraftingUI.M;

        toggleFlag = true;
        private parentRef: createjs.Container = null;

        choosenItem: string = null;

        invContent = new Array<ItemUI>();
        itemHighlight: createjs.Shape;
        itemsCont = new createjs.Container();

        constructor() {
            super(CraftingUI.N, CraftingUI.M);

            var self = this;

            // zvýraznění vybrané položky
            self.itemHighlight = new Highlight();
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
                    .addItem(new ItemUI(Resources.INV_STRAW_KEY, 2)),
                new RecipeUI()
                    .addItem(new ItemUI(Resources.INV_WOODWALL_KEY, 1))
                    .addItem(new ItemUI(Resources.INV_WOOD_KEY, 1)),
                new RecipeUI()
                    .addItem(new ItemUI(Resources.INV_BRICKWALL_KEY, 1))
                    .addItem(new ItemUI(Resources.INV_DIRT_KEY, 1))
            ];

            recipes.forEach((v: RecipeUI, i: number) => {
                self.addChild(v);
                v.x = PartsUI.SELECT_BORDER;
                v.y = PartsUI.SELECT_BORDER + i * (Resources.PARTS_SIZE + 16);
            });

        }

        toggle() {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                if (self.parent == null) {
                    self.parentRef.addChild(self);
                } else {
                    self.parentRef = self.parent;
                    self.parent.removeChild(self);
                }
                self.toggleFlag = false;
            }
        }

        prepareForToggle() {
            this.toggleFlag = true;
        }

        handleMouse(mouse) {
            if (mouse.down) {
                // TODO
            }
        }
    }

}