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

// **** section *****

        /* ELEMENT STRUCTURE:
            #character_section
                #character_container
                    #character_entry
                        #name
                        #race
                        #class
        */

        // section
        { id: 'character_section',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        content: 'Character Section',
        css_class: 'h1_yellow_font',
        },
        { id: 'character_container',
        section_cat: true,
        fetch_cat: true,
        type: 'div',
        parent_el: 'character_section',
        css_class: 'location_box_style',
        },

// **** section *****
        { id: 'battle_section',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        content: 'Battle Section',
        css_class: 'h1_yellow_font',
        }, 
            // attach (battle_section)
            { id: 'battle_section_container',
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section',
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
                { id: 'location_title',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'location_container',
                css_class: 'location_box_style',
                },
            // attach (battle_section_container)
            { id: 'start_battle_container',
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            },
                // attach (start_battle_container)
                { id: 'start_battle_button',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'start_battle_container',
                content: '<b><font style="font-size: 24px;">[ START BATTLE ]</font></b>',
                css_class: 'location_box_style',
                css_class2: 'center',
                hidden: 'true',
                on_click: true, // click event
                },
                { id: 'battle_message_div',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'start_battle_container',
                css_class: 'normal',
                },
                
            // attach (battle_section_container)
            { id: 'attack_box_button', // replaced by start_battle_button below
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            content: '<b><font style="font-size: 24px;">[ ATTACK ]</font></b>',
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
            // attach (battle_section_container)
            { id: 'combat_log',
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            content: '<p style="font-size: 24px;">COMBAT LOG</p>',
            css_class: 'normal',
            hidden: true,
            },

        // section
        { id: 'inventory_section',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        content: 'Inventory Section',
        css_class: 'h1_yellow_font',
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

/*
        // tables
        { id: 'battle_table',
        table_cat: true,
        parent_el: 'battle_section',
        cols: 4,
        rows: 3,
        // row header
        content1_1: 'Location',
        content1_2: 'Level',
        content1_3: 'Name',
        content1_4: '',
        // row 2
        content2_1: 'Plains',
        content2_2: '1',
        content2_3: 'Goblin Scout',
        content2_4: 'ATTACK',
        // row 3
        content3_1: 'Plains',
        content3_2: '1',
        content3_3: 'Goblin Sorcerer',
        content3_4: 'ATTACK',
        css_class: 'normal' },
*/
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

// **** OLD DATA ****
/*
export function init_locationData() {

    const locationData = [
        { id: '01_DARK_PLAINS',
        loc_num: 1,
        level_num: 1,
        type: 'encounter',
        label: 'Dark Plains',
        kills_to_next_level: 3,
        //total_levels: 8,
        level_data: [
          { id: 1, mult: 1.0, kills_to_next_level: 3 },
          { id: 2, mult: 1.2, kills_to_next_level: 3 },
          { id: 3, mult: 1.4, kills_to_next_level: 3 },
          { id: 4, mult: 1.6, kills_to_next_level: 3 },
          { id: 5, mult: 1.8, kills_to_next_level: 3 },
          { id: 6, mult: 2.0, kills_to_next_level: 3 },
          { id: 7, mult: 2.2, kills_to_next_level: 3 },
        ],
        level_mult: 1.2,
        enemy: 'enemy_group_1', // characterData.id ('enemy_group_1')
        hp_low: 20,
        hp_high: 30,
        dmg_low: 3,
        dmg_high: 6,
        top_loc: true,
        },
        { id: '02_DARK_HIGHLANDS',
        loc_num: 2,
        level_num: 0,
        type: 'encounter',
        label: 'Dark Highlands',
        kills_to_next_level: 3,
        //total_levels: 8,
        level_data: [
          { id: 1, mult: 2.4, kills_to_next_level: 3 },
          { id: 2, mult: 2.6, kills_to_next_level: 3 },
          { id: 3, mult: 2.8, kills_to_next_level: 3 },
          { id: 4, mult: 3.0, kills_to_next_level: 3 },
          { id: 5, mult: 3.2, kills_to_next_level: 3 },
          { id: 6, mult: 3.4, kills_to_next_level: 3 },
          { id: 7, mult: 3.6, kills_to_next_level: 3 },
          { id: 8, mult: 3.8, kills_to_next_level: 3 },
          { id: 9, mult: 4.0, kills_to_next_level: 3 },
        ],
        level_mult: 1.2,
        hp_low: 20,
        hp_high: 30,
        dmg_low: 3,
        dmg_high: 6,
        },
        { id: '03_DARK_FOREST',
        loc_num: 3,
        level_num: 0,
        type: 'encounter',
        label: 'Dark Forest',
        kills_to_next_level: 3,
        //total_levels: 8,
        level_data: [
          { id: 1, mult: 4.2, kills_to_next_level: 3 },
          { id: 2, mult: 4.4, kills_to_next_level: 3 },
          { id: 3, mult: 4.6, kills_to_next_level: 3 },
          { id: 4, mult: 4.8, kills_to_next_level: 3 },
          { id: 5, mult: 5.0, kills_to_next_level: 3 },
          { id: 6, mult: 5.2, kills_to_next_level: 3 },
          { id: 7, mult: 5.4, kills_to_next_level: 3 },
          { id: 8, mult: 5.6, kills_to_next_level: 3 },
        ],
        level_mult: 1.2,
        hp_low: 20,
        hp_high: 30,
        dmg_low: 3,
        dmg_high: 6,
        },
    ];

    let num = 1;
    // Iterate over the array and set other variables dynamically
    for (let i = 0; i < locationData.length; i++) {
        const locationIndex = locationData[i];
        const locationUpdates = {};

        for (let level = 1; level <= locationIndex.total_levels; level++) {
            //loc_01_DARK_PLAINS_level_1 ... 8
            //loc_02_DARK_HIGHLANDS_level_1 ... 8
            //loc_03_DARK_FOREST_level_1 ... 8
            locationIndex.loc_levels = 'loc_' + locationIndex.id + '_level_' + level;
            locationIndex.level_multiplier = 1 + Math.round((num * 0.1) * 10) / 10;
            num++;
            //console.log(locationIndex.loc_levels + ':' + locationIndex.level_multiplier);
        }
        // Assign updates to locationIndex properties
        Object.assign(locationIndex, locationUpdates);
    }

    return locationData;
}

export function init_battleData() {

    const battleData = [
        { id: 'location',
        // for tracking
        loc_num_selected: 0, // temp??
        lvl_num_selected: 0, // temp??
        max_levels: 0, 
        loc_unlocked: 1, // location
        lvl_unlocked: 6, // level
        /*kill_data: [
          { id: 1.1, cnt: 0, unlocked: true },
          { id: 1.2, cnt: 0 },
          { id: 1.3, cnt: 0 },
          { id: 1.4, cnt: 0 },
          { id: 1.5, cnt: 0 },
          { id: 1.6, cnt: 0 },
          { id: 1.7, cnt: 0 },
          { id: 1.8, cnt: 0 },
          { id: 2.1, cnt: 0 },
          { id: 2.2, cnt: 0 },
          { id: 2.3, cnt: 0 },
          { id: 2.4, cnt: 0 },
          { id: 2.5, cnt: 0 },
          { id: 2.6, cnt: 0 },
          { id: 2.7, cnt: 0 },
          { id: 2.8, cnt: 0 },
          { id: 3.1, cnt: 0 },
          { id: 3.2, cnt: 0 },
          { id: 3.3, cnt: 0 },
          { id: 3.4, cnt: 0 },
          { id: 3.5, cnt: 0 },
          { id: 3.6, cnt: 0 },
          { id: 3.7, cnt: 0 },
          { id: 3.8, cnt: 0 }, ],*/ /*
        },
        // names
        { id: '01_names',
        type: 'names',
        difficulty: [ 'Normal', 'Elite', 'Master' ],
        first: [ 'Goblin', 'Orc', 'Ogre' ],
        last: [ 'Scout', 'Fighter', 'Archer', 'Wizard' ],
        },
        // combat divs
        { id: 'combat_div_',
        cnt: 0,
        cap: 30,
        },
    ];

    // Iterate over the array and set other variables dynamically
    for (let i = 0; i < battleData.length; i++) {
        const battleIndex = battleData[i];
        const battleDataUpdates = {};
        battleIndex.battle_div_id = battleIndex.id + '_battle_div_id';
        // Assign updates to resourcesIndex properties
        Object.assign(battleIndex, battleDataUpdates);
    }

    return battleData;
}

export function init_characterData() {

    const characterData = [
        { id: 'my_character',
        char_img: '',
        name: 'Legalos',
        level: 1,
        char_race: 'Human',
        char_class: 'Fighter',
        stat_base_armor: 100,
        stat_armor_desc: 'Reduces damage taken by 0.1% per point above base amount.',
        stat_base_str: 10,
        stat_str_desc: 'Increases both melee damage dealt by 0.1% and total energy by 10 per point above base amount.',
        stat_base_int: 10,
        stat_int_desc: 'Increases both magic damage dealt by 0.1% and total mana by 10 per point above base amount.',
        stat_base_dex: 10,
        stat_dex_desc: 'Increses hit chance by 0.1% per point above base amount. Default hit chance is 90%, or 100% at 100+ dex',
        stat_base_con: 10,
        stat_con_desc: 'Increases health by 0.1% per point above base amount.',
        stat_base_agi: 10,
        stat_agi_desc: 'Increases melee critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.',
        stat_base_wis: 10,
        stat_wis_desc: 'Increases magic critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.',
        stat_base_attack: 1.0,
        stat_attack_min: 5.0,
        stat_attack_max: 10.0, // stat_attack_min * 2
        stat_power: 1.0,
        stat_hit_chance: 0.9,
        },
        { id: 'enemy_group_1',
        type: 'basic_enemy',
        char_img: '',
        enemy_health: 100,
        enemy_health_total: 100,
        cnt: 100, // moving from elementsData
        enemy_round: 0, // moving from elementsData
        defeated_count: 0, // moving from elementsData
        dead: false, // moving from elementsData
        level: 1,
        level_power_increase: 1.2,
        // kills_to_next_level: 3
        //[{"enemy_group_1_def_count_level_1":0}]
        enemy_defeated_count: [],
        char_race: [ 'Goblin', 'Orc', 'Troll', 'Gnoll' ],
        char_class: [ 'Scavenger', 'Roamer', 'Pillager', 'Warrior', 'Spellbinder' ],
        stat_armor: 1, // physical damage reduction
        stat_resist: 1, // spell damage reduction
        stat_attack_min: 0.8,
        stat_attack_max: 3.0,
        stat_crit_chance: 5, // doubles damage

        stat_power: 0.8,
        drops: [
            { item: 'GOLD', rate: 0.9, min: 1, max: 3 },
            { item: 'CLOTH_LINEN', rate: 0.4, min: 1, max: 2 },
            { item: 'BASIC_HELMET', rate: 0.2, min: 1, max: 1 },
            { item: 'TOOTH', rate: 0.6, min: 1, max: 2 },
            ]
        },
    ];

    // (in main.js)
    // Iterate over the array and set other variables dynamically

    return characterData;
}*/ // ****** OLD DATA

export function init_inventoryData() {

    const inventoryData = [
        { id: 'inventory',
        size: 10,
        lbl: 'Inventory',
        },
        // Element ids
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
        { id: 'GOLD',
        cnt: 0,
        name: 'Gold',
        },
    ];

    return inventoryData;
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
// *** STARTING EQUIPMENT
        { id: 'BASIC_HELMET',
        type: 'armor',
        name: 'Basic Helm',
        slot: 'head',
        slot_name: 'Head',
        start_equipped: true,
        rarity: 0,
        desc: 'Basic head protection, nothing extraordinary.',
        gains: [ 
            { stat: 'armor', lbl: 'Armor', amt: 10 },
            { stat: 'strength', lbl: 'Strength', amt: 1 },
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
        start_equipped: true,
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
        start_equipped: true,
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
        start_equipped: true,
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
        //
        { id: 'MH_BASIC_DAGGER',
        type: 'weapon',
        name: 'Basic Dagger',
        slot: 'mh',
        slot_name: 'Mainhand',
        start_equipped: true,
        rarity: 0,
        desc: 'A cheap dagger. Dull. You&apos;ll stab your eye out, kid.',
        gains: [ 
            { stat: 'dmg_min', amt: 1.2 }, 
            { stat: 'dmg_max', amt: 1.6 }, 
            { stat: 'constitution', lbl: 'Constitution', amt: 10 }, 
        ],
        cnt: 0,
        value: 0,
        iSlot: 'eMH',
        img: 'media/icons/mh_01.jpg',
        },
    ];

    return itemData;
}

export function init_locationsData() {

    const locationsData = [
        // locationsData[i].kill_req_met: true/false
    
        { loc: 1, lbl: 'Dark Plains', lvl: 1, kills_req: 3,
        img: 'media/img_loc_1.jpg', }, // l = 0
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
        { loc: 2, lbl: 'Dark Highlands', lvl: 3, kills_req: 3 }, // l = 10
        { loc: 2, lbl: 'Dark Highlands', lvl: 4, kills_req: 3 },
    
        { loc: 3, lbl: 'Dark Forest', lvl: 1, kills_req: 3,
        img: 'media/img_loc_3.jpg', },
        { loc: 3, lbl: 'Dark Forest', lvl: 2, kills_req: 3 },
        { loc: 3, lbl: 'Dark Forest', lvl: 3, kills_req: 3 }, // max = 14
    
        { loc: 4, lbl: 'END', lvl: 3, kills_req: 99 }, // placeholder
    ];
    
    return locationsData;
}

export function init_characterData() {

    const characterData = [
        { id: 'armor', type: 'stat', amt: 100, label: 'Armor: ' },
        { id: 'strength', type: 'stat', amt: 10, label: 'Strength: ' },
        { id: 'intelligence', type: 'stat', amt: 10, label: 'Intelligence: ' },
        { id: 'dexterity', type: 'stat', amt: 10, label: 'Dexterity: ' },
        { id: 'constitution', type: 'stat', amt: 10, label: 'Constitution: ' },
        { id: 'agility', type: 'stat', amt: 10, label: 'Agility: ' },
        { id: 'wisdom', type: 'stat', amt: 10, label: 'Wisdom: ' },
        { id: 'power', type: 'stat', amt: 0.0, label: 'Power: ' },
        { id: 'attackMinimum', type: 'stat', amt: 1.2, label: 'Attack Minimum: ' },
        { id: 'attackMaximum', type: 'stat', amt: 1.6, label: 'Attack Maximum: ' }, // stat_attack_min * 1.5
        { id: 'hitChance', type: 'stat', amt: 0.9, label: 'Hit Chance: ' },
        { id: 'criticalStrikeChance', type: 'stat', amt: 0.05, label: 'Critical Strike Chance: ' }, // bsse stats: [0] - [12]
        // desc
        { id: 'armor', label: 'Armor', type: 'desc', def: 'Reduces damage received by 0.1% per point above base amount.' },
        { id: 'strength', label: 'Strength', type: 'desc', def: 'Increases both melee damage dealt by 0.1% and total energy by 10 per point above base amount.' },
        { id: 'intelligence', label: 'Intelligence', type: 'desc', def: 'Increases both magic damage dealt by 0.1% and total mana by 10 per point above base amount.' },
        { id: 'dexterity', label: 'Dexterity', type: 'desc', def: 'Increases hit chance by 0.1% per point above base amount. Default hit chance is 90%, or 100% at 100+ dex' },
        { id: 'constitution', label: 'Constitution', type: 'desc', def: 'Increases maximum health by 0.1% per point above base amount.' },
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
        { /*experienceValues []*/ id: 'level_exp', type: 'exp', level_cap: 20, starting_val: 800, level_rate: 0.2 },

    ];
    
    return characterData;
}

export function init_saveData() {

    const saveData = [
    // saveData[0]
    { killsData: [ // added to locationsData array
        { kills: 3 }, // l = 0
        { kills: 3 },
        { kills: 3 },
        { kills: 3 },
        { kills: 4 },
        { kills: 5 },
        { kills: 6 },
        { kills: 7 },
        { kills: 8 },
        { kills: 9 },
        { kills: 10 }, // l = 10
        { kills: 11 },
        { kills: 12 },
        { kills: 13 },
        { kills: 14 }, // max = 14
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
        // char_exp_to_level -> see start_battle_button()
        },
        ] },
    // saveData[2]
    { inventoryData: [ // to be added to static inventoryData array
        { size: 10, 
          setup: false
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
        ] },
    // saveData[3]
    { equippedData: [ // to be added to static array?
        { id: 'head' , equipped: null }, // l = 0
        { id: 'shoulders', equipped: null },
        { id: 'hands', equipped: null },
        { id: 'neck', equipped: null },
        { id: 'waist', equipped: null },
        { id: 'chest', equipped: null },
        { id: 'legs', equipped: null },
        { id: 'wrist', equipped: null },
        { id: 'feet', equipped: null },
        { id: 'ring1', equipped: null },
        { id: 'ring2', equipped: null },
        { id: 'mh', equipped: null },
        { id: 'oh', equipped: null },
        ] },
    ];
    //console.log(saveData[0]); // with 'killsData'
    //console.log(saveData[1]); // with 'characterData'
    //console.log(saveData[2]); // with 'inventoryData'
    //console.log(saveData[0].killsData); // like a standalone array
    //console.log(saveData[1].savedCharacterData); // like a standalone array
    //console.log(saveData[2].inventoryData); // like a standalone array
    //console.log(saveData[0].killsData[0]); // for array lengths

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
        // *** stats WIP
        // trackingData[0].stat_armor (int)
        // trackingData[0].stat_strength (int)
        // trackingData[0].stat_intelligence (int)
        // trackingData[0].stat_dexterity (int)
        // trackingData[0].stat_constitution (int)
        // trackingData[0].stat_agility (int) done
        // trackingData[0].stat_wisdom (int) done
        // trackingData[0].stat_power (int)
    ];

    return trackingData;
}

export const elementsData = init_elementsData();
//export const battleData = init_battleData();
export const inventoryData = init_inventoryData();
export const itemData = init_itemData();
//export const locationData = init_locationData();
export const locationsData = init_locationsData();
export const characterData = init_characterData();
export const saveData = init_saveData();
export const trackingData = init_trackingData();
