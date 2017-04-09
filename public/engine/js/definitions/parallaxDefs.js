var Lich;
(function (Lich) {
    var tsf = Lich.ThemeWatch.getThemeSuffix();
    Lich.PARALLAX_DEFS = [
        ["bgr_sky", Lich.ParallaxKey.PRLX_SKY_KEY, 0xf6fbfe],
        // ["bgr_far_mountain" + tsf, ParallaxKey.PRLX_FAR_MOUNTAIN_KEY],
        ["bgr_dirt_back" + tsf, Lich.ParallaxKey.PRLX_DIRT_BACK_KEY, 0],
        ["bgr_dirt_back_start" + tsf, Lich.ParallaxKey.PRLX_BGR_DIRT_BACK_START_KEY, 0],
        // ["bgr_mountain" + tsf, ParallaxKey.PRLX_MOUNTAIN_KEY],
        // ["bgr_woodland1" + tsf, ParallaxKey.PRLX_WOODLAND1_KEY],
        // ["bgr_woodland2" + tsf, ParallaxKey.PRLX_WOODLAND2_KEY],
        // ["bgr_woodland3" + tsf, ParallaxKey.PRLX_WOODLAND3_KEY],
        // ["bgr_woodland4" + tsf, ParallaxKey.PRLX_WOODLAND4_KEY],
        ["test4", Lich.ParallaxKey.PRLX_MOUNTAIN_KEY, 0xc6d1c6],
        ["test3", Lich.ParallaxKey.PRLX_WOODLAND1_KEY, 0x8fb88f],
        ["test2", Lich.ParallaxKey.PRLX_WOODLAND2_KEY, 0x449d44],
        ["test1", Lich.ParallaxKey.PRLX_WOODLAND3_KEY, 0x2d682d],
    ];
})(Lich || (Lich = {}));
