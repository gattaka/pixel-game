///<reference path='lib/pixi/pixi.js.d.ts'/>
var Lich;
(function (Lich) {
    var Test = (function () {
        function Test() {
            var type = "WebGL";
            if (!PIXI.utils.isWebGLSupported()) {
                type = "canvas";
            }
            PIXI.utils.sayHello(type);
            // Create the renderer
            var renderer = new PIXI.WebGLRenderer();
            renderer.view.style.position = "absolute";
            renderer.view.style.display = "block";
            renderer.backgroundColor = 0xfafaea;
            renderer.view.style.border = "1px dashed black";
            renderer.autoResize = true;
            renderer.resize(window.innerWidth - 2, window.innerHeight - 2);
            // Add the canvas to the HTML document
            document.body.appendChild(renderer.view);
            var loader = PIXI.loader;
            var resources = PIXI.loader.resources;
            loader
                .add([
                "images/anm_blast.png"
            ])
                .on("progress", function (loader, resource) {
                console.log("loading: " + resource.url);
                console.log("progress: " + loader.progress + "%");
            })
                .load(function () {
                // Create a container object called the `stage`
                var stage = new PIXI.Container();
                var texture = resources["images/anm_blast.png"].texture;
                // create an array of textures from an image path
                var frames = [];
                for (var i = 0; i < 5; i++) {
                    var frameTex = new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i * 60, 0, 60, 60));
                    frames.push(frameTex);
                }
                var anim = new PIXI.extras.AnimatedSprite(frames);
                anim.x = 150;
                anim.y = 150;
                anim.anchor.set(0.5); // rotate anchor
                anim.animationSpeed = 0.2;
                anim.play();
                stage.addChild(anim);
                function gameLoop(time) {
                    requestAnimationFrame(gameLoop);
                    anim.rotation += 0.01;
                    renderer.render(stage);
                }
                // Start the game loop
                // Loop this function at 60 frames per second
                gameLoop();
            });
        }
        ;
        return Test;
    }());
    Lich.Test = Test;
})(Lich || (Lich = {}));
