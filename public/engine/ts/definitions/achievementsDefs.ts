namespace Lich {
    export class AchievementDefinition {
        constructor(
            public key: AchievementKey,
            public name: string,
            public motto: string,
            public description: string) { }
    }

    export let ACHIEVEMENTS_DEFS = [
        new AchievementDefinition(AchievementKey.ACHV_FALLING_DOWN, "Falling Down", "You want my briefcase? Here's my briefcase!", "Fall the height of the world by freefall"),
        new AchievementDefinition(AchievementKey.ACHV_CHICKEN_MASSACRE, "Chicken Massacre", "Poor chickens...", "Summon The Murhun"),
        new AchievementDefinition(AchievementKey.ACHV_CHICKEN_PROOFED, "Chicken-proofed", "Yummy!", "Defeat The Murhun"),
        new AchievementDefinition(AchievementKey.ACHV_LOVE_HURTS, "Love Hurts", "Love hurts, love scars, love wounds, and marks...", "Summon The Cupid"),
        new AchievementDefinition(AchievementKey.ACHV_HEARTBREAKING, "Heartbreaking", "No wonder you're still single", "Defeat The Cupid")
    ]
}