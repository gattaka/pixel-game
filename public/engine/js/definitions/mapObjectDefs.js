var Lich;
(function (Lich) {
    var createWorkstationCallback = function (key) {
        return function (game, tx, ty, obj, objType) {
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.WORKSTATION_CHANGE, key));
            var listener = function (payload) {
                var info = game.getWorld().checkReach(game.getWorld().hero, tx, ty, true);
                if (!info.inReach) {
                    Lich.EventBus.getInstance().unregisterConsumer(Lich.EventType.PLAYER_POSITION_CHANGE, listener);
                    Lich.EventBus.getInstance().fireEvent(new Lich.SimpleEventPayload(Lich.EventType.WORKSTATION_UNREACHABLE));
                }
                return false;
            };
            Lich.EventBus.getInstance().registerConsumer(Lich.EventType.PLAYER_POSITION_CHANGE, listener);
        };
    };
    Lich.MAP_OBJECT_DEFS = [
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRAVE_KEY, 2, 2, Lich.InventoryKey.INV_GRAVE_KEY, 1, 160, function (game, tx, ty, obj, objType) {
            var pCoord = game.getWorld().render.tilesToPixel(tx, ty);
            if (game.getWorld().setSpawnPoint(tx, ty)) {
                game.getWorld().fadeText("Spawn point created", pCoord.x, pCoord.y, 25, "#0B0", "#030");
            }
            else {
                game.getWorld().fadeText("Invalid spawn point", pCoord.x, pCoord.y, 25, "#B00", "#300");
            }
        }).setDepth(0, 5),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_BERRY_KEY, 2, 2, Lich.InventoryKey.INV_BERRY_KEY, 1, 100).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_BUSH_KEY, 2, 2, null, 0, 15).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_BUSH2_KEY, 2, 2, null, 0, 15).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRASS1_KEY, 2, 2, Lich.InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRASS2_KEY, 2, 2, Lich.InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRASS3_KEY, 2, 2, Lich.InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TREE_KEY, 4, 8, Lich.InventoryKey.INV_WOOD_KEY, 5, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TREE2_KEY, 4, 6, Lich.InventoryKey.INV_WOOD_KEY, 10, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TREE3_KEY, 2, 3, Lich.InventoryKey.INV_WOOD_KEY, 2, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TREE4_KEY, 2, 4, Lich.InventoryKey.INV_WOOD_KEY, 2, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_MUSHROOM_KEY, 2, 2, Lich.InventoryKey.INV_MUSHROOM_KEY, 1, 100).setDepth(5, 40),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_MUSHROOM2_KEY, 2, 2, Lich.InventoryKey.INV_MUSHROOM2_KEY, 1, 100).setDepth(5, 100),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_MUSHROOM3_KEY, 2, 2, Lich.InventoryKey.INV_MUSHROOM3_KEY, 1, 140).setDepth(5, 100),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_RED_PLANT_KEY, 2, 2, Lich.InventoryKey.INV_RED_PLANT_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_MAGENTA_PLANT_KEY, 2, 2, Lich.InventoryKey.INV_MAGENTA_PLANT_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_CYAN_PLANT_KEY, 2, 2, Lich.InventoryKey.INV_CYAN_PLANT_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_YELLOW_PLANT_KEY, 2, 2, Lich.InventoryKey.INV_YELLOW_PLANT_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_FLORITE_KEY, 2, 2, Lich.InventoryKey.INV_FLORITE_KEY, 5, 100).setDepth(70, 100),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_CAMPFIRE_KEY, 2, 2, Lich.InventoryKey.INV_CAMPFIRE_KEY, 1, 0).setFrames(4),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_FIREPLACE_KEY, 4, 2, Lich.InventoryKey.INV_FIREPLACE_KEY, 1, 0).setFrames(4),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_ANVIL_KEY, 2, 2, Lich.InventoryKey.INV_ANVIL_KEY, 1, 0, createWorkstationCallback(Lich.MapObjectKey.MAP_ANVIL_KEY)),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_CAULDRON_KEY, 2, 2, Lich.InventoryKey.INV_CAULDRON_KEY, 1, 0, createWorkstationCallback(Lich.MapObjectKey.MAP_CAULDRON_KEY)),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_SMELTER_KEY, 4, 4, Lich.InventoryKey.INV_SMELTER_KEY, 1, 0, createWorkstationCallback(Lich.MapObjectKey.MAP_SMELTER_KEY)).setFrames(3),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_IRON_INGOT_KEY, 2, 2, Lich.InventoryKey.INV_IRON_INGOT_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_IRON_FENCE_KEY, 2, 2, Lich.InventoryKey.INV_IRON_FENCE_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_WOOD_CHAIR, 2, 2, Lich.InventoryKey.INV_WOOD_CHAIR, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_WOOD_CHAIR2, 2, 2, Lich.InventoryKey.INV_WOOD_CHAIR, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_WOOD_TABLE, 2, 2, Lich.InventoryKey.INV_WOOD_TABLE, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_RED_FLASK_KEY, 2, 2, Lich.InventoryKey.INV_RED_FLASK_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TORCH_KEY, 2, 4, Lich.InventoryKey.INV_TORCH_KEY, 1, 0).setFrames(4),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_SNOWMAN_KEY, 2, 4, Lich.InventoryKey.INV_SNOWMAN, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_OPEN_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, tx, ty, obj, objType) {
            game.getWorld().render.digObject(tx, ty, false);
            game.getWorld().render.placeObject(tx, ty, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_CLOSED_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_CLOSE_KEY);
        }),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_CLOSED_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, tx, ty, obj, objType) {
            game.getWorld().render.digObject(tx, ty, false);
            game.getWorld().render.placeObject(tx, ty, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_OPEN_KEY);
        }).setCollision(true),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_OPEN2_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, tx, ty, obj, objType) {
            game.getWorld().render.digObject(tx, ty, false);
            game.getWorld().render.placeObject(tx, ty, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_CLOSED2_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_CLOSE_KEY);
        }),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_CLOSED2_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, tx, ty, obj, objType) {
            game.getWorld().render.digObject(tx, ty, false);
            game.getWorld().render.placeObject(tx, ty, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN2_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_OPEN_KEY);
        }).setCollision(true),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_KNIGHT_STATUE_KEY, 4, 6, Lich.InventoryKey.INV_KNIGHT_STATUE_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_BANNER_KEY, 2, 4, Lich.InventoryKey.INV_BANNER_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_FLOWER_POT_KEY, 2, 2, Lich.InventoryKey.INV_FLOWER_POT_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_CHANDELIER_KEY, 4, 2, Lich.InventoryKey.INV_CHANDELIER_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_XMAS_CHAIN_KEY, 2, 2, Lich.InventoryKey.INV_XMAS_CHAIN_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_XMAS_HOLLY_KEY, 4, 4, Lich.InventoryKey.INV_XMAS_HOLLY_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_XMAS_TREE_KEY, 4, 6, Lich.InventoryKey.INV_XMAS_TREE_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_ADVENT_WREATH_KEY, 4, 2, Lich.InventoryKey.INV_ADVENT_WREATH_KEY, 1, 0),
    ];
})(Lich || (Lich = {}));
