// equipment.js

// To be used alongside character.js
// stats related to player equipment/level

import { saveData, itemData, characterData } from './data.js';
//import * as gf from './general_functions.js';
import { enemyStats, create_el } from './functions.js';
//import { x } from './inventory.js';

// temporary
let trackingData = [{}];

const battleStats = [
/**/    { id: 'armor', type: 'static', amt: 0, label: 'Armor: ', base: 100 },
/**/    { id: 'strength', type: 'reg', amt: 0, label: 'Strength: ', base: 1 },
/**/    { id: 'intelligence', type: 'reg', amt: 0, label: 'Intelligence: ', base: 1 },
/**/    { id: 'dexterity', type: 'reg', amt: 0, label: 'Dexterity: ', base: 1 },
/**/    { id: 'constitution', type: 'reg', amt: 0, label: 'Constitution: ', base: 1 },
    { id: 'agility', type: 'reg', amt: 0, label: 'Agility: ', base: 1 },
    { id: 'wisdom', type: 'reg', amt: 0, label: 'Wisdom: ', base: 1 },
    { id: 'power', type: 'reg', amt: 0, label: 'Power: ', base: 10 },
    { id: 'hitChance', type: 'static', amt: 0, label: 'Hit Chance: ', base: 0.9 },
    { id: 'criticalStrikeChance_melee', type: 'static', amt: 0, label: 'Melee Critical Strike Chance: ', base: 0.05 },
    { id: 'criticalStrikeChance_magic', type: 'static', amt: 0, label: 'Magic Critical Strike Chance: ', base: 0.05 },
    { id: 'dmg_min', type: 'static', amt: 0, label: 'Attack Minimum: ', base: 1.2, dmg: true },
    { id: 'dmg_max', type: 'static', amt: 0, label: 'Attack Maximum: ', base: 1.6, dmg: true },
];

const statDescriptions = [
    { id: 'armor', label: 'Armor', type: 'desc', def: 'Reduces damage received by 0.1% per point.' },
    { id: 'strength', label: 'Strength', type: 'desc', def: 'Increases melee damage dealt by 0.1% per point and total energy by both 0.1 per base level amount and 1 per equipment bonus point.' },
    { id: 'intelligence', label: 'Intelligence', type: 'desc', def: 'Increases magic damage dealt by 0.1% and total mana by 10 per point.' },
    { id: 'dexterity', label: 'Dexterity', type: 'desc', def: 'Increases hit chance by 0.1% per point above base amount. Default hit chance is 90%, or 100% at 100+ dex' },
    { id: 'constitution', label: 'Constitution', type: 'desc', def: 'Increases total maximum health by 10 per point.' },
    { id: 'agility', label: 'Agility', type: 'desc', def: 'Increases melee critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
    { id: 'wisdom', label: 'Wisdom', type: 'desc', def: 'Increases magic critical strike chance by 0.1% per point above base amount. Critical strikes deal double damage.' },
    { id: 'power', label: 'Power', type: 'desc', def: 'Increases both attack damage minimum and maximum per turn.' },
    { id: 'attackMinimum', label: 'Attack Minimum', type: 'desc', def: 'Minimum damage caused for each hit per turn.' },
    { id: 'attackMaximum', label: 'Attack Maximum', type: 'desc', def: 'Maximim damage caused for each hit per turn.' },
    { id: 'hitChance', label: 'Hit Chance', type: 'desc', def: 'The probability an attack will cause damage or miss. 100% hit chance guarantees a hit if enemy level is less than or equal to player&apos;s current level. Hit chance decreases for each enemy level above the player&apos;s level.' },
    { id: 'criticalStrikeChance', label: 'Critical Strike Chance', type: 'desc', def: 'The probability a successful attack is critical. Critical strikes cause double the regular damage.' },
];

// Stat modifications
// Updates for battles and equipmemt
export function update_battleStats(pLevel, pEquipped, eLevel) {
    
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
// LOG
//console.log('(LVL/BASE) ' + stat.id + ': ' + stat.amt);
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
// LOG
//battleStats.forEach(stat => {
//console.log('(EQUIP + LVL/BASE) ' + stat.id + ': ' + stat.amt);
//});

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

//console.log('dmg_mit_armor: ' + dmg_mit_armor);
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
        // Reset to base
        hitChance.amt = base_hitChance;

//console.log('base_hitChance: ' + base_hitChance);
        // Calculate hit chance with equipmemt
        let dexterity = battleStats.find(s => s.id === 'dexterity');
//console.log('dexterity: ' + dexterity.amt);
        // Left as decimal
        let calc_dexterity = dexterity.amt * 0.001;
        hitChance.amt += calc_dexterity;
//console.log('NEW hitChance.amt: ' + base_hitChance);

//console.log('enemyStats.lvl: ' + enemyStats[0].lvl);
        let enemyLevel_diff = eLevel - pLevel;
    
        // No difference in level
        let calculated_hitChance = hitChance.amt;

        // If enemy is higher or lower level
        if (enemyLevel_diff > 0) {
// NEW UPDATE:
// The base probability an attack will cause damage to higher level enemies decreases to 85% (without equipment benefits) for 1 level above, and decreases a further 5% for each additional enemy level above the player. For example, the base hit chance for an enemy 5 levels higher than you will be 90% - (5% x 5) or 65% total.
            calculated_hitChance -= (0.05 * enemyLevel_diff);
        } else if (enemyLevel_diff < 0) {
            // 2.5% increase hit for lower enemy levels
            calculated_hitChance += (0.025 * -enemyLevel_diff);
            calculated_hitChance = Math.min(calculated_hitChance, 1);
        }

        calculated_hitChance = Math.round(calculated_hitChance * 1000) / 1000;
//console.log('Verses ENEMY hitChance: ' + calculated_hitChance);
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
        criticalStrikeChance_melee.amt += agility_crit_amt;

        criticalStrikeChance_melee.amt = Math.round(criticalStrikeChance_melee.amt * 1000) / 1000;
//console.log('(CALC) criticalStrikeChance_melee.amt: ' + criticalStrikeChance_melee.amt);
        // Final value
        return criticalStrikeChance_melee.amt;
    }

// PENDING
// PLAYER MAGIC CRIT -- criticalStrikeChance_magic, wisdom
    //function calc_magicCriticalStrikeChance() {
        //
    //}

// PLAYER MELEE ATTACK -- strength, power, dmg_min, dmg_max
    // Both min and max attack
    function calc_meleeAttack() {
        let strength_stat = battleStats.find(s => s.id === 'strength');
        let power_stat = battleStats.find(s => s.id === 'power');
        let attackMinimum_stat = battleStats.find(s => s.id === 'dmg_min');
        let attackMaximum_stat = battleStats.find(s => s.id === 'dmg_max');
        
        let total_attack_incr = 0; // % increase for attack power
        // Set to base
        let total_attack_min = attackMinimum_stat.base;
        let total_attack_max = attackMaximum_stat.base;

//console.log('total_attack_min (BASE): ' + total_attack_min);
//console.log('total_attack_max (BASE): ' + total_attack_max);

        // Combine attack power

        // Strength +1%
        total_attack_incr = strength_stat.amt * 0.01;
        // Power +2% attack (with strength)
        let total_attack = power_stat.amt * 0.02;
        // Weapon
//console.log('attackMinimum_stat (EQUIP): ' + attackMinimum_stat.amt);
//console.log('attackMaximum_stat (EQUIP): ' + attackMaximum_stat.amt);
        
        total_attack_min += total_attack * (1 + total_attack_incr);
        total_attack_max += total_attack * (1 + total_attack_incr);
        
        total_attack_min += attackMinimum_stat.amt;
        total_attack_max += attackMaximum_stat.amt;
        
/*console.log('total_attack_incr (STRENGTH): ' + total_attack * (1 + total_attack_incr));
console.log('total_attack (POWER): ' + total_attack);
console.log('total_attack_min (ALL): ' + total_attack_min);
console.log('total_attack_max (ALL): ' + total_attack_max);
*/
        total_attack_min = Math.round(total_attack_min * 10) / 10;
        total_attack_max = Math.round(total_attack_max * 10) / 10;

//console.log('total_attack_min (RND): ' + total_attack_min);
//console.log('total_attack_max (RND): ' + total_attack_max);

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

// EXTRAS FOR DISPLAYING

    return {
        calc_armorMitigation,
        calc_totalHealth,
        calc_hitChance,
        calc_meleeCriticalStrikeChance,
        calc_meleeAttack,
        calc_resource_melee,
        calc_resource_magic
    };
}

// TAB: Display player / equipmemt stats
export function update_stats() {
    
    // Reset elements
    let e_tab_player_stats = document.getElementById('tab_player_stats');
    if (e_tab_player_stats) {
        e_tab_player_stats.innerHTML = '';
    }

    create_el('stats_info', 'div', e_tab_player_stats);
    stats_info.innerHTML = '<b>CURRENT STATS</b><br><br>';

// Equipment stats

    // Character stat descriptions
    battleStats.forEach(stat => {

        // Output
        let stats_effect = `<span style="color:lightgreen">(Base)</span>`;
        
        // Player data
        let d_player_character = saveData[1].savedCharacterData[0];
        let player_level = d_player_character.char_level;

        // Player mh weapon
        let equipped_items = saveData[3].equippedData;
        let current_weapon = equipped_items.find(i => i.id === 'mh');

        // Main calc function call
        // Assumes enemy level is equal with player
        const fetch_battleStats = update_battleStats(player_level, saveData[3].equippedData, player_level);
        // Function methods
        const hitChance = fetch_battleStats.calc_hitChance();
        const critChance = fetch_battleStats.calc_meleeCriticalStrikeChance();
        const [attack_min, attack_max] = fetch_battleStats.calc_meleeAttack();
        const dmg_mit_armor = fetch_battleStats.calc_armorMitigation();
        const resource_melee = fetch_battleStats.calc_resource_melee();
        const total_health = fetch_battleStats.calc_totalHealth();

console.log('hitChance: ' + hitChance);
console.log('critChance: ' + critChance);
console.log('attack_min: ' + attack_min);
console.log('attack_max: ' + attack_max);
console.log('dmg_mit_armor: ' + dmg_mit_armor);
console.log('resource_melee: ' + resource_melee);
console.log('total_health: ' + total_health);

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
                <br><b>Increases same-level hit chance by <b>${rnd_stat_amt_p}% from a flat 90%, granting a total hit chance against same-level enemies of ${90 + rnd_stat_amt_p}%</b></span>`;
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

// WIP
            case 'power':
                if (current_weapon && current_weapon.equipped) {
                let item_info = itemData.find(i => i.id === current_weapon.equipped);
                let current_weapon_item_info = item_info.gains;
                let current_weapon_dmg_min = current_weapon_item_info.find(w => w.stat === 'dmg_min');
                let current_weapon_dmg_max = current_weapon_item_info.find(w => w.stat === 'dmg_max');

let fetch_battleStats = update_battleStats(player_level, saveData[3].equippedData, player_level);
let [pwr_weapon_min, pwr_weapon_max] = fetch_battleStats.calc_meleeAttack();
                        
                        
                        trackingData[0].current_weapon_dmg_min = current_weapon_dmg_min.amt;
                        trackingData[0].current_weapon_dmg_max = current_weapon_dmg_max.amt;
                        let incr_dmg_min = Math.round((((pwr_weapon_min / current_weapon_dmg_min.amt) - 1) * 100) * 10) / 10;
                        let incr_dmg_max = Math.round((((pwr_weapon_max / current_weapon_dmg_max.amt) - 1) * 100) * 10) / 10;
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt}, increases attack damage per turn minimum by <b>${incr_dmg_min}%</b> and attack damage per turn maximum by <b>${incr_dmg_max}%</b></span>`;
                        // Store calculations for tooltip display
                        trackingData[0].pwr_weapon_min = pwr_weapon_min;
                        trackingData[0].pwr_weapon_max = pwr_weapon_max;
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




 
 
 

 
 
        }
 
        let base_level_stat = 0;
        let equip_stat_amt = 0;
        
        // Main array to store calculations
        let playerStats = characterData.find(d => d.id === 'player_stats');

        if (stat.lvl_mod) {
            // Adjust to equipment amount 
            equip_stat_amt = stat.amt - (stat.id === 'armor' ? 100 : 10);
            // Based on player level (depr)
            base_level_stat = stat.lvl_amt;
            //base_level_stat *= d_player_character.char_level;
        }

        switch (stat.id) {
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
        create_el('stats_desc_lbl', 'div', e_tab_player_stats);
        stats_desc_lbl.innerHTML = '<br><b>STAT DEFINITIONS:</b<br>';
        create_el('stats_desc', 'div', e_tab_player_stats);
        stats_desc.innerHTML = '<p>';
        let stat_data_desc = characterData.filter(d => d.type === 'desc');
        stat_data_desc.forEach(stat => {
            let line_item = '<b>' + stat.label + ':</b> ' + stat.def + '<br>';
            stats_desc.innerHTML += line_item;
        });





}