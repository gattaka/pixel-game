namespace Lich {

    class Animation {
        constructor(
            public animation: AnimationKey,
            public startFrame: number,
            public endFrame: number,
            public nextAnimation: AnimationKey,
            public time: number) { }
    }

    export class AnimationSetDefinition {
        animations = Array<Animation>();

        constructor(
            // klíč hlavního spritesheetu 
            public spritesheetKey: SpritesheetKey,
            // jméno položky z hlavního spritesheetu
            public subSpritesheetName: string,
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
            time: number) {
            this.animations.push(new Animation(animation, startFrame, endFrame, nextAnimation, time));
            return this;
        }

        serialize() {
            let obj = {};
            this.animations.forEach((ani: Animation) => {
                obj[ani.animation] = [ani.startFrame, ani.endFrame, ani.nextAnimation, ani.time];
            });
            return obj;
        }
    }

    export let ANIMATION_DEFS: Array<AnimationSetDefinition> = [
        // characters
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "lich_animation", AnimationSetKey.LICH_ANIMATION_KEY, 40, 56, 80)
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
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "bunny", AnimationSetKey.BUNNY_ANIMATION_KEY, 13, 32, 32)
            .add(AnimationKey.ANM_BUNNY_EATL_KEY, 6, 7, AnimationKey.ANM_BUNNY_EATL_KEY, 0.1)
            .add(AnimationKey.ANM_BUNNY_IDLEL_KEY, 11, 11, AnimationKey.ANM_BUNNY_IDLEL_KEY, 0.001)
            .add(AnimationKey.ANM_BUNNY_JUMPL_KEY, 8, 11, AnimationKey.ANM_BUNNY_JUMPL_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_WALKL_KEY, 8, 11, AnimationKey.ANM_BUNNY_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_WALKR_KEY, 0, 3, AnimationKey.ANM_BUNNY_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_JUMPR_KEY, 0, 3, AnimationKey.ANM_BUNNY_JUMPR_KEY, 0.2)
            .add(AnimationKey.ANM_BUNNY_IDLER_KEY, 0, 0, AnimationKey.ANM_BUNNY_IDLER_KEY, 0.001)
            .add(AnimationKey.ANM_BUNNY_EATR_KEY, 4, 5, AnimationKey.ANM_BUNNY_EATR_KEY, 0.1)
            .add(AnimationKey.ANM_BUNNY_DIE_KEY, 12, 12, AnimationKey.ANM_BUNNY_DIE_KEY, 0.1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "chicken", AnimationSetKey.CHICKEN_ANIMATION_KEY, 15, 26, 26)
            .add(AnimationKey.ANM_CHICKEN_EATL_KEY, 0, 1, AnimationKey.ANM_CHICKEN_EATL_KEY, 0.1)
            .add(AnimationKey.ANM_CHICKEN_IDLEL_KEY, 2, 2, AnimationKey.ANM_CHICKEN_IDLEL_KEY, 0.001)
            .add(AnimationKey.ANM_CHICKEN_JUMPL_KEY, 3, 3, AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_WALKL_KEY, 3, 6, AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_WALKR_KEY, 7, 10, AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_JUMPR_KEY, 10, 10, AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_CHICKEN_IDLER_KEY, 11, 11, AnimationKey.ANM_CHICKEN_IDLER_KEY, 0.001)
            .add(AnimationKey.ANM_CHICKEN_EATR_KEY, 12, 13, AnimationKey.ANM_CHICKEN_EATR_KEY, 0.1)
            .add(AnimationKey.ANM_CHICKEN_DIE_KEY, 14, 14, AnimationKey.ANM_CHICKEN_DIE_KEY, 0.1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "corpse_animation", AnimationSetKey.CORPSE_ANIMATION_KEY, 30, 56, 80)
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
            .add(AnimationKey.ANM_HERO_DEAD_KEY, 29, 29, AnimationKey.ANM_HERO_DEAD_KEY, 0.2),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "chicken_boss", AnimationSetKey.CHICKEN_BOSS_ANIMATION_KEY, 2, 184, 304)
            .add(AnimationKey.ANM_MURHUN_IDLE_KEY, 1, 1, AnimationKey.ANM_MURHUN_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_MURHUN_ATTACK_KEY, 0, 0, AnimationKey.ANM_MURHUN_ATTACK_KEY, 0.1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "hellhound", AnimationSetKey.HELLHOUND_ANIMATION_KEY, 25, 128, 86)
            .add(AnimationKey.ANM_HELLHOUND_IDLE_KEY, 22, 24, AnimationKey.ANM_HELLHOUND_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_HELLHOUND_WALKR_KEY, 5, 9, AnimationKey.ANM_HELLHOUND_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0, 4, AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0.2)
            .add(AnimationKey.ANM_HELLHOUND_JUMPR_KEY, 16, 21, AnimationKey.ANM_HELLHOUND_WALKR_KEY, 0.2)
            .add(AnimationKey.ANM_HELLHOUND_JUMPL_KEY, 10, 15, AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0.2),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "cupid", AnimationSetKey.CUPID_ANIMATION_KEY, 6, 256, 320)
            .add(AnimationKey.ANM_CUPID_IDLE_KEY, 0, 1, AnimationKey.ANM_CUPID_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_CUPID_ATTACK_KEY, 2, 3, AnimationKey.ANM_CUPID_IDLE_KEY, 0.3)
            .add(AnimationKey.ANM_CUPID_HIT_KEY, 4, 4, AnimationKey.ANM_CUPID_IDLE_KEY, 0.2)
            .add(AnimationKey.ANM_CUPID_DIE_KEY, 5, 5, AnimationKey.ANM_CUPID_DEAD_KEY, 0.3)
            .add(AnimationKey.ANM_CUPID_DEAD_KEY, 5, 5, AnimationKey.ANM_CUPID_DEAD_KEY, 0.1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "valentimon", AnimationSetKey.VALENTIMON_ANIMATION_KEY, 9, 64, 64)
            .add(AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0, 3, AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0.1)
            .add(AnimationKey.ANM_VALENTIMON_ATTACK_KEY, 3, 5, AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0.3)
            .add(AnimationKey.ANM_VALENTIMON_DIE_KEY, 4, 8, AnimationKey.ANM_VALENTIMON_DEAD_KEY, 0.2)
            .add(AnimationKey.ANM_VALENTIMON_DEAD_KEY, 8, 8, AnimationKey.ANM_VALENTIMON_DEAD_KEY, 1),
        // gfx animations
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "blast_animation", AnimationSetKey.FIREBALL_ANIMATION_KEY, 5, 60, 60)
            .add(AnimationKey.ANM_FIREBALL_FLY_KEY, 0, 0, AnimationKey.ANM_FIREBALL_FLY_KEY, 1)
            .add(AnimationKey.ANM_FIREBALL_HIT_KEY, 1, 4, AnimationKey.ANM_FIREBALL_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_FIREBALL_DONE_KEY, 4, 4, AnimationKey.ANM_FIREBALL_DONE_KEY, 1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "meteor_animation", AnimationSetKey.METEOR_ANIMATION_KEY, 5, 120, 120)
            .add(AnimationKey.ANM_METEOR_FLY_KEY, 0, 0, AnimationKey.ANM_METEOR_FLY_KEY, 1)
            .add(AnimationKey.ANM_METEOR_HIT_KEY, 1, 4, AnimationKey.ANM_METEOR_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_METEOR_DONE_KEY, 4, 4, AnimationKey.ANM_METEOR_DONE_KEY, 1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "bolt_animation", AnimationSetKey.ICEBOLT_ANIMATION_KEY, 5, 60, 60)
            .add(AnimationKey.ANM_ICEBOLT_FLY_KEY, 0, 0, AnimationKey.ANM_ICEBOLT_FLY_KEY, 1)
            .add(AnimationKey.ANM_ICEBOLT_HIT_KEY, 1, 4, AnimationKey.ANM_ICEBOLT_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_ICEBOLT_DONE_KEY, 4, 4, AnimationKey.ANM_ICEBOLT_DONE_KEY, 1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "loveletter_animation", AnimationSetKey.LOVELETTER_ANIMATION_KEY, 6, 32, 32)
            .add(AnimationKey.ANM_LOVELETTER_FLY_KEY, 0, 0, AnimationKey.ANM_LOVELETTER_FLY_KEY, 1)
            .add(AnimationKey.ANM_LOVELETTER_HIT_KEY, 1, 5, AnimationKey.ANM_LOVELETTER_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_LOVELETTER_DONE_KEY, 5, 5, AnimationKey.ANM_LOVELETTER_DONE_KEY, 1),
        new AnimationSetDefinition(SpritesheetKey.SPST_OBJECTS_KEY, "lovearrow_animation", AnimationSetKey.LOVEARROW_ANIMATION_KEY, 6, 32, 32)
            .add(AnimationKey.ANM_LOVEARROW_FLY_KEY, 0, 0, AnimationKey.ANM_LOVEARROW_FLY_KEY, 1)
            .add(AnimationKey.ANM_LOVEARROW_HIT_KEY, 1, 5, AnimationKey.ANM_LOVEARROW_DONE_KEY, 0.3)
            .add(AnimationKey.ANM_LOVEARROW_DONE_KEY, 5, 5, AnimationKey.ANM_LOVEARROW_DONE_KEY, 1),
    ]
}