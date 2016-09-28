var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Version = (function () {
        function Version(version) {
            this.version = version;
            this.changes = new Array();
        }
        Version.prototype.addChange = function (change) {
            this.changes.push(change);
            return this;
        };
        return Version;
    }());
    Lich.Version = Version;
    var Changelog = (function () {
        function Changelog() {
            this.versions = new Lich.Table();
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
        Changelog.prototype.addVersion = function (version) {
            this.versions.insert(version.version, version);
            return this;
        };
        return Changelog;
    }());
    Lich.Changelog = Changelog;
    var SplashScreenUI = (function (_super) {
        __extends(SplashScreenUI, _super);
        function SplashScreenUI() {
            _super.call(this, SplashScreenUI.WIDTH, 20 + (SplashScreenUI.LINES + 1) * (SplashScreenUI.FONT_HEIGHT + SplashScreenUI.PADDING + SplashScreenUI.OUTLINE * 2));
            this.lines = new Array();
            this.cont = new createjs.Container();
            this.currentLine = 0;
            this.toggleFlag = true;
            this.parentRef = null;
            var self = this;
            var changelog = new Changelog();
            var label = new Lich.Label("LichEngine " + changelog.versions.byIndex(0).version + " by Gattaka", "20px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            label.x = SplashScreenUI.MARGIN;
            label.y = SplashScreenUI.MARGIN;
            _super.prototype.addChild.call(this, label);
            _super.prototype.addChild.call(this, this.cont);
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
            changelog.versions.forEach(function (version) {
                self.lines.push("Version: " + version.version);
                version.changes.forEach(function (change) {
                    self.lines.push("- " + change);
                });
                self.lines.push(" ");
            });
            self.print();
            var up = this.createUpButton();
            _super.prototype.addChild.call(this, up);
            up.x = self.width + Lich.PartsUI.SELECT_BORDER;
            up.y = 0;
            var down = this.createDownButton();
            _super.prototype.addChild.call(this, down);
            down.x = self.width + Lich.PartsUI.SELECT_BORDER;
            down.y = self.height - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            self.cache(-5, -5, self.width + Lich.Resources.PARTS_SIZE + Lich.PartsUI.SELECT_BORDER * 2 + Lich.PartsUI.SELECT_BORDER + 10, self.height + 10);
        }
        SplashScreenUI.prototype.hide = function () {
            this.parentRef = this.parent;
            this.parent.removeChild(this);
        };
        SplashScreenUI.prototype.show = function () {
            this.parentRef.addChild(this);
        };
        SplashScreenUI.prototype.toggle = function () {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag) {
                if (self.parent == null) {
                    self.show();
                }
                else {
                    self.hide();
                }
                self.toggleFlag = false;
            }
        };
        SplashScreenUI.prototype.prepareForToggle = function () {
            this.toggleFlag = true;
        };
        SplashScreenUI.prototype.print = function () {
            this.cont.removeAllChildren();
            for (var i = 0; i < SplashScreenUI.LINES; i++) {
                if (this.lines[i + this.currentLine] == null)
                    break;
                var child = new Lich.Label(this.lines[i + this.currentLine], SplashScreenUI.FONT_HEIGHT + "px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, SplashScreenUI.OUTLINE);
                this.cont.addChild(child);
                child.x = SplashScreenUI.MARGIN;
                child.y = SplashScreenUI.TOP_OFFSET + i * (SplashScreenUI.FONT_HEIGHT + SplashScreenUI.PADDING);
            }
        };
        SplashScreenUI.prototype.createUpButton = function () {
            var self = this;
            var upBtn = new Lich.Button(Lich.UIGFXKey.UI_UP_KEY);
            self.addChild(upBtn);
            var btnHitAreaSide = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SELECT_BORDER * 2;
            var upBtnHitArea = new createjs.Shape();
            upBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            upBtn.hitArea = upBtnHitArea;
            upBtn.on("mousedown", function (evt) {
                if (self.currentLine > 0) {
                    self.currentLine -= (self.currentLine < SplashScreenUI.SCROLL_LINES ? self.currentLine : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Lich.Mixer.play(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            return upBtn;
        };
        SplashScreenUI.prototype.createDownButton = function () {
            var self = this;
            var downBtn = new Lich.Button(Lich.UIGFXKey.UI_DOWN_KEY);
            self.addChild(downBtn);
            var btnHitAreaSide = Lich.Resources.PARTS_SIZE + Lich.PartsUI.SELECT_BORDER * 2;
            var downBtnHitArea = new createjs.Shape();
            downBtnHitArea.graphics.beginFill("#000").drawRect(0, 0, btnHitAreaSide, btnHitAreaSide);
            downBtn.hitArea = downBtnHitArea;
            downBtn.on("mousedown", function (evt) {
                if (self.currentLine + SplashScreenUI.LINES < self.lines.length) {
                    self.currentLine += ((self.lines.length - self.currentLine) < SplashScreenUI.SCROLL_LINES ? (self.lines.length - self.currentLine) : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Lich.Mixer.play(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            return downBtn;
        };
        SplashScreenUI.MARGIN = 8;
        SplashScreenUI.PADDING = 5;
        SplashScreenUI.LINES = 20;
        SplashScreenUI.FONT_HEIGHT = 15;
        SplashScreenUI.TOP_OFFSET = 40;
        SplashScreenUI.WIDTH = 500;
        SplashScreenUI.OUTLINE = 1;
        SplashScreenUI.SCROLL_LINES = 2;
        return SplashScreenUI;
    }(Lich.AbstractUI));
    Lich.SplashScreenUI = SplashScreenUI;
})(Lich || (Lich = {}));
