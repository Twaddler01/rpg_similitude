# RPG Similitude
# URL
https://twaddler01.github.io/rpg_similitude/
# IMPORTANT
- To avoid database problems, use SLOT2 by deleting it first and creating a new character in that slot. Updates are continually being made to the database(s).
# Issues
- May be issues loading code from URL. For best results, download .zip and use localhost server. (For Android, I use Simple HTTP server):
https://play.google.com/store/apps/details?id=com.phlox.simpleserver
- Identified an intermittent css error on Chrome (Mobile) that throws error when applying a css classList. This is NOT an issue when using Firefox Mobile. For now, recommend using the Firefox browser until issue can be addressed. Likely a Github server-related error since code executes error free on Chrome locally. Another workaround on mobile is listed above by using an HTTP server (running a Node.js server in Termux also works fine on my Android device).
# BUGS
- REVIVE seems to work intermittently, likely due an async issue with database timing. Page can be reloaded to reset.
- Gather tab eventually bugs out at certain unlocked levels, needs better database integration. 

# Updates
11-23-2024
- "Gather" is still in progress, but the experience and unlocks portion of herb gathering are essentially done.
- Updated gatherData to work without its old array using integrated JSON database in one place. Since it was easiest to load images dynamically, these are generated per session. May eventually just add each img URL individually in JSON database for consistency.
- Updated create_el to work dynamically by using unique IDs when neccesary.

11-22-2024
- Added an [ Equipped ] display for weapons that shows the damage per turn as if weapon was equipped. This is in preparation for a "CURRENTLY EQUIPPED" tooltip to sit alongside regular one for comparisons in a future update.
- Cleaned out some old code and fixed some tabbing for better code look.
- Most create_el function calls now use const assignments to ensure proper element assignments.

11-21-2024
- Migrated all array data over to indexedDB. There may be some bugs or quirks but it seems to run generally smooth at the moment.
- Created temporary function to load an existing character slot template (slot 1) for testing purposes. Slot 2 is using blank template and should retain any progress on reload. Will probably eventually give option to import or export a .JSON save file to backup the data locally as an encrypted hash.

11-20-2024
- In process of converting code to SLOT format. Right now, code is between array (old method) and IndexedDB (new method). This will potentially use temporary arrays and direct updates to the database following JSON templates.
- Updated through STATS tab so far with async data used with database.

11-11-2024
- In process of moving all array data over to the IndexedDB format. This will require revamping a lot of functions, but trying to simplify it with new dynamic functions for database modifications. The database will ensure game can be saved, modified, and played more efficiently than using temporary array assignments. JSON will be used to create a new game to setup proper structure initially, then modifications can be easily made, while keeping the structure essentially the same as the array once was.
- This setup will allow for saved data "slots" and better functionality once code is ready for app development.

11-09-2024
- Cleaned up some elements and commented out test_section unless needed. Will be phasing out elementsData next.
- Need a starting tab area for first load to give overview and options to create new game or load existing game.
- An autosave feature would be beneficial to store JSON changes of saveData. Will soon test this option instead of using browser storage. Since ultimate goal is app development, will likely use Node.js soon for a server/client utilization instead.

11-08-2024
- Moved relevant functions to battle.js.
- Adjusted various parts of "next attacks" to match new format of clearing/recreating elements.
- Updated combat status to disable all tabs while in combat or while player is dead (until revived).
- Added a messages display area and corresponding function and array. Only player level-ups are integrated at this time.

11-06-2024
- Updated stats for battles using equipment.js function. Needs adjustments for balance due to armor mitigation, player damage increase, etc but seems to be working well so far.
- Added all other sections to tabs. Still need to move messages above tabs, but not sure how this design will go as of yet.
- Added new battle.js but need all relevant functions moved over to it.
- XP gains may need to be adjusted for QUESTS if decided to go that route eventually.

11-05-2024
- Stats area completed. Stats are based solely on battleStats array, which should ensure easy and updated values verses the old method. Still needs final testing, but seems to be working well so far. Next step is to ensure updates are applied when needed for new setup verses old setup.

11-03-2024
- Working on moving all stats over to new function from equipment.js. Integration not yet fully complete. There will likely be errors and log outputs at the moment.
- Decided all elements will be setup using tab layout, which will require recoding many functions, but worth the effort for style, layout, etc.
- New character creation needs future work. Right now, values are only for player level and display purposes. Will create select options for class/race and checks of proper values for player name, etc. Defaults if nothing is entered will be used for testing dynamics.

11-01-2024
- Updated equipment.js.
- Working on potentially adding "tabs" instead of the expand-type design. It should be a lot more visually appealing. Will require changing "toggle" setup and/or removing of it, but so far it looks much cleaner.

10-31-2024
- FIXED BUG: Clicking on an item in inventory and then another on the edge of box will cause image to show incorrectly (for some items). Can be corrected after retoggle.
- Inventory BUG corrected by removing all click listeners first. Also addressed issue where slot_id was mismatched, placing a swapped item in wrong slot--now slot ids matach original.
- Disabled toggles while in combat and it now displays error message. Easiest fix for now, since toggle was interfering with battles. This also addresses disabling item or inventory swaps while in combat. May give an option to cancel or attempt evade of battle with a minor penalty later.
- WIP Player death needs this integration too.
- Added weapon icons for newly added basic weapons. Note that equipment and enemies are quite unbalanced still.
- WIP Revamping stats for code simplicity and balance. Starting equipment.js for stats.

10-30-2024
- Updated encounter looting options and corrected a few issues.
- Added basic weapons for location 0 (JSON format setup, no img yet--still a WIP). 

10-29-2024
- Modified saveData to better account for data not needing to be saved. For now on, using separate arrays for data that doesn't need to be saved. May save dynamic and random encounterData, but haven't decided yet.
- Encounters work for a few more levels, but loot not yet added for the enemies.

10-28-2024
- Updated data.js for arrays to be accessed directly.
- Minor adjustments for data management, especially for dynamic array modifications.

10-26-2024
- Added gathering skills. "Tailor" is probably going to move to CRAFT whenever code is updated for CRAFT skills, which will eventually be implemented. Only Herb Gathering is semi-functional.
- Updated some styles to integrate progress/skill bar function, where all bar elements will soon be moved to and created with instead. So far, this function with methods is extremely useful -- it is a new concept for this coder but very useful and will likely be used more in the future. 

10-23-2024
- Updated options to create new game from default JSON template. JSON can be both imported or exported, keeping progress in tact. Localstorage or encrption not yet setup, but code is now setup with this future implementation in mind. Seems to be more reasonable for now while in development due to refreshes from browser cache, which could cause interference with HTTP server used for testing. Currently run code in browser "incognito" mode for testing purposes, which doesn't work easily for cache or localstorage.

10-20-2024
- Corrected some issues with locationsData elements and attack/change location buttons and toggling.
- Cannot toggle Battle Section off while in combat.
- Added random global drops to Starting Location, will be usable dynamically in other locations soon.
- Locations may follow an enemy 'type' pattern, such as 'elementals' sharing loot tables, etc.

10-19-2024
- Added option to import JSON (pasting in newSaveData.json starts a new game). This allows data to be saved.
- Added export option to export the saveData array as JSON. Will soon add localstorage usage with basic ANSI encryption. Plan to not only use localstorwge but also import/export of the encrypted save contents.
- New character creation is done before loading all other elements if characterData (name, race, class) is not present yet.
- Added basic damage mitigation from armor. Characters will only have 100 base armor at all times. Increases in armor per level are just too extreme.
- Various other updates.

10-17-2024
- Updated inventory so players can sell items for gold from inventory tooltip.
- Added function to generate dynamic equipment sets.
- WIP: Adding random loot drops from dynamically generated items.
- WIP: Adding dynamic enemies for other locations (besides Starting Zone) for more battles.

10-15-2024
- Minor updates.
- Created inventory.js and character.js files to shorten functions.js file. Battle Section functions will be moved once section is more complete.

10-14-2024
- Minor changes made. Re-uploaded media items. There is a known server issue on Google Chrome browser (Mobile on Android) with CSS handling but Firefox Mobile (Android) still seems to work fine.

10-12-2024
- Updated sections with option to hide or show each on toggle.
- Battles are more complete, with option to continue fighting or choose a different location. Still only testing Starting Location but working on random and more dynamic options to integrate for other locations.
- Combat log and loot are now integrated in battles.
- Player death has a REVIVE option (10 second wait). No penalty yet.

09-27-2024
- Combat is being worked on statically with a starting zone and will eventually be dynamic.
- Basic attacks, hit, and crit are functional for player, but no enemy actions yet. Need to integrate loot as well.
- Will sort combat functions and shorten functions.js likely next update.
- Possible correction needed for how player selects locations and chooses battles for simplicity.
- Working on using WebView integration with Android Studio to eventually get code into an APK for mobile use.

09-24-2024
- Updated with some visual enhancements and working on getting first battle created.
- Ensured saveData array is ready for saving/loading. Will likely use an encrypted array so game data can be saved to a file or copy/pasted.

09-21-2024
- Inventory SHOULD be working as intended. May still be bugs. Need to add the newer code to swap equipment function but wanted to commit now in case of unwanted behavior during integration.
- A little restructuring with "general_functions.js" to make code cleaner. Will probably break down even more in functions.js soon, since it has about 2000 lines of code and is harder to navigate this way, etc.

09-19-2024
- Worked on an issue with equipment items that was removing an extra item from inventory when integrating 'REMOVE' button. Button works now but still needs actions (like placing back into inventory, etc). But, it is removed from array and disappears from elements when called again, as intended.
- "Equipment" and "inventory" elements/tooltips are treated more universal, with slight variations between functions to perform similar tasks, which gives code a much cleaner organization.
- Allowed user zooming in index.htnl file, which will probably stay.

09-14-2024
- Added health and resource bars for combat (energy/mana).
- Created a function for showing player status as in combat, which is whenever a battle is started.
- Need enemies and abilities to equip/swap gear as top priorities.

09-14-2024
- Added many stat calculations, stored main values in array for use in battles. Finished health bar.
- Need dynamic ability for equipment changes in a function to update as equipment is modified. Likely, this is the next process before starting on the "battle" functionality.

09-13-2024
- Player experience elements and data added and tested.
- Possibly will soon need to split functions.js into categories of functions, as code is getting quite lengthy.

09-11-2024
- Inventory "mess" resolved and data is properly placed in saveData array. Need a bit more debugging for testing purposes. Thinking of adding a "bank" for extra storage space. Need to setup working Gold currency, which is essentially ready to go already.

09-10-2024
- Inventory is working but messy. Will be revamping system for easy save.

09-06-2024
- Updated inventory to include items and image icons. Needs tooltip work and needs to save inventory data to saveData array.

09-05-2024
- Uploaded media files.
- Worked on stats. Adding each stat description/calculation to array in order to update to saveData eventually. Still working on details.
- Next long-term goal is adding more equipment and integrating with inventory to equip/unequip items with stats automatically updating.

09-04-2024
- Updated equipment section some more. Added default equipment and stat information. Armor is now totaled up based on what is equipped starting out, will add other stats dynamically soon.
- Likely need a few functions to update equipment slots as equipment is swapped, etc.
- Need current icon images uploaded to Github for full functionality.

09-02-2024
- Character section added for user to specify player info (name, race, class) if not yet created or saved.
- Added popup item tooltip and added equipment data. Ready for default equipment and adding extras for stats display from itemData array
- Items are ready to be worked, ensuring they are always saved in the main saveData array.

08-30-2024
- Completely revamped locations using a more direct approach. Other method required way too much code than necessary, including array data. New simplified approach will just require tracking locations and player 'kills', which it will keep memory of in future editions. This keeps data better maintained for progression, saving data, and for any future updates to new locations, etc. Next WIP is working fighting/battles and more character data, like leveling, skills, professions, etc.
- Locations has a great start now, but need to reintegrate battles with new design.
- Various scenarios are possible by manually changing saved array data. Added RESET to clear saved data easily, which will be needed for testing and the final product.

08-27-2024
- New updates to locations. Working on 'previous' and 'next' buttons. Can "one shot" which will be a kill (in one click) and later be the main trigger from enemy deaths.

08-24-2024
- In midst of integrating game progression to be saved to local storage, which requires a much different design around a tracking array (in this case, 'saveData').
- Temporarily moved some functions and variables being worked on to main.js for simplicity.
- Need game save & load functionality once game is more advanced. For testing purposes, manipulating array manually right now will suffice. This feature is easy to integrate when ready.
- Locations finally work, with integration with kill counts coming soon (currently, will set up where user must kill 3 at one level to move on to next level). These values can be easily adjusted later as necessary.
- Testing buttons will be available while in development for testing purposes.

08-09-2024
- Created basic inventory environment.

08-08-2024
- Initial setup on Github Pages.
