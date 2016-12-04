namespace Lich {

    export class RecipeItem {
        // mám dostatek této ingredience?
        public available: boolean = false;
        recipe: Recipe;
        constructor(public key: InventoryKey, public quant: number) { }
        public check(newQuant: number) {
            let oldAvail = this.available;
            this.available = newQuant >= this.quant;
            if (oldAvail != this.available) {
                this.recipe.tryToChangeAvailability(this.available);
            }
        }
    }

    export class Recipe {
        // mám všechny ingredience a je tedy možné recept nabízet?
        public available: boolean = false;
        public currentWorkstation: MapObjectKey;
        constructor(public outcome: RecipeItem, public ingredients: Array<RecipeItem>, public requiredWorkstation?: MapObjectKey) {
            outcome.recipe = this;
            for (let item of this.ingredients) {
                item.recipe = this;
            }
        }

        public tryToChangeAvailability(value: boolean) {
            let oldAvail = this.available;
            if (oldAvail == value)
                return;
            if (value) {
                if (this.currentWorkstation == this.requiredWorkstation) {
                    // Pokud je jedné ingredience dostatek nebo je zvolena správná workstation, 
                    // stále se musí ještě zkontrolovat i ty ostatní
                    for (let item of this.ingredients) {
                        this.available = item.available;
                        if (!this.available)
                            break;
                    }
                } else {
                    // nevyhovující workstation
                    this.available = false;
                }
            } else {
                // Znepřístupnit recept může absence jediné ingredience
                this.available = false;
            }
        }
    }

    class IngredientByKey {
        [key: string]: RecipeItem[];
    }

    export class RecipeManager {
        public ingredientByKey = new IngredientByKey();
        private recipes = new Array<Recipe>();

        constructor(private recipeListener: (recipes: Array<Recipe>) => void) {
            RECIPE_DEFS.forEach((recipe) => {
                this.buildRecipe(recipe);
            });

            EventBus.getInstance().registerConsumer(EventType.WORKSTATION_CHANGE, (payload: NumberEventPayload) => {
                // projdi a uprav viditelnost všech receptů
                this.recipes.forEach((recipe) => {
                    if (recipe) {
                        recipe.currentWorkstation = payload.payload;
                        recipe.tryToChangeAvailability(recipe.requiredWorkstation == payload.payload);
                    }
                });
                // překresli UI 
                this.recipeListener(this.recipes);
                return false;
            });
        }

        buildRecipe(json: any) {
            let self = this;

            let outcome: InventoryKey = json[0][0];
            let outcomeQuant: number = json[0][1];
            let workstation: MapObjectKey = json[2];
            let ingreds = new Array<RecipeItem>();
            for (let ingArr of json[1]) {
                ingreds.push(new RecipeItem(ingArr[0], ingArr[1]));
            }
            let recipe = new Recipe(new RecipeItem(outcome, outcomeQuant), ingreds, workstation);

            recipe.ingredients.forEach((ingredient: RecipeItem) => {
                let arr: RecipeItem[] = self.ingredientByKey[ingredient.key];
                if (!arr) {
                    arr = [];
                    self.ingredientByKey[ingredient.key] = arr;
                }
                arr.push(ingredient);
            });
            self.recipes.push(recipe);
        }

        public updateQuant(ingredientKey: InventoryKey, currentQuant: number) {
            let ingredients = this.ingredientByKey[ingredientKey];
            if (ingredients) {
                ingredients.forEach((i) => {
                    i.check(currentQuant);
                });
                // překresli UI 
                this.recipeListener(this.recipes);
            }
        }
    }

}