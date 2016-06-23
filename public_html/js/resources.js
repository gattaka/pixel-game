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
            var imgManifest = [
                new Load("images/ui/dig_spell.png", Resources.SPELL_DIG_KEY),
                new Load("images/ui/fireball_spell.png", Resources.SPELL_FIREBALL_KEY),
                new Load("images/ui/place_spell.png", Resources.SPELL_PLACE_KEY),
                new Load("images/ui/inventory/inv_berry.png", Resources.INV_PLANT_KEY),
                new Load("images/ui/inventory/inv_brown_shroom.png", Resources.INV_SHROOM1_KEY),
                new Load("images/ui/inventory/inv_cyan_flower.png", Resources.INV_PLANT3_KEY),
                new Load("images/ui/inventory/inv_fire_shroom.png", Resources.INV_SHROOM2_KEY),
                new Load("images/ui/inventory/inv_purple_flower.png", Resources.INV_PLANT2_KEY),
                new Load("images/ui/inventory/inv_purple_shroom.png", Resources.INV_SHROOM3_KEY),
                new Load("images/ui/inventory/inv_red_flower.png", Resources.INV_PLANT4_KEY),
                new Load("images/ui/inventory/inv_straw.png", Resources.INV_STRAW_KEY),
                new Load("images/ui/inventory/inv_wood.png", Resources.INV_WOOD_KEY),
                new Load("images/ui/inventory/inv_yellow_flower.png", Resources.INV_PLANT5_KEY),
                new Load("images/characters/lich_animation.png", Resources.LICH_ANIMATION_KEY),
                new Load("images/characters/corpse_animation.png", Resources.CORPSE_ANIMATION_KEY),
                new Load("images/effects/blast_animation.png", Resources.BLAST_ANIMATION_KEY),
                new Load("images/tiles/tiles.png", Resources.TILES_KEY),
                new Load("images/parts/parts.png", Resources.MAP_PARTS_KEY),
                new Load("images/characters/player_icon.png", Resources.PLAYER_ICON_KEY),
                new Load("images/ui/skull.png", Resources.SKULL_KEY),
                new Load("images/armour/helmet.png", Resources.HELMET_KEY),
                new Load("images/armour/torso.png", Resources.TORSO_KEY),
                new Load("images/armour/gauntlet.png", Resources.GAUNTLET_KEY),
                new Load("images/background/sky.png", Resources.SKY_KEY),
                new Load("images/background/far_mountain.png", Resources.FAR_MOUNTAIN_KEY),
                new Load("images/background/mountain.png", Resources.MOUNTAIN_KEY),
                new Load("images/background/far_woodland.png", Resources.FAR_HILL_KEY),
                new Load("images/background/woodland.png", Resources.HILL_KEY),
                new Load("images/background/dirt_back.png", Resources.DIRTBACK_KEY),
                new Load("images/background/darkness.png", Resources.DARKNESS_KEY),
                new Load("sound/334234__liamg-sfx__fireball-cast-1.ogg", Resources.SND_FIREBALL_KEY),
                new Load("sound/113111__satrebor__pick.ogg", Resources.SND_PICK_KEY),
                new Load("sound/248116__robinhood76__05224-fireball-whoosh.ogg", Resources.SND_BURN_KEY),
                new Load("sound/place.ogg", Resources.SND_PLACE_KEY),
                new Load("sound/pick_axe1.ogg", Resources.SND_PICK_AXE_1_KEY),
                new Load("sound/pick_axe2.ogg", Resources.SND_PICK_AXE_2_KEY),
                new Load("sound/pick_axe3.ogg", Resources.SND_PICK_AXE_3_KEY),
                new Load("sound/bonecrack.ogg", Resources.SND_BONECRACK_KEY),
                new Load("sound/skeleton_die.ogg", Resources.SND_SKELETON_DIE_KEY),
                new Load("music/Dirt 2.ogg", Resources.MSC_DIRT_THEME_KEY),
                new Load("music/Building In Progress.ogg", Resources.MSC_BUILD_THEME_KEY),
            ];
            (function () {
                for (var i = 1; i <= Resources.CLOUDS_NUMBER; i++) {
                    imgManifest.push({
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
            self.loader.loadManifest(imgManifest, true);
        }
        ;
        Resources.prototype.getImage = function (key) {
            return this.loader.getResult(key);
        };
        ;
        Resources.prototype.getBitmap = function (key) {
            return new createjs.Bitmap(this.loader.getResult(key));
        };
        ;
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
         * Sprite indexy
         */
        Resources.VOID = 0;
        Resources.DIRT = {
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
        /*
         * Resource klíče
         */
        // background
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
        // tiles
        Resources.TILES_KEY = "TILES_KEY";
        // inv items
        Resources.INV_WOOD_KEY = "INV_WOOD_KEY";
        Resources.INV_STRAW_KEY = "INV_STRAW_KEY";
        Resources.INV_PLANT_KEY = "INV_PLANT_KEY";
        Resources.INV_SHROOM1_KEY = "INV_SHROOM1_KEY";
        Resources.INV_SHROOM2_KEY = "INV_SHROOM2_KEY";
        Resources.INV_SHROOM3_KEY = "INV_SHROOM3_KEY";
        Resources.INV_PLANT2_KEY = "INV_PLANT2_KEY";
        Resources.INV_PLANT3_KEY = "INV_PLANT3_KEY";
        Resources.INV_PLANT4_KEY = "INV_PLANT4_KEY";
        Resources.INV_PLANT5_KEY = "INV_PLANT5_KEY";
        // characters
        Resources.PLAYER_ICON_KEY = "PLAYER_ICON_KEY";
        // map objects
        Resources.MAP_PARTS_KEY = "MAP_PARTS_KEY";
        Resources.MAP_PLANT_KEY = "MAP_PLANT_KEY";
        Resources.MAP_TREE_KEY = "MAP_TREE_KEY";
        Resources.MAP_TREE2_KEY = "MAP_TREE2_KEY";
        Resources.MAP_MOUND_KEY = "MAP_MOUND_KEY";
        Resources.MAP_GRASS_KEY = "MAP_GRASS_KEY";
        Resources.MAP_GRASS2_KEY = "MAP_GRASS2_KEY";
        Resources.MAP_GRASS3_KEY = "MAP_GRASS3_KEY";
        Resources.MAP_GRASS4_KEY = "MAP_GRASS4_KEY";
        Resources.MAP_SHROOM1_KEY = "MAP_SHROOM1_KEY";
        Resources.MAP_SHROOM2_KEY = "MAP_SHROOM2_KEY";
        Resources.MAP_SHROOM3_KEY = "MAP_SHROOM3_KEY";
        Resources.MAP_PLANT2_KEY = "MAP_PLANT2_KEY";
        Resources.MAP_PLANT3_KEY = "MAP_PLANT3_KEY";
        Resources.MAP_PLANT4_KEY = "MAP_PLANT4_KEY";
        Resources.MAP_PLANT5_KEY = "MAP_PLANT5_KEY";
        Resources.MAP_BUSH_KEY = "MAP_BUSH_KEY";
        Resources.MAP_WOODWALL_KEY = "MAP_WOODWALL_KEY";
        // ui
        Resources.SKULL_KEY = "SKULL_KEY";
        Resources.HELMET_KEY = "HELMET_KEY";
        Resources.TORSO_KEY = "TORSO_KEY";
        Resources.GAUNTLET_KEY = "GAUNTLET_KEY";
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
        Resources.dirtObjects = new Array();
        Resources.invObjects = new Array();
        Resources._constructor = (function () {
            console.log('Static constructor');
            // Definice mapových objektů
            var putIntoDirtObjects = function (mapObj) {
                Resources.dirtObjects[mapObj.mapKey] = mapObj;
            };
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_GRASS_KEY, 2, 2, 12, 0, Resources.INV_STRAW_KEY, 2, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_TREE_KEY, 4, 9, 8, 0, Resources.INV_WOOD_KEY, 5, 5, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_TREE2_KEY, 8, 15, 0, 0, Resources.INV_WOOD_KEY, 10, 2, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_GRASS_KEY, 2, 2, 12, 0, Resources.INV_STRAW_KEY, 2, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_GRASS2_KEY, 2, 2, 14, 0, Resources.INV_STRAW_KEY, 2, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_GRASS3_KEY, 2, 2, 16, 0, Resources.INV_STRAW_KEY, 2, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_GRASS4_KEY, 2, 2, 12, 4, Resources.INV_STRAW_KEY, 2, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_SHROOM1_KEY, 2, 2, 12, 2, Resources.INV_SHROOM1_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_SHROOM2_KEY, 2, 2, 14, 2, Resources.INV_SHROOM2_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_SHROOM3_KEY, 2, 2, 16, 2, Resources.INV_SHROOM3_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_PLANT_KEY, 2, 2, 12, 6, Resources.INV_PLANT_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_PLANT2_KEY, 2, 2, 18, 2, Resources.INV_PLANT2_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_PLANT3_KEY, 2, 2, 14, 4, Resources.INV_PLANT3_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_PLANT4_KEY, 2, 2, 16, 4, Resources.INV_PLANT4_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_PLANT5_KEY, 2, 2, 18, 4, Resources.INV_PLANT5_KEY, 1, 1, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_BUSH_KEY, 2, 2, 18, 0, null, 0, 0, false));
            putIntoDirtObjects(new Lich.MapObjDefinition(Resources.MAP_WOODWALL_KEY, 2, 2, 14, 6, Resources.INV_WOOD_KEY, 1, 0, true));
            // Definice inventárních objektů
            var putIntoInvObjects = function (invObj) {
                Resources.invObjects[invObj.invKey] = invObj;
            };
            putIntoInvObjects(new Lich.InvObjDefinition(Resources.INV_WOOD_KEY, Resources.dirtObjects[Resources.MAP_WOODWALL_KEY]));
        })();
        return Resources;
    }());
    Lich.Resources = Resources;
})(Lich || (Lich = {}));
