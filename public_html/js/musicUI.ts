namespace Lich {

    export class MusicUI extends UIPart {

        static n = 6;

        choosenItem = {};
        trackContent = [];
        trackIndex = {};
        reversedTrackIndex = [];

        itemsCont = new createjs.Container();
        itemHighlightShape = new createjs.Shape();

        constructor(public game: Game) {
            super(MusicUI.n * Resources.PARTS_SIZE + (MusicUI.n - 1) * (UIPart.SPACING) + 2 * UIPart.BORDER, Resources.PARTS_SIZE + 2 * UIPart.BORDER);

            var self = this;

            // zatím rovnou:
            self.trackInsert(Resources.MSC_DIRT_THEME_KEY);
            self.trackInsert(Resources.MSC_BUILD_THEME_KEY);
            self.trackInsert(Resources.MSC_BOSS_THEME_KEY);
            self.trackInsert(Resources.MSC_KRYSTAL_THEME_KEY);
            self.trackInsert(Resources.MSC_FLOOD_THEME_KEY);
            self.trackInsert(Resources.MSC_LAVA_THEME_KEY);

            self.selectTrack(Resources.MSC_DIRT_THEME_KEY);

            // zvýraznění vybrané položky
            self.itemHighlightShape.graphics.beginStroke("rgba(250,250,10,0.5)");
            self.itemHighlightShape.graphics.beginFill("rgba(250,250,10,0.2)");
            self.itemHighlightShape.graphics.setStrokeStyle(2);
            self.itemHighlightShape.graphics.drawRoundRect(0, 0, Resources.PARTS_SIZE + UIPart.SELECT_BORDER * 2, Resources.PARTS_SIZE
                + UIPart.SELECT_BORDER * 2, 3);
            self.itemHighlightShape.visible = false;
            self.addChild(self.itemHighlightShape);

            // kontejner položek
            self.itemsCont.x = UIPart.BORDER;
            self.itemsCont.y = UIPart.BORDER;
            self.addChild(self.itemsCont);
        }


        selectTrack(track) {
            var self = this;
            var bitmap = self.trackContent[self.trackIndex[track]];
            self.itemHighlightShape.visible = true;
            self.itemHighlightShape.x = bitmap.x - UIPart.SELECT_BORDER + UIPart.BORDER;
            self.itemHighlightShape.y = bitmap.y - UIPart.SELECT_BORDER + UIPart.BORDER;
            self.choosenItem = track;

            for (var i = 0; i < self.reversedTrackIndex.length; i++) {
                if (self.reversedTrackIndex[i] != track) {
                    Mixer.stop(self.reversedTrackIndex[i]);
                }
            }
            Mixer.play(track, true);
        }

        trackInsert(track) {
            var self = this;
            var bitmap = self.game.resources.getBitmap(Resources.UI_SOUND_KEY);
            self.itemsCont.addChild(bitmap);
            bitmap.x = self.trackContent.length * (Resources.PARTS_SIZE + UIPart.SPACING);
            bitmap.y = 0;
            self.trackIndex[track] = self.trackContent.length;
            self.reversedTrackIndex[self.trackContent.length] = track;
            self.trackContent.push(bitmap);

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, Resources.PARTS_SIZE, Resources.PARTS_SIZE);
            bitmap.hitArea = hitArea;

            bitmap.on("mousedown", function() {
                self.selectTrack(track);
            }, null, false);
        }

    }

}