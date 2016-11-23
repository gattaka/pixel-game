namespace Lich {
    export let INVENTORY_DEFS = (res: Resources) => {
        return [
            // usaditelných jako objekt
            new InvObjDefinition(InventoryKey.INV_MUSHROOM_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM2_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM2_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM3_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM3_KEY]),
            new InvObjDefinition(InventoryKey.INV_BERRY_KEY, res.mapObjectDefs[MapObjectKey.MAP_BERRY_KEY]),
            new InvObjDefinition(InventoryKey.INV_PLANT_KEY, res.mapObjectDefs[MapObjectKey.MAP_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_PLANT2_KEY, res.mapObjectDefs[MapObjectKey.MAP_PLANT2_KEY]),
            new InvObjDefinition(InventoryKey.INV_PLANT3_KEY, res.mapObjectDefs[MapObjectKey.MAP_PLANT3_KEY]),
            new InvObjDefinition(InventoryKey.INV_PLANT4_KEY, res.mapObjectDefs[MapObjectKey.MAP_PLANT4_KEY]),
            new InvObjDefinition(InventoryKey.INV_CAMPFIRE_KEY, res.mapObjectDefs[MapObjectKey.MAP_CAMPFIRE_KEY]),
            new InvObjDefinition(InventoryKey.INV_FIREPLACE_KEY, res.mapObjectDefs[MapObjectKey.MAP_FIREPLACE_KEY]),
            new InvObjDefinition(InventoryKey.INV_TORCH_KEY, res.mapObjectDefs[MapObjectKey.MAP_TORCH_KEY]),
            new InvObjDefinition(InventoryKey.INV_ANVIL_KEY, res.mapObjectDefs[MapObjectKey.MAP_ANVIL_KEY]),
            new InvObjDefinition(InventoryKey.INV_SMELTER_KEY, res.mapObjectDefs[MapObjectKey.MAP_SMELTER_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_INGOT_KEY, res.mapObjectDefs[MapObjectKey.MAP_IRON_INGOT_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_FENCE_KEY, res.mapObjectDefs[MapObjectKey.MAP_IRON_FENCE_KEY]),
            new InvObjDefinition(InventoryKey.INV_GRAVE_KEY, res.mapObjectDefs[MapObjectKey.MAP_GRAVE_KEY]),
            new InvObjDefinition(InventoryKey.INV_DOOR_KEY, res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]),

            // usaditelných jako povrch
            new InvObjDefinition(InventoryKey.INV_DIRT_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_DIRT_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOODWALL_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_WOODWALL_KEY])
                .setBackground(res.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY]),
            new InvObjDefinition(InventoryKey.INV_BRICK_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_BRICK_KEY])
                .setBackground(res.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_BRICK_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROCK_BRICK_KEY])
                .setBackground(res.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY]),
            new InvObjDefinition(InventoryKey.INV_STRAW_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_STRAW_KEY])
                .setBackground(res.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_STRAW_KEY]),
            new InvObjDefinition(InventoryKey.INV_KRYSTAL_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_KRYSTAL_KEY]),
            new InvObjDefinition(InventoryKey.INV_FLORITE_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_FLORITE_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_IRON_KEY]),
            new InvObjDefinition(InventoryKey.INV_COAL_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_COAL_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROCK_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROCK_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_PLATFORM_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_IRON_PLATFORM_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOOD_PLATFORM_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_WOOD_PLATFORM_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOOD_LADDER_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_WOOD_LADDER_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROOF_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROOF_KEY])
                .setBackground(res.mapSurfacesBgrDefs[SurfaceBgrKey.SRFC_BGR_ROOF_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROOF_TL_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROOF_TL_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROOF_TR_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROOF_TR_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TL_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROCK_BRICK_TL_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TR_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROCK_BRICK_TR_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BL_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROCK_BRICK_BL_KEY]),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BR_KEY, res.mapSurfaceDefs[SurfaceKey.SRFC_ROCK_BRICK_BR_KEY])
        ];
    }
}