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
            var testShader = new PIXI.Filter("attribute vec3 aVertexPosition;\n                attribute vec4 aVertexColor;\n                \n                uniform mat4 uMVMatrix;\n                uniform mat4 uPMatrix;\n                \n                varying lowp vec4 vColor;\n                \n                void main(void) {\n                    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n                    vColor = aVertexColor;\n                }", "varying lowp vec4 vColor;\n\n                void main(void) {\n                    gl_FragColor = vColor;\n                }");
            // "nosný" sprite
            var sprite = PIXI.Sprite.fromImage("http://www.goodboydigital.com/pixijs/pixi_v3_github-pad.png");
            sprite.fixedWidth = 200;
            sprite.fixedHeight = 200;
            sprite.x = 50;
            sprite.y = 50;
            sprite.filters = [testShader];
            stage.addChild(sprite);
            var vertices = [
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, -1.0, 0.0
            ];
            var colors = [
                1.0, 1.0, 1.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0 // blue
            ];
            var ticker = PIXI.ticker.shared;
            ticker.add(function () {
                stats.begin();
                testShader.uniforms.vertices = new Float32Array(vertices);
                testShader.uniforms.colors = new Float32Array(colors);
                renderer.render(stage);
                stats.end();
            });
        }
        return Test;
    }());
    Lich.Test = Test;
})(Lich || (Lich = {}));
