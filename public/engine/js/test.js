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
            var renderer = new PIXI.WebGLRenderer();
            renderer.view.style.position = "absolute";
            renderer.view.style.display = "block";
            renderer.backgroundColor = 0xfafaea;
            renderer.view.style.border = "1px dashed black";
            renderer.autoResize = true;
            renderer.resize(window.innerWidth - 2, window.innerHeight - 2);
            // Add the canvas to the HTML document
            document.body.appendChild(renderer.view);
            // Create a container object called the `stage`
            var stage = new PIXI.Container();
            var bgrSprites = [];
            var srfcBgrSpriteCont = new PIXI.Container();
            var srfcSpriteCont = new PIXI.Container();
            var mixSprite;
            var fogSpriteCont;
            var lichSprite;
            var init = function () {
                var w = window.innerWidth / Lich.Resources.TILE_SIZE;
                var h = window.innerHeight / Lich.Resources.TILE_SIZE;
                // let srfcBgrSpriteCont = new PIXI.particles.ParticleContainer(w * h, {
                //     scale: false,
                //     position: true,
                //     rotation: false,
                //     uvs: false,
                //     alpha: true
                // });
                var bgrSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_FAR_MOUNTAIN_KEY, renderer.view.width);
                bgrSprites.push(bgrSprite);
                stage.addChild(bgrSprite);
                bgrSprite = Lich.Resources.getInstance().getBackgroundSprite(Lich.BackgroundKey.BGR_WOODLAND1_KEY, renderer.view.width);
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
                lichSprite = Lich.Resources.getInstance().getAnimatedObjectSprite(Lich.AnimationSetKey.LICH_ANIMATION_KEY);
                lichSprite.x = window.innerWidth / 2;
                lichSprite.y = window.innerHeight / 2;
                stage.addChild(lichSprite);
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
            Lich.Keyboard.on(37, function () { fogSpriteCont.vx = -200; }, function () { fogSpriteCont.vx = 0; });
            Lich.Keyboard.on(39, function () { fogSpriteCont.vx = 200; }, function () { fogSpriteCont.vx = 0; });
            var ticker = PIXI.ticker.shared;
            ticker.add(function () {
                stats.begin();
                bgrSprites.forEach(function (bgrSprite) {
                    bgrSprite.tilePosition.x += 1;
                });
                // nic
                // srfcSpriteCont.x += 1;
                if (mixSprite)
                    mixSprite.x += 1;
                if (fogSpriteCont && fogSpriteCont.vx)
                    fogSpriteCont.x += ticker.elapsedMS / 1000 * fogSpriteCont.vx;
                if (lichSprite) {
                    if (lichSprite.currentAnimation != Lich.AnimationKey[Lich.AnimationKey.ANM_HERO_JUMPL_KEY])
                        lichSprite.gotoAndPlay(Lich.AnimationKey[Lich.AnimationKey.ANM_HERO_JUMPL_KEY]);
                }
                renderer.render(stage);
                stats.end();
            });
        }
        return Test;
    }());
    Lich.Test = Test;
})(Lich || (Lich = {}));
