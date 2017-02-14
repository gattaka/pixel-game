namespace Lich {
    let tsf = ThemeWatch.getThemeSuffix();

    // Fog
    export let FOG_DEF: [string, FogKey] = [
        "fog", FogKey.FOG_KEY
    ]

    export let SURFACE_TRANSITION_DEFS: Array<MapSurfaceTransitionDefinition> = [
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_ROCK_KEY, SurfaceKey.SRFC_TRANS_DIRT_ROCK_KEY, "dirt_to_rock"),
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_COAL_KEY, SurfaceKey.SRFC_TRANS_DIRT_COAL_KEY, "dirt_to_coal"),
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_IRON_KEY, SurfaceKey.SRFC_TRANS_DIRT_IRON_KEY, "dirt_to_iron"),
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_GOLD_KEY, SurfaceKey.SRFC_TRANS_DIRT_GOLD_KEY, "dirt_to_gold"),
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_KRYSTAL_KEY, SurfaceKey.SRFC_TRANS_DIRT_KRYSTAL_KEY, "dirt_to_krystals"),
        new MapSurfaceTransitionDefinition(SurfaceKey.SRFC_FLORITE_KEY, SurfaceKey.SRFC_TRANS_DIRT_FLORITE_KEY, "dirt_to_florite")
    ]

    export let SURFACE_DEFS: Array<MapSurfaceDefinition> = [
        // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
        // jsou dle frekvence usazovány jiné povrchy
        new MapSurfaceDefinition(SurfaceKey.SRFC_DIRT_KEY, "dirt" + tsf, InventoryKey.INV_DIRT_KEY, 1, 0, new Color(156, 108, 36)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOODWALL_KEY, "woodwall", InventoryKey.INV_WOODWALL_KEY, 1, 0, new Color(181, 129, 28)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_KRYSTAL_KEY, "krystals", InventoryKey.INV_KRYSTAL_KEY, 1, 10, new Color(0, 201, 201)).setDepth(50, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_GOLD_KEY, "gold", InventoryKey.INV_GOLD_KEY, 1, 40, new Color(228, 202, 127)).setDepth(20, 80),
        new MapSurfaceDefinition(SurfaceKey.SRFC_FLORITE_KEY, "florite", InventoryKey.INV_FLORITE_KEY, 1, 10, new Color(159, 68, 181)).setDepth(70, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_BRICK_KEY, "brick", InventoryKey.INV_BRICK_KEY, 1, 0, new Color(79, 39, 0)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_KEY, "rock_brick", InventoryKey.INV_ROCK_BRICK_KEY, 1, 0, new Color(62, 62, 62)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_STRAW_KEY, "straw", InventoryKey.INV_STRAW_KEY, 1, 0, new Color(219, 187, 39)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_KEY, "roof", InventoryKey.INV_ROOF_KEY, 1, 0, new Color(156, 60, 28)),
        new MapSurfaceDefinition(SurfaceKey.SRFC_IRON_KEY, "iron", InventoryKey.INV_IRON_KEY, 1, 5, new Color(177, 88, 33)).setDepth(5, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_COAL_KEY, "coal", InventoryKey.INV_COAL_KEY, 1, 10, new Color(37, 27, 27)).setDepth(10, 100),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_KEY, "rock", InventoryKey.INV_ROCK_KEY, 1, 1, new Color(82, 82, 82)).setDepth(0, 100).setSize(2, 5),
        new MapSurfaceDefinition(SurfaceKey.SRFC_IRON_PLATFORM_KEY, "iron_platform", InventoryKey.INV_IRON_PLATFORM_KEY, 1, 1, new Color(54, 54, 54), CollisionType.PLATFORM).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOOD_PLATFORM_KEY, "wood_platform", InventoryKey.INV_WOOD_PLATFORM_KEY, 1, 1, new Color(171, 119, 18), CollisionType.PLATFORM).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_WOOD_LADDER_KEY, "wood_ladder", InventoryKey.INV_WOOD_LADDER_KEY, 1, 1, new Color(171, 119, 18), CollisionType.LADDER).setDepth(-1, -1),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_TL_KEY, "roof_tl", InventoryKey.INV_ROOF_TL_KEY, 1, 0, new Color(156, 60, 28), CollisionType.SOLID_TL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROOF_TR_KEY, "roof_tr", InventoryKey.INV_ROOF_TR_KEY, 1, 0, new Color(156, 60, 28), CollisionType.SOLID_TR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_TL_KEY, "rock_brick_tl", InventoryKey.INV_ROCK_BRICK_TL_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_TL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_TR_KEY, "rock_brick_tr", InventoryKey.INV_ROCK_BRICK_TR_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_TR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_BL_KEY, "rock_brick_bl", InventoryKey.INV_ROCK_BRICK_BL_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_BL),
        new MapSurfaceDefinition(SurfaceKey.SRFC_ROCK_BRICK_BR_KEY, "rock_brick_br", InventoryKey.INV_ROCK_BRICK_BR_KEY, 1, 0, new Color(62, 62, 62), CollisionType.SOLID_BR),
        new MapSurfaceDefinition(SurfaceKey.SRFC_CHAIN_LADDER_KEY, "chain_ladder", InventoryKey.INV_CHAIN_LADDER_KEY, 1, 0, new Color(54, 54, 54), CollisionType.LADDER)
    ]
}