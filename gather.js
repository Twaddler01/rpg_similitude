// gather.js

import { saveData, gatherData, trackingData } from './data.js';
import { toggle_section } from './general_functions.js';
import { create_el, create_bar_elements } from './functions.js';

export function update_gather() {
    
    let e_tab_player_gather = document.getElementById('tab_player_gather');

    // Clear any existing elements
    if (e_tab_player_gather) {
        e_tab_player_gather.innerHTML = '';
    }

    let gather_messages_div = create_el('gather_messages_div', 'div', e_tab_player_gather);
    gather_messages_div.classList.add('normal');
    create_el('new_gather', 'div', e_tab_player_gather);
    
    let saveData_gatherData = saveData[5].gatherData;
    gatherData.forEach(gather => {
        // Match gatherData standalone array for storing cnt
        let saved_gatherData = saveData_gatherData.find(g => g.id === gather.id);

        // Learn to gather
        if (!saved_gatherData.learned) {
            let gather_learn_div = create_el('gather_learn_div', 'div', new_gather);
            gather_learn_div.classList.add('normal');
            let gather_learn_btn = create_el('gather_learn_btn', 'button', gather_learn_div);
            gather_learn_btn.innerHTML = 'Learn ' + gather.name;
            function gather_learn_click() {
                let d_gold = saveData[4].currencyData[0];
                if (d_gold.cnt >= gather.cost) {
                    d_gold.cnt -= gather.cost;
                    saved_gatherData.learned = true;
                    gather_messages_div.innerHTML += 'You have learned a new skill: <b>' + gather.name.toUpperCase() + '</b>!<br>';
                    // Clear the message after 20 seconds (20,000 milliseconds)
                    setTimeout(() => {
                        gather_messages_div.innerHTML = '';
                    }, 20000);
                    gather_learn_div.remove();
                    load_gather();
                } else {
                    gather_messages_div.innerHTML = 'Not enough gold.';
                }
            }
            gather_learn_btn.addEventListener('click', gather_learn_click);
            
            let gold_img = create_el('gold_img', 'img', gather_learn_div);
            gold_img.src = 'media/currency_gold.png';
            gold_img.classList.add('currency_gold');
            gold_img.style.paddingLeft = '10px';

            let gather_cost = create_el('gather_cost', 'span', gather_learn_div);
            gather_cost.style.paddingLeft = '5px';
            gather_cost.innerHTML = gather.cost;

        } else {
            load_gather();
        }
        
        function load_gather() {

            let gather_ready_container = create_el('gather_ready_container', 'div', e_tab_player_gather);
            
            // Skill label and XP bar
            let gather_label = create_el('gather_label', 'div', gather_ready_container);
            gather_label.classList.add('bar_label_container');
        
            let gather_label_left = create_el('gather_label_left', 'span', gather_label);
            gather_label_left.classList.add('bar_left_label');
            gather_label_left.innerHTML = gather.name.toUpperCase();;
        
            let gather_label_right = create_el('gather_label_right', 'span', gather_label);
            gather_label_right.classList.add('bar_right_label');
            gather_label_right.innerHTML = 'Level: ' + saved_gatherData.lvl;
            
            let f_skill_xp = create_el('f_skill_xp', 'div', gather_label);
            // Skill XP level formula
            let xp_to_level = Math.round(150 * gather.xp_lvl_mult * saved_gatherData.lvl * 10) / 10;
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
                if ((saved_gatherData.lvl - mat_lvl_req) >= 5) {
                    gather_xp_gain = 0;
                }
                // WIP: increase XP gains for higher levels
                saved_gatherData.xp_amt += gather_xp_gain;
                saved_gatherData.xp_amt = Math.round(saved_gatherData.xp_amt * 10) / 10;
                new_xp_bar.updateValue(saved_gatherData.xp_amt);
                if (saved_gatherData.xp_amt >= xp_to_level) {
                    saved_gatherData.xp_amt -= xp_to_level;
                    saved_gatherData.xp_amt = Math.round(saved_gatherData.xp_amt * 10) / 10;
                    new_xp_bar.updateValue(saved_gatherData.xp_amt);
                    saved_gatherData.lvl += 1;
                    gather_label_right.innerHTML = 'Level: ' + saved_gatherData.lvl;
                    xp_to_level = Math.round(150 * gather.xp_lvl_mult * saved_gatherData.lvl * 10) / 10;
                    new_xp_bar.updateTotal(xp_to_level);
                    update_gather();
                }
            }
            // Current values
            new_xp_bar.updateValue(saved_gatherData.xp_amt);
            new_xp_bar.updateTotal(xp_to_level);

            // Get materials data for each learned skill
            let gatherMaterial = gather.materials;
            if (gatherMaterial) {
                // Create rows based on materials unlocked
                let material = gatherMaterial.filter(m => m.lvl_req <= saved_gatherData.lvl);
                if (material) {
                    material.forEach((mat, index) => {
                        let d_saved_gatherData_inventory = saved_gatherData.inventory;
                        let gather_inventory = d_saved_gatherData_inventory[index];
                        
                        let gather_row = create_el('gather_row', 'div', e_tab_player_gather);
                        
                        let gather_table = create_el('gather_table', 'table', gather_row);
                        gather_table.style.width = '100%';
                        let tr = create_el('tr', 'tr', gather_table);
                        let td_1 = create_el('td_1', 'td', tr);
                        td_1.style.verticalAlign = 'center';
                        let gather_img = create_el('gather_img', 'img', td_1);
                        gather_img.classList.add('basic_icon');
                        gather_img.src = mat.img;
                        let td_2 = create_el('td_2', 'td', tr);
        
                        // Create the main progress bar container
                        let progress_div = create_el('progress_div', 'div', td_2);
                        progress_div.classList.add('center');
                        progress_div.style.height = '15px';
                        progress_div.style.width = '200px';
                        progress_div.style.border = 'white 1px solid';
                        progress_div.style.position = 'relative'; // Allows positioning of inner elements
                        
                        // Create the fill element inside the progress bar
                        let progress_fill = create_el('progress_fill', 'div', progress_div);
                        progress_fill.style.height = '100%';
                        progress_fill.style.backgroundColor = 'green';
                        progress_fill.style.width = '0%'; // Initial width set to 0, updated later based on progress
                        progress_fill.style.transition = 'width 0.3s ease'; // Smooth transition effect
                        
                        // Display text above the fill element
                        let progress_text = create_el('progress_text', 'div', progress_div);
                        progress_text.style.color = 'white';
                        progress_text.style.fontSize = '10px';
                        progress_text.style.position = 'absolute'; // Overlay the text on the progress bar
                        progress_text.style.width = '100%';
                        progress_text.style.top = '0';
                        progress_text.style.left = '0';
                        progress_text.style.textAlign = 'center';
                        
                        // Gathered amount display
                        let td_3 = create_el('td_3', 'td', tr);
                        td_3.classList.add('center');
                        td_3.style.fontSize = '12px';
                        td_3.style.verticalAlign = 'center';
                        td_3.innerHTML = mat.name;
                        
                        let td_4 = create_el('td_4', 'td', tr);
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
                            let gather_strength = gather.gather_str * gather.gather_str_mult * saved_gatherData.lvl;
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
                                
                            }
                        }
                        
                        td_1.addEventListener('click', gather_click);
                        
                    });
                }
            }
        }
    });
}