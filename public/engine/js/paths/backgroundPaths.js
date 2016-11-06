var Lich;
(function (Lich) {
    Lich.CLOUDS_BGR_NUMBER = 5;
    Lich.WOODLAND_BGR_NUMBER = 4;
    Lich.BACKGROUND_PATHS = [
        ["images/background/sky.png", Lich.BackgroundKey.SKY_KEY],
        ["images/background/far_mountain.png", Lich.BackgroundKey.FAR_MOUNTAIN_KEY],
        ["images/background/mountain.png", Lich.BackgroundKey.MOUNTAIN_KEY],
        ["images/background/dirt_back.png", Lich.BackgroundKey.DIRTBACK_KEY],
        ["images/background/darkness.png", Lich.BackgroundKey.DARKNESS_KEY],
        ["images/background/dirt_back_start.png", Lich.BackgroundKey.DIRT_BACK_START_KEY]
    ];
    Lich.BACKGROUND_SETS_PATHS = [];
    (function () {
        for (var i = 1; i <= Lich.CLOUDS_BGR_NUMBER; i++) {
            Lich.BACKGROUND_SETS_PATHS.push(["images/background/cloud" + i + ".png", Lich.BackgroundKey[Lich.BackgroundKey.CLOUD_KEY] + i]);
        }
        for (var i = 1; i <= Lich.WOODLAND_BGR_NUMBER; i++) {
            Lich.BACKGROUND_SETS_PATHS.push(["images/background/woodland" + i + ".png", Lich.BackgroundKey[Lich.BackgroundKey.WOODLAND_KEY] + i]);
        }
    })();
})(Lich || (Lich = {}));
