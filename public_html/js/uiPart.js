/*global createjs*/
/*global resources*/

var lich = lich || {};

lich.UIPart = function (width, height) {
    createjs.Container.call(this);

    this.width = width;
    this.height = height;

    var outerShape = new createjs.Shape();
    outerShape.graphics.setStrokeStyle(2);
    outerShape.graphics.beginStroke("rgba(0,0,0,0.7)");
    outerShape.graphics.beginFill("rgba(10,50,10,0.5)");
    outerShape.graphics.drawRoundRect(0, 0, width, height, 3);
    this.addChild(outerShape);

    this.handleMouse = {};

};
createjs.extend(lich.UIPart, createjs.Container);

lich.InventoryUI = function () {
    lich.UIPart.call(this, 450, 150);

    var self = this;
    var toggleFlag = true;

    var INV_BORDER = 10;
    var INV_SELECT_BORDER = 5;
    var INV_SPACING = 12;
    var INV_LINE = 10;
    var INV_SIZE = 20;
    var TEXT_SIZE = 10;
    this.choosenItem = null;
    this.draggedItem = null;

    this.invContent = [];

    // zvýraznění vybrané položky
    var itemHighlightShape = new createjs.Shape();
    itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
    itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
    itemHighlightShape.graphics.setStrokeStyle(2);
    itemHighlightShape.graphics.drawRoundRect(0, 0, resources.PARTS_SIZE + INV_SELECT_BORDER * 2, resources.PARTS_SIZE
            + INV_SELECT_BORDER * 2, 3);
    itemHighlightShape.visible = false;
    this.addChild(itemHighlightShape);

    // kontejner položek
    var itemsCont = new createjs.Container();
    itemsCont.x = INV_BORDER;
    itemsCont.y = INV_BORDER;
    this.addChild(itemsCont);

    this.handleMouse = function (mouse) {
        if (mouse.down) {
            // TODO
        }
    };

    this.showInv = function () {
        this.visible = true;
    };

    this.hideInv = function () {
        this.visible = false;
    };

    this.toggleInv = function () {
        if (toggleFlag) {
            this.visible = !(this.visible);
            toggleFlag = false;
        }
    };

    this.prepareForToggleInv = function () {
        toggleFlag = true;
    };

    this.invInsert = function (item, quant) {
        // zkus zvýšit počet
        for (var i = 0; i < INV_SIZE; i++) {
            if (typeof this.invContent[i] !== "undefined" && this.invContent[i].item === item) {
                this.invContent[i].quant += quant;
                this.invContent[i].count.text = this.invContent[i].quant;
                return true; // přidáno
            }
        }
        // zkus založit novou
        for (var i = 0; i < INV_SIZE; i++) {
            if (typeof this.invContent[i] === "undefined") {
                var bitmap = resources.getItemBitmap(item);
                itemsCont.addChild(bitmap);
                bitmap.x = (i % INV_LINE) * (resources.PARTS_SIZE + INV_SPACING);
                bitmap.y = Math.floor(i / INV_LINE) * (resources.PARTS_SIZE + INV_SPACING);
                var text = new createjs.Text(quant, "bold " + TEXT_SIZE + "px Arial", "#ff0");
                itemsCont.addChild(text);
                text.x = bitmap.x;
                text.y = bitmap.y + resources.PARTS_SIZE - TEXT_SIZE;
                this.invContent[i] = {
                    item: item,
                    quant: quant,
                    element: bitmap,
                    count: text
                };

                var hitArea = new createjs.Shape();
                hitArea.graphics.beginFill("#000").drawRect(0, 0, resources.PARTS_SIZE, resources.PARTS_SIZE);
                bitmap.hitArea = hitArea;

                bitmap.on("mousedown", function (evt) {
                    if (self.choosenItem === item) {
                        self.choosenItem = null;
                        self.draggedItem = null;
                        itemHighlightShape.visible = false;
                    } else {
                        itemHighlightShape.visible = true;
                        itemHighlightShape.x = bitmap.x - INV_SELECT_BORDER + INV_BORDER;
                        itemHighlightShape.y = bitmap.y - INV_SELECT_BORDER + INV_BORDER;
                        self.choosenItem = item;
                        self.draggedItem = item;
                    }
                }, null, false);

                return true; // usazeno
            }
        }
        return false; // nevešel se
    };
};
createjs.extend(lich.InventoryUI, lich.UIPart);

lich.SpellsUI = function () {

    var BORDER = 10;
    var SELECT_BORDER = 5;
    var SPACING = 12;

    var n = 3;
    lich.UIPart.call(this, n * resources.PARTS_SIZE + (n - 1) * (SPACING) + 2 * BORDER, resources.PARTS_SIZE + 2 * BORDER);

    var self = this;

    this.choosenItem = {};

    this.spellContent = [];
    this.spellIndex = {};

    // zvýraznění vybrané položky
    var itemHighlightShape = new createjs.Shape();
    itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
    itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
    itemHighlightShape.graphics.setStrokeStyle(2);
    itemHighlightShape.graphics.drawRoundRect(0, 0, resources.PARTS_SIZE + SELECT_BORDER * 2, resources.PARTS_SIZE
            + SELECT_BORDER * 2, 3);
    itemHighlightShape.visible = false;
    this.addChild(itemHighlightShape);

    // kontejner položek
    var itemsCont = new createjs.Container();
    itemsCont.x = BORDER;
    itemsCont.y = BORDER;
    this.addChild(itemsCont);

    this.handleMouse = function (mouse) {
        if (mouse.down) {
            // TODO
        }
    };

    this.selectSpell = function (spell) {
        var bitmap = this.spellContent[this.spellIndex[spell]];
        itemHighlightShape.visible = true;
        itemHighlightShape.x = bitmap.x - SELECT_BORDER + BORDER;
        itemHighlightShape.y = bitmap.y - SELECT_BORDER + BORDER;
        this.choosenItem = spell;
    };

    this.spellInsert = function (spell) {
        var bitmap = resources.getBitmap(spell);
        itemsCont.addChild(bitmap);
        bitmap.x = this.spellContent.length * (resources.PARTS_SIZE + SPACING);
        bitmap.y = 0;
        this.spellIndex[spell] = this.spellContent.length;
        this.spellContent.push(bitmap);

        var hitArea = new createjs.Shape();
        hitArea.graphics.beginFill("#000").drawRect(0, 0, resources.PARTS_SIZE, resources.PARTS_SIZE);
        bitmap.hitArea = hitArea;

        bitmap.on("mousedown", function () {
            self.selectSpell(spell);
        }, null, false);
    };

    // zatím rovnou:
    this.spellInsert(resources.DIG_SPELL_KEY);
    this.spellInsert(resources.PLACE_SPELL_KEY);
    this.spellInsert(resources.FIREBALL_SPELL_KEY);

    this.selectSpell(resources.FIREBALL_SPELL_KEY);

};
createjs.extend(lich.SpellsUI, lich.UIPart);