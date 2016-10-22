var Lich;
(function (Lich) {
    Lich.MAP_OBJECT_DEFS = [
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRAVE_KEY, 6, 3, Lich.InventoryKey.INV_BONES_KEY, 5, 160).setDepth(0, 5),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_BERRY_KEY, 2, 2, Lich.InventoryKey.INV_BERRY_KEY, 1, 100).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_BUSH_KEY, 2, 2, null, 0, 15).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_BUSH2_KEY, 2, 2, null, 0, 15).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRASS_KEY, 2, 2, Lich.InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRASS2_KEY, 2, 2, Lich.InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_GRASS3_KEY, 2, 2, Lich.InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TREE_KEY, 4, 9, Lich.InventoryKey.INV_WOOD_KEY, 5, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TREE2_KEY, 8, 15, Lich.InventoryKey.INV_WOOD_KEY, 10, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TREE3_KEY, 4, 7, Lich.InventoryKey.INV_WOOD_KEY, 10, 1).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_MUSHROOM_KEY, 2, 2, Lich.InventoryKey.INV_MUSHROOM_KEY, 1, 100).setDepth(5, 40),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_MUSHROOM2_KEY, 2, 2, Lich.InventoryKey.INV_MUSHROOM2_KEY, 1, 100).setDepth(5, 100),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_MUSHROOM3_KEY, 2, 2, Lich.InventoryKey.INV_MUSHROOM3_KEY, 1, 140).setDepth(5, 100),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_PLANT_KEY, 2, 2, Lich.InventoryKey.INV_PLANT_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_PLANT2_KEY, 2, 2, Lich.InventoryKey.INV_PLANT2_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_PLANT3_KEY, 2, 2, Lich.InventoryKey.INV_PLANT3_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_PLANT4_KEY, 2, 2, Lich.InventoryKey.INV_PLANT4_KEY, 1, 60).setDepth(0, 10),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_FLORITE_KEY, 2, 2, Lich.InventoryKey.INV_FLORITE_KEY, 5, 100).setDepth(70, 100),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_CAMPFIRE_KEY, 2, 2, Lich.InventoryKey.INV_CAMPFIRE_KEY, 1, 0).setFrames(4),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_ANVIL_KEY, 2, 2, Lich.InventoryKey.INV_ANVIL_KEY, 1, 0, function (game, rx, ry, obj, objType) {
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.WORKSTATION_CHANGE, Lich.MapObjectKey.MAP_ANVIL_KEY));
        }),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_SMELTER_KEY, 4, 4, Lich.InventoryKey.INV_SMELTER_KEY, 1, 0, function (game, rx, ry, obj, objType) {
            Lich.EventBus.getInstance().fireEvent(new Lich.NumberEventPayload(Lich.EventType.WORKSTATION_CHANGE, Lich.MapObjectKey.MAP_SMELTER_KEY));
        }).setFrames(3),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_IRON_INGOT_KEY, 2, 2, Lich.InventoryKey.INV_IRON_INGOT_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_IRON_FENCE_KEY, 2, 2, Lich.InventoryKey.INV_IRON_FENCE_KEY, 1, 0),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_TORCH_KEY, 2, 2, Lich.InventoryKey.INV_TORCH_KEY, 1, 0).setFrames(4),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_OPEN_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, rx, ry, obj, objType) {
            game.getWorld().render.digObject(rx, ry, false);
            game.getWorld().render.placeObject(rx, ry, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_CLOSED_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_CLOSE_KEY);
        }),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_CLOSED_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, rx, ry, obj, objType) {
            game.getWorld().render.digObject(rx, ry, false);
            game.getWorld().render.placeObject(rx, ry, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_OPEN_KEY);
        }).setCollision(true),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_OPEN2_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, rx, ry, obj, objType) {
            game.getWorld().render.digObject(rx, ry, false);
            game.getWorld().render.placeObject(rx, ry, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_CLOSED2_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_CLOSE_KEY);
        }),
        new Lich.MapObjDefinition(Lich.MapObjectKey.MAP_DOOR_CLOSED2_KEY, 2, 4, Lich.InventoryKey.INV_DOOR_KEY, 1, 0, function (game, rx, ry, obj, objType) {
            game.getWorld().render.digObject(rx, ry, false);
            game.getWorld().render.placeObject(rx, ry, Lich.Resources.getInstance().mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN2_KEY]);
            Lich.Mixer.playSound(Lich.SoundKey.SND_DOOR_OPEN_KEY);
        }).setCollision(true),
    ];
})(Lich || (Lich = {}));
