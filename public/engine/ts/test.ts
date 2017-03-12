///<reference path='lib/pixi/pixi.js.d.ts'/>
///<reference path='lib/preloadjs/preloadjs.d.ts'/>
///<reference path='lib/soundjs/soundjs.d.ts'/>
///<reference path='lib/tweenjs/tweenjs.d.ts'/>

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
            let srfcBgrSpriteCont = new PIXI.Container();
            let srfcSpriteCont = new PIXI.Container();
            let mixSprite;
            let fogSpriteCont;
            let lichSprite: AniSprite;

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

                let bgrSprite = Resources.getInstance().getParallaxSprite(ParallaxKey.PRLX_FAR_MOUNTAIN_KEY, renderer.view.width);
                bgrSprites.push(bgrSprite);
                stage.addChild(bgrSprite);

                bgrSprite = Resources.getInstance().getParallaxSprite(ParallaxKey.PRLX_WOODLAND1_KEY, renderer.view.width);
                bgrSprite.fixedWidth = renderer.width;
                bgrSprites.push(bgrSprite);
                stage.addChild(bgrSprite);

                // for (let i = 0; i < w; i++) {
                //     for (let j = 0; j < h; j++) {
                //         if (Math.random() < 0.2) continue;
                //         let srfcBgrSprite = Resources.getInstance().getSurfaceBgrTileSprite(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY, Math.floor(Math.random() * 42));
                //         srfcBgrSprite.x = i * Resources.TILE_SIZE;
                //         srfcBgrSprite.y = j * Resources.TILE_SIZE;
                //         srfcBgrSpriteCont.addChild(srfcBgrSprite);
                //     }
                // }
                // stage.addChild(srfcBgrSpriteCont);

                // let srfcSprite;
                // for (let i = 0; i < w; i++) {
                //     for (let j = 0; j < h; j++) {
                //         if (Math.random() < 0.2) continue;
                //         srfcSprite = Resources.getInstance().getSurfaceTileSprite(SurfaceKey.SRFC_GOLD_KEY, Math.floor(Math.random() * 42));
                //         srfcSprite.x = i * Resources.TILE_SIZE;
                //         srfcSprite.y = j * Resources.TILE_SIZE;
                //         srfcSpriteCont.addChild(srfcSprite);
                //     }
                // }
                // // this represents your small canvas, it is a texture you can render a scene to then use as if it was a normal texture
                // let baseRenderTexture = new PIXI.BaseRenderTexture(window.innerWidth - 2, window.innerHeight);
                // let smallTexture = new PIXI.RenderTexture(baseRenderTexture);

                // // instead of rendering your containerOfThings to the reeal scene, render it to the texture
                // renderer.render(srfcSpriteCont, smallTexture);

                // // now you also have a sprite that uses that texture, rendered in the normal scene
                // mixSprite = new PIXI.Sprite(smallTexture);
                // stage.addChild(mixSprite);

                // w = window.innerWidth / Resources.PARTS_SIZE;
                // h = window.innerHeight / Resources.PARTS_SIZE;
                // fogSpriteCont = new PIXI.Container();
                // for (let i = 0; i < w; i++) {
                //     for (let j = 0; j < h; j++) {
                //         if (Math.random() < 0.2) continue;
                //         let fogSprite = Resources.getInstance().getFogSprite(Math.floor(Math.random() * 18));
                //         fogSprite.x = i * Resources.PARTS_SIZE;
                //         fogSprite.y = j * Resources.PARTS_SIZE;
                //         fogSpriteCont.addChild(fogSprite);
                //     }
                // }
                // stage.addChild(fogSpriteCont);

                // for (let i = 0; i < 2000; i++) {
                //     let sprite = Resources.getInstance().getMapObjectTileSprite(MapObjectKey.MAP_FIREPLACE_KEY, Math.floor(Math.random() * 4));
                //     sprite.x = Math.random() * window.innerWidth - Resources.TILE_SIZE;
                //     sprite.y = Math.random() * window.innerHeight - Resources.TILE_SIZE;
                //     stage.addChild(sprite);
                // }

                // for (let i = 0; i < 2000; i++) {
                //     let sprite = Resources.getInstance().getMapObjectTileSprite(MapObjectKey.MAP_TREE3_KEY, Math.floor(Math.random() * 4));
                //     sprite.x = Math.random() * window.innerWidth - Resources.TILE_SIZE;
                //     sprite.y = Math.random() * window.innerHeight - Resources.TILE_SIZE;
                //     stage.addChild(sprite);
                // }

                // for (let i = 0; i < 10; i++) {
                //     let sprite = Resources.getInstance().getInvObjectSprite(InventoryKey.INV_BOOKSHELF_KEY);
                //     sprite.x = Math.random() * window.innerWidth - Resources.TILE_SIZE;
                //     sprite.y = Math.random() * window.innerHeight - Resources.TILE_SIZE;
                //     stage.addChild(sprite);
                // }

                lichSprite = Resources.getInstance().getAnimatedObjectSprite(AnimationSetKey.LICH_ANIMATION_KEY);
                lichSprite.x = window.innerWidth / 2;
                lichSprite.y = window.innerHeight / 2;
                stage.addChild(lichSprite);
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

            Keyboard.on(37, () => { fogSpriteCont.vx = -200 }, () => { fogSpriteCont.vx = 0 });
            Keyboard.on(39, () => { fogSpriteCont.vx = 200 }, () => { fogSpriteCont.vx = 0 });

            let ticker = PIXI.ticker.shared;
            ticker.add(() => {
                stats.begin();

                bgrSprites.forEach(bgrSprite => {
                    bgrSprite.tilePosition.x += 1;
                });

                // nic
                // srfcSpriteCont.x += 1;
                if (mixSprite)
                    mixSprite.x += 1;
                if (fogSpriteCont && fogSpriteCont.vx)
                    fogSpriteCont.x += ticker.elapsedMS / 1000 * fogSpriteCont.vx;

                if (lichSprite) {
                    if (lichSprite.currentAnimation != AnimationKey[AnimationKey.ANM_HERO_JUMPL_KEY])
                        lichSprite.gotoAndPlay(AnimationKey[AnimationKey.ANM_HERO_JUMPL_KEY]);
                }

                renderer.render(stage);

                stats.end();
            });
        }
    }
}
