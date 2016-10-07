var Lich;
(function (Lich) {
    var Mixer = (function () {
        function Mixer() {
        }
        Mixer.playMusic = function (id, loop, volume) {
            if (loop === void 0) { loop = false; }
            if (volume === void 0) { volume = 0.5; }
            Mixer.play(Lich.MusicKey[id], loop, volume);
        };
        Mixer.playSound = function (id, loop, volume) {
            if (loop === void 0) { loop = false; }
            if (volume === void 0) { volume = 0.5; }
            Mixer.play(Lich.SoundKey[id], loop, volume);
        };
        Mixer.play = function (id, loop, volume) {
            var instance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
            Mixer.instances[id] = instance;
        };
        Mixer.stopAll = function () {
            Mixer.instances.forEach(function (instance) {
                instance.stop();
            });
            Mixer.instances = new Array();
            createjs.Sound.stop();
        };
        Mixer.stop = function (id) {
            var instance = Mixer.instances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                Mixer.instances[id] == null;
            }
        };
        Mixer.instances = new Array();
        return Mixer;
    }());
    Lich.Mixer = Mixer;
})(Lich || (Lich = {}));
