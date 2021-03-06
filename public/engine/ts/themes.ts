namespace Lich {
    export enum Theme {
        NORMAL,
        VALENTINE,
        WINTER
    }

    export class ThemeWatch {
        public static getCurrentTheme() {
            let loot: InventoryKey;
            let today = new Date();
            let mm = today.getMonth() + 1; // January is 0!
            switch (mm) {
                case 12:
                    return Theme.WINTER;
                case 2:
                    return Theme.VALENTINE;
                default:
                    return Theme.VALENTINE;
            }
        }

        public static getThemeSuffix() {
            switch (ThemeWatch.getCurrentTheme()) {
                case Theme.WINTER: return "_winter";
                default: return "";
            }
        }
    }
}