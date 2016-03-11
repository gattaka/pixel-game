// Spiral

var shape = new createjs.Shape();
var g = shape.graphics;
var x0 = 400;
var y0 = 200;
var x = x0;
var y = y0;
g.setStrokeStyle(5);
g.beginStroke("rgba(" + 50 + ",255,0,1)");
var clrInc = 1;
var clr = 0;
for (var i = 0; i < 360 * 5; i += 5) {
  clr += clrInc;
  if (clr == -1) {
    clr = 0;
    clrInc = 1;
  }
  if (clr == 256) {
    clr = 255;
    clrInc = -1;
  }
  g.beginStroke("rgba(" + clr + ",255,0,1)");
  g.moveTo(x, y);
  x = x0 + Math.sin(Math.PI / 180 * i) * (i / 10);
  y = y0 + Math.cos(Math.PI / 180 * i) * (i / 50);
  g.lineTo(x, y);
}
game.stage.addChild(shape);

//---------------------------------------------------------------------

sky = new createjs.Shape();
sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);

var groundImg = loader.getResult("ground");
ground = new createjs.Shape();
ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
ground.tileW = groundImg.width;
ground.y = h - groundImg.height;


// -------------------------------------

tilesSheet = new createjs.SpriteSheet({
  framerate: 10,
  "images": [loader.getResult(TILES_KEY)],
  "frames": {
    "regX": 0,
    "height": TILE_SIZE,
    //"count": 24,
    "regY": 0,
    "width": TILE_SIZE
  },
});

// <test>
(function() {

  var tileImage = getTileImage(3);
  var testShape = new createjs.Shape();
  world.testShape = testShape;
  testShape.x = 400;
  testShape.y = 100;
  testShape.width = 10 * TILE_SIZE;
  testShape.height = 10 * TILE_SIZE;
  game.stage.addChild(testShape);

  // tuhle šaškárnu je potřeba udělat protože beginBitmapFill nelze 
  // "posunout", udělá pouze výstřižek z opakovaného image jakoby 
  // vystřihnul na tom místě plochu opakovaného pozadí
  var x = 3;
  var y = 20;
  var mtx = new createjs.Matrix2D();
  // ( x  y  scaleX  scaleY  rotation  skewX  skewY  regX  regY )
  // x % spriteSheet width
  mtx.appendTransform(x, y, 1, 1, 0);

  testShape.graphics.beginBitmapFill(tileImage, "no-repeat", mtx);
  testShape.graphics.drawRect(x, y, TILE_SIZE, TILE_SIZE);
  testShape.graphics.endFill();
  /*
       testShape.graphics.beginBitmapFill(tileImage, "no-repeat");
       testShape.graphics.drawRect(0, TILE_SIZE, TILE_SIZE, TILE_SIZE);
       testShape.graphics.beginBitmapFill(tileImage, "no-repeat");
       testShape.graphics.drawRect(0, TILE_SIZE * 2, TILE_SIZE, TILE_SIZE);
*/
  testShape.graphics.setStrokeStyle(1);
  testShape.graphics.beginStroke("#f00");
  testShape.graphics.drawRect(0, 0, testShape.width, testShape.height);
})();
// </test>
//------------------------
var testShape = new createjs.Shape();
testShape.graphics.setStrokeStyle(1);
testShape.graphics.beginStroke("#f00");
testShape.graphics.drawRect(x, y, TILE_SIZE, TILE_SIZE);