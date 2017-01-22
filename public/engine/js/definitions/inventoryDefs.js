var Lich;
(function (Lich) {
    var xmasGiftSpawn = function (world) {
        var inv;
        switch (Math.floor(Math.random() * 8)) {
            case 0:
                inv = Lich.InventoryKey.INV_XMAS_HOLLY_KEY;
                break;
            case 1:
                inv = Lich.InventoryKey.INV_XMAS_CHAIN_KEY;
                break;
            case 2:
                inv = Lich.InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY;
                break;
            case 3:
                inv = Lich.InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY;
                break;
            case 4:
                inv = Lich.InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY;
                break;
            case 5:
                inv = Lich.InventoryKey.INV_XMAS_RED_BAUBLE_KEY;
                break;
            case 6:
                inv = Lich.InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY;
                break;
            case 7:
                inv = Lich.InventoryKey.INV_ADVENT_WREATH_KEY;
                break;
        }
        world.spawnObject(new Lich.DugObjDefinition(inv, 1), world.hero.x, world.hero.y, false);
        return true;
    };
    Lich.INVENTORY_DEFS = function (res) {
        return [
            // usaditelných jako objekt
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MUSHROOM_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_MUSHROOM_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MUSHROOM2_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_MUSHROOM2_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MUSHROOM3_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_MUSHROOM3_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BERRY_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_BERRY_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_RED_PLANT_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_RED_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_MAGENTA_PLANT_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_MAGENTA_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CYAN_PLANT_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_CYAN_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_YELLOW_PLANT_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_YELLOW_PLANT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CAMPFIRE_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_CAMPFIRE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_FIREPLACE_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_FIREPLACE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_TORCH_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_TORCH_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ANVIL_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_ANVIL_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_SMELTER_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_SMELTER_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_INGOT_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_IRON_INGOT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_FENCE_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_IRON_FENCE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GRAVE_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_GRAVE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_KNIGHT_STATUE_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_KNIGHT_STATUE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BANNER_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_BANNER_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_FLOWER_POT_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_FLOWER_POT_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CHANDELIER_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_CHANDELIER_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CAULDRON_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_CAULDRON_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_SNOWMAN, res.mapObjectDefs[Lich.MapObjectKey.MAP_SNOWMAN_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_HOLLY_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_XMAS_HOLLY_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_CHAIN_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_XMAS_CHAIN_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_XMAS_TREE_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_XMAS_TREE_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ADVENT_WREATH_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_ADVENT_WREATH_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GIFT1_KEY).setConsumeAction(xmasGiftSpawn),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GIFT2_KEY).setConsumeAction(xmasGiftSpawn),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GIFT3_KEY).setConsumeAction(xmasGiftSpawn),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_LOVELETTER).setConsumeAction(function (world) {
                if (!Lich.Enemy.CupidBoss.spawned) {
                    Lich.SpawnPool.getInstance().spawn(Lich.Enemy.CupidBoss, world);
                    return true;
                }
                return false;
            }),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CHICKEN_MEAT_KEY).setConsumeAction(function (world) {
                // TODO 
                Lich.Mixer.playSound(Lich.SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    var health = 10;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                }
                else {
                    return false;
                }
            }),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_RED_FLASK_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_RED_FLASK_KEY]).setConsumeAction(function (world) {
                // TODO 
                Lich.Mixer.playSound(Lich.SoundKey.SND_SPAWN_KEY);
                if (world.hero.getCurrentHealth() < world.hero.getMaxHealth()) {
                    var health = 30;
                    world.hero.fillHealth(health);
                    world.fadeText("+" + health, world.hero.x + world.hero.width * Math.random(), world.hero.y, 25, "#0E3", "#030");
                    return true;
                }
                else {
                    return false;
                }
            }),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_DOOR_KEY, res.mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN_KEY])
                .setMapObjAlternative(res.mapObjectDefs[Lich.MapObjectKey.MAP_DOOR_OPEN2_KEY]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_CHAIR, res.mapObjectDefs[Lich.MapObjectKey.MAP_WOOD_CHAIR])
                .setMapObjAlternative(res.mapObjectDefs[Lich.MapObjectKey.MAP_WOOD_CHAIR2]),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_TABLE, res.mapObjectDefs[Lich.MapObjectKey.MAP_WOOD_TABLE]),
            // usaditelných jako povrch
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_DIRT_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_DIRT_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOODWALL_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_WOODWALL_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_WOODWALL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_BRICK_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_BRICK_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_STRAW_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_STRAW_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_STRAW_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_KRYSTAL_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_KRYSTAL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_FLORITE_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_FLORITE_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_IRON_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_COAL_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_COAL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_IRON_PLATFORM_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_IRON_PLATFORM_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_PLATFORM_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_WOOD_PLATFORM_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOOD_LADDER_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_WOOD_LADDER_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROOF_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROOF_KEY))
                .setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_ROOF_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROOF_TL_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROOF_TL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROOF_TR_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROOF_TR_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_TL_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_TL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_TR_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_TR_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_BL_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_BL_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_BR_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_ROCK_BRICK_BR_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_ROCK_BRICK_WINDOW_KEY).setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_ROCK_BRICK_WINDOW_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_WOODWALL_WINDOW_KEY).setBackground(res.getSurfaceBgrDef(Lich.SurfaceBgrKey.SRFC_BGR_WOODWALL_WINDOW_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_CHAIN_LADDER_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_CHAIN_LADDER_KEY)),
            new Lich.InvObjDefinition(Lich.InventoryKey.INV_GOLD_KEY, res.getSurfaceDef(Lich.SurfaceKey.SRFC_GOLD_KEY))
        ];
    };
})(Lich || (Lich = {}));
