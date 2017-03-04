namespace Lich {
    export class AchievementDefinition {
        constructor(
            // klíč
            public key: AchievementKey,
            // název sprite ikony 
            public icon: UISpriteKey,
            // název
            public name: string,
            // krátké heslo, hláška
            public motto: string,
            // popis úkonu, který je třeba vykonat, aby byl udělen achievement
            public description: string) { }
    }

    export let ACHIEVEMENTS_DEFS = [
        new AchievementDefinition(AchievementKey.ACHV_FALLING_DOWN_KEY, UISpriteKey.UI_ACH_FALLING_DOWN_KEY, "Falling Down", "You want my briefcase? Here's my briefcase!", "Fall the height of the world by freefall"),
        new AchievementDefinition(AchievementKey.ACHV_CHICKEN_MASSACRE_KEY, UISpriteKey.UI_ACH_CHICKEN_MASSACRE_KEY, "Chicken Massacre", "Poor chickens...", "Summon The Murhun"),
        new AchievementDefinition(AchievementKey.ACHV_CHICKEN_PROOFED_KEY, UISpriteKey.UI_ACH_CHICKEN_PROOFED_KEY, "Chicken-proofed", "Yummy!", "Defeat The Murhun"),
        new AchievementDefinition(AchievementKey.ACHV_LOVE_HURTS_KEY, UISpriteKey.UI_ACH_LOVE_HURTS_KEY, "Love Hurts", "Love hurts, love scars, love wounds, and marks...", "Summon The Cupid"),
        new AchievementDefinition(AchievementKey.ACHV_HEARTBREAKING_KEY, UISpriteKey.UI_ACH_HEARTBREAKING_KEY, "Heartbreaking", "No wonder you're still single", "Defeat The Cupid")
    ]
}