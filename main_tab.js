// main_tab.js

import { trackingData, init_trackingData } from './data.js';
import { clearSaveData, create_el, downloadSaveData } from './functions.js';
import { new_game } from './main.js';
//import { displaySaveSlots } from './database.js';

// Setup elements and run functions
export function init_main_tab() {
    let e_tab_main = document.getElementById('tab_main');
    e_tab_main.innerHTML = `
          <p><b>GAME OPTIONS</b></p>
          <div id="new_game_div"></div>
          <p><b>LOAD</b></p>
          <div id="load_JSON_text"></div>
          <p><b>SAVE</b></p>
          <div id="save_JSON"></div>

          <p><b>IndexedDB</b></p>
          <div id="idb"></div>

        `;
    new_game_btn();
    load_game_from_text();
    
    // IDB
    //displaySaveSlots();
}

// Reset to new game
function new_game_btn() {
    let e_new_game_div = document.getElementById('new_game_div');
    let new_game_btn = document.createElement('button');
    e_new_game_div.appendChild(new_game_btn);
    new_game_btn.innerHTML = 'NEW GAME';
    new_game_btn.addEventListener('click', () => {
        // Reset trackingData
        trackingData.length = 0;
        init_trackingData();
        // Flag as second run since doc loaded
        trackingData[0].init_run = false;
        
        async function new_game_async() {
            await clearSaveData();
            new_game();
        }
        new_game_async();
    });
}

// Load game from JSON
// May require node.js to choose files

// Import saveData from textarea
function load_game_from_text() {

    // HELPER - Prcess JSON data
    function resetSaveData(newArray) {
        try {
            saveData.length = 0;
            const parsedData = JSON.parse(newArray);
            parsedData.forEach(item => saveData.push(item));
            
            // Reset starting inventory flag
            let savedInventory = saveData[2].inventoryData;
            savedInventory[0].setup = true
            console.log('saveData successfully overwritten:', saveData);
        } catch (error) {
            console.error('Error parsing or overwriting saveData:', error);
        }
    }

    let e_load_JSON_text = document.getElementById('load_JSON_text');
    create_el('importSaveBtn', 'button', e_load_JSON_text);
    importSaveBtn.innerHTML = 'Import SaveData';
    create_el('savedata_section', 'div', e_load_JSON_text);
    
    importSaveBtn.addEventListener('click', () => {
        let import_save_container = document.getElementById('import_save_container');
        if (!import_save_container) {
            import_save_container = document.createElement('div');
            savedata_section.appendChild(import_save_container);
            import_save_container.id = 'import_save_container';
            create_el('ta_box', 'textarea', import_save_container);
            ta_box.rows = 10;
            ta_box.style.width = '100%';
            create_el('submit_import_save', 'button', import_save_container);
            submit_import_save.innerHTML = 'SUBMIT';
            create_el('reset_import_save', 'button', import_save_container);
            reset_import_save.innerHTML = 'RESET';
            
            reset_import_save.addEventListener('click', () => { ta_box.value = '' });
        
            submit_import_save.addEventListener('click', () => {
                const taData = ta_box.value;
                resetSaveData(taData);
                console.log(saveData);
            });
        } else {
            savedata_section.innerHTML = '';
        }
    });
    
    let e_save_JSON = document.getElementById('save_JSON');
    create_el('export_save', 'button', e_save_JSON);
    export_save.innerHTML = 'Export saveData';
    export_save.addEventListener('click', () => {
        downloadSaveData();
    });
}