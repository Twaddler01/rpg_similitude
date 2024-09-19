// functions.js

// import arrays
import { elementsData, equipmentElements, inventoryElements, itemData, locationsData, characterData, saveData, trackingData } from './data.js';

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

// OLD CODE
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

// OLD CODE
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
        } else if (method === 'sv') {
            element_id.visibility = 'visible';
        } else if (method === 'sf') {
            element_id.style.display = 'flex';
        } else if (method === 'sib') {
            element_id.style.display = 'inline-block';
        } else if (method === 'hv') {
            element_id.visibility = 'hidden';
        } else if (method === 'h') {
            element_id.style.display = 'none';
        } else {
            console.error('Invalid method specified: "' + method + ', ' + elementId + '"');
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

            if (element.css_class3) {
                element_id.classList.add(element.css_class3);
            }

            // 'hidden' flag (if set TRUE in array) to hide element
            if (element.hidden) {
                element_id.style.display = 'none';
            }

            // add click event
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

export function first_run() {

    let test_section = document.getElementById('test_section');

// reset saveData
    let reset = document.createElement('button');
    test_section.appendChild(reset);
    reset.innerHTML = 'RESET GAME';
    reset.addEventListener('click', () => {
        reset_game('test_section');
    });

// add 1 kill instantly to selected level

    let selected_kill = document.createElement('button');
    test_section.appendChild(selected_kill);
    selected_kill.innerHTML = '+1 Kill to Current Level';
    
    selected_kill.addEventListener('click', () => {
        let message = document.getElementById('message');
        
        if (message) {
            message.innerHTML = '';
        }
        if (trackingData[0].loc !== 0 && trackingData[0].lvl !== 0) {
            locationsData.forEach((item, index) => {
                //console.log('trackingData[0].loc: ' + trackingData[0].loc);
                //console.log('locationsData.loc: ' + locationsData[index].loc);
                if (locationsData[index].loc === trackingData[0].loc && locationsData[index].lvl === trackingData[0].lvl) {
                    //trackingData[0].loc
                    saveData[0].killsData[index].kills += 1;
                    //saveData[index].kills += 1;
                    // Update both arrays
                    message.innerHTML = 'Added +1 kill to ' + locationsData[index].lbl + ' (Level ' + locationsData[index].lvl + ')';
                    update_locations();
                    selectLocation(locationsData[index].loc);
                    // Highlight selected level
                    let DOM_levelButton = document.getElementById('levelButton_' + trackingData[0].lvl);
                    DOM_levelButton.style.backgroundColor = 'yellow';
                }
            });
        } else {
            message.innerHTML = 'Please select an enemy level.';
        }
        //update_locations();
    });

// Add loot button

    let filtered_itemData = itemData.filter(i => i.id !== 'GOLD');
    filtered_itemData.forEach(item => {
        
        let add_loot = document.createElement('button');
        test_section.appendChild(add_loot);
        add_loot.innerHTML = 'Add Loot:' + item.id;
        
        add_loot.addEventListener('click', () => {
            updateLootCount(item.id, 1);
        });
    });

// FOR BATTLE TESTING
    let e_start_battle_button = document.getElementById('start_battle_button');
    start_battle_button(e_start_battle_button.id);

// Add expwrience x200
    //let e_char_exp = document.getElementById('e_char_exp');
    let add_xp = document.createElement('button');
    test_section.appendChild(add_xp);
    add_xp.innerHTML = 'Add Experience';
    
    add_xp.addEventListener('click', () => {
        let d_player_character = saveData[1].savedCharacterData[0];
        d_player_character.char_exp += 200;
        update_xp();
    });
    
// Toggle combat status
    let toggle_combat = document.createElement('button');
    test_section.appendChild(toggle_combat);
    toggle_combat.innerHTML = 'Toggle Combat Status';
    toggle_combat.addEventListener('click', () => {
        toggle_combat_status();
    });
}

export function update_locations() {

    // Main containers
    const location_container = document.getElementById('location_container');

    // Clear any existing elements
    // Add title
    if (location_container) {
        location_container.innerHTML = '&nbsp;<b>CHOOSE BATTLE LOCATION:<p></p></b>';
    }
    
    // Update array data
    for (let i = 0; i < locationsData.length; i++) {
        // Insert the kills data from saveData into the corresponding location in locationsData
        // locationsData[i].kills = saveData[i].kills
        locationsData[i].kills = saveData[0].killsData[i].kills;

        // Always set first level true
        if (!locationsData[0].kill_req_met) {
            locationsData[0].kill_req_met = true;
        }
        
        // Update kill_req_met based on the kills of previous,level
        // Ensure next index is set to true (if not at end of array) if previous index kills >= kills_req
        if (i + 1 < locationsData.length) {
            locationsData[i + 1].kill_req_met = locationsData[i].kills >= locationsData[i].kills_req;

        }
    }

    // Create locations container
    let locations = document.createElement('div');
    location_container.appendChild(locations);
    locations.id = 'locations';
    locations.style.display = 'flex';
    locations.style.overflow = 'auto';

    // Create levels container
    let levels = document.createElement('div');
    location_container.appendChild(levels);
    levels.id = 'levels';
    levels.style.overflow = 'auto';

    // Create location status container
    let locations_status = document.createElement('div');
    location_container.appendChild(locations_status);
    locations_status.id = 'locations_status';

    const message = document.createElement('div');
    test_section.appendChild(message);
    message.id = 'message';
    message.className = 'normal';

    // Create and append location buttons
    const max_location = Math.max(...locationsData.map(loc => loc.loc));
    for (let i = 1; i <= max_location; i++) {
        let loc_lvl1 = locationsData.find(l => l.loc === i && l.lvl === 1);
        let loc = document.createElement('div');
        loc.id = 'location_div_' + i;
        // Auto select current location/level from trackingData if present
        if (trackingData[0].loc !== 0) {
            let fetched_loc = document.getElementById('location_div_' + trackingData[0].loc);
            if (fetched_loc) {
                fetched_loc.classList.remove('green_border_off');
                fetched_loc.classList.add('green_border_on');
            }
        }
        loc.classList.add('green_border_off');
        let unlocked = isAnyLocationUnlocked(i);
        //console.log(unlocked);
        if (loc_lvl1 && unlocked) {
            locations.appendChild(loc);
            loc.innerHTML = loc_lvl1.lbl;
            let loc_img = document.createElement('img');
            loc.appendChild(loc_img);
            loc_img.style.width = '150px';
            loc_img.style.height = 'auto';
            loc_img.src = loc_lvl1.img;
            let loc_levels = document.createElement('div');
            levels.appendChild(loc_levels);
            loc_levels.id = 'loc_levels';
            loc_levels.style.overflow = 'auto';
            loc.addEventListener('click', () => {
                // Clear all green borders
                for (let all = 1; all <= max_location; all++) {
                    let DOM_all_loc_div = document.getElementById('location_div_' + all);
                    if (DOM_all_loc_div) {
                        DOM_all_loc_div.classList.remove('green_border_on');
                        DOM_all_loc_div.classList.add('green_border_off');
                    }
                }
                // Add green border to clicked element
                loc.classList.remove('green_border_off');
                loc.classList.add('green_border_on');
                selectLocation(i);
                // To always keep highlightted level selected after clicking another location and back
                let level_btn = document.getElementById('levelButton_' + trackingData[0].lvl);
                if (level_btn && trackingData[0].loc === i) {
                    level_btn.style.backgroundColor = 'yellow';
                }
            });
        }
    }
}

export function isAnyLocationUnlocked(loc) {
    return locationsData
        .filter(location => location.loc === loc)
        .some(location => location.kill_req_met);
}

export function isLocationFullyUnlocked(loc) {
    return locationsData
        .filter(location => location.loc === loc)
        .every(location => location.kill_req_met);
}
// USAGE
// for (let i = 1; i <= max_location; i++) {
//    const fullyUnlocked = isLocationFullyUnlocked(i);
//    console.log(`Location ${i} fully unlocked: ${fullyUnlocked}`);
// }

export function selectLocation(location) {
    const levelsContainer = document.getElementById('loc_levels');

    // Clear previous levels if a new location is selected
    levelsContainer.innerHTML = '';

    trackingData[0].currentLocation = location;

    if (trackingData[0].loc !== 0) {
        trackingData[0].currentLocation = trackingData[0].loc;
    }

    // Filter levels based on the selected location and met kill requirements
    const filteredLevels = locationsData.filter(loc => loc.loc === location && loc.kill_req_met);

    // Display levels for the selected location
    filteredLevels.forEach(level => {

        let level_title = document.createElement('span');
        levelsContainer.appendChild(level_title);
        if (level.lvl === 1) {
            level_title.innerHTML = `&nbsp;<b>CHOOSE LEVEL:</b><br>&nbsp;`;
        }

        const levelButton = document.createElement('button');
        levelButton.innerHTML = ` ${level.lvl} `;
        levelButton.style.backgroundColor = 'white';
        levelButton.id = 'levelButton_' + level.lvl;

        if (trackingData[0].loc === level.loc && trackingData[0].lvl === level.lvl) {
            selectLevel(level.loc, level.lbl, level.lvl, level.kills);
        } else {
            levelButton.addEventListener('click', () => {
                // Set all colors to white initialy
                for (let i = 1; i <= filteredLevels.length; i++) {
                    let DOM_levelButton = document.getElementById('levelButton_' + i);
                    DOM_levelButton.style.backgroundColor = 'white';
                }
                // Set selected level yellow
                levelButton.style.backgroundColor = 'yellow';
                selectLevel(level.loc, level.lbl, level.lvl, level.kills);
            });
        }
        levelsContainer.appendChild(levelButton);
    });
}

export function selectLevel(loc, location, lvl, kills) {
    const locations_status = document.getElementById('locations_status');
    const message = document.getElementById('message');

    message.innerHTML = '';
    locations_status.innerHTML = `&nbsp;You selected <b>${location}</b> Level <b>${lvl}</b>`;
    locations_status.innerHTML += `<br>&nbsp;<b>Enemies Killed:</b> ${kills}`;
    let start_battle_button = document.getElementById('start_battle_button');
    if (start_battle_button) {
        start_battle_button.style.display = 'block';
    }
    // add to tracking array
    trackingData[0].loc = loc;
    trackingData[0].location = location;
    trackingData[0].lvl = lvl;
    trackingData[0].kills = kills;
}

export function getMaxLevelsByLocation(locationsData) {
    // Object to store the highest level for each location
    const maxLevels = {};

    // Loop over locationsData to find the highest level per location
    locationsData.forEach(location => {
        const { loc, lvl } = location;

        // If the location doesn't exist in maxLevels, or if the current lvl is higher, update it
        if (!maxLevels[loc] || lvl > maxLevels[loc]) {
            maxLevels[loc] = lvl;
        }
    });

    // Convert the result object into an array of max levels in the order of loc
    return Object.values(maxLevels);
}
// Usage
// const highestLevels = getMaxLevelsByLocation(locationsData);
// console.log(highestLevels); // [8, 4, 3] - This will be the highest level for each location in order

// reset saveData
export function reset_game(elid) {
    let parent = document.getElementById(elid);
    if (parent) {
        let confirm = document.createElement('span');
        parent.appendChild(confirm);
        confirm.className = 'normal';
        confirm.innerHTML = 'RESET: Are you sure?&nbsp;&nbsp;';
        
        let yes = document.createElement('button');
        test_section.appendChild(yes);
        yes.innerHTML = 'YES';
        yes.addEventListener('click', () => {
            saveData[0].killsData.forEach(item => {
            //saveData.forEach(item => {
                item.kills = 0;
            });
            parent.removeChild(confirm);
            parent.removeChild(yes);
            parent.removeChild(no);
            update_locations();
        });
        
        let no = document.createElement('button');
        test_section.appendChild(no);
        no.innerHTML = 'NO';
        no.addEventListener('click', () => {
            parent.removeChild(confirm);
            parent.removeChild(yes);
            parent.removeChild(no);
            update_locations();
        });
    
        

    } else {
        console.error('elid "' + elid + '" is invalid for reset_game() function call.');
    }
}

export function create_el(newId, type, parentId, content) {
    let parent_el = document.getElementById(parentId);
    let new_el = document.createElement(type);
    if (parent_el) {
        parent_el.appendChild(new_el);
    } else {
        parentId.appendChild(new_el);
    }
    new_el.id = newId;
    if (content) {
        new_el.innerHTML = content;
    }
}

export function character_setup() {

    let character_container = document.getElementById('character_container');

    let charData = saveData[1].savedCharacterData[0];

    if (charData.char_name && charData.char_race && charData.char_class) {
        trackingData[0].character_created = true;
    }

    if (!trackingData[0].character_created) {

        let new_char_entry = document.createElement('div');
        character_container.appendChild(new_char_entry);
    
        let character_entry = document.createElement('span');
        new_char_entry.appendChild(character_entry);
        character_entry.classList.add('location_box_style');
        character_entry.innerHTML = '<br><b>ENTER NEW CHARACTER DATA:</b><p></p>';
    
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
                saveData[1].savedCharacterData[0].char_name = charName;
                saveData[1].savedCharacterData[0].char_race = charRace;
                saveData[1].savedCharacterData[0].char_class = charClass;
                new_char_entry.innerHTML = '';
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

        // flag character as created
        trackingData[0].character_created = true;
    }

    if (trackingData[0].character_created) {
        
        let char_title = document.createElement('div');
        character_container.appendChild(char_title);
        char_title.innerHTML = '<b>' + charData.char_name + '&nbsp;(Level ' + charData.char_level + ')</b>';
        
        let char_equipment = document.createElement('div');
        character_container.appendChild(char_equipment);
        char_equipment.innerHTML = '<p><b>EQUIPMENT:</b></p>';

// equipment image with slots around image
create_el('char_equipment_container', 'div', char_equipment);
    create_el('div_top_box', 'div', 'char_equipment_container');
    div_top_box.classList.add('top-box');
    create_el('equip_slot_head', 'div', 'div_top_box');
    equip_slot_head.classList.add('item-box');
    create_el('div_side_boxes_left', 'div', 'char_equipment_container');
    div_side_boxes_left.classList.add('side-boxes', 'left');
        create_el('equip_slot_shoulders', 'div', 'div_side_boxes_left');
        equip_slot_shoulders.classList.add('item-box');
        create_el('equip_slot_neck', 'div', 'div_side_boxes_left');
        equip_slot_neck.classList.add('item-box');
        create_el('equip_slot_chest', 'div', 'div_side_boxes_left');
        equip_slot_chest.classList.add('item-box');
        create_el('equip_slot_wrist', 'div', 'div_side_boxes_left');
        equip_slot_wrist.classList.add('item-box');
        create_el('equip_slot_ring1', 'div', 'div_side_boxes_left');
        equip_slot_ring1.classList.add('item-box');
    create_el('char_equipment_image', 'img', 'char_equipment_container');
    char_equipment_image.src = 'media/char_equip.png';
    char_equipment_image.style.height = '240px';
    char_equipment_image.style.width = '80px';
    create_el('div_side_boxes_right', 'div', 'char_equipment_container');
    div_side_boxes_right.classList.add('side-boxes', 'right');
        create_el('equip_slot_hands', 'div', 'div_side_boxes_right');
        equip_slot_hands.classList.add('item-box');
        create_el('equip_slot_waist', 'div', 'div_side_boxes_right');
        equip_slot_waist.classList.add('item-box');
        create_el('equip_slot_legs', 'div', 'div_side_boxes_right');
        equip_slot_legs.classList.add('item-box');
        create_el('equip_slot_feet', 'div', 'div_side_boxes_right');
        equip_slot_feet.classList.add('item-box');
        create_el('equip_slot_ring2', 'div', 'div_side_boxes_right');
        equip_slot_ring2.classList.add('item-box');
    create_el('div_bottom_boxes', 'div', 'char_equipment_container');
    div_bottom_boxes.classList.add('bottom-boxes');
        create_el('equip_slot_mh', 'div', 'div_bottom_boxes');
        equip_slot_mh.classList.add('item-box');
        create_el('equip_slot_oh', 'div', 'div_bottom_boxes');
        equip_slot_oh.classList.add('item-box');

        // First run setup
        /*if (!trackingData[0].starting_equip_added) {
            // Add starting items
            const starting_items = itemData.filter(i => i.player_equipped === true);
            starting_items.forEach(item => {
                let slot_element = document.getElementById(item.slot);
                if (slot_element) {
                    item_tooltip(slot_element, item.id, 'equipment');
                }
            });
            
            // Save starting equipment to saveData array
            let saveDataEquip = saveData[3].equippedData;
            saveDataEquip.forEach(saveItem => {
                const d_itemData = itemData.find(i => i.slot === saveItem.id && i.player_equipped === true);
                if (d_itemData) {
                    saveItem.equipped = d_itemData.id;
                }
            });
            trackingData[0].starting_equip_added = true;
        }*/
        
        // Recurring modifications
        //if (trackingData[0].starting_equip_added && trackingData[0].regular_equip_flag) {
            // Add savedData equipment items
            //console.log('regular_equip_flag');
            let equippedItems = saveData[3].equippedData;
            //let filtered_equippedItems = equippedItems.filter(e => e.equipped !== null);
            //console.log(filtered_equippedItems);
            equippedItems.forEach(slot_data => {
                const d_itemData = itemData.find(i => i.id === slot_data.equipped);
                if (d_itemData) {
                    slot_data.equipped = d_itemData.id;
                    equipmentElements.e_slot_container = 'equip_slot_' + slot_data.id;
                } else {
                    slot_data.id = 'equip_slot_EMPTY';
                    equipmentElements.e_slot_container = slot_data.id;
                }
                
                let slot_container = document.getElementById(equipmentElements.e_slot_container);


// adj in character_setup()

console.log('equipmentElements.e_slot_container: ' + equipmentElements.e_slot_container);
//// new
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
                        createItemElements(slot_container, slot_data, equipmentElements, 'equipment');
                        
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

// WIP Needs update_player_stats() function after equipment swap

        // Add stats for equipmemt from equipped items
        update_equipment();

        create_el('stats_info', 'div', character_container);
        stats_info.innerHTML += '<p><b>STATS:</b></p>';

        // Character stat information
        // Calculates ALL stat effects

        const stat_data = characterData.filter(d => d.type === 'stat');
        stat_data.forEach(stat => {

            let stats_effect = `<br><span style="color:lightgreen">(Base)</span>`;
            // Cwrtain base stats (lvl_mod: true) are increased by player level
            let base_level_stat = 0;
            let equip_stat_amt = 0;
            let d_player_character = saveData[1].savedCharacterData[0];
            let player_level = d_player_character.char_level;
            
            // Main array to store calculations
            let playerStats = characterData.find(d => d.id === 'player_stats');
            
            if (stat.lvl_mod) {
                // Adjust to equipment amount 
                equip_stat_amt = stat.amt - (stat.id === 'armor' ? 100 : 10);
                // Based on player 
                base_level_stat = stat.lvl_amt;
                base_level_stat *= d_player_character.char_level;
                //console.log(base_level_stat);
            }

            switch (stat.id) {
                case 'armor': 
                    let total_armor = base_level_stat + equip_stat_amt;
                    let total_armor_effect = total_armor * 0.1;
                    playerStats.total_armor = total_armor;
                    playerStats.total_armor_effect = total_armor_effect;
                    stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${base_level_stat}, reduces damage received by <b>${base_level_stat*0.1}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, reduces damage received by <b>${equip_stat_amt*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Armor: +${total_armor}, reduces damage received by <b>${total_armor_effect}%</b></span>`;
                    stat.amt = total_armor;
                    break;
                case 'strength':
                    let total_strength = base_level_stat + equip_stat_amt;
                    let total_strength_effect_dmg = total_strength * 0.1;
                    let total_strength_effect_res = (base_level_stat*0.1) + equip_stat_amt;
                    playerStats.total_strength = total_strength;
                    playerStats.total_strength_effect_dmg = total_strength_effect_dmg;
                    playerStats.total_strength_effect_res = total_strength_effect_res;
                    stats_effect = `<br><span style="color:lightgreen">Player level (${player_level}): +${base_level_stat}, increases both melee damage dealt by <b>${base_level_stat*0.1}%</b> and total energy by <b>${base_level_stat*0.1}</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases both melee damage dealt by <b>${equip_stat_amt*0.1}%</b> and total energy by <b>${equip_stat_amt}</b></span>
                    <br><span style="color:lightgreen">Total Strength: +${total_strength}, increases both melee damage dealt by <b>${total_strength_effect_dmg}%</b> and total energy by <b>${total_strength_effect_res}</b></span>`;
                    stat.amt = total_strength;
                    // Assign max resource to array
                    // Default: 100 (for melee classes)
                    let default_max_resource = 100;
                    playerStats.max_resource = default_max_resource + total_strength_effect_res;
                    playerStats.cur_resource = default_max_resource + total_strength_effect_res;
                    break;
                case 'intelligence':
                    let total_intelligence = base_level_stat + equip_stat_amt;
                    let total_intelligence_effect_dmg = total_intelligence * 0.1;
                    let total_intelligence_effect_res = (base_level_stat + equip_stat_amt) * 10;
                    // Assign to array
                    playerStats.total_intelligence = total_intelligence;
                    playerStats.total_intelligence_effect_dmg = total_intelligence_effect_dmg;
                    playerStats.total_intelligence_effect_res = total_intelligence_effect_res;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, increases magic damage dealt by <b>${base_level_stat*0.1}%</b> and total mana by <b>${base_level_stat*10}</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases magic damage dealt by <b>${equip_stat_amt*0.1}%</b> and total mana by <b>${equip_stat_amt*10}</b></span>
                    <br><span style="color:lightgreen">Total Intelligence: +${total_intelligence}, increases magic damage dealt by <b>${total_intelligence_effect_dmg}%</b> and total mana by <b>${total_intelligence_effect_res}</b></span>`;
                    stat.amt = total_intelligence;
                    break;
                case 'dexterity':
                    let default_hit = 90;
                    let total_dexterity = base_level_stat + equip_stat_amt;
                    let total_dexterity_effect = default_hit+(equip_stat_amt*0.1);
                    // Assign to array
                    playerStats.hit_chance = total_dexterity_effect;
                    stats_effect = `
                    <br><span style="color:lightgreen">Player Level (${player_level}) +${base_level_stat}, increases hit chance to <b>${default_hit}%</b>. Base same-level enemy hit chance: <b>${default_hit}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases hit chance by <b>${equip_stat_amt*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Dexterity: +${total_dexterity}. Same-level enemy hit chance: <b>${total_dexterity_effect}%</b></span>`;
                    stat.amt = total_dexterity;
                    break;
                case 'constitution':
                    let total_constitution = base_level_stat + equip_stat_amt;
                    let total_constitution_effect = total_constitution*10;
                    let max_health = total_constitution_effect; // Default 100 at level 1
                    let health_difference = (equip_stat_amt*10)/(base_level_stat*10)*100;
                    // Assign to array
                    playerStats.max_health = max_health;
                    playerStats.cur_health = max_health;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, sets base maximum health to <b>${base_level_stat*10}</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases maximum health by <b>${equip_stat_amt*10}</b> (${Math.round(health_difference)}%)</span>
                    <br><span style="color:lightgreen">Total Constitution: +${total_constitution}, increases total maximum health to <b>${total_constitution_effect}</b> (${Math.round(health_difference+100)}% of base)</span>`;
                    stat.amt = total_constitution;
                    break;
                case 'agility':
                    let base_crit = 5;
                    let total_agility = base_level_stat + equip_stat_amt;
                    let total_agility_effect = base_crit + (equip_stat_amt*0.1);
                    // Assign to array
                    playerStats.total_agility = total_agility;
                    playerStats.total_agility_effect = total_agility_effect;
                    playerStats.agility_equip = equip_stat_amt;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, increases melee critical strike chance by <b>${base_crit}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases melee critical strike chance by <b>${equip_stat_amt*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Agility: +${total_agility}, increases melee critical strike chance by <b>${total_agility_effect}%</b></span>`;
                    stat.amt = total_agility;
                    break;
                case 'wisdom':
                    let base_crit_wis = 5;
                    let total_wisdom = base_level_stat + equip_stat_amt;
                    let total_wisdom_effect = base_crit_wis + (equip_stat_amt*0.1);
                    // Add starting amt
                    playerStats.total_wisdom = total_wisdom;
                    playerStats.total_wisdom_effect = total_wisdom_effect;
                    playerStats.wisdom_equip = equip_stat_amt;
                    stats_effect = `<br><span style="color:lightgreen">Player Level (${player_level}): +${base_level_stat}, increases magic critical strike chance by <b>${base_crit_wis}%</b></span>
                    <br><span style="color:lightgreen">Equipment bonus: +${equip_stat_amt}, increases magic critical strike chance by <b>${(equip_stat_amt)*0.1}%</b></span>
                    <br><span style="color:lightgreen">Total Wisdom: +${total_wisdom}, increases magic critical strike chance by <b>${total_wisdom_effect}%</b></span>`;
                    stat.amt = total_wisdom;
                    break;
                case 'power':
                    let equipped_items = saveData[3].equippedData;
                    let current_weapon = equipped_items.find(i => i.id === 'mh');
                    if (current_weapon && current_weapon.equipped) {
                        let item_info = itemData.find(i => i.id === current_weapon.equipped);
                        let current_weapon_item_info = item_info.gains;
                        let current_weapon_dmg_min = current_weapon_item_info.find(w => w.stat === 'dmg_min');
                        let current_weapon_dmg_max = current_weapon_item_info.find(w => w.stat === 'dmg_max');
                        trackingData[0].current_weapon_dmg_min = current_weapon_dmg_min.amt;
                        trackingData[0].current_weapon_dmg_max = current_weapon_dmg_max.amt;
                        //console.log(current_weapon_dmg_min.amt + ' : ' + current_weapon_dmg_max.amt);
                        let [pwr_weapon_min, pwr_weapon_max] = calculate_weapon_damage(1, stat.amt);
                        //console.log(pwr_weapon_min + ' : ' + pwr_weapon_max)
                        let incr_dmg_min = Math.round((((pwr_weapon_min / current_weapon_dmg_min.amt) - 1) * 100) * 10) / 10;
                        let incr_dmg_max = Math.round((((pwr_weapon_max / current_weapon_dmg_max.amt) - 1) * 100) * 10) / 10;
                        //console.log(incr_dmg_min + ' : ' + incr_dmg_max)
                        stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt}, increases attack damage per turn minimum by <b>${incr_dmg_min}%</b> and attack damage per turn maximum by <b>${incr_dmg_max}%</b></span>`;
                        // Store calculations for tooltip display
                        trackingData[0].pwr_weapon_min = pwr_weapon_min;
                        trackingData[0].pwr_weapon_max = pwr_weapon_max;
                        // Assign to array
                        playerStats.pwr_weapon_min = pwr_weapon_min;
                        playerStats.pwr_weapon_max = pwr_weapon_max;
                    } else {
                        trackingData[0].current_weapon_dmg_min = 0;
                        trackingData[0].current_weapon_dmg_max = 0;
                        trackingData[0].pwr_weapon_min = 1;
                        trackingData[0].pwr_weapon_max = 1.2;
                    }
                    break;
                case 'attackMinimum':
                    let differ_dmg_min = Math.round((trackingData[0].pwr_weapon_min - trackingData[0].current_weapon_dmg_min) * 10) / 10;
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_min}, minimum damage is increased by power from ${stat.amt} to <b>${trackingData[0].pwr_weapon_min}</b></span>`;
                    stat.amt = trackingData[0].pwr_weapon_min;
                    break;
                case 'attackMaximum':
                    let differ_dmg_max = Math.round((trackingData[0].pwr_weapon_max - trackingData[0].current_weapon_dmg_max) * 10) / 10;
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_max}, minimum damage is increased by power from ${stat.amt} to <b>${trackingData[0].pwr_weapon_max}</b></span>`;
                    stat.amt = trackingData[0].pwr_weapon_max;
                    break;
                case 'hitChance':
                    // Assign to array
                    playerStats.hit_chance = stat.amt;
                    let stat_display = 90 + stat.amt + '%';
                    playerStats.hit_chance_display = stat_display;
                    playerStats.hit_flat = 90;
                    playerStats.hit_plus_1 = 87;
                    playerStats.hit_plus_2 = 85;
                    playerStats.hit_plus_3on = 50;
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt}%`;
                    stats_effect += `<br><b>- Probability an attack will cause damage to <u>same-level</u> enemies: ${90+stat.amt}%</b>`;
                    stats_effect += `<br>- Current probability an attack will cause damage to <u>level +1</u> enemies: ${87+stat.amt}%`;
                    stats_effect += `<br>- Current probability an attack will cause damage to <u>level +2</u> enemies: ${85+stat.amt}%`;
                    stats_effect += `<br>- Current probability an attack will cause damage to <u>level +3 or higher</u> enemies: ${50+stat.amt}%</span>`;
                    break;
                case 'criticalStrikeChance':
                    let base_crit_strike_rating = 5;
                    let crit_strike_rating = stat.amt;
                    // 0 unless a +_% Meleee Citical Strike Rating stat
                    playerStats.base_crit_strike_rating = base_crit_strike_rating;
                    playerStats.crit_strike_rating = crit_strike_rating;
                    stats_effect = `<br><span style="color:lightgreen">Combined equipment and base bonus: +${base_crit_strike_rating}%, increases the probability any successful attack is critical by <b>${base_crit_strike_rating}%</b></span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Melee equipment bonus: +${playerStats.agility_equip} Agility, increases the probability a successful melee attack is critical by <b>${playerStats.total_agility_effect}%</b></span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Magic equipment bonus: +${playerStats.wisdom_equip} Wisdom, increases the probability a successful magic attack is critical by <b>${playerStats.total_wisdom_effect}%</b></span>`;
                    stat.amt = playerStats.base_crit_strike_rating + playerStats.crit_strike_rating + '%';
                    break;
            }

            let line_item = stat.label + stat.amt + stats_effect + '<br>';
            if (stat.id === 'hitChance') {
                line_item = stat.label + playerStats.hit_chance_display + stats_effect + '<br>';
            }
            stats_info.innerHTML += line_item;
        });

        // Stat descriptions
        create_el('stats_desc_lbl', 'div', character_container);
        stats_desc_lbl.innerHTML = '<br><b>STAT DEFINITIONS:</b<br>';
        create_el('stats_desc', 'div', character_container);
        stats_desc.innerHTML = '<p>';
        let stat_data_desc = characterData.filter(d => d.type === 'desc');
        stat_data_desc.forEach(stat => {
            let line_item = '<b>' + stat.label + ':</b> ' + stat.def + '<br>';
            stats_desc.innerHTML += line_item;
        });
    }
}

export function calculate_weapon_damage(itemLevel, statPower) {

    let ilvl = itemLevel;

    // weapon damage ramge multiplier
    let min = 1;
    let max = 1.5;
    // calc min/max damage of weapons for player display
    let damage_min = Math.round((1.2*ilvl*min)*10)/10;
    let damage_max = Math.round((1.08*ilvl*max)*10)/10;
        
    // *** multipliers
    
    // Power
    let power = statPower; // 0: 24 - 32.4 / 1: 24.2 - 34.7
    damage_min *= (1 + (0.02 * power));
    damage_max *= (1 + (0.02 * power));
    
    // final calculation
    damage_min = Math.round(damage_min*10)/10;
    damage_max = Math.round(damage_max*10)/10;

    return [damage_min, damage_max];
}

//// WIP Equip new/swap items from inventory
// Swap equipment as equipped/unequipped after clicking 'EQUIP'/'REMOVE'
export function swap_equipment(item, slot, action) {

// BASIC_HELMET, HEAD
    let d_itemData = itemData.find(i => i.id === item);
    let saveDataEquipAll = saveData[3].equippedData;
    let saveDataEquip = saveDataEquipAll.filter(e => e.equipped !== null);

    let currentInventory = saveData[2].inventoryData;

    let equipped_item = saveDataEquip.find(i => i.equipped === d_itemData.id);
    let equipped_item_container = 'equipment_tooltip_container_' + d_itemData.id;
    let e_equipped_item_container = document.getElementById(equipped_item_container);
    // BASIC_HELMET

    // Remove item if match
    if (action === 'remove' && e_equipped_item_container && equipped_item && equipped_item.equipped === item) {
        // Clear item
        //console.log('before');
        //console.log(saveDataEquip);

        let item_to_remove = equipped_item.equipped;
        equipped_item.equipped = null;

        saveDataEquip = saveDataEquipAll.filter(e => e.equipped !== null);

        //console.log('after');
        //console.log(saveDataEquip);

        let character_container = document.getElementById('character_container');
        character_container.innerHTML = '';

        //removeItemTooltip('equipment');
        character_setup();


    }



    // Add removed item to inventory

    // Add item if empty slot

    // Add new item as equipped, move old item to inventory

}

export function update_equipment() {
    // Match saveData with items
    let d_equippedData = saveData[3].equippedData;
    d_equippedData.forEach(item => {
        // Calculate total stats equipped
        let d_itemData = itemData.find(i => i.id === item.equipped);
        if (d_itemData) {
            const stat_data = characterData.filter(d => d.type === 'stat');
            const stat_gains = d_itemData.gains;
            stat_data.forEach(stat => {
                stat_gains.forEach(char_stat => {
                    if (char_stat.stat === stat.id) {
                        stat.amt += char_stat.amt;
                    }
                });
            });
        } /*else {
            // Clear stats
            const stat_data = characterData.filter(d => d.type === 'stat');
            stat_data.forEach(stat => {
                if (stat) {
                    stat.amt = stat.lvl_amt;
                }
            });
        }*/
    });
}

// WIP
export function start_battle_button(elementId) {

    // Data
    let d_player_character = saveData[1].savedCharacterData[0];
    let playerStats = characterData.find(d => d.id === 'player_stats');

    // Main battle container
    let battle_section_container = document.getElementById('battle_section_container');
    
    // Parent for ui
    create_el('battle_ui_container', 'div', battle_section_container);
    battle_ui_container.classList.add('location_box_style');

    create_el('player_name_level', 'div', 'battle_ui_container');
    player_name_level.style.width = '100%';

    create_el('player_name', 'span', 'player_name_level');
    player_name.innerHTML = d_player_character.char_name;
    player_name.style.display = 'inline-block';
    player_name.style.width = '50%';

    create_el('player_level', 'span', 'player_name_level');
    player_level.innerHTML = 'Level: ' + d_player_character.char_level;
    player_level.style.display = 'inline-block';
    player_level.style.width = '50%';
    player_level.style.textAlign = 'right';

    // Create the experience container
    create_el('experience_container', 'div', 'battle_ui_container');
    experience_container.classList.add('bar_with_border_container');

    // Create the experience bar fill (blue bar)
    create_el('experience_bar_fill', 'div', 'experience_container');
    experience_bar_fill.classList.add('bar_with_border_fill');

    create_el('experience_text', 'span', 'experience_container');
    experience_text.classList.add('bar_with_border_text');
    experience_text.innerHTML = 'Experience: <span id="e_char_exp">' + d_player_character.char_exp + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_exp

    create_el('experience_percent', 'span', 'experience_container');
    experience_percent.classList.add('bar_with_border_percent');

    // Calculate experience values
    let d_exp_filter = characterData.filter(c => c.type === 'exp');
    let d_exp = d_exp_filter[0];
    
    // Store experience values for each level
    d_exp.experienceValues = [];
    
    for (let i = 1; i <= d_exp.level_cap; i++) {
        let expToLevel = Math.round((d_exp.starting_val * (i**1.5 + d_exp.level_rate)) / 10) * 10;
        d_exp.experienceValues.push({
            level: i,
            exp_to_level: expToLevel,
            //diff: expToLevel - Math.round((d_exp.starting_val * ((i - 1)**1.5 + d_exp.level_rate)) / 10) * 10 // Uncomment if you need the diff
        });
    }
    
    // Log experience values for each level
    d_exp.experienceValues.forEach(xp => {
        //console.log(`Level: ${xp.level}, Exp to Level: ${xp.exp_to_level}`);
        //console.log(`Level: ${xp.level}, Exp to Level: ${xp.exp_to_level}, Diff: ${xp.diff}`);
        if (d_player_character.char_level === xp.level) {
            d_player_character.char_exp_to_level = xp.exp_to_level;
        }
    });

    create_el('experience_to_level', 'span', 'experience_text');
    experience_to_level.innerHTML = d_player_character.char_exp_to_level;

    // Initial display
    update_xp();

    // Spacer
    create_el('spacer_player_combat_status', 'div', battle_section_container);
    spacer_player_combat_status.style.height = '17px';
    spacer_player_combat_status.style.backgroundColor = 'black';
    spacer_player_combat_status.style.height = '17px';
    // Toggle combat on
    //spacer_player_combat_status.style.height = '5px';

    // Spacer
    create_el('player_combat_status', 'span', battle_section_container);
    player_combat_status.style.textAlign = 'center';
    player_combat_status.style.fontSize = '12px';
    player_combat_status.style.width = '100%';
    player_combat_status.style.display = 'none';
    // Toggle combat on
    //player_combat_status.style.display = 'block';
    player_combat_status.innerHTML = '<b><span style="background-color:red;">&nbsp;&nbsp; IN COMBAT &nbsp;&nbsp;</span></b>';

    // Place battle_ui_container2/3 here
    create_el('player_battle_status_bars', 'div', battle_section_container);
    player_battle_status_bars.style.width = "100%";
    player_battle_status_bars.style.border = 'solid 5px #333';
    // Toggle combat on
    //player_battle_status_bars.style.border = 'solid 5px red';

    // Player health
    // Add to group player_battle_status_bars
    create_el('battle_ui_container2', 'div', 'player_battle_status_bars');

    // Create player health container
    create_el('player_health_container', 'div', 'battle_ui_container2');
    player_health_container.classList.add('bar_with_border_container');

    // Create the player_health bar fill (blue bar)
    create_el('player_health_bar_fill', 'div', 'player_health_container');
    player_health_bar_fill.classList.add('bar_with_border_fill');
    player_health_bar_fill.style.backgroundColor = 'green';
    // Fill calculated below

    create_el('player_current_health_text', 'span', 'player_health_container');
    player_current_health_text.classList.add('bar_with_border_text');
    player_current_health_text.innerHTML = 'Player Health: <span id="e_char_health">' + playerStats.cur_health + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_health

    create_el('player_maximum_health', 'span', 'player_current_health_text');
    player_maximum_health.innerHTML = playerStats.max_health;

    create_el('player_current_health_percent', 'span', 'player_health_container');
    player_current_health_percent.classList.add('bar_with_border_percent');
    let d_player_health_percent = (playerStats.cur_health / playerStats.max_health) * 100;
    d_player_health_percent = Math.round(d_player_health_percent * 10) / 10;
    player_current_health_percent.innerHTML = d_player_health_percent + '%';

    // Display bar width fill
    player_health_bar_fill.style.width = d_player_health_percent + '%';

    // Initial display
    update_health();

    // Player resource
    // Add to group player_battle_status_bars
    create_el('battle_ui_container3', 'div', 'player_battle_status_bars');

    // Create player resource container
    create_el('player_resource_container', 'div', 'battle_ui_container3');
    player_resource_container.classList.add('bar_with_border_container');

    // Create the player_resource bar fill (yellow bar)
    create_el('player_resource_bar_fill', 'div', 'player_resource_container');
    player_resource_bar_fill.classList.add('bar_with_border_fill');
    player_resource_bar_fill.style.backgroundColor = '#6E6800';
    // Fill calculated below

// Test
playerStats.cur_resource = 88;

    create_el('player_current_resource_text', 'span', 'player_resource_container');
    player_current_resource_text.classList.add('bar_with_border_text');
    player_current_resource_text.innerHTML = 'Player Resource: <span id="e_char_resource">' + playerStats.cur_resource + '</span>&nbsp;/&nbsp;';
    // Inserts e_char_resource

    create_el('player_maximum_resource', 'span', 'player_current_resource_text');
    player_maximum_resource.innerHTML = playerStats.max_resource;

    create_el('player_current_resource_percent', 'span', 'player_resource_container');
    player_current_resource_percent.classList.add('bar_with_border_percent');
    let d_player_resource_percent = (playerStats.cur_resource / playerStats.max_resource) * 100;
    d_player_resource_percent = Math.round(d_player_resource_percent * 10) / 10;
    player_current_resource_percent.innerHTML = d_player_resource_percent + '%';

    // Display bar width fill
    player_resource_bar_fill.style.width = d_player_resource_percent + '%';

// Need update_resource

    // Setup battle encounter






    let combat_log = document.getElementById('combat_log');
    combat_log.innerHTML = '';
    toggleElement('h', 'start_battle_button');
    toggleElement('s', 'attack_box_button');
    
    /*toggleElement('sf', 'verses_box');
    toggleElement('sf', 'health_bars');

    let character = characterData.find(char => char.id === 'my_character');
    let d_char_battle_name = document.getElementById('char_name');
    d_char_battle_name.innerHTML = character.name;

    // randomize enemy names
    let enemy = characterData.find(char => char.id === 'enemy_group_1');
    let enemy_battle_name = document.getElementById('enemy_name');
    let random_race = enemy.char_race[Math.floor(Math.random() * enemy.char_race.length)];
    let random_class = enemy.char_class[Math.floor(Math.random() * enemy.char_class.length)];
    // store name in array
    enemy.char_name = random_race + '&nbsp;' + random_class;
    enemy_battle_name.innerHTML = enemy.char_name;*/
}

// Test
// Quick DOM modifications
function gel(id, css = null, inner = null, ...styles) {
    try {
        const element = document.getElementById(id);
        
        // If element is not found, throw an error
        if (!element) {
            throw new Error(`Element with ID '${id}' not found`);
        }

        // Apply CSS class if provided
        if (css) {
            element.classList.add(css);
        }
        
        // Apply innerHTML if provided
        if (inner) {
            element.innerHTML = inner;
        }
        
        // Apply styles if any are provided
        styles.forEach(style => {
            let [property, value] = style.split(':').map(s => s.trim()); // Split and trim the style string
            if (property && value) {
                element.style[property] = value;
            }
        });

        return element;
    } catch (error) {
        // Log the error, ID, and stack trace for easy tracking
        console.error(`Error in manipulating element with ID '${id}':`, error.message);
        console.error(`Error occurred at:`, error.stack);
    }
}

// Example usage:
// let e_my_element = gel('my_element', 'css_class', 'Text', 'display: block', 'padding: 5px');
// e_my_element.innerHTML = 'Change to this text';
/* let mods = [
{ id: 'my_element',
{ css: 'css_class',
{ inner: 'Text',
{ styles: 'display: block',
{ styles: 'padding: 5px'
];*/

export function update_health() {
    
    // Data needed
    let playerStats = characterData.find(d => d.id === 'player_stats');
    // Elements to update
    let e_char_health = document.getElementById('e_char_health');
    let e_player_health_bar_fill = document.getElementById('player_health_bar_fill');
    let e_player_current_health_percent = document.getElementById('player_current_health_percent');
    // If death occurs
    let e_player_current_health_text = document.getElementById('player_current_health_text');
    let e_player_maximum_health = document.getElementById('player_maximum_health');

// Test
playerStats.cur_health = 180;

    // Update elements
    e_char_health.innerHTML = playerStats.cur_health;
    e_player_health_bar_fill.style.width = Math.round(((playerStats.cur_health / playerStats.max_health) * 100)) + '%';
    let d_player_current_health_percent = (playerStats.cur_health / playerStats.max_health) * 100;
    d_player_current_health_percent = Math.round(d_player_current_health_percent * 10) / 10;
    e_player_current_health_percent.innerHTML = d_player_current_health_percent + '%';
    
    // Player death
    if (playerStats.cur_health <= 0) {
        playerStats.cur_health = 0;
        e_player_health_bar_fill.style.width = '0%';
        e_player_current_health_percent.innerHTML = '';
        e_player_current_health_text.innerHTML = '[ PLAYER HAS DIED ]';
        e_player_maximum_health.innerHTML = '';
    }
}

export function toggle_combat_status() {

    let playerCombat = characterData.find(c => c.id === 'player_combat_status');
    // playerCombat.in_combat = true/false
    
    let spacer_player_combat_status = document.getElementById('spacer_player_combat_status');
    let player_combat_status = document.getElementById('player_combat_status');
    let player_battle_status_bars = document.getElementById('player_battle_status_bars');

    // Toggle combat off
    if (playerCombat.in_combat === true) {
        spacer_player_combat_status.style.height = '17px';
        player_combat_status.style.display = 'none';
        player_battle_status_bars.style.border = 'solid 5px #333';
        playerCombat.in_combat = false;
        return;
    }

    // Toggle combat on
    if (playerCombat.in_combat === false) {
        spacer_player_combat_status.style.height = '5px';
        player_combat_status.style.display = 'block';
        player_battle_status_bars.style.border = 'solid 5px red';
        playerCombat.in_combat = true;
        return;
    }
}

export function update_xp() {
    
    // Data needed
    let d_player_character = saveData[1].savedCharacterData[0];
    // Update xp progress
    let e_char_exp = document.getElementById('e_char_exp');
    let e_experience_bar_fill = document.getElementById('experience_bar_fill');
    let e_experience_percent = document.getElementById('experience_percent');
    let e_player_level = document.getElementById('player_level');
    let e_experience_to_level = document.getElementById('experience_to_level');
    let fill_amt = (d_player_character.char_exp / d_player_character.char_exp_to_level) * 100;
    // Experience values
    let d_exp_filter = characterData.filter(c => c.type === 'exp');
    let d_exp = d_exp_filter[0];
    e_char_exp.innerHTML = d_player_character.char_exp;

    // Calculate fill
    fill_amt = Math.round(fill_amt * 10) / 10 + '%';
    e_experience_bar_fill.style.width = fill_amt;
    e_experience_percent.innerHTML = fill_amt;
    if (d_player_character.char_exp >= d_player_character.char_exp_to_level) {
        d_player_character.char_level += 1;
        e_player_level.innerHTML = 'Level: ' + d_player_character.char_level;
        let char_exp_level = d_exp.experienceValues.find(l => l.level === d_player_character.char_level);
        let NEW_xp = char_exp_level.exp_to_level;
        let leftover_xp = d_player_character.char_exp - d_player_character.char_exp_to_level;
        d_player_character.char_exp = leftover_xp;
        d_player_character.char_exp_to_level = NEW_xp;
        fill_amt = (d_player_character.char_exp / d_player_character.char_exp_to_level) * 100;
        fill_amt = Math.round(fill_amt * 10) / 10 + '%';
        e_char_exp.innerHTML = d_player_character.char_exp;
        e_experience_bar_fill.style.width = fill_amt;
        e_experience_percent.innerHTML = fill_amt;
        e_experience_to_level.innerHTML = d_player_character.char_exp_to_level;
    }
}

export function attack_box_button(elementId) {

    let d_enemy_health_cnt = elementsData.find(char => char.id === 'enemy_health_cnt');
    // player character
    let character = characterData.find(char => char.id === 'my_character');

    let d_enemy_health_total = elementsData.find(char => char.id === 'enemy_health_total');

    let enemy = characterData.find(char => char.id === 'enemy_group_1');
    let enemy_health_total = document.getElementById('enemy_health_total');
    enemy_health_total.innerHTML = enemy.enemy_health_total;
    let combat_log = document.getElementById('combat_log');

    // start battle
    if (enemy.enemy_health > 0 && !enemy.dead) {
        toggleElement('s', 'combat_log');

        // Generate a random number to determine if the attack misses (10% chance)
        let missChance = Math.random();

        // Check if the attack misses
        if (missChance < 0.1) {  // 10% chance to miss
            character.stat_damage_caused = 0;
        } else {
            let increments = Math.floor((character.stat_attack_max - character.stat_attack_min) * 10) + 1;
            let randomIncrement = Math.floor(Math.random() * increments);
            character.stat_damage_caused = (character.stat_attack_min + randomIncrement * 0.1).toFixed(1);
        }

        // Deduct damage caused
        enemy.enemy_health -= parseFloat(character.stat_damage_caused) + 100; // test: +100

        let enemy_health_fill = document.getElementById('enemy_health_fill');
        let healthPercentage = (enemy.enemy_health / enemy.enemy_health_total) * 100;
        enemy_health_fill.style.width = healthPercentage + '%';

        // add to combat log
        let d_combat_div = battleData.find(battle => battle.id === 'combat_div_');
        if (!d_combat_div.capped && d_combat_div.cnt <= d_combat_div.cap) {
            d_combat_div.cnt++;
            let new_div = document.createElement('div');
            combat_log.insertBefore(new_div, combat_log.firstChild);

            new_div.id = d_combat_div.id + d_combat_div.cnt;
            new_div.innerHTML += 'TURN #' + d_combat_div.cnt;
            if (character.stat_damage_caused === 0) {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">swords</span><span style="color:#FFCB30;">&nbsp;Your attack against ' + enemy.char_name + ' missed!</span></p>';
            } else {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">swords</span><span style="color:#FFCB30;">&nbsp;You dealt ' + character.stat_damage_caused + ' physical damage to ' + enemy.char_name + '.</span></p>';
            }

            let enemy_health_cnt = document.getElementById('enemy_health_cnt');
            enemy_health_cnt.innerHTML = Math.round(enemy.enemy_health * 10) / 10;
            // enemy death
            if (enemy.enemy_health <= 0 && !enemy.dead) {
                enemy.enemy_health = 0;
                enemy.dead = true;
                // add to enemy defeated_count
                current_level.defeated_count += 1;
            } else {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">heart_minus</span><span style="color:#FF9393;">&nbsp;' + enemy.char_name + '&nbsp;physical attack inflicts 10 damage to you.</span></p>';
            }
            if (enemy.dead) {
                new_div.innerHTML += '<p><span class="material-symbols-outlined">skull</span><span style="color:#F7EB00;font-weight:bold;">&nbsp;You defeated ' + enemy.char_name + '.</span></p>';
                // get loot from battle
                update_inventory();

                //d_inventory.current_loot.push({ id: lootItem.name, cnt: quantity });
                let d_inventory = inventoryElements.find(inv => inv.id === 'inventory');

                if (d_inventory && d_inventory.current_loot) {
                    // Iterate over each item in current_loot
                    d_inventory.current_loot.forEach(item => {
                        // Append each item as a new <p> element
                        new_div.innerHTML += `<p><span class="material-symbols-outlined">backpack</span><span style="color:lightgreen;font-weight:bold;">&nbsp;You looted: ${item.id} x${item.cnt}</span></p>`;
                    });
                }

                // reset div count
                d_combat_div.cnt = 0;
                d_inventory.current_loot = [];

                // setup new battle
                toggleElement('h', 'attack_box_button');
                toggleElement('h', 'verses_box');
                let e_verses_box = document.getElementById('verses_box');

                toggleElement('h', 'health_bars');
                toggleElement('s', 'start_battle_button');
                toggleElement('s', 'enemy_levels');
                enemy.dead = false;
                enemy.enemy_health = enemy.enemy_health_total;
                d_enemy_health_total.cnt = enemy.enemy_health;
                healthPercentage = (enemy.enemy_health / enemy.enemy_health_total) * 100;
                enemy_health_fill.style.width = healthPercentage + '%';
                enemy_health_cnt.innerHTML = enemy.enemy_health;
                enemy_health_total.innerHTML = enemy.enemy_health_total;
            }

            if (d_combat_div.cnt >= d_combat_div.cap) {
                d_combat_div.capped = true;
            }
        }
    }
}

let selectedSlot = null;
export function update_inventory() {

    let savedInventory = saveData[2].inventoryData;
    let savedInventorySlots = savedInventory.filter(i => i.type === 'slot');
    let d_inventoryElements = inventoryElements.filter(i => i.type === 'slot');

    // setup inventory
    if (!savedInventory[0].setup) {
        let inventory_section = document.getElementById('inventory_section');

        let inv_parent = document.createElement('div');
        inv_parent.classList.add('inv_parent');
        inventory_section.appendChild(inv_parent);

        savedInventorySlots.forEach((slot_data, index)  => {

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
            d_inventoryElements[index].e_slot_img = slot_img.id;

            // append inv_slot_counter ÷> z-index: 3
            let slot_counter = document.createElement('div');
            slot_container.appendChild(slot_counter);
            slot_counter.id = 'inventory_slot_counter_' + slot_data.slot_id;
            slot_counter.classList.add('normal', 'inv_slot_counter');
            d_inventoryElements[index].e_slot_counter = slot_counter.id;

            // Add event listener to slot_container
            slot_container.addEventListener('click', () => {
                handleSlotClick(slot_container, slot_img, slot_counter, slot_data, d_inventoryElements);
            });

        });
        savedInventory[0].setup = true;
    }

    // setup drop rates
    characterData.forEach(char => {
        if (char.drops) {
            char.drops.forEach(drop => {
                if (drop.item) {
                    if (Math.random() < drop.rate) {
                        let quantity = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
                        //console.log(`${drop.item}: ${quantity}`);
                        // Setup gold storage
                        handle_gold();
                        // update loot
                        updateLootCount(drop.item, quantity);

                    }
                }
            });
        }
    });

    // insert test items
    updateLootCount('TOOTH', 1);
    updateLootCount('TOOTH', 1);
    updateLootCount('BASIC_HELMET', 1);
    updateLootCount('BASIC_BOOTS', 1);
    updateLootCount('CLOTH_BASIC', 2);
    updateLootCount('CLOTH_BASIC', 1);


}

export function updateLootCount(itemId, quantity) {
    let savedInventory = saveData[2].inventoryData;
    let savedInventorySlots = savedInventory.filter(i => i.type === 'slot');
    let d_inventoryElements = inventoryElements.filter(i => i.type === 'slot'); // For updating element ids
    let lootItem = itemData.find(i => i.id === itemId);

    // If the loot item exists, add it
    if (lootItem) {
        let itemFound = false; // Track if the stackable item was found

        // First, check if the stackable item already exists in any slot
        for (let i = 0; i < savedInventorySlots.length; i++) {
            let slot_data = savedInventorySlots[i];

            // If the item is stackable and already exists in the slot, increment its count
            if (lootItem.stackable && slot_data.contents === lootItem.id) {
                slot_data.cnt += quantity;
                // Update the corresponding inventory element using the index
                let e_slot_counter = document.getElementById(d_inventoryElements[i].e_slot_counter);
                e_slot_counter.innerHTML = slot_data.cnt;
                itemFound = true;
                break;
            }
        }

        // If the stackable item wasn't found in any slot, add it to an empty slot
        if (!itemFound) {
            for (let i = 0; i < savedInventorySlots.length; i++) {
                let slot_data = savedInventorySlots[i];

                // Check if the slot is empty
                if (slot_data.contents === '[ EMPTY ]') {
                    // Assign itemId and quantity to the empty slot
                    slot_data.contents = lootItem.id;
                    slot_data.cnt = quantity;
                    // Update the corresponding inventory element using the index
                    let e_slot_img = document.getElementById(d_inventoryElements[i].e_slot_img);
                    e_slot_img.style.display = 'block';
                    e_slot_img.src = lootItem.img;
                    // (e_slot_counter is hidden for single items)
                    break;
                }
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
        let messages_section_container = document.getElementById('messages_section_container');
        let currentDateTime = new Date().toLocaleString();
        messages_section_container.innerHTML = '' ? '<br>' : '';
        messages_section_container.innerHTML += `<span style="color: gray;">(${currentDateTime})</span><br><span style="color: red;">Inventory is full.</span>`;
    }
}

// Function to handle various slot click situations
function handleSlotClick(slot_container, slotImg, slotCounter, slot_data, d_inventoryElements) {

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

trackingData[0].currentTooltip = null; // Store the currently open tooltip container
trackingData[0].currentTooltipElement = null; // Store the element that triggered the current tooltip
//// type: only 'equipment'
// possible BUG on character_setup()
export function item_tooltip(targetElement, itemId, type) {

    // item = array from itemData
    let item = itemData.find(i => i.id === itemId);

    let item_box_DOM = null;
    let elid = null;

    item_box_DOM = document.getElementById('item_box_' + item.id);
    elid = document.getElementById(targetElement.id);

    trackingData[0].tooltipTargetElementId = targetElement.id;

    // Append item to string
    let item_tooltip_container_item = 'item_tooltip_container_' + item.id;

    if (!trackingData[0].tooltip_open) {
        if (!item_box_DOM) {
            item_box_DOM = document.createElement('div');
            item_box_DOM.id = 'item_box_' + item.id;
            item_box_DOM.classList.add('item_box_equip');
            elid.appendChild(item_box_DOM);
        }

        elid.style.position = 'relative';
        item_box_DOM.style.position = 'relative';

        item_box_DOM.style.backgroundImage = `url(${item.img})`;        
        item_box_DOM.style.backgroundSize = '50px 50px';
        
        item_box_DOM.onclick = (event) => {
 
            // Check and close any currently open tooltip
            if (trackingData[0].currentTooltip && trackingData[0].currentTooltipElement !== elid) {
                removeTooltip();
            }

            event.stopPropagation(); // Prevent the click from propagating

            if (!trackingData[0].tooltip_open) {
                trackingData[0].tooltip_open = true;

                // Create tooltip container
                let item_tooltip_container = document.createElement('div');
                item_tooltip_container.id = 'item_tooltip_container_' + item.id;
                elid.appendChild(item_tooltip_container);

                // Overlay styles
                elid.style.zIndex = '9999';
                item_tooltip_container.style.width = '200px';
                item_tooltip_container.style.pointerEvents = 'auto'; // Allow interactions with the tooltip

                // Calculate the position relative to the container
                const elidRect = elid.getBoundingClientRect();
                const clickX = event.clientX;
                const clickY = event.clientY;

                // Position the tooltip 20px away from the mouse click
                item_tooltip_container.style.left = `${clickX - elidRect.left + 20}px`;
                item_tooltip_container.style.top = `${clickY - elidRect.top + 20}px`;

                setup_tooltip_div(item_tooltip_container.id, item, null, 'equipment');

                // Equip / Remove (back to inventory)
                // for REMOVE button
                /*if (!item.player_equipped) {
                    if (type === 'equipment' && item.type === 'armor' || item.type === 'weapon') {
                        create_el('equip', 'div', 'item_tooltip_div');
                        create_el('equip_btn', 'button', 'equip');
                        equip_btn.classList.add('item_tooltip_armor');
                        equip_btn.style.background = 'black';
                        equip_btn.innerHTML = 'REMOVE';
                    }
                }*/

                // Store the current tooltip and element references
                trackingData[0].currentTooltip = item_tooltip_container;
                trackingData[0].currentTooltipElement = elid;

                // Add event listeners to hide the tooltip
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                }, 20);
            } else {
                removeTooltip();
                elid.style.zIndex = '0';
                item_box_DOM.style.zIndex = '0';

            }
        };
    
    } else {
        let tooltipElement = document.getElementById(item_tooltip_container_item);
        if (tooltipElement) {
            elid.removeChild(tooltipElement);
        }
        trackingData[0].tooltip_open = false;
    }

    function handleOutsideClick(event) {
        const tooltipContainer = document.getElementById(item_tooltip_container_item);
        if (tooltipContainer && !elid.contains(event.target) && !tooltipContainer.contains(event.target)) {
            removeTooltip();
        }
    }

    function removeTooltip() {
        if (trackingData[0].currentTooltip) {
            // reset layer z-index
            trackingData[0].currentTooltipElement.style.zIndex = 'auto'; // Reset z-index
            trackingData[0].currentTooltipElement.removeChild(trackingData[0].currentTooltip);
            trackingData[0].currentTooltip = null;
            trackingData[0].currentTooltipElement = null;
            trackingData[0].tooltip_open = false;
            document.removeEventListener('click', handleOutsideClick);
        }
    }
}

function createItemElements(slot_container, slot_data, elements, type) {

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
        if (slot_container.id !== 'equip_slot_EMPTY') {
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

// Setup each tooltip box
function setup_tooltip_div(tooltip_container_div, item, slot_data, tt_type) {

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
                let d_dmg_min = item_gains.find(i => i.stat === 'dmg_min');
                let d_dmg_max = item_gains.find(i => i.stat === 'dmg_max');
                //let [base_weapon_min, base_weapon_max]  = calculate_weapon_damage(1, 0);
                //console.log(base_weapon_min + ' : ' + base_weapon_max);
                
                // Weapon base damage
                damage_lbl.innerHTML = 'Base damage: ';
                create_el('min_span', 'span', 'damage_lbl');
                min_span.innerHTML = d_dmg_min.amt;
                create_el('sep', 'span', 'damage_lbl');
                sep.innerHTML = '&nbsp;-&nbsp;';
                create_el('max_span', 'span', 'damage_lbl');
                max_span.innerHTML = d_dmg_max.amt;
                
                // 'Damage per turn (with power)'' only printed after update_equipment()
                create_el('damage_pwr_lbl', 'div', 'item_tooltip_div');
                damage_pwr_lbl.classList.add('item_tooltip_armor');
                damage_pwr_lbl.innerHTML = 'Damage Per Turn: ';
                create_el('min_span_pwr', 'span', 'damage_pwr_lbl');
                min_span_pwr.innerHTML = trackingData[0].pwr_weapon_min;
                create_el('sep2', 'span', 'damage_pwr_lbl');
                sep2.innerHTML = '&nbsp;-&nbsp;';
                create_el('max_span_pwr', 'span', 'damage_pwr_lbl');
                max_span_pwr.innerHTML = trackingData[0].pwr_weapon_max;
            }
        });
    }
    
    // Sell price
    create_el('sell_price_lbl', 'div', 'item_tooltip_div');
    sell_price_lbl.classList.add('light_small');
    sell_price_lbl.innerHTML = 'Sell Price: ';
    create_el('gold_div', 'div', 'sell_price_lbl');
    gold_div.style.display = 'inline-block';
    create_el('gold', 'img', 'gold_div');
    gold.src = 'media/currency_gold.png';
    gold.classList.add('currency_gold');
    create_el('sell_price_amt', 'span', 'sell_price_lbl');
    sell_price_amt.classList.add('light_small');
    
    if (item.value > 0) {
        sell_price_amt.innerHTML = '&nbsp;' + item.value;
        if (slot_data.cnt > 1) {
            sell_price_amt.innerHTML += '<br>Sell Price x' + slot_data.cnt + ': ' + '<img src="media/currency_gold.png" class="currency_gold">&nbsp;' + (item.value * slot_data.cnt);
        }
    } else {
        gold_div.style.display = 'none';
        sell_price_amt.innerHTML = '[ None ]';
    }

//// Setup equip buttons here

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
                equip_actions.innerHTML = '<b>Equipment Actions:</b>';
                create_el('unequip_btn', 'button', 'equip_actions');
                unequip_btn.innerHTML = 'REMOVE';
                unequip_btn.addEventListener('click', () => {
                    swap_equipment(item.id, item.slot, 'remove');
                });
            }
        });
    }
}

// Remove ALL tooltips
function removeItemTooltip(type) {
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
export function handle_gold() {
    let inventory_section = document.getElementById('inventory_section');
    let d_gold = inventoryElements.find(inv => inv.id === 'GOLD');

    if (!d_gold.setup && inventory_section) {
        let gold_container = document.createElement('div');
        gold_container.id = 'gold_container';
        inventory_section.appendChild(gold_container);
        gold_container.classList.add('gold_div');

        let gold_span_lbl = document.createElement('span');
        gold_span_lbl.id = 'gold_span';
        gold_container.appendChild(gold_span_lbl);
        gold_span_lbl.classList.add('gold_span');
        gold_span_lbl.innerHTML = '<b>GOLD:</b>&nbsp;' + d_gold.cnt;

        d_gold.setup = true;
    }
}
