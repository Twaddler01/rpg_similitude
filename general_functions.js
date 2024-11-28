// general_functions.js

import { trackingData, characterData } from './data.js';
import { add_message } from './functions.js';
import { update_inventory } from './inventory.js';
import { update_character } from './character.js';
import { update_gather } from './gather.js';

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

        // Format the HTML content for better readability
        let formattedHTML = formatHTML(htmlContent);

        // Create a Blob containing the formatted HTML content
        const blob = new Blob([formattedHTML], { type: 'text/html' });

        // Create a download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'page.html';

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    });

    // Helper function to format HTML
    function formatHTML(html) {
        const INDENT = '  '; // Two spaces for indentation
        let formatted = '';
        let level = 0;
    
        // Regex to match self-closing tags
        const selfClosingTags = /^<\w[^>]*\/>|^<br\s*\/?>|^<img[^>]*\/?>|^<input[^>]*\/?>|^<meta[^>]*\/?>|^<link[^>]*\/?>/;
    
        // Split the HTML by tags
        html.split(/(?=<\/?[^>]+>)/g).forEach((line) => {
            line = line.trim(); // Trim whitespace
    
            if (line.match(/^<\/\w/)) {
                // Decrease level for closing tags
                level--;
            }
    
            formatted += INDENT.repeat(level) + line + '\n';
    
            if (line.match(/^<\w(?!.*\/>)/) && !line.match(selfClosingTags)) {
                // Increase level for non-self-closing opening tags
                level++;
            }
        });
    
        return formatted;
    }
}

/*
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
        link.download = 'page.html';

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    });
}*/

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
