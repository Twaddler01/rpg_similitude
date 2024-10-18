// main.js

import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, saveData, trackingData } from './data.js';

import * as f from  './functions.js';
import * as gf from './general_functions.js';
import * as ch from './character.js';
import * as inv from './inventory.js';

//`

// DEBUGGING INFO

gf.logExport();
gf.htmlExport();

// Inject gear sets
f.add_new_gear('STARTER', 'BLUE', 2, 5, 5, 10, 20, 30, 3.0, 5.0); // Shield is x5 armor

// Add main elements
gf.add_allElements();
ch.update_character_stats(true);

// after DOM initialized
document.addEventListener('DOMContentLoaded', () => {
    f.first_run();
    f.update_locations();
    inv.update_inventory();
    gf.add_section_clicks();
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

// For testing elements
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