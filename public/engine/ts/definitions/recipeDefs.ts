namespace Lich {
    export let WORKSTATIONS_ICONS = {};
    WORKSTATIONS_ICONS[MapObjectKey.MAP_ANVIL_KEY] = InventoryKey.INV_ANVIL_KEY;
    WORKSTATIONS_ICONS[MapObjectKey.MAP_SMELTER_KEY] = InventoryKey.INV_SMELTER_KEY;
    WORKSTATIONS_ICONS[MapObjectKey.MAP_CAULDRON_KEY] = InventoryKey.INV_CAULDRON_KEY;

    export let RECIPE_DEFS = [
        // By hand recipes
        [[InventoryKey.INV_XMAS_TREE_KEY, 1], [
            [InventoryKey.INV_WOOD_KEY, 5],
            [InventoryKey.INV_XMAS_RED_BAUBLE_KEY, 4],
            [InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY, 4],
            [InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY, 4],
            [InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY, 4],
            [InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY, 4],
        ]],
        [[InventoryKey.INV_SNOWMAN, 1], [
            [InventoryKey.INV_SNOWBALL, 4],
            [InventoryKey.INV_COAL_KEY, 1],
            [InventoryKey.INV_CAULDRON_KEY, 1]
        ]],
        [[InventoryKey.INV_SNOWBALL, 1], [
            [InventoryKey.INV_SNOWFLAKE, 5]
        ]],
        [[InventoryKey.INV_DOOR_KEY, 1], [
            [InventoryKey.INV_WOOD_KEY, 2]
        ]],
        [[InventoryKey.INV_CAMPFIRE_KEY, 1], [
            [InventoryKey.INV_WOOD_KEY, 2],
            [InventoryKey.INV_STRAW_KEY, 1]
        ]],
        [[InventoryKey.INV_FIREPLACE_KEY, 1], [
            [InventoryKey.INV_CAMPFIRE_KEY, 1],
            [InventoryKey.INV_BRICK_KEY, 1]
        ]],
        [[InventoryKey.INV_FIREPLACE_KEY, 1], [
            [InventoryKey.INV_CAMPFIRE_KEY, 1],
            [InventoryKey.INV_ROCK_BRICK_KEY, 1]
        ]],
        [[InventoryKey.INV_TORCH_KEY, 5], [
            [InventoryKey.INV_WOOD_KEY, 1],
            [InventoryKey.INV_STRAW_KEY, 1]
        ]],
        [[InventoryKey.INV_BRICK_KEY, 5], [
            [InventoryKey.INV_DIRT_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_KEY, 5], [
            [InventoryKey.INV_ROCK_KEY, 1]
        ]],
        [[InventoryKey.INV_KNIGHT_STATUE_KEY, 1], [
            [InventoryKey.INV_ROCK_KEY, 5]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_TL_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_TL_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_TR_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_TR_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_BL_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_BL_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_BR_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_BR_KEY, 1]
        ]],
        [[InventoryKey.INV_ROCK_BRICK_WINDOW_KEY, 1], [
            [InventoryKey.INV_ROCK_BRICK_KEY, 1],
            [InventoryKey.INV_WOOD_KEY, 1]
        ]],
        [[InventoryKey.INV_WOODWALL_WINDOW_KEY, 1], [
            [InventoryKey.INV_WOOD_KEY, 1]
        ]],
        [[InventoryKey.INV_WOOD_CHAIR, 1], [
            [InventoryKey.INV_WOOD_KEY, 2]
        ]],
        [[InventoryKey.INV_WOOD_TABLE, 1], [
            [InventoryKey.INV_WOOD_KEY, 3]
        ]],
        [[InventoryKey.INV_WOODWALL_KEY, 5], [
            [InventoryKey.INV_WOOD_KEY, 1]
        ]],
        [[InventoryKey.INV_WOOD_LADDER_KEY, 5], [
            [InventoryKey.INV_WOOD_KEY, 1]
        ]],
        [[InventoryKey.INV_WOOD_LADDER_KEY, 1], [
            [InventoryKey.INV_WOOD_PLATFORM_KEY, 1]
        ]],
        [[InventoryKey.INV_WOOD_PLATFORM_KEY, 1], [
            [InventoryKey.INV_WOOD_LADDER_KEY, 1]
        ]],
        [[InventoryKey.INV_WOOD_PLATFORM_KEY, 5], [
            [InventoryKey.INV_WOOD_KEY, 1]
        ]],
        [[InventoryKey.INV_ROOF_KEY, 5], [
            [InventoryKey.INV_WOOD_KEY, 1],
            [InventoryKey.INV_DIRT_KEY, 1]
        ]],
        [[InventoryKey.INV_ROOF_TL_KEY, 1], [
            [InventoryKey.INV_ROOF_KEY, 1]
        ]],
        [[InventoryKey.INV_ROOF_KEY, 1], [
            [InventoryKey.INV_ROOF_TL_KEY, 1]
        ]],
        [[InventoryKey.INV_ROOF_TR_KEY, 1], [
            [InventoryKey.INV_ROOF_KEY, 1]
        ]],
        [[InventoryKey.INV_ROOF_KEY, 1], [
            [InventoryKey.INV_ROOF_TR_KEY, 1]
        ]],
        [[InventoryKey.INV_SMELTER_KEY, 1], [
            [InventoryKey.INV_WOOD_KEY, 5],
            [InventoryKey.INV_DIRT_KEY, 5],
            [InventoryKey.INV_ROCK_BRICK_KEY, 10]
        ]],
        [[InventoryKey.INV_BANNER_KEY, 1], [
            [InventoryKey.INV_RED_PLANT_KEY, 1],
            [InventoryKey.INV_STRAW_KEY, 1]
        ]],
        [[InventoryKey.INV_FLOWER_POT_KEY, 1], [
            [InventoryKey.INV_RED_PLANT_KEY, 1],
            [InventoryKey.INV_MAGENTA_PLANT_KEY, 1],
            [InventoryKey.INV_CYAN_PLANT_KEY, 1],
            [InventoryKey.INV_YELLOW_PLANT_KEY, 1],
            [InventoryKey.INV_DIRT_KEY, 1]
        ]],
        // Smelter recipes
        [[InventoryKey.INV_ANVIL_KEY, 1], [
            [InventoryKey.INV_IRON_KEY, 5],
            [InventoryKey.INV_COAL_KEY, 5]
        ], MapObjectKey.MAP_SMELTER_KEY],
        [[InventoryKey.INV_IRON_INGOT_KEY, 1], [
            [InventoryKey.INV_IRON_KEY, 1],
            [InventoryKey.INV_COAL_KEY, 1]
        ], MapObjectKey.MAP_SMELTER_KEY],
        // Anvil recipes
        [[InventoryKey.INV_IRON_FENCE_KEY, 5], [
            [InventoryKey.INV_IRON_INGOT_KEY, 1],
        ], MapObjectKey.MAP_ANVIL_KEY],
        [[InventoryKey.INV_IRON_PLATFORM_KEY, 5], [
            [InventoryKey.INV_IRON_INGOT_KEY, 1],
        ], MapObjectKey.MAP_ANVIL_KEY],
        [[InventoryKey.INV_CHAIN_LADDER_KEY, 5], [
            [InventoryKey.INV_IRON_INGOT_KEY, 1],
        ], MapObjectKey.MAP_ANVIL_KEY],
        [[InventoryKey.INV_CAULDRON_KEY, 1], [
            [InventoryKey.INV_IRON_INGOT_KEY, 1],
        ], MapObjectKey.MAP_ANVIL_KEY],
        [[InventoryKey.INV_CHANDELIER_KEY, 1], [
            [InventoryKey.INV_GOLD_ORE_KEY, 5],
        ], MapObjectKey.MAP_ANVIL_KEY],
        // Cauldron recipes
        [[InventoryKey.INV_RED_FLASK_KEY, 1], [
            [InventoryKey.INV_CHICKEN_TALON_KEY, 1],
            [InventoryKey.INV_RED_PLANT_KEY, 2],
        ], MapObjectKey.MAP_CAULDRON_KEY]
    ]
}