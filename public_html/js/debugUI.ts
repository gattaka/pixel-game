namespace Lich {

    export class DebugLogUI extends UIPart {

        static PADDING = 5;

        constructor(x: number, y: number) {
            super(x, y);
        }

        public addNextChild(child: createjs.DisplayObject) {
            if (this.height == 0) {
                this.height = DebugLogUI.PADDING * 2;
            }

            child.x = DebugLogUI.PADDING;
            child.y = this.height - DebugLogUI.PADDING;
            this.height += child.height + DebugLogUI.PADDING;

            if (child.width + 2 * DebugLogUI.PADDING > this.width) {
                this.width = child.width + 2 * DebugLogUI.PADDING;
            }

            super.addChild(child);

            this.drawBackground();
        }
    }

}