var Lich;
(function (Lich) {
    Lich.SURFACE_DEFS = [
        // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
        // jsou dle frekvence usazovány jiné povrchy
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_DIRT_KEY, Lich.InventoryKey.INV_DIRT_KEY, 1, 0, new Lich.Color(156, 108, 36)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOODWALL_KEY, Lich.InventoryKey.INV_WOODWALL_KEY, 1, 0, new Lich.Color(181, 129, 28)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_KRYSTAL_KEY, Lich.InventoryKey.INV_KRYSTAL_KEY, 1, 10, new Lich.Color(0, 201, 201)).setDepth(50, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_GOLD_ORE_KEY, Lich.InventoryKey.INV_GOLD_ORE_KEY, 1, 40, new Lich.Color(228, 202, 127)).setDepth(20, 80),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_FLORITE_KEY, Lich.InventoryKey.INV_FLORITE_KEY, 1, 10, new Lich.Color(159, 68, 181)).setDepth(70, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_BRICK_KEY, Lich.InventoryKey.INV_BRICK_KEY, 1, 0, new Lich.Color(79, 39, 0)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY, Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1, 0, new Lich.Color(62, 62, 62)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_STRAW_KEY, Lich.InventoryKey.INV_STRAW_KEY, 1, 0, new Lich.Color(219, 187, 39)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROOF_KEY, Lich.InventoryKey.INV_ROOF_KEY, 1, 0, new Lich.Color(156, 60, 28)),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_IRON_KEY, Lich.InventoryKey.INV_IRON_KEY, 1, 5, new Lich.Color(177, 88, 33)).setDepth(5, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_COAL_KEY, Lich.InventoryKey.INV_COAL_KEY, 1, 10, new Lich.Color(37, 27, 27)).setDepth(10, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_KEY, Lich.InventoryKey.INV_ROCK_KEY, 1, 1, new Lich.Color(82, 82, 82)).setDepth(0, 100).setSize(2, 5),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_IRON_PLATFORM_KEY, Lich.InventoryKey.INV_IRON_PLATFORM_KEY, 1, 1, new Lich.Color(54, 54, 54), Lich.CollisionType.PLATFORM).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOOD_PLATFORM_KEY, Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, 1, 1, new Lich.Color(171, 119, 18), Lich.CollisionType.PLATFORM).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOOD_LADDER_KEY, Lich.InventoryKey.INV_WOOD_LADDER_KEY, 1, 1, new Lich.Color(171, 119, 18), Lich.CollisionType.LADDER).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROOF_TL_KEY, Lich.InventoryKey.INV_ROOF_TL_KEY, 1, 0, new Lich.Color(156, 60, 28), Lich.CollisionType.SOLID_TL),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROOF_TR_KEY, Lich.InventoryKey.INV_ROOF_TR_KEY, 1, 0, new Lich.Color(156, 60, 28), Lich.CollisionType.SOLID_TR),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_TL_KEY, Lich.InventoryKey.INV_ROCK_BRICK_TL_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_TL),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_TR_KEY, Lich.InventoryKey.INV_ROCK_BRICK_TR_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_TR),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_BL_KEY, Lich.InventoryKey.INV_ROCK_BRICK_BL_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_BL),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_BR_KEY, Lich.InventoryKey.INV_ROCK_BRICK_BR_KEY, 1, 0, new Lich.Color(62, 62, 62), Lich.CollisionType.SOLID_BR),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_CHAIN_LADDER_KEY, Lich.InventoryKey.INV_CHAIN_LADDER_KEY, 1, 0, new Lich.Color(54, 54, 54), Lich.CollisionType.LADDER)
    ];
})(Lich || (Lich = {}));
