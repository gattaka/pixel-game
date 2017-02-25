namespace Lich {

    export abstract class AbstractSector extends PIXI.Container {

        public backgroundCont = new PIXI.Container();
        public cacheableCont = new PIXI.Container();
        public animatedCont = new PIXI.Container();

        constructor(
            public secId: number,
            public map_x: number,
            public map_y: number,
            public fixedWidth: number,
            public fixedHeight: number) {
            super();
        }
    }

    export class FogSector extends AbstractSector {
    }

    export class Sector extends AbstractSector {

        public backgroundCont = new PIXI.Container();
        public cacheableCont = new PIXI.Container();
        public animatedCont = new PIXI.Container();

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

            this.addChild(this.backgroundCont);
            this.addChild(this.cacheableCont);
            this.addChild(this.animatedCont);
        }

        // override
        public cache(x: number, y: number, width: number, height: number, scale?: number): void {
            // this.backgroundCont.cache(x, y, width, height);
            // this.cacheableCont.cache(x, y, width, height);
        }

        // override
        public updateCache(compositeOperation?: string): void {
            // this.backgroundCont.updateCache();
            // this.cacheableCont.updateCache();
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