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
    (function (BackgroundKey) {
        BackgroundKey[BackgroundKey["DIRT_BACK_START_KEY"] = 0] = "DIRT_BACK_START_KEY";
        BackgroundKey[BackgroundKey["DIRT_BACK_KEY"] = 1] = "DIRT_BACK_KEY";
        BackgroundKey[BackgroundKey["SKY_KEY"] = 2] = "SKY_KEY";
        BackgroundKey[BackgroundKey["FAR_MOUNTAIN_KEY"] = 3] = "FAR_MOUNTAIN_KEY";
        BackgroundKey[BackgroundKey["MOUNTAIN_KEY"] = 4] = "MOUNTAIN_KEY";
        BackgroundKey[BackgroundKey["FAR_HILL_KEY"] = 5] = "FAR_HILL_KEY";
        BackgroundKey[BackgroundKey["HILL_KEY"] = 6] = "HILL_KEY";
        BackgroundKey[BackgroundKey["DIRTBACK_KEY"] = 7] = "DIRTBACK_KEY";
        BackgroundKey[BackgroundKey["DARKNESS_KEY"] = 8] = "DARKNESS_KEY";
        BackgroundKey[BackgroundKey["CLOUD_KEY"] = 9] = "CLOUD_KEY";
    })(Lich.BackgroundKey || (Lich.BackgroundKey = {}));
    var BackgroundKey = Lich.BackgroundKey;
    (function (AnimationKey) {
        AnimationKey[AnimationKey["FIREBALL_ANIMATION_KEY"] = 0] = "FIREBALL_ANIMATION_KEY";
        AnimationKey[AnimationKey["LICH_ANIMATION_KEY"] = 1] = "LICH_ANIMATION_KEY";
        AnimationKey[AnimationKey["CORPSE_ANIMATION_KEY"] = 2] = "CORPSE_ANIMATION_KEY";
        AnimationKey[AnimationKey["BOLT_ANIMATION_KEY"] = 3] = "BOLT_ANIMATION_KEY";
    })(Lich.AnimationKey || (Lich.AnimationKey = {}));
    var AnimationKey = Lich.AnimationKey;
    (function (SurfaceKey) {
        SurfaceKey[SurfaceKey["SRFC_DIRT_KEY"] = 0] = "SRFC_DIRT_KEY";
        SurfaceKey[SurfaceKey["SRFC_WOODWALL_KEY"] = 1] = "SRFC_WOODWALL_KEY";
        SurfaceKey[SurfaceKey["SRFC_KRYSTAL_KEY"] = 2] = "SRFC_KRYSTAL_KEY";
        SurfaceKey[SurfaceKey["SRFC_FLORITE_KEY"] = 3] = "SRFC_FLORITE_KEY";
        SurfaceKey[SurfaceKey["SRFC_BRICK_KEY"] = 4] = "SRFC_BRICK_KEY";
        SurfaceKey[SurfaceKey["SRFC_STRAW_KEY"] = 5] = "SRFC_STRAW_KEY";
    })(Lich.SurfaceKey || (Lich.SurfaceKey = {}));
    var SurfaceKey = Lich.SurfaceKey;
    (function (SurfaceBgrKey) {
        SurfaceBgrKey[SurfaceBgrKey["SRFC_BGR_BRICK_KEY"] = 0] = "SRFC_BGR_BRICK_KEY";
        SurfaceBgrKey[SurfaceBgrKey["SRFC_BGR_WOODWALL_KEY"] = 1] = "SRFC_BGR_WOODWALL_KEY";
        SurfaceBgrKey[SurfaceBgrKey["SRFC_BGR_STRAW_KEY"] = 2] = "SRFC_BGR_STRAW_KEY";
    })(Lich.SurfaceBgrKey || (Lich.SurfaceBgrKey = {}));
    var SurfaceBgrKey = Lich.SurfaceBgrKey;
    (function (MapObjectKey) {
        MapObjectKey[MapObjectKey["MAP_BERRY_KEY"] = 0] = "MAP_BERRY_KEY";
        MapObjectKey[MapObjectKey["MAP_BUSH_KEY"] = 1] = "MAP_BUSH_KEY";
        MapObjectKey[MapObjectKey["MAP_BUSH2_KEY"] = 2] = "MAP_BUSH2_KEY";
        MapObjectKey[MapObjectKey["MAP_GRASS_KEY"] = 3] = "MAP_GRASS_KEY";
        MapObjectKey[MapObjectKey["MAP_GRASS2_KEY"] = 4] = "MAP_GRASS2_KEY";
        MapObjectKey[MapObjectKey["MAP_GRASS3_KEY"] = 5] = "MAP_GRASS3_KEY";
        MapObjectKey[MapObjectKey["MAP_GRAVE_KEY"] = 6] = "MAP_GRAVE_KEY";
        MapObjectKey[MapObjectKey["MAP_MUSHROOM_KEY"] = 7] = "MAP_MUSHROOM_KEY";
        MapObjectKey[MapObjectKey["MAP_MUSHROOM2_KEY"] = 8] = "MAP_MUSHROOM2_KEY";
        MapObjectKey[MapObjectKey["MAP_MUSHROOM3_KEY"] = 9] = "MAP_MUSHROOM3_KEY";
        MapObjectKey[MapObjectKey["MAP_PLANT_KEY"] = 10] = "MAP_PLANT_KEY";
        MapObjectKey[MapObjectKey["MAP_PLANT2_KEY"] = 11] = "MAP_PLANT2_KEY";
        MapObjectKey[MapObjectKey["MAP_PLANT3_KEY"] = 12] = "MAP_PLANT3_KEY";
        MapObjectKey[MapObjectKey["MAP_PLANT4_KEY"] = 13] = "MAP_PLANT4_KEY";
        MapObjectKey[MapObjectKey["MAP_TREE_KEY"] = 14] = "MAP_TREE_KEY";
        MapObjectKey[MapObjectKey["MAP_TREE2_KEY"] = 15] = "MAP_TREE2_KEY";
        MapObjectKey[MapObjectKey["MAP_FLORITE_KEY"] = 16] = "MAP_FLORITE_KEY";
        MapObjectKey[MapObjectKey["MAP_CAMPFIRE_KEY"] = 17] = "MAP_CAMPFIRE_KEY";
        MapObjectKey[MapObjectKey["MAP_DOOR_CLOSED_KEY"] = 18] = "MAP_DOOR_CLOSED_KEY";
        MapObjectKey[MapObjectKey["MAP_DOOR_OPEN_KEY"] = 19] = "MAP_DOOR_OPEN_KEY";
        MapObjectKey[MapObjectKey["MAP_DOOR_CLOSED2_KEY"] = 20] = "MAP_DOOR_CLOSED2_KEY";
        MapObjectKey[MapObjectKey["MAP_DOOR_OPEN2_KEY"] = 21] = "MAP_DOOR_OPEN2_KEY";
    })(Lich.MapObjectKey || (Lich.MapObjectKey = {}));
    var MapObjectKey = Lich.MapObjectKey;
    (function (InventoryKey) {
        InventoryKey[InventoryKey["INV_BERRY_KEY"] = 0] = "INV_BERRY_KEY";
        InventoryKey[InventoryKey["INV_BONES_KEY"] = 1] = "INV_BONES_KEY";
        InventoryKey[InventoryKey["INV_WOOD_KEY"] = 2] = "INV_WOOD_KEY";
        InventoryKey[InventoryKey["INV_STRAW_KEY"] = 3] = "INV_STRAW_KEY";
        InventoryKey[InventoryKey["INV_MUSHROOM_KEY"] = 4] = "INV_MUSHROOM_KEY";
        InventoryKey[InventoryKey["INV_MUSHROOM2_KEY"] = 5] = "INV_MUSHROOM2_KEY";
        InventoryKey[InventoryKey["INV_MUSHROOM3_KEY"] = 6] = "INV_MUSHROOM3_KEY";
        InventoryKey[InventoryKey["INV_PLANT_KEY"] = 7] = "INV_PLANT_KEY";
        InventoryKey[InventoryKey["INV_PLANT2_KEY"] = 8] = "INV_PLANT2_KEY";
        InventoryKey[InventoryKey["INV_PLANT3_KEY"] = 9] = "INV_PLANT3_KEY";
        InventoryKey[InventoryKey["INV_PLANT4_KEY"] = 10] = "INV_PLANT4_KEY";
        InventoryKey[InventoryKey["INV_DIRT_KEY"] = 11] = "INV_DIRT_KEY";
        InventoryKey[InventoryKey["INV_KRYSTAL_KEY"] = 12] = "INV_KRYSTAL_KEY";
        InventoryKey[InventoryKey["INV_FLORITE_KEY"] = 13] = "INV_FLORITE_KEY";
        InventoryKey[InventoryKey["INV_CAMPFIRE_KEY"] = 14] = "INV_CAMPFIRE_KEY";
        InventoryKey[InventoryKey["INV_DOOR_KEY"] = 15] = "INV_DOOR_KEY";
        InventoryKey[InventoryKey["INV_BRICKWALL_KEY"] = 16] = "INV_BRICKWALL_KEY";
        InventoryKey[InventoryKey["INV_WOODWALL_KEY"] = 17] = "INV_WOODWALL_KEY";
    })(Lich.InventoryKey || (Lich.InventoryKey = {}));
    var InventoryKey = Lich.InventoryKey;
    (function (UIGFXKey) {
        UIGFXKey[UIGFXKey["PLAYER_ICON_KEY"] = 0] = "PLAYER_ICON_KEY";
        // misc.
        UIGFXKey[UIGFXKey["SKULL_KEY"] = 1] = "SKULL_KEY";
        UIGFXKey[UIGFXKey["HELMET_KEY"] = 2] = "HELMET_KEY";
        UIGFXKey[UIGFXKey["TORSO_KEY"] = 3] = "TORSO_KEY";
        UIGFXKey[UIGFXKey["GAUNTLET_KEY"] = 4] = "GAUNTLET_KEY";
        // buttons
        UIGFXKey[UIGFXKey["UI_SOUND_KEY"] = 5] = "UI_SOUND_KEY";
        UIGFXKey[UIGFXKey["UI_UP_KEY"] = 6] = "UI_UP_KEY";
        UIGFXKey[UIGFXKey["UI_DOWN_KEY"] = 7] = "UI_DOWN_KEY";
        UIGFXKey[UIGFXKey["UI_LEFT_KEY"] = 8] = "UI_LEFT_KEY";
        UIGFXKey[UIGFXKey["UI_RIGHT_KEY"] = 9] = "UI_RIGHT_KEY";
        UIGFXKey[UIGFXKey["UI_CRAFT_KEY"] = 10] = "UI_CRAFT_KEY";
    })(Lich.UIGFXKey || (Lich.UIGFXKey = {}));
    var UIGFXKey = Lich.UIGFXKey;
    (function (SpellKey) {
        SpellKey[SpellKey["SPELL_PLACE_KEY"] = 0] = "SPELL_PLACE_KEY";
        SpellKey[SpellKey["SPELL_PLACE_BGR_KEY"] = 1] = "SPELL_PLACE_BGR_KEY";
        SpellKey[SpellKey["SPELL_DIG_KEY"] = 2] = "SPELL_DIG_KEY";
        SpellKey[SpellKey["SPELL_DIG_BGR_KEY"] = 3] = "SPELL_DIG_BGR_KEY";
        SpellKey[SpellKey["SPELL_FIREBALL_KEY"] = 4] = "SPELL_FIREBALL_KEY";
        SpellKey[SpellKey["SPELL_BOLT_KEY"] = 5] = "SPELL_BOLT_KEY";
        SpellKey[SpellKey["SPELL_ENEMY_KEY"] = 6] = "SPELL_ENEMY_KEY";
        // RMB click interakce s objekty
        SpellKey[SpellKey["SPELL_INTERACT_KEY"] = 7] = "SPELL_INTERACT_KEY";
    })(Lich.SpellKey || (Lich.SpellKey = {}));
    var SpellKey = Lich.SpellKey;
    (function (SoundKey) {
        SoundKey[SoundKey["SND_FIREBALL_KEY"] = 0] = "SND_FIREBALL_KEY";
        SoundKey[SoundKey["SND_BURN_KEY"] = 1] = "SND_BURN_KEY";
        SoundKey[SoundKey["SND_BOLT_CAST"] = 2] = "SND_BOLT_CAST";
        SoundKey[SoundKey["SND_PICK_KEY"] = 3] = "SND_PICK_KEY";
        SoundKey[SoundKey["SND_PLACE_KEY"] = 4] = "SND_PLACE_KEY";
        SoundKey[SoundKey["SND_PICK_AXE_1_KEY"] = 5] = "SND_PICK_AXE_1_KEY";
        SoundKey[SoundKey["SND_PICK_AXE_2_KEY"] = 6] = "SND_PICK_AXE_2_KEY";
        SoundKey[SoundKey["SND_PICK_AXE_3_KEY"] = 7] = "SND_PICK_AXE_3_KEY";
        SoundKey[SoundKey["SND_BONECRACK_KEY"] = 8] = "SND_BONECRACK_KEY";
        SoundKey[SoundKey["SND_SKELETON_DIE_KEY"] = 9] = "SND_SKELETON_DIE_KEY";
        SoundKey[SoundKey["SND_SPAWN_KEY"] = 10] = "SND_SPAWN_KEY";
        SoundKey[SoundKey["SND_DOOR_OPEN_KEY"] = 11] = "SND_DOOR_OPEN_KEY";
        SoundKey[SoundKey["SND_DOOR_CLOSE_KEY"] = 12] = "SND_DOOR_CLOSE_KEY";
        SoundKey[SoundKey["SND_CRAFT_KEY"] = 13] = "SND_CRAFT_KEY";
        SoundKey[SoundKey["SND_CLICK_KEY"] = 14] = "SND_CLICK_KEY";
    })(Lich.SoundKey || (Lich.SoundKey = {}));
    var SoundKey = Lich.SoundKey;
    (function (MusicKey) {
        MusicKey[MusicKey["MSC_DIRT_THEME_KEY"] = 0] = "MSC_DIRT_THEME_KEY";
        MusicKey[MusicKey["MSC_BUILD_THEME_KEY"] = 1] = "MSC_BUILD_THEME_KEY";
        MusicKey[MusicKey["MSC_BOSS_THEME_KEY"] = 2] = "MSC_BOSS_THEME_KEY";
        MusicKey[MusicKey["MSC_KRYSTAL_THEME_KEY"] = 3] = "MSC_KRYSTAL_THEME_KEY";
        MusicKey[MusicKey["MSC_FLOOD_THEME_KEY"] = 4] = "MSC_FLOOD_THEME_KEY";
        MusicKey[MusicKey["MSC_LAVA_THEME_KEY"] = 5] = "MSC_LAVA_THEME_KEY";
    })(Lich.MusicKey || (Lich.MusicKey = {}));
    var MusicKey = Lich.MusicKey;
    var Resources = (function () {
        function Resources(game, callback) {
            /**
             * DEFINICE
             */
            // definice povrchů a objektů
            this.mapSurfaceDefs = new Array();
            this.mapSurfacesBgrDefs = new Array();
            this.mapObjectDefs = new Array();
            this.mapSurfacesFreqPool = new Array();
            this.mapObjectDefsFreqPool = new Array();
            // definice inv položek
            this.invObjectDefs = new Array();
            // definice spells
            this.spellDefs = new Lich.Table();
            this.interactSpellDef = new Lich.MapObjectsInteractionSpellDef();
            // definice receptů
            /*
             * Sprite indexy
             */
            this.surfaceIndex = new Lich.SurfaceIndex();
            this.surfaceBgrIndex = new Lich.SurfaceBgrIndex();
            var self = this;
            var manifest = [
                /**
                 * IMAGES
                 */
                // spells
                new Load("images/ui/dig_spell.png", SpellKey[SpellKey.SPELL_DIG_KEY]),
                new Load("images/ui/dig_bgr_spell.png", SpellKey[SpellKey.SPELL_DIG_BGR_KEY]),
                new Load("images/ui/fireball_spell.png", SpellKey[SpellKey.SPELL_FIREBALL_KEY]),
                new Load("images/ui/place_spell.png", SpellKey[SpellKey.SPELL_PLACE_KEY]),
                new Load("images/ui/place_bgr_spell.png", SpellKey[SpellKey.SPELL_PLACE_BGR_KEY]),
                new Load("images/ui/bolt_spell.png", SpellKey[SpellKey.SPELL_BOLT_KEY]),
                new Load("images/ui/enemy_spell.png", SpellKey[SpellKey.SPELL_ENEMY_KEY]),
                // inventory
                new Load("images/ui/inventory/inv_bones.png", InventoryKey[InventoryKey.INV_BONES_KEY]),
                new Load("images/ui/inventory/inv_berry.png", InventoryKey[InventoryKey.INV_BERRY_KEY]),
                new Load("images/ui/inventory/inv_mushroom.png", InventoryKey[InventoryKey.INV_MUSHROOM_KEY]),
                new Load("images/ui/inventory/inv_mushroom2.png", InventoryKey[InventoryKey.INV_MUSHROOM2_KEY]),
                new Load("images/ui/inventory/inv_mushroom3.png", InventoryKey[InventoryKey.INV_MUSHROOM3_KEY]),
                new Load("images/ui/inventory/inv_plant.png", InventoryKey[InventoryKey.INV_PLANT_KEY]),
                new Load("images/ui/inventory/inv_plant2.png", InventoryKey[InventoryKey.INV_PLANT2_KEY]),
                new Load("images/ui/inventory/inv_plant3.png", InventoryKey[InventoryKey.INV_PLANT3_KEY]),
                new Load("images/ui/inventory/inv_plant4.png", InventoryKey[InventoryKey.INV_PLANT4_KEY]),
                new Load("images/ui/inventory/inv_straw.png", InventoryKey[InventoryKey.INV_STRAW_KEY]),
                new Load("images/ui/inventory/inv_wood.png", InventoryKey[InventoryKey.INV_WOOD_KEY]),
                new Load("images/ui/inventory/inv_dirt.png", InventoryKey[InventoryKey.INV_DIRT_KEY]),
                new Load("images/ui/inventory/inv_krystals.png", InventoryKey[InventoryKey.INV_KRYSTAL_KEY]),
                new Load("images/ui/inventory/inv_florite.png", InventoryKey[InventoryKey.INV_FLORITE_KEY]),
                new Load("images/ui/inventory/inv_campfire.png", InventoryKey[InventoryKey.INV_CAMPFIRE_KEY]),
                new Load("images/ui/inventory/inv_door.png", InventoryKey[InventoryKey.INV_DOOR_KEY]),
                new Load("images/ui/inventory/inv_brick.png", InventoryKey[InventoryKey.INV_BRICKWALL_KEY]),
                new Load("images/ui/inventory/inv_woodwall.png", InventoryKey[InventoryKey.INV_WOODWALL_KEY]),
                // characters
                new Load("images/characters/lich_animation.png", AnimationKey[AnimationKey.LICH_ANIMATION_KEY]),
                new Load("images/characters/corpse_animation.png", AnimationKey[AnimationKey.CORPSE_ANIMATION_KEY]),
                // gfx animations
                new Load("images/effects/blast_animation.png", AnimationKey[AnimationKey.FIREBALL_ANIMATION_KEY]),
                new Load("images/effects/bolt_animation.png", AnimationKey[AnimationKey.BOLT_ANIMATION_KEY]),
                // surfaces
                new Load("images/surfaces/dirt.png", SurfaceKey[SurfaceKey.SRFC_DIRT_KEY]),
                new Load("images/surfaces/woodwall.png", SurfaceKey[SurfaceKey.SRFC_WOODWALL_KEY]),
                new Load("images/surfaces/krystals.png", SurfaceKey[SurfaceKey.SRFC_KRYSTAL_KEY]),
                new Load("images/surfaces/florite.png", SurfaceKey[SurfaceKey.SRFC_FLORITE_KEY]),
                new Load("images/surfaces/brick.png", SurfaceKey[SurfaceKey.SRFC_BRICK_KEY]),
                new Load("images/surfaces/straw.png", SurfaceKey[SurfaceKey.SRFC_STRAW_KEY]),
                // surface bacgrounds
                new Load("images/surfaces/woodwall_bgr.png", SurfaceBgrKey[SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY]),
                new Load("images/surfaces/brick_bgr.png", SurfaceBgrKey[SurfaceBgrKey.SRFC_BGR_BRICK_KEY]),
                new Load("images/surfaces/straw_bgr.png", SurfaceBgrKey[SurfaceBgrKey.SRFC_BGR_STRAW_KEY]),
                // objects
                new Load("images/parts/berry.png", MapObjectKey[MapObjectKey.MAP_BERRY_KEY]),
                new Load("images/parts/bush.png", MapObjectKey[MapObjectKey.MAP_BUSH_KEY]),
                new Load("images/parts/bush2.png", MapObjectKey[MapObjectKey.MAP_BUSH2_KEY]),
                new Load("images/parts/grass.png", MapObjectKey[MapObjectKey.MAP_GRASS_KEY]),
                new Load("images/parts/grass2.png", MapObjectKey[MapObjectKey.MAP_GRASS2_KEY]),
                new Load("images/parts/grass3.png", MapObjectKey[MapObjectKey.MAP_GRASS3_KEY]),
                new Load("images/parts/grave.png", MapObjectKey[MapObjectKey.MAP_GRAVE_KEY]),
                new Load("images/parts/mushroom.png", MapObjectKey[MapObjectKey.MAP_MUSHROOM_KEY]),
                new Load("images/parts/mushroom2.png", MapObjectKey[MapObjectKey.MAP_MUSHROOM2_KEY]),
                new Load("images/parts/mushroom3.png", MapObjectKey[MapObjectKey.MAP_MUSHROOM3_KEY]),
                new Load("images/parts/plant.png", MapObjectKey[MapObjectKey.MAP_PLANT_KEY]),
                new Load("images/parts/plant2.png", MapObjectKey[MapObjectKey.MAP_PLANT2_KEY]),
                new Load("images/parts/plant3.png", MapObjectKey[MapObjectKey.MAP_PLANT3_KEY]),
                new Load("images/parts/plant4.png", MapObjectKey[MapObjectKey.MAP_PLANT4_KEY]),
                new Load("images/parts/tree.png", MapObjectKey[MapObjectKey.MAP_TREE_KEY]),
                new Load("images/parts/tree2.png", MapObjectKey[MapObjectKey.MAP_TREE2_KEY]),
                new Load("images/parts/florite.png", MapObjectKey[MapObjectKey.MAP_FLORITE_KEY]),
                new Load("images/parts/campfire.png", MapObjectKey[MapObjectKey.MAP_CAMPFIRE_KEY]),
                new Load("images/parts/door_closed.png", MapObjectKey[MapObjectKey.MAP_DOOR_CLOSED_KEY]),
                new Load("images/parts/door_open.png", MapObjectKey[MapObjectKey.MAP_DOOR_OPEN_KEY]),
                new Load("images/parts/door_closed2.png", MapObjectKey[MapObjectKey.MAP_DOOR_CLOSED2_KEY]),
                new Load("images/parts/door_open2.png", MapObjectKey[MapObjectKey.MAP_DOOR_OPEN2_KEY]),
                // misc
                new Load("images/characters/player_icon.png", UIGFXKey[UIGFXKey.PLAYER_ICON_KEY]),
                new Load("images/ui/skull.png", UIGFXKey[UIGFXKey.SKULL_KEY]),
                new Load("images/ui/sound.png", UIGFXKey[UIGFXKey.UI_SOUND_KEY]),
                new Load("images/ui/up.png", UIGFXKey[UIGFXKey.UI_UP_KEY]),
                new Load("images/ui/down.png", UIGFXKey[UIGFXKey.UI_DOWN_KEY]),
                new Load("images/ui/left.png", UIGFXKey[UIGFXKey.UI_LEFT_KEY]),
                new Load("images/ui/right.png", UIGFXKey[UIGFXKey.UI_RIGHT_KEY]),
                new Load("images/ui/craft.png", UIGFXKey[UIGFXKey.UI_CRAFT_KEY]),
                // armor
                new Load("images/armor/helmet.png", UIGFXKey[UIGFXKey.HELMET_KEY]),
                new Load("images/armor/torso.png", UIGFXKey[UIGFXKey.TORSO_KEY]),
                new Load("images/armor/gauntlet.png", UIGFXKey[UIGFXKey.GAUNTLET_KEY]),
                // background
                new Load("images/background/sky.png", BackgroundKey[BackgroundKey.SKY_KEY]),
                new Load("images/background/far_mountain.png", BackgroundKey[BackgroundKey.FAR_MOUNTAIN_KEY]),
                new Load("images/background/mountain.png", BackgroundKey[BackgroundKey.MOUNTAIN_KEY]),
                new Load("images/background/far_woodland.png", BackgroundKey[BackgroundKey.FAR_HILL_KEY]),
                new Load("images/background/woodland.png", BackgroundKey[BackgroundKey.HILL_KEY]),
                new Load("images/background/dirt_back.png", BackgroundKey[BackgroundKey.DIRTBACK_KEY]),
                new Load("images/background/darkness.png", BackgroundKey[BackgroundKey.DARKNESS_KEY]),
                new Load("images/background/dirt_back_start.png", BackgroundKey[BackgroundKey.DIRT_BACK_START_KEY]),
                /**
                 * SOUNDS AND MUSIC
                 */
                // sounds
                new Load("sound/334234__liamg-sfx__fireball-cast-1.ogg", SoundKey[SoundKey.SND_FIREBALL_KEY]),
                new Load("sound/113111__satrebor__pick.ogg", SoundKey[SoundKey.SND_PICK_KEY]),
                new Load("sound/248116__robinhood76__05224-fireball-whoosh.ogg", SoundKey[SoundKey.SND_BURN_KEY]),
                new Load("sound/bolt_cast.ogg", SoundKey[SoundKey.SND_BOLT_CAST]),
                new Load("sound/place.ogg", SoundKey[SoundKey.SND_PLACE_KEY]),
                new Load("sound/pick_axe1.ogg", SoundKey[SoundKey.SND_PICK_AXE_1_KEY]),
                new Load("sound/pick_axe2.ogg", SoundKey[SoundKey.SND_PICK_AXE_2_KEY]),
                new Load("sound/pick_axe3.ogg", SoundKey[SoundKey.SND_PICK_AXE_3_KEY]),
                new Load("sound/bonecrack.ogg", SoundKey[SoundKey.SND_BONECRACK_KEY]),
                new Load("sound/skeleton_die.ogg", SoundKey[SoundKey.SND_SKELETON_DIE_KEY]),
                new Load("sound/252083__pepingrillin__spawn.ogg", SoundKey[SoundKey.SND_SPAWN_KEY]),
                new Load("sound/door_open.ogg", SoundKey[SoundKey.SND_DOOR_OPEN_KEY]),
                new Load("sound/door_close.ogg", SoundKey[SoundKey.SND_DOOR_CLOSE_KEY]),
                new Load("sound/craft.ogg", SoundKey[SoundKey.SND_CRAFT_KEY]),
                new Load("sound/click.ogg", SoundKey[SoundKey.SND_CLICK_KEY]),
                // music
                new Load("music/Dirt_2.ogg", MusicKey[MusicKey.MSC_DIRT_THEME_KEY]),
            ];
            (function () {
                for (var i = 1; i <= Resources.CLOUDS_NUMBER; i++) {
                    manifest.push(new Load("images/background/cloud" + i + ".png", BackgroundKey[BackgroundKey.CLOUD_KEY] + i));
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
            /**
             * Definice
             */
            /**
             * POVRCHY
             */
            // Definice mapových povrchů
            var registerSurfaceDefs = function (mapSurface) {
                self.mapSurfaceDefs[mapSurface.mapKey] = mapSurface;
                // Definice indexových počátků pro typy povrchu
                self.surfaceIndex.insert(mapSurface.mapKey);
            };
            // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
            // jsou dle frekvence usazovány jiné povrchy
            registerSurfaceDefs(new Lich.MapSurfaceDefinition(SurfaceKey.SRFC_DIRT_KEY, InventoryKey.INV_DIRT_KEY, 1, 0));
            registerSurfaceDefs(new Lich.MapSurfaceDefinition(SurfaceKey.SRFC_WOODWALL_KEY, InventoryKey.INV_WOODWALL_KEY, 1, 0));
            registerSurfaceDefs(new Lich.MapSurfaceDefinition(SurfaceKey.SRFC_KRYSTAL_KEY, InventoryKey.INV_KRYSTAL_KEY, 1, 1));
            registerSurfaceDefs(new Lich.MapSurfaceDefinition(SurfaceKey.SRFC_FLORITE_KEY, InventoryKey.INV_FLORITE_KEY, 1, 1));
            registerSurfaceDefs(new Lich.MapSurfaceDefinition(SurfaceKey.SRFC_BRICK_KEY, InventoryKey.INV_BRICKWALL_KEY, 1, 0));
            registerSurfaceDefs(new Lich.MapSurfaceDefinition(SurfaceKey.SRFC_STRAW_KEY, InventoryKey.INV_STRAW_KEY, 1, 0));
            (function () {
                // vytvoř frekvenční pool pro povrchy
                for (var _i = 0, _a = self.mapSurfaceDefs; _i < _a.length; _i++) {
                    var item = _a[_i];
                    // vlož index objektu tolikrát, kolik je jeho frekvenc
                    for (var i = 0; i < item.freq; i++) {
                        self.mapSurfacesFreqPool.push(item.mapKey);
                    }
                }
            })();
            /**
             * STĚNY POVRCHŮ
             */
            // Definice mapových stěn povrchů
            var registerSurfaceBgrDefs = function (mapSurface) {
                self.mapSurfacesBgrDefs[mapSurface.mapKey] = mapSurface;
                // Definice indexových počátků pro typy povrchu
                self.surfaceBgrIndex.insert(mapSurface.mapKey);
            };
            registerSurfaceBgrDefs(new Lich.MapSurfaceBgrDefinition(SurfaceBgrKey.SRFC_BGR_BRICK_KEY, InventoryKey.INV_BRICKWALL_KEY, 1));
            registerSurfaceBgrDefs(new Lich.MapSurfaceBgrDefinition(SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY, InventoryKey.INV_WOODWALL_KEY, 1));
            registerSurfaceBgrDefs(new Lich.MapSurfaceBgrDefinition(SurfaceBgrKey.SRFC_BGR_STRAW_KEY, InventoryKey.INV_STRAW_KEY, 1));
            /**
             * OBJEKTY
             */
            // Definice mapových objektů
            var registerObjectDefs = function (mapObj) {
                self.mapObjectDefs[mapObj.mapKey] = mapObj;
            };
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_GRAVE_KEY, 6, 3, InventoryKey.INV_BONES_KEY, 5, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_BERRY_KEY, 2, 2, InventoryKey.INV_BERRY_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_BUSH_KEY, 2, 2, null, 0, 10));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_BUSH2_KEY, 2, 2, null, 0, 10));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_GRASS_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 20));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_GRASS2_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 20));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_GRASS3_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 20));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_TREE_KEY, 4, 9, InventoryKey.INV_WOOD_KEY, 5, 10));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_TREE2_KEY, 8, 15, InventoryKey.INV_WOOD_KEY, 10, 20));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_MUSHROOM_KEY, 2, 2, InventoryKey.INV_MUSHROOM_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_MUSHROOM2_KEY, 2, 2, InventoryKey.INV_MUSHROOM2_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_MUSHROOM3_KEY, 2, 2, InventoryKey.INV_MUSHROOM3_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_PLANT_KEY, 2, 2, InventoryKey.INV_PLANT_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_PLANT2_KEY, 2, 2, InventoryKey.INV_PLANT2_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_PLANT3_KEY, 2, 2, InventoryKey.INV_PLANT3_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_PLANT4_KEY, 2, 2, InventoryKey.INV_PLANT4_KEY, 1, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_FLORITE_KEY, 2, 2, InventoryKey.INV_FLORITE_KEY, 5, 1));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_CAMPFIRE_KEY, 2, 2, InventoryKey.INV_CAMPFIRE_KEY, 1, 1).setFrames(4));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0, function (rx, ry, obj, objType) {
                game.world.render.digObject(rx, ry, false);
                game.world.render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED_KEY]);
                Lich.Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
            }));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0, function (rx, ry, obj, objType) {
                game.world.render.digObject(rx, ry, false);
                game.world.render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY]);
                Lich.Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
            }).setCollision(true));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN2_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0, function (rx, ry, obj, objType) {
                game.world.render.digObject(rx, ry, false);
                game.world.render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED2_KEY]);
                Lich.Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
            }));
            registerObjectDefs(new Lich.MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED2_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0, function (rx, ry, obj, objType) {
                game.world.render.digObject(rx, ry, false);
                game.world.render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]);
                Lich.Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
            }).setCollision(true));
            (function () {
                // vytvoř frekvenční pool pro objekty 
                for (var _i = 0, _a = self.mapObjectDefs; _i < _a.length; _i++) {
                    var item = _a[_i];
                    // vlož index objektu tolikrát, kolik je jeho frekvenc
                    for (var i = 0; i < item.freq; i++) {
                        self.mapObjectDefsFreqPool.push(item.mapKey);
                    }
                }
            })();
            /**
             * INVENTÁŘ
             */
            // Definice inventárních objektů
            var registerInvObjectDefs = function (invObj) {
                self.invObjectDefs[invObj.invKey] = invObj;
            };
            // usaditelných jako objekt
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_MUSHROOM_KEY, self.mapObjectDefs[MapObjectKey.MAP_MUSHROOM_KEY]));
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_CAMPFIRE_KEY, self.mapObjectDefs[MapObjectKey.MAP_CAMPFIRE_KEY]).setFrames(4));
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_DOOR_KEY, self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]));
            // usaditelných jako povrch
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_DIRT_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_DIRT_KEY]));
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_WOODWALL_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_WOODWALL_KEY])
                .setBackground(self.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY]));
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_BRICKWALL_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_BRICK_KEY])
                .setBackground(self.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_BRICK_KEY]));
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_STRAW_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_STRAW_KEY])
                .setBackground(self.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_STRAW_KEY]));
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_KRYSTAL_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_KRYSTAL_KEY]));
            registerInvObjectDefs(new Lich.InvObjDefinition(InventoryKey.INV_FLORITE_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_FLORITE_KEY]));
            /**
             * SPELLS
             */
            // Definice spells
            var registerSpellDefs = function (spell) {
                self.spellDefs.insert(SpellKey[spell.key], spell);
            };
            registerSpellDefs(new Lich.FireballSpellDef());
            registerSpellDefs(new Lich.DigSpellDef());
            registerSpellDefs(new Lich.DigBgrSpellDef());
            registerSpellDefs(new Lich.PlaceSpellDef());
            registerSpellDefs(new Lich.PlaceBgrSpellDef());
            registerSpellDefs(new Lich.BoltSpellDef());
            registerSpellDefs(new Lich.EnemySpellDef());
        }
        Resources.getInstance = function (game, callback) {
            if (!Resources.INSTANCE) {
                Resources.INSTANCE = new Resources(game, callback);
            }
            return Resources.INSTANCE;
        };
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
                "images": [this.getImage(key)],
                "frames": frames,
                "animations": { "idle": [0, count - 1, "idle", Resources.SPRITE_FRAMERATE] }
            });
            var sprite = new createjs.Sprite(sheet, "idle");
            sprite.gotoAndPlay("idle");
            return sprite;
        };
        Resources.prototype.getSpriteSheet = function (key, framesCount) {
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
                    "idle": [0, framesCount - 1, "idle", Resources.SPRITE_FRAMERATE]
                }
            });
            return sheet;
        };
        Resources.prototype.getSprite = function (key, framesCount) {
            var self = this;
            var sprite = new createjs.Sprite(self.getSpriteSheet(key, framesCount), "idle");
            sprite.gotoAndPlay("idle");
            return sprite;
        };
        ;
        Resources.FONT = "expressway";
        Resources.OUTLINE_COLOR = "#000";
        Resources.TEXT_COLOR = "#FF0";
        Resources.DEBUG_TEXT_COLOR = "#FF0";
        Resources.REACH_TILES_RADIUS = 10;
        Resources.SPRITE_FRAMERATE = 0.2;
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
        return Resources;
    }());
    Lich.Resources = Resources;
})(Lich || (Lich = {}));
