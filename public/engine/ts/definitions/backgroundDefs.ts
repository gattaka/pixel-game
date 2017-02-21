namespace Lich {
    let tsf = ThemeWatch.getThemeSuffix();
    export let BACKGROUND_DEFS: Array<[string, BackgroundKey]> = [
        ["bgr_sky", BackgroundKey.BGR_SKY_KEY],
        ["bgr_far_mountain" + tsf, BackgroundKey.BGR_FAR_MOUNTAIN_KEY],
        ["bgr_mountain" + tsf, BackgroundKey.BGR_MOUNTAIN_KEY],
        ["bgr_dirt_back" + tsf, BackgroundKey.BGR_DIRT_BACK_KEY],
        ["bgr_dirt_back_start" + tsf, BackgroundKey.BGR_DIRT_BACK_START_KEY],
        ["bgr_woodland1" + tsf, BackgroundKey.BGR_WOODLAND1_KEY],
        ["bgr_woodland2" + tsf, BackgroundKey.BGR_WOODLAND2_KEY],
        ["bgr_woodland3" + tsf, BackgroundKey.BGR_WOODLAND3_KEY],
        ["bgr_woodland4" + tsf, BackgroundKey.BGR_WOODLAND4_KEY],
        ["bgr_cloud1", BackgroundKey.BGR_CLOUD1_KEY],
        ["bgr_cloud2", BackgroundKey.BGR_CLOUD2_KEY],
        ["bgr_cloud3", BackgroundKey.BGR_CLOUD3_KEY],
        ["bgr_cloud4", BackgroundKey.BGR_CLOUD4_KEY],
        ["bgr_cloud5", BackgroundKey.BGR_CLOUD5_KEY]
    ]
}