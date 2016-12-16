namespace Lich {
    let tsf = ThemeWatch.getThemeSuffix();
    export let BACKGROUND_PATHS: Array<[string, BackgroundKey]> = [
        ["images/background/sky.png", BackgroundKey.SKY_KEY],
        ["images/background/far_mountain" + tsf + ".png", BackgroundKey.FAR_MOUNTAIN_KEY],
        ["images/background/mountain" + tsf + ".png", BackgroundKey.MOUNTAIN_KEY],
        ["images/background/dirt_back" + tsf + ".png", BackgroundKey.DIRTBACK_KEY],
        ["images/background/darkness.png", BackgroundKey.DARKNESS_KEY],
        ["images/background/dirt_back_start" + tsf + ".png", BackgroundKey.DIRT_BACK_START_KEY],
        ["images/background/woodland1" + tsf + ".png", BackgroundKey.WOODLAND1_KEY],
        ["images/background/woodland2" + tsf + ".png", BackgroundKey.WOODLAND2_KEY],
        ["images/background/woodland3" + tsf + ".png", BackgroundKey.WOODLAND3_KEY],
        ["images/background/woodland4" + tsf + ".png", BackgroundKey.WOODLAND4_KEY],
        ["images/background/cloud1.png", BackgroundKey.CLOUD1_KEY],
        ["images/background/cloud1.png", BackgroundKey.CLOUD2_KEY],
        ["images/background/cloud1.png", BackgroundKey.CLOUD3_KEY],
        ["images/background/cloud1.png", BackgroundKey.CLOUD4_KEY],
        ["images/background/cloud1.png", BackgroundKey.CLOUD5_KEY]
    ]
}