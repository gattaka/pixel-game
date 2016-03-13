/* global createjs */

var mixer = (function() {

  var pub = {};

  pub.play = function(id, loop) {
    var instance = createjs.Sound.play(id, {
      loop: loop ? -1 : 0
    });
    instance.volume = 0.5;
  };

  return pub;

})();