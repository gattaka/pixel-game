namespace Lich {

    export abstract class AbstractWorldObject extends createjs.Sprite {

        state: string;
        public speedx: number = 0;
        public speedy: number = 0;

        constructor(
            public width: number,
            public height: number,
            public spriteSheet: createjs.SpriteSheet,
            public initState: string,
            public stateAnimation: Object,
            public collXOffset: number,
            public collYOffset: number) {
            super(spriteSheet, initState);
        }

        performState(desiredState: string) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(self.stateAnimation[desiredState]);
                self.state = desiredState;
            }
        }

        updateAnimations() { };

    }
    
    export abstract class BulletObject extends AbstractWorldObject {

        public done: boolean = false;

        constructor(
            public owner: string,
            public width: number,
            public height: number,
            public spriteSheet: createjs.SpriteSheet,
            public initState: string,
            public stateAnimation: Object,
            public collXOffset: number,
            public collYOffset: number
        ) {
            super(width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
        };

        public abstract update(game: Game);
    }

    export class BasicBullet extends BulletObject {
        constructor(
            public owner: string,
            public width: number,
            public height: number,
            public spriteSheet: createjs.SpriteSheet,
            public initState: string,
            public stateAnimation: Object,
            public collXOffset: number,
            public collYOffset: number
        ) {
            super(owner, width, height, spriteSheet, initState, stateAnimation, collXOffset, collYOffset);
        };

        public update(game: Game) {

        }
    }

}