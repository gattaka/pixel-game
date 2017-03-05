namespace Lich {
    export class Label extends PIXI.Text {

        constructor(text: string,
            font = Resources.FONT,
            size = PartsUI.TEXT_SIZE,
            color = Resources.TEXT_COLOR,
            outlineColor = Resources.OUTLINE_COLOR,
            outlineWidth = 3) {
            super(text, { fontFamily: font, fontSize: size + "px ", fill: color, stroke: outlineColor, strokeThickness: outlineWidth });
        }

        setLineWidth(value) {
            // this.label.lineWidth = value
        }

        setLineHeight(value) {
            // this.label.lineHeight = value
        }

        setText(value) {
            this.text = value;
        }

        setColor(value) {
            this.style.fill = value;
        }

    }
}