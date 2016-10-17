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
            this.recipeListener = recipeListener;
            this.ingredientByKey = new IngredientByKey();
            this.buildRecipe([[Lich.InventoryKey.INV_DOOR_KEY, 1], [
                    [Lich.InventoryKey.INV_WOOD_KEY, 2]
                ]]);
            this.buildRecipe([[Lich.InventoryKey.INV_CAMPFIRE_KEY, 1], [
                    [Lich.InventoryKey.INV_WOOD_KEY, 2],
                    [Lich.InventoryKey.INV_STRAW_KEY, 1]
                ]]);
            this.buildRecipe([[Lich.InventoryKey.INV_TORCH_KEY, 5], [
                    [Lich.InventoryKey.INV_WOOD_KEY, 1],
                    [Lich.InventoryKey.INV_STRAW_KEY, 1]
                ]]);
            this.buildRecipe([[Lich.InventoryKey.INV_BRICK_KEY, 5], [
                    [Lich.InventoryKey.INV_DIRT_KEY, 1]
                ]]);
            this.buildRecipe([[Lich.InventoryKey.INV_ROCK_BRICK_KEY, 5], [
                    [Lich.InventoryKey.INV_ROCK_KEY, 1]
                ]]);
            this.buildRecipe([[Lich.InventoryKey.INV_WOODWALL_KEY, 5], [
                    [Lich.InventoryKey.INV_WOOD_KEY, 1]
                ]]);
            this.buildRecipe([[Lich.InventoryKey.INV_ROOF_KEY, 5], [
                    [Lich.InventoryKey.INV_WOOD_KEY, 1],
                    [Lich.InventoryKey.INV_DIRT_KEY, 1]
                ]]);
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
