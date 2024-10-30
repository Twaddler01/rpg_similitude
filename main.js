// main.js

import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, saveData, gatherData, init_gatherData, trackingData, init_trackingData } from './data.js';
import * as f from  './functions.js';
import * as gf from './general_functions.js';
import * as ch from './character.js';
import * as inv from './inventory.js';
import * as g from './gather.js';
//`

// DEBUGGING INFO

gf.logExport();
gf.htmlExport();

// Add array updates
init_gatherData();
init_trackingData();
f.setup_encounters(1);


new_game();

function new_game() {

    let all_el = document.querySelectorAll('body, body *');
    let filteredEl = Array.from(all_el).filter(e => e.id !== 'js-console' && e.id !== 'exportButton' && e.id !== 'exportHTMLButton');
    
    filteredEl.forEach(el => {
        if (el.id) {
            //console.log(el.id);
            el.remove();
        }
    });

// Title
f.create_el('title_section', 'div', 'body');
title_section.classList.add('h1');
title_section.innerHTML = 'RPG Similitude: Just another RPG.';

f.create_el('new_character_container', 'div', 'body');
new_character_container.classList.add('location_box_style');
new_character_container.style.paddingBottom = '40px';

let d_character = saveData[1].savedCharacterData[0];

// Check and flag if character is created or not
if (d_character.char_name && d_character.char_race && d_character.char_class) {
    d_character.char_created = true;
} else {
    d_character.char_created = false;
}

// To remove elements from character creation
function del_new_character_container() {
    let e_new_character_container = document.getElementById('new_character_container');
    new_character_container.parentNode.removeChild(new_character_container);
}

// New game, setup character data
if (!d_character.char_created) {

    // Create new chatacter
    let new_char_entry = document.createElement('div');
    new_character_container.appendChild(new_char_entry);
        
    let character_entry = document.createElement('span');
    new_char_entry.appendChild(character_entry);
    character_entry.classList.add('location_box_style');
    character_entry.innerHTML = '<p><b>CREATE A NEW CHARACTER:</b></p>';
        
    let input_name_lbl = document.createElement('div');
    new_char_entry.appendChild(input_name_lbl);
    input_name_lbl.innerHTML = 'Name of Character:';
            
    let input_name = document.createElement('input');
    input_name.placeholder = 'Enter character name';
    new_char_entry.appendChild(input_name);
            
    let input_race_lbl = document.createElement('div');
    new_char_entry.appendChild(input_race_lbl);
    input_race_lbl.innerHTML = 'Character Race:';
            
    let input_race = document.createElement('input');
    input_race.placeholder = 'Enter character race';
    new_char_entry.appendChild(input_race);
            
    let input_class_lbl = document.createElement('div');
    new_char_entry.appendChild(input_class_lbl);
    input_class_lbl.innerHTML = 'Character Class:';
            
    let input_class = document.createElement('input');
    input_class.placeholder = 'Enter character class';
    new_char_entry.appendChild(input_class);
            
    let submit_btn = document.createElement('button');
    new_char_entry.appendChild(submit_btn);
    submit_btn.innerHTML = 'SUBMIT';
    submit_btn.addEventListener('click', () => {
        let charName = input_name.value;
        let charRace = input_race.value;
        let charClass = input_class.value;
    
        let confirm_div = document.createElement('div');
        new_char_entry.appendChild(confirm_div);
    
        let print_input = document.createElement('div');
        confirm_div.appendChild(print_input);
        print_input.innerHTML = `Your name is ${charName} and you are a ${charRace} ${charClass}. Confirm?`;
    
        let confirm_yes = document.createElement('button');
        confirm_div.appendChild(confirm_yes);
        confirm_yes.innerHTML = 'YES';
        confirm_yes.addEventListener('click', () => {
            saveData[1].savedCharacterData[0].char_name = charName;
            saveData[1].savedCharacterData[0].char_race = charRace;
            saveData[1].savedCharacterData[0].char_class = charClass;
            new_char_entry.innerHTML = '';
            // flag character as created
            d_character.char_created = true;
            del_new_character_container();
            start_game();
        });
    
        let confirm_no = document.createElement('button');
        confirm_div.appendChild(confirm_no);
        confirm_no.innerHTML = 'NO';
        confirm_no.addEventListener('click', () => {
            confirm_div.innerHTML = '';
            input_name.value = '';
            input_race.value = '';
            input_class.value = '';
            return;
        });
    });

} else {
    trackingData[0].char_was_loaded = true;
    del_new_character_container();
    start_game();
}

} // END new_game()

// Start main game area
function start_game() {

    // Add main elements
    gf.add_allElements();

    function load_starting_elements() {
        f.first_run();
        f.update_equipment();
        ch.update_character_stats(true);
        f.update_locations();
        inv.update_inventory();
        gf.add_section_clicks();
        g.update_gather();
    }
    
    async function load_starting_elements_async() {
        await f.clearSaveData();
        load_starting_elements();
    }

    // after DOM initialized, but only if character loaded immediately
    if (trackingData[0].char_was_loaded) {
        document.addEventListener('DOMContentLoaded', () => {
            load_starting_elements();
        });
    // If game was reset by user
    } else if (!trackingData[0].init_run) {
        // Use new data with JSON
        load_starting_elements();
    // New character, no reset, load from JSON
    } else {
        load_starting_elements_async();
    }
}

let test_section = document.getElementById('test_section');

// WIP new game
let new_game_btn = document.createElement('button');
test_section.appendChild(new_game_btn);
new_game_btn.innerHTML = 'new_game()';
new_game_btn.addEventListener('click', () => {
    // Reset trackingData
    trackingData.length = 0;
    init_trackingData();
    // Flag as second run since doc loaded
    trackingData[0].init_run = false;

    async function new_game_async() {
        await f.clearSaveData();
        new_game();
    }
    new_game_async();
});

/*f.create_el('test_bar_btn', 'button', test_section);
test_bar_btn.innerHTML = 'BAR TEST';
let skillBar = f.create_bar_elements('test_bar_0', 'test_section', 'AMOUNT', 200, 'green');
let progress = 200;
test_bar_btn.addEventListener('click', () => {
    progress -= 10;
    skillBar.updateValue(progress);
});*/







/*
// Function to load saveData asynchronously
async function loadSaveData() {
    const response = await fetch('newSaveData.json');
    const data = await response.json();
    saveData = data;
    console.log('saveData loaded:', saveData);
}

// Make load_starting_elements async so we can await data loading
async function load_starting_elements() {
    // Load saveData first
    await loadSaveData();

    // Now proceed with the rest of the initial setup
    f.first_run();
    f.update_locations();  // Now saveData should be available
    inv.update_inventory();
    gf.add_section_clicks();
}

// Call the load_starting_elements function when needed
load_starting_elements();
*/

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