namespace Lich {
    export class Label extends createjs.SpriteContainer {

        label: createjs.BitmapText;

        public height: number;
        public width: number;

        constructor(text: string) {
            super();

            this.label = Resources.getInstance().getText(text);
            this.addChild(this.label);

            this.height = this.label.getBounds().height;
            this.width = this.label.getBounds().width;
        }

    }
}