namespace Lich {
    
    export class ConditionUI extends AbstractUI {

        static INNER_BORDER = 5;
        static SPACING = 4;

        private healthBar = new createjs.Shape();
        private willBar = new createjs.Shape();

        private healthText: Label;
        private willText: Label;

        private barWidth: number;
        private barHeight: number;

        private maxHealth: number = 0;
        private maxWill: number = 0;

        private currentHealth: number = 0;
        private currentWill: number = 0;

        setMaxHealth(maxHealth: number) {
            this.maxHealth = maxHealth;
            this.setHealth(this.currentHealth);
        }

        setMaxWill(maxWill: number) {
            this.maxWill = maxWill;
            this.setWill(this.currentWill);
        }

        setHealth(currentHealth: number) {
            if (currentHealth > this.maxHealth) {
                this.currentHealth = this.maxHealth;
            } else if (currentHealth < 0) {
                this.currentHealth = 0;
            } else {
                this.currentHealth = Math.ceil(currentHealth);
            }
            this.updateHealthBar();
        }

        setWill(currentWill: number) {
            if (currentWill > this.maxWill) {
                this.currentWill = this.maxWill;
            } else if (currentWill < 0) {
                this.currentWill = 0;
            } else {
                this.currentWill = Math.ceil(currentWill);
            }
            this.updateWillBar();
        }

        private updateHealthBar() {
            this.healthBar.graphics.clear();
            this.healthBar.graphics.setStrokeStyle(2);
            this.healthBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.healthBar.graphics.beginFill("rgba(255,0,0,0.7)");
            var width = this.barWidth * (this.currentHealth / this.maxHealth);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.healthBar.graphics.drawRoundRect(x, ConditionUI.INNER_BORDER, width, this.barHeight, 3);

            this.healthText.setText(this.currentHealth + "/" + this.maxHealth);
            this.healthText.x = this.width / 2 - this.healthText.getBounds().width / 2;
        }

        private updateWillBar() {
            this.willBar.graphics.clear();
            this.willBar.graphics.setStrokeStyle(2);
            this.willBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.willBar.graphics.beginFill("rgba(70,30,255,0.7)");
            var width = this.barWidth * (this.currentWill / this.maxWill);
            var x = ConditionUI.INNER_BORDER + this.barWidth - width;
            this.willBar.graphics.drawRoundRect(x, this.height / 2 + ConditionUI.SPACING / 2, width, this.barHeight, 3);

            this.willText.setText(this.currentWill + "/" + this.maxWill);
            this.willText.x = this.width / 2 - this.willText.getBounds().width / 2;
        }

        constructor() {
            super(350, 2 * AbstractUI.BORDER + Resources.PARTS_SIZE);

            let self = this;

            this.barWidth = this.width - ConditionUI.INNER_BORDER * 2;
            this.barHeight = this.height / 2 - ConditionUI.INNER_BORDER - ConditionUI.SPACING / 2;

            // podklady 
            var healthBgrBar = new createjs.Shape();
            healthBgrBar.graphics.setStrokeStyle(2);
            healthBgrBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            healthBgrBar.graphics.drawRoundRect(ConditionUI.INNER_BORDER, ConditionUI.INNER_BORDER, this.barWidth, this.barHeight, 3);
            this.addChild(healthBgrBar);

            var willBgrBar = new createjs.Shape();
            willBgrBar.graphics.setStrokeStyle(2);
            willBgrBar.graphics.beginStroke("rgba(0,0,0,0.7)");
            willBgrBar.graphics.drawRoundRect(ConditionUI.INNER_BORDER, this.height / 2 + ConditionUI.SPACING / 2, this.barWidth, this.barHeight, 3);
            this.addChild(willBgrBar);

            // zdraví
            this.addChild(this.healthBar);
            this.healthText = new Label(" ", PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.healthText.y = ConditionUI.INNER_BORDER;
            this.addChild(this.healthText);

            // vůle
            this.addChild(this.willBar);
            this.willText = new Label(" ", PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.willText.y = this.height / 2 + ConditionUI.SPACING / 2;
            this.addChild(this.willText);

            this.updateHealthBar();
            this.updateWillBar();

            EventBus.getInstance().registerConsumer(EventType.HEALTH_CHANGE, (data: HealthChangeEventPayload) => {
                self.setMaxHealth(data.maxHealth);
                self.setHealth(data.currentHealth);
                return false;
            });

            EventBus.getInstance().registerConsumer(EventType.WILL_CHANGE, (data: WillChangeEventPayload) => {
                self.setMaxWill(data.maxWill);
                self.setWill(data.currentWill);
                return false;
            });
        }

    }
}