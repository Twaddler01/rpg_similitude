// character.js

// BUG first attack needs update
// of stats due to level stat boost
// specifically for armor and hit  etc

// import arrays
import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, saveData, trackingData } from './data.js';

// general functions needed
import * as gf from './general_functions.js';
import { create_el } from './functions.js';
import { removeItemTooltip, createItemElements } from './inventory.js';
import * as e from './equipment.js';
// Run first to initialize array
export function update_character_array() {
    
    // Get equipment ids
    let equippedItems = saveData[3].equippedData;

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
    
    // Add stats for equipmemt from equipped items
    update_equipment();
    // Stats only
    update_character_stats(false);
}

// WIP: rename to update_equipment
export function update_character() {

    let e_tab_player_equipment = document.getElementById('tab_player_equipment');

    // Reset elements
    if (e_tab_player_equipment) {
        e_tab_player_equipment.innerHTML = '';
    }

    let charData = saveData[1].savedCharacterData[0];

    let char_equipment = document.createElement('div');
    e_tab_player_equipment.appendChild(char_equipment);
    char_equipment.innerHTML += '<b>EQUIPPED ITEMS</b><br><br>';
    
    // Equipment image with slots around image
    create_el('char_equipment_container', 'div', e_tab_player_equipment);
    char_equipment_container.style.height = '700px';
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
    char_equipment_image.src = 'media/char_shadow.png';
    char_equipment_image.style.height = '240px';
    char_equipment_image.style.width = '120px';
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
    //update_equipment();
    // Stats only
    //update_character_stats(false);
}

// moving to e.fetch_playerStats
export function update_character_stats(updateElements) {

    if (updateElements) {
        // Reset elements
        let e_tab_player_stats = document.getElementById('tab_player_stats');
        if (e_tab_player_stats) {
            e_tab_player_stats.innerHTML = '';
        }

        create_el('stats_info', 'div', e_tab_player_stats);
        stats_info.innerHTML = '<p><b>CURRENT STATS:</b></p>';

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
                // Based on player level (depr)
                base_level_stat = stat.lvl_amt;
                //base_level_stat *= d_player_character.char_level;
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

// **********
// replaced by fetch_playerStats




            if (stat.lvl_mod) {
                // Adjust to equipment amount 
                equip_stat_amt = stat.amt - (stat.id === 'armor' ? 100 : 10);
                // Based on player level (depr)
                base_level_stat = stat.lvl_amt;
                //base_level_stat *= d_player_character.char_level;
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
                        
let fetch_battleStats = e.update_battleStats(player_level, saveData[3].equippedData, player_level);
let [pwr_weapon_min, pwr_weapon_max] = fetch_battleStats.calc_meleeAttack();
                        
                        //let [pwr_weapon_min, pwr_weapon_max] = calculate_weapon_damage(1, stat.amt, current_weapon_dmg_min.amt, current_weapon_dmg_max.amt);
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
let fetch_battleStats = e.update_battleStats(player_level, saveData[3].equippedData, player_level);
let [pwr_weapon_min, pwr_weapon_max] = fetch_battleStats.calc_meleeAttack();
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
/*export function calculate_weapon_damage(itemLevel, statPower, minDmg, maxDmg) {

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
}*/

// WIP REPLACE update_battleStats from equipment.js
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