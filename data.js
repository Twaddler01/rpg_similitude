// data.js

// for element creation
export function init_elementsData() {

    const elementsData = [
        // section_cat: true -> section-attached elements only
        // fetch_cat: true -> get parent from DOM only (child elements)
        // hidden: true -> to hide immediately
        // css_class: '' -> add css class to div
        // css_class2: '' -> add on a 2nd css class
        // on_click: true -> add click event to id

        // section
        { id: 'title_section',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        content: 'RPG Similitude: Just another RPG.',
        css_class: 'h1',
        },
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
        { id: 'character_section',
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
        },
        // character stats section
        { id: 'character_stats_section',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        content: 'Character Stats <span class="normal">[ SHOW ]</span><div style="background-color:#333;width:100%;padding:5px"></div>',
        css_class: 'h1_yellow_font',
        on_click: true,
        },
        { id: 'character_stats_container',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        css_class: 'location_box_style',
        },
        // battle section
        { id: 'battle_section',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        content: 'Battle Section <span class="normal">[ SHOW ]</span><div style="background-color:#333;width:100%;padding:5px"></div>',
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
            // attach (battle_section_container)
            { id: 'new_battle_container',
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            },
                // attach (new_battle_container)
                { id: 'new_battle_button',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'new_battle_container',
                content: '<b><font style="font-size: 24px;">[ NEW BATTLE ]</font></b>',
                css_class: 'location_box_style',
                css_class2: 'center',
                hidden: 'true',
                on_click: true, // click event
                },
                { id: 'battle_message_div',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'new_battle_container',
                css_class: 'normal',
                },
            // attach (battle_section_container)
            { id: 'change_location_button', // replaced by new_battle_button below
            section_cat: true,
            fetch_cat: true,
            type: 'button',
            parent_el: 'battle_section_container',
            content: '<b><font style="font-size: 24px;"> CHANGE LOCATION </font></b>',
            css_class: 'location_box_style',
            css_class2: 'center',
            hidden: true,
            },
            // attach (battle_section_container)
            { id: 'attack_box_button', // replaced by new_battle_button below
            section_cat: true,
            fetch_cat: true,
            type: 'button',
            parent_el: 'battle_section_container',
            content: '<b><font style="font-size: 24px;"> ATTACK </font></b>',
            css_class: 'location_box_style',
            css_class2: 'center',
            hidden: true,
            on_click: true, // click event
            },
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
        content: 'Inventory Section <span class="normal">[ SHOW ]</span><div style="background-color:#333;width:100%;padding:5px"></div>',
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

    // Iterate over the array and set other variables dynamically
    for (let i = 0; i < elementsData.length; i++) {
        const elementsIndex = elementsData[i];
        const elementsDataUpdates = {};
        //elementsIndex.content_id = elementsIndex.id + '_content_id';
        // Assign updates to resourcesIndex properties
        Object.assign(elementsIndex, elementsDataUpdates);
    }

    return elementsData;
}

export function init_equipmentElements() {

    const equipmentElements = [
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

    return equipmentElements;
}

const inventoryMaxSlots = 20;
export function init_inventoryElements() {

    var inventoryElements = [
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

    return inventoryElements;
}

export function init_itemData() {

    const itemData = [
        // rarity: 0 = junk (lightgray)
        // rarity: 1 = common (white)
        // rarity: 2 = uncommon (green)
        // rarity: 3 = rare (lightblue)
        // rarity: 4 = epic (pink)
        // rarity: 5 = legendary (orange)
        // rarity: 6 = ancient (lightred)

        /* inInventory = true -> item was processed in
         * inventory array (inventoryData[0].current_loot) */
        { id: 'GOLD',
        type: 'currency',
        name: 'Gold',
        cnt: 0,
        },
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
// *** ENEMY LOOT
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
// NEW
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
        player_equipped: true,
        rarity: 0,
        desc: 'Basic head protection, nothing extraordinary.',
        gains: [ 
            { stat: 'armor', lbl: 'Armor', amt: 10 },
            { stat: 'strength', lbl: 'Strength', amt: 1 },
            { stat: 'intelligence', lbl: 'Intelligence', amt: 1 },
        ],
        //gains: [ {stat: 'Armor', amt: 10 }, { stat: 'Constitution', amt: 1 } ],
        cnt: 0,
        value: 0,
        iSlot: 'eH',
        img: 'media/icons/head_01.jpg',
        },
        //
        { id: 'BASIC_CHESTPIECE',
        type: 'armor',
        name: 'Basic Chestpiece',
        slot: 'chest',
        slot_name: 'Chest',
        player_equipped: true,
        rarity: 0,
        desc: 'Basic chest protection. Not very stylish.',
        gains: [ 
            { stat: 'armor', lbl: 'Armor', amt: 20 },
            { stat: 'wisdom', lbl: 'Wisdom', amt: 2 },
        ],
        cnt: 0,
        value: 0,
        iSlot: 'eCh',
        img: 'media/icons/chest_01.jpg',
        },
        //
        { id: 'BASIC_GLOVES',
        type: 'armor',
        name: 'Basic Gloves',
        slot: 'hands',
        slot_name: 'Hands',
        player_equipped: true,
        rarity: 0,
        desc: 'Basic hand protection. Almost as good as junk...almost.',
        gains: [ 
            { stat: 'armor', lbl: 'Armor', amt: 10 },
            { stat: 'power', lbl: 'Power', amt: 5 },
        ],
        cnt: 0,
        value: 0,
        iSlot: 'eGl',
        img: 'media/icons/gloves_01.jpg',
        },
        //
        { id: 'BASIC_BOOTS',
        type: 'armor',
        name: 'Basic Boots',
        slot: 'feet',
        slot_name: 'Feet',
        player_equipped: true,
        rarity: 0,
        desc: 'Basic feet protection. Not very comfortable.',
        gains: [ 
            { stat: 'armor', lbl: 'Armor', amt: 10 },
            { stat: 'dexterity', lbl: 'Dexterity', amt: 5 },
        ],
        cnt: 0,
        value: 0,
        iSlot: 'eF',
        img: 'media/icons/boots_01.jpg',
        },
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
        iSlot: 'eF',
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
        iSlot: 'eMH',
        img: 'media/icons/mh_01.jpg',
        },
    ];

    return itemData;
}

// Shpuld match indexes with saveData[0].killsData
export function init_locationsData() {

    const locationsData = [
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
    
    return locationsData;
}

export function init_characterData() {

    const characterData = [
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
    
    return characterData;
}

export function init_encounterData() {
    
    const encounterData = [

        { id: 'beginner_0', loc: 0, lvl: 1, hp_min: 20, hp_max: 30, cur_health: 0, max_health: 0, log_cnt: 0, enemyDmg_min: 1, enemyDmg_max: 2, enemyNoCrit: 0.06, 
            // encounterData[0]
            enemy_list: [
                { en: 'beginner_0', cat: 'enemy', id: 'SLIME', lbl: 'Slime', type: 'elemental', lvl: 1, drops: [ { id: 'NPC_LOOT_SLIME', p: 0.8 }, { id: 'NPC_LOOT_SLIME_CHUNK', p: 0.2 }, ] },
                { en: 'beginner_0', cat: 'enemy', id: 'ANGRY_LIZARD', lbl: 'Angry Lizard', type: 'beast', lvl: 1, drops: [ { id: 'NPC_LOOT_LIZARD_SCALE', p: 0.6 }, { id: 'NPC_LOOT_LIZARD_CLAW', p: 0.5 }, { id: 'NPC_LOOT_LIZARD_TAIL', p: 0.3}, ] },
                { en: 'beginner_0', cat: 'enemy', id: 'LEPER_SCOUT', lbl: 'Leper Scout', type: 'humanoid', lvl: 1, drops: [ { id: 'NPC_LOOT_LEPER_BONE_FRAGMENT', p: 0.5 }, { id: 'GOLD', p: 0.6 }, { id: 'NPC_LOOT_LEPER_SMALL_SKULL', p: 0.4 }, { id: 'CLOTH_BASIC', p: 0.3 } ] },
                // any enemy can drop
                { cat: 'global', id: 'GLOBAL_DROP1', drops: { 'GOLD': 0.1, 'BETTER_BOOTS': 0.08 } },
            ] }, 
        // WIP dynamic entries
        // start_encounter()
        { id: 'group_loc1',
            enemy_list: [
                //
            ] },
        
        { id: 'group2' },
        // for add_loot() function
        { id: 'lootData', current_loot: [] },
        { id: 'enemyNames', names: [ 
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

    return encounterData;
}

export function init_saveData() {

    const saveData = [
    // saveData[0]
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
    // saveData[1]
    { savedCharacterData: [ // to be added to static characterData array
        // savedCharacterData[0]
        { char_name: 'Legolas',
        char_race: 'Human',
        char_class: 'Fighter',
        char_level: 1,
        char_exp: 0, 
        // Others: see playerStats = characterData.find(d => d.id === 'player_stats')
        // char_exp_to_level -> see new_battle_button()
        },
        ] },
    // saveData[2]
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
    // saveData[3]
    { equippedData: [ // to be added to static array?
        { id: 'head' , equipped: 'BASIC_HELMET' }, // l = 0
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
        { id: 'mh', equipped: 'MH_BASIC_DAGGER' },
        { id: 'oh', equipped: null },
        ] },
    // saveData[4].currencyData[0]
    { currencyData: [
        { id: 'GOLD', cnt: 0, name: 'Gold' },
        ] },
    ];

    //console.log(saveData[0]); // with 'killsData'
    //console.log(saveData[1]); // with 'characterData'
    //console.log(saveData[2]); // with 'inventoryData'
    //console.log(saveData[0].killsData); // like a standalone array
    //console.log(saveData[1].savedCharacterData); // like a standalone array
    //console.log(saveData[2].inventoryData); // like a standalone array
    //console.log(saveData[0].killsData[0]); // for array lengths
////
    // update equipment ids
    let equippedItems = saveData[3].equippedData;

    // add .slot to array
    equippedItems.forEach(equip_slot => {
        equip_slot.slot = equip_slot.id;
    });

    equippedItems.forEach(slot_data => {
        const d_itemData = itemData.find(i => i.id === slot_data.equipped);
        if (d_itemData) {
            slot_data.equipped = d_itemData.id;
            equipmentElements.e_slot_container = 'equip_slot_' + slot_data.id;
        } else {
            let empty_slot = 'equip_slot_EMPTY_' + slot_data.slot;
            slot_data.id = empty_slot;
            equipmentElements.e_slot_container = slot_data.id;
        }
    });
////
    return saveData;
}

export function init_trackingData() {

    const trackingData = [
        // trackingData[0]
        { loc: 0 }, // (int)
        { lvl: 0 }, // (int)
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
        // *** stats WIP -- ***most will go to characterData array
        // trackingData[0].stat_armor (int)
        // trackingData[0].stat_strength (int)
        // trackingData[0].stat_intelligence (int)
        // trackingData[0].stat_dexterity (int)
        // trackingData[0].stat_constitution (int)
        // trackingData[0].stat_agility (int)
        // trackingData[0].stat_wisdom (int)
        // trackingData[0].stat_power (int) ???
    ];

    return trackingData;
}

export const elementsData = init_elementsData();
//export const battleData = init_battleData();
export const equipmentElements = init_equipmentElements();
export var inventoryElements = init_inventoryElements();
export const itemData = init_itemData();
//export const locationData = init_locationData();
export const locationsData = init_locationsData();
export const characterData = init_characterData();
export const encounterData = init_encounterData();
export const saveData = init_saveData();
export const trackingData = init_trackingData();
