var Lich;
(function (Lich) {
    (function (Theme) {
        Theme[Theme["NORMAL"] = 0] = "NORMAL";
        Theme[Theme["WINTER"] = 1] = "WINTER";
    })(Lich.Theme || (Lich.Theme = {}));
    var Theme = Lich.Theme;
    var ThemeWatch = (function () {
        function ThemeWatch() {
        }
        ThemeWatch.getCurrentTheme = function () {
            var loot;
            var today = new Date();
            var mm = today.getMonth() + 1; // January is 0!
            // return Theme.NORMAL;
            switch (mm) {
                case 12:
                    return Theme.WINTER;
                default:
                    return Theme.NORMAL;
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
