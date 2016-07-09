namespace Lich {
    export class Sector extends createjs.Container {

        public backgroundCont = new createjs.Container();
        public cachableCont = new createjs.Container();
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

            this.cachableCont.width = this.width;
            this.cachableCont.height = this.height;

            this.animatedCont.width = this.width;
            this.animatedCont.height = this.height;

            this.addChild(this.backgroundCont);
            this.addChild(this.cachableCont);
            this.addChild(this.animatedCont);
        }

        // override
        public cache(x: number, y: number, width: number, height: number, scale?: number): void {
            this.backgroundCont.cache(x, y, width, height);
            this.cachableCont.cache(x, y, width, height);
        }

        // override
        public updateCache(compositeOperation?: string): void {
            this.backgroundCont.updateCache();
            this.cachableCont.updateCache();
        }

        public addBackgroundChild(child) {
            this.backgroundCont.addChild(child);
        }

        public addCachableChild(child) {
            this.cachableCont.addChild(child);
        }

        public addAnimatedChild(child) {
            this.animatedCont.addChild(child);
        }

        public removeBackgroundChild(child) {
            this.backgroundCont.removeChild(child);
        }

        public removeCachableChild(child) {
            this.cachableCont.removeChild(child);
        }

        public removeAnimatedChild(child) {
            this.animatedCont.removeChild(child);
        }
    }
}