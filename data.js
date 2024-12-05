// data.js

export const playerAbiliy = [
    { id: 'reg_attack', lbl: 'Attack', abiliy_slot: 1, img: 'media/icons/battle/att_icon_01.png' },
    { id: 'forceful_attack', lbl: 'Forceful Attack', abiliy_slot: 2, img: 'media/icons/battle/att_icon_02.png' },
    { id: 'self_heal_1', lbl: 'First Aid 1', abiliy_slot: 3, img: 'media/icons/battle/att_icon_03.png' }
];

export const equipmentElements = [
    { num: 1, type: 'equip_slot', id: 'head' },
    { num: 2, type: 'equip_slot', id: 'shoulders' },
    { num: 3, type: 'equip_slot', id: 'hands' },
    { num: 4, type: 'equip_slot', id: 'neck' },
    { num: 5, type: 'equip_slot', id: 'waist' },
    { num: 6, type: 'equip_slot', id: 'chest' },
    { num: 7, type: 'equip_slot', id: 'legs' },
    { num: 8, type: 'equip_slot', id: 'wrist' },
    { num: 9, type: 'equip_slot', id: 'feet' },
    { num: 10, type: 'equip_slot', id: 'ring1' },
    { num: 11, type: 'equip_slot', id: 'ring2' },
    { num: 12, type: 'equip_slot', id: 'mh' },
    { num: 13, type: 'equip_slot', id: 'oh' },
];

const inventoryMaxSlots = 20;
export const inventoryElements = [
    { id: 'inventory',
    /* size: see inventoryMaxSlots above */
    lbl: 'Inventory',
    },
    { type: 'slot', id: 1 },
    { type: 'slot', id: 2 },
    { type: 'slot', id: 3 },
    { type: 'slot', id: 4 },
    { type: 'slot', id: 5 },
    { type: 'slot', id: 6 },
    { type: 'slot', id: 7 },
    { type: 'slot', id: 8 },
    { type: 'slot', id: 9 },
    { type: 'slot', id: 10 },
    { type: 'slot', id: 11 },
    { type: 'slot', id: 12 },
    { type: 'slot', id: 13 },
    { type: 'slot', id: 14 },
    { type: 'slot', id: 15 },
    { type: 'slot', id: 16 },
    { type: 'slot', id: 17 },
    { type: 'slot', id: 18 },
    { type: 'slot', id: 19 },
    { type: 'slot', id: 20 },
];

export const itemData = [
    // rarity: 0 = junk (lightgray)
    // rarity: 1 = common (white)
    // rarity: 2 = uncommon (green)
    // rarity: 3 = rare (lightblue)
    // rarity: 4 = epic (pink)
    // rarity: 5 = legendary (orange)
    // rarity: 6 = ancient (lightred)
    // See saveData[4].currencyData[0]
    { id: 'GOLD',
    type: 'currency',
    name: 'Gold',
    cnt: 0,
    },
// *** TEST LOOT
    { id: 'CLOTH_BASIC',
    type: 'material',
    name: 'Basic Cloth',
    slot: 'Crafting Material',
    rarity: 1,
    cnt: 0,
    stackable: true, // only if item cam stsck
    value: 5,
    img: 'media/icons/cloth_basic_01.jpg',
    },
    { id: 'TOOTH',
    type: 'junk',
    name: 'Tooth',
    rarity: 0,
    desc: 'It&apos;s a tooth.',
    cnt: 0,
    stackable: true,
    value: 1,
    img: 'media/icons/tooth_01.jpg',
    },
// *** ENEMY LOOT
    { id: 'NPC_LOOT_LEPER_SMALL_SKULL',
    type: 'junk',
    name: 'Small Skull',
    rarity: 0,
    desc: 'Was a face once.',
    cnt: 0,
    stackable: true,
    value: 3,
    img: 'media/icons/NPC_LOOT_LEPER_SMALL_SKULL.png',
    },
    { id: 'NPC_LOOT_LEPER_BONE_FRAGMENT',
    type: 'junk',
    name: 'Bone Fragment',
    rarity: 0,
    desc: 'Bonish.',
    cnt: 0,
    stackable: true,
    value: 1,
    img: 'media/icons/NPC_LOOT_LEPER_BONE_FRAGMENT.png',
    },
    { id: 'NPC_LOOT_LIZARD_CLAW',
    type: 'junk',
    name: 'Lizard Claw',
    rarity: 0,
    desc: 'Scratchy.',
    cnt: 0,
    stackable: true,
    value: 2,
    img: 'media/icons/NPC_LOOT_LIZARD_CLAW.png',
    },
    { id: 'NPC_LOOT_LIZARD_TAIL',
    type: 'junk',
    name: 'Lizard Tail',
    rarity: 0,
    desc: 'Not as long as your beard.',
    cnt: 0,
    stackable: true,
    value: 4,
    img: 'media/icons/NPC_LOOT_LIZARD_TAIL.png',
    },
    { id: 'NPC_LOOT_LIZARD_SCALE',
    type: 'junk',
    name: 'Lizard Scale',
    rarity: 0,
    desc: 'Scaly.',
    cnt: 0,
    stackable: true,
    value: 1,
    img: 'media/icons/NPC_LOOT_LIZARD_SCALE.png',
    },
    { id: 'NPC_LOOT_SLIME',
    type: 'junk',
    name: 'Slime',
    rarity: 0,
    desc: 'It&apos;s sticky.',
    cnt: 0,
    stackable: true,
    value: 1,
    img: 'media/icons/NPC_LOOT_SLIME.png',
    },
    { id: 'NPC_LOOT_SLIME_CHUNK',
    type: 'junk',
    name: 'Slime Chunk',
    rarity: 0,
    desc: 'Mushy.',
    cnt: 0,
    stackable: true,
    value: 3,
    img: 'media/icons/NPC_LOOT_SLIME_CHUNK.png',
    },
// *** STARTING EQUIPMENT
    { id: 'BASIC_HELMET',
    type: 'armor',
    name: 'Basic Helm',
    slot: 'head',
    slot_name: 'Head',
    rarity: 0,
    desc: 'Basic head protection, nothing extraordinary.',
    gains: [
        { stat: 'armor', lbl: 'Armor', amt: 10 },
        { stat: 'strength', lbl: 'Strength', amt: 1 },
        { stat: 'intelligence', lbl: 'Intelligence', amt: 1 },
    ],
    cnt: 0,
    value: 0,
    img: 'media/icons/head_01.jpg',
    },
    //
    { id: 'BASIC_CHESTPIECE',
    type: 'armor',
    name: 'Basic Chestpiece',
    slot: 'chest',
    slot_name: 'Chest',
    rarity: 0,
    desc: 'Basic chest protection. Not very stylish.',
    gains: [
        { stat: 'armor', lbl: 'Armor', amt: 20 },
        { stat: 'wisdom', lbl: 'Wisdom', amt: 2 },
    ],
    cnt: 0,
    value: 0,
    img: 'media/icons/chest_01.jpg',
    },
    //
    { id: 'BASIC_GLOVES',
    type: 'armor',
    name: 'Basic Gloves',
    slot: 'hands',
    slot_name: 'Hands',
    rarity: 0,
    desc: 'Basic hand protection. Almost as good as junk...almost.',
    gains: [
        { stat: 'armor', lbl: 'Armor', amt: 10 },
        { stat: 'power', lbl: 'Power', amt: 5 },
        { stat: 'hitChance', lbl: 'Chance to hit (%)', amt: 0.02 },
    ],
    cnt: 0,
    value: 0,
    img: 'media/icons/gloves_01.jpg',
    },
    //
    { id: 'BASIC_BOOTS',
    type: 'armor',
    name: 'Basic Boots',
    slot: 'feet',
    slot_name: 'Feet',
    rarity: 0,
    desc: 'Basic feet protection. Not very comfortable.',
    gains: [
        { stat: 'armor', lbl: 'Armor', amt: 10 },
        { stat: 'dexterity', lbl: 'Dexterity', amt: 5 },
    ],
    cnt: 0,
    value: 0,
    img: 'media/icons/boots_01.jpg',
    },
    //
    { id: 'MH_BASIC_DAGGER',
    type: 'weapon',
    name: 'Basic Dagger',
    slot: 'mh',
    slot_name: 'Mainhand',
    player_equipped: true,
    rarity: 0,
    desc: 'A cheap dagger. Dull. You&apos;ll stab your eye out, kid.',
    gains: [
        { stat: 'dmg_min', amt: 1.2 },
        { stat: 'dmg_max', amt: 1.6 },
        { stat: 'constitution', lbl: 'Constitution', amt: 1 },
        { stat: 'agility', lbl: 'Agility', amt: 5 },
    ],
    cnt: 0,
    value: 0,
    img: 'media/icons/mh_01.jpg',
    },
// *** OTHER ITEMS
    { id: 'BETTER_BOOTS',
    type: 'armor',
    name: 'Better Boots',
    slot: 'feet',
    slot_name: 'Feet',
    rarity: 1,
    desc: 'Better feet protection. A tiny bit more comfortable.',
    gains: [
        { stat: 'armor', lbl: 'Armor', amt: 20 },
        { stat: 'agility', lbl: 'Agility', amt: 15 },
    ],
    cnt: 0,
    value: 5,
    img: 'media/icons/boots_01.jpg',
    },
    //
    { id: 'BETTER_HELMET',
    type: 'armor',
    name: 'Better Helm',
    slot: 'head',
    slot_name: 'Head',
    rarity: 1,
    desc: 'Better head protection, still not extraordinary.',
    gains: [
        { stat: 'armor', lbl: 'Armor', amt: 30 },
        { stat: 'strength', lbl: 'Strength', amt: 15 },
        { stat: 'intelligence', lbl: 'Intelligence', amt: 15 },
    ],
    cnt: 0,
    value: 0,
    img: 'media/icons/head_01.jpg',
    },
    //
    { id: 'MH_TEST_DAGGER',
    type: 'weapon',
    name: 'Test Dagger',
    slot: 'mh',
    slot_name: 'Mainhand',
    rarity: 4,
    desc: 'Overpowered.',
    gains: [
        { stat: 'dmg_min', amt: 8.9 },
        { stat: 'dmg_max', amt: 9.6 },
        { stat: 'constitution', lbl: 'Constitution', amt: 10 },
        { stat: 'agility', lbl: 'Agility', amt: 10 },
        { stat: 'criticalStrikeChance_melee', lbl: 'Melee Critical Strike Chance', amt: 0.05 },
    ],
    cnt: 0,
    value: 0,
    img: 'media/icons/mh_01.jpg',
    }
];

// Shpuld match indexes with saveData[0].killsData
export const locationsData = [
    // locationsData[i].kill_req_met: true/false
    { loc: 0, lbl: 'Starting Zone', lvl: 1, kills_req: 3,
    img: 'media/img_loc_0.jpg', }, // l = 0 ////

    { loc: 1, lbl: 'Dark Plains', lvl: 1, kills_req: 3,
    img: 'media/img_loc_1.jpg', }, // l = 0 +,1
    { loc: 1, lbl: 'Dark Plains', lvl: 2, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 3, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 4, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 5, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 6, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 7, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 8, kills_req: 3 },

    { loc: 2, lbl: 'Dark Highlands', lvl: 1, kills_req: 3,
    img: 'media/img_loc_2.jpg', },
    { loc: 2, lbl: 'Dark Highlands', lvl: 2, kills_req: 3 },
    { loc: 2, lbl: 'Dark Highlands', lvl: 3, kills_req: 3 }, // l = 10 + 1
    { loc: 2, lbl: 'Dark Highlands', lvl: 4, kills_req: 3 },

    { loc: 3, lbl: 'Dark Forest', lvl: 1, kills_req: 3,
    img: 'media/img_loc_3.jpg', },
    { loc: 3, lbl: 'Dark Forest', lvl: 2, kills_req: 3 },
    { loc: 3, lbl: 'Dark Forest', lvl: 3, kills_req: 3 }, // max = 14 + 1

    { loc: 4, lbl: 'END', lvl: 3, kills_req: 99 }, // placeholder
];

export const characterData = [
    // d_exp_filter = characterData.filter(c => c.type === 'exp');
    // d_exp = d_exp_filter[0];
    { /* experienceValues [] */ id: 'level_exp', type: 'exp', level_cap: 20, starting_val: 800, level_rate: 0.2 },
    { id: 'player_stats', /* playerStats.total_armor, etc */ }, // See character_setup()
    // let playerStats = characterData.find(d => d.id === 'player_stats');
    { id: 'player_combat_status', in_combat: false }, // See toggle_combat_status()
];

export const encounterData = [

    { id: 'beginner_0', loc: 0, lvl: 1, hp_min: 20, hp_max: 30, cur_health: 0, max_health: 0, log_cnt: 0, enemyDmg_min: 3, enemyDmg_max: 5, enemyNoCrit: 0.06,
        // encounterData[0]
        enemy_list: [
            { en: 'beginner_0', cat: 'enemy', cnt: 1, id: 'SLIME', lbl: 'Slime', type: 'elemental', lvl: 1, drops: [ { id: 'NPC_LOOT_SLIME', p: 0.8 }, { id: 'NPC_LOOT_SLIME_CHUNK', p: 0.2 }, ] },
            { en: 'beginner_0', cat: 'enemy', cnt: 1, id: 'ANGRY_LIZARD', lbl: 'Angry Lizard', type: 'beast', lvl: 1, drops: [ { id: 'NPC_LOOT_LIZARD_SCALE', p: 0.6 }, { id: 'NPC_LOOT_LIZARD_CLAW', p: 0.5 }, { id: 'NPC_LOOT_LIZARD_TAIL', p: 0.3}, ] },
            { en: 'beginner_0', cat: 'enemy', cnt: 1, id: 'LEPER_SCOUT', lbl: 'Leper Scout', type: 'humanoid', lvl: 1, drops: [ { id: 'NPC_LOOT_LEPER_BONE_FRAGMENT', p: 0.5 }, { id: 'GOLD', p: 0.6 }, { id: 'NPC_LOOT_LEPER_SMALL_SKULL', p: 0.4 }, { id: 'CLOTH_BASIC', p: 0.3 } ] },
        ] },
    // WIP dynamic entries
    // needs cnt
    // start_encounter()

    /*{ id: 'group_loc1', loc: 1, lvl: 1,
        enemy_list: [
            //
        ] },

    { id: 'group2' },*/
    // for add_loot() function
    { id: 'lootData', current_loot: [] },
    // any enemy can drop -- see f.add_global_drop()
    { cat: 'global_drops', id: 'GLOBAL_DROP1', drops: { 'GOLD': 0.1 } },
    { cat: 'global_drops', id: 'GLOBAL_DROP0', drops: { 'GOLD': 0.05 } },
    { id: 'enemyNames1', names: [
        { n: 'Shadowfiend', l: 'SF', type: 'shadow', u: false },
        { n: 'Flame Wraith', l: 'FW', type: 'elemental', u: false },
        { n: 'Ice Revenant', l: 'IR', type: 'elemental', u: false },
        { n: 'Void Stalker', l: 'VST', type: 'elemental', u: false },
        { n: 'Doom Serpent', l: 'DS', type: 'beast', u: false },
        { n: 'Storm Bringer', l: 'SB', type: 'elemental', u: false },
        { n: 'Blood Harpy', l: 'BH', type: 'humanoid', u: false },
        { n: 'Bone Golem', l: 'BG', type: 'undead', u: false },
        { n: 'Iron Behemoth', l: 'IB', type: 'mech', u: false },
        { n: 'Frost Lurker', l: 'FL', type: 'elemental', u: false },
        { n: 'Soul Leech', l: 'SL', type: 'undead', u: false },
        { n: 'Nightmare Hound', l: 'NH', type: 'beast', u: false },
        { n: 'Crimson Specter', l: 'CS', type: 'undead', u: false },
        { n: 'Ghoul King', l: 'GK', type: 'undead', u: false },
        { n: 'Ash Demon', l: 'AD', type: 'elemental', u: false },
        { n: 'Wraith Knight', l: 'WK', type: 'shadow', u: false },
        { n: 'Venomous Slime', l: 'VSLIME', type: 'elemental', u: false },
        { n: 'Blight Fiend', l: 'BF', type: 'shadow', u: false },
        { n: 'Crystal Drake', l: 'CD', type: 'dragon', u: false },
        { n: 'Necrotic Crawler', l: 'NC', type: 'shadow', u: false },
        { n: 'Thunder Wyrm', l: 'TW', type: 'beast', u: false },
        { n: 'Dark Harbinger', l: 'DH', type: 'shadow', u: false },
        { n: 'Lava Elemental', l: 'LE', type: 'elemental', u: false },
        { n: 'Obsidian Guardian', l: 'OG', type: 'elemental', u: false }
        ]
    },
    { id: 'experience', experienceGains: [] },
    //
];

// trackingData[0] only
export var trackingData = [];

// Add initial tracking data
export function init_trackingData() {

    trackingData = [ { loc: 0 }, { lvl: 0 } ];
    // For toggle_section() from general_functions.js
    trackingData[0].t_gather_section = false;
    trackingData[0].t_character_stats_section = false;
    trackingData[0].t_battle_section = false;
    trackingData[0].t_inventory_section = false;
    trackingData[0].t_character_section = false;
    trackingData[0].init_run = true;
}