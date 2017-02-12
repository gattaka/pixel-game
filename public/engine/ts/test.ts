///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {

    export class Test {

        private canvas: HTMLCanvasElement;
        private stage: createjs.SpriteStage;
        private content: createjs.SpriteContainer;

        private text: createjs.BitmapText;

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
                    self.text.text = createjs.Ticker.getMeasuredFPS() + "";
                self.stage.update();
            }

            let init = () => {
                // Test

                // let spriteSheet = new createjs.SpriteSheet({
                //     images: ["images/ui/inventory/inv_red_flask.png"],
                //     frames: { width: 32, height: 32 },
                // });
                let container = new createjs.SpriteContainer();
                let sprite = Resources.getInstance().getSprite(SpritesheetKey.SPST_TILES_KEY, "fireplace");
                sprite.gotoAndPlay("fireplace" + "-FRAGMENT-" + 0 + "-" + 0);
                container.addChild(sprite);
                container.x = 0;
                container.y = 0;
                sprite.x = 100;

                let container2 = new createjs.SpriteContainer();
                let sprite2 = Resources.getInstance().getSprite(SpritesheetKey.SPST_TILES_KEY, "fireplace");
                sprite2.gotoAndPlay("fireplace" + "-FRAGMENT-" + 1 + "-" + 0);
                container2.addChild(sprite2);
                container2.x = 200;
                sprite2.x = 0;
                sprite2.y = 0;

                let sprite3 = Resources.getInstance().getSprite(SpritesheetKey.SPST_TILES_KEY, "fireplace");
                sprite3.gotoAndPlay("fireplace" + "-FRAGMENT-" + 1 + "-" + 1);
                container2.addChild(sprite3);
                sprite3.x = 0;
                sprite3.y = 16;

                let container3 = new createjs.SpriteContainer();
                self.text = Resources.getInstance().getText("");
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
