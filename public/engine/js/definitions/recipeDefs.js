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
        [[Lich.InventoryKey.INV_SMELTER_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 5],
                [Lich.InventoryKey.INV_DIRT_KEY, 5],
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 10]
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
            ], Lich.MapObjectKey.MAP_ANVIL_KEY]
    ];
})(Lich || (Lich = {}));
