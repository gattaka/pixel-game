var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            // definice povrchů a pozadí povrchů
            this.mapSurfaceDefs = {};
            this.mapSurfaceBgrDefs = {};
            // dle aliasovaného povrchu
            this.mapSurfaceTransitionsDefs = {};
            this.mapSurfaceBgrTransitionsDefs = {};
            // dle trans povrchu
            this.mapTransitionSrfcDefs = {};
            this.mapTransitionSrfcBgrsDefs = {};
            // definice pozadí scény
            this.backgroundDefs = {};
            // definice ui prvků
            this.uiSpriteDefs = {};
            // definice fontů 
            this.fontsSpriteDefs = {};
            // definice achievementů 
            this.achievementsDefs = {};
            // definice objektů
            this.mapObjectDefs = new Array();
            // Frekvenční pooly pro losování při vytváření/osazování světa 
            this.mapSurfacesFreqPool = new FreqPool();
            this.mapObjectDefsFreqPool = new FreqPool();
            /**
             * Texture cache
             */
            // I. SpriteSheet (například 'map_objekty')
            // II. SpriteSheet sprite (například 'fireplace')
            // III. FragmentFrameId (například fragment-3-4-frame-2)
            this.textureCache = {};
            /**
             * Sprite info
             */
            // Mapa inventářových položek dle jejich sprite jména
            this.invObjectDefsBySpriteName = {};
            // Mapa mapových objektů dle jejich sprite jména
            this.mapObjectDefsBySpriteName = {};
            // Mapa povrchů dle jejich sprite jména
            this.mapSurfaceDefsBySpriteName = {};
            // Mapa pozadí povrchů dle jejich sprite jména
            this.mapSurfaceBgrDefsBySpriteName = {};
            // Mapa přechodových povrchů dle jejich sprite jména
            this.mapTransitionSrfcDefsBySpriteName = {};
            // Mapa přechodových pozadí povrchů dle jejich sprite jména
            this.mapTransitionSrfcBgrDefsBySpriteNameMap = {};
            /**
             * Spritesheet info
             */
            // Mapa spritesheets dle klíče 
            this.spritesheetByKeyMap = {};
            // Mapa sprites dle jejich souborového jména ve spritesheet dle jeho klíče
            this.spriteItemDefsBySheetByName = {};
            /**
             * Animace
             */
            // Mapa definic animací dle klíče
            this.animationSetDefsByKey = {};
            // Mapa definic animací dle souborového jména sub-spritesheet
            this.animationSetDefsBySpriteName = {};
            // definice inv položek dle klíče (int)
            this.invObjectDefs = new Array();
            // definice spells
            this.spellDefs = {};
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
                // SpriteSheet definice
                Lich.SPRITESHEETS_PATHS.forEach(function (path) {
                    var key = path[2];
                    var stringKey = Lich.SpritesheetKey[path[2]];
                    var spritesheetImg = self.getImage(stringKey + Resources.SPRITESHEET_IMAGE_SUFFIX);
                    var spritesheetDefsArr = self.loader.getResult(stringKey + Resources.SPRITESHEET_MAP_SUFFIX);
                    var spritesheetDefsMap = {};
                    for (var i = 0; i < spritesheetDefsArr.length; i++) {
                        // každý sprite rovnou zaregistruj pod jeho jménem a číslem
                        var sd = spritesheetDefsArr[i];
                        var sDef = new SpriteItemDef(frames.length, sd["name"], sd["x"], sd["y"], sd["width"], sd["height"]);
                        spritesheetDefsMap[sd["name"]] = sDef;
                    }
                    self.spritesheetByKeyMap[stringKey] = PIXI.Texture.from(spritesheetImg);
                    self.spriteItemDefsBySheetByName[stringKey] = spritesheetDefsMap;
                });
                Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_FINISHED));
            });
            Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.LOAD_START));
            self.loader.loadManifest(manifest, true);
            // background
            Lich.BACKGROUND_DEFS.forEach(function (def) {
                self.backgroundDefs[Lich.BackgroundKey[def[1]]] = def[0];
            });
            // ui
            Lich.UI_DEFS.forEach(function (def) {
                self.uiSpriteDefs[Lich.UISpriteKey[def[1]]] = def[0];
            });
            // fonts
            Lich.FONT_DEFS.forEach(function (def) {
                var index = {};
                def[1].forEach(function (char) {
                    index[char[0]] = char[1];
                });
                self.fontsSpriteDefs[Lich.FontKey[def[0]]] = index;
            });
            // Definice mapových povrchů
            Lich.SURFACE_DEFS.forEach(function (definition) {
                self.mapSurfaceDefs[Lich.SurfaceKey[definition.mapObjKey]] = definition;
                self.mapSurfaceDefsBySpriteName[definition.spriteName] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapSurfacesFreqPool.insert(definition);
                }
            });
            // Definice přechodů mapových povrchů
            Lich.SURFACE_TRANSITION_DEFS.forEach(function (definition) {
                self.mapSurfaceTransitionsDefs[Lich.SurfaceKey[definition.diggableSrfc]] = definition;
                self.mapTransitionSrfcDefs[Lich.SurfaceKey[definition.transitionKey]] = definition;
                self.mapTransitionSrfcDefsBySpriteName[definition.spriteName] = definition;
            });
            // Definice pozadí mapových povrchů
            Lich.SURFACE_BGR_DEFS.forEach(function (definition) {
                self.mapSurfaceBgrDefs[Lich.SurfaceBgrKey[definition.mapObjKey]] = definition;
                self.mapSurfaceBgrDefsBySpriteName[definition.spriteName] = definition;
            });
            // TODO Definice přechodů pozadí mapových povrchů
            // mapTransitionSrfcBgrDefsBySpriteNameMap
            // Definice mapových objektů
            Lich.MAP_OBJECT_DEFS.forEach(function (definition) {
                self.mapObjectDefs[definition.mapObjKey] = definition;
                self.mapObjectDefsBySpriteName[definition.spriteName] = definition;
                if (definition.seedCooldown > 0) {
                    self.mapObjectDefsFreqPool.insert(definition);
                }
            });
            // Definice inventárních objektů 
            Lich.INVENTORY_DEFS(self).forEach(function (definition) {
                self.invObjectDefs[definition.invKey] = definition;
                self.invObjectDefsBySpriteName[definition.spriteName] = definition;
            });
            // Definice achievementů
            Lich.ACHIEVEMENTS_DEFS.forEach(function (definition) {
                self.achievementsDefs[Lich.AchievementKey[definition.key]] = definition;
            });
            // Definice animací
            Lich.ANIMATION_DEFS.forEach(function (definition) {
                self.animationSetDefsBySpriteName[definition.spriteName] = definition;
                self.animationSetDefsByKey[definition.animationSetKey] = definition;
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
                self.spellDefs[Lich.SpellKey[definition.key]] = definition;
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
            return this.mapSurfaceBgrDefs[Lich.SurfaceBgrKey[key]];
        };
        Resources.prototype.getSurfaceDef = function (key) {
            // nejprve zkus, zda to není přechodový povrch, 
            // který by se měl přeložit na jeho reálný povrch
            var transition = this.mapTransitionSrfcDefs[Lich.SurfaceKey[key]];
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
        Resources.prototype.getSpellDef = function (key) {
            return this.spellDefs[Lich.SpellKey[key]];
        };
        ;
        Resources.prototype.getImage = function (key) {
            return this.loader.getResult(key);
        };
        ;
        Resources.prototype.createFragmentFrameKey = function (frameId, fragmentId) {
            return Resources.FRAME_KEY + "-" + frameId + "-" + Resources.FRAGMENT_KEY + "-" + fragmentId;
        };
        Resources.prototype.getFromTextureCache = function (stringSheetKey, spriteName, frameId, fragmentId) {
            var spriteSheetNode = this.textureCache[stringSheetKey];
            if (spriteSheetNode) {
                var spriteNameNode = spriteSheetNode[spriteName];
                if (spriteNameNode)
                    return spriteNameNode[this.createFragmentFrameKey(frameId, fragmentId)];
            }
            return undefined;
        };
        Resources.prototype.putInTextureCache = function (stringSheetKey, spriteName, frameId, fragmentId, texture) {
            var spriteSheetNode = this.textureCache[stringSheetKey];
            if (!spriteSheetNode) {
                spriteSheetNode = {};
                this.textureCache[stringSheetKey] = spriteSheetNode;
            }
            var spriteNameNode = spriteSheetNode[spriteName];
            if (!spriteNameNode) {
                spriteNameNode = {};
                spriteSheetNode[spriteName] = spriteNameNode;
            }
            spriteNameNode[this.createFragmentFrameKey(frameId, fragmentId)] = texture;
        };
        Resources.prototype.getSurfaceTileSprite = function (surfaceKey, positionIndex, originalSprite) {
            var self = this;
            var stringSheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_SRFC_KEY];
            var srfcDef = self.mapSurfaceDefs[Lich.SurfaceKey[surfaceKey]] || self.mapTransitionSrfcDefs[Lich.SurfaceKey[surfaceKey]];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][srfcDef.spriteName];
            var texture = this.getFromTextureCache(stringSheetKey, srfcDef.spriteName, 1, positionIndex);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                var wSplicing = spriteDef.width / Resources.TILE_SIZE;
                texture.frame = new PIXI.Rectangle(spriteDef.x + (positionIndex % wSplicing) * Resources.TILE_SIZE, spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE, Resources.TILE_SIZE, Resources.TILE_SIZE);
                this.putInTextureCache(stringSheetKey, srfcDef.spriteName, 1, positionIndex, texture);
            }
            var sprite = originalSprite ? originalSprite : new PIXI.Sprite(texture);
            sprite.texture = texture;
            return sprite;
        };
        ;
        Resources.prototype.getSurfaceBgrTileSprite = function (surfaceBgrKey, positionIndex, originalSprite) {
            var self = this;
            var stringSheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_SRFC_BGR_KEY];
            var srfcBgrDef = self.mapSurfaceBgrDefs[Lich.SurfaceBgrKey[surfaceBgrKey]] || self.mapTransitionSrfcBgrsDefs[Lich.SurfaceBgrKey[surfaceBgrKey]];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][srfcBgrDef.spriteName];
            var texture = this.getFromTextureCache(stringSheetKey, srfcBgrDef.spriteName, 1, positionIndex);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                var wSplicing = spriteDef.width / Resources.TILE_SIZE;
                texture.frame = new PIXI.Rectangle(spriteDef.x + (positionIndex % wSplicing) * Resources.TILE_SIZE, spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE, Resources.TILE_SIZE, Resources.TILE_SIZE);
                this.putInTextureCache(stringSheetKey, srfcBgrDef.spriteName, 1, positionIndex, texture);
            }
            var sprite = originalSprite ? originalSprite : new PIXI.Sprite(texture);
            sprite.texture = texture;
            return sprite;
        };
        ;
        Resources.prototype.getFogSprite = function (positionIndex, originalSprite) {
            var self = this;
            if (positionIndex || positionIndex == 0) {
                positionIndex = positionIndex;
            }
            else {
                positionIndex = Lich.FogTile.MM;
            }
            var stringSheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_FOG_KEY];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][Lich.FOG_DEF[0]];
            var texture = this.getFromTextureCache(stringSheetKey, Lich.FOG_DEF[0], 1, positionIndex);
            if (!texture) {
                texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                var wSplicing = spriteDef.width / Resources.PARTS_SIZE;
                texture.frame = new PIXI.Rectangle(spriteDef.x + (positionIndex % wSplicing) * Resources.PARTS_SIZE, spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.PARTS_SIZE, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
                this.putInTextureCache(stringSheetKey, Lich.FOG_DEF[0], 1, positionIndex, texture);
            }
            var sprite = originalSprite ? originalSprite : new PIXI.Sprite(texture);
            sprite.texture = texture;
            return sprite;
        };
        ;
        Resources.prototype.getMapObjectTileSprite = function (mapObjectKey, positionIndex) {
            var self = this;
            var stringSheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_MPO_KEY];
            var mapObjectDef = self.mapObjectDefs[mapObjectKey];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][mapObjectDef.spriteName];
            var wSplicing = spriteDef.width / Resources.TILE_SIZE;
            if (mapObjectDef.frames > 1) {
                var frames = [];
                for (var i = 0; i < mapObjectDef.frames; i++) {
                    var texture = this.getFromTextureCache(stringSheetKey, mapObjectDef.spriteName, i, positionIndex);
                    if (!texture) {
                        texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                        texture.frame = new PIXI.Rectangle(spriteDef.x + (positionIndex % wSplicing + i * mapObjectDef.mapSpriteWidth) * Resources.TILE_SIZE, spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE, Resources.TILE_SIZE, Resources.TILE_SIZE);
                        this.putInTextureCache(stringSheetKey, mapObjectDef.spriteName, i, positionIndex, texture);
                    }
                    frames.push(texture);
                }
                var anim = new PIXI.extras.AnimatedSprite(frames);
                anim.animationSpeed = 0.2;
                anim.play();
                return anim;
            }
            else {
                var texture = this.getFromTextureCache(stringSheetKey, mapObjectDef.spriteName, 1, positionIndex);
                if (!texture) {
                    texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                    texture.frame = new PIXI.Rectangle(spriteDef.x + (positionIndex % wSplicing) * Resources.TILE_SIZE, spriteDef.y + Math.floor(positionIndex / wSplicing) * Resources.TILE_SIZE, Resources.TILE_SIZE, Resources.TILE_SIZE);
                    this.putInTextureCache(stringSheetKey, mapObjectDef.spriteName, 1, positionIndex, texture);
                }
                var sprite = new PIXI.Sprite(texture);
                sprite.texture = texture;
                return sprite;
            }
        };
        ;
        Resources.prototype.getBackgroundSprite = function (key, width, height) {
            var self = this;
            var stringSheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_BGR_KEY];
            var bgrSprite = self.backgroundDefs[Lich.BackgroundKey[key]];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][bgrSprite];
            var spriteSheet = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
            spriteSheet.frame = new PIXI.Rectangle(spriteDef.x, spriteDef.y, spriteDef.width, spriteDef.height);
            var tilingSprite = new BackgroundSprite(spriteSheet, width, height ? height : spriteDef.height);
            tilingSprite.originalHeight = spriteDef.height;
            tilingSprite.originalWidth = spriteDef.width;
            return tilingSprite;
        };
        ;
        Resources.prototype.getFontSprite = function (key, char) {
            var self = this;
            var stringSheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_FNT_KEY];
            var sprite = new PIXI.Sprite(self.spritesheetByKeyMap[stringSheetKey]);
            var fontDef = self.fontsSpriteDefs[Lich.FontKey[key]];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][fontDef[char]];
            // není animovaný, takže vždy předávám číslo snímku
            // sprite.gotoAndStop(spriteDef.frame);
            sprite.fixedWidth = spriteDef.width;
            sprite.fixedHeight = spriteDef.height;
            return sprite;
        };
        ;
        Resources.prototype.getBasicSprite = function (sheetKey, spriteName) {
            var self = this;
            var stringSheetKey = Lich.SpritesheetKey[sheetKey];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][spriteName];
            var spriteSheet = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
            spriteSheet.frame = new PIXI.Rectangle(spriteDef.x, spriteDef.y, spriteDef.width, spriteDef.height);
            var sprite = new PIXI.Sprite(spriteSheet);
            return sprite;
        };
        ;
        Resources.prototype.getAchvUISprite = function (key) {
            return this.getBasicSprite(Lich.SpritesheetKey.SPST_ACHV_KEY, this.achievementsDefs[Lich.AchievementKey[key]].spriteName);
        };
        ;
        Resources.prototype.getUISprite = function (key) {
            return this.getBasicSprite(Lich.SpritesheetKey.SPST_UI_KEY, this.uiSpriteDefs[Lich.UISpriteKey[key]]);
        };
        ;
        Resources.prototype.getSpellUISprite = function (key, originalSprite) {
            return this.getBasicSprite(Lich.SpritesheetKey.SPST_UI_KEY, this.spellDefs[Lich.SpellKey[key]].iconSpriteName);
        };
        ;
        Resources.prototype.getInvObjectSprite = function (key, originalSprite) {
            return this.getBasicSprite(Lich.SpritesheetKey.SPST_INV_KEY, this.invObjectDefs[key].spriteName);
        };
        ;
        Resources.prototype.getAnimatedObjectSprite = function (animation) {
            var self = this;
            var animationDef = self.animationSetDefsByKey[animation];
            var stringSheetKey = Lich.SpritesheetKey[Lich.SpritesheetKey.SPST_ANM_KEY];
            var spriteDef = self.spriteItemDefsBySheetByName[stringSheetKey][animationDef.spriteName];
            var frames = [];
            var xFrames = spriteDef.width / animationDef.width;
            var yFrames = spriteDef.height / animationDef.height;
            for (var j = 0; j < yFrames; j++) {
                for (var i = 0; i < xFrames; i++) {
                    if (frames.length >= animationDef.frames)
                        break;
                    var texture = new PIXI.Texture(self.spritesheetByKeyMap[stringSheetKey].baseTexture);
                    texture.frame = new PIXI.Rectangle(spriteDef.x + i * animationDef.width, spriteDef.y + j * animationDef.height, animationDef.width, animationDef.height);
                    frames.push(texture);
                }
            }
            var anim = new AniSprite(frames, animationDef);
            return anim;
        };
        ;
        return Resources;
    }());
    Resources.FONT = "expressway";
    Resources.TEXT_COLOR = "#FF0";
    Resources.OUTLINE_COLOR = "#000";
    Resources.WORLD_LOADER_COLOR = "#84ff00";
    Resources.DEBUG_TEXT_COLOR = "#FF0";
    Resources.REVEAL_SIZE = 13; // musí být liché
    Resources.REACH_TILES_RADIUS = 10;
    Resources.SPRITESHEET_IMAGE_SUFFIX = ".png";
    Resources.SPRITESHEET_MAP_SUFFIX = ".json";
    Resources.SPRITE_FRAMERATE = 0.2;
    Resources.FRAGMENT_KEY = "fragment";
    Resources.FRAME_KEY = "frame";
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
    var BackgroundSprite = (function (_super) {
        __extends(BackgroundSprite, _super);
        function BackgroundSprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return BackgroundSprite;
    }(PIXI.extras.TilingSprite));
    Lich.BackgroundSprite = BackgroundSprite;
    var AniSprite = (function (_super) {
        __extends(AniSprite, _super);
        function AniSprite(frames, animationDef) {
            var _this = _super.call(this, frames) || this;
            _this.animationDef = animationDef;
            _this.onFrameChange = function (currentFrame) {
                if (_this.checkFrame != undefined && _this.checkFrame == _this.lastFrame) {
                    _this.gotoAndPlay(Lich.AnimationKey[_this.nextAnimation]);
                }
                else {
                    _this.lastFrame = currentFrame;
                }
            };
            return _this;
        }
        AniSprite.prototype.gotoAndPlay = function (arg) {
            this.stop();
            if (typeof arg === "string") {
                var animation = this.animationDef.animations[arg];
                this.lastFrame = null;
                this.currentAnimation = arg;
                this.checkFrame = animation.endFrame;
                this.nextAnimation = animation.nextAnimationKey;
                this.animationSpeed = animation.speed;
                _super.prototype.gotoAndPlay.call(this, animation.startFrame);
            }
            else {
                _super.prototype.gotoAndPlay.call(this, arg);
            }
        };
        return AniSprite;
    }(PIXI.extras.AnimatedSprite));
    Lich.AniSprite = AniSprite;
})(Lich || (Lich = {}));
