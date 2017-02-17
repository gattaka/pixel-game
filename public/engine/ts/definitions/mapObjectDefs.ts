namespace Lich {
    let createWorkstationCallback = (key: MapObjectKey) => {
        return (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) => {
            EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.WORKSTATION_CHANGE, key));
            let listener = (payload: TupleEventPayload) => {
                let info: ReachInfo = game.getWorld().checkReach(game.getWorld().hero, tx, ty, true)
                if (!info.inReach) {
                    EventBus.getInstance().unregisterConsumer(EventType.PLAYER_POSITION_CHANGE, listener);
                    EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.WORKSTATION_UNREACHABLE));
                }
                return false;
            };
            EventBus.getInstance().registerConsumer(EventType.PLAYER_POSITION_CHANGE, listener);
        };
    }

    let tsf = ThemeWatch.getThemeSuffix();

    export let MAP_OBJECT_DEFS = [
        new MapObjDefinition(MapObjectKey.MAP_GRAVE_KEY, "mpo_grave", 2, 2, InventoryKey.INV_GRAVE_KEY, 1, 160,
            function (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) {
                let pCoord = game.getWorld().render.tilesToPixel(tx, ty);
                if (game.getWorld().setSpawnPoint(tx, ty)) {
                    game.getWorld().fadeText("Spawn point created", pCoord.x, pCoord.y, 25, "#0B0", "#030");
                } else {
                    game.getWorld().fadeText("Invalid spawn point", pCoord.x, pCoord.y, 25, "#B00", "#300");
                }
            }).setDepth(0, 5),
        new MapObjDefinition(MapObjectKey.MAP_BERRY_KEY, "mpo_berry" + tsf, 2, 2, InventoryKey.INV_BERRY_KEY, 1, 100).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_BUSH_KEY, "mpo_bush" + tsf, 2, 2, null, 0, 15).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_BUSH2_KEY, "mpo_bush2" + tsf, 2, 2, null, 0, 15).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_GRASS1_KEY, "mpo_grass" + tsf, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_GRASS2_KEY, "mpo_grass2" + tsf, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_GRASS3_KEY, "mpo_grass3" + tsf, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_WOODEN_GOLD_CHEST_KEY, "mpo_wooden_chest_gold", 2, 2, null, 0, 0),
        new MapObjDefinition(MapObjectKey.MAP_WOODEN_CHEST_KEY, "mpo_wooden_chest", 2, 2, null, 0, 0),
        new MapObjDefinition(MapObjectKey.MAP_ARMCHAIR_KEY, "mpo_armchair", 2, 4, InventoryKey.INV_ARMCHAIR_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_BOOKS_KEY, "mpo_books", 2, 2, InventoryKey.INV_BOOKS_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_BOOKSHELF_KEY, "mpo_bookshelf", 2, 4, InventoryKey.INV_BOOKSHELF_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_CABINET_KEY, "mpo_cabinet", 2, 4, InventoryKey.INV_CABINET_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_CANDLE_KEY, "mpo_candle", 2, 2, InventoryKey.INV_CANDLE_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_PORTRAIT_VALENTIMON_KEY, "mpo_portrait_valentimon", 4, 4, InventoryKey.INV_PORTRAIT_VALENTIMON_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_TREE_KEY, "mpo_tree5" + tsf, 4, 8, InventoryKey.INV_WOOD_KEY, 5, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_TREE2_KEY, "mpo_tree6" + tsf, 4, 6, InventoryKey.INV_WOOD_KEY, 10, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_TREE3_KEY, "mpo_tree3" + tsf, 2, 3, InventoryKey.INV_WOOD_KEY, 2, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_TREE4_KEY, "mpo_tree4" + tsf, 2, 4, InventoryKey.INV_WOOD_KEY, 2, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_MUSHROOM_KEY, "mpo_mushroom", 2, 2, InventoryKey.INV_MUSHROOM_KEY, 1, 100).setDepth(5, 40),
        new MapObjDefinition(MapObjectKey.MAP_MUSHROOM2_KEY, "mpo_mushroom2", 2, 2, InventoryKey.INV_MUSHROOM2_KEY, 1, 100).setDepth(5, 100),
        new MapObjDefinition(MapObjectKey.MAP_MUSHROOM3_KEY, "mpo_mushroom3", 2, 2, InventoryKey.INV_MUSHROOM3_KEY, 1, 140).setDepth(5, 100),
        new MapObjDefinition(MapObjectKey.MAP_RED_PLANT_KEY, "mpo_plant" + tsf, 2, 2, InventoryKey.INV_RED_PLANT_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_MAGENTA_PLANT_KEY, "mpo_plant2" + tsf, 2, 2, InventoryKey.INV_MAGENTA_PLANT_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_CYAN_PLANT_KEY, "mpo_plant3" + tsf, 2, 2, InventoryKey.INV_CYAN_PLANT_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_YELLOW_PLANT_KEY, "mpo_plant4" + tsf, 2, 2, InventoryKey.INV_YELLOW_PLANT_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_FLORITE_KEY, "mpo_florite_chunk", 2, 2, InventoryKey.INV_FLORITE_KEY, 5, 100).setDepth(70, 100),
        new MapObjDefinition(MapObjectKey.MAP_CAMPFIRE_KEY, "mpo_campfire", 2, 2, InventoryKey.INV_CAMPFIRE_KEY, 1, 0).setFrames(4),
        new MapObjDefinition(MapObjectKey.MAP_FIREPLACE_KEY, "mpo_fireplace", 4, 2, InventoryKey.INV_FIREPLACE_KEY, 1, 0).setFrames(4),
        new MapObjDefinition(MapObjectKey.MAP_DEAD_FIREPLACE_KEY, "mpo_dead_fireplace", 4, 2, InventoryKey.INV_FIREPLACE_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_DEAD_CHANDELIER_KEY, "mpo_dead_chandelier", 4, 2, InventoryKey.INV_CHANDELIER_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_ANVIL_KEY, "mpo_anvil", 2, 2, InventoryKey.INV_ANVIL_KEY, 1, 0, createWorkstationCallback(MapObjectKey.MAP_ANVIL_KEY)),
        new MapObjDefinition(MapObjectKey.MAP_CAULDRON_KEY, "mpo_cauldron", 2, 2, InventoryKey.INV_CAULDRON_KEY, 1, 0, createWorkstationCallback(MapObjectKey.MAP_CAULDRON_KEY)),
        new MapObjDefinition(MapObjectKey.MAP_SMELTER_KEY, "mpo_smelter", 4, 4, InventoryKey.INV_SMELTER_KEY, 1, 0, createWorkstationCallback(MapObjectKey.MAP_SMELTER_KEY)).setFrames(3),
        new MapObjDefinition(MapObjectKey.MAP_IRON_INGOT_KEY, "mpo_iron_ingot", 2, 2, InventoryKey.INV_IRON_INGOT_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_SKELETON_ON_CHAIR_KEY, "mpo_skeleton_on_chair", 2, 4, InventoryKey.INV_WOOD_CHAIR_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_IRON_FENCE_KEY, "mpo_iron_fence", 2, 2, InventoryKey.INV_IRON_FENCE_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_WOOD_CHAIR_KEY, "mpo_wood_chair", 2, 2, InventoryKey.INV_WOOD_CHAIR_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_WOOD_CHAIR2_KEY, "mpo_wood_chair2", 2, 2, InventoryKey.INV_WOOD_CHAIR_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_WOOD_TABLE_KEY, "mpo_wood_table", 2, 2, InventoryKey.INV_WOOD_TABLE_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_RED_FLASK_KEY, "mpo_red_flask", 2, 2, InventoryKey.INV_RED_FLASK_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_GOLD_COINS_KEY, "mpo_gold_coins", 2, 2, InventoryKey.INV_GOLD_COINS_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_GOLD_COINS2_KEY, "mpo_gold_coins2", 2, 2, InventoryKey.INV_GOLD_COINS_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_SILVER_COINS_KEY, "mpo_silver_coins", 2, 2, InventoryKey.INV_SILVER_COINS_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_GOLD_DISHES_KEY, "mpo_gold_dishes", 2, 2, InventoryKey.INV_GOLD_DISHES_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_GOLD_DISHES2_KEY, "mpo_gold_dishes2", 2, 2, InventoryKey.INV_GOLD_DISHES2_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_GOLD_BOWL_KEY, "mpo_gold_bowl", 2, 2, InventoryKey.INV_GOLD_BOWL_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_TORCH_KEY, "mpo_torch", 2, 4, InventoryKey.INV_TORCH_KEY, 1, 0).setFrames(4),
        new MapObjDefinition(MapObjectKey.MAP_SNOWMAN_KEY, "mpo_snowman", 2, 4, InventoryKey.INV_SNOWMAN_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN_KEY, "mpo_door_open", 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(tx, ty, false);
                game.getWorld().render.placeObject(tx, ty, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
            }),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED_KEY, "mpo_door_closed", 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(tx, ty, false);
                game.getWorld().render.placeObject(tx, ty, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
            }).setCollision(true),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN2_KEY, "mpo_door_open2", 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(tx, ty, false);
                game.getWorld().render.placeObject(tx, ty, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED2_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
            }),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED2_KEY, "mpo_door_closed2", 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(tx, ty, false);
                game.getWorld().render.placeObject(tx, ty, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
            }).setCollision(true),
        new MapObjDefinition(MapObjectKey.MAP_KNIGHT_STATUE_KEY, "mpo_knight_statue", 4, 6, InventoryKey.INV_KNIGHT_STATUE_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_BANNER_KEY, "mpo_banner", 2, 4, InventoryKey.INV_BANNER_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_FLOWER_POT_KEY, "mpo_flower_pot", 2, 2, InventoryKey.INV_FLOWER_POT_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_CHANDELIER_KEY, "mpo_chandelier", 4, 2, InventoryKey.INV_CHANDELIER_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_XMAS_CHAIN_KEY, "mpo_xmas_chain", 2, 2, InventoryKey.INV_XMAS_CHAIN_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_XMAS_HOLLY_KEY, "mpo_xmas_holly", 4, 4, InventoryKey.INV_XMAS_HOLLY_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_XMAS_TREE_KEY, "mpo_xmas_tree", 4, 6, InventoryKey.INV_XMAS_TREE_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_ADVENT_WREATH_KEY, "mpo_advent_wreath", 4, 2, InventoryKey.INV_ADVENT_WREATH_KEY, 1, 0),
    ]
}