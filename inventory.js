// inventory.js

import { equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, trackingData } from './data.js';
import * as gf from './general_functions.js';
import * as ch from './character.js';
import { create_el, add_message } from './functions.js';
import { update_battleStats } from './equipment.js';
import * as d from './database.js'
import { dbState } from './main.js';

// Track slots clicked
export const inventorySlot = { clicked: null };

let selectedSlot = null;
const inventorySlotListeners = {};
export async function update_inventory() {

    // Reset elements
    let e_tab_player_inventory = document.getElementById('tab_player_inventory');
    if (e_tab_player_inventory) {
        e_tab_player_inventory.innerHTML = '';
    }

    // Clear all previous event listeners first
    Object.keys(inventorySlotListeners).forEach(slot_id => {
        removeInventorySlotListener(slot_id);  // Remove old listeners
    });
    // Clear the object after removing listeners
    Object.keys(inventorySlotListeners).forEach(slot_id => {
        delete inventorySlotListeners[slot_id];
    });

    //OLD let savedInventory = saveData[2].inventoryData;
    let savedInventory = await d.getSlotData(dbState.slot_selected, 'inventoryData');
    let savedInventorySlots = savedInventory.filter(i => i.type === 'slot');
    let d_inventoryElements = inventoryElements.filter(i => i.type === 'slot');

// Fix corrupt inventory
/*
console.log(JSON.stringify(savedInventory));
const newInventory = [
    {"setup":true,"full":false},{"type":"slot","slot_id":1,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":2,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":3,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":4,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":5,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":6,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":7,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":8,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":9,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":10,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":11,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":12,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":13,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":14,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":15,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":16,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":17,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":18,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":19,"contents":"[ EMPTY ]","cnt":0},{"type":"slot","slot_id":20,"contents":"[ EMPTY ]","cnt":0}
];
await d.updateSlotData(dbState.slot_selected, 'inventoryData', newInventory);
*/

    // setup inventory
    let inv_parent = document.createElement('div');
    inv_parent.classList.add('inv_parent');
    inv_parent.id = 'inventory_parent';
    // new
    e_tab_player_inventory.appendChild(inv_parent);

    savedInventorySlots.forEach((slot_data, index)  => {

        let d_itemData = itemData.find(i => i.id === slot_data.contents);

        let slot_container = document.createElement('div');
        inv_parent.appendChild(slot_container);
        slot_container.id = 'inventory_slot_container_' + slot_data.slot_id;
        slot_container.classList.add('inv_slot_container');
        d_inventoryElements[index].e_slot_container = slot_container.id;

        // append with zIndex: 2
        let slot_img = document.createElement('img');
        slot_container.appendChild(slot_img);
        slot_img.id = 'inventory_slot_img_' + slot_data.slot_id;
        slot_img.classList.add('new_slot_img');
        if (d_itemData) {
            slot_img.src = d_itemData.img;
            slot_img.style.display = 'block';
        }
        d_inventoryElements[index].e_slot_img = slot_img.id;

        // append inv_slot_counter ÷> z-index: 3
        let slot_counter = document.createElement('div');
        slot_container.appendChild(slot_counter);
        slot_counter.id = 'inventory_slot_counter_' + slot_data.slot_id;
        slot_counter.classList.add('normal', 'inv_slot_counter');
        d_inventoryElements[index].e_slot_counter = slot_counter.id;
        if (slot_data.contents !== '[ EMPTY ]' && slot_data.cnt > 1) {
            slot_counter.innerHTML = slot_data.cnt;
        }

        function inventorySlotClicks() {
            handleSlotClick(slot_container, slot_img, slot_counter, slot_data, d_inventoryElements, savedInventory);
            inventorySlot.clicked = slot_data.slot_id;
        }
        slot_container.addEventListener('click', inventorySlotClicks);

        // Store the listener in the global object using the slot ID
        inventorySlotListeners[slot_data.slot_id] = inventorySlotClicks;

    });

    let currency_area = document.createElement('div');
    inv_parent.appendChild(currency_area);
    currency_area.id = 'currency_area';
    currency_area.style.padding = '5px';

    await update_gold();

    // insert test items
    if (!savedInventory[0].setup) {
        updateLootCount('TOOTH', 1);
        updateLootCount('TOOTH', 1);
        updateLootCount('BASIC_HELMET', 1);
        updateLootCount('BETTER_BOOTS', 1);
        updateLootCount('CLOTH_BASIC', 2);
        updateLootCount('CLOTH_BASIC', 1);
        updateLootCount('BASIC_GLOVES', 1);
        savedInventory[0].setup = true;
    }
}

// Function to remove the event listener by slot_id
export function removeInventorySlotListener(slot_id) {
    const slot_container = document.getElementById('inventory_slot_container_' + slot_id);

    if (slot_container && inventorySlotListeners[slot_id]) {
        // Remove the event listener using the stored function reference
        slot_container.removeEventListener('click', inventorySlotListeners[slot_id]);
        delete inventorySlotListeners[slot_id];  // Optionally remove the reference
    }
}

export async function updateLootCount(itemId, quantity, requestedSlot) {
    //OLD let savedInventory = saveData[2].inventoryData;
    let savedInventory = await d.getSlotData(dbState.slot_selected, 'inventoryData');
    let savedInventorySlots = savedInventory.filter(i => i.type === 'slot');
    let d_inventoryElements = inventoryElements.filter(i => i.type === 'slot'); // For updating element ids
    let lootItem = itemData.find(i => i.id === itemId);

    // If the loot item is not gold, add it here
    if (lootItem && lootItem.id !== 'GOLD') {
        let itemFound = false; // Track if the stackable item was found

        // First, check if the stackable item already exists in any slot
        for (let i = 0; i < savedInventorySlots.length; i++) {
            let slot_data = savedInventorySlots[i];

            // If requestedSlot is specified, add item to that slot
            if (requestedSlot && requestedSlot === slot_data.slot_id) {
                // Assign itemId and quantity to the specified slot
                slot_data.contents = lootItem.id;
                slot_data.cnt = quantity;
                // Update the corresponding inventory element using the index
                let e_slot_img = document.getElementById(d_inventoryElements[i].e_slot_img);
                e_slot_img.style.display = 'block';
                e_slot_img.src = lootItem.img;
                // Update database
                await d.updateSlotData(dbState.slot_selected, 'inventoryData', savedInventory);
                break;
            }

            // If the item is stackable and already exists in the slot, increment its count
            if (!requestedSlot && lootItem.stackable && slot_data.contents === lootItem.id) {
                slot_data.cnt += quantity;
                // Update the corresponding inventory element using the index
                let e_slot_counter = document.getElementById(d_inventoryElements[i].e_slot_counter);
                if (e_slot_counter) {
                    e_slot_counter.innerHTML = slot_data.cnt;
                }
                itemFound = true;
                await d.updateSlotData(dbState.slot_selected, 'inventoryData', savedInventory);
                break;
            }
        }

        // If the stackable item wasn't found in any slot, add it to an empty slot
        if (!requestedSlot && !itemFound) {
            for (let i = 0; i < savedInventorySlots.length; i++) {
                let slot_data = savedInventorySlots[i];

                // Check if the slot is empty
                if (slot_data.contents === '[ EMPTY ]') {

                    // Assign itemId and quantity to the empty slot
                    slot_data.contents = lootItem.id;
                    slot_data.cnt = quantity;
                    // Update the corresponding inventory element using the index
                    let e_slot_img = document.getElementById(d_inventoryElements[i].e_slot_img);
                    if (e_slot_img) {
                        e_slot_img.style.display = 'block';
                        e_slot_img.src = lootItem.img;
                    }
                    // (e_slot_counter is hidden for single items)
                    await d.updateSlotData(dbState.slot_selected, 'inventoryData', savedInventory);
                    break;
                }
            }
        }

        // Check if inventory is full
        let max_inventory = savedInventorySlots.length;
        let inventory_full = false;  // Assume inventory is not full unless we find no empty slots
        trackingData[0].inventory_full = false;

        for (let i = 0; i < max_inventory; i++) {  // Loop starts at 0
            if (savedInventorySlots[i].contents === '[ EMPTY ]') {
                inventory_full = false;  // Found empty slot, inventory not full
                break;
            } else {
                inventory_full = true;
                trackingData[0].inventory_full = true;
            }
        }

        if (inventory_full) {
            add_message('Inventory is full.');
        }
    }

    if (lootItem && lootItem.id === 'GOLD') {
    // If the loot item is gold, add it here
        //OLF let d_gold = saveData[4].currencyData[0];
        let d_currencyData = await d.getSlotData(dbState.slot_selected, 'currencyData');
        let d_gold = d_currencyData[0];

        if (d_gold) {
            d_gold.cnt += quantity;
            let e_check = document.getElementById('gold_container');
            if (e_check) {
                update_gold();
            }
            await d.updateSlotData(dbState.slot_selected, 'currencyData', d_currencyData);
        }
    }
}

// Function to handle various slot click situations
export async function handleSlotClick(slot_container, slotImg, slotCounter, slot_data, d_inventoryElements, savedInventory) {

    // Clear all tooltips found in inventory
    removeItemTooltip('inventory');

    if (selectedSlot === null) {
        // First click: selecting the filled slot
        if (slot_data.contents !== '[ EMPTY ]') {
            selectedSlot = {
                slot_container, //
                slot_data, //
                slot_contents: slot_data.contents,
                slotImg,
                itemImg: slotImg.src,
                slotCounter,
                itemId: slot_data.id,
                quantity: slot_data.cnt
            };
            slot_container.style.backgroundColor = 'green';
        }
    } else {
        if (selectedSlot.slot_container === slot_container) {
            // If the selected slot is clicked again, show tooltip, reset
            // Show tooltip
            createItemElements(slot_container, slot_data, d_inventoryElements, 'inventory', savedInventory);
            // Reset
            selectedSlot = null;
            slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';

        } else if (slot_data.contents === '[ EMPTY ]') {
            // Second click: selecting the destination slot

            // Move the item to the new slot
            slot_data.contents = selectedSlot.slot_contents;
            slot_data.id = selectedSlot.itemId;
            slot_data.cnt = selectedSlot.quantity;
            slotImg.style.display = 'block';
            slotImg.src = selectedSlot.itemImg;
            slotCounter.innerHTML = selectedSlot.quantity;
            slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';

            // Clear the original slot
            selectedSlot.slot_contents = '';
            selectedSlot.slotImg.src = '';
            selectedSlot.slotImg.style.display = 'none';
            selectedSlot.itemImg = '';
            selectedSlot.slotCounter.innerHTML = '';
            // Reset element
            selectedSlot.slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            // Reset selectedSlot array data
            selectedSlot.slot_data.contents = '[ EMPTY ]';
            selectedSlot.itemId = slot_data.id;
            selectedSlot.quantity = slot_data.cnt;

            // Reset the selectedSlot
            selectedSlot = null;

            // Update database
            await d.updateSlotData(dbState.slot_selected, 'inventoryData', savedInventory);

        } else if (slot_data.contents !== '[ EMPTY ]') {
            // Swap the items between the two slots

            let tempItemId = slot_data.id;
            let tempImgId = slotImg.src;
            let tempQuantity = slot_data.cnt;
            let tempContents = slot_data.contents;

            // Move the selected slot's item to the clicked slot
            slot_data.contents = selectedSlot.slot_contents;
            slot_data.id = selectedSlot.itemId;
            slot_data.cnt = selectedSlot.quantity;
            slotImg.src = selectedSlot.itemImg;
            slotImg.style.display = 'block';  // Ensure the item is visible
            slotCounter.innerHTML = selectedSlot.quantity;

            // Now move the previously clicked slot's item to the originally selected slot
            selectedSlot.slot_data.id = tempItemId;
            selectedSlot.slotImg.src = tempImgId;
            selectedSlot.slotImg.style.display = (tempContents !== '[ EMPTY ]') ? 'block' : 'none';  // Hide if empty
            selectedSlot.slotCounter.innerHTML = (tempQuantity > 1) ? tempQuantity : '';
            selectedSlot.slot_data.contents = tempContents;

            // Reset the selected slot's display if the item was swapped to an empty slot
            if (tempContents === '[ EMPTY ]') {
                selectedSlot.slotImg.style.display = 'none';
                selectedSlot.slotCounter.innerHTML = '';
            }

            // Reset slot container styles for both slots
            slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            selectedSlot.slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';

            // Reset selectedSlot array data
            selectedSlot.itemId = tempItemId;
            selectedSlot.quantity = tempQuantity;
            selectedSlot.slot_data.cnt = tempQuantity;

            // Reset the selectedSlot
            selectedSlot = null;

            // Update database
            await d.updateSlotData(dbState.slot_selected, 'inventoryData', savedInventory);
        }
    }
    applyTransparencyToEmptySlots();
    // Hide count on single cnt items
    let slotCounter_DOM = document.getElementById(slotCounter.id);
    if (slotCounter_DOM && slot_data.cnt === 1) {
        slotCounter_DOM.innerHTML = '';
    }
}

// Ensure empty slots have the transparent background
async function applyTransparencyToEmptySlots() {
    //OLD let savedInventory = saveData[2].inventoryData;
    let savedInventory = await d.getSlotData(dbState.slot_selected, 'inventoryData');
    let slot = savedInventory.filter(i => i.type === 'slot');

    for (let i = 1; i <= slot.size; i++) {
        let slotImg = document.getElementById(`inventory_slot_img_${i}`);
        let slotContainer = document.getElementById(`inventory_slot_container_${i}`);
        let slotCounter = document.getElementById(`inventory_slot_counter_${i}`);

        if (slot[i].contents === '[ EMPTY ]') {
            slotContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            slotImg.src = '';
            slotImg.style.display = 'none';
            slotCounter.innerHTML = '';
        }

        if (slot[i].contents !== '[ EMPTY ]') {

        }
    }
}
// Call this function after setting up the inventory or updating it
// applyTransparencyToEmptySlots();

// Setup gold elements, purchases, etc
export async function update_gold() {
    let inventory_section = document.getElementById('inventory_section_container');
    //OLD let d_gold = saveData[4].currencyData[0];
    let d_currencyData = await d.getSlotData(dbState.slot_selected, 'currencyData');
    let d_gold = d_currencyData[0];
    let e_gold_container = document.getElementById('gold_container');

    if (e_gold_container) {
        e_gold_container.innerHTML = '';
    } else {
        e_gold_container = document.createElement('div');
        e_gold_container.id = 'gold_container';
        let currency_area = document.getElementById('currency_area');
        if (currency_area) {
            currency_area.appendChild(e_gold_container);
        }
        e_gold_container.classList.add('gold_div');
    }

    let gold_span_lbl = document.createElement('span');
    gold_span_lbl.id = 'gold_span';
    e_gold_container.appendChild(gold_span_lbl);
    gold_span_lbl.classList.add('gold_span');
    gold_span_lbl.innerHTML = '<b>GOLD:</b>&nbsp;' + d_gold.cnt;

}

// Setup each tooltip box
async function setup_tooltip_div(tooltip_container_div, item, slot_data, tt_type, savedInventory) {

    // Clear all elements
    let e_tooltip_container_div = document.getElementById(tooltip_container_div);
    if (e_tooltip_container_div) { e_tooltip_container_div.innerHTML = ''; }

    const item_tooltip_div = create_el('item_tooltip_div', 'div', tooltip_container_div);
    item_tooltip_div.classList.add('item_tooltip');

    const item_name = create_el('item_name', 'div', item_tooltip_div);
    item_name.classList.add('normal-bold');
    item_name.innerHTML = '[ ' + item.name + ' ]';
    const item_slot = create_el('item_slot', 'div', item_tooltip_div);
    item_slot.classList.add('i_slot_type');
    if (item.type === 'armor' || item.type === 'weapon') {
        item_slot.innerHTML = item.slot_name;
    } else if (item.type === 'junk') {
        item_slot.innerHTML = '';
    } else {
        item_slot.innerHTML = item.slot;
    }

    // Set rarity color and item color
    const item_rarity = create_el('item_rarity', 'div', item_tooltip_div);
    switch (item.rarity) {
        case 0:
            item_rarity.classList.add('r_junk');
            item_rarity.innerHTML = 'Junk';
            item_name.classList.add('r_junk');
            break;
        case 1:
            item_rarity.classList.add('r_common');
            item_rarity.innerHTML = 'Common';
            item_name.classList.add('r_common');
            break;
        case 2:
            item_rarity.classList.add('r_uncommon');
            item_rarity.innerHTML = 'Uncommon';
            item_name.classList.add('r_uncommon');
            break;
        case 3: item_rarity.classList.add('r_rare');
            item_rarity.innerHTML = 'Rare';
            item_name.classList.add('r_rare');
            break;
        case 4: item_rarity.classList.add('r_epic');
            item_rarity.innerHTML = 'Epic';
            item_name.classList.add('r_epic');
            break;
        case 5: item_rarity.classList.add('r_legendary');
            item_rarity.innerHTML = 'Legendary';
            item_name.classList.add('r_legendary');
            break;
        case 6: item_rarity.classList.add('r_ancient');
            item_rarity.innerHTML = 'Ancient';
            item_name.classList.add('r_ancient');
            break;
    }
    create_el('tt_hr1', 'hr', item_tooltip_div);
    const item_desc = create_el('item_desc', 'div', item_tooltip_div);
    item_desc.classList.add('light_small');
    if (item.desc) {
        item_desc.innerHTML = item.desc;
    }
    const item_stats = create_el('item_stats', 'div', item_tooltip_div);

    // Set stat gain attributes
    let item_gains = item.gains;
    const fetch_battleStats = await update_battleStats();
    // Equipped only
    const [f_base_min, f_base_max] = await fetch_battleStats.base_attacks();
    const [attack_min, attack_max] = await fetch_battleStats.calc_meleeAttack();
    let tooltip_display = true;
    const [eq_attack_min, eq_attack_max] = await fetch_battleStats.calc_meleeAttack(tooltip_display);

    if (item_gains) {
        // Get base damage values for items
        let item_dmg_min = 0;
        let item_dmg_max = 0;

        item_gains.forEach(gain => {
            let statLine = gain.amt + '&nbsp;' + gain.lbl;
            if (gain.stat === 'armor') {
                item_stats.innerHTML += '<div class="item_tooltip_armor">' + statLine + '</span>';
            } else if (gain.stat !== 'dmg_min' && gain.stat !== 'dmg_max') {
                item_stats.innerHTML += '<div class="r_uncommon">+' + statLine + '</span>';
            }
            // Assign base damage values for items
            if (gain.stat === 'dmg_min') {
                item_dmg_min = gain.amt;
            }
            if (gain.stat === 'dmg_max') {
                item_dmg_max = gain.amt;
            }

            // mh weapons only
            if (item.slot === 'mh') {
                // mh elements
                const damage_lbl = create_el('damage_lbl', 'div', item_tooltip_div);
                damage_lbl.classList.add('item_tooltip_armor');
                // Weapon base damage
                damage_lbl.innerHTML = 'Base damage: ';
                const min_span = create_el('min_span', 'span', damage_lbl);
                const sep = create_el('sep', 'span', damage_lbl);
                sep.innerHTML = '&nbsp;-&nbsp;';
                const max_span = create_el('max_span', 'span', damage_lbl);
                const damage_pwr_lbl = create_el('damage_pwr_lbl', 'div', item_tooltip_div);
                damage_pwr_lbl.classList.add('item_tooltip_armor');
                damage_pwr_lbl.innerHTML = 'Damage Per Turn: ';
                if (!slot_data.equipped) {
                    damage_pwr_lbl.innerHTML = '<span style="color:green">[Equipped]</span> Damage Per Turn: ';
                }
                const min_span_pwr = create_el('min_span_pwr', 'span', damage_pwr_lbl);
                const sep2 = create_el('sep2', 'span', damage_pwr_lbl);
                sep2.innerHTML = '&nbsp;-&nbsp;';
                const max_span_pwr = create_el('max_span_pwr', 'span', damage_pwr_lbl);

                // Only if mh is a currently equipped item, use calculations
                if (slot_data.equipped) {
                    // Damage per turn (with power)
                    min_span.innerHTML = f_base_min;
                    max_span.innerHTML = f_base_max;
                    min_span_pwr.innerHTML = attack_min;
                    max_span_pwr.innerHTML = attack_max;

                // Only if mh is an inventory item unequipped, just use item stats (from itemData)
                } else {
                    min_span.innerHTML = item_dmg_min;
                    max_span.innerHTML = item_dmg_max;
                    // As if equipped but isn't
                    min_span_pwr.innerHTML = eq_attack_min;
                    max_span_pwr.innerHTML = eq_attack_max;

                }
            }
        });
    }

    // Sell price

    // Only if description is not empty to prevent doubled hr
    if (item_desc.innerHTML) {
        create_el('tt_hr4', 'hr', item_tooltip_div);
    }
    const sell_price_lbl = create_el('sell_price_lbl', 'div', item_tooltip_div);
    sell_price_lbl.classList.add('light_small');
    sell_price_lbl.innerHTML = 'Sell Price: ';
    const gold_div = create_el('gold_div', 'div', sell_price_lbl);
    gold_div.style.display = 'inline-block';
    const gold = create_el('gold', 'img', gold_div);
    gold.src = 'media/currency_gold.png';
    gold.classList.add('currency_gold');
    const sell_price_container_1 = create_el('sell_price_container_1', 'span', sell_price_lbl);
    const sell_price_amt1 = create_el('sell_price_amt1', 'span', sell_price_container_1);
    const sell_price_container_2 = create_el('sell_price_container_2', 'span', sell_price_lbl);
    const sell_price_amt2 = create_el('sell_price_amt2', 'span', sell_price_container_2);
    sell_price_amt1.classList.add('light_small');
    sell_price_amt2.classList.add('light_small');

    if (item.value > 0) {

        async function sell_item(all) {
            //OLD let d_gold = saveData[4].currencyData[0];
            let d_currencyData = await d.getSlotData(dbState.slot_selected, 'currencyData');
            let d_gold = d_currencyData[0];

            if (all === 'all') {
                d_gold.cnt += (item.value * slot_data.cnt);
                slot_data.cnt = 0;
                slot_data.contents = '[ EMPTY ]';
            } else {
                d_gold.cnt += item.value;
                slot_data.cnt -= 1;
                if (slot_data.cnt === 0) {
                    slot_data.contents = '[ EMPTY ]';
                }
            }
            await d.updateSlotData(dbState.slot_selected, 'currencyData', d_currencyData);
            await d.updateSlotData(dbState.slot_selected, 'inventoryData', savedInventory);
            update_gold();
            update_inventory();
        }

        sell_price_amt1.innerHTML = '&nbsp;' + item.value + '&nbsp;';

        // Only if in inventory
        if (tt_type === 'inventory') {
            const sell_action = create_el('sell_action', 'button', sell_price_container_1);
            sell_action.classList.add('light_small');
            sell_action.style.color = 'black';
            sell_action.innerHTML = 'Sell';
            sell_action.addEventListener('click', () => {
                // Clear inventory event listener to prevent item movement on click after change
                removeInventorySlotListener(slot_data.slot_id);
                sell_item();
            });
        }

        if (slot_data.cnt > 1) {
            sell_action.innerHTML = 'Sell (1)';
            sell_price_amt2.innerHTML = '<br>Sell Price x' + slot_data.cnt + ': ' + '<img src="media/currency_gold.png" class="currency_gold">&nbsp;' + (item.value * slot_data.cnt) + '&nbsp;';
            const sell_action2 = create_el('sell_action2', 'button', sell_price_container_2);
            sell_action2.innerHTML = '<span class="light_small" style="color:black">Sell (ALL)</span>';
            sell_action2.addEventListener('click', () => {
                // Clear inventory event listener to prevent item movement on click after change
                removeInventorySlotListener(slot_data.slot_id);
                sell_item('all');
            });
        }
    } else {
        gold_div.style.display = 'none';
        sell_price_amt1.innerHTML = '[ None ]';

        // Destroy item option
        // Only available if not clicked from equipment slot and has no sell price
        //OLD let saveDataEquip = saveData[3].equippedData;
        let saveDataEquip = await d.getSlotData(dbState.slot_selected, 'equippedData');

        let equipped_item = saveDataEquip.find(i => i.equipped === item.id);
        let e_equipment_id = document.getElementById('equipment_tooltip_container_' + item.id);
        let nosell_inventory_item = e_equipment_id && equipped_item ? false : true;
        // console.log(item.id + ' is inventory item (no sell price) / is_inventory_item = ' + nosell_inventory_item);

        // Destroy inventory item
        if (nosell_inventory_item) {
            create_el('hr4', 'hr', item_tooltip_div);
            const destroy_sect = create_el('destroy_sect', 'div', item_tooltip_div);
            destroy_sect.classList.add('light_small');
            destroy_sect.innerHTML = '<b>Item Actions:</b> ';
            const destroy_btn = create_el('destroy_btn', 'button', destroy_sect);
            destroy_btn.innerHTML = 'DESTROY';
            destroy_btn.addEventListener('click', () => {

                // Clear text and button for warning
                destroy_sect.removeChild(destroy_btn);
                destroy_sect.innerHTML = '';

                // Clear inventory event listener to prevent item movement on click after change
                removeInventorySlotListener(slot_data.slot_id);

                const destroy_confirm_div = create_el('destroy_confirm_div', 'div', destroy_sect);
                destroy_confirm_div.innerHTML = '<b>(DESTROY ITEM)</b> Are you sure? Action cannot be undone!';
                const confirm_yes = create_el('confirm_yes', 'button', destroy_sect);
                confirm_yes.innerHTML = ' YES ';
                confirm_yes.addEventListener('click', () => {
                    slot_data.contents = '[ EMPTY ]';
                    slot_data.cnt = 0;
                    d.updateSlotData(dbState.slot_selected, 'inventoryData', savedInventory);
                    update_inventory();
                });
                const confirm_no = create_el('confirm_no', 'button', destroy_sect);
                confirm_no.innerHTML = ' NO ';
                confirm_no.addEventListener('click', () => {
                    update_inventory();
                    return;
                });
            });
        }
    }

    // Setup equip buttons
    if (tt_type === 'equipment') {
        // Get equipped items
        //OLD let saveDataEquip = saveData[3].equippedData;
        let saveDataEquip = await d.getSlotData(dbState.slot_selected, 'equippedData');

        // Find equipped item in saveData array
        //OLD saveDataEquip.forEach(saveItem => {
        for (const saveItem of saveDataEquip) {
            //let matched_item_equipped = itemData.find(i => i.id === saveItem.equipped && i.slot === item.slot);
            let e_equipment_slot = document.getElementById('equip_slot_' + item.slot);

            // Items equipped only
            if (e_equipment_slot && saveItem.equipped === item.id) {

                create_el('tt_hr2', 'hr', item_tooltip_div);
                const equip_actions = create_el('equip_actions', 'div', item_tooltip_div);
                equip_actions.classList.add('light_small');
                equip_actions.innerHTML = '<b>Equipment Actions:</b> ';
                const unequip_btn = create_el('unequip_btn', 'button', equip_actions);
                unequip_btn.innerHTML = 'REMOVE';
                unequip_btn.addEventListener('click', () => {
                    swap_equipment(item.id, 'remove', saveItem, saveDataEquip);
                });
            }
        //OLD });
        }
    }

    if (tt_type === 'inventory') {
        // Get inventory items
        //OLD let saveDataInv = saveData[2].inventoryData;
        let saveDataInv = await d.getSlotData(dbState.slot_selected, 'inventoryData');

        //OLD let saveDataEquip = saveData[3].equippedData;
        let saveDataEquip = await d.getSlotData(dbState.slot_selected, 'equippedData');

        // Find equipment items in inventoryData array
        saveDataInv.forEach(ei => {
            let d_EquipItemData = itemData.find(i => i.id === ei.contents && i.type === 'armor' || i.id === ei.contents && i.type === 'weapon');

            if (d_EquipItemData) {
                if (d_EquipItemData.id === item.id) {
                    // Prevent duplicates of tt_hr3 HR
                    let e_tt_hr3 = document.getElementById('tt_hr3');
                    if (!e_tt_hr3) {
                        create_el('tt_hr3', 'hr', item_tooltip_div);
                    }
                    const equip_actions2 = create_el('equip_actions2', 'div', item_tooltip_div);
                    equip_actions2.classList.add('light_small');
                    equip_actions2.innerHTML = '<b>Equipment Actions:</b> ';
                    const equip_btn = create_el('equip_btn', 'button', equip_actions2);
                    equip_btn.innerHTML = 'EQUIP';
                    equip_btn.addEventListener('click', async () => {
                        // Get slot id clicked
                        let item_slot_clicked = slot_data.slot_id;
                        // Clear all previous event listeners first
                        Object.keys(inventorySlotListeners).forEach(slot_id => {
                            removeInventorySlotListener(slot_id);  // Remove old listeners
                        });
                        // Clear the object after removing listeners
                        Object.keys(inventorySlotListeners).forEach(slot_id => {
                            delete inventorySlotListeners[slot_id];
                        });

                        // If an item is already equipped in the same slot
                        let equip_slot = saveDataEquip.find(e => e.id === item.slot);
                        if (equip_slot && equip_slot.equipped) {
                            // Clear inventory slot accessed
                            slot_data.contents = '[ EMPTY ]';
                            // Store old item
                            let old_item = equip_slot.equipped;
                            // Swap new iten with equipment slot item
                            equip_slot.equipped = item.id;
                            // Add equipped item back to same inventory slot
                            await updateLootCount(old_item, 1, item_slot_clicked);
                            // Update database
                            await d.updateSlotData(dbState.slot_selected, 'equippedData', saveDataEquip);
                            update_inventory();
                            return;
                        }

                        // If no items in current equipment slot
                        let empty_equip_slot = saveDataEquip.find(e => e.id === 'equip_slot_EMPTY_' + item.slot);
                        if (empty_equip_slot && !empty_equip_slot.equipped) {
                            // Leave inventory slot empty
                            // Add new iten to empty equipment slot
                            ei.contents = '[ EMPTY ]';
                            empty_equip_slot.equipped = item.id;
                            empty_equip_slot.id = item.slot;
                            //console.log('check ids: ... equipped: ' + current_empty.equipped + '/ id: ' + current_empty.id)
                            // Update database
                            d.updateSlotData(dbState.slot_selected, 'inventoryData', saveDataInv);
                            d.updateSlotData(dbState.slot_selected, 'equippedData', saveDataEquip);
                            update_inventory();
                            //console.log(equip_slot);
                            return;
                        }
                    });
                }
            }
        });
    }
}

// Remove ALL tooltips
export function removeItemTooltip(type) {
    if (type === 'inventory') {
        // Get all elements with id starting with 'inventory_tooltip_container_'
        let tooltip_container_divs = document.querySelectorAll("[id^='inventory_tooltip_container_']");

        // Loop through each element and remove it
        tooltip_container_divs.forEach(tooltip => {
            if (tooltip.parentNode) {
                // Reset the zIndex and position if they were modified
                if (tooltip.parentNode.style.zIndex === '9999') {
                    tooltip.parentNode.style.zIndex = '0';  // Reset zIndex
                    //tooltip.parentNode.style.position = ''; // Reset position to default
                }
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }

    if (type === 'equipment') {
        // Get all elements with id starting with 'inventory_tooltip_container_'
        let equip_tooltip_container_divs = document.querySelectorAll("[id^='equipment_tooltip_container_']");

        // Loop through each element and remove it
        equip_tooltip_container_divs.forEach(tooltip => {
            if (tooltip.parentNode) {
                // Reset the zIndex and position if they were modified
                if (tooltip.parentNode.style.zIndex === '9999') {
                    tooltip.parentNode.style.zIndex = '0';  // Reset zIndex
                    //tooltip.parentNode.style.position = ''; // Reset position to default
                }
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }
}

export function createItemElements(slot_container, slot_data, elements, type, savedInventory) {

    if (type === 'inventory') {

        // Get index match for element ida
        let index = slot_data.slot_id - 1;
        // To get slot_container.id that matches e_slot_container
        // elements = inventoryElements
        let matched_slot = elements[index].e_slot_container;

        if (slot_data.contents !== '[ EMPTY ]' && matched_slot === slot_container.id) {
            // Parent container
            let container_parent = document.getElementById(slot_container.id);
            container_parent.style.zIndex = '9999';
            container_parent.style.position = 'relative';

            // Create tooltip containers for each item, including unique ids for separate unstackable duplicates
            let tooltip_container_div = document.createElement('div');
            container_parent.appendChild(tooltip_container_div);
            tooltip_container_div.id = 'inventory_tooltip_container_' + slot_data.contents + '_' + slot_data.slot_id;

            tooltip_container_div.style.position = 'absolute';
            tooltip_container_div.style.top = '65px';
            tooltip_container_div.style.width = '200px';
            tooltip_container_div.style.pointerEvents = 'auto'; // Allow interactions with the tooltip

            let item = itemData.find(i => i.id === slot_data.contents);
            setup_tooltip_div(tooltip_container_div.id, item, slot_data, 'inventory', savedInventory);
        }
    }
    if (type === 'equipment') {
        if (slot_container.id !== 'equip_slot_EMPTY_' + slot_data.id) {
            // Parent container
            let container_parent = document.getElementById(slot_container.id);
            container_parent.style.zIndex = '9999';
            container_parent.style.position = 'relative';

            // Create tooltip containers
            let tooltip_container_div = document.createElement('div');
            container_parent.appendChild(tooltip_container_div);
            tooltip_container_div.id = 'equipment_tooltip_container_' + slot_data.equipped;

            tooltip_container_div.style.position = 'absolute';
            tooltip_container_div.style.top = '65px';
            tooltip_container_div.style.width = '200px';
            tooltip_container_div.style.pointerEvents = 'auto'; // Allow interactions with the tooltip

            let item = itemData.find(i => i.id === slot_data.equipped);
            if (item) {
                setup_tooltip_div(tooltip_container_div.id, item, slot_data, 'equipment', savedInventory);
            }
        }

    }
}

// Swap equipment as equipped/unequipped after clicking 'EQUIP'/'REMOVE'
export async function swap_equipment(item, action, saveItem, saveDataEquip) {

    let d_itemData = itemData.find(i => i.id === item);
    let equipped_item_container = 'equipment_tooltip_container_' + d_itemData.id;
    let e_equipped_item_container = document.getElementById(equipped_item_container);
    // Remove: remove item from equipped
    if (action === 'remove' && e_equipped_item_container && saveItem && saveItem.equipped === item) {

        // Remember item
        let item_to_remove = item;
        let d_itemData_item_to_remove = itemData.find(i => i.id === item_to_remove);
        // Clear item from equipped

        //saveItem.equipped = null;
        update_character_slot(item, saveDataEquip);

        // Add previously equipped item back into inventory
        if (item_to_remove) {
            updateLootCount(item_to_remove, 1);
        }

        // Update database
        await d.updateSlotData(dbState.slot_selected, 'equippedData', saveDataEquip);

        // Reload character equipment & stats
        ch.update_character();
    }
}

//DEBUG
function update_character_slot(item, saveDataEquip) {
    // Update from character equipment array
    saveDataEquip.forEach(slot_data => {
        if (item === slot_data.equipped) {
            let empty_slot = 'equip_slot_EMPTY_' + slot_data.slot;
            slot_data.id = empty_slot;
            slot_data.equipped = null;
            equipmentElements.e_slot_container = slot_data.id;
        }
    });
}
