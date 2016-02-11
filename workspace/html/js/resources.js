/**
 * resources.js 
 * 
 * Přehled konstant a všeobecně užitečných zdrojů
 * 
 */
var resources = (function() {

  var pub = {};

  pub.TILE_SIZE = 16;
  
  pub.VOID = 0;
  pub.DIRT = {
    M1: 1,
    M2: 2,
    M3: 3,
    M4: 10,
    M5: 11,
    M6: 12,
    M7: 19,
    M8: 20,
    M9: 21,
    TL: 4,
    TR: 5,
    T: 6,
    I_TR: 7,
    I_TL: 8,
    BL: 13,
    BR: 14,
    R: 15,
    I_BR: 16,
    I_BL: 17,
    B: 22,
    L: 23
  };

  pub.TILES_KEY = "TILES_KEY";
  pub.PLANT_KEY = "PLANT_KEY";
  pub.TREE_KEY = "TREE_KEY";
  pub.TREE2_KEY = "TREE2_KEY";
  pub.MOUND_KEY = "MOUND_KEY";
  pub.GRASS_KEY = "GRASS_KEY";
  pub.GRASS2_KEY = "GRASS2_KEY";
  pub.GRASS3_KEY = "GRASS3_KEY";
  pub.GRASS4_KEY = "GRASS4_KEY";

  pub.dirtObjects = [{
    key: pub.TREE_KEY,
    width: 4,
    height: 9,
    freq: 4,
  }, {
    key: pub.TREE2_KEY,
    width: 9,
    height: 15,
    freq: 3,
  }, {
    key: pub.PLANT_KEY,
    width: 2,
    height: 2,
    freq: 1,
  }, {
    key: pub.GRASS_KEY,
    width: 2,
    height: 2,
    freq: 5,
  }, {
    key: pub.GRASS2_KEY,
    width: 2,
    height: 2,
    freq: 5,
  }, {
    key: pub.GRASS3_KEY,
    width: 2,
    height: 2,
    freq: 5,
  }, {
    key: pub.GRASS4_KEY,
    width: 2,
    height: 2,
    freq: 5,
  }];

  return pub;

})();