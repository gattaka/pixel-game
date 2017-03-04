namespace Lich {

    export class Spellbook {
        private static INSTANCE: Spellbook;

        // TODO dokončit oddělení UI se Spellbookem
        private choosenSpellIndex: number;
        private spellIndex = new Array<SpellKey>();
        private altSpellIndex = new Array<SpellKey>();

        getChoosenSpellIndex(): number { return this.spellIndex[this.choosenSpellIndex]; }
        setChooseSpellIndex(choosenItemNumber: number) { return this.choosenSpellIndex = choosenItemNumber; }
        getSize(): number { return this.spellIndex.length; }

        insertSpell(i: number, spell: SpellKey, altSpell?: SpellKey) {
            this.spellIndex[i] = spell;
            this.altSpellIndex[i] = altSpell;
        }

        getChoosenSpell(alt = false): SpellKey {
            if (alt) {
                let spell = this.altSpellIndex[this.choosenSpellIndex];
                if (spell) return spell;
            }
            return this.spellIndex[this.choosenSpellIndex];
        }

        getSpellByIndex(i: number, alt = false): SpellKey {
            return alt ? this.altSpellIndex[i] : this.spellIndex[i];
        }

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

        spellContent = new Array<Button>();
        itemHighlight: PIXI.Graphics;

        constructor() {
            super(SpellsUI.N, SpellsUI.M);

            let self = this;

            // skill bude nastavitelné, takže zatím je možné ho přednastavit
            self.spellInsert(SpellKey.SPELL_DIG_KEY, SpellKey.SPELL_DIG_BGR_KEY);
            self.spellInsert(SpellKey.SPELL_PLACE_KEY, SpellKey.SPELL_PLACE_BGR_KEY);
            self.spellInsert(SpellKey.SPELL_USE_ITEM_KEY);
            self.spellInsert(SpellKey.SPELL_ENEMY_KEY);
            self.spellInsert(SpellKey.SPELL_ICEBOLT_KEY);
            self.spellInsert(SpellKey.SPELL_FIREBALL_KEY);
            self.spellInsert(SpellKey.SPELL_TELEPORT_KEY, SpellKey.SPELL_HOME_KEY);
            self.spellInsert(SpellKey.SPELL_METEOR_KEY);

            for (var i = 0; i < Spellbook.getInstance().getSize(); i++) {
                (() => {
                    let ii = i;
                    Keyboard.on(49 + ii, () => { self.selectSpell(ii); });
                })();
            }

            // zvýraznění vybrané položky
            self.itemHighlight = new Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);

            // let offset = 5;
            // self.cache(-offset, -offset, self.width + offset * 2, self.height + offset * 2);

            self.selectSpell(0);
        }

        toggleAlternative() {
            let self = this;
            // dochází ke změně?
            if (self.toggleFlag == false) {
                for (let i = 0; i < Spellbook.getInstance().getSize(); i++) {
                    let alt = Spellbook.getInstance().getSpellByIndex(i, true);
                    if (alt) {
                        let def = Resources.getInstance().getSpellDef(alt);
                        this.spellContent[i].changeSprite(def.icon);
                    }
                }
                // self.updateCache();
                self.toggleFlag = true;
            }
        }

        prepareForToggleAlternative() {
            if (this.toggleFlag) {
                for (let i = 0; i < Spellbook.getInstance().getSize(); i++) {
                    let def = Resources.getInstance().getSpellDef(Spellbook.getInstance().getSpellByIndex(i));
                    this.spellContent[i].changeSprite(def.icon);
                }
                // this.updateCache();
                this.toggleFlag = false;
            }
        }

        selectSpell(spellNumber: number) {
            let self = this;
            let button = self.spellContent[spellNumber];
            self.itemHighlight.visible = true;
            self.itemHighlight.x = button.x;
            self.itemHighlight.y = button.y;
            Spellbook.getInstance().setChooseSpellIndex(spellNumber);
            // self.updateCache();
        }

        spellInsert(spell: SpellKey, altSpell?: SpellKey) {
            let self = this;
            let spellDef = Resources.getInstance().getSpellDef(spell);
            let spellIcon = new Button(spellDef.icon, () => {
                self.selectSpell(index);
            }, undefined, true);
            self.addChild(spellIcon);
            spellIcon.x = PartsUI.SELECT_BORDER + self.spellContent.length * (Resources.PARTS_SIZE + SpellsUI.SPACING);
            spellIcon.y = PartsUI.SELECT_BORDER;
            let index = self.spellContent.push(spellIcon) - 1;
            Spellbook.getInstance().insertSpell(index, spell, altSpell)

            let text = new Label("" + self.spellContent.length);
            self.addChild(text);
            text.x = spellIcon.x + PartsUI.SELECT_BORDER;
            text.y = spellIcon.y + Resources.PARTS_SIZE + PartsUI.SELECT_BORDER - PartsUI.TEXT_SIZE;

            spellIcon.hitArea = new PIXI.Rectangle(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);

        }
    }

}