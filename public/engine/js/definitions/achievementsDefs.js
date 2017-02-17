var Lich;
(function (Lich) {
    var AchievementDefinition = (function () {
        function AchievementDefinition(
            // klíč
            key, 
            // sprite název
            spriteName, 
            // název
            name, 
            // krátké heslo, hláška
            motto, 
            // popis úkonu, který je třeba vykonat, aby byl udělen achievement
            description) {
            this.key = key;
            this.spriteName = spriteName;
            this.name = name;
            this.motto = motto;
            this.description = description;
        }
        return AchievementDefinition;
    }());
    Lich.AchievementDefinition = AchievementDefinition;
    Lich.ACHIEVEMENTS_DEFS = [
        new AchievementDefinition(Lich.AchievementKey.ACHV_FALLING_DOWN_KEY, "achv_falling_down", "Falling Down", "You want my briefcase? Here's my briefcase!", "Fall the height of the world by freefall"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_CHICKEN_MASSACRE_KEY, "achv_chicken_massacre", "Chicken Massacre", "Poor chickens...", "Summon The Murhun"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_CHICKEN_PROOFED_KEY, "achv_chicken_proofed", "Chicken-proofed", "Yummy!", "Defeat The Murhun"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_LOVE_HURTS_KEY, "achv_love_hurts", "Love Hurts", "Love hurts, love scars, love wounds, and marks...", "Summon The Cupid"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_HEARTBREAKING_KEY, "achv_heartbreaking", "Heartbreaking", "No wonder you're still single", "Defeat The Cupid")
    ];
})(Lich || (Lich = {}));
