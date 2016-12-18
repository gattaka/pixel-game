var Lich;
(function (Lich) {
    Lich.INVENTORY_PATHS = [
        ["images/ui/inventory/inv_bones.png", Lich.InventoryKey.INV_BONES_KEY],
        ["images/ui/inventory/inv_berry.png", Lich.InventoryKey.INV_BERRY_KEY],
        ["images/ui/inventory/inv_mushroom.png", Lich.InventoryKey.INV_MUSHROOM_KEY],
        ["images/ui/inventory/inv_mushroom2.png", Lich.InventoryKey.INV_MUSHROOM2_KEY],
        ["images/ui/inventory/inv_mushroom3.png", Lich.InventoryKey.INV_MUSHROOM3_KEY],
        ["images/ui/inventory/inv_plant.png", Lich.InventoryKey.INV_RED_PLANT_KEY],
        ["images/ui/inventory/inv_plant2.png", Lich.InventoryKey.INV_MAGENTA_PLANT_KEY],
        ["images/ui/inventory/inv_plant3.png", Lich.InventoryKey.INV_CYAN_PLANT_KEY],
        ["images/ui/inventory/inv_plant4.png", Lich.InventoryKey.INV_YELLOW_PLANT_KEY],
        ["images/ui/inventory/inv_straw.png", Lich.InventoryKey.INV_STRAW_KEY],
        ["images/ui/inventory/inv_wood.png", Lich.InventoryKey.INV_WOOD_KEY],
        ["images/ui/inventory/inv_dirt.png", Lich.InventoryKey.INV_DIRT_KEY],
        ["images/ui/inventory/inv_krystals.png", Lich.InventoryKey.INV_KRYSTAL_KEY],
        ["images/ui/inventory/inv_florite.png", Lich.InventoryKey.INV_FLORITE_KEY],
        ["images/ui/inventory/inv_campfire.png", Lich.InventoryKey.INV_CAMPFIRE_KEY],
        ["images/ui/inventory/inv_door.png", Lich.InventoryKey.INV_DOOR_KEY],
        ["images/ui/inventory/inv_brick.png", Lich.InventoryKey.INV_BRICK_KEY],
        ["images/ui/inventory/inv_woodwall.png", Lich.InventoryKey.INV_WOODWALL_KEY],
        ["images/ui/inventory/inv_roof.png", Lich.InventoryKey.INV_ROOF_KEY],
        ["images/ui/inventory/inv_iron.png", Lich.InventoryKey.INV_IRON_KEY],
        ["images/ui/inventory/inv_coal.png", Lich.InventoryKey.INV_COAL_KEY],
        ["images/ui/inventory/inv_rock.png", Lich.InventoryKey.INV_ROCK_KEY],
        ["images/ui/inventory/inv_rock_brick.png", Lich.InventoryKey.INV_ROCK_BRICK_KEY],
        ["images/ui/inventory/inv_torch.png", Lich.InventoryKey.INV_TORCH_KEY],
        ["images/ui/inventory/inv_anvil.png", Lich.InventoryKey.INV_ANVIL_KEY],
        ["images/ui/inventory/inv_smelter.png", Lich.InventoryKey.INV_SMELTER_KEY],
        ["images/ui/inventory/inv_iron_ingot.png", Lich.InventoryKey.INV_IRON_INGOT_KEY],
        ["images/ui/inventory/inv_iron_fence.png", Lich.InventoryKey.INV_IRON_FENCE_KEY],
        ["images/ui/inventory/inv_iron_platform.png", Lich.InventoryKey.INV_IRON_PLATFORM_KEY],
        ["images/ui/inventory/inv_wood_platform.png", Lich.InventoryKey.INV_WOOD_PLATFORM_KEY],
        ["images/ui/inventory/inv_grave.png", Lich.InventoryKey.INV_GRAVE_KEY],
        ["images/ui/inventory/inv_wood_ladder.png", Lich.InventoryKey.INV_WOOD_LADDER_KEY],
        ["images/ui/inventory/inv_fireplace.png", Lich.InventoryKey.INV_FIREPLACE_KEY],
        ["images/ui/inventory/inv_roof_tl.png", Lich.InventoryKey.INV_ROOF_TL_KEY],
        ["images/ui/inventory/inv_roof_tr.png", Lich.InventoryKey.INV_ROOF_TR_KEY],
        ["images/ui/inventory/inv_rock_brick_tl.png", Lich.InventoryKey.INV_ROCK_BRICK_TL_KEY],
        ["images/ui/inventory/inv_rock_brick_tr.png", Lich.InventoryKey.INV_ROCK_BRICK_TR_KEY],
        ["images/ui/inventory/inv_rock_brick_bl.png", Lich.InventoryKey.INV_ROCK_BRICK_BL_KEY],
        ["images/ui/inventory/inv_rock_brick_br.png", Lich.InventoryKey.INV_ROCK_BRICK_BR_KEY],
        ["images/ui/inventory/inv_rock_brick_window.png", Lich.InventoryKey.INV_ROCK_BRICK_WINDOW_KEY],
        ["images/ui/inventory/inv_woodwall_window.png", Lich.InventoryKey.INV_WOODWALL_WINDOW_KEY],
        ["images/ui/inventory/inv_knight_statue.png", Lich.InventoryKey.INV_KNIGHT_STATUE_KEY],
        ["images/ui/inventory/inv_chain_ladder.png", Lich.InventoryKey.INV_CHAIN_LADDER_KEY],
        ["images/ui/inventory/inv_banner.png", Lich.InventoryKey.INV_BANNER_KEY],
        ["images/ui/inventory/inv_flower_pot.png", Lich.InventoryKey.INV_FLOWER_POT_KEY],
        ["images/ui/inventory/inv_chandelier.png", Lich.InventoryKey.INV_CHANDELIER_KEY],
        ["images/ui/inventory/inv_gold.png", Lich.InventoryKey.INV_GOLD_ORE_KEY],
        ["images/ui/inventory/inv_chicken_meat.png", Lich.InventoryKey.INV_CHICKEN_MEAT_KEY],
        ["images/ui/inventory/inv_chicken_talon.png", Lich.InventoryKey.INV_CHICKEN_TALON_KEY],
        ["images/ui/inventory/inv_cauldron.png", Lich.InventoryKey.INV_CAULDRON_KEY],
        ["images/ui/inventory/inv_red_flask.png", Lich.InventoryKey.INV_RED_FLASK_KEY],
        ["images/ui/inventory/inv_xmas_blue_bauble.png", Lich.InventoryKey.INV_XMAS_BLUE_BAUBLE_KEY],
        ["images/ui/inventory/inv_xmas_green_bauble.png", Lich.InventoryKey.INV_XMAS_GREEN_BAUBLE_KEY],
        ["images/ui/inventory/inv_xmas_purple_bauble.png", Lich.InventoryKey.INV_XMAS_PURPLE_BAUBLE_KEY],
        ["images/ui/inventory/inv_xmas_red_bauble.png", Lich.InventoryKey.INV_XMAS_RED_BAUBLE_KEY],
        ["images/ui/inventory/inv_xmas_yellow_bauble.png", Lich.InventoryKey.INV_XMAS_YELLOW_BAUBLE_KEY],
        ["images/ui/inventory/inv_xmas_holly.png", Lich.InventoryKey.INV_XMAS_HOLLY_KEY],
        ["images/ui/inventory/inv_xmas_chain.png", Lich.InventoryKey.INV_XMAS_CHAIN_KEY],
        ["images/ui/inventory/inv_xmas_tree.png", Lich.InventoryKey.INV_XMAS_TREE_KEY],
        ["images/ui/inventory/inv_advent_wreath.png", Lich.InventoryKey.INV_ADVENT_WREATH_KEY],
        ["images/ui/inventory/inv_gift1.png", Lich.InventoryKey.INV_GIFT1_KEY],
        ["images/ui/inventory/inv_gift2.png", Lich.InventoryKey.INV_GIFT2_KEY],
        ["images/ui/inventory/inv_gift3.png", Lich.InventoryKey.INV_GIFT3_KEY],
        ["images/ui/inventory/inv_snowball.png", Lich.InventoryKey.INV_SNOWBALL],
        ["images/ui/inventory/inv_snowman.png", Lich.InventoryKey.INV_SNOWMAN],
        ["images/ui/inventory/inv_snowflake.png", Lich.InventoryKey.INV_SNOWFLAKE]
    ];
})(Lich || (Lich = {}));
