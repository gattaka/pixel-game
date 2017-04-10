var Lich;
(function (Lich) {
    var UISpriteKey;
    (function (UISpriteKey) {
        UISpriteKey[UISpriteKey["UI_PLAYER_ICON_KEY"] = 0] = "UI_PLAYER_ICON_KEY";
        UISpriteKey[UISpriteKey["UI_SKULL_KEY"] = 1] = "UI_SKULL_KEY";
        UISpriteKey[UISpriteKey["UI_GAME_OVER_KEY"] = 2] = "UI_GAME_OVER_KEY";
        // buttons
        UISpriteKey[UISpriteKey["UI_SOUND_KEY"] = 3] = "UI_SOUND_KEY";
        UISpriteKey[UISpriteKey["UI_UP_KEY"] = 4] = "UI_UP_KEY";
        UISpriteKey[UISpriteKey["UI_DOWN_KEY"] = 5] = "UI_DOWN_KEY";
        UISpriteKey[UISpriteKey["UI_LEFT_KEY"] = 6] = "UI_LEFT_KEY";
        UISpriteKey[UISpriteKey["UI_RIGHT_KEY"] = 7] = "UI_RIGHT_KEY";
        UISpriteKey[UISpriteKey["UI_LEFT_UP_KEY"] = 8] = "UI_LEFT_UP_KEY";
        UISpriteKey[UISpriteKey["UI_RIGHT_UP_KEY"] = 9] = "UI_RIGHT_UP_KEY";
        UISpriteKey[UISpriteKey["UI_LEFT_DOWN_KEY"] = 10] = "UI_LEFT_DOWN_KEY";
        UISpriteKey[UISpriteKey["UI_RIGHT_DOWN_KEY"] = 11] = "UI_RIGHT_DOWN_KEY";
        UISpriteKey[UISpriteKey["UI_CRAFT_KEY"] = 12] = "UI_CRAFT_KEY";
        UISpriteKey[UISpriteKey["UI_SAVE_KEY"] = 13] = "UI_SAVE_KEY";
        UISpriteKey[UISpriteKey["UI_LOAD_KEY"] = 14] = "UI_LOAD_KEY";
        UISpriteKey[UISpriteKey["UI_NEW_WORLD_KEY"] = 15] = "UI_NEW_WORLD_KEY";
        UISpriteKey[UISpriteKey["UI_HELP_KEY"] = 16] = "UI_HELP_KEY";
        UISpriteKey[UISpriteKey["UI_BACKPACK_KEY"] = 17] = "UI_BACKPACK_KEY";
        UISpriteKey[UISpriteKey["UI_MENU_KEY"] = 18] = "UI_MENU_KEY";
        UISpriteKey[UISpriteKey["UI_MINIMAP_KEY"] = 19] = "UI_MINIMAP_KEY";
        UISpriteKey[UISpriteKey["UI_HIGHLIGHT_KEY"] = 20] = "UI_HIGHLIGHT_KEY";
        UISpriteKey[UISpriteKey["UI_BUTTON_KEY"] = 21] = "UI_BUTTON_KEY";
        // panel
        UISpriteKey[UISpriteKey["UI_PANEL_MIDDLE_KEY"] = 22] = "UI_PANEL_MIDDLE_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_TOP_KEY"] = 23] = "UI_PANEL_TOP_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_RIGHT_KEY"] = 24] = "UI_PANEL_RIGHT_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_BOTTOM_KEY"] = 25] = "UI_PANEL_BOTTOM_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_LEFT_KEY"] = 26] = "UI_PANEL_LEFT_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_TL_KEY"] = 27] = "UI_PANEL_TL_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_TR_KEY"] = 28] = "UI_PANEL_TR_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_BR_KEY"] = 29] = "UI_PANEL_BR_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_BL_KEY"] = 30] = "UI_PANEL_BL_KEY";
        // achievements
        UISpriteKey[UISpriteKey["UI_ACH_FALLING_DOWN_KEY"] = 31] = "UI_ACH_FALLING_DOWN_KEY";
        UISpriteKey[UISpriteKey["UI_ACH_CHICKEN_MASSACRE_KEY"] = 32] = "UI_ACH_CHICKEN_MASSACRE_KEY";
        UISpriteKey[UISpriteKey["UI_ACH_CHICKEN_PROOFED_KEY"] = 33] = "UI_ACH_CHICKEN_PROOFED_KEY";
        UISpriteKey[UISpriteKey["UI_ACH_LOVE_HURTS_KEY"] = 34] = "UI_ACH_LOVE_HURTS_KEY";
        UISpriteKey[UISpriteKey["UI_ACH_HEARTBREAKING_KEY"] = 35] = "UI_ACH_HEARTBREAKING_KEY";
        // spellbook icons
        UISpriteKey[UISpriteKey["UI_SPL_FIREBALL_KEY"] = 36] = "UI_SPL_FIREBALL_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_METEOR_KEY"] = 37] = "UI_SPL_METEOR_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_LOVELETTER_KEY"] = 38] = "UI_SPL_LOVELETTER_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_LOVEARROW_KEY"] = 39] = "UI_SPL_LOVEARROW_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_ICEBOLT_KEY"] = 40] = "UI_SPL_ICEBOLT_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_USE_ITEM_KEY"] = 41] = "UI_SPL_USE_ITEM_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_REVEAL_FOG_KEY"] = 42] = "UI_SPL_REVEAL_FOG_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_TELEPORT_KEY"] = 43] = "UI_SPL_TELEPORT_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_HOME_KEY"] = 44] = "UI_SPL_HOME_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_INTERACT_KEY"] = 45] = "UI_SPL_INTERACT_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_DIG_KEY"] = 46] = "UI_SPL_DIG_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_DIG_BGR_KEY"] = 47] = "UI_SPL_DIG_BGR_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_PLACE_KEY"] = 48] = "UI_SPL_PLACE_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_PLACE_BGR_KEY"] = 49] = "UI_SPL_PLACE_BGR_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_ENEMY_KEY"] = 50] = "UI_SPL_ENEMY_KEY";
        // inventory icons
        UISpriteKey[UISpriteKey["UI_INV_BONES_KEY"] = 51] = "UI_INV_BONES_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_KEY"] = 52] = "UI_INV_WOOD_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_YELLOW_BAUBLE_KEY"] = 53] = "UI_INV_XMAS_YELLOW_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_LOVEARROW_KEY"] = 54] = "UI_INV_LOVEARROW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SNOWBALL_KEY"] = 55] = "UI_INV_SNOWBALL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHICKEN_TALON_KEY"] = 56] = "UI_INV_CHICKEN_TALON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_BLUE_BAUBLE_KEY"] = 57] = "UI_INV_XMAS_BLUE_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_GREEN_BAUBLE_KEY"] = 58] = "UI_INV_XMAS_GREEN_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_PURPLE_BAUBLE_KEY"] = 59] = "UI_INV_XMAS_PURPLE_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_RED_BAUBLE_KEY"] = 60] = "UI_INV_XMAS_RED_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SNOWFLAKE_KEY"] = 61] = "UI_INV_SNOWFLAKE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ARMCHAIR_KEY"] = 62] = "UI_INV_ARMCHAIR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BOOKS_KEY"] = 63] = "UI_INV_BOOKS_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BOOKSHELF_KEY"] = 64] = "UI_INV_BOOKSHELF_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CABINET_KEY"] = 65] = "UI_INV_CABINET_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CANDLE_KEY"] = 66] = "UI_INV_CANDLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PORTRAIT_VALENTIMON_KEY"] = 67] = "UI_INV_PORTRAIT_VALENTIMON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_MUSHROOM_KEY"] = 68] = "UI_INV_MUSHROOM_KEY";
        UISpriteKey[UISpriteKey["UI_INV_MUSHROOM2_KEY"] = 69] = "UI_INV_MUSHROOM2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_MUSHROOM3_KEY"] = 70] = "UI_INV_MUSHROOM3_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BERRY_KEY"] = 71] = "UI_INV_BERRY_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT_KEY"] = 72] = "UI_INV_PLANT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT2_KEY"] = 73] = "UI_INV_PLANT2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT3_KEY"] = 74] = "UI_INV_PLANT3_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT4_KEY"] = 75] = "UI_INV_PLANT4_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CAMPFIRE_KEY"] = 76] = "UI_INV_CAMPFIRE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_FIREPLACE_KEY"] = 77] = "UI_INV_FIREPLACE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_TORCH_KEY"] = 78] = "UI_INV_TORCH_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ANVIL_KEY"] = 79] = "UI_INV_ANVIL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SMELTER_KEY"] = 80] = "UI_INV_SMELTER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_INGOT_KEY"] = 81] = "UI_INV_IRON_INGOT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_FENCE_KEY"] = 82] = "UI_INV_IRON_FENCE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GRAVE_KEY"] = 83] = "UI_INV_GRAVE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_KNIGHT_STATUE_KEY"] = 84] = "UI_INV_KNIGHT_STATUE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BANNER_KEY"] = 85] = "UI_INV_BANNER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_FLOWER_POT_KEY"] = 86] = "UI_INV_FLOWER_POT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHANDELIER_KEY"] = 87] = "UI_INV_CHANDELIER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CAULDRON_KEY"] = 88] = "UI_INV_CAULDRON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SNOWMAN_KEY"] = 89] = "UI_INV_SNOWMAN_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_HOLLY_KEY"] = 90] = "UI_INV_XMAS_HOLLY_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_CHAIN_KEY"] = 91] = "UI_INV_XMAS_CHAIN_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_TREE_KEY"] = 92] = "UI_INV_XMAS_TREE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ADVENT_WREATH_KEY"] = 93] = "UI_INV_ADVENT_WREATH_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_COINS2_KEY"] = 94] = "UI_INV_GOLD_COINS2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SILVER_COINS_KEY"] = 95] = "UI_INV_SILVER_COINS_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_DISHES_KEY"] = 96] = "UI_INV_GOLD_DISHES_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_DISHES2_KEY"] = 97] = "UI_INV_GOLD_DISHES2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_BOWL_KEY"] = 98] = "UI_INV_GOLD_BOWL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GIFT1_KEY"] = 99] = "UI_INV_GIFT1_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GIFT2_KEY"] = 100] = "UI_INV_GIFT2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GIFT3_KEY"] = 101] = "UI_INV_GIFT3_KEY";
        UISpriteKey[UISpriteKey["UI_INV_LOVELETTER_KEY"] = 102] = "UI_INV_LOVELETTER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHICKEN_MEAT_KEY"] = 103] = "UI_INV_CHICKEN_MEAT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_RED_FLASK_KEY"] = 104] = "UI_INV_RED_FLASK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_DOOR_KEY"] = 105] = "UI_INV_DOOR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_CHAIR_KEY"] = 106] = "UI_INV_WOOD_CHAIR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_TABLE_KEY"] = 107] = "UI_INV_WOOD_TABLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_DIRT_KEY"] = 108] = "UI_INV_DIRT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOODWALL_KEY"] = 109] = "UI_INV_WOODWALL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BRICK_KEY"] = 110] = "UI_INV_BRICK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_KEY"] = 111] = "UI_INV_ROCK_BRICK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_STRAW_KEY"] = 112] = "UI_INV_STRAW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_KRYSTALS_KEY"] = 113] = "UI_INV_KRYSTALS_KEY";
        UISpriteKey[UISpriteKey["UI_INV_FLORITE_KEY"] = 114] = "UI_INV_FLORITE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_KEY"] = 115] = "UI_INV_IRON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_COAL_KEY"] = 116] = "UI_INV_COAL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_KEY"] = 117] = "UI_INV_ROCK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_PLATFORM_KEY"] = 118] = "UI_INV_IRON_PLATFORM_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_PLATFORM_KEY"] = 119] = "UI_INV_WOOD_PLATFORM_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_LADDER_KEY"] = 120] = "UI_INV_WOOD_LADDER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROOF_KEY"] = 121] = "UI_INV_ROOF_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROOF_TL_KEY"] = 122] = "UI_INV_ROOF_TL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROOF_TR_KEY"] = 123] = "UI_INV_ROOF_TR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_TL_KEY"] = 124] = "UI_INV_ROCK_BRICK_TL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_TR_KEY"] = 125] = "UI_INV_ROCK_BRICK_TR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_BL_KEY"] = 126] = "UI_INV_ROCK_BRICK_BL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_BR_KEY"] = 127] = "UI_INV_ROCK_BRICK_BR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_WINDOW_KEY"] = 128] = "UI_INV_ROCK_BRICK_WINDOW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOODWALL_WINDOW_KEY"] = 129] = "UI_INV_WOODWALL_WINDOW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHAIN_LADDER_KEY"] = 130] = "UI_INV_CHAIN_LADDER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_KEY"] = 131] = "UI_INV_GOLD_KEY";
        UISpriteKey[UISpriteKey["UI_INV_EASTER_EGG1_KEY"] = 132] = "UI_INV_EASTER_EGG1_KEY";
        UISpriteKey[UISpriteKey["UI_INV_EASTER_EGG2_KEY"] = 133] = "UI_INV_EASTER_EGG2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_EASTER_EGG3_KEY"] = 134] = "UI_INV_EASTER_EGG3_KEY";
        UISpriteKey[UISpriteKey["UI_INV_STRANGE_EGG_KEY"] = 135] = "UI_INV_STRANGE_EGG_KEY";
        UISpriteKey[UISpriteKey["UI_INV_EASTER_WHIP_KEY"] = 136] = "UI_INV_EASTER_WHIP_KEY";
    })(UISpriteKey = Lich.UISpriteKey || (Lich.UISpriteKey = {}));
})(Lich || (Lich = {}));
