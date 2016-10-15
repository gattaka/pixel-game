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

    export enum BackgroundKey {
        DIRT_BACK_START_KEY,
        DIRT_BACK_KEY,
        SKY_KEY,
        FAR_MOUNTAIN_KEY,
        MOUNTAIN_KEY,
        FAR_HILL_KEY,
        HILL_KEY,
        DIRTBACK_KEY,
        DARKNESS_KEY,
        CLOUD_KEY
    }

    export enum AnimationKey {
        METEOR_ANIMATION_KEY,
        FIREBALL_ANIMATION_KEY,
        LICH_ANIMATION_KEY,
        CORPSE_ANIMATION_KEY,
        BOLT_ANIMATION_KEY
    }

    export enum SurfaceKey {
        SRFC_DIRT_KEY,
        SRFC_WOODWALL_KEY,
        SRFC_KRYSTAL_KEY,
        SRFC_FLORITE_KEY,
        SRFC_BRICK_KEY,
        SRFC_STRAW_KEY,
        SRFC_ROOF_KEY,
        SRFC_IRON_KEY,
        SRFC_COAL_KEY,
        SRFC_ROCK_KEY
    }

    export enum SurfaceBgrKey {
        SRFC_BGR_BRICK_KEY,
        SRFC_BGR_WOODWALL_KEY,
        SRFC_BGR_STRAW_KEY,
        SRFC_BGR_ROOF_KEY
    }

    export enum MapObjectKey {
        MAP_BERRY_KEY,
        MAP_BUSH_KEY,
        MAP_BUSH2_KEY,
        MAP_GRASS_KEY,
        MAP_GRASS2_KEY,
        MAP_GRASS3_KEY,
        MAP_GRAVE_KEY,
        MAP_MUSHROOM_KEY,
        MAP_MUSHROOM2_KEY,
        MAP_MUSHROOM3_KEY,
        MAP_PLANT_KEY,
        MAP_PLANT2_KEY,
        MAP_PLANT3_KEY,
        MAP_PLANT4_KEY,
        MAP_TREE_KEY,
        MAP_TREE2_KEY,
        MAP_TREE3_KEY,
        MAP_FLORITE_KEY,
        MAP_CAMPFIRE_KEY,
        MAP_DOOR_CLOSED_KEY,
        MAP_DOOR_OPEN_KEY,
        MAP_DOOR_CLOSED2_KEY,
        MAP_DOOR_OPEN2_KEY
    }

    export enum InventoryKey {
        INV_BERRY_KEY,
        INV_BONES_KEY,
        INV_WOOD_KEY,
        INV_STRAW_KEY,
        INV_MUSHROOM_KEY,
        INV_MUSHROOM2_KEY,
        INV_MUSHROOM3_KEY,
        INV_PLANT_KEY,
        INV_PLANT2_KEY,
        INV_PLANT3_KEY,
        INV_PLANT4_KEY,
        INV_DIRT_KEY,
        INV_KRYSTAL_KEY,
        INV_FLORITE_KEY,
        INV_CAMPFIRE_KEY,
        INV_DOOR_KEY,
        INV_BRICKWALL_KEY,
        INV_WOODWALL_KEY,
        INV_ROOF_KEY,
        INV_IRON_KEY,
        INV_COAL_KEY,
        INV_ROCK_KEY
    }

    export enum UIGFXKey {
        PLAYER_ICON_KEY,
        // misc.
        SKULL_KEY,
        HELMET_KEY,
        TORSO_KEY,
        GAUNTLET_KEY,
        // buttons
        UI_SOUND_KEY,
        UI_UP_KEY,
        UI_DOWN_KEY,
        UI_LEFT_KEY,
        UI_RIGHT_KEY,
        UI_CRAFT_KEY,
        UI_SAVE_KEY,
        UI_LOAD_KEY,
        UI_NEW_WORLD_KEY
    }

    export enum SpellKey {
        SPELL_PLACE_KEY,
        SPELL_PLACE_BGR_KEY,
        SPELL_DIG_KEY,
        SPELL_DIG_BGR_KEY,
        SPELL_FIREBALL_KEY,
        SPELL_METEOR_KEY,
        SPELL_BOLT_KEY,
        SPELL_ENEMY_KEY,

        // RMB click interakce s objekty
        SPELL_INTERACT_KEY
    }

    export enum SoundKey {
        SND_FIREBALL_KEY,
        SND_BURN_KEY,
        SND_METEOR_FALL_KEY,
        SND_METEOR_HIT_KEY,
        SND_BOLT_CAST,
        SND_PICK_KEY,
        SND_PLACE_KEY,
        SND_PICK_AXE_1_KEY,
        SND_PICK_AXE_2_KEY,
        SND_PICK_AXE_3_KEY,
        SND_BONECRACK_KEY,
        SND_SKELETON_DIE_KEY,
        SND_SPAWN_KEY,
        SND_DOOR_OPEN_KEY,
        SND_DOOR_CLOSE_KEY,
        SND_CRAFT_KEY,
        SND_CLICK_KEY
    }

    export enum MusicKey {
        MSC_DIRT_THEME_KEY,
        MSC_BUILD_THEME_KEY,
        MSC_BOSS_THEME_KEY,
        MSC_KRYSTAL_THEME_KEY,
        MSC_FLOOD_THEME_KEY,
        MSC_LAVA_THEME_KEY
    }

    export interface HasCooldown {
        cooldown: number;
    }

    export class FreqPool<T extends HasCooldown> {
        cooldowns = new Array<number>();
        palette = new Array<T>();
        yield(accept: (item: T) => boolean) {
            // sniž čekání položek na použití
            this.cooldowns.forEach((x, idx, arr) => {
                if (x) {
                    arr[idx]--;
                }
            });
            let tries = 0;
            let tried = {}
            // vyber náhodně položku
            let randomIndex = () => {
                return Math.floor(Math.random() * this.palette.length);
            }
            let idx = randomIndex();
            do {
                if (this.cooldowns[idx] == 0) {
                    // pokud je položka připravena, zkus ji použít
                    let it = this.palette[idx];
                    if (accept(it)) {
                        this.cooldowns[idx] = it.cooldown;
                        return;
                    }
                }
                // nové losování
                // nemůžu se jenom posunout, protože by to tak mělo tendenci často losovat objekty,
                // které mají nízký cooldown (nebo se snadno usazují) a jsou první za objektem, 
                // který má velkým cooldown (nebo se špatně usazuje)  
                tries++;
                tried[idx] = true;
                idx = randomIndex();
                // pokud už byl vyzkoušen, posuň se
                // tady se posouvat už můžu, protože jde pouze o přeskočení již vyzkoušených objektů
                while (tried[idx] && tries != this.palette.length) {
                    idx = (idx + 1) % this.palette.length;
                    tries++;
                    tried[idx] = true;
                }
                // pokud jsem nevyzkoušel už všechny zkoušej           
            } while (tries != this.palette.length)
            return null;
        }
        insert(item: T) {
            this.palette.push(item);
            this.cooldowns.push(item.cooldown);
        }
    }

    export class Resources {

        private static INSTANCE: Resources;

        static FONT = "expressway";
        static OUTLINE_COLOR = "#000";
        static TEXT_COLOR = "#FF0";
        static DEBUG_TEXT_COLOR = "#FF0";

        static REACH_TILES_RADIUS = 10;

        static SPRITE_FRAMERATE = 0.2;

        // Jméno klíče, pod kterým bude v cookies uložen USER DB 
        // klíč záznamu jeho SAVE na serveru  
        static COOKIE_KEY = "LICH_ENGINE_COOKIE_USER_KEY";

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

        /**
         * DEFINICE
         */

        // definice povrchů a objektů
        public mapSurfaceDefs = new Array<MapSurfaceDefinition>();
        public mapSurfacesBgrDefs = new Array<MapSurfaceBgrDefinition>();
        public mapObjectDefs = new Array<MapObjDefinition>();
        public mapSurfacesFreqPool = new FreqPool<MapSurfaceDefinition>();
        public mapObjectDefsFreqPool = new FreqPool<MapObjDefinition>();

        // definice inv položek
        public invObjectDefs = new Array<InvObjDefinition>();

        // definice spells
        public spellDefs = new Table<SpellDefinition>();
        public interactSpellDef = new MapObjectsInteractionSpellDef();

        // definice receptů

        /*
         * Sprite indexy
         */
        public surfaceIndex = new SurfaceIndex();
        public surfaceBgrIndex = new SurfaceBgrIndex();

        private loader;
        private loaderDone: boolean = false;

        public isLoaderDone(): boolean { return this.loaderDone };

        public static getInstance() {
            if (!Resources.INSTANCE) {
                Resources.INSTANCE = new Resources();
            }
            return Resources.INSTANCE;
        }

        private constructor() {

            var self = this;
            var manifest = [
                /**
                 * IMAGES  
                 */
                // spells
                new Load("images/ui/dig_spell.png", SpellKey[SpellKey.SPELL_DIG_KEY]),
                new Load("images/ui/dig_bgr_spell.png", SpellKey[SpellKey.SPELL_DIG_BGR_KEY]),
                new Load("images/ui/fireball_spell.png", SpellKey[SpellKey.SPELL_FIREBALL_KEY]),
                new Load("images/ui/meteor_spell.png", SpellKey[SpellKey.SPELL_METEOR_KEY]),
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
                new Load("images/ui/inventory/inv_roof.png", InventoryKey[InventoryKey.INV_ROOF_KEY]),
                new Load("images/ui/inventory/inv_iron.png", InventoryKey[InventoryKey.INV_IRON_KEY]),
                new Load("images/ui/inventory/inv_coal.png", InventoryKey[InventoryKey.INV_COAL_KEY]),
                new Load("images/ui/inventory/inv_rock.png", InventoryKey[InventoryKey.INV_ROCK_KEY]),
                // characters
                new Load("images/characters/lich_animation.png", AnimationKey[AnimationKey.LICH_ANIMATION_KEY]),
                new Load("images/characters/corpse_animation.png", AnimationKey[AnimationKey.CORPSE_ANIMATION_KEY]),
                // gfx animations
                new Load("images/effects/meteor_animation.png", AnimationKey[AnimationKey.METEOR_ANIMATION_KEY]),
                new Load("images/effects/blast_animation.png", AnimationKey[AnimationKey.FIREBALL_ANIMATION_KEY]),
                new Load("images/effects/bolt_animation.png", AnimationKey[AnimationKey.BOLT_ANIMATION_KEY]),
                // surfaces
                new Load("images/surfaces/dirt.png", SurfaceKey[SurfaceKey.SRFC_DIRT_KEY]),
                new Load("images/surfaces/woodwall.png", SurfaceKey[SurfaceKey.SRFC_WOODWALL_KEY]),
                new Load("images/surfaces/krystals.png", SurfaceKey[SurfaceKey.SRFC_KRYSTAL_KEY]),
                new Load("images/surfaces/florite.png", SurfaceKey[SurfaceKey.SRFC_FLORITE_KEY]),
                new Load("images/surfaces/brick.png", SurfaceKey[SurfaceKey.SRFC_BRICK_KEY]),
                new Load("images/surfaces/straw.png", SurfaceKey[SurfaceKey.SRFC_STRAW_KEY]),
                new Load("images/surfaces/roof.png", SurfaceKey[SurfaceKey.SRFC_ROOF_KEY]),
                new Load("images/surfaces/iron.png", SurfaceKey[SurfaceKey.SRFC_IRON_KEY]),
                new Load("images/surfaces/coal.png", SurfaceKey[SurfaceKey.SRFC_COAL_KEY]),
                new Load("images/surfaces/rock.png", SurfaceKey[SurfaceKey.SRFC_ROCK_KEY]),
                // surface backgrounds
                new Load("images/surfaces/woodwall_bgr.png", SurfaceBgrKey[SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY]),
                new Load("images/surfaces/brick_bgr.png", SurfaceBgrKey[SurfaceBgrKey.SRFC_BGR_BRICK_KEY]),
                new Load("images/surfaces/straw_bgr.png", SurfaceBgrKey[SurfaceBgrKey.SRFC_BGR_STRAW_KEY]),
                new Load("images/surfaces/roof_bgr.png", SurfaceBgrKey[SurfaceBgrKey.SRFC_BGR_ROOF_KEY]),
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
                new Load("images/parts/tree3.png", MapObjectKey[MapObjectKey.MAP_TREE3_KEY]),
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
                new Load("images/ui/load.png", UIGFXKey[UIGFXKey.UI_LOAD_KEY]),
                new Load("images/ui/save.png", UIGFXKey[UIGFXKey.UI_SAVE_KEY]),
                new Load("images/ui/new_world.png", UIGFXKey[UIGFXKey.UI_NEW_WORLD_KEY]),
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
                new Load("sound/meteor_fall.ogg", SoundKey[SoundKey.SND_METEOR_FALL_KEY]),
                new Load("sound/meteor_hit.ogg", SoundKey[SoundKey.SND_METEOR_HIT_KEY]),
                // music
                new Load("music/Dirt_2.ogg", MusicKey[MusicKey.MSC_DIRT_THEME_KEY]),
                // pro rychlejší nahrávání (v ostré verzi bude odkomentováno)
                /*
                new Load("music/Building In Progress.ogg", MusicKey.MSC_BUILD_THEME_KEY),
                new Load("music/Boss 1.ogg", MusicKey.MSC_BOSS_THEME_KEY),
                new Load("music/Fight In Crystals.ogg", MusicKey.MSC_KRYSTAL_THEME_KEY),
                new Load("music/Flood.ogg", MusicKey.MSC_FLOOD_THEME_KEY),
                new Load("music/Lava.ogg", MusicKey.MSC_LAVA_THEME_KEY),
                */
            ];

            (function () {
                for (var i = 1; i <= Resources.CLOUDS_NUMBER; i++) {
                    manifest.push(new Load("images/background/cloud" + i + ".png", BackgroundKey[BackgroundKey.CLOUD_KEY] + i));
                }
            })();

            // nejprve font (nahrává se mimo loader)
            var config: WebFont.Config = {
                custom: {
                    families: ['expressway'],
                    urls: ['/css/fonts.css']
                },
            }
            WebFont.load(config);

            // pak loader 
            self.loader = new createjs.LoadQueue(false);
            createjs.Sound.alternateExtensions = ["mp3"];
            self.loader.installPlugin(createjs.Sound);
            self.loader.addEventListener("progress", function (event) {
                EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.LOAD_PROGRESS, event.loaded));
            });
            self.loader.addEventListener("filestart", function (event) {
                EventBus.getInstance().fireEvent(new StringEventPayload(EventType.LOAD_ITEM, event.item.src));
            });
            self.loader.addEventListener("complete", function () {
                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));
            });
            self.loader.loadManifest(manifest, true);

            /**
             * POVRCHY
             */

            // Definice mapových povrchů
            var registerSurfaceDefs = function (mapSurface: MapSurfaceDefinition) {
                self.mapSurfaceDefs[mapSurface.mapKey] = mapSurface;
                if (mapSurface.cooldown > 0) {
                    self.mapSurfacesFreqPool.insert(mapSurface);
                }
            };

            // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
            // jsou dle frekvence usazovány jiné povrchy
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_DIRT_KEY, InventoryKey.INV_DIRT_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_WOODWALL_KEY, InventoryKey.INV_WOODWALL_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_KRYSTAL_KEY, InventoryKey.INV_KRYSTAL_KEY, 1, 10).setDepth(50, 100));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_FLORITE_KEY, InventoryKey.INV_FLORITE_KEY, 1, 10).setDepth(70, 100));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_BRICK_KEY, InventoryKey.INV_BRICKWALL_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_STRAW_KEY, InventoryKey.INV_STRAW_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_KEY, InventoryKey.INV_ROOF_KEY, 1, 0));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_IRON_KEY, InventoryKey.INV_IRON_KEY, 1, 5).setDepth(5, 100));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_COAL_KEY, InventoryKey.INV_COAL_KEY, 1, 10).setDepth(10, 100));
            registerSurfaceDefs(new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_KEY, InventoryKey.INV_ROCK_KEY, 1, 1).setDepth(0, 100).setSize(2, 5));

            /**
             * STĚNY POVRCHŮ
             */

            // Definice mapových stěn povrchů
            var registerSurfaceBgrDefs = function (mapSurface: MapSurfaceBgrDefinition) {
                self.mapSurfacesBgrDefs[mapSurface.mapKey] = mapSurface;
            };

            registerSurfaceBgrDefs(new MapSurfaceBgrDefinition(SurfaceBgrKey.SRFC_BGR_BRICK_KEY, InventoryKey.INV_BRICKWALL_KEY, 1));
            registerSurfaceBgrDefs(new MapSurfaceBgrDefinition(SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY, InventoryKey.INV_WOODWALL_KEY, 1));
            registerSurfaceBgrDefs(new MapSurfaceBgrDefinition(SurfaceBgrKey.SRFC_BGR_STRAW_KEY, InventoryKey.INV_STRAW_KEY, 1));
            registerSurfaceBgrDefs(new MapSurfaceBgrDefinition(SurfaceBgrKey.SRFC_BGR_ROOF_KEY, InventoryKey.INV_ROOF_KEY, 1));

            /**
             * OBJEKTY
             */

            // Definice mapových objektů
            var registerObjectDefs = function (mapObj: MapObjDefinition) {
                self.mapObjectDefs[mapObj.mapKey] = mapObj;
                if (mapObj.cooldown > 0) {
                    self.mapObjectDefsFreqPool.insert(mapObj);
                }
            };

            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_GRAVE_KEY, 6, 3, InventoryKey.INV_BONES_KEY, 5, 160).setDepth(0, 5));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_BERRY_KEY, 2, 2, InventoryKey.INV_BERRY_KEY, 1, 100).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_BUSH_KEY, 2, 2, null, 0, 15).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_BUSH2_KEY, 2, 2, null, 0, 15).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_GRASS_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_GRASS2_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_GRASS3_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_TREE_KEY, 4, 9, InventoryKey.INV_WOOD_KEY, 5, 1).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_TREE2_KEY, 8, 15, InventoryKey.INV_WOOD_KEY, 10, 1).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_TREE3_KEY, 4, 7, InventoryKey.INV_WOOD_KEY, 10, 1).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_MUSHROOM_KEY, 2, 2, InventoryKey.INV_MUSHROOM_KEY, 1, 100).setDepth(5, 40));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_MUSHROOM2_KEY, 2, 2, InventoryKey.INV_MUSHROOM2_KEY, 1, 100).setDepth(5, 100));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_MUSHROOM3_KEY, 2, 2, InventoryKey.INV_MUSHROOM3_KEY, 1, 140).setDepth(5, 100));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_PLANT_KEY, 2, 2, InventoryKey.INV_PLANT_KEY, 1, 60).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_PLANT2_KEY, 2, 2, InventoryKey.INV_PLANT2_KEY, 1, 60).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_PLANT3_KEY, 2, 2, InventoryKey.INV_PLANT3_KEY, 1, 60).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_PLANT4_KEY, 2, 2, InventoryKey.INV_PLANT4_KEY, 1, 60).setDepth(0, 10));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_FLORITE_KEY, 2, 2, InventoryKey.INV_FLORITE_KEY, 5, 100).setDepth(70, 100));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_CAMPFIRE_KEY, 2, 2, InventoryKey.INV_CAMPFIRE_KEY, 1, 0).setFrames(4));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
                function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                    game.getWorld().render.digObject(rx, ry, false);
                    game.getWorld().render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED_KEY]);
                    Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
                }));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
                function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                    game.getWorld().render.digObject(rx, ry, false);
                    game.getWorld().render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY]);
                    Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
                }).setCollision(true));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN2_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
                function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                    game.getWorld().render.digObject(rx, ry, false);
                    game.getWorld().render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED2_KEY]);
                    Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
                }));
            registerObjectDefs(new MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED2_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
                function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                    game.getWorld().render.digObject(rx, ry, false);
                    game.getWorld().render.placeObject(rx, ry, self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]);
                    Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
                }).setCollision(true));

            /**
             * INVENTÁŘ 
             */

            // Definice inventárních objektů
            var registerInvObjectDefs = function (invObj: InvObjDefinition) {
                self.invObjectDefs[invObj.invKey] = invObj;
            };

            // usaditelných jako objekt
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_MUSHROOM_KEY, self.mapObjectDefs[MapObjectKey.MAP_MUSHROOM_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_MUSHROOM2_KEY, self.mapObjectDefs[MapObjectKey.MAP_MUSHROOM2_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_MUSHROOM3_KEY, self.mapObjectDefs[MapObjectKey.MAP_MUSHROOM3_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_BERRY_KEY, self.mapObjectDefs[MapObjectKey.MAP_BERRY_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_PLANT_KEY, self.mapObjectDefs[MapObjectKey.MAP_PLANT_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_PLANT2_KEY, self.mapObjectDefs[MapObjectKey.MAP_PLANT2_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_PLANT3_KEY, self.mapObjectDefs[MapObjectKey.MAP_PLANT3_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_PLANT4_KEY, self.mapObjectDefs[MapObjectKey.MAP_PLANT4_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_CAMPFIRE_KEY, self.mapObjectDefs[MapObjectKey.MAP_CAMPFIRE_KEY]).setFrames(4));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_DOOR_KEY, self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(self.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]));

            // usaditelných jako povrch
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_DIRT_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_DIRT_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_WOODWALL_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_WOODWALL_KEY])
                .setBackground(self.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_BRICKWALL_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_BRICK_KEY])
                .setBackground(self.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_BRICK_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_STRAW_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_STRAW_KEY])
                .setBackground(self.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_STRAW_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_KRYSTAL_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_KRYSTAL_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_FLORITE_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_FLORITE_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_IRON_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_IRON_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_COAL_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_COAL_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_ROCK_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_ROCK_KEY]));
            registerInvObjectDefs(new InvObjDefinition(InventoryKey.INV_ROOF_KEY, self.mapSurfaceDefs[SurfaceKey.SRFC_ROOF_KEY])
                .setBackground(self.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_ROOF_KEY]));

            /**
             * SPELLS
             */

            // Definice spells
            var registerSpellDefs = function (spell: SpellDefinition) {
                self.spellDefs.insert(SpellKey[spell.key], spell);
            };

            registerSpellDefs(new MeteorSpellDef());
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
                "images": [this.getImage(key)],
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