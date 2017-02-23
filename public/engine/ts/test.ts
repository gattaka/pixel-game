///<reference path='lib/pixi/pixi.js.d.ts'/>

namespace Lich {

    export class Test {

        constructor() {
            let type = "WebGL"
            if (!PIXI.utils.isWebGLSupported()) {
                type = "canvas"
            }

            PIXI.utils.sayHello(type);

            // Create the renderer
            let renderer = new PIXI.WebGLRenderer();
            renderer.view.style.position = "absolute";
            renderer.view.style.display = "block";
            renderer.backgroundColor = 0xfafaea;
            renderer.view.style.border = "1px dashed black";
            renderer.autoResize = true;
            renderer.resize(window.innerWidth - 2, window.innerHeight - 2);

            // Add the canvas to the HTML document
            document.body.appendChild(renderer.view);

            // Create a container object called the `stage`
            let stage = new PIXI.Container();

            // Tell the `renderer` to `render` the `stage`
            renderer.render(stage);
        };
    }
}
