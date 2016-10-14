namespace Lich {
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

        abstract onHealthChange(difference: number);
        abstract onWillChange(difference: number);

        /**
         * Health metody
         */

        hit(damage: number, game: Game) {
            var oldValue = this.currentHealth;
            if (this.currentHealth > 0) {
                this.currentHealth -= damage;
                if (this.currentHealth <= 0) {
                    this.currentHealth = 0;
                    this.die(game);
                }
            }
            this.onHealthChange(this.currentHealth - oldValue);
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

        performState(desiredState) {
            var self = this;
            if (self.state !== desiredState) {
                self.gotoAndPlay(self.getStateAnimation(desiredState));
                self.state = desiredState;
            }
        }

        handleTick(delta) {
            this.fillHealth((delta / this.HEALTH_REGEN_TIME) * this.healthRegen);
            this.fillWill((delta / this.WILL_REGEN_TIME) * this.willRegen);
        }
    }
}