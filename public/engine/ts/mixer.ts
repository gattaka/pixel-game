namespace Lich {
    export class Mixer {

        static soundInstances = new Array<createjs.AbstractSoundInstance>();
        static musicInstances = new Array<createjs.AbstractSoundInstance>();

        static playMusic(id: MusicKey, volume = 0.5) {
            Mixer.musicInstances[id] = Mixer.play(MusicKey[id], true, volume);
        }

        static playSound(id: SoundKey, volume = 0.5) {
            Mixer.soundInstances[id] = Mixer.play(SoundKey[id], false, volume);
        }

        private static play(id: string, loop: boolean, volume: number): createjs.AbstractSoundInstance {
            var instance: createjs.AbstractSoundInstance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0,
                volume: volume
            });
            return instance;
        }

        static stopAllMusic() {
            Mixer.musicInstances.forEach((instance) => {
                instance.stop();
            });
            Mixer.musicInstances = new Array();
        }

        static stopAllSounds() {
            Mixer.soundInstances.forEach((instance) => {
                instance.stop();
            });
            Mixer.soundInstances = new Array();
        }

        static stopMusic(id: MusicKey) {
            var instance = Mixer.musicInstances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                Mixer.musicInstances[id] == null;
            }
        }

        static stopSound(id: SoundKey) {
            var instance = Mixer.soundInstances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                Mixer.soundInstances[id] == null;
            }
        }

    }
}