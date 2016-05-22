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
            var outerShape = new createjs.Shape();
            outerShape.graphics.setStrokeStyle(2);
            outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
            outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
            outerShape.graphics.drawRoundRect(0, 0, width, height, 3);
            this.addChild(outerShape);
        }
        return UIPart;
    }(createjs.Container));
    Lich.UIPart = UIPart;
    var InventoryUI = (function (_super) {
        __extends(InventoryUI, _super);
        function InventoryUI(game) {
            _super.call(this, 450, 150);
            this.game = game;
            this.toggleFlag = true;
            this.choosenItem = null;
            this.draggedItem = null;
            this.invContent = [];
            this.itemHighlightShape = new createjs.Shape();
            this.itemsCont = new createjs.Container();
            var self = this;
            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + InventoryUI.INV_SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + InventoryUI.INV_SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = InventoryUI.INV_BORDER;
            self.itemsCont.y = InventoryUI.INV_BORDER;
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
        InventoryUI.prototype.invInsert = function (item, quant) {
            var self = this;
            // zkus zvýšit počet
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof self.invContent[i] !== "undefined" && self.invContent[i].item === item) {
                    self.invContent[i].quant += quant;
                    self.invContent[i].count.text = self.invContent[i].quant;
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof self.invContent[i] === "undefined") {
                    var sprite = self.game.resources.getSprite(item);
                    self.itemsCont.addChild(sprite);
                    sprite.x = (i % InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    sprite.y = Math.floor(i / InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    var text = new createjs.Text(quant, "bold " + InventoryUI.TEXT_SIZE + "px Arial", "#ff0");
                    self.itemsCont.addChild(text);
                    text.x = sprite.x;
                    text.y = sprite.y + Lich.Resources.PARTS_SIZE - InventoryUI.TEXT_SIZE;
                    self.invContent[i] = {
                        item: item,
                        quant: quant,
                        element: sprite,
                        count: text
                    };
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
                            self.itemHighlightShape.x = sprite.x - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            self.itemHighlightShape.y = sprite.y - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            self.choosenItem = item;
                            self.draggedItem = item;
                        }
                    }, null, false);
                    return true; // usazeno
                }
            }
            return false; // nevešel se
        };
        InventoryUI.INV_BORDER = 10;
        InventoryUI.INV_SELECT_BORDER = 5;
        InventoryUI.INV_SPACING = 12;
        InventoryUI.INV_LINE = 10;
        InventoryUI.INV_SIZE = 20;
        InventoryUI.TEXT_SIZE = 10;
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
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;
            bitmap.on("mousedown", function () {
                self.selectSpell(spell);
            }, null, false);
        };
        SpellsUI.BORDER = 10;
        SpellsUI.SELECT_BORDER = 5;
        SpellsUI.SPACING = 12;
        SpellsUI.n = 3;
        return SpellsUI;
    }(UIPart));
    Lich.SpellsUI = SpellsUI;
})(Lich || (Lich = {}));
