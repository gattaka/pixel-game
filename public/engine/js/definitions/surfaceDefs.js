var Lich;
(function (Lich) {
    var tsf = Lich.ThemeWatch.getThemeSuffix();
    // Fog
    Lich.FOG_DEF = [
        "fog", Lich.FogKey.FOG_KEY
    ];
    Lich.SURFACE_TRANSITION_DEFS = [
        new Lich.MapSurfaceTransitionDefinition(Lich.SurfaceKey.SRFC_ROCK_KEY, Lich.SurfaceKey.SRFC_TRANS_DIRT_ROCK_KEY, "dirt_to_rock"),
        new Lich.MapSurfaceTransitionDefinition(Lich.SurfaceKey.SRFC_COAL_KEY, Lich.SurfaceKey.SRFC_TRANS_DIRT_COAL_KEY, "dirt_to_coal"),
        new Lich.MapSurfaceTransitionDefinition(Lich.SurfaceKey.SRFC_IRON_KEY, Lich.SurfaceKey.SRFC_TRANS_DIRT_IRON_KEY, "dirt_to_iron"),
        new Lich.MapSurfaceTransitionDefinition(Lich.SurfaceKey.SRFC_GOLD_KEY, Lich.SurfaceKey.SRFC_TRANS_DIRT_GOLD_KEY, "dirt_to_gold"),
        new Lich.MapSurfaceTransitionDefinition(Lich.SurfaceKey.SRFC_KRYSTAL_KEY, Lich.SurfaceKey.SRFC_TRANS_DIRT_KRYSTAL_KEY, "dirt_to_krystals"),
        new Lich.MapSurfaceTransitionDefinition(Lich.SurfaceKey.SRFC_FLORITE_KEY, Lich.SurfaceKey.SRFC_TRANS_DIRT_FLORITE_KEY, "dirt_to_florite")
    ];
    Lich.SURFACE_DEFS = [
        // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
        // jsou dle frekvence usazovány jiné povrchy
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_DIRT_KEY, "dirt" + tsf, Lich.InventoryKey.INV_DIRT_KEY, 1, 0, new Lich.Color(156, 108, 36)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOODWALL_KEY, "woodwall", Lich.InventoryKey.INV_WOODWALL_KEY, 1, 0, new Lich.Color(181, 129, 28)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_KRYSTAL_KEY, "krystals", Lich.InventoryKey.INV_KRYSTAL_KEY, 1, 10, new Lich.Color(0, 201, 201)).setDepth(50, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_GOLD_KEY, "gold", Lich.InventoryKey.INV_GOLD_KEY, 1, 40, new Lich.Color(228, 202, 127)).setDepth(20, 80),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_FLORITE_KEY, "florite", Lich.InventoryKey.INV_FLORITE_KEY, 1, 10, new Lich.Color(159, 68, 181)).setDepth(70, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_BRICK_KEY, "brick", Lich.InventoryKey.INV_BRICK_KEY, 1, 0, new Lich.Color(79, 39, 0)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY, "rock_brick", Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1, 0, new Lich.Color(62, 62, 62)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_STRAW_KEY, "straw", Lich.InventoryKey.INV_STRAW_KEY, 1, 0, new Lich.Color(219, 187, 39)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROOF_KEY, "roof", Lich.InventoryKey.INV_ROOF_KEY, 1, 0, new Lich.Color(156, 60, 28)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_IRON_KEY, "iron", Lich.InventoryKey.INV_IRON_KEY, 1, 5, new Lich.Color(177, 88, 33)).setDepth(5, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_COAL_KEY, "coal", Lich.InventoryKey.INV_COAL_KEY, 1, 10, new Lich.Color(37, 27, 27)).setDepth(10, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_KEY, "rock", Lich.InventoryKey.INV_ROCK_KEY, 1, 1, new Lich.Color(82, 82, 82)).setDepth(0, 100).setSize(2, 5),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_IRON_PLATFORM_KEY, "iron_platform", Lich.InventoryKey.INV_IRON_PLATFORM_KEY, 1, 1, new Lich.Color(54, 54, 54), Lich.CollisionType.PLATFORM).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOOD_PLATFORM_KEY, "wood_platform", Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, 1, 1, new Lich.Color(171, 119, 18), Lich.CollisionType.PLATFORM).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOOD_LADDER_KEY, "wood_ladder", Lich.InventoryKey.INV_WOOD_LADDER_KEY, 1, 1, new Lich.Color(171, 119, 18), Lich.CollisionType.LADDER).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROOF_TL_KEY, "roof_tl", Lich.InventoryKey.INV_ROOF_TL_KEY, 1, 0, new Lich.Color(156, 60, 28), Lich.CollisionType.SOLID_TL),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROOF_TR_KEY, "roof_tr", Lich.InventoryKey.INV_ROOF_TR_KEY, 1, 0, new Lich.Color(156, 60, 28), Lich.CollisionType.SOLID_TR),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_TL_KEY, "rock_brick_tl", Lich.InventoryKey.INV_ROCK_BRICK_TL_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_TL),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_TR_KEY, "rock_brick_tr", Lich.InventoryKey.INV_ROCK_BRICK_TR_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_TR),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_BL_KEY, "rock_brick_bl", Lich.InventoryKey.INV_ROCK_BRICK_BL_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_BL),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_BR_KEY, "rock_brick_br", Lich.InventoryKey.INV_ROCK_BRICK_BR_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_BR),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_CHAIN_LADDER_KEY, "chain_ladder", Lich.InventoryKey.INV_CHAIN_LADDER_KEY, 1, 0, new Lich.Color(54, 54, 54), Lich.CollisionType.LADDER)
    ];
})(Lich || (Lich = {}));
