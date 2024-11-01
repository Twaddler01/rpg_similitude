// equipment.js

// To be used alongside character.js
// stats related to player equipment/level

import { saveData, itemData } from './data.js';
//import * as gf from './general_functions.js';
import { enemyStats } from './functions.js';
//import { x } from './inventory.js';

const battleStats = [
    { id: 'armor', type: 'reg', amt: 0, label: 'Armor: ', base: 100 },
    { id: 'strength', type: 'reg', amt: 0, label: 'Strength: ', base: 1 },
    { id: 'intelligence', type: 'reg', amt: 0, label: 'Intelligence: ', base: 1 },
    { id: 'dexterity', type: 'reg', amt: 0, label: 'Dexterity: ', base: 1 },
    { id: 'constitution', type: 'reg', amt: 0, label: 'Constitution: ', base: 1 },
    { id: 'agility', type: 'reg', amt: 0, label: 'Agility: ', base: 1 },
    { id: 'wisdom', type: 'reg', amt: 0, label: 'Wisdom: ', base: 1 },
    { id: 'power', type: 'reg', amt: 0, label: 'Power: ', base: 10 },
    { id: 'hitChance', type: 'static', amt: 0.9, label: 'Hit Chance: ', base: 0 },
    { id: 'criticalStrikeChance', type: 'static', amt: 0.0, label: 'Critical Strike Chance: ', base: 0 },
    { id: 'attackMinimum', type: 'static', amt: 0, label: 'Attack Minimum: ', base: 1.2 },
    { id: 'attackMaximum', type: 'static', amt: 0, label: 'Attack Maximum: ', base: 1.6 },


];

// Stat modifications
function update_battleStats(pLevel, pEquipped) {
    
    let filtered_battleStats = battleStats.filter(e => e.type === 'reg');
    // Reset all 'reg' stats based on pLevel
// LOG
console.log('INIT...');
    filtered_battleStats.forEach(stat => {
        stat.amt = stat.base * pLevel;
// LOG
console.log(stat.id + ': ' + stat.amt);
    });
// LOG
console.log('+EQUIP...');
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
filtered_battleStats.forEach(stat => {
console.log(stat.id + ': ' + stat.amt);
});

    function calc_hitChance() {
        let hitChance = battleStats.find(s => s.id === 'hitChance');
        let default_hitChance = hitChance.amt; // 0.9

console.log('default_hitChance: ' + default_hitChance);
        // Calculate hit chance with equipmemt
        let dexterity = battleStats.find(s => s.id === 'dexterity');
console.log('dexterity: ' + dexterity.amt);
        // Left as decimal
        dexterity.amt *= 0.001;
        default_hitChance += dexterity.amt;
console.log('NEW hitChance.amt: ' + default_hitChance);

        // Uses pushed data from functions.js
        // export const enemyStats = [];
enemyStats.lvl = 4;
        let enemyLevel_diff = enemyStats.lvl - pLevel;
        
        // No difference in level
        let calculated_hitChance = default_hitChance;

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

console.log('Verses ENEMY hitChance: ' + calculated_hitChance);


    }
    calc_hitChance();



}

update_battleStats(2, saveData[3].equippedData);