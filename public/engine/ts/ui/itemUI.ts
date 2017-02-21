namespace Lich {

    export class ItemUI extends SheetContainer {

        public sprite: createjs.Sprite;
        public count: Label;
        public invDef: InvObjDefinition;

        constructor(public item: InventoryKey, quant: number) {
            super();
            this.width = Resources.PARTS_SIZE + PartsUI.SPACING;
            this.height = this.width;

            let invDef: InvObjDefinition = Resources.getInstance().invObjectDefs[item];
            this.invDef = invDef;
            let sprite = Resources.getInstance().getInvObjectSprite(item);
            this.sprite = sprite;
            this.addChild(sprite);
            sprite.x = this.width / 2 - sprite.width / 2;
            sprite.y = this.height / 2 - sprite.height / 2;
            let text = new Label("" + quant);
            this.count = text;
            this.addChild(text);
            text.x = 0;
            text.y = this.height - PartsUI.TEXT_SIZE - PartsUI.SPACING;
        }
    }

}