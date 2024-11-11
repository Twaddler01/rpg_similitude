// database.js

//import { trackingData, init_trackingData } from './data.js';
//import { new_game } from './main.js';

/*
export async function initDatabase() {
    const dbRequest = indexedDB.open('GameDatabase', 1);

    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains('saveStates')) {
            db.createObjectStore('saveStates', { keyPath: 'slotId' });
        }
    };

    dbRequest.onsuccess = async (event) => {
        const db = event.target.result;

        // Open a transaction in readwrite mode
        const transaction = db.transaction(['saveStates'], 'readwrite');
        const store = transaction.objectStore('saveStates');

        try {
            // Fetch the default data (newSaveData.json)
            const response = await fetch('./data/newSaveData.json');
            if (!response.ok) throw new Error('Failed to fetch JSON data');
            const defaultData = await response.json();

            // Filter for "New Game" slots
            const newGameSlots = defaultData.filter(slot => slot.state === "New Game");

            // Insert "New Game" slots into IndexedDB
            newGameSlots.forEach((slot) => {
                const addRequest = store.add(slot);
                addRequest.onsuccess = () => {
                    console.log('Slot added:' + slot);
                };
                addRequest.onerror = (error) => {
                    console.error('Error adding slot:' + error);
                };
            });

            // Wait for the transaction to complete
            transaction.oncomplete = () => {
                console.log('Transaction completed successfully');
            };

            transaction.onerror = (error) => {
                console.error('Transaction failed:' + error);
            };
        } catch (error) {
            console.error('Failed to load default JSON data:' + error);
        }
    };

    dbRequest.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };
}
*/

export function displaySaveSlots() {
    console.log('displaySaveSlots function started');
    const dbRequest = indexedDB.open('GameDatabase', 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['saveStates'], 'readonly');
        const store = transaction.objectStore('saveStates');

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            const slots = getAllRequest.result;
            console.log('Slots retrieved: ');
            console.log(slots);

            if (slots.length === 0) {
                console.log('No slots found in database');
            } else {
                slots.forEach((slot) => {
                    console.log(`Rendering button for slot ${slot.slotId}`);
                    const button = document.createElement('button');
                    button.textContent = `Load Slot ${slot.slotId} - ${slot.state}`;
                    button.onclick = () => loadGame(slot.slotId);
                    document.body.appendChild(button);
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