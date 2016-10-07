namespace Lich {

    export class ItemUI extends createjs.Container {

        public sprite: createjs.Sprite;
        public count: Label;
        public invDef: InvObjDefinition;
        public frames: number;

        constructor(public item: InventoryKey, quant: number) {
            super();
            this.width = Resources.PARTS_SIZE + PartsUI.SPACING;
            this.height = this.width;

            let invDef: InvObjDefinition = Resources.getInstance().invObjectDefs[item];
            this.invDef = invDef;
            let frames = 1;
            if (typeof invDef === "undefined" || invDef == null) {
                frames = 1;
            } else {
                frames = invDef.frames;
            }
            this.frames = frames;
            let sprite = Resources.getInstance().getSprite(InventoryKey[item], frames);
            this.sprite = sprite;
            this.addChild(sprite);
            sprite.x = this.width / 2 - sprite.width / 2;
            sprite.y = this.height / 2 - sprite.height / 2;
            let text = new Label("" + quant, PartsUI.TEXT_SIZE + "px " + Resources.FONT, Resources.TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            this.count = text;
            this.addChild(text);
            text.x = 0;
            text.y = this.height - PartsUI.TEXT_SIZE - PartsUI.SPACING;
        }
    }
 
}