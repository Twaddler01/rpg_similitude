// functions.js

// import arrays
import { elementsData, battleData, characterData, inventoryData, lootData } from './data.js';

// to create new elements
export function createNewSection(newType, newId, newClass, content, parentID) {
    var newElement = document.createElement(newType);
    newElement.id = newId;
    newElement.innerHTML = content;
    
    if (newClass != null) {
        newElement.className = newClass;
    }
    
    var parentElement;
    if (parentID === 'body') {
        parentElement = document.body;
    } else {
        parentElement = document.getElementById(parentID);
    }
    if (parentElement) {
        parentElement.appendChild(newElement);
    } else {
        console.error("Parent element not found with id: " + parentID);
    }
}

// Function to add tooltips
export function addTooltip(element, tooltipContent) {
  let tapHoldTimer;
  let tooltipVisible = false; // Track tooltip visibility

  element.addEventListener('mousedown', () => handleTapHoldStart(element, tooltipContent));
  element.addEventListener('touchstart', () => handleTapHoldStart(element, tooltipContent));

  document.addEventListener('click', handleDocumentClick); // Listen for clicks outside the tooltip

  function handleTapHoldStart(element, tooltipContent) {
    event.preventDefault();

    const clickX = event.clientX || event.touches[0].clientX;
    const clickY = event.clientY || event.touches[0].clientY;

    tapHoldTimer = setTimeout(() => {
      // Append the provided tooltip content to the body
      document.body.appendChild(tooltipContent);

      // Position the tooltip at the click location
      const offset = 10;
      tooltipContent.style.position = 'absolute';
      tooltipContent.style.left = clickX + offset + 'px';
      tooltipContent.style.top = clickY + offset + 'px';
      tooltipContent.style.zIndex = '9999';
      tooltipContent.style.backgroundColor = '#333333';
      tooltipContent.style.opacity = '0.9';
      tooltipContent.style.width = '200px';
      tooltipContent.style.display = 'block';

      tooltipVisible = true; // Tooltip is now visible

      // Optionally, you can set a timeout to remove the tooltip after a certain period
      setTimeout(() => {
      if (document.body.contains(tooltipContent)) {
        document.body.removeChild(tooltipContent);
        tooltipVisible = false; // Tooltip is no longer visible
      }
    }, 30000); // Remove after 30 seconds (adjust as needed)
}, 500);

    document.addEventListener('mouseup', () => handleTapHoldEnd(tapHoldTimer));
    document.addEventListener('touchend', () => handleTapHoldEnd(tapHoldTimer));
  }

  function handleDocumentClick(event) {
    if (tooltipVisible && !element.contains(event.target) && !tooltipContent.contains(event.target)) {
      // Clicked outside the tooltip and its associated element
      document.body.removeChild(tooltipContent);
      tooltipVisible = false; // Tooltip is no longer visible
    }
  }

  function handleTapHoldEnd(tapHoldTimer) {
    clearTimeout(tapHoldTimer);

    document.removeEventListener('mouseup', handleTapHoldEnd);
    document.removeEventListener('touchend', handleTapHoldEnd);
  }
}

// Function to create custom tooltip content
export function createCustomTooltipContent() {

    let border_container = document.createElement('div');
    border_container.className = 'tooltip-style';

    let tooltipContainer = document.createElement('div');
    tooltipContainer.style.padding = '10px';
    border_container.appendChild(tooltipContainer);

    let content_title = document.createElement('p');
    tooltipContainer.appendChild(content_title);
    content_title.style.textAlign = 'center';
    content_title.className = 'yellowtxt';
    content_title.innerHTML = 'Food<hr>';

    let production = document.createElement('div');
    tooltipContainer.appendChild(production);
    production.innerHTML = 'Production:&nbsp;';

    let TRIBE_LEADER_lbl = document.createElement('div');
    TRIBE_LEADER_lbl.id = 'TRIBE_LEADER_lbl';
    tooltipContainer.appendChild(TRIBE_LEADER_lbl);
    TRIBE_LEADER_lbl.innerHTML = '...tribe leader:&nbsp'; // WIP
    
    let TRIBE_LEADER_eid = document.createElement('span');
    TRIBE_LEADER_eid.id = 'TRIBE_LEADER_prod_cnt';
    TRIBE_LEADER_eid.className = 'ltgreentxt';
    TRIBE_LEADER_lbl.appendChild(TRIBE_LEADER_eid);

    // gatherer
    let gatherer_prod_div = document.createElement('div');
    gatherer_prod_div.id = 'gatherer_prod_div';
    tooltipContainer.appendChild(gatherer_prod_div);
    
    let gatherer_prod_lbl = document.createElement('span');
    gatherer_prod_div.appendChild(gatherer_prod_lbl);
    gatherer_prod_lbl.id = 'gatherer_prod_lbl';
    gatherer_prod_lbl.innerHTML = '...gatherer:&nbsp;';

    let gatherer_prod = document.createElement('span');
    gatherer_prod_div.appendChild(gatherer_prod);
    gatherer_prod.id = 'gatherer_prod';
    gatherer_prod.className = 'ltgreentxt';

    // hunters
    let basic_hunter_prod_div = document.createElement('div');
    basic_hunter_prod_div.id = 'basic_hunter_prod_div';
    tooltipContainer.appendChild(basic_hunter_prod_div);

    let basic_hunter_prod_lbl = document.createElement('span');
    basic_hunter_prod_div.appendChild(basic_hunter_prod_lbl);
    basic_hunter_prod_lbl.id = 'basic_hunter_prod_lbl';
    basic_hunter_prod_lbl.innerHTML = '...basic hunter:&nbsp;';

    let basic_hunter_prod = document.createElement('span');
    basic_hunter_prod_div.appendChild(basic_hunter_prod);
    basic_hunter_prod.id = 'basic_hunter_prod';
    basic_hunter_prod.className = 'ltgreentxt';

    // production totals
    let production_totals_lbl = document.createElement('div');
    tooltipContainer.appendChild(production_totals_lbl);
    production_totals_lbl.className = 'yellowtxt';
    production_totals_lbl.innerHTML = 'Production Total:&nbsp;';
    //append
    let production_totals = document.createElement('span');
    production_totals.id = 'production_totals_live';
    production_totals_lbl.appendChild(production_totals);
    production_totals.className = 'ltgreentxt';

    let auto_tick = document.createElement('div');
    tooltipContainer.appendChild(auto_tick);
    let food_loss = document.getElementById('food_loss');
    auto_tick.innerHTML = food_loss.innerHTML;
    
    let consumption = document.createElement('div');
    tooltipContainer.appendChild(consumption);
    consumption.innerHTML = '<hr>Consumption:&nbsp;';

    let population = document.createElement('span');
    tooltipContainer.appendChild(population);
    population.innerHTML = '...population&nbsp';
    
    let population_cnt = document.createElement('span');
    population_cnt.id = 'population_cnt';
    population.appendChild(population_cnt);

    let food_dep_live = document.createElement('span');
    population.appendChild(food_dep_live);
    food_dep_live.id = 'food_dep_live_eid';
    food_dep_live.className = 'ltred';

    let spoiled_lbl = document.createElement('div');
    tooltipContainer.appendChild(spoiled_lbl);
    spoiled_lbl.innerHTML = '...spoiled food:&nbsp;';
    //append
    let spoiled_mult = document.createElement('span');
    spoiled_mult.id = 'spoiled_mult';
    spoiled_lbl.appendChild(spoiled_mult);
    //append
    let spoiled_loss = document.createElement('span');
    spoiled_lbl.appendChild(spoiled_loss);
    spoiled_loss.className = 'ltred';
    spoiled_loss.id = 'spoiled_loss';

    let consumption_totals_live = document.createElement('div');
    tooltipContainer.appendChild(consumption_totals_live);
    consumption_totals_live.className = 'yellowtxt';
    consumption_totals_live.innerHTML = 'Consumption Total:&nbsp;';
    //append
    let consumption_totals_lbl = document.createElement('span');
    consumption_totals_live.appendChild(consumption_totals_lbl);
    consumption_totals_lbl.id = 'consumption_totals_live_eid';
    consumption_totals_lbl.className = 'ltred ';

    let totals_live = document.createElement('div');
    if (foodResource[0].loss >= 0) {
        totals_live.className = 'ltgreentxt';
    }
    if (foodResource[0].loss < 0) {
        totals_live.className = 'ltred';
    }
    totals_live.id = 'totals_live_eid';
    tooltipContainer.appendChild(totals_live);

    return border_container;
}

// Function to create event listener for each toggle button
export function createEventListener(details_div, toggleButton, container_id) {
    let initialTitle = toggleButton.dataset.title; // Store the initial title

    toggleButton.addEventListener('click', function() {
        // Check if the button is already active
        if (toggleButton.classList.contains('active')) {
            // If active, hide the details_div and reset button state
            details_div.style.display = 'none';
            toggleButton.classList.remove('active');
            toggleButton.innerHTML = '<span style="color:white">[ + ]</span> ' + initialTitle;
            container_id.style.backgroundColor = '';
        } else {
            // Reset state of previously clicked button and its associated container
            let prevButton = document.querySelector('.toggle-button.active');
            if (prevButton) {
                let prevContainer = document.getElementById(prevButton.dataset.container);
                let prevDetailsDiv = document.getElementById(prevButton.dataset.details);
                prevButton.classList.remove('active');
                prevButton.innerHTML = '<span style="color:white">[ + ]</span> ' + prevButton.dataset.title;
                prevDetailsDiv.style.display = 'none'; // Hide previously active details_div
                prevContainer.style.backgroundColor = '';
            }

            // Toggle current button and show/hide details
            details_div.style.display = 'block';
            container_id.style.backgroundColor = "#252525"; // Set background color
            toggleButton.classList.add('active');
            toggleButton.innerHTML = '<span style="color:white">[ - ]</span> ' + initialTitle; // Reset to initial title
        }
    });
}

// Function to attach event listeners to toggle buttons
export function attachEventListeners() {
    // Iterate through each array item and attach event listeners
    objectElements.forEach(array => {
        let details_div = document.getElementById(array.details_div);
        let toggleButton = document.getElementById(array.toggle_button);
        let container_id = document.getElementById(array.container_id);
        toggleButton.classList.add('toggle-button'); // Add a class to identify toggle buttons
        toggleButton.dataset.title = array.title;
        toggleButton.dataset.container = array.container_id; // Store the container id
        toggleButton.dataset.details = array.details_div; // Store the details_div id
        details_div.classList.add('details');
        createEventListener(details_div, toggleButton, container_id);
    });
}
// Run the event listener setup initially
// attachEventListeners();

// Whenever you modify arrayData, call attachEventListeners() again
// For example:
// arrayData.push({ /* new building data */ });
// attachEventListeners(); // Call this after modifying arrayData

// show or hide sections on click
export function section_collapse(id) {
    let section = id + '_sect_id';
    let section_title = id + '_sect_title';
    let fetch_section = document.getElementById(section);
    let fetch_section_title = document.getElementById(section_title);

    if (fetch_section_title) {
        if (!fetch_section_title.dataset.listenerSet) {
            fetch_section_title.addEventListener('click', function toggleSection() {
                if (fetch_section.style.display === "none") {
                    fetch_section.style.display = "block";
                    fetch_section_title.innerHTML = '<p class="divsections_no_ul">&nbsp;[&nbsp;--&nbsp;]<span class="divsections">' + id.toUpperCase() + '</span></p>';
                } else {
                    fetch_section.style.display = "none";
                    fetch_section_title.innerHTML = '<p class="divsections_no_ul">&nbsp;[&nbsp;+&nbsp;]<span class="divsections">' + id.toUpperCase() + '</span></p>';
                }
            });
            fetch_section_title.dataset.listenerSet = true;
        }
    }
}

// show/hide elements
export function toggleElement(method, elementId) {
    let element_id = document.getElementById(elementId);
    if (element_id) {
        if (method === 's') {
            element_id.style.display = 'block';
        } else if (method === 'sf') {
            element_id.style.display = 'flex';
        } else {
            element_id.style.display = 'none';
        }
    } else {
        console.error('toggleElement(), element "' + elementId + '" not found. ');
    }
}

// add elements
export function add_allElements() {
    elementsData.forEach(element => {

        // sections elements
        if (element.section_cat === true) {
            
            let element_id = document.createElement(element.type);
            element_id.id = element.id;
            let parent_el = element.parent_el;
            let fetched_parent_el = document.getElementById(parent_el);

            // append elements
            if (!element.fetch_cat) {
                if (parent_el === 'body') {
                    document.body.appendChild(element_id);
                } else {
                    parent_el.appendChild(element_id);
                }
            } else {
                if (fetched_parent_el) {
                    fetched_parent_el.appendChild(element_id);
                }
            }

            if (element.content) {
                element_id.innerHTML = element.content;
            }
            
            if (element.css_class) {
                element_id.className = element.css_class;
            }
            
            if (element.css_class2) {
                element_id.classList.add(element.css_class2);
            }
                
            // 'hidden' flag (if set TRUE in array) to hide element
            if (element.hidden) {
                element_id.style.display = 'none';
            }
            
            // add click event
            ////
            if (element.on_click) {
                let element_click_DOM = document.getElementById(element.id);
                if (element_click_DOM) {
                    element_click_DOM.addEventListener('click', function() {
                        if (element.id === 'start_battle_button') {
                            start_battle_button(element.id);
                        }
                        if (element.id === 'attack_box_button') {
                            attack_box_button(element.id);
                        }
                    });
                } else {
                    console.error('element_click_DOM NULL for: ' + element.id);
                }
            }
            //
        }
        // battle elements
        // 
/*
        // tables
        if (element.table_cat === true) {
        
            // table id
            let table_id = document.createElement(element.type);
            table_id.id = element.id;
            let parent_el = element.parent_el;

            // table header
            let thead = document.createElement('thead');
            table_id.appendChild(thead);
            thead.innerHTML = 'Battle Table';

            let fetched_parent_el = document.getElementById(parent_el);
            if (fetched_parent_el) {
                fetched_parent_el.appendChild(table_id);
            } else {
                parent_el.appendChild(table_id);
            }

            // tr
            let rows = element.rows; // 3
            if (rows >= 1) {
                for (let row = 1; row <= rows; row++) {
                    let table_row = document.createElement('tr');
                    table_id.appendChild(table_row);
                    
                    // td
                    let cols = element.cols; // 4
                    if (cols >= 1 && table_row) {
                        for (let col = 1; col <= cols; col++) {
                            let cell_content = document.createElement('td');
                            table_row.appendChild(cell_content);
                            
                            let contentKey = `content${row}_${col}`;
                            if (element[contentKey]) {
                                cell_content.innerHTML = element[contentKey];
                            }
                        }            
                    }
                }
            }

            if (element.css_class) {
                table_id.className = element.css_class;
            }
                
            // 'hidden' flag (if set TRUE in array) to hide element
            if (element.hidden) {
                table_id.style.display = 'none';
            }
        }*/
    });
}

// div flex
export function add_divFlex(newContainerId, newId, parentId, qtyNum) {

    let parent_id = document.getElementById(parentId);

    // new container
    let new_container = document.createElement('div');
    new_container.id = newContainerId;
    new_container.className = 'box';
    if (parent_id) {
        parent_id.appendChild(new_container);
    } else {
        console.error('Parent ID not found in add_divFlex(), newContainerId specified: ' + newContainerId + '.');
    }

    for (let i = 1; i <= qtyNum; i++) {
        let new_id = document.createElement('div');
        new_container.appendChild(new_id);
        new_id.id = newId + '_' + i;
        new_id.innerHTML = 'DIV:&nbsp;' + new_id.id;
    }
}

export function start_battle(section) {
    let section_comtainer = document.getElementById(section + '_container');
    
    battleData.forEach(battle => {
        let locationBox = document.getElementById('location_center');
        if (locationBox && battle.label) {
            locationBox.innerHTML = battle.label;
        }

    });
}

export function start_battle_button(elementId) {
    toggleElement('h', 'start_battle_button');
    toggleElement('s', 'attack_box_button');
    toggleElement('sf', 'verses_box');
    toggleElement('sf', 'health_bars');

    let character = characterData.find(char => char.id === 'my_character');
    let enemy = characterData.find(char => char.id === 'enemy_gnome');
    let d_char_battle_name = document.getElementById('char_name');
    d_char_battle_name.innerHTML = character.name;
    let d_eneny_battle_name = document.getElementById('eme_name');
    d_eneny_battle_name.innerHTML = enemy.char_race + '&nbsp;' + enemy.char_class;
}

export function attack_box_button(elementId) {

    let d_enemy_health_cnt = elementsData.find(char => char.id === 'enemy_health_cnt');
    if (!d_enemy_health_cnt.startTimeActive) {
        d_enemy_health_cnt.startTime = Date.now();
        d_enemy_health_cnt.startTimeActive = true;
    }
    let d_enemy_health_total = elementsData.find(char => char.id === 'enemy_health_total');
    let enemy_health_total = document.getElementById('enemy_health_total');
    enemy_health_total.innerHTML = d_enemy_health_total.cnt;
    let enemy = characterData.find(char => char.id === 'enemy_gnome');
    let combat_log = document.getElementById('combat_log');

    if (d_enemy_health_cnt.cnt > 0 && !d_enemy_health_cnt.dead) {
        const elapsedTime = getElapsedTime();
        toggleElement('s', 'combat_log');
        d_enemy_health_cnt.cnt -= 10;
        let enemy_health_fill = document.getElementById('enemy_health_fill');
        let healthPercentage = (d_enemy_health_cnt.cnt / d_enemy_health_total.cnt) * 100;
        enemy_health_fill.style.width = healthPercentage + '%';

        // add to combat log
        let d_combat_div = battleData.find(battle => battle.id === 'combat_div_');
        if (!d_combat_div.capped && d_combat_div.cnt <= d_combat_div.cap) {
            d_combat_div.cnt++;
            let new_div = document.createElement('div');
            combat_log.appendChild(new_div);
            new_div.id = d_combat_div.id + d_combat_div.cnt;
            
            new_div.innerHTML += elapsedTime + '<p><span class="material-symbols-outlined">swords</span><span style="color:#FFCB30;">&nbsp;You dealt 10 physical damage to ' + enemy.char_race + '&nbsp;' + enemy.char_class + '.</span></p>';

            let enemy_health_cnt = document.getElementById('enemy_health_cnt');
            enemy_health_cnt.innerHTML = d_enemy_health_cnt.cnt;
            if (d_enemy_health_cnt.cnt <= 0 && !d_enemy_health_cnt.dead) {
                d_enemy_health_cnt.cnt = 0;
                d_enemy_health_cnt.dead = true;
            } else {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">heart_minus</span><span style="color:#FF9393;">&nbsp;' + enemy.char_race + '&nbsp;' + enemy.char_class + '&nbsp;physical attack inflicts 10 damage to you.</span></p>';
            }
            if (d_enemy_health_cnt.dead) {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">skull</span><span style="color:#F7EB00;font-weight:bold;">&nbsp;You defeated ' + enemy.char_race + '&nbsp;' + enemy.char_class + '.</span></p>';
                
                // get loot from battle
                //process_loot();

                // setup new battle
                toggleElement('h', 'attack_box_button');
                toggleElement('h', 'verses_box');
                let e_verses_box = document.getElementById('verses_box');
                
                toggleElement('h', 'health_bars');
                toggleElement('s', 'start_battle_button');
                d_enemy_health_cnt.dead = false;
                d_enemy_health_cnt.cnt = enemy.stat_health;
                d_enemy_health_total.cnt = enemy.stat_health;
                healthPercentage = (d_enemy_health_cnt.cnt / enemy.stat_health) * 100;
                enemy_health_fill.style.width = healthPercentage + '%';
                enemy_health_cnt.innerHTML = d_enemy_health_cnt.cnt;
                enemy_health_total.innerHTML = d_enemy_health_total.cnt;


                
            }

            if (d_combat_div.cnt >= d_combat_div.cap) {
                d_combat_div.capped = true;
            }
        }
    }
}

// Function to get the elapsed time since the start
function getElapsedTime() {
    let d_enemy_health_cnt = elementsData.find(el => el.id === 'enemy_health_cnt');
    let startTime = d_enemy_health_cnt.startTime;
    let now = Date.now();
    const elapsedTime = (now - startTime) / 1000;
    if (d_enemy_health_cnt.startTime !== null) {
        return elapsedTime.toFixed(2) + ' sec';
    } else {
        return 0;
    }
}
// EXAMPLE
// const elapsedTime = getElapsedTime();

export function process_loot() {
    let d_inventory = inventoryData.find(inv => inv.id === 'inventory');

    // setup inventory
    if (!d_inventory.setup) {
        let inventory_section = document.getElementById('inventory_section');
        let inv_parent = document.createElement('div');
        inv_parent.className = 'inv_parent';
        inventory_section.appendChild(inv_parent);
        
        for (let i = 1; i <= d_inventory.size; i++) {
            let new_slot = document.createElement('div');
            inv_parent.appendChild(new_slot);
            new_slot.id = 'inventory_slot_' + i;
            new_slot.classList.add('normal');
            new_slot.classList.add('center');
            new_slot.classList.add('inv_slot');
            
            new_slot.innerHTML = '[ EMPTY ]';
            
            let new_slot_counter = document.createElement('div');
            new_slot.appendChild(new_slot_counter);
            new_slot_counter.id = 'inventory_slot_counter_' + i;
            new_slot_counter.classList.add('inv_slot_counter');
 
            new_slot_counter.innerHTML = '005';
        }
        d_inventory.setup = true;
    }

    // setup drop rates
    characterData.forEach(char => {
        if (char.drops) {
            char.drops.forEach(drop => {
                if (drop.item) {
                    if (Math.random() < drop.rate) {
                        let quantity = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
                        console.log(`${drop.item}: ${quantity}`);
                        updateLootCount(drop.item, quantity);
                        
                    }
                }
            });
        }
    });

    //else {}
}

// Function to find the corresponding loot item and increment its count
export function updateLootCount(itemId, quantity) {
    const lootItem = lootData.find(loot => loot.id === itemId);
    let d_inventory = inventoryData.find(inv => inv.id === 'inventory');

    if (lootItem) {
        lootItem.cnt += quantity;
    }
    // update inventory DOM
    updateSlot(3, itemId, quantity);
}

// Later, when you need to update the content dynamically:
export function updateSlot(slotNumber, content, counterContent) {
    let slot = document.getElementById('inventory_slot_' + slotNumber);
    let slotCounter = document.getElementById('inventory_slot_counter_' + slotNumber);
    
    if (slot && slotCounter) {
        // create content div above with z-index 1?
            slot.classList.add('normal');
            slot.classList.add('center');
            slot.classList.add('inv_slot');
        slot.innerHTML = content;
            slotCounter.classList.add('inv_slot_counter');
        slotCounter.innerHTML = counterContent;
    }
}

// Example usage:
// updateSlot(1, '[ FILLED ]', '123');

export function process_inventory() {
    
}






/*

const characterData = [ 
    { 
        id: 'my_character', 
        char_img: '', 
        name: 'Legalos', 
        level: 1, 
        char_race: 'Human', 
        char_class: 'Fighter', 
        stat_armor: 100, 
        stat_attack: 1.0, 
        stat_power: 1.0 
    }, 
    { 
        id: 'enemy_gnome', 
        type: 'basic_enemy', 
        char_img: '', 
        level: 1, 
        char_race: 'Goblin', 
        char_class: 'Scavenger', 
        stat_armor: 100, 
        stat_attack: 0.8, 
        stat_power: 0.8, 
        drops: [
            { item: 'GOLD', rate: 0.9, min: 1, max: 3 }, 
            { item: 'CLOTH_LINEN', rate: 0.4, min: 1, max: 2 }, 
            { item: 'BASIC_HELMET', rate: 0.2, min: 1, max: 1 }, 
            { item: 'TOOTH', rate: 0.6, min: 1, max: 2 } 
        ] 
    } 
];

const lootData = [ 
    { id: 'GOLD', type: 'currency', name: 'Gold', cnt: 0 }, 
    { id: 'CLOTH_LINEN', type: 'material', name: 'Linen Cloth', cnt: 0, value: 2 }, 
    { id: 'BASIC_HELMET', type: 'armor', name: 'Basic Helm', cnt: 0, value: 6 },  
    { id: 'TOOTH', type: 'junk', name: 'Tooth', cnt: 0, value: 1 } 
];

// Function to find the corresponding loot item and increment its count
function updateLootCount(itemId, quantity) {
    const lootItem = lootData.find(loot => loot.id === itemId);
    if (lootItem) {
        lootItem.cnt += quantity;
    }
}

// Process the drops and update the loot counts
characterData.forEach(char => {
    if (char.drops) {
        char.drops.forEach(drop => {
            if (drop.item) {
                if (Math.random() < drop.rate) {
                    let quantity = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
                    updateLootCount(drop.item, quantity);
                    console.log(`${drop.item}: ${quantity}`);
                }
            }
        });
    }
});

console.log(lootData);

*/
/*

// setup inventory
if (!d_inventory.setup) {
    let inventory_section = document.getElementById('inventory_section');
    let inv_parent = document.createElement('div');
    inv_parent.className = 'inv_parent';
    inventory_section.appendChild(inv_parent);
    
    for (let i = 1; i <= d_inventory.size; i++) {
        let new_slot = document.createElement('div');
        inv_parent.appendChild(new_slot);
        
        let new_slot_counter = document.createElement('div');
        new_slot.appendChild(new_slot_counter);
        
        new_slot_counter.id = 'slot_counter_' + i;
        new_slot.id = 'slot_' + i;
        
        new_slot_counter.classList.add('inv_slot_counter');
        new_slot.classList.add('inv_slot');
        
        // Initially set content using text nodes or elements
        new_slot.innerHTML = '<span>[ EMPTY ]</span>';
        new_slot_counter.textContent = '000';
    }
    d_inventory.setup = true;
}

*/