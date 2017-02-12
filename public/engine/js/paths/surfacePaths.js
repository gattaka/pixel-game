var Lich;
(function (Lich) {
    var tsf = Lich.ThemeWatch.getThemeSuffix();
    Lich.SURFACE_PATHS = [
        ["dirt" + tsf, Lich.SurfaceKey.SRFC_DIRT_KEY],
        ["woodwall", Lich.SurfaceKey.SRFC_WOODWALL_KEY],
        ["krystals", Lich.SurfaceKey.SRFC_KRYSTAL_KEY],
        ["florite", Lich.SurfaceKey.SRFC_FLORITE_KEY],
        ["brick", Lich.SurfaceKey.SRFC_BRICK_KEY],
        ["straw", Lich.SurfaceKey.SRFC_STRAW_KEY],
        ["roof", Lich.SurfaceKey.SRFC_ROOF_KEY],
        ["iron", Lich.SurfaceKey.SRFC_IRON_KEY],
        ["coal", Lich.SurfaceKey.SRFC_COAL_KEY],
        ["rock", Lich.SurfaceKey.SRFC_ROCK_KEY],
        ["rock_brick", Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY],
        ["iron_platform", Lich.SurfaceKey.SRFC_IRON_PLATFORM_KEY],
        ["wood_platform", Lich.SurfaceKey.SRFC_WOOD_PLATFORM_KEY],
        ["wood_ladder", Lich.SurfaceKey.SRFC_WOOD_LADDER_KEY],
        ["roof_tl", Lich.SurfaceKey.SRFC_ROOF_TL_KEY],
        ["roof_tr", Lich.SurfaceKey.SRFC_ROOF_TR_KEY],
        ["rock_brick_tl", Lich.SurfaceKey.SRFC_ROCK_BRICK_TL_KEY],
        ["rock_brick_tr", Lich.SurfaceKey.SRFC_ROCK_BRICK_TR_KEY],
        ["rock_brick_bl", Lich.SurfaceKey.SRFC_ROCK_BRICK_BL_KEY],
        ["rock_brick_br", Lich.SurfaceKey.SRFC_ROCK_BRICK_BR_KEY],
        ["chain_ladder", Lich.SurfaceKey.SRFC_CHAIN_LADDER_KEY],
        ["gold", Lich.SurfaceKey.SRFC_GOLD_KEY],
        // Transitions
        ["dirt_to_rock", Lich.SurfaceKey.SRFC_TRANS_DIRT_ROCK_KEY],
        ["dirt_to_coal", Lich.SurfaceKey.SRFC_TRANS_DIRT_COAL_KEY],
        ["dirt_to_iron", Lich.SurfaceKey.SRFC_TRANS_DIRT_IRON_KEY],
        ["dirt_to_gold", Lich.SurfaceKey.SRFC_TRANS_DIRT_GOLD_KEY],
        ["dirt_to_krystals", Lich.SurfaceKey.SRFC_TRANS_DIRT_KRYSTAL_KEY],
        ["dirt_to_florite", Lich.SurfaceKey.SRFC_TRANS_DIRT_FLORITE_KEY]
    ];
    // Fog
    Lich.FOG_PATH = [
        "fog", Lich.FogKey.FOG_KEY
    ];
})(Lich || (Lich = {}));
