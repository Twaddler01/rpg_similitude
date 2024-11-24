// gather.js

import { trackingData } from './data.js';
import { create_el, create_bar_elements } from './functions.js';
import { dbState } from './main.js';
import * as d from './database.js';

function sjson(data) {
    console.log(JSON.stringify(data, null, 2));
}

export async function update_gather() {

    let e_tab_player_gather = document.getElementById('tab_player_gather');

    // Clear any existing elements
    if (e_tab_player_gather) {
        e_tab_player_gather.innerHTML = '';
    }

    const gather_messages_div = create_el('gather_messages_div', 'div', e_tab_player_gather);
    gather_messages_div.classList.add('normal');

    const e_tab_player_gather_NEW = create_el('e_tab_player_gather_NEW', 'div', e_tab_player_gather);
    const e_tab_player_gather_EXISTING = create_el('e_tab_player_gather_EXISTING', 'div', e_tab_player_gather);

    const gather_ready_label = create_el('gather_ready_label', 'div', e_tab_player_gather_NEW);

    const gather_existing_label = create_el('gather_existing_label', 'div', e_tab_player_gather_EXISTING);
    gather_existing_label.innerHTML = 'Learned Skills';
    gather_existing_label.style.fontSize = "30px";
    gather_existing_label.style.paddingTop = '10px';
    gather_existing_label.style.paddingBottom = '10px';

    const saveData_gatherData = await d.getSlotData(dbState.slot_selected, 'gatherData');
    let d_currencyData = await d.getSlotData(dbState.slot_selected, 'currencyData');
    let d_gold = d_currencyData[0];

    // Load images dynamically
    async function init_gatherDataImages() {

        // Add dynamic img urls
        saveData_gatherData.forEach(gather => {
            let mats = gather.materials;
            if (gather.name === 'Herb Gathering') {
                for (let i = 0; i < mats.length; i++) {
                    if (i < 10) {
                        mats[i].img = 'media/icons/gather/herb_0' + i + '.png';
                    } else {
                        mats[i].img = 'media/icons/gather/herb_' + i + '.png';
                    }
                }
            }
            if (gather.name === 'Ore Mining') {
                for (let i = 0; i < mats.length; i++) {
                    if (i < 10) {
                        mats[i].img = 'media/icons/gather/mine_0' + i + '.png';
                    } else {
                        mats[i].img = 'media/icons/gather/mine_' + i + '.png';
                    }
                }
            }
            if (gather.name === 'Tailor') {
                for (let i = 0; i < mats.length; i++) {
                    if (i < 10) {
                        mats[i].img = 'media/icons/gather/tail_0' + i + '.png';
                    } else {
                        mats[i].img = 'media/icons/gather/tail_' + i + '.png';
                    }
                }
            }
        });

        await d.updateSlotData(dbState.slot_selected, 'gatherData', saveData_gatherData);

    }

    await init_gatherDataImages();

    var allSkillsLearned = saveData_gatherData.every(skill => skill.learned === true);
    const hr_sep1 = document.createElement('hr');
    if (!allSkillsLearned) {
        gather_ready_label.innerHTML = 'Learn New Skill';
        gather_ready_label.style.fontSize = "30px";
        gather_ready_label.style.paddingTop = '10px';
        gather_ready_label.style.paddingBottom = '10px';
        e_tab_player_gather.insertBefore(hr_sep1, e_tab_player_gather_EXISTING);
    }

// temp hp = 5 for testing
// { "id": "greenleaf", "name": "Green Leaf", "hp": 5, "lvl_req": 0 },

    for (const gather of saveData_gatherData) {
        //OLD Match gatherData standalone array for storing cnt
        //OLD let saved_gatherData = saveData_gatherData.find(g => g.id === gather.id);

        // Learn to gather
        if (!gather.learned) {
            // Trigger unique IDs since in loop
            const new_gather = create_el('new_gather', 'div', e_tab_player_gather_NEW, true);
            new_gather.innerHTML = gather.name;
            const gather_learn_div = create_el('gather_learn_div', 'div', new_gather, true);
            gather_learn_div.classList.add('normal');
            const gather_learn_btn = create_el('gather_learn_btn', 'button', gather_learn_div, true);
            gather_learn_btn.innerHTML = 'Learn ' + gather.name;
            function gather_learn_click() {
                if (d_gold.cnt >= gather.cost) {
                    d_gold.cnt -= gather.cost;
                    gather.learned = true;
                    allSkillsLearned = saveData_gatherData.every(skill => skill.learned === true);
                    if (allSkillsLearned) {
                        gather_ready_label.remove();
                        hr_sep1.remove();
                    }
                    gather_messages_div.innerHTML += 'You have learned a new skill: <b>' + gather.name.toUpperCase() + '</b>!<br>';
                    // Clear the message after 20 seconds (20,000 milliseconds)
                    setTimeout(() => {
                        gather_messages_div.innerHTML = '';
                    }, 20000);
                    new_gather.remove();
                    d.updateSlotData(dbState.slot_selected, 'currencyData', d_currencyData);
                    d.updateSlotData(dbState.slot_selected, 'gatherData', saveData_gatherData);
                    load_gather();
                } else {
                    gather_messages_div.innerHTML = 'Not enough gold.';
                }
            }
            gather_learn_btn.addEventListener('click', gather_learn_click);

            const gold_img = create_el('gold_img', 'img', gather_learn_div, true);
            gold_img.src = 'media/currency_gold.png';
            gold_img.classList.add('currency_gold');
            gold_img.style.paddingLeft = '10px';

            let gather_cost = create_el('gather_cost', 'span', gather_learn_div, true);
            gather_cost.style.paddingLeft = '5px';
            gather_cost.innerHTML = gather.cost;

        } else {
            load_gather();
        }

        function load_gather() {

            const gather_ready_container = create_el('gather_ready_container', 'div', e_tab_player_gather, true);

            // Skill label and XP bar
            const gather_label = create_el('gather_label', 'div', gather_ready_container, true);
            gather_label.classList.add('bar_label_container');
            gather_label.style.paddingTop = '30px';

            const gather_label_left = create_el('gather_label_left', 'span', gather_label, true);
            gather_label_left.classList.add('bar_left_label');
            gather_label_left.innerHTML = gather.name.toUpperCase();

            const gather_label_right = create_el('gather_label_right', 'span', gather_label, true);
            gather_label_right.classList.add('bar_right_label');
            gather_label_right.innerHTML = 'Level: ' + gather.lvl;

            const f_skill_xp = create_el('f_skill_xp', 'div', gather_label, true);
            // Skill XP level formula
            let xp_to_level = Math.round(150 * gather.xp_lvl_mult * gather.lvl * 10) / 10;
            let new_xp_bar = create_bar_elements('skill_xp_bar', f_skill_xp, 'Experience', xp_to_level, 'blue');

            // Update current XP after each gather completes
            function update_skill_xp(mat_lvl_req) {
                // mat_lvl_req 0 is mat_level 1 for multiplier
                let mat_level = 1;
                if (mat_lvl_req !== 0) {
                    mat_level = mat_lvl_req;
                }
                let gather_xp_gain = Math.round(18.4 * mat_level * 10) / 10;
                // 5+ levels above required level give no xp
                if ((gather.lvl - mat_lvl_req) >= 5) {
                    gather_xp_gain = 0;
                }
                // WIP: increase XP gains for higher levels
                gather.xp_amt += gather_xp_gain;
                gather.xp_amt = Math.round(gather.xp_amt * 10) / 10;
                new_xp_bar.updateValue(gather.xp_amt);
                if (gather.xp_amt >= xp_to_level) {
                    gather.xp_amt -= xp_to_level;
                    gather.xp_amt = Math.round(gather.xp_amt * 10) / 10;
                    new_xp_bar.updateValue(gather.xp_amt);
                    gather.lvl += 1;
                    gather_label_right.innerHTML = 'Level: ' + gather.lvl;
                    xp_to_level = Math.round(150 * gather.xp_lvl_mult * gather.lvl * 10) / 10;
                    new_xp_bar.updateTotal(xp_to_level);
                    d.updateSlotData(dbState.slot_selected, 'gatherData', saveData_gatherData);
                    update_gather();
                }
            }
            // Current values
            new_xp_bar.updateValue(gather.xp_amt);
            new_xp_bar.updateTotal(xp_to_level);

            // Get materials data for each learned skill
            let gatherMaterial = gather.materials;
            if (gatherMaterial) {
                // Create rows based on materials unlocked
                let material = gatherMaterial.filter(m => m.lvl_req <= gather.lvl);
                if (material) {
                    material.forEach((mat, index) => {
                        let d_inventory = gather.inventory;
                        let gather_inventory = d_inventory[index];

                        const gather_row = create_el('gather_row', 'div', e_tab_player_gather, true);

                        const gather_table = create_el('gather_table', 'table', gather_row, true);
                        gather_table.style.width = '100%';
                        const tr = create_el('tr', 'tr', gather_table, true);
                        const td_1 = create_el('td_1', 'td', tr, true);
                        td_1.style.verticalAlign = 'center';
                        const gather_img = create_el('gather_img', 'img', td_1, true);
                        gather_img.classList.add('basic_icon');
                        gather_img.src = mat.img;
                        const td_2 = create_el('td_2', 'td', tr, true);

                        // Create the main progress bar container
                        const progress_div = create_el('progress_div', 'div', td_2, true);
                        progress_div.classList.add('center');
                        progress_div.style.height = '15px';
                        progress_div.style.width = '200px';
                        progress_div.style.border = 'white 1px solid';
                        progress_div.style.position = 'relative'; // Allows positioning of inner elements

                        // Create the fill element inside the progress bar
                        const progress_fill = create_el('progress_fill', 'div', progress_div, true);
                        progress_fill.style.height = '100%';
                        progress_fill.style.backgroundColor = 'green';
                        progress_fill.style.width = '0%'; // Initial width set to 0, updated later based on progress
                        progress_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect

                        // Display text above the fill element
                        const progress_text = create_el('progress_text', 'div', progress_div, true);
                        progress_text.style.color = 'white';
                        progress_text.style.fontSize = '10px';
                        progress_text.style.position = 'absolute'; // Overlay the text on the progress bar
                        progress_text.style.width = '100%';
                        progress_text.style.top = '0';
                        progress_text.style.left = '0';
                        progress_text.style.textAlign = 'center';

                        // Gathered amount display
                        const td_3 = create_el('td_3', 'td', tr, true);
                        td_3.classList.add('center');
                        td_3.style.fontSize = '12px';
                        td_3.style.verticalAlign = 'center';
                        td_3.innerHTML = mat.name;

                        const td_4 = create_el('td_4', 'td', tr, true);
                        td_4.classList.add('center');
                        td_4.style.fontSize = '12px';
                        td_4.style.verticalAlign = 'center';
                        td_4.innerHTML = gather_inventory.cnt;

                        // Set progress values
                        let d_progress_total = mat.hp;
                        let d_progress_curr = mat.hp;
                        let reset = false;

                        // Update the width of the fill element and the text content
                        let progress_percent = (d_progress_curr / d_progress_total) * 100;
                        progress_fill.style.width = progress_percent + '%';
                        progress_text.innerHTML = 'GATHER: ' + d_progress_curr + ' / ' + d_progress_total;

                        // Gather click action
                        function gather_click() {
                            if (d_progress_curr === 0) {
                                d_progress_curr = d_progress_total;
                                progress_fill.style.width = '100%';
                                progress_text.innerHTML = 'GATHER: ' + d_progress_curr + ' / ' + d_progress_total;
                                return;
                            }
                            // WIP: Need a depreciation of xp based on current skill lvl
                            let gather_strength = gather.gather_str * gather.gather_str_mult * gather.lvl;
                            d_progress_curr -= gather_strength;
                            d_progress_curr = Math.round(d_progress_curr * 10) / 10;
                            progress_percent = (d_progress_curr / d_progress_total) * 100;
                            progress_fill.style.width = progress_percent + '%';
                            progress_text.innerHTML = 'GATHER: ' + d_progress_curr + ' / ' + d_progress_total;
                            if (d_progress_curr <= 0) {
                                d_progress_curr = 0;
                                // Add material to material inventory
                                gather_inventory.cnt += 1;
                                progress_text.innerHTML = 'COMPLETE!';
                                td_4.innerHTML = gather_inventory.cnt;
                                progress_fill.style.width = '0%';
                                // Add and update XP
                                update_skill_xp(mat.lvl_req);
                                d.updateSlotData(dbState.slot_selected, 'gatherData', saveData_gatherData);
                            }
                        }

                        td_1.addEventListener('click', gather_click);

                    });
                }
            }
        }
    }
}
