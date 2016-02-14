/**
 * resources.js 
 * 
 * Přehled konstant a všeobecně užitečných zdrojů
 * 
 */
var resources = (function() {

  var pub = {};

  pub.SHOW_SECTORS = true;

  pub.TILE_SIZE = 16;

  pub.DIRT_BACK_KEY = "DIRT_BACK_KEY";

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
  pub.PARTS_KEY = "PARTS_KEY";

  pub.PLAYER_ICON_KEY = "PLAYER_ICON_KEY";

  pub.PLANT_KEY = "PLANT_KEY";
  pub.TREE_KEY = "TREE_KEY";
  pub.TREE2_KEY = "TREE2_KEY";
  pub.MOUND_KEY = "MOUND_KEY";
  pub.GRASS_KEY = "GRASS_KEY";
  pub.GRASS2_KEY = "GRASS2_KEY";
  pub.GRASS3_KEY = "GRASS3_KEY";
  pub.GRASS4_KEY = "GRASS4_KEY";
  pub.SHROOM1_KEY = "SHROOM1_KEY";
  pub.SHROOM2_KEY = "SHROOM2_KEY";
  pub.SHROOM3_KEY = "SHROOM3_KEY";
  pub.PLANT2_KEY = "PLANT2_KEY";
  pub.PLANT3_KEY = "PLANT3_KEY";
  pub.PLANT4_KEY = "PLANT4_KEY";
  pub.PLANT5_KEY = "PLANT5_KEY";

  pub.BUSH_KEY = "BUSH_KEY";

  pub.PARTS_SHEET_WIDTH = 20;
  pub.dirtObjects = [{
    key: pub.TREE_KEY,
    width: 4,
    height: 9,
    freq: 4,
    posx: 8,
    posy: 0
  }, {
    key: pub.TREE2_KEY,
    width: 8,
    height: 15,
    freq: 3,
    posx: 0,
    posy: 0
  }, {
    key: pub.PLANT_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 12,
    posy: 6
  }, {
    key: pub.GRASS_KEY,
    width: 2,
    height: 2,
    freq: 5,
    posx: 12,
    posy: 0
  }, {
    key: pub.GRASS2_KEY,
    width: 2,
    height: 2,
    freq: 5,
    posx: 14,
    posy: 0
  }, {
    key: pub.GRASS3_KEY,
    width: 2,
    height: 2,
    freq: 5,
    posx: 16,
    posy: 0
  }, {
    key: pub.GRASS4_KEY,
    width: 2,
    height: 2,
    freq: 5,
    posx: 12,
    posy: 4
  }, {
    key: pub.SHROOM1_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 12,
    posy: 2
  }, {
    key: pub.SHROOM2_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 14,
    posy: 2
  }, {
    key: pub.SHROOM3_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 16,
    posy: 2
  }, {
    key: pub.PLANT2_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 18,
    posy: 2
  }, {
    key: pub.PLANT3_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 14,
    posy: 4
  }, {
    key: pub.PLANT4_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 16,
    posy: 4
  }, {
    key: pub.PLANT5_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 18,
    posy: 4
  }, {
    key: pub.BUSH_KEY,
    width: 2,
    height: 2,
    freq: 1,
    posx: 18,
    posy: 0
  }];

  return pub;

})();