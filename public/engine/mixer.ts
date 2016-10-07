namespace Lich {
    export class Mixer {

        static instances = new Array<createjs.AbstractSoundInstance>();

        static playMusic(id: MusicKey, loop: boolean = false, volume = 0.5) {
            Mixer.play(MusicKey[id], loop, volume);
        }

        static playSound(id: SoundKey, loop: boolean = false, volume = 0.5) {
            Mixer.play(SoundKey[id], loop, volume);
        }

        private static play(id: string, loop: boolean, volume: number) {
            var instance: createjs.AbstractSoundInstance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
            Mixer.instances[id] = instance;
        }

        static stopAll() {
            Mixer.instances.forEach((instance) => {
                instance.stop();
            });
            Mixer.instances = new Array();
            createjs.Sound.stop();
        }

        static stop(id: SoundKey) {
            var instance = Mixer.instances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                Mixer.instances[id] == null;
            }
        }

    }
}