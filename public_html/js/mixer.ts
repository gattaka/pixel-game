namespace Lich {
    export class Mixer {

        static play(id, loop: boolean = false, volume = 0.5) {
            var instance = createjs.Sound.play(id, {
                loop: loop ? -1 : 0
            });
            instance.volume = volume;
        }

    }
}