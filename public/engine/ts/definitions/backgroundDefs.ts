namespace Lich {
    let tsf = ThemeWatch.getThemeSuffix();
    export let BACKGROUND_PATHS: Array<[string, BackgroundKey]> = [
        ["bgr_sky", BackgroundKey.SKY_KEY],
        ["bgr_far_mountain" + tsf, BackgroundKey.FAR_MOUNTAIN_KEY],
        ["bgr_mountain" + tsf, BackgroundKey.MOUNTAIN_KEY],
        ["bgr_dirt_back" + tsf, BackgroundKey.DIRT_BACK_KEY],
        ["bgr_dirt_back_start" + tsf, BackgroundKey.DIRT_BACK_START_KEY],
        ["bgr_woodland1" + tsf, BackgroundKey.WOODLAND1_KEY],
        ["bgr_woodland2" + tsf, BackgroundKey.WOODLAND2_KEY],
        ["bgr_woodland3" + tsf, BackgroundKey.WOODLAND3_KEY],
        ["bgr_woodland4" + tsf, BackgroundKey.WOODLAND4_KEY],
        ["bgr_cloud1", BackgroundKey.CLOUD1_KEY],
        ["bgr_cloud1", BackgroundKey.CLOUD2_KEY],
        ["bgr_cloud1", BackgroundKey.CLOUD3_KEY],
        ["bgr_cloud1", BackgroundKey.CLOUD4_KEY],
        ["bgr_cloud1", BackgroundKey.CLOUD5_KEY]
    ]
}