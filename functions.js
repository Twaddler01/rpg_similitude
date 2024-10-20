// functions.js

// import arrays
import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, saveData, trackingData, init_saveData } from './data.js';

// general functions needed
import * as gf from './general_functions.js';
import * as ch from './character.js';
import * as inv from './inventory.js';

// Global variables
const d_items_starterSet = add_new_gear('STARTER', 'BLUE', 2, 5, 5, 10, 20, 30, 3.0, 5.0);

// Reset everything except new character info
export async function clearSaveData() {
    // Preserve savedCharacterData only
    let saved_data = saveData[1].savedCharacterData[0];

    saveData.length = 0;
    const response = await fetch('newSaveData.json');
    const parsedData = await response.json();
    parsedData.forEach(item => {
        saveData.push(item);
    });

    // Assign savedCharacterData back to the correct structure
    if (saved_data) {
        saveData[1].savedCharacterData = [saved_data]; 
    }
}

function downloadSaveData() {
    const saveDataString = JSON.stringify(saveData, null, 2);
    const blob = new Blob([saveDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saveData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Main function to create new elements
export function create_el(newId, type, parentId, content) {
    let parent_el = document.getElementById(parentId);
    let new_el = document.createElement(type);
    
    if (parentId === 'body') {
        document.body.appendChild(new_el);
        new_el.id = newId;
        if (content) {
            new_el.innerHTML = content;
        }
    } else {
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
}

export function first_run() {

    let test_section = document.getElementById('test_section');

// import saveData from textarea
    function resetSaveData(newArray) {
        //try {
            saveData.length = 0;
            const parsedData = JSON.parse(newArray);
            parsedData.forEach(item => saveData.push(item));
            
            // Reset starting inventory flag
            let savedInventory = saveData[2].inventoryData;
            savedInventory[0].setup = true
            
            
            /*console.log('saveData successfully overwritten:', saveData);
        } catch (error) {
            console.error('Error parsing or overwriting saveData:', error);
        }*/
    }

    create_el('importSaveBtn', 'button', test_section);
    importSaveBtn.innerHTML = 'Import SaveData';
    create_el('savedata_section', 'div', test_section);
    
    importSaveBtn.addEventListener('click', () => {
        let import_save_container = document.getElementById('import_save_container');
        if (!import_save_container) {
            import_save_container = document.createElement('div');
            savedata_section.appendChild(import_save_container);
            import_save_container.id = 'import_save_container';
            create_el('ta_box', 'textarea', import_save_container);
            ta_box.rows = 10;
            ta_box.style.width = '100%';
            create_el('submit_import_save', 'button', import_save_container);
            submit_import_save.innerHTML = 'SUBMIT';
            create_el('reset_import_save', 'button', import_save_container);
            reset_import_save.innerHTML = 'RESET';
            create_el('export_save', 'button', import_save_container);
            export_save.innerHTML = 'Export saveData';
            export_save.addEventListener('click', () => { downloadSaveData() });
            reset_import_save.addEventListener('click', () => { ta_box.value = '' });
        
            submit_import_save.addEventListener('click', () => {
                const taData = ta_box.value;
                resetSaveData(taData);
                console.log(saveData);
            });
        } else {
            savedata_section.innerHTML = '';
        }
    });

// download saveData
    let save_all = document.createElement('button');
    test_section.appendChild(save_all);
    save_all.innerHTML = 'DOWNLOAD saveData JSON';
    save_all.addEventListener('click', () => {
        downloadSaveData();
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
            inv.updateLootCount(item.id, 1);
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
        if (gold_span_lbl) {
            gold_span_lbl.innerHTML = '<b>GOLD:</b>&nbsp;' + d_gold.cnt;
        }
        inv.update_gold();
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

// tracking checks
let trackBtn = document.createElement('button');
test_section.appendChild(trackBtn);
trackBtn.innerHTML = 'CHECK trackingData';
trackBtn.addEventListener('click', () => {
    console.log('t_character_section = ' + trackingData[0].t_character_section);
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
                gf.toggle_section('battle');
                e_battle_section.listenerAdded = true;
            });
        }
    }

    // Update array data
    for (let i = 0; i < locationsData.length; i++) {
    
        if (saveData[0] && saveData[0].killsData && saveData[0].killsData[i]) {
            locationsData[i].kills = saveData[0].killsData[i].kills;
        }
    
        // Always set the first level to true
        if (i === 0) {
            locationsData[i].kill_req_met = true;
        }
    
        // Update kill_req_met based on the kills of the previous level
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

    // Insert attack_box_button
    let attack_box_button = document.createElement('button');
    location_container.appendChild(attack_box_button);
    attack_box_button.innerHTML = '<b><font style="font-size: 24px;"> ATTACK </font></b>';
    attack_box_button.classList.add('location_box_style');
    attack_box_button.classList.add('center');
    attack_box_button.style.display = 'none';

    // Insert change_location_button
    create_el('change_location_button', 'button', location_container);
    change_location_button.innerHTML = '<b><font style="font-size: 24px;"> CHANGE LOCATION </font></b>';
    change_location_button.classList.add('location_box_style');
    change_location_button.classList.add('center');
    change_location_button.style.display = 'none';

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
    // Level up
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
        // Update stats from level increase
        ch.update_character();
    }
}

export function reset_battle() {
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
        let e_battle_ui_container = document.getElementById('battle_ui_container');
        e_battle_ui_container.classList.remove('location_box_style');
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
    //console.log('first encounter loc/lvl? ' + trackingData[0].loc + ' / ' + trackingData[0].lvl);
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
    
    
    //console.log('encounter/enemy?\n');
    //console.log(encounter);
    //console.log(random_enemy);
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

}

// Clicks for attack_box_button
function EL_player_turn_attack(encounter, enemy) {
    // Start combat
    if (!encounter.in_combat) {
        encounter.in_combat = true;
        toggle_combat_status();
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
    let d_curr_loc = locationsData.find(l => l.loc === trackingData[0].loc && l.lvl === trackingData[0].lvl);

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
        // Clear combat flag
        encounter.in_combat = false;

// WIP: Insert attack bar abilities here
        
        
        ELHandler_player_turn_attack = function() {
            EL_player_turn_attack(encounter, enemy);
        };
        e_player_turn_attack.addEventListener('click', ELHandler_player_turn_attack);

    }
}

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
            turn_player_damage = Math.round(turn_player_damage * 10) / 10;
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
            // Player damage mitigation
            let player_armor_reduct = 1 - (playerStats.total_armor_effect / 100);
            turn_enemy_damage *= player_armor_reduct;
            //console.log(player_armor_reduct);
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
let d_player_character = saveData[1].savedCharacterData[0];
let current_char_level = d_player_character.char_level;
let exp_to_add = xp_gain(enemy.lvl);
d_player_character.char_exp += exp_to_add;
update_xp();

            new_div.innerHTML += '<p><img src="media/combatlog/xp.png" height="24" width="24"><span style="color:#34aaff;font-weight:bold;">&nbsp;You gained ' + exp_to_add + ' experience.';

// Log level increase
d_player_character = saveData[1].savedCharacterData[0];

if (d_player_character.char_level > 1 && d_player_character.char_level !== current_char_level) {
    new_div.innerHTML += '<p><img src="media/combatlog/xp.png" height="24" width="24"><span style="color:#34aaff;font-weight:bold;">&nbsp;Congratulations! You have reached level ' + d_player_character.char_level + '!';
}



            let loot_dropped = add_loot(enemy, 1, 1, 2);
            let global_dropped = add_global_drop('GLOBAL_DROP1');
            if (loot_dropped) {
                // WIP: Need level requirements
                if (global_dropped) {
                    // If GOLD drops
                    if (global_dropped.id === 'GOLD') {
                        let gold_cnt = randomize(5, 15, 1);
                        new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${global_dropped.name} x${gold_cnt}</span></p>`;
                        inv.updateLootCount(global_dropped.id, gold_cnt);
                    } else {
                        new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${global_dropped.name} x1</span></p>`;
                        inv.updateLootCount(global_dropped.id, 1);
                    }
                } else {
                    loot_dropped.forEach(loot => {
                        let d_itemData = itemData.find(i => i.id === loot.id);
    
                        new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${d_itemData.name} x${loot.cnt}</span></p>`;
                        
                        inv.updateLootCount(loot.id, loot.cnt);
                    });
                }
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

    // Return dropped items with their counts
    return dropped_items;
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

// Add items to global drop
export function inject_items_to_global_drop(arrayId, dropId) {
    let globalDrops = encounterData.filter(e => e.cat === 'global_drops');
    let drop_id = globalDrops.find(d => d.id === dropId);
    let drops = drop_id.drops;
    // Use as object for key-value pairs
    let storedData = {};

    arrayId.forEach(item => {
        storedData[item.id] = 0.04;
    });
    
    Object.assign(drops, storedData);
}
inject_items_to_global_drop(d_items_starterSet, 'GLOBAL_DROP1');

// Setup random global drop
export function add_global_drop(dropId) {
    
    let globalDrops = encounterData.filter(e => e.cat === 'global_drops');
    let drop_id = globalDrops.find(d => d.id === dropId);
    let drops = drop_id.drops;

    function getRandomDrop() {
        // Convert the drops object into an array of key-value pairs and shuffle them
        let shuffledEntries = Object.entries(drops)
            .sort(() => Math.random() - 0.5);  // This shuffles the array randomly
    
        // Now iterate over the shuffled array
        for (let [key, value] of shuffledEntries) {
            if (value > Math.random()) {
                return key;
            }
        }
    }
    
    // Get random key based on value, p
    for (let i=0; i<50; i++) {
        let this_drop = getRandomDrop();
        if (this_drop) {
            let d_item = itemData.find(i => i.id === this_drop);
            //console.log(d_item.id);
            return d_item;
        } else {
            return null;
            //console.log(i + 1);
        }
    }
    
}
//add_global_drop('GLOBAL_DROP1');

// Add equipment to itemData
// mh & oh -> weapon & shield
export function add_new_gear(name_pre, color, rarity_num, value, min_statAmt, max_statAmt, armorMin, armorMax, dmgMin, dmgMax) {

    name_pre = name_pre + '_';
    const slotTypes = saveData[3].equippedData.map(e => e.id);
    var gearSet = [
        { id: name_pre + 'HELM', slot_name: 'Head' },
        { id: name_pre + 'SPAULDERS', slot_name: 'Shoulders' },
        { id: name_pre + 'GLOVES', slot_name: 'Hands' },
        { id: name_pre + 'NECKLACE', slot_name: 'Neck' },
        { id: name_pre + 'BELT', slot_name: 'Waist' },
        { id: name_pre + 'CHESTPIECE', slot_name: 'Chest' },
        { id: name_pre + 'LEGGINGS', slot_name: 'Legs' },
        { id: name_pre + 'BRACERS', slot_name: 'Wrist' },
        { id: name_pre + 'BOOTS', slot_name: 'Feet' },
        { id: name_pre + 'RING1', slot_name: 'Ring1' },
        { id: name_pre + 'RING2', slot_name: 'Ring2' },
        { id: name_pre + 'MH', slot_name: 'Mainhand' },
        { id: name_pre + 'OH', slot_name: 'Offhand' }
    ];
    
    gearSet.forEach(item => {
        item.gains = [];
    })

    for (let i=0; i<gearSet.length; i++) {
        gearSet[i].slot = slotTypes[i];
        gearSet[i].type = 'armor';
        if (gearSet[i].slot === 'mh') {
            gearSet[i].type = 'weapon';
        }
        let baseId = gearSet[i].id.replace(/[12]$/, '');
        gearSet[i].name = baseId
            .toLowerCase()               // Convert all to lowercase
            .split('_')                  // Split the string by '_'
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
            .join(' ');                  // Join the words with a space
        if (gearSet[i].slot === 'ring1') {
            gearSet[i].name += ' I';
        } else if (gearSet[i].slot === 'ring2') {
            gearSet[i].name += ' II';
        }
        
        if (gearSet[i].slot === 'mh') {
            gearSet[i].name = gearSet[i].name.replace('Mh', 'Weapon');
        } else if (gearSet[i].slot === 'oh') {
            gearSet[i].name = gearSet[i].name.replace('Oh', 'Shield');
        }
        
        gearSet[i].rarity = rarity_num;
        
        const pluralNameSlots = [ 'shoulders', 'hands', 'legs', 'wrist', 'feet'];
        let add_s = 's';
        if (pluralNameSlots.includes(gearSet[i].slot)) {
            add_s = '';
        }
        
        gearSet[i].desc = 'The ' + gearSet[i].name + ' seem' + add_s + ' to be part of a basic equipment set.';
        gearSet[i].value = value;
        // WIP use slot icons and a color overlay
        gearSet[i].img = 'media/icons/armor/E_' + gearSet[i].slot.toUpperCase() + '_' + color + '.png';

    function get_random_stats() {
        let possibleStats = ['strength', 'intelligence', 'power', 'agility', 'wisdom'];
        let possibleStatsAmt = 2;
    
        // Initialize gains if it doesn't exist
        if (!gearSet[i].gains) {
            gearSet[i].gains = [];
        }
        
        let p;
        for (let k = 0; k < possibleStatsAmt; k++) {
            // Ensure no duplicate stats are selected in gearSet[i].gains
            do {
                p = randomize(0, possibleStats.length - 1, 1);
            } while (gearSet[i].gains.some(gain => gain.stat === possibleStats[p]));
            
            // Add random stats
            let random_stat = possibleStats[p];
            let random_stat_lbl = random_stat.charAt(0).toUpperCase() + random_stat.slice(1);
            let random_stat_amt = randomize(min_statAmt, max_statAmt, 1);
            gearSet[i].gains.push({ stat: random_stat, lbl: random_stat_lbl, amt: random_stat_amt });
        }
        
        // Add random armor
        let random_armor = randomize(armorMin, armorMax, 5);
        if (gearSet[i].slot !== 'mh' && gearSet[i].slot !== 'oh') {
            gearSet[i].gains.push({ stat: 'armor', lbl: 'Armor', amt: random_armor });
        }
        if (gearSet[i].slot === 'oh' && gearSet[i].type === 'shield') {
            gearSet[i].gains.push({ stat: 'armor', lbl: 'Armor', amt: random_armor * 5 });
            // Double value of oh item
            gearSet[i].value *= 2;
        }
        
        // Add random damage to mh weapon
        if (gearSet[i].slot === 'mh' && gearSet[i].type === 'weapon') {
            let random_min_dmg = randomize(dmgMin, dmgMax, 0.1);
            gearSet[i].gains.push({ stat: 'dmg_min', amt: Math.round(random_min_dmg * 10)/10 });
            gearSet[i].gains.push({ stat: 'dmg_max', amt: Math.round((random_min_dmg + (dmgMax - dmgMin))*10)/10 });
            // Double value of mh item
            gearSet[i].value *= 2;
        }
    
    }
    get_random_stats();

    }

    // Add new gear set to itemData
    itemData.push(...gearSet);
    
    // Return array data
    return gearSet;
}