var Lich;
(function (Lich) {
    Lich.UI_DEFS = [
        // general
        ["ui_player_icon", Lich.UISpriteKey.UI_PLAYER_ICON_KEY],
        ["ui_skull", Lich.UISpriteKey.UI_SKULL_KEY],
        ["ui_dead_again", Lich.UISpriteKey.UI_GAME_OVER_KEY],
        ["ui_sound", Lich.UISpriteKey.UI_SOUND_KEY],
        ["ui_up", Lich.UISpriteKey.UI_UP_KEY],
        ["ui_down", Lich.UISpriteKey.UI_DOWN_KEY],
        ["ui_left", Lich.UISpriteKey.UI_LEFT_KEY],
        ["ui_right", Lich.UISpriteKey.UI_RIGHT_KEY],
        ["ui_left_up", Lich.UISpriteKey.UI_LEFT_UP_KEY],
        ["ui_right_up", Lich.UISpriteKey.UI_RIGHT_UP_KEY],
        ["ui_left_down", Lich.UISpriteKey.UI_LEFT_DOWN_KEY],
        ["ui_right_down", Lich.UISpriteKey.UI_RIGHT_DOWN_KEY],
        ["ui_craft", Lich.UISpriteKey.UI_CRAFT_KEY],
        ["ui_load", Lich.UISpriteKey.UI_LOAD_KEY],
        ["ui_save", Lich.UISpriteKey.UI_SAVE_KEY],
        ["ui_new_world", Lich.UISpriteKey.UI_NEW_WORLD_KEY],
        ["ui_help", Lich.UISpriteKey.UI_HELP_KEY],
        ["ui_backpack", Lich.UISpriteKey.UI_BACKPACK_KEY],
        ["ui_menu", Lich.UISpriteKey.UI_MENU_KEY],
        ["ui_minimap", Lich.UISpriteKey.UI_MINIMAP_KEY],
        ["ui_highlight", Lich.UISpriteKey.UI_HIGHLIGHT_KEY],
        ["ui_button", Lich.UISpriteKey.UI_BUTTON_KEY],
        // panel 
        ["ui_pnl_middle", Lich.UISpriteKey.UI_PANEL_MIDDLE_KEY],
        ["ui_pnl_top", Lich.UISpriteKey.UI_PANEL_TOP_KEY],
        ["ui_pnl_right", Lich.UISpriteKey.UI_PANEL_RIGHT_KEY],
        ["ui_pnl_bottom", Lich.UISpriteKey.UI_PANEL_BOTTOM_KEY],
        ["ui_pnl_left", Lich.UISpriteKey.UI_PANEL_LEFT_KEY],
        ["ui_pnl_tl", Lich.UISpriteKey.UI_PANEL_TL_KEY],
        ["ui_pnl_tr", Lich.UISpriteKey.UI_PANEL_TR_KEY],
        ["ui_pnl_br", Lich.UISpriteKey.UI_PANEL_BR_KEY],
        ["ui_pnl_bl", Lich.UISpriteKey.UI_PANEL_BL_KEY],
        // achievements
        ["ui_ach_falling_down", Lich.UISpriteKey.UI_ACH_FALLING_DOWN_KEY],
        ["ui_ach_chicken_massacre", Lich.UISpriteKey.UI_ACH_CHICKEN_MASSACRE_KEY],
        ["ui_ach_chicken_proofed", Lich.UISpriteKey.UI_ACH_CHICKEN_PROOFED_KEY],
        ["ui_ach_love_hurts", Lich.UISpriteKey.UI_ACH_LOVE_HURTS_KEY],
        ["ui_ach_heartbreaking", Lich.UISpriteKey.UI_ACH_HEARTBREAKING_KEY],
        // spellbook icons
        ["ui_spl_fireball", Lich.UISpriteKey.UI_SPL_FIREBALL_KEY],
        ["ui_spl_meteor", Lich.UISpriteKey.UI_SPL_METEOR_KEY],
        ["ui_spl_loveletter", Lich.UISpriteKey.UI_SPL_LOVELETTER_KEY],
        ["ui_spl_lovearrow", Lich.UISpriteKey.UI_SPL_LOVEARROW_KEY],
        ["ui_spl_bolt", Lich.UISpriteKey.UI_SPL_ICEBOLT_KEY],
        ["ui_spl_use", Lich.UISpriteKey.UI_SPL_USE_ITEM_KEY],
        ["ui_spl_place", Lich.UISpriteKey.UI_SPL_REVEAL_FOG_KEY],
        ["ui_spl_teleport", Lich.UISpriteKey.UI_SPL_TELEPORT_KEY],
        ["ui_spl_home", Lich.UISpriteKey.UI_SPL_HOME_KEY],
        ["ui_spl_place", Lich.UISpriteKey.UI_SPL_INTERACT_KEY],
        ["ui_spl_dig", Lich.UISpriteKey.UI_SPL_DIG_KEY],
        ["ui_spl_dig_bgr", Lich.UISpriteKey.UI_SPL_DIG_BGR_KEY],
        ["ui_spl_place", Lich.UISpriteKey.UI_SPL_PLACE_KEY],
        ["ui_spl_place_bgr", Lich.UISpriteKey.UI_SPL_PLACE_BGR_KEY],
        ["ui_spl_enemy", Lich.UISpriteKey.UI_SPL_ENEMY_KEY],
        // inventory icons
        ["ui_inv_bones", Lich.UISpriteKey.UI_INV_BONES_KEY],
        ["ui_inv_wood", Lich.UISpriteKey.UI_INV_WOOD_KEY],
        ["ui_inv_xmas_yellow_bauble", Lich.UISpriteKey.UI_INV_XMAS_YELLOW_BAUBLE_KEY],
        ["ui_inv_lovearrow", Lich.UISpriteKey.UI_INV_LOVEARROW_KEY],
        ["ui_inv_snowball", Lich.UISpriteKey.UI_INV_SNOWBALL_KEY],
        ["ui_inv_chicken_talon", Lich.UISpriteKey.UI_INV_CHICKEN_TALON_KEY],
        ["ui_inv_xmas_blue_bauble", Lich.UISpriteKey.UI_INV_XMAS_BLUE_BAUBLE_KEY],
        ["ui_inv_xmas_green_bauble", Lich.UISpriteKey.UI_INV_XMAS_GREEN_BAUBLE_KEY],
        ["ui_inv_xmas_purple_bauble", Lich.UISpriteKey.UI_INV_XMAS_PURPLE_BAUBLE_KEY],
        ["ui_inv_xmas_red_bauble", Lich.UISpriteKey.UI_INV_XMAS_RED_BAUBLE_KEY],
        ["ui_inv_snowflake", Lich.UISpriteKey.UI_INV_SNOWFLAKE_KEY],
        ["ui_inv_armchair", Lich.UISpriteKey.UI_INV_ARMCHAIR_KEY],
        ["ui_inv_books", Lich.UISpriteKey.UI_INV_BOOKS_KEY],
        ["ui_inv_bookshelf", Lich.UISpriteKey.UI_INV_BOOKSHELF_KEY],
        ["ui_inv_cabinet", Lich.UISpriteKey.UI_INV_CABINET_KEY],
        ["ui_inv_candle", Lich.UISpriteKey.UI_INV_CANDLE_KEY],
        ["ui_inv_portrait_valentimon", Lich.UISpriteKey.UI_INV_PORTRAIT_VALENTIMON_KEY],
        ["ui_inv_mushroom", Lich.UISpriteKey.UI_INV_MUSHROOM_KEY],
        ["ui_inv_mushroom2", Lich.UISpriteKey.UI_INV_MUSHROOM2_KEY],
        ["ui_inv_mushroom3", Lich.UISpriteKey.UI_INV_MUSHROOM3_KEY],
        ["ui_inv_berry", Lich.UISpriteKey.UI_INV_BERRY_KEY],
        ["ui_inv_plant", Lich.UISpriteKey.UI_INV_PLANT_KEY],
        ["ui_inv_plant2", Lich.UISpriteKey.UI_INV_PLANT2_KEY],
        ["ui_inv_plant3", Lich.UISpriteKey.UI_INV_PLANT3_KEY],
        ["ui_inv_plant4", Lich.UISpriteKey.UI_INV_PLANT4_KEY],
        ["ui_inv_campfire", Lich.UISpriteKey.UI_INV_CAMPFIRE_KEY],
        ["ui_inv_fireplace", Lich.UISpriteKey.UI_INV_FIREPLACE_KEY],
        ["ui_inv_torch", Lich.UISpriteKey.UI_INV_TORCH_KEY],
        ["ui_inv_anvil", Lich.UISpriteKey.UI_INV_ANVIL_KEY],
        ["ui_inv_smelter", Lich.UISpriteKey.UI_INV_SMELTER_KEY],
        ["ui_inv_iron_ingot", Lich.UISpriteKey.UI_INV_IRON_INGOT_KEY],
        ["ui_inv_iron_fence", Lich.UISpriteKey.UI_INV_IRON_FENCE_KEY],
        ["ui_inv_grave", Lich.UISpriteKey.UI_INV_GRAVE_KEY],
        ["ui_inv_knight_statue", Lich.UISpriteKey.UI_INV_KNIGHT_STATUE_KEY],
        ["ui_inv_banner", Lich.UISpriteKey.UI_INV_BANNER_KEY],
        ["ui_inv_flower_pot", Lich.UISpriteKey.UI_INV_FLOWER_POT_KEY],
        ["ui_inv_chandelier", Lich.UISpriteKey.UI_INV_CHANDELIER_KEY],
        ["ui_inv_cauldron", Lich.UISpriteKey.UI_INV_CAULDRON_KEY],
        ["ui_inv_snowman", Lich.UISpriteKey.UI_INV_SNOWMAN_KEY],
        ["ui_inv_xmas_holly", Lich.UISpriteKey.UI_INV_XMAS_HOLLY_KEY],
        ["ui_inv_xmas_chain", Lich.UISpriteKey.UI_INV_XMAS_CHAIN_KEY],
        ["ui_inv_xmas_tree", Lich.UISpriteKey.UI_INV_XMAS_TREE_KEY],
        ["ui_inv_advent_wreath", Lich.UISpriteKey.UI_INV_ADVENT_WREATH_KEY],
        ["ui_inv_gold_coins2", Lich.UISpriteKey.UI_INV_GOLD_COINS2_KEY],
        ["ui_inv_silver_coins", Lich.UISpriteKey.UI_INV_SILVER_COINS_KEY],
        ["ui_inv_gold_dishes", Lich.UISpriteKey.UI_INV_GOLD_DISHES_KEY],
        ["ui_inv_gold_dishes2", Lich.UISpriteKey.UI_INV_GOLD_DISHES2_KEY],
        ["ui_inv_gold_bowl", Lich.UISpriteKey.UI_INV_GOLD_BOWL_KEY],
        ["ui_inv_gift1", Lich.UISpriteKey.UI_INV_GIFT1_KEY],
        ["ui_inv_gift2", Lich.UISpriteKey.UI_INV_GIFT2_KEY],
        ["ui_inv_gift3", Lich.UISpriteKey.UI_INV_GIFT3_KEY],
        ["ui_inv_loveletter", Lich.UISpriteKey.UI_INV_LOVELETTER_KEY],
        ["ui_inv_chicken_meat", Lich.UISpriteKey.UI_INV_CHICKEN_MEAT_KEY],
        ["ui_inv_red_flask", Lich.UISpriteKey.UI_INV_RED_FLASK_KEY],
        ["ui_inv_door", Lich.UISpriteKey.UI_INV_DOOR_KEY],
        ["ui_inv_wood_chair", Lich.UISpriteKey.UI_INV_WOOD_CHAIR_KEY],
        ["ui_inv_wood_table", Lich.UISpriteKey.UI_INV_WOOD_TABLE_KEY],
        ["ui_inv_dirt", Lich.UISpriteKey.UI_INV_DIRT_KEY],
        ["ui_inv_woodwall", Lich.UISpriteKey.UI_INV_WOODWALL_KEY],
        ["ui_inv_brick", Lich.UISpriteKey.UI_INV_BRICK_KEY],
        ["ui_inv_rock_brick", Lich.UISpriteKey.UI_INV_ROCK_BRICK_KEY],
        ["ui_inv_straw", Lich.UISpriteKey.UI_INV_STRAW_KEY],
        ["ui_inv_krystals", Lich.UISpriteKey.UI_INV_KRYSTALS_KEY],
        ["ui_inv_florite", Lich.UISpriteKey.UI_INV_FLORITE_KEY],
        ["ui_inv_iron", Lich.UISpriteKey.UI_INV_IRON_KEY],
        ["ui_inv_coal", Lich.UISpriteKey.UI_INV_COAL_KEY],
        ["ui_inv_rock", Lich.UISpriteKey.UI_INV_ROCK_KEY],
        ["ui_inv_iron_platform", Lich.UISpriteKey.UI_INV_IRON_PLATFORM_KEY],
        ["ui_inv_wood_platform", Lich.UISpriteKey.UI_INV_WOOD_PLATFORM_KEY],
        ["ui_inv_wood_ladder", Lich.UISpriteKey.UI_INV_WOOD_LADDER_KEY],
        ["ui_inv_roof", Lich.UISpriteKey.UI_INV_ROOF_KEY],
        ["ui_inv_roof_tl", Lich.UISpriteKey.UI_INV_ROOF_TL_KEY],
        ["ui_inv_roof_tr", Lich.UISpriteKey.UI_INV_ROOF_TR_KEY],
        ["ui_inv_rock_brick_tl", Lich.UISpriteKey.UI_INV_ROCK_BRICK_TL_KEY],
        ["ui_inv_rock_brick_tr", Lich.UISpriteKey.UI_INV_ROCK_BRICK_TR_KEY],
        ["ui_inv_rock_brick_bl", Lich.UISpriteKey.UI_INV_ROCK_BRICK_BL_KEY],
        ["ui_inv_rock_brick_br", Lich.UISpriteKey.UI_INV_ROCK_BRICK_BR_KEY],
        ["ui_inv_rock_brick_window", Lich.UISpriteKey.UI_INV_ROCK_BRICK_WINDOW_KEY],
        ["ui_inv_woodwall_window", Lich.UISpriteKey.UI_INV_WOODWALL_WINDOW_KEY],
        ["ui_inv_chain_ladder", Lich.UISpriteKey.UI_INV_CHAIN_LADDER_KEY],
        ["ui_inv_gold", Lich.UISpriteKey.UI_INV_GOLD_KEY],
        ["ui_inv_easter_egg1", Lich.UISpriteKey.UI_INV_EASTER_EGG1_KEY],
        ["ui_inv_easter_egg2", Lich.UISpriteKey.UI_INV_EASTER_EGG2_KEY],
        ["ui_inv_strange_egg", Lich.UISpriteKey.UI_INV_STRANGE_EGG_KEY]
    ];
    Lich.FONT_DEFS = [
        [Lich.FontKey.FNT_SMALL_YELLOW_KEY, [
                ['0', 'ui_fnt_small_yellow_0'],
                ['1', 'ui_fnt_small_yellow_1'],
                ['2', 'ui_fnt_small_yellow_2'],
                ['3', 'ui_fnt_small_yellow_3'],
                ['4', 'ui_fnt_small_yellow_4'],
                ['5', 'ui_fnt_small_yellow_5'],
                ['6', 'ui_fnt_small_yellow_6'],
                ['7', 'ui_fnt_small_yellow_7'],
                ['8', 'ui_fnt_small_yellow_8'],
                ['9', 'ui_fnt_small_yellow_9'],
                ['a', 'ui_fnt_small_yellow_a'],
                ['b', 'ui_fnt_small_yellow_b'],
                ['c', 'ui_fnt_small_yellow_c'],
                ['d', 'ui_fnt_small_yellow_d'],
                ['e', 'ui_fnt_small_yellow_e'],
                ['f', 'ui_fnt_small_yellow_f'],
                ['g', 'ui_fnt_small_yellow_g'],
                ['h', 'ui_fnt_small_yellow_h'],
                ['i', 'ui_fnt_small_yellow_i'],
                ['j', 'ui_fnt_small_yellow_j'],
                ['k', 'ui_fnt_small_yellow_k'],
                ['l', 'ui_fnt_small_yellow_l'],
                ['m', 'ui_fnt_small_yellow_m'],
                ['n', 'ui_fnt_small_yellow_n'],
                ['o', 'ui_fnt_small_yellow_o'],
                ['p', 'ui_fnt_small_yellow_p'],
                ['q', 'ui_fnt_small_yellow_q'],
                ['r', 'ui_fnt_small_yellow_r'],
                ['s', 'ui_fnt_small_yellow_s'],
                ['t', 'ui_fnt_small_yellow_t'],
                ['u', 'ui_fnt_small_yellow_u'],
                ['v', 'ui_fnt_small_yellow_v'],
                ['w', 'ui_fnt_small_yellow_w'],
                ['x', 'ui_fnt_small_yellow_x'],
                ['y', 'ui_fnt_small_yellow_y'],
                ['z', 'ui_fnt_small_yellow_z'],
                ['\'', 'ui_fnt_small_yellow_apostrophe'],
                [':', 'ui_fnt_small_yellow_colon'],
                [',', 'ui_fnt_small_yellow_comma'],
                ['.', 'ui_fnt_small_yellow_dot'],
                ['=', 'ui_fnt_small_yellow_eq'],
                ['!', 'ui_fnt_small_yellow_excl_mark'],
                ['>', 'ui_fnt_small_yellow_gt'],
                // ['←', 'ui_fnt_small_yellow_left'],
                ['(', 'ui_fnt_small_yellow_left_bracket'],
                ['<', 'ui_fnt_small_yellow_lt'],
                ['-', 'ui_fnt_small_yellow_minus'],
                ['%', 'ui_fnt_small_yellow_percent'],
                ['+', 'ui_fnt_small_yellow_plus'],
                ['?', 'ui_fnt_small_yellow_question_mark'],
                ['"', 'ui_fnt_small_yellow_quote'],
                // ['→', 'ui_fnt_small_yellow_right'],
                [')', 'ui_fnt_small_yellow_right_bracket'],
                ['/', 'ui_fnt_small_yellow_slash'],
                ['*', 'ui_fnt_small_yellow_star'],
                [';', 'ui_fnt_small_yellow_semicolon']
            ]
        ]
    ];
})(Lich || (Lich = {}));
