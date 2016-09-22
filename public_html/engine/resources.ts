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

        static INSTANCE: Resources;

        static FONT = "expressway";
        static OUTLINE_COLOR = "#000";
        static TEXT_COLOR = "#FF0";
        static DEBUG_TEXT_COLOR = "#FF0";

        static REACH_TILES_RADIUS = 10;

        static SPRITE_FRAMERATE = 0.2;

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
         * Resource klíče
         */

        // background
        static DIRT_BACK_START_KEY = "DIRT_BACK_START_KEY";
        static DIRT_BACK_KEY = "DIRT_BACK_KEY";
        static SKY_KEY = "SKY_KEY";
        static FAR_MOUNTAIN_KEY = "FAR_MOUNTAIN_KEY";
        static MOUNTAIN_KEY = "MOUNTAIN_KEY";
        static FAR_HILL_KEY = "FAR_HILL_KEY";
        static HILL_KEY = "HILL_KEY";
        static DIRTBACK_KEY = "DIRTBACK_KEY";
        static DARKNESS_KEY = "DARKNESS_KEY";
        static CLOUD_KEY = "CLOUD_KEY";

        // animations
        static FIREBALL_ANIMATION_KEY = "BLAST_ANIMATION_KEY";
        static LICH_ANIMATION_KEY = "LICH_ANIMATION_KEY";
        static CORPSE_ANIMATION_KEY = "CORPSE_ANIMATION_KEY";
        static BOLT_ANIMATION_KEY = "BOLT_ANIMATION_KEY";

        // surfaces
        static SRFC_DIRT_KEY = "SRFC_DIRT_KEY";
        static SRFC_WOODWALL_KEY = "SRFC_WOODWALL_KEY";
        static SRFC_KRYSTAL_KEY = "SRFC_KRYSTAL_KEY";
        static SRFC_FLORITE_KEY = "SRFC_FLORITE_KEY";
        static SRFC_BRICK_KEY = "SRFC_BRICK_KEY";
        static SRFC_STRAW_KEY = "SRFC_STRAW_KEY";

        // surface bgrs
        static SRFC_BGR_BRICK_KEY = "SRFC_BGR_BRICK_KEY";
        static SRFC_BGR_WOODWALL_KEY = "SRFC_BGR_WOODWALL_KEY";
        static SRFC_BGR_STRAW_KEY = "SRFC_BGR_STRAW_KEY";

        // map objects
        static MAP_BERRY_KEY = "MAP_BERRY_KEY";
        static MAP_BUSH_KEY = "MAP_BUSH_KEY";
        static MAP_BUSH2_KEY = "MAP_BUSH2_KEY";
        static MAP_GRASS_KEY = "MAP_GRASS_KEY";
        static MAP_GRASS2_KEY = "MAP_GRASS2_KEY";
        static MAP_GRASS3_KEY = "MAP_GRASS3_KEY";
        static MAP_GRAVE_KEY = "MAP_GRAVE_KEY";
        static MAP_MUSHROOM_KEY = "MAP_MUSHROOM_KEY";
        static MAP_MUSHROOM2_KEY = "MAP_MUSHROOM2_KEY";
        static MAP_MUSHROOM3_KEY = "MAP_MUSHROOM3_KEY";
        static MAP_PLANT_KEY = "MAP_PLANT_KEY";
        static MAP_PLANT2_KEY = "MAP_PLANT2_KEY";
        static MAP_PLANT3_KEY = "MAP_PLANT3_KEY";
        static MAP_PLANT4_KEY = "MAP_PLANT4_KEY";
        static MAP_TREE_KEY = "MAP_TREE_KEY";
        static MAP_TREE2_KEY = "MAP_TREE2_KEY";
        static MAP_FLORITE_KEY = "MAP_FLORITE_KEY";
        static MAP_CAMPFIRE_KEY = "MAP_CAMPFIRE_KEY";
        static MAP_DOOR_CLOSED_KEY = "MAP_DOOR_CLOSED_KEY";
        static MAP_DOOR_OPEN_KEY = "MAP_DOOR_OPEN_KEY";

        // inv items
        static INV_BERRY_KEY = "INV_BERRY_KEY";
        static INV_BONES_KEY = "INV_BONES_KEY";
        static INV_WOOD_KEY = "INV_WOOD_KEY";
        static INV_STRAW_KEY = "INV_STRAW_KEY";
        static INV_MUSHROOM_KEY = "INV_MUSHROOM_KEY";
        static INV_MUSHROOM2_KEY = "INV_MUSHROOM2_KEY";
        static INV_MUSHROOM3_KEY = "INV_MUSHROOM3_KEY";
        static INV_PLANT_KEY = "INV_PLANT_KEY";
        static INV_PLANT2_KEY = "INV_PLANT2_KEY";
        static INV_PLANT3_KEY = "INV_PLANT3_KEY";
        static INV_PLANT4_KEY = "INV_PLANT4_KEY";
        static INV_DIRT_KEY = "INV_DIRT_KEY";
        static INV_KRYSTAL_KEY = "INV_KRYSTAL_KEY";
        static INV_FLORITE_KEY = "INV_FLORITE_KEY";
        static INV_CAMPFIRE_KEY = "INV_CAMPFIRE_KEY";
        static INV_DOOR_KEY = "INV_DOOR_KEY";

        // characters
        static PLAYER_ICON_KEY = "PLAYER_ICON_KEY";

        // ui
        static SKULL_KEY = "SKULL_KEY";
        static HELMET_KEY = "HELMET_KEY";
        static TORSO_KEY = "TORSO_KEY";
        static GAUNTLET_KEY = "GAUNTLET_KEY";
        static UI_SOUND_KEY = "UI_SOUND_KEY";

        // ui spells
        static SPELL_PLACE_KEY = "SPELL_PLACE_KEY";
        static SPELL_PLACE_BGR_KEY = "SPELL_PLACE_BGR_KEY";
        static SPELL_DIG_KEY = "SPELL_DIG_KEY";
        static SPELL_DIG_BGR_KEY = "SPELL_DIG_BGR_KEY";
        static SPELL_FIREBALL_KEY = "SPELL_FIREBALL_KEY";
        static SPELL_BOLT_KEY = "SPELL_BOLT_KEY";
        static SPELL_ENEMY_KEY = "SPELL_ENEMY_KEY";

        // RMB click interakce s objekty
        static SPELL_INTERACT_KEY = "SPELL_RMB_KEY";

        // sounds
        static SND_FIREBALL_KEY = "SND_FIREBALL_KEY";
        static SND_BURN_KEY = "SND_BURN_KEY";
        static SND_BOLT_CAST = "SND_BOLT_CAST";
        static SND_PICK_KEY = "SND_PICK_KEY";
        static SND_PLACE_KEY = "SND_PLACE_KEY";
        static SND_PICK_AXE_1_KEY = "SND_PICK_AXE_1_KEY";
        static SND_PICK_AXE_2_KEY = "SND_PICK_AXE_2_KEY";
        static SND_PICK_AXE_3_KEY = "SND_PICK_AXE_3_KEY";
        static SND_BONECRACK_KEY = "SND_BONECRACK_KEY";
        static SND_SKELETON_DIE_KEY = "SND_GHOST_KEY";
        static SND_SPAWN_KEY = "SND_SPAWN_KEY";
        static SND_DOOR_OPEN_KEY = "SND_DOOR_OPEN_KEY";
        static SND_DOOR_CLOSE_KEY = "SND_DOOR_CLOSE_KEY";

        // music
        static MSC_DIRT_THEME_KEY = "MSC_DIRT_THEME_KEY";
        static MSC_BUILD_THEME_KEY = "MSC_BUILD_THEME_KEY";
        static MSC_BOSS_THEME_KEY = "MSC_BOSS_THEME_KEY";
        static MSC_KRYSTAL_THEME_KEY = "MSC_KRYSTAL_THEME_KEY";
        static MSC_FLOOD_THEME_KEY = "MSC_FLOOD_THEME_KEY";
        static MSC_LAVA_THEME_KEY = "MSC_LAVA_THEME_KEY";

        /**
         * DEFINICE
         */

        // definice povrchů a objektů
        public mapSurfaceDefs = new Array<MapSurfaceDefinition>();
        public mapSurfacesBgrDefs = new Array<MapSurfaceBgrDefinition>();
        public mapObjectDefs = new Array<MapObjDefinition>(); 
        public mapSurfacesFreqPool = new Array<string>();
        public mapObjectDefsFreqPool = new Array<string>();

        // definice inv položek
        public invObjectDefs = new Array<InvObjDefinition>();

        // definice spells
        public spellDefs = new Table<SpellDefinition>();
        public interactSpellDef = new MapObjectsInteractionSpellDef();

        /*
         * Sprite indexy
         */
        public surfaceIndex = new SurfaceIndex();
        public surfaceBgrIndex = new SurfaceBgrIndex();

        loader;

        private static _constructor = (() => {
            console.log('Static constructor');
        })();

        constructor(game: Game, callback?) {

            var self = this;
            var manifest = [
                /**
                 * IMAGES  
                 */
                // spells
                new Load("images/ui/dig_spell.png", Resources.SPELL_DIG_KEY),
                new Load("images/ui/dig_bgr_spell.png", Resources.SPELL_DIG_BGR_KEY),
                new Load("images/ui/fireball_spell.png", Resources.SPELL_FIREBALL_KEY),
                new Load("images/ui/place_spell.png", Resources.SPELL_PLACE_KEY),
                new Load("images/ui/place_bgr_spell.png", Resources.SPELL_PLACE_BGR_KEY),
                new Load("images/ui/bolt_spell.png", Resources.SPELL_BOLT_KEY),
                new Load("images/ui/enemy_spell.png", Resources.SPELL_ENEMY_KEY),
                // inventory
                new Load("images/ui/inventory/inv_bones.png", Resources.INV_BONES_KEY),
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
                new Load("images/ui/inventory/inv_campfire.png", Resources.INV_CAMPFIRE_KEY),
                new Load("images/ui/inventory/inv_door.png", Resources.INV_DOOR_KEY),
                // characters
                new Load("images/characters/lich_animation.png", Resources.LICH_ANIMATION_KEY),
                new Load("images/characters/corpse_animation.png", Resources.CORPSE_ANIMATION_KEY),
                // gfx animations
                new Load("images/effects/blast_animation.png", Resources.FIREBALL_ANIMATION_KEY),
                new Load("images/effects/bolt_animation.png", Resources.BOLT_ANIMATION_KEY),
                // surfaces
                new Load("images/surfaces/dirt.png", Resources.SRFC_DIRT_KEY),
                new Load("images/surfaces/woodwall.png", Resources.SRFC_WOODWALL_KEY),
                new Load("images/surfaces/woodwall_bgr.png", Resources.SRFC_BGR_WOODWALL_KEY),
                new Load("images/surfaces/krystals.png", Resources.SRFC_KRYSTAL_KEY),
                new Load("images/surfaces/florite.png", Resources.SRFC_FLORITE_KEY),
                new Load("images/surfaces/brick.png", Resources.SRFC_BRICK_KEY),
                new Load("images/surfaces/brick_bgr.png", Resources.SRFC_BGR_BRICK_KEY),
                new Load("images/surfaces/straw.png", Resources.SRFC_STRAW_KEY),
                new Load("images/surfaces/straw_bgr.png", Resources.SRFC_BGR_STRAW_KEY),
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
                new Load("images/parts/door_closed.png", Resources.MAP_DOOR_CLOSED_KEY),
                new Load("images/parts/door_open.png", Resources.MAP_DOOR_OPEN_KEY),
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
                new Load("sound/bolt_cast.ogg", Resources.SND_BOLT_CAST),
                new Load("sound/place.ogg", Resources.SND_PLACE_KEY),
                new Load("sound/pick_axe1.ogg", Resources.SND_PICK_AXE_1_KEY),
                new Load("sound/pick_axe2.ogg", Resources.SND_PICK_AXE_2_KEY),
                new Load("sound/pick_axe3.ogg", Resources.SND_PICK_AXE_3_KEY),
                new Load("sound/bonecrack.ogg", Resources.SND_BONECRACK_KEY),
                new Load("sound/skeleton_die.ogg", Resources.SND_SKELETON_DIE_KEY),
                new Load("sound/252083__pepingrillin__spawn.ogg", Resources.SND_SPAWN_KEY),
                new Load("sound/door_open.ogg", Resources.SND_DOOR_OPEN_KEY),
                new Load("sound/door_close.ogg", Resources.SND_DOOR_CLOSE_KEY),
                // music
                new Load("music/Dirt_2.ogg", Resources.MSC_DIRT_THEME_KEY),
                // pro rychlejší nahrávání (v ostré verzi bude odkomentováno)
                /*
                new Load("music/Building In Progress.ogg", Resources.MSC_BUILD_THEME_KEY),
                new Load("music/Boss 1.ogg", Resources.MSC_BOSS_THEME_KEY),
                new Load("music/Fight In Crystals.ogg", Resources.MSC_KRYSTAL_THEME_KEY),
                new Load("music/Flood.ogg", Resources.MSC_FLOOD_THEME_KEY),
                new Load("music/Lava.ogg", Resources.MSC_LAVA_THEME_KEY),
                */
            ];

            (function() {
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
            self.loader.loadManifest(manifest, true);

            Resources.INSTANCE = this;

            /**
             * Definice
             */

            /**
             * POVRCHY
             */

            // Definice mapových povrchů
            var registerSurfaceDefs = function(mapSurface: MapSurfaceDefinition) {
                Resources.INSTANCE.mapSurfaceDefs[mapSurface.mapKey] = mapSurface;
                // Definice indexových počátků pro typy povrchu
                Resources.INSTANCE.surfaceIndex.insert(mapSurface.mapKey);
            };

            // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
            // jsou dle frekvence usazovány jiné povrchy
            registerSurfaceDefs(new MapSurfaceDefinition(Resources.SRFC_DIRT_KEY, Resources.INV_DIRT_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(Resources.SRFC_WOODWALL_KEY, Resources.INV_WOOD_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(Resources.SRFC_KRYSTAL_KEY, Resources.INV_KRYSTAL_KEY, 1, 1));
            registerSurfaceDefs(new MapSurfaceDefinition(Resources.SRFC_FLORITE_KEY, Resources.INV_FLORITE_KEY, 1, 1));
            registerSurfaceDefs(new MapSurfaceDefinition(Resources.SRFC_BRICK_KEY, Resources.INV_DIRT_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(Resources.SRFC_STRAW_KEY, Resources.INV_STRAW_KEY, 1, 0));

            (function() {
                // vytvoř frekvenční pool pro povrchy
                for (var key in Resources.INSTANCE.mapSurfaceDefs) {
                    var item = Resources.INSTANCE.mapSurfaceDefs[key];
                    // vlož index objektu tolikrát, kolik je jeho frekvenc
                    for (var i = 0; i < item.freq; i++) {
                        Resources.INSTANCE.mapSurfacesFreqPool.push(key);
                    }
                }
            })();  
            
            /**
             * STĚNY POVRCHŮ
             */

            // Definice mapových stěn povrchů
            var registerSurfaceBgrDefs = function(mapSurface: MapSurfaceBgrDefinition) {
                Resources.INSTANCE.mapSurfacesBgrDefs[mapSurface.mapKey] = mapSurface;
                // Definice indexových počátků pro typy povrchu
                Resources.INSTANCE.surfaceBgrIndex.insert(mapSurface.mapKey);
            };

            registerSurfaceBgrDefs(new MapSurfaceBgrDefinition(Resources.SRFC_BGR_BRICK_KEY, Resources.INV_DIRT_KEY, 1));
            registerSurfaceBgrDefs(new MapSurfaceBgrDefinition(Resources.SRFC_BGR_WOODWALL_KEY, Resources.INV_WOOD_KEY, 1));
            registerSurfaceBgrDefs(new MapSurfaceBgrDefinition(Resources.SRFC_BGR_STRAW_KEY, Resources.INV_STRAW_KEY, 1));

            /**
             * OBJEKTY
             */

            // Definice mapových objektů
            var registerObjectDefs = function(mapObj: MapObjDefinition) {
                Resources.INSTANCE.mapObjectDefs[mapObj.mapKey] = mapObj;
            };

            registerObjectDefs(new MapObjDefinition(Resources.MAP_GRAVE_KEY, 6, 3, Resources.INV_BONES_KEY, 5, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_BERRY_KEY, 2, 2, Resources.INV_BERRY_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_BUSH_KEY, 2, 2, null, 0, 10));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_BUSH2_KEY, 2, 2, null, 0, 10));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_GRASS_KEY, 2, 2, Resources.INV_STRAW_KEY, 1, 20));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_GRASS2_KEY, 2, 2, Resources.INV_STRAW_KEY, 1, 20));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_GRASS3_KEY, 2, 2, Resources.INV_STRAW_KEY, 1, 20));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_TREE_KEY, 4, 9, Resources.INV_WOOD_KEY, 2, 10));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_TREE2_KEY, 8, 15, Resources.INV_WOOD_KEY, 5, 20));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_MUSHROOM_KEY, 2, 2, Resources.INV_MUSHROOM_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_MUSHROOM2_KEY, 2, 2, Resources.INV_MUSHROOM2_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_MUSHROOM3_KEY, 2, 2, Resources.INV_MUSHROOM3_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_PLANT_KEY, 2, 2, Resources.INV_PLANT_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_PLANT2_KEY, 2, 2, Resources.INV_PLANT2_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_PLANT3_KEY, 2, 2, Resources.INV_PLANT3_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_PLANT4_KEY, 2, 2, Resources.INV_PLANT4_KEY, 1, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_FLORITE_KEY, 2, 2, Resources.INV_FLORITE_KEY, 5, 1));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_CAMPFIRE_KEY, 2, 2, Resources.INV_CAMPFIRE_KEY, 1, 1).setFrames(4));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_DOOR_OPEN_KEY, 2, 4, Resources.INV_DOOR_KEY, 1, 10,
                function(rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                    game.world.render.digObject(rx, ry, false);
                    game.world.render.placeObject(rx, ry, Resources.INSTANCE.mapObjectDefs[Resources.MAP_DOOR_CLOSED_KEY]);
                    Mixer.play(Resources.SND_DOOR_CLOSE_KEY);
                }));
            registerObjectDefs(new MapObjDefinition(Resources.MAP_DOOR_CLOSED_KEY, 2, 4, Resources.INV_DOOR_KEY, 1, 0,
                function(rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                    game.world.render.digObject(rx, ry, false);
                    game.world.render.placeObject(rx, ry, Resources.INSTANCE.mapObjectDefs[Resources.MAP_DOOR_OPEN_KEY]);
                    Mixer.play(Resources.SND_DOOR_OPEN_KEY);
                }).setCollision(true));



            (function() {
                // vytvoř frekvenční pool pro objekty 
                for (var key in Resources.INSTANCE.mapObjectDefs) {
                    var item = Resources.INSTANCE.mapObjectDefs[key];
                    // vlož index objektu tolikrát, kolik je jeho frekvenc
                    for (var i = 0; i < item.freq; i++) {
                        Resources.INSTANCE.mapObjectDefsFreqPool.push(key);
                    }
                }
            })();

            /**
             * INVENTÁŘ 
             */

            // Definice inventárních objektů
            var registerInvObjectDefs = function(invObj: InvObjDefinition) {
                Resources.INSTANCE.invObjectDefs[invObj.invKey] = invObj;
            };

            // usaditelných jako objekt
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_MUSHROOM_KEY, Resources.INSTANCE.mapObjectDefs[Resources.MAP_MUSHROOM_KEY]));
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_CAMPFIRE_KEY, Resources.INSTANCE.mapObjectDefs[Resources.MAP_CAMPFIRE_KEY]).setFrames(4));
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_DOOR_KEY, Resources.INSTANCE.mapObjectDefs[Resources.MAP_DOOR_OPEN_KEY]));

            // usaditelných jako povrch
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_WOOD_KEY, Resources.INSTANCE.mapSurfaceDefs[Resources.SRFC_WOODWALL_KEY])
                .setBackground(Resources.INSTANCE.mapSurfacesBgrDefs[Resources.SRFC_BGR_WOODWALL_KEY]));
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_DIRT_KEY, Resources.INSTANCE.mapSurfaceDefs[Resources.SRFC_BRICK_KEY])
                .setBackground(Resources.INSTANCE.mapSurfacesBgrDefs[Resources.SRFC_BGR_BRICK_KEY]));
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_STRAW_KEY, Resources.INSTANCE.mapSurfaceDefs[Resources.SRFC_STRAW_KEY])
                .setBackground(Resources.INSTANCE.mapSurfacesBgrDefs[Resources.SRFC_BGR_STRAW_KEY]));
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_KRYSTAL_KEY, Resources.INSTANCE.mapSurfaceDefs[Resources.SRFC_KRYSTAL_KEY]));
            registerInvObjectDefs(new InvObjDefinition(Resources.INV_FLORITE_KEY, Resources.INSTANCE.mapSurfaceDefs[Resources.SRFC_FLORITE_KEY]));


            /**
             * SPELLS
             */

            // Definice spells
            var registerSpellDefs = function(spell: SpellDefinition) {
                Resources.INSTANCE.spellDefs.insert(spell.key, spell);
            };

            registerSpellDefs(new FireballSpellDef());
            registerSpellDefs(new DigSpellDef());
            registerSpellDefs(new DigBgrSpellDef());
            registerSpellDefs(new PlaceSpellDef());
            registerSpellDefs(new PlaceBgrSpellDef());
            registerSpellDefs(new BoltSpellDef());
            registerSpellDefs(new EnemySpellDef());

        };

        getImage(key: string): HTMLImageElement {
            return <HTMLImageElement>this.loader.getResult(key);
        };

        getBitmap(key: string): createjs.Bitmap {
            return new createjs.Bitmap(this.getImage(key));
        };

        getSpritePart(key: string, tileX: number, tileY: number, count: number, height: number, width: number) {
            var frames = [];
            for (var i = 0; i < count; i++) {
                frames.push([
                    tileX * Resources.TILE_SIZE + i * width * Resources.TILE_SIZE, // x
                    tileY * Resources.TILE_SIZE, // y
                    Resources.TILE_SIZE,
                    Resources.TILE_SIZE
                ]);
            }
            var sheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [this.getImage(Resources.MAP_CAMPFIRE_KEY)],
                "frames": frames,
                "animations": { "idle": [0, count - 1, "idle", Resources.SPRITE_FRAMERATE] }
            });
            var sprite = new createjs.Sprite(sheet, "idle");
            sprite.gotoAndPlay("idle");
            return sprite;
        }

        getSpriteSheet(key: string, framesCount: number): createjs.SpriteSheet {
            var self = this;
            var sheet = new createjs.SpriteSheet({
                framerate: 10,
                "images": [self.getImage(key)],
                "frames": {
                    "regX": 0,
                    "height": Resources.PARTS_SIZE,
                    "count": framesCount,
                    "regY": 0,
                    "width": Resources.PARTS_SIZE
                },
                "animations": {
                    "idle": [0, framesCount - 1, "idle", Resources.SPRITE_FRAMERATE],
                }
            });
            return sheet;
        }

        getSprite(key: string, framesCount: number): createjs.Sprite {
            var self = this;
            var sprite = new createjs.Sprite(self.getSpriteSheet(key, framesCount), "idle");
            sprite.gotoAndPlay("idle");
            return sprite;
        };

    }
}