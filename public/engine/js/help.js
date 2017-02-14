var Lich;
(function (Lich) {
    var HelpWeb = (function () {
        function HelpWeb() {
            this.recipeImgMap = {};
            this.recipes = {};
            this.achvImgMap = {};
            this.createRecipes();
            this.createAchievements();
        }
        HelpWeb.prototype.createTextDiv = function (text) {
            var div = document.createElement("div");
            div.innerText = text;
            return div;
        };
        HelpWeb.prototype.createRecipeImage = function (item) {
            var self = this;
            var img = document.createElement("img");
            img.src = this.recipeImgMap[item];
            img.onclick = function () { self.printItemRecipesList(item); };
            return img;
        };
        HelpWeb.prototype.createRecipes = function () {
            var _this = this;
            this.itemsDiv = document.getElementById("items-div");
            this.recipesDiv = document.createElement("div");
            this.recipesDiv.id = "recipes-list-div";
            // URL grafiky položek
            INVENTORY_PATHS.forEach(function (path) {
                _this.recipeImgMap[path[1]] = path[0];
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
                mainListDiv.appendChild(this.createRecipeImage(items[key]));
            }
            this.itemsDiv.appendChild(mainListDiv);
            this.itemsDiv.appendChild(this.recipesDiv);
            this.recipesDiv.appendChild(this.createTextDiv("- choose item to show recipes -"));
        };
        HelpWeb.prototype.printItemRecipesList = function (item) {
            var _this = this;
            var lastWorkstation;
            var buildRecipe = function (json) {
                var outerDiv = document.createElement("div");
                outerDiv.className = "outer-recipe-div";
                var recipeDiv = document.createElement("div");
                recipeDiv.className = "recipe-div";
                outerDiv.appendChild(recipeDiv);
                recipeDiv.appendChild(_this.createTextDiv(json[0][1]));
                recipeDiv.appendChild(_this.createRecipeImage(json[0][0]));
                recipeDiv.appendChild(_this.createTextDiv("="));
                var workstation = json[2];
                var ingreds = json[1];
                for (var i = 0; i < ingreds.length; i++) {
                    var ingred = ingreds[i];
                    if (i > 0) {
                        recipeDiv.appendChild(_this.createTextDiv("+"));
                    }
                    recipeDiv.appendChild(_this.createTextDiv("" + ingred[1]));
                    recipeDiv.appendChild(_this.createRecipeImage(ingred[0]));
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
                this.recipesDiv.appendChild(this.createRecipeImage(item));
                this.recipesDiv.appendChild(this.createTextDiv("- non-craftable item -"));
            }
        };
        HelpWeb.prototype.createAchievements = function () {
            var _this = this;
            this.achievementsDiv = document.getElementById("achievements-div");
            // URL grafiky položek
            ACHIEVEMENTS_PATHS.forEach(function (path) {
                _this.achvImgMap[path[1]] = path[0];
            });
            // Přehled dle položky
            Lich.ACHIEVEMENTS_DEFS.forEach(function (achv) {
                var achvDiv = document.createElement("div");
                achvDiv.className = "achv-div";
                var img = document.createElement("img");
                img.src = _this.achvImgMap[achv.key];
                var textDiv = document.createElement("div");
                textDiv.className = "achv-text-div";
                var nameDiv = _this.createTextDiv(achv.name);
                nameDiv.className = "achv-name-div";
                textDiv.appendChild(nameDiv);
                var mottoDiv = _this.createTextDiv("\"" + achv.motto + "\"");
                mottoDiv.className = "achv-motto-div";
                textDiv.appendChild(mottoDiv);
                var descDiv = _this.createTextDiv(achv.description);
                descDiv.className = "achv-desc-div";
                textDiv.appendChild(descDiv);
                achvDiv.appendChild(img);
                achvDiv.appendChild(textDiv);
                _this.achievementsDiv.appendChild(achvDiv);
            });
        };
        return HelpWeb;
    }());
    Lich.HelpWeb = HelpWeb;
})(Lich || (Lich = {}));
