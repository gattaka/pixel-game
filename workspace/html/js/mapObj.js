var game = game || {};

(function() {

  var MapObjItem = function(index, quant) {
    this.index = index;
    this.quant = quant;
  };

  game.MapObj = function(key, width, height, freq, posx, posy, spriteIndex, quant) {
    this.key = key;
    this.width = width;
    this.height = height;
    this.freq = freq;
    this.posx = posx;
    this.posy = posy;
    this.item = new MapObjItem(spriteIndex, quant);
  };

})();