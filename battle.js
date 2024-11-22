// battle.js

import { characterData, locationsData, trackingData, encounterData, itemData } from './data.js';
import { create_el, randomize } from './functions.js';
import { update_battleStats } from './equipment.js';
import { toggleElement } from './general_functions.js';
import { updateLootCount } from './inventory.js';
import { disableTabs, restoreTabs, dbState } from './main.js';
import { add_message } from './functions.js';
import * as d from './database.js';

export async function fetch_playerStats(opt) {
    let playerStats = characterData.find(d => d.id === 'player_stats');
    let stats = await update_battleStats();

    playerStats.max_health = await stats.calc_totalHealth();
    // playerStats.cur_health
    playerStats.max_resource = await stats.calc_resource_melee();
    // playerStats.cur_resource

    if (opt === 'new') {
        // Reset current health
        playerStats.cur_health = playerStats.max_health;
        // Reset current resource
        playerStats.cur_resource = playerStats.max_resource;
    }
}

export async function update_locations() {

    let e_tab_player_battle = document.getElementById('tab_player_battle');
    if (e_tab_player_battle) {
        e_tab_player_battle.innerHTML = '';
    }

    // For choosing locations
    create_el('location_container', 'div', e_tab_player_battle);
    location_container.classList.add('location_box_style');
    location_container.innerHTML = '<b>CHOOSE BATTLE LOCATION:<p></p></b>';

    // Once battle starts
    create_el('battle_ui_container', 'div', e_tab_player_battle);
    battle_ui_container.style.backgroundColor = 'black';

    // Update location array data
    let d_killsData = await d.getSlotData(dbState.slot_selected, 'killsData');
    for (let i = 0; i < locationsData.length; i++) {
        /*OLD if (saveData[0] && saveData[0].killsData && saveData[0].killsData[i]) {
            locationsData[i].kills = saveData[0].killsData[i].kills;
        }*/
        if (d_killsData && d_killsData[i]) {
            locationsData[i].kills = d_killsData[i].kills;
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
    await d.updateSlotData(dbState.slot_selected, 'killsData', d_killsData);

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
    location_container.appendChild(message);
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

    if (message) {
        message.innerHTML = '';
    }
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
    e_player_health_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
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

// ENEMY

    let encounter = encounterData.find(e => e.loc === trackingData[0].loc && e.lvl === trackingData[0].lvl);

    // First encounter
    if (encounter.in_combat) { // && trackingData[0].loc === 0 && trackingData[0].lvl === 1) {

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
        e_enemy_health_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect

        // Enemy death
        if (encounter.cur_health <= 0) {
            encounter.cur_health = 0;
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
        // Enable elements once out of combat
        restoreTabs();
        return;
    }

    // Toggle combat on
    if (playerCombat.in_combat === false) {
        spacer_player_combat_status.style.height = '5px';
        player_combat_status.style.display = 'block';
        player_battle_status_bars.style.border = 'solid 5px red';
        enemy_battle_status_bars.style.border = 'solid 5px red';
        playerCombat.in_combat = true;
        // Disable elements while im combat
        disableTabs();
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

export async function update_xp() {

    // Data needed
    //OLD let d_player_character = saveData[1].savedCharacterData[0];
    let d_savedCharacterData = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
    let d_player_character = d_savedCharacterData[0];

    //console.log('d_savedCharacterData[0] -- update_xp');
    //console.log(d_savedCharacterData[0]);

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
    e_experience_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
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
        e_experience_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
        e_experience_percent.innerHTML = fill_amt;
        e_experience_to_level.innerHTML = d_player_character.char_exp_to_level;
        // Update element from level increase
        let playerInfo_level = document.getElementById('playerInfo_level');
        playerInfo_level.innerHTML = 'Level ' + d_player_character.char_level + '&nbsp;' + d_player_character.char_race + '&nbsp;' + d_player_character.char_class;
    }
    await d.updateSlotData(dbState.slot_selected, 'savedCharacterData', d_savedCharacterData);
}

export function reset_battle() {
    // Clear encounter combat and player combat
    let encounter = null;
    let enemy_loc = trackingData[0].loc;
    let enemy_lvl = trackingData[0].lvl;
    if (enemy_loc === 0) {
        encounter = encounterData.find(e => e.id === 'beginner_0');
    } else {
        encounter = encounterData.find(e => e.id === 'group_lvl_' + enemy_lvl && e.loc === enemy_loc && e.lvl === enemy_lvl);
    }
    if (encounter && encounter.in_combat) {
        encounter.in_combat = false;
        let playerCombat = characterData.find(c => c.id === 'player_combat_status');
        playerCombat.in_combat = false;
    }
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
export async function start_battle() {

    // Data
    //OLD let d_player_character = saveData[1].savedCharacterData[0];
    const d_savedCharacterData = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
    const d_player_character = d_savedCharacterData[0];

    let playerStats = characterData.find(d => d.id === 'player_stats');

    await fetch_playerStats('new');

    // Main battle container
    let battle_section_container = document.getElementById('tab_player_battle');

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
    player_name_level.classList.add('bar_label_container');

    create_el('player_name', 'span', 'player_name_level');
    player_name.classList.add('bar_left_label');
    player_name.innerHTML = d_player_character.char_name;

    create_el('player_level', 'span', 'player_name_level');
    player_level.classList.add('bar_right_label');
    player_level.innerHTML = 'Level: ' + d_player_character.char_level;

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
    player_health_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
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
    player_resource_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
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
    experience_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect

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

    await d.updateSlotData(dbState.slot_selected, 'savedCharacterData', d_savedCharacterData);

    // Initial display
    await update_xp();

// WIP Need update_resource

    // Setup battle encounter
    create_el('battle_verses_box', 'div', all_battle_ui_elements);
    battle_verses_box.innerHTML = '<p style="text-align:center;font-size:16px;color:red;" id="player_to_enemy_btn">[ TARGETING ]</p>';

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
        encounter = encounterData.find(e => e.id === 'group_lvl_' + enemy_lvl && e.loc === enemy_loc && e.lvl === enemy_lvl);

        // Choose random array index of enemyList;
        let enemyList = encounter.enemy_list;
        random_enemy = choose_enemy(enemyList);
        //console.log('random_enemy');
        //console.log(random_enemy);
        //console.log('encounter');
        //console.log(encounter);

        // Mark enemy alive
        random_enemy.dead = false;
        trackingData[0].current_enemy = random_enemy.id;

        //// WIP more array data needed
    }

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
        enemy_health_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
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
        let e_tab_player_battle = document.getElementById('tab_player_battle');
        create_el('combat_log_container', 'div', all_battle_ui_elements);
    }

    toggleElement('h', 'new_battle_button');
    toggleElement('s', 'attack_box_button');

    // Fetch or create attack button
    let e_attack_box_button = document.getElementById('attack_box_button');
    if (e_attack_box_button) {
        e_attack_box_button.addEventListener('click', () => {
            toggleElement('s', 'change_location_button');
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
            toggleElement('s', 'change_location_button');
            attack_box_button(e_attack_box_button, random_enemy, encounter);
        });
    }

    let e_change_location = document.getElementById('change_location_button');
    e_change_location.addEventListener('click', () => {
        toggleElement('h', 'change_location_button');
        // Reset battle ui elements
        reset_battle();
    });

    if (trackingData[0].next_attack) {
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
    let d_curr_loc_img = locationsData.find(l => l.loc === trackingData[0].loc && l.lvl === 1);

    // Place image in location area
    let battle_location_image = document.getElementById('battle_location_image');
    let loc_img = document.createElement('img');
    battle_location_image.appendChild(loc_img);
    loc_img.style.width = '150px';
    loc_img.style.height = 'auto';
    loc_img.src = d_curr_loc_img.img;

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

    if (trackingData[0].next_attack) {
        EL_player_turn_attack(encounter, enemy);
    }

}

let ELHandler_player_next_turn = null;
export async function player_attack(enemy, encounter) {

    let playerStats = characterData.find(d => d.id === 'player_stats');
    //OLD let d_player_character = saveData[1].savedCharacterData[0];
    const d_savedCharacterData = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
    const d_player_character = d_savedCharacterData[0];
    let current_char_level = d_player_character.char_level;

// Main function call
let fetch_battleStats = await update_battleStats(enemy.lvl);
// Function methods
let hitChance = await fetch_battleStats.calc_hitChance();
let critChance = await fetch_battleStats.calc_meleeCriticalStrikeChance();
let [attack_min, attack_max] = await fetch_battleStats.calc_meleeAttack();
let dmg_mit_armor = await fetch_battleStats.calc_armorMitigation();

// Future work
let resource_melee = await fetch_battleStats.calc_resource_melee();
// Not needed here ?
let total_health = await fetch_battleStats.calc_totalHealth();

// For use below
let missChance = Math.round((1 - hitChance) * 1000) / 1000;
let noCritChance = Math.round((1 - critChance) * 1000) / 1000;

/*
console.log('missChance: ' + missChance);
console.log('noCritChance: ' + noCritChance);
console.log('attack_min: ' + attack_min);
console.log('attack_max: ' + attack_max);
console.log('dmg_mit_armor: ' + dmg_mit_armor);
console.log('resource_melee: ' + resource_melee);
console.log('total_health: ' + total_health);
*/

//console.log(playerStats);
//console.log(enemy);
//console.log(encounter);

// PLAYER TURN

    // While enemy is alive
    if (!enemy.dead) {

// STAT: Hit chance
        // Generate a random number to determine if the attack misses (10% chance)
        let randomMissChance = Math.random();
        let turn_player_damage = 0;
        let turn_player_critical = false;

// STAT: turn_player_damage
        if (randomMissChance < missChance) {
        // Attack missed
            //console.log('Attack missed...');
            turn_player_damage = 0;
        } else {
        // Attack hit
            turn_player_damage = randomize(attack_min, attack_max, 0.1);

// STAT: turn_player_critical
            let randomCritChance = Math.random();
            if (randomCritChance < noCritChance) {
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
            turn_enemy_damage *= dmg_mit_armor;
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
            //encounter.cur_health = 0;
            enemy.dead = true;
            let d_killsData = await d.getSlotData(dbState.slot_selected, 'killsData');
            locationsData.forEach((item, index) => {
                if (locationsData[index].loc === trackingData[0].loc && locationsData[index].lvl === trackingData[0].lvl) {
                    d_killsData[index].kills += 1;
                    d.updateSlotData(dbState.slot_selected, 'killsData', d_killsData);
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
// WIP need enemy crit, special abilities
            new_div.innerHTML += '<p><span class="material-symbols-outlined">heart_minus</span><span style="color:#FF9393;">&nbsp;Level ' + enemy.lvl + ' enemy ' + enemy.lbl + '\'s physical attack inflicts ' + turn_enemy_damage + ' damage to you.</span></p>';
        }

        if (enemy.dead) {
            new_div.innerHTML += '<p><span class="material-symbols-outlined">skull</span><span style="color:#F7EB00;font-weight:bold;">&nbsp;You defeated a level ' + enemy.lvl + '&nbsp;' + enemy.lbl + '.</span></p>';

            // xp gained
            let exp_to_add = xp_gain(enemy.lvl);
            //d_savedCharacterData[0].char_exp += exp_to_add;
            d_player_character.char_exp += exp_to_add;
            await d.updateSlotData(dbState.slot_selected, 'savedCharacterData', d_savedCharacterData);
            await update_xp();

            new_div.innerHTML += '<p><img src="media/combatlog/xp.png" height="24" width="24"><span style="color:#34aaff;font-weight:bold;">&nbsp;You gained ' + exp_to_add + ' experience.';

            // Log level increase
            //OLD d_player_character = saveData[1].savedCharacterData[0];
///*
            const d_savedCharacterData2 = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
            const d_player_character2 = d_savedCharacterData2[0];

            if (d_player_character2.char_level > 1 && d_player_character2.char_level !== current_char_level) {
                new_div.innerHTML += '<p><img src="media/combatlog/xp.png" height="24" width="24"><span style="color:#34aaff;font-weight:bold;">&nbsp;Congratulations! You have reached level ' + d_player_character2.char_level + '!';
                add_message('Congratulations! You have reached level ' + d_player_character2.char_level + '!');
            }
//*/

            // Check if any drops are present
            if (enemy.drops.length > 0) {

                let loot_dropped = add_loot(enemy, 1, 1, 2);

                let global_dropped = null;
                // use GLOBAL_DROP1 for loc1 only
                if (encounter.loc === 1) {
                    loot_dropped = add_loot(enemy, 1, 4, 6);
                    global_dropped = add_global_drop('GLOBAL_DROP1');
                }
                if (encounter.loc === 0) {
                    //loot_dropped = add_loot(enemy, 1, 0, 0);
                    global_dropped = add_global_drop('GLOBAL_DROP0');
                }
                let gold_total = 0;

                if (loot_dropped) {
                    if (global_dropped) {
                        // If GOLD drops
                        if (global_dropped.id === 'GOLD') {
                            let gold_cnt = randomize(5, 15, 1);
                            new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${global_dropped.name} x${gold_cnt}</span></p>`;
                            updateLootCount(global_dropped.id, gold_cnt);
                        } else {
                            new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${global_dropped.name} x1</span></p>`;
                            updateLootCount(global_dropped.id, 1);
                        }
                    } else {
                        loot_dropped.forEach(loot => {
                            let d_itemData = itemData.find(i => i.id === loot.id);

                            if (loot.id === 'GOLD') {
                                gold_total += loot.cnt;
                            } else {
                                new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${d_itemData.name} x${loot.cnt}</span></p>`;
                                updateLootCount(loot.id, loot.cnt);
                            }
                        });
                        if (gold_total > 0) {
                            // Combine totals of Gold (from loot_dropped)
                            new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: Gold x${gold_total}</span></p>`;
                            updateLootCount('GOLD', gold_total);
                        }
                    }
                }
            } else {
                new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:yellow;font-weight:bold;">&nbsp;You received no loot.</span></p>`;
            }

            // reset combat log
            encounter.log_cnt = 0;

// AUTO PREPARE NEXT ATTACK

            // Other resets are performed in reset_battle()
            encounter.in_combat = false;

            // Reset eventListener for next attack without full element reset
            let e_player_turn_attack = document.getElementById('player_turn_attack');
            e_player_turn_attack.removeEventListener('click', ELHandler_player_turn_attack);

            // WIP BUG Resets combat too early
            ELHandler_player_next_turn = function() {
                EL_player_next_turn(e_player_turn_attack);

            };
            e_player_turn_attack.addEventListener('click', ELHandler_player_next_turn);

            toggleElement('s', 'change_location_button');
            let e_locations_status = document.getElementById('locations_status');
            e_locations_status.innerHTML = `You defeated <b>${enemy.lbl}</b> in <b>${trackingData[0].location}</b> Level <b>${trackingData[0].lvl}</b>`;

        } // end if (enemy.dead)

        if (playerStats.dead) {
            disableTabs();
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
                        // Enable tabs again
                        restoreTabs();
                        // Reset battle/location elements
                        reset_battle();
                    }
                }, 1000); // 1000ms = 1 second
            };

            e_player_turn_attack.addEventListener('click', do_revive);
        }
    } // end if (!enemy.dead
}

// Function for next turn USE ATTACK
async function EL_player_next_turn(e_player_turn_attack) {
    toggleElement('h', 'change_location_button');
    trackingData[0].combat_log_created = false;
    await update_locations();
    trackingData[0].next_attack = true;
    selectLevel(trackingData[0].loc, trackingData[0].location, trackingData[0].lvl, trackingData[0].kills);
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

// Setup random global drops
// Called only when looting
// add_global_drop('GLOBAL_DROP1');
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
