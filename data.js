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
                css_class: 'box',
                css_class2: 'normal',
                },
                    // attach (location_container)
                    { id: 'location_left',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'div',
                    parent_el: 'location_container',
                    content: '&nbsp;&nbsp;<<',
                    css_class: 'location_box_style_20_left',
                    css_class2: 'location_box_style',
                    },
                    // attach (location_container)
                    { id: 'location_center',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'div',
                    parent_el: 'location_container',
                    content: 'location_center',
                    css_class: 'location_box_style_60',
                    css_class2: 'location_box_style',
                    },
                    // attach (location_container)
                    { id: 'location_right',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'div',
                    parent_el: 'location_container',
                    content: '>>&nbsp;&nbsp;',
                    css_class: 'location_box_style_20_right',
                    css_class2: 'location_box_style',
                    },
            // attach (battle_section_container)
            { id: 'start_battle_container',
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            },
                // attach (start_battle_container)
                { id: 'enemy_levels',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'start_battle_container',
                css_class: 'center',
                css_class2: 'location_box_style',
                },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_lbl',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    content: '<b>LEVEL:</b>&nbsp;',
                    css_class: 'location_box_style',
                    },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_1',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    //content: '[ 1 ]',
                    css_class: 'enemy_levels_style_10',
                    },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_2',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    //content: '[ 2 ]',
                    css_class: 'enemy_levels_style_10',
                    },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_3',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    //content: '[ 3 ]',
                    css_class: 'enemy_levels_style_10',
                    },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_4',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    //content: '[ 4 ]',
                    css_class: 'enemy_levels_style_10',
                    },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_5',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    //content: '[ 5 ]',
                    css_class: 'enemy_levels_style_10',
                    },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_6',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    //content: '[ 6 ]',
                    css_class: 'enemy_levels_style_10',
                    },
                    // attach (enemy_levels)
                    { id: 'enemy_levels_7',
                    section_cat: true,
                    fetch_cat: true,
                    type: 'span',
                    parent_el: 'enemy_levels',
                    //content: '[ 7 ]',
                    css_class: 'enemy_levels_style_10',
                    },
                ////
                // attach (start_battle_container)
                { id: 'enemy_counter_div',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'start_battle_container',
                //content: 'Level [ 1 ] Enemies Defeated:&nbsp;0',
                css_class: 'location_eme_cnt',
                css_class2: 'center',
                }, // CHILDREN IN CODE -> (elementsData: enemy_health_cnt.defeated_count)
                // attach (start_battle_container)
                { id: 'start_battle_button',
                section_cat: true,
                fetch_cat: true,
                type: 'div',
                parent_el: 'start_battle_container',
                content: '<b>[ START BATTLE ]</b>',
                css_class: 'location_box_style',
                css_class2: 'center',
                on_click: true, // click event
                },
            // attach (battle_section_container)
            { id: 'attack_box_button', // replaced by start_battle_button below
            section_cat: true,
            fetch_cat: true,
            type: 'div',
            parent_el: 'battle_section_container',
            content: '[ ATTACK ]',
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
        { id: 'character_section',
        section_cat: true,
        type: 'div',
        parent_el: 'body',
        content: 'Character Section',
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
          { id: 1, mult: 1.0, kills_to_next_level: 3, defeated_count: 0 },
          { id: 2, mult: 1.2, kills_to_next_level: 3, defeated_count: 0 },
          { id: 3, mult: 1.4, kills_to_next_level: 3, defeated_count: 0 },
          { id: 4, mult: 1.6, kills_to_next_level: 3, defeated_count: 0 },
          { id: 5, mult: 1.8, kills_to_next_level: 3, defeated_count: 0 },
          { id: 6, mult: 2.0, kills_to_next_level: 3, defeated_count: 0 },
          { id: 7, mult: 2.2, kills_to_next_level: 3, defeated_count: 0 },
          { id: 8, mult: 2.4, kills_to_next_level: 3, defeated_count: 0 },
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
          { id: 1, mult: 2.6, kills_to_next_level: 3, defeated_count: 0 },
          { id: 2, mult: 2.8, kills_to_next_level: 3, defeated_count: 0 },
          { id: 3, mult: 3.0, kills_to_next_level: 3, defeated_count: 0 },
          { id: 4, mult: 3.2, kills_to_next_level: 3, defeated_count: 0 },
          { id: 5, mult: 3.4, kills_to_next_level: 3, defeated_count: 0 },
          { id: 6, mult: 3.6, kills_to_next_level: 3, defeated_count: 0 },
          { id: 7, mult: 3.8, kills_to_next_level: 3, defeated_count: 0 },
          { id: 8, mult: 4.0, kills_to_next_level: 3, defeated_count: 0 },
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
        //level_id: 2,
        kills_to_next_level: 3,
        total_levels: 8,
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
        loc_selected: '01_DARK_PLAINS', // default
        loc_num_selected: 1, // default
        level_selected: 1, // default
        max_level: 0, // set by handle_location()
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
}

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

export function init_lootData() {

    const lootData = [
        { id: 'GOLD',
        type: 'currency',
        name: 'Gold',
        cnt: 0,
        },
        { id: 'CLOTH_LINEN',
        type: 'material',
        name: 'Linen Cloth',
        cnt: 0,
        value: 2,
        },
        { id: 'BASIC_HELMET',
        type: 'arnor',
        name: 'Basic Helm',
        cnt: 0,
        value: 6,
        },
        { id: 'TOOTH',
        type: 'junk',
        name: 'Tooth',
        cnt: 0,
        value: 1,
        },
    ];

    return lootData;
}

export const elementsData = init_elementsData();
export const battleData = init_battleData();
export const characterData = init_characterData();
export const inventoryData = init_inventoryData();
export const lootData = init_lootData();
export const locationData = init_locationData();


//{ id: 'GATHER_TWIGS', costs: { 'TWIGS': 20, 'PEBBLES': 10 }, cost_type: 'res' },
