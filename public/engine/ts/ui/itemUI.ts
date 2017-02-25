namespace Lich {

    export class ItemUI extends PIXI.Container {

        public sprite: PIXI.Sprite;
        public count: Label;
        public invDef: InvObjDefinition;

        constructor(public item: InventoryKey, quant: number) {
            super();
            this.fixedWidth = Resources.PARTS_SIZE + PartsUI.SPACING;
            this.fixedHeight = this.fixedWidth;

            let invDef: InvObjDefinition = Resources.getInstance().invObjectDefs[item];
            this.invDef = invDef;
            let sprite = Resources.getInstance().getInvObjectSprite(item);
            this.sprite = sprite;
            this.addChild(sprite);
            sprite.x = this.fixedWidth / 2 - sprite.fixedWidth / 2;
            sprite.y = this.fixedHeight / 2 - sprite.fixedHeight / 2;
            let text = new Label("" + quant);
            this.count = text;
            this.addChild(text);
            text.x = 0;
            text.y = this.fixedHeight - PartsUI.TEXT_SIZE - PartsUI.SPACING;
        }
    }

}