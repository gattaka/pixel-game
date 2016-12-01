namespace Lich {
    export enum BackgroundKey {
        DIRT_BACK_START_KEY,
        DIRT_BACK_KEY,
        SKY_KEY,
        FAR_MOUNTAIN_KEY,
        MOUNTAIN_KEY,
        DIRTBACK_KEY,
        DARKNESS_KEY,
        WOODLAND1_KEY,
        WOODLAND2_KEY,
        WOODLAND3_KEY,
        WOODLAND4_KEY,
        CLOUD1_KEY,
        CLOUD2_KEY,
        CLOUD3_KEY,
        CLOUD4_KEY,
        CLOUD5_KEY
    }

    export enum AnimationKey {
        METEOR_ANIMATION_KEY,
        FIREBALL_ANIMATION_KEY,
        LICH_ANIMATION_KEY,
        CORPSE_ANIMATION_KEY,
        HELLHOUND_ANIMATION_KEY,
        BOLT_ANIMATION_KEY,
        CHICKEN_ANIMATION_KEY,
        BUNNY_ANIMATION_KEY
    }

    export enum UIGFXKey {
        PLAYER_ICON_KEY,
        // misc.
        SKULL_KEY,
        GAME_OVER_KEY,
        HELMET_KEY,
        TORSO_KEY,
        GAUNTLET_KEY,
        // buttons
        UI_SOUND_KEY,
        UI_UP_KEY,
        UI_DOWN_KEY,
        UI_LEFT_KEY,
        UI_RIGHT_KEY,
        UI_CRAFT_KEY,
        UI_SAVE_KEY,
        UI_LOAD_KEY,
        UI_NEW_WORLD_KEY,
        UI_HELP_KEY
    }

    export enum SpellKey {
        SPELL_PLACE_KEY,
        SPELL_PLACE_BGR_KEY,
        SPELL_DIG_KEY,
        SPELL_DIG_BGR_KEY,
        SPELL_FIREBALL_KEY,
        SPELL_METEOR_KEY,
        SPELL_BOLT_KEY,
        SPELL_ENEMY_KEY,
        SPELL_TELEPORT_KEY,

        // RMB click interakce s objekty
        SPELL_INTERACT_KEY
    }

    export enum SoundKey {
        SND_FIREBALL_KEY,
        SND_BURN_KEY,
        SND_METEOR_FALL_KEY,
        SND_METEOR_HIT_KEY,
        SND_BOLT_CAST,
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
        SND_CHICKEN_HIT_1,
        SND_CHICKEN_HIT_2,
        SND_CHICKEN_HIT_3,
        SND_CHICKEN_DEAD_1,
        SND_CHICKEN_DEAD_2,
        SND_CHICKEN_DEAD_3,
        SND_CHICKEN_IDLE
    }

    export enum MusicKey {
        MSC_DIRT_THEME_KEY,
        MSC_BUILD_THEME_KEY,
        MSC_BOSS_THEME_KEY,
        MSC_KRYSTAL_THEME_KEY,
        MSC_FLOOD_THEME_KEY,
        MSC_LAVA_THEME_KEY
    }
}