var Lich;
(function (Lich) {
    var RecipeItem = (function () {
        function RecipeItem(key, reqQuant) {
            this.key = key;
            this.reqQuant = reqQuant;
        }
        RecipeItem.prototype.check = function (quant) {
            this.available = quant >= this.reqQuant;
            // pokud available skončilo false, nemá cenu 
            // vůbec testovat recept jako celek
            if (this.available) {
                this.recipe.check();
            }
        };
        return RecipeItem;
    }());
    var Recipe = (function () {
        function Recipe(outcome, ingredients, availableChangedListener) {
            this.outcome = outcome;
            this.ingredients = ingredients;
            this.availableChangedListener = availableChangedListener;
            outcome.recipe = this;
            for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                var item = _a[_i];
                item.recipe = this;
            }
        }
        Recipe.prototype.check = function () {
            var oldAvail = this.available;
            for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                var item = _a[_i];
                this.available = item.available;
                if (!this.available)
                    break;
            }
            if (oldAvail != this.available) {
                // změnila se dostupnost, dej vědět listeneru,
                // aby mohl recept skrýt/odkrýt
                this.availableChangedListener(this);
            }
        };
        return Recipe;
    }());
    var IngredientByKey = (function () {
        function IngredientByKey() {
        }
        return IngredientByKey;
    }());
    // export interface RecipeListener
    var RecipeManager = (function () {
        function RecipeManager(availableChangedListener) {
            this.availableChangedListener = availableChangedListener;
            this.ingredientByKey = new IngredientByKey();
            this.buildRecipe([
                [Lich.Resources.INV_DOOR_KEY, 1], [
                    [Lich.Resources.INV_WOOD_KEY, 2]
                ]
            ]);
            this.buildRecipe([
                [Lich.Resources.INV_CAMPFIRE_KEY, 1], [
                    [Lich.Resources.INV_WOOD_KEY, 2],
                    [Lich.Resources.INV_STRAW_KEY, 1]
                ]
            ]);
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
            var recipe = new Recipe(new RecipeItem(outcome, outcomeQuant), ingreds, this.availableChangedListener);
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
