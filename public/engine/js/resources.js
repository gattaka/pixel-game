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
    var FreqPool = (function () {
        function FreqPool() {
            this.cooldowns = new Array();
            this.palette = new Array();
        }
        FreqPool.prototype.yield = function (accept) {
            var _this = this;
            // sniž čekání položek na použití
            this.cooldowns.forEach(function (x, idx, arr) {
                if (x) {
                    arr[idx]--;
                }
            });
            var tries = 0;
            var tried = {};
            // vyber náhodně položku
            var randomIndex = function () {
                return Math.floor(Math.random() * _this.palette.length);
            };
            var idx = randomIndex();
            do {
                if (this.cooldowns[idx] == 0) {
                    // pokud je položka připravena, zkus ji použít
                    var it = this.palette[idx];
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
            } while (tries != this.palette.length);
            return null;
        };
        FreqPool.prototype.insert = function (item) {
            this.palette.push(item);
            this.cooldowns.push(item.seedCooldown);
        };
        return FreqPool;
    }());
    Lich.FreqPool = FreqPool;
    var Resources = (function () {
        function Resources() {
            /**
             * DEFINICE
             */
            // definice povrchů a objektů
            this.mapSurfaceDefs = {};
            this.mapSurfaceTransitionsDefs = {};
            this.mapSurfaceTransitionsAliasDefs = {};
            this.mapSurfacesBgrDefs = {};
            this.mapTransitionSrfcs = {};
            this.mapObjectDefs = new Array();
            this.mapSurfacesFreqPool = new FreqPool();
            this.mapObjectDefsFreqPool = new FreqPool();
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
            this.loaderDone = false;
            var self = this;
            var manifest = [];
            /**
             * IMAGES
             */
            // inventory
            Lich.INVENTORY_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.InventoryKey[path[1]]));
            });
            // spells
            Lich.SPELL_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.SpellKey[path[1]]));
            });
            // animations
            Lich.ANIMATION_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.AnimationKey[path[1]]));
            });
            // surfaces
            Lich.SURFACE_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.SurfaceKey[path[1]]));
            });
            // surface backgrounds
            Lich.SURFACE_BGR_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.SurfaceBgrKey[path[1]]));
            });
            // objects
            Lich.MAP_OBJECT_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.MapObjectKey[path[1]]));
            });
            // UI
            Lich.UI_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.UIGFXKey[path[1]]));
            });
            // background
            Lich.BACKGROUND_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.BackgroundKey[path[1]]));
            });
            /**
             * SOUNDS AND MUSIC
             */
            // sounds
            Lich.SOUND_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.SoundKey[path[1]]));
            });
            // music
            Lich.MUSIC_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.MusicKey[path[1]]));
            });
            // nejprve font (nahrává se mimo loader)
            var config = {
                custom: {
                    families: ['expressway'],
                    urls: ['/css/fonts.css']
                }
            };
            WebFont.load(config);
            // pak loader 
            self.loader = new createjs.LoadQueue(false);
            createjs.Sound.alternateExtensions = ["mp3"];
            self.loader.installPlugin(createjs.Sound);
            self.loader.addEventListener("progress", function (event) {
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, event.loaded));
            });
            self.loader.addEventListener("filestart", function (event) {
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, event.item.src));
            });
            self.loader.addEventListener("complete", function () {
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_FINISHED));
            });
            self.loader.loadManifest(manifest, true);
            // Definice mapových povrchů
            Lich.SURFACE_DEFS.forEach(function (definition) {
                self.mapSurfaceDefs[Lich.SurfaceKey[definition.mapObjKey]] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapSurfacesFreqPool.insert(definition);
                }
            });
            // Definice přechodů mapových povrchů
            Lich.SURFACE_TRANSITION_DEFS.forEach(function (definition) {
                var level1 = self.mapSurfaceTransitionsDefs[Lich.SurfaceKey[definition.diggableSrfc]];
                if (!level1) {
                    level1 = {};
                    self.mapSurfaceTransitionsDefs[Lich.SurfaceKey[definition.diggableSrfc]] = level1;
                }
                level1[Lich.SurfaceKey[definition.borderSrfc]] = definition.transitionKey;
                self.mapSurfaceTransitionsAliasDefs[Lich.SurfaceKey[definition.transitionKey]] = definition.diggableSrfc;
                self.mapTransitionSrfcs[Lich.SurfaceKey[definition.transitionKey]] = definition;
            });
            // Definice pozadí mapových povrchů
            Lich.SURFACE_BGR_DEFS.forEach(function (definition) {
                self.mapSurfacesBgrDefs[Lich.SurfaceBgrKey[definition.mapObjKey]] = definition;
            });
            // Definice mapových objektů
            Lich.MAP_OBJECT_DEFS.forEach(function (definition) {
                self.mapObjectDefs[definition.mapObjKey] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapObjectDefsFreqPool.insert(definition);
                }
            });
            // Definice inventárních objektů 
            Lich.INVENTORY_DEFS(self).forEach(function (definition) {
                self.invObjectDefs[definition.invKey] = definition;
            });
            // Definice spells
            var SPELL_DEFS = [
                new Lich.MeteorSpellDef(),
                new Lich.FireballSpellDef(),
                new Lich.DigSpellDef(),
                new Lich.DigBgrSpellDef(),
                new Lich.PlaceSpellDef(),
                new Lich.PlaceBgrSpellDef(),
                new Lich.BoltSpellDef(),
                new Lich.EnemySpellDef(),
                new Lich.TeleportSpellDef(),
                new Lich.UseItemSpellDef()
            ];
            SPELL_DEFS.forEach(function (definition) {
                self.spellDefs.insert(Lich.SpellKey[definition.key], definition);
            });
        }
        Resources.prototype.isLoaderDone = function () { return this.loaderDone; };
        ;
        Resources.getInstance = function () {
            if (!Resources.INSTANCE) {
                Resources.INSTANCE = new Resources();
            }
            return Resources.INSTANCE;
        };
        ;
        Resources.prototype.getSurfaceBgrDef = function (key) {
            return this.mapSurfacesBgrDefs[Lich.SurfaceBgrKey[key]];
        };
        Resources.prototype.getSurfaceDef = function (key) {
            // nejprve zkus, zda to není přechodový povrch, 
            // který by se měl přeložit na jeho reálný povrch
            var coveredSrfcKey = this.mapSurfaceTransitionsAliasDefs[Lich.SurfaceKey[key]];
            if (coveredSrfcKey)
                key = coveredSrfcKey;
            return this.mapSurfaceDefs[Lich.SurfaceKey[key]];
        };
        Resources.prototype.getTransitionSurface = function (outerSrfc, innerSrfc) {
            var level1 = this.mapSurfaceTransitionsDefs[Lich.SurfaceKey[outerSrfc]];
            if (!level1)
                return undefined;
            return level1[Lich.SurfaceKey[innerSrfc]];
        };
        Resources.prototype.getImage = function (key) {
            return this.loader.getResult(key);
        };
        ;
        Resources.prototype.getBitmap = function (key) {
            var btm = new createjs.Bitmap(this.getImage(key));
            return btm;
        };
        ;
        Resources.prototype.getSpritePart = function (key, tileX, tileY, count, width, height) {
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
        // Jméno klíče, pod kterým bude v cookies uložen USER DB 
        // klíč záznamu jeho SAVE na serveru  
        Resources.COOKIE_KEY = "LICH_ENGINE_COOKIE_USER_KEY";
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
        return Resources;
    }());
    Lich.Resources = Resources;
})(Lich || (Lich = {}));
