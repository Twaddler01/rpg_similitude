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
            { id: 'verses_box',
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            css_class: 'box',
            hidden: true,
            },
                // attach (verses_box)
                { id: 'char_img',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'verses_box',
                css_class: 'box_15',
                css_class2: 'center',
                },
                // attach (verses_box)
                { id: 'char_name',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'verses_box',
                content: 'test',
                css_class: 'box_35_left',
                css_class2: 'center',
                },
                // attach (verses_box)
                { id: 'enemy_name',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'verses_box',
                content: 'test',
                css_class: 'box_35_right',
                css_class2: 'center',
                },
                // attach (verses_box)
                { id: 'eme_img',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'verses_box',
                css_class: 'box_15',
                css_class2: 'center',
                },
            // attach (battle_section_container)
            { id: 'health_bars',
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            css_class: 'box',
            hidden: true,
            },
                // attach (health_bars)
                { id: 'char_health_bar',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'health_bars',
                css_class: 'char_health_bar',
                css_class2: 'center',
                },
                    // attach (char_health_bar)
                    { id: 'char_health_cnt',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'div',
                    parent_el: 'char_health_bar',
                    content: '100&nbsp;/&nbsp;100',
                    css_class: 'normal',
                    css_class2: 'center',
                    },
                // attach (health_bars)
                { id: 'health_bar_spacer',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'health_bars',
                css_class: 'health_bar_spacer',
                css_class2: 'center',
                },
                // attach (health_bars)
                { id: 'enemy_health_bar',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'health_bars',
                css_class: 'enemy_health_bar',
                css_class2: 'center',
                },
                    // attach (enemy_health_bar)
                    { id: 'enemy_health_fill',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'div',
                    parent_el: 'enemy_health_bar',
                    css_class: 'enemy_health_fill',
                    },
                    // attach (enemy_health_bar)
                    { id: 'enemy_health_cnt',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_health_bar',
                    cnt: 100,
                    enemy_round: 0,
                    content: '100',
                    css_class: 'normal',
                    css_class2: 'center',
                    defeated_count: 0,
                    enemy_counter_inner: '',
                    enemy_counter_inner_css: '',
                    enemy_counter_inner_css2: '',
                    },
                    // attach (enemy_health_bar)
                    { id: 'enemy_health_separator',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_health_bar',
                    content: '&nbsp;/&nbsp;',
                    css_class: 'normal',
                    css_class2: 'center',
                    },
                    // attach (enemy_health_bar)
                    { id: 'enemy_health_total',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_health_bar',
                    content: '100',
                    css_class: 'normal',
                    css_class2: 'center',
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
        slot_1: '[ EMPTY ]',
        slot_2: '[ EMPTY ]',
        slot_3: '[ EMPTY ]',
        slot_4: '[ EMPTY ]',
        slot_5: '[ EMPTY ]',
        slot_6: '[ EMPTY ]',
        slot_7: '[ EMPTY ]',
        slot_8: '[ EMPTY ]',
        slot_9: '[ EMPTY ]',
        slot_10: '[ EMPTY ]',
        },
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
    
        { id: 'GOLD',
        type: 'currency',
        name: 'Gold',
        cnt: 0,
        },
        { id: 'CLOTH_LINEN',
        type: 'material',
        name: 'Linen Cloth',
        rarity: 1,
        cnt: 0,
        value: 2,
        },
        { id: 'BASIC_HELMET',
        type: 'armor',
        name: 'Basic Helm',
        slot: 'head',
        // will have at beginning
        start_equipped: true,
        rarity: 1,
        desc: 'Basic head protection, nothing extraordinary.',
        gains: [ {stat: 'Armor', amt: 10 }, { stat: 'Power', amt: 1 } ],
        cnt: 0,
        value: 1,
        iSlot: 'eH',
        img: 'media/icons/head_01.jpg',
        },
        { id: 'TOOTH',
        type: 'junk',
        name: 'Tooth',
        rarity: 0,
        cnt: 0,
        value: 1,
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
        { stats: [ 
            { stat_base_armor: 100, label: 'Armor: ' },
            { stat_base_str: 10, label: 'Strength: ' },
            { stat_base_int: 10, label: 'Intelligence: ' },
            { stat_base_dex: 10, label: 'Dexterity: ' },
            { stat_base_con: 10, label: 'Constitution: ' },
            { stat_base_agi: 10, label: 'Agility: ' },
            { stat_base_wis: 10, label: 'Wisdom: ' },
            { stat_base_attack: 1.0, label: 'Attack: ' },
            { stat_attack_min: 5.0, label: 'Attack Minimum: ' },
            { stat_attack_max: 10.0, label: 'Attack Maximum: ' }, // stat_attack_min * 2
            { stat_power: 1.0, label: 'Power: ' },
            { stat_hit_chance: 0.9, label: 'Hit Chance: ' }, // bsse stats: [0] - [11]
        ] }, 
        { stats_desc: [
            { stat_armor_desc: 'Reduces damage taken by 0.1% per point above base amount.' },
            { stat_str_desc: 'Increases both melee damage dealt by 0.1% and total energy by 10 per point above base amount.' },
            { stat_int_desc: 'Increases both magic damage dealt by 0.1% and total mana by 10 per point above base amount.' },
            { stat_dex_desc: 'Increses hit chance by 0.1% per point above base amount. Default hit chance is 90%, or 100% at 100+ dex' },
            { stat_con_desc: 'Increases health by 0.1% per point above base amount.' },
            { stat_agi_desc: 'Increases melee critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
            { stat_wis_desc: 'Increases magic critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
        ] },
    ];
    
    return characterData;
}

export function init_saveData() {

// **** multiple scenarios ****

// mid setup
/*
    const saveData = [
        { kills: 4 }, // l = 0
        { kills: 3 },
        { kills: 4 },
        { kills: 3 },
        { kills: 4 },
        { kills: 4 },
        { kills: 4 },
        { kills: 6 },
        { kills: 3 },
        { kills: 4 },
        { kills: 0 }, // l = 10
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 }, // max = 14
        { kills: 0 }, // placeholder
    ];
    */
    // WIP add categpry for kill data
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
        },
        ] },
    // saveData[2]
    { inventoryData: [ // to be added to static inventoryData array
        { slot_1: 0 }, // l = 0
        { slot_2: 1 },
        { slot_3: 2 },
        ] },
    // saveData[3]
    { equippedData: [ // to be added to static array?
        { head: null }, // l = 0
        { shoulders: null },
        { hands: null },
        { neck: null },
        { waist: null },
        { chest: null },
        { legs: null },
        { wrist: null },
        { feet: null },
        { ring1: null },
        { ring2: null },
        { mh: null },
        { oh: null },
        ] },
    ];
    //console.log(saveData[0]); // with 'killsData'
    //console.log(saveData[1]); // with 'characterData'
    //console.log(saveData[2]); // with 'inventoryData'
    //console.log(saveData[0].killsData); // like a standalone array
    //console.log(saveData[1].savedCharacterData); // like a standalone array
    //console.log(saveData[2].inventoryData); // like a standalone array
    //console.log(saveData[0].killsData[0]); // for array lengths
    
    /*
    // new game
    const saveData = [
        { kills: 0 }, 
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 },
        { kills: 0 }, 
    ];
    */
    
    return saveData;
}

export function init_trackingData() {

    // always trackingData[0]
    const trackingData = [
        { loc: 0 }, // (int)
        { lvl: 0 }, // (int)
        // trackingData[0].currentLocation (int)
        // trackingData[0].location (string)
        // trackingData[0].kills (trackingData[0]trackingData[0]trackingData[0]int)
    ];

    return trackingData;
}

export const elementsData = init_elementsData();
//export const battleData = init_battleData();
//export const characterData = init_characterData();
export const inventoryData = init_inventoryData();
export const itemData = init_itemData();
//export const locationData = init_locationData();
export const locationsData = init_locationsData();
export const characterData = init_characterData();
export const saveData = init_saveData();
export const trackingData = init_trackingData();
