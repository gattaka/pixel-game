namespace Lich {

    export class RecipeWeb {

        private imgMap = {};

        private createDiv(text: string): HTMLDivElement {
            let div: HTMLDivElement = document.createElement("div");
            div.innerText = text;
            return div;
        }

        private createImage(item: InventoryKey): HTMLImageElement {
            let img: HTMLImageElement = document.createElement("img");
            img.src = this.imgMap[item];
            return img;
        }

        constructor() {
            let mainDiv = <HTMLDivElement>document.getElementById("recipes-div");

            INVENTORY_PATHS.forEach((path) => {
                this.imgMap[path[1]] = path[0];
            });

            this.printFullList(mainDiv);
        }

        private printFullList(mainDiv: HTMLDivElement) {
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

                mainDiv.appendChild(outerDiv);
            }

            RECIPE_DEFS.forEach((recipe) => {
                buildRecipe(recipe);
            });
        }

    }

}