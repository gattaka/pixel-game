var Lich;
(function (Lich) {
    var AchievementDefinition = (function () {
        function AchievementDefinition(key, name, motto, description) {
            this.key = key;
            this.name = name;
            this.motto = motto;
            this.description = description;
        }
        return AchievementDefinition;
    }());
    Lich.AchievementDefinition = AchievementDefinition;
    Lich.ACHIEVEMENTS_DEFS = [
        new AchievementDefinition(Lich.AchievementKey.ACHV_FALLING_DOWN, "Falling Down", "You want my briefcase? Here's my briefcase!", "Fall the height of the world by freefall"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_CHICKEN_MASSACRE, "Chicken Massacre", "Poor chickens...", "Summon The Murhun"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_CHICKEN_PROOFED, "Chicken-proofed", "Yummy!", "Defeat The Murhun"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_LOVE_HURTS, "Love Hurts", "Love hurts, love scars, love wounds, and marks...", "Summon The Cupid"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_HEARTBREAKING, "Heartbreaking", "No wonder you're still single", "Defeat The Cupid")
    ];
})(Lich || (Lich = {}));
