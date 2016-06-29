var Lich;
(function (Lich) {
    var Mixer = (function () {
        function Mixer() {
        }
        Mixer.play = function (id, loop, volume) {
            if (loop === void 0) { loop = false; }
            if (volume === void 0) { volume = 0.5; }
            var instance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
        };
        return Mixer;
    }());
    Lich.Mixer = Mixer;
})(Lich || (Lich = {}));
