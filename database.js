// database.js

import { dbInstance, dbState, new_game, layout_loadTabs, clear_game_elements } from './main.js';
import { create_el } from './functions.js';

export async function loadFirstSlotFromNewSave() {
    try {
        const response = await fetch('./data/newSaveData.json');
        if (!response.ok) {
            throw new Error('Failed to load newSaveData.json');
        }
        const saveData = await response.json();

        if (!Array.isArray(saveData) || saveData.length === 0) {
            throw new Error('newSaveData.json is empty or invalid.');
        }

        const firstSlot = saveData[0]; // Only take the first slot

        const dbRequest = indexedDB.open('GameDatabase', 1);

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;

            // Open a transaction and object store
            const transaction = db.transaction(['saveStates'], 'readwrite');
            const store = transaction.objectStore('saveStates');

            // Add or overwrite slot 1
            const updateRequest = store.put(firstSlot);

            updateRequest.onsuccess = () => {
                console.log('First slot from newSaveData.json successfully loaded.');
            };

            updateRequest.onerror = (event) => {
                console.error('Error updating slot:', event.target.errorCode);
            };
        };

        dbRequest.onerror = (event) => {
            console.error('Error opening database:', event.target.errorCode);
        };
    } catch (error) {
        console.error('Error loading first slot from newSaveData.json:', error);
    }
}

export function displaySaveSlots() {
    //console.log('displaySaveSlots function started');

    // Title
    let e_title = document.getElementById('title_section');
    if (!e_title) {
        create_el('title_section', 'div', 'body');
        title_section.style.fontSize = '20px';
        title_section.innerHTML = '<b>RPG Similitude: Just another RPG.</b>';
    }

    let parent_id = document.getElementById('tab_main');
    if (!parent_id) {
      parent_id = document.body;
    }

    let idb_slots = document.getElementById('idb_slots');
    if (idb_slots) {
        idb_slots.innerHTML = '';
    } else {
        idb_slots = create_el('idb_slots', 'div', parent_id);
        idb_slots.classList.add('location_box_style');
    }

    const dbRequest = indexedDB.open('GameDatabase', 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['saveStates'], 'readonly');
        const store = transaction.objectStore('saveStates');

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            const slots = getAllRequest.result;
            //console.log('Slots retrieved: ');
            //console.log(slots);

            if (slots.length === 0) {
                console.log('No slots found in database');
            } else {
                //let e_idb_slots = document.getElementById('idb_slots');
                idb_slots.innerHTML = '<p><b>CHOOSE A SLOT</b></p>';

                slots.forEach((slot, index) => {

                    let slot_container_div = document.createElement('div');
                    idb_slots.appendChild(slot_container_div);

                    let slot_id = document.createElement('span');
                    slot_container_div.appendChild(slot_id);
                    slot_id.innerHTML = 'SLOT' + slot.slotId + ':&nbsp;';
                    let pname = document.createElement('span');
                    slot_container_div.appendChild(pname);
                    let plevel = document.createElement('span');
                    slot_container_div.appendChild(plevel);
                    if (slot.data?.savedCharacterData?.[0]?.char_name !== null) {
                      // Display char_name/char_level from savedCharacterData
                      pname.innerHTML = slot.data?.savedCharacterData?.[0]?.char_name + '&nbsp;';
                      plevel.innerHTML = '(Level ' + slot.data?.savedCharacterData?.[0]?.char_level + ')&nbsp;';
                    } else {
                      pname.innerHTML = '[ EMPTY ]&nbsp;';
                    }
                    const button = document.createElement('button');
                    if (slot.slotId === dbState.slot_selected) {
                        slot_container_div.style.color = 'yellow';
                        slot_container_div.style.fontWeight = 'bold';
                        plevel.innerHTML += '- LOADED -';
                    } else {
                        button.textContent = slot.state;
                        button.onclick = () => loadGame(slot.slotId, slot);
                        slot_container_div.appendChild(button);
                    }

                    // To clear a slot
                    if (slot.data?.savedCharacterData?.[0]?.char_name !== null) {
                        let spacer = document.createElement('span');
                        slot_container_div.appendChild(spacer);
                        spacer.innerHTML = '&nbsp;';
                        let delete_btn = document.createElement('button');
                        delete_btn.innerHTML = 'X';
                        slot_container_div.appendChild(delete_btn);

                        function delete_slot_confirm(slotNum) {
                            slot_container_div.style.color = 'red';
                            slot_container_div.innerHTML = 'Are you sure you want to delete all of the data for <b>SLOT ' + slotNum + '</b>? THIS ACTION CANNOT BE UNDONE! ';

                            create_el('con_yes', 'button', slot_container_div);
                            con_yes.innerHTML = 'YES';
                            con_yes.onclick = () => delete_slot(slotNum);

                            create_el('con_no', 'button', slot_container_div);
                            con_no.innerHTML = 'NO';
                            con_no.onclick = () => displaySaveSlots();
                        }

                        // Delete slot
                        // load slotId 1 from saveTemplate.json and replace slotNum with this saveTemplate data
                        function delete_slot(slotNum) {
                            // Fetch the template data
                            fetch('./data/saveTemplate.json')
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error('Failed to load saveTemplate.json');
                                    }
                                    return response.json();
                                })
                                .then((templateData) => {
                                    // Extract the first slot from the template
                                    const firstSlotTemplate = templateData[0];

                                    if (!firstSlotTemplate) {
                                        throw new Error('Template is empty or invalid.');
                                    }

                                    // Open the IndexedDB connection
                                    const dbRequest = indexedDB.open('GameDatabase', 1);

                                    dbRequest.onsuccess = (event) => {
                                        const db = event.target.result;

                                        // Open a transaction and access the store
                                        const transaction = db.transaction(['saveStates'], 'readwrite');
                                        const store = transaction.objectStore('saveStates');

                                        // Retrieve the slot to update
                                        const getSlotRequest = store.get(slotNum);

                                        getSlotRequest.onsuccess = () => {
                                            const slot = getSlotRequest.result;

                                            if (slot) {
                                                // Update the slot's data with the first slot from the template
                                                slot.data = firstSlotTemplate.data;
                                                slot.state = firstSlotTemplate.state;

                                                const updateRequest = store.put(slot);

                                                updateRequest.onsuccess = () => {
                                                    console.log(`Slot ${slotNum} cleared and updated with template.`);
                                                    // Refresh the UI
                                                    if (dbState.slot_selected === slotNum) {
                                                        dbState.slot_selected = null;
                                                        clear_game_elements();
                                                    }
                                                    displaySaveSlots();
                                                };

                                                updateRequest.onerror = (event) => {
                                                    console.error('Error updating slot:', event.target.errorCode);
                                                };
                                            } else {
                                                console.error(`Slot ${slotNum} not found.`);
                                            }
                                        };

                                        getSlotRequest.onerror = (event) => {
                                            console.error('Error retrieving slot:', event.target.errorCode);
                                        };
                                    };

                                    dbRequest.onerror = (event) => {
                                        console.error('Error opening database in delete_slot:', event.target.errorCode);
                                    };
                                })
                                .catch((error) => {
                                    console.error('Error loading saveTemplate.json:', error);
                                });
                        }
                        delete_btn.onclick = () => delete_slot_confirm(slot.slotId);
                    }

                });
            }
        };

        getAllRequest.onerror = (event) => {
            console.error('Error retrieving slots:', event.target.errorCode);
        };
    };

    dbRequest.onerror = (event) => {
        console.error('Error opening database in displaySaveSlots:', event.target.errorCode);
    };
}

// Load 'data' from database to determine new or existing data
export function loadGame(slotNum, slot) {

  dbState.slot_selected = slotNum;

  // If data is for an existing game
  if (slot.state === 'Load Game') {
    console.log('Loaded game... ' + JSON.stringify(slot,2,null));
    dbState.game_type_load = true;
  // If data is for a new game
  } else {
    console.log('New Game... ' + JSON.stringify(slot,2,null));
    dbState.game_type_load = false;
  }

  new_game();

}

// Generic function to handle updates to the database
export function updateSlotData(slotId, section, newValues) {
    const dbRequest = indexedDB.open('GameDatabase', 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;

        // Open a transaction in readwrite mode
        const transaction = db.transaction(['saveStates'], 'readwrite');
        const store = transaction.objectStore('saveStates');

        // Retrieve the slot by its slotId
        const getSlotRequest = store.get(slotId);

        getSlotRequest.onsuccess = () => {
            const slot = getSlotRequest.result;

            if (slot) {
                if (section === 'state') {
                    // Update the "state" directly
                    slot.state = newValues;
                } else if (section in slot.data) {
                    // Dynamically update any section in slot.data
                    slot.data[section] = newValues;
                } else {
                    console.error(`Section "${section}" not found in slot data.`);
                    return;
                }

                // Save the updated slot back to the store
                const updateRequest = store.put(slot);

                updateRequest.onsuccess = () => {
                    //console.log(`Slot ${slotId} successfully updated in section "${section}".`);
                };

                updateRequest.onerror = (event) => {
                    console.error('Error updating slot:', event.target.errorCode);
                };
            } else {
                console.error(`Slot with slotId ${slotId} not found.`);
            }
        };

        getSlotRequest.onerror = (event) => {
            console.error('Error retrieving slot:', event.target.errorCode);
        };
    };

    dbRequest.onerror = (event) => {
        console.error('Error opening database in updateSlotData:', event.target.errorCode);
    };
}
/*
const newCharacterData = [
    {
        char_name: "Aragorn",
        char_race: "Human",
        char_class: "Ranger",
        char_level: 5,
        char_exp: 1200
    }
];
updateSlotData(2, 'savedCharacterData', newCharacterData);
*/

export function getSlotData(slotId, section) {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open('GameDatabase', 1);

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;

            // Open a transaction in readonly mode
            const transaction = db.transaction(['saveStates'], 'readonly');
            const store = transaction.objectStore('saveStates');

            // Retrieve the slot by its slotId
            const getSlotRequest = store.get(slotId);

            getSlotRequest.onsuccess = () => {
                const slot = getSlotRequest.result;

                if (slot) {
                    if (section === 'state') {
                        // Return the "state" directly
                        resolve(slot.state);
                    } else if (section in slot.data) {
                        // Dynamically return any section in slot.data
                        const data = slot.data[section];
                        resolve(data);
                    } else {
                        reject(new Error(`Section "${section}" not found in slot data.`));
                    }
                } else {
                    reject(new Error(`Slot with slotId ${slotId} not found.`));
                }
            };

            getSlotRequest.onerror = (event) => {
                reject(new Error('Error retrieving slot: ' + event.target.errorCode));
            };
        };

        dbRequest.onerror = (event) => {
            reject(new Error('Error opening database in getSlotData: ' + event.target.errorCode));
        };
    });
}
/*
// Get 'state' only
getSlotData(2, 'state')
    .then((state) => {
        console.log('Game State:', state);
    })
    .catch((error) => {
        console.error(error.message);
    });
// Get 'killsData' or other sections
getSlotData(1, 'killsData')
    .then((killsData) => {
        console.log('Kills Data:', killsData);
    })
    .catch((error) => {
        console.error(error.message);
    });
// Use with await in functions
async function displayCharacterData(slotId) {
    try {
        const characterData = await getSlotData(slotId, 'savedCharacterData');
        const charName = characterData[0]?.char_name || 'Unknown';
        console.log('Character Name:', charName);
    } catch (error) {
        console.error(error.message);
    }
}
displayCharacterData(3);
*/

//DEBUG
/*
console.log('before equippedItems');
let equippedItems;
try {
    equippedItems = await d.getSlotData(dbState.slot_selected, 'equippedData');
} catch (error) {
    console.error('Error fetching equipped items:' + error);
    return; // Exit if it fails
}
console.log(JSON.stringify(equippedItems));
*/

/*
// REPLACE forEach with aysnc data
    for (const stat of filtered_battleStats) {
        // Output
        let stats_effect = `<span style="color:lightgreen">(Base)</span>`;

        // Player mh weapon
        const current_weapon = equipped_items.find(i => i.id === 'mh');
        console.log(`Stat: ${stat.name}, Current Weapon: ${current_weapon ? current_weapon.name : 'None'}`);
    }
*/
