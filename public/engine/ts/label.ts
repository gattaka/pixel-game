namespace Lich {
    export class Label extends SheetContainer {

        public height: number;
        public width: number;

        constructor(private text: string, private font = FontKey.FNT_SMALL_YELLOW_KEY, private charSpacing = 1) {
            super();
            this.setText(text);
        }

        setText(text: string | number) {
            let sText = (text + "").toLowerCase();
            let charSprite;
            for (let i = 0; i < sText.length; i++) {
                let char = sText.charAt(i);
                if (char != ' ') {
                    charSprite = Resources.getInstance().getFontSprite(this.font, char);
                    charSprite.x = i * (charSprite.width + this.charSpacing);
                    this.addChild(charSprite);
                }
            }
            if (charSprite) {
                this.height = charSprite.height;
                this.width = sText.length * (charSprite.width + this.charSpacing);
            }
        }

        setLineHeight(value: number) {
            // TODO
        }

        setLineWidth(value: number) {
            // TODO
        }

    }
}