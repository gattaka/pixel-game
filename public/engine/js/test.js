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
            var width = window.innerWidth;
            var height = window.innerHeight;
            var renderer = new PIXI.WebGLRenderer(width, height);
            document.body.appendChild(renderer.view);
            var stage = new PIXI.Container();
            // var testShader = new PIXI.Filter(
            //     `attribute vec3 aVertexPosition;
            //     attribute vec4 aVertexColor;
            //     uniform mat4 uMVMatrix;
            //     uniform mat4 uPMatrix;
            //     varying lowp vec4 vColor;
            //     void main(void) {
            //         gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            //         vColor = aVertexColor;
            //     }`,
            //     `varying lowp vec4 vColor;
            //     void main(void) {
            //         gl_FragColor = vColor;
            //     }`);
            // // "nosný" sprite
            // var sprite = PIXI.Sprite.fromImage("http://www.goodboydigital.com/pixijs/pixi_v3_github-pad.png");
            // sprite.fixedWidth = 200;
            // sprite.fixedHeight = 200;
            // sprite.x = 50;
            // sprite.y = 50;
            // sprite.filters = [testShader];
            // stage.addChild(sprite);
            // var vertices = [
            //     1.0, 1.0, 0.0,
            //     -1.0, 1.0, 0.0,
            //     1.0, -1.0, 0.0,
            //     -1.0, -1.0, 0.0
            // ];
            // var colors = [
            //     1.0, 1.0, 1.0, 1.0,    // white
            //     1.0, 0.0, 0.0, 1.0,    // red
            //     0.0, 1.0, 0.0, 1.0,    // green
            //     0.0, 0.0, 1.0, 1.0     // blue
            // ];
            var interval = 500;
            var side = 200;
            var size = 1;
            var count = interval;
            var g = new PIXI.Graphics();
            stage.addChild(g);
            g.beginFill(0xffffff);
            g.drawRect(0, 0, side, side);
            g.fixedHeight = side;
            g.fixedWidth = side;
            g.x = 100;
            g.y = 100;
            var randColorValue = function () {
                return Math.floor(Math.random() * 256);
            };
            var randColor = function () {
                return PIXI.utils.rgb2hex([randColorValue(), randColorValue(), randColorValue()]);
            };
            var iter = 0;
            var filter = new PIXI.filters.ColorMatrixFilter();
            g.filters = [filter];
            var ticker = PIXI.ticker.shared;
            ticker.add(function () {
                stats.begin();
                // testShader.uniforms.vertices = new Float32Array(vertices);
                // testShader.uniforms.colors = new Float32Array(colors);
                count -= ticker.elapsedMS;
                if (count <= 0) {
                    var arr = [];
                    for (var y = 0; y < side; y++) {
                        arr[y] = [];
                        for (var x = 0; x < side; x++) {
                            arr[y][x] = randColor();
                        }
                    }
                }
                iter += 0.1;
                renderer.render(stage);
                stats.end();
            });
        }
        return Test;
    }());
    Lich.Test = Test;
})(Lich || (Lich = {}));
