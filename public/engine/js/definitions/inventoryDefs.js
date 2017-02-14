var Lich;
(function (Lich) {
    var xmasGiftSpawn = function (world) {
        var inv;
        switch (Math.floor(Math.random() * 8)) {
            case 0:
                inv = Lich.InventoryKey.INV_XMAS_HOLLY_KEY;
                break;
            case 1:
                inv = Lich.InventoryKey.INV_XMAS_CHAIN_KEY;
                break;
            case 2:
                inv = Lich.InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY;
                break;
            case 3:
                inv = Lich.InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY;
                break;
            case 4:
                inv = Lich.InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY;
                break;
            case 5:
                inv = Lich.InventoryKey.INV_XMAS_RED_BAUBLE_KEY;
                break;
            case 6:
                inv = Lich.InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY;
                break;
            case 7:
                inv = Lich.InventoryKey.INV_ADVENT_WREATH_KEY;
                break;
        }
        world.spawnObject(new Lich.DugObjDefinition(inv, 1), world.hero.x, world.hero.y, false);
        return true;
    };
    Lich.INVENTORY_DEFS = function (res) {
        return [
            // neusaditelných
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BONES_KEY, "inv_bones"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_KEY, "inv_wood"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY, "inv_xmas_yellow_bauble"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_LOVEARROW_KEY, "inv_lovearrow"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_SNOWBALL_KEY, "inv_snowball"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CHICKEN_TALON_KEY, "inv_chicken_talon"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY, "inv_xmas_blue_bauble"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY, "inv_xmas_green_bauble"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY, "inv_xmas_purple_bauble"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_RED_BAUBLE_KEY, "inv_xmas_red_bauble"),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_SNOWFLAKE_KEY, "inv_snowflake"),
            // usaditelných jako objekt
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ARMCHAIR_KEY, "inv_armchair", res.mapObjectDefs[Lich.MapObjectKey.MAP_ARMCHAIR_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BOOKS_KEY, "inv_books", res.mapObjectDefs[Lich.MapObjectKey.MAP_BOOKS_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BOOKSHELF_KEY, "inv_bookshelf", res.mapObjectDefs[Lich.MapObjectKey.MAP_BOOKSHELF_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CABINET_KEY, "inv_cabinet", res.mapObjectDefs[Lich.MapObjectKey.MAP_CABINET_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CANDLE_KEY, "inv_candle", res.mapObjectDefs[Lich.MapObjectKey.MAP_CANDLE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_PORTRAIT_VALENTIMON_KEY, "inv_portrait_valentimon", res.mapObjectDefs[Lich.MapObjectKey.MAP_PORTRAIT_VALENTIMON_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MUSHROOM_KEY, "inv_mushroom", res.mapObjectDefs[Lich.MapObjectKey.MAP_MUSHROOM_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MUSHROOM2_KEY, "inv_mushroom2", res.mapObjectDefs[Lich.MapObjectKey.MAP_MUSHROOM2_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MUSHROOM3_KEY, "inv_mushroom3", res.mapObjectDefs[Lich.MapObjectKey.MAP_MUSHROOM3_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BERRY_KEY, "inv_berry", res.mapObjectDefs[Lich.MapObjectKey.MAP_BERRY_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_RED_PLANT_KEY, "inv_plant", res.mapObjectDefs[Lich.MapObjectKey.MAP_RED_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MAGENTA_PLANT_KEY, "inv_plant2", res.mapObjectDefs[Lich.MapObjectKey.MAP_MAGENTA_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CYAN_PLANT_KEY, "inv_plant3", res.mapObjectDefs[Lich.MapObjectKey.MAP_CYAN_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_YELLOW_PLANT_KEY, "inv_plant4", res.mapObjectDefs[Lich.MapObjectKey.MAP_YELLOW_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CAMPFIRE_KEY, "inv_campfire", res.mapObjectDefs[Lich.MapObjectKey.MAP_CAMPFIRE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_FIREPLACE_KEY, "inv_fireplace", res.mapObjectDefs[Lich.MapObjectKey.MAP_FIREPLACE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_TORCH_KEY, "inv_torch", res.mapObjectDefs[Lich.MapObjectKey.MAP_TORCH_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ANVIL_KEY, "inv_anvil", res.mapObjectDefs[Lich.MapObjectKey.MAP_ANVIL_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_SMELTER_KEY, "inv_smelter", res.mapObjectDefs[Lich.MapObjectKey.MAP_SMELTER_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_INGOT_KEY, "inv_iron_ingot", res.mapObjectDefs[Lich.MapObjectKey.MAP_IRON_INGOT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_FENCE_KEY, "inv_iron_fence", res.mapObjectDefs[Lich.MapObjectKey.MAP_IRON_FENCE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GRAVE_KEY, "inv_grave", res.mapObjectDefs[Lich.MapObjectKey.MAP_GRAVE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_KNIGHT_STATUE_KEY, "inv_knight_statue", res.mapObjectDefs[Lich.MapObjectKey.MAP_KNIGHT_STATUE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BANNER_KEY, "inv_banner", res.mapObjectDefs[Lich.MapObjectKey.MAP_BANNER_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_FLOWER_POT_KEY, "inv_flower_pot", res.mapObjectDefs[Lich.MapObjectKey.MAP_FLOWER_POT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CHANDELIER_KEY, "inv_chandelier", res.mapObjectDefs[Lich.MapObjectKey.MAP_CHANDELIER_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CAULDRON_KEY, "inv_cauldron", res.mapObjectDefs[Lich.MapObjectKey.MAP_CAULDRON_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_SNOWMAN_KEY, "inv_snowman", res.mapObjectDefs[Lich.MapObjectKey.MAP_SNOWMAN_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_HOLLY_KEY, "inv_xmas_holly", res.mapObjectDefs[Lich.MapObjectKey.MAP_XMAS_HOLLY_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_CHAIN_KEY, "inv_xmas_chain", res.mapObjectDefs[Lich.MapObjectKey.MAP_XMAS_CHAIN_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_TREE_KEY, "inv_xmas_tree", res.mapObjectDefs[Lich.MapObjectKey.MAP_XMAS_TREE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ADVENT_WREATH_KEY, "inv_advent_wreath", res.mapObjectDefs[Lich.MapObjectKey.MAP_ADVENT_WREATH_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GOLD_COINS_KEY, "inv_gold_coins2", res.mapObjectDefs[Lich.MapObjectKey.MAP_GOLD_COINS_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_SILVER_COINS_KEY, "inv_silver_coins", res.mapObjectDefs[Lich.MapObjectKey.MAP_SILVER_COINS_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GOLD_DISHES_KEY, "inv_gold_dishes", res.mapObjectDefs[Lich.MapObjectKey.MAP_GOLD_DISHES_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GOLD_DISHES2_KEY, "inv_gold_dishes2", res.mapObjectDefs[Lich.MapObjectKey.MAP_GOLD_DISHES2_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GOLD_BOWL_KEY, "inv_gold_bowl", res.mapObjectDefs[Lich.MapObjectKey.MAP_GOLD_BOWL_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GIFT1_KEY, "inv_gift1").setConsumeAction(xmasGiftSpawn),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GIFT2_KEY, "inv_gift2").setConsumeAction(xmasGiftSpawn),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GIFT3_KEY, "inv_gift3").setConsumeAction(xmasGiftSpawn),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_LOVELETTER_KEY, "inv_loveletter").setConsumeAction(function (world) {
                if (!Lich.Enemy.CupidBoss.spawned) {
                    Lich.SpawnPool.getInstance().spawn(Lich.Enemy.CupidBoss, world);
                    return true;
                }
                return false;
            }),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CHICKEN_MEAT_KEY, "inv_chicken_meat").setConsumeAction(function (world) {
                // TODO 
                Lich.Mixer.playSound(Lich.SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    var health = 10;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                }
                else {
                    return false;
                }
            }),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_RED_FLASK_KEY, "inv_red_flask", res.mapObjectDefs[Lich.MapObjectKey.MAP_RED_FLASK_KEY]).setConsumeAction(function (world) {
                // TODO 
                Lich.Mixer.playSound(Lich.SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    var health = 30;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                }
                else {
                    return false;
                }
            }),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_DOOR_KEY, "inv_door", res.mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(res.mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN2_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_CHAIR_KEY, "inv_wood_chair", res.mapObjectDefs[Lich.MapObjectKey.MAP_WOOD_CHAIR_KEY])
                .setMapObjAlternative(res.mapObjectDefs[Lich.MapObjectKey.MAP_WOOD_CHAIR2_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_TABLE_KEY, "inv_wood_table", res.mapObjectDefs[Lich.MapObjectKey.MAP_WOOD_TABLE_KEY]),
            // usaditelných jako povrch
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_DIRT_KEY, "inv_dirt", res.getSurfaceDef(Lich.SurfaceKey.SRFC_DIRT_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOODWALL_KEY, "inv_woodwall", res.getSurfaceDef(Lich.SurfaceKey.SRFC_WOODWALL_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BRICK_KEY, "inv_brick", res.getSurfaceDef(Lich.SurfaceKey.SRFC_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_BRICK_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_KEY, "inv_rock_brick", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_STRAW_KEY, "inv_straw", res.getSurfaceDef(Lich.SurfaceKey.SRFC_STRAW_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_STRAW_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_KRYSTAL_KEY, "inv_krystals", res.getSurfaceDef(Lich.SurfaceKey.SRFC_KRYSTAL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_FLORITE_KEY, "inv_florite", res.getSurfaceDef(Lich.SurfaceKey.SRFC_FLORITE_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_KEY, "inv_iron", res.getSurfaceDef(Lich.SurfaceKey.SRFC_IRON_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_COAL_KEY, "inv_coal", res.getSurfaceDef(Lich.SurfaceKey.SRFC_COAL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_KEY, "inv_rock", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_PLATFORM_KEY, "inv_iron_platform", res.getSurfaceDef(Lich.SurfaceKey.SRFC_IRON_PLATFORM_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, "inv_wood_platform", res.getSurfaceDef(Lich.SurfaceKey.SRFC_WOOD_PLATFORM_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_LADDER_KEY, "inv_wood_ladder", res.getSurfaceDef(Lich.SurfaceKey.SRFC_WOOD_LADDER_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROOF_KEY, "inv_roof", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROOF_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_ROOF_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROOF_TL_KEY, "inv_roof_tl", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROOF_TL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROOF_TR_KEY, "inv_roof_tr", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROOF_TR_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_TL_KEY, "inv_rock_brick_tl", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_TL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_TR_KEY, "inv_rock_brick_tr", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_TR_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_BL_KEY, "inv_rock_brick_bl", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_BL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_BR_KEY, "inv_rock_brick_br", res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_BR_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_WINDOW_KEY, "inv_rock_brick_window").setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_WINDOW_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOODWALL_WINDOW_KEY, "inv_woodwall_window").setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_WOODWALL_WINDOW_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CHAIN_LADDER_KEY, "inv_chain_ladder", res.getSurfaceDef(Lich.SurfaceKey.SRFC_CHAIN_LADDER_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GOLD_KEY, "inv_gold", res.getSurfaceDef(Lich.SurfaceKey.SRFC_GOLD_KEY))
        ];
    };
})(Lich || (Lich = {}));
