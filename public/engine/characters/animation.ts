namespace Lich {
    class Animation {
        constructor(
            public animation: string,
            public startFrame: number,
            public endFrame: number,
            public nextAnimation: string,
            public time: number) { }
    }

    export class Animations {
        animations = Array<Animation>();
        add(
            animation: string,
            startFrame: number,
            endFrame: number,
            nextAnimation: string,
            time: number) {
            this.animations.push(new Animation(animation, startFrame, endFrame, nextAnimation, time));
            return this;
        }

        serialize() {
            let obj = {};
            this.animations.forEach((ani: Animation) => {
                obj[ani.animation] = [ani.startFrame, ani.endFrame, ani.nextAnimation, ani.time];
            });
            return obj;
        }
    }
}