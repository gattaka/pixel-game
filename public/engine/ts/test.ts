///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {

    export class Test {

        private canvas: HTMLCanvasElement;
        private stage: createjs.SpriteStage;
        private content: createjs.SpriteContainer;

        private text: createjs.BitmapText;
        private sprites = Array<createjs.Sprite>();

        constructor(canvasId: string) {

            let self = this;

            /*------------*/
            /* Stage init */
            /*------------*/

            console.log("running");

            self.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
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
                let delta = event.delta;

                if (self.text)
                    self.text.text = Math.floor(createjs.Ticker.getMeasuredFPS()) + "";

                for (let i = 0; i < self.sprites.length; i++) {
                    let sprite = self.sprites[i];
                    sprite.x += sprite["xs"] * delta / 1000;
                    sprite.y += sprite["ys"] * delta / 1000;
                    if (sprite.x > self.canvas.width) { sprite.x = self.canvas.width; sprite["xs"] *= -1; }
                    if (sprite.x < 0) { sprite.x = 0; sprite["xs"] *= -1; }
                    if (sprite.y > self.canvas.height) { sprite.y = self.canvas.height; sprite["ys"] *= -1; }
                    if (sprite.y < 50) { sprite.y = 50; sprite["ys"] *= -1; }
                }

                self.stage.update();
            }

            let init = () => {
                // Test

                // let spriteSheet = new createjs.SpriteSheet({
                //     images: ["images/ui/inventory/inv_red_flask.png"],
                //     frames: { width: 32, height: 32 },
                // });
                let container = new createjs.SpriteContainer();
                for (let i = 0; i < 2000; i++) {
                    let sprite = Resources.getInstance().getSprite(SpritesheetKey.SPST_TILES_KEY, "fireplace");
                    sprite.gotoAndPlay("fireplace" + "-FRAGMENT-" + Math.floor(Math.random() * 4) + "-" + Math.floor(Math.random() * 2));
                    container.addChild(sprite);
                    sprite.x = Math.random() * (self.canvas.width - 16);
                    sprite.y = Math.random() * (self.canvas.height - 16);
                    sprite["xs"] = Math.random() * 300 + 50;
                    sprite["ys"] = Math.random() * 300 + 50;
                    self.sprites.push(sprite);
                }

                let container3 = new createjs.SpriteContainer();
                self.text = Resources.getInstance().getText("");
                container3.addChild(self.text);
                self.text.x = 10;
                self.text.y = 10;

                self.stage.updateViewport(self.canvas.width, self.canvas.height);
                self.stage.addChild(container);
                self.stage.addChild(container3);
            }

            if (Resources.getInstance().isLoaderDone()) {
                init();
            } else {
                let listener;
                EventBus.getInstance().registerConsumer(EventType.LOAD_FINISHED, listener = (): boolean => {
                    init();
                    EventBus.getInstance().unregisterConsumer(EventType.LOAD_FINISHED, listener);
                    return false;
                });
                // self.stage.addChild(self.loadUI = new LoaderUI(self));
            }
        };
    }
}
