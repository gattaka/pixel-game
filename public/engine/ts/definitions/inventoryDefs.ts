namespace Lich {
    let xmasGiftSpawn = (world: World): boolean => {
        let inv;
        switch (Math.floor(Math.random() * 8)) {
            case 0: inv = InventoryKey.INV_XMAS_HOLLY_KEY; break;
            case 1: inv = InventoryKey.INV_XMAS_CHAIN_KEY; break;
            case 2: inv = InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY; break;
            case 3: inv = InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY; break;
            case 4: inv = InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY; break;
            case 5: inv = InventoryKey.INV_XMAS_RED_BAUBLE_KEY; break;
            case 6: inv = InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY; break;
            case 7: inv = InventoryKey.INV_ADVENT_WREATH_KEY; break;
        }
        world.spawnObject(new DugObjDefinition(inv, 1), world.hero.x, world.hero.y, false);
        return true;
    };

    export let INVENTORY_DEFS = (res: Resources) => {
        return [
            // usaditelných jako objekt
            new InvObjDefinition(InventoryKey.INV_MUSHROOM_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM2_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM2_KEY]),
            new InvObjDefinition(InventoryKey.INV_MUSHROOM3_KEY, res.mapObjectDefs[MapObjectKey.MAP_MUSHROOM3_KEY]),
            new InvObjDefinition(InventoryKey.INV_BERRY_KEY, res.mapObjectDefs[MapObjectKey.MAP_BERRY_KEY]),
            new InvObjDefinition(InventoryKey.INV_RED_PLANT_KEY, res.mapObjectDefs[MapObjectKey.MAP_RED_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_MAGENTA_PLANT_KEY, res.mapObjectDefs[MapObjectKey.MAP_MAGENTA_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CYAN_PLANT_KEY, res.mapObjectDefs[MapObjectKey.MAP_CYAN_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_YELLOW_PLANT_KEY, res.mapObjectDefs[MapObjectKey.MAP_YELLOW_PLANT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CAMPFIRE_KEY, res.mapObjectDefs[MapObjectKey.MAP_CAMPFIRE_KEY]),
            new InvObjDefinition(InventoryKey.INV_FIREPLACE_KEY, res.mapObjectDefs[MapObjectKey.MAP_FIREPLACE_KEY]),
            new InvObjDefinition(InventoryKey.INV_TORCH_KEY, res.mapObjectDefs[MapObjectKey.MAP_TORCH_KEY]),
            new InvObjDefinition(InventoryKey.INV_ANVIL_KEY, res.mapObjectDefs[MapObjectKey.MAP_ANVIL_KEY]),
            new InvObjDefinition(InventoryKey.INV_SMELTER_KEY, res.mapObjectDefs[MapObjectKey.MAP_SMELTER_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_INGOT_KEY, res.mapObjectDefs[MapObjectKey.MAP_IRON_INGOT_KEY]),
            new InvObjDefinition(InventoryKey.INV_IRON_FENCE_KEY, res.mapObjectDefs[MapObjectKey.MAP_IRON_FENCE_KEY]),
            new InvObjDefinition(InventoryKey.INV_GRAVE_KEY, res.mapObjectDefs[MapObjectKey.MAP_GRAVE_KEY]),
            new InvObjDefinition(InventoryKey.INV_KNIGHT_STATUE_KEY, res.mapObjectDefs[MapObjectKey.MAP_KNIGHT_STATUE_KEY]),
            new InvObjDefinition(InventoryKey.INV_BANNER_KEY, res.mapObjectDefs[MapObjectKey.MAP_BANNER_KEY]),
            new InvObjDefinition(InventoryKey.INV_FLOWER_POT_KEY, res.mapObjectDefs[MapObjectKey.MAP_FLOWER_POT_KEY]),
            new InvObjDefinition(InventoryKey.INV_CHANDELIER_KEY, res.mapObjectDefs[MapObjectKey.MAP_CHANDELIER_KEY]),
            new InvObjDefinition(InventoryKey.INV_CAULDRON_KEY, res.mapObjectDefs[MapObjectKey.MAP_CAULDRON_KEY]),
            new InvObjDefinition(InventoryKey.INV_SNOWMAN, res.mapObjectDefs[MapObjectKey.MAP_SNOWMAN_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_HOLLY_KEY, res.mapObjectDefs[MapObjectKey.MAP_XMAS_HOLLY_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_CHAIN_KEY, res.mapObjectDefs[MapObjectKey.MAP_XMAS_CHAIN_KEY]),
            new InvObjDefinition(InventoryKey.INV_XMAS_TREE_KEY, res.mapObjectDefs[MapObjectKey.MAP_XMAS_TREE_KEY]),
            new InvObjDefinition(InventoryKey.INV_ADVENT_WREATH_KEY, res.mapObjectDefs[MapObjectKey.MAP_ADVENT_WREATH_KEY]),
            new InvObjDefinition(InventoryKey.INV_GIFT1_KEY).setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_GIFT2_KEY).setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_GIFT3_KEY).setConsumeAction(xmasGiftSpawn),
            new InvObjDefinition(InventoryKey.INV_LOVELETTER).setConsumeAction((world: World): boolean => {
                for (let i = 0; i < 5; i++)
                    SpawnPool.getInstance().spawn(Enemy.Valentimon, world);
                return true;
            }),
            new InvObjDefinition(InventoryKey.INV_CHICKEN_MEAT_KEY).setConsumeAction((world: World): boolean => {
                // TODO 
                Mixer.playSound(SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    let health = 10;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                } else {
                    return false;
                }
            }),
            new InvObjDefinition(InventoryKey.INV_RED_FLASK_KEY, res.mapObjectDefs[MapObjectKey.MAP_RED_FLASK_KEY]).setConsumeAction((world: World): boolean => {
                // TODO 
                Mixer.playSound(SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    let health = 30;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                } else {
                    return false;
                }
            }),
            new InvObjDefinition(InventoryKey.INV_DOOR_KEY, res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(res.mapObjectDefs[MapObjectKey.MAP_DOOR_OPEN2_KEY]),
            new InvObjDefinition(InventoryKey.INV_WOOD_CHAIR, res.mapObjectDefs[MapObjectKey.MAP_WOOD_CHAIR])
                .setMapObjAlternative(res.mapObjectDefs[MapObjectKey.MAP_WOOD_CHAIR2]),
            new InvObjDefinition(InventoryKey.INV_WOOD_TABLE, res.mapObjectDefs[MapObjectKey.MAP_WOOD_TABLE]),

            // usaditelných jako povrch
            new InvObjDefinition(InventoryKey.INV_DIRT_KEY, res.getSurfaceDef(SurfaceKey.SRFC_DIRT_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOODWALL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_WOODWALL_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY)),
            new InvObjDefinition(InventoryKey.INV_BRICK_KEY, res.getSurfaceDef(SurfaceKey.SRFC_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_BRICK_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY)),
            new InvObjDefinition(InventoryKey.INV_STRAW_KEY, res.getSurfaceDef(SurfaceKey.SRFC_STRAW_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_STRAW_KEY)),
            new InvObjDefinition(InventoryKey.INV_KRYSTAL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_KRYSTAL_KEY)),
            new InvObjDefinition(InventoryKey.INV_FLORITE_KEY, res.getSurfaceDef(SurfaceKey.SRFC_FLORITE_KEY)),
            new InvObjDefinition(InventoryKey.INV_IRON_KEY, res.getSurfaceDef(SurfaceKey.SRFC_IRON_KEY)),
            new InvObjDefinition(InventoryKey.INV_COAL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_COAL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_KEY)),
            new InvObjDefinition(InventoryKey.INV_IRON_PLATFORM_KEY, res.getSurfaceDef(SurfaceKey.SRFC_IRON_PLATFORM_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOOD_PLATFORM_KEY, res.getSurfaceDef(SurfaceKey.SRFC_WOOD_PLATFORM_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOOD_LADDER_KEY, res.getSurfaceDef(SurfaceKey.SRFC_WOOD_LADDER_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROOF_KEY))
                .setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROOF_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_TL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROOF_TL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROOF_TR_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROOF_TR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_TL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_TR_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_TR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BL_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_BL_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_BR_KEY, res.getSurfaceDef(SurfaceKey.SRFC_ROCK_BRICK_BR_KEY)),
            new InvObjDefinition(InventoryKey.INV_ROCK_BRICK_WINDOW_KEY).setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_WINDOW_KEY)),
            new InvObjDefinition(InventoryKey.INV_WOODWALL_WINDOW_KEY).setBackground(res.getSurfaceBgrDef(SurfaceBgrKey.SRFC_BGR_WOODWALL_WINDOW_KEY)),
            new InvObjDefinition(InventoryKey.INV_CHAIN_LADDER_KEY, res.getSurfaceDef(SurfaceKey.SRFC_CHAIN_LADDER_KEY)),
            new InvObjDefinition(InventoryKey.INV_GOLD_KEY, res.getSurfaceDef(SurfaceKey.SRFC_GOLD_KEY))
        ];
    }
}