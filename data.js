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
                css_class: 'box', 
                css_class2: 'location_box_style', 
                }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_lbl', 
                    section_cat: true, 
                    fetch_cat: true, 
                    type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: 'LEVEL:', 
                    css_class: 'enemy_levels_style_30_left', 
                    }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_1', 
                    section_cat: true, 
                    fetch_cat: true, 
                                            type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: '[ 1 ]', 
                    css_class: 'enemy_levels_style_10', 
                    }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_2', 
                    section_cat: true, 
                    fetch_cat: true, 
                    type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: '[ 2 ]', 
                    css_class: 'enemy_levels_style_10', 
                    }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_3', 
                    section_cat: true, 
                    fetch_cat: true, 
                    type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: '[ 3 ]', 
                    css_class: 'enemy_levels_style_10', 
                    }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_4', 
                    section_cat: true, 
                    fetch_cat: true, 
                    type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: '[ 4 ]', 
                    css_class: 'enemy_levels_style_10', 
                    }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_5', 
                    section_cat: true, 
                    fetch_cat: true, 
                    type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: '[ 5 ]', 
                    css_class: 'enemy_levels_style_10', 
                    }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_6', 
                    section_cat: true, 
                    fetch_cat: true, 
                    type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: '[ 6 ]', 
                    css_class: 'enemy_levels_style_10', 
                    }, 
                    // attach (enemy_levels)
                    { id: 'enemy_levels_7', 
                    section_cat: true, 
                    fetch_cat: true, 
                    type: 'div', 
                    parent_el: 'enemy_levels', 
                    content: '[ 7 ]', 
                    css_class: 'enemy_levels_style_10', 
                    }, 
                // attach (start_battle_container)
                { id: 'start_battle_button', 
                section_cat: true, 
                fetch_cat: true, 
                type: 'div', 
                parent_el: 'start_battle_container', 
                content: '[ START BATTLE ]', 
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
                { id: 'eme_name', 
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
                    content: '100', 
                    css_class: 'normal', 
                    css_class2: 'center', 
                    startTime: null, 
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
                    cnt: 100, 
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
        //content: 'Character Section', 
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

export function init_battleData() {

    const battleData = [ 
        // encounters
        { id: '01_dark_forest', 
        type: 'encounter', 
        label: 'Dark Forest', 
        level_mult: 1.2, 
        hp_low: 20, 
        hp_high: 30, 
        dmg_low: 3, 
        dmg_high: 6, 
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
        stat_armor: 100, 
        stat_attack: 1.0, 
        stat_power: 1.0, 
        }, 
        { id: 'enemy_gnome', 
        type: 'basic_enemy', 
        char_img: '', 
        level: 1, 
        char_race: 'Goblin', 
        char_class: 'Scavenger', 
        stat_health: 100, 
        stat_armor: 100, 
        stat_attack: 0.8, 
        stat_power: 0.8, 
        drops: [
            { item: 'GOLD', rate: 0.9, min: 1, max: 3 }, 
            { item: 'CLOTH_LINEN', rate: 0.4, min: 1, max: 2 }, 
            { item: 'BASIC_HELMET', rate: 0.2, min: 1, max: 1 }, 
            { item: 'TOOTH', rate: 0.6, min: 1, max: 2 }, 
            ]
        }, 
    ];
    
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

//{ id: 'GATHER_TWIGS', costs: { 'TWIGS': 20, 'PEBBLES': 10 }, cost_type: 'res' }, 