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

  pub.get2D = function(a, x, y) {
    // přidej dílek do globální mapy
    var col = a[x];
    if (typeof col === "undefined" || col[y] == null) {
      return null;
    }
    else {
      return col[y];
    }
  };

  pub.set2D = function(a, x, y, val) {
    var col = a[x];
    if (typeof col === "undefined") {
      col = [];
      a[x] = col;
    }
    col[y] = val;
  };

  pub.contains = function(a, obj) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] === obj) {
        return true;
      }
    }
    return false;
  };

  return pub;

})();