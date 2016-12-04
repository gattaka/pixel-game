var Lich;
(function (Lich) {
    (function (BackgroundKey) {
        BackgroundKey[BackgroundKey["DIRT_BACK_START_KEY"] = 0] = "DIRT_BACK_START_KEY";
        BackgroundKey[BackgroundKey["DIRT_BACK_KEY"] = 1] = "DIRT_BACK_KEY";
        BackgroundKey[BackgroundKey["SKY_KEY"] = 2] = "SKY_KEY";
        BackgroundKey[BackgroundKey["FAR_MOUNTAIN_KEY"] = 3] = "FAR_MOUNTAIN_KEY";
        BackgroundKey[BackgroundKey["MOUNTAIN_KEY"] = 4] = "MOUNTAIN_KEY";
        BackgroundKey[BackgroundKey["DIRTBACK_KEY"] = 5] = "DIRTBACK_KEY";
        BackgroundKey[BackgroundKey["DARKNESS_KEY"] = 6] = "DARKNESS_KEY";
        BackgroundKey[BackgroundKey["WOODLAND1_KEY"] = 7] = "WOODLAND1_KEY";
        BackgroundKey[BackgroundKey["WOODLAND2_KEY"] = 8] = "WOODLAND2_KEY";
        BackgroundKey[BackgroundKey["WOODLAND3_KEY"] = 9] = "WOODLAND3_KEY";
        BackgroundKey[BackgroundKey["WOODLAND4_KEY"] = 10] = "WOODLAND4_KEY";
        BackgroundKey[BackgroundKey["CLOUD1_KEY"] = 11] = "CLOUD1_KEY";
        BackgroundKey[BackgroundKey["CLOUD2_KEY"] = 12] = "CLOUD2_KEY";
        BackgroundKey[BackgroundKey["CLOUD3_KEY"] = 13] = "CLOUD3_KEY";
        BackgroundKey[BackgroundKey["CLOUD4_KEY"] = 14] = "CLOUD4_KEY";
        BackgroundKey[BackgroundKey["CLOUD5_KEY"] = 15] = "CLOUD5_KEY";
    })(Lich.BackgroundKey || (Lich.BackgroundKey = {}));
    var BackgroundKey = Lich.BackgroundKey;
    (function (AnimationKey) {
        AnimationKey[AnimationKey["METEOR_ANIMATION_KEY"] = 0] = "METEOR_ANIMATION_KEY";
        AnimationKey[AnimationKey["FIREBALL_ANIMATION_KEY"] = 1] = "FIREBALL_ANIMATION_KEY";
        AnimationKey[AnimationKey["LICH_ANIMATION_KEY"] = 2] = "LICH_ANIMATION_KEY";
        AnimationKey[AnimationKey["CORPSE_ANIMATION_KEY"] = 3] = "CORPSE_ANIMATION_KEY";
        AnimationKey[AnimationKey["HELLHOUND_ANIMATION_KEY"] = 4] = "HELLHOUND_ANIMATION_KEY";
        AnimationKey[AnimationKey["BOLT_ANIMATION_KEY"] = 5] = "BOLT_ANIMATION_KEY";
        AnimationKey[AnimationKey["CHICKEN_ANIMATION_KEY"] = 6] = "CHICKEN_ANIMATION_KEY";
        AnimationKey[AnimationKey["BUNNY_ANIMATION_KEY"] = 7] = "BUNNY_ANIMATION_KEY";
        AnimationKey[AnimationKey["CHICKEN_BOSS_ANIMATION_KEY"] = 8] = "CHICKEN_BOSS_ANIMATION_KEY";
    })(Lich.AnimationKey || (Lich.AnimationKey = {}));
    var AnimationKey = Lich.AnimationKey;
    (function (UIGFXKey) {
        UIGFXKey[UIGFXKey["PLAYER_ICON_KEY"] = 0] = "PLAYER_ICON_KEY";
        // misc.
        UIGFXKey[UIGFXKey["SKULL_KEY"] = 1] = "SKULL_KEY";
        UIGFXKey[UIGFXKey["GAME_OVER_KEY"] = 2] = "GAME_OVER_KEY";
        UIGFXKey[UIGFXKey["HELMET_KEY"] = 3] = "HELMET_KEY";
        UIGFXKey[UIGFXKey["TORSO_KEY"] = 4] = "TORSO_KEY";
        UIGFXKey[UIGFXKey["GAUNTLET_KEY"] = 5] = "GAUNTLET_KEY";
        // buttons
        UIGFXKey[UIGFXKey["UI_SOUND_KEY"] = 6] = "UI_SOUND_KEY";
        UIGFXKey[UIGFXKey["UI_UP_KEY"] = 7] = "UI_UP_KEY";
        UIGFXKey[UIGFXKey["UI_DOWN_KEY"] = 8] = "UI_DOWN_KEY";
        UIGFXKey[UIGFXKey["UI_LEFT_KEY"] = 9] = "UI_LEFT_KEY";
        UIGFXKey[UIGFXKey["UI_RIGHT_KEY"] = 10] = "UI_RIGHT_KEY";
        UIGFXKey[UIGFXKey["UI_CRAFT_KEY"] = 11] = "UI_CRAFT_KEY";
        UIGFXKey[UIGFXKey["UI_SAVE_KEY"] = 12] = "UI_SAVE_KEY";
        UIGFXKey[UIGFXKey["UI_LOAD_KEY"] = 13] = "UI_LOAD_KEY";
        UIGFXKey[UIGFXKey["UI_NEW_WORLD_KEY"] = 14] = "UI_NEW_WORLD_KEY";
        UIGFXKey[UIGFXKey["UI_HELP_KEY"] = 15] = "UI_HELP_KEY";
    })(Lich.UIGFXKey || (Lich.UIGFXKey = {}));
    var UIGFXKey = Lich.UIGFXKey;
    (function (SpellKey) {
        SpellKey[SpellKey["SPELL_PLACE_KEY"] = 0] = "SPELL_PLACE_KEY";
        SpellKey[SpellKey["SPELL_PLACE_BGR_KEY"] = 1] = "SPELL_PLACE_BGR_KEY";
        SpellKey[SpellKey["SPELL_DIG_KEY"] = 2] = "SPELL_DIG_KEY";
        SpellKey[SpellKey["SPELL_DIG_BGR_KEY"] = 3] = "SPELL_DIG_BGR_KEY";
        SpellKey[SpellKey["SPELL_FIREBALL_KEY"] = 4] = "SPELL_FIREBALL_KEY";
        SpellKey[SpellKey["SPELL_METEOR_KEY"] = 5] = "SPELL_METEOR_KEY";
        SpellKey[SpellKey["SPELL_BOLT_KEY"] = 6] = "SPELL_BOLT_KEY";
        SpellKey[SpellKey["SPELL_ENEMY_KEY"] = 7] = "SPELL_ENEMY_KEY";
        SpellKey[SpellKey["SPELL_TELEPORT_KEY"] = 8] = "SPELL_TELEPORT_KEY";
        // RMB click interakce s objekty
        SpellKey[SpellKey["SPELL_INTERACT_KEY"] = 9] = "SPELL_INTERACT_KEY";
    })(Lich.SpellKey || (Lich.SpellKey = {}));
    var SpellKey = Lich.SpellKey;
    (function (SoundKey) {
        SoundKey[SoundKey["SND_FIREBALL_KEY"] = 0] = "SND_FIREBALL_KEY";
        SoundKey[SoundKey["SND_BURN_KEY"] = 1] = "SND_BURN_KEY";
        SoundKey[SoundKey["SND_METEOR_FALL_KEY"] = 2] = "SND_METEOR_FALL_KEY";
        SoundKey[SoundKey["SND_METEOR_HIT_KEY"] = 3] = "SND_METEOR_HIT_KEY";
        SoundKey[SoundKey["SND_BOLT_CAST"] = 4] = "SND_BOLT_CAST";
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
    })(Lich.SoundKey || (Lich.SoundKey = {}));
    var SoundKey = Lich.SoundKey;
    (function (MusicKey) {
        MusicKey[MusicKey["MSC_DIRT_THEME_KEY"] = 0] = "MSC_DIRT_THEME_KEY";
        MusicKey[MusicKey["MSC_BUILD_THEME_KEY"] = 1] = "MSC_BUILD_THEME_KEY";
        MusicKey[MusicKey["MSC_BOSS_THEME_KEY"] = 2] = "MSC_BOSS_THEME_KEY";
        MusicKey[MusicKey["MSC_KRYSTAL_THEME_KEY"] = 3] = "MSC_KRYSTAL_THEME_KEY";
        MusicKey[MusicKey["MSC_FLOOD_THEME_KEY"] = 4] = "MSC_FLOOD_THEME_KEY";
        MusicKey[MusicKey["MSC_LAVA_THEME_KEY"] = 5] = "MSC_LAVA_THEME_KEY";
        MusicKey[MusicKey["MSC_CHICKEN_BOSS_THEME_KEY"] = 6] = "MSC_CHICKEN_BOSS_THEME_KEY";
    })(Lich.MusicKey || (Lich.MusicKey = {}));
    var MusicKey = Lich.MusicKey;
})(Lich || (Lich = {}));
