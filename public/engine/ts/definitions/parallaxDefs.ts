namespace Lich {
    let tsf = ThemeWatch.getThemeSuffix();
    export let PARALLAX_DEFS: Array<[string, ParallaxKey]> = [
        ["bgr_sky", ParallaxKey.PRLX_SKY_KEY],
        ["bgr_far_mountain" + tsf, ParallaxKey.PRLX_FAR_MOUNTAIN_KEY],
        ["bgr_mountain" + tsf, ParallaxKey.PRLX_MOUNTAIN_KEY],
        ["bgr_dirt_back" + tsf, ParallaxKey.PRLX_DIRT_BACK_KEY],
        ["bgr_dirt_back_start" + tsf, ParallaxKey.PRLX_BGR_DIRT_BACK_START_KEY],
        ["bgr_woodland1" + tsf, ParallaxKey.PRLX_WOODLAND1_KEY],
        ["bgr_woodland2" + tsf, ParallaxKey.PRLX_WOODLAND2_KEY],
        ["bgr_woodland3" + tsf, ParallaxKey.PRLX_WOODLAND3_KEY],
        ["bgr_woodland4" + tsf, ParallaxKey.PRLX_WOODLAND4_KEY],
        ["bgr_cloud1", ParallaxKey.PRLX_CLOUD1_KEY],
        ["bgr_cloud2", ParallaxKey.PRLX_CLOUD2_KEY],
        ["bgr_cloud3", ParallaxKey.PRLX_CLOUD3_KEY],
        ["bgr_cloud4", ParallaxKey.PRLX_CLOUD4_KEY],
        ["bgr_cloud5", ParallaxKey.PRLX_CLOUD5_KEY]
    ]
}