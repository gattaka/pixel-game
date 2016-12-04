namespace Lich {

    export class RecipeWeb {

        private imgMap = {};
        private recipes = {};
        private itemsDiv: HTMLDivElement;
        private recipesDiv: HTMLDivElement;

        private createDiv(text: string): HTMLDivElement {
            let div: HTMLDivElement = document.createElement("div");
            div.innerText = text;
            return div;
        }

        private createImage(item: InventoryKey): HTMLImageElement {
            let self = this;
            let img: HTMLImageElement = document.createElement("img");
            img.src = this.imgMap[item];
            img.onclick = () => { self.printItemRecipesList(item) };
            return img;
        }

        constructor() {
            this.itemsDiv = <HTMLDivElement>document.getElementById("items-div");
            this.recipesDiv = document.createElement("div");
            this.recipesDiv.id = "recipes-list-div";

            // URL grafiky položek
            INVENTORY_PATHS.forEach((path) => {
                this.imgMap[path[1]] = path[0];
            });

            // Přehled receptů dle položky
            RECIPE_DEFS.forEach((recipe) => {
                let itemRecipes = this.recipes[recipe[0][0]];
                if (!itemRecipes) {
                    itemRecipes = [];
                    this.recipes[recipe[0][0]] = itemRecipes;
                }
                itemRecipes.push(recipe);
            });

            let items = {};

            RECIPE_DEFS.forEach((recipe) => {
                items[recipe[0][0]] = recipe[0][0];
            });

            let mainListDiv: HTMLDivElement = document.createElement("div");
            mainListDiv.id = "items-list-div";
            for (let key in items) {
                mainListDiv.appendChild(this.createImage(items[key]));
            }

            this.itemsDiv.appendChild(mainListDiv);
            this.itemsDiv.appendChild(this.recipesDiv);
            this.recipesDiv.appendChild(this.createDiv("- choose item to show recipes -"));
        }


        private printItemRecipesList(item: InventoryKey) {
            let lastWorkstation: InventoryKey;

            let buildRecipe = (json) => {
                let outerDiv: HTMLDivElement = document.createElement("div");
                outerDiv.className = "outer-recipe-div";

                let recipeDiv: HTMLDivElement = document.createElement("div");
                recipeDiv.className = "recipe-div";
                outerDiv.appendChild(recipeDiv);

                recipeDiv.appendChild(this.createDiv(json[0][1]));
                recipeDiv.appendChild(this.createImage(json[0][0]));
                recipeDiv.appendChild(this.createDiv("="));

                let workstation: MapObjectKey = json[2];
                let ingreds = <Array<Array<number>>>json[1];
                for (let i = 0; i < ingreds.length; i++) {
                    let ingred = ingreds[i];
                    if (i > 0) {
                        recipeDiv.appendChild(this.createDiv("+"));
                    }
                    recipeDiv.appendChild(this.createDiv("" + ingred[1]));
                    recipeDiv.appendChild(this.createImage(ingred[0]));
                }

                // TODO
                // if (lastWorkstation != workstation) {
                // }

                this.recipesDiv.appendChild(outerDiv);
            }

            this.recipesDiv.innerHTML = "";
            if (this.recipes[item]) {
                this.recipes[item].forEach((recipe) => {
                    buildRecipe(recipe);
                });
            } else {
                this.recipesDiv.appendChild(this.createImage(item));
                this.recipesDiv.appendChild(this.createDiv("- non-craftable item -"));
            }
        }

    }

}