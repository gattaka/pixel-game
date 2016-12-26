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
            version = new Version("0.16 - Dec 26, 2016");
            version.addChange("Minimap surface and background colors fixed");
            version.addChange("Mobile version ready");
            version.addChange("Surfaces basic transitions");
            this.addVersion(version);
            version = new Version("0.15 - Dec 18, 2016");
            version.addChange("Christmas baubles introduced");
            version.addChange("Christmas tree introduced");
            version.addChange("Christmas holly introduced");
            version.addChange("Christmas advent wreath introduced");
            version.addChange("Winter themed sprites");
            version.addChange("Weather (snow and rain) introduced");
            version.addChange("Collision bug fixed (ignoring skewed surface when high speed)");
            version.addChange("Torch alignment changed");
            version.addChange("Snowflake, snowball and snowman introduced");
            version.addChange("Gifts!");
            version.addChange("New 'use item/consume' spell icon");
            version.addChange("Woodwall and straw wall sprites fixed");
            version.addChange("Woodwall window introduced");
            version.addChange("Wood chair introduced");
            version.addChange("Wood table introduced");
            this.addVersion(version);
            version = new Version("0.14 - Dec 4, 2016");
            version.addChange("Chicken boss AI improved");
            version.addChange("Enemies and critters healthbars");
            version.addChange("Background music changed");
            version.addChange("Consume spell");
            version.addChange("Consumable items");
            version.addChange("Cauldron workstation introduced");
            version.addChange("Health potion introduced");
            this.addVersion(version);
            version = new Version("0.13 - Dec 1, 2016");
            version.addChange("New cursor");
            version.addChange("Bunnies introduced");
            version.addChange("Helpfile improved");
            version.addChange("Critters autospawn");
            version.addChange("Chicken boss introduced");
            version.addChange("Chicken talons introduced");
            version.addChange("Do not kill the chickens...");
            this.addVersion(version);
            version = new Version("0.12 - Nov 28, 2016");
            version.addChange("Gold introduced");
            version.addChange("Chandelier introduced");
            version.addChange("Chickens!");
            this.addVersion(version);
            version = new Version("0.11 - Nov 23, 2016");
            version.addChange("Skewed surfaces movement");
            version.addChange("Skewed roof surface");
            version.addChange("Skewed rock brick surface");
            version.addChange("Minor collision bugfixes");
            version.addChange("Background corners");
            version.addChange("Rock brick wall windows introduced");
            version.addChange("Knight statue introduced");
            version.addChange("Chain ladder introduced");
            version.addChange("Nature grow");
            version.addChange("Banners introduced");
            version.addChange("Krystal and florite sprites improved");
            version.addChange("Flower pot introduced");
            version.addChange("Help file created (? Button)");
            this.addVersion(version);
            version = new Version("0.10 - Nov 19, 2016");
            version.addChange("Tiles layout changed");
            version.addChange("DEV levitation control changed to <SPACE>");
            version.addChange("Platforms introduced");
            version.addChange("Player spawning point");
            version.addChange("Gravity kills");
            version.addChange("Teleport animation");
            version.addChange("Ladders introduced");
            version.addChange("Fireplace introduced");
            this.addVersion(version);
            version = new Version("0.9 - Nov 13, 2016");
            version.addChange("Enemy AI improved");
            version.addChange("Enemy spawning fixed");
            version.addChange("Enemy loot");
            version.addChange("Enemies can kill");
            version.addChange("Teleport spell introduced");
            version.addChange("Sprites light improved");
            version.addChange("New background");
            this.addVersion(version);
            version = new Version("0.8 - Oct 23, 2016");
            version.addChange("Iron fence introduced");
            version.addChange("Workstations");
            this.addVersion(version);
            version = new Version("0.7 - Oct 17, 2016");
            version.addChange("Optimization");
            version.addChange("Surface sprites and map format extended");
            version.addChange("Minor GFX changes");
            version.addChange("Arrow keys movement");
            version.addChange("Coal introduced");
            version.addChange("Iron introduced");
            version.addChange("Roof introduced");
            version.addChange("Rock and rock bricks introduced");
            version.addChange("Torches and new fireplace introduced");
            version.addChange("Smelter and anvil introduced");
            version.addChange("Surface separation (surface transitions)");
            version.addChange("Fall speed limited");
            version.addChange("UI-or-World mouse dispatch improved");
            version.addChange("Player collision with surface improved");
            version.addChange("Hills");
            version.addChange("Minimap reimplemented");
            this.addVersion(version);
            version = new Version("0.6 - Oct 14, 2016");
            version.addChange("Save/Load/New-world buttons");
            version.addChange("Meteor spell");
            this.addVersion(version);
            version = new Version("0.5 - Sep 25, 2016");
            version.addChange("Crafting introduced");
            version.addChange("Doors added");
            version.addChange("Object <RMB> interacting (open/close doors)");
            version.addChange("Object collisions (closed doors)");
            version.addChange("<SHIFT> toggles object alternative placing (L/R doors)");
            version.addChange("Inventory paging");
            this.addVersion(version);
            version = new Version("0.4 - Jul 10, 2016");
            version.addChange("Grave and bones added");
            version.addChange("Surface background digging");
            version.addChange("<SHIFT> toggles surface/surface-background digging");
            version.addChange("Surface background does not collide with objects anymore");
            version.addChange("Health and Will UI improved");
            version.addChange("Health and Will regeneration");
            version.addChange("Spells cost");
            this.addVersion(version);
            version = new Version("0.3 - Jul 7, 2016");
            version.addChange("Placing walls (surface background)");
            version.addChange("DEV FEATURE: multijump on <S> key");
            version.addChange("DEV FEATURE: enemies spawn spell");
            version.addChange("Spells cooldown");
            version.addChange("Bullet mechanics improved");
            version.addChange("<SHIFT> toggles surface/surface-background placing");
            this.addVersion(version);
            version = new Version("0.2 - Jul 2, 2016");
            version.addChange("Animated objects");
            version.addChange("Placing surfaces and objects");
            version.addChange("Inventory collapsing");
            version.addChange("Dirt background");
            this.addVersion(version);
            version = new Version("0.1 - Feb 11, 2016");
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
            var label = new Lich.Label("LichEngine " + changelog.versions.byIndex(0).version + " by Gattaka", "20px " + Lich.Resources.FONT, Lich.Resources.DEBUG_TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            label.x = SplashScreenUI.MARGIN;
            label.y = SplashScreenUI.MARGIN;
            _super.prototype.addChild.call(this, label);
            _super.prototype.addChild.call(this, this.cont);
            // Instrukce
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
            var save = this.createSaveButton();
            _super.prototype.addChild.call(this, save);
            save.x = 0 - Lich.PartsUI.SELECT_BORDER - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            save.y = 0;
            var load = this.createLoadButton();
            _super.prototype.addChild.call(this, load);
            load.x = 0 - Lich.PartsUI.SELECT_BORDER - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            load.y = Lich.PartsUI.SELECT_BORDER + Lich.Resources.PARTS_SIZE + Lich.PartsUI.BORDER;
            var newWorld = this.createNewWorldButton();
            _super.prototype.addChild.call(this, newWorld);
            newWorld.x = 0 - Lich.PartsUI.SELECT_BORDER - Lich.Resources.PARTS_SIZE - Lich.PartsUI.BORDER;
            newWorld.y = 2 * (Lich.PartsUI.SELECT_BORDER + Lich.Resources.PARTS_SIZE + Lich.PartsUI.BORDER);
            self.cache(-(Lich.Resources.PARTS_SIZE + Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.SELECT_BORDER + 10), -10, self.width + (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.SELECT_BORDER) * 2 + 20, self.height + 20);
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
        SplashScreenUI.prototype.createUpButton = function () {
            var self = this;
            var upBtn = new Lich.Button(Lich.UIGFXKey.UI_UP_KEY);
            self.addChild(upBtn);
            upBtn.on("click", function (evt) {
                if (self.currentLine > 0) {
                    self.currentLine -= (self.currentLine < SplashScreenUI.SCROLL_LINES ? self.currentLine : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            return upBtn;
        };
        SplashScreenUI.prototype.createDownButton = function () {
            var self = this;
            var downBtn = new Lich.Button(Lich.UIGFXKey.UI_DOWN_KEY);
            self.addChild(downBtn);
            downBtn.on("click", function (evt) {
                if (self.currentLine + SplashScreenUI.LINES < self.lines.length) {
                    self.currentLine += ((self.lines.length - self.currentLine) < SplashScreenUI.SCROLL_LINES ? (self.lines.length - self.currentLine) : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            return downBtn;
        };
        SplashScreenUI.prototype.createSaveButton = function () {
            var self = this;
            var btn = new Lich.Button(Lich.UIGFXKey.UI_SAVE_KEY);
            self.addChild(btn);
            btn.on("click", function (evt) {
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.SAVE_WORLD));
                Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
                self.hide();
            }, null, false);
            return btn;
        };
        SplashScreenUI.prototype.createLoadButton = function () {
            var self = this;
            var btn = new Lich.Button(Lich.UIGFXKey.UI_LOAD_KEY);
            self.addChild(btn);
            btn.on("click", function (evt) {
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_WORLD));
                Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
            }, null, false);
            return btn;
        };
        SplashScreenUI.prototype.createNewWorldButton = function () {
            var self = this;
            var btn = new Lich.Button(Lich.UIGFXKey.UI_NEW_WORLD_KEY);
            self.addChild(btn);
            btn.on("click", function (evt) {
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.NEW_WORLD));
                Lich.Mixer.playSound(Lich.SoundKey.SND_CLICK_KEY);
            }, null, false);
            return btn;
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
