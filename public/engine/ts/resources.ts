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

        static REVEAL_SIZE = 13; // musí být liché
        static REACH_TILES_RADIUS = 10;
        static SPRITESHEET_IMAGE_SUFFIX = ".png";
        static SPRITESHEET_MAP_SUFFIX = ".json";
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
        static FRAGMENT_SEPARATOR = "-FRAGMENT-";

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
        public mapTransitionSrfcBgrs: { [k: string]: MapSurfaceBgrTransitionDefinition } = {};

        // definice achievementů 
        public achievementsDefs: { [k: string]: AchievementDefinition } = {};
        // definice objektů
        public mapObjectDefs = new Array<MapObjDefinition>();

        // Frekvenční pooly pro losování při vytváření/osazování světa 
        public mapSurfacesFreqPool = new FreqPool<MapSurfaceDefinition>();
        public mapObjectDefsFreqPool = new FreqPool<MapObjDefinition>();

        /**
         * Sprite info  
         */

        // Mapa inventářových položek dle jejich sprite jména
        public invObjectDefsBySpriteNameMap: { [k: string]: InvObjDefinition } = {};
        // Mapa mapových objektů dle jejich sprite jména
        public mapObjectDefsBySpriteNameMap: { [k: string]: MapObjDefinition } = {};
        // Mapa povrchů dle jejich sprite jména
        public mapSurfaceDefsBySpriteNameMap: { [k: string]: MapSurfaceDefinition } = {};
        // Mapa pozadí povrchů dle jejich sprite jména
        public mapSurfaceBgrDefsBySpriteNameMap: { [k: string]: MapSurfaceBgrDefinition } = {};
        // Mapa přechodových pozadí povrchů dle jejich sprite jména
        public mapTransitionSrfcBgrDefsBySpriteNameMap: { [k: string]: MapSurfaceBgrTransitionDefinition } = {};

        /**
         * Spritesheet info  
         */

        // Mapa spritesheets dle klíče 
        public spritesheetByKeyMap: { [k: string]: createjs.SpriteSheet } = {};
        // Mapa sprites dle jejich souborového jména ve spritesheet dle jeho klíče
        public spriteItemDefsBySheetByNameMap: { [k: string]: { [k: string]: SpriteItemDef } } = {};

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
            var manifest = [];

            /**
             * IMAGES  
             */

            // spritesheets
            SPRITESHEETS_PATHS.forEach((path) => {
                manifest.push(new Load(path[0] + path[1] + Resources.SPRITESHEET_IMAGE_SUFFIX, SpritesheetKey[path[2]] + Resources.SPRITESHEET_IMAGE_SUFFIX));
                manifest.push(new Load(path[0] + path[1] + Resources.SPRITESHEET_MAP_SUFFIX, SpritesheetKey[path[2]] + Resources.SPRITESHEET_MAP_SUFFIX, createjs.AbstractLoader.JSON));
            });

            // background
            BACKGROUND_PATHS.forEach((path) => {
                manifest.push(new Load(path[0], BackgroundKey[path[1]]));
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
                    self.spriteItemDefsBySheetByNameMap[stringKey] = spritesheetDefsMap;
                    let frames = [];
                    let animations = {};
                    for (let i = 0; i < spritesheetDefsArr.length; i++) {
                        // každý sprite rovnou zaregistruj pod jeho jménem a číslem
                        let sd = spritesheetDefsArr[i];
                        let sDef = new SpriteItemDef(frames.length, sd["name"], sd["x"], sd["y"], sd["width"], sd["height"]);
                        spritesheetDefsMap[sd["name"]] = sDef;
                        frames.push([sDef.x, sDef.y, sDef.width, sDef.height]);
                        animations[sDef.name] = [frames.length - 1, frames.length - 1, name, Resources.SPRITE_FRAMERATE];

                        // Objekty nech v celku, akorát animace rozděl
                        if (SpritesheetKey.SPST_OBJECTS_KEY == key) {
                            let animationDef = self.animationSetDefsBySpriteName[sDef.name];
                            if (animationDef) {
                                // Pokud se jedná o animaci, rozděl ji dle rozměrů
                                let frCnt = 0; // počítadlo snímků animace
                                let wSplicing = sDef.width / animationDef.width;
                                let hSplicing = sDef.height / animationDef.height;
                                // Připrav snímky
                                for (let y = 0; y < hSplicing; y++) {
                                    for (let x = 0; x < wSplicing; x++) {
                                        frames.push([sDef.x + x * animationDef.width, sDef.y + y * animationDef.height, animationDef.width, animationDef.height]);
                                        frCnt++;
                                    }
                                }
                                // Ze snímků sestav animace dle definic
                                for (let a = 0; a < animationDef.animations.length; a++) {
                                    let animDef = animationDef.animations[a];
                                    animations[AnimationKey[animDef.animationKey]] = [
                                        frames.length - frCnt + animDef.startFrame,
                                        frames.length - frCnt - 1 + animDef.endFrame,
                                        AnimationKey[animDef.nextAnimationKey],
                                        animDef.time
                                    ];
                                }
                            }
                        }

                        // Tiles rozřež a pokud jsou animované, tak ještě rozděl na animace
                        if (SpritesheetKey.SPST_TILES_KEY == key) {
                            // zkus sprite zpracovat jako tile -- stačí, aby položka existovala
                            // jako povrch, přechod povrchu, pozadí povrchu nebo přechod pozadí 
                            // povrchu a můžu jednotně rozsekat zaregistrovat, rozměry jsou stejné
                            let surfaceDef = self.mapSurfaceDefsBySpriteNameMap[sDef.name];
                            let surfaceBgrDef = self.mapSurfaceBgrDefsBySpriteNameMap[sDef.name];
                            let surfaceTransDef = self.mapSurfaceTransitionsDefs[sDef.name];
                            let surfaceBgrTransDef = self.mapSurfaceBgrTransitionsDefs[sDef.name];
                            if (surfaceDef || surfaceBgrDef || surfaceTransDef || surfaceBgrTransDef) {
                                let wSplicing = sDef.width / Resources.TILE_SIZE;
                                let hSplicing = sDef.height / Resources.TILE_SIZE;
                                for (let y = 0; y < hSplicing; y++) {
                                    for (let x = 0; x < wSplicing; x++) {
                                        // tím, že se prostě jenom snímek přidá do již existující fronty, 
                                        // je dáno, že pro získání fragmentů stačí vzít původní číslo celého
                                        // sprite a jenom k němu přičíst vnitřní index fragmentu 
                                        frames.push([sDef.x + x * Resources.TILE_SIZE, sDef.y + y * Resources.TILE_SIZE, Resources.TILE_SIZE, Resources.TILE_SIZE]);
                                    }
                                }
                            } else if (sDef.name == FOG_DEF[0]) {
                                let wSplicing = sDef.width / Resources.PARTS_SIZE;
                                let hSplicing = sDef.height / Resources.PARTS_SIZE;
                                for (let y = 0; y < hSplicing; y++) {
                                    for (let x = 0; x < wSplicing; x++) {
                                        // tím, že se prostě jenom snímek přidá do již existující fronty, 
                                        // je dáno, že pro získání fragmentů stačí vzít původní číslo celého
                                        // sprite a jenom k němu přičíst vnitřní index fragmentu 
                                        frames.push([sDef.x + x * Resources.PARTS_SIZE, sDef.y + y * Resources.PARTS_SIZE, Resources.PARTS_SIZE, Resources.PARTS_SIZE]);
                                    }
                                }
                            } else {
                                // zkus sprite zpracovat jako mapobject
                                let mapObjectDef = self.mapObjectDefsBySpriteNameMap[sDef.name];
                                if (mapObjectDef) {
                                    // může být animován    
                                    // rozděl dle sektorů
                                    for (let y = 0; y < mapObjectDef.mapSpriteHeight; y++) {
                                        for (let x = 0; x < mapObjectDef.mapSpriteWidth; x++) {
                                            if (mapObjectDef.frames > 1) {
                                                for (let f = 0; f < mapObjectDef.frames; f++) {
                                                    frames.push([
                                                        // animace map-objektů je vždy rozbalená doprava na jednom řádku
                                                        sDef.x + x * Resources.TILE_SIZE + Resources.TILE_SIZE * mapObjectDef.mapSpriteWidth * f,
                                                        sDef.y + y * Resources.TILE_SIZE, Resources.TILE_SIZE, Resources.TILE_SIZE
                                                    ]);
                                                }
                                                let name = sDef.name + Resources.FRAGMENT_SEPARATOR + (x + y * mapObjectDef.mapSpriteWidth);
                                                animations[name] = [frames.length - mapObjectDef.frames, frames.length - 1, name, Resources.SPRITE_FRAMERATE];
                                            } else {
                                                frames.push([
                                                    sDef.x + x * Resources.TILE_SIZE, sDef.y + y * Resources.TILE_SIZE, Resources.TILE_SIZE, Resources.TILE_SIZE
                                                ]);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }

                    let sheet = new createjs.SpriteSheet({
                        framerate: 10,
                        images: [spritesheetImg],
                        frames: frames,
                        animations: animations
                    });
                    self.spritesheetByKeyMap[stringKey] = sheet;
                });

                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));
            });

            self.loader.loadManifest(manifest, true);

            // Definice mapových povrchů
            SURFACE_DEFS.forEach((definition: MapSurfaceDefinition) => {
                self.mapSurfaceDefs[SurfaceKey[definition.mapObjKey]] = definition;
                self.mapSurfaceDefsBySpriteNameMap[definition.spriteName] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapSurfacesFreqPool.insert(definition);
                }
            });

            // Definice přechodů mapových povrchů
            SURFACE_TRANSITION_DEFS.forEach((definition: MapSurfaceTransitionDefinition) => {
                self.mapSurfaceTransitionsDefs[SurfaceKey[definition.diggableSrfc]] = definition;
                self.mapTransitionSrfcDefs[SurfaceKey[definition.transitionKey]] = definition;
            });

            // Definice pozadí mapových povrchů
            SURFACE_BGR_DEFS.forEach((definition: MapSurfaceBgrDefinition) => {
                self.mapSurfaceBgrDefs[SurfaceBgrKey[definition.mapObjKey]] = definition;
                self.mapSurfaceBgrDefsBySpriteNameMap[definition.spriteName] = definition;
            });

            // Definice mapových objektů
            MAP_OBJECT_DEFS.forEach((definition: MapObjDefinition) => {
                self.mapObjectDefs[definition.mapObjKey] = definition;
                self.mapObjectDefsBySpriteNameMap[definition.spriteName] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapObjectDefsFreqPool.insert(definition);
                }
            });

            // Definice inventárních objektů 
            INVENTORY_DEFS(self).forEach((definition: InvObjDefinition) => {
                self.invObjectDefs[definition.invKey] = definition;
                self.invObjectDefsBySpriteNameMap[definition.spriteName] = definition;
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
                self.spellDefs.insert(SpellKey[definition.key], definition);
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

        private getImage(key: string): HTMLImageElement {
            return <HTMLImageElement>this.loader.getResult(key);
        };

        private getBitmap(key: string): createjs.Bitmap {
            return new createjs.Bitmap(this.getImage(key));
        };

        getSpritePart(key: string, tileX: number, tileY: number, count: number, width: number, height: number): createjs.Sprite {
            let frames = [];
            for (let i = 0; i < count; i++) {
                frames.push([
                    tileX * Resources.TILE_SIZE + i * width * Resources.TILE_SIZE, // x
                    tileY * Resources.TILE_SIZE, // y
                    Resources.TILE_SIZE,
                    Resources.TILE_SIZE
                ]);
            }
            let sheet = new createjs.SpriteSheet({
                framerate: 10,
                images: [this.getImage(key)],
                frames: frames,
                animations: { "idle": [0, count - 1, "idle", Resources.SPRITE_FRAMERATE] }
            });
            let sprite = new createjs.Sprite(sheet, "idle");
            sprite.gotoAndPlay("idle");
            return sprite;
        }

        getText(text: string) {
            let self = this;
            let bitmapText = new createjs.BitmapText(text, self.spritesheetByKeyMap[SpritesheetKey[SpritesheetKey.SPST_FONTS_KEY]]);
            return bitmapText;
        }

        getSurfaceTileSprite(surfaceKey: SurfaceKey, positionIndex: number): createjs.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_TILES_KEY];
            let srfcDef = self.mapSurfaceDefs[SurfaceKey[surfaceKey]];
            let sprite = new createjs.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            sprite.gotoAndStop(self.spriteItemDefsBySheetByNameMap[stringSheetKey][srfcDef.spriteName].frame + positionIndex);
            return sprite;
        };

        getSurfaceBgrTileSprite(surfaceBgrKey: SurfaceBgrKey, positionIndex: number): createjs.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_TILES_KEY];
            let srfcBgrDef = self.mapSurfaceBgrDefs[SurfaceBgrKey[surfaceBgrKey]];
            let sprite = new createjs.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            sprite.gotoAndStop(self.spriteItemDefsBySheetByNameMap[stringSheetKey][srfcBgrDef.spriteName].frame + positionIndex);
            return sprite;
        };

        getFogSprite(positionIndex: number): createjs.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_TILES_KEY];
            let sprite = new createjs.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            sprite.gotoAndStop(self.spriteItemDefsBySheetByNameMap[stringSheetKey][FOG_DEF[0]].frame + positionIndex);
            return sprite;
        };

        getMapObjectTileSprite(mapObjectKey: MapObjectKey, positionIndex: number): createjs.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_TILES_KEY];
            let mapObjectDef = self.mapObjectDefs[mapObjectKey];
            let sprite = new createjs.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            if (mapObjectDef.frames > 1) {
                // pusť konkrétní animaci (kokrétního position Indexu)
                sprite.gotoAndPlay(mapObjectDef.spriteName + Resources.FRAGMENT_SEPARATOR + positionIndex);
            } else {
                // jdi na konkrétní snímek a tam stůj
                sprite.gotoAndStop(self.spriteItemDefsBySheetByNameMap[stringSheetKey][mapObjectDef.spriteName].frame + positionIndex);
            }
            return sprite;
        };

        getInvObjectSprite(key: InventoryKey): createjs.Sprite {
            let self = this;
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_OBJECTS_KEY];
            let sprite = new createjs.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            let invDef = self.invObjectDefs[key];
            let frameBySpriteName: number = self.spriteItemDefsBySheetByNameMap[stringSheetKey][invDef.spriteName].frame;
            // inv není animovaný, takže vždy předávám číslo snímku
            sprite.gotoAndStop(frameBySpriteName)
            return sprite;
        };

        getAnimatedObjectSprite(animation: AnimationSetKey): createjs.Sprite {
            let self = this;
            let animationDef = self.animationSetDefsByKey[animation];
            let stringSheetKey = SpritesheetKey[SpritesheetKey.SPST_OBJECTS_KEY];
            let sprite = new createjs.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            let startFrame = self.spriteItemDefsBySheetByNameMap[stringSheetKey][animationDef.spriteName].frame;
            sprite.gotoAndPlay(AnimationKey[animationDef.animations[0].animationKey]);
            return sprite;
        };

        private getSpriteBySheetKey(sheetKey: SpritesheetKey) {
            let self = this;
            let stringSheetKey = SpritesheetKey[sheetKey];
            return new createjs.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
        }

    }
}