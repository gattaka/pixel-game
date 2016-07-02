/// <reference path="mapObj.ts"/>
/**
 * resources.js
 *
 * Přehled konstant a všeobecně užitečných zdrojů
 *
 */
var Lich;
(function (Lich) {
    var Load = (function () {
        function Load(src, id) {
            this.src = src;
            this.id = id;
        }
        ;
        return Load;
    }());
    var Resources = (function () {
        function Resources(game, callback) {
            var self = this;
            var manifest = [
                /**
                 * IMAGES
                 */
                // spells
                new Load("images/ui/dig_spell.png", Resources.SPELL_DIG_KEY),
                new Load("images/ui/fireball_spell.png", Resources.SPELL_FIREBALL_KEY),
                new Load("images/ui/place_spell.png", Resources.SPELL_PLACE_KEY),
                // inventory
                new Load("images/ui/inventory/inv_berry.png", Resources.INV_BERRY_KEY),
                new Load("images/ui/inventory/inv_mushroom.png", Resources.INV_MUSHROOM_KEY),
                new Load("images/ui/inventory/inv_mushroom2.png", Resources.INV_MUSHROOM2_KEY),
                new Load("images/ui/inventory/inv_mushroom3.png", Resources.INV_MUSHROOM3_KEY),
                new Load("images/ui/inventory/inv_plant.png", Resources.INV_PLANT_KEY),
                new Load("images/ui/inventory/inv_plant2.png", Resources.INV_PLANT2_KEY),
                new Load("images/ui/inventory/inv_plant3.png", Resources.INV_PLANT3_KEY),
                new Load("images/ui/inventory/inv_plant4.png", Resources.INV_PLANT4_KEY),
                new Load("images/ui/inventory/inv_straw.png", Resources.INV_STRAW_KEY),
                new Load("images/ui/inventory/inv_wood.png", Resources.INV_WOOD_KEY),
                new Load("images/ui/inventory/inv_dirt.png", Resources.INV_DIRT_KEY),
                new Load("images/ui/inventory/inv_krystals.png", Resources.INV_KRYSTAL_KEY),
                new Load("images/ui/inventory/inv_florite.png", Resources.INV_FLORITE_KEY),
                // characters
                new Load("images/characters/lich_animation.png", Resources.LICH_ANIMATION_KEY),
                new Load("images/characters/corpse_animation.png", Resources.CORPSE_ANIMATION_KEY),
                // gfx animations
                new Load("images/effects/blast_animation.png", Resources.BLAST_ANIMATION_KEY),
                // surfaces
                new Load("images/surfaces/dirt.png", Resources.SRFC_DIRT_KEY),
                new Load("images/surfaces/woodwall.png", Resources.SRFC_WOODWALL_KEY),
                new Load("images/surfaces/krystals.png", Resources.SRFC_KRYSTAL_KEY),
                new Load("images/surfaces/florite.png", Resources.SRFC_FLORITE_KEY),
                new Load("images/surfaces/brick.png", Resources.SRFC_BRICK_KEY),
                new Load("images/surfaces/straw.png", Resources.SRFC_STRAW_KEY),
                // objects
                new Load("images/parts/berry.png", Resources.MAP_BERRY_KEY),
                new Load("images/parts/bush.png", Resources.MAP_BUSH_KEY),
                new Load("images/parts/bush2.png", Resources.MAP_BUSH2_KEY),
                new Load("images/parts/grass.png", Resources.MAP_GRASS_KEY),
                new Load("images/parts/grass2.png", Resources.MAP_GRASS2_KEY),
                new Load("images/parts/grass3.png", Resources.MAP_GRASS3_KEY),
                new Load("images/parts/grave.png", Resources.MAP_GRAVE_KEY),
                new Load("images/parts/mushroom.png", Resources.MAP_MUSHROOM_KEY),
                new Load("images/parts/mushroom2.png", Resources.MAP_MUSHROOM2_KEY),
                new Load("images/parts/mushroom3.png", Resources.MAP_MUSHROOM3_KEY),
                new Load("images/parts/plant.png", Resources.MAP_PLANT_KEY),
                new Load("images/parts/plant2.png", Resources.MAP_PLANT2_KEY),
                new Load("images/parts/plant3.png", Resources.MAP_PLANT3_KEY),
                new Load("images/parts/plant4.png", Resources.MAP_PLANT4_KEY),
                new Load("images/parts/tree.png", Resources.MAP_TREE_KEY),
                new Load("images/parts/tree2.png", Resources.MAP_TREE2_KEY),
                new Load("images/parts/florite.png", Resources.MAP_FLORITE_KEY),
                new Load("images/parts/campfire.png", Resources.MAP_CAMPFIRE_KEY),
                // misc
                new Load("images/characters/player_icon.png", Resources.PLAYER_ICON_KEY),
                new Load("images/ui/skull.png", Resources.SKULL_KEY),
                new Load("images/ui/sound.png", Resources.UI_SOUND_KEY),
                // armor
                new Load("images/armor/helmet.png", Resources.HELMET_KEY),
                new Load("images/armor/torso.png", Resources.TORSO_KEY),
                new Load("images/armor/gauntlet.png", Resources.GAUNTLET_KEY),
                // background
                new Load("images/background/sky.png", Resources.SKY_KEY),
                new Load("images/background/far_mountain.png", Resources.FAR_MOUNTAIN_KEY),
                new Load("images/background/mountain.png", Resources.MOUNTAIN_KEY),
                new Load("images/background/far_woodland.png", Resources.FAR_HILL_KEY),
                new Load("images/background/woodland.png", Resources.HILL_KEY),
                new Load("images/background/dirt_back.png", Resources.DIRTBACK_KEY),
                new Load("images/background/darkness.png", Resources.DARKNESS_KEY),
                new Load("images/background/dirt_back_start.png", Resources.DIRT_BACK_START_KEY),
                /**
                 * SOUNDS AND MUSIC
                 */
                // sounds
                new Load("sound/334234__liamg-sfx__fireball-cast-1.ogg", Resources.SND_FIREBALL_KEY),
                new Load("sound/113111__satrebor__pick.ogg", Resources.SND_PICK_KEY),
                new Load("sound/248116__robinhood76__05224-fireball-whoosh.ogg", Resources.SND_BURN_KEY),
                new Load("sound/place.ogg", Resources.SND_PLACE_KEY),
                new Load("sound/pick_axe1.ogg", Resources.SND_PICK_AXE_1_KEY),
                new Load("sound/pick_axe2.ogg", Resources.SND_PICK_AXE_2_KEY),
                new Load("sound/pick_axe3.ogg", Resources.SND_PICK_AXE_3_KEY),
                new Load("sound/bonecrack.ogg", Resources.SND_BONECRACK_KEY),
                new Load("sound/skeleton_die.ogg", Resources.SND_SKELETON_DIE_KEY),
                // music
                new Load("music/Dirt 2.ogg", Resources.MSC_DIRT_THEME_KEY),
                new Load("music/Building In Progress.ogg", Resources.MSC_BUILD_THEME_KEY),
                new Load("music/Boss 1.ogg", Resources.MSC_BOSS_THEME_KEY),
                new Load("music/Fight In Crystals.ogg", Resources.MSC_KRYSTAL_THEME_KEY),
                new Load("music/Flood.ogg", Resources.MSC_FLOOD_THEME_KEY),
                new Load("music/Lava.ogg", Resources.MSC_LAVA_THEME_KEY),
            ];
            (function () {
                for (var i = 1; i <= Resources.CLOUDS_NUMBER; i++) {
                    manifest.push({
                        src: "images/background/cloud" + i + ".png",
                        id: Resources.CLOUD_KEY + i
                    });
                }
            })();
            var loadScreenCont = new createjs.Container();
            loadScreenCont.width = game.canvas.width;
            loadScreenCont.height = game.canvas.height;
            loadScreenCont.x = 0;
            loadScreenCont.y = 0;
            game.stage.addChild(loadScreenCont);
            var loadScreen = new createjs.Shape();
            loadScreen.graphics.beginFill("black");
            loadScreen.graphics.drawRect(0, 0, game.canvas.width, game.canvas.height);
            loadScreenCont.addChild(loadScreen);
            var loadLabel = new Lich.Label("Loading...", "30px " + Resources.FONT, Resources.TEXT_COLOR);
            loadLabel.x = game.canvas.width / 2 - 50;
            loadLabel.y = game.canvas.height / 2 - 50;
            loadScreenCont.addChild(loadLabel);
            self.loader = new createjs.LoadQueue(false);
            createjs.Sound.alternateExtensions = ["mp3"];
            self.loader.installPlugin(createjs.Sound);
            self.loader.addEventListener("progress", function (event) {
                loadLabel.setText(Math.floor(event.loaded * 100) + "% Loading... ");
            });
            self.loader.addEventListener("complete", function () {
                createjs.Tween.get(loadScreenCont)
                    .to({
                    alpha: 0
                }, 2000).call(function () {
                    game.stage.removeChild(loadScreenCont);
                });
                if (typeof callback !== "undefined") {
                    callback();
                }
            });
            self.loader.loadManifest(manifest, true);
        }
        ;
        Resources.prototype.getImage = function (key) {
            return this.loader.getResult(key);
        };
        ;
        Resources.prototype.getBitmap = function (key) {
            return new createjs.Bitmap(this.getImage(key));
        };
        ;
        Resources.prototype.getSpritePart = function (key, tileX, tileY, count, height, width) {
            var frames = [];
            for (var i = 0; i < count; i++) {
                frames.push([
                    tileX * Resources.TILE_SIZE + i * width * Resources.TILE_SIZE,
                    tileY * Resources.TILE_SIZE,
                    Resources.TILE_SIZE,
                    Resources.TILE_SIZE
                ]);
            }
            var sheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [this.getImage(Resources.MAP_CAMPFIRE_KEY)],
                "frames": frames,
                "animations": { "idle": [0, count - 1, "idle", 0.2] }
            });
            var sprite = new createjs.Sprite(sheet, "idle");
            sprite.gotoAndPlay("idle");
            return sprite;
        };
        Resources.prototype.getSprite = function (key) {
            var self = this;
            var sheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [self.getImage(key)],
                "frames": {
                    "regX": 0,
                    "height": Resources.PARTS_SIZE,
                    "count": 1,
                    "regY": 0,
                    "width": Resources.PARTS_SIZE
                },
                "animations": {
                    "idle": [0, 0, "idle", 0.005]
                }
            });
            var sprite = new createjs.Sprite(sheet, "idle");
            sprite.gotoAndStop("idle");
            return sprite;
        };
        ;
        Resources.FONT = "expressway";
        Resources.OUTLINE_COLOR = "#000";
        Resources.TEXT_COLOR = "#FF0";
        Resources.DEBUG_TEXT_COLOR = "#FF0";
        Resources.REACH_TILES_RADIUS = 10;
        /*
         * Přepínače
         */
        Resources.SHOW_SECTORS = false;
        Resources.PRINT_SECTOR_ALLOC = false;
        /*
         * Velikosti
         */
        Resources.TILE_SIZE = 16;
        Resources.PARTS_SIZE = 2 * Resources.TILE_SIZE;
        Resources.PARTS_SHEET_WIDTH = 20;
        Resources.CLOUDS_NUMBER = 5;
        /*
         * Resource klíče
         */
        // background
        Resources.DIRT_BACK_START_KEY = "DIRT_BACK_START_KEY";
        Resources.DIRT_BACK_KEY = "DIRT_BACK_KEY";
        Resources.SKY_KEY = "SKY_KEY";
        Resources.FAR_MOUNTAIN_KEY = "FAR_MOUNTAIN_KEY";
        Resources.MOUNTAIN_KEY = "MOUNTAIN_KEY";
        Resources.FAR_HILL_KEY = "FAR_HILL_KEY";
        Resources.HILL_KEY = "HILL_KEY";
        Resources.DIRTBACK_KEY = "DIRTBACK_KEY";
        Resources.DARKNESS_KEY = "DARKNESS_KEY";
        Resources.CLOUD_KEY = "CLOUD_KEY";
        // animations
        Resources.BLAST_ANIMATION_KEY = "BLAST_ANIMATION_KEY";
        Resources.LICH_ANIMATION_KEY = "LICH_ANIMATION_KEY";
        Resources.CORPSE_ANIMATION_KEY = "CORPSE_ANIMATION_KEY";
        // surfaces
        Resources.SRFC_DIRT_KEY = "SRFC_DIRT_KEY";
        Resources.SRFC_WOODWALL_KEY = "SRFC_WOODWALL_KEY";
        Resources.SRFC_KRYSTAL_KEY = "SRFC_KRYSTAL_KEY";
        Resources.SRFC_FLORITE_KEY = "SRFC_FLORITE_KEY";
        Resources.SRFC_BRICK_KEY = "SRFC_BRICK_KEY";
        Resources.SRFC_STRAW_KEY = "SRFC_STRAW_KEY";
        // inv items
        Resources.INV_BERRY_KEY = "INV_BERRY_KEY";
        Resources.INV_WOOD_KEY = "INV_WOOD_KEY";
        Resources.INV_STRAW_KEY = "INV_STRAW_KEY";
        Resources.INV_MUSHROOM_KEY = "INV_MUSHROOM_KEY";
        Resources.INV_MUSHROOM2_KEY = "INV_MUSHROOM2_KEY";
        Resources.INV_MUSHROOM3_KEY = "INV_MUSHROOM3_KEY";
        Resources.INV_PLANT_KEY = "INV_PLANT_KEY";
        Resources.INV_PLANT2_KEY = "INV_PLANT2_KEY";
        Resources.INV_PLANT3_KEY = "INV_PLANT3_KEY";
        Resources.INV_PLANT4_KEY = "INV_PLANT4_KEY";
        Resources.INV_DIRT_KEY = "INV_DIRT_KEY";
        Resources.INV_KRYSTAL_KEY = "INV_KRYSTAL_KEY";
        Resources.INV_FLORITE_KEY = "INV_FLORITE_KEY";
        // characters
        Resources.PLAYER_ICON_KEY = "PLAYER_ICON_KEY";
        // map objects
        Resources.MAP_BERRY_KEY = "MAP_BERRY_KEY";
        Resources.MAP_BUSH_KEY = "MAP_BUSH_KEY";
        Resources.MAP_BUSH2_KEY = "MAP_BUSH2_KEY";
        Resources.MAP_GRASS_KEY = "MAP_GRASS_KEY";
        Resources.MAP_GRASS2_KEY = "MAP_GRASS2_KEY";
        Resources.MAP_GRASS3_KEY = "MAP_GRASS3_KEY";
        Resources.MAP_GRAVE_KEY = "MAP_GRAVE_KEY";
        Resources.MAP_MUSHROOM_KEY = "MAP_MUSHROOM_KEY";
        Resources.MAP_MUSHROOM2_KEY = "MAP_MUSHROOM2_KEY";
        Resources.MAP_MUSHROOM3_KEY = "MAP_MUSHROOM3_KEY";
        Resources.MAP_PLANT_KEY = "MAP_PLANT_KEY";
        Resources.MAP_PLANT2_KEY = "MAP_PLANT2_KEY";
        Resources.MAP_PLANT3_KEY = "MAP_PLANT3_KEY";
        Resources.MAP_PLANT4_KEY = "MAP_PLANT4_KEY";
        Resources.MAP_TREE_KEY = "MAP_TREE_KEY";
        Resources.MAP_TREE2_KEY = "MAP_TREE2_KEY";
        Resources.MAP_FLORITE_KEY = "MAP_FLORITE_KEY";
        Resources.MAP_CAMPFIRE_KEY = "MAP_CAMPFIRE_KEY";
        // ui
        Resources.SKULL_KEY = "SKULL_KEY";
        Resources.HELMET_KEY = "HELMET_KEY";
        Resources.TORSO_KEY = "TORSO_KEY";
        Resources.GAUNTLET_KEY = "GAUNTLET_KEY";
        Resources.UI_SOUND_KEY = "UI_SOUND_KEY";
        // ui spells
        Resources.SPELL_PLACE_KEY = "SPELL_PLACE_KEY";
        Resources.SPELL_DIG_KEY = "SPELL_DIG_KEY";
        Resources.SPELL_FIREBALL_KEY = "SPELL_FIREBALL_KEY";
        // sounds
        Resources.SND_FIREBALL_KEY = "SND_FIREBALL_KEY";
        Resources.SND_BURN_KEY = "SND_BURN_KEY";
        Resources.SND_PICK_KEY = "SND_PICK_KEY";
        Resources.SND_PLACE_KEY = "SND_PLACE_KEY";
        Resources.SND_PICK_AXE_1_KEY = "SND_PICK_AXE_1_KEY";
        Resources.SND_PICK_AXE_2_KEY = "SND_PICK_AXE_2_KEY";
        Resources.SND_PICK_AXE_3_KEY = "SND_PICK_AXE_3_KEY";
        Resources.SND_BONECRACK_KEY = "SND_BONECRACK_KEY";
        Resources.SND_SKELETON_DIE_KEY = "SND_GHOST_KEY";
        // music
        Resources.MSC_DIRT_THEME_KEY = "MSC_DIRT_THEME_KEY";
        Resources.MSC_BUILD_THEME_KEY = "MSC_BUILD_THEME_KEY";
        Resources.MSC_BOSS_THEME_KEY = "MSC_BOSS_THEME_KEY";
        Resources.MSC_KRYSTAL_THEME_KEY = "MSC_KRYSTAL_THEME_KEY";
        Resources.MSC_FLOOD_THEME_KEY = "MSC_FLOOD_THEME_KEY";
        Resources.MSC_LAVA_THEME_KEY = "MSC_LAVA_THEME_KEY";
        Resources.mapSurfacesDefs = new Array();
        Resources.mapObjectsDefs = new Array();
        Resources.mapSurfacesFreqPool = new Array();
        Resources.mapObjectsFreqPool = new Array();
        Resources.invObjectsDefs = new Array();
        /*
         * Sprite indexy
         */
        Resources.surfaceIndex = new Lich.SurfaceIndex();
        Resources._constructor = (function () {
            console.log('Static constructor');
            /**
             * POVRCHY
             */
            // Definice mapových povrchů
            var registerSurfacesDefs = function (mapSurface) {
                Resources.mapSurfacesDefs[mapSurface.mapKey] = mapSurface;
                // Definice indexových počátků pro typy povrchu
                Resources.surfaceIndex.insert(mapSurface.mapKey);
            };
            // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
            // jsou dle frekvence usazovány jiné povrchy
            registerSurfacesDefs(new Lich.MapSurfaceDefinition(Resources.SRFC_DIRT_KEY, Resources.INV_DIRT_KEY, 1, 0));
            registerSurfacesDefs(new Lich.MapSurfaceDefinition(Resources.SRFC_WOODWALL_KEY, Resources.INV_WOOD_KEY, 1, 0));
            registerSurfacesDefs(new Lich.MapSurfaceDefinition(Resources.SRFC_KRYSTAL_KEY, Resources.INV_KRYSTAL_KEY, 1, 1));
            registerSurfacesDefs(new Lich.MapSurfaceDefinition(Resources.SRFC_FLORITE_KEY, Resources.INV_FLORITE_KEY, 1, 1));
            registerSurfacesDefs(new Lich.MapSurfaceDefinition(Resources.SRFC_BRICK_KEY, Resources.INV_DIRT_KEY, 1, 0));
            registerSurfacesDefs(new Lich.MapSurfaceDefinition(Resources.SRFC_STRAW_KEY, Resources.INV_STRAW_KEY, 1, 0));
            (function () {
                // vytvoř frekvenční pool pro povrchy
                for (var key in Resources.mapSurfacesDefs) {
                    var item = Resources.mapSurfacesDefs[key];
                    // vlož index objektu tolikrát, kolik je jeho frekvenc
                    for (var i = 0; i < item.freq; i++) {
                        Resources.mapSurfacesFreqPool.push(key);
                    }
                }
            })();
            /**
             * OBJEKTY
             */
            // Definice mapových objektů
            var putIntoObjectsDefs = function (mapObj) {
                Resources.mapObjectsDefs[mapObj.mapKey] = mapObj;
            };
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_BERRY_KEY, 2, 2, Resources.INV_BERRY_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_BUSH_KEY, 2, 2, null, 10, 0));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_BUSH2_KEY, 2, 2, null, 10, 0));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_GRASS_KEY, 2, 2, Resources.INV_STRAW_KEY, 20, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_GRASS2_KEY, 2, 2, Resources.INV_STRAW_KEY, 20, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_GRASS3_KEY, 2, 2, Resources.INV_STRAW_KEY, 20, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_TREE_KEY, 4, 9, Resources.INV_WOOD_KEY, 5, 5));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_TREE2_KEY, 8, 15, Resources.INV_WOOD_KEY, 10, 2));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_MUSHROOM_KEY, 2, 2, Resources.INV_MUSHROOM_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_MUSHROOM2_KEY, 2, 2, Resources.INV_MUSHROOM2_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_MUSHROOM3_KEY, 2, 2, Resources.INV_MUSHROOM3_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_PLANT_KEY, 2, 2, Resources.INV_PLANT_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_PLANT2_KEY, 2, 2, Resources.INV_PLANT2_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_PLANT3_KEY, 2, 2, Resources.INV_PLANT3_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_PLANT4_KEY, 2, 2, Resources.INV_PLANT4_KEY, 1, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_FLORITE_KEY, 2, 2, Resources.INV_FLORITE_KEY, 5, 1));
            putIntoObjectsDefs(new Lich.MapObjDefinition(Resources.MAP_CAMPFIRE_KEY, 2, 2, null, 10, 1).setFrames(4));
            (function () {
                // vytvoř frekvenční pool pro objekty 
                for (var key in Resources.mapObjectsDefs) {
                    var item = Resources.mapObjectsDefs[key];
                    // vlož index objektu tolikrát, kolik je jeho frekvenc
                    for (var i = 0; i < item.freq; i++) {
                        Resources.mapObjectsFreqPool.push(key);
                    }
                }
            })();
            /**
             * INVENTÁŘ
             */
            // Definice inventárních objektů
            var putIntoInvObjectsDefs = function (invObj) {
                Resources.invObjectsDefs[invObj.invKey] = invObj;
            };
            // usaditelných jako povrch
            putIntoInvObjectsDefs(new Lich.InvObjDefinition(Resources.INV_WOOD_KEY, Resources.mapSurfacesDefs[Resources.SRFC_WOODWALL_KEY]));
            putIntoInvObjectsDefs(new Lich.InvObjDefinition(Resources.INV_DIRT_KEY, Resources.mapSurfacesDefs[Resources.SRFC_BRICK_KEY]));
            putIntoInvObjectsDefs(new Lich.InvObjDefinition(Resources.INV_STRAW_KEY, Resources.mapSurfacesDefs[Resources.SRFC_STRAW_KEY]));
            putIntoInvObjectsDefs(new Lich.InvObjDefinition(Resources.INV_KRYSTAL_KEY, Resources.mapSurfacesDefs[Resources.SRFC_KRYSTAL_KEY]));
            putIntoInvObjectsDefs(new Lich.InvObjDefinition(Resources.INV_FLORITE_KEY, Resources.mapSurfacesDefs[Resources.SRFC_FLORITE_KEY]));
            // usaditelných jako objekt
            putIntoInvObjectsDefs(new Lich.InvObjDefinition(Resources.INV_MUSHROOM_KEY, Resources.mapObjectsDefs[Resources.MAP_MUSHROOM_KEY]));
        })();
        return Resources;
    }());
    Lich.Resources = Resources;
})(Lich || (Lich = {}));
