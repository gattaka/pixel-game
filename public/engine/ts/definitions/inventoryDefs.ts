namespace Lich {
    let xmasGiftSpawn = (world: World): boolean => {
        let inv;
        switch (Math.floor(Math.random() * 8)) {
            case 0: inv = InventoryKey.INV_XMAS_HOLLY_KEY; break;
            case 1: inv = InventoryKey.INV_XMAS_CHAIN_KEY; break;
            case 2: inv = InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY; break;
            case 3: inv = InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY; break;
            case 4: inv = InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY; break;
            case 5: inv = InventoryKey.INV_XMAS_RED_BAUBLE_KEY; break;
            case 6: inv = InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY; break;
            case 7: inv = InventoryKey.INV_ADVENT_WREATH_KEY; break;
        }
        world.spawnObject(new DugObjDefinition(inv, 1), world.hero.x, world.hero.y, false);
        return true;
    };

    export let INVENTORY_DEFS = (res: Resources): Array<InvObjDefinition> => {
        return [
            // neusaditelných
            new InvObjDefinition(InventoryKey.INV_BONES_KEY, UISpriteKey.UI_INV_BONES_KEY),
            new InvObjDefinition(InventoryKey.INV_WOOD_KEY, UISpriteKey.UI_INV_WOOD_KEY),
            new InvObjDefinition(InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY, UISpriteKey.UI_INV_XMAS_YELLOW_BAUBLE_KEY),
            new InvObjDefinition(InventoryKey.INV_LOVEARROW_KEY, UISpriteKey.UI_INV_LOVEARROW_KEY),
            new InvObjDefinition(InventoryKey.INV_SNOWBALL_KEY, UISpriteKey.UI_INV_SNOWBALL_KEY),
            new InvObjDefinition(InventoryKey.INV_CHICKEN_TALON_KEY, UISpriteKey.UI_INV_CHICKEN_TALON_KEY),
            new InvObjDefinition(InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY, UISpriteKey.UI_INV_XMAS_BLUE_BAUBLE_KEY),
            new InvObjDefinition(InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY, UISpriteKey.UI_INV_XMAS_GREEN_BAUBLE_KEY),
            new InvObjDefinition(InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY, UISpriteKey.UI_INV_XMAS_PURPLE_BAUBLE_KEY),
            new InvObjDefinition(InventoryKey.INV_XMAS_RED_BAUBLE_KEY, UISpriteKey.UI_INV_XMAS_RED_BAUBLE_KEY),
            new InvObjDefinition(InventoryKey.INV_SNOWFLAKE_KEY, UISpriteKey.UI_INV_SNOWFLAKE_KEY),
            new InvObjDefinition(InventoryKey.INV_EASTER_EGG1_KEY, UISpriteKey.UI_INV_EASTER_EGG1_KEY),
            new InvObjDefinition(InventoryKey.INV_EASTER_EGG2_KEY, UISpriteKey.UI_INV_EASTER_EGG2_KEY),
            new InvObjDefinition(InventoryKey.INV_EASTER_EGG3_KEY, UISpriteKey.UI_INV_EASTER_EGG3_KEY),
            new InvObjDefinition(InventoryKey.INV_EASTER_WHIP_KEY, UISpriteKey.UI_INV_EASTER_WHIP_KEY),
            new InvObjDefinition(InventoryKey.INV_STRANGE_EGG_KEY, UISpriteKey.UI_INV_STRANGE_EGG_KEY).setConsumeAction((world: World): boolean => {
                Mixer.playSound(SoundKey.SND_ALIEN_SPAWN_KEY);
                SpawnPool.getInstance().spawn(Enemy.Alien, world);
                return true;
            }),
            // usaditelných jako objekt
            new InvObjDefinition(InventoryKey.INV_ARMCHAIR_KEY, UISpriteKey.UI_INV_ARMCHAIR_KEY, res.mapObjectDefs[MapObjectKey.MAP_ARMCHAIR_KEY]),
            new InvObjDefinition(InventoryKey.INV_BOOKS_KEY, UISpriteKey.UI_INV_BOOKS_KEY, res.mapObjectDefs[MapObjectKey.MAP_BOOKS_KEY]),
            new InvObjDefinition(InventoryKey.INV_BOOKSHELF_KEY, UISpriteKey.UI_INV_BOOKSHELF_KEY, res.mapObjectDefs[MapObjectKey.MAP_BOOKSHELF_KEY]),
            new InvObjDefinition(InventoryKey.INV_CABINET_KEY, UISpriteKey.UI_INV_CABINET_KEY, res.mapObjectDefs[MapObjectKey.MAP_CABINET_KEY]),
            new InvObjDefinition(InventoryKey.INV_CANDLE_KEY, UISpriteKey.UI_INV_CANDLE_KEY, res.mapObjectDefs[MapObjectKey.MAP_CANDLE_KEY]),
            new InvObjDefinition(InventoryKey.INV_PORTRAIT_VALENTIMON_KEY, UISpriteKey.UI_INV_PORTRAIT_VALENTIMON_KEY, res.mapObjectDefs[MapObjectKey.MAP_PORTRAIT_VALENTIMON_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM_KEY, UISpriteKey.UI_INV_MUSHROOM_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM2_KEY, UISpriteKey.UI_INV_MUSHROOM2_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM2_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM3_KEY, UISpriteKey.UI_INV_MUSHROOM3_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM3_KEY]),
            new InvObjDefinition(InventoryKey.INV_BERRY_KEY, UISpriteKey.UI_INV_BERRY_KEY, res.mapObjectDefs[MapObjectKey.MAP_BERRY_KEY]),
            new InvObjDefinition(InventoryKey.INV_RED_PLANT_KEY, UISpriteKey.UI_INV_PLANT_KEY, res.mapObjectDefs[MapObjectKey.MAP_RED_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_MAGENTA_PLANT_KEY, UISpriteKey.UI_INV_PLANT2_KEY, res.mapObjectDefs[MapObjectKey.MAP_MAGENTA_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CYAN_PLANT_KEY, UISpriteKey.UI_INV_PLANT3_KEY, res.mapObjectDefs[MapObjectKey.MAP_CYAN_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_YELLOW_PLANT_KEY, UISpriteKey.UI_INV_PLANT4_KEY, res.mapObjectDefs[MapObjectKey.MAP_YELLOW_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CAMPFIRE_KEY, UISpriteKey.UI_INV_CAMPFIRE_KEY, res.mapObjectDefs[MapObjectKey.MAP_CAMPFIRE_KEY]),
            new InvObjDefinition(InventoryKey.INV_FIREPLACE_KEY, UISpriteKey.UI_INV_FIREPLACE_KEY, res.mapObjectDefs[MapObjectKey.MAP_FIREPLACE_KEY]),
            new InvObjDefinition(InventoryKey.INV_TORCH_KEY, UISpriteKey.UI_INV_TORCH_KEY, res.mapObjectDefs[MapObjectKey.MAP_TORCH_KEY]),
            new InvObjDefinition(InventoryKey.INV_ANVIL_KEY, UISpriteKey.UI_INV_ANVIL_KEY, res.mapObjectDefs[MapObjectKey.MAP_ANVIL_KEY]),
            new InvObjDefinition(InventoryKey.INV_SMELTER_KEY, UISpriteKey.UI_INV_SMELTER_KEY, res.mapObjectDefs[MapObjectKey.MAP_SMELTER_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_INGOT_KEY, UISpriteKey.UI_INV_IRON_INGOT_KEY, res.mapObjectDefs[MapObjectKey.MAP_IRON_INGOT_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_FENCE_KEY, UISpriteKey.UI_INV_IRON_FENCE_KEY, res.mapObjectDefs[MapObjectKey.MAP_IRON_FENCE_KEY]),
            new InvObjDefinition(InventoryKey.INV_GRAVE_KEY, UISpriteKey.UI_INV_GRAVE_KEY, res.mapObjectDefs[MapObjectKey.MAP_GRAVE_KEY]),
            new InvObjDefinition(InventoryKey.INV_KNIGHT_STATUE_KEY, UISpriteKey.UI_INV_KNIGHT_STATUE_KEY, res.mapObjectDefs[MapObjectKey.MAP_KNIGHT_STATUE_KEY]),
            new InvObjDefinition(InventoryKey.INV_BANNER_KEY, UISpriteKey.UI_INV_BANNER_KEY, res.mapObjectDefs[MapObjectKey.MAP_BANNER_KEY]),
            new InvObjDefinition(InventoryKey.INV_FLOWER_POT_KEY, UISpriteKey.UI_INV_FLOWER_POT_KEY, res.mapObjectDefs[MapObjectKey.MAP_FLOWER_POT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CHANDELIER_KEY, UISpriteKey.UI_INV_CHANDELIER_KEY, res.mapObjectDefs[MapObjectKey.MAP_CHANDELIER_KEY]),
            new InvObjDefinition(InventoryKey.INV_CAULDRON_KEY, UISpriteKey.UI_INV_CAULDRON_KEY, res.mapObjectDefs[MapObjectKey.MAP_CAULDRON_KEY]),
            new InvObjDefinition(InventoryKey.INV_SNOWMAN_KEY, UISpriteKey.UI_INV_SNOWMAN_KEY, res.mapObjectDefs[MapObjectKey.MAP_SNOWMAN_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_HOLLY_KEY, UISpriteKey.UI_INV_XMAS_HOLLY_KEY, res.mapObjectDefs[MapObjectKey.MAP_XMAS_HOLLY_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_CHAIN_KEY, UISpriteKey.UI_INV_XMAS_CHAIN_KEY, res.mapObjectDefs[MapObjectKey.MAP_XMAS_CHAIN_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_TREE_KEY, UISpriteKey.UI_INV_XMAS_TREE_KEY, res.mapObjectDefs[MapObjectKey.MAP_XMAS_TREE_KEY]),
            new InvObjDefinition(InventoryKey.INV_ADVENT_WREATH_KEY, UISpriteKey.UI_INV_ADVENT_WREATH_KEY, res.mapObjectDefs[MapObjectKey.MAP_ADVENT_WREATH_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_COINS_KEY, UISpriteKey.UI_INV_GOLD_COINS2_KEY, res.mapObjectDefs[MapObjectKey.MAP_GOLD_COINS_KEY]),
            new InvObjDefinition(InventoryKey.INV_SILVER_COINS_KEY, UISpriteKey.UI_INV_SILVER_COINS_KEY, res.mapObjectDefs[MapObjectKey.MAP_SILVER_COINS_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_DISHES_KEY, UISpriteKey.UI_INV_GOLD_DISHES_KEY, res.mapObjectDefs[MapObjectKey.MAP_GOLD_DISHES_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_DISHES2_KEY, UISpriteKey.UI_INV_GOLD_DISHES2_KEY, res.mapObjectDefs[MapObjectKey.MAP_GOLD_DISHES2_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_BOWL_KEY, UISpriteKey.UI_INV_GOLD_BOWL_KEY, res.mapObjectDefs[MapObjectKey.MAP_GOLD_BOWL_KEY]),
            new InvObjDefinition(InventoryKey.INV_GIFT1_KEY, UISpriteKey.UI_INV_GIFT1_KEY).setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_GIFT2_KEY, UISpriteKey.UI_INV_GIFT2_KEY).setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_GIFT3_KEY, UISpriteKey.UI_INV_GIFT3_KEY).setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_LOVELETTER_KEY, UISpriteKey.UI_INV_LOVELETTER_KEY).setConsumeAction((world: World): boolean => {
                if (!Enemy.CupidBoss.spawned) {
                    SpawnPool.getInstance().spawn(Enemy.CupidBoss, world);
                    return true;
                }
                return false;
            }),
            new InvObjDefinition(InventoryKey.INV_CHICKEN_MEAT_KEY, UISpriteKey.UI_INV_CHICKEN_MEAT_KEY).setConsumeAction((world: World): boolean => {
                // TODO 
                Mixer.playSound(SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    let health = 10;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.fixedWidth * Math.random(), world.hero.y);
                    return true;
                } else {
                    return false;
                }
            }),
            new InvObjDefinition(InventoryKey.INV_RED_FLASK_KEY, UISpriteKey.UI_INV_RED_FLASK_KEY, res.mapObjectDefs[MapObjectKey.MAP_RED_FLASK_KEY]).setConsumeAction((world: World): boolean => {
                // TODO 
                Mixer.playSound(SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    let health = 30;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.fixedWidth * Math.random(), world.hero.y);
                    return true;
                } else {
                    return false;
                }
            }),
            new InvObjDefinition(InventoryKey.INV_DOOR_KEY, UISpriteKey.UI_INV_DOOR_KEY, res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOOD_CHAIR_KEY, UISpriteKey.UI_INV_WOOD_CHAIR_KEY, res.mapObjectDefs[MapObjectKey.MAP_WOOD_CHAIR_KEY])
                .setMapObjAlternative(res.mapObjectDefs[MapObjectKey.MAP_WOOD_CHAIR2_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOOD_TABLE_KEY, UISpriteKey.UI_INV_WOOD_TABLE_KEY, res.mapObjectDefs[MapObjectKey.MAP_WOOD_TABLE_KEY]),

            // usaditelných jako povrch
            new InvObjDefinition(InventoryKey.INV_DIRT_KEY, UISpriteKey.UI_INV_DIRT_KEY, res.getSurfaceDef(SurfaceKey.SRFC_DIRT_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOODWALL_KEY, UISpriteKey.UI_INV_WOODWALL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_WOODWALL_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY)),
            new InvObjDefinition(InventoryKey.INV_BRICK_KEY, UISpriteKey.UI_INV_BRICK_KEY, res.getSurfaceDef(SurfaceKey.SRFC_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_BRICK_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_KEY, UISpriteKey.UI_INV_ROCK_BRICK_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY)),
            new InvObjDefinition(InventoryKey.INV_STRAW_KEY, UISpriteKey.UI_INV_STRAW_KEY, res.getSurfaceDef(SurfaceKey.SRFC_STRAW_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_STRAW_KEY)),
            new InvObjDefinition(InventoryKey.INV_KRYSTAL_KEY, UISpriteKey.UI_INV_KRYSTALS_KEY, res.getSurfaceDef(SurfaceKey.SRFC_KRYSTAL_KEY)),
            new InvObjDefinition(InventoryKey.INV_FLORITE_KEY, UISpriteKey.UI_INV_FLORITE_KEY, res.getSurfaceDef(SurfaceKey.SRFC_FLORITE_KEY)),
            new InvObjDefinition(InventoryKey.INV_IRON_KEY, UISpriteKey.UI_INV_IRON_KEY, res.getSurfaceDef(SurfaceKey.SRFC_IRON_KEY)),
            new InvObjDefinition(InventoryKey.INV_COAL_KEY, UISpriteKey.UI_INV_COAL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_COAL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_KEY, UISpriteKey.UI_INV_ROCK_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_KEY)),
            new InvObjDefinition(InventoryKey.INV_IRON_PLATFORM_KEY, UISpriteKey.UI_INV_IRON_PLATFORM_KEY, res.getSurfaceDef(SurfaceKey.SRFC_IRON_PLATFORM_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOOD_PLATFORM_KEY, UISpriteKey.UI_INV_WOOD_PLATFORM_KEY, res.getSurfaceDef(SurfaceKey.SRFC_WOOD_PLATFORM_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOOD_LADDER_KEY, UISpriteKey.UI_INV_WOOD_LADDER_KEY, res.getSurfaceDef(SurfaceKey.SRFC_WOOD_LADDER_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_KEY, UISpriteKey.UI_INV_ROOF_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROOF_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROOF_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_TL_KEY, UISpriteKey.UI_INV_ROOF_TL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROOF_TL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_TR_KEY, UISpriteKey.UI_INV_ROOF_TR_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROOF_TR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TL_KEY, UISpriteKey.UI_INV_ROCK_BRICK_TL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_TL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TR_KEY, UISpriteKey.UI_INV_ROCK_BRICK_TR_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_TR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BL_KEY, UISpriteKey.UI_INV_ROCK_BRICK_BL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_BL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BR_KEY, UISpriteKey.UI_INV_ROCK_BRICK_BR_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_BR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_WINDOW_KEY, UISpriteKey.UI_INV_ROCK_BRICK_WINDOW_KEY).setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_WINDOW_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOODWALL_WINDOW_KEY, UISpriteKey.UI_INV_WOODWALL_WINDOW_KEY).setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_WOODWALL_WINDOW_KEY)),
            new InvObjDefinition(InventoryKey.INV_CHAIN_LADDER_KEY, UISpriteKey.UI_INV_CHAIN_LADDER_KEY, res.getSurfaceDef(SurfaceKey.SRFC_CHAIN_LADDER_KEY)),
            new InvObjDefinition(InventoryKey.INV_GOLD_KEY, UISpriteKey.UI_INV_GOLD_KEY, res.getSurfaceDef(SurfaceKey.SRFC_GOLD_KEY))
        ];
    }
}