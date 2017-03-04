namespace Lich {

    export abstract class AbstractSector extends PIXI.Container {

        constructor(
            public secId: number,
            public map_x: number,
            public map_y: number,
            public fixedWidth: number,
            public fixedHeight: number) {
            super();
        }

        protected cacheInner(cont: PIXI.Container, oldRendered: PIXI.Sprite): PIXI.Sprite {
            if (oldRendered)
                this.removeChild(oldRendered);

            // this represents your small canvas, it is a texture you can render a scene to then use as if it was a normal texture
            let renderedTexture = PIXI.RenderTexture.create(this.fixedWidth, this.fixedHeight);

            // instead of rendering your containerOfThings to the reeal scene, render it to the texture
            Game.CURRENT_GAME.renderer.render(cont, renderedTexture);

            // now you also have a sprite that uses that texture, rendered in the normal scene
            let newRendered = new PIXI.Sprite(renderedTexture);
            this.addChild(newRendered);
            return newRendered;
        }
    }

    export class Sector extends AbstractSector {

        public backgroundCont = new PIXI.Container();
        public cacheableCont = new PIXI.Container();
        public animatedCont = new PIXI.Container();

        public backgroundRendered: PIXI.Sprite;
        public cacheableRendered: PIXI.Sprite;

        constructor(
            public secId: number,
            public map_x: number,
            public map_y: number,
            public fixedWidth: number,
            public fixedHeight: number) {
            super(secId, map_x, map_y, fixedWidth, fixedHeight);

            this.backgroundCont.fixedWidth = this.fixedWidth;
            this.backgroundCont.fixedHeight = this.fixedHeight;

            this.cacheableCont.fixedWidth = this.fixedWidth;
            this.cacheableCont.fixedHeight = this.fixedHeight;

            this.animatedCont.fixedWidth = this.fixedWidth;
            this.animatedCont.fixedHeight = this.fixedHeight;

            this.addChild(this.animatedCont);
        }

        public cache(): void {
            this.backgroundRendered = this.cacheInner(this.backgroundCont, this.backgroundRendered);
            this.cacheableRendered = this.cacheInner(this.cacheableCont, this.cacheableRendered);
        }

        public addBackgroundChild(child) {
            this.backgroundCont.addChild(child);
        }

        public addCacheableChild(child) {
            this.cacheableCont.addChild(child);
        }

        public addAnimatedChild(child) {
            this.animatedCont.addChild(child);
        }

        public removeBackgroundChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
            return this.backgroundCont.removeChild(child);
        }

        public removeCacheableChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
            return this.cacheableCont.removeChild(child);
        }

        public removeAnimatedChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
            return this.animatedCont.removeChild(child);
        }
    }
}