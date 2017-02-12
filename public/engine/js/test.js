///<reference path='lib/createjs/createjs.d.ts'/>
var Lich;
(function (Lich) {
    var Test = (function () {
        function Test(canvasId) {
            var self = this;
            /*------------*/
            /* Stage init */
            /*------------*/
            console.log("running");
            self.canvas = document.getElementById(canvasId);
            self.canvas.style.backgroundColor = "#cce1e8";
            self.stage = new createjs.SpriteStage(self.canvas);
            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeCanvas, false);
            function resizeCanvas() {
                self.canvas.width = window.innerWidth;
                self.canvas.height = window.innerHeight;
            }
            resizeCanvas();
            /*-----------*/
            /* Time init */
            /*-----------*/
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", handleTick);
            createjs.Ticker.setFPS(60);
            // Test
            var spriteSheet = new createjs.SpriteSheet({
                images: ["images/ui/inventory/inv_red_flask.png"],
                frames: { width: 32, height: 32 }
            });
            var sprite = new createjs.Sprite(spriteSheet);
            var container = new createjs.SpriteContainer(spriteSheet);
            container.addChild(sprite);
            container.x = 100;
            var spriteSheet2 = new createjs.SpriteSheet({
                framerate: 10,
                images: ["images/parts/fireplace.png"],
                frames: {
                    regX: 0,
                    height: 32,
                    count: 4,
                    regY: 0,
                    width: 64
                },
                animations: {
                    "idle": [0, 3, "idle", 0.2]
                }
            });
            var sprite2 = new createjs.Sprite(spriteSheet2, "idle");
            sprite2.gotoAndPlay("idle");
            var container2 = new createjs.SpriteContainer(spriteSheet2);
            container2.addChild(sprite2);
            container2.x = 200;
            createjs.Tween.get(container2)
                .to({
                x: 300
            }, 1500).to({
                x: 200
            }, 1500).loop = true;
            self.stage.updateViewport(800, 600);
            self.stage.addChild(container);
            self.stage.addChild(container2);
            function handleTick(event) {
                var delta = event.delta;
                self.stage.update();
            }
        }
        ;
        return Test;
    }());
    Lich.Test = Test;
})(Lich || (Lich = {}));
