namespace Lich {

    class RecipeItem {
        // mám dostatek této ingredience?
        public available: boolean;
        recipe: Recipe;
        constructor(public key: string, public reqQuant: number) { }
        public check(quant: number) {
            this.available = quant >= this.reqQuant;
            this.recipe.check();
        }
    }

    class Recipe {
        // mám všechny ingredience a je tedy možné recept nabízet?
        public available: boolean;
        constructor(public outcome: RecipeItem, public ingredients: Array<RecipeItem>) {
            outcome.recipe = this;
            for (let item of this.ingredients) {
                item.recipe = this;
            }
        }
        public check() {
            for (let item of this.ingredients) {
                this.available = item.available;
                if (!this.available)
                    break;
            }
        }
    }

    class IngredientByKey {
        [key: string]: RecipeItem[];
    }

    export class RecipeListener {
        public ingredientByKey = new IngredientByKey();

        constructor() {
            this.registerRecipe(new Recipe(new RecipeItem(Resources.INV_DOOR_KEY, 1),
                [new RecipeItem(Resources.INV_WOOD_KEY, 2)]
            ));
        }

        registerRecipe(recipe: Recipe) {
            let self = this;
            recipe.ingredients.forEach((ingredient: RecipeItem) => {
                let arr: RecipeItem[] = self.ingredientByKey[ingredient.key];
                if (!arr) {
                    arr = [];
                    self.ingredientByKey[ingredient.key] = arr;
                }
                arr.push(ingredient);
            });
        }

        public updateQuant(ingredientKey: string, currentQuant: number) {
            let ingredients = this.ingredientByKey[ingredientKey];
            if (ingredients) {
                ingredients.forEach((i) => {
                    i.check(currentQuant);
                });
            }
        }
    }

}