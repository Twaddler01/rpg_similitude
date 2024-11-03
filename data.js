// data.js

// for element creation
export const elementsData = [
    // section_cat: true -> section-attached elements only
    // fetch_cat: true -> get parent from DOM only (child elements)
    // hidden: true -> to hide immediately
    // css_class: '' -> add css class to div
    // css_class2: '' -> add on a 2nd css class
    // on_click: true -> add click event to id

    // section
    { id: 'messages_section',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    content: 'Game Messages',
    css_class: 'h1_yellow_font',
    },
        // attach (messages_section)
        { id: 'messages_section_container',
        section_cat: true,
        fetch_cat: true,
        type: 'div',
        parent_el: 'messages_section',
        css_class: 'location_box_style',
        },
    // character equipment section
    /*{ id: 'character_section',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    content: 'Character Section <span class="normal">[ SHOW ]</span>',
    css_class: 'h1_yellow_font',
    on_click: true,
    },
    { id: 'character_container',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    css_class: 'location_box_style',
    },*/
    // character stats section
    /*{ id: 'character_stats_section',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    content: 'Character Stats <span class="normal">[ SHOW ]</span><div id="space" style="background-color:#333;width:100%;padding:5px"></div>',
    css_class: 'h1_yellow_font',
    on_click: true,
    },
    { id: 'character_stats_container',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    css_class: 'location_box_style',
    },*/
    // battle section
    { id: 'battle_section',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    content: 'Battle Section <span class="normal">[ SHOW ]</span><div id="space" style="background-color:#333;width:100%;padding:5px"></div>',
    css_class: 'h1_yellow_font',
    }, 
    { id: 'battle_section_container',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    },
        // attach (battle_section_container)
        { id: 'location_container',
        section_cat: true,
        fetch_cat: true,
        type: 'div',
        parent_el: 'battle_section_container',
        css_class: 'location_box_style',
        },
        // attach (location_container)
        // update_locations() -> 'attack_box_button'
        // update_locations() -> 'change_location_button'
        // attach (battle_section_container)
        { id: 'battle_ui_container',
        section_cat: true,
        fetch_cat: true,
        type: 'div',
        parent_el: 'battle_section_container',
        },
    // imventory section
    { id: 'inventory_section',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    content: 'Inventory Section <span class="normal">[ SHOW ]</span><div id="space" style="background-color:#333;width:100%;padding:5px"></div>',
    css_class: 'h1_yellow_font',
    },
    { id: 'inventory_section_container',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    },
    // section
    { id: 'new_section',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    content: 'NEW Section',
    css_class: 'h1_yellow_font',
    },

    // section
    { id: 'test_section',
    section_cat: true,
    type: 'div',
    parent_el: 'body',
    content: 'TEST Section',
    css_class: 'h1_yellow_font',
    },
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
    { id: 'armor', type: 'stat', amt: 100, label: 'Armor: ', lvl_mod: true, lvl_amt: 100, base: 100 }, // lvl_mod -> increases with level to lvl_amt
    { id: 'strength', type: 'stat', amt: 10, label: 'Strength: ', lvl_mod: true, lvl_amt: 10, base: 10 },
    { id: 'intelligence', type: 'stat', amt: 10, label: 'Intelligence: ', lvl_mod: true, lvl_amt: 10, base: 10 },
    { id: 'dexterity', type: 'stat', amt: 10, label: 'Dexterity: ', lvl_mod: true, lvl_amt: 10, base: 10 },
    { id: 'constitution', type: 'stat', amt: 10, label: 'Constitution: ', lvl_mod: true, lvl_amt: 10, base: 10 },
    { id: 'agility', type: 'stat', amt: 10, label: 'Agility: ', lvl_mod: true, lvl_amt: 10, base: 10 },
    { id: 'wisdom', type: 'stat', amt: 10, label: 'Wisdom: ', lvl_mod: true, lvl_amt: 10, base: 10 },
    { id: 'power', type: 'stat', amt: 0.0, label: 'Power: ', lvl_amt: 0, base: 0 },
    { id: 'attackMinimum', type: 'stat', amt: 1.2, label: 'Attack Minimum: ', lvl_amt: 0, base: 1.2 },
    { id: 'attackMaximum', type: 'stat', amt: 1.6, label: 'Attack Maximum: ', lvl_amt: 0, base: 1.6 }, // stat_attack_min * 1.5
    { id: 'hitChance', type: 'stat', amt: 0.0, label: 'Hit Chance: ', base: 0 },
    { id: 'criticalStrikeChance', type: 'stat', amt: 0.0, label: 'Critical Strike Chance: ', lvl_amt: 5, base: 0 }, // bsse stats: [0] - [12]
    // desc
    { id: 'armor', label: 'Armor', type: 'desc', def: 'Reduces damage received by 0.1% per point.' },
    { id: 'strength', label: 'Strength', type: 'desc', def: 'Increases melee damage dealt by 0.1% per point and total energy by both 0.1 per base level amount and 1 per equipment bonus point.' },
    { id: 'intelligence', label: 'Intelligence', type: 'desc', def: 'Increases magic damage dealt by 0.1% and total mana by 10 per point.' },
    { id: 'dexterity', label: 'Dexterity', type: 'desc', def: 'Increases hit chance by 0.1% per point above base amount. Default hit chance is 90%, or 100% at 100+ dex' },
    { id: 'constitution', label: 'Constitution', type: 'desc', def: 'Increases total maximum health by 10 per point.' },
    { id: 'agility', label: 'Agility', type: 'desc', def: 'Increases melee critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
    { id: 'wisdom', label: 'Wisdom', type: 'desc', def: 'Increases magic critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
    { id: 'power', label: 'Power', type: 'desc', def: 'Increases both attack damage minimum and maximum per turn.' },
    { id: 'attackMinimum', label: 'Attack Minimum', type: 'desc', def: 'Minimum damage caused for each hit per turn.' },
    { id: 'attackMaximum', label: 'Attack Maximum', type: 'desc', def: 'Maximim damage caused for each hit per turn.' },
    { id: 'hitChance', label: 'Hit Chance', type: 'desc', def: 'The probability an attack will cause damage or miss. 100% hit chance guarantees a hit if enemy level is less than or equal to player&apos;s current level. Hit chance decreases for each enemy level above the player&apos;s level.' },
    { id: 'criticalStrikeChance', label: 'Critical Strike Chance', type: 'desc', def: 'The probability a successful attack is critical. Critical strikes cause double the regular damage.' },
    // misc
    // d_exp_filter = characterData.filter(c => c.type === 'exp');
    // d_exp = d_exp_filter[0];
    { /* experienceValues [] */ id: 'level_exp', type: 'exp', level_cap: 20, starting_val: 800, level_rate: 0.2 },
    { id: 'player_stats', /* playerStats.total_armor, etc */ }, // See character_setup() 
    // let playerStats = characterData.find(d => d.id === 'player_stats');
    { id: 'player_combat_status', in_combat: false }, // See toggle_combat_status()
];

export const encounterData = [

        { id: 'beginner_0', loc: 0, lvl: 1, hp_min: 20, hp_max: 30, cur_health: 0, max_health: 0, log_cnt: 0, enemyDmg_min: 3, enemyDmg_max: 4, enemyNoCrit: 0.06, 
            // encounterData[0]
            enemy_list: [
                { en: 'beginner_0', cat: 'enemy', id: 'SLIME', lbl: 'Slime', type: 'elemental', lvl: 1, drops: [ { id: 'NPC_LOOT_SLIME', p: 0.8 }, { id: 'NPC_LOOT_SLIME_CHUNK', p: 0.2 }, ] },
                { en: 'beginner_0', cat: 'enemy', id: 'ANGRY_LIZARD', lbl: 'Angry Lizard', type: 'beast', lvl: 1, drops: [ { id: 'NPC_LOOT_LIZARD_SCALE', p: 0.6 }, { id: 'NPC_LOOT_LIZARD_CLAW', p: 0.5 }, { id: 'NPC_LOOT_LIZARD_TAIL', p: 0.3}, ] },
                { en: 'beginner_0', cat: 'enemy', id: 'LEPER_SCOUT', lbl: 'Leper Scout', type: 'humanoid', lvl: 1, drops: [ { id: 'NPC_LOOT_LEPER_BONE_FRAGMENT', p: 0.5 }, { id: 'GOLD', p: 0.6 }, { id: 'NPC_LOOT_LEPER_SMALL_SKULL', p: 0.4 }, { id: 'CLOTH_BASIC', p: 0.3 } ] },
            ] }, 
        // WIP dynamic entries
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

export var saveData = [
    // saveData[0].killsData
    { killsData: [ // added to locationsData array
        { kills: 3 }, // l = 0
        { kills: 3 }, // l = 0 + 1
        { kills: 3 },
        { kills: 3 },
        { kills: 3 },
        { kills: 4 },
        { kills: 5 },
        { kills: 6 },
        { kills: 7 },
        { kills: 8 },
        { kills: 9 },
        { kills: 10 }, // l = 10 + 1
        { kills: 11 },
        { kills: 12 },
        { kills: 13 },
        { kills: 14 }, // max = 14 + 1
        { kills: 15 }, // placeholder
        ] },
    // saveData[1].savedCharacterData[0]
    { savedCharacterData: [
        // SC: Char created
        { char_created: true, 
        char_name: 'Legolas', 
        char_race: 'Human', 
        char_class: 'Fighter', 
        char_level: 1,
        char_exp: 0, 
        // SC: Char not created
        /*{ char_created: false, 
        char_name: null, 
        char_race: null, 
        char_class: null, 
        char_level: 1, 
        char_exp: 0, */
        
        // Others: see playerStats = characterData.find(d => d.id === 'player_stats')
        // char_exp_to_level -> see new_battle_button()
        },
        ] },
    // saveData[2].inventoryData
    { inventoryData: [ // slots added below
        { /* size: see inventoryMaxSlots above */ 
          setup: false,
          full: false,
        },
        { type: 'slot', slot_id: 1, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 2, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 3, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 4, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 5, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 6, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 7, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 8, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 9, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 10, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 11, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 12, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 13, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 14, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 15, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 16, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 17, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 18, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 19, contents: '[ EMPTY ]', cnt: 0 },
        { type: 'slot', slot_id: 20, contents: '[ EMPTY ]', cnt: 0 },
    ] },
    // saveData[3].equippedData
    { equippedData: [ 
        { id: 'head' , equipped: 'BASIC_HELMET', }, // l = 0
        { id: 'shoulders', equipped: null },
        { id: 'hands', equipped: null },
        { id: 'neck', equipped: null },
        { id: 'waist', equipped: null },
        { id: 'chest', equipped: 'BASIC_CHESTPIECE' },
        { id: 'legs', equipped: null },
        { id: 'wrist', equipped: null },
        { id: 'feet', equipped: 'BASIC_BOOTS' },
        { id: 'ring1', equipped: null },
        { id: 'ring2', equipped: null },
        { id: 'mh', equipped: 'MH_TEST_DAGGER' },
        { id: 'oh', equipped: null },
        ] },
    // saveData[4].currencyData[0]
    { currencyData: [
        { id: 'GOLD', cnt: 800, name: 'Gold' },
        ] },
    // saveData[5].gatherData
    { gatherData: [
        { id: 'herbgather', learned: false, lvl: 1, xp_amt: 0,
        inventory: [
            { cnt: 0 },
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }, 
            { cnt: 0 }
        ] },
        { id: 'oremine', learned: false, lvl: 1, xp_amt: 0, 
        inventory: [ 
            { id: 'copper', cnt: 0 }
        ] },
        { id: 'tailor', learned: false, lvl: 1, xp_amt: 0, 
        inventory: [ 
            { id: 'basic_cloth', cnt: 0 }
        ] }
    ] }
];

// Matches indices of saveData[5].gatherData
export const gatherData = [
    { id: 'herbgather', name: 'Herb Gathering', cost: 200, gather_str: 4, gather_str_mult: 1.08, xp_lvl_mult: 1.5,
    materials: [ 
        { id: 'greenleaf', name: 'Green Leaf', hp: 10, lvl_req: 0 }, // 100
        { id: 'jadeleaf', name: 'Jade Leaf', hp: 200, lvl_req: 2 },
        { id: 'goldenclove', name: 'Golden Clove', hp: 200, lvl_req: 5 },
        { id: 'foxglove', name: 'Fox Glove', hp: 200, lvl_req: 5 },
        { id: 'thornypike', name: 'Thorny Pike', hp: 200, lvl_req: 5 },
        { id: 'deathglory', name: 'Death Glory', hp: 200, lvl_req: 5 },
        { id: 'morningglade', name: 'Morning Glade', hp: 200, lvl_req: 5 },
        { id: 'judegloom', name: 'Jude Gloom', hp: 200, lvl_req: 5 },
        { id: 'nightblade', name: 'Night Blade', hp: 200, lvl_req: 5 },
        { id: 'bloodroot', name: 'Blood Root', hp: 200, lvl_req: 5 },
        { id: 'elderberry', name: 'Elder Berry', hp: 200, lvl_req: 5 },
    ] },
    { id: 'oremine', name: 'Ore Mining', cost: 200,
    materials: [
        { id: 'copper', name: 'Copper', hp: 100, lvl_req: 1 },
    ], },
    // WIP: Replace with a different gathering skill
    { id: 'tailor', name: 'Tailor', cost: 200, 
    materials: [
        { id: 'basic_cloth', name: 'Basic Cloth', hp: 100, lvl_req: 1 }
    ] }
];

// Add dynamic data to gatherData
export function init_gatherData() {

    // Add dynamic img urls
    gatherData.forEach(gather => {
        let mats = gather.materials;
        if (gather.name === 'Herb Gathering') {
            for (let i = 0; i < mats.length; i++) {
                if (i < 10) {
                    mats[i].img = 'media/icons/gather/herb_0' + i + '.png';
                } else {
                    mats[i].img = 'media/icons/gather/herb_' + i + '.png';
                }
            }
        }
        if (gather.name === 'Ore Mining') {
            for (let i = 0; i < mats.length; i++) {
                if (i < 10) {
                    mats[i].img = 'media/icons/gather/mine_0' + i + '.png';
                } else {
                    mats[i].img = 'media/icons/gather/mine_' + i + '.png';
                }
            }
        }
        if (gather.name === 'Tailor') {
            for (let i = 0; i < mats.length; i++) {
                if (i < 10) {
                    mats[i].img = 'media/icons/gather/tail_0' + i + '.png';
                } else {
                    mats[i].img = 'media/icons/gather/tail_' + i + '.png';
                }
            }
        }
    });
}

// trackingData[0] only
export var trackingData = [];
// trackingData[0].loc (int)
// trackingData[0].lvl (int)
// trackingData[0].currentLocation (int)
// trackingData[0].location (string)
// trackingData[0].kills (int)
// trackingData[0].character_created (bool: false)
// trackingData[0].starting_equip_added (bool: false)
// trackingData[0].currentTooltip (element); // Store the currently open tooltip container
// trackingData[0].currentTooltipElement (bool); // Store the element that triggered the current tooltip
// trackingData[0].tooltipTargetElementId (element)
// trackingData[0].current_weapon_dmg_min (float)
// trackingData[0].current_weapon_dmg_max (float)
// trackingData[0].pwr_weapon_min (float)
// trackingData[0].pwr_weapon_max (float)

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

// Additional one-time data modifications
function initilize_extras() {
    // ONLY NEEDED OUTSIDE OF LOADING JSON
    // add .slot to equippedData
    let equippedItems = saveData[3].equippedData;
    equippedItems.forEach(equip_slot => {
        equip_slot.slot = equip_slot.id;
    });
    
    // elementsData
    for (let i = 0; i < elementsData.length; i++) {
        const elementsIndex = elementsData[i];
        const elementsDataUpdates = {};
        //elementsIndex.content_id = elementsIndex.id + '_content_id';
        // Assign updates to resourcesIndex properties
        Object.assign(elementsIndex, elementsDataUpdates);
    }
}

initilize_extras();