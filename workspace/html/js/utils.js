var utils = (function() {

  var pub = {};

  pub.sign = function(value) {
    return value < 0 ? -1 : 1;
  };

  pub.floor = function(value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  };

  pub.isEven = function(value) {
    return value % 2 == 0;
  };

  pub.even = function(value) {
    return pub.isEven(value) ? value : value - 1;
  };

  return pub;

})();