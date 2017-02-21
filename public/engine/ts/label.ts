namespace Lich {
    export class Label extends SheetContainer {

        label: createjs.BitmapText;

        public height: number;
        public width: number;

        constructor(text: string, font = FontKey.FNT_SMALL_YELLOW_KEY) {
            super();

            this.label = Resources.getInstance().getText(text);
            this.addChild(this.label);

            this.height = this.label.getBounds().height;
            this.width = this.label.getBounds().width;
        }

        setText(text: string | number) {
            this.label.text = text + "";
        }

        setLineHeight(value: number) {
            // TODO
        }

        setLineWidth(value: number) {
            // TODO
        }

    }
}