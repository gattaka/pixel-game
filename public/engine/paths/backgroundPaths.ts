namespace Lich {
    export let CLOUDS_BGR_NUMBER = 5;
    export let WOODLAND_BGR_NUMBER = 4;

    export let BACKGROUND_PATHS: Array<[string, BackgroundKey]> = [
        ["images/background/sky.png", BackgroundKey.SKY_KEY],
        ["images/background/far_mountain.png", BackgroundKey.FAR_MOUNTAIN_KEY],
        ["images/background/mountain.png", BackgroundKey.MOUNTAIN_KEY],
        ["images/background/dirt_back.png", BackgroundKey.DIRTBACK_KEY],
        ["images/background/darkness.png", BackgroundKey.DARKNESS_KEY],
        ["images/background/dirt_back_start.png", BackgroundKey.DIRT_BACK_START_KEY]
    ]

    export let BACKGROUND_SETS_PATHS: Array<[string, string]> = [];

    (function () {
        for (var i = 1; i <= CLOUDS_BGR_NUMBER; i++) {
            BACKGROUND_SETS_PATHS.push(["images/background/cloud" + i + ".png", BackgroundKey[BackgroundKey.CLOUD_KEY] + i]);
        }
        for (var i = 1; i <= WOODLAND_BGR_NUMBER; i++) {
            BACKGROUND_SETS_PATHS.push(["images/background/woodland" + i + ".png", BackgroundKey[BackgroundKey.WOODLAND_KEY] + i]);
        }
    })();
}