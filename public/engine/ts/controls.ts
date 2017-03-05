namespace Lich {

    export class Mouse {
        public static down: boolean;
        public static rightDown: boolean;
        public static clickChanged: boolean;
        public static y: number;
        public static x: number;

        private constructor() { };
    }

    class Key {
        public code: number;
        public isDown: boolean;
        public isUp: boolean;
    }

    export class Keyboard {

        private constructor() { };

        static on(keyCode: number, onPress: Function, onRelease?: Function) {
            var key = new Key;
            key.code = keyCode;
            key.isDown = false;
            key.isUp = true;

            //The `downHandler`
            let downHandler = function (event) {
                if (event.keyCode === key.code) {
                    if (key.isUp && onPress) onPress();
                    key.isDown = true;
                    key.isUp = false;
                }
                event.preventDefault();
            };

            //The `upHandler`
            let upHandler = function (event) {
                if (event.keyCode === key.code) {
                    if (key.isDown && onRelease) onRelease();
                    key.isDown = false;
                    key.isUp = true;
                }
                event.preventDefault();
            };

            //Attach event listeners
            window.addEventListener(
                "keydown", downHandler.bind(key), false
            );
            window.addEventListener(
                "keyup", upHandler.bind(key), false
            );
            return key;
        }
    }
}