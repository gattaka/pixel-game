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
            // zvýraznění vybrané položky
            this.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            this.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            this.itemHighlightShape.graphics.setStrokeStyle(2);
            this.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + InventoryUI.INV_SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + InventoryUI.INV_SELECT_BORDER * 2, 3);
            this.itemHighlightShape.visible = false;
            this.addChild(this.itemHighlightShape);
            // kontejner položek
            this.itemsCont.x = InventoryUI.INV_BORDER;
            this.itemsCont.y = InventoryUI.INV_BORDER;
            this.addChild(this.itemsCont);
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
            if (this.toggleFlag) {
                this.visible = !(this.visible);
                this.toggleFlag = false;
            }
        };
        InventoryUI.prototype.prepareForToggleInv = function () {
            this.toggleFlag = true;
        };
        InventoryUI.prototype.invInsert = function (item, quant) {
            // zkus zvýšit počet
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof this.invContent[i] !== "undefined" && this.invContent[i].item === item) {
                    this.invContent[i].quant += quant;
                    this.invContent[i].count.text = this.invContent[i].quant;
                    return true; // přidáno
                }
            }
            // zkus založit novou
            for (var i = 0; i < InventoryUI.INV_SIZE; i++) {
                if (typeof this.invContent[i] === "undefined") {
                    var bitmap = this.game.resources.getItemBitmap(item);
                    this.itemsCont.addChild(bitmap);
                    bitmap.x = (i % InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    bitmap.y = Math.floor(i / InventoryUI.INV_LINE) * (Lich.Resources.PARTS_SIZE + InventoryUI.INV_SPACING);
                    var text = new createjs.Text(quant, "bold " + InventoryUI.TEXT_SIZE + "px Arial", "#ff0");
                    this.itemsCont.addChild(text);
                    text.x = bitmap.x;
                    text.y = bitmap.y + Lich.Resources.PARTS_SIZE - InventoryUI.TEXT_SIZE;
                    this.invContent[i] = {
                        item: item,
                        quant: quant,
                        element: bitmap,
                        count: text
                    };
                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
                    bitmap.hitArea = hitArea;
                    bitmap.on("mousedown", function (evt) {
                        if (this.choosenItem === item) {
                            this.choosenItem = null;
                            this.draggedItem = null;
                            this.itemHighlightShape.visible = false;
                        }
                        else {
                            this.itemHighlightShape.visible = true;
                            this.itemHighlightShape.x = bitmap.x - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            this.itemHighlightShape.y = bitmap.y - InventoryUI.INV_SELECT_BORDER + InventoryUI.INV_BORDER;
                            this.choosenItem = item;
                            this.draggedItem = item;
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
            // zatím rovnou:
            this.spellInsert(Lich.Resources.DIG_SPELL_KEY);
            this.spellInsert(Lich.Resources.PLACE_SPELL_KEY);
            this.spellInsert(Lich.Resources.FIREBALL_SPELL_KEY);
            this.selectSpell(Lich.Resources.FIREBALL_SPELL_KEY);
            // zvýraznění vybrané položky
            this.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            this.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            this.itemHighlightShape.graphics.setStrokeStyle(2);
            this.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + SpellsUI.SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + SpellsUI.SELECT_BORDER * 2, 3);
            this.itemHighlightShape.visible = false;
            this.addChild(this.itemHighlightShape);
            // kontejner položek
            this.itemsCont.x = SpellsUI.BORDER;
            this.itemsCont.y = SpellsUI.BORDER;
            this.addChild(this.itemsCont);
        }
        SpellsUI.prototype.handleMouse = function (mouse) {
            if (mouse.down) {
            }
        };
        SpellsUI.prototype.selectSpell = function (spell) {
            var bitmap = this.spellContent[this.spellIndex[spell]];
            this.itemHighlightShape.visible = true;
            this.itemHighlightShape.x = bitmap.x - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            this.itemHighlightShape.y = bitmap.y - SpellsUI.SELECT_BORDER + SpellsUI.BORDER;
            this.choosenItem = spell;
        };
        SpellsUI.prototype.spellInsert = function (spell) {
            var bitmap = this.game.resources.getBitmap(spell);
            this.itemsCont.addChild(bitmap);
            bitmap.x = this.spellContent.length * (Lich.Resources.PARTS_SIZE + SpellsUI.SPACING);
            bitmap.y = 0;
            this.spellIndex[spell] = this.spellContent.length;
            this.spellContent.push(bitmap);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;
            bitmap.on("mousedown", function () {
                this.selectSpell(spell);
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
