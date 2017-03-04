var Lich;
(function (Lich) {
    var AchievementDefinition = (function () {
        function AchievementDefinition(
            // klíč
            key, 
            // název sprite ikony 
            icon, 
            // název
            name, 
            // krátké heslo, hláška
            motto, 
            // popis úkonu, který je třeba vykonat, aby byl udělen achievement
            description) {
            this.key = key;
            this.icon = icon;
            this.name = name;
            this.motto = motto;
            this.description = description;
        }
        return AchievementDefinition;
    }());
    Lich.AchievementDefinition = AchievementDefinition;
    Lich.ACHIEVEMENTS_DEFS = [
        new AchievementDefinition(Lich.AchievementKey.ACHV_FALLING_DOWN_KEY, Lich.UISpriteKey.UI_ACH_FALLING_DOWN_KEY, "Falling Down", "You want my briefcase? Here's my briefcase!", "Fall the height of the world by freefall"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_CHICKEN_MASSACRE_KEY, Lich.UISpriteKey.UI_ACH_CHICKEN_MASSACRE_KEY, "Chicken Massacre", "Poor chickens...", "Summon The Murhun"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_CHICKEN_PROOFED_KEY, Lich.UISpriteKey.UI_ACH_CHICKEN_PROOFED_KEY, "Chicken-proofed", "Yummy!", "Defeat The Murhun"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_LOVE_HURTS_KEY, Lich.UISpriteKey.UI_ACH_LOVE_HURTS_KEY, "Love Hurts", "Love hurts, love scars, love wounds, and marks...", "Summon The Cupid"),
        new AchievementDefinition(Lich.AchievementKey.ACHV_HEARTBREAKING_KEY, Lich.UISpriteKey.UI_ACH_HEARTBREAKING_KEY, "Heartbreaking", "No wonder you're still single", "Defeat The Cupid")
    ];
})(Lich || (Lich = {}));
