/// <reference path="mapObj.ts"/>

/**
 * resources.js 
 * 
 * Přehled konstant a všeobecně užitečných zdrojů
 * 
 */
namespace Lich {
    export class Resources {

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

        static WOOD_INDEX = 0;
        static STRAW_INDEX = 6;
        static PLANT_INDEX = 36;
        static SHROOM1_INDEX = 16;
        static SHROOM2_INDEX = 17;
        static SHROOM3_INDEX = 18;
        static PLANT2_INDEX = 19;
        static PLANT3_INDEX = 27;
        static PLANT4_INDEX = 28;
        static PLANT5_INDEX = 29;

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

        // tiles
        static TILES_KEY = "TILES_KEY";

        // inv items
        static INV_PARTS_KEY = "INV_PARTS_KEY";

        // characters
        static PLAYER_ICON_KEY = "PLAYER_ICON_KEY";

        // map objects
        static PARTS_KEY = "PARTS_KEY";
        static PLANT_KEY = "PLANT_KEY";
        static TREE_KEY = "TREE_KEY";
        static TREE2_KEY = "TREE2_KEY";
        static MOUND_KEY = "MOUND_KEY";
        static GRASS_KEY = "GRASS_KEY";
        static GRASS2_KEY = "GRASS2_KEY";
        static GRASS3_KEY = "GRASS3_KEY";
        static GRASS4_KEY = "GRASS4_KEY";
        static SHROOM1_KEY = "SHROOM1_KEY";
        static SHROOM2_KEY = "SHROOM2_KEY";
        static SHROOM3_KEY = "SHROOM3_KEY";
        static PLANT2_KEY = "PLANT2_KEY";
        static PLANT3_KEY = "PLANT3_KEY";
        static PLANT4_KEY = "PLANT4_KEY";
        static PLANT5_KEY = "PLANT5_KEY";
        static BUSH_KEY = "BUSH_KEY";

        // ui
        static INV_KEY = "INV_KEY";
        static SKULL_KEY = "SKULL_KEY";
        static HELMET_KEY = "HELMET_KEY";
        static TORSO_KEY = "TORSO_KEY";
        static GAUNTLET_KEY = "GAUNTLET_KEY";

        // ui spells
        static PLACE_SPELL_KEY = "PLACE_SPELL_KEY";
        static DIG_SPELL_KEY = "DIG_SPELL_KEY";
        static FIREBALL_SPELL_KEY = "FIREBALL_SPELL_KEY";

        // sound
        static FIREBALL_KEY = "FIREBALL_KEY";
        static BURN_KEY = "BURN_KEY";
        static PICK_KEY = "PICK_KEY";
        static PLACE_SOUND_KEY = "PLACE_SOUND_KEY";
        static PICK_AXE_SOUND_1_KEY = "PICK_AXE_SOUND_1_KEY";
        static PICK_AXE_SOUND_2_KEY = "PICK_AXE_SOUND_2_KEY";
        static PICK_AXE_SOUND_3_KEY = "PICK_AXE_SOUND_3_KEY";
        static DIRT_THEME_KEY = "DIRT_THEME_KEY";

        /*
         * Definice mapových objektů
         */
        static dirtObjects = {};
        loader;

        private static _constructor = (() => {
            console.log('Static constructor');
            Resources.dirtObjects[Resources.GRASS_KEY] = new MapObj(Resources.GRASS_KEY, 2, 2, 12, 0, Resources.STRAW_INDEX, 2, 1);
            Resources.dirtObjects[Resources.TREE_KEY] = new MapObj(Resources.TREE_KEY, 4, 9, 8, 0, Resources.WOOD_INDEX, 5, 5);
            Resources.dirtObjects[Resources.TREE2_KEY] = new MapObj(Resources.TREE2_KEY, 8, 15, 0, 0, Resources.WOOD_INDEX, 10, 2);
            Resources.dirtObjects[Resources.GRASS_KEY] = new MapObj(Resources.GRASS_KEY, 2, 2, 12, 0, Resources.STRAW_INDEX, 2, 1);
            Resources.dirtObjects[Resources.GRASS2_KEY] = new MapObj(Resources.GRASS2_KEY, 2, 2, 14, 0, Resources.STRAW_INDEX, 2, 1);
            Resources.dirtObjects[Resources.GRASS3_KEY] = new MapObj(Resources.GRASS3_KEY, 2, 2, 16, 0, Resources.STRAW_INDEX, 2, 1);
            Resources.dirtObjects[Resources.GRASS4_KEY] = new MapObj(Resources.GRASS4_KEY, 2, 2, 12, 4, Resources.STRAW_INDEX, 2, 1);
            Resources.dirtObjects[Resources.SHROOM1_KEY] = new MapObj(Resources.SHROOM1_KEY, 2, 2, 12, 2, Resources.SHROOM1_INDEX, 1, 1);
            Resources.dirtObjects[Resources.SHROOM2_KEY] = new MapObj(Resources.SHROOM2_KEY, 2, 2, 14, 2, Resources.SHROOM2_INDEX, 1, 1);
            Resources.dirtObjects[Resources.SHROOM3_KEY] = new MapObj(Resources.SHROOM3_KEY, 2, 2, 16, 2, Resources.SHROOM3_INDEX, 1, 1);
            Resources.dirtObjects[Resources.PLANT_KEY] = new MapObj(Resources.PLANT_KEY, 2, 2, 12, 6, Resources.PLANT_INDEX, 1, 1);
            Resources.dirtObjects[Resources.PLANT2_KEY] = new MapObj(Resources.PLANT2_KEY, 2, 2, 18, 2, Resources.PLANT2_INDEX, 1, 1);
            Resources.dirtObjects[Resources.PLANT3_KEY] = new MapObj(Resources.PLANT3_KEY, 2, 2, 14, 4, Resources.PLANT3_INDEX, 1, 1);
            Resources.dirtObjects[Resources.PLANT4_KEY] = new MapObj(Resources.PLANT4_KEY, 2, 2, 16, 4, Resources.PLANT4_INDEX, 1, 1);
            Resources.dirtObjects[Resources.PLANT5_KEY] = new MapObj(Resources.PLANT5_KEY, 2, 2, 18, 4, Resources.PLANT5_INDEX, 1, 1);
            Resources.dirtObjects[Resources.BUSH_KEY] = new MapObj(Resources.BUSH_KEY, 2, 2, 18, 0, null, 0, 0);
        })();

        constructor(game, callback?) {

            var self = this;

            var imgManifest = [{
                src: "images/ui/dig_spell.png",
                id: Resources.DIG_SPELL_KEY
            }, {
                    src: "images/ui/fireball_spell.png",
                    id: Resources.FIREBALL_SPELL_KEY
                }, {
                    src: "images/ui/place_spell.png",
                    id: Resources.PLACE_SPELL_KEY
                }, {
                    src: "images/ui/inv_parts.png",
                    id: Resources.INV_PARTS_KEY
                }, {
                    src: "images/characters/lich_animation.png",
                    id: Resources.LICH_ANIMATION_KEY
                }, {
                    src: "images/effects/blast_animation.png",
                    id: Resources.BLAST_ANIMATION_KEY
                }, {
                    src: "images/tiles/tiles.png",
                    id: Resources.TILES_KEY
                }, {
                    src: "images/parts/parts.png",
                    id: Resources.PARTS_KEY
                }, {
                    src: "images/characters/player_icon.png",
                    id: Resources.PLAYER_ICON_KEY
                }, {
                    src: "images/ui/inventory.png",
                    id: Resources.INV_KEY
                }, {
                    src: "images/ui/skull.png",
                    id: Resources.SKULL_KEY
                }, {
                    src: "images/armour/helmet.png",
                    id: Resources.HELMET_KEY
                }, {
                    src: "images/armour/torso.png",
                    id: Resources.TORSO_KEY
                }, {
                    src: "images/armour/gauntlet.png",
                    id: Resources.GAUNTLET_KEY
                }, {
                    src: "images/background/sky.png",
                    id: Resources.SKY_KEY
                }, {
                    src: "images/background/far_mountain.png",
                    id: Resources.FAR_MOUNTAIN_KEY
                }, {
                    src: "images/background/mountain.png",
                    id: Resources.MOUNTAIN_KEY
                }, {
                    src: "images/background/far_woodland.png",
                    id: Resources.FAR_HILL_KEY
                }, {
                    src: "images/background/woodland.png",
                    id: Resources.HILL_KEY
                }, {
                    src: "images/background/dirt_back.png",
                    id: Resources.DIRTBACK_KEY
                }, {
                    src: "sound/334234__liamg-sfx__fireball-cast-1.ogg",
                    id: Resources.FIREBALL_KEY
                }, {
                    src: "sound/113111__satrebor__pick.ogg",
                    id: Resources.PICK_KEY
                }, {
                    src: "sound/248116__robinhood76__05224-fireball-whoosh.ogg",
                    id: Resources.BURN_KEY
                }, {
                    src: "sound/place.ogg",
                    id: Resources.PLACE_SOUND_KEY
                }, {
                    src: "sound/pick_axe1.ogg",
                    id: Resources.PICK_AXE_SOUND_1_KEY
                }, {
                    src: "sound/pick_axe2.ogg",
                    id: Resources.PICK_AXE_SOUND_2_KEY
                }, {
                    src: "sound/pick_axe3.ogg",
                    id: Resources.PICK_AXE_SOUND_3_KEY
                }, {
                    src: "sound/Dirt 2.ogg",
                    id: Resources.DIRT_THEME_KEY
                }];

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

            var loadLabel = new createjs.Text("Loading...", "bold 28px Arial", "#ff0");
            loadLabel.x = 50;
            loadLabel.y = 50;
            loadScreenCont.addChild(loadLabel);

            self.loader = new createjs.LoadQueue(false);
            createjs.Sound.alternateExtensions = ["mp3"];
            self.loader.installPlugin(createjs.Sound);
            self.loader.addEventListener("progress", function(event) {
                loadLabel.text = Math.floor(event.loaded * 100) + "% Loading... ";
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

        getBitmap(key: string) {
            return new createjs.Bitmap(this.loader.getResult(key));
        };

        getItemBitmap(v: number) {
            var self = this;
            var item = self.getBitmap(Resources.INV_PARTS_KEY);
            var itemCols = item.image.width / Resources.PARTS_SIZE;
            // Otestováno: tohle je rychlejší než extract ze Spritesheet
            item.sourceRect = new createjs.Rectangle(
                (v % itemCols) * Resources.PARTS_SIZE,
                Math.floor(v / itemCols) * Resources.PARTS_SIZE,
                Resources.PARTS_SIZE,
                Resources.PARTS_SIZE
            );
            return item;
        };

    }
}