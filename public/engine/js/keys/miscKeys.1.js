var Lich;
(function (Lich) {
    var SpritesheetKey;
    (function (SpritesheetKey) {
        SpritesheetKey[SpritesheetKey["SPST_ACHV_KEY"] = 0] = "SPST_ACHV_KEY";
        SpritesheetKey[SpritesheetKey["SPST_ANM_KEY"] = 1] = "SPST_ANM_KEY";
        SpritesheetKey[SpritesheetKey["SPST_BGR_KEY"] = 2] = "SPST_BGR_KEY";
        SpritesheetKey[SpritesheetKey["SPST_FNT_KEY"] = 3] = "SPST_FNT_KEY";
        SpritesheetKey[SpritesheetKey["SPST_FOG_KEY"] = 4] = "SPST_FOG_KEY";
        SpritesheetKey[SpritesheetKey["SPST_INV_KEY"] = 5] = "SPST_INV_KEY";
        SpritesheetKey[SpritesheetKey["SPST_MPO_KEY"] = 6] = "SPST_MPO_KEY";
        SpritesheetKey[SpritesheetKey["SPST_SRFC_KEY"] = 7] = "SPST_SRFC_KEY";
        SpritesheetKey[SpritesheetKey["SPST_SRFC_BGR_KEY"] = 8] = "SPST_SRFC_BGR_KEY";
        SpritesheetKey[SpritesheetKey["SPST_UI_KEY"] = 9] = "SPST_UI_KEY";
    })(SpritesheetKey = Lich.SpritesheetKey || (Lich.SpritesheetKey = {}));
    var BackgroundKey;
    (function (BackgroundKey) {
        BackgroundKey[BackgroundKey["BGR_DIRT_BACK_START_KEY"] = 0] = "BGR_DIRT_BACK_START_KEY";
        BackgroundKey[BackgroundKey["BGR_DIRT_BACK_KEY"] = 1] = "BGR_DIRT_BACK_KEY";
        BackgroundKey[BackgroundKey["BGR_SKY_KEY"] = 2] = "BGR_SKY_KEY";
        BackgroundKey[BackgroundKey["BGR_FAR_MOUNTAIN_KEY"] = 3] = "BGR_FAR_MOUNTAIN_KEY";
        BackgroundKey[BackgroundKey["BGR_MOUNTAIN_KEY"] = 4] = "BGR_MOUNTAIN_KEY";
        BackgroundKey[BackgroundKey["BGR_WOODLAND1_KEY"] = 5] = "BGR_WOODLAND1_KEY";
        BackgroundKey[BackgroundKey["BGR_WOODLAND2_KEY"] = 6] = "BGR_WOODLAND2_KEY";
        BackgroundKey[BackgroundKey["BGR_WOODLAND3_KEY"] = 7] = "BGR_WOODLAND3_KEY";
        BackgroundKey[BackgroundKey["BGR_WOODLAND4_KEY"] = 8] = "BGR_WOODLAND4_KEY";
        BackgroundKey[BackgroundKey["BGR_CLOUD1_KEY"] = 9] = "BGR_CLOUD1_KEY";
        BackgroundKey[BackgroundKey["BGR_CLOUD2_KEY"] = 10] = "BGR_CLOUD2_KEY";
        BackgroundKey[BackgroundKey["BGR_CLOUD3_KEY"] = 11] = "BGR_CLOUD3_KEY";
        BackgroundKey[BackgroundKey["BGR_CLOUD4_KEY"] = 12] = "BGR_CLOUD4_KEY";
        BackgroundKey[BackgroundKey["BGR_CLOUD5_KEY"] = 13] = "BGR_CLOUD5_KEY";
    })(BackgroundKey = Lich.BackgroundKey || (Lich.BackgroundKey = {}));
    var FogKey;
    (function (FogKey) {
        FogKey[FogKey["FOG_KEY"] = 0] = "FOG_KEY";
    })(FogKey = Lich.FogKey || (Lich.FogKey = {}));
    var FontKey;
    (function (FontKey) {
        FontKey[FontKey["FNT_SMALL_YELLOW_KEY"] = 0] = "FNT_SMALL_YELLOW_KEY";
    })(FontKey = Lich.FontKey || (Lich.FontKey = {}));
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
        UISpriteKey[UISpriteKey["UI_PANEL_MIDDLE_KEY"] = 21] = "UI_PANEL_MIDDLE_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_TOP_KEY"] = 22] = "UI_PANEL_TOP_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_RIGHT_KEY"] = 23] = "UI_PANEL_RIGHT_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_BOTTOM_KEY"] = 24] = "UI_PANEL_BOTTOM_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_LEFT_KEY"] = 25] = "UI_PANEL_LEFT_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_TL_KEY"] = 26] = "UI_PANEL_TL_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_TR_KEY"] = 27] = "UI_PANEL_TR_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_BR_KEY"] = 28] = "UI_PANEL_BR_KEY";
        UISpriteKey[UISpriteKey["UI_PANEL_BL_KEY"] = 29] = "UI_PANEL_BL_KEY";
        UISpriteKey[UISpriteKey["UI_BUTTON_KEY"] = 30] = "UI_BUTTON_KEY";
        // spellbook icons
        UISpriteKey[UISpriteKey["UI_SPL_FIREBALL_KEY"] = 31] = "UI_SPL_FIREBALL_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_METEOR_KEY"] = 32] = "UI_SPL_METEOR_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_LOVELETTER_KEY"] = 33] = "UI_SPL_LOVELETTER_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_LOVEARROW_KEY"] = 34] = "UI_SPL_LOVEARROW_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_ICEBOLT_KEY"] = 35] = "UI_SPL_ICEBOLT_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_USE_ITEM_KEY"] = 36] = "UI_SPL_USE_ITEM_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_REVEAL_FOG_KEY"] = 37] = "UI_SPL_REVEAL_FOG_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_TELEPORT_KEY"] = 38] = "UI_SPL_TELEPORT_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_HOME_KEY"] = 39] = "UI_SPL_HOME_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_INTERACT_KEY"] = 40] = "UI_SPL_INTERACT_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_DIG_KEY"] = 41] = "UI_SPL_DIG_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_DIG_BGR_KEY"] = 42] = "UI_SPL_DIG_BGR_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_PLACE_KEY"] = 43] = "UI_SPL_PLACE_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_PLACE_BGR_KEY"] = 44] = "UI_SPL_PLACE_BGR_KEY";
        UISpriteKey[UISpriteKey["UI_SPL_ENEMY_KEY"] = 45] = "UI_SPL_ENEMY_KEY";
        // inventory icons
        UISpriteKey[UISpriteKey["UI_INV_BONES_KEY"] = 46] = "UI_INV_BONES_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_KEY"] = 47] = "UI_INV_WOOD_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_YELLOW_BAUBLE_KEY"] = 48] = "UI_INV_XMAS_YELLOW_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_LOVEARROW_KEY"] = 49] = "UI_INV_LOVEARROW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SNOWBALL_KEY"] = 50] = "UI_INV_SNOWBALL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHICKEN_TALON_KEY"] = 51] = "UI_INV_CHICKEN_TALON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_BLUE_BAUBLE_KEY"] = 52] = "UI_INV_XMAS_BLUE_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_GREEN_BAUBLE_KEY"] = 53] = "UI_INV_XMAS_GREEN_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_PURPLE_BAUBLE_KEY"] = 54] = "UI_INV_XMAS_PURPLE_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_RED_BAUBLE_KEY"] = 55] = "UI_INV_XMAS_RED_BAUBLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SNOWFLAKE_KEY"] = 56] = "UI_INV_SNOWFLAKE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ARMCHAIR_KEY"] = 57] = "UI_INV_ARMCHAIR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BOOKS_KEY"] = 58] = "UI_INV_BOOKS_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BOOKSHELF_KEY"] = 59] = "UI_INV_BOOKSHELF_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CABINET_KEY"] = 60] = "UI_INV_CABINET_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CANDLE_KEY"] = 61] = "UI_INV_CANDLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PORTRAIT_VALENTIMON_KEY"] = 62] = "UI_INV_PORTRAIT_VALENTIMON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_MUSHROOM_KEY"] = 63] = "UI_INV_MUSHROOM_KEY";
        UISpriteKey[UISpriteKey["UI_INV_MUSHROOM2_KEY"] = 64] = "UI_INV_MUSHROOM2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_MUSHROOM3_KEY"] = 65] = "UI_INV_MUSHROOM3_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BERRY_KEY"] = 66] = "UI_INV_BERRY_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT_KEY"] = 67] = "UI_INV_PLANT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT2_KEY"] = 68] = "UI_INV_PLANT2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT3_KEY"] = 69] = "UI_INV_PLANT3_KEY";
        UISpriteKey[UISpriteKey["UI_INV_PLANT4_KEY"] = 70] = "UI_INV_PLANT4_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CAMPFIRE_KEY"] = 71] = "UI_INV_CAMPFIRE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_FIREPLACE_KEY"] = 72] = "UI_INV_FIREPLACE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_TORCH_KEY"] = 73] = "UI_INV_TORCH_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ANVIL_KEY"] = 74] = "UI_INV_ANVIL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SMELTER_KEY"] = 75] = "UI_INV_SMELTER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_INGOT_KEY"] = 76] = "UI_INV_IRON_INGOT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_FENCE_KEY"] = 77] = "UI_INV_IRON_FENCE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GRAVE_KEY"] = 78] = "UI_INV_GRAVE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_KNIGHT_STATUE_KEY"] = 79] = "UI_INV_KNIGHT_STATUE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BANNER_KEY"] = 80] = "UI_INV_BANNER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_FLOWER_POT_KEY"] = 81] = "UI_INV_FLOWER_POT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHANDELIER_KEY"] = 82] = "UI_INV_CHANDELIER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CAULDRON_KEY"] = 83] = "UI_INV_CAULDRON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SNOWMAN_KEY"] = 84] = "UI_INV_SNOWMAN_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_HOLLY_KEY"] = 85] = "UI_INV_XMAS_HOLLY_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_CHAIN_KEY"] = 86] = "UI_INV_XMAS_CHAIN_KEY";
        UISpriteKey[UISpriteKey["UI_INV_XMAS_TREE_KEY"] = 87] = "UI_INV_XMAS_TREE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ADVENT_WREATH_KEY"] = 88] = "UI_INV_ADVENT_WREATH_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_COINS2_KEY"] = 89] = "UI_INV_GOLD_COINS2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_SILVER_COINS_KEY"] = 90] = "UI_INV_SILVER_COINS_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_DISHES_KEY"] = 91] = "UI_INV_GOLD_DISHES_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_DISHES2_KEY"] = 92] = "UI_INV_GOLD_DISHES2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_BOWL_KEY"] = 93] = "UI_INV_GOLD_BOWL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GIFT1_KEY"] = 94] = "UI_INV_GIFT1_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GIFT2_KEY"] = 95] = "UI_INV_GIFT2_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GIFT3_KEY"] = 96] = "UI_INV_GIFT3_KEY";
        UISpriteKey[UISpriteKey["UI_INV_LOVELETTER_KEY"] = 97] = "UI_INV_LOVELETTER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHICKEN_MEAT_KEY"] = 98] = "UI_INV_CHICKEN_MEAT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_RED_FLASK_KEY"] = 99] = "UI_INV_RED_FLASK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_DOOR_KEY"] = 100] = "UI_INV_DOOR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_CHAIR_KEY"] = 101] = "UI_INV_WOOD_CHAIR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_TABLE_KEY"] = 102] = "UI_INV_WOOD_TABLE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_DIRT_KEY"] = 103] = "UI_INV_DIRT_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOODWALL_KEY"] = 104] = "UI_INV_WOODWALL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_BRICK_KEY"] = 105] = "UI_INV_BRICK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_KEY"] = 106] = "UI_INV_ROCK_BRICK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_STRAW_KEY"] = 107] = "UI_INV_STRAW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_KRYSTALS_KEY"] = 108] = "UI_INV_KRYSTALS_KEY";
        UISpriteKey[UISpriteKey["UI_INV_FLORITE_KEY"] = 109] = "UI_INV_FLORITE_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_KEY"] = 110] = "UI_INV_IRON_KEY";
        UISpriteKey[UISpriteKey["UI_INV_COAL_KEY"] = 111] = "UI_INV_COAL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_KEY"] = 112] = "UI_INV_ROCK_KEY";
        UISpriteKey[UISpriteKey["UI_INV_IRON_PLATFORM_KEY"] = 113] = "UI_INV_IRON_PLATFORM_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_PLATFORM_KEY"] = 114] = "UI_INV_WOOD_PLATFORM_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOOD_LADDER_KEY"] = 115] = "UI_INV_WOOD_LADDER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROOF_KEY"] = 116] = "UI_INV_ROOF_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROOF_TL_KEY"] = 117] = "UI_INV_ROOF_TL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROOF_TR_KEY"] = 118] = "UI_INV_ROOF_TR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_TL_KEY"] = 119] = "UI_INV_ROCK_BRICK_TL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_TR_KEY"] = 120] = "UI_INV_ROCK_BRICK_TR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_BL_KEY"] = 121] = "UI_INV_ROCK_BRICK_BL_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_BR_KEY"] = 122] = "UI_INV_ROCK_BRICK_BR_KEY";
        UISpriteKey[UISpriteKey["UI_INV_ROCK_BRICK_WINDOW_KEY"] = 123] = "UI_INV_ROCK_BRICK_WINDOW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_WOODWALL_WINDOW_KEY"] = 124] = "UI_INV_WOODWALL_WINDOW_KEY";
        UISpriteKey[UISpriteKey["UI_INV_CHAIN_LADDER_KEY"] = 125] = "UI_INV_CHAIN_LADDER_KEY";
        UISpriteKey[UISpriteKey["UI_INV_GOLD_KEY"] = 126] = "UI_INV_GOLD_KEY";
    })(UISpriteKey = Lich.UISpriteKey || (Lich.UISpriteKey = {}));
    var AchievementKey;
    (function (AchievementKey) {
        AchievementKey[AchievementKey["ACHV_FALLING_DOWN_KEY"] = 0] = "ACHV_FALLING_DOWN_KEY";
        AchievementKey[AchievementKey["ACHV_CHICKEN_MASSACRE_KEY"] = 1] = "ACHV_CHICKEN_MASSACRE_KEY";
        AchievementKey[AchievementKey["ACHV_CHICKEN_PROOFED_KEY"] = 2] = "ACHV_CHICKEN_PROOFED_KEY";
        AchievementKey[AchievementKey["ACHV_LOVE_HURTS_KEY"] = 3] = "ACHV_LOVE_HURTS_KEY";
        AchievementKey[AchievementKey["ACHV_HEARTBREAKING_KEY"] = 4] = "ACHV_HEARTBREAKING_KEY";
    })(AchievementKey = Lich.AchievementKey || (Lich.AchievementKey = {}));
    var SpellKey;
    (function (SpellKey) {
        SpellKey[SpellKey["SPELL_PLACE_KEY"] = 0] = "SPELL_PLACE_KEY";
        SpellKey[SpellKey["SPELL_PLACE_BGR_KEY"] = 1] = "SPELL_PLACE_BGR_KEY";
        SpellKey[SpellKey["SPELL_DIG_KEY"] = 2] = "SPELL_DIG_KEY";
        SpellKey[SpellKey["SPELL_DIG_BGR_KEY"] = 3] = "SPELL_DIG_BGR_KEY";
        SpellKey[SpellKey["SPELL_FIREBALL_KEY"] = 4] = "SPELL_FIREBALL_KEY";
        SpellKey[SpellKey["SPELL_METEOR_KEY"] = 5] = "SPELL_METEOR_KEY";
        SpellKey[SpellKey["SPELL_ICEBOLT_KEY"] = 6] = "SPELL_ICEBOLT_KEY";
        SpellKey[SpellKey["SPELL_ENEMY_KEY"] = 7] = "SPELL_ENEMY_KEY";
        SpellKey[SpellKey["SPELL_TELEPORT_KEY"] = 8] = "SPELL_TELEPORT_KEY";
        SpellKey[SpellKey["SPELL_HOME_KEY"] = 9] = "SPELL_HOME_KEY";
        SpellKey[SpellKey["SPELL_USE_ITEM_KEY"] = 10] = "SPELL_USE_ITEM_KEY";
        SpellKey[SpellKey["SPELL_LOVELETTER_KEY"] = 11] = "SPELL_LOVELETTER_KEY";
        SpellKey[SpellKey["SPELL_LOVEARROW_KEY"] = 12] = "SPELL_LOVEARROW_KEY";
        // RMB click interakce s objekty
        SpellKey[SpellKey["SPELL_INTERACT_KEY"] = 13] = "SPELL_INTERACT_KEY";
        // Reveal
        SpellKey[SpellKey["SPELL_REVEAL_FOG_KEY"] = 14] = "SPELL_REVEAL_FOG_KEY";
    })(SpellKey = Lich.SpellKey || (Lich.SpellKey = {}));
    var SoundKey;
    (function (SoundKey) {
        SoundKey[SoundKey["SND_FIREBALL_KEY"] = 0] = "SND_FIREBALL_KEY";
        SoundKey[SoundKey["SND_BURN_KEY"] = 1] = "SND_BURN_KEY";
        SoundKey[SoundKey["SND_METEOR_FALL_KEY"] = 2] = "SND_METEOR_FALL_KEY";
        SoundKey[SoundKey["SND_METEOR_HIT_KEY"] = 3] = "SND_METEOR_HIT_KEY";
        SoundKey[SoundKey["SND_BOLT_CAST_KEY"] = 4] = "SND_BOLT_CAST_KEY";
        SoundKey[SoundKey["SND_PICK_KEY"] = 5] = "SND_PICK_KEY";
        SoundKey[SoundKey["SND_PLACE_KEY"] = 6] = "SND_PLACE_KEY";
        SoundKey[SoundKey["SND_PICK_AXE_1_KEY"] = 7] = "SND_PICK_AXE_1_KEY";
        SoundKey[SoundKey["SND_PICK_AXE_2_KEY"] = 8] = "SND_PICK_AXE_2_KEY";
        SoundKey[SoundKey["SND_PICK_AXE_3_KEY"] = 9] = "SND_PICK_AXE_3_KEY";
        SoundKey[SoundKey["SND_BONE_CRACK_KEY"] = 10] = "SND_BONE_CRACK_KEY";
        SoundKey[SoundKey["SND_SQUASHED_KEY"] = 11] = "SND_SQUASHED_KEY";
        SoundKey[SoundKey["SND_SKELETON_DIE_KEY"] = 12] = "SND_SKELETON_DIE_KEY";
        SoundKey[SoundKey["SND_SPAWN_KEY"] = 13] = "SND_SPAWN_KEY";
        SoundKey[SoundKey["SND_DOOR_OPEN_KEY"] = 14] = "SND_DOOR_OPEN_KEY";
        SoundKey[SoundKey["SND_DOOR_CLOSE_KEY"] = 15] = "SND_DOOR_CLOSE_KEY";
        SoundKey[SoundKey["SND_CRAFT_KEY"] = 16] = "SND_CRAFT_KEY";
        SoundKey[SoundKey["SND_CLICK_KEY"] = 17] = "SND_CLICK_KEY";
        SoundKey[SoundKey["SND_TELEPORT_KEY"] = 18] = "SND_TELEPORT_KEY";
        SoundKey[SoundKey["SND_GHOUL_SPAWN_KEY"] = 19] = "SND_GHOUL_SPAWN_KEY";
        SoundKey[SoundKey["SND_PUNCH_1_KEY"] = 20] = "SND_PUNCH_1_KEY";
        SoundKey[SoundKey["SND_PUNCH_2_KEY"] = 21] = "SND_PUNCH_2_KEY";
        SoundKey[SoundKey["SND_PUNCH_3_KEY"] = 22] = "SND_PUNCH_3_KEY";
        SoundKey[SoundKey["SND_PUNCH_4_KEY"] = 23] = "SND_PUNCH_4_KEY";
        SoundKey[SoundKey["SND_CHICKEN_HIT_1_KEY"] = 24] = "SND_CHICKEN_HIT_1_KEY";
        SoundKey[SoundKey["SND_CHICKEN_HIT_2_KEY"] = 25] = "SND_CHICKEN_HIT_2_KEY";
        SoundKey[SoundKey["SND_CHICKEN_HIT_3_KEY"] = 26] = "SND_CHICKEN_HIT_3_KEY";
        SoundKey[SoundKey["SND_CHICKEN_DEAD_1_KEY"] = 27] = "SND_CHICKEN_DEAD_1_KEY";
        SoundKey[SoundKey["SND_CHICKEN_DEAD_2_KEY"] = 28] = "SND_CHICKEN_DEAD_2_KEY";
        SoundKey[SoundKey["SND_CHICKEN_DEAD_3_KEY"] = 29] = "SND_CHICKEN_DEAD_3_KEY";
        SoundKey[SoundKey["SND_CHICKEN_IDLE_KEY"] = 30] = "SND_CHICKEN_IDLE_KEY";
        SoundKey[SoundKey["SND_CHICKEN_BOSS_HIT_KEY"] = 31] = "SND_CHICKEN_BOSS_HIT_KEY";
        SoundKey[SoundKey["SND_CHICKEN_BOSS_DEAD_KEY"] = 32] = "SND_CHICKEN_BOSS_DEAD_KEY";
        SoundKey[SoundKey["SND_CHICKEN_BOSS_ATTACK_KEY"] = 33] = "SND_CHICKEN_BOSS_ATTACK_KEY";
    })(SoundKey = Lich.SoundKey || (Lich.SoundKey = {}));
    var MusicKey;
    (function (MusicKey) {
        MusicKey[MusicKey["MSC_DIRT_THEME_KEY"] = 0] = "MSC_DIRT_THEME_KEY";
        MusicKey[MusicKey["MSC_BUILD_THEME_KEY"] = 1] = "MSC_BUILD_THEME_KEY";
        MusicKey[MusicKey["MSC_BOSS_THEME_KEY"] = 2] = "MSC_BOSS_THEME_KEY";
        MusicKey[MusicKey["MSC_KRYSTAL_THEME_KEY"] = 3] = "MSC_KRYSTAL_THEME_KEY";
        MusicKey[MusicKey["MSC_FLOOD_THEME_KEY"] = 4] = "MSC_FLOOD_THEME_KEY";
        MusicKey[MusicKey["MSC_LAVA_THEME_KEY"] = 5] = "MSC_LAVA_THEME_KEY";
        MusicKey[MusicKey["MSC_CHICKEN_BOSS_THEME_KEY"] = 6] = "MSC_CHICKEN_BOSS_THEME_KEY";
        MusicKey[MusicKey["MSC_CUPID_BOSS_THEME_KEY"] = 7] = "MSC_CUPID_BOSS_THEME_KEY";
    })(MusicKey = Lich.MusicKey || (Lich.MusicKey = {}));
})(Lich || (Lich = {}));