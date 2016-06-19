namespace Lich {
    export class Label extends createjs.Container {

        label: createjs.Text;
        outlineLabel: createjs.Text;

        public height: number;
        public width: number;

        constructor(text?: string, font?: string, color?: string, outline?: boolean, outlineColor?: string, outlineWidth?: number) {
            super();

            this.label = new createjs.Text(text, font, color);
            this.addChild(this.label);
            if (outline) {
                this.outlineLabel = new createjs.Text(text, font, outlineColor);
                this.addChild(this.outlineLabel);
                if (typeof outlineWidth !== "undefined")
                    outlineWidth = 1;
                this.outlineLabel.outline = outlineWidth;
            }
            
            this.height = this.label.getBounds().height;
            this.width = this.label.getBounds().width;
        }

        setText(value) {
            this.label.text = value;
            if (typeof this.outlineLabel !== "undefined")
                this.outlineLabel.text = value;
        }

    }
}