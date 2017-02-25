namespace Lich {
    export class Label extends PIXI.Container {

        label: PIXI.Text;

        public height: number;
        public width: number;

        constructor(text: string,
            font = PartsUI.TEXT_SIZE + "px " + Resources.FONT,
            color = Resources.TEXT_COLOR,
            outline = true,
            outlineColor = Resources.OUTLINE_COLOR,
            outlineWidth = 1) {
            super();

            this.label = new PIXI.Text(text, { fontFamily: font, fill: color, stroke: outlineColor, strokeThickness: outlineWidth });
            this.addChild(this.label);

            this.height = this.label.getBounds().height;
            this.width = this.label.getBounds().width;
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