/// <reference path="mapObj.ts"/>

/**
 * resources.js 
 * 
 * Přehled konstant a všeobecně užitečných zdrojů
 * 
 */
namespace Lich {

    class Load {
        constructor(public src: string, public id: string) { };
    }

    export class Resources {

        static FONT = "expressway";
        static OUTLINE_COLOR = "#000";
        static TEXT_COLOR = "#FF0";
        static DEBUG_TEXT_COLOR = "#FF0";

        /*
         * Přepínače
         */
        static SHOW_SECTORS = false;
        static PRINT_SECTOR_ALLOC = false;

        /*
         * Velikosti
         */
        static TILE_SIZE = 16;
        static PARTS_SIZE = 2 * Resources.TILE_SIZE;
        static PARTS_SHEET_WIDTH = 20;

        static CLOUDS_NUMBER = 5;

        /*
         * Sprite indexy
         */
        static VOID = 0;
        static DIRT = {
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
        static DIRT_BACK_KEY = "DIRT_BACK_KEY";
        static SKY_KEY = "SKY_KEY";
        static FAR_MOUNTAIN_KEY = "FAR_MOUNTAIN_KEY";
        static MOUNTAIN_KEY = "MOUNTAIN_KEY";
        static FAR_HILL_KEY = "FAR_HILL_KEY";
        static HILL_KEY = "HILL_KEY";
        static DIRTBACK_KEY = "DIRTBACK_KEY";
        static CLOUD_KEY = "CLOUD_KEY";

        // animations
        static BLAST_ANIMATION_KEY = "BLAST_ANIMATION_KEY";
        static LICH_ANIMATION_KEY = "LICH_ANIMATION_KEY";
        static CORPSE_ANIMATION_KEY = "CORPSE_ANIMATION_KEY";

        // tiles
        static TILES_KEY = "TILES_KEY";

        // inv items
        static INV_WOOD_KEY = "INV_WOOD_KEY";
        static INV_STRAW_KEY = "INV_STRAW_KEY";
        static INV_PLANT_KEY = "INV_PLANT_KEY";
        static INV_SHROOM1_KEY = "INV_SHROOM1_KEY";
        static INV_SHROOM2_KEY = "INV_SHROOM2_KEY";
        static INV_SHROOM3_KEY = "INV_SHROOM3_KEY";
        static INV_PLANT2_KEY = "INV_PLANT2_KEY";
        static INV_PLANT3_KEY = "INV_PLANT3_KEY";
        static INV_PLANT4_KEY = "INV_PLANT4_KEY";
        static INV_PLANT5_KEY = "INV_PLANT5_KEY";

        // characters
        static PLAYER_ICON_KEY = "PLAYER_ICON_KEY";

        // map objects
        static MAP_PARTS_KEY = "MAP_PARTS_KEY";
        static MAP_PLANT_KEY = "MAP_PLANT_KEY";
        static MAP_TREE_KEY = "MAP_TREE_KEY";
        static MAP_TREE2_KEY = "MAP_TREE2_KEY";
        static MAP_MOUND_KEY = "MAP_MOUND_KEY";
        static MAP_GRASS_KEY = "MAP_GRASS_KEY";
        static MAP_GRASS2_KEY = "MAP_GRASS2_KEY";
        static MAP_GRASS3_KEY = "MAP_GRASS3_KEY";
        static MAP_GRASS4_KEY = "MAP_GRASS4_KEY";
        static MAP_SHROOM1_KEY = "MAP_SHROOM1_KEY";
        static MAP_SHROOM2_KEY = "MAP_SHROOM2_KEY";
        static MAP_SHROOM3_KEY = "MAP_SHROOM3_KEY";
        static MAP_PLANT2_KEY = "MAP_PLANT2_KEY";
        static MAP_PLANT3_KEY = "MAP_PLANT3_KEY";
        static MAP_PLANT4_KEY = "MAP_PLANT4_KEY";
        static MAP_PLANT5_KEY = "MAP_PLANT5_KEY";
        static MAP_BUSH_KEY = "MAP_BUSH_KEY";

        // ui
        static SKULL_KEY = "SKULL_KEY";
        static HELMET_KEY = "HELMET_KEY";
        static TORSO_KEY = "TORSO_KEY";
        static GAUNTLET_KEY = "GAUNTLET_KEY";

        // ui spells
        static SPELL_PLACE_KEY = "SPELL_PLACE_KEY";
        static SPELL_DIG_KEY = "SPELL_DIG_KEY";
        static SPELL_FIREBALL_KEY = "SPELL_FIREBALL_KEY";

        // sound
        static SND_FIREBALL_KEY = "SND_FIREBALL_KEY";
        static SND_BURN_KEY = "SND_BURN_KEY";
        static SND_PICK_KEY = "SND_PICK_KEY";
        static SND_PLACE_KEY = "SND_PLACE_KEY";
        static SND_PICK_AXE_1_KEY = "SND_PICK_AXE_1_KEY";
        static SND_PICK_AXE_2_KEY = "SND_PICK_AXE_2_KEY";
        static SND_PICK_AXE_3_KEY = "SND_PICK_AXE_3_KEY";
        static SND_DIRT_THEME_KEY = "SND_DIRT_THEME_KEY";
        static SND_BONECRACK_KEY = "SND_BONECRACK_KEY";
        static SND_GHOST_KEY = "SND_GHOST_KEY";

        /*
         * Definice mapových objektů
         */
        static dirtObjects = new Array<MapObjDefinition>();
        loader;

        private static _constructor = (() => {
            console.log('Static constructor');

            var putIntoDirtObjects = function(mapObj: MapObjDefinition) {
                Resources.dirtObjects[mapObj.mapKey] = mapObj;
            };

            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_GRASS_KEY, 2, 2, 12, 0, Resources.INV_STRAW_KEY, 2, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_TREE_KEY, 4, 9, 8, 0, Resources.INV_WOOD_KEY, 5, 5));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_TREE2_KEY, 8, 15, 0, 0, Resources.INV_WOOD_KEY, 10, 2));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_GRASS_KEY, 2, 2, 12, 0, Resources.INV_STRAW_KEY, 2, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_GRASS2_KEY, 2, 2, 14, 0, Resources.INV_STRAW_KEY, 2, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_GRASS3_KEY, 2, 2, 16, 0, Resources.INV_STRAW_KEY, 2, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_GRASS4_KEY, 2, 2, 12, 4, Resources.INV_STRAW_KEY, 2, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_SHROOM1_KEY, 2, 2, 12, 2, Resources.INV_SHROOM1_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_SHROOM2_KEY, 2, 2, 14, 2, Resources.INV_SHROOM2_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_SHROOM3_KEY, 2, 2, 16, 2, Resources.INV_SHROOM3_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_PLANT_KEY, 2, 2, 12, 6, Resources.INV_PLANT_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_PLANT2_KEY, 2, 2, 18, 2, Resources.INV_PLANT2_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_PLANT3_KEY, 2, 2, 14, 4, Resources.INV_PLANT3_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_PLANT4_KEY, 2, 2, 16, 4, Resources.INV_PLANT4_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_PLANT5_KEY, 2, 2, 18, 4, Resources.INV_PLANT5_KEY, 1, 1));
            putIntoDirtObjects(new MapObjDefinition(Resources.MAP_BUSH_KEY, 2, 2, 18, 0, null, 0, 0));

        })();

        constructor(game, callback?) {

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
                new Load("sound/334234__liamg-sfx__fireball-cast-1.ogg", Resources.SND_FIREBALL_KEY),
                new Load("sound/113111__satrebor__pick.ogg", Resources.SND_PICK_KEY),
                new Load("sound/248116__robinhood76__05224-fireball-whoosh.ogg", Resources.SND_BURN_KEY),
                new Load("sound/place.ogg", Resources.SND_PLACE_KEY),
                new Load("sound/pick_axe1.ogg", Resources.SND_PICK_AXE_1_KEY),
                new Load("sound/pick_axe2.ogg", Resources.SND_PICK_AXE_2_KEY),
                new Load("sound/pick_axe3.ogg", Resources.SND_PICK_AXE_3_KEY),
                new Load("sound/Dirt 2.ogg", Resources.SND_DIRT_THEME_KEY),
                new Load("sound/bonecrack.ogg", Resources.SND_BONECRACK_KEY),
                new Load("sound/ghost.ogg", Resources.SND_GHOST_KEY),
            ];

            (function() {
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

            var loadLabel = new Label("Loading...", "30px " + Resources.FONT, Resources.TEXT_COLOR);
            loadLabel.x = game.canvas.width / 2 - 50;
            loadLabel.y = game.canvas.height / 2 - 50;
            loadScreenCont.addChild(loadLabel);

            self.loader = new createjs.LoadQueue(false);
            createjs.Sound.alternateExtensions = ["mp3"];
            self.loader.installPlugin(createjs.Sound);
            self.loader.addEventListener("progress", function(event) {
                loadLabel.setText(Math.floor(event.loaded * 100) + "% Loading... ");
            });
            self.loader.addEventListener("complete", function() {
                createjs.Tween.get(loadScreenCont)
                    .to({
                        alpha: 0
                    }, 2000).call(function() {
                        game.stage.removeChild(loadScreenCont);
                    });
                if (typeof callback !== "undefined") {
                    callback();
                }
            });
            self.loader.loadManifest(imgManifest, true);

        };

        getImage(key: string): HTMLImageElement {
            return this.loader.getResult(key);
        };

        getBitmap(key: string): createjs.Bitmap {
            return new createjs.Bitmap(this.loader.getResult(key));
        };

        getSprite(key: string): createjs.Sprite {
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
                    "idle": [0, 0, "idle", 0.005],
                }
            })
            var sprite = new createjs.Sprite(sheet, "idle");
            sprite.gotoAndStop("idle");
            return sprite;
        };

    }
}