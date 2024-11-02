// equipment.js

// To be used alongside character.js
// stats related to player equipment/level

import { saveData, itemData } from './data.js';
//import * as gf from './general_functions.js';
import { enemyStats } from './functions.js';
//import { x } from './inventory.js';

const battleStats = [
    { id: 'armor', type: 'static', amt: 0, label: 'Armor: ', base: 100 },
    { id: 'strength', type: 'reg', amt: 0, label: 'Strength: ', base: 1 },
    { id: 'intelligence', type: 'reg', amt: 0, label: 'Intelligence: ', base: 1 },
    { id: 'dexterity', type: 'reg', amt: 0, label: 'Dexterity: ', base: 1 },
    { id: 'constitution', type: 'reg', amt: 0, label: 'Constitution: ', base: 1 },
    { id: 'agility', type: 'reg', amt: 0, label: 'Agility: ', base: 1 },
    { id: 'wisdom', type: 'reg', amt: 0, label: 'Wisdom: ', base: 1 },
    { id: 'power', type: 'reg', amt: 0, label: 'Power: ', base: 10 },
    { id: 'hitChance', type: 'static', amt: 0, label: 'Hit Chance: ', base: 0.9 },
    { id: 'criticalStrikeChance_melee', type: 'static', amt: 0, label: 'Melee Critical Strike Chance: ', base: 0.05 },
    { id: 'criticalStrikeChance_magic', type: 'static', amt: 0, label: 'Magic Critical Strike Chance: ', base: 0.05 },
    { id: 'dmg_min', type: 'static', amt: 0, label: 'Attack Minimum: ', base: 1.2, dmg: true },
    { id: 'dmg_max', type: 'static', amt: 0, label: 'Attack Maximum: ', base: 1.6, dmg: true },


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
            } else {
                stat.amt = stat.base;
            }
        }
// LOG
//console.log('(BASE) ' + stat.id + ': ' + stat.amt);
    });
// LOG
//console.log('+EQUIP...');
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
battleStats.forEach(stat => {
//console.log('(EQUIP DIRECT) ' + stat.id + ': ' + stat.amt);
});

// PLAYER ARMOR DAMAGE REDUCTION
    function calc_armorMitigation() {
        let armorMit = battleStats.find(s => s.id === 'armor');
        let base_armorMit = armorMit.base;
        
        let total_armor = base_armorMit + armorMit.amt;
        
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

//console.log('dmg_reduction: ' + dmg_reduction);
        return dmg_mit_armor;
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
        let base_criticalStrikeChance_melee = criticalStrikeChance_melee.base; // 0.05
        // Reset to base
        criticalStrikeChance_melee.amt = base_criticalStrikeChance_melee;
        
        // Calculate melee critical strike chance with equipmemt
        let agility = battleStats.find(s => s.id === 'agility');
        // Left as decimal
        agility.amt *= 0.001;
        criticalStrikeChance_melee.amt += base_criticalStrikeChance_melee;
        criticalStrikeChance_melee.amt += agility.amt;

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
    function calc_MeleeAttack() {
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

    return {
        calc_hitChance,
        calc_meleeCriticalStrikeChance,
        calc_MeleeAttack,
        calc_armorMitigation
    };
}