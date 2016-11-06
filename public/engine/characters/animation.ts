namespace Lich {
    class Animation {
        constructor(
            public animation: CharacterState,
            public startFrame: number,
            public endFrame: number,
            public nextAnimation: CharacterState,
            public time: number) { }
    }

    export class Animations {
        animations = Array<Animation>();
        add(
            animation: CharacterState,
            startFrame: number,
            endFrame: number,
            nextAnimation: CharacterState,
            time: number) {
            this.animations.push(new Animation(animation, startFrame, endFrame, nextAnimation, time));
            return this;
        }

        serialize() {
            let obj = {};
            this.animations.forEach((ani: Animation) => {
                obj[CharacterState[ani.animation]] = [ani.startFrame, ani.endFrame, CharacterState[ani.nextAnimation], ani.time];
            });
            return obj;
        }
    }
}