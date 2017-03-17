///<reference path='lib/pixi/pixi.js.d.ts'/>

namespace Lich {

    declare class Stats {
        dom;
        constructor();
        showPanel(n: number);
        begin();
        end();
    };

    declare var SHADER;

    export class Test {

        constructor() {

            var stats = new Stats();
            stats.showPanel(0);
            document.body.appendChild(stats.dom);

            let type = "WebGL"
            if (!PIXI.utils.isWebGLSupported()) {
                type = "canvas"
            }

            PIXI.utils.sayHello(type);

            // Create the renderer
            var width = window.innerWidth;
            var height = window.innerHeight;
            let renderer = new PIXI.WebGLRenderer(width, height);
            document.body.appendChild(renderer.view);

            let stage = new PIXI.Container();

            var testShader = new PIXI.Filter(
                `attribute vec3 aVertexPosition;
                attribute vec4 aVertexColor;
                
                uniform mat4 uMVMatrix;
                uniform mat4 uPMatrix;
                
                varying lowp vec4 vColor;
                
                void main(void) {
                    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                    vColor = aVertexColor;
                }`,
                `varying lowp vec4 vColor;

                void main(void) {
                    gl_FragColor = vColor;
                }`);

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
                1.0, 1.0, 1.0, 1.0,    // white
                1.0, 0.0, 0.0, 1.0,    // red
                0.0, 1.0, 0.0, 1.0,    // green
                0.0, 0.0, 1.0, 1.0     // blue
            ];

            let ticker = PIXI.ticker.shared;
            ticker.add(() => {
                stats.begin();

                testShader.uniforms.vertices = new Float32Array(vertices);
                testShader.uniforms.colors = new Float32Array(colors);

                renderer.render(stage);
                stats.end();
            });
        }
    }
}
