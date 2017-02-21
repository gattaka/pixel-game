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
            new InvObjDefinition(InventoryKey.INV_BONES_KEY, "inv_bones"),
            new InvObjDefinition(InventoryKey.INV_WOOD_KEY, "inv_wood"),
            new InvObjDefinition(InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY, "inv_xmas_yellow_bauble"),
            new InvObjDefinition(InventoryKey.INV_LOVEARROW_KEY, "inv_lovearrow"),
            new InvObjDefinition(InventoryKey.INV_SNOWBALL_KEY, "inv_snowball"),
            new InvObjDefinition(InventoryKey.INV_CHICKEN_TALON_KEY, "inv_chicken_talon"),
            new InvObjDefinition(InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY, "inv_xmas_blue_bauble"),
            new InvObjDefinition(InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY, "inv_xmas_green_bauble"),
            new InvObjDefinition(InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY, "inv_xmas_purple_bauble"),
            new InvObjDefinition(InventoryKey.INV_XMAS_RED_BAUBLE_KEY, "inv_xmas_red_bauble"),
            new InvObjDefinition(InventoryKey.INV_SNOWFLAKE_KEY, "inv_snowflake"),
            // usaditelných jako objekt
            new InvObjDefinition(InventoryKey.INV_ARMCHAIR_KEY, "inv_armchair", res.mapObjectDefs[MapObjectKey.MAP_ARMCHAIR_KEY]),
            new InvObjDefinition(InventoryKey.INV_BOOKS_KEY, "inv_books", res.mapObjectDefs[MapObjectKey.MAP_BOOKS_KEY]),
            new InvObjDefinition(InventoryKey.INV_BOOKSHELF_KEY, "inv_bookshelf", res.mapObjectDefs[MapObjectKey.MAP_BOOKSHELF_KEY]),
            new InvObjDefinition(InventoryKey.INV_CABINET_KEY, "inv_cabinet", res.mapObjectDefs[MapObjectKey.MAP_CABINET_KEY]),
            new InvObjDefinition(InventoryKey.INV_CANDLE_KEY, "inv_candle", res.mapObjectDefs[MapObjectKey.MAP_CANDLE_KEY]),
            new InvObjDefinition(InventoryKey.INV_PORTRAIT_VALENTIMON_KEY, "inv_portrait_valentimon", res.mapObjectDefs[MapObjectKey.MAP_PORTRAIT_VALENTIMON_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM_KEY, "inv_mushroom", res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM2_KEY, "inv_mushroom2", res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM2_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM3_KEY, "inv_mushroom3", res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM3_KEY]),
            new InvObjDefinition(InventoryKey.INV_BERRY_KEY, "inv_berry", res.mapObjectDefs[MapObjectKey.MAP_BERRY_KEY]),
            new InvObjDefinition(InventoryKey.INV_RED_PLANT_KEY, "inv_plant", res.mapObjectDefs[MapObjectKey.MAP_RED_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_MAGENTA_PLANT_KEY, "inv_plant2", res.mapObjectDefs[MapObjectKey.MAP_MAGENTA_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CYAN_PLANT_KEY, "inv_plant3", res.mapObjectDefs[MapObjectKey.MAP_CYAN_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_YELLOW_PLANT_KEY, "inv_plant4", res.mapObjectDefs[MapObjectKey.MAP_YELLOW_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CAMPFIRE_KEY, "inv_campfire", res.mapObjectDefs[MapObjectKey.MAP_CAMPFIRE_KEY]),
            new InvObjDefinition(InventoryKey.INV_FIREPLACE_KEY, "inv_fireplace", res.mapObjectDefs[MapObjectKey.MAP_FIREPLACE_KEY]),
            new InvObjDefinition(InventoryKey.INV_TORCH_KEY, "inv_torch", res.mapObjectDefs[MapObjectKey.MAP_TORCH_KEY]),
            new InvObjDefinition(InventoryKey.INV_ANVIL_KEY, "inv_anvil", res.mapObjectDefs[MapObjectKey.MAP_ANVIL_KEY]),
            new InvObjDefinition(InventoryKey.INV_SMELTER_KEY, "inv_smelter", res.mapObjectDefs[MapObjectKey.MAP_SMELTER_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_INGOT_KEY, "inv_iron_ingot", res.mapObjectDefs[MapObjectKey.MAP_IRON_INGOT_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_FENCE_KEY, "inv_iron_fence", res.mapObjectDefs[MapObjectKey.MAP_IRON_FENCE_KEY]),
            new InvObjDefinition(InventoryKey.INV_GRAVE_KEY, "inv_grave", res.mapObjectDefs[MapObjectKey.MAP_GRAVE_KEY]),
            new InvObjDefinition(InventoryKey.INV_KNIGHT_STATUE_KEY, "inv_knight_statue", res.mapObjectDefs[MapObjectKey.MAP_KNIGHT_STATUE_KEY]),
            new InvObjDefinition(InventoryKey.INV_BANNER_KEY, "inv_banner", res.mapObjectDefs[MapObjectKey.MAP_BANNER_KEY]),
            new InvObjDefinition(InventoryKey.INV_FLOWER_POT_KEY, "inv_flower_pot", res.mapObjectDefs[MapObjectKey.MAP_FLOWER_POT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CHANDELIER_KEY, "inv_chandelier", res.mapObjectDefs[MapObjectKey.MAP_CHANDELIER_KEY]),
            new InvObjDefinition(InventoryKey.INV_CAULDRON_KEY, "inv_cauldron", res.mapObjectDefs[MapObjectKey.MAP_CAULDRON_KEY]),
            new InvObjDefinition(InventoryKey.INV_SNOWMAN_KEY, "inv_snowman", res.mapObjectDefs[MapObjectKey.MAP_SNOWMAN_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_HOLLY_KEY, "inv_xmas_holly", res.mapObjectDefs[MapObjectKey.MAP_XMAS_HOLLY_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_CHAIN_KEY, "inv_xmas_chain", res.mapObjectDefs[MapObjectKey.MAP_XMAS_CHAIN_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_TREE_KEY, "inv_xmas_tree", res.mapObjectDefs[MapObjectKey.MAP_XMAS_TREE_KEY]),
            new InvObjDefinition(InventoryKey.INV_ADVENT_WREATH_KEY, "inv_advent_wreath", res.mapObjectDefs[MapObjectKey.MAP_ADVENT_WREATH_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_COINS_KEY, "inv_gold_coins2", res.mapObjectDefs[MapObjectKey.MAP_GOLD_COINS_KEY]),
            new InvObjDefinition(InventoryKey.INV_SILVER_COINS_KEY, "inv_silver_coins", res.mapObjectDefs[MapObjectKey.MAP_SILVER_COINS_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_DISHES_KEY, "inv_gold_dishes", res.mapObjectDefs[MapObjectKey.MAP_GOLD_DISHES_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_DISHES2_KEY, "inv_gold_dishes2", res.mapObjectDefs[MapObjectKey.MAP_GOLD_DISHES2_KEY]),
            new InvObjDefinition(InventoryKey.INV_GOLD_BOWL_KEY, "inv_gold_bowl", res.mapObjectDefs[MapObjectKey.MAP_GOLD_BOWL_KEY]),
            new InvObjDefinition(InventoryKey.INV_GIFT1_KEY, "inv_gift1").setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_GIFT2_KEY, "inv_gift2").setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_GIFT3_KEY, "inv_gift3").setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_LOVELETTER_KEY, "inv_loveletter").setConsumeAction((world: World): boolean => {
                if (!Enemy.CupidBoss.spawned) {
                    SpawnPool.getInstance().spawn(Enemy.CupidBoss, world);
                    return true;
                }
                return false;
            }),
            new InvObjDefinition(InventoryKey.INV_CHICKEN_MEAT_KEY, "inv_chicken_meat").setConsumeAction((world: World): boolean => {
                // TODO 
                Mixer.playSound(SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    let health = 10;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                } else {
                    return false;
                }
            }),
            new InvObjDefinition(InventoryKey.INV_RED_FLASK_KEY, "inv_red_flask", res.mapObjectDefs[MapObjectKey.MAP_RED_FLASK_KEY]).setConsumeAction((world: World): boolean => {
                // TODO 
                Mixer.playSound(SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    let health = 30;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                } else {
                    return false;
                }
            }),
            new InvObjDefinition(InventoryKey.INV_DOOR_KEY, "inv_door", res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOOD_CHAIR_KEY, "inv_wood_chair", res.mapObjectDefs[MapObjectKey.MAP_WOOD_CHAIR_KEY])
                .setMapObjAlternative(res.mapObjectDefs[MapObjectKey.MAP_WOOD_CHAIR2_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOOD_TABLE_KEY, "inv_wood_table", res.mapObjectDefs[MapObjectKey.MAP_WOOD_TABLE_KEY]),

            // usaditelných jako povrch
            new InvObjDefinition(InventoryKey.INV_DIRT_KEY, "inv_dirt", res.getSurfaceDef(SurfaceKey.SRFC_DIRT_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOODWALL_KEY, "inv_woodwall", res.getSurfaceDef(SurfaceKey.SRFC_WOODWALL_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY)),
            new InvObjDefinition(InventoryKey.INV_BRICK_KEY, "inv_brick", res.getSurfaceDef(SurfaceKey.SRFC_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_BRICK_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_KEY, "inv_rock_brick", res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY)),
            new InvObjDefinition(InventoryKey.INV_STRAW_KEY, "inv_straw", res.getSurfaceDef(SurfaceKey.SRFC_STRAW_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_STRAW_KEY)),
            new InvObjDefinition(InventoryKey.INV_KRYSTAL_KEY, "inv_krystals", res.getSurfaceDef(SurfaceKey.SRFC_KRYSTAL_KEY)),
            new InvObjDefinition(InventoryKey.INV_FLORITE_KEY, "inv_florite", res.getSurfaceDef(SurfaceKey.SRFC_FLORITE_KEY)),
            new InvObjDefinition(InventoryKey.INV_IRON_KEY, "inv_iron", res.getSurfaceDef(SurfaceKey.SRFC_IRON_KEY)),
            new InvObjDefinition(InventoryKey.INV_COAL_KEY, "inv_coal", res.getSurfaceDef(SurfaceKey.SRFC_COAL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_KEY, "inv_rock", res.getSurfaceDef(SurfaceKey.SRFC_ROCK_KEY)),
            new InvObjDefinition(InventoryKey.INV_IRON_PLATFORM_KEY, "inv_iron_platform", res.getSurfaceDef(SurfaceKey.SRFC_IRON_PLATFORM_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOOD_PLATFORM_KEY, "inv_wood_platform", res.getSurfaceDef(SurfaceKey.SRFC_WOOD_PLATFORM_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOOD_LADDER_KEY, "inv_wood_ladder", res.getSurfaceDef(SurfaceKey.SRFC_WOOD_LADDER_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_KEY, "inv_roof", res.getSurfaceDef(SurfaceKey.SRFC_ROOF_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROOF_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_TL_KEY, "inv_roof_tl", res.getSurfaceDef(SurfaceKey.SRFC_ROOF_TL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_TR_KEY, "inv_roof_tr", res.getSurfaceDef(SurfaceKey.SRFC_ROOF_TR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TL_KEY, "inv_rock_brick_tl", res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_TL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TR_KEY, "inv_rock_brick_tr", res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_TR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BL_KEY, "inv_rock_brick_bl", res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_BL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BR_KEY, "inv_rock_brick_br", res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_BR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_WINDOW_KEY, "inv_rock_brick_window").setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_WINDOW_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOODWALL_WINDOW_KEY, "inv_woodwall_window").setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_WOODWALL_WINDOW_KEY)),
            new InvObjDefinition(InventoryKey.INV_CHAIN_LADDER_KEY, "inv_chain_ladder", res.getSurfaceDef(SurfaceKey.SRFC_CHAIN_LADDER_KEY)),
            new InvObjDefinition(InventoryKey.INV_GOLD_KEY, "inv_gold", res.getSurfaceDef(SurfaceKey.SRFC_GOLD_KEY))
        ];
    }
}