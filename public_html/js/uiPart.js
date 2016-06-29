var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var UIPart = (function (_super) {
        __extends(UIPart, _super);
        function UIPart(width, height) {
            _super.call(this);
            this.width = width;
            this.height = height;
            this.outerShape = new createjs.Shape();
            this.drawBackground();
            this.addChild(this.outerShape);
        }
        UIPart.prototype.drawBackground = function () {
            this.outerShape.graphics.clear();
            this.outerShape.graphics.setStrokeStyle(2);
            this.outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            this.outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            this.outerShape.graphics.drawRoundRect(0, 0, this.width, this.height, 3);
        };
        UIPart.BORDER = 10;
        UIPart.SELECT_BORDER = 5;
        UIPart.SPACING = 12;
        UIPart.TEXT_SIZE = 15;
        return UIPart;
    }(createjs.Container));
    Lich.UIPart = UIPart;
    var DebugLogUI = (function (_super) {
        __extends(DebugLogUI, _super);
        function DebugLogUI(x, y) {
            _super.call(this, x, y);
        }
        DebugLogUI.prototype.addNextChild = function (child) {
            if (this.height == 0) {
                this.height = DebugLogUI.PADDING * 2;
            }
            child.x = DebugLogUI.PADDING;
            child.y = this.height - DebugLogUI.PADDING;
            this.height += child.height + DebugLogUI.PADDING;
            if (child.width + 2 * DebugLogUI.PADDING > this.width) {
                this.width = child.width + 2 * DebugLogUI.PADDING;
            }
            _super.prototype.addChild.call(this, child);
            this.drawBackground();
        };
        DebugLogUI.PADDING = 5;
        return DebugLogUI;
    }(UIPart));
    Lich.DebugLogUI = DebugLogUI;
    var InvItem = (function () {
        function InvItem(item, quant, element, count) {
            this.item = item;
            this.quant = quant;
            this.element = element;
            this.count = count;
        }
        return InvItem;
    }());
    var InventoryUI = (function (_super) {
        __extends(InventoryUI, _super);
        function InventoryUI(game) {
            _super.call(this, 450, 150);
            this.game = game;
            this.toggleFlag = true;
            this.choosenItem = null;
            this.draggedItem = null;
            this.invContent = new Array();
            this.itemHighlightShape = new createjs.Shape();
            this.itemsCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + UIPart.SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + UIPart.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = UIPart.BORDER;
            self.itemsCont.y = UIPart.BORDER;
            self.addChild(self.itemsCont);
        }
        InventoryUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        InventoryUI.prototype.showInv = function () {
            this.visible = true;
        };
        InventoryUI.prototype.hideInv = function () {
            this.visible = false;
        };
        InventoryUI.prototype.toggleInv = function () {
            var self = this;
            if (self.toggleFlag) {
                self.visible = !(self.visible);
                self.toggleFlag = false;
            }
        };
        InventoryUI.prototype.prepareForToggleInv = function () {
            this.toggleFlag = true;
        };
        InventoryUI.prototype.decrease = function (item, quant) {
            var self = this;
            // TODO v případě 0 odebrat
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant -= quant;
                    invItem.count.setText(invItem.quant);
                    if (invItem.quant == 0) {
                        self.itemsCont.removeChild(invItem.element);
                        self.itemsCont.removeChild(invItem.count);
                        self.choosenItem = null;
                        self.draggedItem = null;
                        self.itemHighlightShape.visible = false;
                        self.invContent[i] = null;
                    }
                    return; // hotovo
                }
            }
        };
        InventoryUI.prototype.invInsert = function (item, quant) {
            var self = this;
            // zkus zvýšit počet
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                var invItem = self.invContent[i];
                if (invItem != null && invItem.item === item) {
                    invItem.quant += quant;
                    invItem.count.setText(invItem.quant);
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (self.invContent[i] == null) {
                    var sprite = self.game.resources.getSprite(item);
                    self.itemsCont.addChild(sprite);
                    sprite.x = (i % InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + UIPart.SPACING);
                    sprite.y = Math.floor(i / InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + UIPart.SPACING);
                    var text = new Lich.Label("" + quant, UIPart.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
                    self.itemsCont.addChild(text);
                    text.x = sprite.x;
                    text.y = sprite.y + Lich.Resources.PARTS_SIZE - UIPart.TEXT_SIZE;
                    self.invContent[i] = new InvItem(item, quant, sprite, text);
                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
                    sprite.hitArea = hitArea;
                    sprite.on("mousedown", function (evt) {
                        if (self.choosenItem === item) {
                            self.choosenItem = null;
                            self.draggedItem = null;
                            self.itemHighlightShape.visible = false;
                        }
                        else {
                            self.itemHighlightShape.visible = true;
                            self.itemHighlightShape.x = sprite.x - UIPart.SELECT_BORDER + UIPart.BORDER;
                            self.itemHighlightShape.y = sprite.y - UIPart.SELECT_BORDER + UIPart.BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;
                        }
                    }, null, false);
                    return true; // usazeno
                }
            }
            return false; // nevešel se
        };
        InventoryUI.INV_LINE = 10;
        InventoryUI.INV_SIZE = 20;
        return InventoryUI;
    }(UIPart));
    Lich.InventoryUI = InventoryUI;
    var SpellsUI = (function (_super) {
        __extends(SpellsUI, _super);
        function SpellsUI(game) {
            _super.call(this, SpellsUI.n * Lich.Resources.PARTS_SIZE + (SpellsUI.n - 1) * (SpellsUI.SPACING) + 2 * SpellsUI.BORDER, Lich.Resources.PARTS_SIZE + 2 * SpellsUI.BORDER);
            this.game = game;
            this.choosenItem = {};
            this.spellContent = [];
            this.spellIndex = {};
            this.itemsCont = new createjs.Container();
            this.itemHighlightShape = new createjs.Shape();
            var self = this;
            // zatím rovnou:
            self.spellInsert(Lich.Resources.SPELL_DIG_KEY);
            self.spellInsert(Lich.Resources.SPELL_PLACE_KEY);
            self.spellInsert(Lich.Resources.SPELL_FIREBALL_KEY);
            self.selectSpell(Lich.Resources.SPELL_FIREBALL_KEY);
            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + SpellsUI.SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + SpellsUI.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = SpellsUI.BORDER;
            self.itemsCont.y = SpellsUI.BORDER;
            self.addChild(self.itemsCont);
        }
        SpellsUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        SpellsUI.prototype.selectSpell = function (spell) {
            var self = this;
            var bitmap = self.spellContent[self.spellIndex[spell]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            self.choosenItem = spell;
        };
        SpellsUI.prototype.spellInsert = function (spell) {
            var self = this;
            var bitmap = self.game.resources.getBitmap(spell);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.spellContent.length * (Lich.Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            self.spellIndex[spell] = self.spellContent.length;
            self.spellContent.push(bitmap);
            var text = new Lich.Label("" + self.spellContent.length, UIPart.TEXT_SIZE + "px " + Lich.Resources.FONT, Lich.Resources.TEXT_COLOR, true, Lich.Resources.OUTLINE_COLOR, 1);
            self.itemsCont.addChild(text);
            text.x = bitmap.x;
            text.y = bitmap.y + Lich.Resources.PARTS_SIZE - UIPart.TEXT_SIZE;
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;
            bitmap.on("mousedown", function () {
                self.selectSpell(spell);
            }, null, false);
        };
        SpellsUI.n = 3;
        return SpellsUI;
    }(UIPart));
    Lich.SpellsUI = SpellsUI;
    var MusicUI = (function (_super) {
        __extends(MusicUI, _super);
        function MusicUI(game) {
            _super.call(this, MusicUI.n * Lich.Resources.PARTS_SIZE + (MusicUI.n - 1) * (UIPart.SPACING) + 2 * UIPart.BORDER, Lich.Resources.PARTS_SIZE + 2 * UIPart.BORDER);
            this.game = game;
            this.choosenItem = {};
            this.trackContent = [];
            this.trackIndex = {};
            this.reversedTrackIndex = [];
            this.itemsCont = new createjs.Container();
            this.itemHighlightShape = new createjs.Shape();
            var self = this;
            // zatím rovnou:
            self.trackInsert(Lich.Resources.MSC_DIRT_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_BUILD_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_BOSS_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_KRYSTAL_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_FLOOD_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_LAVA_THEME_KEY);
            self.selectTrack(Lich.Resources.MSC_DIRT_THEME_KEY);
            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + UIPart.SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + UIPart.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = UIPart.BORDER;
            self.itemsCont.y = UIPart.BORDER;
            self.addChild(self.itemsCont);
        }
        MusicUI.prototype.selectTrack = function (track) {
            var self = this;
            var bitmap = self.trackContent[self.trackIndex[track]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - UIPart.SELECT_BORDER + UIPart.BORDER;
            self.itemHighlightShape.y = bitmap.y - UIPart.SELECT_BORDER + UIPart.BORDER;
            self.choosenItem = track;
            for (var i = 0; i < self.reversedTrackIndex.length; i++) {
                if (self.reversedTrackIndex[i] != track) {
                    Lich.Mixer.stop(self.reversedTrackIndex[i]);
                }
            }
            Lich.Mixer.play(track, true);
        };
        MusicUI.prototype.trackInsert = function (track) {
            var self = this;
            var bitmap = self.game.resources.getBitmap(Lich.Resources.UI_SOUND_KEY);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.trackContent.length * (Lich.Resources.PARTS_SIZE + UIPart.SPACING);
            bitmap.y = 0;
            self.trackIndex[track] = self.trackContent.length;
            self.reversedTrackIndex[self.trackContent.length] = track;
            self.trackContent.push(bitmap);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;
            bitmap.on("mousedown", function () {
                self.selectTrack(track);
            }, null, false);
        };
        MusicUI.n = 6;
        return MusicUI;
    }(UIPart));
    Lich.MusicUI = MusicUI;
})(Lich || (Lich = {}));
