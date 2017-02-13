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
    var AnimationDefinition = (function () {
        function AnimationDefinition(
            // klíč hlavního spritesheetu 
            spritesheetKey, 
            // jméno položky z hlavního spritesheetu
            subSpritesheetName, 
            // klíč sady animací
            animationSetKey, 
            // rozměry snímků animací
            width, height) {
            this.spritesheetKey = spritesheetKey;
            this.subSpritesheetName = subSpritesheetName;
            this.animationSetKey = animationSetKey;
            this.width = width;
            this.height = height;
            this.animations = Array();
        }
        AnimationDefinition.prototype.add = function (animation, startFrame, endFrame, nextAnimation, time) {
            this.animations.push(new Animation(animation, startFrame, endFrame, nextAnimation, time));
            return this;
        };
        AnimationDefinition.prototype.serialize = function () {
            var obj = {};
            this.animations.forEach(function (ani) {
                obj[ani.animation] = [ani.startFrame, ani.endFrame, ani.nextAnimation, ani.time];
            });
            return obj;
        };
        return AnimationDefinition;
    }());
    Lich.AnimationDefinition = AnimationDefinition;
    Lich.ANIMATION_DEFS = [
        // characters
        new AnimationDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "lich_animation", Lich.AnimationSetKey.LICH_ANIMATION_KEY, 56, 80)
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
        new AnimationDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "bunny", Lich.AnimationSetKey.BUNNY_ANIMATION_KEY, 32, 32)
            .add(Lich.AnimationKey.ANM_BUNNY_EATL_KEY, 6, 7, Lich.AnimationKey.ANM_BUNNY_EATL_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_BUNNY_IDLEL_KEY, 11, 11, Lich.AnimationKey.ANM_BUNNY_IDLEL_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY, 8, 11, Lich.AnimationKey.ANM_BUNNY_JUMPL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_WALKL_KEY, 8, 11, Lich.AnimationKey.ANM_BUNNY_WALKL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_WALKR_KEY, 0, 3, Lich.AnimationKey.ANM_BUNNY_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_JUMPR_KEY, 0, 3, Lich.AnimationKey.ANM_BUNNY_JUMPR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_BUNNY_IDLER_KEY, 0, 0, Lich.AnimationKey.ANM_BUNNY_IDLER_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_BUNNY_EATR_KEY, 4, 5, Lich.AnimationKey.ANM_BUNNY_EATR_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_BUNNY_DIE_KEY, 12, 12, Lich.AnimationKey.ANM_BUNNY_DIE_KEY, 0.1),
        new AnimationDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "chicken", Lich.AnimationSetKey.CHICKEN_ANIMATION_KEY, 26, 26)
            .add(Lich.AnimationKey.ANM_CHICKEN_EATL_KEY, 0, 1, Lich.AnimationKey.ANM_CHICKEN_EATL_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_CHICKEN_IDLEL_KEY, 2, 2, Lich.AnimationKey.ANM_CHICKEN_IDLEL_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_CHICKEN_JUMPL_KEY, 3, 3, Lich.AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_WALKL_KEY, 3, 6, Lich.AnimationKey.ANM_CHICKEN_WALKL_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_WALKR_KEY, 7, 10, Lich.AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_JUMPR_KEY, 10, 10, Lich.AnimationKey.ANM_CHICKEN_WALKR_KEY, 0.2)
            .add(Lich.AnimationKey.ANM_CHICKEN_IDLER_KEY, 11, 11, Lich.AnimationKey.ANM_CHICKEN_IDLER_KEY, 0.001)
            .add(Lich.AnimationKey.ANM_CHICKEN_EATR_KEY, 12, 13, Lich.AnimationKey.ANM_CHICKEN_EATR_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_CHICKEN_DIE_KEY, 14, 14, Lich.AnimationKey.ANM_CHICKEN_DIE_KEY, 0.1),
        new AnimationDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "corpse_animation", Lich.AnimationSetKey.CORPSE_ANIMATION_KEY, 56, 80)
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
        new AnimationDefinition(Lich.SpritesheetKey.SPST_OBJECTS_KEY, "chicken_boss", Lich.AnimationSetKey.CHICKEN_BOSS_ANIMATION_KEY, 184, 304)
            .add(Lich.AnimationKey.ANM_MURHUN_IDLE_KEY, 1, 1, Lich.AnimationKey.ANM_MURHUN_IDLE_KEY, 0.1)
            .add(Lich.AnimationKey.ANM_MURHUN_ATTACK_KEY, 0, 0, Lich.AnimationKey.ANM_MURHUN_ATTACK_KEY, 0.1),
        ["hellhound", Lich.AnimationSetKey.HELLHOUND_ANIMATION_KEY],
        ["valentimon", Lich.AnimationSetKey.VALENTIMON_ANIMATION_KEY],
        ["cupid", Lich.AnimationSetKey.CUPID_ANIMATION_KEY],
        // gfx animations
        ["meteor_animation", Lich.AnimationSetKey.METEOR_ANIMATION_KEY],
        ["blast_animation", Lich.AnimationSetKey.FIREBALL_ANIMATION_KEY],
        ["bolt_animation", Lich.AnimationSetKey.BOLT_ANIMATION_KEY],
        ["loveletter_animation", Lich.AnimationSetKey.LOVELETTER_ANIMATION_KEY],
        ["lovearrow_animation", Lich.AnimationSetKey.LOVEARROW_ANIMATION_KEY]
    ];
})(Lich || (Lich = {}));
