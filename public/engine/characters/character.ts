namespace Lich {
    export enum MovementType {
        WALK,
        FLY,
        FLY_NO_COLLISION
    }
    export abstract class Character extends AbstractWorldObject {

        protected HEALTH_REGEN_TIME = 1000;
        protected maxHealth = 100;
        protected currentHealth = this.maxHealth;
        protected healthRegen = 0;

        protected WILL_REGEN_TIME = 1000;
        protected maxWill = 50;
        protected currentWill = this.maxWill;
        protected willRegen = 0;

        public spellCooldowns = new Table<number>();

        constructor(width: number, height: number,
            collXOffset: number, collYOffset: number,
            animationKey: AnimationKey,
            initState: CharacterState,
            frames: number,
            public type: MovementType,
            public accelerationX: number,
            public accelerationY: number,
            animations: Animations) {
            super(width, height, new createjs.SpriteSheet({
                framerate: 10,
                "images": [Resources.getInstance().getImage(AnimationKey[animationKey])],
                "frames": {
                    "regX": 0,
                    "height": height,
                    "count": frames,
                    "regY": 0,
                    "width": width,
                },
                "animations": animations.serialize()
            }), CharacterState[initState], collXOffset, collYOffset);
        }

        onHealthChange(difference: number) { };
        onWillChange(difference: number) { };

        walkL() {
            this.performState(CharacterState.WALKL);
        }

        walkR() {
            this.performState(CharacterState.WALKR);
        }

        idle() {
            this.performState(CharacterState.IDLE);
        }

        jump() {
            this.performState(CharacterState.JUMP);
        }

        jumpR() {
            this.performState(CharacterState.JUMPR);
        }

        jumpL() {
            this.performState(CharacterState.JUMPL);
        }

        midair() {
            this.performState(CharacterState.MIDAIR);
        }

        fall() {
            this.performState(CharacterState.FALL);
        }

        die(world: World) {
            this.speedx = 0;
            this.performState(CharacterState.DIE);
        }

        /**
         * Health metody
         */

        hit(damage: number, world: World): number {
            var oldValue = this.currentHealth;
            if (this.currentHealth > 0) {
                this.currentHealth -= damage;
                // TODO armor

                if (this.currentHealth <= 0) {
                    this.currentHealth = 0;
                    this.die(world);
                }
            }
            this.onHealthChange(this.currentHealth - oldValue);
            // TODO zatím nemá armor, takže se aplikuje vše
            return damage;
        }

        fillHealth(amount: number) {
            if (this.currentHealth < this.maxHealth) {
                this.currentHealth += amount;
                if (this.currentHealth > this.maxHealth)
                    this.currentHealth = this.maxHealth;
                this.onHealthChange(0);
            }
        }

        setNewMaxHealth(maxHealth: number) {
            this.maxHealth = maxHealth;
            if (this.currentHealth > this.maxHealth)
                this.currentHealth = this.maxHealth;
            this.onHealthChange(0);
        }

        getMaxHealth() {
            return this.maxHealth;
        }

        getCurrentHealth() {
            return this.currentHealth;
        }

        /**
         * Will metody
         */

        decreseWill(amount: number) {
            var oldValue = this.currentWill;
            if (this.currentWill > 0) {
                this.currentWill -= amount;
                if (this.currentWill < 0)
                    this.currentWill = 0;
                this.onWillChange(this.currentWill - oldValue);
            }
        }

        fillWill(amount: number) {
            if (this.currentWill < this.maxWill) {
                this.currentWill += amount;
                if (this.currentWill > this.maxWill)
                    this.currentWill = this.maxWill;
                this.onWillChange(0);
            }
        }

        setNewMaxWill(maxWill: number) {
            this.maxWill = maxWill;
            if (this.currentWill > this.maxWill)
                this.currentWill = this.maxWill;
            this.onWillChange(0);
        }

        getMaxWill() {
            return this.maxWill;
        }

        getCurrentWill() {
            return this.currentWill;
        }

        updateAnimations() {
            var self = this;
            if (this.getCurrentHealth() > 0) {
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

        performState(desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(CharacterState[desiredState]);
                self.state = desiredState;
            }
        }

        handleTick(delta) {
            if (this.getCurrentHealth() > 0) {
                this.fillHealth((delta / this.HEALTH_REGEN_TIME) * this.healthRegen);
                this.fillWill((delta / this.WILL_REGEN_TIME) * this.willRegen);
            }
        }
    }
}