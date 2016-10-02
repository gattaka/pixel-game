var Lich;
(function (Lich) {
    var RecipeItem = (function () {
        function RecipeItem(key, quant) {
            this.key = key;
            this.quant = quant;
        }
        return RecipeItem;
    }());
    var Recipe = (function () {
        function Recipe(outcome, ingredients) {
            this.outcome = outcome;
            this.ingredients = ingredients;
        }
        return Recipe;
    }());
    var IndexByIngredient = (function () {
        function IndexByIngredient() {
        }
        return IndexByIngredient;
    }());
    var RecipeIndex = (function () {
        function RecipeIndex() {
            this.registerRecipe(new Recipe(new RecipeItem(Lich.Resources.INV_DOOR_KEY, 1), [new RecipeItem(Lich.Resources.INV_WOOD_KEY, 2)]));
        }
        RecipeIndex.prototype.registerRecipe = function (recipe) {
            var self = this;
            recipe.ingredients.forEach(function (ingredient) {
                var arr = self.byIngredient[ingredient.key];
                if (!arr) {
                    arr = [];
                    self.byIngredient[ingredient.key] = arr;
                }
                arr.push(recipe);
            });
        };
        return RecipeIndex;
    }());
    Lich.RecipeIndex = RecipeIndex;
})(Lich || (Lich = {}));
