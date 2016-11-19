namespace Lich {
    export let MAP_OBJECT_DEFS = [
        new MapObjDefinition(MapObjectKey.MAP_GRAVE_KEY, 2, 2, InventoryKey.INV_GRAVE_KEY, 1, 160,
            function (game: Game, tx: number, ty: number, obj: MapObjectTile, objType: MapObjDefinition) {
                let pCoord = game.getWorld().render.tilesToPixel(tx, ty);
                if (game.getWorld().setSpawnPoint(tx, ty)) {
                    game.getWorld().fadeText("Spawn point created", pCoord.x, pCoord.y, 25, "#0B0", "#030");
                } else {
                    game.getWorld().fadeText("Invalid spawn point", pCoord.x, pCoord.y, 25, "#B00", "#300");
                }
            }).setDepth(0, 5),
        new MapObjDefinition(MapObjectKey.MAP_BERRY_KEY, 2, 2, InventoryKey.INV_BERRY_KEY, 1, 100).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_BUSH_KEY, 2, 2, null, 0, 15).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_BUSH2_KEY, 2, 2, null, 0, 15).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_GRASS_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_GRASS2_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_GRASS3_KEY, 2, 2, InventoryKey.INV_STRAW_KEY, 1, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_TREE_KEY, 4, 9, InventoryKey.INV_WOOD_KEY, 5, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_TREE2_KEY, 8, 15, InventoryKey.INV_WOOD_KEY, 10, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_TREE3_KEY, 2, 3, InventoryKey.INV_WOOD_KEY, 2, 1).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_MUSHROOM_KEY, 2, 2, InventoryKey.INV_MUSHROOM_KEY, 1, 100).setDepth(5, 40),
        new MapObjDefinition(MapObjectKey.MAP_MUSHROOM2_KEY, 2, 2, InventoryKey.INV_MUSHROOM2_KEY, 1, 100).setDepth(5, 100),
        new MapObjDefinition(MapObjectKey.MAP_MUSHROOM3_KEY, 2, 2, InventoryKey.INV_MUSHROOM3_KEY, 1, 140).setDepth(5, 100),
        new MapObjDefinition(MapObjectKey.MAP_PLANT_KEY, 2, 2, InventoryKey.INV_PLANT_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_PLANT2_KEY, 2, 2, InventoryKey.INV_PLANT2_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_PLANT3_KEY, 2, 2, InventoryKey.INV_PLANT3_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_PLANT4_KEY, 2, 2, InventoryKey.INV_PLANT4_KEY, 1, 60).setDepth(0, 10),
        new MapObjDefinition(MapObjectKey.MAP_FLORITE_KEY, 2, 2, InventoryKey.INV_FLORITE_KEY, 5, 100).setDepth(70, 100),
        new MapObjDefinition(MapObjectKey.MAP_CAMPFIRE_KEY, 2, 2, InventoryKey.INV_CAMPFIRE_KEY, 1, 0).setFrames(4),
        new MapObjDefinition(MapObjectKey.MAP_FIREPLACE_KEY, 4, 2, InventoryKey.INV_FIREPLACE_KEY, 1, 0).setFrames(4),
        new MapObjDefinition(MapObjectKey.MAP_ANVIL_KEY, 2, 2, InventoryKey.INV_ANVIL_KEY, 1, 0,
            function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.WORKSTATION_CHANGE, MapObjectKey.MAP_ANVIL_KEY));
                let listener = (payload: TupleEventPayload) => {
                    let info: ReachInfo = game.getWorld().checkReach(game.getWorld().hero, rx, ry, true)
                    if (!info.inReach) {
                        EventBus.getInstance().unregisterConsumer(EventType.PLAYER_POSITION_CHANGE, listener);
                        EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.WORKSTATION_UNREACHABLE));
                    }
                    return false;
                };
                EventBus.getInstance().registerConsumer(EventType.PLAYER_POSITION_CHANGE, listener);
            }),
        new MapObjDefinition(MapObjectKey.MAP_SMELTER_KEY, 4, 4, InventoryKey.INV_SMELTER_KEY, 1, 0,
            function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                EventBus.getInstance().fireEvent(new NumberEventPayload(EventType.WORKSTATION_CHANGE, MapObjectKey.MAP_SMELTER_KEY));
                let listener = (payload: TupleEventPayload) => {
                    let info: ReachInfo = game.getWorld().checkReach(game.getWorld().hero, rx, ry, true)
                    if (!info.inReach) {
                        EventBus.getInstance().unregisterConsumer(EventType.PLAYER_POSITION_CHANGE, listener);
                        EventBus.getInstance().fireEvent(new SimpleEventPayload(EventType.WORKSTATION_UNREACHABLE));
                    }
                    return false;
                };
                EventBus.getInstance().registerConsumer(EventType.PLAYER_POSITION_CHANGE, listener);
            }).setFrames(3),
        new MapObjDefinition(MapObjectKey.MAP_IRON_INGOT_KEY, 2, 2, InventoryKey.INV_IRON_INGOT_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_IRON_FENCE_KEY, 2, 2, InventoryKey.INV_IRON_FENCE_KEY, 1, 0),
        new MapObjDefinition(MapObjectKey.MAP_TORCH_KEY, 2, 2, InventoryKey.INV_TORCH_KEY, 1, 0).setFrames(4),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(rx, ry, false);
                game.getWorld().render.placeObject(rx, ry, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
            }),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(rx, ry, false);
                game.getWorld().render.placeObject(rx, ry, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
            }).setCollision(true),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_OPEN2_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(rx, ry, false);
                game.getWorld().render.placeObject(rx, ry, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_CLOSED2_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_CLOSE_KEY);
            }),
        new MapObjDefinition(MapObjectKey.MAP_DOOR_CLOSED2_KEY, 2, 4, InventoryKey.INV_DOOR_KEY, 1, 0,
            function (game: Game, rx: number, ry: number, obj: MapObjectTile, objType: MapObjDefinition) {
                game.getWorld().render.digObject(rx, ry, false);
                game.getWorld().render.placeObject(rx, ry, Resources.getInstance().mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]);
                Mixer.playSound(SoundKey.SND_DOOR_OPEN_KEY);
            }).setCollision(true),
    ]
}