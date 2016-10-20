var Lich;
(function (Lich) {
    Lich.RECIPE_DEFS = [
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
        [[Lich.InventoryKey.INV_ROOF_KEY, 5], [
                [Lich.InventoryKey.INV_WOOD_KEY, 1],
                [Lich.InventoryKey.INV_DIRT_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_SMELTER_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 5],
                [Lich.InventoryKey.INV_DIRT_KEY, 5],
                [Lich.InventoryKey.INV_ROCK_BRICK_KEY, 10]
            ]],
        [[Lich.InventoryKey.INV_ANVIL_KEY, 1], [
                [Lich.InventoryKey.INV_IRON_KEY, 10],
                [Lich.InventoryKey.INV_COAL_KEY, 5]
            ]],
        [[Lich.InventoryKey.INV_IRON_INGOT_KEY, 1], [
                [Lich.InventoryKey.INV_IRON_KEY, 10],
                [Lich.InventoryKey.INV_COAL_KEY, 5]
            ]],
    ];
})(Lich || (Lich = {}));
