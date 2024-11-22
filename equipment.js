// equipment.js

// stats related to player equipment/level

import { itemData, characterData } from './data.js';
import { create_el } from './functions.js';
import { dbState } from './main.js';
import * as d from './database.js';

// temporary
let trackingData = [{}];

const battleStats = [
    { id: 'armor', type: 'static', amt: 0, label: 'Armor: ', base: 100 },
    { id: 'strength', type: 'reg', amt: 0, label: 'Strength: ', base: 1 },
    { id: 'intelligence', type: 'reg', amt: 0, label: 'Intelligence: ', base: 1 },
    { id: 'dexterity', type: 'reg', amt: 0, label: 'Dexterity: ', base: 1 },
    { id: 'constitution', type: 'reg', amt: 0, label: 'Constitution: ', base: 1 },
    { id: 'agility', type: 'reg', amt: 0, label: 'Agility: ', base: 1 },
    { id: 'wisdom', type: 'reg', amt: 0, label: 'Wisdom: ', base: 1 },
    { id: 'power', type: 'static', amt: 0, label: 'Power: ', base: 0, combines: true },
    { id: 'hitChance', type: 'static', amt: 0, label: 'Hit Chance: ', base: 0.9, combines: true },
    { id: 'criticalStrikeChance_melee', type: 'static', amt: 0, label: 'Melee Critical Strike Chance: ', base: 0.05, combines: true },
    { id: 'criticalStrikeChance_magic', type: 'static', amt: 0, label: 'Magic Critical Strike Chance: ', base: 0.05, combines: true },
    { id: 'dmg_min', type: 'static', amt: 0, label: 'Total Attack Minimum: ', base: 1.2, dmg: true },
    { id: 'dmg_max', type: 'static', amt: 0, label: 'Total Attack Maximum: ', base: 1.6, dmg: true },
];

const statDescriptions = [
    { id: 'armor', label: 'Armor', type: 'desc', def: 'Reduces damage received by enemies. Formula for mitigation is enemy damage * (1.2 - (ln(total armor) / 12)). This effectively scales armor to have a less increasing effect the greater its amount.' },
    { id: 'strength', label: 'Strength', type: 'desc', def: 'Increases melee damage dealt by 0.1% per point and total energy by both 0.1 per base level amount and 1 per equipment bonus point.' },
    { id: 'intelligence', label: 'Intelligence', type: 'desc', def: 'Increases magic damage dealt by 0.1% and total mana by 10 per point.' },
    { id: 'dexterity', label: 'Dexterity', type: 'desc', def: 'The base probability an attack will not miss against enemies. Against higher level enemies, base hit chance decreases to 85% (without equipment benefits) for 1 level above, and decreases a further 5% for each additional enemy level above the player. For example, the base hit chance for an enemy 5 levels higher than you will be 90% - (5% x 5) or 65% total.' },
    { id: 'constitution', label: 'Constitution', type: 'desc', def: 'Increases total maximum health by 10 per point.' },
    { id: 'agility', label: 'Agility', type: 'desc', def: 'Increases melee critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
    { id: 'wisdom', label: 'Wisdom', type: 'desc', def: 'Increases magic critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
    { id: 'power', label: 'Power', type: 'desc', def: 'Increases both attack damage minimum and maximum per turn.' },
    { id: 'attackMinimum', label: 'Attack Minimum', type: 'desc', def: 'Minimum damage caused for each hit per turn.' },
    { id: 'attackMaximum', label: 'Attack Maximum', type: 'desc', def: 'Maximim damage caused for each hit per turn.' },
    { id: 'hitChance', label: 'Hit Chance', type: 'desc', def: 'The probability an attack will cause damage or miss. 100% hit chance guarantees a hit if enemy level is less than or equal to player&apos;s current level. Hit chance decreases for each enemy level above the player&apos;s level and increases for each enemy level below the player&apos;s level.' },
    { id: 'criticalStrikeChance', label: 'Critical Strike Chance', type: 'desc', def: 'The probability a successful attack is critical. Critical strikes cause double the regular damage.' },
];

// WIP inventory call for update_equipment() needs updating for EQUIPS, etc

// Stat modifications
// Updates for battles and equipmemt
export async function update_battleStats(eLevel) {

    // Player data
    //OLD let d_player_character = saveData[1].savedCharacterData[0];
    const d_savedCharacterData = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
    const d_player_character = d_savedCharacterData[0];

    //OLD let pLevel = d_player_character.char_level;
    const pLevel = await d_player_character.char_level;

    // Equipment
    //OLD let pEquipped = saveData[3].equippedData;
    let pEquipped = await d.getSlotData(dbState.slot_selected, 'equippedData');

    // Enemy level = char_level if not specified
    if (!eLevel) {
        eLevel = pLevel;
    }

    // Reset stats
    battleStats.forEach(stat => {
        // Only 'reg' stats scale with level
        if (stat.type === 'reg') {
            stat.amt = stat.base * pLevel;
        } else {
            // Weapon damage only
            if (stat.dmg === true) {
                stat.amt = 0;
            // Other static amounts
            } else {
                stat.amt = stat.base;
            }
        }
    });
    pEquipped.forEach(item => {
        let d_itemData = itemData.find(i => i.id === item.equipped);

        if (d_itemData) {
            const stat_gains = d_itemData.gains;
            // Calculate total stats equipped
            battleStats.forEach(stat => {
                stat_gains.forEach(equip_stat => {
                    if (equip_stat.stat === stat.id) {
                        stat.amt += equip_stat.amt;
                    }
                });
            });
        }
    });

// PLAYER ARMOR DAMAGE REDUCTION
    function calc_armorMitigation() {
        let armor = battleStats.find(s => s.id === 'armor');
        let base_armorMit = armor.base;

        let total_armor = base_armorMit + armor.amt;

        // Multply enemy damage by dmg_reduction -- see etc/formulas.txt for guide
        let dmg_mit_armor = 1.2 - (Math.log(total_armor) / 12);
        dmg_mit_armor = Math.round(dmg_mit_armor * 1000) / 1000;

// formula for armor dmg reduction
/*let armor = 50;
for (let lvl = 1; lvl <= 100; lvl++) {
    armor += 50;
    let dmg_reduce = 1.2 - (Math.log(armor)/12);
    dmg_reduce = Math.round(dmg_reduce * 1000) / 1000;
    console.log('Level: ' + lvl + ' / ' + armor + ': ' + dmg_reduce);
}*/

        return dmg_mit_armor;
    }

// PLAYER HEALTH -- constitution
    function calc_totalHealth() {
        let constitution = battleStats.find(s => s.id === 'constitution');
        let base_health = 100;

        let total_health = (constitution.amt * 10) + base_health;

        return total_health;
    }

// PLAYER HIT CHANCE -- hitChance, dexterity
    function calc_hitChance() {
        let hitChance = battleStats.find(s => s.id === 'hitChance');
        let base_hitChance = hitChance.base; // 0.9

        // Calculate hit chance with equipmemt
        let dexterity = battleStats.find(s => s.id === 'dexterity');
        // Left as decimal
        let calc_dexterity = dexterity.amt * 0.001;
        calc_dexterity += hitChance.amt;

        let enemyLevel_diff = eLevel - pLevel;

        // No difference in level
        let calculated_hitChance = calc_dexterity;

        // If enemy is higher or lower level
        if (enemyLevel_diff > 0) {
            calculated_hitChance -= (0.05 * enemyLevel_diff);
        } else if (enemyLevel_diff < 0) {
            // 2.5% increase hit for lower enemy levels
            calculated_hitChance += (0.025 * -enemyLevel_diff);
            calculated_hitChance = Math.min(calculated_hitChance, 1);
        }

        calculated_hitChance = Math.round(calculated_hitChance * 1000) / 1000;
        return calculated_hitChance;
    }

// PLAYER MELEE CRIT -- criticalStrikeChance_melee, agility
    function calc_meleeCriticalStrikeChance() {
        let criticalStrikeChance_melee = battleStats.find(s => s.id === 'criticalStrikeChance_melee');

        // Calculate melee critical strike chance with equipmemt
        let agility = battleStats.find(s => s.id === 'agility');
        let agility_crit_amt = agility.amt * 0.001;

        // Left as decimal
        // Combine existing standalone crit (and base from reset above) with agility
        let crit_total = agility_crit_amt;
        crit_total += criticalStrikeChance_melee.amt;

        crit_total = Math.round(crit_total * 1000) / 1000;
        // Final value
        return crit_total;
    }

// PLAYER MAGIC CRIT -- criticalStrikeChance_magic, wisdom
    function calc_magicCriticalStrikeChance() {
        let criticalStrikeChance_magic = battleStats.find(s => s.id === 'criticalStrikeChance_magic');

        // Calculate melee critical strike chance with equipmemt
        let wisdom = battleStats.find(s => s.id === 'wisdom');
        let wisdom_crit_amt = wisdom.amt * 0.001;

        // Left as decimal
        // Combine existing standalone crit (and base from reset above) with agility
        let crit_total = wisdom_crit_amt;
        crit_total += criticalStrikeChance_magic.amt;

        crit_total = Math.round(crit_total * 1000) / 1000;
        // Final value
        return crit_total;
    }

// PLAYER MELEE CRIT ONLY
    function calc_meleeStandaloneCrit() {
        let criticalStrikeChance_melee = battleStats.find(s => s.id === 'criticalStrikeChance_melee');
        let crit_only = criticalStrikeChance_melee.amt - criticalStrikeChance_melee.base;
        return crit_only;
    }

// PLAYER MAGIC CRIT ONLY

    function calc_magicStandaloneCrit() {
        let criticalStrikeChance_magic = battleStats.find(s => s.id === 'criticalStrikeChance_magic');
        let crit_only = criticalStrikeChance_magic.amt - criticalStrikeChance_magic.base;
        return crit_only;
    }

// PLAYER MELEE ATTACK -- power only, (dmg_min, dmg_max)
    function calc_meleeAttack_pwr() {
        let power_stat = battleStats.find(s => s.id === 'power');
        let equip_attack_pwr = power_stat.amt * 0.2;
        let attackMinimum_stat = battleStats.find(s => s.id === 'dmg_min');
        let attackMaximum_stat = battleStats.find(s => s.id === 'dmg_max');

        let new_attack_min = attackMinimum_stat.amt + equip_attack_pwr;
        let new_attack_max = attackMaximum_stat.amt + equip_attack_pwr;

        return [new_attack_min, new_attack_max];
    }

// (helper) Determine base attacks based on equipment
    function base_attacks() {

        let attackMinimum_stat = battleStats.find(s => s.id === 'dmg_min');
        let attackMaximum_stat = battleStats.find(s => s.id === 'dmg_max');

        // Base values
        let base_attack_min = attackMinimum_stat.base;
        let base_attack_max = attackMaximum_stat.base;
        let weapon_attack_min = attackMinimum_stat.amt;
        let weapon_attack_max = attackMaximum_stat.amt;

        let equipped_items = pEquipped;
        let current_weapon = equipped_items.find(i => i.id === 'mh');

        // Use weapon stats if equipped
        if (current_weapon && current_weapon.equipped) {
            return [weapon_attack_min, weapon_attack_max];
        }

        return [base_attack_min, base_attack_max];
    }


// PLAYER MELEE ATTACK -- strength, power, dmg_min, dmg_max
    function calc_meleeAttack() {

        let strength_stat = battleStats.find(s => s.id === 'strength');
        let power_stat = battleStats.find(s => s.id === 'power');

        // Get the base or weapon attack values depending on equipment
        const [actual_attack_min, actual_attack_max] = base_attacks();

        // Combine strength and attack power
        let attack_str = strength_stat.amt * 0.01;
        let attack_pwr = power_stat.amt * 0.2;

        // Calculate total attack values based on equipped weapon or base stats
        let total_attack_min = actual_attack_min * (1 + attack_str) + attack_pwr;
        let total_attack_max = actual_attack_max * (1 + attack_str) + attack_pwr;

        // Round to one decimal place
        total_attack_min = Math.round(total_attack_min * 10) / 10;
        total_attack_max = Math.round(total_attack_max * 10) / 10;

        return [total_attack_min, total_attack_max];
    }

// PENDING
// PLAYER MAGIC ATTACK -- intelligence, power, dmg_min, dmg_max
    //function calc_MagicAttack() {
        //
    //}

// PLAYER_RESOURCE_MELEE -- strength
    function calc_resource_melee() {
        let strength_stat = battleStats.find(s => s.id === 'strength');
        let base_resource = 100;

        let resource_bonus = strength_stat.amt;

        let total_resource_melee = base_resource + resource_bonus;
        return total_resource_melee;
    }

// PLAYER_RESOURCE_MAGIC -- intelligence
    function calc_resource_magic() {
        let intelligence_stat = battleStats.find(s => s.id === 'intelligence');
        let base_resource = 100;

        let resource_bonus = intelligence_stat.amt * 10;

        let total_resource_magic = base_resource + resource_bonus;
        return total_resource_magic;
    }

    return {
        calc_armorMitigation,
        calc_totalHealth,
        calc_hitChance,
        calc_meleeCriticalStrikeChance,
        calc_magicCriticalStrikeChance,
        calc_meleeStandaloneCrit,
        calc_magicStandaloneCrit,
        calc_meleeAttack_pwr,
        calc_meleeAttack,
        calc_resource_melee,
        calc_resource_magic,
        base_attacks
    };
}

// TAB: Display player / equipmemt stats
export async function update_stats() {

// Equipment stats
    // Player data
    //OLD let d_player_character = saveData[1].savedCharacterData[0];
    //OLD let player_level = d_player_character.char_level;
    let d_savedCharacterData = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
    let d_player_character = d_savedCharacterData[0];
    let player_level = d_player_character.char_level;

    // Main calc function call
    // Assumes enemy level is equal with player

    const fetch_battleStats = await update_battleStats(player_level);

    // Function methods of update_battleStats
    const hitChance = await fetch_battleStats.calc_hitChance();
    const critChance = await fetch_battleStats.calc_meleeCriticalStrikeChance();
    const critChance_magic = await fetch_battleStats.calc_magicCriticalStrikeChance();
    const [attack_min, attack_max] = await fetch_battleStats.calc_meleeAttack();
    const dmg_mit_armor = await fetch_battleStats.calc_armorMitigation();
    const resource_melee = await fetch_battleStats.calc_resource_melee();
    const total_health = await fetch_battleStats.calc_totalHealth();
    const [f_base_min, f_base_max] = await fetch_battleStats.base_attacks();

/*
    console.log('STATS: ');
    console.log('hitChance: ' + hitChance);
    console.log('critChance_magic: ' + critChance_magic);
    console.log('critChance: ' + critChance);
    console.log('attack_min: ' + attack_min);
    console.log('attack_max: ' + attack_max);
    console.log('dmg_mit_armor: ' + dmg_mit_armor);
    console.log('resource_melee: ' + resource_melee);
    console.log('total_health: ' + total_health);
    //console.log('f_base_min: ' + f_base_min + ' / f_base_max: ' + f_base_max);
*/

    //OLD let equipped_items = saveData[3].equippedData;
    const equipped_items = await d.getSlotData(dbState.slot_selected, 'equippedData');
    // Player mh weapon
    const current_weapon = equipped_items.find(i => i.id === 'mh');

    // Reset elements
    let e_tab_player_stats = document.getElementById('tab_player_stats');
    if (e_tab_player_stats) {
        e_tab_player_stats.innerHTML = '';
    }

    create_el('stats_info', 'div', e_tab_player_stats);
    stats_info.innerHTML = '<b>CURRENT STATS</b><br><br>';

    // Character stat descriptions
    let filtered_battleStats = battleStats.filter(s => s.dmg !== true);
    filtered_battleStats.forEach(stat => {

        // Output
        let stats_effect = `<span style="color:lightgreen">(Base)</span>`;

        switch (stat.id) {
            case 'armor':
                let c_dmg_mit_armor = dmg_mit_armor * 100;
                // Display
                stats_effect = `<br><span style="color:lightgreen">Player base: +${stat.base}
                <br><span style="color:lightgreen">Equipment bonus: +${stat.amt - stat.base}
                <br><span style="color:lightgreen">Total Armor: +${stat.amt}
                <br><b>Reduces damage received by ${Math.round((100 - c_dmg_mit_armor)*10)/10}%</b></span>`;
                break;
            case 'strength':
                let level_base = stat.base * player_level;
                // Display
                stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${level_base}
                <br><span style="color:lightgreen">Equipment bonus: +${stat.amt - level_base}
                <br><span style="color:lightgreen">Total Strength: +${stat.amt}
                <br><b>Increases both melee damage dealt by <b>${stat.amt}%</b> and total energy by <b>${stat.amt}</b></span>`;
                break;
            case 'intelligence':
                let level_base_int = stat.base * player_level;
                // Display
                stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${level_base_int}
                <br><span style="color:lightgreen">Equipment bonus: +${stat.amt - level_base_int}
                <br><span style="color:lightgreen">Total Intelligence: +${stat.amt}
                <br><b>Increases both magic damage dealt by <b>${stat.amt}%</b> and total mana by <b>${stat.amt * 10}</b></span>`;
                break;
            case 'dexterity':
                let rnd_stat_amt_p = Math.round(stat.amt*0.1*10)/10;
                let level_base_dex = stat.base * player_level;
                // Display
                stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${level_base_dex}
                <br>Equipment bonus: +${stat.amt - level_base_dex}
                <br>Total Dexterity: +${stat.amt}

                <br><b>Increases same-level hit chance by <b>${rnd_stat_amt_p}%.</b></span>`;
                break;
            case 'constitution':
                let level_base_con = stat.base * player_level;
                let health_lvl = (level_base_con * 10) + 100;
                let health_difference = total_health - health_lvl;
                // Display
                stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${level_base_con}
                <br>Equipment bonus: +${stat.amt - level_base_con}
                <br>Total Constitution: +${stat.amt}
                <br><b>Increases total maximum health from base ${health_lvl} to <b>${total_health} (Increased by ${Math.round((health_difference / health_lvl)*100*10)/10}%)</span>`;
                break;
            case 'agility':
                // Agility only, not crit standalone stat
                let base_agility = stat.base * player_level;
                // Display
                stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_agility}
                <br>Equipment bonus: +${stat.amt - base_agility}
                <br>Total Agility: +${stat.amt}
                <br><b>Increases melee critical strike chance by ${Math.round((stat.amt * 0.1)*10)/10}%</b>`;
                break;
            case 'wisdom':
                let base_wisdom = stat.base * player_level;
                // Display
                stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_wisdom}
                <br>Equipment bonus: +${stat.amt - base_wisdom}
                <br>Total Wisdom: +${stat.amt}
                <br><b>Increases magic critical strike chance by ${Math.round((stat.amt * 0.1)*10)/10}%</b>`;
                break;
            case 'power':
                let [pwr_weapon_min, pwr_weapon_max] = fetch_battleStats.calc_meleeAttack_pwr();
                // (base is 0 in array atm)
                let level_base_pwr = stat.base;
                let dmg_min = battleStats.find(s => s.id === 'dmg_min');
                let dmg_max = battleStats.find(s => s.id === 'dmg_max');
                if (!current_weapon) {
                    dmg_min.amt = dmg_min.base;
                    dmg_max.amt = dmg_max.base;
                    pwr_weapon_min += dmg_min.amt;
                    pwr_weapon_max += dmg_max.amt;
                }
                let incr_dmg_min = Math.round((((pwr_weapon_min / dmg_min.amt) - 1) * 100) * 10) / 10;
                let incr_dmg_max = Math.round((((pwr_weapon_max / dmg_max.amt) - 1) * 100) * 10) / 10;
                // Add + only if greater than 0
                let stat_pwr_0 = (stat.amt > 0) ? '+' + stat.amt : 0;
                let stat_equip_pwr_0 = ((stat.amt - level_base_pwr) > 0) ? '+' + (stat.amt - level_base_pwr) : 0;
                stats_effect = // `<br><span style="color:lightgreen">Player Base: ${level_base_pwr}
                `<br><span style="color:lightgreen">Equipment bonus: ${stat_equip_pwr_0}
                <br>Total Power: ${stat_pwr_0}
                <br><b>Increases attack damage per turn minimum by <b>${incr_dmg_min}%</b> and attack damage per turn maximum by ${incr_dmg_max}%</b></span>`;
                break;
            // Standalone hit chance
            case 'hitChance':
                // Display
                let stat_hit = stat.amt - stat.base;
                let stat_hit_0 = ((Math.round((stat_hit * 100) * 10)/10) > 0) ? '+' + Math.round((stat_hit * 100) * 10)/10 : 0;
                stats_effect = `<br><span style="color:lightgreen">Equipment bonus: ${stat_hit_0}%
                <br><b>Increases same-level hit chance by ${stat_hit_0}%.</b></span>`;
                break;
            case 'criticalStrikeChance_melee':
                let critOnly = fetch_battleStats.calc_meleeStandaloneCrit();
                critOnly = Math.round((critOnly*100)*10)/10;
                let stat_base_rnd = Math.round((stat.base * 100)*10)/10;
                stats_effect = `<br><span style="color:lightgreen">Player Base: +5%
                <br>Equipment bonus: +${critOnly}%.
                <br><b>Increases melee critical strike chance by ${critOnly + stat_base_rnd}%</b></span>`;
                break;
            case 'criticalStrikeChance_magic':
                let mag_critOnly = fetch_battleStats.calc_magicStandaloneCrit();
                mag_critOnly = Math.round((mag_critOnly*100)*10)/10;
                let stat_base_mag_rnd = Math.round((stat.base * 100)*10)/10;
                stats_effect = `<br><span style="color:lightgreen">Player Base: +5%
                <br>Equipment bonus: +${mag_critOnly}%.
                <br><b>Increases magic critical strike chance by ${mag_critOnly + stat_base_mag_rnd}%</b></span>`;
                break;
        }

        let line_item = stat.label + stat.amt + stats_effect + '<br>';
        if (stat.id === 'hitChance') {
        let stat_hit = stat.amt - stat.base;
        line_item = '(Standalone) ' + stat.label + Math.round((stat_hit * 100) * 10)/10 + '%' + stats_effect + '<br>';
        }
        if (stat.id === 'criticalStrikeChance_melee') {
            let stat_crit = stat.amt - stat.base;
            line_item = '(Standalone) ' + stat.label + Math.round((stat_crit * 100) * 10)/10 + '%' + stats_effect + '<br>';
        }
        if (stat.id === 'criticalStrikeChance_magic') {
            let stat_crit = stat.amt - stat.base;
            line_item = '(Standalone) ' + stat.label + Math.round((stat_crit * 100) * 10)/10 + '%' + stats_effect + '<br>';
        }

        stats_info.innerHTML += line_item;
    });

    // Combined stats
    create_el('combined_stats', 'div', e_tab_player_stats);

    let combinedStats = battleStats.filter(s => s.combines === true);
    combinedStats.forEach(stat => {
        if (stat.id === 'power') {
            stat.label = 'Attack: ';
        }
        let stat_id = stat.id;
        let stat_text = '<span style="color:lightgreen">';
        switch (stat_id) {
            case 'power':
                let attack_min_diff = attack_min - f_base_min;
                attack_min_diff = Math.round(attack_min_diff *10)/10;
                let attack_max_diff = attack_max - f_base_max;
                attack_max_diff = Math.round(attack_max_diff *10)/10;
                let attack_min_diff_p = ((attack_min / f_base_min)-1)*100;
                attack_min_diff_p = Math.round(attack_min_diff_p*10)/10;
                let attack_max_diff_p = ((attack_max / f_base_max)-1)*100;
                attack_max_diff_p = Math.round(attack_max_diff_p*10)/10;
                stat_text += `Attack base: ${f_base_min} - ${f_base_max}
                <br>Attack (Strength and Power): ${attack_min} - ${attack_max}
                <br><b>Increases attack minimum to ${attack_min} by ${attack_min_diff} (${attack_min_diff_p}%) and
                attack maximum to ${attack_max} by ${attack_max_diff} (${attack_max_diff_p}%).</b>`;
                break;
            case 'hitChance':
                stat_text += `Hit Chance base: 90%
                <br>Hit Chance (Dexterity and Standalone): ${Math.round((hitChance*100)*10)/10}%
                <br><b>Increases same-level hit chance by <b>${Math.round((hitChance*100)*10)/10}%.</b></span>`;
                break;
            case 'criticalStrikeChance_melee':
                stat_text += `Melee Critical Strike Chance base: 5%
                <br>Melee Critical Strike Chance (Agility and Standalone): ${Math.round((critChance*100)*10)/10}%
                <br><b>Increases melee critical strike chance by <b>${Math.round((critChance*100)*10)/10}%.</b></span>`;
                break;
            case 'criticalStrikeChance_magic':
                stat_text += `Magic Critical Strike Chance base: 5%
                <br>Magic Critical Strike Chance (Wisdom and Standalone): ${Math.round((critChance_magic*100)*10)/10}%
                <br><b>Increases magic critical strike chance by <b>${Math.round((critChance_magic*100)*10)/10}%.</b></span>`;
                break;
        }
        combined_stats.innerHTML += '<br>Combined ' + stat.label + '<br>' + stat_text + '</span>';
    });

    // Stat descriptions
    create_el('stats_desc_lbl', 'div', e_tab_player_stats);
    stats_desc_lbl.innerHTML = '<br><b>STAT DEFINITIONS:</b<br>';
    create_el('stats_desc', 'div', e_tab_player_stats);
    stats_desc.innerHTML = '<p>';
    statDescriptions.forEach(stat => {
        let line_item = '<b>' + stat.label + ':</b> ' + stat.def + '<br>';
        stats_desc.innerHTML += line_item;
    });
}

// WIP battle.js ??
export function fetch_playerStats(opt) {
    let playerStats = characterData.find(d => d.id === 'player_stats');
    let stats = update_battleStats();

    playerStats.max_health = stats.calc_totalHealth();
    // playerStats.cur_health
    playerStats.max_resource = stats.calc_resource_melee();
    // playerStats.cur_resource

    if (opt === 'new') {
        // Reset current health
        playerStats.cur_health = playerStats.max_health;
        // Reset current resource
        playerStats.cur_resource = playerStats.max_resource;
    }
}
