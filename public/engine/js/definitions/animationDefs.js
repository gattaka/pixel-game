var Lich;
(function (Lich) {
    var Animation = (function () {
        function Animation(animation, startFrame, endFrame, nextAnimation, time) {
            this.animation = animation;
            this.startFrame = startFrame;
            this.endFrame = endFrame;
            this.nextAnimation = nextAnimation;
            this.time = time;
        }
        return Animation;
    }());
    var AnimationSetDefinition = (function () {
        function AnimationSetDefinition(
            // klíč hlavního spritesheetu 
            spritesheetKey, 
            // jméno položky z hlavního spritesheetu
            subSpritesheetName, 
            // klíč sady animací
            animationSetKey, 
            // počet snímků
            frames, 
            // rozměry snímků animací
            width, height) {
            this.spritesheetKey = spritesheetKey;
            this.subSpritesheetName = subSpritesheetName;
            this.animationSetKey = animationSetKey;
            this.frames = frames;
            this.width = width;
            this.height = height;
            this.animations = Array();
        }
        AnimationSetDefinition.prototype.add = function (animation, startFrame, endFrame, nextAnimation, time) {
            this.animations.push(new Animation(animation, startFrame, endFrame, nextAnimation, time));
            return this;
        };
        AnimationSetDefinition.prototype.serialize = function () {
            var obj = {};
            this.animations.forEach(function (ani) {
                obj[ani.animation] = [ani.startFrame, ani.endFrame, ani.nextAnimation, ani.time];
            });
            return obj;
        };
        return AnimationSetDefinition;
    }());
    Lich.AnimationSetDefinition = AnimationSetDefinition;
    Lich.ANIMATION_DEFS = [
        // characters
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "lich_animation", Lich.AnimationSetKey.LICH_ANIMATION_KEY, 40, 56, 80)
            .add(Lich.AnimationKey.ANM_HERO_IDLE_KEY, 0, 0, Lich.AnimationKey.ANM_HERO_BREATH_KEY, 0.005)
            .add(Lich.AnimationKey.ANM_HERO_BREATH_KEY, 1, 1, Lich.AnimationKey.ANM_HERO_IDLE_KEY, 0.04)
            .add(Lich.AnimationKey.ANM_HERO_WALKR_KEY, 2, 9, Lich.AnimationKey.ANM_HERO_WALKR_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_HERO_WALKL_KEY, 10, 17, Lich.AnimationKey.ANM_HERO_WALKL_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_HERO_JUMP_KEY, 18, 19, Lich.AnimationKey.ANM_HERO_MIDAIR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_MIDAIR_KEY, 19, 19, Lich.AnimationKey.ANM_HERO_MIDAIR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_FALL_KEY, 19, 23, Lich.AnimationKey.ANM_HERO_IDLE_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_JUMPR_KEY, 25, 25, Lich.AnimationKey.ANM_HERO_JUMPR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_JUMPL_KEY, 27, 27, Lich.AnimationKey.ANM_HERO_JUMPL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_DIE_KEY, 28, 28, Lich.AnimationKey.ANM_HERO_DEAD_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_DEAD_KEY, 29, 29, Lich.AnimationKey.ANM_HERO_DEAD_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_TELEPORT_KEY, 30, 36, Lich.AnimationKey.ANM_HERO_IDLE_KEY, 1.0)
            .add(Lich.AnimationKey.ANM_HERO_CLIMB_KEY, 37, 39, Lich.AnimationKey.ANM_HERO_CLIMB_KEY, 0.3),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "bunny", Lich.AnimationSetKey.BUNNY_ANIMATION_KEY, 13, 32, 32)
            .add(Lich.AnimationKey.ANM_BUNNY_EATL_KEY, 6, 7, Lich.AnimationKey.ANM_BUNNY_EATL_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_BUNNY_IDLEL_KEY, 11, 11, Lich.AnimationKey.ANM_BUNNY_IDLEL_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY, 8, 11, Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_WALKL_KEY, 8, 11, Lich.AnimationKey.ANM_BUNNY_WALKL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_WALKR_KEY, 0, 3, Lich.AnimationKey.ANM_BUNNY_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_JUMPR_KEY, 0, 3, Lich.AnimationKey.ANM_BUNNY_JUMPR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_IDLER_KEY, 0, 0, Lich.AnimationKey.ANM_BUNNY_IDLER_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_BUNNY_EATR_KEY, 4, 5, Lich.AnimationKey.ANM_BUNNY_EATR_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_BUNNY_DIE_KEY, 12, 12, Lich.AnimationKey.ANM_BUNNY_DIE_KEY, 0.1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "chicken", Lich.AnimationSetKey.CHICKEN_ANIMATION_KEY, 15, 26, 26)
            .add(Lich.AnimationKey.ANM_CHICKEN_EATL_KEY, 0, 1, Lich.AnimationKey.ANM_CHICKEN_EATL_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_CHICKEN_IDLEL_KEY, 2, 2, Lich.AnimationKey.ANM_CHICKEN_IDLEL_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_CHICKEN_JUMPL_KEY, 3, 3, Lich.AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_WALKL_KEY, 3, 6, Lich.AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_WALKR_KEY, 7, 10, Lich.AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_JUMPR_KEY, 10, 10, Lich.AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_IDLER_KEY, 11, 11, Lich.AnimationKey.ANM_CHICKEN_IDLER_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_CHICKEN_EATR_KEY, 12, 13, Lich.AnimationKey.ANM_CHICKEN_EATR_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_CHICKEN_DIE_KEY, 14, 14, Lich.AnimationKey.ANM_CHICKEN_DIE_KEY, 0.1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "corpse_animation", Lich.AnimationSetKey.CORPSE_ANIMATION_KEY, 30, 56, 80)
            .add(Lich.AnimationKey.ANM_HERO_IDLE_KEY, 0, 0, Lich.AnimationKey.ANM_HERO_BREATH_KEY, 0.005)
            .add(Lich.AnimationKey.ANM_HERO_BREATH_KEY, 1, 1, Lich.AnimationKey.ANM_HERO_IDLE_KEY, 0.04)
            .add(Lich.AnimationKey.ANM_HERO_WALKR_KEY, 2, 9, Lich.AnimationKey.ANM_HERO_WALKR_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_HERO_WALKL_KEY, 10, 17, Lich.AnimationKey.ANM_HERO_WALKL_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_HERO_JUMP_KEY, 18, 19, Lich.AnimationKey.ANM_HERO_MIDAIR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_MIDAIR_KEY, 19, 19, Lich.AnimationKey.ANM_HERO_MIDAIR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_FALL_KEY, 19, 23, Lich.AnimationKey.ANM_HERO_IDLE_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_JUMPR_KEY, 25, 25, Lich.AnimationKey.ANM_HERO_JUMPR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_JUMPL_KEY, 27, 27, Lich.AnimationKey.ANM_HERO_JUMPL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_DIE_KEY, 28, 28, Lich.AnimationKey.ANM_HERO_DEAD_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HERO_DEAD_KEY, 29, 29, Lich.AnimationKey.ANM_HERO_DEAD_KEY, 0.2),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "chicken_boss", Lich.AnimationSetKey.CHICKEN_BOSS_ANIMATION_KEY, 2, 184, 304)
            .add(Lich.AnimationKey.ANM_MURHUN_IDLE_KEY, 1, 1, Lich.AnimationKey.ANM_MURHUN_IDLE_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_MURHUN_ATTACK_KEY, 0, 0, Lich.AnimationKey.ANM_MURHUN_ATTACK_KEY, 0.1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "hellhound", Lich.AnimationSetKey.HELLHOUND_ANIMATION_KEY, 25, 128, 86)
            .add(Lich.AnimationKey.ANM_HELLHOUND_IDLE_KEY, 22, 24, Lich.AnimationKey.ANM_HELLHOUND_IDLE_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_HELLHOUND_WALKR_KEY, 5, 9, Lich.AnimationKey.ANM_HELLHOUND_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0, 4, Lich.AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HELLHOUND_JUMPR_KEY, 16, 21, Lich.AnimationKey.ANM_HELLHOUND_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_HELLHOUND_JUMPL_KEY, 10, 15, Lich.AnimationKey.ANM_HELLHOUND_WALKL_KEY, 0.2),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "cupid", Lich.AnimationSetKey.CUPID_ANIMATION_KEY, 6, 256, 320)
            .add(Lich.AnimationKey.ANM_CUPID_IDLE_KEY, 0, 1, Lich.AnimationKey.ANM_CUPID_IDLE_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_CUPID_ATTACK_KEY, 2, 3, Lich.AnimationKey.ANM_CUPID_IDLE_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_CUPID_HIT_KEY, 4, 4, Lich.AnimationKey.ANM_CUPID_IDLE_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CUPID_DIE_KEY, 5, 5, Lich.AnimationKey.ANM_CUPID_DEAD_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_CUPID_DEAD_KEY, 5, 5, Lich.AnimationKey.ANM_CUPID_DEAD_KEY, 0.1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "valentimon", Lich.AnimationSetKey.VALENTIMON_ANIMATION_KEY, 9, 64, 64)
            .add(Lich.AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0, 3, Lich.AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_VALENTIMON_ATTACK_KEY, 3, 5, Lich.AnimationKey.ANM_VALENTIMON_IDLE_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_VALENTIMON_DIE_KEY, 4, 8, Lich.AnimationKey.ANM_VALENTIMON_DEAD_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_VALENTIMON_DEAD_KEY, 8, 8, Lich.AnimationKey.ANM_VALENTIMON_DEAD_KEY, 1),
        // gfx animations
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "blast_animation", Lich.AnimationSetKey.FIREBALL_ANIMATION_KEY, 5, 60, 60)
            .add(Lich.AnimationKey.ANM_FIREBALL_FLY_KEY, 0, 0, Lich.AnimationKey.ANM_FIREBALL_FLY_KEY, 1)
            .add(Lich.AnimationKey.ANM_FIREBALL_HIT_KEY, 1, 4, Lich.AnimationKey.ANM_FIREBALL_DONE_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_FIREBALL_DONE_KEY, 4, 4, Lich.AnimationKey.ANM_FIREBALL_DONE_KEY, 1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "meteor_animation", Lich.AnimationSetKey.METEOR_ANIMATION_KEY, 5, 120, 120)
            .add(Lich.AnimationKey.ANM_METEOR_FLY_KEY, 0, 0, Lich.AnimationKey.ANM_METEOR_FLY_KEY, 1)
            .add(Lich.AnimationKey.ANM_METEOR_HIT_KEY, 1, 4, Lich.AnimationKey.ANM_METEOR_DONE_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_METEOR_DONE_KEY, 4, 4, Lich.AnimationKey.ANM_METEOR_DONE_KEY, 1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "bolt_animation", Lich.AnimationSetKey.ICEBOLT_ANIMATION_KEY, 5, 60, 60)
            .add(Lich.AnimationKey.ANM_ICEBOLT_FLY_KEY, 0, 0, Lich.AnimationKey.ANM_ICEBOLT_FLY_KEY, 1)
            .add(Lich.AnimationKey.ANM_ICEBOLT_HIT_KEY, 1, 4, Lich.AnimationKey.ANM_ICEBOLT_DONE_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_ICEBOLT_DONE_KEY, 4, 4, Lich.AnimationKey.ANM_ICEBOLT_DONE_KEY, 1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "loveletter_animation", Lich.AnimationSetKey.LOVELETTER_ANIMATION_KEY, 6, 32, 32)
            .add(Lich.AnimationKey.ANM_LOVELETTER_FLY_KEY, 0, 0, Lich.AnimationKey.ANM_LOVELETTER_FLY_KEY, 1)
            .add(Lich.AnimationKey.ANM_LOVELETTER_HIT_KEY, 1, 5, Lich.AnimationKey.ANM_LOVELETTER_DONE_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_LOVELETTER_DONE_KEY, 5, 5, Lich.AnimationKey.ANM_LOVELETTER_DONE_KEY, 1),
        new AnimationSetDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "lovearrow_animation", Lich.AnimationSetKey.LOVEARROW_ANIMATION_KEY, 6, 32, 32)
            .add(Lich.AnimationKey.ANM_LOVEARROW_FLY_KEY, 0, 0, Lich.AnimationKey.ANM_LOVEARROW_FLY_KEY, 1)
            .add(Lich.AnimationKey.ANM_LOVEARROW_HIT_KEY, 1, 5, Lich.AnimationKey.ANM_LOVEARROW_DONE_KEY, 0.3)
            .add(Lich.AnimationKey.ANM_LOVEARROW_DONE_KEY, 5, 5, Lich.AnimationKey.ANM_LOVEARROW_DONE_KEY, 1),
    ];
})(Lich || (Lich = {}));
