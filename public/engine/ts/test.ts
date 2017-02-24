///<reference path='lib/pixi/pixi.js.d.ts'/>

namespace Lich {

    declare class Stats {
        dom;
        constructor();
        showPanel(n: number);
        begin();
        end();
    };

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
            let renderer = new PIXI.WebGLRenderer();
            renderer.view.style.position = "absolute";
            renderer.view.style.display = "block";
            renderer.backgroundColor = 0xfafaea;
            renderer.view.style.border = "1px dashed black";
            renderer.autoResize = true;
            renderer.resize(window.innerWidth - 2, window.innerHeight - 2);

            // Add the canvas to the HTML document
            document.body.appendChild(renderer.view);

            // Create a container object called the `stage`
            let stage = new PIXI.Container();

            let bgrSprites = [];

            let init = () => {
                let w = window.innerWidth / Resources.TILE_SIZE;
                let h = window.innerHeight / Resources.TILE_SIZE;

                // let srfcBgrSpriteCont = new PIXI.particles.ParticleContainer(w * h, {
                //     scale: false,
                //     position: true,
                //     rotation: false,
                //     uvs: false,
                //     alpha: true
                // });

                let bgrSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_FAR_MOUNTAIN_KEY);
                bgrSprite.width = renderer.width;
                bgrSprites.push(bgrSprite);
                stage.addChild(bgrSprite);

                bgrSprite = Resources.getInstance().getBackgroundSprite(BackgroundKey.BGR_WOODLAND1_KEY);
                bgrSprite.width = renderer.width;
                bgrSprites.push(bgrSprite);
                stage.addChild(bgrSprite);

                let srfcBgrSpriteCont = new PIXI.Container();
                for (let i = 0; i < w; i++) {
                    for (let j = 0; j < h; j++) {
                        if (Math.random() < 0.2) continue;
                        let srfcBgrSprite = Resources.getInstance().getSurfaceBgrTileSprite(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY, Math.floor(Math.random() * 42));
                        srfcBgrSprite.x = i * Resources.TILE_SIZE;
                        srfcBgrSprite.y = j * Resources.TILE_SIZE;
                        srfcBgrSpriteCont.addChild(srfcBgrSprite);
                    }
                }
                stage.addChild(srfcBgrSpriteCont);

                let srfcSpriteCont = new PIXI.Container();
                for (let i = 0; i < w; i++) {
                    for (let j = 0; j < h; j++) {
                        if (Math.random() < 0.2) continue;
                        let srfcSprite = Resources.getInstance().getSurfaceTileSprite(SurfaceKey.SRFC_GOLD_KEY, Math.floor(Math.random() * 42));
                        srfcSprite.x = i * Resources.TILE_SIZE;
                        srfcSprite.y = j * Resources.TILE_SIZE;
                        srfcSpriteCont.addChild(srfcSprite);
                    }
                }
                stage.addChild(srfcSpriteCont);

                w = window.innerWidth / Resources.PARTS_SIZE;
                h = window.innerHeight / Resources.PARTS_SIZE;
                let fogSpriteCont = new PIXI.Container();
                for (let i = 0; i < w; i++) {
                    for (let j = 0; j < h; j++) {
                        if (Math.random() < 0.2) continue;
                        let fogSprite = Resources.getInstance().getFogSprite(Math.floor(Math.random() * 18));
                        fogSprite.x = i * Resources.PARTS_SIZE;
                        fogSprite.y = j * Resources.PARTS_SIZE;
                        fogSpriteCont.addChild(fogSprite);
                    }
                }
                stage.addChild(fogSpriteCont);

                for (let i = 0; i < 2000; i++) {
                    let sprite = Resources.getInstance().getMapObjectTileSprite(MapObjectKey.MAP_FIREPLACE_KEY, Math.floor(Math.random() * 4));
                    sprite.x = Math.random() * window.innerWidth - Resources.TILE_SIZE;
                    sprite.y = Math.random() * window.innerHeight - Resources.TILE_SIZE;
                    stage.addChild(sprite);
                }

                for (let i = 0; i < 2000; i++) {
                    let sprite = Resources.getInstance().getMapObjectTileSprite(MapObjectKey.MAP_TREE3_KEY, Math.floor(Math.random() * 4));
                    sprite.x = Math.random() * window.innerWidth - Resources.TILE_SIZE;
                    sprite.y = Math.random() * window.innerHeight - Resources.TILE_SIZE;
                    stage.addChild(sprite);
                }

                for (let i = 0; i < 10; i++) {
                    let sprite = Resources.getInstance().getInvObjectSprite(InventoryKey.INV_BOOKSHELF_KEY);
                    sprite.x = Math.random() * window.innerWidth - Resources.TILE_SIZE;
                    sprite.y = Math.random() * window.innerHeight - Resources.TILE_SIZE;
                    stage.addChild(sprite);
                }

                for (let i = 0; i < 10; i++) {
                    let sprite = Resources.getInstance().getAnimatedObjectSprite(AnimationSetKey.LICH_ANIMATION_KEY);
                    sprite.x = Math.random() * window.innerWidth - Resources.TILE_SIZE;
                    sprite.y = Math.random() * window.innerHeight - Resources.TILE_SIZE;
                    stage.addChild(sprite);
                }
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

            function gameLoop(time?: number) {
                stats.begin();

                bgrSprites.forEach(bgrSprite => {
                    bgrSprite.tilePosition.x += 1;
                });

                requestAnimationFrame(gameLoop);
                renderer.render(stage);

                stats.end();
            }
            // Start the game loop
            // Loop this function at 60 frames per second
            gameLoop();
        }
    }
}
