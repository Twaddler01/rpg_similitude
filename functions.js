// functions.js

import { itemData, locationsData, characterData, encounterData, trackingData } from './data.js';
import * as gf from './general_functions.js';
import * as ch from './character.js';
import * as inv from './inventory.js';
import * as d from './database.js';
import { dbState } from './main.js';

// Reset saveData to defaults
export async function clearSaveData() {

    saveData.length = 0;
    const response = await fetch('./data/newSaveData.json');
    const parsedData = await response.json();
    parsedData.forEach(item => {
        saveData.push(item);
    });
}

export function downloadSaveData() {
    //const filteredSaveData = exportFilteredSaveData(baselineData, saveData);

    // Convert to JSON and create a blob for download
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

export function json(data) {
    console.log(JSON.stringify(data, null, 2));
}

// Main function to create new elements
/*export function create_el(newId, type, parentId, content) {
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
            //console.log('newId: ' + newId);
            //console.log('parentId: ' + parentId.id);
            parentId.appendChild(new_el);
        }
        new_el.id = newId;
        if (content) {
            new_el.innerHTML = content;
        }
    }

    return new_el;
}*/

// Main function to create new elements VERSION 2
export function create_el(newId, type, parentId, looped = false, content) {
    // If looped, append incremental numbers to the ID
    if (looped) {
        let index = 0; // Start index at 0
        while (document.getElementById(newId + '_' + index)) {
            index++; // Increment until an unused ID is found
        }
        newId = newId + '_' + index; // Append the number to the ID
    }

    // Check if the element already exists (for non-looped IDs)
    let existing_el = document.getElementById(newId);
    if (existing_el) {
        return existing_el; // Return the existing element
    }

    // Get the parent element (whether passed as ID or element)
    let parent_el =
        typeof parentId === 'string' ? document.getElementById(parentId) : parentId;

    if (!parent_el && parentId !== 'body') {
        console.warn(`Parent with ID "${parentId}" not found. Element "${newId}" created but not appended.`);
        parent_el = null; // Fallback to no parent
    }

    // Create the new element
    let new_el = document.createElement(type);
    new_el.id = newId;

    if (content) {
        new_el.innerHTML = content;
    }

    // Append to the parent if it exists
    if (parent_el) {
        parent_el.appendChild(new_el);
    } else if (parentId === 'body') {
        document.body.appendChild(new_el); // Special case for the body
    }

    return new_el;
}

// Main function to create new elements NEWEST
/*export function create_el(newId, type, parentId, content, single = false, allIds = []) {

if (allIds) {
    // Push the current ID to the tracking array
    allIds.push(newId);

    // Count all occurrences of this ID in the array so far
    const occurrences = allIds.filter(id => id === newId).length;

    // Modify the ID if there are duplicates
    let finalId = newId;
    if (occurrences > 1) {
        // First duplicate gets "0", and subsequent ones increment
        finalId = newId + (occurrences - 1);
    }
}
    // Check if the parent element exists
    const parent_el =
        typeof parentId === 'string' ? document.getElementById(parentId) : parentId;

    if (!parent_el && parentId !== 'body') {
        console.warn(`Parent with ID "${parentId}" not found. Element "${newId}" created but not appended.`);
        return null; // Exit early if no parent
    }

    // Create the element with the final ID
    const new_el = document.createElement(type);
    new_el.id = finalId;

    if (single) {
        new_el.id = newId;
    }

    if (content) {
        new_el.innerHTML = content;
    }

    // Append the element to the parent or body
    if (parent_el) {
        parent_el.appendChild(new_el);
    } else if (parentId === 'body') {
        document.body.appendChild(new_el);
    }

    return new_el;
}*/

// OUT OF DATE SINCE indexedDB
let add_message_cnt_test = -1;
export function add_test_section() {

    // Create main test_section div
    let test_section = document.createElement('div');
    document.body.appendChild(test_section);
    test_section.id = 'test_section';

// test add_message()
    const message_test_btn = create_el('message_test_btn', 'button', test_section);
    message_test_btn.innerHTML = 'ADD NEW MESSAGE';
    message_test_btn.addEventListener('click', () => {
        add_message_cnt_test++;
        add_message('This is message num: ' + add_message_cnt_test);

// *** CAN BE USED AS LOG BUTTON HERE
//console.log(itemData.length);
//console.log(JSON.stringify(itemData, null, 2));

    });

// **** Function to create a button and add click functionality
    function add_test_action(name, buttonTxt, action) {
        const button = create_el(name, 'button', test_section); // Assuming create_el creates & returns the element
        button.innerHTML = buttonTxt;
        button.addEventListener('click', action); // Attach action to click event
    }

// Check modifiedSaveData
    let get_modifiedSaveData = () => {

    downloadSaveData();

    //const exportedData = exportFilteredSaveData(baselineData, saveData);
    //console.log(exportedData);
    //downloadFilteredSaveData();
    };

    add_test_action('testJsonDl', 'Download Save Data', get_modifiedSaveData);

// general test buttons
    let test_addlevel = () => {
        let player = saveData[1].savedCharacterData[0];
        player.char_level += 1;
        let playerInfo_level = document.getElementById('playerInfo_level');
        playerInfo_level.innerHTML = 'Level ' + player.char_level + '&nbsp;' + player.char_race + '&nbsp;' + player.char_class;
    };
    add_test_action('addlevel', 'test_addlevel', test_addlevel);


// Check divs
    const check_divs = create_el('check_divs', 'button', test_section);
    check_divs.innerHTML = 'Check divs';
    check_divs.addEventListener('click', () => {

        let all_el = document.querySelectorAll('body, body *');
        let filteredEl = Array.from(all_el).filter(e => e.id !== 'js-console' && e.id !== 'exportButton' && e.id !== 'exportHTMLButton');

        filteredEl.forEach(el => {
            if (el.id) {
                console.log(el.id);
            } //else {
                //console.log(el.outerHTML);
            //}
        });
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

// Add loot buttons
    function add_loot_buttons() {
        let loot_container = document.createElement('div');
        test_section.appendChild(loot_container);
        loot_container.style.fontSize = '10px';

        let filtered_itemData = itemData.filter(i => i.id !== 'GOLD');
        filtered_itemData.forEach(item => {
            let add_loot = document.createElement('button');
            loot_container.appendChild(add_loot);
            add_loot.innerHTML = item.id;
            add_loot.style.backgroundColor = 'yellow';
            add_loot.addEventListener('click', () => {
                inv.updateLootCount(item.id, 1);
            });
        });
    }
    setTimeout(() => {
        add_loot_buttons();
    }, 2000);

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

}

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

export function randomize(min, max, step) {
    // Calculate the range in terms of the step size
    let range = (max - min) / step;

    // Get a random integer based on the range
    let randomStep = Math.floor(Math.random() * (range + 1));

    // Scale the random step back to the original range
    return min + randomStep * step;
}

////
export function setup_encounters(loc) {

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
                    cat: 'enemy',
                    lbl: enemy_name,   // Include the random name in the enemy list
                    lvl: index + 1,
                    drops: [ { id: 'GOLD', p: 1 } ]
                });
            }
        }
    });


    // Function to pick a single random unused name and mark it as used
    function pickRandomName() {

    // Get random names
    let enemy_names = encounterData.find(e => e.id === 'enemyNames1');
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
        //console.log('setup_encounters');
        //console.log(e);
    });

} // End function
// Location 1+ only
//// WIP
//setup_encounters(1);

// EQUIPMEMT CREATOR -- CUSTOM OPTIONS
// *** START *** JSON FILE CREATION
// Generate mew equipment array to export as .JSON
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

    function get_random_stats(possibleStatsAmt) {
        let possibleStats = ['strength', 'intelligence', 'power', 'agility', 'wisdom'];
        //let possibleStatsAmt = 2;

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
    get_random_stats(1);

    }

    // Return array data
    return gearSet;
}

// Download a new array .JSON file
function export_createdItems_JSON(filename, parsedArray) {
    parsedArray = JSON.stringify(parsedArray, null, 2);
    const blob = new Blob([parsedArray], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
// *** END *** JSON FILE CREATION
// CREATED PREVIOUSLY:
//export_createdItems_JSON('starterSet', d_items_starterSet);

// Skill bar, returns elements and a value with methods for updating
export function create_bar_elements(id, parentId, textInside, valueTotal, barColor) {
    let parentEl = document.getElementById(parentId);
    if (!parentEl) {
        // If parentEl isn't in DOM, try element id directly
        if (!parentId) {
            console.error('create_bar_elements(id: ' + id + ', parentId: ' + parentId + ') - parentID error.');
            return;
        } else {
            // If not in DOM, but element id is present
            parentEl = parentId;
        }
    }

    // Container with border
    let container = document.createElement('div');
    container.id = id + '_container';
    container.classList.add('f_create_bar_elements_container');
    parentEl.appendChild(container);
    container.style.width = '100%';

    // Fill element inside the progress bar
    let progress_fill = document.createElement('div');
    progress_fill.id = id + '_progress_fill';
    progress_fill.classList.add('f_create_bar_elements_progress_fill');
    container.appendChild(progress_fill);

    // Set color of fill
    progress_fill.style.backgroundColor = barColor;

    // Display text above the fill element
    let progress_text = document.createElement('div');
    progress_text.id = id + '_progress_text';
    progress_text.classList.add('f_create_bar_elements_progress_text');
    container.appendChild(progress_text);

    // Initialize and set the width based on valueTotal
    let valueCurrent = valueTotal;
    let bar_percentage = (valueCurrent / valueTotal) * 100;
    progress_fill.style.width = bar_percentage + '%';
    progress_text.innerHTML = textInside + ': ' + valueCurrent + ' / ' + valueTotal;

    // Method to update the bar fill and text display
    function updateValue(newValue) {
        valueCurrent = Math.max(0, Math.min(newValue, valueTotal));  // Constrain between 0 and valueTotal
        Math.round(valueCurrent * 10) / 10;
        Math.round(valueTotal  * 10) / 10;
        bar_percentage = (valueCurrent / valueTotal) * 100;
        progress_fill.style.width = bar_percentage + '%';  // Update fill width
        progress_text.innerHTML = textInside + ': ' + valueCurrent + ' / ' + valueTotal;
    }

    // Method to update the textInside display
    function updateText(newText) {
        textInside = newText;
        progress_text.innerHTML = textInside + ': ' + valueCurrent + ' / ' + valueTotal;
    }

    // Method to update bar fill total
    function updateTotal(newValue) {
        valueTotal = newValue;
        Math.round(valueCurrent * 10) / 10;
        Math.round(valueTotal  * 10) / 10;
        bar_percentage = (valueCurrent / valueTotal) * 100;
        progress_fill.style.width = bar_percentage + '%';  // Update fill width
        progress_text.innerHTML = textInside + ': ' + valueCurrent + ' / ' + valueTotal;
    }

    return {
        container,
        progress_fill,
        progress_text,
        updateValue,
        updateText,
        updateTotal
    };
}

let message_cnt = 0;
export async function add_message(message, color) {
    //OLD const stored_messages = saveData[6].storedMessages;
    const stored_messages = await d.getSlotData(dbState.slot_selected, 'storedMessages');

    // Default color to white if not provided
    color = color || 'white';

    // Get the container where messages are displayed
    const messages_container = document.getElementById('game_messages');
    const currentDateTime = new Date().toLocaleString();

    // Prepare the new message data with timestamp, color, and message text
    const newMessageData = {
        message: message,
        color: color,
        timestamp: currentDateTime
    };

    // Append the new message data to the beginning of stored_messages
    stored_messages.unshift(newMessageData);

    // Trim stored_messages to the most recent 20 messages if needed
    if (stored_messages.length > 20) {
        stored_messages.pop(); // Removes the oldest message
    }

    // Format each message and append it to the container (newest on top)
    messages_container.innerHTML = stored_messages.map(formatMessage).join('<br>');

    await d.updateSlotData(dbState.slot_selected, 'storedMessages', stored_messages);
}

// Helper function to format a message as HTML
function formatMessage(messageData) {
    return `<span style="font-size:10px; color:gray; vertical-align:bottom;">(${messageData.timestamp})</span><br><span style="color:${messageData.color};">${messageData.message}</span>`;
}

// Load JSON item data into itemData array
async function import_createdItems_JSON(type, filename, arrayId) {

    if (type === 'item') {
        const response = await fetch('data/' + filename);
        const data = await response.json();

        data.forEach(item => {
            arrayId.push(item);
        });

        return data;
    }
}

// Add items to encounterData global drops
function inject_items_to_global_drop(arrayId, dropId) {
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

export async function load_items() {
    // Temporary arrays to store each JSON set individually
    const d_items_starterSet = [];
    const d_items_basicWeapons = [];

    // Load each JSON into its respective temporary array
    await import_createdItems_JSON('item', 'starterSet.json', d_items_starterSet);
    await import_createdItems_JSON('item', 'basicWeapons.json', d_items_basicWeapons);

    // Push items into the main itemData array
    itemData.push(...d_items_starterSet, ...d_items_basicWeapons);

    // Inject items from each set to their respective global drops
    inject_items_to_global_drop(d_items_starterSet, 'GLOBAL_DROP1');
    inject_items_to_global_drop(d_items_basicWeapons, 'GLOBAL_DROP0');
}
