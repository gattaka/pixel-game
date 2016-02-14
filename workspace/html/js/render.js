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
      src: "parts/parts.png",
      id: resources.PARTS_KEY
    }, {
      src: "characters/player_icon.png",
      id: resources.PLAYER_ICON_KEY
    }];

    var onDigObjectListeners = [];

    var screenOffsetX = 0;
    var screenOffsetY = 0;

    // souřadnice aktuálního sektorového "okna"
    var currentStartSecX = null;
    var currentStartSecY = null;

    // Velikost sektoru v dílcích
    var SECTOR_SIZE = 10;
    // Počet okrajových sektorů, které nejsou zobrazeny,
    // ale jsou alokovány (pro plynulé posuny)
    var BUFFER_SECTORS_X = 1;
    var BUFFER_SECTORS_Y = 1;

    var sectorsToUpdate = [];
    var sectorsToUpdateSet = [];

    // Kontejner na sektory
    var sectorsCont;
    // Mapa sektorů
    var sectorsMap = [];
    // Globální mapa dílků
    var sceneTilesMap = [];
    // Globální mapa objektů
    var sceneObjectsMap = [];

    var MAP_SIDE = 200;
    var minimap;
    var playerIcon;

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
      return utils.get2D(sectorsMap, sx, sy);
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

    var createObject = function(v) {
      var object = new createjs.Bitmap(loader.getResult(resources.PARTS_KEY));
      // Otestováno: tohle je rychlejší než extract ze Spritesheet
      object.sourceRect = {
        x: (v % resources.PARTS_SHEET_WIDTH) * resources.TILE_SIZE,
        y: Math.floor(v / resources.PARTS_SHEET_WIDTH) * resources.TILE_SIZE,
        height: resources.TILE_SIZE,
        width: resources.TILE_SIZE
      };
      return object;
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
        startSecX = startSecX >= BUFFER_SECTORS_X ? startSecX - BUFFER_SECTORS_X : startSecX;
      }
      var countSectX = Math.floor(sectorsCont.width / (SECTOR_SIZE * resources.TILE_SIZE)) + BUFFER_SECTORS_X + 1;

      var startSecY = 0;
      if (screenOffsetY < 0) {
        startSecY = Math.floor(-1 * screenOffsetY / (SECTOR_SIZE * resources.TILE_SIZE));
        startSecY = startSecY >= BUFFER_SECTORS_Y ? startSecY - BUFFER_SECTORS_Y : startSecY;
      }
      var countSectY = Math.floor(sectorsCont.height / (SECTOR_SIZE * resources.TILE_SIZE)) + BUFFER_SECTORS_Y + 1;

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
              sector.map_x = x;
              sector.map_y = y;
              sector.x = x * SECTOR_SIZE * resources.TILE_SIZE + screenOffsetX;
              sector.y = y * SECTOR_SIZE * resources.TILE_SIZE + screenOffsetY;
              sector.width = SECTOR_SIZE * resources.TILE_SIZE;
              sector.height = SECTOR_SIZE * resources.TILE_SIZE;
              secCol[y] = sector;

              // vytvoř jednotlivé dílky
              for (var mx = x * SECTOR_SIZE; mx < (x + 1) * SECTOR_SIZE; mx++) {
                for (var my = y * SECTOR_SIZE; my < (y + 1) * SECTOR_SIZE; my++) {

                  // vytvoř na dané souřadnici dílky povrchu
                  var tileElement = tilesMap.valueAt(mx, my);
                  if (tileElement > 0) {
                    // vytvoř dílek
                    var tile = createTile(tileElement);

                    // přidej dílek do sektoru
                    sector.addChild(tile);
                    tile.x = (mx % SECTOR_SIZE) * resources.TILE_SIZE;
                    tile.y = (my % SECTOR_SIZE) * resources.TILE_SIZE;

                    // přidej dílek do globální mapy
                    utils.set2D(sceneTilesMap, mx, my, tile);
                  }

                  // vytvoř na dané souřadnici dílky objektů
                  var objectElement = utils.get2D(tilesMap.objectsMap, mx, my);
                  if (objectElement != null) {
                    // Sheet index dílku objektu
                    var object = createObject(objectElement.sheetIndex);

                    // přidej dílek do sektoru
                    sector.addChild(object);
                    object.x = (mx % SECTOR_SIZE) * resources.TILE_SIZE;
                    object.y = (my % SECTOR_SIZE) * resources.TILE_SIZE;

                    // Přidej objekt do globální mapy objektů
                    utils.set2D(sceneObjectsMap, mx, my, object);
                  }
                }
              }

              // debug
              if (resources.SHOW_SECTORS) {
                var testShape = new createjs.Shape();
                testShape.graphics.setStrokeStyle(1);
                testShape.graphics.beginStroke("#f00");
                testShape.graphics.drawRect(0, 0, sector.width, sector.height);
                sector.addChild(testShape);
              }

              // proveď cache na sektoru
              sector.cache(0, 0, sector.width, sector.height);

              if (resources.PRINT_SECTOR_ALLOC) {
                console.log("Alokován sektor: " + x + ":" + y);
              }
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

              // TODO vymaž objekty

              // vymaž sektor
              secCol[y].removeAllChildren();
              sectorsCont.removeChild(secCol[y]);
              secCol[y] = null;

              if (resources.PRINT_SECTOR_ALLOC) {
                console.log("Dealokován sektor: " + x + ":" + y);
              }

            }
          }

        }
      }

    };

    var updateMinimapPosition = function() {
      var x = Math.floor(-1 * screenOffsetX / resources.TILE_SIZE);
      var y = Math.floor(-1 * screenOffsetY / resources.TILE_SIZE);

      minimap.bitmap.sourceRect = {
        x: x,
        y: y,
        height: MAP_SIDE,
        width: MAP_SIDE
      };
    };

    var updateMinimap = function() {
      var ctx = minimap.canvas.getContext("2d");
      var imgData = ctx.createImageData(tilesMap.width, tilesMap.height); // width x height
      var counter = 0;

      (function() {
        for (var y = 0; y < tilesMap.height; y++) {
          for (var x = 0; x < tilesMap.width; x++) {
            var item = tilesMap.valueAt(x, y);
            if (item == resources.VOID) {
              imgData.data[counter++] = 209; // R
              imgData.data[counter++] = 251; // G
              imgData.data[counter++] = 255; // B
              imgData.data[counter++] = 200; // A
            }
            for (var i = 1; i <= 9; i++) {
              if (item == resources.DIRT["M" + i]) {
                imgData.data[counter++] = 156; // R
                imgData.data[counter++] = 108; // G
                imgData.data[counter++] = 36; // B
                imgData.data[counter++] = 200; // A
              }
            }
            if (item == resources.DIRT.B ||
              item == resources.DIRT.L ||
              item == resources.DIRT.R ||
              item == resources.DIRT.T ||
              item == resources.DIRT.BL ||
              item == resources.DIRT.BR ||
              item == resources.DIRT.TL ||
              item == resources.DIRT.TR ||
              item == resources.DIRT.I_BL ||
              item == resources.DIRT.I_BR ||
              item == resources.DIRT.I_TL ||
              item == resources.DIRT.I_TR
            ) {
              imgData.data[counter++] = 102; // R
              imgData.data[counter++] = 174; // G
              imgData.data[counter++] = 0; // B
              imgData.data[counter++] = 200; // A
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      })();

      if (typeof minimap.bitmap !== "undefined") {
        minimap.cont.removeChild(minimap.bitmap);
      }

      var dataURL = minimap.canvas.toDataURL();
      minimap.bitmap = new createjs.Bitmap(dataURL);
      minimap.cont.addChild(minimap.bitmap);

      updateMinimapPosition();
    };

    var createMinimap = function() {

      minimap = {};

      var canvas = document.getElementById("mapCanvas");
      minimap.canvas = canvas;
      canvas.width = tilesMap.width;
      canvas.height = tilesMap.height;
      canvas.style.backgroundColor = "#eee";

      var minimapCont = new createjs.Container();
      minimap.cont = minimapCont;
      minimapCont.width = MAP_SIDE + 2;
      minimapCont.height = MAP_SIDE + 2;
      minimapCont.x = sectorsCont.width - MAP_SIDE - 20;
      minimapCont.y = 20;
      game.stage.addChild(minimapCont);

      var border = new createjs.Shape();
      border.graphics.setStrokeStyle(1);
      border.graphics.beginStroke("rgba(0,0,0,255)");
      border.graphics.beginFill("rgba(209,251,255,255)");
      border.graphics.drawRect(-1, -1, MAP_SIDE + 2, MAP_SIDE + 2);
      minimapCont.addChild(border);

      updateMinimap();

      playerIcon = new createjs.Bitmap(loader.getResult(resources.PLAYER_ICON_KEY));
      playerIcon.alpha = 0.7;
      minimap.cont.addChild(playerIcon);

    };

    pub.updatePlayerIcon = function(x, y) {
      playerIcon.x = Math.floor(x / resources.TILE_SIZE) - (playerIcon.image.width / 2);
      playerIcon.y = Math.floor(y / resources.TILE_SIZE) - (playerIcon.image.height / 2);
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

      // Mapa
      createMinimap();

    };

    var digGround = function(rx, ry) {
      var tilesToReset = [];

      (function() {
        for (var x = rx - 1; x <= rx + 2; x++) {
          for (var y = ry - 1; y <= ry + 2; y++) {
            var index = tilesMap.indexAt(x, y);
            if (index >= 0) {

              // pokud jsem vnější okraj výběru, přepočítej (vytvořit hrany a rohy)
              if (x == rx - 1 || x == rx + 2 || y == ry - 1 || y == ry + 2) {

                // okraje vyresetuj
                if (tilesMap.map[index] != resources.VOID) {
                  tilesMap.map[index] = resources.DIRT.M1;
                  tilesToReset.push([x, y]);
                }

              }
              // pokud jsem vnitřní část výběru, zkontroluj, 
              // že jsem neustřelil povrch pod usazeným objektem
              // a vytvoř díru po kopání
              else {

                // pokud jsem horní díl, pak zkus odkopnout i objekty, které na dílu stojí
                if (y == ry && tilesMap.map[index] == resources.DIRT.T) {
                  tryDigObject(x, y - 1);
                }

                tilesMap.map[index] = resources.VOID;
                var targetSector = getSectorByTiles(x, y);
                if (typeof targetSector !== "undefined" && targetSector != null) {
                  targetSector.removeChild(utils.get2D(sceneTilesMap, x, y));
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
            utils.set2D(sectorsToUpdateSet, sector.map_x, sector.map_y, sector);
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
          var tile = utils.get2D(sceneTilesMap, x, y);
          if (tile != null) {
            var v = tilesMap.valueAt(x, y);
            var tileCols = tile.image.width / resources.TILE_SIZE;
            tile.sourceRect = {
              x: ((v - 1) % tileCols) * resources.TILE_SIZE,
              y: Math.floor((v - 1) / tileCols) * resources.TILE_SIZE,
              height: resources.TILE_SIZE,
              width: resources.TILE_SIZE
            };
          }
        });
      })();

      // Proveď update minimapy
      //updateMinimap();
    };

    var tryDigObject = function(rx, ry) {
      var objectElement = utils.get2D(tilesMap.objectsMap, rx, ry);
      if (objectElement !== null) {
        var objType = resources.dirtObjects[objectElement.objIndex];
        var objWidth = objType.width;
        var objHeight = objType.height;
        // relativní pozice dílku v sheetu (od počátku sprite)
        var posx = objectElement.objTileX;
        var posy = objectElement.objTileY;

        onDigObjectListeners.forEach(function(fce) {
          fce(objType);
        });

        // projdi všechny okolní dílky, které patří danému objektu
        for (var x = 0; x < objWidth; x++) {
          for (var y = 0; y < objHeight; y++) {

            // globální souřadnice dílku v mapě
            var globalX = rx - posx + x;
            var globalY = ry - posy + y;

            // odstraň dílek objektu ze sektoru
            var object = utils.get2D(sceneObjectsMap, globalX, globalY);
            utils.set2D(sectorsToUpdateSet, object.parent.map_x, object.parent.map_y, object.parent);
            object.parent.removeChild(object);

            // odstraň dílke objektu z map
            utils.set2D(tilesMap.objectsMap, globalX, globalY, null);
            utils.set2D(sceneObjectsMap, globalX, globalY, null);

          }
        }
      }
    };

    pub.dig = function(x, y) {

      var coord = render.pixelsToTiles(x, y);
      var rx = utils.even(coord.x);
      var ry = utils.even(coord.y);

      // kopl jsem do nějakého povrchu?
      if (tilesMap.valueAt(rx, ry) != resources.VOID) {
        digGround(rx, ry);
      }

      // kopl jsem do objektu?
      tryDigObject(rx, ry);

      // množina sektorů ke cache-update
      sectorsToUpdateSet.forEach(function(x) {
        x.forEach(function(y) {
          sectorsToUpdate.push(y);
        });
      });
      sectorsToUpdateSet = [];

    };

    pub.shiftX = function(dst) {
      shiftSectors(dst, 0);
      updateMinimapPosition();
    };

    pub.shiftY = function(dst) {
      shiftSectors(0, dst);
      updateMinimapPosition();
    };

    pub.handleTick = function() {
      // Aktualizuj cache
      while (sectorsToUpdate.length > 0) {
        sectorsToUpdate.pop().updateCache();
        console.log("updateCache...");
      }
    };

    pub.addOnDigObjectListener = function(f) {
      onDigObjectListeners.push(f);
    };

    return pub;

  })();