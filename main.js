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

// **** globals ****

const locationsData = [
    // locationsData[i].kill_req_met: true/false

    { loc: 1, lbl: 'Dark Plains', lvl: 1, kills_req: 3,
    img: 'media/img_loc_1.jpg', }, // l = 0
    { loc: 1, lbl: 'Dark Plains', lvl: 2, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 3, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 4, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 5, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 6, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 7, kills_req: 3 },
    { loc: 1, lbl: 'Dark Plains', lvl: 8, kills_req: 3 },

    { loc: 2, lbl: 'Dark Highlands', lvl: 1, kills_req: 3,
    img: 'media/img_loc_2.jpg', },
    { loc: 2, lbl: 'Dark Highlands', lvl: 2, kills_req: 3 },
    { loc: 2, lbl: 'Dark Highlands', lvl: 3, kills_req: 3 }, // l = 10
    { loc: 2, lbl: 'Dark Highlands', lvl: 4, kills_req: 3 },

    { loc: 3, lbl: 'Dark Forest', lvl: 1, kills_req: 3,
    img: 'media/img_loc_3.jpg', },
    { loc: 3, lbl: 'Dark Forest', lvl: 2, kills_req: 3 },
    { loc: 3, lbl: 'Dark Forest', lvl: 3, kills_req: 3 }, // max = 14

    { loc: 4, lbl: 'END', lvl: 3, kills_req: 99 }, // placeholder
];

// **** multiple scenarios ****

// mid setup
const saveData = [
    { kills: 4 }, // l = 0
    { kills: 3 },
    { kills: 4 },
    { kills: 3 },
    { kills: 4 },
    { kills: 4 },
    { kills: 4 },
    { kills: 6 },
    { kills: 3 },
    { kills: 4 },
    { kills: 0 }, // l = 10
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 }, // max = 14
    { kills: 0 }, // placeholder
];

/*
// new game
const saveData = [
    { kills: 0 }, 
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 },
    { kills: 0 }, 
];
*/

// always trackingData[0]
const trackingData = [
    { loc: 0 },
    { lvl: 0 },
];

const max_location = Math.max(...locationsData.map(loc => loc.loc));

// **** functions ****
function first_run() {

    let test_section = document.getElementById('test_section');

// main container
    let location_container2 = document.createElement('div');
    document.body.appendChild(location_container2);
    location_container2.id = 'location_container2';

// reset saveData
    let reset = document.createElement('button');
    test_section.appendChild(reset);
    reset.innerHTML = 'RESET GAME';
    reset.addEventListener('click', () => {
        reset_game('test_section');
    });

// add 1 kill instantly
/*
    // Create inputs for loc and lvl
    let locInput = document.createElement('input');
    locInput.type = 'number';
    locInput.placeholder = 'Location (loc)';
    test_section.appendChild(locInput);
    
    let lvlInput = document.createElement('input');
    lvlInput.type = 'number';
    lvlInput.placeholder = 'Level (lvl)';
    test_section.appendChild(lvlInput);
    
    // Create the "Add +1 Kill" button
    let add_kill = document.createElement('button');
    add_kill.innerHTML = 'Add +1 Kill';
    test_section.appendChild(add_kill);

    // Attach event listener to button
    add_kill.addEventListener('click', () => {
        const loc = parseInt(locInput.value, 10);
        const lvl = parseInt(lvlInput.value, 10);
    
        if (isNaN(loc) || isNaN(lvl)) {
            alert('Please enter valid numbers for both location and level.');
            return;
        }
    
        // Call addKill function with user inputs
        addKill(loc, lvl);
        update_locations();
    });
*/
// add 1 kill instantly to selected level

    let selected_kill = document.createElement('button');
    test_section.appendChild(selected_kill);
    selected_kill.innerHTML = '+1 Kill to Current Level';
    
    selected_kill.addEventListener('click', () => {
        let message = document.getElementById('message');
        
        if (message) {
            message.innerHTML = '';
        }
        if (trackingData[0].loc !== 0 && trackingData[0].lvl !== 0) {
                locationsData.forEach((item, index) => {
                    //console.log('trackingData[0].loc: ' + trackingData[0].loc);
                    //console.log('locationsData.loc: ' + locationsData[index].loc);
                    if (locationsData[index].loc === trackingData[0].loc && locationsData[index].lvl === trackingData[0].lvl) {
                        //trackingData[0].loc
                        saveData[index].kills += 1;
                        // Update both arrays
                        message.innerHTML = 'Added +1 kill to ' + locationsData[index].lbl + ' (Level ' + locationsData[index].lvl + ')';
                        update_locations();
                        selectLocation(locationsData[index].loc);
                    }
                });
                
        } else {
            message.innerHTML = 'Please select an enemy level.';
        }
        //update_locations();
    });
}

function update_locations() {

    // Main containers
    const location_container2 = document.getElementById('location_container2');

    // Clear any existing elements
    if (location_container2) {
        location_container2.innerHTML = '';
    }
    
    // Update array data
    for (let i = 0; i < locationsData.length; i++) {
        // Insert the kills data from saveData into the corresponding location in locationsData
        locationsData[i].kills = saveData[i].kills;
        
        // Always set first level true
        if (!locationsData[0].kill_req_met) {
            locationsData[0].kill_req_met = true;
        }
        
        // Update kill_req_met based on the kills of previous,level
        // Ensure next index is set to true (if not at end of array) if previous index kills >= kills_req
        if (i + 1 < locationsData.length) {
            locationsData[i + 1].kill_req_met = locationsData[i].kills >= locationsData[i].kills_req;

        }
    }
    //console.log(locationsData[0]);
    //console.log(locationsData[1]);
    //console.log(locationsData[2]);


    // Create locations container
    let locations = document.createElement('div');
    location_container2.appendChild(locations);
    locations.id = 'locations';
    locations.style.display = 'flex';
    
    // Create levels container
    let levels = document.createElement('div');
    location_container2.appendChild(levels);
    levels.id = 'levels';
    
    // Create location status container
    let locations_status = document.createElement('div');
    location_container2.appendChild(locations_status);
    locations_status.id = 'locations_status';

    const message = document.createElement('div');
    test_section.appendChild(message);
    message.id = 'message';
    message.className = 'normal';

    // Create and append location buttons
    for (let i = 1; i <= max_location; i++) {
        let loc_lvl1 = locationsData.find(l => l.loc === i && l.lvl === 1);
        let loc = document.createElement('div');
        loc.id = 'location_div_' + i;
        // Auto select current location/level from trackingData if present
        if (trackingData[0].loc !== 0) {
            let fetched_loc = document.getElementById('location_div_' + trackingData[0].loc);
            if (fetched_loc) {
                fetched_loc.classList.remove('green_border_off');
                fetched_loc.classList.add('green_border_on');
            }
        }
        loc.classList.add('green_border_off');
        let unlocked = isAnyLocationUnlocked(i);
        //console.log(unlocked);
        if (loc_lvl1 && unlocked) {
            locations.appendChild(loc);
            loc.innerHTML = loc_lvl1.lbl;
            let loc_img = document.createElement('img');
            loc.appendChild(loc_img);
            loc_img.style.width = '100px';
            loc_img.style.height = 'auto';
            loc_img.src = loc_lvl1.img;
            let loc_levels = document.createElement('div');
            levels.appendChild(loc_levels);
            loc_levels.id = 'loc_levels';
            loc.addEventListener('click', () => {
                // Clear all green borders
                for (let all = 1; all <= max_location; all++) {
                    let DOM_all_loc_div = document.getElementById('location_div_' + all);
                    if (DOM_all_loc_div) {
                        DOM_all_loc_div.classList.remove('green_border_on');
                        DOM_all_loc_div.classList.add('green_border_off');
                    }
                }
                // Add green border to clicked element
                loc.classList.remove('green_border_off');
                loc.classList.add('green_border_on');
                // WIP need a var for adding a kill without selecting a location
                selectLocation(i);
          
            });
        }
    }
}

function isAnyLocationUnlocked(loc) {
    return locationsData
        .filter(location => location.loc === loc)
        .some(location => location.kill_req_met);
}

function isLocationFullyUnlocked(loc) {
    return locationsData
        .filter(location => location.loc === loc)
        .every(location => location.kill_req_met);
}
// USAGE
// for (let i = 1; i <= max_location; i++) {
//    const fullyUnlocked = isLocationFullyUnlocked(i);
//    console.log(`Location ${i} fully unlocked: ${fullyUnlocked}`);
// }

function selectLocation(location) {
    const levelsContainer = document.getElementById('loc_levels');

    // Clear previous levels if a new location is selected
    levelsContainer.innerHTML = '';

    trackingData[0].currentLocation = location;

    if (trackingData[0].loc !== 0) {
        trackingData[0].currentLocation = trackingData[0].loc;
    }

    // Filter levels based on the selected location and met kill requirements
    const filteredLevels = locationsData.filter(loc => loc.loc === location && loc.kill_req_met);

    // Display levels for the selected location
    filteredLevels.forEach(level => {

        const levelButton = document.createElement('button');
        levelButton.innerHTML = `Level ${level.lvl}`;
        
        if (trackingData[0].loc === level.loc && trackingData[0].lvl === level.lvl) {
            selectLevel(level.loc, level.lbl, level.lvl, level.kills);
        } else {
            levelButton.onclick = () => selectLevel(level.loc, level.lbl, level.lvl, level.kills);
        }
        levelsContainer.appendChild(levelButton);
    });
}

function selectLevel(loc, location, lvl, kills) {
    const locations_status = document.getElementById('locations_status');
    const message = document.getElementById('message');
    
    message.innerHTML = '';
    locations_status.innerHTML = `You selected ${location} Level ${lvl}`;
    locations_status.innerHTML += `<br>Kills: ${kills}`;
    // add to array
    trackingData[0].loc = loc;
    trackingData[0].location = location;
    trackingData[0].lvl = lvl;
    trackingData[0].kills = kills;
    //console.log('SAVE: ');
    //console.log(trackingData[0]);
}

function getMaxLevelsByLocation(locationsData) {
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



/* TEMP
// First, make sure you have the highest level for each location
const max_levels = getMaxLevelsByLocation(locationsData);

// Assume you want to increment kills for a specific loc and lvl
const targetLoc = 1; // Example loc (replace with your desired loc)
const targetLvl = 3; // Example lvl (replace with your desired lvl)

// Iterate through locationsData and increment kills in saveData where loc and lvl match
locationsData.forEach((location, index) => {
    if (location.loc === targetLoc && location.lvl === targetLvl) {
        // Increment kills at the corresponding index in saveData
        saveData[index].kills += 1;
        console.log(`Updated kills for loc ${location.loc}, lvl ${location.lvl}:`, saveData[index].kills);
    }
});
*/

function addKill(loc, lvl) {
    
    const max_levels = getMaxLevelsByLocation(locationsData);

    // Iterate through locationsData and increment kills in saveData where loc and lvl match
    locationsData.forEach((location, index) => {
        if (location.loc === loc && location.lvl === lvl) {
            // Increment kills at the corresponding index in saveData
            saveData[index].kills += 1;
            //console.log(`Updated kills for loc ${location.loc}, lvl ${location.lvl}: ` + saveData[index].kills);
        }
    });
}

// reset gameData
function reset_game(elid) {
    let parent = document.getElementById(elid);
    if (parent) {
        let confirm = document.createElement('span');
        parent.appendChild(confirm);
        confirm.className = 'normal';
        confirm.innerHTML = 'RESET: Are you sure?&nbsp;&nbsp;';
        
        let yes = document.createElement('button');
        test_section.appendChild(yes);
        yes.innerHTML = 'YES';
        yes.addEventListener('click', () => {
            saveData.forEach(item => {
                item.kills = 0;
            });
            parent.removeChild(confirm);
            parent.removeChild(yes);
            parent.removeChild(no);
            update_locations();
        });
        
        let no = document.createElement('button');
        test_section.appendChild(no);
        no.innerHTML = 'NO';
        no.addEventListener('click', () => {
            parent.removeChild(confirm);
            parent.removeChild(yes);
            parent.removeChild(no);
            update_locations();
        });
    
        

    } else {
        console.error('elid "' + elid + '" is invalid for reset_game() function call.');
    }

}

// after DOM initialized
document.addEventListener('DOMContentLoaded', () => {
    first_run();
    update_locations();
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
