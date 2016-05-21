var Lich;
(function (Lich) {
    var Mixer = (function () {
        function Mixer() {
        }
        Mixer.play = function (id, loop) {
            if (loop === void 0) { loop = false; }
            var instance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = 0.5;
        };
        return Mixer;
    }());
    Lich.Mixer = Mixer;
})(Lich || (Lich = {}));
