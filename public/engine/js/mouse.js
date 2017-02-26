var Lich;
(function (Lich) {
    var Mouse = (function () {
        function Mouse() {
        }
        return Mouse;
    }());
    Lich.Mouse = Mouse;
    var Key = (function () {
        function Key() {
        }
        return Key;
    }());
    var Keyboard = (function () {
        function Keyboard() {
        }
        Keyboard.prototype.static = function (keyCode, onPress, onRelease) {
            var key = new Key;
            key.code = keyCode;
            key.isDown = false;
            key.isUp = true;
            //The `downHandler`
            key.downHandler = function (event) {
                if (event.keyCode === key.code) {
                    if (key.isUp && key.onPress)
                        key.onPress();
                    key.isDown = true;
                    key.isUp = false;
                }
                event.preventDefault();
            };
            //The `upHandler`
            key.upHandler = function (event) {
                if (event.keyCode === key.code) {
                    if (key.isDown && key.onRelease)
                        key.onRelease();
                    key.isDown = false;
                    key.isUp = true;
                }
                event.preventDefault();
            };
            //Attach event listeners
            window.addEventListener("keydown", key.downHandler.bind(key), false);
            window.addEventListener("keyup", key.upHandler.bind(key), false);
            return key;
        };
        return Keyboard;
    }());
    Lich.Keyboard = Keyboard;
})(Lich || (Lich = {}));
