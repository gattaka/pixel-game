var Lich;
(function (Lich) {
    (function (InventoryKey) {
        InventoryKey[InventoryKey["INV_BERRY_KEY"] = 0] = "INV_BERRY_KEY";
        InventoryKey[InventoryKey["INV_BONES_KEY"] = 1] = "INV_BONES_KEY";
        InventoryKey[InventoryKey["INV_WOOD_KEY"] = 2] = "INV_WOOD_KEY";
        InventoryKey[InventoryKey["INV_STRAW_KEY"] = 3] = "INV_STRAW_KEY";
        InventoryKey[InventoryKey["INV_MUSHROOM_KEY"] = 4] = "INV_MUSHROOM_KEY";
        InventoryKey[InventoryKey["INV_MUSHROOM2_KEY"] = 5] = "INV_MUSHROOM2_KEY";
        InventoryKey[InventoryKey["INV_MUSHROOM3_KEY"] = 6] = "INV_MUSHROOM3_KEY";
        InventoryKey[InventoryKey["INV_RED_PLANT_KEY"] = 7] = "INV_RED_PLANT_KEY";
        InventoryKey[InventoryKey["INV_MAGENTA_PLANT_KEY"] = 8] = "INV_MAGENTA_PLANT_KEY";
        InventoryKey[InventoryKey["INV_CYAN_PLANT_KEY"] = 9] = "INV_CYAN_PLANT_KEY";
        InventoryKey[InventoryKey["INV_YELLOW_PLANT_KEY"] = 10] = "INV_YELLOW_PLANT_KEY";
        InventoryKey[InventoryKey["INV_DIRT_KEY"] = 11] = "INV_DIRT_KEY";
        InventoryKey[InventoryKey["INV_KRYSTAL_KEY"] = 12] = "INV_KRYSTAL_KEY";
        InventoryKey[InventoryKey["INV_FLORITE_KEY"] = 13] = "INV_FLORITE_KEY";
        InventoryKey[InventoryKey["INV_CAMPFIRE_KEY"] = 14] = "INV_CAMPFIRE_KEY";
        InventoryKey[InventoryKey["INV_DOOR_KEY"] = 15] = "INV_DOOR_KEY";
        InventoryKey[InventoryKey["INV_BRICK_KEY"] = 16] = "INV_BRICK_KEY";
        InventoryKey[InventoryKey["INV_WOODWALL_KEY"] = 17] = "INV_WOODWALL_KEY";
        InventoryKey[InventoryKey["INV_ROOF_KEY"] = 18] = "INV_ROOF_KEY";
        InventoryKey[InventoryKey["INV_IRON_KEY"] = 19] = "INV_IRON_KEY";
        InventoryKey[InventoryKey["INV_COAL_KEY"] = 20] = "INV_COAL_KEY";
        InventoryKey[InventoryKey["INV_ROCK_KEY"] = 21] = "INV_ROCK_KEY";
        InventoryKey[InventoryKey["INV_ROCK_BRICK_KEY"] = 22] = "INV_ROCK_BRICK_KEY";
        InventoryKey[InventoryKey["INV_TORCH_KEY"] = 23] = "INV_TORCH_KEY";
        InventoryKey[InventoryKey["INV_ANVIL_KEY"] = 24] = "INV_ANVIL_KEY";
        InventoryKey[InventoryKey["INV_SMELTER_KEY"] = 25] = "INV_SMELTER_KEY";
        InventoryKey[InventoryKey["INV_IRON_INGOT_KEY"] = 26] = "INV_IRON_INGOT_KEY";
        InventoryKey[InventoryKey["INV_IRON_FENCE_KEY"] = 27] = "INV_IRON_FENCE_KEY";
        InventoryKey[InventoryKey["INV_IRON_PLATFORM_KEY"] = 28] = "INV_IRON_PLATFORM_KEY";
        InventoryKey[InventoryKey["INV_WOOD_PLATFORM_KEY"] = 29] = "INV_WOOD_PLATFORM_KEY";
        InventoryKey[InventoryKey["INV_GRAVE_KEY"] = 30] = "INV_GRAVE_KEY";
        InventoryKey[InventoryKey["INV_WOOD_LADDER_KEY"] = 31] = "INV_WOOD_LADDER_KEY";
        InventoryKey[InventoryKey["INV_FIREPLACE_KEY"] = 32] = "INV_FIREPLACE_KEY";
        InventoryKey[InventoryKey["INV_ROOF_TL_KEY"] = 33] = "INV_ROOF_TL_KEY";
        InventoryKey[InventoryKey["INV_ROOF_TR_KEY"] = 34] = "INV_ROOF_TR_KEY";
        InventoryKey[InventoryKey["INV_ROCK_BRICK_TL_KEY"] = 35] = "INV_ROCK_BRICK_TL_KEY";
        InventoryKey[InventoryKey["INV_ROCK_BRICK_TR_KEY"] = 36] = "INV_ROCK_BRICK_TR_KEY";
        InventoryKey[InventoryKey["INV_ROCK_BRICK_BL_KEY"] = 37] = "INV_ROCK_BRICK_BL_KEY";
        InventoryKey[InventoryKey["INV_ROCK_BRICK_BR_KEY"] = 38] = "INV_ROCK_BRICK_BR_KEY";
        InventoryKey[InventoryKey["INV_ROCK_BRICK_WINDOW_KEY"] = 39] = "INV_ROCK_BRICK_WINDOW_KEY";
        InventoryKey[InventoryKey["INV_KNIGHT_STATUE_KEY"] = 40] = "INV_KNIGHT_STATUE_KEY";
        InventoryKey[InventoryKey["INV_CHAIN_LADDER_KEY"] = 41] = "INV_CHAIN_LADDER_KEY";
        InventoryKey[InventoryKey["INV_BANNER_KEY"] = 42] = "INV_BANNER_KEY";
        InventoryKey[InventoryKey["INV_FLOWER_POT_KEY"] = 43] = "INV_FLOWER_POT_KEY";
        InventoryKey[InventoryKey["INV_CHANDELIER_KEY"] = 44] = "INV_CHANDELIER_KEY";
        InventoryKey[InventoryKey["INV_GOLD_KEY"] = 45] = "INV_GOLD_KEY";
        InventoryKey[InventoryKey["INV_CHICKEN_MEAT_KEY"] = 46] = "INV_CHICKEN_MEAT_KEY";
        InventoryKey[InventoryKey["INV_CHICKEN_TALON_KEY"] = 47] = "INV_CHICKEN_TALON_KEY";
        InventoryKey[InventoryKey["INV_CAULDRON_KEY"] = 48] = "INV_CAULDRON_KEY";
        InventoryKey[InventoryKey["INV_RED_FLASK_KEY"] = 49] = "INV_RED_FLASK_KEY";
        InventoryKey[InventoryKey["INV_XMAS_BLUE_BAUBLE_KEY"] = 50] = "INV_XMAS_BLUE_BAUBLE_KEY";
        InventoryKey[InventoryKey["INV_XMAS_GREEN_BAUBLE_KEY"] = 51] = "INV_XMAS_GREEN_BAUBLE_KEY";
        InventoryKey[InventoryKey["INV_XMAS_PURPLE_BAUBLE_KEY"] = 52] = "INV_XMAS_PURPLE_BAUBLE_KEY";
        InventoryKey[InventoryKey["INV_XMAS_RED_BAUBLE_KEY"] = 53] = "INV_XMAS_RED_BAUBLE_KEY";
        InventoryKey[InventoryKey["INV_XMAS_YELLOW_BAUBLE_KEY"] = 54] = "INV_XMAS_YELLOW_BAUBLE_KEY";
        InventoryKey[InventoryKey["INV_XMAS_HOLLY_KEY"] = 55] = "INV_XMAS_HOLLY_KEY";
        InventoryKey[InventoryKey["INV_XMAS_CHAIN_KEY"] = 56] = "INV_XMAS_CHAIN_KEY";
        InventoryKey[InventoryKey["INV_XMAS_TREE_KEY"] = 57] = "INV_XMAS_TREE_KEY";
        InventoryKey[InventoryKey["INV_ADVENT_WREATH_KEY"] = 58] = "INV_ADVENT_WREATH_KEY";
        InventoryKey[InventoryKey["INV_GIFT1_KEY"] = 59] = "INV_GIFT1_KEY";
        InventoryKey[InventoryKey["INV_GIFT2_KEY"] = 60] = "INV_GIFT2_KEY";
        InventoryKey[InventoryKey["INV_GIFT3_KEY"] = 61] = "INV_GIFT3_KEY";
        InventoryKey[InventoryKey["INV_SNOWBALL_KEY"] = 62] = "INV_SNOWBALL_KEY";
        InventoryKey[InventoryKey["INV_SNOWMAN_KEY"] = 63] = "INV_SNOWMAN_KEY";
        InventoryKey[InventoryKey["INV_SNOWFLAKE_KEY"] = 64] = "INV_SNOWFLAKE_KEY";
        InventoryKey[InventoryKey["INV_WOODWALL_WINDOW_KEY"] = 65] = "INV_WOODWALL_WINDOW_KEY";
        InventoryKey[InventoryKey["INV_WOOD_CHAIR_KEY"] = 66] = "INV_WOOD_CHAIR_KEY";
        InventoryKey[InventoryKey["INV_WOOD_TABLE_KEY"] = 67] = "INV_WOOD_TABLE_KEY";
        InventoryKey[InventoryKey["INV_LOVELETTER_KEY"] = 68] = "INV_LOVELETTER_KEY";
        InventoryKey[InventoryKey["INV_LOVEARROW_KEY"] = 69] = "INV_LOVEARROW_KEY";
        InventoryKey[InventoryKey["INV_GOLD_COINS_KEY"] = 70] = "INV_GOLD_COINS_KEY";
        InventoryKey[InventoryKey["INV_SILVER_COINS_KEY"] = 71] = "INV_SILVER_COINS_KEY";
        InventoryKey[InventoryKey["INV_GOLD_DISHES_KEY"] = 72] = "INV_GOLD_DISHES_KEY";
        InventoryKey[InventoryKey["INV_GOLD_DISHES2_KEY"] = 73] = "INV_GOLD_DISHES2_KEY";
        InventoryKey[InventoryKey["INV_GOLD_BOWL_KEY"] = 74] = "INV_GOLD_BOWL_KEY";
        InventoryKey[InventoryKey["INV_ARMCHAIR_KEY"] = 75] = "INV_ARMCHAIR_KEY";
        InventoryKey[InventoryKey["INV_BOOKS_KEY"] = 76] = "INV_BOOKS_KEY";
        InventoryKey[InventoryKey["INV_BOOKSHELF_KEY"] = 77] = "INV_BOOKSHELF_KEY";
        InventoryKey[InventoryKey["INV_CABINET_KEY"] = 78] = "INV_CABINET_KEY";
        InventoryKey[InventoryKey["INV_CANDLE_KEY"] = 79] = "INV_CANDLE_KEY";
        InventoryKey[InventoryKey["INV_PORTRAIT_VALENTIMON_KEY"] = 80] = "INV_PORTRAIT_VALENTIMON_KEY";
    })(Lich.InventoryKey || (Lich.InventoryKey = {}));
    var InventoryKey = Lich.InventoryKey;
})(Lich || (Lich = {}));
