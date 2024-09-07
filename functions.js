// functions.js

// import arrays
import { elementsData, inventoryData, itemData, locationsData, characterData, saveData, trackingData } from './data.js';

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

let currentTooltip = null; // Store the currently open tooltip container
let currentTooltipElement = null; // Store the element that triggered the current tooltip

export function item_tooltip(targetElement, itemId) {

    // item = array from itemData
    let item = itemData.find(i => i.id === itemId);

    // tooltip toggle for equipped items
    let item_box_DOM = document.getElementById('item_box_' + item.id);
    let elid = document.getElementById(targetElement.id);

    // Append item to string
    let item_tooltip_container_item = 'item_tooltip_container_' + item.id;

    if (!trackingData[0].tooltip_open) {
        if (!item_box_DOM) {
            item_box_DOM = document.createElement('div');
            item_box_DOM.id = 'item_box_' + item.id;
            item_box_DOM.classList.add('item_box');
            elid.appendChild(item_box_DOM);
        }
    
        elid.style.position = 'relative';
        item_box_DOM.style.position = 'relative';

        item_box_DOM.style.backgroundImage = `url(${item.img})`;        
        item_box_DOM.style.backgroundSize = '50px 50px';

        item_box_DOM.onclick = (event) => {
 
        // Check and close any currently open tooltip
        if (currentTooltip && currentTooltipElement !== elid) {
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

                // Begin tooltip box
                create_el('item_tooltip_div', 'div', item_tooltip_container_item);
                item_tooltip_div.classList.add('item_tooltip');
                
                create_el('item_name', 'div', 'item_tooltip_div');
                item_name.classList.add('normal-bold');
                item_name.innerHTML = '[ ' + item.name + ' ]';
                create_el('item_slot', 'div', 'item_tooltip_div');
                item_slot.classList.add('i_slot_type');
                item_slot.innerHTML = item.slot_name;

                // Set rarity color and item color
                create_el('item_rarity', 'div', 'item_tooltip_div');
                switch (item.rarity) {
                    case 0: item_rarity.classList.add('r_junk');
                            item_rarity.innerHTML = 'Junk';
                            item_name.classList.add('r_junk');
                            break;
                    case 1: item_rarity.classList.add('r_common');
                            item_rarity.innerHTML = 'Common';
                            item_name.classList.add('r_common');
                            break;
                    case 2: item_rarity.classList.add('r_uncommon');
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
                create_el('hr1', 'hr', 'item_tooltip_div');
                create_el('item_desc', 'div', 'item_tooltip_div');
                item_desc.classList.add('light_small');
                item_desc.innerHTML = item.desc;
                create_el('item_stats', 'div', 'item_tooltip_div');
                
                // Set stat gain attributes
                let item_gains = item.gains;
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
                } else {
                    gold_div.style.display = 'none';
                    sell_price_amt.innerHTML = '[ None ]';
                }
//// WIP
                // Equip / Remove (back to inventory)
                create_el('equip', 'div', 'item_tooltip_div');
                create_el('equip_btn', 'button', 'equip');
                equip_btn.classList.add('item_tooltip_armor');
                equip_btn.style.background = 'black';
                equip_btn.innerHTML = 'REMOVE';
                
                // If start_equipped item
                //equip_btn.disabled = 'true';
                if (equip_btn.disabled) {
                    equip_btn.style.display = 'none';
                }

                // Store the current tooltip and element references
                currentTooltip = item_tooltip_container;
                currentTooltipElement = elid;

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
        if (currentTooltip) {
            // reset layer z-index
            currentTooltipElement.style.zIndex = 'auto'; // Reset z-index
            currentTooltipElement.removeChild(currentTooltip);
            currentTooltip = null;
            currentTooltipElement = null;
            trackingData[0].tooltip_open = false;
            document.removeEventListener('click', handleOutsideClick);
        }
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
    create_el('head', 'div', 'char_equipment_container');
    head.classList.add('top-box');
    create_el('div_side_boxes_left', 'div', 'char_equipment_container');
    div_side_boxes_left.classList.add('side-boxes', 'left');
        create_el('shoulders', 'div', 'div_side_boxes_left', 'Shoulders');
        shoulders.classList.add('item-box');
        create_el('neck', 'div', 'div_side_boxes_left', 'Neck');
        neck.classList.add('item-box');
        create_el('chest', 'div', 'div_side_boxes_left');
        chest.classList.add('item-box');
        create_el('wrist', 'div', 'div_side_boxes_left', 'Wrist');
        wrist.classList.add('item-box');
        create_el('ring1', 'div', 'div_side_boxes_left', 'Ring1');
        ring1.classList.add('item-box');
    create_el('char_equipment_image', 'img', 'char_equipment_container');
    char_equipment_image.src = 'media/char_equip.png';
    char_equipment_image.style.height = '240px';
    char_equipment_image.style.width = '80px';
    create_el('div_side_boxes_right', 'div', 'char_equipment_container');
    div_side_boxes_right.classList.add('side-boxes', 'right');
        create_el('hands', 'div', 'div_side_boxes_right');
        hands.classList.add('item-box');
        create_el('waist', 'div', 'div_side_boxes_right', 'Waist');
        waist.classList.add('item-box');
        create_el('legs', 'div', 'div_side_boxes_right', 'Legs');
        legs.classList.add('item-box');
        create_el('feet', 'div', 'div_side_boxes_right');
        feet.classList.add('item-box');
        create_el('ring2', 'div', 'div_side_boxes_right', 'Ring2');
        ring2.classList.add('item-box');
    create_el('div_bottom_boxes', 'div', 'char_equipment_container');
    div_bottom_boxes.classList.add('bottom-boxes');
        create_el('mh', 'div', 'div_bottom_boxes');
        mh.classList.add('item-box');
        create_el('oh', 'div', 'div_bottom_boxes', 'OH');
        oh.classList.add('item-box');

        // First run setup
        if (!trackingData[0].starting_equip_added) {
            // Add starting items
            const starting_items = itemData.filter(i => i.start_equipped === true);
            starting_items.forEach(item => {
                let slot_element = document.getElementById(item.slot);
                if (slot_element) {
                    item_tooltip(slot_element, item.id);
                }
            });
            
            // Save starting equipment to saveData array
            let saveDataEquip = saveData[3].equippedData;
            saveDataEquip.forEach(saveItem => {
                const d_itemData = itemData.find(i => i.slot === saveItem.id && i.start_equipped === true);
                if (d_itemData) {
                    saveItem.equipped = d_itemData.id;
                }
            });
            trackingData[0].starting_equip_added = true;
        }
        
        // Add equipmemt from equipped items
        update_equipment();

        create_el('stats_info', 'div', character_container);
        stats_info.innerHTML += '<p><b>STATS:</b></p>';

        // Character stat information
        // Calculates ALL stat effects
        const stat_data = characterData.filter(d => d.type === 'stat');
        stat_data.forEach(stat => {

            let stats_effect = `<br><span style="color:lightgreen">(Default)</span>`;

            switch (stat.id) {
                case 'armor': 
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-100}, reduces damage received by <b>${(stat.amt-100)*0.1}%</b></span>`;
                    break;
                case 'strength':
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-10}, increases both melee damage dealt by <b>${(stat.amt-10)*0.1}%</b> and total energy by <b>${(stat.amt-10)*10}</b></span>`;
                    break;
                case 'intelligence':
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-10}, increases both magic damage dealt by <b>${(stat.amt-10)*0.1}%</b> and total mana by <b>${(stat.amt-10)*10}</b></span>`;
                    break;
                case 'dexterity':
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-10}, increases hit chance by <b>${(stat.amt-10)*0.1}%</b>. Current same-level enemy hit chance: <b>${((stat.amt-10)*0.1)+90}%</b></span>`;
                    break;
                case 'constitution':
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-10}, increases maximum health by <b>${(stat.amt-10)*0.1}%</b></span>`;
                    break;
                case 'agility':
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-10}, increases melee critical strike chance by <b>${(stat.amt-10)*0.1}%</b></span>`;
                    trackingData[0].stat_agility = stat.amt - 10;
                    break;
                case 'wisdom':
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-10}, increases magic critical strike chance by <b>${(stat.amt-10)*0.1}%</b></span>`;
                    trackingData[0].stat_wisdom = stat.amt - 10;
                    break;
                case 'power':
                    let equipped_items = saveData[3].equippedData;
                    let current_weapon = equipped_items.find(i => i.id === 'mh');
                    let item_info = itemData.find(i => i.id === current_weapon.equipped);
                    let current_weapon_item_info = item_info.gains;
                    let current_weapon_dmg_min = current_weapon_item_info.find(w => w.stat === 'dmg_min');
                    let current_weapon_dmg_max = current_weapon_item_info.find(w => w.stat === 'dmg_max');
                    trackingData[0].current_weapon_dmg_min = current_weapon_dmg_min.amt;
                    trackingData[0].current_weapon_dmg_max = current_weapon_dmg_max.amt;
                    //console.log(current_weapon_dmg_min.amt + ' : ' + current_weapon_dmg_max.amt);
                    let [pwr_weapon_min, pwr_weapon_max]  = calculate_weapon_damage(1, stat.amt);
                    //console.log(pwr_weapon_min + ' : ' + pwr_weapon_max)
                    let incr_dmg_min = Math.round((((pwr_weapon_min / current_weapon_dmg_min.amt) - 1) * 100) * 10) / 10;
                    let incr_dmg_max = Math.round((((pwr_weapon_max / current_weapon_dmg_max.amt) - 1) * 100) * 10) / 10;
                    //console.log(incr_dmg_min + ' : ' + incr_dmg_max)
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt-10}, increases attack damage per turn minimum by <b>${incr_dmg_min}%</b> and attack damage per turn maximum by <b>${incr_dmg_max}%</b></span>`;
                    // Store calculations for tooltip display
                    trackingData[0].pwr_weapon_min = pwr_weapon_min;
                    trackingData[0].pwr_weapon_max = pwr_weapon_max;
                    break;
                case 'attackMinimum':
                    let differ_dmg_min = Math.round((trackingData[0].pwr_weapon_min - trackingData[0].current_weapon_dmg_min) * 10) / 10;
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_min}, minimum damage is increased by power from ${stat.amt} to <b>${trackingData[0].pwr_weapon_min}</b></span>`;
                    break;
                case 'attackMaximum':
                    let differ_dmg_max = Math.round((trackingData[0].pwr_weapon_max - trackingData[0].current_weapon_dmg_max) * 10) / 10;
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${differ_dmg_max}, minimum damage is increased by power from ${stat.amt} to <b>${trackingData[0].pwr_weapon_max}</b></span>`;
                    break;
                case 'hitChance':
                    stats_effect = `<br><span style="color:lightgreen">Equipment bonus: +${stat.amt}%, current probability an attack will cause damage to same-level enemies: ${90+stat.amt}%</span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Current probability an attack will cause damage to <u>level +1</u> enemies: ${87+stat.amt}%</span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Current probability an attack will cause damage to <u>level +2</u> enemies: ${85+stat.amt}%</span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Current probability an attack will cause damage to <u>level +3 or higher</u> enemies: ${50+stat.amt}%</span>`;
                    break;
                case 'criticalStrikeChance':
                    stats_effect = `<br><span style="color:lightgreen">Combined equipment and base bonus: +${stat.amt*100}%, increases the probability any successful attack is critical by <b>${stat.amt*100}%</b></span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Melee equipment bonus: +${trackingData[0].stat_agility} Agility, increases the probability a successful melee attack is critical by <b>${trackingData[0].stat_agility*0.1+5}%</b></span>`;
                    stats_effect += `<br><span style="color:lightgreen">- Magic equipment bonus: +${trackingData[0].stat_wisdom} Wisdom, increases the probability a successful magic attack is critical by <b>${trackingData[0].stat_wisdom*0.1+5}%</b></span>`;
                    break;
            }
            
            if (stat.id === 'hitChance' || stat.id === 'criticalStrikeChance') {
                stat.amt = (stat.amt * 100) + '%';
            }
            if (stat.id === 'attackMinimum') {
                stat.amt = trackingData[0].pwr_weapon_min;
            }
            if (stat.id === 'attackMaximum') {
                stat.amt = trackingData[0].pwr_weapon_max;
            }

            let line_item = stat.label + stat.amt + stats_effect + '<br>';
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

export function update_equipment() {
    // Match saveData with items
    let d_equippedData = saveData[3].equippedData;
    d_equippedData.forEach(item => {
        // Calculate total armor equipped
        let d_itemData = itemData.find(i => i.id === item.equipped);
        if (d_itemData) {
            const stat_data = characterData.filter(d => d.type === 'stat');
            const stat_gains = d_itemData.gains;
            stat_data.forEach(stat => {
                //stat_gains.id = stat_gains.id.toLowerCase();
                stat_gains.forEach(char_stat => {
                    if (char_stat.stat === stat.id) {
                        stat.amt += char_stat.amt;
                    }
                });
            });
        }
    });
}

export function start_battle_button(elementId) {

    let combat_log = document.getElementById('combat_log');
    combat_log.innerHTML = '';
    toggleElement('h', 'start_battle_button');
    toggleElement('s', 'attack_box_button');
    toggleElement('sf', 'verses_box');
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
    enemy_battle_name.innerHTML = enemy.char_name;
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
                process_loot();

                //d_inventory.current_loot.push({ id: lootItem.name, cnt: quantity });
                let d_inventory = inventoryData.find(inv => inv.id === 'inventory');

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
export function process_loot() {

    let d_inventory = inventoryData.find(inv => inv.id === 'inventory');

    // setup inventory
    if (!d_inventory.setup) {
        let inventory_section = document.getElementById('inventory_section');

        let inv_parent = document.createElement('div');
        inv_parent.classList.add('inv_parent');
        inventory_section.appendChild(inv_parent);

        for (let i = 1; i <= d_inventory.size; i++) {
            let slot_container = document.createElement('div');
            inv_parent.appendChild(slot_container);
            slot_container.id = 'slot_container_' + i;
            slot_container.classList.add('inv_slot_container');

            let new_slot = document.createElement('div');
            slot_container.appendChild(new_slot);
            new_slot.id = 'inventory_slot_' + i;
            new_slot.classList.add('normal-small', 'center', 'inv_slot');
            new_slot.innerHTML = '[ EMPTY ]';
            new_slot.style.display = 'none';
            
            // append with zIndex: 2
            let new_slot_img = document.createElement('img');
            slot_container.appendChild(new_slot_img);
            new_slot_img.id = 'inventory_slot_img_' + i;
            new_slot_img.style.zIndex = 2;
            new_slot_img.style.height = '50px';
            new_slot_img.style.width = '50px';
            new_slot_img.style.position = 'absolute';
            new_slot_img.style.top = '0';
            new_slot_img.style.paddingTop = '5px';
            new_slot_img.style.right = '0';
            new_slot_img.style.paddingRight = '5px';
            new_slot_img.style.display = 'none';
            
            // append inv_slot_counter ÷> z-index: 3
            let new_slot_counter = document.createElement('div');
            slot_container.appendChild(new_slot_counter);
            new_slot_counter.id = 'inventory_slot_counter_' + i;
            new_slot_counter.classList.add('normal', 'inv_slot_counter');

            // Add event listener to slot_container
            slot_container.addEventListener('click', () => {
                handleSlotClick(slot_container, new_slot, new_slot_img, new_slot_counter);
            });

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
    
    // WIP insert test items
    //console.log('add_items');
    updateLootCount('TOOTH', 1);
    updateLootCount('TOOTH', 1);
    updateLootCount('BASIC_HELMET', 1);
    updateLootCount('BASIC_HELMET', 1);

    // reset empty slots
    //applyTransparencyToEmptySlots();
}

// Function to handle slot click
function handleSlotClick(slot_container, slot, slotImg, slotCounter) {
    //applyTransparencyToEmptySlots();

    if (selectedSlot === null) {
        // First click: selecting the filled slot
        if (slot.innerHTML !== '[ EMPTY ]') {
            selectedSlot = {
                slot_container,
                slot,
                slotImg, 
                itemImg: slotImg.src,
                slotCounter,
                itemId: slot.innerHTML,
                quantity: slotCounter.innerHTML
            };
            slot_container.style.backgroundColor = 'green';
        }
    } else {
        if (selectedSlot.slot_container === slot_container) {
            // If the selected slot is clicked again, deselect it
            slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            selectedSlot = null;
        } else if (slot.innerHTML === '[ EMPTY ]') {
            // Second click: selecting the destination slot
            // Move the item to the new slot
            slot.innerHTML = selectedSlot.itemId;
            slotImg.style.display = 'block';
            slotImg.src = selectedSlot.itemImg;
            slotCounter.innerHTML = selectedSlot.quantity;

            // Clear the original slot
            selectedSlot.slot.innerHTML = '[ EMPTY ]';
            selectedSlot.slot.style.backgroundColor = 'gray';
            selectedSlot.itemImg = '';
            selectedSlot.slotCounter.innerHTML = '';

            // Reset the background colors
            selectedSlot.slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            slot.style.backgroundColor = 'gray';

            // Reset the selectedSlot
            selectedSlot = null;

        } else if (slot.innerHTML !== '[ EMPTY ]') {
            // Swap the items between the two slots
            let tempItemId = slot.innerHTML;
            let tempImgId = slotImg.src;
            let tempQuantity = slotCounter.innerHTML;

            // Move the selected slot's item to the clicked slot
            slot.innerHTML = selectedSlot.itemId;
            slotImg.src = selectedSlot.itemImg;
            slotCounter.innerHTML = selectedSlot.quantity;

            // Move the clicked slot's item to the previously selected slot
            selectedSlot.slot.innerHTML = tempItemId;
            selectedSlot.slotImg.src = tempImgId;
            selectedSlot.slotCounter.innerHTML = tempQuantity;

            // Reset the background colors
            selectedSlot.slot_container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            slot.style.backgroundColor = 'gray';
            

            // Reset the selectedSlot
            selectedSlot = null;
        }
    }
    applyTransparencyToEmptySlots();
}

// Function to find the corresponding loot item and increment its count
export function updateLootCount(itemId, quantity) {
    const lootItem = itemData.find(loot => loot.id === itemId);
    let d_inventory = inventoryData.find(inv => inv.id === 'inventory');

    if (lootItem) {
        lootItem.cnt += quantity;
        if (!d_inventory.current_loot) {
            d_inventory.current_loot = [];
        }
        // needs to go in saveData
        d_inventory.current_loot.push({ id: lootItem.name, cnt: quantity });
    }

    let itemAdded = false;
    // First, check for a matching item in the inventory slots
    for (let i = 1; i <= 10; i++) {
        let slot = document.getElementById(`inventory_slot_${i}`);
        let slotCounter = document.getElementById(`inventory_slot_counter_${i}`);

        if (slot && slot.innerHTML === lootItem.name) {
            if (lootItem.stackable) {
                // If the item already exists in this slot, add the quantity
                slotCounter.innerHTML = lootItem.cnt; //parseInt(slotCounter.innerHTML) + quantity;
                lootItem.inv_added = true;
                itemAdded = true;
                break; // Exit the loop once the item quantity is updated
            }
        }
    }

    // If the item was not found, add it to the first empty slot
    if (!itemAdded) {
        for (let i = 1; i <= 10; i++) {
            let slot = document.getElementById(`inventory_slot_${i}`);
            let slotCounter = document.getElementById(`inventory_slot_counter_${i}`);
            let slotImage = document.getElementById(`inventory_slot_img_${i}`);

            if (slot && slot.innerHTML === '[ EMPTY ]') {
                if (itemId !== 'GOLD') {
                    slot.style.backgroundColor = 'gray';
                    slot.innerHTML = lootItem.name;
                    slotImage.style.display = 'block';
                    slotImage.src = lootItem.img;
                    if (quantity > 1) {
                        slotCounter.innerHTML = quantity;
                    }
                    lootItem.inv_added = true;
                } else {
                    let gold_span = document.getElementById('gold_span');
                    if (gold_span && lootItem.cnt > 0) {
                        gold_span.innerHTML = '<b>GOLD:</b>&nbsp;' + lootItem.cnt;
                    }
                }
                break; // Exit the loop once the item is added
            }
        }
    }
}

// Ensure empty slots have the transparent background
function applyTransparencyToEmptySlots() {
    let d_inventory = inventoryData.find(inv => inv.id === 'inventory');

    for (let i = 1; i <= d_inventory.size; i++) {
        let slot = document.getElementById(`inventory_slot_${i}`);
        let slotImg = document.getElementById(`inventory_slot_img_${i}`);
        let slotContainer = document.getElementById(`slot_container_${i}`);

        if (slot.innerHTML === '[ EMPTY ]') {
            slot.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            slotContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            slotImg.style.display = 'none';
        }
    }
}
// Call this function after setting up the inventory or updating it
// applyTransparencyToEmptySlots();

// Setup gold elements, purchases, etc
export function handle_gold() {
    let inventory_section = document.getElementById('inventory_section');
    let d_gold = inventoryData.find(inv => inv.id === 'GOLD');

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
