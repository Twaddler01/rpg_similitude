// character.js

// import arrays
import { equipmentElements, itemData } from './data.js';
// general functions needed
import { dbState } from './main.js';
import { create_el } from './functions.js';
import { removeItemTooltip, createItemElements } from './inventory.js';
import * as d from './database.js';

// WIP: rename to update_equipment
export async function update_character() {

    let e_tab_player_equipment = document.getElementById('tab_player_equipment');

    // Reset elements
    if (e_tab_player_equipment) {
        e_tab_player_equipment.innerHTML = '';
    }

    let char_equipment = document.createElement('div');
    e_tab_player_equipment.appendChild(char_equipment);
    char_equipment.innerHTML += '<b>EQUIPPED ITEMS</b><br><br>';

    // Equipment image with slots around image
    const char_equipment_container = create_el('char_equipment_container', 'div', e_tab_player_equipment);
    char_equipment_container.style.height = '700px';
    const div_top_box = create_el('div_top_box', 'div', char_equipment_container);
    div_top_box.classList.add('top-box');
    const equip_slot_head = create_el('equip_slot_head', 'div', div_top_box);
    equip_slot_head.classList.add('item-box');
    const div_side_boxes_left = create_el('div_side_boxes_left', 'div', char_equipment_container);
    div_side_boxes_left.classList.add('side-boxes', 'left');
    const equip_slot_shoulders = create_el('equip_slot_shoulders', 'div', div_side_boxes_left);
    equip_slot_shoulders.classList.add('item-box');
    const equip_slot_neck = create_el('equip_slot_neck', 'div', div_side_boxes_left);
    equip_slot_neck.classList.add('item-box');
    const equip_slot_chest = create_el('equip_slot_chest', 'div', div_side_boxes_left);
    equip_slot_chest.classList.add('item-box');
    const equip_slot_wrist = create_el('equip_slot_wrist', 'div', div_side_boxes_left);
    equip_slot_wrist.classList.add('item-box');
    const equip_slot_ring1 = create_el('equip_slot_ring1', 'div', div_side_boxes_left);
    equip_slot_ring1.classList.add('item-box');
    const char_equipment_image = create_el('char_equipment_image', 'img', char_equipment_container);
    char_equipment_image.src = 'media/char_shadow.png';
    char_equipment_image.style.height = '240px';
    char_equipment_image.style.width = '120px';
    const div_side_boxes_right = create_el('div_side_boxes_right', 'div', char_equipment_container);
    div_side_boxes_right.classList.add('side-boxes', 'right');
    const equip_slot_hands = create_el('equip_slot_hands', 'div', div_side_boxes_right);
    equip_slot_hands.classList.add('item-box');
    const equip_slot_waist = create_el('equip_slot_waist', 'div', div_side_boxes_right);
    equip_slot_waist.classList.add('item-box');
    const equip_slot_legs = create_el('equip_slot_legs', 'div', div_side_boxes_right);
    equip_slot_legs.classList.add('item-box');
    const equip_slot_feet = create_el('equip_slot_feet', 'div', div_side_boxes_right);
    equip_slot_feet.classList.add('item-box');
    const equip_slot_ring2 = create_el('equip_slot_ring2', 'div', div_side_boxes_right);
    equip_slot_ring2.classList.add('item-box');
    const div_bottom_boxes = create_el('div_bottom_boxes', 'div', char_equipment_container);
    div_bottom_boxes.classList.add('bottom-boxes');
    const equip_slot_mh = create_el('equip_slot_mh', 'div', div_bottom_boxes);
    equip_slot_mh.classList.add('item-box');
    const equip_slot_oh = create_el('equip_slot_oh', 'div', div_bottom_boxes);
    equip_slot_oh.classList.add('item-box');

    const equippedItems = await d.getSlotData(dbState.slot_selected, 'equippedData');

    // Update from character equipment array
    equippedItems.forEach(slot_data => {
        const d_itemData = itemData.find(i => i.id === slot_data.equipped);
        if (d_itemData) {
            slot_data.equipped = d_itemData.id;
            equipmentElements.e_slot_container = 'equip_slot_' + slot_data.id;
        } else {
            let empty_slot = 'equip_slot_EMPTY_' + slot_data.slot;
            slot_data.id = empty_slot;
            equipmentElements.e_slot_container = slot_data.id;
        }

        let slot_container = document.getElementById(equipmentElements.e_slot_container);
        if (slot_container) {
            slot_container.classList.add('equip_slot_container');

            // append with zIndex: 2
            let slot_img = document.createElement('img');
            slot_container.appendChild(slot_img);
            slot_img.id = 'equipment_slot_img_' + slot_data.id;
            slot_img.classList.add('equip_slot_img');
            equipmentElements.e_slot_img = slot_img.id;
            slot_img.src = d_itemData.img;

            // new tt
            slot_container.addEventListener('click', (equip_tt) => {
                removeItemTooltip('equipment');
                createItemElements(slot_container, slot_data, equipmentElements, 'equipment', equippedItems);

                // Add event listeners to hide the tooltip
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                }, 20);

                function handleOutsideClick(equip_tt) {
                    const tooltipContainer = document.getElementById(slot_container.id);
                    if (tooltipContainer && !tooltipContainer.contains(equip_tt.target)) {
                        removeItemTooltip('equipment');
                        document.removeEventListener('click', handleOutsideClick);
                    }
                }
            });
        }
    });

    // Update database
    await d.updateSlotData(dbState.slot_selected, 'equippedData', equippedItems);
}
