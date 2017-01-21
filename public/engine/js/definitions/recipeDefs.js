var Lich;
(function (Lich) {
    Lich.WORKSTATIONS_ICONS = {};
    Lich.WORKSTATIONS_ICONS[Lich.MapObjectKey.MAP_ANVIL_KEY] = Lich.InventoryKey.INV_ANVIL_KEY;
    Lich.WORKSTATIONS_ICONS[Lich.MapObjectKey.MAP_SMELTER_KEY] = Lich.InventoryKey.INV_SMELTER_KEY;
    Lich.WORKSTATIONS_ICONS[Lich.MapObjectKey.MAP_CAULDRON_KEY] = Lich.InventoryKey.INV_CAULDRON_KEY;
    Lich.RECIPE_DEFS = [
        // By hand recipes
        [[Lich.InventoryKey.INV_XMAS_TREE_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 5],
                [Lich.InventoryKey.INV_XMAS_RED_BAUBLE_KEY, 4],
                [Lich.InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY, 4],
                [Lich.InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY, 4],
                [Lich.InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY, 4],
                [Lich.InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY, 4],
            ]],
        [[Lich.InventoryKey.INV_SNOWMAN, 1], [
                [Lich.InventoryKey.INV_SNOWBALL, 4],
                [Lich.InventoryKey.INV_COAL_KEY, 1],
                [Lich.InventoryKey.INV_CAULDRON_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_SNOWBALL, 1], [
                [Lich.InventoryKey.INV_SNOWFLAKE, 5]
            ]],
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
        [[Lich.InventoryKey.INV_WOODWALL_WINDOW_KEY, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_WOOD_CHAIR, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 2]
            ]],
        [[Lich.InventoryKey.INV_WOOD_TABLE, 1], [
                [Lich.InventoryKey.INV_WOOD_KEY, 3]
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
                [Lich.InventoryKey.INV_RED_PLANT_KEY, 1],
                [Lich.InventoryKey.INV_STRAW_KEY, 1]
            ]],
        [[Lich.InventoryKey.INV_FLOWER_POT_KEY, 1], [
                [Lich.InventoryKey.INV_RED_PLANT_KEY, 1],
                [Lich.InventoryKey.INV_MAGENTA_PLANT_KEY, 1],
                [Lich.InventoryKey.INV_CYAN_PLANT_KEY, 1],
                [Lich.InventoryKey.INV_YELLOW_PLANT_KEY, 1],
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
        [[Lich.InventoryKey.INV_CAULDRON_KEY, 1], [
                [Lich.InventoryKey.INV_IRON_INGOT_KEY, 1],
            ], Lich.MapObjectKey.MAP_ANVIL_KEY],
        [[Lich.InventoryKey.INV_CHANDELIER_KEY, 1], [
                [Lich.InventoryKey.INV_GOLD_KEY, 5],
            ], Lich.MapObjectKey.MAP_ANVIL_KEY],
        // Cauldron recipes
        [[Lich.InventoryKey.INV_RED_FLASK_KEY, 1], [
                [Lich.InventoryKey.INV_CHICKEN_TALON_KEY, 1],
                [Lich.InventoryKey.INV_RED_PLANT_KEY, 2],
            ], Lich.MapObjectKey.MAP_CAULDRON_KEY]
    ];
})(Lich || (Lich = {}));
