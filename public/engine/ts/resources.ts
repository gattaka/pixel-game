/**
 * resources.js 
 * 
 * Přehled konstant a všeobecně užitečných zdrojů
 * 
 */
namespace Lich {

    export class Resources {

        private static INSTANCE: Resources;

        /**
         * Optimalizační příznaky
         * 
         * - samotný world (včetně nepřátel a weather) 60FPS
         * - zapnuté UI (bez aktualizování minimapy) 60FPS
         * - UI se zapnutou aktualizací minimapy 54-60FPS
         * - zapnutá mlha 53-60FPS, ale místy spadne i na 43FPS
         * - zapnutím parallaxu se FPS propadne na 43-50FPS
         * 
         * - samotný world + parallax 50-60FPS s občasnými záseky na např. 19FPS
         */
        static OPTMZ_PARALLAX_SHOW_ON = true;
        static OPTMZ_UI_SHOW_ON = true;
        static OPTMZ_MAP_SHOW_ON = true;
        static OPTMZ_MINIMAP_SHOW_ON = true;
        static OPTMZ_FOG_SHOW_ON = true;
        static OPTMZ_FOG_PROCESS_ON = true;
        static OPTMZ_WEATHER_SHOW_ON = false;

        /**
         * Sektory 
         */
        // Velikost sektoru v dílcích - dle pokusů je nejlepší 8
        static SECTOR_SIZE = 8;
        // kolik překreslení se po změně nebude cachovat, protože 
        // je dost pravděpodobné, že se bude ještě měnit?
        static SECTOR_CACHE_COOLDOWN = 5;
        // Počet okrajových sektorů, které nejsou zobrazeny,
        // ale jsou alokovány (pro plynulé posuny)
        static BUFFER_SECTORS_X = 1;
        static BUFFER_SECTORS_Y = 1;
        // debug 
        static SHOW_SECTORS = false;
        static PRINT_SECTOR_ALLOC = false;

        /**
         * Fog 
         */
        static REVEAL_SIZE = 15; // musí být liché

        /**
         * Text 
         */
        static FONT = "expressway";
        static TEXT_COLOR = "#FF0";
        static OUTLINE_COLOR = "#000";
        static WORLD_LOADER_COLOR = "#84ff00";
        static DEBUG_TEXT_COLOR = "#FF0";

        static REACH_TILES_RADIUS = 10;
        static SPRITESHEET_IMAGE_SUFFIX = ".png";
        static SPRITESHEET_MAP_SUFFIX = ".json";
        static SPRITE_FRAMERATE = 0.2;
        static SHEET_KEY = "SHEET";
        static SPRITE_KEY = "SPRITE";
        static FRAGMENT_KEY = "FRAGMENT";
        static FRAME_KEY = "FRAME";

        // Jméno klíče, pod kterým bude v cookies uložen USER DB 
        // klíč záznamu jeho SAVE na serveru  
        static COOKIE_KEY = "LICH_ENGINE_COOKIE_USER_KEY";

        /*
         * Velikosti
         */
        static TILE_SIZE = 16;
        static PARTS_SIZE = 2 * Resources.TILE_SIZE;
        static PARTS_SHEET_WIDTH = 20;

        /**
         * DEFINICE
         */
        // definice povrchů a pozadí povrchů
        private mapSurfaceDefs: { [k: string]: MapSurfaceDefinition } = {};
        private mapSurfaceBgrDefs: { [k: string]: MapSurfaceBgrDefinition } = {};
        // dle aliasovaného povrchu
        private mapSurfaceTransitionsDefs: { [k: string]: MapSurfaceTransitionDefinition } = {};
        private mapSurfaceBgrTransitionsDefs: { [k: string]: MapSurfaceBgrTransitionDefinition } = {};
        // dle trans povrchu
        public mapTransitionSrfcDefs: { [k: string]: MapSurfaceTransitionDefinition } = {};
        public mapTransitionSrfcBgrsDefs: { [k: string]: MapSurfaceBgrTransitionDefinition } = {};
        // definice pozadí scény
        public parallaxDefs: { [k: string]: string } = {};
        // definice ui prvků
        public uiSpriteDefs: { [k: string]: string } = {};
        // definice fontů 
        public fontsSpriteDefs: { [k: string]: { [k: string]: string } } = {};
        // definice achievementů 
        public achievementsDefs: { [k: string]: AchievementDefinition } = {};
        // definice objektů
        public mapObjectDefs = new Array<MapObjDefinition>();

        /**
         * Frekvenční pooly pro losování při vytváření/osazování světa 
         */
        public mapSurfacesFreqPool = new FreqPool<MapSurfaceDefinition>();
        public mapObjectDefsFreqPool = new FreqPool<MapObjDefinition>();

        /**
         * Texture cache
         */
        // I. SpriteSheet (například 'map_objekty')
        // II. SpriteSheet sprite (například 'fireplace')
        // III. FragmentFrameId (například fragment-3-4-frame-2)
        private textureCache: {
            [k: string]: {
                [k: string]: {
                    [k: string]: PIXI.Texture
                }
            }
        } = {}

        /**
         * Sprite info  
         */
        // Mapa mapových objektů dle jejich sprite jména
        public mapObjectDefsBySpriteName: { [k: string]: MapObjDefinition } = {};
        // Mapa povrchů dle jejich sprite jména
        public mapSurfaceDefsBySpriteName: { [k: string]: MapSurfaceDefinition } = {};
        // Mapa pozadí povrchů dle jejich sprite jména
        public mapSurfaceBgrDefsBySpriteName: { [k: string]: MapSurfaceBgrDefinition } = {};
        // Mapa přechodových povrchů dle jejich sprite jména
        public mapTransitionSrfcDefsBySpriteName: { [k: string]: MapSurfaceTransitionDefinition } = {};
        // Mapa přechodových pozadí povrchů dle jejich sprite jména
        public mapTransitionSrfcBgrDefsBySpriteNameMap: { [k: string]: MapSurfaceBgrTransitionDefinition } = {};

        /**
         * Spritesheet info  
         */
        // Mapa spritesheets dle klíče 
        public spritesheetByKeyMap: { [k: string]: PIXI.BaseTexture } = {};
        // Mapa sprites dle jejich souborového jména ve spritesheet dle jeho klíče
        public spriteItemDefsBySheetByName: { [k: string]: { [k: string]: SpriteItemDef } } = {};

        /**
         * Animace
         */
        // Mapa definic animací dle klíče
        public animationSetDefsByKey: { [k: string]: AnimationSetDefinition } = {};
        // Mapa definic animací dle souborového jména sub-spritesheet
        public animationSetDefsBySpriteName: { [k: string]: AnimationSetDefinition } = {};

        // definice inv položek dle klíče (int)
        private invObjectDefs: { [k: string]: InvObjDefinition } = {};
        // definice spells
        private spellDefs: { [k: string]: SpellDefinition } = {};
        public interactSpellDef = new MapObjectsInteractionSpellDef();

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
            var manifest = [];

            /**
             * IMAGES  
             */

            // spritesheets
            SPRITESHEETS_PATHS.forEach((path) => {
                manifest.push(new Load(path[0] + path[1] + Resources.SPRITESHEET_IMAGE_SUFFIX, SpritesheetKey[path[2]] + Resources.SPRITESHEET_IMAGE_SUFFIX));
                manifest.push(new Load(path[0] + path[1] + Resources.SPRITESHEET_MAP_SUFFIX, SpritesheetKey[path[2]] + Resources.SPRITESHEET_MAP_SUFFIX, createjs.AbstractLoader.JSON));
            });

            /**
             * SOUNDS AND MUSIC
             */

            // TODO
            // sounds
            SOUND_PATHS.forEach((path) => {
                manifest.push(new Load(path[0], SoundKey[path[1]]));
            });
            // music
            MUSIC_PATHS.forEach((path) => {
                manifest.push(new Load(path[0], MusicKey[path[1]]));
            });

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

                // SpriteSheet definice
                SPRITESHEETS_PATHS.forEach((path) => {
                    let key: SpritesheetKey = <SpritesheetKey>path[2];
                    let stringKey = SpritesheetKey[path[2]];
                    let spritesheetImg = self.getImage(stringKey + Resources.SPRITESHEET_IMAGE_SUFFIX);
                    let spritesheetDefsArr: Array<SpriteItemDef> = self.loader.getResult(stringKey + Resources.SPRITESHEET_MAP_SUFFIX);
                    let spritesheetDefsMap = {};

                    for (let i = 0; i < spritesheetDefsArr.length; i++) {
                        // každý sprite rovnou zaregistruj pod jeho jménem a číslem
                        let sd = spritesheetDefsArr[i];
                        let sDef = new SpriteItemDef(frames.length, sd["name"], sd["x"], sd["y"], sd["width"], sd["height"]);
                        spritesheetDefsMap[sd["name"]] = sDef;
                    }

                    self.spritesheetByKeyMap[stringKey] = new PIXI.BaseTexture(spritesheetImg);
                    self.spriteItemDefsBySheetByName[stringKey] = spritesheetDefsMap;
                });

                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));
            });

            EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_START));
            self.loader.loadManifest(manifest, true);

            // background
            PARALLAX_DEFS.forEach((def) => {
                self.parallaxDefs[ParallaxKey[def[1]]] = def[0];
            });

            // ui
            UI_DEFS.forEach((def) => {
                self.uiSpriteDefs[UISpriteKey[def[1]]] = def[0];
            });

            // fonts
            FONT_DEFS.forEach((def) => {
                let index = {};
                def[1].forEach((char) => {
                    index[char[0]] = char[1];
                });
                self.fontsSpriteDefs[FontKey[def[0]]] = index;
            });

            // Definice mapových povrchů
            SURFACE_DEFS.forEach((definition: MapSurfaceDefinition) => {
                self.mapSurfaceDefs[SurfaceKey[definition.mapObjKey]] = definition;
                self.mapSurfaceDefsBySpriteName[definition.spriteName] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapSurfacesFreqPool.insert(definition);
                }
            });

            // Definice přechodů mapových povrchů
            SURFACE_TRANSITION_DEFS.forEach((definition: MapSurfaceTransitionDefinition) => {
                self.mapSurfaceTransitionsDefs[SurfaceKey[definition.diggableSrfc]] = definition;
                self.mapTransitionSrfcDefs[SurfaceKey[definition.transitionKey]] = definition;
                self.mapTransitionSrfcDefsBySpriteName[definition.spriteName] = definition;
            });

            // Definice pozadí mapových povrchů
            SURFACE_BGR_DEFS.forEach((definition: MapSurfaceBgrDefinition) => {
                self.mapSurfaceBgrDefs[SurfaceBgrKey[definition.mapObjKey]] = definition;
                self.mapSurfaceBgrDefsBySpriteName[definition.spriteName] = definition;
            });

            // TODO Definice přechodů pozadí mapových povrchů
            // mapTransitionSrfcBgrDefsBySpriteNameMap

            // Definice mapových objektů
            MAP_OBJECT_DEFS.forEach((definition: MapObjDefinition) => {
                self.mapObjectDefs[definition.mapObjKey] = definition;
                self.mapObjectDefsBySpriteName[definition.spriteName] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapObjectDefsFreqPool.insert(definition);
                }
            });

            // Definice inventárních objektů 
            INVENTORY_DEFS(self).forEach((definition: InvObjDefinition) => {
                self.invObjectDefs[InventoryKey[definition.invKey]] = definition;
            });

            // Definice achievementů
            ACHIEVEMENTS_DEFS.forEach((definition: AchievementDefinition) => {
                self.achievementsDefs[AchievementKey[definition.key]] = definition;
            });

            // Definice animací
            ANIMATION_DEFS.forEach((definition: AnimationSetDefinition) => {
                self.animationSetDefsBySpriteName[definition.spriteName] = definition;
                self.animationSetDefsByKey[definition.animationSetKey] = definition;
            });

            // Definice spells
            let SPELL_DEFS = [
                new MeteorSpellDef(),
                new FireballSpellDef(),
                new DigSpellDef(),
                new DigBgrSpellDef(),
                new PlaceSpellDef(),
                new PlaceBgrSpellDef(),
                new BoltSpellDef(),
                new EnemySpellDef(),
                new HomeSpellDef(),
                new TeleportSpellDef(),
                new UseItemSpellDef(),
                new LoveletterSpellDef(),
                new LovearrowSpellDef(),
                new RevealFogSpellDef()
            ];
            SPELL_DEFS.forEach((definition) => {
                self.spellDefs[SpellKey[definition.key]] = definition;
            });

        };

        getInvObjectDef(key: InventoryKey): InvObjDefinition {
            return this.invObjectDefs[InventoryKey[key]];
        }

        getSurfaceBgrDef(key: SurfaceBgrKey) {
            return this.mapSurfaceBgrDefs[SurfaceBgrKey[key]];
        }

        getSurfaceDef(key: SurfaceKey) {
            // nejprve zkus, zda to není přechodový povrch, 
            // který by se měl přeložit na jeho reálný povrch
            let transition: MapSurfaceTransitionDefinition = this.mapTransitionSrfcDefs[SurfaceKey[key]];
            if (transition)
                key = transition.diggableSrfc;
            return this.mapSurfaceDefs[SurfaceKey[key]];
        }

        getTransitionSurface(srfc: SurfaceKey): SurfaceKey {
            let transDef = this.mapSurfaceTransitionsDefs[SurfaceKey[srfc]];
            if (!transDef) return undefined;
            return transDef.transitionKey;
        }

        getTransitionSurfaceBgr(srfc: SurfaceBgrKey): SurfaceBgrKey {
            let transDef = this.mapSurfaceBgrTransitionsDefs[SurfaceBgrKey[srfc]];
            if (!transDef) return undefined;
            return transDef.transitionKey;
        }

        getSpellDef(key: SpellKey): SpellDefinition {
            return this.spellDefs[SpellKey[key]];
        };

        private getImage(key: string): HTMLImageElement {
            return <HTMLImageElement>this.loader.getResult(key);
        };

        private createFragmentFrameKey(stringSheetKey: string, spriteName: string, frameId: number, fragmentId: number): string {
            return Resources.SHEET_KEY + "$" + stringSheetKey + "$" + Resources.SPRITE_KEY + "$" + spriteName + Resources.FRAME_KEY + "$" + frameId + "$" + Resources.FRAGMENT_KEY + "$" + fragmentId;
        }

        private getFromTextureCache(stringSheetKey: string, spriteName: string, frameId: number, fragmentId: number) {
            return PIXI.utils.TextureCache[this.createFragmentFrameKey(stringSheetKey, spriteName, frameId, fragmentId)];
        }

        private putInTextureCache(stringSheetKey: string, spriteName: string, frameId: number, fragmentId: number, texture: PIXI.Texture) {
            PIXI.utils.TextureCache[this.createFragmentFrameKey(stringSheetKey, spriteName, frameId, fragmentId)] = texture;
        }

        getSurfaceTileSprite(surfaceKey: SurfaceKey, positionIndex: number, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_SRFC_KEY];
            let srfcDef = self.mapSurfaceDefs[SurfaceKey[surfaceKey]] || self.mapTransitionSrfcDefs[SurfaceKey[surfaceKey]];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][srfcDef.spriteName];
            let texture = this.getFromTextureCache(stringSheetKey, srfcDef.spriteName, 1, positionIndex);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                let wSplicing = spriteDef.width / Resources.TILE_SIZE;
                texture.frame = new PIXI.Rectangle(
                    spriteDef.x + (positionIndex % wSplicing) * Resources.TILE_SIZE,
                    spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE,
                    Resources.TILE_SIZE,
                    Resources.TILE_SIZE);
                this.putInTextureCache(stringSheetKey, srfcDef.spriteName, 1, positionIndex, texture);
            }
            let sprite = originalSprite ? originalSprite : new PIXI.Sprite(texture);
            sprite.texture = texture;
            return sprite;
        };

        getSurfaceBgrTileSprite(surfaceBgrKey: SurfaceBgrKey, positionIndex: number, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_SRFC_BGR_KEY];
            let srfcBgrDef = self.mapSurfaceBgrDefs[SurfaceBgrKey[surfaceBgrKey]] || self.mapTransitionSrfcBgrsDefs[SurfaceBgrKey[surfaceBgrKey]];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][srfcBgrDef.spriteName];
            let texture = this.getFromTextureCache(stringSheetKey, srfcBgrDef.spriteName, 1, positionIndex);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                let wSplicing = spriteDef.width / Resources.TILE_SIZE;
                texture.frame = new PIXI.Rectangle(
                    spriteDef.x + (positionIndex % wSplicing) * Resources.TILE_SIZE,
                    spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE,
                    Resources.TILE_SIZE,
                    Resources.TILE_SIZE);
                this.putInTextureCache(stringSheetKey, srfcBgrDef.spriteName, 1, positionIndex, texture);
            }
            let sprite = originalSprite ? originalSprite : new PIXI.Sprite(texture);
            sprite.texture = texture;
            return sprite;
        };

        getFogSprite(): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_FOG_KEY];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][FOG_DEF[0]];
            let texture = this.getFromTextureCache(stringSheetKey, FOG_DEF[0], 1, 1);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                this.putInTextureCache(stringSheetKey, FOG_DEF[0], 1, 1, texture);
            }
            let sprite = new PIXI.Sprite(texture);
            sprite.texture = texture;
            return sprite;
        };

        getMapObjectTileSprite(mapObjectKey: MapObjectKey, positionIndex: number): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_MPO_KEY];
            let mapObjectDef = self.mapObjectDefs[mapObjectKey];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][mapObjectDef.spriteName];
            let wSplicing = mapObjectDef.mapSpriteWidth;
            if (mapObjectDef.frames > 1) {
                var frames = [];
                for (let i = 0; i < mapObjectDef.frames; i++) {
                    let texture = this.getFromTextureCache(stringSheetKey, mapObjectDef.spriteName, i, positionIndex);
                    if (!texture) {
                        texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                        texture.frame = new PIXI.Rectangle(
                            spriteDef.x + (positionIndex % wSplicing + i * mapObjectDef.mapSpriteWidth) * Resources.TILE_SIZE,
                            spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE,
                            Resources.TILE_SIZE,
                            Resources.TILE_SIZE);
                        this.putInTextureCache(stringSheetKey, mapObjectDef.spriteName, i, positionIndex, texture);
                    }
                    frames.push(texture);
                }
                var anim = new PIXI.extras.AnimatedSprite(frames);
                anim.animationSpeed = 0.2;
                anim.play();
                return anim;
            } else {
                let texture = this.getFromTextureCache(stringSheetKey, mapObjectDef.spriteName, 1, positionIndex);
                if (!texture) {
                    texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                    texture.frame = new PIXI.Rectangle(
                        spriteDef.x + (positionIndex % wSplicing) * Resources.TILE_SIZE,
                        spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE,
                        Resources.TILE_SIZE,
                        Resources.TILE_SIZE);
                    this.putInTextureCache(stringSheetKey, mapObjectDef.spriteName, 1, positionIndex, texture);
                }
                let sprite = new PIXI.Sprite(texture);
                sprite.texture = texture;
                return sprite;
            }
        };

        getParallaxSprite(key: ParallaxKey, width: number, height?: number): ParallaxSprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_BGR_KEY];
            let spriteName = self.parallaxDefs[ParallaxKey[key]];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][spriteName];
            let texture = this.getFromTextureCache(stringSheetKey, spriteName, 1, 1);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                texture.frame = new PIXI.Rectangle(spriteDef.x, spriteDef.y, spriteDef.width, spriteDef.height);
                this.putInTextureCache(stringSheetKey, spriteName, 1, 1, texture);
            }
            let tilingSprite = new ParallaxSprite(texture, width + spriteDef.width * 2, height ? height + spriteDef.height * 2 : spriteDef.height);
            tilingSprite.originalHeight = spriteDef.height;
            tilingSprite.originalWidth = spriteDef.width;
            // tilingSprite.cacheAsBitmap = true;
            return tilingSprite;
        };

        private getBasicSprite(sheetKey: SpritesheetKey, spriteName: string, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[sheetKey];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][spriteName];
            let texture = this.getFromTextureCache(stringSheetKey, spriteName, 1, 1);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                texture.frame = new PIXI.Rectangle(spriteDef.x, spriteDef.y, spriteDef.width, spriteDef.height);
                this.putInTextureCache(stringSheetKey, spriteName, 1, 1, texture);
            }
            if (originalSprite) {
                originalSprite.texture = texture;
                return originalSprite;
            } else {
                return new PIXI.Sprite(texture);
            }
        };

        getUISprite(key: UISpriteKey, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            return this.getBasicSprite(SpritesheetKey.SPST_UI_KEY, this.uiSpriteDefs[UISpriteKey[key]], originalSprite);
        };

        getAchvUISprite(key: AchievementKey): PIXI.Sprite {
            return this.getUISprite(this.achievementsDefs[AchievementKey[key]].icon);
        };

        getInvUISprite(key: InventoryKey, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            return this.getUISprite(this.getInvObjectDef(key).icon, originalSprite);
        };

        getAnimatedObjectSprite(animation: AnimationSetKey): AniSprite {
            let self = this;
            let animationDef = self.animationSetDefsByKey[animation];
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_ANM_KEY];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][animationDef.spriteName];
            var frames = [];
            let xFrames = spriteDef.width / animationDef.width;
            let yFrames = spriteDef.height / animationDef.height;
            for (let j = 0; j < yFrames; j++) {
                for (let i = 0; i < xFrames; i++) {
                    if (frames.length >= animationDef.frames)
                        break;
                    let texture = this.getFromTextureCache(stringSheetKey, animationDef.spriteName, j * xFrames + i, 1);
                    if (!texture) {
                        texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey]);
                        texture.frame = new PIXI.Rectangle(
                            spriteDef.x + i * animationDef.width,
                            spriteDef.y + j * animationDef.height,
                            animationDef.width,
                            animationDef.height);
                        this.putInTextureCache(stringSheetKey, animationDef.spriteName, j * xFrames + i, 1, texture);
                    }
                    frames.push(texture);
                }
            }
            var anim = new AniSprite(frames, animationDef);
            return anim;
        };

    }

    export class ParallaxSprite extends PIXI.extras.TilingSprite {
        public originalWidth: number;
        public originalHeight: number;
    }

    export class AniSprite extends PIXI.extras.AnimatedSprite {

        private startFrame: number;
        private endFrame: number;
        private nextAnimation: string;
        // hlavní animace, která byla zvenku spuštěna
        public currentAnimation: string;
        // pod-animace, do které hlavní animace přešla v důsledku řetězení
        public currentSubAnimation: string;

        constructor(frames: PIXI.Texture[], private animationDef: AnimationSetDefinition) {
            super(frames);
            // tohle se volá opravdu pouze při změně frame, takže pokud je loop na 1 frame
            // tak se tohle zavolá až když to z té animace vlastně úplně vyjede
            this.onFrameChange = (currentFrame: number) => {
                if (this.endFrame != undefined && (currentFrame < this.startFrame || currentFrame > this.endFrame)) {
                    this.gotoAndPlayInner(this.animationDef.animations[this.nextAnimation]);
                }
            };
        }

        public gotoAndPlay(arg: string | number) {
            if (typeof arg === "string") {
                let animation = this.animationDef.animations[arg];
                this.currentAnimation = arg;
                this.gotoAndPlayInner(animation);
            } else {
                this.gotoAndPlay(arg);
            }
        }

        private gotoAndPlayInner(anm: Animation): void {
            this.startFrame = anm.startFrame;
            this.endFrame = anm.endFrame;
            this.currentSubAnimation = AnimationKey[anm.animationKey];
            this.nextAnimation = AnimationKey[anm.nextAnimationKey];
            this.animationSpeed = anm.speed;
            super.gotoAndPlay(anm.startFrame);
        }

    }

    class Load {
        constructor(public src: string, public id: string, public type?: string) { };
    }

    export interface HasCooldown {
        seedCooldown: number;
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
                        this.cooldowns[idx] = it.seedCooldown;
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
            this.cooldowns.push(item.seedCooldown);
        }
    }

    export class SpriteItemDef {
        constructor(
            public frame: number,
            public name: string,
            public x: number,
            public y: number,
            public width: number,
            public height: number
        ) { }
    }
}