// battle.js

import { characterData, trackingData, encounterData, itemData } from './data.js';
import { create_el, randomize, json, getEl } from './functions.js';
import { update_battleStats } from './equipment.js';
import { toggleElement } from './general_functions.js';
import { updateLootCount } from './inventory.js';
import { disableTabs, restoreTabs, dbState } from './main.js';
import { add_message } from './functions.js';
import * as d from './database.js';

/*
try {
} catch (error) {
    console.error('ERROR:' + error);
    console.error('STACK:' + error.stack)
}
*/

// Store current selections (temp)
let loc = null;
let lvl = null;
let ene = null;
let cnt = null;
// Store all previous selections globally
const lastSelections = [];
// The bsttle to load on losding of tab
const lastBattle = [];
// Stores the most recently unlocked level globally
let lastUnlockedLevel = null;
export async function update_locations() {

    async function getData() {
        lastUnlockedLevel = await d.getSlotData(dbState.slot_selected, 'lastUnlockedLevel');
    }
    getData();

    function clearElements(id, action) {
        let getId = document.getElementById(id);
        if (getId && action === 'clear') {
            getId.innerHTML = '';
            return getId;
        }
        if (getId && action === 'remove') {
            getId.remove();
            return getId;
        }
    }

    let e_tab_player_battle = clearElements('tab_player_battle', 'clear');

    // Load location array data
    const locationsData = await d.getSlotData(dbState.slot_selected, 'locationsData');

    // Initialize array for session
    if (lastSelections.length === 0) {
        locationsData.forEach(fe_loc => {
            fe_loc.levels.forEach(fe_lvl => {
                lastSelections.push({
                    loc: fe_loc.id,
                    lvl: fe_lvl.id,
                    ene: null,
                    cnt: 0,
                });
            });
        });
    }
    //json(lastSelections);
    
    if (lastBattle.length === 0) {
        lastBattle.push({
            loc: null,
            lvl: null,
            ene: null,
            cnt: 0,
        });
    }

    // Immediately update loc, lvl display -- autoclick for refresh
    function update_for_nextUnlock(fe_loc_id, fe_level_id) {
        //console.log(`TEST: Location: ${loc} / Level: ${lvl} / Enemy: ${ene} / Quantity: ${cnt}`);
        const e_loc = document.getElementById('location_div_' + fe_loc_id);
        if (e_loc) {
            e_loc.click();
            const e_levelButton = document.getElementById('levelButton_' + fe_level_id);
            if (e_levelButton) {
                e_levelButton.click();
            }
        }
    }

    // For choosing locations
    const location_container = create_el('location_container', 'div', e_tab_player_battle);
    location_container.classList.add('location_box_style');
    location_container.innerHTML = '<b><span id="battle_loc_choose">CHOOSE</span> BATTLE LOCATION:<p></p></b>';

    // Once battle starts
    const battle_ui_container = create_el('battle_ui_container', 'div', e_tab_player_battle);
    battle_ui_container.style.backgroundColor = 'black';

    // Location image (used in battle)
    //let battle_location_image = create_el('battle_location_image', 'div', location_container);

    // Load unlocked locations/levels
    function display_locations() {

        // Reset location_container
        let e_location_container = document.getElementById('location_container');
        if (e_location_container) { e_location_container.innerHTML = '<b><span id="battle_loc_choose">CHOOSE</span> BATTLE LOCATION:<p></p></b>'; }

        // Create locations container
        let locations = document.createElement('div');
        location_container.appendChild(locations);
        locations.id = 'locations';
        locations.style.display = 'flex';
        locations.style.overflow = 'auto';

        // Create levels label
        let levels_label = document.createElement('div');
        location_container.appendChild(levels_label);
        levels_label.id = 'levels_label';

        // Create levels container
        let levels = document.createElement('div');
        location_container.appendChild(levels);
        levels.id = 'levels';
        levels.style.overflow = 'auto';

        // Create unlock messages container
        const unlock_messages = create_el('unlock_messages', 'div', location_container);
        const new_lvl_requires_title = create_el('new_lvl_requires_title', 'div', location_container);
        new_lvl_requires_title.style.color = 'lightgreen';
        const new_lvl_requires = create_el('new_lvl_requires', 'div', location_container);
        new_lvl_requires.style.color = 'white';

        // Create current enemy count
        const enemy_defeated = document.createElement('div');
        location_container.appendChild(enemy_defeated);
        enemy_defeated.id = 'enemy_cnt';

        // Create location status container
        let locations_status = document.createElement('div');
        location_container.appendChild(locations_status);
        locations_status.id = 'locations_status';

        const available_enemies = document.createElement('div');
        location_container.appendChild(available_enemies);
        available_enemies.id = 'available_enemies';

        const enemy_status = document.createElement('div');
        location_container.appendChild(enemy_status);
        enemy_status.id = 'enemy_status';

        const enemies_cnt_div = document.createElement('div');
        location_container.appendChild(enemies_cnt_div);
        enemy_status.id = 'enemies_cnt_div';

        const prepare_battle_div = document.createElement('div');
        location_container.appendChild(prepare_battle_div);
        prepare_battle_div.id = 'prepare_battle_div';

        let filteredUnlocked_loc = locationsData.filter(l => l.unlocked === true);

        filteredUnlocked_loc.forEach(fe_loc => {
            const all_levels = fe_loc.levels;

            // Location img containers
            let e_loc = document.createElement('div');
            e_loc.id = 'location_div_' + fe_loc.id;
            locations.appendChild(e_loc);
            e_loc.innerHTML = fe_loc.lbl;
            e_loc.classList.add('img_border_off');
            e_loc.style.width = '150px';

            let loc_img = document.createElement('img');
            loc_img.id = 'loc_img_' + fe_loc.id;
            e_loc.appendChild(loc_img);
            loc_img.style.width = '150px';
            loc_img.style.height = 'auto';
            loc_img.src = fe_loc.img;

            // Create level element containers
            let loc_levels = document.createElement('div');
            levels.appendChild(loc_levels);
            loc_levels.id = 'loc_levels_' + fe_loc.id;
            loc_levels.style.overflow = 'auto';

            function location_clicks() {

                filteredUnlocked_loc.forEach(item => {
                    // Clear all loc_levels elements
                    clearElements('loc_levels_' + item.id, 'clear');

                    // Clear all img borders
                    let DOM_all_loc_div = document.getElementById('location_div_' + item.id);
                    if (DOM_all_loc_div) {
                        DOM_all_loc_div.classList.remove('img_border_on');
                        DOM_all_loc_div.classList.add('img_border_off');
                    }
                });

                let battle_loc_choose = document.getElementById('battle_loc_choose');
                battle_loc_choose.innerHTML = 'SELECTED';
                levels_label.innerHTML = '<br><b>CHOOSE BATTLE LEVEL:<p></p></b>';

                // Add buttons to levels
                const filteredUnlocked_lvl = all_levels.filter(l => l.unlocked === true);

                filteredUnlocked_lvl.forEach(fe_level => {

                    function unlock_requirements(f_lvl) {

                        const e_new_lvl_requires_title = document.getElementById('new_lvl_requires_title');
                        const e_new_lvl_requires = document.getElementById('new_lvl_requires');
                        const e_available_enemies = document.getElementById('available_enemies');
                        const e_enemy_cnt = document.getElementById('enemy_cnt');

                        if (lastUnlockedLevel && (lastUnlockedLevel.id === lvl || lastUnlockedLevel.id === f_lvl)) {
                            
                            lastBattle[0].loc = fe_loc.id;
                            lastBattle[0].lvl = lastUnlockedLevel.id;
                            
                            e_new_lvl_requires_title.innerHTML = '<b>Next Unlock Requires:</b>';

                            let next_req_kills = fe_level.next_req.find(r => r.id === 'kills');
                            // Kill requirements
                            if (next_req_kills) {
                                e_new_lvl_requires.innerHTML = '- Enemies defeated: <span id="e_new_lvl_requires_kills_cnt"></span> / <span id="e_new_lvl_requires_kills_req"></span>';
                                // Add requirements display
                                let e_new_lvl_requires_kills_cnt = document.getElementById('e_new_lvl_requires_kills_cnt');
                                e_new_lvl_requires_kills_cnt.innerHTML = fe_level.kills;
                                let e_new_lvl_requires_kills_req = document.getElementById('e_new_lvl_requires_kills_req');
                                e_new_lvl_requires_kills_req.innerHTML = next_req_kills.cnt;
                                e_available_enemies.innerHTML = '';
                                e_enemy_cnt.innerHTML = '';
                            }
                        } else {
                            if (e_enemy_cnt) {
                                e_enemy_cnt.innerHTML = `Enemies defeated here: ${fe_level.kills}`;
                            }
                            clearElements('new_lvl_requires_title', 'clear');
                            clearElements('new_lvl_requires', 'clear');
                        }
                    }
                    
                    const levelButton = document.createElement('button');
                    levelButton.innerHTML = fe_level.lbl;
                    levelButton.style.backgroundColor = 'white';
                    levelButton.id = 'levelButton_' + fe_level.id;
                    loc_levels.appendChild(levelButton);

                    // Highlight previously selected level
                    if (loc === fe_loc.id && lvl === fe_level.id) {
                        levelButton.style.backgroundColor = 'yellow';
                    }

                    function level_clicks() {
                        clearElements('prepare_battle_div', 'clear');

                        loc = fe_loc.id;
                        let prev_lvl = lvl;

                        // If any one of check_lastSelections is missing, reset selection elements
                        function check_lastSelections() {
                            lastSelections.forEach(fe_sel => {
                                if (fe_sel.loc !== loc || fe_sel.lvl !== lvl && fe_sel.ene !== ene || fe_sel.cnt !== cnt) {
                                    clearElements('available_enemies', 'clear');
                                    clearElements('enemies_cnt_div', 'clear');
                                    clearElements('prepare_battle_div', 'clear');
                                }
                            });
                        }
                        check_lastSelections();
                        //console.log(json(lastSelections));

                        cnt = 0;
                        lastSelections.forEach(fe_sel => {
                            if (fe_sel.lvl === lvl) {
                                cnt = fe_sel.cnt;
                            }
                        });
                        if (cnt === 0) {
                            clearElements('enemies_cnt_div', 'clear');
                        }

                        // Deselect previous level if it exists
                        if (prev_lvl && prev_lvl !== fe_level.id) {
                            let prevLevelButton = document.getElementById('levelButton_' + prev_lvl);
                            if (prevLevelButton) {
                                prevLevelButton.style.backgroundColor = 'white';
                            }
                        }

                        // Select the new level
                        lvl = fe_level.id;
                        levelButton.style.backgroundColor = 'yellow';
                        levelButton.style.color = 'black';

                        lastSelections.forEach(fe_sel => {
                            if (fe_sel.lvl === lvl && fe_sel.loc === loc) {
                                if (fe_sel.ene) {
                                    ene = fe_sel.ene;
                                }
                            }
                        });
                        //console.log(json(lastSelections));
                        
                        unlock_requirements();

                        function show_unlocked_level() {

                            const e_unlock_messages = document.getElementById('unlock_messages');

                            // Clear any existing messages to ensure only the latest one is displayed
                            e_unlock_messages.innerHTML = '';

                            let newest_location = null;
                            locationsData.forEach(l => {
                                l.levels.forEach(lev => {
                                    let fetch_locMatch = lastUnlockedLevel.id;
                                    if (fetch_locMatch === lev.id) {
                                        newest_location = l.lbl;
                                    }
                                });
                            });

                            if (newest_location && lastUnlockedLevel.id !== lvl) {
                                const new_level_message = document.createElement('div');
                                new_level_message.id = 'new_lvl_' + lastUnlockedLevel.id;
                                new_level_message.style.color = 'lightgreen';
                                new_level_message.innerHTML = `<b>A newer level is unlocked: ${lastUnlockedLevel.lbl} in ${newest_location}</b>`;
                                e_unlock_messages.appendChild(new_level_message); // Add the newest message to the screen
                            }
                        }

                        // Get lastUnlockedLevel
                        async function getData_lastUnlockedLevel() {
                            lastUnlockedLevel = await d.getSlotData(dbState.slot_selected, 'lastUnlockedLevel');
                            show_unlocked_level();
                        }
                        getData_lastUnlockedLevel();

                        // Start battle init
                        const e_locations_status = document.getElementById('locations_status');
                        e_locations_status.innerHTML = `<br>Preparing to attack <b>${fe_loc.lbl}</b>: <b>${fe_level.lbl}<b>`;

                        // Setup encounters
                        //WIP -- need encounterData updated
                        const e_available_enemies = document.getElementById('available_enemies');
                        e_available_enemies.innerHTML = '<br><b>CHOOSE ENEMY:<p></p></b>';
                        //console.log(fe_level.enemies);
                        const level_enemies = fe_level.enemies;
                        level_enemies.forEach(enemy => {
                            //console.log(enemy);
                            // Add enemy buttons
                            const enemy_list_span = create_el('enemy_list_' + enemy.id, 'span', e_available_enemies);
                            const select_ememy_btn = create_el('select_ememy_btn_' + enemy.id, 'button', enemy_list_span);
                            if (select_ememy_btn.id === 'select_ememy_btn_' + ene) {
                                select_ememy_btn.style.backgroundColor = 'yellow';
                            }
                            select_ememy_btn.innerHTML = enemy.lbl;
                            
                            function select_enemy(loc, lvl, enemy) {
                                // Get matching loc/lvl encounter
                                //WIP Using enemy ID random
                                
                                let prev_enemy = ene;

                                let encounter = encounterData.find(e => e.id === 'beginner_0');
                                // Choose random array index of enemyList;
                                let enemyList = encounter.enemy_list;
                                //console.log(enemyList);
                                let encounterCnt = 0;
                                enemyList.forEach(en_enemy => {
                                    if (enemy.id == en_enemy.id) {
                                        ene = en_enemy.id;
                                        cnt = en_enemy.cnt;
                                        encounterCnt = en_enemy.cnt;
                                        //console.log(ene);
                                    }
                                });

                                if (enemy.id === 'random_' + lvl) {
                                    let random_enemy = choose_enemy(enemyList);
                                    //WIP random enemy selections
                                    //ene = random_enemy.id;
                                    //cnt = random_enemy.cnt;
                                    ene = enemy.id;
                                    //cnt = 3;
                                    encounterCnt = 3;
                                }

                                select_ememy_btn.style.backgroundColor = 'yellow';

                                const e_enemy_status = document.getElementById('enemy_status');
                                enemy_status.innerHTML = `<br>Preparing to attack <b>${enemy.lbl}</b>`;

                                ene = enemy.id;

                                // Deselect previous enemy if it exists
                                if (prev_enemy && prev_enemy !== enemy.id) {
                                    let prevEnemyButton = document.getElementById('select_ememy_btn_' + prev_enemy);
                                    if (prevEnemyButton) {
                                        prevEnemyButton.style.backgroundColor = 'white';
                                        clearElements('prepare_battle_div', 'clear')

                                    }
                                }

                                function select_enemy_quantity(selectedCount) {
                                    const buttons = document.querySelectorAll('[id^="enemy_cnt_btn_"]');
                                    buttons.forEach((button, index) => {
                                        button.style.backgroundColor = (index + 1 === selectedCount) ? 'yellow' : 'white';
                                        if (index + 1 === selectedCount) {
                                            cnt = selectedCount;

                                            lastSelections.forEach(fe_sel => {
                                                if (lvl === fe_sel.lvl && fe_sel.loc === loc) {
                                                    fe_sel.ene = ene;
                                                    fe_sel.cnt = cnt;
                                                }
                                            });
                                            
                                            // Clear the prepare_battle_div and recreate the button
                                            const e_prepare_battle_div = document.getElementById('prepare_battle_div');
                                            const e_prepare_battle_btn = document.getElementById('prepare_battle_btn');
                                            
                                            clearElements('prepare_battle_div', 'clear');
                                            
                                            if (cnt !== 0) {
                                                let prepare_battle_btn = create_el('prepare_battle_btn', 'button', e_prepare_battle_div);
                                                prepare_battle_btn.innerHTML = 'START BATTLE HERE';
                                                // Add event listener
                                                prepare_battle_btn.addEventListener('click', () => {
                                                    prepare_battle_action(loc, lvl, ene, cnt);
                                                });
                                            }
                                        }
                                    });
                                }

                                const e_enemies_cnt_div = document.getElementById('enemies_cnt_div');
                                e_enemies_cnt_div.innerHTML = '<br><b>SELECT QUANTITY TO ATTACK:</b><br><br>';

                                for (let i = 1; i <= encounterCnt; i++) {
                                    const enemyCntBtn = create_el('enemy_cnt_btn_' + i + '_' + ene, 'button', e_enemies_cnt_div);
                                    enemyCntBtn.innerHTML = i;
                                    enemyCntBtn.addEventListener('click', () => {
                                        select_enemy_quantity(i);
                                    });

                                    lastSelections.forEach(fe_sel => {
                                    if (lvl === fe_sel.lvl && fe_sel.ene === ene && fe_sel.cnt === i) {
                                            let e_enemy_cnt_btn_cnt = document.getElementById('enemy_cnt_btn_' + i + '_' + ene);
                                            if (e_enemy_cnt_btn_cnt) {
                                                // Autoclick for refresh
                                                e_enemy_cnt_btn_cnt.click();
                                                //console.log('clicked CNT');
                                            }
                                        }
                                    });
                                }

                                if (encounterCnt === 1) {
                                    const e_enemyCntBtn = document.getElementById('enemy_cnt_btn_1');
                                    // Autoclick count if only 1 cnt for encounter
                                    if (e_enemyCntBtn) {
                                        e_enemyCntBtn.click();
                                    }
                                }
                            }
                            
                            select_ememy_btn.addEventListener('click', () => {
                                select_enemy(loc, lvl, enemy);
                            });

                            lastSelections.forEach(fe_sel => {
                                if (fe_sel.lvl === lvl && fe_sel.loc === loc && fe_sel.ene === enemy.id) {
                                    let select_ememy_btn_ene = document.getElementById('select_ememy_btn_' + fe_sel.ene);
                                    if (select_ememy_btn_ene) {
                                        // Autoclick for refresh
                                        select_ememy_btn_ene.click();
                                        //console.log('clicked ENE');
                                    }
                                }
                            });
                        });

                        function prepare_battle_action(f_loc, f_lvl, f_ene, f_cnt) {
                            // Simulate kills
                            fe_level.kills += 1;
                            
                            function check_next_req() {
                                let new_location = null; // Tracks the current unlock operation

                                let next_req = fe_level.next_req;
                                let killsReq = next_req.find(r => r.id === 'kills');

                                // Check if the kill requirement has been met
                                if (killsReq && fe_level.kills >= killsReq.cnt) {
                                    killsReq.req_met = true;
                                }

                                if (killsReq?.req_met) {
                                    fe_level.next_unlock.forEach(unlock => {
                                        locationsData.forEach(loc => {
                                            loc.levels.forEach(lev => {
                                                if (unlock.id === lev.id && !lev.unlocked) {
                                                    lev.unlocked = true; // Mark level as unlocked
                                                    new_location = lev; // Track the newest unlocked level
                                                }
                                            });
                                        });

                                        // If the unlocked level is the first in its location, unlock the location
                                        if (new_location) {
                                            let location = locationsData.find(loc => loc.levels[0].id === new_location.id);
                                            if (location && location.levels[0].unlocked) {
                                                location.unlocked = true;
                                                // Update locations
                                                let location_id = location.id;
                                                display_locations();
                                                // Autoclick for refresh
                                                const e_loc = document.getElementById('location_div_' + location_id);
                                                if (e_loc) {
                                                    e_loc.click();
                                                }
                                                
                                            }
                                        }
                                    });

                                    // Update the global variable with the newest unlocked level
                                    if (new_location) {
                                        lastUnlockedLevel = new_location;
                                        // Save to database
                                        async function updateData() {
                                            await d.updateSlotData(dbState.slot_selected, 'lastUnlockedLevel', lastUnlockedLevel);
                                        }
                                        updateData();
                                    }
                                }
                            }

                            // Update if new requirements met
                            check_next_req();

                            // Refresh UI
                            display_locations();

                            // Update requirements
                            unlock_requirements();

                            // Save to database
                            async function updateData() {
                                await d.updateSlotData(dbState.slot_selected, 'locationsData', locationsData);
                            }
                            updateData();

                            // Autoclick for refresh
                            update_for_nextUnlock(loc, lvl);

//WIP *** Ready for next steps...
// Before start of battle check
console.log(`SUBMIT: Location: ${loc} / Level: ${lvl} / Enemy: ${ene} / Quantity: ${cnt}`);
// Store selections
                            lastSelections.forEach(fe_sel => {
                                if (fe_sel.lvl === lvl && fe_sel.loc === loc) {
                                    fe_sel.ene = ene;
                                    let select_ememy_btn_ene = document.getElementById('select_ememy_btn_' + fe_sel.ene);
                                    if (select_ememy_btn_ene) {
                                        // Autoclick for refresh
                                        select_ememy_btn_ene.click();
                                        //console.log('clicked ENE on SUBMIT');
                                    }
                                }
                            });
                            //console.log(json(lastSelections));
    
                            // Assign latest loc, lvl, ene, cnt
                            lastBattle[0].loc = loc;
                            lastBattle[0].lvl = lvl;
                            lastBattle[0].ene = ene;
                            lastBattle[0].cnt = cnt;

                        } // end prepare_battle_action()
                    }

                    levelButton.addEventListener('click', level_clicks);

                });

                // Add green border to clicked element
                e_loc.classList.remove('img_border_off');
                e_loc.classList.add('img_border_on');
            }

            e_loc.addEventListener('click', location_clicks);
        });
    } // end display_locations()
    display_locations();

    let prev_location = document.getElementById('location_div_' + lastBattle[0].loc);
    if (prev_location) prev_location.click();
    let prev_level = document.getElementById('levelButton_' + lastBattle[0].lvl);
    if (prev_level) prev_level.click();

    let spacer = document.createElement('div');
    e_tab_player_battle.appendChild(spacer);
    spacer.classList.add('location_box_style');
    spacer.style.paddingBottom = '50px';
}

// FOR WHEN BATTLE STARTS
// NEED ENEMY SELECTIONS FIRST

// Disable location and level selections
/*function lock_elements() {
    // Remove all other loc/lvl elements
    // Refresh array
    filteredUnlocked_loc = locationsData.filter(l => l.unlocked === true);
    filteredUnlocked_loc.forEach(item => {
        if (item.id !== tempLoc) {
            clearElements('location_div_' + item.id, 'remove');
        } else {
            let e_location_div = document.getElementById('location_div_' + item.id);
            if (e_location_div) {
                e_location_div.style.width = '150px';
                e_location_div.classList.add('img_border_off');
            }
        }
        //clearElements('levels', 'remove');
    });
}
lock_elements();*/

export function reset_battle() {
/*
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


*/
    // Clear location elements
    update_locations(0, 0);
}

export async function fetch_playerStats(opt) {
    let playerStats = characterData.find(d => d.id === 'player_stats');
    let stats = await update_battleStats();

    playerStats.max_health = await stats.calc_totalHealth();
    playerStats.max_resource = await stats.calc_resource_melee();

    if (opt === 'new') {
        // Reset current health
        playerStats.cur_health = playerStats.max_health;
        // Reset current resource
        playerStats.cur_resource = playerStats.max_resource;
    }
}

function locReqMet(locationsData) {
    let killsData = locationsData.map(location => ({
        loc: location.loc,
        lvl: location.lvl,
        kill_req_met: false
    }));

    locationsData.forEach((location, index) => {
        const kills_req = location.kills_req;
        const kills = location.kills;

        if (kills >= kills_req && index + 1 < locationsData.length) {
            killsData[index + 1].kill_req_met = true; // Unlock next level
        }

        if (index === 0 && kills >= kills_req) {
            killsData[index].kill_req_met = true;
        }
    });

    //console.log('Updated killsData:');
    //console.log(killsData);

    return killsData;
}



















//OLD BACKUP
/*

let kills_added_test = false;
export async function update_locations(f_location, f_level) {

    let e_tab_player_battle = document.getElementById('tab_player_battle');
    if (e_tab_player_battle) {
        e_tab_player_battle.innerHTML = '';
    }

    // Track locations/levels selected, both default to 0
    let loc = 0;
    let lvl = 0;
    // Assign levels if specified
    if (f_location) {
      loc = f_location;
    }
    if (f_level) {
      lvl = f_level;
    }

    // Load location array data
    const locationsData = await d.getSlotData(dbState.slot_selected, 'locationsData');

    if (!kills_added_test) {
    locationsData.forEach(location => {
        if (location.loc === 0) {
            location.kills = 3; // Simulate kills for the first location.
            //console.log(location);
        }
        if (location.loc === 1 && location.lvl === 1) {
            location.kills = 3;
        }
    });
    await d.updateSlotData(dbState.slot_selected, 'locationsData', locationsData);
    //let result = locReqMet(locationsData);
    //console.log(result);
    kills_added_test = true;
}
//

    // For choosing locations
    const location_container = create_el('location_container', 'div', e_tab_player_battle);
    location_container.classList.add('location_box_style');
    location_container.innerHTML = '<b>CHOOSE BATTLE LOCATION:<p></p></b>';

    // Once battle starts
    const battle_ui_container = create_el('battle_ui_container', 'div', e_tab_player_battle);
    battle_ui_container.style.backgroundColor = 'black';

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
    const player_turn_attack_container = create_el('player_turn_attack_container', 'div', location_container);
    const player_turn_attack = create_el('player_turn_attack', 'button', player_turn_attack_container);
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
    const change_location_button = create_el('change_location_button', 'button', location_container);
    change_location_button.innerHTML = '<b><font style="font-size: 24px;"> CHANGE LOCATION </font></b>';
    change_location_button.classList.add('location_box_style');
    change_location_button.classList.add('center');
    change_location_button.style.display = 'none';

    // Create and append location buttons
    const max_location = Math.max(...locationsData.map(loc => loc.loc));
    const starting_loc = loc;

    for (let i = starting_loc; i <= max_location; i++) {
        let loc_lvl1 = locationsData.find(l => l.loc === i && l.lvl === 1);
        let e_loc = document.createElement('div');
        e_loc.id = 'location_div_' + i;
        // Select current location/level if present in function call
        if (loc >= 0 && lvl >= 1) {
            let fetched_loc = document.getElementById('location_div_' + loc);
            if (fetched_loc) {
                fetched_loc.classList.remove('img_border_off');
                fetched_loc.classList.add('img_border_on');
            }
        }
        e_loc.classList.remove('img_border_on');
        e_loc.classList.add('img_border_off');
        const killsData = locReqMet(locationsData); // Recalculate killsData dynamically.

        let unlocked = isAnyLocationUnlocked(locationsData, killsData, i);
        if (loc_lvl1 && unlocked) {
            locations.appendChild(e_loc);
            e_loc.innerHTML = loc_lvl1.lbl;
            let loc_img = document.createElement('img');
            loc_img.id = 'loc_img_' + loc_lvl1.loc;
            e_loc.appendChild(loc_img);
            loc_img.style.width = '150px';
            loc_img.style.height = 'auto';
            loc_img.src = loc_lvl1.img;
            let loc_levels = document.createElement('div');
            levels.appendChild(loc_levels);
            loc_levels.id = 'loc_levels';
            loc_levels.style.overflow = 'auto';
            e_loc.addEventListener('click', () => {
                // Clear all green borders
                for (let all = starting_loc; all <= max_location; all++) {
                    let DOM_all_loc_div = document.getElementById('location_div_' + all);
                    if (DOM_all_loc_div) {
                        DOM_all_loc_div.classList.remove('img_border_on');
                        DOM_all_loc_div.classList.add('img_border_off');
                    }
                }
                // Add green border to clicked element
                e_loc.classList.remove('img_border_off');
                e_loc.classList.add('img_border_on');
                selectLocation(locationsData, killsData, i, lvl);
                // To always keep highlightted level selected after clicking another location and back
                let level_btn = document.getElementById('levelButton_' + lvl);
                if (level_btn && loc === i) {
                    level_btn.style.backgroundColor = 'yellow';
                }
            });
        }
    }
}

// Twin unlock check functions
function isLocationFullyUnlocked(locationsData, killsData, f_loc) {
    return locationsData
        .filter(location => location.loc === f_loc)
        .every((location, index) => killsData[index]?.kill_req_met || false); // Ensure default is false.
}
function isAnyLocationUnlocked(locationsData, killsData, f_loc) {
    return locationsData
        .map((location, index) => ({
            ...location,
            kill_req_met: killsData[index]?.kill_req_met || false

        }))
        .filter(location => location.loc === f_loc) // Filter levels by location.
        .some(location => location.kill_req_met); // Check if any level in the location is unlocked.
}
// USAGE
/*/


//CONTINUE /*
/*


const max_location = Math.max(...locationsData.map(loc => loc.loc));
for (let i = 0; i <= max_location; i++) { // Include max_location in the loop.
    // Ensure killsData is updated before checking fully unlocked and any unlocked.
    const killsData = locReqMet(locationsData); // Recalculate killsData dynamically.

    const fullyUnlocked = isLocationFullyUnlocked(i, killsData);
    console.log(`Location ${i} fully unlocked: ${fullyUnlocked}`);

    const locationUnlocked = isAnyLocationUnlocked(i, killsData);
    console.log(`Location ${i} has any levels unlocked: ${locationUnlocked}`);
}
/*/

export function selectLocation(locationsData, killsData, loc, lvl) {
try {
//DEBUG

    const levelsContainer = document.getElementById('loc_levels');

    // Clear previous levels if a new location is selected
    levelsContainer.innerHTML = '';

    function getUnlockedLevels(locationsData, killsData, location) {
        const filteredLevels = locationsData.filter((loc, index) => {
            //console.log('Checking level:' + loc + 'Against killsData:' + killsData[index]);
            return loc.loc === location && killsData[index].kill_req_met;  // Use killsData to check if it's unlocked
        });
        return filteredLevels;  // Return the filtered levels
    }
    // Filter levels based on the selected location and met kill requirements
    const filteredLevels = getUnlockedLevels(locationsData, killsData, loc);

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

        if (loc === level.loc && lvl === level.lvl) {
            selectLevel(locationsData, killsData, level.loc, level.lbl, level.lvl, level.kills);
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
                selectLevel(locationsData, killsData, level.loc, level.lbl, level.lvl, level.kills);
            });
        }
        levelsContainer.appendChild(levelButton);
    });


//DEBUG
} catch (error) {
    console.error('ERROR:' + error);
    console.error('STACK:' + error.stack)
}



}

export function selectLevel(locationsData, killsData, loc, location, lvl, kills) {

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

    start_battle(locationsData, killsData, loc, lvl);
}

/*export function getMaxLevelsByLocation(locationsData) {
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
}*/
// Usage
// const highestLevels = getMaxLevelsByLocation(locationsData);
// console.log(highestLevels); // [8, 4, 3] - This will be the highest level for each location in order

//CONTINUE /*
/*


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
    update_locations(0, 0);
}

// WIP2
export async function start_battle(locationsData, killsData, loc, lvl) {

    // Data
    //OLD let d_player_character = saveData[1].savedCharacterData[0];
    const d_savedCharacterData = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
    const d_player_character = d_savedCharacterData[0];

    let playerStats = characterData.find(d => d.id === 'player_stats');

    await fetch_playerStats('new');

    // Main battle container
    let battle_section_container = document.getElementById('tab_player_battle');

    // All battle specific elements
    const all_battle_ui_elements = create_el('all_battle_ui_elements', 'div', battle_section_container);

    // Clear all Elements
    let e_battle_ui_container = document.getElementById('battle_ui_container');
    if (e_battle_ui_container) {
        e_battle_ui_container.innerHTML = '';
    }

    // Parent for ui, resets each update
    const battle_ui_container = create_el('battle_ui_container', 'div', all_battle_ui_elements);
    battle_ui_container.classList.add('location_box_style');

    // Spacer
    const spacer_player_combat_status = create_el('spacer_player_combat_status', 'div', all_battle_ui_elements);
    spacer_player_combat_status.style.height = '17px';
    spacer_player_combat_status.style.backgroundColor = 'black';
    spacer_player_combat_status.style.height = '17px';
    // Toggle combat on
    //spacer_player_combat_status.style.height = '5px';

    // Spacer
    const player_combat_status = create_el('player_combat_status', 'span', all_battle_ui_elements);
    player_combat_status.style.textAlign = 'center';
    player_combat_status.style.fontSize = '12px';
    player_combat_status.style.width = '100%';
    player_combat_status.style.display = 'none';
    // Toggle combat on
    //player_combat_status.style.display = 'block';
    player_combat_status.innerHTML = '<b><span style="background-color:red;">&nbsp;&nbsp; IN COMBAT &nbsp;&nbsp;</span></b>';

    // Place battle_ui_container2/3 here
    const player_battle_status_bars = create_el('player_battle_status_bars', 'div', all_battle_ui_elements);
    player_battle_status_bars.style.width = "100%";
    player_battle_status_bars.style.border = 'solid 5px #333';
    // Toggle combat on
    //player_battle_status_bars.style.border = 'solid 5px red';

    // Player labels
    // Add to group player_battle_status_bars
    const player_name_level = create_el('player_name_level', 'div', player_battle_status_bars);
    player_name_level.classList.add('bar_label_container');

    const player_name = create_el('player_name', 'span', player_name_level);
    player_name.classList.add('bar_left_label');
    player_name.innerHTML = d_player_character.char_name;

    const player_level = create_el('player_level', 'span', player_name_level);
    player_level.classList.add('bar_right_label');
    player_level.innerHTML = 'Level: ' + d_player_character.char_level;

    // Player health
    // Add to group player_battle_status_bars
    const battle_ui_container2 = create_el('battle_ui_container2', 'div', player_battle_status_bars);

    // Create player health container
    const player_health_container = create_el('player_health_container', 'div', battle_ui_container2);
    player_health_container.classList.add('bar_with_border_container');

    // Create the player_health bar fill (blue bar)
    const player_health_bar_fill = create_el('player_health_bar_fill', 'div', player_health_container);
    player_health_bar_fill.classList.add('bar_with_border_fill');
    player_health_bar_fill.style.backgroundColor = 'green';
    player_health_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
    // Fill calculated below

    const player_current_health_text = create_el('player_current_health_text', 'span', player_health_container);
    player_current_health_text.classList.add('bar_with_border_text');
    player_current_health_text.innerHTML = 'Player Health: <span id="e_char_health">' + playerStats.cur_health + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_health

    const player_maximum_health = create_el('player_maximum_health', 'span', player_current_health_text);
    player_maximum_health.innerHTML = playerStats.max_health;

    const player_current_health_percent = create_el('player_current_health_percent', 'span', player_health_container);
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
    const battle_ui_container3 = create_el('battle_ui_container3', 'div', player_battle_status_bars);

    // Create player resource container
    const player_resource_container = create_el('player_resource_container', 'div', battle_ui_container3);
    player_resource_container.classList.add('bar_with_border_container');

    // Create the player_resource bar fill (yellow bar)
    const player_resource_bar_fill = create_el('player_resource_bar_fill', 'div', player_resource_container);
    player_resource_bar_fill.classList.add('bar_with_border_fill');
    player_resource_bar_fill.style.backgroundColor = '#6E6800';
    player_resource_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
    // Fill calculated below

    const player_current_resource_text = create_el('player_current_resource_text', 'span', player_resource_container);
    player_current_resource_text.classList.add('bar_with_border_text');
    player_current_resource_text.innerHTML = 'Player Resource: <span id="e_char_resource">' + playerStats.cur_resource + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_resource

    const player_maximum_resource = create_el('player_maximum_resource', 'span', player_current_resource_text);
    player_maximum_resource.innerHTML = playerStats.max_resource;

    const player_current_resource_percent = create_el('player_current_resource_percent', 'span', player_resource_container);
    player_current_resource_percent.classList.add('bar_with_border_percent');
    let d_player_resource_percent = (playerStats.cur_resource / playerStats.max_resource) * 100;
    d_player_resource_percent = Math.round(d_player_resource_percent * 10) / 10;
    player_current_resource_percent.innerHTML = d_player_resource_percent + '%';

    // Display bar width fill
    player_resource_bar_fill.style.width = d_player_resource_percent + '%';

    // Create the experience container
    const experience_container = create_el('experience_container', 'div', player_battle_status_bars);
    experience_container.classList.add('bar_with_border_container');

    // Create the experience bar fill (blue bar)
    const experience_bar_fill = create_el('experience_bar_fill', 'div', experience_container);
    experience_bar_fill.classList.add('bar_with_border_fill');
    experience_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect

    const experience_text = create_el('experience_text', 'span', experience_container);
    experience_text.classList.add('bar_with_border_text');
    experience_text.innerHTML = 'Experience: <span id="e_char_exp">' + d_player_character.char_exp + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_exp

    const experience_percent = create_el('experience_percent', 'span', experience_container);
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

    const experience_to_level = create_el('experience_to_level', 'span', experience_text);
    experience_to_level.innerHTML = d_player_character.char_exp_to_level;

    await d.updateSlotData(dbState.slot_selected, 'savedCharacterData', d_savedCharacterData);

    // Initial display
    await update_xp();

// WIP Need update_resource

    // Setup battle encounter
    const battle_verses_box = create_el('battle_verses_box', 'div', all_battle_ui_elements);
    battle_verses_box.innerHTML = '<p style="text-align:center;font-size:16px;color:red;" id="player_to_enemy_btn">[ TARGETING ]</p>';

// WIP need multiple enemies

    // Place enemy_ui_containers here
    const enemy_battle_status_bars = create_el('enemy_battle_status_bars', 'div', all_battle_ui_elements);
    enemy_battle_status_bars.style.width = "100%";
    enemy_battle_status_bars.style.border = 'solid 5px #333';

    // Enemy labels
    // Add to group enemy_battle_status_bars
    const enemy_name_level = create_el('enemy_name_level', 'div', enemy_battle_status_bars);
    enemy_name_level.style.backgroundColor = '#333';
    enemy_name_level.style.fontSize = '18px';
    enemy_name_level.style.color = '#00FFFF';
    enemy_name_level.style.padding = '5px';

    // Enemy data
    let encounter = null;
    let random_enemy = null;

console.log(loc + ' / ' + lvl);

    // Choose encounter & enemy
    // First encounter
    if (loc === 0 && lvl === 1) {
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
        let enemy_loc = loc;
        let enemy_lvl = lvl;

        // Get matching loc/lvl encounter
        encounter = encounterData.find(e => e.id === 'group_lvl_' + enemy_lvl && e.loc === enemy_loc && e.lvl === enemy_lvl);

        // Choose random array index of enemyList;
        let enemyList = encounter.enemy_list;
        random_enemy = choose_enemy(enemyList);

        // Mark enemy alive
        random_enemy.dead = false;
        trackingData[0].current_enemy = random_enemy.id;

        //// WIP more array data needed
    }

    if (encounter && random_enemy) {

        const enemy_name = create_el('enemy_name', 'span', enemy_name_level);
        enemy_name.innerHTML = random_enemy.lbl;
        enemy_name.style.display = 'inline-block';
        enemy_name.style.width = '50%';

        const enemy_level = create_el('enemy_level', 'span', enemy_name_level);
        enemy_level.innerHTML = 'Level: ' + random_enemy.lvl;
        enemy_level.style.display = 'inline-block';
        enemy_level.style.width = '50%';
        enemy_level.style.textAlign = 'right';

        // Enemy health
        // Add to group player_battle_status_bars
        const battle_ui_enemy_container = create_el('battle_ui_enemy_container', 'div', enemy_battle_status_bars);

        // Create player health container
        const enemy_health_container = create_el('enemy_health_container', 'div', battle_ui_enemy_container);
        enemy_health_container.classList.add('bar_with_border_container');

        // Create the player_health bar fill (blue bar)
        const enemy_health_bar_fill = create_el('enemy_health_bar_fill', 'div', enemy_health_container);
        enemy_health_bar_fill.classList.add('bar_with_border_fill');
        enemy_health_bar_fill.style.backgroundColor = 'green';
        enemy_health_bar_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
        // Fill calculated below

        // Get random enemy max health value
        encounter.max_health = randomize(encounter.hp_min, encounter.hp_max, 1);
        encounter.cur_health = encounter.max_health;

        const enemy_current_health_text = create_el('enemy_current_health_text', 'span', enemy_health_container);
        enemy_current_health_text.classList.add('bar_with_border_text');
        enemy_current_health_text.innerHTML = 'Enemy Health: <span id="e_enemy_health">' + encounter.cur_health + '</span>&nbsp;/&nbsp;';
        // Inserts e_enemy_health

        const enemy_maximum_health = create_el('enemy_maximum_health', 'span', enemy_current_health_text);
        enemy_maximum_health.innerHTML = encounter.max_health;

        const enemy_current_health_percent = create_el('enemy_current_health_percent', 'span', enemy_health_container);
        enemy_current_health_percent.classList.add('bar_with_border_percent');
        let d_enemy_health_percent = (encounter.cur_health / encounter.max_health) * 100;
        d_enemy_health_percent = Math.round(d_enemy_health_percent * 10) / 10;
        enemy_current_health_percent.innerHTML = d_enemy_health_percent + '%';

        // Display bar width fill
        enemy_health_bar_fill.style.width = d_enemy_health_percent + '%';

        // Insert combat log
        const combat_log_container = create_el('combat_log_container', 'div', all_battle_ui_elements);
    }

    toggleElement('h', 'new_battle_button');
    toggleElement('s', 'attack_box_button');

    // Fetch or create attack button
    let e_attack_box_button = document.getElementById('attack_box_button');
    if (e_attack_box_button) {
        e_attack_box_button.addEventListener('click', () => {
            toggleElement('s', 'change_location_button');
            attack_box_button(locationsData, killsData, e_attack_box_button, random_enemy, encounter);
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
            attack_box_button(locationsData, killsData, e_attack_box_button, random_enemy, encounter);
        });
    }

    let e_change_location = document.getElementById('change_location_button');
    e_change_location.addEventListener('click', () => {
        toggleElement('h', 'change_location_button');
        // Reset battle ui elements
        reset_battle();
    });

    if (trackingData[0].next_attack) {
        attack_box_button(locationsData, killsData, e_attack_box_button, random_enemy, encounter);
    }
}

// Clicks for attack_box_button
function EL_player_turn_attack(locationsData, killsData, encounter, enemy) {
    // Start combat
    if (!encounter.in_combat) {
        encounter.in_combat = true;
        toggle_combat_status();
        let e_player_to_enemy_btn = document.getElementById('player_to_enemy_btn');
        e_player_to_enemy_btn.innerHTML = '[ ATTACKING ]';
        // Hide change_location_button
        let change_location_button = document.getElementById('change_location_button');
        if (change_location_button) { change_location_button.style.display = 'none'; }
        player_attack(locationsData, killsData, enemy, encounter);
    } else {
        // In combat clicks (e_player_turn_attack)
        player_attack(locationsData, killsData, enemy, encounter);
    }
}

let ELHandler_player_turn_attack = null;
export function attack_box_button(locationsData, killsData, elementId, enemy, encounter) {

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
            EL_player_turn_attack(locationsData, killsData, encounter, enemy);
        };
        e_player_turn_attack.addEventListener('click', ELHandler_player_turn_attack);

    }

    if (trackingData[0].next_attack) {
        EL_player_turn_attack(locationsData, killsData, encounter, enemy);
    }

}

let ELHandler_player_next_turn = null;
export async function player_attack(locationsData, killsData, enemy, encounter) {

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

            locationsData.forEach((item, index) => {
                if (locationsData[index].loc === trackingData[0].loc && locationsData[index].lvl === trackingData[0].lvl) {
                    item.kills += 1;
                    async function updateKills() {
                        await d.updateSlotData(dbState.slot_selected, 'locationsData', locationsData);
                    }
                    updateKills();
                }
            });
        }
// COMBAT LOG

        // Append combat log entries
        encounter.log_cnt++;

        if (!trackingData[0].combat_log_created) {
            let e_combat_log_container = document.getElementById('combat_log_container');
            if (e_combat_log_container) { e_combat_log_container.innerHTML = ''; }
            const combat_log_title = create_el('combat_log_title', 'div', e_combat_log_container);
            combat_log_title.innerHTML = '<p style="font-size: 24px; color: white;">COMBAT LOG</p>';
            const combat_log = create_el('combat_log', 'div', e_combat_log_container);
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
            const d_savedCharacterData2 = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
            const d_player_character2 = d_savedCharacterData2[0];

            if (d_player_character2.char_level > 1 && d_player_character2.char_level !== current_char_level) {
                new_div.innerHTML += '<p><img src="media/combatlog/xp.png" height="24" width="24"><span style="color:#34aaff;font-weight:bold;">&nbsp;Congratulations! You have reached level ' + d_player_character2.char_level + '!';
                add_message('Congratulations! You have reached level ' + d_player_character2.char_level + '!');
            }

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

*/

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
