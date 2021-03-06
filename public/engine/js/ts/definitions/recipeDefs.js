var Lich;
(function (Lich) {
    Lich.WORKSTATIONS_ICONS = {};
    Lich.WORKSTATIONS_ICONS[Lich.MapObjectKey.MAP_ANVIL_KEY] = Lich.InventoryKey.INV_ANVIL_KEY;
    Lich.WORKSTATIONS_ICONS[Lich.MapObjectKey.MAP_SMELTER_KEY] = Lich.InventoryKey.INV_SMELTER_KEY;
    Lich.RECIPE_DEFS = [
        // By hand recipes
        [[Lich.InventoryKey.INV_DOOR_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 2]
            ]],
        [[Lich.InventoryKey.INV_CAMPFIRE_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 2],
                [Lich.InventoryKey.INV_STRAW_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_FIREPLACE_KEY, 1], [
                [Lich.InventoryKey.INV_CAMPFIRE_KEY, 1],
                [Lich.InventoryKey.INV_BRICK_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_FIREPLACE_KEY, 1], [
                [Lich.InventoryKey.INV_CAMPFIRE_KEY, 1],
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_TORCH_KEY, 5], [
                [Lich.InventoryKey.INV_WOOD_KEY, 1],
                [Lich.InventoryKey.INV_STRAW_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_BRICK_KEY, 5], [
                [Lich.InventoryKey.INV_DIRT_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_KEY, 5], [
                [Lich.InventoryKey.INV_ROCK_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_KNIGHT_STATUE_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_KEY, 5]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_TL_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_TL_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_TR_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_TR_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_BL_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_BL_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_BR_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_BR_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROCK_BRICK_WINDOW_KEY, 1], [
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 1],
                [Lich.InventoryKey.INV_WOOD_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_WOODWALL_KEY, 5], [
                [Lich.InventoryKey.INV_WOOD_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_WOOD_LADDER_KEY, 5], [
                [Lich.InventoryKey.INV_WOOD_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_WOOD_LADDER_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_LADDER_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, 5], [
                [Lich.InventoryKey.INV_WOOD_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROOF_KEY, 5], [
                [Lich.InventoryKey.INV_WOOD_KEY, 1],
                [Lich.InventoryKey.INV_DIRT_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROOF_TL_KEY, 1], [
                [Lich.InventoryKey.INV_ROOF_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROOF_KEY, 1], [
                [Lich.InventoryKey.INV_ROOF_TL_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROOF_TR_KEY, 1], [
                [Lich.InventoryKey.INV_ROOF_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_ROOF_KEY, 1], [
                [Lich.InventoryKey.INV_ROOF_TR_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_SMELTER_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 5],
                [Lich.InventoryKey.INV_DIRT_KEY, 5],
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 10]
            ]],
        [[Lich.InventoryKey.INV_BANNER_KEY, 1], [
                [Lich.InventoryKey.INV_PLANT_KEY, 1],
                [Lich.InventoryKey.INV_STRAW_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_FLOWER_POT_KEY, 1], [
                [Lich.InventoryKey.INV_PLANT_KEY, 1],
                [Lich.InventoryKey.INV_PLANT2_KEY, 1],
                [Lich.InventoryKey.INV_PLANT3_KEY, 1],
                [Lich.InventoryKey.INV_PLANT4_KEY, 1],
                [Lich.InventoryKey.INV_DIRT_KEY, 1]
            ]],
        // Smelter recipes
        [[Lich.InventoryKey.INV_ANVIL_KEY, 1], [
                [Lich.InventoryKey.INV_IRON_KEY, 5],
                [Lich.InventoryKey.INV_COAL_KEY, 5]
            ], Lich.MapObjectKey.MAP_SMELTER_KEY],
        [[Lich.InventoryKey.INV_IRON_INGOT_KEY, 1], [
                [Lich.InventoryKey.INV_IRON_KEY, 1],
                [Lich.InventoryKey.INV_COAL_KEY, 1]
            ], Lich.MapObjectKey.MAP_SMELTER_KEY],
        // Anvil recipes
        [[Lich.InventoryKey.INV_IRON_FENCE_KEY, 5], [
                [Lich.InventoryKey.INV_IRON_INGOT_KEY, 1],
            ], Lich.MapObjectKey.MAP_ANVIL_KEY],
        [[Lich.InventoryKey.INV_IRON_PLATFORM_KEY, 5], [
                [Lich.InventoryKey.INV_IRON_INGOT_KEY, 1],
            ], Lich.MapObjectKey.MAP_ANVIL_KEY],
        [[Lich.InventoryKey.INV_CHAIN_LADDER_KEY, 5], [
                [Lich.InventoryKey.INV_IRON_INGOT_KEY, 1],
            ], Lich.MapObjectKey.MAP_ANVIL_KEY],
        [[Lich.InventoryKey.INV_CHANDELIER_KEY, 1], [
                [Lich.InventoryKey.INV_GOLD_ORE_KEY, 5],
            ], Lich.MapObjectKey.MAP_ANVIL_KEY]
    ];
})(Lich || (Lich = {}));
