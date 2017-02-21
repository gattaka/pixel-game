namespace Lich {

    export enum SpritesheetKey {
        // SPST_FONTS_KEY,
        // SPST_OBJECTS_KEY,
        // SPST_TILES_KEY,
        // SPST_UI_KEY
        SPST_MAIN_KEY
    }

    export enum BackgroundKey {
        BGR_DIRT_BACK_START_KEY,
        BGR_DIRT_BACK_KEY,
        BGR_SKY_KEY,
        BGR_FAR_MOUNTAIN_KEY,
        BGR_MOUNTAIN_KEY,
        BGR_WOODLAND1_KEY,
        BGR_WOODLAND2_KEY,
        BGR_WOODLAND3_KEY,
        BGR_WOODLAND4_KEY,
        BGR_CLOUD1_KEY,
        BGR_CLOUD2_KEY,
        BGR_CLOUD3_KEY,
        BGR_CLOUD4_KEY,
        BGR_CLOUD5_KEY,
    }

    export enum FogKey {
        FOG_KEY
    }

    export enum FontKey {
        FNT_SMALL_YELLOW_KEY
    }

    export enum UISpriteKey {
        UI_PLAYER_ICON_KEY,
        UI_SKULL_KEY,
        UI_GAME_OVER_KEY,
        // buttons
        UI_SOUND_KEY,
        UI_UP_KEY,
        UI_DOWN_KEY,
        UI_LEFT_KEY,
        UI_RIGHT_KEY,
        UI_LEFT_UP_KEY,
        UI_RIGHT_UP_KEY,
        UI_LEFT_DOWN_KEY,
        UI_RIGHT_DOWN_KEY,
        UI_CRAFT_KEY,
        UI_SAVE_KEY,
        UI_LOAD_KEY,
        UI_NEW_WORLD_KEY,
        UI_HELP_KEY,
        UI_BACKPACK_KEY,
        UI_MENU_KEY,
        UI_MINIMAP_KEY
    }

    export enum AchievementKey {
        ACHV_FALLING_DOWN_KEY,
        ACHV_CHICKEN_MASSACRE_KEY,
        ACHV_CHICKEN_PROOFED_KEY,
        ACHV_LOVE_HURTS_KEY,
        ACHV_HEARTBREAKING_KEY
    }

    export enum SpellKey {
        SPELL_PLACE_KEY,
        SPELL_PLACE_BGR_KEY,
        SPELL_DIG_KEY,
        SPELL_DIG_BGR_KEY,
        SPELL_FIREBALL_KEY,
        SPELL_METEOR_KEY,
        SPELL_ICEBOLT_KEY,
        SPELL_ENEMY_KEY,
        SPELL_TELEPORT_KEY,
        SPELL_HOME_KEY,
        SPELL_USE_ITEM_KEY,
        SPELL_LOVELETTER,
        SPELL_LOVEARROW,

        // RMB click interakce s objekty
        SPELL_INTERACT_KEY,

        // Reveal
        SPELL_REVEAL_FOG_KEY
    }

    export enum SoundKey {
        SND_FIREBALL_KEY,
        SND_BURN_KEY,
        SND_METEOR_FALL_KEY,
        SND_METEOR_HIT_KEY,
        SND_BOLT_CAST_KEY,
        SND_PICK_KEY,
        SND_PLACE_KEY,
        SND_PICK_AXE_1_KEY,
        SND_PICK_AXE_2_KEY,
        SND_PICK_AXE_3_KEY,
        SND_BONE_CRACK_KEY,
        SND_SQUASHED_KEY,
        SND_SKELETON_DIE_KEY,
        SND_SPAWN_KEY,
        SND_DOOR_OPEN_KEY,
        SND_DOOR_CLOSE_KEY,
        SND_CRAFT_KEY,
        SND_CLICK_KEY,
        SND_TELEPORT_KEY,
        SND_GHOUL_SPAWN_KEY,
        SND_PUNCH_1_KEY,
        SND_PUNCH_2_KEY,
        SND_PUNCH_3_KEY,
        SND_PUNCH_4_KEY,
        SND_CHICKEN_HIT_1_KEY,
        SND_CHICKEN_HIT_2_KEY,
        SND_CHICKEN_HIT_3_KEY,
        SND_CHICKEN_DEAD_1_KEY,
        SND_CHICKEN_DEAD_2_KEY,
        SND_CHICKEN_DEAD_3_KEY,
        SND_CHICKEN_IDLE_KEY,
        SND_CHICKEN_BOSS_HIT_KEY,
        SND_CHICKEN_BOSS_DEAD_KEY,
        SND_CHICKEN_BOSS_ATTACK_KEY
    }

    export enum MusicKey {
        MSC_DIRT_THEME_KEY,
        MSC_BUILD_THEME_KEY,
        MSC_BOSS_THEME_KEY,
        MSC_KRYSTAL_THEME_KEY,
        MSC_FLOOD_THEME_KEY,
        MSC_LAVA_THEME_KEY,
        MSC_CHICKEN_BOSS_THEME_KEY,
        MSC_CUPID_BOSS_THEME_KEY
    }
}