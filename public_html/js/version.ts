namespace Lich {
    export class Version {
        public changes = new Array<string>();

        constructor(public version: string) { }

        public addChange(change: string): Version {
            this.changes.push(change);
            return this;
        }
    }

    export class Changelog {

        public versions = new Table<Version>();

        public addVersion(version: Version): Changelog {
            this.versions.insert(version.version, version);
            return this;
        }

        constructor() {

            var version;

            version = new Version("0.4");
            version.addChange("Changelog");
            version.addChange("Grave and bones added");
            this.addVersion(version);

            version = new Version("0.3");
            version.addChange("Placing walls (surface background)");
            version.addChange("DEV FEATURE: multijump on <S> key");
            version.addChange("DEV FEATURE: enemies spawn spell");
            version.addChange("Spells cooldown");
            version.addChange("Bullet mechanics improved");
            version.addChange("<SHIFT> toggles surface/wall placing");
            this.addVersion(version);

            version = new Version("0.2");
            version.addChange("Animated objects");
            version.addChange("Placing surfaces and objects");
            version.addChange("Inventory collapsing");
            version.addChange("Dirt background");
            this.addVersion(version);

            version = new Version("0.1");
            version.addChange("Initial version");
            this.addVersion(version);

        }
    }

    export class SplashScreenUI extends AbstractUI {

        static MARGIN = 8;
        static PADDING = 5;
        static LINES = 20;
        static FONT_HEIGHT = 15;
        static TOP_OFFSET = 40;
        static WIDTH = 500;
        static OUTLINE = 1;
        static BTN_SIDE = 20;

        private lines = new Array<string>();
        private cont = new createjs.Container();
        private currentLine = 0;

        public print() {
            this.cont.removeAllChildren();
            for (var i = 0; i < SplashScreenUI.LINES; i++) {
                if (this.lines[i + this.currentLine] == null)
                    break;
                var child = new Label(this.lines[i + this.currentLine], SplashScreenUI.FONT_HEIGHT + "px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, SplashScreenUI.OUTLINE);
                this.cont.addChild(child);
                child.x = SplashScreenUI.MARGIN;
                child.y = SplashScreenUI.TOP_OFFSET + i * (SplashScreenUI.FONT_HEIGHT + SplashScreenUI.PADDING);
            }
        }

        private createBaseButtonShape(width: number, height: number): createjs.Shape {
            var self = this;
            var shape = new createjs.Shape();
            shape.graphics.beginStroke("rgba(0,0,0,0.5)");
            shape.graphics.beginFill("rgba(250,250,10,0.4)");
            shape.graphics.setStrokeStyle(2);
            shape.graphics.drawRoundRect(0, 0, width, height, 3);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, width, height);
            shape.hitArea = hitArea;
            return shape;
        }

        protected createUpButton(): createjs.Shape {
            var self = this;
            var shape = self.createBaseButtonShape(SplashScreenUI.BTN_SIDE, SplashScreenUI.BTN_SIDE);
            shape.graphics.beginFill("rgba(250,250,10,1)");
            shape.graphics.drawPolyStar(SplashScreenUI.BTN_SIDE / 2, SplashScreenUI.BTN_SIDE / 2 + 1, 5, 3, 0.5, -90);
            shape.on("mousedown", function() {
                if (self.currentLine > 0) {
                    self.currentLine--;
                    self.print();
                }
            }, null, false);
            return shape;
        }

        protected createDownButton(): createjs.Shape {
            var self = this;
            var shape = self.createBaseButtonShape(SplashScreenUI.BTN_SIDE, SplashScreenUI.BTN_SIDE);
            shape.graphics.beginFill("rgba(250,250,10,1)");
            shape.graphics.drawPolyStar(SplashScreenUI.BTN_SIDE / 2, SplashScreenUI.BTN_SIDE / 2 - 1, 5, 3, 0.5, 90);
            shape.on("mousedown", function() {
                if (self.currentLine + SplashScreenUI.LINES < self.lines.length) {
                    self.currentLine++;
                    self.print();
                }
            }, null, false);
            return shape;
        }

        protected createCloseButton(): createjs.Container {
            var self = this;
            var shape = self.createBaseButtonShape(42, SplashScreenUI.BTN_SIDE);

            var cont = new createjs.Container();
            cont.on("mousedown", function() {
                self.parent.removeChild(self);
            }, null, false);
            cont.hitArea = shape.hitArea;

            cont.addChild(shape);

            var label = new Label("CLOSE", "12px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR);
            cont.addChild(label);
            label.x = 4;
            label.y = 2;

            return cont;
        }

        constructor() {
            super(SplashScreenUI.WIDTH, 20 + (SplashScreenUI.LINES + 1) * (SplashScreenUI.FONT_HEIGHT + SplashScreenUI.PADDING + SplashScreenUI.OUTLINE * 2));

            var self = this;

            var changelog = new Changelog();

            var label = new Label("LichEngine " + changelog.versions.byIndex(0).version, "20px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            label.x = SplashScreenUI.MARGIN;
            label.y = SplashScreenUI.MARGIN;
            super.addChild(label);

            super.addChild(this.cont);

            // Instrukce
            self.lines.push("== INSTRUCTIONS ==");
            self.lines.push(" ");
            self.lines.push("- Press <W>, <A>, <S>, <D> to move");
            self.lines.push("- Press <I> to minimize inventory");
            self.lines.push("- Select item from inventory by <LMB> and hand skill to place on map");
            self.lines.push("- Press <LMB> to dig, place or attack");
            self.lines.push("- Hold <SHIFT> to toggle between surface and wall digging/placing");
            self.lines.push(" ");
            self.lines.push("== CHANGELOG ==");
            self.lines.push(" ");

            changelog.versions.forEach(function(version: Version) {
                self.lines.push("Version: " + version.version);
                version.changes.forEach(function(change: string) {
                    self.lines.push("- " + change);
                });
                self.lines.push(" ");
            });

            self.print();

            var up = this.createUpButton();
            super.addChild(up);
            up.x = self.width - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;
            up.y = SplashScreenUI.MARGIN;

            var down = this.createDownButton();
            super.addChild(down);
            down.x = self.width - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;
            down.y = self.height - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;

            var close = this.createCloseButton();
            super.addChild(close);
            close.x = self.width / 2 - 42 / 2;
            close.y = self.height - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;
        }

    }
}