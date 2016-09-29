var Lich;
(function (Lich) {
    var Mixer = (function () {
        function Mixer() {
        }
        Mixer.playMusic = function (id, loop, volume) {
            if (loop === void 0) { loop = false; }
            if (volume === void 0) { volume = 0.5; }
            this.play(Lich.MusicKey[id], loop, volume);
        };
        Mixer.playSound = function (id, loop, volume) {
            if (loop === void 0) { loop = false; }
            if (volume === void 0) { volume = 0.5; }
            this.play(Lich.SoundKey[id], loop, volume);
        };
        Mixer.play = function (id, loop, volume) {
            var instance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
            this.instances[id] = instance;
        };
        Mixer.stop = function (id) {
            var instance = this.instances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                this.instances[id] == null;
            }
        };
        Mixer.instances = new Array();
        return Mixer;
    }());
    Lich.Mixer = Mixer;
})(Lich || (Lich = {}));
