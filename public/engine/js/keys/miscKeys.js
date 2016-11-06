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
        BackgroundKey[BackgroundKey["WOODLAND_KEY"] = 7] = "WOODLAND_KEY";
        BackgroundKey[BackgroundKey["CLOUD_KEY"] = 8] = "CLOUD_KEY";
    })(Lich.BackgroundKey || (Lich.BackgroundKey = {}));
    var BackgroundKey = Lich.BackgroundKey;
    (function (AnimationKey) {
        AnimationKey[AnimationKey["METEOR_ANIMATION_KEY"] = 0] = "METEOR_ANIMATION_KEY";
        AnimationKey[AnimationKey["FIREBALL_ANIMATION_KEY"] = 1] = "FIREBALL_ANIMATION_KEY";
        AnimationKey[AnimationKey["LICH_ANIMATION_KEY"] = 2] = "LICH_ANIMATION_KEY";
        AnimationKey[AnimationKey["CORPSE_ANIMATION_KEY"] = 3] = "CORPSE_ANIMATION_KEY";
        AnimationKey[AnimationKey["HELLHOUND_ANIMATION_KEY"] = 4] = "HELLHOUND_ANIMATION_KEY";
        AnimationKey[AnimationKey["BOLT_ANIMATION_KEY"] = 5] = "BOLT_ANIMATION_KEY";
    })(Lich.AnimationKey || (Lich.AnimationKey = {}));
    var AnimationKey = Lich.AnimationKey;
    (function (UIGFXKey) {
        UIGFXKey[UIGFXKey["PLAYER_ICON_KEY"] = 0] = "PLAYER_ICON_KEY";
        // misc.
        UIGFXKey[UIGFXKey["SKULL_KEY"] = 1] = "SKULL_KEY";
        UIGFXKey[UIGFXKey["HELMET_KEY"] = 2] = "HELMET_KEY";
        UIGFXKey[UIGFXKey["TORSO_KEY"] = 3] = "TORSO_KEY";
        UIGFXKey[UIGFXKey["GAUNTLET_KEY"] = 4] = "GAUNTLET_KEY";
        // buttons
        UIGFXKey[UIGFXKey["UI_SOUND_KEY"] = 5] = "UI_SOUND_KEY";
        UIGFXKey[UIGFXKey["UI_UP_KEY"] = 6] = "UI_UP_KEY";
        UIGFXKey[UIGFXKey["UI_DOWN_KEY"] = 7] = "UI_DOWN_KEY";
        UIGFXKey[UIGFXKey["UI_LEFT_KEY"] = 8] = "UI_LEFT_KEY";
        UIGFXKey[UIGFXKey["UI_RIGHT_KEY"] = 9] = "UI_RIGHT_KEY";
        UIGFXKey[UIGFXKey["UI_CRAFT_KEY"] = 10] = "UI_CRAFT_KEY";
        UIGFXKey[UIGFXKey["UI_SAVE_KEY"] = 11] = "UI_SAVE_KEY";
        UIGFXKey[UIGFXKey["UI_LOAD_KEY"] = 12] = "UI_LOAD_KEY";
        UIGFXKey[UIGFXKey["UI_NEW_WORLD_KEY"] = 13] = "UI_NEW_WORLD_KEY";
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
        // RMB click interakce s objekty
        SpellKey[SpellKey["SPELL_INTERACT_KEY"] = 8] = "SPELL_INTERACT_KEY";
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
        SoundKey[SoundKey["SND_BONECRACK_KEY"] = 10] = "SND_BONECRACK_KEY";
        SoundKey[SoundKey["SND_SKELETON_DIE_KEY"] = 11] = "SND_SKELETON_DIE_KEY";
        SoundKey[SoundKey["SND_SPAWN_KEY"] = 12] = "SND_SPAWN_KEY";
        SoundKey[SoundKey["SND_DOOR_OPEN_KEY"] = 13] = "SND_DOOR_OPEN_KEY";
        SoundKey[SoundKey["SND_DOOR_CLOSE_KEY"] = 14] = "SND_DOOR_CLOSE_KEY";
        SoundKey[SoundKey["SND_CRAFT_KEY"] = 15] = "SND_CRAFT_KEY";
        SoundKey[SoundKey["SND_CLICK_KEY"] = 16] = "SND_CLICK_KEY";
    })(Lich.SoundKey || (Lich.SoundKey = {}));
    var SoundKey = Lich.SoundKey;
    (function (MusicKey) {
        MusicKey[MusicKey["MSC_DIRT_THEME_KEY"] = 0] = "MSC_DIRT_THEME_KEY";
        MusicKey[MusicKey["MSC_BUILD_THEME_KEY"] = 1] = "MSC_BUILD_THEME_KEY";
        MusicKey[MusicKey["MSC_BOSS_THEME_KEY"] = 2] = "MSC_BOSS_THEME_KEY";
        MusicKey[MusicKey["MSC_KRYSTAL_THEME_KEY"] = 3] = "MSC_KRYSTAL_THEME_KEY";
        MusicKey[MusicKey["MSC_FLOOD_THEME_KEY"] = 4] = "MSC_FLOOD_THEME_KEY";
        MusicKey[MusicKey["MSC_LAVA_THEME_KEY"] = 5] = "MSC_LAVA_THEME_KEY";
    })(Lich.MusicKey || (Lich.MusicKey = {}));
    var MusicKey = Lich.MusicKey;
})(Lich || (Lich = {}));
