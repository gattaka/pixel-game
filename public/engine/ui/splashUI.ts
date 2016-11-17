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

            version = new Version("0.9");
            version.addChange("Enemy AI improved");
            version.addChange("Enemy spawning fixed");
            version.addChange("Enemy loot");
            version.addChange("Enemies can kill");
            version.addChange("Teleport spell introduced");
            version.addChange("Sprites light improved");
            version.addChange("New background");
            version.addChange("Tiles layout changed");
            version.addChange("DEV levitation control changed");
            version.addChange("Platforms introduced");
            version.addChange("Player spawning point");
            this.addVersion(version);

            version = new Version("0.8");
            version.addChange("Iron fence introduced");
            version.addChange("Workstations");
            this.addVersion(version);

            version = new Version("0.7");
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

            version = new Version("0.6");
            version.addChange("Save/Load/New-world buttons");
            version.addChange("Meteor spell");
            this.addVersion(version);

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
            self.lines.push("== INSTRUCTIONS ==");
            self.lines.push(" ");
            self.lines.push("- Press <ESC> to toggle this window");
            self.lines.push("- Press <W>, <A>, <S>, <D> or arrow keys to move");
            self.lines.push("- Press <I> to minimize inventory");
            self.lines.push("- Press <C> to toggle crafting window");
            self.lines.push("- Press <M> to toggle map");
            self.lines.push("- Select item from inventory by <LMB> and hand skill to place on map");
            self.lines.push("- Press <LMB> to dig, place or attack");
            self.lines.push("- Press <RMB> to interact with an object or workstation");
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