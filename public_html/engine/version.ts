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

            version = new Version("0.5");
            version.addChange("Crafting introduced");
            version.addChange("Doors added");
            version.addChange("Object <RMB> interacting (open/close doors)");
            version.addChange("Object collisions (closed doors)");
            version.addChange("<SHIFT> toggles object alternative placing (L/R doors)");
            version.addChange("Inventory paging");
            this.addVersion(version);

            version = new Version("0.4");
            version.addChange("Grave and bones added");
            version.addChange("Surface background digging");
            version.addChange("<SHIFT> toggles surface/surface-background digging");
            version.addChange("Surface background does not collide with objects anymore");
            version.addChange("Health and Will UI improved");
            version.addChange("Health and Will regeneration");
            version.addChange("Spells cost");
            this.addVersion(version);

            version = new Version("0.3");
            version.addChange("Placing walls (surface background)");
            version.addChange("DEV FEATURE: multijump on <S> key");
            version.addChange("DEV FEATURE: enemies spawn spell");
            version.addChange("Spells cooldown");
            version.addChange("Bullet mechanics improved");
            version.addChange("<SHIFT> toggles surface/surface-background placing");
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
        static SCROLL_LINES = 2;

        private lines = new Array<string>();
        private cont = new createjs.Container();
        private currentLine = 0;

        private toggleFlag = true;
        private parentRef: createjs.Container = null;

        hide() {
            this.parentRef = this.parent;
            this.parent.removeChild(this);
        }

        show() {
            this.parentRef.addChild(this);
        }
        toggle() {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                if (self.parent == null) {
                    self.show();
                } else {
                    self.hide();
                }
                self.toggleFlag = false;
            }
        }

        prepareForToggle() {
            this.toggleFlag = true;
        }


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

        protected createUpButton(): Button {
            var self = this;
            let upBtn = new Button(Resources.UI_UP_KEY);
            self.addChild(upBtn);
            let btnHitAreaSide = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            let upBtnHitArea = new createjs.Shape();
            upBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            upBtn.hitArea = upBtnHitArea;
            upBtn.on("mousedown", function (evt) {
                if (self.currentLine > 0) {
                    self.currentLine -= (self.currentLine < SplashScreenUI.SCROLL_LINES ? self.currentLine : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Mixer.play(Resources.SND_CLICK_KEY);
                }
            }, null, false);
            return upBtn;
        }

        protected createDownButton(): Button {
            var self = this;
            let downBtn = new Button(Resources.UI_DOWN_KEY);
            self.addChild(downBtn);
            let btnHitAreaSide = Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2;
            let downBtnHitArea = new createjs.Shape();
            downBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            downBtn.hitArea = downBtnHitArea;
            downBtn.on("mousedown", function (evt) {
                if (self.currentLine + SplashScreenUI.LINES < self.lines.length) {
                    self.currentLine += ((self.lines.length - self.currentLine) < SplashScreenUI.SCROLL_LINES ? (self.lines.length - self.currentLine) : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Mixer.play(Resources.SND_CLICK_KEY);
                }
            }, null, false);
            return downBtn;
        }

        constructor() {
            super(SplashScreenUI.WIDTH, 20 + (SplashScreenUI.LINES + 1) * (SplashScreenUI.FONT_HEIGHT + SplashScreenUI.PADDING + SplashScreenUI.OUTLINE * 2));

            var self = this;

            var changelog = new Changelog();

            var label = new Label("LichEngine " + changelog.versions.byIndex(0).version + " by Gattaka", "20px " + Resources.FONT, Resources.DEBUG_TEXT_COLOR, true, Resources.OUTLINE_COLOR, 1);
            label.x = SplashScreenUI.MARGIN;
            label.y = SplashScreenUI.MARGIN;
            super.addChild(label);

            super.addChild(this.cont);

            // Instrukce
            self.lines.push("== INSTRUCTIONS ==");
            self.lines.push(" ");
            self.lines.push("- Press <ESC> to toggle this window");
            self.lines.push("- Press <W>, <A>, <S>, <D> to move");
            self.lines.push("- Press <I> to minimize inventory");
            self.lines.push("- Press <C> to toggle crafting window");
            self.lines.push("- Select item from inventory by <LMB> and hand skill to place on map");
            self.lines.push("- Press <LMB> to dig, place or attack");
            self.lines.push("- Press <RMB> to interact with an object");
            self.lines.push("- Hold <SHIFT> to toggle between surface and wall digging/placing");
            self.lines.push("- Hold <SHIFT> to toggle between object alternatives placing");
            self.lines.push(" ");
            self.lines.push("== CHANGELOG ==");
            self.lines.push(" ");

            changelog.versions.forEach(function (version: Version) {
                self.lines.push("Version: " + version.version);
                version.changes.forEach(function (change: string) {
                    self.lines.push("- " + change);
                });
                self.lines.push(" ");
            });

            self.print();

            var up = this.createUpButton();
            super.addChild(up);
            up.x = self.width + PartsUI.SELECT_BORDER;
            up.y = 0;

            var down = this.createDownButton();
            super.addChild(down);
            down.x = self.width + PartsUI.SELECT_BORDER;
            down.y = self.height - Resources.PARTS_SIZE - PartsUI.BORDER;

            self.cache(-5, -5,
                self.width + Resources.PARTS_SIZE + PartsUI.SELECT_BORDER * 2 + PartsUI.SELECT_BORDER + 10,
                self.height + 10);
        }

    }
}