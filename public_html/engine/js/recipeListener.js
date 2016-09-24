var Lich;
(function (Lich) {
    var RecipeItem = (function () {
        function RecipeItem(key, reqQuant) {
            this.key = key;
            this.reqQuant = reqQuant;
        }
        RecipeItem.prototype.check = function (quant) {
            this.available = quant >= this.reqQuant;
            this.recipe.check();
        };
        return RecipeItem;
    }());
    var Recipe = (function () {
        function Recipe(outcome, ingredients) {
            this.outcome = outcome;
            this.ingredients = ingredients;
            outcome.recipe = this;
            for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                var item = _a[_i];
                item.recipe = this;
            }
        }
        Recipe.prototype.check = function () {
            for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                var item = _a[_i];
                this.available = item.available;
                if (!this.available)
                    break;
            }
        };
        return Recipe;
    }());
    var IngredientByKey = (function () {
        function IngredientByKey() {
        }
        return IngredientByKey;
    }());
    var RecipeListener = (function () {
        function RecipeListener() {
            this.ingredientByKey = new IngredientByKey();
            this.registerRecipe(new Recipe(new RecipeItem(Lich.Resources.INV_DOOR_KEY, 1), [new RecipeItem(Lich.Resources.INV_WOOD_KEY, 2)]));
        }
        RecipeListener.prototype.registerRecipe = function (recipe) {
            var self = this;
            recipe.ingredients.forEach(function (ingredient) {
                var arr = self.ingredientByKey[ingredient.key];
                if (!arr) {
                    arr = [];
                    self.ingredientByKey[ingredient.key] = arr;
                }
                arr.push(ingredient);
            });
        };
        RecipeListener.prototype.updateQuant = function (ingredientKey, currentQuant) {
            var ingredients = this.ingredientByKey[ingredientKey];
            if (ingredients) {
                ingredients.forEach(function (i) {
                    i.check(currentQuant);
                });
            }
        };
        return RecipeListener;
    }());
    Lich.RecipeListener = RecipeListener;
})(Lich || (Lich = {}));
