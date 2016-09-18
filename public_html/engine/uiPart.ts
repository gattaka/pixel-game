namespace Lich {

    export abstract class AbstractUI extends createjs.Container {

        static BORDER = 10;
        static TEXT_SIZE = 15;

        outerShape: createjs.Shape;

        constructor(public width: number, public height: number) {
            super();

            this.outerShape = new createjs.Shape();
            this.drawBackground();
            this.addChild(this.outerShape);
        }

        protected drawBackground() {
            this.outerShape.graphics.clear();
            this.outerShape.graphics.setStrokeStyle(2);
            this.outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            this.outerShape.graphics.drawRoundRect(0, 0, this.width, this.height, 3);
        }

    }

    export abstract class PartsUI extends AbstractUI {

        static SELECT_BORDER = 5;
        static SPACING = 12;

        constructor(public n: number, public m: number) {
            super(PartsUI.pixelsByX(n), PartsUI.pixelsByX(m));
        }

        static pixelsByX(x: number): number {
            return x * Resources.PARTS_SIZE + (x - 1) * (PartsUI.SPACING) + 2 * AbstractUI.BORDER;
        }

        protected createHighlightShape(): createjs.Shape {
            var shape = new createjs.Shape();
            shape.graphics.beginStroke("rgba(250,250,10,0.5)");
            shape.graphics.beginFill("rgba(250,250,10,0.2)");
            shape.graphics.setStrokeStyle(2);
            shape.graphics.drawRoundRect(0, 0, Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2, Resources.PARTS_SIZE
                + PartsUI.SELECT_BORDER * 2, 3);
            return shape;
        }


    }

}