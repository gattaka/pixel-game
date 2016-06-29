namespace Lich {
    export class Mixer {

        static instances = new Array<createjs.AbstractSoundInstance>();

        static play(id, loop: boolean = false, volume = 0.5) {
            var instance: createjs.AbstractSoundInstance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
            this.instances[id] = instance;
        }

        static stop(id) {
            var instance = this.instances[id];
            if (typeof instance !== "undefined" && instance != null) {
                instance.stop();
                this.instances[id] == null;
            }
        }

    }
}