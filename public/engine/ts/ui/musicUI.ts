namespace Lich {

    export class MusicUI extends PartsUI {

        static N = 6;
        static M = 1;

        choosenItem = {};
        trackContent = [];
        trackIndex = {};
        reversedTrackIndex = [];

        itemsCont = new SheetContainer();
        itemHighlightShape = new createjs.Shape();

        constructor() {
            super(MusicUI.N, MusicUI.M);

            var self = this;

            let trackInsert = (track: MusicKey, volume?: number) => {
                var self = this;
                var bitmap = Resources.getInstance().getBitmap(UIGFXKey[UIGFXKey.UI_SOUND_KEY]);
                self.itemsCont.addChild(bitmap);
                bitmap.x = self.trackContent.length * (Resources.PARTS_SIZE + PartsUI.SPACING);
                bitmap.y = 0;
                self.trackIndex[track] = self.trackContent.length;
                self.reversedTrackIndex[self.trackContent.length] = track;
                self.trackContent.push(bitmap);

                var hitArea = new createjs.Shape();
                hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
                bitmap.hitArea = hitArea;

                bitmap.on("mousedown", function () {
                    self.selectTrack(track, volume);
                }, null, false);
            }

            // zatím rovnou:
            trackInsert(MusicKey.MSC_DIRT_THEME_KEY, 0.3);
            trackInsert(MusicKey.MSC_BUILD_THEME_KEY);
            trackInsert(MusicKey.MSC_BOSS_THEME_KEY);
            trackInsert(MusicKey.MSC_KRYSTAL_THEME_KEY);
            trackInsert(MusicKey.MSC_FLOOD_THEME_KEY);
            trackInsert(MusicKey.MSC_LAVA_THEME_KEY);

            // zvýraznění vybrané položky
            self.itemHighlightShape = new Highlight();
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);

            // kontejner položek
            self.itemsCont.x = AbstractUI.BORDER;
            self.itemsCont.y = AbstractUI.BORDER;
            self.addChild(self.itemsCont);

            let offset = 5;
            self.cache(-offset, -offset, self.width + offset * 2, self.height + offset * 2);
        }


        selectTrack(track: MusicKey, volume?: number) {
            var self = this;
            var bitmap = self.trackContent[self.trackIndex[track]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - PartsUI.SELECT_BORDER + PartsUI.BORDER;
            self.itemHighlightShape.y = bitmap.y - PartsUI.SELECT_BORDER + PartsUI.BORDER;
            self.choosenItem = track;

            for (var i = 0; i < self.reversedTrackIndex.length; i++) {
                Mixer.stopMusic(self.reversedTrackIndex[i]);
            }
            Mixer.playMusic(track, volume);
            self.updateCache();
        }

    }

}