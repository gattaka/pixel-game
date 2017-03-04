var Lich;
(function (Lich) {
    var AnimationSetKey;
    (function (AnimationSetKey) {
        AnimationSetKey[AnimationSetKey["METEOR_ANIMATION_KEY"] = 0] = "METEOR_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["FIREBALL_ANIMATION_KEY"] = 1] = "FIREBALL_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["LICH_ANIMATION_KEY"] = 2] = "LICH_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["CORPSE_ANIMATION_KEY"] = 3] = "CORPSE_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["HELLHOUND_ANIMATION_KEY"] = 4] = "HELLHOUND_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["ICEBOLT_ANIMATION_KEY"] = 5] = "ICEBOLT_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["CHICKEN_ANIMATION_KEY"] = 6] = "CHICKEN_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["BUNNY_ANIMATION_KEY"] = 7] = "BUNNY_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["CHICKEN_BOSS_ANIMATION_KEY"] = 8] = "CHICKEN_BOSS_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["VALENTIMON_ANIMATION_KEY"] = 9] = "VALENTIMON_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["LOVELETTER_ANIMATION_KEY"] = 10] = "LOVELETTER_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["LOVEARROW_ANIMATION_KEY"] = 11] = "LOVEARROW_ANIMATION_KEY";
        AnimationSetKey[AnimationSetKey["CUPID_ANIMATION_KEY"] = 12] = "CUPID_ANIMATION_KEY";
    })(AnimationSetKey = Lich.AnimationSetKey || (Lich.AnimationSetKey = {}));
    var AnimationKey;
    (function (AnimationKey) {
        // Hero
        AnimationKey[AnimationKey["ANM_HERO_IDLE_KEY"] = 0] = "ANM_HERO_IDLE_KEY";
        AnimationKey[AnimationKey["ANM_HERO_BREATH_KEY"] = 1] = "ANM_HERO_BREATH_KEY";
        AnimationKey[AnimationKey["ANM_HERO_WALKR_KEY"] = 2] = "ANM_HERO_WALKR_KEY";
        AnimationKey[AnimationKey["ANM_HERO_WALKL_KEY"] = 3] = "ANM_HERO_WALKL_KEY";
        AnimationKey[AnimationKey["ANM_HERO_JUMP_KEY"] = 4] = "ANM_HERO_JUMP_KEY";
        AnimationKey[AnimationKey["ANM_HERO_MIDAIR_KEY"] = 5] = "ANM_HERO_MIDAIR_KEY";
        AnimationKey[AnimationKey["ANM_HERO_FALL_KEY"] = 6] = "ANM_HERO_FALL_KEY";
        AnimationKey[AnimationKey["ANM_HERO_JUMPR_KEY"] = 7] = "ANM_HERO_JUMPR_KEY";
        AnimationKey[AnimationKey["ANM_HERO_JUMPL_KEY"] = 8] = "ANM_HERO_JUMPL_KEY";
        AnimationKey[AnimationKey["ANM_HERO_DIE_KEY"] = 9] = "ANM_HERO_DIE_KEY";
        AnimationKey[AnimationKey["ANM_HERO_DEAD_KEY"] = 10] = "ANM_HERO_DEAD_KEY";
        AnimationKey[AnimationKey["ANM_HERO_TELEPORT_KEY"] = 11] = "ANM_HERO_TELEPORT_KEY";
        AnimationKey[AnimationKey["ANM_HERO_CLIMB_KEY"] = 12] = "ANM_HERO_CLIMB_KEY";
        // Bunny
        AnimationKey[AnimationKey["ANM_BUNNY_EATL_KEY"] = 13] = "ANM_BUNNY_EATL_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_IDLEL_KEY"] = 14] = "ANM_BUNNY_IDLEL_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_JUMPL_KEY"] = 15] = "ANM_BUNNY_JUMPL_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_WALKL_KEY"] = 16] = "ANM_BUNNY_WALKL_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_WALKR_KEY"] = 17] = "ANM_BUNNY_WALKR_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_JUMPR_KEY"] = 18] = "ANM_BUNNY_JUMPR_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_IDLER_KEY"] = 19] = "ANM_BUNNY_IDLER_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_EATR_KEY"] = 20] = "ANM_BUNNY_EATR_KEY";
        AnimationKey[AnimationKey["ANM_BUNNY_DIE_KEY"] = 21] = "ANM_BUNNY_DIE_KEY";
        // Chicken
        AnimationKey[AnimationKey["ANM_CHICKEN_EATL_KEY"] = 22] = "ANM_CHICKEN_EATL_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_IDLEL_KEY"] = 23] = "ANM_CHICKEN_IDLEL_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_JUMPL_KEY"] = 24] = "ANM_CHICKEN_JUMPL_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_WALKL_KEY"] = 25] = "ANM_CHICKEN_WALKL_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_WALKR_KEY"] = 26] = "ANM_CHICKEN_WALKR_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_JUMPR_KEY"] = 27] = "ANM_CHICKEN_JUMPR_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_IDLER_KEY"] = 28] = "ANM_CHICKEN_IDLER_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_EATR_KEY"] = 29] = "ANM_CHICKEN_EATR_KEY";
        AnimationKey[AnimationKey["ANM_CHICKEN_DIE_KEY"] = 30] = "ANM_CHICKEN_DIE_KEY";
        // Redskull
        AnimationKey[AnimationKey["ANM_REDSKULL_IDLE_KEY"] = 31] = "ANM_REDSKULL_IDLE_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_BREATH_KEY"] = 32] = "ANM_REDSKULL_BREATH_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_WALKR_KEY"] = 33] = "ANM_REDSKULL_WALKR_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_WALKL_KEY"] = 34] = "ANM_REDSKULL_WALKL_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_JUMP_KEY"] = 35] = "ANM_REDSKULL_JUMP_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_MIDAIR_KEY"] = 36] = "ANM_REDSKULL_MIDAIR_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_FALL_KEY"] = 37] = "ANM_REDSKULL_FALL_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_JUMPR_KEY"] = 38] = "ANM_REDSKULL_JUMPR_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_JUMPL_KEY"] = 39] = "ANM_REDSKULL_JUMPL_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_DIE_KEY"] = 40] = "ANM_REDSKULL_DIE_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_DEAD_KEY"] = 41] = "ANM_REDSKULL_DEAD_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_TELEPORT_KEY"] = 42] = "ANM_REDSKULL_TELEPORT_KEY";
        AnimationKey[AnimationKey["ANM_REDSKULL_CLIMB_KEY"] = 43] = "ANM_REDSKULL_CLIMB_KEY";
        // Murhun
        AnimationKey[AnimationKey["ANM_MURHUN_IDLE_KEY"] = 44] = "ANM_MURHUN_IDLE_KEY";
        AnimationKey[AnimationKey["ANM_MURHUN_ATTACK_KEY"] = 45] = "ANM_MURHUN_ATTACK_KEY";
        // Hellhound
        AnimationKey[AnimationKey["ANM_HELLHOUND_IDLE_KEY"] = 46] = "ANM_HELLHOUND_IDLE_KEY";
        AnimationKey[AnimationKey["ANM_HELLHOUND_WALKR_KEY"] = 47] = "ANM_HELLHOUND_WALKR_KEY";
        AnimationKey[AnimationKey["ANM_HELLHOUND_WALKL_KEY"] = 48] = "ANM_HELLHOUND_WALKL_KEY";
        AnimationKey[AnimationKey["ANM_HELLHOUND_JUMPR_KEY"] = 49] = "ANM_HELLHOUND_JUMPR_KEY";
        AnimationKey[AnimationKey["ANM_HELLHOUND_JUMPL_KEY"] = 50] = "ANM_HELLHOUND_JUMPL_KEY";
        // Cupid
        AnimationKey[AnimationKey["ANM_CUPID_IDLE_KEY"] = 51] = "ANM_CUPID_IDLE_KEY";
        AnimationKey[AnimationKey["ANM_CUPID_ATTACK_KEY"] = 52] = "ANM_CUPID_ATTACK_KEY";
        AnimationKey[AnimationKey["ANM_CUPID_HIT_KEY"] = 53] = "ANM_CUPID_HIT_KEY";
        AnimationKey[AnimationKey["ANM_CUPID_DIE_KEY"] = 54] = "ANM_CUPID_DIE_KEY";
        AnimationKey[AnimationKey["ANM_CUPID_EXPLODE_KEY"] = 55] = "ANM_CUPID_EXPLODE_KEY";
        AnimationKey[AnimationKey["ANM_CUPID_DEAD_KEY"] = 56] = "ANM_CUPID_DEAD_KEY";
        // Valentimon
        AnimationKey[AnimationKey["ANM_VALENTIMON_IDLE_KEY"] = 57] = "ANM_VALENTIMON_IDLE_KEY";
        AnimationKey[AnimationKey["ANM_VALENTIMON_ATTACK_KEY"] = 58] = "ANM_VALENTIMON_ATTACK_KEY";
        AnimationKey[AnimationKey["ANM_VALENTIMON_DIE_KEY"] = 59] = "ANM_VALENTIMON_DIE_KEY";
        AnimationKey[AnimationKey["ANM_VALENTIMON_DEAD_KEY"] = 60] = "ANM_VALENTIMON_DEAD_KEY";
        // Projectiles
        AnimationKey[AnimationKey["ANM_BULLET_FLY_KEY"] = 61] = "ANM_BULLET_FLY_KEY";
        AnimationKey[AnimationKey["ANM_BULLET_HIT_KEY"] = 62] = "ANM_BULLET_HIT_KEY";
        AnimationKey[AnimationKey["ANM_BULLET_DONE_KEY"] = 63] = "ANM_BULLET_DONE_KEY";
    })(AnimationKey = Lich.AnimationKey || (Lich.AnimationKey = {}));
})(Lich || (Lich = {}));
