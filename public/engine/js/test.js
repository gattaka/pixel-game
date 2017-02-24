///<reference path='lib/pixi/pixi.js.d.ts'/>
var Lich;
(function (Lich) {
    ;
    var Test = (function () {
        function Test() {
            var stats = new Stats();
            stats.showPanel(0);
            document.body.appendChild(stats.dom);
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
            // Create a container object called the `stage`
            var stage = new PIXI.Container();
            function gameLoop(time) {
                stats.begin();
                requestAnimationFrame(gameLoop);
                renderer.render(stage);
                stats.end();
            }
            // Start the game loop
            // Loop this function at 60 frames per second
            gameLoop();
            var init = function () {
                var w = window.innerWidth / Lich.Resources.TILE_SIZE;
                var h = window.innerHeight / Lich.Resources.TILE_SIZE;
                // let srfcBgrSpriteCont = new PIXI.particles.ParticleContainer(w * h, {
                //     scale: false,
                //     position: true,
                //     rotation: false,
                //     uvs: false,
                //     alpha: true
                // });
                var srfcBgrSpriteCont = new PIXI.Container();
                for (var i = 0; i < w; i++) {
                    for (var j = 0; j < h; j++) {
                        var srfcBgrSprite = Lich.Resources.getInstance().getSurfaceBgrTileSprite(Lich.SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY, Math.floor(Math.random() * 42));
                        srfcBgrSprite.x = i * Lich.Resources.TILE_SIZE;
                        srfcBgrSprite.y = j * Lich.Resources.TILE_SIZE;
                        srfcBgrSpriteCont.addChild(srfcBgrSprite);
                    }
                }
                stage.addChild(srfcBgrSpriteCont);
                var srfcSpriteCont = new PIXI.Container();
                for (var i = 0; i < w; i++) {
                    for (var j = 0; j < h; j++) {
                        var srfcSprite = Lich.Resources.getInstance().getSurfaceTileSprite(Lich.SurfaceKey.SRFC_GOLD_KEY, Math.floor(Math.random() * 42));
                        srfcSprite.x = i * Lich.Resources.TILE_SIZE;
                        srfcSprite.y = j * Lich.Resources.TILE_SIZE;
                        srfcSpriteCont.addChild(srfcSprite);
                    }
                }
                stage.addChild(srfcSpriteCont);
                w = window.innerWidth / Lich.Resources.PARTS_SIZE;
                h = window.innerHeight / Lich.Resources.PARTS_SIZE;
                var fogSpriteCont = new PIXI.Container();
                for (var i = 0; i < w; i++) {
                    for (var j = 0; j < h; j++) {
                        var fogSprite = Lich.Resources.getInstance().getFogSprite(Math.floor(Math.random() * 18));
                        fogSprite.x = i * Lich.Resources.PARTS_SIZE;
                        fogSprite.y = j * Lich.Resources.PARTS_SIZE;
                        fogSpriteCont.addChild(fogSprite);
                    }
                }
                stage.addChild(fogSpriteCont);
            };
            if (Lich.Resources.getInstance().isLoaderDone()) {
                init();
            }
            else {
                var listener_1;
                Lich.EventBus.getInstance().registerConsumer(Lich.EventType.LOAD_FINISHED, listener_1 = function () {
                    init();
                    Lich.EventBus.getInstance().unregisterConsumer(Lich.EventType.LOAD_FINISHED, listener_1);
                    return false;
                });
            }
        }
        return Test;
    }());
    Lich.Test = Test;
})(Lich || (Lich = {}));
