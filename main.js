// main.js

import { equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, trackingData, init_trackingData } from './data.js';
import * as f from  './functions.js';
import * as gf from './general_functions.js';
import * as ch from './character.js';
import * as inv from './inventory.js';
import * as g from './gather.js';
import * as e from './equipment.js';
import * as b from './battle.js';
import * as m from './main_tab.js';
import * as d from './database.js';
//`

// DEBUGGING INFO

gf.logExport();
gf.htmlExport();

// DB FLAG
export const dbState = {
    slot_selected: null,
    game_type_load: null
};

async function test_JSON() {

    const response = await fetch('test.json');
    const parsedData = await response.json();
    parsedData.forEach(item => {
        console.log(item);
    });
}
//test_JSON();

export var dbInstance = null; // Global variable for the database instance
export const dbReady = initDatabase(); // Global promise for database readiness
// Function to initialize the database
function initDatabase() {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            dbInstance.close();
            console.log('Closed existing database connection');
        }

        const dbRequest = indexedDB.open('GameDatabase', 1);

        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('saveStates')) {
                db.createObjectStore('saveStates', { keyPath: 'slotId' });
                console.log('saveStates object store created');
            }
        };

        dbRequest.onsuccess = async (event) => {
            dbInstance = event.target.result;
            dbInstance.onversionchange = () => {
                dbInstance.close();
                console.log('Database connection closed due to version change');
            };

            try {
                const transaction = dbInstance.transaction(['saveStates'], 'readonly');
                const store = transaction.objectStore('saveStates');

                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = async () => {
                    const existingSlots = getAllRequest.result;

                    if (existingSlots.length > 0) {
                        //console.log('Database already contains data. No new data loaded.');
                        resolve();
                        return; // Exit early since data already exists
                    }

                    //console.log('Database is empty. Loading newSaveData.json...');
                    const response = await fetch('./data/newSaveData.json');
                    if (!response.ok) throw new Error('Failed to fetch JSON data');
                    const jsonData = await response.json();

                    // Write slots from JSON only if the database is empty
                    const writeTransaction = dbInstance.transaction(['saveStates'], 'readwrite');
                    const writeStore = writeTransaction.objectStore('saveStates');

                    jsonData.forEach(slot => {
                        writeStore.add(slot);
                    });

                    writeTransaction.oncomplete = () => {
                        console.log('Initial data loaded into database.');
                        resolve();
                    };

                    writeTransaction.onerror = (error) => {
                        console.error('Error writing initial data:', error);

                        // Check if this is the first error (using a flag stored in sessionStorage)
                        if (!sessionStorage.getItem('dbReloaded')) {
                            console.log('Reloaded the page due to an error.');
                            sessionStorage.setItem('dbReloaded', 'true');
                            location.reload(); // Reload the page
                        } else {
                            console.error('Reload already attempted. Not reloading again. This error can occur if using private or "incognito" browsing mode. Please try again in a regular browser window.');
                            reject(error); // Reject the promise if reload is not attempted
                        }
                    };
                };

                getAllRequest.onerror = (error) => {
                    console.error('Error checking existing data:', error);
                    reject(error);
                };
            } catch (error) {
                console.error('Failed to initialize database:', error);
                reject(error);
            }
        };

        dbRequest.onerror = (event) => {
            console.error('Error initializing database:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

// Call `initDatabase`, then call `displaySaveSlots` after init completes
initDatabase()
    .then(() => {
        //d.displaySaveSlots(); // Run displaySaveSlots first

        // Use test data instead (comment out displaySaveSlots call)
        function use_test_data() {
            d.loadFirstSlotFromNewSave();
            dbState.game_type_load = true;
            dbState.slot_selected = 1;
            new_game();
        }
        use_test_data();
    })
    .catch(error => console.error('Initialization error: ' + error));

// Add array updates
f.load_items();
init_trackingData();
f.setup_encounters(1);
//console.log(JSON.stringify(encounterData, null, 2));

export function clear_game_elements() {
    let all_el = document.querySelectorAll('body, body *');
    let filteredEl = Array.from(all_el).filter(e => e.id !== 'js-console' && e.id !== 'exportButton' && e.id !== 'exportHTMLButton');

    filteredEl.forEach(el => {
        if (el.id) {
            el.remove();
        }
    });
}

export async function new_game() {

    clear_game_elements();

    // Title
    const title_section = f.create_el('title_section', 'div', 'body');
    title_section.style.fontSize = '20px';
    title_section.innerHTML = '<b>RPG Similitude: Just another RPG.</b>';

    let e_new_content = document.getElementById('new_content');
    if (e_new_content) {
      e_new_content.remove();
    }


    const new_character_container = f.create_el('new_character_container', 'div', 'body');
    new_character_container.classList.add('location_box_style');
    new_character_container.style.paddingBottom = '40px';

    // To remove elements from character creation
    function del_new_character_container() {
        let new_character_container = document.getElementById('new_character_container');
        new_character_container.parentNode.removeChild(new_character_container);
    }


    // New game, setup character data
    if (!dbState.game_type_load) {

        let e_new_content = document.getElementById('new_content');
        if (e_new_content) {
            e_new_content.remove();
        }

        // Create new character
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
                if (charName === '') {
                    charName = 'John Doe';
                    charRace = 'Human';
                    charClass = 'Fighter';
                }
                const updatedCharacterData = [ {
                    char_name: charName,
                    char_race: charRace,
                    char_class: charClass,
                    char_level: 1,
                    char_exp: 0
                } ];

                // Update the character data in the database
                d.updateSlotData(dbState.slot_selected, 'state', 'Load Game');
                d.updateSlotData(dbState.slot_selected, 'savedCharacterData', updatedCharacterData);

                new_char_entry.innerHTML = '';
                // flag character as created
                dbState.game_type_load = true;
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

// Setup new game layout
function start_game() {

    layout_loadTabs();

    function load_starting_elements() {
        //f.add_test_section();
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

// Setup tab layout
export async function layout_loadTabs() {

    // Find the title_section element
    const title_section = document.getElementById('title_section');

    let e_new_content = document.getElementById('new_content');
    if (e_new_content) {
        e_new_content.remove();
    }
    let new_content = document.createElement('div');
    new_content.id = 'new_content';
    title_section.insertAdjacentElement('afterend', new_content);
    new_content.innerHTML = `
    <div style="position: relative;">
      <div id="scrollable-container">
        <div id="game_messages_lbl"><b>MESSAGES</b></div>
          <div id="game_messages">Welcome to RPG Similitude!</div>
        </div>
      <div id="scroll-gradient"></div>
    </div>

    <div id="playerInfo_div" style="border: 1px solid #ccc; padding: 5px;">
      <div id="playerInfo_name"><b>noname</b></div>
      <div id="playerInfo_level">Level nolevel norace noclass</div>
    </div>

    <div class="tab-wrapper">
      <div class="tab-container">
        <div class="tab" onclick="showTabContent(1)">MAIN</div>
        <div class="tab" onclick="showTabContent(2)">EQUIPMENT</div>
        <div class="tab" onclick="showTabContent(3)">STATS</div>
        <div class="tab" onclick="showTabContent(4)">INVENTORY</div>
        <div class="tab" onclick="showTabContent(5)">BATTLE</div>
        <div class="tab" onclick="showTabContent(6)">GATHER</div>
        <div class="tab" onclick="showTabContent(7)">Tab 7</div>
      </div>
    </div>
    <div id="content-container">
      <div id="tab_main" class="location_box_style"></div>
      <div id="tab_player_equipment" class="location_box_style"></div>
      <div id="tab_player_stats" class="location_box_style"></div>
      <div id="tab_player_inventory" class="location_box_style" style="background:black"></div>
      <div id="tab_player_battle"></div>
      <div id="tab_player_gather" class="location_box_style"></div>
      <!-- <div id="tab_7" class="location_box_style"></div> -->
    </div>
    `;

    // Display player info

    // OLD... let d_char = saveData[1].savedCharacterData[0];
    // Only has 1 index at 0
    let d_savedCharacterData = await d.getSlotData(dbState.slot_selected, 'savedCharacterData');
    let d_char = d_savedCharacterData[0];
    let playerInfo_name = document.getElementById('playerInfo_name');
    playerInfo_name.innerHTML = '<b>' + d_char.char_name + '</b>';
    let playerInfo_level = document.getElementById('playerInfo_level');
    playerInfo_level.innerHTML = 'Level ' + d_char.char_level + '&nbsp;' + d_char.char_race + '&nbsp;' + d_char.char_class;

    // Message scrolling behavior
    const container = document.getElementById("scrollable-container");
    const gradient = document.getElementById("scroll-gradient");

    container.addEventListener("scroll", () => {
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

      if (isAtBottom) {
        gradient.style.opacity = "0"; // Hide gradient when at the bottom
      } else {
        gradient.style.opacity = "1"; // Show gradient when scrolling up
      }
    });

    // Attach showTabContent to the window to ensure global accessibility
    window.showTabContent = async function(tabNumber) {
      const contentContainer = document.getElementById("content-container");

      // Clear previous content
      if (contentContainer) {
        contentContainer.innerHTML = "";
      }
      // Remove active class from all tabs
      document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
      });

      // Set the clicked tab as active
      const activeTab = document.querySelector(`.tab:nth-child(${tabNumber})`);
      activeTab.classList.add("active");

      // TAB 1 on page load
      // Generate content for each tab
      if (tabNumber === 1) {
        const tab0Content = document.createElement("div");
        tab0Content.innerHTML = `
          <div id="tab_main" class="location_box_style"></div>
        `;
        contentContainer.appendChild(tab0Content);
        // Load main
        m.init_main_tab();
      } else if (tabNumber === 2) {
        const tab1Content = document.createElement("div");
        tab1Content.innerHTML = `
          <div id="tab_player_equipment" class="location_box_style"></div>
        `;
        contentContainer.appendChild(tab1Content);
        // Load character equipment
        ch.update_character();
      } else if (tabNumber === 3) {
        const tab2Content = document.createElement("div");
        tab2Content.innerHTML = `
          <div id="tab_player_stats" class="location_box_style"></div>
        `;
        contentContainer.appendChild(tab2Content);
        // Load character stats
        e.update_stats();
      } else if (tabNumber === 4) {
        const tab3Content = document.createElement("div");
        tab3Content.innerHTML = `
          <div id="tab_player_inventory" class="location_box_style" style="background:black"></div>
        `;
        contentContainer.appendChild(tab3Content);
        // Load inventory
        inv.update_inventory();
      } else if (tabNumber === 5) {
        const tab4Content = document.createElement("div");
        tab4Content.innerHTML = `
          <div id="tab_player_battle"></div>
        `;
        contentContainer.appendChild(tab4Content);
        // Load battle/location elements
        b.reset_battle();
      } else if (tabNumber === 6) {
        const tab5Content = document.createElement("div");
        tab5Content.innerHTML = `
          <div id="tab_player_gather" class="location_box_style"></div>
        `;
        contentContainer.appendChild(tab5Content);
        // Load gather elements
        g.update_gather();
    } else {
        // Other tab content can be handled here if needed
        const otherContent = document.createElement("div");
        otherContent.textContent = `Content for Tab ${tabNumber}`;
        contentContainer.appendChild(otherContent);
      }


    };
    // Load default tab first
    showTabContent(1);
}

// Temporarily change background color and disable onclick for elements with the "tab" class
export function disableTabs() {
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach((tab) => {
    // Change background color
    tab.style.backgroundColor = 'black';

    // Temporarily store the original onclick function
    tab.dataset.originalOnClick = tab.getAttribute('onclick');

    // Disable the onclick event by removing it
    tab.removeAttribute('onclick');
  });
}

// Restore original background color and re-enable onclick for elements with the "tab" class
export function restoreTabs() {
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach((tab) => {
    // Restore background color (set it to empty if you want it to revert to CSS styling)
    tab.style.backgroundColor = '';

    // Restore the onclick function
    if (tab.dataset.originalOnClick) {
      tab.setAttribute('onclick', tab.dataset.originalOnClick);
      delete tab.dataset.originalOnClick;
    }
  });
}
