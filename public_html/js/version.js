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
            var self = this;
            var changelog = new Changelog();
            var label = new Lich.Label("LichEngine " + changelog.versions.byIndex(0).version, "20px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            label.x = SplashScreenUI.MARGIN;
            label.y = SplashScreenUI.MARGIN;
            _super.prototype.addChild.call(this, label);
            _super.prototype.addChild.call(this, this.cont);
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
            up.x = self.width - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;
            up.y = SplashScreenUI.MARGIN;
            var down = this.createDownButton();
            _super.prototype.addChild.call(this, down);
            down.x = self.width - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;
            down.y = self.height - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;
            var close = this.createCloseButton();
            _super.prototype.addChild.call(this, close);
            close.x = self.width / 2 - 42 / 2;
            close.y = self.height - SplashScreenUI.MARGIN - SplashScreenUI.BTN_SIDE;
        }
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
        SplashScreenUI.prototype.createBaseButtonShape = function (width, height) {
            var self = this;
            var shape = new createjs.Shape();
            shape.graphics.beginStroke("rgba(250,250,10,0.5)");
            shape.graphics.setStrokeStyle(2);
            shape.graphics.drawRoundRect(0, 0, width, height, 3);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, width, height);
            shape.hitArea = hitArea;
            return shape;
        };
        SplashScreenUI.prototype.createUpButton = function () {
            var self = this;
            var shape = self.createBaseButtonShape(SplashScreenUI.BTN_SIDE, SplashScreenUI.BTN_SIDE);
            shape.graphics.beginFill("rgba(250,250,10,1)");
            shape.graphics.drawPolyStar(SplashScreenUI.BTN_SIDE / 2, SplashScreenUI.BTN_SIDE / 2 + 1, 5, 3, 0.5, -90);
            shape.on("mousedown", function () {
                if (self.currentLine > 0) {
                    self.currentLine--;
                    self.print();
                }
            }, null, false);
            return shape;
        };
        SplashScreenUI.prototype.createDownButton = function () {
            var self = this;
            var shape = self.createBaseButtonShape(SplashScreenUI.BTN_SIDE, SplashScreenUI.BTN_SIDE);
            shape.graphics.beginFill("rgba(250,250,10,1)");
            shape.graphics.drawPolyStar(SplashScreenUI.BTN_SIDE / 2, SplashScreenUI.BTN_SIDE / 2 - 1, 5, 3, 0.5, 90);
            shape.on("mousedown", function () {
                if (self.currentLine + SplashScreenUI.LINES < self.lines.length) {
                    self.currentLine++;
                    self.print();
                }
            }, null, false);
            return shape;
        };
        SplashScreenUI.prototype.createCloseButton = function () {
            var self = this;
            var shape = self.createBaseButtonShape(42, SplashScreenUI.BTN_SIDE);
            var cont = new createjs.Container();
            cont.on("mousedown", function () {
                self.parent.removeChild(self);
            }, null, false);
            cont.hitArea = shape.hitArea;
            cont.addChild(shape);
            var label = new Lich.Label("CLOSE", "12px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR);
            cont.addChild(label);
            label.x = 4;
            label.y = 2;
            return cont;
        };
        SplashScreenUI.MARGIN = 8;
        SplashScreenUI.PADDING = 5;
        SplashScreenUI.LINES = 20;
        SplashScreenUI.FONT_HEIGHT = 15;
        SplashScreenUI.TOP_OFFSET = 40;
        SplashScreenUI.WIDTH = 500;
        SplashScreenUI.OUTLINE = 1;
        SplashScreenUI.BTN_SIDE = 20;
        return SplashScreenUI;
    }(Lich.AbstractUI));
    Lich.SplashScreenUI = SplashScreenUI;
})(Lich || (Lich = {}));
