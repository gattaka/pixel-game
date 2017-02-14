namespace Lich {
    export class AchievementDefinition {
        constructor(
            // klíč
            public key: AchievementKey,
            // sprite název
            public spriteName: string,
            // název
            public name: string,
            // krátké heslo, hláška
            public motto: string,
            // popis úkonu, který je třeba vykonat, aby byl udělen achievement
            public description: string) { }
    }

    export let ACHIEVEMENTS_DEFS = [
        new AchievementDefinition(AchievementKey.ACHV_FALLING_DOWN_KEY, "falling_down", "Falling Down", "You want my briefcase? Here's my briefcase!", "Fall the height of the world by freefall"),
        new AchievementDefinition(AchievementKey.ACHV_CHICKEN_MASSACRE_KEY, "chicken_massacre", "Chicken Massacre", "Poor chickens...", "Summon The Murhun"),
        new AchievementDefinition(AchievementKey.ACHV_CHICKEN_PROOFED_KEY, "chicken_proofed", "Chicken-proofed", "Yummy!", "Defeat The Murhun"),
        new AchievementDefinition(AchievementKey.ACHV_LOVE_HURTS_KEY, "love_hurts", "Love Hurts", "Love hurts, love scars, love wounds, and marks...", "Summon The Cupid"),
        new AchievementDefinition(AchievementKey.ACHV_HEARTBREAKING_KEY, "heartbreaking", "Heartbreaking", "No wonder you're still single", "Defeat The Cupid")
    ]
}