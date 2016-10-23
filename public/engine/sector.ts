namespace Lich {
    export class Sector extends createjs.Container {

        public backgroundCont = new createjs.Container();
        public cacheableCont = new createjs.Container();
        public animatedCont = new createjs.Container();

        constructor(
            public secId: number,
            public map_x: number,
            public map_y: number,
            public width: number,
            public height: number) {
            super();

            this.backgroundCont.width = this.width;
            this.backgroundCont.height = this.height;

            this.cacheableCont.width = this.width;
            this.cacheableCont.height = this.height;

            this.animatedCont.width = this.width;
            this.animatedCont.height = this.height;

            this.addChild(this.backgroundCont);
            this.addChild(this.cacheableCont);
            this.addChild(this.animatedCont);
        }

        // override
        public cache(x: number, y: number, width: number, height: number, scale?: number): void {
            this.backgroundCont.cache(x, y, width, height);
            this.cacheableCont.cache(x, y, width, height);
        }

        // override
        public updateCache(compositeOperation?: string): void {
            this.backgroundCont.updateCache();
            this.cacheableCont.updateCache();
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

        public removeBackgroundChild(child): boolean {
            return this.backgroundCont.removeChild(child);
        }

        public removeCacheableChild(child): boolean {
            return this.cacheableCont.removeChild(child);
        }

        public removeAnimatedChild(child): boolean {
            return this.animatedCont.removeChild(child);
        }
    }
}