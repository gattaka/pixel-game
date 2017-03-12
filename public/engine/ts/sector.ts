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
            Game.getInstance().renderer.render(cont, renderedTexture);

            // now you also have a sprite that uses that texture, rendered in the normal scene
            let newRendered = new PIXI.Sprite(renderedTexture);
            this.addChild(newRendered);
            return newRendered;
        }
    }

    export class SectorCont extends PIXI.Container {
        constructor(public sector: Sector) { super(); }
    }

    export class Sector extends AbstractSector {

        public cacheableCont: SectorCont;
        public animatedCont: SectorCont;

        public cacheableRendered: PIXI.Sprite;

        constructor(
            public secId: number,
            public map_x: number,
            public map_y: number,
            public fixedWidth: number,
            public fixedHeight: number) {
            super(secId, map_x, map_y, fixedWidth, fixedHeight);

            this.cacheableCont = new SectorCont(this);
            this.cacheableCont.fixedWidth = this.fixedWidth;
            this.cacheableCont.fixedHeight = this.fixedHeight;

            this.animatedCont = new SectorCont(this);
            this.animatedCont.fixedWidth = this.fixedWidth;
            this.animatedCont.fixedHeight = this.fixedHeight;

            this.addChild(this.animatedCont);
        }

        public cache(): void {
            this.cacheableRendered = this.cacheInner(this.cacheableCont, this.cacheableRendered);
            this.setChildIndex(this.cacheableRendered, 0);
            this.setChildIndex(this.animatedCont, 1);
        }

        public addCacheableChild(child) {
            this.cacheableCont.addChild(child);
        }

        public addAnimatedChild(child) {
            this.animatedCont.addChild(child);
        }

        public removeCacheableChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
            return this.cacheableCont.removeChild(child);
        }

        public removeAnimatedChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
            return this.animatedCont.removeChild(child);
        }
    }
}