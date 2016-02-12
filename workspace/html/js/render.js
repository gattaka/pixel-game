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
    var currentStartSecX = null;
    var currentStartSecY = null;

    // Velikost sektoru v dílcích
    var SECTOR_SIZE = 10;
    // Počet okrajových sektorů, které nejsou zobrazeny,
    // ale jsou alokovány (pro plynulé posuny)
    var BUFFER_SECTORS_X = 1;
    var BUFFER_SECTORS_Y = 2;

    // Kontejner na sektory
    var sectorsCont;
    // Sektorová mapa
    var sectorsMap = [];
    // Globální mapa
    var sceneObjectsMap = [];

    var tilesMap;

    pub.pixelsToTiles = function(x, y) {
      var tileX = Math.ceil((x - screenOffsetX) / resources.TILE_SIZE) - 1;
      var tileY = Math.ceil((y - screenOffsetY) / resources.TILE_SIZE) - 1;
      return {
        x: tileX,
        y: tileY
      };
    };

    pub.tilesToPixel = function(x, y) {
      var screenX = x * resources.TILE_SIZE + screenOffsetX;
      var screenY = y * resources.TILE_SIZE + screenOffsetY;
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

    // dle souřadnic tiles spočítá souřadnici sektoru
    var getSectorByTiles = function(x, y) {
      var sx = Math.floor(x / SECTOR_SIZE);
      var sy = Math.floor(y / SECTOR_SIZE);
      var secCol = sectorsMap[sx];
      if (typeof secCol === "undefined") {
        secCol = [];
        sectorsMap[sx] = secCol;
      }
      return secCol[sy];
    };

    var createTile = function(v) {
      var tile = new createjs.Bitmap(loader.getResult(resources.TILES_KEY));
      var tileCols = tile.image.width / resources.TILE_SIZE;
      // Otestováno: tohle je rychlejší než extract ze Spritesheet
      tile.sourceRect = {
        x: ((v - 1) % tileCols) * resources.TILE_SIZE,
        y: Math.floor((v - 1) / tileCols) * resources.TILE_SIZE,
        height: resources.TILE_SIZE,
        width: resources.TILE_SIZE
      };
      return tile;
    };

    var shiftSectors = function(dstX, dstY) {
      screenOffsetX += dstX;
      screenOffsetY += dstY;
      sectorsCont.children.forEach(function(sector) {
        sector.x += dstX;
        sector.y += dstY;
      });
      updateSectors();
    };

    // zkoumá, zda je potřeba přealokovat sektory 
    var updateSectors = function() {

      var maxSecCountX = Math.ceil(tilesMap.width / SECTOR_SIZE);
      var maxSecCountY = Math.ceil(tilesMap.height / SECTOR_SIZE);

      var startSecX = 0;
      if (screenOffsetX < 0) {
        startSecX = Math.floor(-1 * screenOffsetX / (SECTOR_SIZE * resources.TILE_SIZE));
        startSecX = startSecX > 0 ? startSecX - BUFFER_SECTORS_X : startSecX;
      }
      var countSectX = Math.floor(sectorsCont.width / (SECTOR_SIZE * resources.TILE_SIZE)) + BUFFER_SECTORS_X;

      var startSecY = 0;
      if (screenOffsetY < 0) {
        startSecY = Math.floor(-1 * screenOffsetY / (SECTOR_SIZE * resources.TILE_SIZE));
        startSecY = startSecY > 0 ? startSecY - BUFFER_SECTORS_Y : startSecY;
      }
      var countSectY = Math.floor(sectorsCont.height / (SECTOR_SIZE * resources.TILE_SIZE)) + BUFFER_SECTORS_Y;

      // změnilo se něco? Pokud není potřeba pře-alokovávat sektory, ukonči fci
      if (currentStartSecX == startSecX && currentStartSecY == startSecY)
        return;

      // změnit stavy
      currentStartSecX = startSecX;
      currentStartSecY = startSecY;

      // projdi sektory, nepoužité dealokuj, nové naplň
      for (var x = 0; x < maxSecCountX; x++) {
        for (var y = 0; y < maxSecCountY; y++) {

          var secCol = sectorsMap[x];
          if (typeof secCol === "undefined") {
            secCol = [];
            sectorsMap[x] = secCol;
          }

          var mapCol;

          if (x >= startSecX && x <= startSecX + countSectX && y >= startSecY && y <= startSecY + countSectY) {
            // jde o platný sektor 
            // pokud ještě není alokován tak alokuj
            if (typeof secCol[y] === "undefined" || secCol[y] == null) {

              var sector = new createjs.Container();
              sectorsCont.addChild(sector);
              sector.x = x * SECTOR_SIZE * resources.TILE_SIZE + screenOffsetX;
              sector.y = y * SECTOR_SIZE * resources.TILE_SIZE + screenOffsetY;
              sector.width = SECTOR_SIZE * resources.TILE_SIZE;
              sector.height = SECTOR_SIZE * resources.TILE_SIZE;
              secCol[y] = sector;

              // vytvoř jednotlivé dílky
              for (var mx = x * SECTOR_SIZE; mx < (x + 1) * SECTOR_SIZE; mx++) {
                for (var my = y * SECTOR_SIZE; my < (y + 1) * SECTOR_SIZE; my++) {
                  var tileElement = tilesMap.valueAt(mx, my);
                  if (tileElement > 0) {
                    // vytvoř dílek
                    var tile = createTile(tileElement);

                    // přidej dílek do sektoru
                    sector.addChild(tile);
                    tile.x = (mx % SECTOR_SIZE) * resources.TILE_SIZE;
                    tile.y = (my % SECTOR_SIZE) * resources.TILE_SIZE;

                    // přidej dílek do globální mapy
                    mapCol = sceneObjectsMap[mx];
                    if (typeof mapCol === "undefined") {
                      mapCol = [];
                      sceneObjectsMap[mx] = mapCol;
                    }
                    mapCol[my] = tile;
                  }
                }
              }

              // debug
              var testShape = new createjs.Shape();
              testShape.graphics.setStrokeStyle(1);
              testShape.graphics.beginStroke("#f00");
              testShape.graphics.drawRect(0, 0, sector.width, sector.height);
              sector.addChild(testShape);

              // proveď cache na sektoru
              sector.cache(0, 0, sector.width, sector.height);

              console.log("Alokován sektor: " + x + ":" + y);
            }

          }
          else {
            // neplatný sektor
            // pokud je obsazeno dealokuj
            if (typeof secCol[y] !== "undefined" && secCol[y] != null) {

              // vymaž jednotlivé dílky
              for (var mx = x * SECTOR_SIZE; mx < (x + 1) * SECTOR_SIZE; mx++) {
                for (var my = y * SECTOR_SIZE; my < (y + 1) * SECTOR_SIZE; my++) {
                  // stavěním mohl přibýt dílek někam, kde předtím nebyl, proto
                  // je potřeba i při mazání kontrolovat existenci sloupce
                  mapCol = sceneObjectsMap[mx];
                  if (typeof mapCol === "undefined") {
                    mapCol = [];
                    sceneObjectsMap[mx] = mapCol;
                  }
                  mapCol[my] = null;
                }
              }

              // vymaž sektor
              secCol[y].removeAllChildren();
              sectorsCont.removeChild(secCol[y]);
              secCol[y] = null;

              console.log("Dealokován sektor: " + x + ":" + y);

            }
          }

        }
      }

    };

    var construct = function() {

      // vytvoř kontejner pro sektory
      sectorsCont = new createjs.Container();
      game.stage.addChild(sectorsCont);
      sectorsCont.x = 0;
      sectorsCont.y = 0;
      sectorsCont.width = game.canvas.width;
      sectorsCont.height = game.canvas.height;

      // vytvoř sektory dle aktuálního záběru obrazovky
      updateSectors();

      /*-------------*/
      /* Map objects */
      /*-------------*/
      // TODO
      /*
      tilesMap.objects.forEach(function(item) {
        var objType = resources.dirtObjects[item.obj];
        var object = new createjs.Bitmap(loader.getResult(objType.key));
        var pos = pub.tilesToPixel(item.x, item.y);
        object.x = pos.x;
        object.y = pos.y - objType.height * resources.TILE_SIZE - resources.TILE_SIZE * 0.5;
        sceneObjects.addChild(object);
      });
      */

      // Poskoč do půl obrazovky, aby byl hráč na povrchu
      shiftSectors(0, Math.floor(game.canvas.height / 2));

    };

    pub.dig = function(x, y) {

      var coord = render.pixelsToTiles(x, y);
      var sectorsToUpdate = [];
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
                }

              }
              else {
                tilesMap.map[index] = resources.VOID;
                var targetSector = getSectorByTiles(x, y);
                if (typeof targetSector !== "undefined" && targetSector != null) {
                  targetSector.removeChild(sceneObjectsMap[x][y]);
                }
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
          generator.generateEdge(tilesMap, x, y);

          // zjisti sektor dílku, aby byl přidán do fronty 
          // ke cache update (postačí to udělat dle tilesToReset,
          // protože to jsou okrajové dílky z oblasti změn)
          var sector = getSectorByTiles(x, y);
          if (typeof sector !== "undefined" && sector != null) {
            sectorsToUpdate.push(sector);
          }
        });
      })();

      // Přegeneruj rohy
      (function() {
        tilesToReset.forEach(function(item) {
          var x = item[0];
          var y = item[1];
          generator.generateCorner(tilesMap, x, y);
        });
      })();

      // Překresli dílky
      (function() {
        tilesToReset.forEach(function(item) {
          var x = item[0];
          var y = item[1];
          // pokud už je alokován dílek na obrazovce, rovnou ho uprav
          var sceneObjectsMapCol = sceneObjectsMap[x];
          if (typeof sceneObjectsMapCol !== "undefined" && sceneObjectsMapCol != null) {
            var tile = sceneObjectsMapCol[y];
            if (typeof tile !== "undefined" && tile != null) {
              var v = tilesMap.valueAt(x, y);
              var tileCols = tile.image.width / resources.TILE_SIZE;
              tile.sourceRect = {
                x: ((v - 1) % tileCols) * resources.TILE_SIZE,
                y: Math.floor((v - 1) / tileCols) * resources.TILE_SIZE,
                height: resources.TILE_SIZE,
                width: resources.TILE_SIZE
              };
            }
          }
        });
      })();

      // Aktualizuj cache
      sectorsToUpdate.forEach(function(sector) {
        sector.updateCache();
      });

    };

    pub.shiftX = function(dst) {
      shiftSectors(dst, 0);
    };

    pub.shiftY = function(dst) {
      shiftSectors(0, dst);
    };

    return pub;

  })();