namespace Lich {
    export let SURFACE_TRANSITION_DEFS: Array<MapSurfaceTransitionDefinition> = [
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_DIRT_KEY, SurfaceKey.SRFC_ROCK_KEY, SurfaceKey.SRFC_TRANS_DIRT_ROCK_KEY),
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_DIRT_KEY, SurfaceKey.SRFC_COAL_KEY, SurfaceKey.SRFC_TRANS_DIRT_COAL_KEY),
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_DIRT_KEY, SurfaceKey.SRFC_IRON_KEY, SurfaceKey.SRFC_TRANS_DIRT_IRON_KEY)
    ]

    export let SURFACE_DEFS: Array<MapSurfaceDefinition> = [
        // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
        // jsou dle frekvence usazovány jiné povrchy
        new MapSurfaceDefinition(SurfaceKey.SRFC_DIRT_KEY, InventoryKey.INV_DIRT_KEY, 1, 0, new Color(156, 108, 36)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOODWALL_KEY, InventoryKey.INV_WOODWALL_KEY, 1, 0, new Color(181, 129, 28)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_KRYSTAL_KEY, InventoryKey.INV_KRYSTAL_KEY, 1, 10, new Color(0, 201, 201)).setDepth(50, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_GOLD_ORE_KEY, InventoryKey.INV_GOLD_ORE_KEY, 1, 40, new Color(228, 202, 127)).setDepth(20, 80),
        new MapSurfaceDefinition(SurfaceKey.SRFC_FLORITE_KEY, InventoryKey.INV_FLORITE_KEY, 1, 10, new Color(159, 68, 181)).setDepth(70, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_BRICK_KEY, InventoryKey.INV_BRICK_KEY, 1, 0, new Color(79, 39, 0)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_KEY, InventoryKey.INV_ROCK_BRICK_KEY, 1, 0, new Color(62, 62, 62)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_STRAW_KEY, InventoryKey.INV_STRAW_KEY, 1, 0, new Color(219, 187, 39)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_KEY, InventoryKey.INV_ROOF_KEY, 1, 0, new Color(156, 60, 28)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_IRON_KEY, InventoryKey.INV_IRON_KEY, 1, 5, new Color(177, 88, 33)).setDepth(5, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_COAL_KEY, InventoryKey.INV_COAL_KEY, 1, 10, new Color(37, 27, 27)).setDepth(10, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_KEY, InventoryKey.INV_ROCK_KEY, 1, 1, new Color(82, 82, 82)).setDepth(0, 100).setSize(2, 5),
        new MapSurfaceDefinition(SurfaceKey.SRFC_IRON_PLATFORM_KEY, InventoryKey.INV_IRON_PLATFORM_KEY, 1, 1, new Color(54, 54, 54), CollisionType.PLATFORM).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOOD_PLATFORM_KEY, InventoryKey.INV_WOOD_PLATFORM_KEY, 1, 1, new Color(171, 119, 18), CollisionType.PLATFORM).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOOD_LADDER_KEY, InventoryKey.INV_WOOD_LADDER_KEY, 1, 1, new Color(171, 119, 18), CollisionType.LADDER).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_TL_KEY, InventoryKey.INV_ROOF_TL_KEY, 1, 0, new Color(156, 60, 28), CollisionType.SOLID_TL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_TR_KEY, InventoryKey.INV_ROOF_TR_KEY, 1, 0, new Color(156, 60, 28), CollisionType.SOLID_TR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_TL_KEY, InventoryKey.INV_ROCK_BRICK_TL_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_TL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_TR_KEY, InventoryKey.INV_ROCK_BRICK_TR_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_TR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_BL_KEY, InventoryKey.INV_ROCK_BRICK_BL_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_BL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_BR_KEY, InventoryKey.INV_ROCK_BRICK_BR_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_BR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_CHAIN_LADDER_KEY, InventoryKey.INV_CHAIN_LADDER_KEY, 1, 0, new Color(54, 54, 54), CollisionType.LADDER)
    ]
}