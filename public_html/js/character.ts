namespace Lich {
    export abstract class Character extends AbstractWorldObject {

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        width = 0;
        height = 0;
        speedx = 0;
        speedy = 0;

        state = null;

        initialized = false;

        shift(shift) {
            var self = this;
            if (self.initialized) {
                // TODO
            }
        }


        performState(desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(self.getStateAnimation(desiredState));
                self.state = desiredState;
            }
        }

        abstract getStateAnimation(state: string);

        abstract walkL();
        abstract walkR();
        abstract idle();
        abstract jump();
        abstract jumpR();
        abstract jumpL();
        abstract midair();
        abstract fall();

        updateAnimations() {
            var self = this;
            if (self.speedx === 0 && self.speedy === 0) {
                self.idle();
            } else if (self.speedy !== 0) {
                if (self.speedx === 0) {
                    self.jump();
                } else if (self.speedx > 0) {
                    self.jumpL();
                } else {
                    self.jumpR();
                }
            } else {
                if (self.speedx > 0) {
                    self.walkL();
                }
                if (self.speedx < 0) {
                    self.walkR();
                }
            }
        }

    }
}