var Lich;
(function (Lich) {
    var RecipeWeb = (function () {
        function RecipeWeb() {
            var _this = this;
            this.imgMap = {};
            this.recipes = {};
            this.itemsDiv = document.getElementById("items-div");
            this.recipesDiv = document.createElement("div");
            this.recipesDiv.id = "recipes-list-div";
            // URL grafiky položek
            Lich.INVENTORY_PATHS.forEach(function (path) {
                _this.imgMap[path[1]] = path[0];
            });
            // Přehled receptů dle položky
            Lich.RECIPE_DEFS.forEach(function (recipe) {
                var itemRecipes = _this.recipes[recipe[0][0]];
                if (!itemRecipes) {
                    itemRecipes = [];
                    _this.recipes[recipe[0][0]] = itemRecipes;
                }
                itemRecipes.push(recipe);
            });
            var items = {};
            Lich.RECIPE_DEFS.forEach(function (recipe) {
                items[recipe[0][0]] = recipe[0][0];
            });
            var mainListDiv = document.createElement("div");
            mainListDiv.id = "items-list-div";
            for (var key in items) {
                mainListDiv.appendChild(this.createImage(items[key]));
            }
            this.itemsDiv.appendChild(mainListDiv);
            this.itemsDiv.appendChild(this.recipesDiv);
            this.recipesDiv.appendChild(this.createDiv("- choose item to show recipes -"));
        }
        RecipeWeb.prototype.createDiv = function (text) {
            var div = document.createElement("div");
            div.innerText = text;
            return div;
        };
        RecipeWeb.prototype.createImage = function (item) {
            var self = this;
            var img = document.createElement("img");
            img.src = this.imgMap[item];
            img.onclick = function () { self.printItemRecipesList(item); };
            return img;
        };
        RecipeWeb.prototype.printItemRecipesList = function (item) {
            var _this = this;
            var lastWorkstation;
            var buildRecipe = function (json) {
                var outerDiv = document.createElement("div");
                outerDiv.className = "outer-recipe-div";
                var recipeDiv = document.createElement("div");
                recipeDiv.className = "recipe-div";
                outerDiv.appendChild(recipeDiv);
                recipeDiv.appendChild(_this.createDiv(json[0][1]));
                recipeDiv.appendChild(_this.createImage(json[0][0]));
                recipeDiv.appendChild(_this.createDiv("="));
                var workstation = json[2];
                var ingreds = json[1];
                for (var i = 0; i < ingreds.length; i++) {
                    var ingred = ingreds[i];
                    if (i > 0) {
                        recipeDiv.appendChild(_this.createDiv("+"));
                    }
                    recipeDiv.appendChild(_this.createDiv("" + ingred[1]));
                    recipeDiv.appendChild(_this.createImage(ingred[0]));
                }
                // TODO
                // if (lastWorkstation != workstation) {
                // }
                _this.recipesDiv.appendChild(outerDiv);
            };
            this.recipesDiv.innerHTML = "";
            if (this.recipes[item]) {
                this.recipes[item].forEach(function (recipe) {
                    buildRecipe(recipe);
                });
            }
            else {
                this.recipesDiv.appendChild(this.createImage(item));
                this.recipesDiv.appendChild(this.createDiv("- non-craftable item -"));
            }
        };
        return RecipeWeb;
    }());
    Lich.RecipeWeb = RecipeWeb;
})(Lich || (Lich = {}));
