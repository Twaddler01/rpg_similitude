// inventory.js

import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, encounterData, saveData, trackingData } from './data.js';
import * as gf from './general_functions.js';
import * as ch from './character.js';
import { create_el, add_message } from './functions.js';
import { update_battleStats } from './equipment.js';

let selectedSlot = null;
// Create a global object to store listeners by slot_id
const inventorySlotListeners = {};
export function update_inventory() {

    // Reset elements
    let e_tab_player_inventory = document.getElementById('tab_player_inventory');
    if (e_tab_player_inventory) {
        e_tab_player_inventory.innerHTML = '';
    }

/*    let inventory_section = document.getElementById('inventory_section');
    let inventory_section_container = document.getElementById('inventory_section_container');

    if (!trackingData[0].t_inventory_section) {
        inventory_section.addEventListener('click', () => {
            gf.toggle_section('inventory');
        });
    } else {
        // Clear section data
        if (inventory_section_container) {
            inventory_section_container.innerHTML = '';
        }*/
    
        // Clear all previous event listeners first
        Object.keys(inventorySlotListeners).forEach(slot_id => {
            removeInventorySlotListener(slot_id);  // Remove old listeners
        });
        // Clear the object after removing listeners
        Object.keys(inventorySlotListeners).forEach(slot_id => {
            delete inventorySlotListeners[slot_id];
        });
        
        let savedInventory = saveData[2].inventoryData;
        let savedInventorySlots = savedInventory.filter(i => i.type === 'slot');
        let d_inventoryElements = inventoryElements.filter(i => i.type === 'slot');
        
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
                handleSlotClick(slot_container, slot_img, slot_counter, slot_data, d_inventoryElements);
            }
            slot_container.addEventListener('click', inventorySlotClicks);
            
            // Store the listener in the global object using the slot ID
            inventorySlotListeners[slot_data.slot_id] = inventorySlotClicks;
    
        });
    
        let currency_area = document.createElement('div');
        inv_parent.appendChild(currency_area);
        currency_area.id = 'currency_area';
        currency_area.style.padding = '5px';
    
        update_gold();
    
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
    //} // END t_inventory_section
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

export function updateLootCount(itemId, quantity, requestedSlot) {
    let savedInventory = saveData[2].inventoryData;
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
        let d_gold = saveData[4].currencyData[0];
        if (d_gold) {
            d_gold.cnt += quantity;
            let e_check = document.getElementById('gold_container');
            if (e_check) {
                update_gold();
            }
        }
    }
}

// Function to handle various slot click situations
export function handleSlotClick(slot_container, slotImg, slotCounter, slot_data, d_inventoryElements) {

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
            createItemElements(slot_container, slot_data, d_inventoryElements, 'inventory');
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
function applyTransparencyToEmptySlots() {
    let savedInventory = saveData[2].inventoryData;
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
export function update_gold() {
    let inventory_section = document.getElementById('inventory_section_container');
    let d_gold = saveData[4].currencyData[0];

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
function setup_tooltip_div(tooltip_container_div, item, slot_data, tt_type) {

    // Clear all elements
    let e_tooltip_container_div = document.getElementById(tooltip_container_div);
    if (e_tooltip_container_div) { e_tooltip_container_div.innerHTML = ''; }

    create_el('item_tooltip_div', 'div', tooltip_container_div);
    item_tooltip_div.classList.add('item_tooltip');
    
    create_el('item_name', 'div', 'item_tooltip_div');
    item_name.classList.add('normal-bold');
    item_name.innerHTML = '[ ' + item.name + ' ]';
    create_el('item_slot', 'div', 'item_tooltip_div');
    item_slot.classList.add('i_slot_type');
    if (item.type === 'armor' || item.type === 'weapon') {
        item_slot.innerHTML = item.slot_name;
    } else if (item.type === 'junk') {
        item_slot.innerHTML = '';
    } else {
        item_slot.innerHTML = item.slot;
    }
    
    // Set rarity color and item color
    create_el('item_rarity', 'div', 'item_tooltip_div');
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
    create_el('tt_hr1', 'hr', 'item_tooltip_div');
    create_el('item_desc', 'div', 'item_tooltip_div');
    item_desc.classList.add('light_small');
    if (item.desc) {
        item_desc.innerHTML = item.desc;
    }
    create_el('item_stats', 'div', 'item_tooltip_div');
    
    // Set stat gain attributes
    let item_gains = item.gains;
    if (item_gains) {
        item_gains.forEach(gain => {
            let statLine = gain.amt + '&nbsp;' + gain.lbl;
            if (gain.stat === 'armor') {
                item_stats.innerHTML += '<div class="item_tooltip_armor">' + statLine + '</span>';
            } else if (gain.stat !== 'dmg_min' && gain.stat !== 'dmg_max') {
                item_stats.innerHTML += '<div class="r_uncommon">+' + statLine + '</span>';
            }
            if (item.slot === 'mh') {
                create_el('damage_lbl', 'div', 'item_tooltip_div');
                damage_lbl.classList.add('item_tooltip_armor');
                // Damage per item
                // WIP replace with calculate function
                //let d_dmg_min = item_gains.find(i => i.stat === 'dmg_min');
                //let d_dmg_max = item_gains.find(i => i.stat === 'dmg_max');
                //let [base_weapon_min, base_weapon_max]  = calculate_weapon_damage(1, 0);
                //console.log(base_weapon_min + ' : ' + base_weapon_max);
                const fetch_battleStats = update_battleStats();
                const [f_base_min, f_base_max] = fetch_battleStats.base_attacks();

                // Weapon base damage
                damage_lbl.innerHTML = 'Base damage: ';
                create_el('min_span', 'span', 'damage_lbl');
                min_span.innerHTML = f_base_min;
                create_el('sep', 'span', 'damage_lbl');
                sep.innerHTML = '&nbsp;-&nbsp;';
                create_el('max_span', 'span', 'damage_lbl');
                max_span.innerHTML = f_base_max;
                
                // Damage per turn (with power)
                const [attack_min, attack_max] = fetch_battleStats.calc_meleeAttack();
                create_el('damage_pwr_lbl', 'div', 'item_tooltip_div');
                damage_pwr_lbl.classList.add('item_tooltip_armor');
                damage_pwr_lbl.innerHTML = 'Damage Per Turn: ';
                create_el('min_span_pwr', 'span', 'damage_pwr_lbl');
                min_span_pwr.innerHTML = attack_min;
                create_el('sep2', 'span', 'damage_pwr_lbl');
                sep2.innerHTML = '&nbsp;-&nbsp;';
                create_el('max_span_pwr', 'span', 'damage_pwr_lbl');
                max_span_pwr.innerHTML = attack_max;
            }
        });
    }
    
    // Sell price

    // Only if description is not empty to prevent doubled hr
    if (item_desc.innerHTML) {
        create_el('tt_hr4', 'hr', 'item_tooltip_div');
    }
    create_el('sell_price_lbl', 'div', 'item_tooltip_div');
    sell_price_lbl.classList.add('light_small');
    sell_price_lbl.innerHTML = 'Sell Price: ';
    create_el('gold_div', 'div', 'sell_price_lbl');
    gold_div.style.display = 'inline-block';
    create_el('gold', 'img', 'gold_div');
    gold.src = 'media/currency_gold.png';
    gold.classList.add('currency_gold');
    create_el('sell_price_container_1', 'span', 'sell_price_lbl');
    create_el('sell_price_amt1', 'span', 'sell_price_container_1');
    create_el('sell_price_container_2', 'span', 'sell_price_lbl');
    create_el('sell_price_amt2', 'span', 'sell_price_container_2');
    sell_price_amt1.classList.add('light_small');
    sell_price_amt2.classList.add('light_small');

    if (item.value > 0) {
        
        function sell_item(all) {
            let d_gold = saveData[4].currencyData[0];
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
            update_gold();
            update_inventory();
        }
        
        sell_price_amt1.innerHTML = '&nbsp;' + item.value + '&nbsp;';
        create_el('sell_action', 'button', 'sell_price_container_1');
        sell_action.classList.add('light_small');
        sell_action.style.color = 'black';
        sell_action.innerHTML = 'Sell';
        sell_action.addEventListener('click', () => {
            // Clear inventory event listener to prevent item movement on click after change
            removeInventorySlotListener(slot_data.slot_id);
            sell_item();
        });

        if (slot_data.cnt > 1) {
            sell_action.innerHTML = 'Sell (1)';
            sell_price_amt2.innerHTML = '<br>Sell Price x' + slot_data.cnt + ': ' + '<img src="media/currency_gold.png" class="currency_gold">&nbsp;' + (item.value * slot_data.cnt) + '&nbsp;';
            create_el('sell_action2', 'button', 'sell_price_container_2');
            sell_action2.innerHTML = '<span class="light_small" style="color:black">Sell (ALL)</span>';
            sell_action2.addEventListener('click', () => {
                sell_item('all');
            });
        }
    } else {
        gold_div.style.display = 'none';
        sell_price_amt1.innerHTML = '[ None ]';
        
        // Destroy item option
        // Only available if not clicked from equipment slot and has no sell price
        let saveDataEquip = saveData[3].equippedData;
        let equipped_item = saveDataEquip.find(i => i.equipped === item.id);
        let e_equipment_id = document.getElementById('equipment_tooltip_container_' + item.id);
        let nosell_inventory_item = e_equipment_id && equipped_item ? false : true;
        // console.log(item.id + ' is inventory item (no sell price) / is_inventory_item = ' + nosell_inventory_item);

        // Destroy inventory item
        if (nosell_inventory_item) {
            create_el('hr4', 'hr', 'item_tooltip_div');
            create_el('destroy_sect', 'div', 'item_tooltip_div');
            destroy_sect.classList.add('light_small');
            destroy_sect.innerHTML = '<b>Item Actions:</b> ';
            create_el('destroy_btn', 'button', 'destroy_sect');
            destroy_btn.innerHTML = 'DESTROY';
            destroy_btn.addEventListener('click', () => {
                
                // Clear text and button for warning
                destroy_sect.removeChild(destroy_btn);
                destroy_sect.innerHTML = '';
                
                // Clear inventory event listener to prevent item movement on click after change
                removeInventorySlotListener(slot_data.slot_id);

                create_el('destroy_confirm_div', 'div', 'destroy_sect');
                destroy_confirm_div.innerHTML = '<b>(DESTROY ITEM)</b> Are you sure? Action cannot be undone!';
                create_el('confirm_yes', 'button', 'destroy_sect');
                confirm_yes.innerHTML = ' YES ';
                confirm_yes.addEventListener('click', () => {
                    slot_data.contents = '[ EMPTY ]';
                    slot_data.cnt = 0;
                    update_inventory();
                });
                create_el('confirm_no', 'button', 'destroy_sect');
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
        let saveDataEquip = saveData[3].equippedData;

        // Find equipped item in saveData array
        saveDataEquip.forEach(saveItem => {

            //let matched_item_equipped = itemData.find(i => i.id === saveItem.equipped && i.slot === item.slot);
            let e_equipment_slot = document.getElementById('equip_slot_' + item.slot);
            
            // Items equipped only
            if (e_equipment_slot && saveItem.equipped === item.id) {
    
                create_el('tt_hr2', 'hr', 'item_tooltip_div');
                create_el('equip_actions', 'div', 'item_tooltip_div');
                equip_actions.classList.add('light_small');
                equip_actions.innerHTML = '<b>Equipment Actions:</b> ';
                create_el('unequip_btn', 'button', 'equip_actions');
                unequip_btn.innerHTML = 'REMOVE';
                unequip_btn.addEventListener('click', () => {
                    swap_equipment(item.id, 'remove');
                });
            }
        });
    }
    
    if (tt_type === 'inventory') {
        // Get inventory items
        let saveDataInv = saveData[2].inventoryData;
        let saveDataEquip = saveData[3].equippedData;
        // Find equipment items in inventoryData array
        saveDataInv.forEach(ei => {
            let d_EquipItemData = itemData.find(i => i.id === ei.contents && i.type === 'armor' || i.id === ei.contents && i.type === 'weapon');

            if (d_EquipItemData) {
                if (d_EquipItemData.id === item.id) {
                    // Prevent duplicates of tt_hr3 HR
                    let e_tt_hr3 = document.getElementById('tt_hr3');
                    if (!e_tt_hr3) {
                        create_el('tt_hr3', 'hr', 'item_tooltip_div');
                    }
                    create_el('equip_actions2', 'div', 'item_tooltip_div');
                    equip_actions2.classList.add('light_small');
                    equip_actions2.innerHTML = '<b>Equipment Actions:</b> ';
                    create_el('equip_btn', 'button', 'equip_actions2');
                    equip_btn.innerHTML = 'EQUIP';
                    equip_btn.addEventListener('click', () => {
                        
                        // Store current item data first
                        let item_clicked = item;
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
                            // Add equipped item back to same inventory slot
                            updateLootCount(equip_slot.equipped, 1, item_slot_clicked);
                            // Swap new iten with equipment slot item
                            equip_slot.equipped = item.id;
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

export function createItemElements(slot_container, slot_data, elements, type) {

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
            setup_tooltip_div(tooltip_container_div.id, item, slot_data, 'inventory');
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
                setup_tooltip_div(tooltip_container_div.id, item, slot_data, 'equipment');
            }
        }

    }
}

// Swap equipment as equipped/unequipped after clicking 'EQUIP'/'REMOVE'
export function swap_equipment(item, action) {

    let d_itemData = itemData.find(i => i.id === item);
    let saveDataEquipAll = saveData[3].equippedData;
    let saveDataEquip = saveDataEquipAll.filter(e => e.equipped !== null);
    let equipped_item = saveDataEquip.find(i => i.equipped === d_itemData.id);
    let equipped_item_container = 'equipment_tooltip_container_' + d_itemData.id;
    let e_equipped_item_container = document.getElementById(equipped_item_container);

    // Remove: remove item from equipped
    if (action === 'remove' && e_equipped_item_container && equipped_item && equipped_item.equipped === item) {

        // Remember item
        let item_to_remove = item;
        let d_itemData_item_to_remove = itemData.find(i => i.id === item_to_remove);
        // Clear item from equippes
        equipped_item.equipped = null;

        // Add previously equipped item back into inventory
        if (item_to_remove) {
            updateLootCount(item_to_remove, 1);
        }
        
        // Reload character equipment & stats
        ch.update_character();
    }
}