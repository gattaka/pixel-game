var Lich;
(function (Lich) {
    var RecipeWeb = (function () {
        function RecipeWeb() {
            var _this = this;
            this.imgMap = {};
            var mainDiv = document.getElementById("main-div");
            Lich.INVENTORY_PATHS.forEach(function (path) {
                _this.imgMap[path[1]] = path[0];
            });
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
                mainDiv.appendChild(outerDiv);
            };
            Lich.RECIPE_DEFS.forEach(function (recipe) {
                buildRecipe(recipe);
            });
        }
        RecipeWeb.prototype.createDiv = function (text) {
            var div = document.createElement("div");
            div.innerText = text;
            return div;
        };
        RecipeWeb.prototype.createImage = function (item) {
            var img = document.createElement("img");
            img.src = this.imgMap[item];
            return img;
        };
        return RecipeWeb;
    }());
    Lich.RecipeWeb = RecipeWeb;
})(Lich || (Lich = {}));
