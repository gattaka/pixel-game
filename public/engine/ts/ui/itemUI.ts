namespace Lich {

    export class ItemUI extends PIXI.Container {

        public sprite: PIXI.Sprite;
        private hitLayer: PIXI.Container;
        public count: Label;
        public invDef: InvObjDefinition;

        constructor(public item: InventoryKey, quant: number, onPress?: Function) {
            super();
            this.fixedWidth = Resources.PARTS_SIZE + PartsUI.SPACING;
            this.fixedHeight = this.fixedWidth;

            let invDef: InvObjDefinition = Resources.getInstance().invObjectDefs[item];
            this.invDef = invDef;
            let sprite = Resources.getInstance().getInvUISprite(item);
            this.sprite = sprite;
            this.addChild(sprite);
            // sprite.x = this.fixedWidth / 2 - Resources.PARTS_SIZE / 2;
            // sprite.y = this.fixedHeight / 2 - Resources.PARTS_SIZE / 2;
            let text = new Label("" + quant);
            this.count = text;
            this.addChild(text);
            text.x = 0;
            text.y = this.fixedHeight - PartsUI.TEXT_SIZE - PartsUI.SPACING;

            if (onPress) {
                this.hitLayer = new PIXI.Container();
                this.hitLayer.interactive = true;
                this.hitLayer.buttonMode = true;
                this.hitLayer.fixedWidth = this.fixedWidth;
                this.hitLayer.fixedHeight = this.fixedHeight;
                this.hitLayer.hitArea = new PIXI.Rectangle(0, 0, this.fixedWidth, this.fixedHeight);
                this.hitLayer.on("pointerdown", onPress);
                this.addChild(this.hitLayer);
            }
        }
    }

}