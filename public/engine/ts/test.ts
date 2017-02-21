///<reference path='lib/createjs/createjs.d.ts'/>

namespace Lich {

    export class Test {

        private canvas: HTMLCanvasElement;
        private stage: createjs.SpriteStage;
        private content: SheetContainer;

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
            // antialising = true (3. argument) značně zhorší FPS
            self.stage = new createjs.SpriteStage(self.canvas, false, false);
            let webGL = !(!self.canvas.getContext('webgl'));

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

                if (self.text) {
                    self.text.text = Math.floor(createjs.Ticker.getMeasuredFPS()) + " " + (webGL ? "WebGL" : "No-WebGL");
                }

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
                let container = new SheetContainer();
                // 20 000 ~ 40 FPS
                // 10 000 ~ 54 FPS
                // 5 000 ~ 59 FPS
                // for (let i = 0; i < 5000; i++) {
                //     let sprite = Resources.getInstance().getSprite(SpritesheetKey.SPST_TILES_KEY, "fireplace");
                //     sprite.gotoAndPlay("fireplace" + "-FRAGMENT-" + Math.floor(Math.random() * 4) + "-" + Math.floor(Math.random() * 2));
                //     container.addChild(sprite);
                //     sprite.x = Math.random() * (self.canvas.width - 16);
                //     sprite.y = Math.random() * (self.canvas.height - 16);
                //     sprite["xs"] = Math.random() * 300 + 50;
                //     sprite["ys"] = Math.random() * 300 + 50;
                //     self.sprites.push(sprite);
                // }

                // Test volného objektu (nepřátel, projektilu)
                let sprite = Resources.getInstance().getAnimatedObjectSprite(AnimationSetKey.LICH_ANIMATION_KEY);
                // let sprite = Resources.getInstance().getAnimatedObjectSprite(AnimationSetKey.BUNNY_ANIMATION_KEY);
                // sprite.gotoAndPlay(AnimationKey[AnimationKey.ANM_BUNNY_EATL_KEY]);
                // AnimationKey.ANM_BUNNY_JUMPR_KEY
                sprite.x = 50;
                sprite.y = 50;
                container.addChild(sprite);

                // Test volného objektu (inventárního objektu)
                let sprite2 = Resources.getInstance().getInvObjectSprite(InventoryKey.INV_BOOKSHELF_KEY);
                sprite2.x = 100;
                sprite2.y = 50;
                container.addChild(sprite2);

                // Test povrchu 
                let container2 = new SheetContainer();
                let sprite3 = Resources.getInstance().getSurfaceTileSprite(SurfaceKey.SRFC_TRANS_DIRT_ROCK_KEY, 0);
                sprite3.x = 10;
                sprite3.y = 100;
                container2.addChild(sprite3);

                // Test pozadí povrchu
                let sprite4 = Resources.getInstance().getSurfaceBgrTileSprite(SurfaceBgrKey.SRFC_BGR_BRICK_KEY, 0);
                sprite4.x = 50;
                sprite4.y = 100;
                container2.addChild(sprite4);

                // Test animovaného mapového objektu
                let sprite5 = Resources.getInstance().getMapObjectTileSprite(MapObjectKey.MAP_FIREPLACE_KEY, 0);
                sprite5.x = 100;
                sprite5.y = 100;
                container2.addChild(sprite5);

                // Test statického mapového objektu
                let sprite6 = Resources.getInstance().getMapObjectTileSprite(MapObjectKey.MAP_XMAS_CHAIN_KEY, 2);
                sprite6.x = 50;
                sprite6.y = 150;
                container2.addChild(sprite6);

                // Test statického mapového objektu
                let sprite7 = Resources.getInstance().getFogSprite(2);
                sprite7.x = 100;
                sprite7.y = 150;
                container2.addChild(sprite7);

                // Test textu
                let container3 = new SheetContainer();
                self.text = Resources.getInstance().getText("");
                container3.addChild(self.text);
                self.text.x = 10;
                self.text.y = 10;
                self.text.scaleX = self.text.scaleY = 1.5;

                self.stage.updateViewport(self.canvas.width, self.canvas.height);
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
