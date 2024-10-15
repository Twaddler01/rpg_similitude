// functions.js

// import arrays
import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, saveData, trackingData } from './data.js';

// general functions needed
import * as gf from './general_functions.js';

// Main function to create new elements
export function create_el(newId, type, parentId, content) {
    let parent_el = document.getElementById(parentId);
    let new_el = document.createElement(type);
    if (parent_el) {
        parent_el.appendChild(new_el);
    } else {
        parentId.appendChild(new_el);
    }
    new_el.id = newId;
    if (content) {
        new_el.innerHTML = content;
    }
}

export function first_run() {

    let test_section = document.getElementById('test_section');

// reset saveData
    let reset = document.createElement('button');
    test_section.appendChild(reset);
    reset.innerHTML = 'RESET GAME';
    reset.addEventListener('click', () => {
        reset_game('test_section');
    });

// add 1 kill instantly to selected level

    let selected_kill = document.createElement('button');
    test_section.appendChild(selected_kill);
    selected_kill.innerHTML = '+1 Kill to Current Level';
    
    selected_kill.addEventListener('click', () => {
        let message = document.getElementById('message');
        
        if (message) {
            message.innerHTML = '';
        }
        if (trackingData[0].lvl !== 0) {
            locationsData.forEach((item, index) => {
                //console.log('trackingData[0].loc: ' + trackingData[0].loc);
                //console.log('locationsData.loc: ' + locationsData[index].loc);
                if (locationsData[index].loc === trackingData[0].loc && locationsData[index].lvl === trackingData[0].lvl) {
                    //trackingData[0].loc
                    saveData[0].killsData[index].kills += 1;
                    //saveData[index].kills += 1;
                    // Update both arrays
                    message.innerHTML = 'Added +1 kill to ' + locationsData[index].lbl + ' (Level ' + locationsData[index].lvl + ')';
                    update_locations();
                    selectLocation(locationsData[index].loc);
                    // Highlight selected level
                    let DOM_levelButton = document.getElementById('levelButton_' + trackingData[0].lvl);
                    DOM_levelButton.style.backgroundColor = 'yellow';
                }
            });
        } else {
            message.innerHTML = 'Please select an enemy level.';
        }
        //update_locations();
    });

// Add loot button

    let filtered_itemData = itemData.filter(i => i.id !== 'GOLD');
    filtered_itemData.forEach(item => {
        
        let add_loot = document.createElement('button');
        test_section.appendChild(add_loot);
        add_loot.innerHTML = 'Add Loot:' + item.id;
        
        add_loot.addEventListener('click', () => {
            updateLootCount(item.id, 1);
        });
    });
    
// Add gold button
    let add_gold = document.createElement('button');
    test_section.appendChild(add_gold);
    add_gold.innerHTML = 'Add +1 GOLD';
    add_gold.addEventListener('click', () => {
        let gold_span_lbl = document.getElementById('gold_span');
        let d_gold = saveData[4].currencyData[0];
        d_gold.cnt += 1;
        gold_span_lbl.innerHTML = '<b>GOLD:</b>&nbsp;' + d_gold.cnt;
        update_gold();
    });

// Add expwrience x200
    //let e_char_exp = document.getElementById('e_char_exp');
    let add_xp = document.createElement('button');
    test_section.appendChild(add_xp);
    add_xp.innerHTML = 'Add Experience';
    
    add_xp.addEventListener('click', () => {
        let d_player_character = saveData[1].savedCharacterData[0];
        d_player_character.char_exp += 200;
        update_xp();
    });
    
// Toggle combat status
    let toggle_combat = document.createElement('button');
    test_section.appendChild(toggle_combat);
    toggle_combat.innerHTML = 'Toggle Combat Status';
    toggle_combat.addEventListener('click', () => {
        toggle_combat_status();
    });
    
// Add loot test
    let e_add_loot = document.createElement('button');
    test_section.appendChild(e_add_loot);
    e_add_loot.innerHTML = 'add_loot()';

    // To track each loot cycle
    let counter = 0;
    e_add_loot.addEventListener('click', () => {
        let encounter = encounterData.find(e => e.id === 'beginner_0');
        let enemy = encounter.enemy_list;
        //console.log(counter + ': ');
        let loot_min = 2;
        // testing
        let gold_min = 1;
        let gold_max = 2;
        add_loot(enemy[2], loot_min, gold_min, gold_max);
        counter++;
    });

/*trackingData[0].loc = 0;
trackingData[0].lvl = 1;
let enemy_list = encounterData.find(e => e.loc === trackingData[0].loc && e.lvl === trackingData[0].lvl);
let enemy = enemy_list.enemy_list;
console.log(enemy);*/

}

export function update_locations() {

    // Main containers
    const location_container = document.getElementById('location_container');
    let e_battle_section = document.getElementById('battle_section');

    // Clear any existing elements
    // Add title
    if (location_container) {
        location_container.innerHTML = '<b>CHOOSE BATTLE LOCATION:<p></p></b>';
    }

    if (!trackingData[0].t_battle_section) {
        // Event listener
        location_container.style.display = 'none';
        if (!e_battle_section.listenerAdded) {
            e_battle_section.addEventListener('click', () => {
                toggle_section('battle');
                e_battle_section.listenerAdded = true;
            });
        }
    }

    // Update array data
    for (let i = 0; i < locationsData.length; i++) {
        // Insert the kills data from saveData into the corresponding location in locationsData
        // locationsData[i].kills = saveData[i].kills
        locationsData[i].kills = saveData[0].killsData[i].kills;

        // Always set first level true
        if (!locationsData[0].kill_req_met) {
            locationsData[0].kill_req_met = true;
        }
        
        // Update kill_req_met based on the kills of previous,level
        // Ensure next index is set to true (if not at end of array) if previous index kills >= kills_req
        if (i + 1 < locationsData.length) {
            locationsData[i + 1].kill_req_met = locationsData[i].kills >= locationsData[i].kills_req;

        }
    }

    // Location image (used im battle)
    let battle_location_image = document.createElement('div');
    location_container.appendChild(battle_location_image);
    battle_location_image.id = 'battle_location_image';

    // Create locations container
    let locations = document.createElement('div');
    location_container.appendChild(locations);
    locations.id = 'locations';
    locations.style.display = 'flex';
    locations.style.overflow = 'auto';

    // Create levels container
    let levels = document.createElement('div');
    location_container.appendChild(levels);
    levels.id = 'levels';
    levels.style.overflow = 'auto';

    // Create location status container
    let locations_status = document.createElement('div');
    location_container.appendChild(locations_status);
    locations_status.id = 'locations_status';

    // Attack (turn by turn) used once in combat
    create_el('player_turn_attack_container', 'div', location_container);
    create_el('player_turn_attack', 'button', 'player_turn_attack_container');
    player_turn_attack.style.display = 'none';

    const message = document.createElement('div');
    test_section.appendChild(message);
    message.id = 'message';
    message.className = 'normal';

    // Create and append location buttons
    const max_location = Math.max(...locationsData.map(loc => loc.loc));
    const starting_loc = 0; // previously 1
    for (let i = starting_loc; i <= max_location; i++) {
        let loc_lvl1 = locationsData.find(l => l.loc === i && l.lvl === 1);
        let loc = document.createElement('div');
        loc.id = 'location_div_' + i;
        // Auto select current location/level from trackingData if present
        if (trackingData[0].loc >= 0 && trackingData[0].lvl >= 1) {
            let fetched_loc = document.getElementById('location_div_' + trackingData[0].loc);
            if (fetched_loc) {
                fetched_loc.classList.remove('green_border_off');
                fetched_loc.classList.add('green_border_on');
            }
        }
        loc.classList.remove('green_border_on');
        loc.classList.add('green_border_off');
        let unlocked = isAnyLocationUnlocked(i);
        //console.log(unlocked);
        if (loc_lvl1 && unlocked) {
            locations.appendChild(loc);
            loc.innerHTML = loc_lvl1.lbl;
            let loc_img = document.createElement('img');
            loc_img.id = 'loc_img_' + loc_lvl1.loc;
            loc.appendChild(loc_img);
            loc_img.style.width = '150px';
            loc_img.style.height = 'auto';
            loc_img.src = loc_lvl1.img;
            let loc_levels = document.createElement('div');
            levels.appendChild(loc_levels);
            loc_levels.id = 'loc_levels';
            loc_levels.style.overflow = 'auto';
            loc.addEventListener('click', () => {
                // Clear all green borders
                for (let all = starting_loc; all <= max_location; all++) {
                    let DOM_all_loc_div = document.getElementById('location_div_' + all);
                    if (DOM_all_loc_div) {
                        DOM_all_loc_div.classList.remove('green_border_on');
                        DOM_all_loc_div.classList.add('green_border_off');
                    }
                }
                // Add green border to clicked element
                loc.classList.remove('green_border_off');
                loc.classList.add('green_border_on');
                selectLocation(i);
                // To always keep highlightted level selected after clicking another location and back
                let level_btn = document.getElementById('levelButton_' + trackingData[0].lvl);
                if (level_btn && trackingData[0].loc === i) {
                    level_btn.style.backgroundColor = 'yellow';
                }
            });
        }
    }
}

export function isAnyLocationUnlocked(loc) {
    return locationsData
        .filter(location => location.loc === loc)
        .some(location => location.kill_req_met);
}

export function isLocationFullyUnlocked(loc) {
    return locationsData
        .filter(location => location.loc === loc)
        .every(location => location.kill_req_met);
}
// USAGE
// for (let i = 1; i <= max_location; i++) {
//    const fullyUnlocked = isLocationFullyUnlocked(i);
//    console.log(`Location ${i} fully unlocked: ${fullyUnlocked}`);
// }

export function selectLocation(location) {
    const levelsContainer = document.getElementById('loc_levels');

    // Clear previous levels if a new location is selected
    levelsContainer.innerHTML = '';

    trackingData[0].currentLocation = location;

    if (trackingData[0].loc) {
        trackingData[0].currentLocation = trackingData[0].loc;
    }

    // Filter levels based on the selected location and met kill requirements
    const filteredLevels = locationsData.filter(loc => loc.loc === location && loc.kill_req_met);

    // Display levels for the selected location
    filteredLevels.forEach(level => {
        let level_title = document.createElement('span');
        levelsContainer.appendChild(level_title);
        const init_level = 0;
        if (level.lvl === init_level) {
            level_title.innerHTML = `<b>CHOOSE LEVEL:</b><br>&nbsp;`;
        }

        const levelButton = document.createElement('button');
        levelButton.innerHTML = ` ${level.lvl} `;
        levelButton.style.backgroundColor = 'white';
        levelButton.id = 'levelButton_' + level.lvl;

        if (trackingData[0].loc === level.loc && trackingData[0].lvl === level.lvl) {
            selectLevel(level.loc, level.lbl, level.lvl, level.kills);
        } else {
            levelButton.addEventListener('click', () => {
                // Set all colors to white initialy
                const first_index = 0;
                for (let i = first_index; i <= filteredLevels.length; i++) {
                    let DOM_levelButton = document.getElementById('levelButton_' + i);
                    if (DOM_levelButton) { DOM_levelButton.style.backgroundColor = 'white'; }
                }
                // Set selected level yellow
                levelButton.style.backgroundColor = 'yellow';
                selectLevel(level.loc, level.lbl, level.lvl, level.kills);
            });
        }
        levelsContainer.appendChild(levelButton);
    });
}

export function selectLevel(loc, location, lvl, kills) {
    
    const locations_status = document.getElementById('locations_status');
    const message = document.getElementById('message');

    message.innerHTML = '';
    locations_status.innerHTML = `You selected <b>${location}</b> Level <b>${lvl}</b>`;
    locations_status.innerHTML += `<br><b>Enemies Killed:</b> ${kills}`;

    // add to tracking array
    trackingData[0].loc = loc;
    trackingData[0].location = location;
    trackingData[0].lvl = lvl;
    trackingData[0].kills = kills;

    start_battle();
}

export function getMaxLevelsByLocation(locationsData) {
    // Object to store the highest level for each location
    const maxLevels = {};

    // Loop over locationsData to find the highest level per location
    locationsData.forEach(location => {
        const { loc, lvl } = location;

        // If the location doesn't exist in maxLevels, or if the current lvl is higher, update it
        if (!maxLevels[loc] || lvl > maxLevels[loc]) {
            maxLevels[loc] = lvl;
        }
    });

    // Convert the result object into an array of max levels in the order of loc
    return Object.values(maxLevels);
}
// Usage
// const highestLevels = getMaxLevelsByLocation(locationsData);
// console.log(highestLevels); // [8, 4, 3] - This will be the highest level for each location in order

// reset saveData
export function reset_game(elid) {
    let parent = document.getElementById(elid);
    if (parent) {
        let confirm = document.createElement('span');
        parent.appendChild(confirm);
        confirm.className = 'normal';
        confirm.innerHTML = 'RESET: Are you sure?&nbsp;&nbsp;';
        
        let yes = document.createElement('button');
        test_section.appendChild(yes);
        yes.innerHTML = 'YES';
        yes.addEventListener('click', () => {
            saveData[0].killsData.forEach(item => {
            //saveData.forEach(item => {
                item.kills = 0;
            });
            parent.removeChild(confirm);
            parent.removeChild(yes);
            parent.removeChild(no);
            update_locations();
        });
        
        let no = document.createElement('button');
        test_section.appendChild(no);
        no.innerHTML = 'NO';
        no.addEventListener('click', () => {
            parent.removeChild(confirm);
            parent.removeChild(yes);
            parent.removeChild(no);
            update_locations();
        });
    
        

    } else {
        console.error('elid "' + elid + '" is invalid for reset_game() function call.');
    }
}

export function update_character() {

    // Flag to avoid double toggle_section() function calls
    if (!trackingData[0].t_character_section) {
        let e_character_section = document.getElementById('character_section');
            e_character_section.addEventListener('click', () => {
                toggle_section('character');
            });
    } else {
    // trackingData[0].t_character_section = true

    // Reset character_container elements
    let character_container = document.getElementById('character_container');
    character_container.innerHTML = '';

    let charData = saveData[1].savedCharacterData[0];

    if (charData.char_name && charData.char_race && charData.char_class) {
        trackingData[0].character_created = true;
    }

    if (!trackingData[0].character_created) {

        let new_char_entry = document.createElement('div');
        character_container.appendChild(new_char_entry);
    
        let character_entry = document.createElement('span');
        new_char_entry.appendChild(character_entry);
        character_entry.classList.add('location_box_style');
        character_entry.innerHTML = '<br><b>ENTER NEW CHARACTER DATA:</b><p></p>';
    
        let input_name_lbl = document.createElement('div');
        new_char_entry.appendChild(input_name_lbl);
        input_name_lbl.innerHTML = 'Name of Character:';
        
        let input_name = document.createElement('input');
        input_name.placeholder = 'Enter character name';
        new_char_entry.appendChild(input_name);
        
        let input_race_lbl = document.createElement('div');
        new_char_entry.appendChild(input_race_lbl);
        input_race_lbl.innerHTML = 'Character Race:';
        
        let input_race = document.createElement('input');
        input_race.placeholder = 'Enter character race';
        new_char_entry.appendChild(input_race);
        
        let input_class_lbl = document.createElement('div');
        new_char_entry.appendChild(input_class_lbl);
        input_class_lbl.innerHTML = 'Character Class:';
        
        let input_class = document.createElement('input');
        input_class.placeholder = 'Enter character class';
        new_char_entry.appendChild(input_class);
        
        let submit_btn = document.createElement('button');
        new_char_entry.appendChild(submit_btn);
        submit_btn.innerHTML = 'SUBMIT';
        submit_btn.addEventListener('click', () => {
            let charName = input_name.value;
            let charRace = input_race.value;
            let charClass = input_class.value;

            let confirm_div = document.createElement('div');
            new_char_entry.appendChild(confirm_div);

            let print_input = document.createElement('div');
            confirm_div.appendChild(print_input);
            print_input.innerHTML = `Your name is ${charName} and you are a ${charRace} ${charClass}. Confirm?`;

            let confirm_yes = document.createElement('button');
            confirm_div.appendChild(confirm_yes);
            confirm_yes.innerHTML = 'YES';
            confirm_yes.addEventListener('click', () => {
                saveData[1].savedCharacterData[0].char_name = charName;
                saveData[1].savedCharacterData[0].char_race = charRace;
                saveData[1].savedCharacterData[0].char_class = charClass;
                new_char_entry.innerHTML = '';
            });

            let confirm_no = document.createElement('button');
            confirm_div.appendChild(confirm_no);
            confirm_no.innerHTML = 'NO';
            confirm_no.addEventListener('click', () => {
                confirm_div.innerHTML = '';
                input_name.value = '';
                input_race.value = '';
                input_class.value = '';
                return;
            });
        });

        // flag character as created
        trackingData[0].character_created = true;
    }

    if (trackingData[0].character_created) {
        
        let char_title = document.createElement('div');
        character_container.appendChild(char_title);
        char_title.innerHTML = '<b>' + charData.char_name + '&nbsp;(Level ' + charData.char_level + ')</b>';
        
        let char_equipment = document.createElement('div');
        character_container.appendChild(char_equipment);
        char_equipment.innerHTML = '<p><b>EQUIPMENT:</b></p>';

// equipment image with slots around image
create_el('char_equipment_container', 'div', char_equipment);
    create_el('div_top_box', 'div', 'char_equipment_container');
    div_top_box.classList.add('top-box');
    create_el('equip_slot_head', 'div', 'div_top_box');
    equip_slot_head.classList.add('item-box');
    create_el('div_side_boxes_left', 'div', 'char_equipment_container');
    div_side_boxes_left.classList.add('side-boxes', 'left');
        create_el('equip_slot_shoulders', 'div', 'div_side_boxes_left');
        equip_slot_shoulders.classList.add('item-box');
        create_el('equip_slot_neck', 'div', 'div_side_boxes_left');
        equip_slot_neck.classList.add('item-box');
        create_el('equip_slot_chest', 'div', 'div_side_boxes_left');
        equip_slot_chest.classList.add('item-box');
        create_el('equip_slot_wrist', 'div', 'div_side_boxes_left');
        equip_slot_wrist.classList.add('item-box');
        create_el('equip_slot_ring1', 'div', 'div_side_boxes_left');
        equip_slot_ring1.classList.add('item-box');
    create_el('char_equipment_image', 'img', 'char_equipment_container');
    char_equipment_image.src = 'media/char_equip.png';
    char_equipment_image.style.height = '240px';
    char_equipment_image.style.width = '80px';
    create_el('div_side_boxes_right', 'div', 'char_equipment_container');
    div_side_boxes_right.classList.add('side-boxes', 'right');
        create_el('equip_slot_hands', 'div', 'div_side_boxes_right');
        equip_slot_hands.classList.add('item-box');
        create_el('equip_slot_waist', 'div', 'div_side_boxes_right');
        equip_slot_waist.classList.add('item-box');
        create_el('equip_slot_legs', 'div', 'div_side_boxes_right');
        equip_slot_legs.classList.add('item-box');
        create_el('equip_slot_feet', 'div', 'div_side_boxes_right');
        equip_slot_feet.classList.add('item-box');
        create_el('equip_slot_ring2', 'div', 'div_side_boxes_right');
        equip_slot_ring2.classList.add('item-box');
    create_el('div_bottom_boxes', 'div', 'char_equipment_container');
    div_bottom_boxes.classList.add('bottom-boxes');
        create_el('equip_slot_mh', 'div', 'div_bottom_boxes');
        equip_slot_mh.classList.add('item-box');
        create_el('equip_slot_oh', 'div', 'div_bottom_boxes');
        equip_slot_oh.classList.add('item-box');

        let equippedItems = saveData[3].equippedData;

        // Update from character equipment array
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

            let slot_container = document.getElementById(equipmentElements.e_slot_container);
            if (slot_container) {
                slot_container.classList.add('equip_slot_container');
                
                // append with zIndex: 2
                let slot_img = document.createElement('img');
                slot_container.appendChild(slot_img);
                slot_img.id = 'equipment_slot_img_' + slot_data.id;
                slot_img.classList.add('equip_slot_img');
                equipmentElements.e_slot_img = slot_img.id;
                slot_img.src = d_itemData.img;

                // new tt
                slot_container.addEventListener('click', (equip_tt) => {
                    removeItemTooltip('equipment');
                    createItemElements(slot_container, slot_data, equipmentElements, 'equipment');
                        
                    // Add event listeners to hide the tooltip
                    setTimeout(() => {
                        document.addEventListener('click', handleOutsideClick);
                    }, 20);

                    function handleOutsideClick(equip_tt) {
                        const tooltipContainer = document.getElementById(slot_container.id);
                        if (tooltipContainer && !tooltipContainer.contains(equip_tt.target)) {
                            removeItemTooltip('equipment');
                            document.removeEventListener('click', handleOutsideClick);
                        }
                    }
                });
            }
        });

        // Add stats for equipmemt from equipped items
        update_equipment();
        update_character_stats(false);
    }
} // END trackingData[0].t_character_section = true

}

export function update_character_stats(updateElements) {

    if (updateElements) {
        let e_character_stats_section = document.getElementById('character_stats_section');
        let e_character_stats_container = document.getElementById('character_stats_container');
    
        // Hide character_container elements since calculations are still needed
        if (!trackingData[0].t_character_stats_section) {
            e_character_stats_container.style.display = 'none';
            e_character_stats_section.addEventListener('click', () => {
                toggle_section('stats');
            });
        }
        
        let e_stats_info = document.getElementById('stats_info');
        if (e_stats_info) {
            e_stats_info.innerHTML = '';
        }
    
        create_el('stats_info', 'div', e_character_stats_container);
        stats_info.innerHTML += '<p><b>CURRENT STATS:</b></p>';

        // Character stat information
        // Calculates ALL stat effects

        const stat_data = characterData.filter(d => d.type === 'stat');
        stat_data.forEach(stat => {

            let stats_effect = `<br><span style="color:lightgreen">(Base)</span>`;
            // Cwrtain base stats (lvl_mod: true) are increased by player level
            let base_level_stat = 0;
            let equip_stat_amt = 0;
            let d_player_character = saveData[1].savedCharacterData[0];
            let player_level = d_player_character.char_level;
            
            // Main array to store calculations
            let playerStats = characterData.find(d => d.id === 'player_stats');

            if (stat.lvl_mod) {
                // Adjust to equipment amount 
                equip_stat_amt = stat.amt - (stat.id === 'armor' ? 100 : 10);
                // Based on player 
                base_level_stat = stat.lvl_amt;
                base_level_stat *= d_player_character.char_level;
                //console.log(base_level_stat);
            }
            
            let equipped_items = saveData[3].equippedData;
            let current_weapon = equipped_items.find(i => i.id === 'mh');

            switch (stat.id) {
                case 'armor': 
                    let total_armor = base_level_stat + equip_stat_amt;
                    let total_armor_effect = total_armor * 0.1;
                    playerStats.total_armor = total_armor;
                    playerStats.total_armor_effect = total_armor_effect;
                    stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${base_level_stat}, reduces damage received by <b>${base_level_stat*0.1}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, reduces damage received by <b>${equip_stat_amt*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Armor: +${total_armor}, reduces damage received by <b>${total_armor_effect}%</b></span>`;
                    stat.amt = total_armor;
                    break;
                case 'strength':
                    let total_strength = base_level_stat + equip_stat_amt;
                    let total_strength_effect_dmg = total_strength * 0.1;
                    let total_strength_effect_res = (base_level_stat*0.1) + equip_stat_amt;
                    playerStats.total_strength = total_strength;
                    playerStats.total_strength_effect_dmg = total_strength_effect_dmg;
                    playerStats.total_strength_effect_res = total_strength_effect_res;
                    stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${base_level_stat}, increases both melee damage dealt by <b>${base_level_stat*0.1}%</b> and total energy by <b>${base_level_stat*0.1}</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases both melee damage dealt by <b>${equip_stat_amt*0.1}%</b> and total energy by <b>${equip_stat_amt}</b></span>
                    <br><span style="color:lightgreen">Total Strength: +${total_strength}, increases both melee damage dealt by <b>${total_strength_effect_dmg}%</b> and total energy by <b>${total_strength_effect_res}</b></span>`;
                    stat.amt = total_strength;
                    // Assign max resource to array
                    // Default: 100 (for melee classes)
                    let default_max_resource = 100;
                    playerStats.max_resource = default_max_resource + total_strength_effect_res;
                    playerStats.cur_resource = default_max_resource + total_strength_effect_res;
                    break;
                case 'intelligence':
                    let total_intelligence = base_level_stat + equip_stat_amt;
                    let total_intelligence_effect_dmg = total_intelligence * 0.1;
                    let total_intelligence_effect_res = (base_level_stat + equip_stat_amt) * 10;
                    // Assign to array
                    playerStats.total_intelligence = total_intelligence;
                    playerStats.total_intelligence_effect_dmg = total_intelligence_effect_dmg;
                    playerStats.total_intelligence_effect_res = total_intelligence_effect_res;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, increases magic damage dealt by <b>${base_level_stat*0.1}%</b> and total mana by <b>${base_level_stat*10}</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases magic damage dealt by <b>${equip_stat_amt*0.1}%</b> and total mana by <b>${equip_stat_amt*10}</b></span>
                    <br><span style="color:lightgreen">Total Intelligence: +${total_intelligence}, increases magic damage dealt by <b>${total_intelligence_effect_dmg}%</b> and total mana by <b>${total_intelligence_effect_res}</b></span>`;
                    stat.amt = total_intelligence;
                    break;
                case 'dexterity':
                    let default_hit = 90;
                    let total_dexterity = base_level_stat + equip_stat_amt;
                    let total_dexterity_effect = default_hit+(equip_stat_amt*0.1);
                    // Assign to array
                    playerStats.total_dexterity_effect = total_dexterity_effect;
                    stats_effect = `
                    <br><span style="color:lightgreen">Player Level (${player_level}) +${base_level_stat}, increases hit chance to <b>${default_hit}%</b>. Base same-level enemy hit chance: <b>${default_hit}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases hit chance by <b>${equip_stat_amt*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Dexterity: +${total_dexterity}. Same-level enemy hit chance: <b>${total_dexterity_effect}%</b></span>`;
                    stat.amt = total_dexterity;
                    break;
                case 'constitution':
                    let total_constitution = base_level_stat + equip_stat_amt;
                    let total_constitution_effect = total_constitution*10;
                    let max_health = total_constitution_effect; // Default 100 at level 1
                    let health_difference = (equip_stat_amt*10)/(base_level_stat*10)*100;
                    // Assign to array
                    playerStats.max_health = max_health;
                    playerStats.cur_health = max_health;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, sets base maximum health to <b>${base_level_stat*10}</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases maximum health by <b>${equip_stat_amt*10}</b> (${Math.round(health_difference)}%)</span>
                    <br><span style="color:lightgreen">Total Constitution: +${total_constitution}, increases total maximum health to <b>${total_constitution_effect}</b> (${Math.round(health_difference+100)}% of base)</span>`;
                    stat.amt = total_constitution;
                    break;
                case 'agility':
                    let base_crit = 5;
                    let total_agility = base_level_stat + equip_stat_amt;
                    let total_agility_effect = base_crit + (equip_stat_amt*0.1);
                    // Assign to array
                    playerStats.total_agility = total_agility;
                    playerStats.total_agility_effect = total_agility_effect;
                    playerStats.agility_equip = equip_stat_amt;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, increases melee critical strike chance by <b>${base_crit}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases melee critical strike chance by <b>${equip_stat_amt*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Agility: +${total_agility}, increases melee critical strike chance by <b>${total_agility_effect}%</b></span>`;
                    stat.amt = total_agility;
                    break;
                case 'wisdom':
                    let base_crit_wis = 5;
                    let total_wisdom = base_level_stat + equip_stat_amt;
                    let total_wisdom_effect = base_crit_wis + (equip_stat_amt*0.1);
                    // Add starting amt
                    playerStats.total_wisdom = total_wisdom;
                    playerStats.total_wisdom_effect = total_wisdom_effect;
                    playerStats.wisdom_equip = equip_stat_amt;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, increases magic critical strike chance by <b>${base_crit_wis}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases magic critical strike chance by <b>${(equip_stat_amt)*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Wisdom: +${total_wisdom}, increases magic critical strike chance by <b>${total_wisdom_effect}%</b></span>`;
                    stat.amt = total_wisdom;
                    break;
                case 'power':
                    if (current_weapon && current_weapon.equipped) {
                        let item_info = itemData.find(i => i.id === current_weapon.equipped);
                        let current_weapon_item_info = item_info.gains;
                        let current_weapon_dmg_min = current_weapon_item_info.find(w => w.stat === 'dmg_min');
                        let current_weapon_dmg_max = current_weapon_item_info.find(w => w.stat === 'dmg_max');
                        let [pwr_weapon_min, pwr_weapon_max] = calculate_weapon_damage(1, stat.amt, current_weapon_dmg_min.amt, current_weapon_dmg_max.amt);
                        trackingData[0].current_weapon_dmg_min = current_weapon_dmg_min.amt;
                        trackingData[0].current_weapon_dmg_max = current_weapon_dmg_max.amt;
                        let incr_dmg_min = Math.round((((pwr_weapon_min / current_weapon_dmg_min.amt) - 1) * 100) * 10) / 10;
                        let incr_dmg_max = Math.round((((pwr_weapon_max / current_weapon_dmg_max.amt) - 1) * 100) * 10) / 10;
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt}, increases attack damage per turn minimum by <b>${incr_dmg_min}%</b> and attack damage per turn maximum by <b>${incr_dmg_max}%</b></span>`;
                        // Store calculations for tooltip display
                        trackingData[0].pwr_weapon_min = pwr_weapon_min;
                        trackingData[0].pwr_weapon_max = pwr_weapon_max;
                        // Assign to array
                        playerStats.pwr_weapon_min = pwr_weapon_min;
                        playerStats.pwr_weapon_max = pwr_weapon_max;
                    } else {
                        trackingData[0].current_weapon_dmg_min = 1;
                        trackingData[0].current_weapon_dmg_max = 1.2;
                        let [pwr_weapon_min, pwr_weapon_max] = calculate_weapon_damage(1, stat.amt, trackingData[0].current_weapon_dmg_min, trackingData[0].current_weapon_dmg_max);
                        trackingData[0].pwr_weapon_min = pwr_weapon_min;
                        trackingData[0].pwr_weapon_max = pwr_weapon_max;
                        let incr_dmg_min = Math.round((((pwr_weapon_min / trackingData[0].current_weapon_dmg_min) - 1) * 100) * 10) / 10;
                        let incr_dmg_max = Math.round((((pwr_weapon_max / trackingData[0].current_weapon_dmg_max) - 1) * 100) * 10) / 10;
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt}, increases attack damage per turn minimum by <b>${incr_dmg_min}%</b> and attack damage per turn maximum by <b>${incr_dmg_max}%</b></span>`;
                    }
                    break;
                case 'attackMinimum':
                    if (current_weapon && current_weapon.equipped) {
                        let differ_dmg_min = Math.round((trackingData[0].pwr_weapon_min - trackingData[0].current_weapon_dmg_min) * 10) / 10;
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_min}, minimum damage is increased by power from ${trackingData[0].current_weapon_dmg_min} to <b>${trackingData[0].pwr_weapon_min}</b></span>`;
                        stat.amt = trackingData[0].pwr_weapon_min;
                    } else {
                        let base_attack_min = 1;
                        let differ_dmg_min = Math.round((trackingData[0].pwr_weapon_min - base_attack_min) * 10) / 10;
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_min}, minimum damage is increased by power from ${trackingData[0].current_weapon_dmg_min} to <b>${trackingData[0].pwr_weapon_min}</b></span>`;
                        stat.amt = trackingData[0].pwr_weapon_min;
                    }
                    break;
                case 'attackMaximum':
                    if (current_weapon && current_weapon.equipped) {
                        let differ_dmg_max = Math.round((trackingData[0].pwr_weapon_max - trackingData[0].current_weapon_dmg_max) * 10) / 10;
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_max}, minimum damage is increased by power from ${trackingData[0].current_weapon_dmg_max} to <b>${trackingData[0].pwr_weapon_max}</b></span>`;
                        stat.amt = trackingData[0].pwr_weapon_max;
                    } else {
                        let base_attack_max = 1.2;
                        let differ_dmg_max = Math.round((trackingData[0].pwr_weapon_max - base_attack_max) * 10) / 10;
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_max}, minimum damage is increased by power from ${trackingData[0].current_weapon_dmg_max} to <b>${trackingData[0].pwr_weapon_max}</b></span>`;
                        stat.amt = trackingData[0].pwr_weapon_max;
                    }
                    break;
                case 'hitChance':
                    // Assign to array
                    stat.amt += playerStats.total_dexterity_effect;
                    let stat_display = stat.amt + '%';
                    playerStats.total_hit_chance = stat.amt;
                    playerStats.hit_chance_display = stat_display;
                    playerStats.hit_flat = 90;
                    playerStats.hit_plus_1 = 87;
                    playerStats.hit_plus_2 = 85;
                    playerStats.hit_plus_3on = 50;
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt}%`;
                    stats_effect += `<br><b>- Probability an attack will cause damage to <u>same-level</u> enemies: ${stat.amt}%</b>`;
                    stats_effect += `<br>- Current probability an attack will cause damage to <u>level +1</u> enemies: ${-3+stat.amt}%`;
                    stats_effect += `<br>- Current probability an attack will cause damage to <u>level +2</u> enemies: ${-5+stat.amt}%`;
                    stats_effect += `<br>- Current probability an attack will cause damage to <u>level +3 or higher</u> enemies: ${-40+stat.amt}%</span>`;
                    break;
                case 'criticalStrikeChance':
                    let base_crit_strike_rating = 5;
                    let crit_strike_rating = stat.amt;
                    // 0 unless a +_% Meleee Citical Strike Rating stat
                    playerStats.base_crit_strike_rating = base_crit_strike_rating;
                    playerStats.crit_strike_rating = crit_strike_rating;
                    playerStats.total_crit_chance = base_crit_strike_rating + crit_strike_rating;
                    stats_effect = `<br><span style="color:lightgreen">Combined equipment and base bonus: +${base_crit_strike_rating}%, increases the probability any successful attack is critical by <b>${base_crit_strike_rating}%</b></span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Melee equipment bonus: +${playerStats.agility_equip} Agility, increases the probability a successful melee attack is critical by <b>${playerStats.total_agility_effect}%</b></span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Magic equipment bonus: +${playerStats.wisdom_equip} Wisdom, increases the probability a successful magic attack is critical by <b>${playerStats.total_wisdom_effect}%</b></span>`;
                    stat.amt = playerStats.base_crit_strike_rating + playerStats.crit_strike_rating + '%';
                    break;
            }

            let line_item = stat.label + stat.amt + stats_effect + '<br>';
            if (stat.id === 'hitChance') {
                line_item = stat.label + playerStats.hit_chance_display + stats_effect + '<br>';
            }
            stats_info.innerHTML += line_item;
        });

        // Stat descriptions
        create_el('stats_desc_lbl', 'div', character_stats_container);
        stats_desc_lbl.innerHTML = '<br><b>STAT DEFINITIONS:</b<br>';
        create_el('stats_desc', 'div', character_stats_container);
        stats_desc.innerHTML = '<p>';
        let stat_data_desc = characterData.filter(d => d.type === 'desc');
        stat_data_desc.forEach(stat => {
            let line_item = '<b>' + stat.label + ':</b> ' + stat.def + '<br>';
            stats_desc.innerHTML += line_item;
        });

    // Update only stats
    } else {
        const stat_data = characterData.filter(d => d.type === 'stat');
        stat_data.forEach(stat => {

            // Cwrtain base stats (lvl_mod: true) are increased by player level
            let base_level_stat = 0;
            let equip_stat_amt = 0;
            let d_player_character = saveData[1].savedCharacterData[0];
            let player_level = d_player_character.char_level;
            
            // Main array to store calculations
            let playerStats = characterData.find(d => d.id === 'player_stats');

            if (stat.lvl_mod) {
                // Adjust to equipment amount 
                equip_stat_amt = stat.amt - (stat.id === 'armor' ? 100 : 10);
                // Based on player 
                base_level_stat = stat.lvl_amt;
                base_level_stat *= d_player_character.char_level;
            }
            
            let equipped_items = saveData[3].equippedData;
            let current_weapon = equipped_items.find(i => i.id === 'mh');

            switch (stat.id) {
                case 'armor': 
                    let total_armor = base_level_stat + equip_stat_amt;
                    let total_armor_effect = total_armor * 0.1;
                    playerStats.total_armor = total_armor;
                    playerStats.total_armor_effect = total_armor_effect;
                    stat.amt = total_armor;
                    break;
                case 'strength':
                    let total_strength = base_level_stat + equip_stat_amt;
                    let total_strength_effect_dmg = total_strength * 0.1;
                    let total_strength_effect_res = (base_level_stat*0.1) + equip_stat_amt;
                    playerStats.total_strength = total_strength;
                    playerStats.total_strength_effect_dmg = total_strength_effect_dmg;
                    playerStats.total_strength_effect_res = total_strength_effect_res;
                    stat.amt = total_strength;
                    // Assign max resource to array
                    // Default: 100 (for melee classes)
                    let default_max_resource = 100;
                    playerStats.max_resource = default_max_resource + total_strength_effect_res;
                    playerStats.cur_resource = default_max_resource + total_strength_effect_res;
                    break;
                case 'intelligence':
                    let total_intelligence = base_level_stat + equip_stat_amt;
                    let total_intelligence_effect_dmg = total_intelligence * 0.1;
                    let total_intelligence_effect_res = (base_level_stat + equip_stat_amt) * 10;
                    // Assign to array
                    playerStats.total_intelligence = total_intelligence;
                    playerStats.total_intelligence_effect_dmg = total_intelligence_effect_dmg;
                    playerStats.total_intelligence_effect_res = total_intelligence_effect_res;
                    stat.amt = total_intelligence;
                    break;
                case 'dexterity':
                    let default_hit = 90;
                    let total_dexterity = base_level_stat + equip_stat_amt;
                    let total_dexterity_effect = default_hit+(equip_stat_amt*0.1);
                    // Assign to array
                    playerStats.total_dexterity_effect = total_dexterity_effect;
                    stat.amt = total_dexterity;
                    break;
                case 'constitution':
                    let total_constitution = base_level_stat + equip_stat_amt;
                    let total_constitution_effect = total_constitution*10;
                    let max_health = total_constitution_effect; // Default 100 at level 1
                    let health_difference = (equip_stat_amt*10)/(base_level_stat*10)*100;
                    // Assign to array
                    playerStats.max_health = max_health;
                    playerStats.cur_health = max_health;
                    stat.amt = total_constitution;
                    break;
                case 'agility':
                    let base_crit = 5;
                    let total_agility = base_level_stat + equip_stat_amt;
                    let total_agility_effect = base_crit + (equip_stat_amt*0.1);
                    // Assign to array
                    playerStats.total_agility = total_agility;
                    playerStats.total_agility_effect = total_agility_effect;
                    playerStats.agility_equip = equip_stat_amt;
                    stat.amt = total_agility;
                    break;
                case 'wisdom':
                    let base_crit_wis = 5;
                    let total_wisdom = base_level_stat + equip_stat_amt;
                    let total_wisdom_effect = base_crit_wis + (equip_stat_amt*0.1);
                    // Add starting amt
                    playerStats.total_wisdom = total_wisdom;
                    playerStats.total_wisdom_effect = total_wisdom_effect;
                    playerStats.wisdom_equip = equip_stat_amt;
                    stat.amt = total_wisdom;
                    break;
                case 'power':
                    if (current_weapon && current_weapon.equipped) {
                        let item_info = itemData.find(i => i.id === current_weapon.equipped);
                        let current_weapon_item_info = item_info.gains;
                        let current_weapon_dmg_min = current_weapon_item_info.find(w => w.stat === 'dmg_min');
                        let current_weapon_dmg_max = current_weapon_item_info.find(w => w.stat === 'dmg_max');
                        let [pwr_weapon_min, pwr_weapon_max] = calculate_weapon_damage(1, stat.amt, current_weapon_dmg_min.amt, current_weapon_dmg_max.amt);
                        trackingData[0].current_weapon_dmg_min = current_weapon_dmg_min.amt;
                        trackingData[0].current_weapon_dmg_max = current_weapon_dmg_max.amt;
                        let incr_dmg_min = Math.round((((pwr_weapon_min / current_weapon_dmg_min.amt) - 1) * 100) * 10) / 10;
                        let incr_dmg_max = Math.round((((pwr_weapon_max / current_weapon_dmg_max.amt) - 1) * 100) * 10) / 10;
                        // Store calculations for tooltip display
                        trackingData[0].pwr_weapon_min = pwr_weapon_min;
                        trackingData[0].pwr_weapon_max = pwr_weapon_max;
                        // Assign to array
                        playerStats.pwr_weapon_min = pwr_weapon_min;
                        playerStats.pwr_weapon_max = pwr_weapon_max;
                    } else {
                        trackingData[0].current_weapon_dmg_min = 1;
                        trackingData[0].current_weapon_dmg_max = 1.2;
                        let [pwr_weapon_min, pwr_weapon_max] = calculate_weapon_damage(1, stat.amt, trackingData[0].current_weapon_dmg_min, trackingData[0].current_weapon_dmg_max);
                        trackingData[0].pwr_weapon_min = pwr_weapon_min;
                        trackingData[0].pwr_weapon_max = pwr_weapon_max;
                        let incr_dmg_min = Math.round((((pwr_weapon_min / trackingData[0].current_weapon_dmg_min) - 1) * 100) * 10) / 10;
                        let incr_dmg_max = Math.round((((pwr_weapon_max / trackingData[0].current_weapon_dmg_max) - 1) * 100) * 10) / 10;
                    }
                    break;
                case 'attackMinimum':
                    if (current_weapon && current_weapon.equipped) {
                        let differ_dmg_min = Math.round((trackingData[0].pwr_weapon_min - trackingData[0].current_weapon_dmg_min) * 10) / 10;
                        stat.amt = trackingData[0].pwr_weapon_min;
                    } else {
                        let base_attack_min = 1;
                        let differ_dmg_min = Math.round((trackingData[0].pwr_weapon_min - base_attack_min) * 10) / 10;
                        stat.amt = trackingData[0].pwr_weapon_min;
                    }
                    break;
                case 'attackMaximum':
                    if (current_weapon && current_weapon.equipped) {
                        let differ_dmg_max = Math.round((trackingData[0].pwr_weapon_max - trackingData[0].current_weapon_dmg_max) * 10) / 10;
                        stat.amt = trackingData[0].pwr_weapon_max;
                    } else {
                        let base_attack_max = 1.2;
                        let differ_dmg_max = Math.round((trackingData[0].pwr_weapon_max - base_attack_max) * 10) / 10;
                        stat.amt = trackingData[0].pwr_weapon_max;
                    }
                    break;
                case 'hitChance':
                    // Assign to array
                    stat.amt += playerStats.total_dexterity_effect;
                    let stat_display = stat.amt + '%';
                    playerStats.total_hit_chance = stat.amt;
                    playerStats.hit_chance_display = stat_display;
                    playerStats.hit_flat = 90;
                    playerStats.hit_plus_1 = 87;
                    playerStats.hit_plus_2 = 85;
                    playerStats.hit_plus_3on = 50;
                    break;
                case 'criticalStrikeChance':
                    let base_crit_strike_rating = 5;
                    let crit_strike_rating = stat.amt;
                    // 0 unless a +_% Meleee Citical Strike Rating stat
                    playerStats.base_crit_strike_rating = base_crit_strike_rating;
                    playerStats.crit_strike_rating = crit_strike_rating;
                    playerStats.total_crit_chance = base_crit_strike_rating + crit_strike_rating;
                    stat.amt = playerStats.base_crit_strike_rating + playerStats.crit_strike_rating + '%';
                    break;
            }
        });
    }
}

// calc not ready for ilvl !== 1
// sets all ilvls to 1
export function calculate_weapon_damage(itemLevel, statPower, minDmg, maxDmg) {

    itemLevel = 1;

    // calc min/max damage of weapons for player display
    let damage_min = Math.round((1.08*itemLevel*minDmg)*10)/10;
    let damage_max = Math.round((1.06*itemLevel*maxDmg)*10)/10;
        
    // *** multipliers
    
    // Power
    let power = statPower; // 0: 24 - 32.4 / 1: 24.2 - 34.7
    damage_min *= (1 + (0.02 * power));
    damage_max *= (1 + (0.02 * power));
    
    // final calculation
    damage_min = Math.round(damage_min*10)/10;
    damage_max = Math.round(damage_max*10)/10;

    if (power === 0) {
        damage_min = minDmg;
        damage_max = maxDmg;
    }

    return [damage_min, damage_max];
}

// Swap equipment as equipped/unequipped after clicking 'EQUIP'/'REMOVE'
export function swap_equipment(item, action) {

    let d_itemData = itemData.find(i => i.id === item);
    let saveDataEquipAll = saveData[3].equippedData;
    let saveDataEquip = saveDataEquipAll.filter(e => e.equipped !== null);
    let equipped_item = saveDataEquip.find(i => i.equipped === d_itemData.id);
    let equipped_item_container = 'equipment_tooltip_container_' + d_itemData.id;
    let e_equipped_item_container = document.getElementById(equipped_item_container);

    // Remove: remove item from equipped
    if (action === 'remove' && e_equipped_item_container && equipped_item && equipped_item.equipped === item) {

        // Remember item
        let item_to_remove = item;
        let d_itemData_item_to_remove = itemData.find(i => i.id === item_to_remove);
        // Clear item from equippes
        equipped_item.equipped = null;

        // Add previously equipped item back into inventory
        if (item_to_remove) {
            updateLootCount(item_to_remove, 1);
        }
        
        // Reload character equipment & stats
        update_character();
    }
}

export function update_equipment() {
    
    // Reset stats
    let stat_data_reset = characterData.filter(d => d.type === 'stat');

    stat_data_reset.forEach(reset => {
        reset.amt = reset.base;
    });
    
    // Match saveData with items
    let d_equippedData = saveData[3].equippedData;
    d_equippedData.forEach(item => {
        let d_itemData = itemData.find(i => i.id === item.equipped);

        if (d_itemData) {
            const stat_gains = d_itemData.gains;
            const stat_data = characterData.filter(d => d.type === 'stat');
            // Calculate total stats equipped
            stat_data.forEach(stat => {
                stat_gains.forEach(char_stat => {
                    if (char_stat.stat === stat.id) {
                        stat.amt += char_stat.amt;
                    }
                });
            });
        } 
    });
}

// Test
// Quick DOM modifications
function gel(id, css = null, inner = null, ...styles) {
    try {
        const element = document.getElementById(id);
        
        // If element is not found, throw an error
        if (!element) {
            throw new Error(`Element with ID '${id}' not found`);
        }

        // Apply CSS class if provided
        if (css) {
            element.classList.add(css);
        }
        
        // Apply innerHTML if provided
        if (inner) {
            element.innerHTML = inner;
        }
        
        // Apply styles if any are provided
        styles.forEach(style => {
            let [property, value] = style.split(':').map(s => s.trim()); // Split and trim the style string
            if (property && value) {
                element.style[property] = value;
            }
        });

        return element;
    } catch (error) {
        // Log the error, ID, and stack trace for easy tracking
        console.error(`Error in manipulating element with ID '${id}':`, error.message);
        console.error(`Error occurred at:`, error.stack);
    }
}

// Example usage:
// let e_my_element = gel('my_element', 'css_class', 'Text', 'display: block', 'padding: 5px');
// e_my_element.innerHTML = 'Change to this text';
/* WIP: let mods = [
{ id: 'my_element',
{ css: 'css_class',
{ inner: 'Text',
{ styles: 'display: block',
{ styles: 'padding: 5px'
];*/

export function update_health() {

// PLAYER

    // Data needed
    let playerStats = characterData.find(d => d.id === 'player_stats');
    // Elements to update
    let e_char_health = document.getElementById('e_char_health');
    let e_player_health_bar_fill = document.getElementById('player_health_bar_fill');
    let e_player_current_health_percent = document.getElementById('player_current_health_percent');
    // If death occurs
    let e_player_current_health_text = document.getElementById('player_current_health_text');
    let e_player_maximum_health = document.getElementById('player_maximum_health');

    // Update elements
    e_char_health.innerHTML = playerStats.cur_health;
    e_player_health_bar_fill.style.width = Math.round(((playerStats.cur_health / playerStats.max_health) * 100)) + '%';
    let d_player_current_health_percent = (playerStats.cur_health / playerStats.max_health) * 100;
    d_player_current_health_percent = Math.round(d_player_current_health_percent * 10) / 10;
    e_player_current_health_percent.innerHTML = d_player_current_health_percent + '%';
    
    // Player death
    if (playerStats.cur_health <= 0) {
        playerStats.cur_health = 0;
        e_player_health_bar_fill.style.width = '0%';
        e_player_current_health_percent.innerHTML = '';
        e_player_current_health_text.innerHTML = '[ DEAD ]';
        e_player_maximum_health.innerHTML = '';
        // clear resource and experience bars
        let e_player_resource_bar = document.getElementById('battle_ui_container3');
        let e_experience_bar = document.getElementById('experience_container');
        e_experience_bar.classList.remove('bar_with_border_container');
        e_player_resource_bar.innerHTML = '';
        e_experience_bar.innerHTML = '';
        // remove combat
        toggle_combat_status();
        // reset encounter
        let encounter = encounterData.find(e => e.loc === trackingData[0].loc && e.lvl === trackingData[0].lvl);
        encounter.in_combat = false;
        playerStats.dead = true;
        return;
    }
    
// ENEMY ////

    let encounter = encounterData.find(e => e.id === 'beginner_0');

    // First encounter
    if (encounter.in_combat && trackingData[0].loc === 0 && trackingData[0].lvl === 1) {
// Encounters need to be set up with loc, lvl linked

        let e_enemy_health = document.getElementById('e_enemy_health');
        let e_enemy_current_health_percent = document.getElementById('enemy_current_health_percent');
        let e_enemy_health_bar_fill = document.getElementById('enemy_health_bar_fill');
        let e_enemy_current_health_text = document.getElementById('enemy_current_health_text');
        let e_enemy_maximum_health = document.getElementById('enemy_maximum_health');

        let d_enemy_health_percent = (encounter.cur_health / encounter.max_health) * 100;
        d_enemy_health_percent = Math.round(d_enemy_health_percent * 10) / 10;
        
        // Update elements
        e_enemy_health.innerHTML = Math.round(encounter.cur_health * 10) / 10;
        e_enemy_current_health_percent.innerHTML = d_enemy_health_percent + '%';
        e_enemy_health_bar_fill.style.width = d_enemy_health_percent + '%';
        
        // Enemy death
        if (encounter.cur_health <= 0) {
            encounter.cur_health;
            e_enemy_health_bar_fill.style.width = '0%';
            e_enemy_current_health_percent.innerHTML = '';
            e_enemy_current_health_text.innerHTML = '[ DEAD ]';
            e_enemy_maximum_health.innerHTML = '';
            toggle_combat_status();
            let e_player_to_enemy_btn = document.getElementById('player_to_enemy_btn');
            e_player_to_enemy_btn.innerHTML = '[ DEFEATED ]';

        }
    }

}

export function toggle_combat_status() {

    let playerCombat = characterData.find(c => c.id === 'player_combat_status');
    // playerCombat.in_combat = true/false
    
    let spacer_player_combat_status = document.getElementById('spacer_player_combat_status');
    let player_combat_status = document.getElementById('player_combat_status');
    let player_battle_status_bars = document.getElementById('player_battle_status_bars');
    let enemy_battle_status_bars = document.getElementById('enemy_battle_status_bars');

    // Toggle combat off
    if (playerCombat.in_combat === true) {
        spacer_player_combat_status.style.height = '17px';
        player_combat_status.style.display = 'none';
        player_battle_status_bars.style.border = 'solid 5px #333';
        enemy_battle_status_bars.style.border = 'solid 5px #333';
        playerCombat.in_combat = false;
        return;
    }

    // Toggle combat on
    if (playerCombat.in_combat === false) {
        spacer_player_combat_status.style.height = '5px';
        player_combat_status.style.display = 'block';
        player_battle_status_bars.style.border = 'solid 5px red';
        enemy_battle_status_bars.style.border = 'solid 5px red';
        playerCombat.in_combat = true;
        return;
    }
}

export function xp_gain(lvl) {
    //let exp_array = encounterData.find(e => e.id === 'experience');
    //let experienceGains = exp_array.experienceGains;
    let random_exp = 0;

    for (let i=1; i<=20; i++) {
        if (lvl === i) {
            random_exp = randomize(80, 99, 1) * i * 2;
            //experienceGains.push({
            //    lvl: i,
            //    xp: random_exp,
            //});
        }
    }
    //console.log(experienceGains);
    return random_exp;
}

export function update_xp() {
    
    // Data needed
    let d_player_character = saveData[1].savedCharacterData[0];
    // Update xp progress
    let e_char_exp = document.getElementById('e_char_exp');
    let e_experience_bar_fill = document.getElementById('experience_bar_fill');
    let e_experience_percent = document.getElementById('experience_percent');
    let e_player_level = document.getElementById('player_level');
    let e_experience_to_level = document.getElementById('experience_to_level');
    let fill_amt = (d_player_character.char_exp / d_player_character.char_exp_to_level) * 100;
    // Experience values
    let d_exp_filter = characterData.filter(c => c.type === 'exp');
    let d_exp = d_exp_filter[0];
    e_char_exp.innerHTML = d_player_character.char_exp;

    // Calculate fill
    fill_amt = Math.round(fill_amt * 10) / 10 + '%';
    e_experience_bar_fill.style.width = fill_amt;
    e_experience_percent.innerHTML = fill_amt;
    if (d_player_character.char_exp >= d_player_character.char_exp_to_level) {
        d_player_character.char_level += 1;
        e_player_level.innerHTML = 'Level: ' + d_player_character.char_level;
        let char_exp_level = d_exp.experienceValues.find(l => l.level === d_player_character.char_level);
        let NEW_xp = char_exp_level.exp_to_level;
        let leftover_xp = d_player_character.char_exp - d_player_character.char_exp_to_level;
        d_player_character.char_exp = leftover_xp;
        d_player_character.char_exp_to_level = NEW_xp;
        fill_amt = (d_player_character.char_exp / d_player_character.char_exp_to_level) * 100;
        fill_amt = Math.round(fill_amt * 10) / 10 + '%';
        e_char_exp.innerHTML = d_player_character.char_exp;
        e_experience_bar_fill.style.width = fill_amt;
        e_experience_percent.innerHTML = fill_amt;
        e_experience_to_level.innerHTML = d_player_character.char_exp_to_level;
    }
}

function reset_battle() {
    // Clear attack flag
    trackingData[0].next_attack = false;
    // Clear combat_log flag
    trackingData[0].combat_log_created = false;
    // Clear attack_again_btn
    let e_attack_again_btn = document.getElementById('attack_again_btn');
    if (e_attack_again_btn) { e_attack_again_btn.parentNode.removeChild(e_attack_again_btn); }
    // Clear battle elements
    let e_all_battle_ui_elements = document.getElementById('all_battle_ui_elements');
    if (e_all_battle_ui_elements) {
        e_all_battle_ui_elements.innerHTML = '';
    }
    // Reset location tracking
    trackingData[0].loc = 0;
    trackingData[0].lvl = 0;
    trackingData[0].level_selected = false;
    // Clear location elements
    update_locations();
}

// WIP2
export function start_battle() {

    // Data
    let d_player_character = saveData[1].savedCharacterData[0];
    let playerStats = characterData.find(d => d.id === 'player_stats');

    // Main battle container
    let battle_section_container = document.getElementById('battle_section_container');

    // All battle specific elements
    create_el('all_battle_ui_elements', 'div', battle_section_container);

    // Clear all Elements
    let e_battle_ui_container = document.getElementById('battle_ui_container');
    if (e_battle_ui_container) {
        e_battle_ui_container.innerHTML = '';
    }

    // Parent for ui, resets each update
    create_el('battle_ui_container', 'div', all_battle_ui_elements);
    battle_ui_container.classList.add('location_box_style');

    // Spacer
    create_el('spacer_player_combat_status', 'div', all_battle_ui_elements);
    spacer_player_combat_status.style.height = '17px';
    spacer_player_combat_status.style.backgroundColor = 'black';
    spacer_player_combat_status.style.height = '17px';
    // Toggle combat on
    //spacer_player_combat_status.style.height = '5px';

    // Spacer
    create_el('player_combat_status', 'span', all_battle_ui_elements);
    player_combat_status.style.textAlign = 'center';
    player_combat_status.style.fontSize = '12px';
    player_combat_status.style.width = '100%';
    player_combat_status.style.display = 'none';
    // Toggle combat on
    //player_combat_status.style.display = 'block';
    player_combat_status.innerHTML = '<b><span style="background-color:red;">&nbsp;&nbsp; IN COMBAT &nbsp;&nbsp;</span></b>';

    // Place battle_ui_container2/3 here
    create_el('player_battle_status_bars', 'div', all_battle_ui_elements);
    player_battle_status_bars.style.width = "100%";
    player_battle_status_bars.style.border = 'solid 5px #333';
    // Toggle combat on
    //player_battle_status_bars.style.border = 'solid 5px red';

    // Player labels
    // Add to group player_battle_status_bars
    create_el('player_name_level', 'div', 'player_battle_status_bars');
    player_name_level.style.backgroundColor = '#333';
    player_name_level.style.fontSize = '18px';
    player_name_level.style.color = '#00FFFF';
    player_name_level.style.padding = '5px';

    create_el('player_name', 'span', 'player_name_level');
    player_name.innerHTML = d_player_character.char_name;
    player_name.style.display = 'inline-block';
    player_name.style.width = '50%';

    create_el('player_level', 'span', 'player_name_level');
    player_level.innerHTML = 'Level: ' + d_player_character.char_level;
    player_level.style.display = 'inline-block';
    player_level.style.width = '50%';
    player_level.style.textAlign = 'right';

    // Player health
    // Add to group player_battle_status_bars
    create_el('battle_ui_container2', 'div', 'player_battle_status_bars');

    // Create player health container
    create_el('player_health_container', 'div', 'battle_ui_container2');
    player_health_container.classList.add('bar_with_border_container');

    // Create the player_health bar fill (blue bar)
    create_el('player_health_bar_fill', 'div', 'player_health_container');
    player_health_bar_fill.classList.add('bar_with_border_fill');
    player_health_bar_fill.style.backgroundColor = 'green';
    // Fill calculated below

    create_el('player_current_health_text', 'span', 'player_health_container');
    player_current_health_text.classList.add('bar_with_border_text');
    player_current_health_text.innerHTML = 'Player Health: <span id="e_char_health">' + playerStats.cur_health + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_health

    create_el('player_maximum_health', 'span', 'player_current_health_text');
    player_maximum_health.innerHTML = playerStats.max_health;

    create_el('player_current_health_percent', 'span', 'player_health_container');
    player_current_health_percent.classList.add('bar_with_border_percent');
    let d_player_health_percent = (playerStats.cur_health / playerStats.max_health) * 100;
    d_player_health_percent = Math.round(d_player_health_percent * 10) / 10;
    player_current_health_percent.innerHTML = d_player_health_percent + '%';

    // Display bar width fill
    player_health_bar_fill.style.width = d_player_health_percent + '%';

    // Initial display
    update_health();

    // Player resource
    // Add to group player_battle_status_bars
    create_el('battle_ui_container3', 'div', 'player_battle_status_bars');

    // Create player resource container
    create_el('player_resource_container', 'div', 'battle_ui_container3');
    player_resource_container.classList.add('bar_with_border_container');

    // Create the player_resource bar fill (yellow bar)
    create_el('player_resource_bar_fill', 'div', 'player_resource_container');
    player_resource_bar_fill.classList.add('bar_with_border_fill');
    player_resource_bar_fill.style.backgroundColor = '#6E6800';
    // Fill calculated below

    create_el('player_current_resource_text', 'span', 'player_resource_container');
    player_current_resource_text.classList.add('bar_with_border_text');
    player_current_resource_text.innerHTML = 'Player Resource: <span id="e_char_resource">' + playerStats.cur_resource + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_resource

    create_el('player_maximum_resource', 'span', 'player_current_resource_text');
    player_maximum_resource.innerHTML = playerStats.max_resource;

    create_el('player_current_resource_percent', 'span', 'player_resource_container');
    player_current_resource_percent.classList.add('bar_with_border_percent');
    let d_player_resource_percent = (playerStats.cur_resource / playerStats.max_resource) * 100;
    d_player_resource_percent = Math.round(d_player_resource_percent * 10) / 10;
    player_current_resource_percent.innerHTML = d_player_resource_percent + '%';

    // Display bar width fill
    player_resource_bar_fill.style.width = d_player_resource_percent + '%';

    // Create the experience container
    create_el('experience_container', 'div', 'player_battle_status_bars');
    experience_container.classList.add('bar_with_border_container');

    // Create the experience bar fill (blue bar)
    create_el('experience_bar_fill', 'div', 'experience_container');
    experience_bar_fill.classList.add('bar_with_border_fill');

    create_el('experience_text', 'span', 'experience_container');
    experience_text.classList.add('bar_with_border_text');
    experience_text.innerHTML = 'Experience: <span id="e_char_exp">' + d_player_character.char_exp + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_exp

    create_el('experience_percent', 'span', 'experience_container');
    experience_percent.classList.add('bar_with_border_percent');

    // Calculate experience values
    let d_exp_filter = characterData.filter(c => c.type === 'exp');
    let d_exp = d_exp_filter[0];
    
    // Store experience values for each level
    d_exp.experienceValues = [];
    
    for (let i = 1; i <= d_exp.level_cap; i++) {
        let expToLevel = Math.round((d_exp.starting_val * (i**1.5 + d_exp.level_rate)) / 10) * 10;
        d_exp.experienceValues.push({
            level: i,
            exp_to_level: expToLevel,
            //diff: expToLevel - Math.round((d_exp.starting_val * ((i - 1)**1.5 + d_exp.level_rate)) / 10) * 10 // Uncomment if you need the diff
        });
    }
    
    // Log experience values for each level
    d_exp.experienceValues.forEach(xp => {
        //console.log(`Level: ${xp.level}, Exp to Level: ${xp.exp_to_level}`);
        //console.log(`Level: ${xp.level}, Exp to Level: ${xp.exp_to_level}, Diff: ${xp.diff}`);
        if (d_player_character.char_level === xp.level) {
            d_player_character.char_exp_to_level = xp.exp_to_level;
        }
    });

    create_el('experience_to_level', 'span', 'experience_text');
    experience_to_level.innerHTML = d_player_character.char_exp_to_level;

    // Initial display
    update_xp();









// Need update_resource

    // Setup battle encounter
    create_el('battle_verses_box', 'div', all_battle_ui_elements);
    battle_verses_box.innerHTML = '<p style="text-align:center;font-size:16px;color:red;" id="player_to_enemy_btn">[ TARGETING ]</p>';

//// WIP Enemy battle elemwnta
// WIP need multiple enemies

    // Place enemy_ui_containers here
    create_el('enemy_battle_status_bars', 'div', all_battle_ui_elements);
    enemy_battle_status_bars.style.width = "100%";
    enemy_battle_status_bars.style.border = 'solid 5px #333';

    // Enemy labels
    // Add to group enemy_battle_status_bars
    create_el('enemy_name_level', 'div', 'enemy_battle_status_bars');
    enemy_name_level.style.backgroundColor = '#333';
    enemy_name_level.style.fontSize = '18px';
    enemy_name_level.style.color = '#00FFFF';
    enemy_name_level.style.padding = '5px';

    // Enemy data
    let encounter = null;
    let random_enemy = null;

    // Choose encounter & enemy
    // First encounter
    console.log('first encounter loc/lvl? ' + trackingData[0].loc + ' / ' + trackingData[0].lvl);
    if (trackingData[0].loc === 0 && trackingData[0].lvl === 1) {
        // Encounters need to be set up with loc, lvl linked
        // 
        encounter = encounterData.find(e => e.id === 'beginner_0');
        // Choose random array index of enemyList;
        let enemyList = encounter.enemy_list;
        random_enemy = choose_enemy(enemyList);
        // Mark enemy alive
        random_enemy.dead = false;
        trackingData[0].current_enemy = random_enemy.id;
    } else {
        // All other encounters
        let enemy_loc = trackingData[0].loc;
        let enemy_lvl = trackingData[0].lvl;
        // Get matching loc/lvl encounter
        encounter = encounterData.find(e => e.loc === enemy_loc && e.lvl === enemy_lvl);
        // Choose random array index of enemyList;
        let enemyList = encounter.enemy_list;
        random_enemy = choose_enemy(enemyList);
        // Mark enemy alive
        random_enemy.dead = false;
        trackingData[0].current_enemy = random_enemy.id;
        //// WIP more array data needed
    }
    
    
    console.log('encounter/enemy?\n');
    console.log(encounter);
    console.log(random_enemy);
    if (encounter && random_enemy) {
        create_el('enemy_name', 'span', 'enemy_name_level');
        enemy_name.innerHTML = random_enemy.lbl;
        enemy_name.style.display = 'inline-block';
        enemy_name.style.width = '50%';
    
        create_el('enemy_level', 'span', 'enemy_name_level');
        enemy_level.innerHTML = 'Level: ' + random_enemy.lvl;
        enemy_level.style.display = 'inline-block';
        enemy_level.style.width = '50%';
        enemy_level.style.textAlign = 'right';

        // Enemy health
        // Add to group player_battle_status_bars
        create_el('battle_ui_enemy_container', 'div', 'enemy_battle_status_bars');
    
        // Create player health container
        create_el('enemy_health_container', 'div', 'battle_ui_enemy_container');
        enemy_health_container.classList.add('bar_with_border_container');
    
        // Create the player_health bar fill (blue bar)
        create_el('enemy_health_bar_fill', 'div', 'enemy_health_container');
        enemy_health_bar_fill.classList.add('bar_with_border_fill');
        enemy_health_bar_fill.style.backgroundColor = 'green';
        // Fill calculated below

        // Get random enemy max health value
        encounter.max_health = randomize(encounter.hp_min, encounter.hp_max, 1);
        encounter.cur_health = encounter.max_health;

        create_el('enemy_current_health_text', 'span', 'enemy_health_container');
        enemy_current_health_text.classList.add('bar_with_border_text');
        enemy_current_health_text.innerHTML = 'Enemy Health: <span id="e_enemy_health">' + encounter.cur_health + '</span>&nbsp;/&nbsp;';
        // Inserts e_enemy_health
    
        create_el('enemy_maximum_health', 'span', 'enemy_current_health_text');
        enemy_maximum_health.innerHTML = encounter.max_health;
    
        create_el('enemy_current_health_percent', 'span', 'enemy_health_container');
        enemy_current_health_percent.classList.add('bar_with_border_percent');
        let d_enemy_health_percent = (encounter.cur_health / encounter.max_health) * 100;
        d_enemy_health_percent = Math.round(d_enemy_health_percent * 10) / 10;
        enemy_current_health_percent.innerHTML = d_enemy_health_percent + '%';

        // Display bar width fill
        enemy_health_bar_fill.style.width = d_enemy_health_percent + '%';

        // Insert combat log
        create_el('combat_log_container', 'div', 'all_battle_ui_elements');
    }

    gf.toggleElement('h', 'new_battle_button');
    gf.toggleElement('s', 'attack_box_button');

    // Fetch or create attack button
    let e_attack_box_button = document.getElementById('attack_box_button');
    if (e_attack_box_button) {
        e_attack_box_button.addEventListener('click', () => {
            gf.toggleElement('s', 'change_location_button');
            attack_box_button(e_attack_box_button, random_enemy, encounter);
            trackingData[0].level_selected = false;
        });
    } else if (!trackingData[0].level_selected) {
        e_attack_box_button = document.createElement('button');
        let e_location_container = document.getElementById('location_container');
        e_location_container.appendChild(e_attack_box_button);
        e_attack_box_button.innerHTML = '<b><font style="font-size: 24px;"> ATTACK </font></b>';
        e_attack_box_button.classList.add('location_box_style');
        e_attack_box_button.classList.add('center');
        trackingData[0].level_selected = true;
        e_attack_box_button.addEventListener('click', () => {
            gf.toggleElement('s', 'change_location_button');
            attack_box_button(e_attack_box_button, random_enemy, encounter);
        });
    }

    let e_change_location = document.getElementById('change_location_button');
    e_change_location.addEventListener('click', () => {
        gf.toggleElement('h', 'change_location_button');
        // Reset battle ui elements
        reset_battle();
    });

    if (trackingData[0].next_attack) {
        gf.toggleElement('s', 'change_location_button');
        attack_box_button(e_attack_box_button, random_enemy, encounter);
    }
    //let 
    //new_battle_container

}

// Clicks for attack_box_button
function EL_player_turn_attack(encounter, enemy) {
    // Start combat
    if (!encounter.in_combat) {
        // DEBUG
        console.log('Combat started...');
        console.log(trackingData[0]);
        console.log('encounter.in_combat?\n');
        console.log(encounter.in_combat);
        encounter.in_combat = true;
        toggle_combat_status();
        console.log(encounter.in_combat);
        let e_player_to_enemy_btn = document.getElementById('player_to_enemy_btn');
        e_player_to_enemy_btn.innerHTML = '[ ATTACKING ]';
        // Hide change_location_button 
        let change_location_button = document.getElementById('change_location_button');
        if (change_location_button) { change_location_button.style.display = 'none'; }
        player_attack(enemy, encounter);
    } else {
        // In combat clicks (e_player_turn_attack)
        player_attack(enemy, encounter);
    }
}

let ELHandler_player_turn_attack = null;
export function attack_box_button(elementId, enemy, encounter) {

    let newBattleButton = document.getElementById('new_battle_button');
    if (newBattleButton) {
        newBattleButton.parentNode.removeChild(newBattleButton);
    }
    
    let e_player_to_enemy_btn = document.getElementById('player_to_enemy_btn');
    if (e_player_to_enemy_btn) {
        e_player_to_enemy_btn.innerHTML = '[ READY TO USE ATTACK ]';
    }

    // Disable locations, only show current loc image until battle completes
    let locations = document.getElementById('locations');
    let levels = document.getElementById('levels');
    locations.innerHTML = '';
    levels.innerHTML = '';
    let d_curr_loc = locationsData.find(l => l.loc === trackingData[0].loc && l.lvl === 1);

    // Place image in location area
    let battle_location_image = document.getElementById('battle_location_image');
    let loc_img = document.createElement('img');
    battle_location_image.appendChild(loc_img);
    loc_img.style.width = '150px';
    loc_img.style.height = 'auto';
    loc_img.src = d_curr_loc.img;

    let e_locations_status = document.getElementById('locations_status');
    if (enemy) {
        if (elementId && elementId.parentNode) {
            elementId.parentNode.removeChild(elementId);
        }
        e_locations_status.innerHTML = `You are attacking <b>${enemy.lbl}</b> in <b>${trackingData[0].location}</b> Level <b>${trackingData[0].lvl}</b>`;
        let e_player_turn_attack = document.getElementById('player_turn_attack');
        e_player_turn_attack.classList.add('location_box_style');
        e_player_turn_attack.style.textAlign = 'center';
        e_player_turn_attack.style.display = 'block';
        e_player_turn_attack.innerHTML = '<b><font style="font-size: 24px;"> USE ATTACK </font></b>';
        // Combat flag
        encounter.in_combat = false;

        ELHandler_player_turn_attack = function() {
            EL_player_turn_attack(encounter, enemy);
        };
        e_player_turn_attack.addEventListener('click', ELHandler_player_turn_attack);

    }
}

//// ATTACKING WIP
export function player_attack(enemy, encounter) {

    let playerStats = characterData.find(d => d.id === 'player_stats');
    
    //let enemyStats = [];
    
    //console.log(playerStats);
    //console.log(enemy);
    //console.log(encounter);

// PLAYER TURN

    // While enemy is alive
    if (!enemy.dead) {

// STAT: Hit chance
        
        // Generate a random number to determine if the attack misses (10% chance)
        let randomMissChance = Math.random();
        let player_miss_chance = 1 - (playerStats.total_hit_chance / 100);
        let turn_player_damage = 0;
        let turn_player_critical = false;

// STAT: turn_player_damage
        if (randomMissChance < player_miss_chance) {
        // Attack missed
            //console.log('Attack missed...');
            turn_player_damage = 0;
        } else {
        // Attack hit
            turn_player_damage = randomize(playerStats.pwr_weapon_min, playerStats.pwr_weapon_max, 0.1);

// STAT: turn_player_critical
            let player_attack_no_crit = 1 - (playerStats.total_crit_chance / 100);
            let randomCritChance = Math.random();
            if (randomCritChance < player_attack_no_crit) {
                turn_player_critical = false;
            } else {
            // Critical hit
                turn_player_damage *= 2;
                turn_player_critical = true;
            }
            
            // Deduct enemy health
            encounter.cur_health -= turn_player_damage;

            //let display_critical = turn_player_critical ? ' (Critical)' : ' (Regular)';
            //console.log('Damage caused: ' + turn_player_damage + display_critical);
        }

// ENEMY TURN
        
        let turn_enemy_damage = 0;
        randomMissChance = Math.random();
        let enemy_miss_chance = encounter.enemyNoCrit;
        if (randomMissChance < enemy_miss_chance) {
            turn_enemy_damage = 0;
        } else {
            turn_enemy_damage = randomize(encounter.enemyDmg_min, encounter.enemyDmg_max, 0.1);
            turn_enemy_damage = Math.round(turn_enemy_damage * 10) / 10;
        }
        
        if (!enemy.dead) {
            playerStats.cur_health -= turn_enemy_damage;
            playerStats.cur_health = Math.round(playerStats.cur_health * 10) / 10;
            //console.log('Enemy Damage: ' + turn_enemy_damage);
        }
        
        update_health();
        
        if (encounter.cur_health <= 0) {
            encounter.cur_health = 0;
            enemy.dead = true;
            locationsData.forEach((item, index) => {
                if (locationsData[index].loc === trackingData[0].loc && locationsData[index].lvl === trackingData[0].lvl) {
                    saveData[0].killsData[index].kills += 1;
                }
            });
        }

// COMBAT LOG

        // Append combat log entries
        encounter.log_cnt++;

        if (!trackingData[0].combat_log_created) {
            let e_combat_log_container = document.getElementById('combat_log_container');
            if (e_combat_log_container) { e_combat_log_container.innerHTML = ''; }
            create_el('combat_log_title', 'div', 'combat_log_container');
            combat_log_title.innerHTML = '<p style="font-size: 24px; color: white;">COMBAT LOG</p>';
            create_el('combat_log', 'div', 'combat_log_container');
            combat_log.classList.add('normal');
            trackingData[0].combat_log_created = true;
        }

        let e_combat_log = document.getElementById('combat_log');
        let new_div = document.createElement('div');
        e_combat_log.insertBefore(new_div, combat_log.firstChild);
        new_div.id = 'combat_log_div_' + encounter.log_cnt;
        new_div.innerHTML += 'TURN #' + encounter.log_cnt;

        if (turn_player_damage === 0) {
            new_div.innerHTML += '<p><span class="material-symbols-outlined">swords</span><span style="color:#FFCB30;">&nbsp;Your attack against ' + enemy.lbl + ' missed!</span></p>';
        } else {
            if (turn_player_critical) {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">swords</span><span style="color:#FFCB30;">&nbsp;You dealt ' + turn_player_damage + ' physical damage (CRITICAL HIT) to ' + enemy.lbl + '.</span></p>';
            } else {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">swords</span><span style="color:#FFCB30;">&nbsp;You dealt ' + turn_player_damage + ' physical damage to ' + enemy.lbl + '.</span></p>';
            }
        }
        
        if (turn_enemy_damage === 0 && !enemy.dead) {
            new_div.innerHTML += '<p><span class="material-symbols-outlined">swords</span><span style="color:#F7EB00;">&nbsp;Level ' + enemy.lvl + ' enemy ' + enemy.lbl + '\'s attack against you missed!</span></p>';
        } else if (!enemy.dead) {
// need enemy crit, special abilities
            new_div.innerHTML += '<p><span class="material-symbols-outlined">heart_minus</span><span style="color:#FF9393;">&nbsp;Level ' + enemy.lvl + ' enemy ' + enemy.lbl + '\'s physical attack inflicts ' + turn_enemy_damage + ' damage to you.</span></p>';
        }

        if (enemy.dead) {
            new_div.innerHTML += '<p><span class="material-symbols-outlined">skull</span><span style="color:#F7EB00;font-weight:bold;">&nbsp;You defeated a level ' + enemy.lvl + '&nbsp;' + enemy.lbl + '.</span></p>';

// xp gained
let exp_to_add = xp_gain(enemy.lvl);
let d_player_character = saveData[1].savedCharacterData[0];
d_player_character.char_exp += exp_to_add;
update_xp();

            new_div.innerHTML += '<p><img src="media/combatlog/xp.png" height="24" width="24"><span style="color:#34aaff;font-weight:bold;">&nbsp;You gained ' + exp_to_add + ' experience.';

            let loot_dropped = add_loot(enemy, 1, 1, 2);
            if (loot_dropped) {
                loot_dropped.forEach(loot => {
                    let d_itemData = itemData.find(i => i.id === loot.id);

                    new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${d_itemData.name} x${loot.cnt}</span></p>`;
                    
                    updateLootCount(loot.id, loot.cnt);
                });
            }

// reset combat log
encounter.log_cnt = 0;

// AUTO PREPARE NEXT ATTACK
// Other resets are performed in reset_battle()
encounter.in_combat = false;
update_locations();
gf.toggleElement('s', 'change_location_button');
playerStats.cur_health = playerStats.max_health;
trackingData[0].next_attack = true;
trackingData[0].combat_log_created = false;
selectLevel(trackingData[0].loc, trackingData[0].location, trackingData[0].lvl, trackingData[0].kills);



        } // end if (enemy.dead)

// WIP on player death element, reset
if (playerStats.dead) {
    new_div.innerHTML += `<p><span class="material-symbols-outlined">skull</span><span style="color:yellow;font-weight:bold;">&nbsp;You have died.</span></p>`;
    let e_player_turn_attack = document.getElementById('player_turn_attack');
    e_player_turn_attack.removeEventListener('click', ELHandler_player_turn_attack);
    e_player_turn_attack.innerHTML = '<b><font style="font-size: 24px;"> REVIVE </font></b>';

    let do_revive = function() {
        e_player_turn_attack.removeEventListener('click', do_revive);
        let wait_time = 10;
        
        // Countdown to revive
        let countdown = setInterval(function() {
            if (wait_time > 0) {
                e_player_turn_attack.innerHTML = '<b><font style="font-size: 24px;"> REVIVE in ' + wait_time + ' seconds. </font></b>';
                wait_time--;
            } else {
                clearInterval(countdown);
                // Reset player & elements
                playerStats.dead = false;
                playerStats.cur_health = playerStats.max_health;
                // Reset battle/location elements
                reset_battle();
                console.log('Revived!');
            }
        }, 1000); // 1000ms = 1 second
    };
    
    e_player_turn_attack.addEventListener('click', do_revive);
}



    } // end if (!enemy.dead && encounter.cur_health > 0) {

}

export function add_loot(enemy, count, gold_min, gold_max) {
    let random_loot;
    let loot_dropped = 0;  // Counter for loot drops
    let dropped_items = [];  // Array to store dropped items and their counts
    let enemyDrops = enemy.drops;

    // Helper function to add item to the dropped items array
    function add_item_to_dropped(id) {
        let existingItem = dropped_items.find(item => item.id === id);
        if (existingItem) {
            existingItem.cnt++;  // Increment count if item already dropped
        } else {
            dropped_items.push({ id: id, cnt: 1 });  // Add new item with count 1
        }
    }

    // Ensure at least one item drops
    let guaranteed_drop = enemyDrops.find(drop => Math.random() < drop.p);
    if (guaranteed_drop) {
        add_item_to_dropped(guaranteed_drop.id);
        loot_dropped++;
        //console.log('Guaranteed loot dropped: ' + guaranteed_drop.id);
    }

    // Calculate additional drops based on count
    while (loot_dropped < count) {

        // Shuffle enemyDrops
        let shuffledDrops = enemyDrops.sort(() => 0.5 - Math.random()); 
        
        shuffledDrops.forEach(drop => {
            if (loot_dropped >= count) return;
        
            let random_loot = Math.random();
            if (drop.p > random_loot) {
                add_item_to_dropped(drop.id);
                loot_dropped++;
            }
        });
    }

    if (gold_min > 0 && gold_max > 0) {
        // needs to eventually be based on enemy level
        let gold_roll = randomize(gold_min, gold_max, 1);
        dropped_items.push({ id: 'GOLD', cnt: gold_roll });
    }

console.log(dropped_items);
    // Return dropped items with their counts
    return dropped_items;
}

let selectedSlot = null;
// Create a global object to store listeners by slot_id
const inventorySlotListeners = {};
export function update_inventory() {

    let inventory_section = document.getElementById('inventory_section');

let inventory_section_container = document.getElementById('inventory_section_container');

if (!trackingData[0].t_inventory_section) {

    inventory_section.addEventListener('click', () => {
        toggle_section('inventory');
    });

} else {

    // Clear section data
    if (inventory_section_container) {
        inventory_section_container.innerHTML = '';
    }

    // Clear all previous event listeners first
    Object.keys(inventorySlotListeners).forEach(slot_id => {
        removeInventorySlotListener(slot_id);  // Remove old listeners
    });
    // Clear the object after removing listeners
    Object.keys(inventorySlotListeners).forEach(slot_id => {
        delete inventorySlotListeners[slot_id];
    });
    
    let savedInventory = saveData[2].inventoryData;
    let savedInventorySlots = savedInventory.filter(i => i.type === 'slot');
    let d_inventoryElements = inventoryElements.filter(i => i.type === 'slot');
    
    // setup inventory
    let inv_parent = document.createElement('div');
    inv_parent.classList.add('inv_parent');
    inv_parent.id = 'inventory_parent';
    inventory_section_container.appendChild(inv_parent);
    
    savedInventorySlots.forEach((slot_data, index)  => {
    
        let d_itemData = itemData.find(i => i.id === slot_data.contents);
    
        let slot_container = document.createElement('div');
        inv_parent.appendChild(slot_container);
        slot_container.id = 'inventory_slot_container_' + slot_data.slot_id;
        slot_container.classList.add('inv_slot_container');
        d_inventoryElements[index].e_slot_container = slot_container.id;
    
        // append with zIndex: 2
        let slot_img = document.createElement('img');
        slot_container.appendChild(slot_img);
        slot_img.id = 'inventory_slot_img_' + slot_data.slot_id;
        slot_img.classList.add('new_slot_img');
        if (d_itemData) {
            slot_img.src = d_itemData.img;
            slot_img.style.display = 'block';
        }
        d_inventoryElements[index].e_slot_img = slot_img.id;
    
        // append inv_slot_counter ÷> z-index: 3
        let slot_counter = document.createElement('div');
        slot_container.appendChild(slot_counter);
        slot_counter.id = 'inventory_slot_counter_' + slot_data.slot_id;
        slot_counter.classList.add('normal', 'inv_slot_counter');
        d_inventoryElements[index].e_slot_counter = slot_counter.id;
        if (slot_data.contents !== '[ EMPTY ]' && slot_data.cnt > 1) {
            slot_counter.innerHTML = slot_data.cnt;
        }
        
        function inventorySlotClicks() {
            handleSlotClick(slot_container, slot_img, slot_counter, slot_data, d_inventoryElements);
        }
        slot_container.addEventListener('click', inventorySlotClicks);
        
        // Store the listener in the global object using the slot ID
        inventorySlotListeners[slot_data.slot_id] = inventorySlotClicks;

    });

    let currency_area = document.createElement('div');
    inv_parent.appendChild(currency_area);
    currency_area.id = 'currency_area';
    currency_area.style.padding = '5px';

    update_gold();

    // insert test items
    if (!savedInventory[0].setup) {

        updateLootCount('TOOTH', 1);
        updateLootCount('TOOTH', 1);
        updateLootCount('BASIC_HELMET', 1);
        updateLootCount('BETTER_BOOTS', 1);
        updateLootCount('CLOTH_BASIC', 2);
        updateLootCount('CLOTH_BASIC', 1);
        updateLootCount('BASIC_GLOVES', 1);
        savedInventory[0].setup = true;
    }

} // END t_inventory_section
}

// Function to remove the event listener by slot_id
export function removeInventorySlotListener(slot_id) {
    const slot_container = document.getElementById('inventory_slot_container_' + slot_id);

    if (slot_container && inventorySlotListeners[slot_id]) {
        // Remove the event listener using the stored function reference
        slot_container.removeEventListener('click', inventorySlotListeners[slot_id]);
        delete inventorySlotListeners[slot_id];  // Optionally remove the reference
    }
}

export function updateLootCount(itemId, quantity, requestedSlot) {
    let savedInventory = saveData[2].inventoryData;
    let savedInventorySlots = savedInventory.filter(i => i.type === 'slot');
    let d_inventoryElements = inventoryElements.filter(i => i.type === 'slot'); // For updating element ids
    let lootItem = itemData.find(i => i.id === itemId);

    // If the loot item is not gold, add it here
    if (lootItem && lootItem.id !== 'GOLD') {
        let itemFound = false; // Track if the stackable item was found

        // First, check if the stackable item already exists in any slot
        for (let i = 0; i < savedInventorySlots.length; i++) {
            let slot_data = savedInventorySlots[i];

            // If requestedSlot is specified, add item to that slot
            if (requestedSlot && requestedSlot === slot_data.slot_id) {
                // Assign itemId and quantity to the specified slot
                slot_data.contents = lootItem.id;
                slot_data.cnt = quantity;
                // Update the corresponding inventory element using the index
                let e_slot_img = document.getElementById(d_inventoryElements[i].e_slot_img);
                e_slot_img.style.display = 'block';
                e_slot_img.src = lootItem.img;
                break;
            }

            // If the item is stackable and already exists in the slot, increment its count
            if (!requestedSlot && lootItem.stackable && slot_data.contents === lootItem.id) {
                slot_data.cnt += quantity;
                // Update the corresponding inventory element using the index
                let e_slot_counter = document.getElementById(d_inventoryElements[i].e_slot_counter);
                if (e_slot_counter) {
                    e_slot_counter.innerHTML = slot_data.cnt;
                }
                itemFound = true;
                break;
            }
        }

        // If the stackable item wasn't found in any slot, add it to an empty slot
        if (!requestedSlot && !itemFound) {
            for (let i = 0; i < savedInventorySlots.length; i++) {
                let slot_data = savedInventorySlots[i];

                // Check if the slot is empty
                if (slot_data.contents === '[ EMPTY ]') {

                    // Assign itemId and quantity to the empty slot
                    slot_data.contents = lootItem.id;
                    slot_data.cnt = quantity;
                    // Update the corresponding inventory element using the index
                    let e_slot_img = document.getElementById(d_inventoryElements[i].e_slot_img);
                    if (e_slot_img) {
                        e_slot_img.style.display = 'block';
                        e_slot_img.src = lootItem.img;
                    }
                    // (e_slot_counter is hidden for single items)
                    break;
                }
            }
        }

        // Check if inventory is full
        let max_inventory = savedInventorySlots.length;
        let inventory_full = false;  // Assume inventory is not full unless we find no empty slots
        trackingData[0].inventory_full = false;
    
        for (let i = 0; i < max_inventory; i++) {  // Loop starts at 0
            if (savedInventorySlots[i].contents === '[ EMPTY ]') {
                inventory_full = false;  // Found empty slot, inventory not full
                break;
            } else {
                inventory_full = true;
                trackingData[0].inventory_full = true;
            }
        }
        
        if (inventory_full) {
            let messages_section_container = document.getElementById('messages_section_container');
            let currentDateTime = new Date().toLocaleString();
            messages_section_container.innerHTML = '' ? '<br>' : '';
            messages_section_container.innerHTML += `<span style="color: gray;">(${currentDateTime})</span><br><span style="color: red;">Inventory is full.</span>`;
        }
    }
    
    if (lootItem && lootItem.id === 'GOLD') {
    // If the loot item is gold, add it here
        //// t
        let d_gold = saveData[4].currencyData[0];
        if (d_gold) {
            d_gold.cnt += quantity;
            let e_check = document.getElementById('gold_container');
            if (e_check) {
                update_gold();
            }
        }
    }
}

// Function to handle various slot click situations
function handleSlotClick(slot_container, slotImg, slotCounter, slot_data, d_inventoryElements) {

    // Clear all tooltips found in inventory
    removeItemTooltip('inventory');

    if (selectedSlot === null) {
        // First click: selecting the filled slot
        if (slot_data.contents !== '[ EMPTY ]') {
            selectedSlot = {
                slot_container, //
                slot_data, //
                slot_contents: slot_data.contents,
                slotImg, 
                itemImg: slotImg.src,
                slotCounter,
                itemId: slot_data.id,
                quantity: slot_data.cnt
            };
            slot_container.style.backgroundColor = 'green';
        }
    } else {
        if (selectedSlot.slot_container === slot_container) {
            // If the selected slot is clicked again, show tooltip, reset
            // Show tooltip
            createItemElements(slot_container, slot_data, d_inventoryElements, 'inventory');
            // Reset
            selectedSlot = null;
            slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            
        } else if (slot_data.contents === '[ EMPTY ]') {
            // Second click: selecting the destination slot
            
            // Move the item to the new slot
            slot_data.contents = selectedSlot.slot_contents;
            slot_data.id = selectedSlot.itemId;
            slot_data.cnt = selectedSlot.quantity;
            slotImg.style.display = 'block';
            slotImg.src = selectedSlot.itemImg;
            slotCounter.innerHTML = selectedSlot.quantity;
            slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';

            // Clear the original slot
            selectedSlot.slot_contents = '';
            selectedSlot.slotImg.src = '';
            selectedSlot.slotImg.style.display = 'none';
            selectedSlot.itemImg = '';
            selectedSlot.slotCounter.innerHTML = '';
            // Reset element
            selectedSlot.slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            // Reset selectedSlot array data
            selectedSlot.slot_data.contents = '[ EMPTY ]';
            selectedSlot.itemId = slot_data.id;
            selectedSlot.quantity = slot_data.cnt;

            // Reset the selectedSlot
            selectedSlot = null;

        } else if (slot_data.contents !== '[ EMPTY ]') {
            // Swap the items between the two slots
            
            let tempItemId = slot_data.id;
            let tempImgId = slotImg.src;
            let tempQuantity = slot_data.cnt;
            let tempContents = slot_data.contents;
            
            // Move the selected slot's item to the clicked slot
            slot_data.contents = selectedSlot.slot_contents;
            slot_data.id = selectedSlot.itemId;
            slot_data.cnt = selectedSlot.quantity;
            slotImg.src = selectedSlot.itemImg;
            slotImg.style.display = 'block';  // Ensure the item is visible
            slotCounter.innerHTML = selectedSlot.quantity;
            
            // Now move the previously clicked slot's item to the originally selected slot
            selectedSlot.slot_data.id = tempItemId;
            selectedSlot.slotImg.src = tempImgId;
            selectedSlot.slotImg.style.display = (tempContents !== '[ EMPTY ]') ? 'block' : 'none';  // Hide if empty
            selectedSlot.slotCounter.innerHTML = (tempQuantity > 1) ? tempQuantity : '';
            selectedSlot.slot_data.contents = tempContents;
        
            // Reset the selected slot's display if the item was swapped to an empty slot
            if (tempContents === '[ EMPTY ]') {
                selectedSlot.slotImg.style.display = 'none';
                selectedSlot.slotCounter.innerHTML = '';
            }
        
            // Reset slot container styles for both slots
            slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            selectedSlot.slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        
            // Reset selectedSlot array data
            selectedSlot.itemId = tempItemId;
            selectedSlot.quantity = tempQuantity;
            selectedSlot.slot_data.cnt = tempQuantity;
        
            // Reset the selectedSlot
            selectedSlot = null;
        }
    }
    applyTransparencyToEmptySlots();
    // Hide count on single cnt items
    let slotCounter_DOM = document.getElementById(slotCounter.id);
    if (slotCounter_DOM && slot_data.cnt === 1) {
        slotCounter_DOM.innerHTML = '';
    }
}

function createItemElements(slot_container, slot_data, elements, type) {

    if (type === 'inventory') {

        // Get index match for element ida
        let index = slot_data.slot_id - 1;
        // To get slot_container.id that matches e_slot_container
        // elements = inventoryElements
        let matched_slot = elements[index].e_slot_container;

        if (slot_data.contents !== '[ EMPTY ]' && matched_slot === slot_container.id) {
            // Parent container
            let container_parent = document.getElementById(slot_container.id);
            container_parent.style.zIndex = '9999';
            container_parent.style.position = 'relative';

            // Create tooltip containers for each item, including unique ids for separate unstackable duplicates
            let tooltip_container_div = document.createElement('div');
            container_parent.appendChild(tooltip_container_div);
            tooltip_container_div.id = 'inventory_tooltip_container_' + slot_data.contents + '_' + slot_data.slot_id;

            tooltip_container_div.style.position = 'absolute';
            tooltip_container_div.style.top = '65px';
            tooltip_container_div.style.width = '200px';
            tooltip_container_div.style.pointerEvents = 'auto'; // Allow interactions with the tooltip
            
            let item = itemData.find(i => i.id === slot_data.contents);
            setup_tooltip_div(tooltip_container_div.id, item, slot_data, 'inventory');
        }
    }
    if (type === 'equipment') {
        if (slot_container.id !== 'equip_slot_EMPTY_' + slot_data.id) {
            // Parent container
            let container_parent = document.getElementById(slot_container.id);
            container_parent.style.zIndex = '9999';
            container_parent.style.position = 'relative';

            // Create tooltip containers
            let tooltip_container_div = document.createElement('div');
            container_parent.appendChild(tooltip_container_div);
            tooltip_container_div.id = 'equipment_tooltip_container_' + slot_data.equipped;

            tooltip_container_div.style.position = 'absolute';
            tooltip_container_div.style.top = '65px';
            tooltip_container_div.style.width = '200px';
            tooltip_container_div.style.pointerEvents = 'auto'; // Allow interactions with the tooltip

            let item = itemData.find(i => i.id === slot_data.equipped);
            if (item) {
                setup_tooltip_div(tooltip_container_div.id, item, slot_data, 'equipment');
            }
        }

    }
}

// Setup each tooltip box
function setup_tooltip_div(tooltip_container_div, item, slot_data, tt_type) {

    // Clear all elements
    let e_tooltip_container_div = document.getElementById(tooltip_container_div);
    if (e_tooltip_container_div) { e_tooltip_container_div.innerHTML = ''; }

    create_el('item_tooltip_div', 'div', tooltip_container_div);
    item_tooltip_div.classList.add('item_tooltip');
    
    create_el('item_name', 'div', 'item_tooltip_div');
    item_name.classList.add('normal-bold');
    item_name.innerHTML = '[ ' + item.name + ' ]';
    create_el('item_slot', 'div', 'item_tooltip_div');
    item_slot.classList.add('i_slot_type');
    if (item.type === 'armor' || item.type === 'weapon') {
        item_slot.innerHTML = item.slot_name;
    } else if (item.type === 'junk') {
        item_slot.innerHTML = '';
    } else {
        item_slot.innerHTML = item.slot;
    }
    
    // Set rarity color and item color
    create_el('item_rarity', 'div', 'item_tooltip_div');
    switch (item.rarity) {
        case 0:
            item_rarity.classList.add('r_junk');
            item_rarity.innerHTML = 'Junk';
            item_name.classList.add('r_junk');
            break;
        case 1:
            item_rarity.classList.add('r_common');
            item_rarity.innerHTML = 'Common';
            item_name.classList.add('r_common');
            break;
        case 2:
            item_rarity.classList.add('r_uncommon');
            item_rarity.innerHTML = 'Uncommon';
            item_name.classList.add('r_uncommon');
            break;
        case 3: item_rarity.classList.add('r_rare');
            item_rarity.innerHTML = 'Rare';
            item_name.classList.add('r_rare');
            break;
        case 4: item_rarity.classList.add('r_epic');
            item_rarity.innerHTML = 'Epic';
            item_name.classList.add('r_epic');
            break;
        case 5: item_rarity.classList.add('r_legendary');
            item_rarity.innerHTML = 'Legendary';
            item_name.classList.add('r_legendary');
            break;
        case 6: item_rarity.classList.add('r_ancient');
            item_rarity.innerHTML = 'Ancient';
            item_name.classList.add('r_ancient');
            break;
    }
    create_el('tt_hr1', 'hr', 'item_tooltip_div');
    create_el('item_desc', 'div', 'item_tooltip_div');
    item_desc.classList.add('light_small');
    if (item.desc) {
        item_desc.innerHTML = item.desc;
    }
    create_el('item_stats', 'div', 'item_tooltip_div');
    
    // Set stat gain attributes
    let item_gains = item.gains;
    if (item_gains) {
        item_gains.forEach(gain => {
            let statLine = gain.amt + '&nbsp;' + gain.lbl;
            if (gain.stat === 'armor') {
                item_stats.innerHTML += '<div class="item_tooltip_armor">' + statLine + '</span>';
            } else if (gain.stat !== 'dmg_min' && gain.stat !== 'dmg_max') {
                item_stats.innerHTML += '<div class="r_uncommon">+' + statLine + '</span>';
            }
            if (item.slot === 'mh') {
                create_el('damage_lbl', 'div', 'item_tooltip_div');
                damage_lbl.classList.add('item_tooltip_armor');
                // Damage per item
                // WIP replace with calculate function
                let d_dmg_min = item_gains.find(i => i.stat === 'dmg_min');
                let d_dmg_max = item_gains.find(i => i.stat === 'dmg_max');
                //let [base_weapon_min, base_weapon_max]  = calculate_weapon_damage(1, 0);
                //console.log(base_weapon_min + ' : ' + base_weapon_max);
                
                // Weapon base damage
                damage_lbl.innerHTML = 'Base damage: ';
                create_el('min_span', 'span', 'damage_lbl');
                min_span.innerHTML = d_dmg_min.amt;
                create_el('sep', 'span', 'damage_lbl');
                sep.innerHTML = '&nbsp;-&nbsp;';
                create_el('max_span', 'span', 'damage_lbl');
                max_span.innerHTML = d_dmg_max.amt;
                
                // 'Damage per turn (with power)'' only printed after update_equipment()
                create_el('damage_pwr_lbl', 'div', 'item_tooltip_div');
                damage_pwr_lbl.classList.add('item_tooltip_armor');
                damage_pwr_lbl.innerHTML = 'Damage Per Turn: ';
                create_el('min_span_pwr', 'span', 'damage_pwr_lbl');
                min_span_pwr.innerHTML = trackingData[0].pwr_weapon_min;
                create_el('sep2', 'span', 'damage_pwr_lbl');
                sep2.innerHTML = '&nbsp;-&nbsp;';
                create_el('max_span_pwr', 'span', 'damage_pwr_lbl');
                max_span_pwr.innerHTML = trackingData[0].pwr_weapon_max;
            }
        });
    }
    
    // Sell price
    create_el('sell_price_lbl', 'div', 'item_tooltip_div');
    sell_price_lbl.classList.add('light_small');
    sell_price_lbl.innerHTML = 'Sell Price: ';
    create_el('gold_div', 'div', 'sell_price_lbl');
    gold_div.style.display = 'inline-block';
    create_el('gold', 'img', 'gold_div');
    gold.src = 'media/currency_gold.png';
    gold.classList.add('currency_gold');
    create_el('sell_price_amt', 'span', 'sell_price_lbl');
    sell_price_amt.classList.add('light_small');
    
    if (item.value > 0) {
        sell_price_amt.innerHTML = '&nbsp;' + item.value;
        if (slot_data.cnt > 1) {
            sell_price_amt.innerHTML += '<br>Sell Price x' + slot_data.cnt + ': ' + '<img src="media/currency_gold.png" class="currency_gold">&nbsp;' + (item.value * slot_data.cnt);
        }
    } else {
        gold_div.style.display = 'none';
        sell_price_amt.innerHTML = '[ None ]';
        
        // Destroy item option
        // Only available if not clicked from equipment slot and has no sell price
        let saveDataEquip = saveData[3].equippedData;
        let equipped_item = saveDataEquip.find(i => i.equipped === item.id);
        let e_equipment_id = document.getElementById('equipment_tooltip_container_' + item.id);
        let nosell_inventory_item = e_equipment_id && equipped_item ? false : true;
        // console.log(item.id + ' is inventory item (no sell price) / is_inventory_item = ' + nosell_inventory_item);

        if (nosell_inventory_item) {
            create_el('hr4', 'hr', 'item_tooltip_div');
            create_el('destroy_sect', 'div', 'item_tooltip_div');
            destroy_sect.classList.add('light_small');
            destroy_sect.innerHTML = '<b>Item Actions:</b> ';
            create_el('destroy_btn', 'button', 'destroy_sect');
            destroy_btn.innerHTML = 'DESTROY';
            destroy_btn.addEventListener('click', () => {
                
                // Clear text and button for warning
                destroy_sect.removeChild(destroy_btn);
                destroy_sect.innerHTML = '';
                
                // Clear inventory event listener to prevent item movement on click after swap
                const slot_container = document.getElementById('inventory_slot_container_' + slot_data.slot_id);
                if (slot_container && inventorySlotListeners[slot_data.slot_id]) {
                    // Remove the event listener using the stored function reference
                    slot_container.removeEventListener('click', inventorySlotListeners[slot_data.slot_id]);
                    delete inventorySlotListeners[slot_data.slot_id];  // Optionally remove the reference
                }

                create_el('destroy_confirm_div', 'div', 'destroy_sect');
                destroy_confirm_div.innerHTML = '<b>(DESTROY ITEM)</b> Are you sure? Action cannot be undone!';
                create_el('confirm_yes', 'button', 'destroy_sect');
                confirm_yes.innerHTML = ' YES ';
                confirm_yes.addEventListener('click', () => {
                    slot_data.contents = '[ EMPTY ]';
                    slot_data.cnt = 0;
                    update_inventory();
                });
                create_el('confirm_no', 'button', 'destroy_sect');
                confirm_no.innerHTML = ' NO ';
                confirm_no.addEventListener('click', () => {
                    update_inventory();
                    return;
                });
            });
        }
    }

    // Setup equip buttons
    if (tt_type === 'equipment') {
        // Get equipped items
        let saveDataEquip = saveData[3].equippedData;

        // Find equipped item in saveData array
        saveDataEquip.forEach(saveItem => {

            //let matched_item_equipped = itemData.find(i => i.id === saveItem.equipped && i.slot === item.slot);
            let e_equipment_slot = document.getElementById('equip_slot_' + item.slot);
            
            // Items equipped only
            if (e_equipment_slot && saveItem.equipped === item.id) {
    
                create_el('tt_hr2', 'hr', 'item_tooltip_div');
                create_el('equip_actions', 'div', 'item_tooltip_div');
                equip_actions.classList.add('light_small');
                equip_actions.innerHTML = '<b>Equipment Actions:</b>';
                create_el('unequip_btn', 'button', 'equip_actions');
                unequip_btn.innerHTML = 'REMOVE';
                unequip_btn.addEventListener('click', () => {
                    swap_equipment(item.id, 'remove');
                });
            }
        });
    }
    
    if (tt_type === 'inventory') {
        // Get inventory items
        let saveDataInv = saveData[2].inventoryData;
        let saveDataEquip = saveData[3].equippedData;
        // Find equipment items in inventoryData array
        saveDataInv.forEach(ei => {
            let d_EquipItemData = itemData.find(i => i.id === ei.contents && i.type === 'armor' || i.id === ei.contents && i.type === 'weapon');

            if (d_EquipItemData) {
                if (d_EquipItemData.id === item.id) {
                    // Prevent duplicates of tt_hr3 HR
                    let e_tt_hr3 = document.getElementById('tt_hr3');
                    if (!e_tt_hr3) {
                        create_el('tt_hr3', 'hr', 'item_tooltip_div');
                    }
                    create_el('equip_actions2', 'div', 'item_tooltip_div');
                    equip_actions2.classList.add('light_small');
                    equip_actions2.innerHTML = '<b>Equipment Actions:</b> ';
                    create_el('equip_btn', 'button', 'equip_actions2');
                    equip_btn.innerHTML = 'EQUIP';
                    equip_btn.addEventListener('click', () => {
                        
                        // Store current item data first
                        let item_clicked = item;
                        let item_slot_clicked = ei.slot_id;
                        // Clear inventory event listener to prevent item movement on click after swap
                        const slot_container = document.getElementById('inventory_slot_container_' + ei.slot_id);
                        if (slot_container && inventorySlotListeners[ei.slot_id]) {
                            // Remove the event listener using the stored function reference
                            slot_container.removeEventListener('click', inventorySlotListeners[ei.slot_id]);
                            delete inventorySlotListeners[ei.slot_id];  // Optionally remove the reference
                        }

                        // If an item is already equipped in the same slot
                        let equip_slot = saveDataEquip.find(e => e.id === item.slot);
                        if (equip_slot && equip_slot.equipped) {
                            //console.log('(existing item) e: ' + current_equipped.equipped + ' / i: ' + item_clicked.id);
                            // If duplicate item is already equipped, do nothing (return)
                            if (equip_slot.equipped === item_clicked.id) {
                                //console.log(current_equipped.equipped + '...is already equipped, skipping');
                                update_inventory();
                                update_character();
                                return;
                            }
                            //console.log('adding to equipped: ' + item.id);
                            ei.contents = '[ EMPTY ]';
                            updateLootCount(equip_slot.equipped, 1, item_slot_clicked);
                            // Swap new iten with equipment slot item
                            equip_slot.equipped = item.id;
                            update_inventory();
                            update_character();
                            return;
                        }

                        // If no items in current equipment slot
                        let empty_equip_slot = saveDataEquip.find(e => e.id === 'equip_slot_EMPTY_' + item.slot);
                        if (empty_equip_slot && !empty_equip_slot.equipped) {
                            // Leave inventory slot empty
                            // Add new iten to empty equipment slot
                            ei.contents = '[ EMPTY ]';
                            empty_equip_slot.equipped = item.id;
                            empty_equip_slot.id = item.slot;
                            //console.log('check ids: ... equipped: ' + current_empty.equipped + '/ id: ' + current_empty.id)
                            update_inventory();
                            update_character();
                            //console.log(equip_slot);
                            return;
                        }
                    });
                }
            }
        });
    }
}

// Remove ALL tooltips
function removeItemTooltip(type) {
    if (type === 'inventory') {
        // Get all elements with id starting with 'inventory_tooltip_container_'
        let tooltip_container_divs = document.querySelectorAll("[id^='inventory_tooltip_container_']");
        
        // Loop through each element and remove it
        tooltip_container_divs.forEach(tooltip => {
            if (tooltip.parentNode) {
                // Reset the zIndex and position if they were modified
                if (tooltip.parentNode.style.zIndex === '9999') {
                    tooltip.parentNode.style.zIndex = '0';  // Reset zIndex
                    //tooltip.parentNode.style.position = ''; // Reset position to default
                }
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }
    
    if (type === 'equipment') {
        // Get all elements with id starting with 'inventory_tooltip_container_'
        let equip_tooltip_container_divs = document.querySelectorAll("[id^='equipment_tooltip_container_']");

        // Loop through each element and remove it
        equip_tooltip_container_divs.forEach(tooltip => {
            if (tooltip.parentNode) {
                // Reset the zIndex and position if they were modified
                if (tooltip.parentNode.style.zIndex === '9999') {
                    tooltip.parentNode.style.zIndex = '0';  // Reset zIndex
                    //tooltip.parentNode.style.position = ''; // Reset position to default
                }
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }
}

// Ensure empty slots have the transparent background
function applyTransparencyToEmptySlots() {
    let savedInventory = saveData[2].inventoryData;
    let slot = savedInventory.filter(i => i.type === 'slot');

    for (let i = 1; i <= slot.size; i++) {
        let slotImg = document.getElementById(`inventory_slot_img_${i}`);
        let slotContainer = document.getElementById(`inventory_slot_container_${i}`);
        let slotCounter = document.getElementById(`inventory_slot_counter_${i}`);

        if (slot[i].contents === '[ EMPTY ]') {
            slotContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            slotImg.src = '';
            slotImg.style.display = 'none';
            slotCounter.innerHTML = '';
        }
        
        if (slot[i].contents !== '[ EMPTY ]') {
            
        }
    }
}
// Call this function after setting up the inventory or updating it
// applyTransparencyToEmptySlots();

// Setup gold elements, purchases, etc
export function update_gold() {
    let inventory_section = document.getElementById('inventory_section_container');
    let d_gold = saveData[4].currencyData[0];

    let e_gold_container = document.getElementById('gold_container');

    if (e_gold_container) {
        e_gold_container.innerHTML = '';
    } else {
        e_gold_container = document.createElement('div');
        e_gold_container.id = 'gold_container';
        let currency_area = document.getElementById('currency_area');
        currency_area.appendChild(e_gold_container);
        e_gold_container.classList.add('gold_div');
    }

    let gold_span_lbl = document.createElement('span');
    gold_span_lbl.id = 'gold_span';
    gold_container.appendChild(gold_span_lbl);
    gold_span_lbl.classList.add('gold_span');
    gold_span_lbl.innerHTML = '<b>GOLD:</b>&nbsp;' + d_gold.cnt;

}

export function choose_enemy(enemyList) {
    
    let enemyListEnemy = enemyList.filter(e => e.cat === 'enemy');
    if (enemyListEnemy && enemyListEnemy.length > 0) {
        let randomIndex = Math.floor(Math.random() * enemyListEnemy.length);
        let random_enemy = enemyListEnemy[randomIndex];
        
        return random_enemy;
    }
}

function randomize(min, max, step) {
    // Calculate the range in terms of the step size
    let range = (max - min) / step;

    // Get a random integer based on the range
    let randomStep = Math.floor(Math.random() * (range + 1));

    // Scale the random step back to the original range
    return min + randomStep * step;
}

//// 
function start_encounter(loc, group) {

    let hp_min = 25;
    let hp_max = 30;
    let cur_health = 0;
    let max_health = 0;
    let log_cnt = 0;
    let enemyDmg_min = 3;
    let enemyDmg_max = 5;
    let enemyNoCrit = 0.06;

    // Starts at 1, with above values
    let incr_rate = 0.1;

    let d_level_data = locationsData.filter(l => l.loc && l.loc > 0 && l.lvl > 0 && l.lbl !== 'END');
    
    d_level_data.forEach((level, index) => {

        let d_encounter = encounterData.find(e => e.id === group);
        let d_enemy_list = d_encounter.enemy_list;

        if (level.loc === loc) {
            let stat_mult = (1 - incr_rate) + (incr_rate * (index + 1));
            stat_mult = Math.round(stat_mult * 10) / 10;

            hp_min *= stat_mult;
            hp_min = Math.round(hp_min);
            hp_max *= stat_mult;
            hp_max = Math.round(hp_max);
            enemyDmg_min *= stat_mult;
            enemyDmg_min = Math.round(enemyDmg_min * 10) / 10;
            enemyDmg_max *= stat_mult;
            enemyDmg_max = Math.round(enemyDmg_max * 10) / 10;

            encounterData.push({
                id: 'group_lvl_' + (index + 1),
                loc: loc,
                lvl: index + 1,
                hp_min: hp_min, 
                hp_max: hp_max, 
                cur_health: 0, 
                max_health: 0, 
                log_cnt: 0, 
                enemyDmg_min: enemyDmg_min, 
                enemyDmg_max: enemyDmg_max, 
                enemyNoCrit: enemyNoCrit,
                enemy_list: []
            });
            
            let new_loc = encounterData.find(e => e.id === 'group_lvl_' + (index + 1));
            let new_enemy_list = new_loc.enemy_list;

            // Add 3 random enemies per level
            for (let i = 0; i < 3; i++) {
                let enemy_name = pickRandomName();  // Pick 1 random name at a time

                // Generate id in uppercase and replace spaces with _
                let entry_id = enemy_name.toUpperCase().replace(/ /g, "_");

                new_enemy_list.push({
                    //loc: loc,
                    id: entry_id,
                    lbl: enemy_name,   // Include the random name in the enemy list
                    lvl: index + 1, 
                    drops: []
                });
            }
        }
    });


    // Function to pick a single random unused name and mark it as used
    function pickRandomName() {
        
    // Get random names
    let enemy_names = encounterData.find(e => e.id === 'enemyNames');
    let names = enemy_names.names;
    
    // Filter out names that haven't been used yet (u: false)
    let unused_names = names.filter(n => !n.u);
    
        
        if (unused_names.length === 0) {
            console.log("No unused names left.");
            return null;
        }
    
        // Shuffle and pick 1 random name
        let random_name = unused_names
            .sort(() => 0.5 - Math.random())[0];  // Pick only the first random name
    
        // Mark the chosen name as used (u: true)
        random_name.u = true;
    
        // Update the unused names list
        unused_names = names.filter(n => !n.u);
    
        // Return the chosen name
        return random_name.n;
    }

    // check array
    encounterData.forEach(e => {
        console.log(e);
    });

} // End function

// Location 1+ only
//start_encounter(1, 'group_loc1');

// Show or hide sections (clear/create or hide/show)
trackingData[0].t_character_section = false;
trackingData[0].t_character_stats_section = false;
trackingData[0].t_battle_section = false;
trackingData[0].t_inventory_section = false;
export function toggle_section(section) {

    if (section === 'stats') {
        let e_character_stats_section = document.getElementById('character_stats_section');
        let e_character_stats_container = document.getElementById('character_stats_container');

        if (trackingData[0].t_character_stats_section) {
            trackingData[0].t_character_stats_section = false;
            e_character_stats_container.style.display = 'none';
            e_character_stats_container.style.overflow = 'auto';
            e_character_stats_section.innerHTML = 'Character Stats <span class="normal">[ SHOW ]</span><div style="background-color:#333;width:100%;padding:5px"></div>';
        } else {
            trackingData[0].t_character_stats_section = true;
            update_equipment();
            update_character_stats(true);
            e_character_stats_container.style.display = 'block';
            e_character_stats_section.innerHTML = 'Character Stats <span class="normal">[ HIDE ]</span>';
        }
    }

    if (section === 'character') {
        let e_character_section = document.getElementById('character_section');
        let e_character_container = document.getElementById('character_container');
        if (trackingData[0].t_character_section) {
            e_character_container.innerHTML = '';
            e_character_section.innerHTML = 'Character Section <span class="normal">[ SHOW ]</span>';
            trackingData[0].t_character_section = false;
        } else {
            //character_container.style.display = 'block';
            trackingData[0].t_character_section = true;
            //update_character('no_toggle');
            update_character();
            e_character_section.innerHTML = 'Character Section <span class="normal">[ HIDE ]</span>';
        }
    }

    if (section === 'battle') {
        let e_battle_section = document.getElementById('battle_section');
        let location_container = document.getElementById('location_container');
        if (trackingData[0].t_battle_section) {
            location_container.style.display = 'none';
            e_battle_section.innerHTML = 'Battle Section <span class="normal">[ SHOW ]</span><div style="background-color:#333;width:100%;padding:5px"></div>';
            trackingData[0].t_battle_section = false;
        } else {
            location_container.style.display = 'block';
            e_battle_section.innerHTML = 'Battle Section <span class="normal">[ HIDE ]</span>';
            trackingData[0].t_battle_section = true;
        }
    }

    if (section === 'inventory') {
        let e_inventory_section = document.getElementById('inventory_section');
        let e_inventory_section_container = document.getElementById('inventory_section_container');
        if (trackingData[0].t_inventory_section) {
            e_inventory_section_container.innerHTML = '';
            e_inventory_section.innerHTML = 'Inventory Section <span class="normal">[ SHOW ]</span><div style="background-color:#333;width:100%;padding:5px"></div>';
            trackingData[0].t_inventory_section = false;
        } else {
            trackingData[0].t_inventory_section = true;
            update_inventory();
            e_inventory_section.innerHTML = 'Inventory Section <span class="normal">[ HIDE ]</span>';
        }
    }
    }
