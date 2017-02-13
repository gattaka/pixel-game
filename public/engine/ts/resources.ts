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

        /**
         * DEFINICE
         */

        // definice povrchů a objektů
        private mapSurfaceDefs: { [k: string]: MapSurfaceDefinition } = {};
        private mapSurfacesBgrDefs: { [k: string]: MapSurfaceBgrDefinition } = {};
        // dle aliasovaného povrchu
        private mapSurfaceTransitionsDefs: { [k: string]: MapSurfaceTransitionDefinition } = {};
        private mapSurfaceBgrTransitionsDefs: { [k: string]: MapSurfaceBgrTransitionDefinition } = {};
        // dle trans povrchu
        public mapTransitionSrfcs: { [k: string]: MapSurfaceTransitionDefinition } = {};
        public mapTransitionSrfcBgrs: { [k: string]: MapSurfaceBgrTransitionDefinition } = {};

        public achievementsDefs: { [k: string]: AchievementDefinition } = {};
        public animationsBySetDefs: { [k: string]: AnimationDefinition } = {};
        public animationsBySheetDefs: { [k: string]: AnimationDefinition } = {};
        public mapObjectDefs = new Array<MapObjDefinition>();
        public mapSurfacesFreqPool = new FreqPool<MapSurfaceDefinition>();
        public mapObjectDefsFreqPool = new FreqPool<MapObjDefinition>();

        public spritesheetsMap: { [k: string]: createjs.SpriteSheet } = {};
        public spritesheetsDefsMap: { [k: string]: { [k: string]: SpriteItemDef } } = {};

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
                    let key = SpritesheetKey[path[2]];
                    let spritesheetImg = self.getImage(key + Resources.SPRITESHEET_IMAGE_SUFFIX);
                    let spritesheetDefsArr: Array<SpriteItemDef> = self.loader.getResult(key + Resources.SPRITESHEET_MAP_SUFFIX);
                    let spritesheetDefsMap = {};
                    self.spritesheetsDefsMap[key] = spritesheetDefsMap;
                    let frames = [];
                    let animations = {};
                    for (let i = 0; i < spritesheetDefsArr.length; i++) {
                        let sd = spritesheetDefsArr[i];
                        let sDef = new SpriteItemDef(frames.length, sd["name"], sd["x"], sd["y"], sd["width"], sd["height"]);
                        spritesheetDefsMap[sd["name"]] = sDef;
                        frames.push([sDef.x, sDef.y, sDef.width, sDef.height]);
                        animations[sDef.name] = [frames.length - 1, frames.length - 1, name, Resources.SPRITE_FRAMERATE];

                        // Objekty nech v celku, akorát animace rozděl
                        if (SpritesheetKey.SPST_OBJECTS_KEY == path[2]) {
                            // Pokud se jedná o animaci, rozděl ji dle rozměrů
                            let animationDef = self.animationsBySheetDefs[sDef.name];
                            if (animationDef) {
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
                                    animations[AnimationKey[animDef.animation]] = [
                                        frames.length - frCnt + animDef.startFrame,
                                        frames.length - frCnt - 1 + animDef.endFrame,
                                        animDef.nextAnimation,
                                        animDef.time
                                    ];
                                }
                            }
                        }

                        // Tiles rozřež a pokud jsou animované, tak ještě rozděl na animace
                        if (SpritesheetKey.SPST_TILES_KEY == path[2]) {
                        }

                        // Připraví rozložení animace pro sektory
                        // tohle by se mělo spustit pro každý rozřezatelný objekt/povrch
                        // DEV test
                        if (sDef.name == "fireplace") {
                            let frCnt = 4; // počet snímků animace
                            let w = 8 * 8; // šířka snímku animace
                            let h = 4 * 8; // výška snímku animace
                            let spliceSide = 2 * 8; // velikost výřezu 
                            let wSplicing = w / spliceSide;
                            let hSplicing = h / spliceSide;
                            for (let y = 0; y < hSplicing; y++) {
                                for (let x = 0; x < wSplicing; x++) {
                                    for (let f = 0; f < frCnt; f++) {
                                        // počítá se s tím, že snímky jsou zleva doprava za sebou
                                        frames.push([sDef.x + x * spliceSide + w * f, sDef.y + y * spliceSide, spliceSide, spliceSide]);
                                    }
                                    let name = sDef.name + "-FRAGMENT-" + x + "-" + y;
                                    animations[name] = [frames.length - frCnt, frames.length - 1, name, Resources.SPRITE_FRAMERATE];
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
                    self.spritesheetsMap[key] = sheet;
                });

                EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.LOAD_FINISHED));
            });

            self.loader.loadManifest(manifest, true);

            // Definice mapových povrchů
            SURFACE_DEFS.forEach((definition: MapSurfaceDefinition) => {
                self.mapSurfaceDefs[SurfaceKey[definition.mapObjKey]] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapSurfacesFreqPool.insert(definition);
                }
            });

            // Definice přechodů mapových povrchů
            SURFACE_TRANSITION_DEFS.forEach((definition: MapSurfaceTransitionDefinition) => {
                self.mapSurfaceTransitionsDefs[SurfaceKey[definition.diggableSrfc]] = definition;
                self.mapTransitionSrfcs[SurfaceKey[definition.transitionKey]] = definition;
            });

            // Definice pozadí mapových povrchů
            SURFACE_BGR_DEFS.forEach((definition: MapSurfaceBgrDefinition) => {
                self.mapSurfacesBgrDefs[SurfaceBgrKey[definition.mapObjKey]] = definition;
            });

            // Definice mapových objektů
            MAP_OBJECT_DEFS.forEach((definition: MapObjDefinition) => {
                self.mapObjectDefs[definition.mapObjKey] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapObjectDefsFreqPool.insert(definition);
                }
            });

            // Definice inventárních objektů 
            INVENTORY_DEFS(self).forEach((definition: InvObjDefinition) => {
                self.invObjectDefs[definition.invKey] = definition;
            });

            // Definice achievementů
            ACHIEVEMENTS_DEFS.forEach((definition: AchievementDefinition) => {
                self.achievementsDefs[AchievementKey[definition.key]] = definition;
            });

            // Definice animací
            ANIMATION_DEFS.forEach((definition: AnimationDefinition) => {
                self.animationsBySetDefs[AnimationSetKey[definition.animationSetKey]] = definition;
                self.animationsBySheetDefs[definition.subSpritesheetName] = definition;
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
            return this.mapSurfacesBgrDefs[SurfaceBgrKey[key]];
        }

        getSurfaceDef(key: SurfaceKey) {
            // nejprve zkus, zda to není přechodový povrch, 
            // který by se měl přeložit na jeho reálný povrch
            let transition: MapSurfaceTransitionDefinition = this.mapTransitionSrfcs[SurfaceKey[key]];
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
            let bitmapText = new createjs.BitmapText(text, self.spritesheetsMap[SpritesheetKey[SpritesheetKey.SPST_FONTS_KEY]]);
            return bitmapText;
        }

        getTileSprite(spriteKey: string, positionIndex?: number): createjs.Sprite {
            let self = this;
            let key = SpritesheetKey[SpritesheetKey.SPST_TILES_KEY];
            let sprite = new createjs.Sprite(self.spritesheetsMap[key]);
            if (positionIndex)
                sprite.gotoAndPlay(spriteKey + "-FRAGMENT-" + positionIndex);
            else
                sprite.gotoAndPlay(self.spritesheetsDefsMap[key][spriteKey].frame);
            return sprite;
        };

        getSprite(spritesheetKey: SpritesheetKey, spriteKey: string): createjs.Sprite {
            let self = this;
            let key = SpritesheetKey[spritesheetKey];
            let sprite = new createjs.Sprite(self.spritesheetsMap[key]);
            sprite.gotoAndStop(self.spritesheetsDefsMap[key][spriteKey].frame);
            return sprite;
        };

    }
}