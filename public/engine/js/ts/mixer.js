var Lich;
(function (Lich) {
    var Mixer = (function () {
        function Mixer() {
        }
        Mixer.playMusic = function (id, volume) {
            if (volume === void 0) { volume = 0.5; }
            Mixer.musicInstances[id] = Mixer.play(Lich.MusicKey[id], true, volume);
        };
        Mixer.playSound = function (id, volume) {
            if (volume === void 0) { volume = 0.5; }
            Mixer.soundInstances[id] = Mixer.play(Lich.SoundKey[id], false, volume);
        };
        Mixer.play = function (id, loop, volume) {
            var instance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
            return instance;
        };
        Mixer.stopAllMusic = function () {
            Mixer.musicInstances.forEach(function (instance) {
                instance.stop();
            });
            Mixer.musicInstances = new Array();
        };
        Mixer.stopAllSounds = function () {
            Mixer.soundInstances.forEach(function (instance) {
                instance.stop();
            });
            Mixer.soundInstances = new Array();
        };
        Mixer.stopMusic = function (id) {
            var instance = Mixer.musicInstances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                Mixer.musicInstances[id] == null;
            }
        };
        Mixer.stopSound = function (id) {
            var instance = Mixer.soundInstances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                Mixer.soundInstances[id] == null;
            }
        };
        Mixer.soundInstances = new Array();
        Mixer.musicInstances = new Array();
        return Mixer;
    }());
    Lich.Mixer = Mixer;
})(Lich || (Lich = {}));
