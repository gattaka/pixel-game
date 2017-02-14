/**
 * resources.js
 *
 * Přehled konstant a všeobecně užitečných zdrojů
 *
 */
var Lich;
(function (Lich) {
    var Load = (function () {
        function Load(src, id, type) {
            this.src = src;
            this.id = id;
            this.type = type;
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
    var SpriteItemDef = (function () {
        function SpriteItemDef(frame, name, x, y, width, height) {
            this.frame = frame;
            this.name = name;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return SpriteItemDef;
    }());
    Lich.SpriteItemDef = SpriteItemDef;
    var Resources = (function () {
        function Resources() {
            /**
             * DEFINICE
             */
            // definice povrchů a objektů
            this.mapSurfaceDefs = {};
            this.mapSurfacesBgrDefs = {};
            // dle aliasovaného povrchu
            this.mapSurfaceTransitionsDefs = {};
            this.mapSurfaceBgrTransitionsDefs = {};
            // dle trans povrchu
            this.mapTransitionSrfcs = {};
            this.mapTransitionSrfcBgrs = {};
            // definice achievementů 
            this.achievementsDefs = {};
            // definice objektů
            this.mapObjectDefs = new Array();
            // Frekvenční pooly pro losování při vytváření/osazování světa 
            this.mapSurfacesFreqPool = new FreqPool();
            this.mapObjectDefsFreqPool = new FreqPool();
            // Mapa spritesheets dle klíče 
            this.spritesheetByKeyMap = {};
            // Mapa sprites dle jejich souborového jména ve spritesheet dle jeho klíče
            this.spriteItemDefsBySheetByNameMap = {};
            // Mapa definic animací dle klíče animační sady
            this.animationSetDefsByKey = {};
            // Mapa definic animací dle souborového jména sub-spritesheet
            this.animationSetDefsBySubSheetName = {};
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
            // spritesheets
            Lich.SPRITESHEETS_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0] + path[1] + Resources.SPRITESHEET_IMAGE_SUFFIX, Lich.SpritesheetKey[path[2]] + Resources.SPRITESHEET_IMAGE_SUFFIX));
                manifest.push(new Load(path[0] + path[1] + Resources.SPRITESHEET_MAP_SUFFIX, Lich.SpritesheetKey[path[2]] + Resources.SPRITESHEET_MAP_SUFFIX, createjs.AbstractLoader.JSON));
            });
            // background
            Lich.BACKGROUND_PATHS.forEach(function (path) {
                manifest.push(new Load(path[0], Lich.BackgroundKey[path[1]]));
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
                Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.LOAD_PROGRESS, event.loaded));
            });
            self.loader.addEventListener("filestart", function (event) {
                Lich.EventBus.getInstance().fireEvent(new Lich.StringEventPayload(Lich.EventType.LOAD_ITEM, event.item.src));
            });
            self.loader.addEventListener("complete", function () {
                // SpriteSheet definice
                Lich.SPRITESHEETS_PATHS.forEach(function (path) {
                    var key = path[2];
                    var stringKey = Lich.SpritesheetKey[path[2]];
                    var spritesheetImg = self.getImage(stringKey + Resources.SPRITESHEET_IMAGE_SUFFIX);
                    var spritesheetDefsArr = self.loader.getResult(stringKey + Resources.SPRITESHEET_MAP_SUFFIX);
                    var spritesheetDefsMap = {};
                    self.spriteItemDefsBySheetByNameMap[stringKey] = spritesheetDefsMap;
                    var frames = [];
                    var animations = {};
                    for (var i = 0; i < spritesheetDefsArr.length; i++) {
                        var sd = spritesheetDefsArr[i];
                        var sDef = new SpriteItemDef(frames.length, sd["name"], sd["x"], sd["y"], sd["width"], sd["height"]);
                        spritesheetDefsMap[sd["name"]] = sDef;
                        frames.push([sDef.x, sDef.y, sDef.width, sDef.height]);
                        animations[sDef.name] = [frames.length - 1, frames.length - 1, name, Resources.SPRITE_FRAMERATE];
                        // Objekty nech v celku, akorát animace rozděl
                        if (Lich.SpritesheetKey.SPST_OBJECTS_KEY == key) {
                            // Pokud se jedná o animaci, rozděl ji dle rozměrů
                            var animationDef = self.animationSetDefsBySubSheetName[sDef.name];
                            if (animationDef) {
                                var frCnt = 0; // počítadlo snímků animace
                                var wSplicing = sDef.width / animationDef.width;
                                var hSplicing = sDef.height / animationDef.height;
                                // Připrav snímky
                                for (var y = 0; y < hSplicing; y++) {
                                    for (var x = 0; x < wSplicing; x++) {
                                        frames.push([sDef.x + x * animationDef.width, sDef.y + y * animationDef.height, animationDef.width, animationDef.height]);
                                        frCnt++;
                                    }
                                }
                                // Ze snímků sestav animace dle definic
                                for (var a = 0; a < animationDef.animations.length; a++) {
                                    var animDef = animationDef.animations[a];
                                    animations[Lich.AnimationKey[animDef.animation]] = [
                                        frames.length - frCnt + animDef.startFrame,
                                        frames.length - frCnt - 1 + animDef.endFrame,
                                        Lich.AnimationKey[animDef.nextAnimation],
                                        animDef.time
                                    ];
                                }
                            }
                        }
                        // Tiles rozřež a pokud jsou animované, tak ještě rozděl na animace
                        if (Lich.SpritesheetKey.SPST_TILES_KEY == key) {
                            // Připraví rozložení animace pro sektory
                            // tohle by se mělo spustit pro každý rozřezatelný objekt/povrch
                            // DEV test
                            if (sDef.name == "fireplace") {
                                var frCnt = 4; // počet snímků animace
                                var w = 8 * 8; // šířka snímku animace
                                var h = 4 * 8; // výška snímku animace
                                var spliceSide = 2 * 8; // velikost výřezu 
                                var wSplicing = w / spliceSide;
                                var hSplicing = h / spliceSide;
                                for (var y = 0; y < hSplicing; y++) {
                                    for (var x = 0; x < wSplicing; x++) {
                                        for (var f = 0; f < frCnt; f++) {
                                            // počítá se s tím, že snímky jsou zleva doprava za sebou
                                            frames.push([sDef.x + x * spliceSide + w * f, sDef.y + y * spliceSide, spliceSide, spliceSide]);
                                        }
                                        var name_1 = sDef.name + "-FRAGMENT-" + x + "-" + y;
                                        animations[name_1] = [frames.length - frCnt, frames.length - 1, name_1, Resources.SPRITE_FRAMERATE];
                                    }
                                }
                            }
                        }
                    }
                    var sheet = new createjs.SpriteSheet({
                        framerate: 10,
                        images: [spritesheetImg],
                        frames: frames,
                        animations: animations
                    });
                    self.spritesheetByKeyMap[stringKey] = sheet;
                });
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
                self.mapSurfaceTransitionsDefs[Lich.SurfaceKey[definition.diggableSrfc]] = definition;
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
            // Definice achievementů
            Lich.ACHIEVEMENTS_DEFS.forEach(function (definition) {
                self.achievementsDefs[Lich.AchievementKey[definition.key]] = definition;
            });
            // Definice animací
            Lich.ANIMATION_DEFS.forEach(function (definition) {
                self.animationSetDefsByKey[Lich.AnimationSetKey[definition.animationSetKey]] = definition;
                self.animationSetDefsBySubSheetName[definition.subSpritesheetName] = definition;
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
                new Lich.HomeSpellDef(),
                new Lich.TeleportSpellDef(),
                new Lich.UseItemSpellDef(),
                new Lich.LoveletterSpellDef(),
                new Lich.LovearrowSpellDef(),
                new Lich.RevealFogSpellDef()
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
            var transition = this.mapTransitionSrfcs[Lich.SurfaceKey[key]];
            if (transition)
                key = transition.diggableSrfc;
            return this.mapSurfaceDefs[Lich.SurfaceKey[key]];
        };
        Resources.prototype.getTransitionSurface = function (srfc) {
            var transDef = this.mapSurfaceTransitionsDefs[Lich.SurfaceKey[srfc]];
            if (!transDef)
                return undefined;
            return transDef.transitionKey;
        };
        Resources.prototype.getTransitionSurfaceBgr = function (srfc) {
            var transDef = this.mapSurfaceBgrTransitionsDefs[Lich.SurfaceBgrKey[srfc]];
            if (!transDef)
                return undefined;
            return transDef.transitionKey;
        };
        Resources.prototype.getImage = function (key) {
            return this.loader.getResult(key);
        };
        ;
        Resources.prototype.getBitmap = function (key) {
            return new createjs.Bitmap(this.getImage(key));
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
                images: [this.getImage(key)],
                frames: frames,
                animations: { "idle": [0, count - 1, "idle", Resources.SPRITE_FRAMERATE] }
            });
            var sprite = new createjs.Sprite(sheet, "idle");
            sprite.gotoAndPlay("idle");
            return sprite;
        };
        Resources.prototype.getText = function (text) {
            var self = this;
            var bitmapText = new createjs.BitmapText(text, self.spritesheetByKeyMap[Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_FONTS_KEY]]);
            return bitmapText;
        };
        Resources.prototype.getTileSprite = function (spriteKey, positionIndex) {
            var self = this;
            var key = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_TILES_KEY];
            var sprite = new createjs.Sprite(self.spritesheetByKeyMap[key]);
            if (positionIndex)
                sprite.gotoAndPlay(spriteKey + "-FRAGMENT-" + positionIndex);
            else
                sprite.gotoAndPlay(self.spriteItemDefsBySheetByNameMap[key][spriteKey].frame);
            return sprite;
        };
        ;
        Resources.prototype.getObjectSprite = function (animationSetKey) {
            var self = this;
            var sheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_OBJECTS_KEY];
            return new createjs.Sprite(self.spritesheetByKeyMap[sheetKey]);
        };
        ;
        return Resources;
    }());
    Resources.REVEAL_SIZE = 13; // musí být liché
    Resources.REACH_TILES_RADIUS = 10;
    Resources.SPRITESHEET_IMAGE_SUFFIX = ".png";
    Resources.SPRITESHEET_MAP_SUFFIX = ".json";
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
    Lich.Resources = Resources;
})(Lich || (Lich = {}));
