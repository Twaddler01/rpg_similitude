// general_functions.js

import { trackingData, characterData } from './data.js';
import { add_message } from './functions.js';
import { update_inventory } from './inventory.js';
import { update_character, update_character_stats, update_equipment } from './character.js';
import { update_gather } from './gather.js';
import { reset_battle } from './battle.js';

// Override console.log, console.warn, and console.error for exporting into a file
export function logExport() {
    var logs = [];
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    console.log = function (message) {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        logs.push(`LOG: ${message}`);
        originalConsoleLog(message);
    };

    console.warn = function (message) {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        logs.push(`WARNING: ${message}`);
        originalConsoleWarn(message);
    };

    console.error = function (message) {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        logs.push(`ERROR: ${message}`);
        originalConsoleError(message);
    };

    let exportButton = document.createElement('button');
    exportButton.id = 'exportButton';
    exportButton.innerHTML = 'Export Logs';
    document.body.appendChild(exportButton);

    exportButton.addEventListener("click", function () {
        // Save logs to a file
        let logString = logs.join('\n');

        // Create a Blob containing the text data
        const blob = new Blob([logString], { type: 'text/plain' });

        // Create a download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'logs.txt';

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    });
}

// Allow exporting of HTML to inspect/debug elements
export function htmlExport() {
    // Create the "Export HTML" button
    const exportHTMLButton = document.createElement('button');
    exportHTMLButton.id = 'exportHTMLButton';
    exportHTMLButton.textContent = 'Export HTML';
    
    // Append the button to the document body
    document.body.appendChild(exportHTMLButton);
    
    // Add an event listener to the "Export HTML" button
    exportHTMLButton.addEventListener("click", function () {
        // Get the HTML content of the entire document
        let htmlContent = document.documentElement.outerHTML;
    
        // Create a Blob containing the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
    
        // Create a download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'vsim_page.html';
    
        // Append the link to the document
        document.body.appendChild(link);
    
        // Trigger the download
        link.click();
    
        // Remove the link from the document
        document.body.removeChild(link);
    });
}

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
    }
}

// Show or hide sections (clear/create or hide/show)
export function toggle_section(section) {

    let playerCombat = characterData.find(c => c.id === 'player_combat_status');
    //if (!playerCombat.in_combat) {
        if (section === 'gather') {
            let e_gather_section = document.getElementById('gather_section');
            let e_gather_container = document.getElementById('gather_container');
            if (trackingData[0].t_gather_section) {
                trackingData[0].t_gather_section = false;
                update_gather();
                e_gather_section.innerHTML = 'Gather Section <span class="normal">[ SHOW ]</span>';
            } else {
                trackingData[0].t_gather_section = true;
                update_gather();
                e_gather_section.innerHTML = 'Gather Section <span class="normal">[ HIDE ]</span>';
            }
        }
    
        if (section === 'stats') {
            let e_character_stats_section = document.getElementById('character_stats_section');
            let e_character_stats_container = document.getElementById('character_stats_container');
    
            if (trackingData[0].t_character_stats_section) {
                trackingData[0].t_character_stats_section = false;
                e_character_stats_container.style.display = 'none';
                e_character_stats_container.style.overflow = 'auto';
                e_character_stats_section.innerHTML = 'Character Stats <span class="normal">[ SHOW ]</span><div id="space" style="background-color:#333;width:100%;padding:5px"></div>';
            } else {
                trackingData[0].t_character_stats_section = true;
                update_equipment();
                update_character_stats(true);
                e_character_stats_container.style.display = 'block';
                e_character_stats_section.innerHTML = 'Character Stats <span class="normal">[ HIDE ]</span>';
            }
        }
    
        if (section === 'character') {
            let e_character_section = document.getElementById('character_section');
            let e_character_container = document.getElementById('character_container');
            if (trackingData[0].t_character_section) {
                trackingData[0].t_character_section = false;
                update_character();
                e_character_section.innerHTML = 'Character Section <span class="normal">[ HIDE ]</span>';
            } else {
                trackingData[0].t_character_section = true;
                update_character();
                e_character_section.innerHTML = 'Character Section <span class="normal">[ SHOW ]</span>';
            }
        }
    
        if (section === 'battle') {
            let e_battle_section = document.getElementById('battle_section');
            let location_container = document.getElementById('location_container');
    
            // Toggle only if out of combat
            if (trackingData[0].t_battle_section) {
                location_container.style.display = 'none';
                e_battle_section.innerHTML = 'Battle Section <span class="normal">[ SHOW ]</span><div id="space" style="background-color:#333;width:100%;padding:5px"></div>';
                let e_attack_box_button = document.getElementById('attack_box_button');
                if (e_attack_box_button) {
                    e_attack_box_button.style.display = 'none';
                }
                let e_change_location_button = document.getElementById('change_location_button');
                if (e_change_location_button) {
                    e_change_location_button.style.display = 'none';
                }
                reset_battle();
                trackingData[0].t_battle_section = false;
            } else {
                location_container.style.display = 'block';
                e_battle_section.innerHTML = 'Battle Section <span class="normal">[ HIDE ]</span>';
                trackingData[0].t_battle_section = true;
            }
        }
    
        if (section === 'inventory') {
            let e_inventory_section = document.getElementById('inventory_section');
            let e_inventory_section_container = document.getElementById('inventory_section_container');
            if (trackingData[0].t_inventory_section) {
                e_inventory_section_container.innerHTML = '';
                e_inventory_section.innerHTML = 'Inventory Section <span class="normal">[ SHOW ]</span><div id="space" style="background-color:#333;width:100%;padding:5px"></div>';
                trackingData[0].t_inventory_section = false;
            } else {
                trackingData[0].t_inventory_section = true;
                update_inventory();
                e_inventory_section.innerHTML = 'Inventory Section <span class="normal">[ HIDE ]</span>';
            }
        }
}

export function add_section_clicks() {
    toggle_section('character');
    let e_character_section = document.getElementById('character_section');
    e_character_section.addEventListener('click', () => {
        toggle_section('character');
    });
}