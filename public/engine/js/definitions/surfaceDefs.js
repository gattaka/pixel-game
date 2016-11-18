var Lich;
(function (Lich) {
    Lich.SURFACE_DEFS = [
        // Dirt má frekvenci 0 protože je použit jako základ a až do něj 
        // jsou dle frekvence usazovány jiné povrchy
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_DIRT_KEY, Lich.InventoryKey.INV_DIRT_KEY, 1, 0),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOODWALL_KEY, Lich.InventoryKey.INV_WOODWALL_KEY, 1, 0),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_KRYSTAL_KEY, Lich.InventoryKey.INV_KRYSTAL_KEY, 1, 10).setDepth(50, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_FLORITE_KEY, Lich.InventoryKey.INV_FLORITE_KEY, 1, 10).setDepth(70, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_BRICK_KEY, Lich.InventoryKey.INV_BRICK_KEY, 1, 0),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY, Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1, 0),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_STRAW_KEY, Lich.InventoryKey.INV_STRAW_KEY, 1, 0),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROOF_KEY, Lich.InventoryKey.INV_ROOF_KEY, 1, 0),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_IRON_KEY, Lich.InventoryKey.INV_IRON_KEY, 1, 5).setDepth(5, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_COAL_KEY, Lich.InventoryKey.INV_COAL_KEY, 1, 10).setDepth(10, 100),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_ROCK_KEY, Lich.InventoryKey.INV_ROCK_KEY, 1, 1).setDepth(0, 100).setSize(2, 5),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_IRON_PLATFORM_KEY, Lich.InventoryKey.INV_IRON_PLATFORM_KEY, 1, 1, Lich.CollisionType.PLATFORM).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOOD_PLATFORM_KEY, Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, 1, 1, Lich.CollisionType.PLATFORM).setDepth(-1, -1),
        new Lich.MapSurfaceDefinition(Lich.SurfaceKey.SRFC_WOOD_LADDER_KEY, Lich.InventoryKey.INV_WOOD_LADDER_KEY, 1, 1, Lich.CollisionType.LADDER).setDepth(-1, -1)
    ];
})(Lich || (Lich = {}));
