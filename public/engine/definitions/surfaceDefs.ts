namespace Lich {
    export let SURFACE_DEFS = [
        // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
        // jsou dle frekvence usazovány jiné povrchy
        new MapSurfaceDefinition(SurfaceKey.SRFC_DIRT_KEY, InventoryKey.INV_DIRT_KEY, 1, 0),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOODWALL_KEY, InventoryKey.INV_WOODWALL_KEY, 1, 0),
        new MapSurfaceDefinition(SurfaceKey.SRFC_KRYSTAL_KEY, InventoryKey.INV_KRYSTAL_KEY, 1, 10).setDepth(50, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_FLORITE_KEY, InventoryKey.INV_FLORITE_KEY, 1, 10).setDepth(70, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_BRICK_KEY, InventoryKey.INV_BRICK_KEY, 1, 0),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_KEY, InventoryKey.INV_ROCK_BRICK_KEY, 1, 0),
        new MapSurfaceDefinition(SurfaceKey.SRFC_STRAW_KEY, InventoryKey.INV_STRAW_KEY, 1, 0),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_KEY, InventoryKey.INV_ROOF_KEY, 1, 0),
        new MapSurfaceDefinition(SurfaceKey.SRFC_IRON_KEY, InventoryKey.INV_IRON_KEY, 1, 5).setDepth(5, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_COAL_KEY, InventoryKey.INV_COAL_KEY, 1, 10).setDepth(10, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_KEY, InventoryKey.INV_ROCK_KEY, 1, 1).setDepth(0, 100).setSize(2, 5),
        new MapSurfaceDefinition(SurfaceKey.SRFC_IRON_PLATFORM_KEY, InventoryKey.INV_IRON_PLATFORM_KEY, 1, 1, CollisionType.PLATFORM).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOOD_PLATFORM_KEY, InventoryKey.INV_WOOD_PLATFORM_KEY, 1, 1, CollisionType.PLATFORM).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOOD_LADDER_KEY, InventoryKey.INV_WOOD_LADDER_KEY, 1, 1, CollisionType.LADDER).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_TL_KEY, InventoryKey.INV_ROOF_TL_KEY, 1, 0, CollisionType.SOLID_TL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_TR_KEY, InventoryKey.INV_ROOF_TR_KEY, 1, 0, CollisionType.SOLID_TR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_TL_KEY, InventoryKey.INV_ROCK_BRICK_TL_KEY, 1, 0, CollisionType.SOLID_TL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_TR_KEY, InventoryKey.INV_ROCK_BRICK_TR_KEY, 1, 0, CollisionType.SOLID_TR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_BL_KEY, InventoryKey.INV_ROCK_BRICK_BL_KEY, 1, 0, CollisionType.SOLID_BL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_BR_KEY, InventoryKey.INV_ROCK_BRICK_BR_KEY, 1, 0, CollisionType.SOLID_BR)
    ]
}