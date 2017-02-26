/**
 * resources.js 
 * 
 * Přehled konstant a všeobecně užitečných zdrojů
 * 
 */
namespace Lich {

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

    export class Resources {

        private static INSTANCE: Resources;

        static FONT = "expressway";
        static TEXT_COLOR = "#FF0";
        static OUTLINE_COLOR = "#000";
        static WORLD_LOADER_COLOR = "#84ff00";
        static DEBUG_TEXT_COLOR = "#FF0";

        static REVEAL_SIZE = 13; // musí být liché
        static REACH_TILES_RADIUS = 10;
        static SPRITESHEET_IMAGE_SUFFIX = ".png";
        static SPRITESHEET_MAP_SUFFIX = ".json";
        static SPRITE_FRAMERATE = 0.2;
        static FRAGMENT_KEY = "fragment";
        static FRAME_KEY = "frame";

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
        public backgroundDefs: { [k: string]: string } = {};

        // definice ui prvků
        public uiSpriteDefs: { [k: string]: string } = {};

        // definice fontů 
        public fontsSpriteDefs: { [k: string]: { [k: string]: string } } = {};

        // definice achievementů 
        public achievementsDefs: { [k: string]: AchievementDefinition } = {};
        // definice objektů
        public mapObjectDefs = new Array<MapObjDefinition>();

        // Frekvenční pooly pro losování při vytváření/osazování světa 
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

        // Mapa inventářových položek dle jejich sprite jména
        public invObjectDefsBySpriteName: { [k: string]: InvObjDefinition } = {};
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
        public spritesheetByKeyMap: { [k: string]: PIXI.Texture } = {};
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
        public invObjectDefs = new Array<InvObjDefinition>();
        // definice spells
        private spellDefs: { [k: string]: SpellDefinition } = {};
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
            /*
                        // sounds
                        SOUND_PATHS.forEach((path) => {
                            manifest.push(new Load(path[0], SoundKey[path[1]]));
                        });
                        // music
                        MUSIC_PATHS.forEach((path) => {
                            manifest.push(new Load(path[0], MusicKey[path[1]]));
                        });
            */

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

                    self.spritesheetByKeyMap[stringKey] = PIXI.Texture.from(spritesheetImg);
                    self.spriteItemDefsBySheetByName[stringKey] = spritesheetDefsMap;
                });

                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));
            });

            EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_START));
            self.loader.loadManifest(manifest, true);

            // background
            BACKGROUND_DEFS.forEach((def) => {
                self.backgroundDefs[BackgroundKey[def[1]]] = def[0];
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
                self.invObjectDefs[definition.invKey] = definition;
                self.invObjectDefsBySpriteName[definition.spriteName] = definition;
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

        private createFragmentFrameKey(frameId: number, fragmentId: number) {
            return Resources.FRAME_KEY + "-" + frameId + "-" + Resources.FRAGMENT_KEY + "-" + fragmentId;
        }

        private getFromTextureCache(stringSheetKey: string, spriteName: string, frameId: number, fragmentId: number) {
            let spriteSheetNode = this.textureCache[stringSheetKey];
            if (spriteSheetNode) {
                let spriteNameNode = spriteSheetNode[spriteName];
                if (spriteNameNode)
                    return spriteNameNode[this.createFragmentFrameKey(frameId, fragmentId)];
            }
            return undefined;
        }

        private putInTextureCache(stringSheetKey: string, spriteName: string, frameId: number, fragmentId: number, texture: PIXI.Texture) {
            let spriteSheetNode = this.textureCache[stringSheetKey];
            if (!spriteSheetNode) {
                spriteSheetNode = {};
                this.textureCache[stringSheetKey] = spriteSheetNode;
            }
            let spriteNameNode = spriteSheetNode[spriteName];
            if (!spriteNameNode) {
                spriteNameNode = {};
                spriteSheetNode[spriteName] = spriteNameNode;
            }
            spriteNameNode[this.createFragmentFrameKey(frameId, fragmentId)] = texture;
        }

        getSurfaceTileSprite(surfaceKey: SurfaceKey, positionIndex: number, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_SRFC_KEY];
            let srfcDef = self.mapSurfaceDefs[SurfaceKey[surfaceKey]] || self.mapTransitionSrfcDefs[SurfaceKey[surfaceKey]];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][srfcDef.spriteName];
            let texture = this.getFromTextureCache(stringSheetKey, srfcDef.spriteName, 1, positionIndex);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
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
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
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

        getFogSprite(positionIndex: number, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            let self = this;
            if (positionIndex || positionIndex == 0) {
                positionIndex = positionIndex;
            } else {
                positionIndex = FogTile.MM;
            }
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_FOG_KEY];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][FOG_DEF[0]];
            let texture = this.getFromTextureCache(stringSheetKey, FOG_DEF[0], 1, positionIndex);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                let wSplicing = spriteDef.width / Resources.PARTS_SIZE;
                texture.frame = new PIXI.Rectangle(
                    spriteDef.x + (positionIndex % wSplicing) * Resources.PARTS_SIZE,
                    spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.PARTS_SIZE,
                    Resources.PARTS_SIZE,
                    Resources.PARTS_SIZE);
                this.putInTextureCache(stringSheetKey, FOG_DEF[0], 1, positionIndex, texture);
            }
            let sprite = originalSprite ? originalSprite : new PIXI.Sprite(texture);
            sprite.texture = texture;
            return sprite;
        };

        getMapObjectTileSprite(mapObjectKey: MapObjectKey, positionIndex: number): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_MPO_KEY];
            let mapObjectDef = self.mapObjectDefs[mapObjectKey];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][mapObjectDef.spriteName];
            let wSplicing = spriteDef.width / Resources.TILE_SIZE;
            if (mapObjectDef.frames > 1) {
                var frames = [];
                for (let i = 0; i < mapObjectDef.frames; i++) {
                    let texture = this.getFromTextureCache(stringSheetKey, mapObjectDef.spriteName, i, positionIndex);
                    if (!texture) {
                        texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
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
                    texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
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

        getBackgroundSprite(key: BackgroundKey, width: number, height?: number): BackgroundSprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_BGR_KEY];
            let bgrSprite = self.backgroundDefs[BackgroundKey[key]];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][bgrSprite];
            let spriteSheet = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
            spriteSheet.frame = new PIXI.Rectangle(spriteDef.x, spriteDef.y, spriteDef.width, spriteDef.height);
            let tilingSprite = new BackgroundSprite(spriteSheet, width, height ? height : spriteDef.height);
            tilingSprite.originalHeight = spriteDef.height;
            tilingSprite.originalWidth = spriteDef.width;
            return tilingSprite;
        };

        getFontSprite(key: FontKey, char: string): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_FNT_KEY];
            let sprite = new PIXI.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            let fontDef = self.fontsSpriteDefs[FontKey[key]];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][fontDef[char]];
            // není animovaný, takže vždy předávám číslo snímku
            // sprite.gotoAndStop(spriteDef.frame);
            sprite.fixedWidth = spriteDef.width;
            sprite.fixedHeight = spriteDef.height;
            return sprite;
        };

        private getBasicSprite(sheetKey: SpritesheetKey, spriteName: string): PIXI.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[sheetKey];
            let spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][spriteName];
            let spriteSheet = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
            spriteSheet.frame = new PIXI.Rectangle(spriteDef.x, spriteDef.y, spriteDef.width, spriteDef.height);
            let sprite = new PIXI.Sprite(spriteSheet);
            return sprite;
        };

        getAchvUISprite(key: AchievementKey): PIXI.Sprite {
            return this.getBasicSprite(SpritesheetKey.SPST_ACHV_KEY, this.achievementsDefs[AchievementKey[key]].spriteName);
        };

        getUISprite(key: UISpriteKey): PIXI.Sprite {
            return this.getBasicSprite(SpritesheetKey.SPST_UI_KEY, this.uiSpriteDefs[UISpriteKey[key]]);
        };

        getSpellUISprite(key: SpellKey, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            return this.getBasicSprite(SpritesheetKey.SPST_UI_KEY, this.spellDefs[SpellKey[key]].iconSpriteName);
        };

        getInvObjectSprite(key: InventoryKey, originalSprite?: PIXI.Sprite): PIXI.Sprite {
            return this.getBasicSprite(SpritesheetKey.SPST_INV_KEY, this.invObjectDefs[key].spriteName);
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
                    let texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                    texture.frame = new PIXI.Rectangle(
                        spriteDef.x + i * animationDef.width,
                        spriteDef.y + j * animationDef.height,
                        animationDef.width,
                        animationDef.height);
                    frames.push(texture);
                }
            }
            var anim = new AniSprite(frames, animationDef);
            return anim;
        };

    }

    export class BackgroundSprite extends PIXI.extras.TilingSprite {
        public originalWidth: number;
        public originalHeight: number;
    }

    export class AniSprite extends PIXI.extras.AnimatedSprite {

        private checkFrame: number;
        private lastFrame: number;
        private nextAnimation: AnimationKey;
        public currentAnimation: string;

        constructor(frames: PIXI.Texture[], private animationDef: AnimationSetDefinition) {
            super(frames);
            this.onFrameChange = (currentFrame: number) => {
                if (this.checkFrame != undefined && this.checkFrame == this.lastFrame) {
                    this.gotoAndPlay(AnimationKey[this.nextAnimation]);
                } else {
                    this.lastFrame = currentFrame;
                }
            };
        }

        gotoAndPlay(arg: string | number): void {
            this.stop();
            if (typeof arg === "string") {
                let animation = this.animationDef.animations[arg];
                this.lastFrame = null;
                this.currentAnimation = arg;
                this.checkFrame = animation.endFrame;
                this.nextAnimation = animation.nextAnimationKey
                this.animationSpeed = animation.speed;
                super.gotoAndPlay(animation.startFrame);
            } else {
                super.gotoAndPlay(arg);
            }
        }

    }
}