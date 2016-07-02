var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var MusicUI = (function (_super) {
        __extends(MusicUI, _super);
        function MusicUI(game) {
            _super.call(this, MusicUI.n * Lich.Resources.PARTS_SIZE + (MusicUI.n - 1) * (Lich.UIPart.SPACING) + 2 * Lich.UIPart.BORDER, Lich.Resources.PARTS_SIZE + 2 * Lich.UIPart.BORDER);
            this.game = game;
            this.choosenItem = {};
            this.trackContent = [];
            this.trackIndex = {};
            this.reversedTrackIndex = [];
            this.itemsCont = new createjs.Container();
            this.itemHighlightShape = new createjs.Shape();
            var self = this;
            // zatím rovnou:
            self.trackInsert(Lich.Resources.MSC_DIRT_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_BUILD_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_BOSS_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_KRYSTAL_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_FLOOD_THEME_KEY);
            self.trackInsert(Lich.Resources.MSC_LAVA_THEME_KEY);
            self.selectTrack(Lich.Resources.MSC_DIRT_THEME_KEY);
            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Lich.Resources.PARTS_SIZE + Lich.UIPart.SELECT_BORDER * 2, Lich.Resources.PARTS_SIZE
                + Lich.UIPart.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);
            // kontejner položek
            self.itemsCont.x = Lich.UIPart.BORDER;
            self.itemsCont.y = Lich.UIPart.BORDER;
            self.addChild(self.itemsCont);
        }
        MusicUI.prototype.selectTrack = function (track) {
            var self = this;
            var bitmap = self.trackContent[self.trackIndex[track]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - Lich.UIPart.SELECT_BORDER + Lich.UIPart.BORDER;
            self.itemHighlightShape.y = bitmap.y - Lich.UIPart.SELECT_BORDER + Lich.UIPart.BORDER;
            self.choosenItem = track;
            for (var i = 0; i < self.reversedTrackIndex.length; i++) {
                if (self.reversedTrackIndex[i] != track) {
                    Lich.Mixer.stop(self.reversedTrackIndex[i]);
                }
            }
            Lich.Mixer.play(track, true);
        };
        MusicUI.prototype.trackInsert = function (track) {
            var self = this;
            var bitmap = self.game.resources.getBitmap(Lich.Resources.UI_SOUND_KEY);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.trackContent.length * (Lich.Resources.PARTS_SIZE + Lich.UIPart.SPACING);
            bitmap.y = 0;
            self.trackIndex[track] = self.trackContent.length;
            self.reversedTrackIndex[self.trackContent.length] = track;
            self.trackContent.push(bitmap);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Lich.Resources.PARTS_SIZE, Lich.Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;
            bitmap.on("mousedown", function () {
                self.selectTrack(track);
            }, null, false);
        };
        MusicUI.n = 6;
        return MusicUI;
    }(Lich.UIPart));
    Lich.MusicUI = MusicUI;
})(Lich || (Lich = {}));
