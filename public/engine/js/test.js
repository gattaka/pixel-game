///<reference path='lib/createjs/createjs.d.ts'/>
var Lich;
(function (Lich) {
    var Test = (function () {
        function Test(canvasId) {
            this.sprites = Array();
            var self = this;
            /*------------*/
            /* Stage init */
            /*------------*/
            console.log("running");
            self.canvas = document.getElementById(canvasId);
            self.canvas.style.backgroundColor = "#cce1e8";
            // antialising = true (3. argument) značně zhorší FPS
            self.stage = new createjs.SpriteStage(self.canvas, false, false);
            var webGL = !(!self.canvas.getContext('webgl'));
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
                if (self.text) {
                    self.text.text = Math.floor(createjs.Ticker.getMeasuredFPS()) + " " + (webGL ? "WebGL" : "No-WebGL");
                }
                for (var i = 0; i < self.sprites.length; i++) {
                    var sprite = self.sprites[i];
                    sprite.x += sprite["xs"] * delta / 1000;
                    sprite.y += sprite["ys"] * delta / 1000;
                    if (sprite.x > self.canvas.width) {
                        sprite.x = self.canvas.width;
                        sprite["xs"] *= -1;
                    }
                    if (sprite.x < 0) {
                        sprite.x = 0;
                        sprite["xs"] *= -1;
                    }
                    if (sprite.y > self.canvas.height) {
                        sprite.y = self.canvas.height;
                        sprite["ys"] *= -1;
                    }
                    if (sprite.y < 50) {
                        sprite.y = 50;
                        sprite["ys"] *= -1;
                    }
                }
                self.stage.update();
            }
            var init = function () {
                // Test
                // let spriteSheet = new createjs.SpriteSheet({
                //     images: ["images/ui/inventory/inv_red_flask.png"],
                //     frames: { width: 32, height: 32 },
                // });
                var container = new createjs.SpriteContainer();
                // 20 000 ~ 40 FPS
                // 10 000 ~ 54 FPS
                // 5 000 ~ 59 FPS
                for (var i = 0; i < 5000; i++) {
                    var sprite = Lich.Resources.getInstance().getSprite(Lich.SpritesheetKey.SPST_TILES_KEY, "fireplace");
                    sprite.gotoAndPlay("fireplace" + "-FRAGMENT-" + Math.floor(Math.random() * 4) + "-" + Math.floor(Math.random() * 2));
                    container.addChild(sprite);
                    sprite.x = Math.random() * (self.canvas.width - 16);
                    sprite.y = Math.random() * (self.canvas.height - 16);
                    sprite["xs"] = Math.random() * 300 + 50;
                    sprite["ys"] = Math.random() * 300 + 50;
                    self.sprites.push(sprite);
                }
                var container3 = new createjs.SpriteContainer();
                self.text = Lich.Resources.getInstance().getText("");
                container3.addChild(self.text);
                self.text.x = 10;
                self.text.y = 10;
                self.text.scaleX = self.text.scaleY = 1.5;
                self.stage.updateViewport(self.canvas.width, self.canvas.height);
                self.stage.addChild(container);
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
