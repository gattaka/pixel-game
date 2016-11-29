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
    var Animations = (function () {
        function Animations() {
            this.animations = Array();
        }
        Animations.prototype.add = function (animation, startFrame, endFrame, nextAnimation, time) {
            this.animations.push(new Animation(animation, startFrame, endFrame, nextAnimation, time));
            return this;
        };
        Animations.prototype.serialize = function () {
            var obj = {};
            this.animations.forEach(function (ani) {
                obj[ani.animation] = [ani.startFrame, ani.endFrame, ani.nextAnimation, ani.time];
            });
            return obj;
        };
        return Animations;
    }());
    Lich.Animations = Animations;
})(Lich || (Lich = {}));
