namespace Lich {

    export class Spellbook {
        private static INSTANCE: Spellbook;

        // TODO dokončit oddělení UI se Spellbookem
        public choosenItemNumber: number;
        public spellIndex = new Array<SpellKey>();
        public alternativeSpellIndex = new Array<SpellKey>();

        getChoosenSpell() { return this.choosenItemNumber; }

        public static getInstance() {
            if (!Spellbook.INSTANCE) {
                Spellbook.INSTANCE = new Spellbook();
            }
            return Spellbook.INSTANCE;
        }

        private constructor() { }
    }

    export class SpellsUI extends PartsUI {

        static N = 8;
        static M = 1;

        toggleFlag = false;

        spellContent = new Array<PIXI.Sprite>();
        itemsCont = new PIXI.Container();
        itemHighlight: PIXI.Graphics;

        constructor() {
            super(SpellsUI.N, SpellsUI.M);

            var self = this;

            // skill bude nastavitelné, takže zatím je možné ho přednastavit
            self.spellInsert(SpellKey.SPELL_DIG_KEY, SpellKey.SPELL_DIG_BGR_KEY);
            self.spellInsert(SpellKey.SPELL_PLACE_KEY, SpellKey.SPELL_PLACE_BGR_KEY);
            self.spellInsert(SpellKey.SPELL_USE_ITEM_KEY);
            self.spellInsert(SpellKey.SPELL_ENEMY_KEY);
            self.spellInsert(SpellKey.SPELL_ICEBOLT_KEY);
            self.spellInsert(SpellKey.SPELL_FIREBALL_KEY);
            self.spellInsert(SpellKey.SPELL_TELEPORT_KEY, SpellKey.SPELL_HOME_KEY);
            self.spellInsert(SpellKey.SPELL_METEOR_KEY);

            // zvýraznění vybrané položky
            self.itemHighlight = new Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);

            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);

            // let offset = 5;
            // self.cache(-offset, -offset, self.width + offset * 2, self.height + offset * 2);

            self.selectSpell(0);
        }

        toggleShift() {
            var self = this;
            // dochází ke změně?
            if (self.toggleFlag == false) {
                for (var i = 0; i < Spellbook.getInstance().spellIndex.length; i++) {
                    var alt = Spellbook.getInstance().alternativeSpellIndex[i];
                    if (alt) {
                        Resources.getInstance().getSpellUISprite(alt, this.spellContent[i]);
                    }
                }
                // self.updateCache();
                self.toggleFlag = true;
            }
        }

        prepareForToggleShift() {
            if (this.toggleFlag) {
                for (var i = 0; i < Spellbook.getInstance().spellIndex.length; i++) {
                    Resources.getInstance().getSpellUISprite(Spellbook.getInstance().spellIndex[i], this.spellContent[i]);
                }
                // this.updateCache();
                this.toggleFlag = false;
            }
        }

        selectSpell(spellNumber: number) {
            var self = this;
            var bitmap = self.spellContent[spellNumber];
            self.itemHighlight.visible = true;
            self.itemHighlight.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlight.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            Spellbook.getInstance().choosenItemNumber = spellNumber;
            // self.updateCache();
        }

        getChoosenSpell(): SpellKey {
            var alt = Spellbook.getInstance().alternativeSpellIndex[Spellbook.getInstance().choosenItemNumber];
            if (this.toggleFlag && typeof alt !== "undefined") {
                return alt;
            } else {
                return Spellbook.getInstance().spellIndex[Spellbook.getInstance().choosenItemNumber];
            }
        }

        spellInsert(spell: SpellKey, altSpell?: SpellKey) {
            var self = this;
            var spellIcon = Resources.getInstance().getSpellUISprite(spell);
            self.itemsCont.addChild(spellIcon);
            spellIcon.x = self.spellContent.length * (Resources.PARTS_SIZE + SpellsUI.SPACING);
            spellIcon.y = 0;
            var index = Spellbook.getInstance().spellIndex.length;
            Spellbook.getInstance().spellIndex[index] = spell;
            Spellbook.getInstance().alternativeSpellIndex[index] = altSpell;
            self.spellContent.push(spellIcon);

            var text = new Label("" + self.spellContent.length);
            self.itemsCont.addChild(text);
            text.x = spellIcon.x;
            text.y = spellIcon.y + Resources.PARTS_SIZE - PartsUI.TEXT_SIZE;

            spellIcon.hitArea = new PIXI.Rectangle(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);

            spellIcon.on("mousedown", () => {
                self.selectSpell(index);
            });
        }
    }

}