namespace Lich {

    export class HelpWeb {

        private recipeImgMap = {};
        private recipes = {};
        private itemsDiv: HTMLDivElement;
        private recipesDiv: HTMLDivElement;

        private achvImgMap = {};
        private achievementsDiv: HTMLDivElement;

        private createTextDiv(text: string): HTMLDivElement {
            let div: HTMLDivElement = document.createElement("div");
            div.innerText = text;
            return div;
        }

        private createRecipeImage(item: InventoryKey): HTMLImageElement {
            let self = this;
            let img: HTMLImageElement = document.createElement("img");
            img.src = this.recipeImgMap[item];
            img.onclick = () => { self.printItemRecipesList(item) };
            return img;
        }

        private createRecipes() {
            this.itemsDiv = <HTMLDivElement>document.getElementById("items-div");
            this.recipesDiv = document.createElement("div");
            this.recipesDiv.id = "recipes-list-div";

            // URL grafiky položek
            INVENTORY_DEFS.forEach((path) => {
                this.recipeImgMap[path[1]] = path[0];
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
                mainListDiv.appendChild(this.createRecipeImage(items[key]));
            }

            this.itemsDiv.appendChild(mainListDiv);
            this.itemsDiv.appendChild(this.recipesDiv);
            this.recipesDiv.appendChild(this.createTextDiv("- choose item to show recipes -"));
        }

        private printItemRecipesList(item: InventoryKey) {
            let lastWorkstation: InventoryKey;

            let buildRecipe = (json) => {
                let outerDiv: HTMLDivElement = document.createElement("div");
                outerDiv.className = "outer-recipe-div";

                let recipeDiv: HTMLDivElement = document.createElement("div");
                recipeDiv.className = "recipe-div";
                outerDiv.appendChild(recipeDiv);

                recipeDiv.appendChild(this.createTextDiv(json[0][1]));
                recipeDiv.appendChild(this.createRecipeImage(json[0][0]));
                recipeDiv.appendChild(this.createTextDiv("="));

                let workstation: MapObjectKey = json[2];
                let ingreds = <Array<Array<number>>>json[1];
                for (let i = 0; i < ingreds.length; i++) {
                    let ingred = ingreds[i];
                    if (i > 0) {
                        recipeDiv.appendChild(this.createTextDiv("+"));
                    }
                    recipeDiv.appendChild(this.createTextDiv("" + ingred[1]));
                    recipeDiv.appendChild(this.createRecipeImage(ingred[0]));
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
                this.recipesDiv.appendChild(this.createRecipeImage(item));
                this.recipesDiv.appendChild(this.createTextDiv("- non-craftable item -"));
            }
        }

        private createAchievements() {
            this.achievementsDiv = <HTMLDivElement>document.getElementById("achievements-div");

            // URL grafiky položek
            ACHIEVEMENTS_PATHS.forEach((path) => {
                this.achvImgMap[path[1]] = path[0];
            });

            // Přehled dle položky
            ACHIEVEMENTS_DEFS.forEach((achv: AchievementDefinition) => {
                let achvDiv = document.createElement("div");
                achvDiv.className = "achv-div";

                let img: HTMLImageElement = document.createElement("img");
                img.src = this.achvImgMap[achv.key];

                let textDiv = document.createElement("div");
                textDiv.className = "achv-text-div";

                let nameDiv = this.createTextDiv(achv.name);
                nameDiv.className = "achv-name-div";
                textDiv.appendChild(nameDiv);

                let mottoDiv = this.createTextDiv("\"" + achv.motto + "\"");
                mottoDiv.className = "achv-motto-div";
                textDiv.appendChild(mottoDiv);

                let descDiv = this.createTextDiv(achv.description);
                descDiv.className = "achv-desc-div";
                textDiv.appendChild(descDiv);

                achvDiv.appendChild(img);
                achvDiv.appendChild(textDiv);
                this.achievementsDiv.appendChild(achvDiv);
            });
        }

        constructor() {
            this.createRecipes();
            this.createAchievements();
        }

    }

}