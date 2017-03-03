var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Lich;
(function (Lich) {
    var MusicUI = (function (_super) {
        __extends(MusicUI, _super);
        function MusicUI() {
            var _this = _super.call(this, MusicUI.N, MusicUI.M) || this;
            _this.choosenItem = {};
            _this.trackContent = [];
            _this.trackIndex = {};
            _this.reversedTrackIndex = [];
            _this.itemsCont = new PIXI.Container();
            var self = _this;
            var trackInsert = function (track, volume) {
                var self = _this;
                var sprite = Lich.Resources.getInstance().getUISprite(Lich.UISpriteKey.UI_SOUND_KEY);
                self.itemsCont.addChild(sprite);
                sprite.x = self.trackContent.length * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
                sprite.y = 0;
                self.trackIndex[track] = self.trackContent.length;
                self.reversedTrackIndex[self.trackContent.length] = track;
                self.trackContent.push(sprite);
                sprite.hitArea = new PIXI.Rectangle(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
                sprite.on("pointerdown", function () {
                    self.selectTrack(track, volume);
                });
            };
            // zatím rovnou:
            trackInsert(Lich.MusicKey.MSC_DIRT_THEME_KEY, 0.3);
            trackInsert(Lich.MusicKey.MSC_BUILD_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_BOSS_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_KRYSTAL_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_FLOOD_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_LAVA_THEME_KEY);
            // zvýraznění vybrané položky
            self.itemHighlight = new Lich.Highlight();
            self.itemHighlight.visible = false;
            self.addChild(self.itemHighlight);
            // kontejner položek
            self.itemsCont.x = Lich.AbstractUI.BORDER;
            self.itemsCont.y = Lich.AbstractUI.BORDER;
            self.addChild(self.itemsCont);
            return _this;
            // let offset = 5;
            // self.cache(-offset, -offset, self.width + offset * 2, self.height + offset * 2);
        }
        MusicUI.prototype.selectTrack = function (track, volume) {
            var self = this;
            var bitmap = self.trackContent[self.trackIndex[track]];
            self.itemHighlight.visible = true;
            self.itemHighlight.x = bitmap.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
            self.itemHighlight.y = bitmap.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
            self.choosenItem = track;
            for (var i = 0; i < self.reversedTrackIndex.length; i++) {
                Lich.Mixer.stopMusic(self.reversedTrackIndex[i]);
            }
            Lich.Mixer.playMusic(track, volume);
            // self.updateCache();
        };
        return MusicUI;
    }(Lich.PartsUI));
    MusicUI.N = 6;
    MusicUI.M = 1;
    Lich.MusicUI = MusicUI;
})(Lich || (Lich = {}));
