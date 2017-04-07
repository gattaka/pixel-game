var Lich;
(function (Lich) {
    var Theme;
    (function (Theme) {
        Theme[Theme["NORMAL"] = 0] = "NORMAL";
        Theme[Theme["VALENTINE"] = 1] = "VALENTINE";
        Theme[Theme["WINTER"] = 2] = "WINTER";
        Theme[Theme["EASTER"] = 3] = "EASTER";
    })(Theme = Lich.Theme || (Lich.Theme = {}));
    var ThemeWatch = (function () {
        function ThemeWatch() {
        }
        ThemeWatch.getCurrentTheme = function () {
            var loot;
            var today = new Date();
            var mm = today.getMonth() + 1; // January is 0!
            switch (mm) {
                case 12:
                    return Theme.WINTER;
                case 2:
                    return Theme.VALENTINE;
                case 4:
                    return Theme.EASTER;
                default:
                    return Theme.VALENTINE;
            }
        };
        ThemeWatch.getThemeSuffix = function () {
            switch (ThemeWatch.getCurrentTheme()) {
                case Theme.WINTER: return "_winter";
                default: return "";
            }
        };
        return ThemeWatch;
    }());
    Lich.ThemeWatch = ThemeWatch;
})(Lich || (Lich = {}));
