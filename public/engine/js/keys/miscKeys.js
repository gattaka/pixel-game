var Lich;
(function (Lich) {
    var SpritesheetKey;
    (function (SpritesheetKey) {
        SpritesheetKey[SpritesheetKey["SPST_ANM_KEY"] = 0] = "SPST_ANM_KEY";
        SpritesheetKey[SpritesheetKey["SPST_BGR_KEY"] = 1] = "SPST_BGR_KEY";
        SpritesheetKey[SpritesheetKey["SPST_FOG_KEY"] = 2] = "SPST_FOG_KEY";
        SpritesheetKey[SpritesheetKey["SPST_MPO_KEY"] = 3] = "SPST_MPO_KEY";
        SpritesheetKey[SpritesheetKey["SPST_SRFC_KEY"] = 4] = "SPST_SRFC_KEY";
        SpritesheetKey[SpritesheetKey["SPST_SRFC_BGR_KEY"] = 5] = "SPST_SRFC_BGR_KEY";
        SpritesheetKey[SpritesheetKey["SPST_UI_KEY"] = 6] = "SPST_UI_KEY";
    })(SpritesheetKey = Lich.SpritesheetKey || (Lich.SpritesheetKey = {}));
    var ParallaxKey;
    (function (ParallaxKey) {
        ParallaxKey[ParallaxKey["PRLX_BGR_DIRT_BACK_START_KEY"] = 0] = "PRLX_BGR_DIRT_BACK_START_KEY";
        ParallaxKey[ParallaxKey["PRLX_DIRT_BACK_KEY"] = 1] = "PRLX_DIRT_BACK_KEY";
        ParallaxKey[ParallaxKey["PRLX_SKY_KEY"] = 2] = "PRLX_SKY_KEY";
        ParallaxKey[ParallaxKey["PRLX_FAR_MOUNTAIN_KEY"] = 3] = "PRLX_FAR_MOUNTAIN_KEY";
        ParallaxKey[ParallaxKey["PRLX_MOUNTAIN_KEY"] = 4] = "PRLX_MOUNTAIN_KEY";
        ParallaxKey[ParallaxKey["PRLX_WOODLAND1_KEY"] = 5] = "PRLX_WOODLAND1_KEY";
        ParallaxKey[ParallaxKey["PRLX_WOODLAND2_KEY"] = 6] = "PRLX_WOODLAND2_KEY";
        ParallaxKey[ParallaxKey["PRLX_WOODLAND3_KEY"] = 7] = "PRLX_WOODLAND3_KEY";
        ParallaxKey[ParallaxKey["PRLX_WOODLAND4_KEY"] = 8] = "PRLX_WOODLAND4_KEY";
        ParallaxKey[ParallaxKey["PRLX_CLOUD1_KEY"] = 9] = "PRLX_CLOUD1_KEY";
        ParallaxKey[ParallaxKey["PRLX_CLOUD2_KEY"] = 10] = "PRLX_CLOUD2_KEY";
        ParallaxKey[ParallaxKey["PRLX_CLOUD3_KEY"] = 11] = "PRLX_CLOUD3_KEY";
        ParallaxKey[ParallaxKey["PRLX_CLOUD4_KEY"] = 12] = "PRLX_CLOUD4_KEY";
        ParallaxKey[ParallaxKey["PRLX_CLOUD5_KEY"] = 13] = "PRLX_CLOUD5_KEY";
    })(ParallaxKey = Lich.ParallaxKey || (Lich.ParallaxKey = {}));
    var FogKey;
    (function (FogKey) {
        FogKey[FogKey["FOG_KEY"] = 0] = "FOG_KEY";
    })(FogKey = Lich.FogKey || (Lich.FogKey = {}));
    var FontKey;
    (function (FontKey) {
        FontKey[FontKey["FNT_SMALL_YELLOW_KEY"] = 0] = "FNT_SMALL_YELLOW_KEY";
    })(FontKey = Lich.FontKey || (Lich.FontKey = {}));
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
        SoundKey[SoundKey["SND_ALIEN_SPAWN_KEY"] = 34] = "SND_ALIEN_SPAWN_KEY";
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
