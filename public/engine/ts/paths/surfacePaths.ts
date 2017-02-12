namespace Lich {
    let tsf = ThemeWatch.getThemeSuffix();

    export let SURFACE_PATHS: Array<[string, SurfaceKey]> = [
        ["dirt" + tsf, SurfaceKey.SRFC_DIRT_KEY],
        ["woodwall", SurfaceKey.SRFC_WOODWALL_KEY],
        ["krystals", SurfaceKey.SRFC_KRYSTAL_KEY],
        ["florite", SurfaceKey.SRFC_FLORITE_KEY],
        ["brick", SurfaceKey.SRFC_BRICK_KEY],
        ["straw", SurfaceKey.SRFC_STRAW_KEY],
        ["roof", SurfaceKey.SRFC_ROOF_KEY],
        ["iron", SurfaceKey.SRFC_IRON_KEY],
        ["coal", SurfaceKey.SRFC_COAL_KEY],
        ["rock", SurfaceKey.SRFC_ROCK_KEY],
        ["rock_brick", SurfaceKey.SRFC_ROCK_BRICK_KEY],
        ["iron_platform", SurfaceKey.SRFC_IRON_PLATFORM_KEY],
        ["wood_platform", SurfaceKey.SRFC_WOOD_PLATFORM_KEY],
        ["wood_ladder", SurfaceKey.SRFC_WOOD_LADDER_KEY],
        ["roof_tl", SurfaceKey.SRFC_ROOF_TL_KEY],
        ["roof_tr", SurfaceKey.SRFC_ROOF_TR_KEY],
        ["rock_brick_tl", SurfaceKey.SRFC_ROCK_BRICK_TL_KEY],
        ["rock_brick_tr", SurfaceKey.SRFC_ROCK_BRICK_TR_KEY],
        ["rock_brick_bl", SurfaceKey.SRFC_ROCK_BRICK_BL_KEY],
        ["rock_brick_br", SurfaceKey.SRFC_ROCK_BRICK_BR_KEY],
        ["chain_ladder", SurfaceKey.SRFC_CHAIN_LADDER_KEY],
        ["gold", SurfaceKey.SRFC_GOLD_KEY],
        // Transitions
        ["dirt_to_rock", SurfaceKey.SRFC_TRANS_DIRT_ROCK_KEY],
        ["dirt_to_coal", SurfaceKey.SRFC_TRANS_DIRT_COAL_KEY],
        ["dirt_to_iron", SurfaceKey.SRFC_TRANS_DIRT_IRON_KEY],
        ["dirt_to_gold", SurfaceKey.SRFC_TRANS_DIRT_GOLD_KEY],
        ["dirt_to_krystals", SurfaceKey.SRFC_TRANS_DIRT_KRYSTAL_KEY],
        ["dirt_to_florite", SurfaceKey.SRFC_TRANS_DIRT_FLORITE_KEY]
    ]

    // Fog
    export let FOG_PATH: [string, FogKey] = [
        "fog", FogKey.FOG_KEY
    ]

}