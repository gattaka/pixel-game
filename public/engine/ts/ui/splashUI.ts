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
            let upBtn = new Button(UIGFXKey.UI_UP_KEY);
            self.addChild(upBtn);
            upBtn.on("click", function (evt) {
                if (self.currentLine > 0) {
                    self.currentLine -= (self.currentLine < SplashScreenUI.SCROLL_LINES ? self.currentLine : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            return upBtn;
        }

        protected createDownButton(): Button {
            var self = this;
            let downBtn = new Button(UIGFXKey.UI_DOWN_KEY);
            self.addChild(downBtn);
            downBtn.on("click", function (evt) {
                if (self.currentLine + SplashScreenUI.LINES < self.lines.length) {
                    self.currentLine += ((self.lines.length - self.currentLine) < SplashScreenUI.SCROLL_LINES ? (self.lines.length - self.currentLine) : SplashScreenUI.SCROLL_LINES);
                    self.print();
                    self.updateCache();
                    Mixer.playSound(SoundKey.SND_CLICK_KEY);
                }
            }, null, false);
            return downBtn;
        }

        protected createSaveButton(): Button {
            var self = this;
            let btn = new Button(UIGFXKey.UI_SAVE_KEY);
            self.addChild(btn);
            btn.on("click", function (evt) {
                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.SAVE_WORLD));
                Mixer.playSound(SoundKey.SND_CLICK_KEY);
                self.hide();
            }, null, false);
            return btn;
        }

        protected createLoadButton(): Button {
            var self = this;
            let btn = new Button(UIGFXKey.UI_LOAD_KEY);
            self.addChild(btn);
            btn.on("click", function (evt) {
                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_WORLD));
                Mixer.playSound(SoundKey.SND_CLICK_KEY);
            }, null, false);
            return btn;
        }

        protected createNewWorldButton(): Button {
            var self = this;
            let btn = new Button(UIGFXKey.UI_NEW_WORLD_KEY);
            self.addChild(btn);
            btn.on("click", function (evt) {
                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.NEW_WORLD));
                Mixer.playSound(SoundKey.SND_CLICK_KEY);
            }, null, false);
            return btn;
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

            var save = this.createSaveButton();
            super.addChild(save);
            save.x = 0 - PartsUI.SELECT_BORDER - Resources.PARTS_SIZE - PartsUI.BORDER;
            save.y = 0;

            var load = this.createLoadButton();
            super.addChild(load);
            load.x = 0 - PartsUI.SELECT_BORDER - Resources.PARTS_SIZE - PartsUI.BORDER;
            load.y = PartsUI.SELECT_BORDER + Resources.PARTS_SIZE + PartsUI.BORDER;

            var newWorld = this.createNewWorldButton();
            super.addChild(newWorld);
            newWorld.x = 0 - PartsUI.SELECT_BORDER - Resources.PARTS_SIZE - PartsUI.BORDER;
            newWorld.y = 2 * (PartsUI.SELECT_BORDER + Resources.PARTS_SIZE + PartsUI.BORDER);

            self.cache(-(Resources.PARTS_SIZE + PartsUI.SELECT_BORDER + PartsUI.SELECT_BORDER + 10), -10,
                self.width + (Resources.PARTS_SIZE + PartsUI.SELECT_BORDER + PartsUI.SELECT_BORDER) * 2 + 20,
                self.height + 20);
        }

    }
}