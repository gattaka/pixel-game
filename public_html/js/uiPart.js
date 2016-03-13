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
    outerShape.graphics.drawRect(0, 0, width, height);
    this.addChild(outerShape);

    this.handleMouse = {};

};
createjs.extend(lich.UIPart, createjs.Container);

lich.InventoryUI = function () {
    lich.UIPart.call(this, 450, 150);

    var self = this;
    var toggleFlag = true;

    var INV_BORDER = 10;
    var INV_SPACING = 12;
    var INV_LINE = 10;
    var INV_SIZE = 20;
    var TEXT_SIZE = 10;

    this.invContent = [];

    // zvýraznění vybrané položky
    var itemHighlightShape = new createjs.Shape();
    itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
    itemHighlightShape.graphics.drawRoundRect(0, 0, resources.PARTS_SIZE + INV_SPACING, resources.PARTS_SIZE
            + INV_SPACING, 5);
    itemHighlightShape.x = INV_SPACING / 2;
    itemHighlightShape.y = INV_SPACING / 2;
    this.addChild(itemHighlightShape);

    // kontejner položek
    var itemsCont = new createjs.Container();
    itemsCont.x = INV_BORDER;
    itemsCont.y = INV_BORDER;
    this.addChild(itemsCont);

    this.handleMouse = function (mouse) {
        if (mouse.down) {
            var step = INV_SPACING + resources.PARTS_SIZE;
            var x = Math.floor((mouse.x - self.x - INV_SPACING / 2) / step);
            var y = Math.floor((mouse.y - self.y - INV_SPACING / 2) / step);
            itemHighlightShape.x = x * step + INV_SPACING / 2;
            itemHighlightShape.y = y * step + INV_SPACING / 2;
        }
    };

    this.showInv = function () {
        visible = true;
    };

    this.hideInv = function () {
        visible = false;
    };

    this.toggleInv = function () {
        if (toggleFlag) {
            visible = !(visible);
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
                var bitmapCont = new createjs.Container();
                var bitmap = resources.getItemBitmap(item);
                bitmapCont.addChild(bitmap);
                itemsCont.addChild(bitmapCont);
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

                bitmap.on("click", function (evt) {
                    console.log("click");
                }, null, false);

                return true; // usazeno
            }
        }
        return false; // nevešel se
    };
};
createjs.extend(lich.InventoryUI, lich.UIPart);