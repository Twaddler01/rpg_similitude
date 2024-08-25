// main.js

import { elementsData, locationData, battleData, characterData, inventoryData, lootData, gameState } from './data.js';

import * as functions from  './functions.js';

//`

// ******** DEBUGGING INFO
// Override console.log for exporting into a file
var logs = [];
const originalConsoleLog = console.log;
console.log = function (message) {
    if (typeof message === 'object') {
        // Convert objects to a string representation
        message = JSON.stringify(message);
    }

    logs.push(message);

    // You can still log to the console if needed
    originalConsoleLog(message);
};

document.getElementById("exportButton").addEventListener("click", function () {
    // Save logs to a file
    let logString = logs.join('\n');

    // Create a Blob containing the text data
    const blob = new Blob([logString], { type: 'text/plain' });

    // Create a download link
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'logs.txt';

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
});

// Allow exporting of HTML to inspect/debug elements
// Create the "Export HTML" button
const exportHTMLButton = document.createElement('button');
exportHTMLButton.id = 'exportHTMLButton';
exportHTMLButton.textContent = 'Export HTML';

// Append the button to the document body
document.body.appendChild(exportHTMLButton);

// Add an event listener to the "Export HTML" button
exportHTMLButton.addEventListener("click", function () {
    // Get the HTML content of the entire document
    let htmlContent = document.documentElement.outerHTML;

    // Create a Blob containing the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a download link
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'vsim_page.html';

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
});
// ******** END DEBUGGING INFO

// Iterate over the array and set other variables dynamically
function outside_iteration() {
    
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
outside_iteration();

// **** SECTIONS ****

// main elements
functions.add_allElements();
// location elements
//functions.setup_location() (SEE update_locations())

const locData = [
    //
    { id: 1, 
    label: 'Dark Plains', 
    level_data: [
        { id: 1, kills_req: 3 },
        { id: 2, kills_req: 3 },
        { id: 3, kills_req: 3 },
        { id: 4, kills_req: 3 },
        { id: 5, kills_req: 3 },
        { id: 6, kills_req: 3 },
        { id: 7, kills_req: 3 },
        { id: 8, kills_req: 3 },
    ],
    level_mult: 0.2, 
    enemy: 'enemy_group_1', // characterData.id ('enemy_group_1')
    }, 
    //
    { id: 2, 
    label: 'Dark Highlands', 
    level_data: [
        { id: 1, kills_req: 3 },
        { id: 2, kills_req: 3 },
        { id: 3, kills_req: 3 },
        { id: 4, kills_req: 3 },
        { id: 5, kills_req: 3 },
        { id: 6, kills_req: 3 },
        { id: 7, kills_req: 3 },
    ], 
    level_mult: 0.2, 
    enemy: null, 
    }, 
    //
    { id: 3, 
    label: 'Dark Forest', 
    level_data: [
        { id: 1, kills_req: 3 },
        { id: 2, kills_req: 3 },
        { id: 3, kills_req: 3 },
        { id: 4, kills_req: 3 },
        { id: 5, kills_req: 3 },
        { id: 6, kills_req: 3 },
    ], 
    level_mult: 0.2, 
    enemy: null, 
    }, 
];
for (let i = 0; i < locData.length; i++) {
    const locDataIndex = locData[i];
    const locDataUpdates = {};
    // element ids
    locDataIndex.loc_container = 'loc_container_' + locDataIndex.id;
    locDataIndex.title_left = 'title_left_' + locDataIndex.id;
    locDataIndex.title_center = 'title_center_' + locDataIndex.id;
    locDataIndex.title_right = 'title_right_' + locDataIndex.id;
    locDataIndex.loc_lvl_div = 'loc_lvl_div_' + locDataIndex.id;
    locDataIndex.title_container = 'title_container_' + locDataIndex.id;
    // LEVELS (lvl): loc_lvl_span.id = 'loc_' + locDataIndex.id + '_lvl_' + lvl + '_span';

    // variables

    // Assign updates to locData
    Object.assign(locDataUpdates, locDataIndex);
}

const saveData = {
    location_maxed: false, // FUTURE: triggers when no more locations are added
    top_loc: 2, // default 1
    top_lvl: 3, // default 1
    max_level: 0, 
    loc_data: [ 
        { loc: 1, lvl: 1, kills: 0 },
        { loc: 1, lvl: 2, kills: 0 },
        { loc: 1, lvl: 3, kills: 0 },
        { loc: 1, lvl: 4, kills: 0 },
        { loc: 1, lvl: 5, kills: 0 },
        { loc: 1, lvl: 6, kills: 0 },
        { loc: 1, lvl: 7, kills: 0 },
        { loc: 1, lvl: 8, kills: 0 },
        { loc: 2, lvl: 1, kills: 0 },
        { loc: 2, lvl: 2, kills: 0 },
        { loc: 2, lvl: 3, kills: 0 },
        { loc: 2, lvl: 4, kills: 0 },
        { loc: 2, lvl: 5, kills: 0 },
        { loc: 2, lvl: 6, kills: 0 },
        { loc: 2, lvl: 7, kills: 0 },
        { loc: 3, lvl: 1, kills: 0 },
        { loc: 3, lvl: 2, kills: 0 },
        { loc: 3, lvl: 3, kills: 0 },
        { loc: 3, lvl: 4, kills: 0 },
        { loc: 3, lvl: 5, kills: 0 },
        { loc: 3, lvl: 6, kills: 0 },
    ],
};





function update_locations() {

    let location_container = document.getElementById('location_container');
    location_container.innerHTML = '';
    let saveData_loc_data = saveData.loc_data;
    let locData_max = locData.length;

    locData.forEach(location => {
        
        if (location.id === saveData.top_loc && saveData.top_loc <= locData_max) {

            // containers
            let loc_container = document.createElement('div');
            location_container.appendChild(loc_container);
            loc_container.id = location.loc_container;

            let title_container = document.createElement('div');
            loc_container.appendChild(title_container);
            title_container.id = location.title_container;
            title_container.style.textAlign = 'center';

            let title_left = document.createElement('span');
            title_container.appendChild(title_left);
            title_left.id = location.title_left;
    
            let title_center = document.createElement('span');
            title_container.appendChild(title_center);
            title_center.id = location.center;

            let title_right = document.createElement('span');
            title_container.appendChild(title_right);
            title_right.id = location.title_right;
    
            // comtainer for levels
            let loc_lvl_div = document.createElement('div');
            loc_container.appendChild(loc_lvl_div);
            loc_lvl_div.id = location.loc_lvl_div;
            loc_lvl_div.style.textAlign = 'center';
    
            // levels
            for (let lvl = 1; lvl <= location.level_data.length; lvl++) {
                // location and level is unlocked
                if (location.id === saveData.top_loc) {
                    if (lvl <= saveData.top_lvl) {
                        title_center.innerHTML = location.label + location.id;
                        let loc_lvl_span = document.createElement('span');
                        loc_lvl_div.appendChild(loc_lvl_span);
                        loc_lvl_span.id = 'loc_' + location.id + '_lvl_' + lvl + '_span';
                        loc_lvl_span.innerHTML = '[ ' + lvl + ' ] ' + loc_lvl_span.id;
                        // append label to first lvl of each location
                        if (loc_lvl_span.id === 'loc_' + location.id + '_lvl_1_span') {
                            loc_lvl_span.innerHTML = '<b>LEVEL:</b>&nbsp;' + '[ 1 ] ' + loc_lvl_span.id;
                        }
                    } 
                    if (saveData.top_lvl > location.level_data.length) {
                        if (saveData.top_loc <= locData_max) {
                        let loc_lvl_span_id = document.getElementById('loc_' + location.id + '_lvl_' + lvl + '_span');
                        loc_lvl_span_id.innerHTML = '';
                        let title_container = document.getElementById('title_container_' + location.id);
                        title_container.innerText = '';
                        }
                        saveData.top_lvl = 1;
                        saveData.top_loc += 1;
                        // if top_lvl is greater than max
//saveData.top_loc = Math.min(saveData.top_loc, locData_max);
                        saveData.top_lvl = Math.min(saveData.top_lvl, location.level_data.length);
                    }
                }
    
            }
        } 
        if (saveData.top_loc > locData_max) {
            // if top_loc greater than max
            saveData.top_loc = locData_max;
            saveData.top_lvl = location.level_data.length;
            saveData.location_maxed = true;
            update_locations();
        }
    });

/* // ELEMENT TREE
#location_container -- clear
  #loc_container
    #title_container -- clear
      #title_left
      #title_center
      #title_right
    #loc_lvl_div -- clear
      #loc_lvl_span
*/

}

function addKill(loc, lvl) {

    let saveData_loc_data = saveData.loc_data;
    
    saveData_loc_data.forEach(save_loc => {
        if (save_loc.loc === loc && save_loc.lvl === lvl) {
            save_loc.kills += 1;
            //console.log(`Location: ${save_loc.loc}, Level: ${save_loc.lvl}, Kills: ${save_loc.kills}`);
        }
    });
    update_locations();
}

function first_run() {

    let test_section = document.getElementById('test_section');

// add direct lvl increases
    let add_lvl = document.createElement('button');

    test_section.appendChild(add_lvl);
    add_lvl.innerHTML = 'ADD +1 level';
    add_lvl.addEventListener('click', () => {
        
        //// TEMP
        const last_location = locData[locData.length - 1];
        const last_level = last_location.level_data[last_location.level_data.length - 1];
        console.log(saveData.top_loc + '::' + saveData.top_lvl);
        if (saveData.top_loc <= last_location.id) {
            saveData.top_lvl += 1;
            update_locations();
        }
        //console.log(`Location: ${saveData.top_loc}, Level: ${saveData.top_lvl}`);
        
    });


// add kill buttons
    for (let loc = 1; loc <= locData.length; loc++) {
        let location = locData.id;
        let level_data = locData[loc - 1].level_data;
    
        for (let lvl = 1; lvl <= level_data.length; lvl++) {
    
            let addKillButton = document.createElement('button');
            test_section.appendChild(addKillButton);
            addKillButton.id = 'addKillButton_' + loc + '_' + lvl;
            addKillButton.innerText = 'Add LOC' + loc + '_' + lvl + ' kill +1';
            addKillButton.addEventListener('click', () => addKill(loc, lvl));
        }
    }
}

// initilization
document.addEventListener('DOMContentLoaded', () => {
    first_run();
    update_locations();
    //loaded_DOM(); // 'loc_' + location.id + '_lvl_' + lvl + '_span';
    //
});

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
