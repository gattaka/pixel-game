namespace Lich {
    export enum MovementTypeX {
        // Nic nedělá
        NONE,
        // Jde doleva (respektuje kolize)
        WALK_LEFT,
        // Jde doprava (respektuje kolize)
        WALK_RIGHT,
        // Vznáší se (nerespektuje gravitaci ani kolize)
        HOVER
    }
    export enum MovementTypeY {
        // Nic nedělá
        NONE,
        // Skáče (respektuje gravitaci a kolize)
        JUMP_OR_CLIMB,
        // Sestupuje (jde vstříc gravitaci a kolize)
        DESCENT,
        // Letí (nerespektuje gravitaci, ale kolize ano)
        ASCENT,
        // Vznáší se (nerespektuje gravitaci ani kolize)
        HOVER
    }
    export abstract class Character extends AbstractWorldObject {

        public uuid = Utils.guid();

        protected HEALTH_REGEN_TIME = 1000;
        protected maxHealth = 100;
        protected currentHealth = this.maxHealth;
        protected healthRegen = 0;

        protected WILL_REGEN_TIME = 1000;
        protected maxWill = 50;
        protected currentWill = this.maxWill;
        protected willRegen = 0;

        protected hitTextColor = "#E3E";
        protected hitTextBorderColor = "#303";

        protected healthBar: PIXI.Graphics;

        // Typy pohybu, u hráče odpovídá stisku klávesy, 
        // u nepřítele jeho AI nasměrování
        public movementTypeX = MovementTypeX.NONE;
        public movementTypeY = MovementTypeY.NONE;

        public isClimbing = false;

        public spellCooldowns = new Table<number>();

        constructor(
            public ownerId: string,
            private animationSetKey: AnimationSetKey,
            initAnimation: AnimationKey,
            collXOffset: number, collYOffset: number,
            public accelerationX: number,
            public accelerationY: number,
            hovers = false) {
            super(collXOffset, collYOffset, hovers);

            let animationDef = Resources.getInstance().animationSetDefsByKey[this.animationSetKey];
            this.fixedWidth = animationDef.width;
            this.fixedHeight = animationDef.height;
            this.sprite = Resources.getInstance().getAnimatedObjectSprite(animationDef.animationSetKey);
            this.addChild(this.sprite);

            this.healthBar = new PIXI.Graphics();
            this.healthBar.fixedWidth = this.fixedWidth;
            this.healthBar.fixedHeight = 4;
            this.healthBar.x = 0;
            this.healthBar.y = -this.healthBar.fixedHeight;
            this.healthBar.visible = false;
            // TODO
            // this.addChild(this.healthBar);
        }

        private updateHealthBar() {
            if (this.currentHealth == this.maxHealth || this.currentHealth == 0) {
                this.healthBar.visible = false;
            } else {
                this.healthBar.visible = true;
                this.healthBar.clear();
                this.healthBar.beginFill(0x00FF00, 0.7);
                this.healthBar.drawRect(0, 0, this.fixedWidth, this.healthBar.fixedHeight);
                var width = this.fixedWidth * (1 - this.currentHealth / this.maxHealth);
                this.healthBar.beginFill(0xFF0000, 0.7);
                this.healthBar.drawRect(0, 0, width, this.healthBar.fixedHeight);
            }
        }

        onHealthChange(difference: number) {
            this.updateHealthBar();
        };

        onWillChange(difference: number) { };

        abstract walkL();
        abstract walkR();
        abstract idle();
        abstract climb();
        abstract jump();
        abstract jumpR();
        abstract jumpL();
        abstract midair();
        abstract fall();
        abstract death();

        die(world: World) {
            this.speedx = 0;
            this.healthBar.visible = false;
            this.death();
        }

        /**
         * Health metody
         */

        protected hitSound() {
        }

        hit(damage: number, world: World): number {
            var oldValue = this.currentHealth;
            if (this.currentHealth > 0) {
                let effectiveDamage = damage;
                this.currentHealth -= effectiveDamage;
                // TODO zatím nemá armor, takže se aplikuje vše
                this.onHealthChange(this.currentHealth - oldValue);
                world.fadeText("-" + effectiveDamage, this.x + this.fixedWidth * Math.random(), this.y);

                this.hitSound();

                if (this.currentHealth <= 0) {
                    this.currentHealth = 0;
                    this.die(world);
                }
            }
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
                if (self.isClimbing) {
                    self.climb();
                    if (self.speedx == 0 && self.speedy == 0) {
                        self.stop();
                    } else {
                        self.play();
                    }
                } else if (self.speedx == 0 && self.speedy == 0) {
                    self.idle();
                } else if (self.speedy != 0) {
                    if (self.speedx == 0) {
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

        handleTick(delta) {
            if (this.getCurrentHealth() > 0) {
                this.fillHealth((delta / this.HEALTH_REGEN_TIME) * this.healthRegen);
                this.fillWill((delta / this.WILL_REGEN_TIME) * this.willRegen);
            }
        }
    }
}