namespace Lich {
    export class Character extends createjs.Sprite {

        // aktuální horizontální rychlost
        speedx = 0;
        // aktuální vertikální rychlost
        speedy = 0;

        state;

        constructor(public width, public height, public spriteSheet, initState, public stateAnimation) {
            super(spriteSheet, initState);
        }

        handleTick() { };

        performState(desiredState) {
            if (this.state !== desiredState) {
                this.gotoAndPlay(this.stateAnimation[desiredState]);
                this.state = desiredState;
            }
        }

    }
}