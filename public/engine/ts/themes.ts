namespace Lich {
    export enum Theme {
        NORMAL,
        WINTER
    }

    export class ThemeWatch {
        public static getCurrentTheme() {
            let loot: InventoryKey;
            let today = new Date();
            let mm = today.getMonth() + 1; // January is 0!
            // return Theme.NORMAL;
            switch (mm) {
                case 12:
                    return Theme.WINTER;
                default:
                    return Theme.NORMAL;
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