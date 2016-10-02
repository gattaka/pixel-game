namespace Lich {
    export class Mixer {

        static instances = new Array<createjs.AbstractSoundInstance>();

        static playMusic(id: MusicKey, loop: boolean = false, volume = 0.5) {
            this.play(MusicKey[id], loop, volume);
        }

        static playSound(id: SoundKey, loop: boolean = false, volume = 0.5) {
            this.play(SoundKey[id], loop, volume);
        }

        private static play(id: string, loop: boolean, volume: number) {
            var instance: createjs.AbstractSoundInstance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
            this.instances[id] = instance;
        }

        static stop(id: SoundKey) {
            var instance = this.instances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                this.instances[id] == null;
            }
        }

    }
}