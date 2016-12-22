var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var MusicUI = (function (_super) {
        __extends(MusicUI, _super);
        function MusicUI() {
            var _this = this;
            _super.call(this, MusicUI.N, MusicUI.M);
            this.choosenItem = {};
            this.trackContent = [];
            this.trackIndex = {};
            this.reversedTrackIndex = [];
            this.itemsCont = new createjs.Container();
            this.itemHighlightShape = new createjs.Shape();
            var self = this;
            var trackInsert = function (track, volume) {
                var self = _this;
                var bitmap = Lich.Resources.getInstance().getBitmap(Lich.UIGFXKey[Lich.UIGFXKey.UI_SOUND_KEY]);
                self.itemsCont.addChild(bitmap);
                bitmap.x = self.trackContent.length * (Lich.Resources.PARTS_SIZE + Lich.PartsUI.SPACING);
                bitmap.y = 0;
                self.trackIndex[track] = self.trackContent.length;
                self.reversedTrackIndex[self.trackContent.length] = track;
                self.trackContent.push(bitmap);
                var hitArea = new createjs.Shape();
                hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
                bitmap.hitArea = hitArea;
                bitmap.on("mousedown", function () {
                    self.selectTrack(track, volume);
                }, null, false);
            };
            // zatím rovnou:
            trackInsert(Lich.MusicKey.MSC_DIRT_THEME_KEY, 0.3);
            trackInsert(Lich.MusicKey.MSC_BUILD_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_BOSS_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_KRYSTAL_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_FLOOD_THEME_KEY);
            trackInsert(Lich.MusicKey.MSC_LAVA_THEME_KEY);
            // zvýraznění vybrané položky
            self.itemHighlightShape = new Lich.Highlight();
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = Lich.AbstractUI.BORDER;
            self.itemsCont.y = Lich.AbstractUI.BORDER;
            self.addChild(self.itemsCont);
            var offset = 5;
            self.cache(-offset, -offset, self.width + offset * 2, self.height + offset * 2);
        }
        MusicUI.prototype.selectTrack = function (track, volume) {
            var self = this;
            var bitmap = self.trackContent[self.trackIndex[track]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - Lich.PartsUI.SELECT_BORDER + Lich.PartsUI.BORDER;
            self.choosenItem = track;
            for (var i = 0; i < self.reversedTrackIndex.length; i++) {
                Lich.Mixer.stopMusic(self.reversedTrackIndex[i]);
            }
            Lich.Mixer.playMusic(track, volume);
            self.updateCache();
        };
        MusicUI.N = 6;
        MusicUI.M = 1;
        return MusicUI;
    }(Lich.PartsUI));
    Lich.MusicUI = MusicUI;
})(Lich || (Lich = {}));
