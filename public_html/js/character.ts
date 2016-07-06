namespace Lich {
    export abstract class Character extends AbstractWorldObject {

        /*-----------*/
        /* VARIABLES */
        /*-----------*/

        public life = 100;
        public spellCooldowns = new Array<number>();

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
        abstract die(game: Game);

        abstract hit(damage: number, game: Game);

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