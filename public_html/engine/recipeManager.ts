namespace Lich {

    export class RecipeItem {
        // mám dostatek této ingredience?
        public available: boolean;
        recipe: Recipe;
        constructor(public key: string, public quant: number) { }
        public check(newQuant: number) {
            let oldAvail = this.available;
            this.available = newQuant >= this.quant;
            if (oldAvail != this.available) {
                this.recipe.changeAvailability(this.available);
            }
        }
    }

    export class Recipe {
        // mám všechny ingredience a je tedy možné recept nabízet?
        public available: boolean;
        constructor(public outcome: RecipeItem, public ingredients: Array<RecipeItem>,
            private recipeListener: (recipe: Recipe) => any) {
            outcome.recipe = this;
            for (let item of this.ingredients) {
                item.recipe = this;
            }
        }

        public changeAvailability(value: boolean) {
            let oldAvail = this.available;
            if (value) {
                // Pokud je jedné ingredience dostatek, stále se musí 
                // ještě zkontrolovat i ty ostatní
                for (let item of this.ingredients) {
                    this.available = item.available;
                    if (!this.available)
                        break;

                }
            } else {
                // Znepřístupnit recept může absence jediné ingredience
                this.available = false;
            }
            if (oldAvail != this.available) {
                // změnila se dostupnost, dej vědět listeneru,
                // aby mohl recept skrýt/odkrýt
                this.recipeListener(this);
            }
        }
    }

    class IngredientByKey {
        [key: string]: RecipeItem[];
    }

    export class RecipeManager {
        public ingredientByKey = new IngredientByKey();

        constructor(private recipeListener: (Recipe) => void) {
            this.buildRecipe([
                [Resources.INV_DOOR_KEY, 1], [
                    [Resources.INV_WOOD_KEY, 2]
                ]
            ]);
            this.buildRecipe([
                [Resources.INV_CAMPFIRE_KEY, 1], [
                    [Resources.INV_WOOD_KEY, 2],
                    [Resources.INV_STRAW_KEY, 1]
                ]
            ]);
            this.buildRecipe([
                [Resources.INV_BRICKWALL_KEY, 5], [
                    [Resources.INV_DIRT_KEY, 1]
                ]
            ]);
            this.buildRecipe([
                [Resources.INV_WOODWALL_KEY, 5], [
                    [Resources.INV_WOOD_KEY, 1]
                ]
            ]);
        }

        buildRecipe(json: any) {
            let self = this;

            let outcome: string = json[0][0];
            let outcomeQuant: number = json[0][1];
            let ingreds = new Array<RecipeItem>();
            for (let ingArr of json[1]) {
                ingreds.push(new RecipeItem(ingArr[0], ingArr[1]));
            }
            let recipe = new Recipe(new RecipeItem(outcome, outcomeQuant), ingreds, this.recipeListener);

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