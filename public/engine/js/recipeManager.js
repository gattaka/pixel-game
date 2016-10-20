var Lich;
(function (Lich) {
    var RecipeItem = (function () {
        function RecipeItem(key, quant) {
            this.key = key;
            this.quant = quant;
        }
        RecipeItem.prototype.check = function (newQuant) {
            var oldAvail = this.available;
            this.available = newQuant >= this.quant;
            if (oldAvail != this.available) {
                this.recipe.changeAvailability(this.available);
            }
        };
        return RecipeItem;
    }());
    Lich.RecipeItem = RecipeItem;
    var Recipe = (function () {
        function Recipe(outcome, ingredients, recipeListener) {
            this.outcome = outcome;
            this.ingredients = ingredients;
            this.recipeListener = recipeListener;
            outcome.recipe = this;
            for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                var item = _a[_i];
                item.recipe = this;
            }
        }
        Recipe.prototype.changeAvailability = function (value) {
            var oldAvail = this.available;
            if (value) {
                // Pokud je jedné ingredience dostatek, stále se musí 
                // ještě zkontrolovat i ty ostatní
                for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.available = item.available;
                    if (!this.available)
                        break;
                }
            }
            else {
                // Znepřístupnit recept může absence jediné ingredience
                this.available = false;
            }
            if (oldAvail != this.available) {
                // změnila se dostupnost, dej vědět listeneru,
                // aby mohl recept skrýt/odkrýt
                this.recipeListener(this);
            }
        };
        return Recipe;
    }());
    Lich.Recipe = Recipe;
    var IngredientByKey = (function () {
        function IngredientByKey() {
        }
        return IngredientByKey;
    }());
    var RecipeManager = (function () {
        function RecipeManager(recipeListener) {
            var _this = this;
            this.recipeListener = recipeListener;
            this.ingredientByKey = new IngredientByKey();
            Lich.RECIPE_DEFS.forEach(function (recipe) {
                _this.buildRecipe(recipe);
            });
        }
        RecipeManager.prototype.buildRecipe = function (json) {
            var self = this;
            var outcome = json[0][0];
            var outcomeQuant = json[0][1];
            var ingreds = new Array();
            for (var _i = 0, _a = json[1]; _i < _a.length; _i++) {
                var ingArr = _a[_i];
                ingreds.push(new RecipeItem(ingArr[0], ingArr[1]));
            }
            var recipe = new Recipe(new RecipeItem(outcome, outcomeQuant), ingreds, this.recipeListener);
            recipe.ingredients.forEach(function (ingredient) {
                var arr = self.ingredientByKey[ingredient.key];
                if (!arr) {
                    arr = [];
                    self.ingredientByKey[ingredient.key] = arr;
                }
                arr.push(ingredient);
            });
        };
        RecipeManager.prototype.updateQuant = function (ingredientKey, currentQuant) {
            var ingredients = this.ingredientByKey[ingredientKey];
            if (ingredients) {
                ingredients.forEach(function (i) {
                    i.check(currentQuant);
                });
            }
        };
        return RecipeManager;
    }());
    Lich.RecipeManager = RecipeManager;
})(Lich || (Lich = {}));
