  /*global createjs*/
  /*global utils*/
  /*global game*/
  /*global resources*/
  /*global generator*/

  /**
   * render.js 
   * 
   * Stará se o vykreslování, cachování a preload oblastí scény 
   * 
   */
  var render = (function() {

    var pub = {};

    var loader;
    var manifest = [{
      src: "tiles/tiles.png",
      id: resources.TILES_KEY
    }, {
      src: "parts/tree.png",
      id: resources.TREE_KEY
    }, {
      src: "parts/tree2.png",
      id: resources.TREE2_KEY
    }, {
      src: "parts/mound.png",
      id: resources.MOUND_KEY
    }, {
      src: "parts/plant.png",
      id: resources.PLANT_KEY
    }, {
      src: "parts/grass.png",
      id: resources.GRASS_KEY
    }, {
      src: "parts/grass2.png",
      id: resources.GRASS2_KEY
    }, {
      src: "parts/grass3.png",
      id: resources.GRASS3_KEY
    }, {
      src: "parts/grass4.png",
      id: resources.GRASS4_KEY
    }];

    var screenOffsetX = 0;
    var screenOffsetY = 0;

    var sceneObjects;
    var sceneObjectsMap = [];

    var startX = 0;
    var startY = 550;

    var tilesMap;

    pub.pixelsToTiles = function(x, y) {
      // floor, aby zahrnul rozpůlenou buňku, ale přitom pole mapy začíná indexu 0
      var tileX = Math.ceil((x - screenOffsetX - startX) / resources.TILE_SIZE) - 1;
      // ceil protože počítám pozici od spodního okraje
      var tileY = Math.ceil((y - screenOffsetY - startY) / resources.TILE_SIZE);
      return {
        x: tileX,
        y: tileY
      };
    };

    pub.tilesToPixel = function(x, y) {
      var screenX = x * resources.TILE_SIZE + screenOffsetX + startX;
      var screenY = y * resources.TILE_SIZE + screenOffsetY + startY;
      return {
        x: screenX,
        y: screenY
      };
    };

    pub.init = function(callback, map) {
      tilesMap = map;

      loader = new createjs.LoadQueue(false);
      loader.addEventListener("fileload", function(event) {
        console.log(event.item.id + " loaded");
      });
      loader.addEventListener("complete", function() {
        construct();
        if (typeof callback !== "undefined") {
          callback();
        }
      });
      loader.loadManifest(manifest, true, "images/");
    };

    var construct = function() {
      sceneObjects = new createjs.Container();
      game.stage.addChild(sceneObjects);
      sceneObjects.x = 0;
      sceneObjects.y = 0;
      sceneObjects.width = game.canvas.width * 1.5;
      sceneObjects.height = game.canvas.height * 1.5;

      /*-----------*/
      /* Map tiles */
      /*-----------*/
      var placeTile = function(v, row, col) {
        if (v > 0) {
          var tile;
          tile = new createjs.Bitmap(loader.getResult(resources.TILES_KEY));
          var tileCols = tile.image.width / resources.TILE_SIZE;
          // Otestováno: tohle je rychlejší než extract ze Spritesheet
          tile.sourceRect = {
            x: ((v - 1) % tileCols) * resources.TILE_SIZE,
            y: Math.floor((v - 1) / tileCols) * resources.TILE_SIZE,
            height: resources.TILE_SIZE,
            width: resources.TILE_SIZE
          };

          sceneObjects.addChild(tile);
          var mapCol = sceneObjectsMap[col];
          if (typeof mapCol === "undefined") {
            mapCol = [];
            sceneObjectsMap[col] = mapCol;
          }
          mapCol[row] = tile;
          var pos = pub.tilesToPixel(col, row);
          tile.x = pos.x;
          tile.y = pos.y - resources.TILE_SIZE;
        }
      };

      for (var i = 0; i < tilesMap.map.length; i++) {
        var col = i % tilesMap.width;
        var row = Math.floor(i / tilesMap.width);
        placeTile(tilesMap.map[i], row, col);
      }

      /*-------------*/
      /* Map objects */
      /*-------------*/
      tilesMap.objects.forEach(function(item) {
        var objType = resources.dirtObjects[item.obj];
        var object = new createjs.Bitmap(loader.getResult(objType.key));
        var pos = pub.tilesToPixel(item.x, item.y);
        object.x = pos.x;
        object.y = pos.y - objType.height * resources.TILE_SIZE - resources.TILE_SIZE * 0.5;
        sceneObjects.addChild(object);
      });

      // vygenerováno ... nacachuj
      // cachuje se od y= -TILE_SIZE protože tiles mají počátek vlevo DOLE
      // http://www.createjs.com/docs/easeljs/classes/Container.html#method_cache
      sceneObjects.cache(0, -resources.TILE_SIZE, sceneObjects.width, sceneObjects.height);

    };

    pub.dig = function(x, y) {

      var coord = render.pixelsToTiles(x, y);

      var tilesToReset = [];

      var rx = utils.even(coord.x);
      var ry = utils.even(coord.y);
      (function() {
        for (var x = rx - 1; x <= rx + 2; x++) {
          for (var y = ry - 1; y <= ry + 2; y++) {
            var index = tilesMap.indexAt(x, y);
            if (index >= 0) {
              if (x == rx - 1 || x == rx + 2 || y == ry - 1 || y == ry + 2) {

                // okraje vyresetuj
                if (tilesMap.map[index] != resources.VOID) {
                  tilesMap.map[index] = resources.DIRT.M1;
                  tilesToReset.push([x, y]);

                  var tile = sceneObjectsMap[x][y];
                  var v = tilesMap.map[index];
                  var tileCols = tile.image.width / resources.TILE_SIZE;
                  tile.sourceRect = {
                    x: ((v - 1) % tileCols) * resources.TILE_SIZE,
                    y: Math.floor((v - 1) / tileCols) * resources.TILE_SIZE,
                    height: resources.TILE_SIZE,
                    width: resources.TILE_SIZE
                  };

                }

              }
              else {
                tilesMap.map[index] = resources.VOID;
                sceneObjects.removeChild(sceneObjectsMap[x][y]);
              }
            }
          }
        }
      })();


      // Přegeneruj hrany
      (function() {
        tilesToReset.forEach(function(item) {
          var x = item[0];
          var y = item[1];
          var tile = sceneObjectsMap[x][y];
          var v = generator.generateEdge(tilesMap, x, y);
          var tileCols = tile.image.width / resources.TILE_SIZE;
          tile.sourceRect = {
            x: ((v - 1) % tileCols) * resources.TILE_SIZE,
            y: Math.floor((v - 1) / tileCols) * resources.TILE_SIZE,
            height: resources.TILE_SIZE,
            width: resources.TILE_SIZE
          };
        });
      })();

      // Přegeneruj rohy
      (function() {
        tilesToReset.forEach(function(item) {
          var x = item[0];
          var y = item[1];
          var tile = sceneObjectsMap[x][y];
          var v = generator.generateCorner(tilesMap, x, y);
          var tileCols = tile.image.width / resources.TILE_SIZE;
          tile.sourceRect = {
            x: ((v - 1) % tileCols) * resources.TILE_SIZE,
            y: Math.floor((v - 1) / tileCols) * resources.TILE_SIZE,
            height: resources.TILE_SIZE,
            width: resources.TILE_SIZE
          };
        });
      })();

      sceneObjects.updateCache();

    };

    pub.shiftX = function(dst) {
      screenOffsetX += dst;
      sceneObjects.x += dst;
    };

    pub.shiftY = function(dst) {
      screenOffsetY += dst;
      sceneObjects.y += dst;
    };

    return pub;

  })();