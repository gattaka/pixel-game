namespace Lich {
    export class Label extends PIXI.Container {

        label: PIXI.Text;

        public fixedHeight: number;
        public fixedWidth: number;

        constructor(text: string,
            font = Resources.FONT,
            size = PartsUI.TEXT_SIZE,
            color = Resources.TEXT_COLOR,
            outlineColor = Resources.OUTLINE_COLOR,
            outlineWidth = 3) {
            super();

            this.label = new PIXI.Text(text, { fontFamily: font, fontSize: size + "px ", fill: color, stroke: outlineColor, strokeThickness: outlineWidth });
            this.addChild(this.label);

            this.fixedHeight = this.label.getBounds().height;
            this.fixedWidth = this.label.getBounds().width;
        }

        setLineWidth(value) {
            // this.label.lineWidth = value
        }

        setLineHeight(value) {
            // this.label.lineHeight = value
        }

        setText(value) {
            this.label.text = value;
        }

        setColor(value) {
            this.label.style.fill = value;
        }

    }
}