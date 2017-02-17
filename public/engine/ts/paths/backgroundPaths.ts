namespace Lich {
    let tsf = ThemeWatch.getThemeSuffix();
    export let BACKGROUND_PATHS: Array<[string, BackgroundKey]> = [
        ["bgr_sky.png", BackgroundKey.SKY_KEY],
        ["bgr_far_mountain" + tsf + ".png", BackgroundKey.FAR_MOUNTAIN_KEY],
        ["bgr_mountain" + tsf + ".png", BackgroundKey.MOUNTAIN_KEY],
        ["bgr_dirt_back" + tsf + ".png", BackgroundKey.DIRTBACK_KEY],
        ["bgr_darkness.png", BackgroundKey.DARKNESS_KEY],
        ["bgr_dirt_back_start" + tsf + ".png", BackgroundKey.DIRT_BACK_START_KEY],
        ["bgr_woodland1" + tsf + ".png", BackgroundKey.WOODLAND1_KEY],
        ["bgr_woodland2" + tsf + ".png", BackgroundKey.WOODLAND2_KEY],
        ["bgr_woodland3" + tsf + ".png", BackgroundKey.WOODLAND3_KEY],
        ["bgr_woodland4" + tsf + ".png", BackgroundKey.WOODLAND4_KEY],
        ["bgr_cloud1.png", BackgroundKey.CLOUD1_KEY],
        ["bgr_cloud1.png", BackgroundKey.CLOUD2_KEY],
        ["bgr_cloud1.png", BackgroundKey.CLOUD3_KEY],
        ["bgr_cloud1.png", BackgroundKey.CLOUD4_KEY],
        ["bgr_cloud1.png", BackgroundKey.CLOUD5_KEY]
    ]
}