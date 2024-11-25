// gather.js

import { trackingData } from './data.js';
import { create_el, create_bar_elements, add_message } from './functions.js';
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

    const e_tab_player_gather_inventory_label = create_el('e_tab_player_gather_inventory_label', 'div', e_tab_player_gather);
    e_tab_player_gather_inventory_label.innerHTML = 'Gather Inventory';
    e_tab_player_gather_inventory_label.style.fontSize = "30px";
    e_tab_player_gather_inventory_label.style.paddingTop = '10px';
    e_tab_player_gather_inventory_label.style.paddingBottom = '10px';
    e_tab_player_gather_inventory_label.style.display = 'none';

    const e_tab_player_gather_inventory = create_el('e_tab_player_gather_inventory', 'div', e_tab_player_gather);
    e_tab_player_gather_inventory.style.paddingBottom = '10px';
    const hr_sep2 = document.createElement('hr');
    e_tab_player_gather.appendChild(hr_sep2);
    hr_sep2.style.display = 'none';

    const e_tab_player_gather_NEW = create_el('e_tab_player_gather_NEW', 'div', e_tab_player_gather);
    e_tab_player_gather_NEW.style.paddingBottom = '10px';

    const e_tab_player_gather_EXISTING = create_el('e_tab_player_gather_EXISTING', 'div', e_tab_player_gather);

    const gather_ready_label = create_el('gather_ready_label', 'div', e_tab_player_gather_NEW);

    const gather_existing_label = create_el('gather_existing_label', 'div', e_tab_player_gather_EXISTING);

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
    hr_sep1.id = 'hr_sep1';

    if (!allSkillsLearned) {
        gather_ready_label.innerHTML = 'Learn New Skill';
        gather_ready_label.style.fontSize = "30px";
        gather_ready_label.style.paddingTop = '10px';
        gather_ready_label.style.paddingBottom = '10px';
    }
    
    function f_anySkillLearned() {
        var anySkillLearned = saveData_gatherData.some(skill => skill.learned === true);
        if (anySkillLearned) {
            gather_existing_label.innerHTML = 'Learned Skills';
            gather_existing_label.style.fontSize = "30px";
            gather_existing_label.style.paddingTop = '10px';
            gather_existing_label.style.paddingBottom = '10px';
            if (allSkillsLearned) {
                let e_hr_sep1 = document.getElementById('hr_sep1');
                if (e_hr_sep1) {
                    e_hr_sep1.remove();
                }
            } else {
                e_tab_player_gather.insertBefore(hr_sep1, e_tab_player_gather_EXISTING);
            }
        } else {
            hr_sep1.remove();
        }
    }
    f_anySkillLearned();

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
                    f_anySkillLearned();
                    add_message('You have learned a new skill: <b>' + gather.name.toUpperCase() + '</b>!');
                    new_gather.remove();
                    d.updateSlotData(dbState.slot_selected, 'currencyData', d_currencyData);
                    d.updateSlotData(dbState.slot_selected, 'gatherData', saveData_gatherData);
                    load_gather();
                } else {
                    add_message('You don&apos;t have enough gold to learn this skill.');
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

            // Current values
            new_xp_bar.updateValue(gather.xp_amt);
            new_xp_bar.updateTotal(xp_to_level);

            function getGatherElements() {
                const gatherMaterial = gather.materials;
                if (!gatherMaterial) return;
            
                const d_inventory = gather.inventory;
            
                // New version of displayGatherInventory
                function displayGatherInventory() {
                    const unlockedMaterials = gatherMaterial.filter(mat => mat.lvl_req <= gather.lvl);
                    const lockedMaterials = gatherMaterial.filter(mat => mat.lvl_req > gather.lvl);
            
                    // Helper to create material display
                    function createMaterialElement(mat, isUnlocked) {
                        // Clear existing element
                        const existingContainer = document.getElementById(`inv_item_container_${mat.id}`);
                        if (existingContainer) existingContainer.remove();
            
                        // Ensure the parent container uses flex with wrapping
                        e_tab_player_gather_inventory.style.display = 'flex';
                        e_tab_player_gather_inventory.style.flexWrap = 'wrap';
                        e_tab_player_gather_inventory.style.gap = '10px';
            
                        // Create the material container
                        const invItemContainer = create_el('inv_item_container', 'div', e_tab_player_gather_inventory, true);
                        invItemContainer.id = `inv_item_container_${mat.id}`;
                        invItemContainer.style.display = 'flex';
                        invItemContainer.style.alignItems = 'center';
                        invItemContainer.style.borderRadius = '5px';
                        invItemContainer.style.flex = '0 0 auto';
                        invItemContainer.style.width = '165px';
            
                        // Create content based on lock/unlock status
                        const invItemImg = create_el('inv_item_img', isUnlocked ? 'img' : 'div', invItemContainer, true);
                        if (isUnlocked) {
                            invItemImg.classList.add('basic_icon_small');
                            invItemImg.src = mat.img;
                        } else {
                            invItemImg.style.width = '25px';
                            invItemImg.style.height = '25px';
                            invItemImg.style.backgroundColor = '#f0f0f0';
                        }
            
                        // Create and append the name with count/locked indicator
                        const invItemText = create_el('inv_item_text', 'div', invItemContainer, true);
                        invItemText.id = `inv_item_text_${mat.id}`;
                        invItemText.style.marginLeft = '10px';
                        invItemText.style.fontSize = '14px';
                        invItemText.style.whiteSpace = 'nowrap';
            
                        if (isUnlocked) {
                            const inventoryItem = d_inventory.find(item => item.id === mat.id) || { cnt: 0 };
                            invItemText.innerHTML = `${mat.name} x ${inventoryItem.cnt}`;
                        } else {
                            invItemText.innerHTML = '? Unknown';
                        }
                    }
            
                    // Create elements for unlocked and locked materials
                    unlockedMaterials.forEach(mat => createMaterialElement(mat, true));
                    lockedMaterials.forEach(mat => createMaterialElement(mat, false));
            
                    // Ensure UI elements are visible
                    hr_sep2.style.display = 'block';
                    e_tab_player_gather_inventory_label.style.display = 'block';
                }
            
                // Call the display function
                displayGatherInventory();
            
                // Create gatherable rows for unlocked materials
                const unlockedMaterials = gatherMaterial.filter(mat => mat.lvl_req <= gather.lvl);
                unlockedMaterials.forEach(mat => {
                    const inventoryItem = d_inventory.find(item => item.id === mat.id) || { cnt: 0 };
            
                    // Clear existing gather row
                    const existingGatherRow = document.getElementById(`gather_row_${mat.id}`);
                    if (existingGatherRow) existingGatherRow.remove();
            
                    // Create gatherable row
                    const gatherRow = create_el('gather_row', 'div', e_tab_player_gather, true);
                    gatherRow.id = `gather_row_${mat.id}`;
                    gatherRow.style.display = 'flex';
                    gatherRow.style.justifyContent = 'space-between';
                    gatherRow.style.alignItems = 'center';
                    gatherRow.style.padding = '10px';
            
                    // Image container
                    const gatherImgContainer = create_el('gather_img_container', 'div', gatherRow, true);
                    const gatherImg = create_el('gather_img', 'img', gatherImgContainer, true);
                    gatherImg.classList.add('basic_icon');
                    gatherImg.src = mat.img;
            
                    // Material name
                    const materialName = create_el('material_name', 'div', gatherRow, true);
                    materialName.style.fontSize = '12px';
                    materialName.style.textAlign = 'center';
                    materialName.innerHTML = mat.name;
            
                    // Progress bar container
                    const progressContainer = create_el('progress_container', 'div', gatherRow, true);
                    progressContainer.style.display = 'flex';
                    progressContainer.style.flexDirection = 'column';
                    progressContainer.style.alignItems = 'center';
            
                    const progressDiv = create_el('progress_div', 'div', progressContainer, true);
                    progressDiv.classList.add('center');
                    progressDiv.style.height = '15px';
                    progressDiv.style.width = '200px';
                    progressDiv.style.border = '1px solid white';
                    progressDiv.style.position = 'relative';
            
                    const progressFill = create_el('progress_fill', 'div', progressDiv, true);
                    progressFill.style.height = '100%';
                    progressFill.style.backgroundColor = 'green';
                    progressFill.style.width = '0%';
                    progressFill.style.transition = 'width 0.3s ease';
            
                    const progressText = create_el('progress_text', 'div', progressDiv, true);
                    progressText.style.color = 'white';
                    progressText.style.fontSize = '10px';
                    progressText.style.position = 'absolute';
                    progressText.style.width = '100%';
                    progressText.style.top = '0';
                    progressText.style.left = '0';
                    progressText.style.textAlign = 'center';
            
                    // Set progress values
                    const dProgressTotal = mat.hp;
                    let dProgressCurr = mat.hp;
            
                    const updateProgress = () => {
                        const progressPercent = (dProgressCurr / dProgressTotal) * 100;
                        progressFill.style.width = progressPercent + '%';
                        progressText.innerHTML = `GATHER: ${dProgressCurr} / ${dProgressTotal}`;
                    };
            
                    updateProgress();
            
                    // Gather click action
                    gatherImgContainer.addEventListener('click', () => {
                        if (dProgressCurr <= 0) {
                            dProgressCurr = dProgressTotal;
                            updateProgress();
                            return;
                        }
            
                        const gatherStrength = gather.gather_str * gather.gather_str_mult * gather.lvl;
                        dProgressCurr = Math.max(0, dProgressCurr - gatherStrength);
                        updateProgress();
            
                        if (dProgressCurr <= 0) {
                            inventoryItem.cnt += 1;
                            document.getElementById(`inv_item_text_${mat.id}`).innerHTML = `${mat.name} x ${inventoryItem.cnt}`;
                            update_skill_xp(mat.lvl_req);
                            d.updateSlotData(dbState.slot_selected, 'gatherData', saveData_gatherData);
                        }
                    });
                });

                // Helper: Update current XP after each gather completes
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
                    gather.xp_amt += gather_xp_gain * 3; //TEST VALUE
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
                        getGatherElements();
                    }
                }
            }
            
            getGatherElements();

        }
    }
}
