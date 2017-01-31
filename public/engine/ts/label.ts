namespace Lich {
    export class Label extends createjs.Container {

        label: createjs.Text;
        outlineLabel: createjs.Text;

        public height: number;
        public width: number;

        constructor(text: string,
            font = PartsUI.TEXT_SIZE + "px " + Resources.FONT,
            color = Resources.TEXT_COLOR,
            outline = true,
            outlineColor = Resources.OUTLINE_COLOR,
            outlineWidth = 1) {
            super();

            this.label = new createjs.Text(text, font, color);
            if (outline) {
                this.outlineLabel = new createjs.Text(text, font, outlineColor);
                this.addChild(this.outlineLabel);
                if (typeof outlineWidth !== "undefined")
                    outlineWidth = 1;
                this.outlineLabel.outline = outlineWidth + 2;
            }
            this.addChild(this.label);

            this.height = this.label.getBounds().height;
            this.width = this.label.getBounds().width;
        }

        setLineWidth(value) {
            this.label.lineWidth = value
            if (typeof this.outlineLabel !== "undefined")
                this.outlineLabel.lineWidth = value;
        }

        setLineHeight(value) {
            this.label.lineHeight = value
            if (typeof this.outlineLabel !== "undefined")
                this.outlineLabel.lineHeight = value;
        }

        setText(value) {
            this.label.text = value;
            if (typeof this.outlineLabel !== "undefined")
                this.outlineLabel.text = value;
        }

        setColor(value) {
            this.label.color = value;
        }

        setOutlineColor(value) {
            if (typeof this.outlineLabel !== "undefined")
                this.outlineLabel.color = value;
        }

    }
}