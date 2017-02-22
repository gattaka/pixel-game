var Lich;
(function (Lich) {
    var RecipeItem = (function () {
        function RecipeItem(key, quant) {
            this.key = key;
            this.quant = quant;
            // mám dostatek této ingredience?
            this.available = false;
        }
        RecipeItem.prototype.check = function (newQuant) {
            var oldAvail = this.available;
            this.available = newQuant >= this.quant;
            if (oldAvail != this.available) {
                this.recipe.tryToChangeAvailability(this.available);
            }
        };
        return RecipeItem;
    }());
    Lich.RecipeItem = RecipeItem;
    var Recipe = (function () {
        function Recipe(outcome, ingredients, requiredWorkstation) {
            this.outcome = outcome;
            this.ingredients = ingredients;
            this.requiredWorkstation = requiredWorkstation;
            // mám všechny ingredience a je tedy možné recept nabízet?
            this.available = false;
            outcome.recipe = this;
            for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                var item = _a[_i];
                item.recipe = this;
            }
        }
        Recipe.prototype.tryToChangeAvailability = function (value) {
            var oldAvail = this.available;
            if (oldAvail == value)
                return;
            if (value) {
                if (this.currentWorkstation == this.requiredWorkstation) {
                    // Pokud je jedné ingredience dostatek nebo je zvolena správná workstation, 
                    // stále se musí ještě zkontrolovat i ty ostatní
                    for (var _i = 0, _a = this.ingredients; _i < _a.length; _i++) {
                        var item = _a[_i];
                        this.available = item.available;
                        if (!this.available)
                            break;
                    }
                }
                else {
                    // nevyhovující workstation
                    this.available = false;
                }
            }
            else {
                // Znepřístupnit recept může absence jediné ingredience
                this.available = false;
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
        function RecipeManager() {
            var _this = this;
            this.ingredientByKey = new IngredientByKey();
            this.recipes = new Array();
            Lich.RECIPE_DEFS.forEach(function (recipe) {
                _this.buildRecipe(recipe);
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.WORKSTATION_CHANGE, function (payload) {
                // projdi a uprav viditelnost všech receptů
                _this.recipes.forEach(function (recipe) {
                    if (recipe) {
                        recipe.currentWorkstation = payload.payload;
                        recipe.tryToChangeAvailability(recipe.requiredWorkstation == payload.payload);
                    }
                });
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.RECIPES_CHANGE));
                return false;
            });
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.INV_CHANGE, function (payload) {
                var ingredients = _this.ingredientByKey[payload.key];
                if (ingredients) {
                    ingredients.forEach(function (i) {
                        i.check(Math.abs(payload.amount));
                    });
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.RECIPES_CHANGE));
                }
                return false;
            });
        }
        RecipeManager.getInstance = function () {
            if (!RecipeManager.INSTANCE) {
                RecipeManager.INSTANCE = new RecipeManager();
            }
            return RecipeManager.INSTANCE;
        };
        RecipeManager.prototype.getRecipes = function () { return this.recipes; };
        RecipeManager.prototype.buildRecipe = function (json) {
            var self = this;
            var outcome = json[0][0];
            var outcomeQuant = json[0][1];
            var workstation = json[2];
            var ingreds = new Array();
            for (var _i = 0, _a = json[1]; _i < _a.length; _i++) {
                var ingArr = _a[_i];
                ingreds.push(new RecipeItem(ingArr[0], ingArr[1]));
            }
            var recipe = new Recipe(new RecipeItem(outcome, outcomeQuant), ingreds, workstation);
            recipe.ingredients.forEach(function (ingredient) {
                var arr = self.ingredientByKey[ingredient.key];
                if (!arr) {
                    arr = [];
                    self.ingredientByKey[ingredient.key] = arr;
                }
                arr.push(ingredient);
            });
            self.recipes.push(recipe);
        };
        return RecipeManager;
    }());
    Lich.RecipeManager = RecipeManager;
})(Lich || (Lich = {}));
