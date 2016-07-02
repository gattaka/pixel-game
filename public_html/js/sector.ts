namespace Lich {
    export class Sector extends createjs.Container {

        public cachableCont = new createjs.Container();
        public animatedCont = new createjs.Container();

        constructor(
            public secId: number,
            public map_x: number,
            public map_y: number,
            public width: number,
            public height: number) {
            super();

            this.cachableCont.width = this.width;
            this.cachableCont.height = this.height;

            this.animatedCont.width = this.width;
            this.animatedCont.height = this.height;

            this.addChild(this.animatedCont);
            this.addChild(this.cachableCont);
        }

        // override
        public cache(x: number, y: number, width: number, height: number, scale?: number): void {
            this.cachableCont.cache(x, y, width, height);
        }

        // override
        public updateCache(compositeOperation?: string): void {
            this.cachableCont.updateCache();
        }

        public addCachableChild(child) {
            this.cachableCont.addChild(child);
        }

        public addAnimatedChild(child) {
            this.animatedCont.addChild(child);
        }

        public removeCachableChild(child) {
            this.cachableCont.removeChild(child);
        }

        public removeAnimatedChild(child) {
            this.animatedCont.removeChild(child);
        }
    }
}