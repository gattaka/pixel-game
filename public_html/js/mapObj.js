var lich = lich || {};

(function() {

  var MapObjItem = function(index, quant) {
    this.index = index;
    this.quant = quant;
  };

  lich.MapObj = function(key, width, height, freq, posx, posy, spriteIndex, quant) {
    this.key = key;
    this.width = width;
    this.height = height;
    this.freq = freq;
    this.posx = posx;
    this.posy = posy;
    this.item = new MapObjItem(spriteIndex, quant);
    this.objIndex = lich.MapObj.indexCounter++;
  };
  lich.MapObj.indexCounter = 0;

})();