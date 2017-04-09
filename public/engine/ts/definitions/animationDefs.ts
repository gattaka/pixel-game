namespace Lich {

    export class Animation {
        constructor(
            public animationKey: AnimationKey,
            public startFrame: number,
            public endFrame: number,
            public nextAnimationKey: AnimationKey,
            public speed: number) { }
    }

    export class AnimationSetDefinition {
        animations: { [k: string]: Animation } = {};

        constructor(
            // jméno položky z hlavního spritesheetu
            public spriteName: string,
            // klíč sady animací
            public animationSetKey: AnimationSetKey,
            // počet snímků
            public frames: number,
            // rozměry snímků animací
            public width: number,
            public height: number,
        ) { }

        add(
            animation: AnimationKey,
            startFrame: number,
            endFrame: number,
            nextAnimation: AnimationKey,
            speed: number) {
            this.animations[AnimationKey[animation]] = new Animation(animation, startFrame, endFrame, nextAnimation, speed);
            return this;
        }
    }

    export let ANIMATION_DEFS: Array<AnimationSetDefinition> = [
        // characters
        new AnimationSetDefinition("anm_lich", AnimationSetKey.LICH_ANIMATION_KEY, 40, 56, 80)
            .add(AnimationKey.ANM_HERO_IDLE_KEY, 0, 0, AnimationKey.ANM_HERO_BREATH_KEY, 0.005)
            .add(AnimationKey.ANM_HERO_BREATH_KEY, 1, 1, AnimationKey.ANM_HERO_IDLE_KEY, 0.04)
            .add(AnimationKey.ANM_HERO_WALKR_KEY, 2, 9, AnimationKey.ANM_HERO_WALKR_KEY, 0.3)
            .add(AnimationKey.ANM_HERO_WALKL_KEY, 10, 17, AnimationKey.ANM_HERO_WALKL_KEY, 0.3)
            .add(AnimationKey.ANM_HERO_JUMP_KEY, 18, 19, AnimationKey.ANM_HERO_MIDAIR_KEY, 0.2)
            .add(AnimationKey.ANM_HERO_MIDAIR_KEY, 19, 19, AnimationKey.ANM_HERO_MIDAIR_KEY, 0.2)
            .add(AnimationKey.ANM_HERO_FALL_KEY, 19, 23, AnimationKey.ANM_HERO_IDLE_KEY, 0.2)
            .add(AnimationKey.ANM_HERO_JUMPR_KEY, 25, 25, AnimationKey.ANM_HERO_JUMPR_KEY, 0.2)
            .add(AnimationKey.ANM_HERO_JUMPL_KEY, 27, 27, AnimationKey.ANM_HERO_JUMPL_KEY, 0.2)
            .add(AnimationKey.ANM_HERO_DIE_KEY, 28, 28, AnimationKey.ANM_HERO_DEAD_KEY, 0.2)
            .add(AnimationKey.ANM_HERO_DEAD_KEY, 29, 29, AnimationKey.ANM_HERO_DEAD_KEY, 0.2)
            .add(AnimationKey.ANM_HERO_TELEPORT_KEY, 30, 36, AnimationKey.ANM_HERO_IDLE_KEY, 1.0)
            .add(AnimationKey.ANM_HERO_CLIMB_KEY, 37, 39, AnimationKey.ANM_HERO_CLIMB_KEY, 0.3),
        new AnimationSetDefinition("anm_bunny", AnimationSetKey.BUNNY_ANIMATION_KEY, 13, 32, 32)
            .add(AnimationKey.ANM_BUNNY_EATL_KEY, 6, 7, AnimationKey.ANM_BUNNY_EATL_KEY, 0.1)
            .add(AnimationKey.ANM_BUNNY_IDLEL_KEY, 11, 11, AnimationKey.ANM_BUNNY_IDLEL_KEY, 0.001)
            .add(AnimationKey.ANM_BUNNY_JUMPL_KEY, 8, 11, AnimationKey.ANM_BUNNY_JUMPL_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_WALKL_KEY, 8, 11, AnimationKey.ANM_BUNNY_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_WALKR_KEY, 0, 3, AnimationKey.ANM_BUNNY_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_JUMPR_KEY, 0, 3, AnimationKey.ANM_BUNNY_JUMPR_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_IDLER_KEY, 0, 0, AnimationKey.ANM_BUNNY_IDLER_KEY, 0.001)
            .add(AnimationKey.ANM_BUNNY_EATR_KEY, 4, 5, AnimationKey.ANM_BUNNY_EATR_KEY, 0.1)
            .add(AnimationKey.ANM_BUNNY_DIE_KEY, 12, 12, AnimationKey.ANM_BUNNY_DIE_KEY, 0.1),
        new AnimationSetDefinition("anm_chicken", AnimationSetKey.CHICKEN_ANIMATION_KEY, 15, 26, 26)
            .add(AnimationKey.ANM_CHICKEN_EATL_KEY, 0, 1, AnimationKey.ANM_CHICKEN_EATL_KEY, 0.1)
            .add(AnimationKey.ANM_CHICKEN_IDLEL_KEY, 2, 2, AnimationKey.ANM_CHICKEN_IDLEL_KEY, 0.001)
            .add(AnimationKey.ANM_CHICKEN_JUMPL_KEY, 3, 3, AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_WALKL_KEY, 3, 6, AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_WALKR_KEY, 7, 10, AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_JUMPR_KEY, 10, 10, AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_IDLER_KEY, 11, 11, AnimationKey.ANM_CHICKEN_IDLER_KEY, 0.001)
            .add(AnimationKey.ANM_CHICKEN_EATR_KEY, 12, 13, AnimationKey.ANM_CHICKEN_EATR_KEY, 0.1)
            .add(AnimationKey.ANM_CHICKEN_DIE_KEY, 14, 14, AnimationKey.ANM_CHICKEN_DIE_KEY, 0.1),
        new AnimationSetDefinition("anm_corpse", AnimationSetKey.CORPSE_ANIMATION_KEY, 30, 56, 80)
            .add(AnimationKey.ANM_REDSKULL_IDLE_KEY, 0, 0, AnimationKey.ANM_REDSKULL_BREATH_KEY, 0.005)
            .add(AnimationKey.ANM_REDSKULL_BREATH_KEY, 1, 1, AnimationKey.ANM_REDSKULL_IDLE_KEY, 0.04)
            .add(AnimationKey.ANM_REDSKULL_WALKR_KEY, 2, 9, AnimationKey.ANM_REDSKULL_WALKR_KEY, 0.3)
            .add(AnimationKey.ANM_REDSKULL_WALKL_KEY, 10, 17, AnimationKey.ANM_REDSKULL_WALKL_KEY, 0.3)
            .add(AnimationKey.ANM_REDSKULL_JUMP_KEY, 18, 19, AnimationKey.ANM_REDSKULL_MIDAIR_KEY, 0.2)
            .add(AnimationKey.ANM_REDSKULL_MIDAIR_KEY, 19, 19, AnimationKey.ANM_REDSKULL_MIDAIR_KEY, 0.2)
            .add(AnimationKey.ANM_REDSKULL_FALL_KEY, 19, 23, AnimationKey.ANM_REDSKULL_IDLE_KEY, 0.2)
            .add(AnimationKey.ANM_REDSKULL_JUMPR_KEY, 25, 25, AnimationKey.ANM_REDSKULL_JUMPR_KEY, 0.2)
            .add(AnimationKey.ANM_REDSKULL_JUMPL_KEY, 27, 27, AnimationKey.ANM_REDSKULL_JUMPL_KEY, 0.2)
            .add(AnimationKey.ANM_REDSKULL_DIE_KEY, 28, 28, AnimationKey.ANM_REDSKULL_DEAD_KEY, 0.2)
            .add(AnimationKey.ANM_REDSKULL_DEAD_KEY, 29, 29, AnimationKey.ANM_REDSKULL_DEAD_KEY, 0.2),
        new AnimationSetDefinition("anm_chicken_boss", AnimationSetKey.CHICKEN_BOSS_ANIMATION_KEY, 2, 184, 304)
            .add(AnimationKey.ANM_MURHUN_IDLE_KEY, 1, 1, AnimationKey.ANM_MURHUN_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_MURHUN_ATTACK_KEY, 0, 0, AnimationKey.ANM_MURHUN_ATTACK_KEY, 0.1),
        new AnimationSetDefinition("anm_hellhound", AnimationSetKey.HELLHOUND_ANIMATION_KEY, 25, 128, 86)
            .add(AnimationKey.ANM_HELLHOUND_IDLE_KEY, 22, 24, AnimationKey.ANM_HELLHOUND_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_HELLHOUND_WALKR_KEY, 5, 9, AnimationKey.ANM_HELLHOUND_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0, 4, AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_HELLHOUND_JUMPR_KEY, 16, 21, AnimationKey.ANM_HELLHOUND_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_HELLHOUND_JUMPL_KEY, 10, 15, AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0.2),
        new AnimationSetDefinition("anm_cupid", AnimationSetKey.CUPID_ANIMATION_KEY, 6, 256, 320)
            .add(AnimationKey.ANM_CUPID_IDLE_KEY, 0, 1, AnimationKey.ANM_CUPID_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_CUPID_ATTACK_KEY, 2, 3, AnimationKey.ANM_CUPID_IDLE_KEY, 0.3)
            .add(AnimationKey.ANM_CUPID_HIT_KEY, 4, 4, AnimationKey.ANM_CUPID_IDLE_KEY, 0.2)
            .add(AnimationKey.ANM_CUPID_DIE_KEY, 5, 5, AnimationKey.ANM_CUPID_DEAD_KEY, 0.3)
            .add(AnimationKey.ANM_CUPID_DEAD_KEY, 5, 5, AnimationKey.ANM_CUPID_DEAD_KEY, 0.1),
        new AnimationSetDefinition("anm_valentimon", AnimationSetKey.VALENTIMON_ANIMATION_KEY, 9, 64, 64)
            .add(AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0, 3, AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_VALENTIMON_ATTACK_KEY, 3, 5, AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0.3)
            .add(AnimationKey.ANM_VALENTIMON_DIE_KEY, 4, 8, AnimationKey.ANM_VALENTIMON_DEAD_KEY, 0.2)
            .add(AnimationKey.ANM_VALENTIMON_DEAD_KEY, 8, 8, AnimationKey.ANM_VALENTIMON_DEAD_KEY, 1),
        new AnimationSetDefinition("anm_alien", AnimationSetKey.ALIEN_ANIMATION_KEY, 36, 96, 74)
            .add(AnimationKey.ANM_ALIEN_WALKL_KEY, 0, 11, AnimationKey.ANM_ALIEN_WALKL_KEY, 0.3)
            .add(AnimationKey.ANM_ALIEN_WALKR_KEY, 12, 23, AnimationKey.ANM_ALIEN_WALKR_KEY, 0.3)
            .add(AnimationKey.ANM_ALIEN_ATTACKL_KEY, 24, 27, AnimationKey.ANM_ALIEN_ATTACKL_KEY, 0.3)
            .add(AnimationKey.ANM_ALIEN_ATTACKR_KEY, 30, 33, AnimationKey.ANM_ALIEN_ATTACKR_KEY, 0.3)
            .add(AnimationKey.ANM_ALIEN_DIE_KEY, 35, 35, AnimationKey.ANM_ALIEN_DIE_KEY, 0.3),
        // gfx animations
        new AnimationSetDefinition("anm_blast", AnimationSetKey.FIREBALL_ANIMATION_KEY, 5, 60, 60)
            .add(AnimationKey.ANM_BULLET_FLY_KEY, 0, 0, AnimationKey.ANM_BULLET_FLY_KEY, 1)
            .add(AnimationKey.ANM_BULLET_HIT_KEY, 1, 4, AnimationKey.ANM_BULLET_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_BULLET_DONE_KEY, 4, 4, AnimationKey.ANM_BULLET_DONE_KEY, 1),
        new AnimationSetDefinition("anm_meteor", AnimationSetKey.METEOR_ANIMATION_KEY, 5, 120, 120)
            .add(AnimationKey.ANM_BULLET_FLY_KEY, 0, 0, AnimationKey.ANM_BULLET_FLY_KEY, 1)
            .add(AnimationKey.ANM_BULLET_HIT_KEY, 1, 4, AnimationKey.ANM_BULLET_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_BULLET_DONE_KEY, 4, 4, AnimationKey.ANM_BULLET_DONE_KEY, 1),
        new AnimationSetDefinition("anm_bolt", AnimationSetKey.ICEBOLT_ANIMATION_KEY, 5, 60, 60)
            .add(AnimationKey.ANM_BULLET_FLY_KEY, 0, 0, AnimationKey.ANM_BULLET_FLY_KEY, 1)
            .add(AnimationKey.ANM_BULLET_HIT_KEY, 1, 4, AnimationKey.ANM_BULLET_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_BULLET_DONE_KEY, 4, 4, AnimationKey.ANM_BULLET_DONE_KEY, 1),
        new AnimationSetDefinition("anm_loveletter", AnimationSetKey.LOVELETTER_ANIMATION_KEY, 6, 32, 32)
            .add(AnimationKey.ANM_BULLET_FLY_KEY, 0, 0, AnimationKey.ANM_BULLET_FLY_KEY, 1)
            .add(AnimationKey.ANM_BULLET_HIT_KEY, 1, 5, AnimationKey.ANM_BULLET_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_BULLET_DONE_KEY, 5, 5, AnimationKey.ANM_BULLET_DONE_KEY, 1),
        new AnimationSetDefinition("anm_lovearrow", AnimationSetKey.LOVEARROW_ANIMATION_KEY, 6, 32, 32)
            .add(AnimationKey.ANM_BULLET_FLY_KEY, 0, 0, AnimationKey.ANM_BULLET_FLY_KEY, 1)
            .add(AnimationKey.ANM_BULLET_HIT_KEY, 1, 5, AnimationKey.ANM_BULLET_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_BULLET_DONE_KEY, 5, 5, AnimationKey.ANM_BULLET_DONE_KEY, 1),
    ]
}