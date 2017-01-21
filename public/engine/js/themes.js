var Lich;
(function (Lich) {
    (function (Theme) {
        Theme[Theme["NORMAL"] = 0] = "NORMAL";
        Theme[Theme["VALENTINE"] = 1] = "VALENTINE";
        Theme[Theme["WINTER"] = 2] = "WINTER";
    })(Lich.Theme || (Lich.Theme = {}));
    var Theme = Lich.Theme;
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
