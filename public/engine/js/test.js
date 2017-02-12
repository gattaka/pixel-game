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
            function handleTick(event) {
                var delta = event.delta;
                if (self.text)
                    self.text.text = createjs.Ticker.getMeasuredFPS() + "";
                self.stage.update();
            }
            var init = function () {
                // Test
                // let spriteSheet = new createjs.SpriteSheet({
                //     images: ["images/ui/inventory/inv_red_flask.png"],
                //     frames: { width: 32, height: 32 },
                // });
                var container = new createjs.SpriteContainer();
                var sprite = Lich.Resources.getInstance().getSprite(Lich.SpritesheetKey.SPST_TILES_KEY, "fireplace");
                sprite.gotoAndPlay("fireplace" + "-FRAGMENT-" + 0 + "-" + 0);
                container.addChild(sprite);
                container.x = 0;
                container.y = 0;
                sprite.x = 100;
                var container2 = new createjs.SpriteContainer();
                var sprite2 = Lich.Resources.getInstance().getSprite(Lich.SpritesheetKey.SPST_TILES_KEY, "fireplace");
                sprite2.gotoAndPlay("fireplace" + "-FRAGMENT-" + 1 + "-" + 0);
                container2.addChild(sprite2);
                container2.x = 200;
                sprite2.x = 0;
                sprite2.y = 0;
                var sprite3 = Lich.Resources.getInstance().getSprite(Lich.SpritesheetKey.SPST_TILES_KEY, "fireplace");
                sprite3.gotoAndPlay("fireplace" + "-FRAGMENT-" + 1 + "-" + 1);
                container2.addChild(sprite3);
                sprite3.x = 0;
                sprite3.y = 16;
                var container3 = new createjs.SpriteContainer();
                self.text = Lich.Resources.getInstance().getText("");
                container3.addChild(self.text);
                container3.x = 100;
                container3.y = 50;
                createjs.Tween.get(container2)
                    .to({
                    x: 300
                }, 1500).to({
                    x: 200
                }, 1500).loop = true;
                self.stage.updateViewport(800, 600);
                self.stage.addChild(container);
                self.stage.addChild(container2);
                self.stage.addChild(container3);
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
        ;
        return Test;
    }());
    Lich.Test = Test;
})(Lich || (Lich = {}));
