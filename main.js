// main.js

import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, saveData, trackingData } from './data.js';

import * as f from  './functions.js';
import * as gf from './general_functions.js';

//`

// ******** DEBUGGING INFO

gf.logExport();
gf.htmlExport();

// ******** END DEBUGGING INFO

// Iterate over the array and set other variables dynamically
/*function outside_iteration() {
    
    // characterData
    // global .enemy_defeated_count
    for (let i = 0; i < characterData.length; i++) {
        const characterIndex = characterData[i];
        const characterDataUpdates = {};
        let group_1 = locationData.find(loc => loc.enemy === 'enemy_group_1');
        for (let level = 1; level <= group_1.total_levels; level++) {
            if (characterIndex.id !== 'my_character') {
                characterIndex.enemy_defeated_count.push({ [characterIndex.id + '_def_count_level_' + level]: 0 });
            }
        }
        // Assign updates to resourcesIndex properties
        Object.assign(characterIndex, characterDataUpdates);
    }
}
// init certain array data
outside_iteration();*/

// Add main elements
gf.add_allElements();
f.update_character();


// after DOM initialized
document.addEventListener('DOMContentLoaded', () => {
    f.first_run();
    f.update_locations();
    f.update_inventory();
    //
});

// MAX LOCALSTORAGE SIZE (5 MB)
/* To monitor the size, you can use 
JSON.stringify(array).length to get 
an approximate count of characters being 
stored. Keep in mind that each character 
takes up 2 bytes in UTF-16 encoding, 
which is commonly used by JavaScript.
*/
//console.log(JSON.stringify(saveData).length * 2);
//console.log(JSON.stringify(saveData));

// TESTING FOR WEAPON DAMAGE VALUES
/*
let stat_power = 5;
// ilvl is simply a damage multiplier for weapon dmg generation
for (let ilvl = 1; ilvl <= 20; ilvl ++) {
    let weap_min = 1 * ilvl;
    // 20% difference in min/max does well
    let weap_max = 1.2 * ilvl;
    
    let [damage_min, damage_max] = f.calculate_weapon_damage(ilvl, stat_power, weap_min, weap_max);

    function roundValues(...values) {
        return values.map(value => Math.round(value * 10) / 10);
    }

    [weap_min, weap_max, damage_min, damage_max] = roundValues(weap_min, weap_max, damage_min, damage_max);
    console.log('ilvl: ' + ilvl + ' / Weapon: ' + weap_min + ' - ' + weap_max + ' / Pwr Dmg: ' + damage_min + ' - ' + damage_max);
}
*/

function loaded_DOM() {
    locData.forEach(location => {
        for (let lvl = 1; lvl <= location.level_data.length; lvl++) {
            let fetch_div = document.getElementById('loc_' + location.id + '_lvl_' + lvl + '_span');
            console.log('...Searching for ID:' + 'loc_' + location.id + '_lvl_' + lvl + '_span');

            if (fetch_div) {
                console.log('Element ID:' + fetch_div.id);
                console.log('Outer HTML:' + fetch_div.outerHTML);
                console.log('Inner HTML:' + fetch_div.innerHTML);
                console.log('Class List:' + fetch_div.classList);
                console.log('Styles:' + fetch_div.style.cssText);

                const computedStyle = window.getComputedStyle(fetch_div);
                console.log('Computed Display:' + computedStyle.display);
                console.log('Computed Visibility:' + computedStyle.visibility);

                // Log parent element details
                const parent = fetch_div.parentElement;
                if (parent) {
                    console.log('Parent ID:' + parent.id);
                    console.log('Parent Outer HTML:' + parent.outerHTML);
                    console.log('Parent Inner HTML:' + parent.innerHTML);
                } else {
                    console.log('No parent element found.');
                }

                // Log child elements
                const children = fetch_div.children;
                if (children.length > 0) {
                    console.log('Child Elements:');
                    Array.from(children).forEach(child => {
                        console.log('Child ID:' + child.id);
                        console.log('Child Outer HTML:' + child.outerHTML);
                        console.log('Child Inner HTML:' + child.innerHTML);
                    });
                } else {
                    console.log('No child elements found.');
                }
            } else {
                console.log('Element not found for ID:' + 'loc_' + location.id + '_level_' + lvl);
            }
        }
    });
}
